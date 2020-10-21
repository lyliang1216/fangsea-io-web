<template>
    <a-layout id="components-layout-mobile-top"
              class="layout"
              :class="drawer">
        <fs-head
                :SelectedKey="key"
                :SelectedType="type"
                :centerKey="centerKey"
                @openDrawer="openDrawer"
                @closeDrawer="closeDrawer"/>
        <section class="container">
            <a-locale-provider :locale="localeLange">
                <a-layout-content>
                    <a-form
                            :form="form"
                            class="add-form"
                            layout="vertical">
                        <!-- 投资人UID -->
                        <a-form-item class="investor-uid" :label="$t('PositionPlan.positionPlan_search_uid')"
                                     :colon="false">
                            <a-input v-model="filter.userCode" type="number"
                                     :placeholder="$t('PositionPlan.positionPlan_search_placeholder_uid')"/>
                        </a-form-item>
                        <!-- 注册时间 -->
                        <a-form-item class="register-time" :label="$t('PositionPlan.positionPlan_search_registertime')"
                                     :colon="false">
                            <a-date-picker
                                    class="register-time-pic-start"
                                    :disabledDate="disabledStartDate1"
                                    format="YYYY-MM-DD"
                                    v-decorator="[
                                        'registerTimeStart',
                                        {initialValue: registerTimeStart}]"
                                    :placeholder="$t('PositionPlan.positionPlan_datepicker_start_placeholder')"
                                    @openChange="handleStartOpenChange1"
                                    @change="registerTimeStartChange"/>
                            <a-date-picker
                                    class="register-time-pic-end"
                                    :disabledDate="disabledEndDate1"
                                    format="YYYY-MM-DD"
                                    v-decorator="[
                                        'registerTimeEnd',
                                        {initialValue: registerTimeEnd}]"
                                    :placeholder="$t('PositionPlan.positionPlan_datepicker_end_placeholder')"
                                    :open="register_endOpen"
                                    @openChange="handleEndOpenChange1"
                                    @change="registerTimeEndChange"/>
                        </a-form-item>
                        <!-- 订单时间 -->
                        <a-form-item class="order-time" :label="$t('PositionPlan.positionPlan_search_ordertime')"
                                     :colon="false">
                            <a-date-picker
                                    class="register-time-pic-start"
                                    :disabledDate="disabledStartDate2"
                                    format="YYYY-MM-DD"
                                    v-decorator="[
                                        'orderTimeStart',
                                        {initialValue: orderTimeStart}]"
                                    :placeholder="$t('PositionPlan.positionPlan_datepicker_start_placeholder')"
                                    @openChange="handleStartOpenChange2"
                                    @change="orderTimeStartChange"/>
                            <a-date-picker
                                    class="register-time-pic-end"
                                    :disabledDate="disabledEndDate2"
                                    format="YYYY-MM-DD"
                                    v-decorator="[
                                        'orderTimeEnd',
                                        {initialValue: orderTimeEnd}]"
                                    :placeholder="$t('PositionPlan.positionPlan_datepicker_end_placeholder')"
                                    :open="order_endOpen"
                                    @openChange="handleEndOpenChange2"
                                    @change="orderTimeEndChange"/>
                        </a-form-item>
                        <!-- 查询 -->
                        <a-form-item class="search-box">
                            <a-button class="search-btn" @click="resetfilter">
                                {{$t('PositionPlan.positionPlan_reset_btn')}}
                            </a-button>
                            <a-button type="primary" class="search-btn" @click="searchtable">
                                {{$t('PositionPlan.positionPlan_search_btn')}}
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-layout-content>
            </a-locale-provider>
        </section>
    </a-layout>
</template>

<script>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW'
    import enUS from 'ant-design-vue/lib/locale-provider/en_US'
    import FsHead from '~/components/mobile/FangseaHeader'
    import validate from '~/assets/utils/validate'
    import {parseTime} from '~/assets/utils/index'
    import {Bus} from '~/assets/utils/bus'
    import Cookie from 'js-cookie'
    import moment from 'moment'

    export default {
        data () {
            return {
                // 组件国际化
                localeLange: zhTW,
                // 首页高亮下标
                key: '0',
                // 登录、注册导航下标
                type: 0,
                // 用户中心导航下标
                centerKey: 9,
                // 抽屉动画
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 筛选条件
                filter: {
                    userCode: '',
                    registerTimeStart: null,
                    registerTimeEnd: null,
                    orderTimeStart: null,
                    orderTimeEnd: null
                },
                // 默认注册开始时间
                registerTimeStart: null,
                // 默认注册结束时间
                registerTimeEnd: null,
                // 默认订单开始时间
                orderTimeStart: null,
                // 默认订单结束时间
                orderTimeEnd: null,
                // 注册时间弹框隐藏
                register_endOpen: false,
                // 订单时间弹框隐藏
                order_endOpen: false,
                // 时间格式
                dateFormat: 'YYYY-MM-DD'
            }
        },
        /**
         * 初始化form
         */
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        created () {
            if (process.client) {
                this.listenI18n()
                this.initData()
            }
        },
        methods: {
            /**
             * 初始化数据
             */
            initData () {
                switch (Cookie.get('language')) {
                case 'zh_CN':
                    this.localeLange = zhCN
                    break
                case 'zh_TW':
                    this.localeLange = zhTW
                    break
                case 'en_US':
                    this.localeLange = enUS
                    break
                default:
                    this.localeLange = zhTW
                    break
                }
                if (this.$route.query) {
                    if (this.$route.query.userCode) {
                        this.filter.userCode = this.$route.query.userCode
                    }
                    if (this.$route.query.registerTimeStart) {
                        this.registerTimeStart = moment(parseTime(this.$route.query.registerTimeStart, '{y}-{m}-{d}'), 'YYYY-MM-DD')
                        this.filter.registerTimeStart = parseTime(this.$route.query.registerTimeStart)
                    }
                    if (this.$route.query.registerTimeEnd) {
                        this.registerTimeEnd = moment(parseTime(this.$route.query.registerTimeEnd, '{y}-{m}-{d}'), 'YYYY-MM-DD')
                        this.filter.registerTimeEnd = parseTime(this.$route.query.registerTimeEnd)
                    }
                    if (this.$route.query.orderTimeStart) {
                        this.orderTimeStart = moment(parseTime(this.$route.query.orderTimeStart, '{y}-{m}-{d}'), 'YYYY-MM-DD')
                        this.filter.orderTimeStart = parseTime(this.$route.query.orderTimeStart)
                    }
                    if (this.$route.query.orderTimeEnd) {
                        this.orderTimeEnd = moment(parseTime(this.$route.query.orderTimeEnd, '{y}-{m}-{d}'), 'YYYY-MM-DD')
                        this.filter.orderTimeEnd = parseTime(this.$route.query.orderTimeEnd)
                    }
                }
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    switch (Cookie.get('language')) {
                    case 'zh_CN':
                        this.localeLange = zhCN
                        break
                    case 'zh_TW':
                        this.localeLange = zhTW
                        break
                    case 'en_US':
                        this.localeLange = enUS
                        break
                    }
                })
            },
            /**
             *  设置筛选默认值，注册时间最近三个月
             */
            setdefault () {
                let myDate = Date.parse(new Date()) / 1000
                let today = parseTime(myDate, '{y}-{m}-{d}')
                let lastthreemonth = parseTime(myDate - 3 * 30 * 24 * 60 * 60, '{y}-{m}-{d}')
                this.filter.registerTimeStart = moment(lastthreemonth, this.dateFormat)
                this.filter.registerTimeEnd = moment(today, this.dateFormat)
            },
            /**
             *  重置筛选
             */
            resetfilter () {
                this.filter = {
                    userCode: '',
                    registerTimeStart: null,
                    registerTimeEnd: null,
                    orderTimeStart: null,
                    orderTimeEnd: null
                }
                this.registerTimeStart = null
                this.registerTimeEnd = null
                this.orderTimeStart = null
                this.orderTimeEnd = null
            },
            /**
             *  提交筛选条件
             */
            searchtable () {
                let filter = JSON.parse(JSON.stringify(this.filter))
                if (validate.required(this.filter.registerTimeStart)) {
                    filter.registerTimeStart = parseInt(Date.parse(new Date(this.filter.registerTimeStart)) / 1000)
                }
                if (validate.required(this.filter.registerTimeEnd)) {
                    filter.registerTimeEnd = parseInt(Date.parse(new Date(this.filter.registerTimeEnd)) / 1000)
                }
                if (validate.required(this.filter.orderTimeStart)) {
                    filter.orderTimeStart = parseInt(Date.parse(new Date(this.filter.orderTimeStart)) / 1000)
                }
                if (validate.required(this.filter.orderTimeEnd)) {
                    filter.orderTimeEnd = parseInt(Date.parse(new Date(this.filter.orderTimeEnd)) / 1000)
                }
                this.$router.push({path: '/mobile/user/UserCenter/PositionPlan/RecommendList', query: filter})
            },
            // 注册开始时间禁用范围
            disabledStartDate1 (startValue) {
                const endValue = this.filter.registerTimeEnd
                if (!startValue || !endValue) {
                    return false
                }
                return startValue.valueOf() > endValue.valueOf()
            },
            // 注册结束时间禁用范围
            disabledEndDate1 (endValue) {
                const startValue = this.filter.registerTimeStart
                if (!endValue || !startValue) {
                    return false
                }
                return startValue.valueOf() >= endValue.valueOf()
            },
            // 订单开始时间禁用范围
            disabledStartDate2 (startValue) {
                const endValue = this.filter.orderTimeEnd
                if (!startValue || !endValue) {
                    return false
                }
                return startValue.valueOf() > endValue.valueOf()
            },
            // 订单结束时间禁用范围
            disabledEndDate2 (endValue) {
                const startValue = this.filter.orderTimeStart
                if (!endValue || !startValue) {
                    return false
                }
                return startValue.valueOf() >= endValue.valueOf()
            },
            // 开始结束弹出框联动,注册时间
            handleStartOpenChange1 (open) {
                if (!open) {
                    this.register_endOpen = true
                }
            },
            // 开始结束弹出框联动,注册时间
            handleEndOpenChange1 (open) {
                this.register_endOpen = open
            },
            // 开始结束弹出框联动,订单时间
            handleStartOpenChange2 (open) {
                if (!open) {
                    this.order_endOpen = true
                }
            },
            // 开始结束弹出框联动,订单时间
            handleEndOpenChange2 (open) {
                this.order_endOpen = open
            },
            /**
             *  选择注册开始时间
             *  @param date 日期
             *  @param dateString 完整日期
             */
            registerTimeStartChange (date, dateString) {
                this.filter.registerTimeStart = dateString + ' 00:00:00'
            },
            /**
             *  选择注册结束时间
             *  @param date 日期
             *  @param dateString 完整日期
             */
            registerTimeEndChange (date, dateString) {
                this.filter.registerTimeEnd = dateString + ' 23:59:59'
            },
            /**
             *  选择订单开始时间
             *  @param date 日期
             *  @param dateString 完整日期
             */
            orderTimeStartChange (date, dateString) {
                this.filter.orderTimeStart = dateString + ' 00:00:00'
            },
            /**
             *  选择订单结束时间
             *  @param date 日期
             *  @param dateString 完整日期
             */
            orderTimeEndChange (date, dateString) {
                this.filter.orderTimeEnd = dateString + ' 23:59:59'
            },
            /**
             * 开启右侧抽屉导航
             */
            openDrawer () {
                this.drawer = {'drawer-containel-left': true, 'drawer-containel-right': false}
            },
            /**
             * 关闭右侧抽屉导航
             */
            closeDrawer () {
                this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': true}
                let _this = this
                setTimeout(function () {
                    _this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': false}
                }, 200)
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        components: {
            FsHead
        },
        head () {
            return {
                title: this.$t('PageTitle.position_plan')
            }
        }
    }
</script>

<style lang="less" scoped>
    .container {
        background: #fff;
        padding: 0.3rem 0.16rem 0;
        .investor-uid {
            input {
                padding-left: 0.16rem;
                color: #333;
            }
        }
        /deep/ .ant-input {
            height: 0.4rem !important;
            width: 100%;
        }
        .register-time {
            /deep/ .register-time-pic-start {
                float: left;
                width: 46.46% !important;
                color: #333;
            }
            /deep/ .register-time-pic-end {
                float: right;
                width: 46.46% !important;
                color: #333;
            }
        }
        .order-time {
            /deep/ .register-time-pic-start {
                float: left;
                width: 46.46% !important;
                color: #333;
            }
            /deep/ .register-time-pic-end {
                float: right;
                width: 46.46% !important;
                color: #333;
            }
        }
        .search-box {
            padding-top: 0.08rem;
            /deep/ .ant-form-item-children {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .search-btn {
                    width: 46.64%;
                    height: 0.4rem;
                    font-size: 16px;
                    &:first-child {
                        color: #2EA9DF;
                        border-color: #2EA9DF;
                    }
                }
            }
        }
    }
</style>
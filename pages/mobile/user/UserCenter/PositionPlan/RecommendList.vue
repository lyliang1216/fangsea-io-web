<template>
    <a-spin :spinning="spinning">
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
                        <a-input-search
                                class="search-input-btn"
                                :placeholder="$t('PositionPlan.positionPlan_search_placeholder')"
                                v-model="filtertxt"
                                @search="tosearch"
                                @focus="tosearch"/>
                        <a-table id="recommendtable"
                                 :columns="columns"
                                 :rowKey="record => record.id"
                                 :scroll="{x: 1000}"
                                 :dataSource="listdata"
                                 :pagination="pagination"
                                 :loading="loading"
                                 @change="handleTableChange">
                            <!-- 多级推荐 -->
                            <template slot="recommendList" slot-scope="recommendList">
                                <a-popover trigger="hover" placement="top">
                                    <template slot="content">
                                        <div v-html="getRecommendList(recommendList)"></div>
                                    </template>
                                    <p style="cursor: pointer;margin: 0;"><span style="text-decoration: underline">{{recommendList.length - 1}}</span></p>
                                </a-popover>
                            </template>
                            <!-- 账号 -->
                            <template slot="account" slot-scope="text, record">{{record | addArea}}
                            </template>
                            <!-- 注册时间 -->
                            <template slot="registerTime" slot-scope="registerTime">{{registerTime | parseTime | today}}
                            </template>
                            <!-- 支付币种 -->
                            <template slot="curCode" slot-scope="curCode">{{curCode | tonull}}
                            </template>
                            <!-- 认购订单 -->
                            <template slot="count" slot-scope="count">{{count | tonull}}
                            </template>
                            <!-- 认购订单支付 -->
                            <template slot="sumCurAmount" slot-scope="sumCurAmount">{{sumCurAmount | tonull}}
                            </template>
                            <!-- 已发行订单 -->
                            <template slot="completeCount" slot-scope="completeCount">{{completeCount | tonull}}
                            </template>
                            <!-- 已发行订单支付 -->
                            <template slot="completeCurAmount" slot-scope="completeCurAmount">{{completeCurAmount | tonull}}
                            </template>
                        </a-table>
                    </a-layout-content>
                </a-locale-provider>
            </section>
        </a-layout>
    </a-spin>
</template>

<script>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW'
    import enUS from 'ant-design-vue/lib/locale-provider/en_US'
    import FsHead from '~/components/mobile/FangseaHeader'
    import validate from '~/assets/utils/validate'
    import {parseTime} from '~/assets/utils/index'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'
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
                // 排序条件
                orderBy: '',
                // 筛选条件
                filter: {
                    userCode: '',
                    registerTimeStart: '',
                    registerTimeEnd: '',
                    orderTimeStart: '',
                    orderTimeEnd: ''
                },
                // 筛选条件内容信息
                filtertxt: '',
                // 表头
                columns: [],
                // 表格数据
                listdata: [],
                // 加载中
                loading: false,
                // 分页组件
                pagination: {
                    onChange: (currentPage) => {
                        this.current = currentPage
                    },
                    pageSize: 10,
                    total: 0
                },
                // 当前页
                current: 1,
                // 等待效果
                spinning: false
            }
        },
        created () {
            if (process.client) {
                this.listenI18n()
                this.initLang()
                this.searchtable()
                this.settablehead()
                this.getlist()
            }
        },
        mounted () {
            setTimeout(() => {
                Bus.$emit('publicEvent', 'POSITIONPLAN')
            }, 300)
        },
        methods: {
            /**
             * 初始化国际化
             */
            initLang () {
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
                    this.settablehead()
                    this.getlist()
                })
            },
            /**
             * 设置表头
             */
            settablehead () {
                this.columns = [
                    {
                        title: this.$t('PositionPlan.positionPlan_table_title_uid'),
                        dataIndex: 'userCode',
                        sorter: true,
                        key: 'userCode',
                        align: 'center'
                    }, {
                        title: this.$t('PositionPlan.positionPlan_table_title_level'),
                        dataIndex: 'recommendList',
                        key: 'recommendList',
                        scopedSlots: {customRender: 'recommendList'},
                        align: 'center',
                        width: 130
                    }, {
                        title: this.$t('PositionPlan.positionPlan_table_title_account'),
                        dataIndex: 'account',
                        key: 'account',
                        scopedSlots: {customRender: 'account'},
                        align: 'center'
                    }, {
                        title: this.$t('PositionPlan.positionPlan_table_title_registertime'),
                        dataIndex: 'registerTime',
                        sorter: true,
                        key: 'registerTime',
                        scopedSlots: {customRender: 'registerTime'},
                        align: 'center'
                    }, {
                        title: this.$t('PositionPlan.positionPlan_table_title_curCode'),
                        dataIndex: 'curCode',
                        key: 'curCode',
                        scopedSlots: {customRender: 'curCode'},
                        align: 'center'
                    }, {
                        title: this.$t('PositionPlan.positionPlan_table_title_count'),
                        dataIndex: 'count',
                        sorter: true,
                        key: 'count',
                        scopedSlots: {customRender: 'count'},
                        align: 'right'
                    }, {
                        title: this.$t('PositionPlan.positionPlan_table_title_sumCurAmount'),
                        dataIndex: 'sumCurAmount',
                        sorter: true,
                        key: 'sumCurAmount',
                        scopedSlots: {customRender: 'sumCurAmount'},
                        align: 'right'
                    }, {
                        title: this.$t('PositionPlan.positionPlan_table_title_completeCount'),
                        dataIndex: 'completeCount',
                        sorter: true,
                        key: 'completeCount',
                        scopedSlots: {customRender: 'completeCount'},
                        align: 'right'
                    }, {
                        title: this.$t('PositionPlan.positionPlan_table_title_completeCurAmount'),
                        dataIndex: 'completeCurAmount',
                        sorter: true,
                        key: 'completeCurAmount',
                        scopedSlots: {customRender: 'completeCurAmount'},
                        align: 'right'
                    }
                ]
            },
            /**
             *  查询列表
             */
            getlist () {
                let params = {
                    traceId: tool.UUID(),
                    data: {
                        pageNum: this.current,
                        pageSize: 10,
                        orderBy: this.orderBy,
                        filter: this.filter
                    }
                }
                this.spinning = true
                axios.post('/dc/user/recommend/id/list', params)
                    .then(res => {
                        this.spinning = false
                        if (res.data.code.toString() === '0') {
                            let list = res.data.data.list
                            list.forEach((item, index) => {
                                item.id = index
                            })
                            this.listdata = list
                            this.pagination.total = res.data.data.total
                        }
                    })
                    .catch(err => {
                        this.spinning = false
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             *  表格排序修改
             *  @param pagination 分页
             *  @param filters 筛选
             *  @param sorter 排序
             */
            handleTableChange (pagination, filters, sorter) {
                let key = sorter.columnKey
                let type = sorter.order
                if (type === 'ascend') {
                    this.orderBy = key + ' asc'
                } else if (type === 'descend') {
                    this.orderBy = key + ' desc'
                } else {
                    this.orderBy = ''
                }
                this.getlist()
            },
            /**
             *  筛选查询
             */
            searchtable () {
                if (this.$route.query) {
                    this.filter = JSON.parse(JSON.stringify(this.$route.query))
                    this.filtertxt = ''
                    if (validate.required(this.filter.userCode)) {
                        this.filtertxt += this.filter.userCode + ';'
                    }
                    if (!isNaN(this.filter.registerTimeStart) && validate.required(this.filter.registerTimeStart)) {
                        if (!isNaN(this.filter.registerTimeEnd) && validate.required(this.filter.registerTimeEnd)) {
                            this.filtertxt += parseTime(parseInt(this.filter.registerTimeStart), '{y}-{m}-{d}')
                        } else {
                            this.filtertxt += parseTime(parseInt(this.filter.registerTimeStart), '{y}-{m}-{d}') + ';'
                        }
                    }
                    if (!isNaN(this.filter.registerTimeEnd) && validate.required(this.filter.registerTimeEnd)) {
                        if (!isNaN(this.filter.registerTimeStart) && validate.required(this.filter.registerTimeStart)) {
                            this.filtertxt += '/' + parseTime(parseInt(this.filter.registerTimeEnd), '{y}-{m}-{d}') + ';'
                        } else {
                            this.filtertxt += parseTime(parseInt(this.filter.registerTimeEnd), '{y}-{m}-{d}') + ';'
                        }
                    }
                    if (!isNaN(this.filter.orderTimeStart) && validate.required(this.filter.orderTimeStart)) {
                        if (!isNaN(this.filter.orderTimeEnd) && validate.required(this.filter.orderTimeEnd)) {
                            this.filtertxt += parseTime(parseInt(this.filter.orderTimeStart), '{y}-{m}-{d}')
                        } else {
                            this.filtertxt += parseTime(parseInt(this.filter.orderTimeStart), '{y}-{m}-{d}') + ';'
                        }
                    }
                    if (!isNaN(this.filter.orderTimeEnd) && validate.required(this.filter.orderTimeEnd)) {
                        if (!isNaN(this.filter.orderTimeStart) && validate.required(this.filter.orderTimeStart)) {
                            this.filtertxt += '/' + parseTime(parseInt(this.filter.orderTimeEnd), '{y}-{m}-{d}') + ';'
                        } else {
                            this.filtertxt += parseTime(parseInt(this.filter.orderTimeEnd), '{y}-{m}-{d}') + ';'
                        }
                    }
                    this.filtertxt = this.filtertxt.substring(0, this.filtertxt.length - 1)
                    if (this.filtertxt.length > 30) {
                        this.filtertxt = this.filtertxt.substring(0, 30) + '...'
                    }
                }
            },
            /**
             *  禁选未来时间
             */
            disabledDate (current) {
                return current && current > moment().endOf('day')
            },
            /**
             *  去往搜索页面
             */
            tosearch () {
                this.$router.push({path: '/mobile/user/UserCenter/PositionPlan/SearchList', query: this.filter})
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
            },
            /**
             * 多级推荐人显示层级
             * @param arr 层级数组
             * @return {string}
             */
            getRecommendList (arr) {
                let html = ''
                for (let i in arr) {
                    if (Number(i) === arr.length - 1) {
                        html += `<span style="color: #8e8e8e;">${arr[i]}</span>`
                    } else {
                        html += `<span>${arr[i]}&rarr;</span>`
                    }
                }
                return html
            }
        },
        filters: {
            parseTime,
            today (value) {
                let myDate = Date.parse(new Date()) / 1000
                let today = parseTime(myDate, '{y}-{m}-{d}')
                if (value.indexOf(today) !== -1) {
                    return value.substring(11, 16)
                } else {
                    return value.substring(0, 10)
                }
            },
            tonull (value) {
                if (value === null) {
                    return '-'
                } else {
                    return value
                }
            },
            addArea (value) {
                if (value.areaCode === '') {
                    return value.account
                } else {
                    return '+' + value.areaCode + ' ' + value.account
                }
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
        /deep/ .ant-input {
            height: 0.4rem !important;
            padding-left: 0.16rem;
            padding-right: 0.16rem;
            color: #333;
        }
        /deep/ .ant-input-search-icon {
            color: #bfbfbf;
        }
        .ant-table-wrapper {
            margin-top: 0.2rem;
            /deep/ .ant-table-thead th {
                background: #fafafa;
                font-weight: 500;
                border-bottom-color: transparent;
                color: #999;
                font-size: 12px;
                line-height: 0.17rem;
                padding: 0.07rem 0.14rem 0.06rem 0 !important;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                &.ant-table-column-sort {
                    color: #2EA9DF;
                }
                .ant-table-column-sorters:nth-last-child(1) {
                    padding-right: 0.08rem;
                }
                .ant-table-column-sorters:nth-last-child(2) {
                    padding-right: 0.08rem;
                }
                .ant-table-column-sorters:nth-last-child(3) {
                    padding-right: 0.08rem;
                }
                .ant-table-column-sorters:nth-last-child(4) {
                    padding-right: 0.08rem;
                }
            }
            /deep/ .ant-table-tbody {
                tr {
                    td {
                        padding: 0.11rem 0 0.12rem 0;
                        border-bottom-color: #eee;
                        font-size: 12px;
                        line-height: 0.17rem;
                        word-break: break-all;
                        &:nth-last-child(1) {
                            padding-right: 0.12rem;
                        }
                        &:nth-last-child(2) {
                            padding-right: 0.12rem;
                        }
                        &:nth-last-child(3) {
                            padding-right: 0.12rem;
                        }
                        &:nth-last-child(4) {
                            padding-right: 0.12rem;
                        }
                    }
                    &:hover:not(.ant-table-expanded-row) > td{
                        background-color: #fff!important;
                    }
                }
            }
        }
        /deep/ .ant-table-pagination {
            margin-top: 0.36rem;
            float: none;
            text-align: center;
        }
        /deep/ .search-input-btn {
            input {
                color: #999;
            }
        }
    }
</style>
<template>
    <section class="container">
        <a-locale-provider :locale="localeLange">
            <a-layout-content>
                <a-form
                        class="add-form"
                        layout="vertical"
                        :form="filter">
                    <a-input-group class="inputbox">
                        <!-- 投资人UID -->
                        <a-form-item class="investor-uid" :label="$t('PositionPlan.positionPlan_search_uid')"
                                     :colon="false">
                            <a-input v-model="filter.userCode" oninput="value=value.replace(/[^\d]/g,'')"
                                     :placeholder="$t('PositionPlan.positionPlan_search_placeholder_uid')"/>
                        </a-form-item>
                        <!-- 注册时间 -->
                        <a-form-item class="register-time" :label="$t('PositionPlan.positionPlan_search_registertime')"
                                     :colon="false">
                            <a-range-picker
                                    class="register-time-pic"
                                    @change="SearchRegisterTime"/>
                        </a-form-item>
                        <!-- 订单时间 -->
                        <a-form-item class="order-time" :label="$t('PositionPlan.positionPlan_search_ordertime')"
                                     :colon="false">
                            <a-range-picker
                                    class="order-time-pic"
                                    @change="SearchOrderTime"/>
                        </a-form-item>
                        <!-- 查询 -->
                        <a-form-item class="search-box">
                            <a-button type="primary" @click="subsearch" class="search-btn" :loading="loading">
                                {{$t('PositionPlan.positionPlan_search_btn')}}
                            </a-button>
                        </a-form-item>
                    </a-input-group>
                </a-form>
                <a-table id="recommendtable"
                         v-if="pagination.total > 0"
                         :columns="columns"
                         :rowKey="record => record.id"
                         :dataSource="listdata"
                         :scroll="{x: 1200}"
                         :pagination="pagination"
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
                <p v-else class="noData-table">{{$t('NoData.NoData_table')}}</p>
            </a-layout-content>
        </a-locale-provider>
    </section>
</template>

<script>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW'
    import enUS from 'ant-design-vue/lib/locale-provider/en_US'
    import {parseTime} from '~/assets/utils/index'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'

    export default {
        data () {
            return {
                // 组件国际化
                localeLange: zhTW,
                // 排序条件
                orderBy: '',
                //  筛选条件（选择出来的）
                filter: {
                    userCode: '',
                    registerTimeStart: '',
                    registerTimeEnd: '',
                    orderTimeStart: '',
                    orderTimeEnd: ''
                },
                //  筛选条件（查询使用）
                filter_t: {
                    userCode: '',
                    registerTimeStart: '',
                    registerTimeEnd: '',
                    orderTimeStart: '',
                    orderTimeEnd: ''
                },
                //  表头
                columns: [],
                //  表格数据
                listdata: [],
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
                // 加载loading
                loading: false
            }
        },
        created () {
            if (process.client) {
                this.listenI18n()
                this.initLang()
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
                        align: 'center',
                        width: 130
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
                        align: 'center',
                        width: 130
                    }, {
                        title: this.$t('PositionPlan.positionPlan_table_title_curCode'),
                        dataIndex: 'curCode',
                        key: 'curCode',
                        scopedSlots: {customRender: 'curCode'},
                        align: 'center',
                        width: 110
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
                        filter: {
                            userCode: this.filter.userCode,
                            registerTimeStart: this.filter_t.registerTimeStart,
                            registerTimeEnd: this.filter_t.registerTimeEnd,
                            orderTimeStart: this.filter_t.orderTimeStart,
                            orderTimeEnd: this.filter_t.orderTimeEnd
                        }
                    }
                }
                this.loading = true
                axios.post('/dc/user/recommend/id/list', params)
                    .then(res => {
                        this.loading = false
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
                        this.loading = false
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             *  提交搜索条件
             */
            subsearch () {
                this.filter_t = this.filter
                this.getlist()
            },
            /**
             *  注册时间选择
             * @param date 日期
             * @param dateString 日期字符串数组
             */
            SearchRegisterTime (date, dateString) {
                this.filter.registerTimeStart = Date.parse(new Date(dateString[0] + ' 00:00:00')) / 1000
                this.filter.registerTimeEnd = Date.parse(new Date(dateString[1] + ' 23:59:59')) / 1000
            },
            /**
             *  订单时间选择
             * @param date 日期
             * @param dateString 日期字符串数组
             */
            SearchOrderTime (date, dateString) {
                this.filter.orderTimeStart = Date.parse(new Date(dateString[0] + ' 00:00:00')) / 1000
                this.filter.orderTimeEnd = Date.parse(new Date(dateString[1] + ' 23:59:59')) / 1000
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
                if (value === null || value === undefined) {
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
        }
    }
</script>

<style lang="less" scoped>
    .container {
        background: #fff;
        padding: 32px 32px 0;
        margin-bottom: 26px;
        min-height: 705px;
        .inputbox {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 9px;
            .investor-uid {
                width: 160px;
                input {
                    padding-left: 16px;
                    color: #333;
                }
            }
            /deep/ .ant-input {
                height: 40px !important;
            }
            .register-time {
                width: 280px;
                .register-time-pic {
                    color: #333;
                }
            }
            .order-time {
                width: 280px;
                .order-time-pic {
                    color: #333;
                }
            }
            /deep/ .ant-form-item-control-wrapper {
                height: 40px;
            }
            /deep/ .ant-calendar-picker-clear {
                color: #2EA9DF;
                &:hover {
                    color: #2EA9DF;
                }
            }
            /deep/ .search-box {
                /deep/ .ant-form-item-control-wrapper {
                    height: 32px;
                }
                .search-btn {
                    width: 80px;
                }
            }
            /deep/ .ant-calendar-range-picker-separator {
                line-height: 32px;
            }
        }
        .ant-table-wrapper {
            /deep/ .ant-table-thead th {
                background: #fafafa;
                font-weight: 600;
                border-bottom-color: #ececec;
                color: #333;
                font-size: 14px;
                line-height: 20px;
                padding-top: 15px;
                padding-bottom: 15px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                &.ant-table-column-sort {
                    color: #2EA9DF;
                }
            }
            /deep/ .ant-table-tbody {
                tr {
                    padding: 0 16px;
                    td {
                        border-bottom-color: #ececec;
                        font-size: 14px;
                        line-height: 20px;
                        padding-top: 15px;
                        padding-bottom: 15px;
                        word-break: break-all;
                    }
                }
            }
        }
        .noData-table {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.45);
            text-align: center;
        }
    }
</style>

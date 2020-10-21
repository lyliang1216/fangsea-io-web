<template>
    <a-spin :spinning="spinning">
            <section class="container">
            <a-layout-content>
                <div class="flex-column">
                    <div class="transation-record-item item-basic">
                        <div class="transation-record-head">
                            <span>{{$t('TransactionRecord.transaction_title_headline')}}</span>
                        </div>
                        <div class="transation-record-body">
                            <a-tabs
                                    @tabClick="tabChange"
                                    :defaultActiveKey="initCheckPan">
                                <!-- 充值记录 -->
                                <a-tab-pane key="1" forceRender>
                                    <template slot="tab">
                                        <a-badge :dot="hasUpdated('RECHARGERECORD')" :offset="[3, 0]">
                                            {{$t('TransactionRecord.transaction_tab_deposit')}}
                                        </a-badge>
                                    </template>
                                    <a-table :columns="columns"
                                             :dataSource="data"
                                             :pagination="pagination"
                                             :locale="{emptyText: $t('NoData.NoData_table')}">
                                        <template slot="createTime" slot-scope="createTime">
                                            <span>
                                                {{createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
                                            </span>
                                        </template>
                                        <template slot="amount" slot-scope="amount">
                                            <span :class="amount.substr(0,1) === '+' ? 'computedColorGreen' : 'computedColorRed'">
                                                {{amount}}
                                            </span>
                                        </template>
                                        <template slot="myBizType" slot-scope="myBizType">
                                            <span>
                                                {{myBizType}}
                                            </span>
                                        </template>
                                        <template slot="state" slot-scope="state">
                                            <span>
                                                {{state}}
                                            </span>
                                        </template>
                                        <!-- 详情 -->
                                        <template slot="expandedRowRender" slot-scope="record">
                                            <p>
                                                <span class="span-title">{{$t('TransactionRecord.transaction_title_txid')}}</span>
                                                <span>{{record.transChainHash}}</span>
                                            </p>
                                            <a-divider/>
                                            <p>
                                                <span class="span-title">{{$t('TransactionRecord.transaction_deposit_title_address')}}</span>
                                                <span>{{record.fromAddr}}</span>
                                            </p>
                                            <a-divider/>
                                            <p>
                                                <span class="span-title">{{$t('TransactionRecord.transaction_deposit_title_time')}}</span>
                                                <span>{{record.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                                            </p>
                                            <a-divider/>
                                        </template>
                                    </a-table>
                                </a-tab-pane>
                                <!-- 提现记录 -->
                                <a-tab-pane key="2">
                                    <template slot="tab">
                                        <a-badge :dot="hasUpdated('WITHDRAWALSRECORD')" :offset="[3, 0]">
                                            {{$t('TransactionRecord.transaction_tab_withdraw')}}
                                        </a-badge>
                                    </template>
                                    <a-table :columns="columns"
                                             :dataSource="txData"
                                             :pagination="selectPagination"
                                             :locale="{emptyText: $t('NoData.NoData_table')}">
                                        <template slot="createTime" slot-scope="createTime">
                                            <span>
                                                {{createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
                                            </span>
                                        </template>
                                        <template slot="amount" slot-scope="amount">
                                            <span :class="amount.substr(0,1) === '+' ? 'computedColorGreen' : 'computedColorRed'">
                                                {{amount}}
                                            </span>
                                        </template>
                                        <template slot="myBizType" slot-scope="myBizType">
                                            <span>
                                                {{myBizType}}
                                            </span>
                                        </template>
                                        <template slot="state" slot-scope="state">
                                            <span>
                                                {{state}}
                                            </span>
                                        </template>
                                        <!-- 详情 -->
                                        <template slot="expandedRowRender" slot-scope="record">
                                            <p>
                                                <span class="span-title">{{$t('TransactionRecord.transaction_title_txid')}}</span>
                                                <span>{{record.transChainHash}}</span>
                                            </p>
                                            <a-divider/>
                                            <p>
                                                <span class="span-title">{{$t('TransactionRecord.transaction_withdraw_title_address')}}</span>
                                                <span>{{record.toAddr}}</span>
                                            </p>
                                            <a-divider/>
                                            <p>
                                                <span class="span-title">{{$t('TransactionRecord.transaction_withdraw_title_fee')}}</span>
                                                <span>{{record.fee}} {{record.feeCurrency}}</span>
                                            </p>
                                            <a-divider/>
                                            <p>
                                                <span class="span-title">{{$t('TransactionRecord.transaction_withdraw_title_date')}}</span>
                                                <span>{{record.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                                            </p>
                                            <a-divider/>
                                        </template>
                                    </a-table>
                                </a-tab-pane>
                                <!-- 购房记录 -->
                                <a-tab-pane key="3">
                                    <template slot="tab">
                                        <a-badge :dot="hasUpdated('PURCHASERECORD')" :offset="[3, 0]">
                                            {{$t('TransactionRecord.transaction_tab_purchase')}}
                                        </a-badge>
                                    </template>
                                    <a-table :columns="columns"
                                             :dataSource="data"
                                             :pagination="pagination"
                                             :locale="{emptyText: $t('NoData.NoData_table')}">
                                        <template slot="createTime" slot-scope="createTime">
                                            <span>
                                                {{createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
                                            </span>
                                        </template>
                                        <template slot="amount" slot-scope="amount">
                                          <span :class="amount.substr(0,1) === '+' ? 'computedColorGreen' : 'computedColorRed'">
                                                {{amount}}
                                            </span>
                                        </template>
                                        <template slot="myBizType" slot-scope="myBizType">
                                            <span>
                                                {{myBizType}}
                                            </span>
                                        </template>
                                        <template slot="state" slot-scope="state">
                                            <span>
                                                {{state}}
                                            </span>
                                        </template>
                                    </a-table>
                                </a-tab-pane>
                                <!-- 通证购买记录 -->
                                <a-tab-pane key="4">
                                    <template slot="tab">
                                        <a-badge :dot="hasUpdated('PTPURCHASERECORD')" :offset="[3, 0]">
                                            {{$t('TransactionRecord.transaction_tab_pthistory')}}
                                        </a-badge>
                                    </template>
                                    <a-table :columns="ptColumns"
                                             :dataSource="ptData"
                                             :pagination="selectPtPagination"
                                             :locale="{emptyText: $t('NoData.NoData_table')}">
                                        <template slot="time" slot-scope="time">
                                            <span>
                                                {{time | parseTime('{y}-{m}-{d} {h}:{i}')}}
                                            </span>
                                        </template>
                                        <template slot="curAmount" slot-scope="curAmount">
                                            <span :class="curAmount.substr(0,1) === '+' ? 'computedColorGreen' : 'computedColorRed'">
                                                {{curAmount}}
                                            </span>
                                        </template>
                                        <template slot="myBizType" slot-scope="myBizType">
                                            <span>
                                                {{myBizType}}
                                            </span>
                                        </template>
                                        <template slot="state" slot-scope="state">
                                            <span>
                                                {{state}}
                                            </span>
                                        </template>
                                        <!-- 内表格 -->
                                        <template slot="expandedRowRender" slot-scope="record">
                                            <div v-if="record.bizType === 'PTO_PT_INVEST'">
                                                <p>
                                                    <span class="span-title">{{$t('TransactionRecord.transaction_title_pt')}}</span>
                                                    <span>{{record.ptCurCode}}</span>
                                                </p>
                                                <a-divider/>
                                                <p>
                                                    <span class="span-title">{{$t('TransactionRecord.transaction_title_amount')}}</span>
                                                    <span>{{record.ptTotalAmount}} </span>
                                                </p>
                                                <a-divider/>
                                            </div>
                                            <div v-else>
                                                <p class="no-details">
                                                    <span class="span-title">{{$t('TransactionRecord.transaction_no_details')}}</span>
                                                </p>
                                                <a-divider/>
                                            </div>
                                        </template>
                                    </a-table>
                                </a-tab-pane>
                                <!-- 划转记录 -->
                                <a-tab-pane key="5">
                                    <template slot="tab">
                                        <a-badge :dot="hasUpdated('TRANSFERRECORD')" :offset="[3, 0]">
                                            {{$t('TransactionRecord.transaction_tab_transfer')}}
                                        </a-badge>
                                    </template>
                                    <a-table :columns="columns"
                                             :dataSource="data"
                                             :pagination="pagination"
                                             :locale="{emptyText: $t('NoData.NoData_table')}">
                                        <template slot="createTime" slot-scope="createTime">
                                            <span>
                                                {{createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
                                            </span>
                                        </template>
                                        <template slot="amount" slot-scope="amount">
                                            <span :class="amount.substr(0,1) === '+' ? 'computedColorGreen' : 'computedColorRed'">
                                                {{amount}}
                                            </span>
                                        </template>
                                        <template slot="myBizType" slot-scope="myBizType">
                                            <span>
                                                {{myBizType}}
                                            </span>
                                        </template>
                                        <template slot="state" slot-scope="state">
                                            <span>
                                                {{state}}
                                            </span>
                                        </template>
                                    </a-table>
                                </a-tab-pane>
                            </a-tabs>
                        </div>
                    </div>
                </div>
            </a-layout-content>
        </section>
    </a-spin>
</template>

<script>
    import FsHead from '~/components/computer/FangseaHeader'
    import fonter from '~/components/computer/Footer'
    import {parseTime} from '~/assets/utils/index'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import axios from '~/plugins/axios'

    export default {
        props: ['initCheckPan'],
        data () {
            return {
                // 列头
                columns: [],
                // 通证列头
                ptColumns: [],
                // 列表数据
                data: [],
                // 提现列表数据
                txData: [],
                // 通证列表数据
                ptData: [],
                // 当前列表类型
                usageType: 0,
                // 等待效果
                spinning: false,
                // 分页组件
                pagination: {
                    onChange: (currentPage) => {
                        this.initList(currentPage, this.usageType)
                    },
                    current: 1,
                    pageSize: 10,
                    total: 0
                },
                // 提现分页组件
                selectPagination: {
                    onChange: (currentPage) => {
                        this.selectPages(currentPage)
                    },
                    current: 1,
                    pageSize: 10,
                    total: 0
                },
                // 通证分页组件
                selectPtPagination: {
                    onChange: (currentPage) => {
                        this.selectPtPages(currentPage)
                    },
                    current: 1,
                    pageSize: 10,
                    total: 0
                },
                // 倒计时对象
                timer: ''
            }
        },
        created () {
            if (process.client) {
                this.listenI18n()
                this.initList(1, 0)
                this.initColumns()
                this.hasInitCheckPan()
            }
        },
        mounted () {
            if (!this.initCheckPan) {
                setTimeout(() => {
                    Bus.$emit('publicEvent', 'RECHARGERECORD')
                }, 300)
            }
        },
        methods: {
            /**
             * 修改红点状态
             * @param name 菜单名
             */
            hasUpdated (name) {
                let arr = this.$store.state.hasUpdated
                for (let i in arr) {
                    if (arr[i].name === name) {
                        return arr[i].isShow
                    }
                }
                return false
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.initColumns()
                    this.initList(1, this.usageType)
                    this.selectPtPages(1)
                    this.selectPages(1)
                })
            },
            /**
             * 初始化表头
             */
            initColumns () {
                this.columns = [{
                    title: this.$t('TransactionRecord.transaction_table_tab_time'),
                    dataIndex: 'createTime',
                    key: 'createTime',
                    scopedSlots: {customRender: 'createTime'}
                }, {
                    title: this.$t('TransactionRecord.transaction_table_tab_currency'),
                    dataIndex: 'currency',
                    key: 'currency'
                }, {
                    title: this.$t('TransactionRecord.transaction_table_tab_amount'),
                    dataIndex: 'amount',
                    key: 'amount',
                    scopedSlots: {customRender: 'amount'}
                }, {
                    title: this.$t('TransactionRecord.transaction_table_tab_type'),
                    dataIndex: 'myBizType',
                    key: 'myBizType',
                    scopedSlots: {customRender: 'myBizType'}
                }, {
                    title: this.$t('TransactionRecord.transaction_table_tab_status'),
                    dataIndex: 'state',
                    key: 'state',
                    scopedSlots: {customRender: 'state'}
                }]
                this.ptColumns = [{
                    title: this.$t('TransactionRecord.transaction_table_tab_time'),
                    dataIndex: 'time',
                    key: 'time',
                    scopedSlots: {customRender: 'time'}
                }, {
                    title: this.$t('TransactionRecord.transaction_table_tab_currency'),
                    dataIndex: 'curCode',
                    key: 'curCode'
                }, {
                    title: this.$t('TransactionRecord.transaction_table_tab_amount'),
                    dataIndex: 'curAmount',
                    key: 'curAmount',
                    scopedSlots: {customRender: 'curAmount'}
                }, {
                    title: this.$t('TransactionRecord.transaction_table_tab_type'),
                    dataIndex: 'myBizType',
                    key: 'myBizType',
                    scopedSlots: {customRender: 'myBizType'}
                }, {
                    title: this.$t('TransactionRecord.transaction_table_tab_status'),
                    dataIndex: 'state',
                    key: 'state',
                    scopedSlots: {customRender: 'state'}
                }]
            },
            /**
             * tab 被点击时候的事件
             * @param tab 对应的tab 的key
             */
            tabChange (key) {
                this.spinning = true
                let name = ''
                switch (key) {
                case '1' :
                    this.initList(1, 0)
                    this.usageType = 0
                    name = 'RECHARGERECORD'
                    break
                case '2' :
                    this.selectPages(1)
                    this.usageType = 1
                    name = 'WITHDRAWALSRECORD'
                    break
                case '3' :
                    this.initList(1, 8)
                    this.usageType = 8
                    name = 'PURCHASERECORD'
                    break
                case '4' :
                    this.selectPtPages(1)
                    this.usageType = 9
                    name = 'PTPURCHASERECORD'
                    break
                case '5' :
                    this.initList(1, 3)
                    this.usageType = 3
                    name = 'TRANSFERRECORD'
                }
                setTimeout(() => {
                    Bus.$emit('publicEvent', name)
                }, 300)
            },
            /**
             * 查询提现记录
             * @param currentPage  当前页
             */
            selectPages (currentPage) {
                this.selectPagination.current = currentPage
                this.txData = []
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        pageNum: currentPage,
                        pageSize: 10
                    }
                }
                axios.post('/cms/wallet/user/withdraw/apply/query', data).then((res) => {
                    if (res.data.code.toString() === '0') {
                        this.selectPagination.total = res.data.data.total
                        this.txData = res.data.data.list.map((item, index) => {
                            item.key = index
                            item.myBizType = this.bizType(item.bizType)
                            item.state = this.stateFilter(item.state)
                            return item
                        })
                    } else {
                        this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                    }
                    this.spinning = false
                })
                    .catch(err => {
                        this.spinning = false
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             *  查询交易记录
             * @param currentPage  当前页
             * @param usageType 列表类型
             */
            initList (currentPage, usageType) {
                this.pagination.current = currentPage
                this.data = []
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        pageNum: currentPage,
                        pageSize: 10,
                        filter: {
                            usageType
                        }
                    }
                }
                axios.post('/wallet/user/transac/list/query', data).then((res) => {
                    if (res.data.code.toString() === '0') {
                        this.pagination.total = res.data.data.total
                        this.data = res.data.data.list.map((item, index) => {
                            item.key = index
                            item.myBizType = this.bizType(item.bizType)
                            item.state = this.state(item.state)
                            return item
                        })
                    } else {
                        this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                    }
                    this.spinning = false
                })
                    .catch(err => {
                        this.spinning = false
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 查询通证记录
             * @param currentPage  当前页
             */
            selectPtPages (currentPage) {
                this.selectPtPagination.current = currentPage
                this.ptData = []
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        pageNum: currentPage,
                        pageSize: 10
                    }
                }
                axios.post('/pto/trade/user/list', data).then((res) => {
                    if (res.data.code.toString() === '0') {
                        this.selectPtPagination.total = res.data.data.total
                        this.ptData = res.data.data.list.map((item, index) => {
                            item.key = index
                            item.myBizType = this.bizType(item.bizType)
                            item.state = this.state(item.state)
                            return item
                        })
                    } else {
                        this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                    }
                    this.spinning = false
                })
                    .catch(err => {
                        this.spinning = false
                        this.$message.error(this.$t(err.message))
                    })
            },
            // 过滤类型
            bizType (key) {
                let value = ''
                switch (key) {
                /**
                 * 注册奖励
                 */
                case 'CMS_REGISTER_AWARD' :
                    value = this.$t('TransactionRecord.transaction_type_registrationreward')
                    break
                    /**
                     * 交易奖励
                     */
                case 'CMS_TRANSACTION_AWARD' :
                    value = this.$t('TransactionRecord.transaction_type_transactionreward')
                    break
                    /**
                     * 充值奖励
                     */
                case 'CMS_CHARGE_AWARD' :
                    value = this.$t('TransactionRecord.transaction_type_rechargereward')
                    break
                    /**
                     * 锁仓奖励
                     */
                case 'CMS_LOCK_AWARD' :
                    value = this.$t('TransactionRecord.transaction_type_lockreward')
                    break
                    /**
                     * 邀请奖励
                     */
                case 'CMS_INVITATION_AWARD' :
                    value = this.$t('TransactionRecord.transaction_type_invitationreward')
                    break
                    /**
                     * 预售退款
                     */
                case 'PTO_REFUND_INVEST' :
                    value = this.$t('TransactionRecord.transaction_type_presalerefund')
                    break
                    /**
                     * 支付保证金
                     */
                case 'PTO_PAY_DEPOSIT' :
                    value = this.$t('TransactionRecord.transaction_type_marginpayment')
                    break
                    /**
                     * 保证金退款
                     */
                case 'PTO_REFUND_DEPOSIT' :
                    value = this.$t('TransactionRecord.transaction_type_marginrefund')
                    break
                    /**
                     * 通证预售认购
                     */
                case 'PTO_PT_INVEST' :
                    value = this.$t('TransactionRecord.transaction_type_presale')
                    break
                    /**
                     * 通证发行
                     */
                case 'PTO_PT_ISSUE' :
                    value = this.$t('TransactionRecord.transaction_type_platformtransfer')
                    break
                    /**
                     * 转账工具
                     */
                case 'CMS_TRANSFER_TOOL' :
                    value = this.$t('TransactionRecord.transaction_type_platformtransfer')
                    break
                    /**
                     * 通证预留划转
                     */
                case 'PTO_PT_SELF' :
                    value = this.$t('TransactionRecord.transaction_type_platformtransfer')
                    break
                    /**
                     * 通证剩余退回划转
                     */
                case 'PTO_PT_RETURN' :
                    value = this.$t('TransactionRecord.transaction_type_platformtransfer')
                    break
                    /**
                     * 预售完成划转给发行方
                     */
                case 'PTO_SALES_COMPLETE_TRANSFER_ACCOUNTS' :
                    value = this.$t('TransactionRecord.transaction_type_platformtransfer')
                    break
                    /**
                     * 缴纳上市费用
                     */
                case 'PTO_PAYMENT_PAY' :
                    value = this.$t('TransactionRecord.transaction_type_listingfee')
                    break
                    /**
                     * 充值
                     */
                case 'TRANS_USAGE_CHARGE' :
                    value = this.$t('TransactionRecord.transaction_type_deposit')
                    break
                    /**
                     * 提现
                     */
                case 'TRANS_USAGE_WITHDRAW' :
                    value = this.$t('TransactionRecord.transaction_type_withdraw')
                    break
                    /**
                     * 通证分红记录
                     */
                case 'CMS_PTO_DIVIDEND' :
                    value = this.$t('TransactionRecord.transaction_bonus_dividend')
                    break
                    /**
                     * 发行方收到的所有预售金额
                     */
                case 'PTO_COMPLETE_ISSUER' :
                    value = this.$t('TransactionRecord.transaction_type_platformtransfer')
                    break
                }
                return value
            },
            // 过滤交易记录状态
            state (key) {
                let state = ''
                switch (key) {
                case 0 :
                    state = this.$t('TransactionRecord.transaction_status_done')
                    break
                case 1 :
                    state = this.$t('TransactionRecord.transaction_status_fail')
                    break
                case 2 :
                    state = this.$t('TransactionRecord.transaction_status_recharging')
                    break
                }
                return state
            },
            // 过滤提现记录状态
            stateFilter (key) {
                let state = ''
                switch (key) {
                case 0 :
                    state = this.$t('TransactionRecord.transaction_to_be_reviewed')
                    break
                case 1 :
                    state = this.$t('TransactionRecord.transaction_pass_through')
                    break
                case 2 :
                    state = this.$t('TransactionRecord.transaction_not_passed')
                    break
                case 3 :
                    state = this.$t('TransactionRecord.transaction_revoked')
                    break
                case 4 :
                    state = this.$t('TransactionRecord.transaction_withdraw_cash_successfully')
                    break
                case 5 :
                    state = this.$t('TransactionRecord.transaction_failed_to_extract_current')
                    break
                case 6 :
                    state = this.$t('TransactionRecord.transaction_cash_withdrawal')
                    break
                }
                return state
            },
            /**
             * 在判断是由提现页面进来的时候主动触发一次 selectPages 事件
             */
            hasInitCheckPan () {
                this.timer = setTimeout(() => {
                    if (this.initCheckPan === '2') {
                        this.selectPages(1)
                        this.usageType = 1
                        setTimeout(() => {
                            Bus.$emit('publicEvent', 'WITHDRAWALSRECORD')
                        }, 300)
                    }
                    if (this.initCheckPan === '4') {
                        this.selectPtPages(1)
                        this.usageType = 9
                        setTimeout(() => {
                            Bus.$emit('publicEvent', 'PTPURCHASERECORD')
                        }, 300)
                    }
                    clearTimeout(this.timer)
                }, 230)
            }
        },
        filters: {
            // 时间格式化
            parseTime
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        components: {
            FsHead,
            fonter
        },
        head () {
            return {
                title: this.$t('PageTitle.transrecord_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    @background: #ffffff;

    .no-details {
        text-align: center;
    }

    /deep/ .ant-divider-horizontal {
        margin: 16px 0;
    }

    .span-title {
        width: 170px;
        display: inline-block;
    }

    .content {
        padding-top: 65px;
        min-height: calc(100vh - 126px);
    }

    .flex-column {
        display: flex;
        flex-direction: column;

        .transation-record-item {
            background-color: #F0F2F5;
            margin-bottom: 26px;
        }

        .item-basic {
            min-height: 745px;

        }

        .transation-record-head {
            background-color: #FFFFFF;
            margin-bottom: 24px;
            padding: 16px 32px;
            font-size: 20px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
            line-height: 28px;
        }

        .transation-record-body {
            background-color: #FFFFFF;
            padding: 0 32px;
            min-height: 704px;
            font-size: 16px;
            font-weight: 500;
            line-height: 24px;
            color: #2EA9DF;

            .computedColorRed {
                color: #FF542B;
            }

            .computedColorGreen {
                color: #27E774;
            }
        }

        .transation-record-type {
            padding: 16px 0 10px 0;
            border-bottom: 1px solid #E9E9E9;
        }

        /deep/ .innerTable {

            .ant-table-thead {

                tr {
                    display: none;
                }
            }

            .ant-table-tbody {

                tr {
                    td {
                        &:nth-child(1) {
                            width: 17%;
                        }
                    }
                }
            }
        }

    }
</style>

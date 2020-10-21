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
        <section id="mobile-transation-record">
            <a-layout-content>
                <!--顶部标题-->
                <div class="transation-record-title">
                    <h2>{{$t('TransactionRecord.transaction_title_headline')}}</h2>
                </div>
                <!-- 标签页 -->
                <div class="transation-record-taps">
                    <a-spin :spinning="spinning">
                        <a-tabs @change="tabChange" :defaultActiveKey="initCheckPan">
                            <!-- 充值记录 -->
                            <a-tab-pane key="1">
                                <template slot="tab">
                                    <a-badge :dot="hasUpdated('RECHARGERECORD')" :offset="[3, 0]">
                                        {{$t('TransactionRecord.transaction_tab_deposit')}}
                                    </a-badge>
                                </template>
                                <!-- 内容部分 -->
                                <a-collapse :bordered="false" v-if="dataList.length !== 0">
                                    <a-collapse-panel class="customStyle" v-for="(item, index) in dataList" :key="index">
                                        <template slot="header">
                                            <div class="transation-record-taps-content">
                                                <!-- content left -->
                                                <div class="record-taps-content-left">
                                                    <div class="record-taps-content-gusd">
                                                        <span> {{item.currency }} </span>
                                                        <span> {{item.myBizType}} </span>
                                                    </div>
                                                    <span> {{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}} </span>
                                                </div>
                                                <!-- content right -->
                                                <div class="record-taps-content-right">
                                                    <span :class="item.amount.substr(0,1) === '+' ? 'computedColorGreen' : 'computedColorRed'">
                                                        {{item.amount}}
                                                    </span>
                                                    <span> {{item.state}} </span>
                                                </div>
                                            </div>
                                        </template>
                                        <a-divider/>
                                        <a-row class="row-margin">
                                            <a-col :span="9" class="info-key">{{$t('TransactionRecord.transaction_title_txid')}}：</a-col>
                                            <a-col :span="15" class="info-value">{{item.transChainHash}}</a-col>
                                        </a-row>
                                        <a-row class="row-margin">
                                            <a-col :span="9" class="info-key">{{$t('TransactionRecord.transaction_deposit_title_address')}}：</a-col>
                                            <a-col :span="15" class="info-value">
                                                {{item.fromAddr}}
                                            </a-col>
                                        </a-row>
                                        <a-row>
                                            <a-col :span="9" class="info-key">{{$t('TransactionRecord.transaction_deposit_title_time')}}：</a-col>
                                            <a-col :span="15" class="info-value">{{item.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</a-col>
                                        </a-row>
                                    </a-collapse-panel>
                                </a-collapse>
                                <div class="page">
                                    <a-pagination @change="onChange" :total="total"/>
                                </div>
                            </a-tab-pane>
                            <!-- 提现记录 -->
                            <a-tab-pane key="2">
                                <template slot="tab">
                                    <a-badge :dot="hasUpdated('WITHDRAWALSRECORD')" :offset="[3, 0]">
                                        {{$t('TransactionRecord.transaction_tab_withdraw')}}
                                    </a-badge>
                                </template>
                                <!-- 内容部分 -->
                                <a-collapse :bordered="false" v-if="data.length !== 0">
                                    <a-collapse-panel :key="index" class="customStyle" v-for="( item,index) in data">
                                        <template slot="header">
                                            <div class="transation-record-taps-content">
                                                <!-- content left -->
                                                <div class="record-taps-content-left">
                                                    <div class="record-taps-content-gusd">
                                                        <span> {{ item.currency }} </span>
                                                        <span> {{item.myBizType}} </span>
                                                    </div>
                                                    <span> {{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}} </span>
                                                </div>
                                                <!-- content right -->
                                                <div class="record-taps-content-right">
                                                    <span :class="item.amount.substr(0,1) === '+' ? 'computedColorGreen' : 'computedColorRed'">
                                                        {{item.amount}}
                                                    </span>
                                                    <span> {{item.state}} </span>
                                                </div>
                                            </div>
                                        </template>
                                        <a-divider/>
                                        <a-row class="row-margin">
                                            <a-col :span="9" class="info-key">{{$t('TransactionRecord.transaction_title_txid')}}：</a-col>
                                            <a-col :span="15" class="info-value">{{item.transChainHash}}</a-col>
                                        </a-row>
                                        <a-row class="row-margin">
                                            <a-col :span="9" class="info-key">{{$t('TransactionRecord.transaction_withdraw_title_address')}}：</a-col>
                                            <a-col :span="15" class="info-value">
                                                {{item.toAddr}}
                                            </a-col>
                                        </a-row>
                                        <a-row class="row-margin">
                                            <a-col :span="9" class="info-key">{{$t('TransactionRecord.transaction_withdraw_title_fee')}}：</a-col>
                                            <a-col :span="15" class="info-value">{{item.fee}} {{ item.feeCurrency }}</a-col>
                                        </a-row>
                                        <a-row>
                                            <a-col :span="9" class="info-key">{{$t('TransactionRecord.transaction_withdraw_title_date')}}：</a-col>
                                            <a-col :span="15" class="info-value">{{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</a-col>
                                        </a-row>
                                    </a-collapse-panel>
                                </a-collapse>
                                <!-- 分页 -->
                                <div class="page">
                                    <a-pagination @change="selectPage" :total="selectTotal"/>
                                </div>
                            </a-tab-pane>
                            <!-- 购房记录 -->
                            <a-tab-pane key="3">
                                <template slot="tab">
                                    <a-badge :dot="hasUpdated('PURCHASERECORD')" :offset="[3, 0]">
                                        {{$t('TransactionRecord.transaction_tab_purchase')}}
                                    </a-badge>
                                </template>
                                <!-- 内容部分 -->
                                <div class="transation-record-taps-content border-no-inner" :key="index"
                                     v-for="( item,index) in dataList">
                                    <!-- content left -->
                                    <div class="record-taps-content-left">
                                        <div class="record-taps-content-gusd">
                                            <span> {{ item.currency }} </span>
                                            <span> {{item.myBizType}} </span>
                                        </div>
                                        <span> {{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}} </span>
                                    </div>
                                    <!-- content right -->
                                    <div class="record-taps-content-right">
                                        <span :class="item.amount.substr(0,1) === '+' ? 'computedColorGreen' : 'computedColorRed'">
                                            {{item.amount}}
                                        </span>
                                        <span> {{item.state}} </span>
                                    </div>
                                </div>
                                <div class="page">
                                    <a-pagination @change="onChange" :total="total"/>
                                </div>
                            </a-tab-pane>
                            <!-- 通证购买记录 -->
                            <a-tab-pane key="4">
                                <template slot="tab">
                                    <a-badge :dot="hasUpdated('PTPURCHASERECORD')" :offset="[3, 0]">
                                        {{$t('TransactionRecord.transaction_tab_pthistory')}}
                                    </a-badge>
                                </template>
                                <!-- 内容部分 -->
                                <a-collapse :bordered="false" v-if="dataPtList.length !== 0">
                                    <a-collapse-panel :key="index" class="customStyle"
                                                      v-for="( item,index) in dataPtList"
                                                      :showArrow="item.bizType === 'PTO_PT_INVEST'">
                                        <template slot="header">
                                            <div class="transation-record-taps-content">
                                                <!-- content left -->
                                                <div class="record-taps-content-left">
                                                    <div class="record-taps-content-gusd">
                                                        <span> {{ item.curCode }} </span>
                                                        <span> {{item.myBizType}} </span>
                                                    </div>
                                                    <span> {{ item.time | parseTime('{y}-{m}-{d} {h}:{i}')}} </span>
                                                </div>
                                                <!-- content right -->
                                                <div class="record-taps-content-right">
                                                    <span :class="item.curAmount.substr(0,1) === '+' ? 'computedColorGreen' : 'computedColorRed'">
                                                        {{item.curAmount}}
                                                    </span>
                                                    <span> {{item.state}} </span>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-if="item.bizType === 'PTO_PT_INVEST'">
                                            <a-divider />
                                            <a-row class="row-margin">
                                                <a-col :span="9" class="info-key">{{$t('TransactionRecord.transaction_title_pt')}}：</a-col>
                                                <a-col :span="15" class="info-value">{{ item.ptCurCode }}</a-col>
                                            </a-row>
                                            <a-row>
                                                <a-col :span="9" class="info-key">{{$t('TransactionRecord.transaction_title_amount')}}：</a-col>
                                                <a-col :span="15" class="info-value">
                                                    {{ item.ptTotalAmount }}
                                                </a-col>
                                            </a-row>
                                        </template>
                                    </a-collapse-panel>
                                </a-collapse>
                                <div class="page">
                                    <a-pagination @change="onPtChange" :total="selectPtTotal"/>
                                </div>
                            </a-tab-pane>
                            <!-- 划转记录 -->
                            <a-tab-pane key="5">
                                <template slot="tab">
                                    <a-badge :dot="hasUpdated('TRANSFERRECORD')" :offset="[3, 0]">
                                        {{$t('TransactionRecord.transaction_tab_transfer')}}
                                    </a-badge>
                                </template>
                                <!-- 内容部分 -->
                                <div class="transation-record-taps-content border-no-inner" :key="index"
                                     v-for="( item,index) in dataList">
                                    <!-- content left -->
                                    <div class="record-taps-content-left">
                                        <div class="record-taps-content-gusd">
                                            <span> {{ item.currency }} </span>
                                            <span> {{item.myBizType}} </span>
                                        </div>
                                        <span> {{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}} </span>
                                    </div>
                                    <!-- content right -->
                                    <div class="record-taps-content-right">
                                        <span :class="item.amount.substr(0,1) === '+' ? 'computedColorGreen' : 'computedColorRed'">
                                            {{item.amount}}
                                        </span>
                                        <span> {{item.state}} </span>
                                    </div>
                                </div>
                                <div class="page">
                                    <a-pagination @change="onChange" :total="total"/>
                                </div>
                            </a-tab-pane>
                        </a-tabs>
                    </a-spin>
                </div>
            </a-layout-content>
        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import FsHead from '~/components/mobile/FangseaHeader'
    import fonter from '~/components/mobile/Footer'
    import {parseTime} from '~/assets/utils/index'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import axios from '~/plugins/axios'

    export default {
        data () {
            return {
                // 提现数据
                data: [],
                // 交易数据
                dataList: [],
                // 通证数据
                dataPtList: [],
                // 首页高亮下标
                key: '0',
                // 表单布局模式
                formLayout: 'vertical',
                // 登录、注册导航下标
                type: 0,
                // 用户中心导航下标
                centerKey: 4,
                // 抽屉动画
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 当前列表类型
                usageType: 0,
                // 数据总数
                total: 0,
                // 提现数据总数
                selectTotal: 0,
                // 通证数据总数
                selectPtTotal: 0,
                // 等待效果
                spinning: false,
                // 默认选中的 key
                initCheckPan: '1',
                // 定时器
                timer: ''
            }
        },
        created () {
            if (process.client) {
                this.hasInitCheckPan()
                this.listenI18n()
            }
        },
        mounted () {
            if (!this.$route.query.initCheckPan) {
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
                    this.initList(1, this.usageType)
                })
            },
            /**
             * 分页查询
             * @param currentPage 选中页
             */
            onChange (currentPage) {
                this.initList(currentPage, this.usageType)
            },
            /**
             * 提现分页查询
             * @param currentPage 选中页
             */
            selectPage (currentPage) {
                this.selectPages(currentPage)
            },
            /**
             * 通证购买记录
             * @param currentPage 选中页
             */
            onPtChange (currentPage) {
                this.selectPtPages(currentPage)
            },
            /**
             * tab 被点击时候的事件
             * @param key 对应的tab 的key
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
                this.data = []
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        pageNum: currentPage,
                        pageSize: 10
                    }
                }
                axios.post('/cms/wallet/user/withdraw/apply/query', data).then((res) => {
                    if (res.data.code.toString() === '0') {
                        this.selectTotal = res.data.data.total
                        this.data = res.data.data.list.map((item, index) => {
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
                this.dataList = []
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
                        this.total = res.data.data.total
                        this.dataList = res.data.data.list.map((item, index) => {
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
                this.data = []
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        pageNum: currentPage,
                        pageSize: 10
                    }
                }
                axios.post('/pto/trade/user/list', data).then((res) => {
                    if (res.data.code.toString() === '0') {
                        this.selectPtTotal = res.data.data.total
                        this.dataPtList = res.data.data.list.map((item, index) => {
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
             * 过滤类型
             * @param key
             * @returns {string}
             */
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
            /**
             * 过滤状态
             * @param key 状态码
             */
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
            /**
             * 过滤提现记录状态
             * @param key 状态码
             */
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
             * 在判断是由提现页面进来的时候主动触发一次 tabChange 事件
             */
            hasInitCheckPan () {
                let initCheckPan = !this.$route.query.initCheckPan ? '' : this.$route.query.initCheckPan
                if (initCheckPan === '') {
                    this.initCheckPan = '1'
                    this.initList(1, 0)
                } else {
                    if (initCheckPan === '2') {
                        this.initCheckPan = '2'
                        this.selectPages(1)
                        this.usageType = 1
                        this.initList(1, 0)
                        setTimeout(() => {
                            Bus.$emit('publicEvent', 'WITHDRAWALSRECORD')
                        }, 300)
                    }
                    if (initCheckPan === '4') {
                        this.initCheckPan = '4'
                        this.selectPtPages(1)
                        this.usageType = 9
                        this.initList(1, 0)
                        setTimeout(() => {
                            Bus.$emit('publicEvent', 'PTPURCHASERECORD')
                        }, 300)
                    }
                }
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

    .row-margin {
        margin-bottom: 0.04rem
    }

    /deep/ .ant-tabs-bar {
        margin-bottom: 0;
    }

    .border-no-inner {
        border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    }

    #mobile-transation-record {
        background-color: #FFFFFF;
        padding: 0.2rem 0.16rem;
        min-height: calc(100vh - 1.26rem);

        .transation-record-title {
            > h2 {
                margin-bottom: 0;
                font-size: 18px;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.85);
                line-height: 26px;
            }
        }

        .transation-record-taps-content {
            padding: 0.12rem 0;
            display: flex;
            justify-content: space-between;

            .record-taps-content-left {
                display: flex;
                flex-direction: column;

                > span {
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.65);
                    line-height: 20px;
                }

                .record-taps-content-gusd {
                    margin-bottom: 0.04rem;

                    > span {

                        &:nth-child(1) {
                            font-weight: 500;
                            color: rgba(0, 0, 0, 0.85);
                            line-height: 22px;
                        }

                        &:nth-child(2) {
                            font-weight: 400;
                            color: rgba(0, 0, 0, 0.25);
                            line-height: 22px;
                        }
                    }
                }

            }

            .record-taps-content-right {
                text-align: right;
                display: flex;
                flex-direction: column;

                > span {
                    &:nth-child(2) {
                        font-size: 12px;
                        color: rgba(0, 0, 0, 0.65);
                        line-height: 20px;
                    }
                }
            }
        }

        .page {
            margin-top: 0.2rem;
            text-align: center;
        }

        .computedColorRed {
            color: #FF542B;
            margin-bottom: 0.06rem;
        }

        .computedColorGreen {
            color: #27E774;
            margin-bottom: 0.06rem;
        }
    }

    // 折叠面板样式
    .customStyle {
        background: #ffffff;
        box-shadow: 0px 1px 0px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
        border: 0;
        width: 97.5%;
        margin: 0 auto 0.24rem;

        /deep/ .ant-collapse-header {
            padding: 0 0.35rem 0 0.16rem;
        }
    }

    /deep/ .ant-collapse > .ant-collapse-item > .ant-collapse-header .arrow {
        left: 93%;
    }

    /deep/ .ant-collapse > .ant-collapse-item > .ant-collapse-header .arrow svg {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
        transition: -webkit-transform 0.24s;
        transition: transform 0.24s;
        transition: transform 0.24s, -webkit-transform 0.24s;
    }

    /deep/ .ant-collapse > .ant-collapse-item > .ant-collapse-header[aria-expanded='true'] .anticon-right svg {
        transform: rotate(-90deg);
    }

    /deep/ .ant-divider-horizontal {
        margin: 0 0 0.12rem 0;
    }

    .info-key {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
    }

    .info-value {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
    }

</style>

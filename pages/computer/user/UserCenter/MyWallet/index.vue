<template>
    <section class="container">
        <a-layout-content>
            <div class="flex-column">
                <div class="my-wallet-item item-basic">
                    <!--头部-->
                    <div class="my-wallet-head">
                        <div class="my-wallet-head-left">
                            <span> {{$t('indexWallet.mywallet_title_estimated')}} ： </span>
                            <span> {{ totalDiscount }} {{ totalDiscountSymbol }} </span>
                        </div>
                        <div class="my-wallet-head-right">
                            <span>
                                <!-- 跳转交易记录 -->
                                <nuxt-link
                                        class="style-link-blue"
                                        :to="{path:'/computer/user/UserCenter',query: {getKey: '4'}}">
                                   {{$t('indexWallet.mywallet_btn_record')}}
                                </nuxt-link>
                            </span>
                            <a-button
                                    class="my-wallet-buttonAdress"
                                    type="primary">
                                <!-- 跳转地址管理 -->
                                <nuxt-link
                                        class="style-link-white"
                                        :to="{path:'/computer/user/UserCenter',query: {getKey: '3'}}">
                                    {{$t('indexWallet.mywallet_btn_addrmanage')}}
                                </nuxt-link>
                            </a-button>
                        </div>
                    </div>
                    <!-- 头部 （ 第二行 ）-->
                    <div class="my-wallet-head-tip">
                        <a-tooltip
                                class="content-wallet-how"
                                overlayClassName="tipsClass"
                                placement="bottom"
                                v-model="showHowToGet">
                            <a-icon type="question-circle"
                                    theme="filled"
                                    class="wallet-head-icon-style"/>
                            <span> {{$t('indexWallet.mywallet_title_howtoget')}} </span>
                            <div class="tipBox" slot="title">
                                <p class="tipTitle">{{$t('indexWallet.mywallet_popup_title_howtogetmain')}}</p>
                                <p class="tipTitle" v-if="updateTime !== 0">{{$t('indexWallet.mywallet_popup_title_time')}}{{updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
                                <a-divider class="divider"/>
                                <p class="tipTitle propose">{{$t('indexWallet.mywallet_popup_title_propose')}}</p>
                                <a-row type="flex" justify="space-between" align="middle">
                                    <a-col :span="16" class="wwwLogosItem" style="text-align: right;">
                                        <img class="wwwLogo" src="/content//huobi.jpg" alt=""
                                             @click="tipsHrefTo('https://www.huobi.br.com')">
                                    </a-col>
                                    <a-col :span="8" class="wwwLogosItem">
                                        <img class="wwwLogo" src="/content//okcoin.png" alt=""
                                             @click="tipsHrefTo('https://www.okex.com')">
                                    </a-col>
                                </a-row>
                            </div>
                        </a-tooltip>
                    </div>
                    <!--表格-->
                    <div class="my-wallet-table">
                        <!--顶部表头单独出来-->
                        <table style="width: 100%;">
                            <tbody>
                            <tr>
                                <th width="100"> {{$t('indexWallet.mywallet_table_title_currency')}}</th>
                                <th width="132" class="text-align-right">
                                    {{$t('indexWallet.mywallet_table_title_available')}}
                                </th>
                                <th width="132" class="text-align-right">
                                    {{$t('indexWallet.mywallet_table_title_freeze')}}
                                </th>
                                <th width="132" class="text-align-right">
                                    {{$t('indexWallet.mywallet_table_title_lockposition')}}
                                </th>
                                <th width="162" class="text-align-right">
                                    <a-tooltip
                                            overlayClassName="tipsClass"
                                            placement="bottom"
                                            v-model="showHowToGetTH">
                                        <a-icon type="question-circle"
                                                theme="filled"
                                                class="wallet-head-icon-style"/>
                                        <div class="tipBox" slot="title">
                                            <p class="tipTitle">{{$t('indexWallet.mywallet_popup_title_howtogetmain')}}</p>
                                            <p class="tipTitle" v-if="updateTime !== 0">{{$t('indexWallet.mywallet_popup_title_time')}}{{updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
                                        </div>
                                    </a-tooltip>
                                    {{$t('indexWallet.mywallet_table_title_valuation')}}
                                </th>
                                <th width="190"> {{$t('indexWallet.mywallet_table_title_operation')}}</th>
                            </tr>
                            </tbody>
                        </table>
                        <!-- 动态数据部分单独出来 -->
                        <div v-for="(item,index) in analogData.data.list">
                            <table style="width: 100%;">
                                <tbody>
                                <tr>
                                    <td width="100"> {{ item.currency }}</td>
                                    <td width="132" class="word-wrap-style">
                                        {{ item.balance }}
                                    </td>
                                    <td width="132" class="word-wrap-style">
                                        {{ item.freezBalance }}
                                    </td>
                                    <td width="132" class="word-wrap-style">
                                        {{ item.contractLockBalance }}
                                    </td>
                                    <td width="160" class="text-align-right">
                                        {{ item.valuation.value }} {{item.valuation.symbol}}
                                    </td>
                                    <td width="192" class="toutchedA">
                                        <!-- 充值 -->
                                        <a
                                                v-show="item.rechargeDisable === '0' ? false:true "
                                                href="javascript:;"
                                                @click="toRecharge(item.accountId, item)">
                                            {{ $t('indexWallet.mywallet_deposit_btn_deposit') }}
                                        </a>
                                        <a
                                                style="color: #d1d1d1;"
                                                class="disabledAClass"
                                                v-show="item.rechargeDisable === '0' ? true:false ">
                                            {{ $t('indexWallet.mywallet_deposit_btn_deposit') }}
                                        </a>
                                        <a-divider type="vertical"/>
                                        <!-- 提现 -->
                                        <a
                                                v-show="item.withdrawDisable === '0' ? false:true "
                                                href="javascript:;"
                                                @click="toCash(item.accountId, item)">
                                            {{ $t('indexWallet.mywallet_btn_withdraw') }}
                                        </a>
                                        <a
                                                style="color: #d1d1d1;"
                                                class="disabledAClass"
                                                v-show="item.withdrawDisable === '0' ? true:false ">
                                            {{ $t('indexWallet.mywallet_btn_withdraw') }}
                                        </a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <!-- 点击充值页面展示 -->
                            <div v-show="handle.isShowRecharge === item.accountId"
                                 class="my-wallet-recharge-wrap">
                                <div class="my-wallet-recharge-innerWrap">
                                    <!-- 左半部分 -->
                                    <div class="my-wallet-recharge-left">
                                        <div class="wallet-recharge-head">
                                            <span> {{$t('indexWallet.mywallet_deposit_title_address')}} </span>
                                        </div>
                                        <div class="wallet-recharge-corperation">
                                            <span> {{ item.walletAddr }} </span>
                                            <div style="display: flex;align-items: center">
                                               <span
                                                       style="width: 30px"
                                                       id="copy"
                                                       @click="copytips"
                                                       :data-clipboard-text="item.walletAddr"> {{$t('indexWallet.mywallet_deposit_btn_copy')}}
                                               </span>
                                                <!-- tooltip 提示 -->
                                                <div style="margin-left: 5px; width: 250px">
                                                    <a-tooltip
                                                            :getPopupContainer='(triggerNode) => triggerNode.parentNode'
                                                            class="content-wallet-how"
                                                            overlayClassName="tipsClass"
                                                            placement="bottom"
                                                            v-model="showTORechargetip">
                                                        <a-button type="primary">
                                                            {{$t('indexWallet.mywallet_btn_recharge')}}
                                                        </a-button>
                                                        <div class="tipBox" slot="title">
                                                            <p class="tipTitle">{{$t('indexWallet.mywallet_popup_title_howtogetmain')}}</p>
                                                            <p class="tipTitle" v-if="updateTime !== 0">{{$t('indexWallet.mywallet_popup_title_time')}}{{updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
                                                            <a-divider class="divider"/>
                                                            <p class="tipTitle propose">{{$t('indexWallet.mywallet_popup_title_propose')}}</p>
                                                            <a-row type="flex" justify="space-between" align="middle">
                                                                <a-col :span="16" class="wwwLogosItem"
                                                                       style="text-align: right;">
                                                                    <img class="wwwLogo" src="/content//huobi.jpg" alt=""
                                                                         @click="tipsHrefTo('https://www.huobi.br.com')">
                                                                </a-col>
                                                                <a-col :span="8" class="wwwLogosItem">
                                                                    <img class="wwwLogo" src="/content//okcoin.png" alt=""
                                                                         @click="tipsHrefTo('https://www.okex.com')">
                                                                </a-col>
                                                            </a-row>
                                                        </div>
                                                    </a-tooltip>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="wallet-recharge-tips">
                                            <span> {{i18nTransformation($t('indexWallet.mywallet_recharge_tips_title'),[item.currency])}} </span>
                                        </div>
                                    </div>
                                    <!-- 右半部分 -->
                                    <div class="my-wallet-recharge-right">
                                        <!-- 二维码 -->
                                        <qrcode :value="item.walletAddr" :size="120"></qrcode>
                                    </div>
                                </div>
                                <!-- 温馨提示详情 -->
                                <div class="my-wallet-recharge-reminder">
                                    <span> {{i18nTransformation($t('indexWallet.mywallet_deposit_tips_1'),[item.rechargetLimitDown, item.currency, item.currency])}}  </span>
                                    <span> {{$t('indexWallet.mywallet_deposit_tips_2')}}  </span>
                                    <span> {{$t('indexWallet.mywallet_deposit_tips_3')}}  </span>
                                    <span> {{$t('indexWallet.mywallet_deposit_tips_4')}}  </span>
                                </div>
                            </div>
                            <!-- 点击提现页面展示 -->
                            <div v-show="handle.isShowCash === item.accountId"
                                 class="my-wallet-recharge-cash">
                                <!-- 表格区域 -->
                                <div class="my-wallet-recharge-table">
                                    <a-form
                                            @submit="cashWithdrawalFun"
                                            :form="form"
                                            layout="inline">
                                        <a-form-item class="my-wallet-recharge-form" style="margin-right: 0">
                                            <!-- 提现数量 -->
                                            <a-form-item
                                                    :validate-status="messageTip.statusAmount"
                                                    :help="messageTip.helpAmount"
                                                    class="wallet-recharge-form-amount">
                                                <span slot="label"> {{$t('indexWallet.mywallet_title_withdrawalamount')}} </span>
                                                <a-input-search
                                                        type="number"
                                                        @change="quantityChange"
                                                        @blur="quantityBlur"
                                                        @focus="setFields('statusAmount')"
                                                        v-model="amount"
                                                        :placeholder="$t('indexWallet.mywallet_withdrawal_placeholder_number')"
                                                        size="large">
                                                    <a-button slot="enterButton"> {{ currency.name }}</a-button>
                                                </a-input-search>
                                            </a-form-item>
                                            <!-- 提现地址 -->
                                            <a-form-item
                                                    :validate-status="messageTip.statusAdress"
                                                    :help="messageTip.helpAdress"
                                                    class="wallet-recharge-form-address">
                                                <span slot="label"> {{$t('indexWallet.mywallet_title_withdrawaladdress')}} </span>
                                                <!-- 下拉的输入框 -->
                                                <selectComponent
                                                        @blurStatusAdress="blurStatusAdress"
                                                        @setFields="setFields('statusAdress')"
                                                        @checkedAdree="checkAdressFun"
                                                        @checkedAdreeData="setSelectData"
                                                        :address="selectAdress"
                                                        :list='selectAdree'>
                                                </selectComponent>
                                            </a-form-item>
                                        </a-form-item>

                                        <a-form-item class="my-wallet-recharge-form" style="margin-right: 0">
                                            <!-- 提现手续费 -->
                                            <a-form-item style="margin-right: 18px">
                                                <span slot="label"> {{$t('indexWallet.mywallet_title_fee')}} </span>
                                                <a-input-search
                                                        disabled
                                                        :placeholder="cashDate.serviceCharge"
                                                        size="large">
                                                    <a-button disabled slot="enterButton"> {{ cashDate.feeCur }}
                                                    </a-button>
                                                </a-input-search>
                                            </a-form-item>
                                            <!-- 到账数量 -->
                                            <a-form-item style="margin-right: 0">
                                                <span slot="label"> {{$t('indexWallet.mywallet_title_receiveamount')}} </span>
                                                <a-input-search
                                                        disabled
                                                        :placeholder="cashDate.accountsArrived"
                                                        size="large">
                                                    <a-button disabled slot="enterButton"> {{ currency.name }}
                                                    </a-button>
                                                </a-input-search>
                                            </a-form-item>
                                        </a-form-item>
                                    </a-form>
                                </div>
                                <!-- 提现按钮-->
                                <div class="my-wallet-recharge-button">
                                    <a-button
                                            :loading="disableButton"
                                            type="primary"
                                            @click="cashWithdrawalFun"> {{$t('indexWallet.mywallet_btn_withdraw')}}
                                    </a-button>
                                </div>
                                <div class="wallet-withdrawals-tips">
                                    <span> {{i18nTransformation($t('indexWallet.mywallet_recharge_tips_title'),[item.currency])}} </span>
                                </div>
                                <!-- 温馨提示详情 -->
                                <div class="my-wallet-recharge-reminder">
                                    <span> {{i18nTransformation($t('indexWallet.mywallet_withdraw_tips_1'),[item.withdrawLimitDown, item.currency, item.currency])}} </span>
                                    <span> {{$t('indexWallet.mywallet_withdraw_tips_2')}} </span>
                                    <span> {{$t('indexWallet.mywallet_withdraw_tips_3')}} </span>
                                    <span> {{$t('indexWallet.mywallet_withdraw_tips_4')}} </span>
                                </div>
                            </div>
                        </div>
                        <!-- 加载中 -->
                        <div v-show="isLoading" class="example">
                            <a-spin/>
                        </div>
                    </div>
                    <!-- 分页 -->
                    <div class="my-wallet-page" v-if="analogData.data.total!==0">
                        <a-pagination
                                class="list-pagination"
                                @change="changepag"
                                :defaultCurrent="1"
                                :total="analogData.data.total"/>
                    </div>
                </div>
            </div>
        </a-layout-content>
    </section>
</template>
<script>
    import selectComponent from '~/pages/computer/user/UserCenter/MyWallet/selectComponent'
    import {formatNumberCurrency, dcmAdd, maxLengthCheck, parseTime} from '~/assets/utils/index'
    import FsHead from '~/components/computer/FangseaHeader'
    import qrcode from '~/components/computer/QrCode'
    import fonter from '~/components/computer/Footer'
    import validate from '~/assets/utils/validate'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'
    import Clipboard from 'clipboard'

    export default {
        data () {
            return {
                // 表头
                columns: '',
                // 渲染数据
                data: [],
                // 操作
                handle: {
                    isShowRecharge: '',
                    isShowCash: ''
                },
                // 模拟数据
                analogData: {
                    // 请求跟踪编号
                    traceNum: '',
                    // 状态码，成功为“0”
                    code: '',
                    // 响应信息描述
                    msg: '',
                    data: {
                        // 当前页
                        pageNum: 1,
                        // 每页条数
                        pageSize: 10,
                        // 总条数
                        total: 0,
                        // 总页数
                        pages: '',
                        list: []
                    }
                },
                // 返回数据
                cashDate: {
                    // 到账的数量
                    accountsArrived: '',
                    // 手续费
                    serviceCharge: '',
                    // 手续费币种
                    feeCur: ''
                },
                // 提现数量
                quantityOfArrival: '',
                // 币种
                currency: {
                    name: '',
                    id: '',
                    walletAddr: ''
                },
                // 交易编号
                applyId: '',
                // 交易金额
                amount: '',
                // 总折合资产
                totalDiscount: 0,
                // 总折合资产币种
                totalDiscountSymbol: '',
                // 提现时间
                applyDate: '',
                // 选择输入框的值
                selecetInput: '',
                // 提示显示
                isShowTipsTop: false,
                // 控制如何获取加密货币tip显示
                showHowToGet: false,
                // 控制如何获取加密货币tip显示
                showHowToGetTH: false,
                // 控制如何获取加密货币tip显示
                showTORechargetip: false,
                // 加载效果
                isLoading: true,
                // 输入的地址信息
                address: '',
                // 下拉选项
                selectAdree: [],
                // 显示精度
                displayDecimals: 0,
                // 提示信息
                messageTip: {
                    statusAmount: '',
                    helpAmount: '',
                    statusAdress: '',
                    helpAdress: ''
                },
                // 地址
                selectAdress: '',
                // 提现按钮置灰
                disableButton: false,
                // 更新时间
                updateTime: 0
            }
        },
        watch: {
            quantityOfArrival: 'quantityChange',
            isCheckedAmount: 'isCheckAmount',
            isCheckedAdress: 'isCheckAdress'
        },
        /**
         * 初始化form
         */
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        created () {
            if (process.client) {
                this.getTime()
                // 触发交易发现接口
                this.triggeringTransaction()
                this.listenI18n()
                // 初始化个人账户列表
                this.initalData()
                // 估值数据初始化
                this.initValuation()
                // 初始化页面的表头数据
                this.initTableColums()
            }
        },
        mounted () {
            setTimeout(() => {
                Bus.$emit('publicEvent', 'MYWALLET')
            }, 300)
        },
        methods: {
            /**
             * 初始化页面的表头数据
             */
            initTableColums () {
                this.columns = [{
                    title: this.$t('indexWallet.mywallet_table_title_currency'),
                    key: 'currency',
                    dataIndex: 'currency'
                }, {
                    title: this.$t('indexWallet.mywallet_table_title_available'),
                    key: 'available',
                    dataIndex: 'available'
                }, {
                    title: this.$t('indexWallet.mywallet_table_title_freeze'),
                    key: 'Frozen',
                    dataIndex: 'Frozen'
                }, {
                    title: this.$t('indexWallet.mywallet_table_title_lockposition'),
                    key: 'lockPosition',
                    dataIndex: 'lockPosition'
                }, {
                    title: this.$t('indexWallet.mywallet_table_title_valuation'),
                    key: 'aluation',
                    dataIndex: 'aluation'
                }, {
                    title: this.$t('indexWallet.mywallet_table_title_operation'),
                    dataIndex: '',
                    key: 'x',
                    scopedSlots: {customRender: 'operation'}
                }
                ]
            },
            /**
             *  页面开始时的初始化数据
             *  查询我的钱包信息接口
             */
            initalData () {
                // 发送请求
                axios.post('/dc/wallet/account/info/query', {
                    traceId: tool.UUID(),
                    data: {
                        // 页码
                        pageNum: this.analogData.data.pageNum,
                        // 每页条数
                        pageSize: this.analogData.data.pageSize
                    }
                })
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.isLoading = false
                            // 接收成功、赋值
                            this.analogData.data.list = res.data.data.list
                            this.analogData.data.total = res.data.data.total
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    }).catch(err => {
                        this.$message.error(err.msg)
                    })
            },
            /**
             *  总资产更新时间
             */
            getTime () {
                // 发送请求
                axios.post('/wallet/exchange/latestTime/query')
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            // 判断时间是否为null
                            this.updateTime = res.data.data ? res.data.data : 0
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    }).catch(err => {
                        this.$message.error(err.msg)
                    })
            },
            /**
             *  页面开始时的初始化数据
             *  查询我的钱包信息估值接口
             */
            initValuation () {
                // 发送请求
                axios.post('/wallet/account/appraisement/query', {traceId: tool.UUID()})
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            // 接收成功、赋值
                            this.totalDiscount = res.data.data.value
                            this.totalDiscountSymbol = res.data.data.symbol
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
            },
            /**
             *  充值
             */
            toRecharge (id, item) {
                // 初始化地址
                this.currency.walletAddr = item.walletAddr
                if (this.handle.isShowRecharge !== id) {
                    // 第一次点击的时候，先去关闭提现页面
                    this.handle.isShowCash = -1
                    this.handle.isShowRecharge = id
                } else {
                    // 第二次点击的时候，关闭掉页面
                    this.handle.isShowRecharge = -1
                }
            },
            /**
             *  提现页面展开
             */
            toCash (id, item) {
                // 初始化地址
                this.currency.walletAddr = item.walletAddr
                // 初始化币种
                this.currency.name = item.currency
                this.currency.id = item.accountId
                // 初始化数据
                this.amount = ''
                // 初始化精度
                this.displayDecimals = item.displayDecimals
                this.form.resetFields()
                // 提示信息初始化
                this.messageTip.statusAmount = 'success'
                this.messageTip.statusAdress = 'success'
                this.messageTip.helpAmount = ''
                this.messageTip.helpAdress = ''
                this.cashDate.serviceCharge = item.withdrawFee
                this.cashDate.accountsArrived = ''
                this.cashDate.feeCur = item.withdrawFeeCur
                if (this.handle.isShowCash !== id) {
                    // 先去关闭充值页面
                    this.handle.isShowRecharge = -1
                    this.handle.isShowCash = id
                } else {
                    // 第二次点击的时候，关闭掉页面
                    this.handle.isShowCash = -1
                }
                // 初始化钱包下拉地址
                this.getSelectAdress()
            },
            /**
             * 点击复制
             */
            copytips () {
                let clipboard = new Clipboard('#copy')
                clipboard.on('success', e => {
                    this.$message.success(this.$t('indexWallet.mywallet_msg_copied'))
                    clipboard.destroy()
                })
                clipboard.on('error', e => {
                    this.$message.error(this.$t('iindexWallet.mywallet_msg_copyfail'))
                    clipboard.destroy()
                })
            },
            // 设置手机注册获取焦点状态
            setFields (name) {
                if (name === 'statusAdress') {
                    this.messageTip.statusAdress = 'validating'
                    this.messageTip.helpAdress = ''
                } else {
                    this.messageTip.statusAmount = 'validating'
                    this.messageTip.helpAmount = ''
                }
            },
            /**
             *  提现数量的失去焦点事件
             *  改变提现数量的精度
             */
            quantityBlur () {
                if (validate.required(this.amount)) {
                    // 初始化 input 状态
                    this.messageTip.statusAmount = 'success'
                    this.messageTip.helpAmount = ''
                    // 负数处理
                    if (this.amount < 0) {
                        this.amount = 0
                    }
                    this.amount = formatNumberCurrency(this.amount, this.displayDecimals)
                } else {
                    // 初始化 input 状态
                    this.messageTip.statusAmount = 'error'
                    this.messageTip.helpAmount = this.$t('indexWallet.mywallet_err_amount')
                }
            },
            /**
             *  提现数量的失去焦点事件
             *  改变提现数量的精度
             */
            blurStatusAdress () {
                if (validate.required(this.address)) {
                    // 初始化 input 状态
                    this.messageTip.statusAdress = 'success'
                    this.messageTip.helpAdress = ''
                } else {
                    // 初始化 input 状态
                    this.messageTip.statusAdress = 'error'
                    this.messageTip.helpAdress = this.$t('indexWallet.mywallet_err_address')
                }
            },
            /**
             *  提现数量的 watch 函数
             *  实时计算提现数量
             */
            quantityChange () {
                if (validate.required(this.amount) && maxLengthCheck(this.amount)) {
                    let data = 0
                    this.messageTip.statusAmount = 'success'
                    this.messageTip.helpAmount = ''
                    // 如果手续费币种等于提现币种直接减
                    if (this.cashDate.feeCur === this.currency.name) {
                        // 大于零的情况
                        if (this.amount - this.cashDate.serviceCharge > 0) {
                            this.cashDate.accountsArrived = formatNumberCurrency(dcmAdd(this.amount, this.cashDate.serviceCharge), this.displayDecimals)
                        } else {
                            // 处理精度为零且小于 0
                            if (this.displayDecimals === 0) {
                                this.cashDate.accountsArrived = 0
                            } else {
                                // 小于 0 且精度为零的情况  则置为 0
                                this.cashDate.accountsArrived = formatNumberCurrency(data, this.displayDecimals)
                            }
                        }
                    } else {
                        this.cashDate.accountsArrived = formatNumberCurrency(this.amount, this.displayDecimals)
                        if (this.cashDate.accountsArrived < 0) {
                            this.cashDate.accountsArrived = formatNumberCurrency(data, this.displayDecimals)
                        }
                    }
                }
            },
            /**
             * 提现地址检查
             */
            checkAdressFun (validateStatus, help) {
                this.messageTip.statusAdress = validateStatus
                this.messageTip.helpAdress = help
            },
            /**
             * 设置绑定的地址的值
             */
            setSelectData (data) {
                this.address = data
            },
            /**
             * 提现方法
             * form 表单提交
             * @param e 提交事件
             */
            cashWithdrawalFun (e) {
                this.disableButton = true
                if (e) {
                    e.preventDefault()
                }
                // 当提现数量不为 undefined 的时候单独去处理一下
                if (this.amount !== undefined) {
                    if (this.amount !== '' && this.address !== '') {
                        // 初始化提示信息和输入框的状态
                        this.messageTip.statusAmount = 'success'
                        this.messageTip.statusAdress = 'success'
                        this.messageTip.helpAmount = ''
                        this.messageTip.helpAdress = ''
                        // 三合一
                        let data = {
                            // 转出钱包地址
                            fromAddr: this.currency.walletAddr,
                            // 转入钱包地址
                            toAddr: this.address,
                            // 交易数量
                            amount: this.amount,
                            actAmount: this.cashDate.accountsArrived,
                            // 手续费
                            fee: this.cashDate.serviceCharge,
                            // 手续费币种
                            feeCurCode: this.cashDate.feeCur,
                            // 币种名称
                            currency: this.currency.name
                        }
                        // 发送请求
                        axios.post('/cms/wallet/withdraw/apply', {traceId: tool.UUID(), data})
                            .then(res => {
                                if (res.data.code.toString() === '0') {
                                    this.disableButton = false
                                    this.applyId = res.data.data.applyId
                                    this.applyDate = res.data.data.applyDate
                                    this.nextStep()
                                } else {
                                    this.disableButton = false
                                    this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                                }
                            })
                    } else if (this.amount === '' && this.address === '') {
                        // 提现数量
                        this.messageTip.statusAmount = 'error'
                        this.messageTip.helpAmount = this.$t('indexWallet.mywallet_err_amount')
                        // 提现地址
                        this.messageTip.statusAdress = 'error'
                        this.messageTip.helpAdress = this.$t('indexWallet.mywallet_err_address')
                        this.disableButton = false
                    } else if (this.amount === '' && this.address !== '') {
                        // 提现数量
                        this.messageTip.statusAmount = 'error'
                        this.messageTip.helpAmount = this.$t('indexWallet.mywallet_err_amount')
                        this.disableButton = false
                    } else if (this.address === '' && this.amount !== '') {
                        // 提现地址
                        this.messageTip.statusAdress = 'error'
                        this.messageTip.helpAdress = this.$t('indexWallet.mywallet_err_address')
                        this.disableButton = false
                    } else {
                        this.disableButton = false
                    }
                } else {
                    // 当提现数量为 undefined 的时候
                    if (this.amount === undefined && this.address !== '') {
                        // 提现数量
                        this.messageTip.statusAmount = 'error'
                        this.messageTip.helpAmount = this.$t('indexWallet.mywallet_err_amount')
                        this.disableButton = false
                    } else if (this.address === undefined && this.amount !== '') {
                        // 提现地址
                        this.messageTip.statusAdress = 'error'
                        this.messageTip.helpAdress = this.$t('indexWallet.mywallet_err_address')
                        this.disableButton = false
                    } else {
                        this.disableButton = false
                    }
                }
            },
            /**
             * 点击分页
             */
            changepag (page) {
                this.analogData.data.pageNum = page
                this.initalData()
            },
            /**
             *  下一步事件
             */
            nextStep () {
                this.$router.push({
                    name: 'computer-user-UserCenter-MyWallet-OrderSubmitted',
                    params: {
                        // 币种
                        currency: this.currency.name,
                        // 提现地址
                        cashAddress: this.address,
                        // 到账数量
                        magnitude: this.cashDate.accountsArrived,
                        // 手续费
                        serviceCharge: this.cashDate.serviceCharge,
                        // 手续费币种
                        feeCurCode: this.cashDate.feeCur,
                        // 提现时间
                        cashTime: this.applyDate,
                        // 支付的 ID
                        applyId: this.applyId
                    }
                })
            },
            /**
             * 触发交易发现接口
             */
            triggeringTransaction () {
                axios.post('/wallet/touch/found/scan', {traceId: tool.UUID()}).then(res => {
                    if (res.data.code.toString() === '0') {
                    } else {
                        this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                    }
                })
            },
            /**
             * 鼠标移入事件
             */
            enter () {
                this.isShowTipsTop = true
            },
            /**
             * 鼠标移出事件
             */
            leave () {
                this.isShowTipsTop = false
            },
            /**
             *  tips 点击图片跳转
             */
            tipsHrefTo (www) {
                this.toRechargeFun(www)
                this.showHowToGet = false
                this.showHowToGetTH = false
                this.showTORechargetip = false
            },
            /**
             * 动态数据国际化
             */
            i18nTransformation (_i18n, paramsArr) {
                return tool.intervariable(_i18n, paramsArr)
            },
            /**
             * 去充值页面（ 跳转第三方平台 ）
             */
            toRechargeFun (e) {
                window.open(e)
            },
            /**
             * 初始化我的钱包地址
             */
            getSelectAdress () {
                // 发送请求
                axios.post('/user/config/address/query', {
                    traceId: tool.UUID(),
                    data: {
                        // 页码
                        pageNum: 1,
                        // 每页条数
                        pageSize: 100,
                        // 币种名称
                        filter: {
                            currencyName: this.currency.name
                        }
                    }
                })
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            // 接收成功、赋值
                            this.selectAdree = res.data.data.list
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    }).catch(err => {
                        this.$message.error(err.msg)
                    })
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    if (this.messageTip.statusAmount === 'error' || this.messageTip.statusAdress === 'error') {
                        this.cashWithdrawalFun()
                    }
                })
            }
        },
        filters: {
            // 时间格式化
            parseTime
        },
        components: {
            FsHead,
            fonter,
            qrcode,
            selectComponent
        },
        head () {
            return {
                title: this.$t('PageTitle.myassets_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>

    @background: #ffffff;

    .content {
        padding-top: 65px;
        min-height: calc(100vh - 126px);
    }

    #components-table-demo-size h4 {
        margin-bottom: 16px;
    }

    .flex-column {

        display: flex;
        flex-direction: column;

        > div {
            background: @background;
        }

        .my-wallet-item {
            margin-bottom: 26px;
            padding: 0 32px;
        }

        .item-basic {
            min-height: 785px;
        }

        .my-wallet-head {
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;

            .my-wallet-head-left {
                display: flex;
                align-items: center;

                > span {

                    &:nth-child(1) {
                        font-size: 16px;
                        font-weight: 500;
                        color: rgba(0, 0, 0, 0.85);
                        line-height: 24px;

                    }

                    &:nth-child(2) {
                        font-size: 16px;
                        color: rgba(0, 0, 0, 0.65);
                        line-height: 24px;
                    }

                    &:nth-child(3) {
                        margin-left: 16px;
                    }
                }

                .my-wallet-head-tip {
                    margin-bottom: 20px;
                    margin-left: 16px;
                }
            }

            .my-wallet-buttonAdress {
                margin-left: 16px;

                /deep/ .ant-btn-primary {
                    background-color: #2EA9DF;
                }
            }
        }

        .my-wallet-head-right {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            > span {
                &:hover {
                    cursor: pointer;
                }

                &:nth-child(1) {
                    margin-right: 16px;
                    font-size: 14px;
                    color: rgba(46, 169, 223, 1);
                    line-height: 22px;
                }
            }
        }

        .my-wallet-table {

            table {

                > tbody {
                    border-bottom: 1px solid #E9E9E9;

                    th {
                        padding: 16px;
                        font-size: 14px;
                        font-weight: 500;
                        color: rgba(0, 0, 0, 0.65);
                        line-height: 22px;
                    }
                }

                > tbody {

                    tr {
                        border-bottom: 1px solid #E9E9E9;

                        > td {
                            padding: 16px;
                            font-size: 14px;
                            font-weight: 500;
                            color: rgba(0, 0, 0, 0.65);
                            line-height: 22px;
                        }
                    }
                }
            }

            .toutchedA {
                a {
                    text-decoration: none;

                    &:link {
                        color: #2EA9DF;
                    }

                    &:hover {
                        color: #2EA9DF;
                    }

                    &:visited {
                        color: #2EA9DF;
                    }
                }
            }

            .disabledAClass {
                &:hover {
                    cursor: not-allowed;
                }
            }

            .example {
                text-align: center;
                background: #ffffff;
                border-radius: 4px;
                margin-bottom: 20px;
                padding: 30px 50px;
                margin: 20px 0;
            }

        }

        .my-wallet-page {
            display: flex;
            justify-content: flex-end;
            margin-top: 24px;
        }

        .my-wallet-recharge-wrap {
            padding: 16px;
        }

        .my-wallet-recharge-cash {
            display: flex;
            flex-direction: column;
            padding: 16px;

            .ant-btn-lg {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 64px;
                font-size: 14px;
            }
        }

        .my-wallet-recharge-button {
            margin-bottom: 32px;
            display: flex;
            justify-content: flex-end;
        }

        .wallet-withdrawals-tips {
            padding-bottom: 24px;

            > span {
                font-size: 16px;
                color: #000000;
            }
        }

        /deep/ .my-wallet-recharge-form {
            height: 122px;
            width: 100%;

            .ant-form-item-control-wrapper {
                width: 100%;
            }

            /deep/ .ant-form-item-control {

                /deep/ .ant-form-item-children {
                    display: inline-flex;
                    justify-content: space-between;

                    input {
                        width: 392px;
                        height: 40px;
                    }

                    .ant-select-selection--single {
                        height: 40px;
                    }

                    .ant-select-selection__rendered {
                        height: 40px;
                    }

                    .ant-select-selection-selected-value {
                        line-height: 40px;
                    }
                }
            }

            .input-number-button {
                z-index: 600;
                position: relative;
                right: 64px;
                top: 0;

                .input-number-innerButton {
                    display: flex;
                    justify-content: center;
                    width: 64px;
                    height: 40px;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }
            }

        }

        .my-wallet-recharge-innerWrap {
            display: flex;
            justify-content: space-between;
            margin-bottom: 24px;
        }

        .my-wallet-recharge-reminder {
            display: flex;
            flex-direction: column;

            > span {
                display: block;
                line-height: 22px;
                color: rgba(0, 0, 0, 0.65);
            }
        }

        .my-wallet-recharge-left {

            width: 82%;

            .wallet-recharge-head {

                > span {
                    font-size: 16px;
                    color: rgba(0, 0, 0, 0.85);
                    line-height: 24px;
                }

                margin-bottom: 24px;
            }

            .wallet-recharge-corperation {
                position: relative;
                justify-content: space-between;
                font-size: 14px;
                display: flex;
                align-items: center;
                margin-bottom: 32px;

                > div {

                    > span {

                        &:nth-child(1) {
                            color: #2EA9DF;
                            margin: 0 16px;

                            &:hover {
                                cursor: pointer;
                            }
                        }
                    }
                }

            }

            .wallet-recharge-tips {
                font-size: 16px;
                color: rgba(0, 0, 0, 0.85);
                line-height: 24px;
            }
        }

        .my-wallet-recharge-right {
            display: flex;
            align-items: center;
            justify-content: center;
        }

    }

    .content-wallet-how {
        > span {
            color: rgba(0, 0, 0, 0.65);
            line-height: 22px;
            font-size: 14px;
        }
    }

    .wallet-head-icon-style {
        margin-right: 4px;
        color: #FFC32B;
    }

    .style-link-blue {
        color: #2ea9df
    }

    .style-link-white {
        color: white;
    }

    .text-align-right {
        text-align: right;
    }

    .word-wrap-style {
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        text-align: right;
    }

    .wallet-recharge-form-amount {
        width: 392px;
        margin-right: 18px;
        position: relative;
    }

    .wallet-recharge-form-address {
        width: 392px;
        margin-right: 0
    }


</style>

<style lang="less">

    .tipsClass {
        .tipBox {
            .wwwLogosItem {
                padding-bottom: 3px;
                border-bottom: 1px dashed #979797;
                width: auto;

                .wwwLogo {
                    height: 22px;
                }
            }
        }

        .ant-tooltip-arrow {
            border-bottom-color: #ffffff;
        }

        .ant-tooltip-inner {
            padding: 14px;
            background-color: #ffffff !important;

            .tipTitle {
                color: #333333;
                margin-bottom: 5px;
            }

            .propose {
                color:#999999;
            }

            .divider {
                margin: 10px 0;
            }
        }
    }
</style>

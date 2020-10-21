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
        <section id="mobile-my-wallet">
            <a-layout-content>
                <!-- 顶部我的钱包 -->
                <div class="content-wallet">
                    <div class="content-wallet-walllet">
                        <h2> {{$t('sider.sidebar_name_3')}} </h2>
                    </div>
                </div>
                <!-- 资产部分 -->
                <div class="content-wallet-assets">
                    <div class="wallet-assets-left">
                        <span> {{$t('indexWallet.mywallet_title_estimated')}} </span>
                        <span> {{ totalDiscount }} {{ totalDiscountSymbol }}</span>
                    </div>
                </div>
                <div class="content-wallet-icon">
                    <a-tooltip
                            trigger="click"
                            class="content-wallet-how"
                            overlayClassName="tipsClass"
                            placement="bottomLeft">
                        <a-icon type="question-circle" theme="filled" style="color: #FFC32B;margin-right: 0.04rem"/>
                        <span> {{$t('indexWallet.mywallet_title_howtoget')}} </span>
                        <div class="tipBox" slot="title">
                            <p class="tipTitle">{{$t('indexWallet.mywallet_popup_title_howtogetmain')}}</p>
                            <p class="tipTitle" v-if="updateTime !== 0">{{$t('indexWallet.mywallet_popup_title_time')}}{{updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
                            <a-divider class="divider"/>
                            <p class="tipTitle propose">{{$t('indexWallet.mywallet_popup_title_propose')}}</p>
                            <a-row type="flex" justify="space-between" align="middle">
                                <a-col :span="16" class="wwwLogosItem" style="text-align: right;"
                                       @click="tipsHrefTo('https://www.huobi.br.com')">
                                    <img class="wwwLogo" src="/content//huobi.jpg" alt="">
                                </a-col>
                                <a-col :span="8" class="wwwLogosItem"
                                       @click="tipsHrefTo('https://www.okex.com')">
                                    <img class="wwwLogo" src="/content//okcoin.png" alt="">
                                </a-col>
                            </a-row>
                        </div>
                    </a-tooltip>
                </div>
                <div class="content-wallet-assets">
                    <div class="wallet-assets-corperation">
                        <span>
                            <nuxt-link
                                    style="color: #2ea9df"
                                    :to="{path:'/mobile/user/UserCenter/TransactionRecord'}">
                                 {{$t('indexWallet.mywallet_btn_record')}}
                            </nuxt-link>
                        </span>
                        <a-button type="primary">
                            <nuxt-link
                                    :to="{path:'/mobile/user/UserCenter/AddressManagement'}">
                                {{$t('indexWallet.mywallet_btn_addrmanage')}}
                            </nuxt-link>
                        </a-button>
                    </div>
                </div>
                <!-- 动态数据部分 -->
                <div class="wallet-assets-dynamicDate"
                     v-for="(item,index) in analogData.data.list">
                    <!-- 表格 -->
                    <div class="wallet-assets-dynamicDate-table">
                        <table style="width: 100%">
                            <tr>
                                <td>
                                    <span class="limitWith"> {{$t('indexWallet.mywallet_table_title_currency')}} : </span>
                                </td>
                                <td>
                                    <span class="limitWith"> {{ item.currency }} </span>
                                </td>
                                <td>
                                    <div class="wallet-assets-dynamicDate-corporation">
                                        <!-- 充值 -->
                                        <span
                                                v-show="item.rechargeDisable === '0' ? false:true "
                                                @click="toRecharge(item.accountId, item)">
                                                 {{$t('indexWallet.mywallet_deposit_btn_deposit')}}
                                          </span>
                                        <span
                                                v-show="item.rechargeDisable === '0' ? true:false "
                                                style="color: #d1d1d1;margin-right: 8px;">
                                                 {{$t('indexWallet.mywallet_deposit_btn_deposit')}}
                                        </span>
                                        <!-- 提现 -->
                                        <span
                                                v-show="item.withdrawDisable === '0' ? false:true "
                                                @click="toCash(item.accountId, item)">
                                                {{$t('indexWallet.mywallet_btn_withdraw')}}
                                         </span>
                                        <span
                                                style="color: #d1d1d1;"
                                                v-show="item.withdrawDisable === '0' ? true:false ">
                                                {{$t('indexWallet.mywallet_btn_withdraw')}}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><span class="limitWith">{{$t('indexWallet.mywallet_table_title_available')}}：</span>
                                </td>
                                <td><span class="limitWith">{{ item.balance }}</span></td>
                            </tr>
                            <tr>
                                <td><span class="limitWith">{{$t('indexWallet.mywallet_table_title_freeze')}}：</span>
                                </td>
                                <td><span class="limitWith">{{ item.freezBalance }}</span></td>
                            </tr>
                            <tr>
                                <td><span
                                        class="limitWith">{{$t('indexWallet.mywallet_table_title_lockposition')}}：</span>
                                </td>
                                <td><span class="limitWith">{{ item.contractLockBalance }}</span></td>
                            </tr>
                            <tr>
                                <td><span class="limitWith">{{$t('indexWallet.mywallet_table_title_valuation')}}：</span>
                                </td>
                                <td><span class="limitWith">{{ item.valuation.value }} {{ item.valuation.symbol}}</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <!-- 展开区域 （ 充值 ） -->
                    <div
                            v-show="handle.isShowRecharge === item.accountId"
                            class="table-receipt-address-wrap">
                        <!-- 地址 -->
                        <div class="dynamicDate-table-receipt-address">
                            <div class="table-receipt-address-head">
                                <span> {{$t('indexWallet.mywallet_deposit_title_address')}} </span>
                            </div>
                            <div class="table-receipt-copy">
                                <span id="copy"
                                      @click="copytips"
                                      :data-clipboard-text="item.walletAddr">
                                    {{ item.walletAddr }}
                                </span>
                                <a-icon type="copy" style="color: #2EA9DF;"/>
                            </div>
                        </div>
                        <!-- 操作 -->
                        <div class="dynamicDate-corperation">
                            <div>
                                <a-button
                                        @click="showQrcode(item.walletAddr)"
                                        style="margin-right: 0.16rem">
                                    <a-icon type="qrcode"/>
                                    {{$t('indexWallet.mywallet_popup_title_QR_code')}}
                                </a-button>
                            </div>
                            <div>
                                <a-tooltip
                                        trigger="click"
                                        class="content-wallet-how"
                                        overlayClassName="tipsClass"
                                        placement="bottom"
                                        :getPopupContainer='(triggerNode) => triggerNode.parentNode'
                                >
                                    <a-button type="primary">
                                        <a-icon type="credit-card"/>
                                        {{$t('indexWallet.mywallet_btn_recharge')}}
                                    </a-button>
                                    <div class="tipBox" slot="title">
                                        <p class="tipTitle">{{$t('indexWallet.mywallet_popup_title_howtogetmain')}}</p>
                                        <p class="tipTitle" v-if="updateTime !== 0">{{$t('indexWallet.mywallet_popup_title_time')}}{{updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
                                        <a-divider class="divider"/>
                                        <p class="tipTitle propose">{{$t('indexWallet.mywallet_popup_title_propose')}}</p>
                                        <a-row type="flex" justify="space-between" align="middle">
                                            <a-col :span="16" class="wwwLogosItem" style="text-align: right;">
                                                <a href="javascript:;" class="link-out"
                                                   @click="tipsHrefTo('https://www.huobi.br.com')">
                                                    <img class="wwwLogo" src="/content//huobi.jpg" alt="">
                                                </a>
                                            </a-col>
                                            <a-col :span="8" class="wwwLogosItem">
                                                <a href="javascript:;" class="link-out"
                                                   @click="tipsHrefTo('https://www.okex.com')">
                                                    <img class="wwwLogo" src="/content//okcoin.png" alt="">
                                                </a>
                                            </a-col>
                                        </a-row>
                                    </div>
                                </a-tooltip>
                            </div>
                        </div>
                        <!-- 温馨提示 -->
                        <div class="wallet-assets-warm-tips">
                            <div class="wallet-assets-warm-head">
                                <h2>
                                    {{i18nTransformation($t('indexWallet.mywallet_recharge_tips_title'),[item.currency])}} </h2>
                            </div>
                            <div class="wallet-assets-warm-list">
                                <ul>
                                    <li>
                                        {{i18nTransformation($t('indexWallet.mywallet_deposit_tips_1'),[item.rechargetLimitDown,
                                        item.currency, item.currency])}}
                                    </li>
                                    <li> {{$t('indexWallet.mywallet_deposit_tips_2')}}</li>
                                    <li> {{$t('indexWallet.mywallet_deposit_tips_3')}}</li>
                                    <li> {{$t('indexWallet.mywallet_deposit_tips_4')}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- 展开区域 （ 提现 ） -->
                    <div
                            v-show="handle.isShowCash === item.accountId"
                            class="table-receipt-address-wrap">
                        <!-- 提现 -->
                        <div class="dynamicDate-table-receipt-Cash">
                            <a-form
                                    @submit="cashWithdrawalFun"
                                    :form="form">
                                <!-- 提现数量 -->
                                <a-form-item
                                        :validate-status="messageTip.statusAmount"
                                        :help="messageTip.helpAmount"
                                        class="table-receipt-cash-amount"
                                        :label=" $t('indexWallet.mywallet_title_withdrawalamount') ">
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
                                        class="table-receipt-cash-address"
                                        :label="$t('indexWallet.mywallet_title_withdrawaladdress')">
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
                                <!-- 提现手续费 -->
                                <a-form-item
                                        style="margin-bottom: 0.2rem"
                                        :label=" $t('indexWallet.mywallet_title_fee') ">
                                    <a-input-search
                                            disabled
                                            :placeholder="cashDate.serviceCharge"
                                            size="large">
                                        <a-button
                                                disabled
                                                slot="enterButton"> {{ cashDate.feeCur }}
                                        </a-button>
                                    </a-input-search>
                                </a-form-item>
                                <!-- 到账数量 -->
                                <a-form-item
                                        style="margin-bottom: 0.2rem"
                                        :label=" $t('indexWallet.mywallet_title_receiveamount') ">
                                    <a-input-search
                                            disabled
                                            :placeholder="cashDate.accountsArrived"
                                            size="large">
                                        <a-button
                                                disabled
                                                slot="enterButton"> {{ currency.name }}
                                        </a-button>
                                    </a-input-search>
                                </a-form-item>
                            </a-form>
                        </div>
                        <!-- 按钮 -->
                        <div class="dynamicDate-corperation">
                            <a-button
                                    :loading="disableButton"
                                    type="primary"
                                    @click="cashWithdrawalFun"> {{$t('indexWallet.mywallet_btn_withdraw')}}
                            </a-button>
                        </div>
                        <!-- 温馨提示 -->
                        <div class="wallet-assets-warm-tips">
                            <div class="wallet-assets-warm-head">
                                <h2>
                                    {{i18nTransformation($t('indexWallet.mywallet_recharge_tips_title'),[item.currency])}} </h2>
                            </div>
                            <div class="wallet-assets-warm-list">
                                <ul>
                                    <li>
                                        {{i18nTransformation($t('indexWallet.mywallet_withdraw_tips_1'),[item.withdrawLimitDown,
                                        item.currency, item.currency])}}
                                    </li>
                                    <li> {{$t('indexWallet.mywallet_withdraw_tips_2')}}</li>
                                    <li> {{$t('indexWallet.mywallet_withdraw_tips_3')}}</li>
                                    <li> {{$t('indexWallet.mywallet_withdraw_tips_4')}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 加载中 -->
                <div v-show="isLoading" class="wallet-loading">
                    <a-spin/>
                </div>
            </a-layout-content>
        </section>
        <fonter/>

        <!-- 模态框 -->
        <a-modal
                title=""
                width="91.5%!important"
                :centered="true"
                v-model="modal2Visible"
                :footer="null">
            <!-- 二维码 -->
            <div class="dialogQrcode">
                <qrcode :value="qrAddr"
                        :size="200">
                </qrcode>
                <p class="qrMsg"> {{$t('indexWallet.mywallet_deposit_title_address')}} </p>
            </div>
        </a-modal>
    </a-layout>
</template>

<script>
    import selectComponent from '~/pages/mobile/user/UserCenter/MyWallet/selectComponent'
    import {formatNumberCurrency, dcmAdd, maxLengthCheck, parseTime} from '~/assets/utils/index'
    import FsHead from '~/components/mobile/FangseaHeader'
    import qrcode from '~/components/computer/QrCode'
    import validate from '~/assets/utils/validate'
    import fonter from '~/components/mobile/Footer'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'
    import Clipboard from 'clipboard'

    export default {
        data () {
            return {
                // 首页高亮下标
                key: '0',
                // 表单布局模式
                formLayout: 'vertical',
                // 登录、注册导航下标
                type: 0,
                // 用户中心导航下标
                centerKey: 2,
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                modal2Visible: false,
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
                        pageNum: '',
                        // 每页条数
                        pageSize: '',
                        // 总条数
                        total: '',
                        // 总页数
                        pages: '',
                        list: []
                    }
                },
                // 提现数据
                cashDate: {
                    // 到账的数量
                    accountsArrived: '',
                    // 手续费
                    serviceCharge: '',
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
                // 用户输入的数值精度
                amount: '',
                // 总折合资产
                totalDiscount: 0,
                // 总折合资产币种
                totalDiscountSymbol: '',
                // 提现时间
                applyDate: '',
                // 当前展示二维码所需地址字符串
                qrAddr: '',
                // 控制如何获取加密货币tip显示
                showHowToGet: false,
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
                // 触发交易发现接口
                this.triggeringTransaction()
                this.listenI18n()
                // 初始化个人账户列表
                this.initalData()
                // 估值数据初始化
                this.initValuation()
                this.getTime()
            }
        },
        mounted () {
            setTimeout(() => {
                Bus.$emit('publicEvent', 'MYWALLET')
            }, 300)
        },
        methods: {
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
             *  查询我的钱包信息接口
             */
            initalData () {
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        pageNum: 1,
                        pageSize: 0
                    }
                }
                // 发送请求
                axios.post('/dc/wallet/account/info/query', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.isLoading = false
                            // 接收成功、赋值
                            this.analogData.data.list = res.data.data.list
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
             * 设置绑定的地址的值
             */
            setSelectData (data) {
                this.address = data
            },
            /**
             * 提现地址检查
             */
            checkAdressFun (validateStatus, help) {
                this.messageTip.statusAdress = validateStatus
                this.messageTip.helpAdress = help
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
             *  下一步事件
             */
            nextStep () {
                this.$router.push({
                    name: 'mobile-user-UserCenter-MyWallet-OrderSubmitted',
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
             * 显示二维码弹出窗
             */
            showQrcode (addr) {
                this.qrAddr = addr
                this.modal2Visible = true
            },
            // tips 点击图片跳转
            tipsHrefTo (www) {
                window.open(www)
            },
            /**
             * 动态数据国际化
             */
            i18nTransformation (_i18n, paramsArr) {
                return tool.intervariable(_i18n, paramsArr)
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

    .link-out {
        display: inline-block;
    }

    #mobile-my-wallet {
        background-color: #FFFFFF;
        padding: 0.2rem 0.16rem;
        min-height: calc(100vh - 1.26rem);

        .content-wallet {
            display: flex;
            justify-content: space-between;
        }

        .content-wallet-icon {
            margin-bottom: 0.2rem;
        }

        .content-wallet-walllet {

            > h2 {
                margin-bottom: 0;
                font-size: 18px;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.85);
                line-height: 26px;
                min-width: 1rem;
            }

        }

        .content-wallet-how {
            display: flex;
            align-items: center;

            > span {
                color: rgba(0, 0, 0, 0.65);
                line-height: 22px;
                font-size: 14px;
                display: flex;
                align-items: center;
            }

        }

        .content-wallet-assets {
            margin-bottom: 0.06rem;
            display: flex;
            justify-content: space-between;

            .wallet-assets-left {
                /*display: flex;*/
                /*flex-direction: column;*/

                > span {
                    &:nth-child(1) {
                        font-size: 14px;
                        color: rgba(0, 0, 0, 0.85);
                        line-height: 22px;
                    }

                    &:nth-child(2) {
                        font-size: 16px;
                        font-weight: 500;
                        color: rgba(0, 0, 0, 0.85);
                        line-height: 24px;
                    }
                }
            }

            .wallet-assets-corperation {
                align-items: center;

                > span {
                    margin-right: 0.16rem;
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(46, 169, 223, 1);
                    line-height: 22px;

                    &:hover {
                        cursor: pointer;
                    }
                }
            }

        }

        .wallet-assets-dynamicDate {
            margin-bottom: 0.16rem;
            box-shadow: 0px 1px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
            padding: 0.12rem 0.16rem;

            .wallet-assets-dynamicDate-head {
                color: rgba(0, 0, 0, 0.65);
                line-height: 22px;
                font-size: 14px;
                display: flex;
                justify-content: space-between;

            }

            .wallet-assets-dynamicDate-table {
                margin-bottom: 0.2rem;

                > table {

                    > tr {

                        > td {
                            font-size: 14px;
                            color: rgba(0, 0, 0, 0.85);
                            line-height: 22px;
                        }
                    }
                }

            }

            .table-receipt-address-wrap {
                .dynamicDate-table-receipt-address {
                    display: flex;
                    flex-direction: column;

                    .table-receipt-address-head {
                        margin-bottom: 0.16rem;

                        > span {
                            font-size: 16px;
                            font-weight: 400;
                            color: rgba(0, 0, 0, 0.85);
                            line-height: 24px;
                        }
                    }

                    .table-receipt-copy {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 0.2rem;

                        > span {
                            margin-right: 0.02rem;
                            display: inline-block;
                            word-break: break-all;
                        }
                    }
                }

                .dynamicDate-corperation {
                    margin-bottom: 0.28rem;
                    display: flex;
                    justify-content: flex-end;
                }

                .wallet-assets-warm-tips {

                    .wallet-assets-warm-head {

                        > h2 {
                            font-size: 16px;
                            font-weight: 400;
                            color: rgba(0, 0, 0, 0.85);
                            line-height: 24px;
                        }
                    }

                    .wallet-assets-warm-list {

                        > ul {
                            padding-left: 0;
                            list-style: none;

                            > li {
                                font-size: 14px;
                                font-weight: 400;
                                color: rgba(0, 0, 0, 0.65);
                                line-height: 22px;
                            }
                        }

                    }

                }
            }

            .dynamicDate-table-receipt-Cash {
                .ant-btn-lg {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 0.64rem;
                    font-size: 14px;
                }

                .input-number-button {
                    z-index: 600;
                    position: absolute;
                    right: 0px;
                    top: -0.12rem;

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

            .wallet-assets-dynamicDate-type {
                width: 100%;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.85);
                line-height: 22px;
                display: flex;

                > span {
                    display: flex;
                    align-items: center;

                    > img {
                        margin-right: 0.03rem;
                        width: 0.16rem;
                        height: 0.16rem;
                    }
                }
            }

            .wallet-assets-dynamicDate-corporation {
                display: flex;
                justify-content: flex-end;
                color: rgba(46, 169, 223, 1);
                line-height: 22px;

                > span {
                    &:nth-child(1) {
                        margin-right: 0.16rem;
                    }
                }
            }
        }
    }

    // 二维码弹窗
    .dialogQrcode {
        padding: 61px;
        text-align: center;

        .qrMsg {
            margin-bottom: 0;
        }
    }

    .table-receipt-cash-amount {
        margin-bottom: 0.2rem
    }

    .table-receipt-cash-address {
        margin-right: 0;
        margin-bottom: 0.2rem
    }

    .wallet-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 5.1rem
    }
</style>
<style lang="less">
    .tipsClass {
        .tipBox {
            .wwwLogosItem {
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

    .limitWith {
        display: inline-block;
        width: 1rem;
        word-wrap: break-word;
    }

    .loadingClass {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100%;
    }
</style>

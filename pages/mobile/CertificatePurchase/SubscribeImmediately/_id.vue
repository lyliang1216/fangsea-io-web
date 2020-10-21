<template>
    <a-layout id="components-layout-mobile-top" class="layout" :class="drawer">
        <fs-head :SelectedKey="key"
                 :SelectedType="type"
                 :centerKey="centerKey"
                 @openDrawer="openDrawer"
                 @closeDrawer="closeDrawer"/>
        <section class="section">
            <div class="container">
                <a-layout-content >
                    <div class="content">
                        <div class="content-title-buying-wrap">
                            <!-- 正在认购 -->
                            <div class="content-title-buying">
                                <span>{{ $t('SubscribeImmediately.subscribeImmediately_content_title') }}</span>
                                <span>{{data.ptCurCode}}</span>
                            </div>
                            <!-- 倒计时 -->
                            <div class="content-title-count-down" id="tooltip">
                                <div class="content-title-count-downLeft">
                                    <span>1</span>
                                    <span>PT</span>
                                    <span>=</span>
                                    <span>{{ data.exchangeRate }}</span>
                                    <span>{{data.curCode}}</span>
                                </div>
                                <a-tooltip
                                        :getPopupContainer="getPopupContainer"
                                        trigger="click"
                                        overlayClassName="countdown-prompt-information-mobile"
                                        placement="bottomRight" >
                                    <div class="content-title-count-downRight">
                                        <span style="color: #888888">{{ $t('SubscribeImmediately.subscribeImmediately_content_count_down') }}</span>
                                        <span>{{countDown}}s</span>
                                        <a-icon  style="color: #BBBBBB" type="info-circle" />
                                    </div>
                                    <div class="tipBox" slot="title">
                                        <p class="tipTitle">
                                            {{ $t('SubscribeImmediately.subscribeImmediately_project_desc') }}
                                        </p>
                                    </div>
                                </a-tooltip>
                            </div>
                        </div>
                        <!-- 认购信息 -->
                        <div class="subscription-information">
                            <div class="subscription-information-balance">
                                <span>{{i18nTransformation($t('SubscribeImmediately.subscribeImmediately_middle_balancen'), [data.curCode])}}</span>
                                <span>{{data.userBalance | formatNumber}}</span>
                            </div>
                            <div class="subscription-information-subscribable">
                                <span>{{ $t('SubscribeImmediately.subscribeImmediately_content_pt_buy') }}</span>
                                <div class="subscription-information-innerWorld">
                                    <span>{{data.userMinAmount | formatNumber}}</span>
                                    <span>-</span>
                                    <span>{{data.userMaxAmount | formatNumber}}</span>
                                </div>
                            </div>
                        </div>
                        <!-- 购买 -->
                        <div class="error-prompt-msg-wrap">
                            <div class="error-prompt-msg">
                                <span v-show="showMsg">{{errorMsg}}</span>
                            </div>
                            <div :class="showMsg === true ? 'computedClassInoutError' : 'computedClassInoutNormal'" class="purchase-operation">
                                <div class="purchase-operation-buy">
                                    <span>{{ $t('SubscribeImmediately.subscribeImmediately_project_buy') }}</span>
                                </div>
                                <div class="purchase-operation-input">
                                    <input
                                            @focus="onfocusFun"
                                            @change="checkInputFun"
                                            type="number"
                                            v-model="number"
                                            @blur="checkNumberBlurFun">
                                    <span>PT</span>
                                </div>
                                <div class="purchase-operation-input-clear"
                                     @click="eliminateFun"
                                     v-show="eliminate">
                                    <span><a-icon style="color: #BBBBBB" type="close-circle" /></span>
                                </div>
                            </div>
                        </div>
                        <!-- 扣除的金额 -->
                        <div class="amount-deducted">
                            <span>{{ $t('SubscribeImmediately.subscribeImmediately_middle_calculation') }}</span>
                            <div class="amount-deducted-rightWord">
                                <span>{{businessDeduction | formatNumber}}</span>
                                <span>{{data.curCode}}</span>
                            </div>
                        </div>
                        <!-- 认购按钮 -->
                        <div>
                            <a-button
                                    @click="buyPto"
                                    :disabled="disabledProtocol"
                                    :loading="flag"
                                    type="primary"
                                    class="purchase-operation-button">
                                {{ $t('SubscribeImmediately.subscribeImmediately_content_button') }}
                            </a-button>
                        </div>
                    </div>
                    <a-modal
                            v-model="userVisible"
                            :title="$t('SubscribeImmediately.subscribeImmediately_project_protocol')"
                            :centered="true"
                            :closable="false"
                            :keyboard="false"
                            :maskClosable="false"
                            class="subscribe-immediately-modal">
                        <template slot="footer">
                            <a-button
                                    type="primary" @click="closeUserClose">
                                {{ $t('SubscribeImmediately.subscribeImmediately_protocol_accept') }}
                            </a-button>
                        </template>
                        <p v-html="userAgreement"></p>
                    </a-modal>
                </a-layout-content>
            </div>
        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import {formatNumber, formatNumberAuto, formatNumberDecimal, multiplicateAndRectifyUpwards, parseintFun, filteZeroFun} from '~/assets/utils/index'
    import Breadcrumb from '~/components/mobile/Breadcrumb'
    import FsHead from '~/components/mobile/FangseaHeader'
    import {removeSpaces} from '~/assets/utils/rules'
    import fonter from '~/components/mobile/Footer'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import axios from '~/plugins/axios'

    export default {
        /**
         * 服务端并发请求数据
         */
        asyncData ({req, error}) {
            if (process.server) {
                let data = {traceId: tool.UUID(), data: {app: 'pto', key: 'pto.invest.subscription_agreement'}}
                return axios.post(`${tool.getAddress(req)}/cms/config/query`, data)
                    .then(res => {
                        if (res.data.code.toString() === '0' && res.data.data) {
                            return {licenseVisible: res.data.data.isUse, userAgreement: res.data.data.value}
                        }
                    })
                    .catch(e => {
                        error({ statusCode: 500, message: e.toString() })
                    })
            }
        },
        data () {
            return {
                // 登录、注册导航下标
                type: 0,
                // 首页导航下标
                key: 3,
                // 用户中心导航下标
                centerKey: 0,
                // 抽屉切换动画
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 面包屑数据
                routes: [],
                // 显示认购协议窗口
                userVisible: false,
                // 用户协议内容
                userAgreement: '',
                // 显示认购协议
                licenseVisible: false,
                // 认购按钮禁用
                disabledProtocol: true,
                // 立即认购等待
                flag: false,
                // 当前份数
                value: 1,
                // 当前项目ID
                projectId: 0,
                // 确认信息
                data: {
                    number: 0,
                    ptPrice: 0,
                    priceCurCode: '-',
                    surplusAmount: 0,
                    userBalance: 0,
                    curCode: '',
                    exchangeRate: 0,
                    // 单人最低认购数量
                    userMinAmount: 0,
                    // 单人最高认购数量
                    userMaxAmount: 0
                },
                // PTO份数
                number: '',
                // 汇率倒计时
                countDown: 0,
                // 保存计时
                priceLockTime: 1,
                // FST汇率
                exchangeRate: 0,
                // 币种精度
                curLeng: 0,
                // 提示信息显示与隐藏
                showMsg: false,
                // 错误提示信息
                errorMsg: '',
                // 本次交易扣除
                businessDeduction: 0,
                // 清楚图标
                eliminate: false,
                // 倒计时
                setIntervalCD: ''
            }
        },
        created () {
            if (process.client) {
                this.initInfo()
                this.listenI18n()
                this.getProjectId()
                this.initBreadcrumb()
                if (this.userAgreement === '') {
                    this.queryExceptions('pto.invest.subscription_agreement')
                }
            }
        },
        watch: {
            number: 'numberChanged'
        },
        methods: {
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.initBreadcrumb()
                    this.queryExceptions('pto.invest.subscription_agreement')
                    this.checkNumberBlurFun()
                })
            },
            /**
             * 初始化面包屑国际化
             */
            initBreadcrumb () {
                this.routes = [
                    {
                        path: '/mobile',
                        breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_home')
                    },
                    {
                        path: '/mobile/CertificatePurchase',
                        breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts')
                    },
                    {
                        path: `/mobile/CertificatePurchase/info/${this.$route.params.id}`,
                        breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts_info')
                    },
                    {
                        path: '/mobile/CertificatePurchase/SubscribeImmediately',
                        breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts_buy')
                    }
                ]
            },
            /**
             * 获取动态路由ID
             */
            getProjectId () {
                this.projectId = this.$route.params.id
            },
            /**
             *  查询确认信息
             */
            initInfo () {
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        projectId: parseInt(this.$route.params.id)
                    }
                }
                axios
                    .post('/pto/invest/buy/before/query', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.data = res.data.data
                            this.curLeng = res.data.data.curLeng
                            this.countDown = res.data.data.priceLockTime
                            this.priceLockTime = res.data.data.priceLockTime
                            this.countdown()
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 查询认购协议
             * @param key 查询关键字
             */
            queryExceptions (key) {
                let data = {traceId: tool.UUID(), data: {app: 'pto', key: key}}
                axios
                    .post('/cms/config/query', data)
                    .then(res => {
                        if (res.data.code.toString() === '0' && res.data.data) {
                            this.licenseVisible = res.data.data.isUse
                            this.userAgreement = res.data.data.value
                        } else {
                            this.licenseVisible = false
                            this.userAgreement = ''
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 倒计时
             */
            countdown () {
                this.setIntervalCD = setInterval(() => {
                    if (this.countDown > 1) {
                        this.countDown--
                    } else {
                        this.countDown = this.priceLockTime
                        clearInterval(this.setIntervalCD)
                        this.initInfo()
                    }
                }, 1000)
            },
            /**
             * @param key 刷新汇率
             */
            updateExchangeRate () {
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        legalCurId: this.data.curId,
                        legalCurCode: this.data.priceCurCode,
                        encCurCode: this.data.curCode
                    }
                }
                axios
                    .post('/pto/invest/exchange/rate/query', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.data.exchangeRate = res.data.data.exchangeRate
                            this.data.nowTime = res.data.data.nowTime
                            this.countdown()
                        } else {
                            setTimeout(() => {
                                this.updateExchangeRate()
                            }, 5000)
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        setTimeout(() => {
                            this.updateExchangeRate()
                        }, 5000)
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 认购
             */
            buyPto () {
                // 隐藏清除图标
                this.eliminate = false
                // 校验
                if (!this.disabledProtocol) {
                    // 初始化提示信息
                    this.showMsg = false
                    this.msg = ''
                    this.disabledProtocol = true
                    this.flag = true
                    let data = {
                        traceId: tool.UUID(),
                        data: {
                            projectId: this.projectId,
                            openPageTime: this.data.nowTime,
                            exchangeRate: this.data.exchangeRate,
                            amount: removeSpaces(this.number)
                        }
                    }
                    axios
                        .post('/pto/invest/buy', data)
                        .then(res => {
                            this.disabledProtocol = false
                            if (res.data.code.toString() === '0') {
                                let payNumber = formatNumberDecimal(this.number, this.data.exchangeRate)
                                // 项目编号
                                sessionStorage.setItem('curCode', this.data.curCode)
                                sessionStorage.setItem('number', this.data.ptCurCode)
                                sessionStorage.setItem('projectId', this.projectId)
                                sessionStorage.setItem('buyNumber', this.number)
                                sessionStorage.setItem('payNumber', payNumber)
                                this.$router.push(`/mobile/CertificatePurchase/ImmediatelySuccess/${this.projectId}`)
                            } else {
                                this.flag = false
                                this.disabledProtocol = false
                                this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                            }
                        })
                        .catch(err => {
                            this.flag = false
                            this.disabledProtocol = false
                            this.$message.error(this.$t(err.message))
                        })
                }
            },
            // 是否同意协议
            changeProtocol (e) {
                this.disabledProtocol = !e.target.checked
            },
            // 显示协议窗口
            showUserClose () {
                this.userVisible = true
            },
            // 关闭协议窗口
            closeUserClose () {
                this.userVisible = false
            },
            // 改变份数，结算货币
            onChange (value) {
                console.log('changed', value)
            },
            // 开启右侧抽屉导航
            openDrawer () {
                this.drawer = {'drawer-containel-left': true, 'drawer-containel-right': false}
            },
            // 关闭右侧抽屉导航
            closeDrawer () {
                this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': true}
                let _this = this
                setTimeout(function () {
                    _this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': false}
                }, 200)
            },
            /**
             * 输入框的改变事件
             */
            numberChanged () {
                // 处理number的值
                this.number = parseintFun(this.number, this.data.userMaxAmount)
                this.businessDeduction = multiplicateAndRectifyUpwards(parseintFun(this.number), this.data.exchangeRate, this.curLeng)
                // 错误信息处理
                if (this.number > this.data.userMaxAmount) {
                    // 错误信息提示
                    this.showMsg = true
                    this.errorMsg = this.$t('SubscribeImmediately.subscribeImmediately_user_max_amount') + this.data.userMaxAmount + 'PT'
                    // 提现按钮活跃
                    this.disabledProtocol = true
                } else {
                    // 错误信息提示
                    this.showMsg = false
                    this.errorMsg = ''
                    // 提现按钮活跃
                    this.disabledProtocol = false
                }
            },
            /**
             * input 框的改变事件
             */
            checkNumberFun () {
                // 初始化错误信息
                this.showMsg = false
                this.msg = ''
            },
            /**
             * 获取焦点事件
             */
            onfocusFun () {
                this.eliminate = true
            },
            /**
             * 输入框的值得改变事件
             */
            checkInputFun () {},
            /**
             * 失去焦点事件
             */
            checkNumberBlurFun () {
                // 错误信息处理
                if (this.number > this.data.userMaxAmount) {
                    // 错误信息提示
                    this.showMsg = true
                    this.errorMsg = this.$t('SubscribeImmediately.subscribeImmediately_user_max_amount') + this.data.userMaxAmount + 'PT'
                    // 提现按钮置灰
                    this.disabledProtocol = true
                } else if (this.number < this.data.userMinAmount) {
                    // 错误信息提示
                    this.showMsg = true
                    this.errorMsg = this.$t('SubscribeImmediately.subscribeImmediately_user_lower_amount') + this.data.userMinAmount + 'PT'
                    // 提现按钮置灰
                    this.disabledProtocol = true
                } else {
                    // 错误信息提示
                    this.showMsg = false
                    this.errorMsg = ''
                    // 提现按钮活跃
                    this.disabledProtocol = false
                }
            },
            /**
             * 点击清除输入框的内容
             */
            eliminateFun () {
                this.eliminate = false
                this.number = ''
            },
            /**
             * tooltip 默认渲染的节点
             * @param trigger 节点参数
             * @returns {HTMLElement} DOM 元素
             */
            getPopupContainer (trigger) {
                return trigger.parentElement
            },
            /**
             * 动态数据国际化
             */
            i18nTransformation (_i18n, paramsArr) {
                return tool.intervariable(_i18n, paramsArr)
            }
        },
        filters: {
            formatNumber,
            formatNumberAuto,
            formatNumberDecimal,
            filteZeroFun
        },
        beforeDestroy () {
            Bus.$off('checkLange')
            clearInterval(this.setIntervalCD)
        },
        components: {
            FsHead,
            fonter,
            Breadcrumb
        },
        head () {
            return {
                title: this.$t('PageTitle.subscribenow_pagetitle')
            }
        }
    }
</script>

<style lang="less">
    .subscribe-immediately-modal {
        max-height: 3.78rem;
        min-width: 3.43rem !important;
        max-width: 3.43rem !important;

        .ant-modal-body {
            min-height: 2.58rem;
            max-height: 2.58rem;
            overflow-y: auto;
        }

        .ant-modal-footer {
            padding: 0.2rem 0.24rem;
        }
    }

    .countdown-prompt-information-mobile{

        .ant-tooltip {
        }

        .tipBox{
        }
        .ant-tooltip-arrow{
            border-bottom-color: #ffffff;
        }

        .ant-tooltip-content {}

        .ant-tooltip-inner{
            padding: 0.1rem 0.19rem 0.1rem 0.28rem ;
            background-color: #ffffff!important;
            .tipTitle{
                color: #333333;
                margin-bottom: 0;
            }
        }

        .ant-tooltip-arrow {
            border-right-color: #ffffff;
        }
    }
</style>

<style lang="less" scoped>
    @red: #e02020;

    .section {
        min-height: calc(100vh - 292px)!important;
        background: #ffffff;

        .container {
            margin: 0 auto;

            .content {
                padding: 0.2rem 0.16rem !important;

                .tags-title {
                    text-align: center;
                    font-size: 20px;
                    color: rgba(47, 170, 224, 1);
                    letter-spacing: 2px;
                }

                .protocol-row {
                    margin-bottom: 0.24rem;

                    /deep/ .ant-checkbox-wrapper {
                        font-size: 16px;
                    }
                }

                .info-body {
                    margin-bottom: 0.22rem;
                    margin-top: 0.2rem;
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    letter-spacing: 2px;

                    .info-p {
                        margin-top: 0.1rem;
                        font-size: 14px;
                        font-weight: 400;
                        color: rgba(153, 153, 153, 1);
                    }

                    .ant-divider-horizontal {
                        margin: 0.08rem 0;
                    }

                    .info-value {
                        float: right;
                    }

                    .count-down {
                        font-size: 16px;
                        font-weight: 400;
                        color: @red;
                    }

                    /deep/ .ant-input-number-input {
                        font-size: 16px;
                        color: rgba(51, 51, 51, 1);
                    }

                    /deep/ .ant-checkbox-wrapper {
                        font-size: 16px;
                    }

                    .mg-bm-8 {
                        margin-bottom: 0.08rem;
                    }
                }

                .login-form-button {
                    margin-top: 0.08rem;
                    height: 0.34rem;
                    border-radius: 8px;
                    width: 100%;
                    font-size: 16px;
                    line-height: 0;
                }

                .count-down-col {
                    display: flex;
                    width: 2.2rem;
                    margin: 0 auto 0.32rem;
                    float: none;

                    .count-down-desc {
                        font-size: 12px;
                        color: #888888;
                        letter-spacing: 1px;
                        width: 1.96rem;
                        margin-top: 0.04rem;
                        margin-left: 0.05rem;
                    }

                    .icon {
                        margin: 4px 2px 0 6px;
                    }
                }

                .pay-number {
                    font-size: 22px;
                    color: rgba(51, 51, 51, 1);
                    letter-spacing: 2px;
                }

                .balance-number {
                    color: #2FAAE0;
                    font-size: 16px;
                    font-weight: 400;
                    letter-spacing: 2px;
                }
            }

            .content-title-buying-wrap {
                padding: 0 15px ;
            }

            .content-title-buying {
                margin-bottom: 0.09rem;
                display: flex;
                height:12px;
                font-size:12px;
                color:rgba(0,0,0,1);
                line-height:12px;
            }

            .content-title-count-down {
                width: 100%;
                margin-bottom: 0.45rem;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .content-title-count-downLeft {
                    width: 50%;
                    > span {
                        &:nth-child(1) {
                            height:21px;
                            font-size:21px;
                            font-weight:500;
                            color:rgba(0,0,0,1);
                            line-height:21px;
                        }
                        &:nth-child(2) {
                            height:14px;
                            color:#888888;
                            line-height:14px;
                        }
                        &:nth-child(3) {
                            height:14px;
                            font-size:14px;
                            color:rgba(0,0,0,1);
                            line-height:14px;
                        }
                        &:nth-child(4) {
                            height:21px;
                            font-size:21px;
                            font-weight:500;
                            color:rgba(0,0,0,1);
                            line-height:21px;
                        }
                        &:nth-child(5) {
                            height:14px;
                            color:#888888;
                            line-height:14px;
                        }
                    }
                }

                .content-title-count-downRight {
                    width: 50%;
                    padding: 0.03rem 0.15rem;
                    background:#e1e1e1;
                    border-radius:44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    > span {
                        &:nth-child(1){
                            margin-right: 5px;
                            font-size:12px;
                            color:#888888;
                        }
                        &:nth-child(2){
                            margin-right: 5px;
                            font-weight:500;
                            color:rgba(255,48,73,1);
                        }
                    }

                }

                > div{
                    &:nth-child(3) {
                        position: absolute;
                        top: 0px;
                        left: -96px;
                        dth: 100%;
                    }
                }
            }

            .subscription-information {
                margin-bottom: 0.15rem;
                padding: 0 15px;
                .subscription-information-balance {
                    margin-bottom: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    > span {
                      &:nth-child(1){
                          font-weight:300;
                          color:#B5B5B5;
                      }
                      &:nth-child(2){
                          height:21px;
                          font-size:18px;
                          color:rgba(0,0,0,1);
                          line-height:21px;
                      }
                    }
                }
                .subscription-information-subscribable {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    > span {
                        &:nth-child(1){
                            font-weight:300;
                            color:#B5B5B5;
                        }
                    }

                    .subscription-information-innerWorld {
                        display: flex;
                        align-items: center;
                        height:21px;
                        font-size:18px;
                        color:rgba(0,0,0,1);
                        line-height:21px;
                    }
                }

            }

            .error-prompt-msg-wrap {
                padding: 0 0.15rem;
                display: flex;
                flex-direction: column;

                .error-prompt-msg {
                    height: 14px;
                    line-height: 14px;
                    color:rgba(255,48,73,1);
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    margin-bottom:10px;
                }
            }

            .purchase-operation {
                padding: 0 0.15rem;
                display: flex;
                align-items: center;
                margin-bottom: 14px;
                width: 100%;
                height:0.65rem;
                border-radius:0px 0px 8px 8px;

                .purchase-operation-buy {
                    width: 20%;
                    font-size:19px;
                    color:rgba(0,0,0,0.8);
                }

                .purchase-operation-buy-wrap {
                    display: flex;
                    align-items: center;
                }

                .purchase-operation-input {
                    width: 80%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    > input {
                        width: 80%;
                        outline: none;
                        border: none;
                        text-align: right;
                        font-size:24px;
                        font-weight:500;
                        color:rgba(11,164,232,1);
                        line-height:24px;
                        background: fixed;
                    }
                    > span {
                        height:24px;
                        font-size:24px;
                        font-weight:500;
                        color:rgba(46,169,223,1);
                        line-height:24px;
                    }
                }

                .purchase-operation-input-clear {
                    margin-left: 0.1rem;
                    color: #99a5ab;
                    font-size: 24px;
                }
            }

            .computedClassInoutNormal {
                background:rgba(46,169,223,0.1);
                border: transparent;
            }

            .computedClassInoutError {
                background: #FF30491A;
                border:1px solid #FF3049FF;
            }

            .amount-deducted {
                margin-bottom: 0.33rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 15px;

                > span {
                    display: block;
                    width: 50%;
                    height:14px;
                    font-weight:300;
                    color:#B5B5B5;
                    line-height:14px;
                }

                .amount-deducted-rightWord {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    width: 50%;
                    height:21px;
                    font-size:18px;
                    color:rgba(255,48,73,1);
                    line-height:21px;
                }
            }

            .purchase-operation-button {
                width:100%;
                height:0.4rem;
            }
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
        input::-webkit-input-placeholder,textarea::-webkit-input-placeholder{
            font-size: 16px;
            color:#888888;
        }

        input:-moz-placeholder,textarea:-moz-placeholder{
            font-size: 16px;
            color:#888888;
        }

        input::-moz-placeholder,textarea::-moz-placeholder{
            font-size: 16px;
            color:#888888;
        }
        input:-ms-input-placeholder,textarea:-ms-input-placeholder{
            font-size: 16px;
            color:#888888;
        }
    }
</style>

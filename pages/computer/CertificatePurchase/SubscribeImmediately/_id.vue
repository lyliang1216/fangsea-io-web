<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key" :SelectedType="type"/>
        <section class="section">
            <div class="container">
                <a-layout-content>
                    <!-- 汉堡菜单 -->
                    <Breadcrumb :routes="routes"/>
                    <div class="content-img">
                        <!-- 左侧操作菜单栏 -->
                        <div class="operating-menu-bar">
                            <div class="tags-title">{{ $t('SubscribeImmediately.subscribeImmediately_tags_title') }}</div>
                            <div class="operating-menu-content">
                                <!-- 顶部部分 -->
                                <div class="operating-menu-content-wrapTop">
                                    <div class="operating-menu-content-title">{{ $t('SubscribeImmediately.subscribeImmediately_content_title') }} {{data.ptCurCode}}</div>
                                    <div class="transaction-content-and-time">
                                        <div class="transaction-content">
                                            <div>
                                                <span>1</span>
                                                <span>PT</span>
                                                <span>=</span>
                                                <span>{{ data.exchangeRate }}</span>
                                                <span>{{data.curCode}}</span>
                                            </div>
                                            <div class="count-down">{{countDown}}s</div>
                                        </div>
                                        <div class="transaction-and-time">
                                            <span>{{ $t('SubscribeImmediately.subscribeImmediately_content_change') }}</span>
                                            <a-tooltip
                                                    trigger="click"
                                                    class="content-wallet-how"
                                                    overlayClassName="countdown-prompt-information"
                                                    placement="rightBottom">
                                                <div>
                                                    <span style="color: #888888;margin-right: 5px">{{ $t('SubscribeImmediately.subscribeImmediately_content_count_down') }}</span>
                                                    <a-icon  style="color: #888888" type="info-circle" />
                                                </div>
                                                <div class="tipBox" slot="title">
                                                    <p class="tipTitle">
                                                        {{ $t('SubscribeImmediately.subscribeImmediately_project_desc') }}
                                                    </p>
                                                </div>
                                            </a-tooltip>
                                        </div>
                                    </div>
                                </div>
                                <!-- 中部部分 -->
                                <div class="operating-menu-content-middle">
                                    <!-- 顶部交易信息 -->
                                   <div class="menu-content-middle-wrap">
                                       <div class="menu-content-middle-balance">
                                           <span>{{i18nTransformation($t('SubscribeImmediately.subscribeImmediately_middle_balancen'), [data.curCode])}}</span>
                                           <span>{{data.userBalance | formatNumber}}</span>
                                       </div>
                                       <div class="menu-content-middle-subscribable">
                                           <span>{{ $t('SubscribeImmediately.subscribeImmediately_content_pt_buy') }}</span>
                                           <div class="menu-content-middle-instyle">
                                               <span>{{data.userMinAmount | formatNumber}}</span>
                                               <span>-</span>
                                               <span>{{data.userMaxAmount | formatNumber}}</span>
                                           </div>
                                       </div>
                                   </div>
                                    <!-- 分割线 -->
                                    <div class="menu-content-middle-divider">
                                        <a-divider/>
                                    </div>
                                    <!-- 扣除计算 -->
                                    <div class="menu-content-middle-calculation">
                                        <div>{{ $t('SubscribeImmediately.subscribeImmediately_middle_calculation') }}</div>
                                        <div>
                                            <span>{{businessDeduction | formatNumber}}</span>
                                            <span>{{data.curCode}}</span>
                                        </div>
                                    </div>
                                    <!-- 计算 -->
                                    <div class="menu-content-middle-input">
                                        <!-- 错误提示 -->
                                        <div class="error-prompt-msg">
                                                <transition name="fade">
                                                    <span v-show="showMsg">{{errorMsg}}</span>
                                                </transition>
                                        </div>
                                        <div class="menu-content-middle-wrap">
                                            <div class="menu-content-middle-inputLeft">{{ $t('SubscribeImmediately.subscribeImmediately_project_buy') }}</div>
                                            <div
                                                    :class="showMsg === true ? 'computedClassInoutError' : 'computedClassInoutNormal'"
                                                    class="menu-content-middle-inputRight">
                                                <input
                                                        @change="checkInputFun"
                                                        :placeholder="placeholderWord"
                                                        type="number"
                                                        v-model="number"
                                                        @blur="checkNumberBlurFun"
                                                       >
                                                </input>
                                                <span>PT</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--低部按钮 -->
                                <div class="operating-menu-content-buttonWrap">
                                    <a-button
                                            @click="buyPto"
                                            :disabled="disabledProtocol"
                                            :loading="flag"
                                            type="primary"
                                            class="operating-menu-content-button">
                                        {{ $t('SubscribeImmediately.subscribeImmediately_content_button') }}
                                    </a-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-layout-content>
            </div>
        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import {formatNumber, formatNumberAuto, formatNumberDecimal, multiplicateAndRectifyUpwards, parseintFun, filteZeroFun} from '~/assets/utils/index'
    import Breadcrumb from '~/components/computer/Breadcrumb'
    import FsHead from '~/components/computer/FangseaHeader'
    import fonter from '~/components/computer/Footer'
    import {removeSpaces} from '~/assets/utils/rules'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import axios from '~/plugins/axios'

    export default {
        /**
         * 服务端请求数据
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
                // 首页导航下标
                key: '3',
                // 登录、注册导航下标
                type: 0,
                // 面包屑数据
                routes: [],
                // 显示协议窗口
                userVisible: false,
                // 用户协议内容
                userAgreement: '',
                // 显示认购协议按钮
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
                // 币种精度
                curLeng: 0,
                // 提示信息显示与隐藏
                showMsg: false,
                // 错误提示信息
                errorMsg: '',
                // 本次交易扣除
                businessDeduction: 0,
                // 占位符
                placeholderWord: '',
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
                    this.initPlaceholderWord()
                    this.checkNumberBlurFun()
                })
            },
            /**
             * 初始化面包屑国际化
             */
            initBreadcrumb () {
                this.routes = [
                    {
                        path: '/computer',
                        breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_home')
                    },
                    {
                        path: '/computer/CertificatePurchase',
                        breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts')
                    },
                    {
                        path: `/computer/CertificatePurchase/info/${this.$route.params.id}`,
                        breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts_info')
                    },
                    {
                        path: '/computer/CertificatePurchase/SubscribeImmediately',
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
                            this.initPlaceholderWord()
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
                        encCurCode: this.data.curCode,
                        projectId: parseInt(this.projectId)
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
                // 校验
                if (!this.disabledProtocol) {
                    // 初始化提示信息
                    this.flag = true
                    this.showMsg = false
                    this.msg = ''
                    this.disabledProtocol = true
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
                                this.$router.push(`/computer/CertificatePurchase/ImmediatelySuccess/${this.projectId}`)
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
            onChange (value) {},
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
             * 输入框的值得改变事件
             */
            checkInputFun () {},
            /**
             * 初始化输入框的占位符的值
             */
            initPlaceholderWord () {
                this.placeholderWord = this.$t('SubscribeImmediately.subscribeImmediately_user_lower_amount') + this.data.userMinAmount + 'PT'
            },
            /**
             * 动态数据国际化
             *
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
<style lang="less" scoped>
    @red: #e02020;

    .section {
        background: #ffffff;
        /deep/ .container {
            margin: 0 auto;
            width: 1200px;

            .content {
                margin: 0 auto;
                padding: 0 !important;
                .protocol-row {
                    margin-bottom: 24px;

                    /deep/ .ant-checkbox-wrapper {
                        font-size: 16px;
                    }
                }

                .info-body {
                    margin-top: 20px;
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    letter-spacing: 2px;

                    /deep/ .ant-input-number-input {
                        font-size: 16px;
                        color: rgba(51, 51, 51, 1);
                    }

                    /deep/ .ant-checkbox-wrapper {
                        font-size: 16px;
                    }

                    .mg-bm-8 {
                        margin-bottom: 16px;
                    }
                }

                .login-form-button {
                    margin-top: 16px;
                    height: 60px;
                    border-radius: 8px;
                    width: 100%;
                    font-size: 20px;
                    font-weight: 600;
                }

                .count-down-col {
                    display: flex;

                    .count-down {
                        font-size: 20px;
                        font-weight: 400;
                        color: @red;
                    }

                    .count-down-desc {
                        color: #999999;
                        letter-spacing: 1px;
                        width: 380px;
                        margin-top: 4px;
                    }

                    .icon {
                        margin: 4px 2px 0 6px;
                    }
                }

                .pay-number {
                    color: @red;
                    font-size: 16px;
                    font-weight: 400;
                    letter-spacing: 2px;
                }

                .balance-number {
                    color: #2FAAE0;
                    font-size: 16px;
                    font-weight: 400;
                    letter-spacing: 2px;
                }
            }

        }
    }


    .content-img {
        padding-bottom: 98px;
        min-height: calc(100vh - 179px);
        background: url("/bg_pic.jpg") no-repeat center;
        background-size: cover;
    }

    .operating-menu-bar {

        .tags-title {
            margin-bottom: 32px;
            letter-spacing: 2px;
            height:28px;
            font-size:20px;
            font-weight:500;
            color:rgba(0,0,0,0.85);
            line-height:28px;
        }

        .operating-menu-content {
            padding: 50px;
            width:524px;
            height:569px;
            background:rgba(255,255,255,1);
            box-shadow:0px 0px 8px 4px rgba(0,0,0,0.06);
            border-radius:10px;

            .operating-menu-content-wrapTop {
                margin-bottom: 20px;
            }

            .operating-menu-content-middle {
                border-radius:4px;
                border:1px solid rgba(0,0,0,0.15);
                padding: 30px;
                padding-top: 37px;
                margin-bottom: 30px;

                .menu-content-middle-balance {
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    > span {
                        &:nth-child(1){
                            height: 16px;
                            font-size:16px;
                            color:#888888;
                            line-height:16px;
                        }
                        &:nth-child(2){
                            height:24px;
                            font-size:24px;
                            color:rgba(0,0,0,1);
                            line-height:24px;
                        }
                    }
                }

                .menu-content-middle-subscribable {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    > span {
                        height:16px;
                        font-size:16px;
                        color:#888888;
                        line-height:16px;
                    }
                    .menu-content-middle-instyle {
                        display: flex;
                        height:24px;
                        font-size:24px;
                        color:rgba(0,0,0,1);
                        line-height:24px;
                    }
                }

                .menu-content-middle-divider {
                    margin: 23px 0 27px 0;
                }

                .menu-content-middle-calculation {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 24px;
                    > div {
                        &:nth-child(1){
                            height:16px;
                            font-size:16px;
                            color:#888888;
                            line-height:16px;
                        }
                        &:nth-child(2){
                            display: flex;
                            align-items: flex-end;

                            > span {
                                &:nth-child(1){
                                    margin-right: 5px;
                                    height:24px;
                                    font-size:24px;
                                    color:rgba(255,48,73,1);
                                    line-height:24px;
                                }
                                &:nth-child(2){
                                    height:16px;
                                    font-size:16px;
                                    color:#888888;
                                    line-height:16px;
                                }
                            }
                        }
                    }
                }

                .menu-content-middle-input {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;

                    .error-prompt-msg {
                        height:16px;
                        color:rgba(255,48,73,1);
                        line-height:16px;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        margin-bottom: 10px;
                    }

                    .menu-content-middle-wrap {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }

                    .menu-content-middle-inputLeft {
                        height:28px;
                        font-size:24px;
                        font-weight:500;
                        color:rgba(51,51,51,1);
                        line-height:28px;
                    }

                    .menu-content-middle-inputRight {
                        padding: 18px 17px;
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        width:304px;
                        height:60px;
                        border-radius:4px;

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
                            margin-left: 5px;
                            height:24px;
                            font-size:24px;
                            font-weight:500;
                            color:rgba(11,164,232,1);
                            line-height:24px;
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
                }
            }

            .operating-menu-content-buttonWrap {
                padding: 0 10px;
                width: 100%;

                .operating-menu-content-button {
                    height: 42px;
                    width: 100%;
                    font-size:18px;
                    font-weight:500;
                }
            }

            .operating-menu-content-title {
                margin-bottom: 20px;
                height:16px;
                font-size:16px;
                color:rgba(51,51,51,1);
                line-height:16px;
            }

            .transaction-content-and-time {
                .transaction-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    > div {
                        display: flex;
                        align-items: flex-end;

                        > span {
                            &:nth-child(1) {
                                height:24px;
                                font-size:28px;
                                font-weight:500;
                                color:rgba(0,0,0,1);
                                line-height:24px;
                            }
                            &:nth-child(2) {
                                height:26px;
                                font-size:16px;
                                color:#888888;
                                line-height:28px;

                            }
                            &:nth-child(3) {
                                margin: 0 5px;
                                height:28px;
                                font-size:28px;
                                color:rgba(0,0,0,1);
                                line-height:28px;
                            }
                            &:nth-child(4) {
                                margin-right: 5px;
                                height:24px;
                                font-size:28px;
                                font-weight:500;
                                color:rgba(0,0,0,1);
                                line-height:24px;
                            }
                            &:nth-child(5) {
                                height:26px;
                                font-size:16px;
                                color:#888888;
                                line-height:28px;
                            }
                        }
                    }

                    .count-down {
                        height:22px;
                        font-size:22px;
                        font-weight:500;
                        color:rgba(255,48,73,1);
                        line-height:22px;
                    }

                    > span {
                        display: block;
                        margin-top: 5px;
                        height:14px;
                        font-size:14px;
                        color:#888888;
                        line-height:14px;
                    }
                }

                .transaction-and-time {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    > div {
                        &:nth-child(2) {
                            &:hover {
                                cursor: pointer;
                            }
                            margin-top: 5px;
                            display: flex;
                            align-items: center;
                            > img {
                                margin-left: 4px;
                            }
                        }
                    }
                }
            }
        }
    }

    .background-img-style {}

    .v-enter,
    .v-leave-to{
        opacity: 0;
    }

    .v-enter-active,
    .v-leave-active{
        transition: opacity 1s
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
    input::-ms-input-placeholder{text-align: right;  transform: translate(0, -3px);}
    input::-webkit-input-placeholder{text-align: right; transform: translate(0, -3px);}
</style>
<style lang="less">
    .countdown-prompt-information{
        .tipBox{
        }
        .ant-tooltip-arrow{
            border-bottom-color: #ffffff;
        }

        .ant-tooltip-inner {
            width: 300px;
            padding: 10px 19px 10px 28px ;
        }

        .ant-tooltip-inner{
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

    .limitWith {
        display:inline-block;
        word-wrap: break-word;
    }

    .loadingClass {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100%;
    }
</style>

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
            <a-layout-content>
                <div class="content content-forgive-password">
                    <div id="components-form-bind-mobile">
                        <p class="components-form-bind-mobile">
                            {{$t('ForgetPassword.account_forgotpsw_title_headline')}}</p>
                        <a-form
                                :form="form"
                                :layout="formLayout"
                                @submit="handleSubmit">
                            <a-form-item :has-feedback="phoneOrEmailFeedback" colon>
                                <span slot="label">{{$t('ForgetPassword.account_forgotpsw_title_account')}}</span>
                                <a-input
                                        :placeholder="$t('ForgetPassword.account_forgotpsw_placeholder_account')"
                                        type="text"
                                        @focus="setFields('phoneOrEmail')"
                                        v-decorator="['phoneOrEmail', {rules: [{ validator:checkForm }],validateTrigger: 'blur'}]"
                                        style="width: 100%">
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <span slot="label">{{$t('Captcha.vcode_title_vcode')}}</span>
                                <a-row class="bind-mobile-check">
                                    <a-input
                                            :placeholder="$t('Captcha.vcode_title_vcode')"
                                            @focus="setFields('captcha')"
                                            v-decorator="['captcha',{rules: [{ validator:checkForm }],validateTrigger: 'blur'}]"/>
                                    <a-button
                                            @click="checkFun"
                                            :disabled="formObject.disabled"
                                            class="captcha-bt">
                                        {{getMobileCode()}}
                                    </a-button>
                                </a-row>
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                        @click="handleSubmit"
                                        type="primary"
                                        :loading="loading"
                                        html-type="submit"
                                        class="bind-mobile-button">
                                    {{$t('ForgetPassword.account_forgotpsw_btn_next')}}
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                </div>
            </a-layout-content>
        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import FsHead from '~/components/mobile/FangseaHeader'
    import fonter from '~/components/mobile/Footer'
    import validate from '~/assets/utils/validate'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'

    export default {
        data () {
            return {
                // 首页导航下标
                key: '0',
                // 登录、注册导航下标
                type: 1,
                // 表单排版风格
                formLayout: 'vertical',
                // 定时器
                waitTimer: false,
                // 用户中心导航下标
                centerKey: 0,
                // 抽屉动画
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 表单数据
                formObject: {
                    // 按钮状态
                    disabled: false,
                    // 是否点击验证码发送按钮
                    isSendCapchta: false
                },
                // 加载loading
                loading: false,
                // 账号状态标识
                phoneOrEmailFeedback: false
            }
        },
        // 初始化form
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        mounted () {
            this.listenI18n()
        },
        methods: {
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.form.getFieldError('phoneOrEmail') && this.form.validateFields(['phoneOrEmail'], {force: true})
                    this.form.getFieldError('captcha') && this.form.validateFields(['captcha'], {force: true})
                })
            },
            // 设置手机注册获取焦点状态
            setFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'phoneOrEmail' : this.phoneOrEmailFeedback = false; break
                }
                let fieldsValue = this.form.getFieldsValue([field])
                this.form.resetFields([field])
                this.form.setFieldsValue(fieldsValue)
            },
            /**
             * 表单验证
             * @param rule 检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkForm (rule, value, callback) {
                switch (rule.fullField) {
                case 'phoneOrEmail' :
                    if (!validate.required(value)) {
                        callback(this.$t('login.login_err_account'))
                    } else if (value.indexOf('@') === -1 && !validate.plus(value)) {
                        callback(this.$t('login.login_err_account'))
                    } else if (value.indexOf('@') !== -1 && !validate.email(value)) {
                        callback(this.$t('login.login_err_account'))
                    } else {
                        callback()
                    }
                    this.phoneOrEmailFeedback = true
                    break
                case 'captcha' :
                    if (!validate.required(value)) {
                        callback(this.$t('Captcha.vcode_err_code'))
                    } else if (!validate.maxlength(value, 6)) {
                        callback(this.$t('Captcha.vcode_err_code'))
                    } else if (!validate.minlength(value, 6)) {
                        callback(this.$t('Captcha.vcode_err_code'))
                    } else {
                        callback()
                    }
                    break
                default:
                    callback()
                }
            },
            /**
             *  校验邮箱账号以及发送验证码
             */
            checkFun () {
                if (!validate.required(this.form.getFieldValue('phoneOrEmail'))) {
                    this.form.validateFields(['phoneOrEmail'], {force: true})
                } else if (this.form.getFieldValue('phoneOrEmail').indexOf('@') === -1 && !validate.plus(this.form.getFieldValue('phoneOrEmail'))) {
                    this.form.validateFields(['phoneOrEmail'], {force: true})
                } else if (this.form.getFieldValue('phoneOrEmail').indexOf('@') !== -1 && !validate.email(this.form.getFieldValue('phoneOrEmail'))) {
                    this.form.validateFields(['phoneOrEmail'], {force: true})
                } else {
                    // 此处直接发送请求，验证码接口会去验证账号
                    this.captchaGet(this.form.getFieldValue('phoneOrEmail'))
                }
            },
            /**
             * 初始化form状态
             */
            changeTabs () {
                this.form.resetFields()
            },
            /**
             * 发送验证码
             */
            captchaGet (account) {
                // 防止重复点击
                if (this.waitTimer > 0) {
                    return false
                }
                //  发送请求
                axios.post('/user/verifiycode/get', {
                    traceId: tool.UUID(),
                    data: {account: account, business: 'RETRIEVE_PASSWORD'}
                })
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.$message.success(this.$t('Captcha.vcode_msg_success'))
                            // 发送成功开启定时器
                            this.waitTimer = 60
                            let that = this
                            let timerInterval = setInterval(function () {
                                if (that.waitTimer > 0) {
                                    that.waitTimer--
                                } else {
                                    clearInterval(timerInterval)
                                }
                            }, 1000)
                            // 修改按钮的文字
                            this.getMobileCode()
                            // 改变按钮状态
                            this.formObject.disabled = true
                            // 是否点击发送验证码
                            this.formObject.isSendCapchta = true
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 修改按钮的文字
             */
            getMobileCode () {
                if (this.waitTimer > 0) {
                    return this.waitTimer + 's'
                }
                if (this.waitTimer === 0) {
                    this.formObject.disabled = false
                    return this.$t('Captcha.vcode_btn_resend')
                }
                if (this.waitTimer === false) {
                    return this.$t('Captcha.vcode_btn_send')
                }
            },
            /**
             * form 表单提交
             * @param e 提交事件
             */
            handleSubmit (e) {
                e.preventDefault()
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.loading = true
                        axios.post('/user/password/find', {
                            traceId: tool.UUID(),
                            data: {
                                account: values['phoneOrEmail'],
                                verifyCode: values['captcha']
                            }
                        })
                            .then(res => {
                                this.loading = false
                                if (res.data.code.toString() === '0') {
                                    this.$message.success(this.$t(`code.${res.data.code.toString()}`))
                                    this.nextStep()
                                } else {
                                    this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                                }
                            }).catch(err => {
                                this.loading = false
                                this.$message.error(this.$t(err.message))
                            })
                    }
                })
            },
            /**
             *  下一步事件
             */
            nextStep () {
                this.$router.push({
                    path: '/mobile/user/ForgetPasswordStepTwo',
                    query: {account: this.form.getFieldValue('phoneOrEmail')}
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
            }
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
                title: this.$t('PageTitle.retrievepsw_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    .content-forgive-password {
        padding-top: 0;
        min-height: calc(100vh) !important;
    }

    #components-form-bind-mobile {
        max-width: 5.52rem;
        margin: 0 auto;
        .components-form-bind-mobile {
            margin-bottom: 0.32rem;
            font-size: 24px;
            color: rgba(0, 0, 0, 0.85);
        }
        a, a:hover, a:focus, a:visited {
            color: #2EA9DF;
            font-size: 14px;
        }
        input::-webkit-input-placeholder {
            color: #D9D9D9;
        }
        .ant-form-item {
            padding-bottom: 0;
            .ant-form-item-label {
                color: rgba(0, 0, 0, 0.85);
            }
            .ant-input {
                font-size: 16px;
                padding: 0.08rem 0.12rem;
                height: 0.40rem;
                color: #000000;
            }
            .ant-btn {
                padding: 0.08rem 0.16rem;
                height: 0.40rem;
                font-size: 16px;
            }
            .bind-mobile-check {
                display: flex;
                justify-content: space-between;
                input {
                    margin-right: 0.24rem;
                }
            }
            .bind-mobile-button {
                width: 100%;
                font-size: 16px;
                color: rgba(255, 255, 255, 1) !important;
            }
            .captcha-bt {
                font-size: 16px;
                color: #2EA9DF;
                border: 0.01rem solid rgba(46, 169, 223, 1);;
            }
        }
    }
</style>

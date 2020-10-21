<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key"/>
        <section class="container">
            <a-layout-content>
                <div class="content content-bind-mailbox">
                    <div id="components-form-bind-mailbox">
                        <p class="components-form-bind-mailbox" style="margin-bottom: 32px">
                            <span>
                                {{$t('ForgetPassword.account_forgotpsw_title_headline')}}
                            </span>
                        </p>
                        <a-form
                                :form="form"
                                :layout="formLayout"
                                @submit="handleSubmit">
                            <a-form-item :has-feedback="phoneOrEmailFeedback" colon>
                                <span slot="label" class="innerSpan">{{$t('ForgetPassword.account_forgotpsw_title_account')}}</span>
                                <a-input
                                        :placeholder="$t('ForgetPassword.account_forgotpsw_placeholder_account')"
                                        type="text"
                                        @focus="setFields('phoneOrEmail')"
                                        v-decorator="['phoneOrEmail', {rules: [{ validator:checkForm }],validateTrigger: 'blur'}]"
                                        style="width: 100%">
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <span slot="label" class="innerSpan">{{$t('Captcha.vcode_title_vcode')}}</span>
                                <div class="captcha-box">
                                    <a-input :placeholder="$t('Captcha.vcode_title_vcode')"
                                             style="margin-right: 24PX"
                                             @focus="setFields('captcha')"
                                             v-decorator="['captcha',{rules: [{ validator:checkForm }],validateTrigger: 'blur'}]"/>
                                    <a-button
                                            @click="checkFun"
                                            :disabled="formObject.disabled"
                                            class="captcha-bt">
                                        {{getMobileCode()}}
                                    </a-button>
                                </div>
                            </a-form-item>
                            <a-form-item>
                                <a-button @click="handleSubmit" type="primary" html-type="submit"
                                          class="bind-mailbox-button" :loading="loading">
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
    import FsHead from '~/components/computer/FangseaHeader'
    import fonter from '~/components/computer/Footer'
    import validate from '~/assets/utils/validate'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'

    export default {
        data () {
            return {
                key: '',
                visible: true,
                disabled: false,
                formLayout: 'vertical',
                // 验证码
                captcha: '',
                // 计时器防止重复点击
                waitTimer: false,
                // 触发计时器前能否点击
                afterInterval: false,
                // 表单数据
                formObject: {
                    // 按钮状态
                    disabled: false,
                    // 是否点击验证码发送按钮
                    isSendCapchta: false
                },
                // 按钮提交禁用
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
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkForm (rule, value, callback) {
                switch (rule.fullField) {
                case 'phoneOrEmail':
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
                case 'captcha':
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
             * 校验邮箱账号以及发送验证码
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
             * @param account 账号
             */
            captchaGet (account) {
                // 防止重复点击
                if (this.waitTimer || this.afterInterval) {
                    return false
                }
                this.afterInterval = true
                //  发送请求
                axios.post('/user/verifiycode/get', {
                    traceId: tool.UUID(),
                    data: {account: account, business: 'RETRIEVE_PASSWORD'}
                })
                    .then(res => {
                        this.afterInterval = false
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
                        // 确认后添加按钮loading
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
                    path: '/computer/user/ForgetPasswordStepTwo',
                    query: {account: this.form.getFieldValue('phoneOrEmail')}
                })
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
    .content-bind-mailbox {
        padding-top: 65px;
        min-height: calc(100vh - 126px);
        #components-form-bind-mailbox {
            padding-top: 48px;
            max-width: 552px;
            margin: 0 auto;
            .components-form-bind-mailbox {
                & > span {
                    height: 24px;
                    line-height: 24px;
                    font-size: 24px;
                    color: rgba(0, 0, 0, 0.85);
                }
            }
            .bind-mailbox-button {
                width: 100%;
                font-size: 16px;
                color: rgba(255, 255, 255, 1) !important;
            }

            a, a:hover, a:focus, a:visited {
                color: #57C3EB;
                font-size: 14px;
            }

            .ant-form-item {
                padding-bottom: 0;
                .ant-form-item-label {
                    color: rgba(0, 0, 0, 0.85);
                }
                .ant-input {
                    font-size: 14px;
                    padding: 8px 12px;
                    height: 40px;
                    color: #000000;
                }
                .ant-btn {
                    padding: 8px 14px;
                    height: 40px;
                    font-size: 14px;
                }
                .innerSpan {
                    display: block;
                    line-height: 22px;
                    height: 22px;
                }
                .captcha-box {
                    display: flex;
                    justify-content: space-between;
                    .captcha-bt {
                        font-size: 14px;
                        color: #2EA9DF;
                        border: 1px solid rgba(46, 169, 223, 1);;
                    }
                }
            }

            .gray {
                color: rgba(0, 0, 0, 0.25);
                border-color: rgba(0, 0, 0, 0.25);
            }

            input::-webkit-input-placeholder {
                color: #D9D9D9;
            }
        }
    }
</style>

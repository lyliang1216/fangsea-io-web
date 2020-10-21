<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key"/>
        <section class="container">
            <a-layout-content>
                <div class="content content-bind-mailbox">
                    <div id="components-form-bind-mailbox">
                        <p class="components-form-bind-mailbox">
                            {{$t('BindMailbox.account_bind_title_emailheadline')}}</p>
                        <a-form
                                has-feedback
                                @submit="handleSubmit"
                                :form="form"
                                :layout="formLayout">
                            <a-form-item :has-feedback="emailFeedback" colon>
                                <span slot="label">{{$t('BindMailbox.account_bind_title_email')}}</span>
                                <a-input
                                        @focus="setFields('email')"
                                        :placeholder="$t('BindMailbox.account_bind_placeholder_email')"
                                        v-decorator="['email',{validateTrigger: 'blur', rules: [{validator: checkEmailCount}] }]"
                                        type="email"
                                        style="width: 100%">
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <span slot="label">{{$t('Captcha.vcode_title_vcode')}}</span>
                                <div class="space-btw">
                                    <a-input
                                            @focus="setFields('captcha')"
                                            :placeholder="$t('Captcha.vcode_title_vcode')"
                                            v-decorator="['captcha',{validateTrigger: 'blur', rules: [{validator: checkEmailCount}] }]"
                                            class="input-capcha"/>
                                    <a-button
                                            :disabled="formObject.disabled"
                                            @click="checkFun"
                                            class="captcha-bt">
                                        {{ getMobileCode()}}
                                    </a-button>
                                </div>
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                        @click="handleSubmit"
                                        type="primary"
                                        :loading="loading"
                                        html-type="submit"
                                        class="bind-mailbox-button">
                                    {{$t('BindMailbox.account_bind_btn_submit')}}
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
                // 首页导航下标
                key: '',
                // 表单布局模式
                formLayout: 'vertical',
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
                // 加载loading
                loading: false,
                // 账号状态标识
                emailFeedback: false
            }
        },
        /**
         * 初始化form
         */
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        mounted () {
            this.listenI18n()
        },
        methods: {
            /**
             *  监听动态数据国际化
             */
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.form.getFieldError('email') && this.form.validateFields(['email'], {force: true})
                    this.form.getFieldError('captcha') && this.form.validateFields(['captcha'], {force: true})
                })
            },
            // 设置手机注册获取焦点状态
            setFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'email' : this.emailFeedback = false; break
                }
                let fieldsValue = this.form.getFieldsValue([field])
                this.form.resetFields([field])
                this.form.setFieldsValue(fieldsValue)
            },
            /**
             * 检测账号
             * @param rule 检测对象
             * @param value 检测的值
             * @param callback 回调
             * 采用注册的邮箱验证规则
             */
            checkEmailCount (rule, value, callback) {
                switch (rule.fullField) {
                case 'email' :
                    validate.email(value) ? callback() : callback(this.$t('register.register_email_err_email'))
                    this.emailFeedback = true
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
             * 初始化form状态
             */
            changeTabs () {
                this.form.resetFields()
            },
            /**
             *  发送请求后端检验数据
             */
            checkFun () {
                // 触发表单验证
                if (validate.email(this.form.getFieldValue('email'))) {
                    // 发送请求
                    axios.post('/user/account/bind/check', {
                        traceId: tool.UUID(),
                        data: this.form.getFieldValue('email')
                    })
                        .then(res => {
                            if (res.data.code.toString() === '0') {
                                // 校验成功 ( 需要接受账号 ) 邮箱账号验证成功并发送验证码
                                this.captchaGet(this.form.getFieldValue('email'))
                            } else {
                                this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                            }
                        }).catch(err => {
                            this.$message.error(this.$t(err.message))
                        })
                } else {
                    this.form.validateFields(['email'], {force: true})
                }
            },
            /**
             * 发送验证码
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
                    data: {account: account, business: 'BIND'}
                })
                    .then(res => {
                        this.afterInterval = false
                        if (res.data.code.toString() === '0') {
                            this.$message.success(this.$t('Captcha.vcode_msg_success'))
                            // 定时器
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
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
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
             *  下一步事件
             */
            nextStep () {
                this.$router.push({path: '/computer/user/UserCenter', query: {getKey: '5'}})
            },
            /** 提交表单
             *  @param e 提交事件
             */
            handleSubmit (e) {
                // 阻止表单默认事件
                e.preventDefault()
                this.form.validateFields((err, values) => {
                    if (!err) {
                        // 确认后添加按钮loading
                        this.loading = true
                        axios.post('/user/account/bind', {
                            traceId: tool.UUID(),
                            data: {
                                // 手机/邮箱
                                account: values['email'],
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
                title: this.$t('PageTitle.bindaccount_email_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    .content-bind-mailbox {
        padding-top: 65px;
        min-height: calc(100vh - 126px);
    }

    #components-form-bind-mailbox {
        padding-top: 48px;
        max-width: 552px;
        margin: 0 auto;
        .components-form-bind-mailbox {
            margin-bottom: 32px;
            font-size: 24px;
            color: rgba(0, 0, 0, 0.85);
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
                font-size: 16px;
                padding: 8px 12px;
                height: 40px;
                color: #000000;
            }
            .ant-btn {
                padding: 8px 16px;
                height: 40px;
                font-size: 16px;
                line-height: 24px;
            }
            .space-btw {
                display: flex;
                justify-content: space-between;
                .input-capcha {
                    margin-right: 24px
                }
                .captcha-bt {
                    font-size: 16px;
                    color: #2EA9DF;
                    border: 1px solid rgba(46, 169, 223, 1);;
                }
            }
            .bind-mailbox-button {
                width: 100%;
                font-size: 16px;
                color: rgba(255, 255, 255, 1) !important;
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
</style>

<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key"/>
        <section class="container">
            <a-layout-content>
                <div class="content content-bind-mailbox">
                    <div id="components-form-bind-mailbox">
                        <p class="components-form-bind-mailbox">
                            {{$t('ChangeMobileStepTwo.account_changbind_phone_step2_title_headline')}}</p>
                        <a-form
                                has-feedback
                                :form="form"
                                :layout="formLayout"
                                @submit="handleSubmit">
                            <a-form-item>
                                <span slot="label">{{$t('Captcha.vcode_title_vcode')}}</span>
                                <div style="display: flex;justify-content: space-between">
                                    <a-input
                                            :placeholder="$t('Captcha.vcode_title_vcode')"
                                            style="margin-right: 24px"
                                            type="text"
                                            @focus="setCaptchaFields"
                                            v-decorator="['captcha',{rules: [{ validator:checkForm }],validateTrigger: 'blur'}]"/>
                                    <a-button
                                            @click="reCaptchaGet"
                                            :disabled="formObject.disabled"
                                            class="captcha-bt">
                                        {{getMobileCode()}}
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
                                    {{$t('ChangeMailBoxStepTwo.account_changbind_btn_submit')}}
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
                formLayout: 'vertical',
                // 定时器
                waitTimer: false,
                // 验证码发送状态
                isSendCaptcha: false,
                // 表单参数
                formObject: {
                    disabled: true,
                    // 手机地区区号 （ 字母 ）
                    codeOld: this.$route.query.codeOld,
                    codeNew: this.$route.query.codeNew,
                    // 接受参数
                    oldAccountFrom: this.$route.query.account,
                    newAccountFrom: this.$route.query.accountNew,
                    // 手机区号 （ 号码 ）
                    areaCodeOld: this.$route.query.areaCodeOld,
                    areaCodeNew: this.$route.query.areaCodeNew
                },
                // 加载loading
                loading: false
            }
        },
        // 初始化form
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        created () {
            if (process.client) {
                this.listenI18n()
                this.captchaGet(this.formObject.areaCodeNew, this.formObject.newAccountFrom)
            }
        },
        methods: {
            /**
             *  监听动态数据国际化
             */
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.form.getFieldError('captcha') && this.form.validateFields(['captcha'], {force: true})
                })
            },
            // 设置验证码状态
            setCaptchaFields () {
                let captcha = this.form.getFieldsValue(['captcha'])
                this.form.resetFields(['captcha'])
                this.form.setFieldsValue({'captcha': captcha.captcha})
            },
            /**
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkForm (rule, value, callback) {
                switch (rule.fullField) {
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
            // 初始化 form 状态
            changeTabs () {
                this.form.resetFields()
            },
            /**
             * 重新点击发送验证码
             */
            reCaptchaGet () {
                this.captchaGet(this.formObject.areaCodeNew, this.formObject.newAccountFrom)
            },
            /**
             * 发送验证码
             */
            captchaGet (areaCodeNew, account) {
                // 防止重复点击
                if (this.waitTimer > 0) {
                    return false
                }
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
                //  发送请求
                axios.post('/user/verifiycode/get', {
                    traceId: tool.UUID(),
                    data: {
                        areaCode: areaCodeNew,
                        account: account,
                        business: 'CHANGE_BIND'}
                })
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.$message.success(this.$t(`code.${res.data.code.toString()}`))
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
                // 修改按钮的文字
                this.getMobileCode()
                // 改变按钮状
                this.formObject.disabled = true
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
                        // 提交动作
                        this.submitCheck()
                    }
                })
            },
            /**
             * 提交的验证动作
             * **/
            submitCheck () {
                this.loading = true
                axios.post('/user/account/bind/change', {
                    traceId: tool.UUID(),
                    data: {
                        account: this.formObject.oldAccountFrom,
                        verifyCode: this.form.getFieldValue('captcha'),
                        newAccount: this.formObject.newAccountFrom,
                        areaCode: this.formObject.areaCodeOld,
                        newAreaCode: this.formObject.areaCodeNew,
                        code: this.formObject.codeOld,
                        newCode: this.formObject.codeNew
                    }
                })
                    .then(res => {
                        this.loading = false
                        if (res.data.code.toString() === '0') {
                            this.$message.success(this.$t(`code.${res.data.code.toString()}`))
                            // 成功 => 跳转
                            this.nextStep()
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    }).catch(err => {
                        this.loading = false
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             *  下一步事件
             */
            nextStep () {
                this.$router.push({name: 'computer-user-UserCenter', query: {getKey: '5'}})
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
                title: this.$t('PageTitle.changbind_phone_pagetitle')
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
            }
            .captcha-bt {
                font-size: 16px;
                color: #2EA9DF;
                border: 1px solid rgba(46, 169, 223, 1);;
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

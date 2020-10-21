<template>
    <a-layout id="components-layout-mobile-top" class="layout"
              :class="drawer">
        <fs-head :SelectedKey="key" :SelectedType="type" :centerKey="centerKey" @openDrawer="openDrawer"
                 @closeDrawer="closeDrawer"/>
        <section class="container">
            <a-layout-content>
                <div class="content content-register">
                    <div id="components-form-BindMailbox">
                        <p class="components-form-BindMailbox">
                            {{$t('ChangeMailBoxStepTwo.account_changbind_email_title_headline')}}</p>
                        <a-form
                                has-feedback
                                :form="form"
                                :layout="formLayout"
                                @submit="handleSubmit">
                            <a-form-item>
                                <span slot="label">{{$t('Captcha.vcode_title_vcode')}}</span>
                                <a-row class="BindMailbox-check">
                                    <a-input
                                            :placeholder="$t('Captcha.vcode_title_vcode')"
                                            @focus="setCaptchaFields"
                                            v-decorator="['captcha',{rules: [{ validator:checkForm }],validateTrigger: 'blur'}]"/>
                                    <a-button
                                            @click="reCaptchaGet"
                                            :disabled="formObject.disabled"
                                            class="captcha-bt">{{getMobileCode()}}
                                    </a-button>
                                </a-row>
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                        @click="handleSubmit"
                                        type="primary"
                                        :loading="loading"
                                        html-type="submit"
                                        class="BindMailbox-button">
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
    import FsHead from '~/components/mobile/FangseaHeader'
    import fonter from '~/components/mobile/Footer'
    import validate from '~/assets/utils/validate'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'

    export default {
        data () {
            return {
                key: '0',
                type: 0,
                drawer: false,
                visible: true,
                formLayout: 'vertical',
                // 定时器
                waitTimer: false,
                centerKey: 5,
                // 表单参
                formObject: {
                    // 按钮点击状态
                    disabled: true,
                    // 接受参数
                    account: this.$route.query.account,
                    newAccount: this.$route.query.newAccount
                },
                // 加载loading
                loading: false
            }
        },
        /**
         * 初始化form
         * **/
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        created () {
            if (process.client) {
                this.listenI18n()
                this.captchaGet(this.formObject.newAccount)
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
            /**
             * 初始化form状态
             * **/
            changeTabs () {
                this.form.resetFields()
            },
            /**
             * 重新点击发送验证码
             */
            reCaptchaGet () {
                // 旧邮箱
                this.captchaGet(this.formObject.newAccount)
            },
            // 设置验证码状态
            setCaptchaFields () {
                let captcha = this.form.getFieldsValue(['captcha'])
                this.form.resetFields(['captcha'])
                this.form.setFieldsValue({'captcha': captcha.captcha})
            },
            /**
             * 发送验证码
             */
            captchaGet (account) {
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
                    data: {account: account, business: 'CHANGE_BIND'}
                })
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.$message.success(this.$t('Captcha.vcode_msg_success'))
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
                // 修改按钮的文字
                this.getMobileCode()
                // 改变按钮状态
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
             *  下一步事件
             * **/
            nextStep () {
                this.$router.push({path: '/mobile/user/UserCenter/MyMessage'})
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
                    data: {
                        account: this.formObject.account,
                        newAccount: this.formObject.newAccount,
                        verifyCode: this.form.getFieldValue('captcha')
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
             * 开启右侧抽屉导航
             * **/
            openDrawer () {
                this.drawer = true
            },
            /**
             * 关闭右侧抽屉导航
             * **/
            closeDrawer () {
                this.drawer = false
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
                title: this.$t('PageTitle.changbind_email_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    .content-register {
        padding-top: 0.65rem;
        min-height: calc(100vh - 1.26rem);
    }

    #components-form-BindMailbox {
        max-width: 5.52rem;
        margin: 0 auto;
        .components-form-BindMailbox {
            margin-bottom: 0.16rem;
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
                height: 0.4rem;
                color: #000000;
            }
            .ant-btn {
                padding: 0.08rem 0.16rem;
                height: 0.4rem;
                font-size: 16px;
            }
            .BindMailbox-check {
                display: flex;
                justify-content: space-between;
                input {
                    margin-right: 0.24rem;
                }
            }
            .BindMailbox-button {
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

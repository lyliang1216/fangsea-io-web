<template>
    <a-modal
            class="captcha-modal"
            v-model="visible"
            :title="captchaTitle"
            :centered="true"
            :keyboard="false"
            :maskClosable="false"
            :width="320"
            :footer="null"
            style="max-height: 320px"
            @cancel="cancel">
        <a-form
                :form="form"
                :layout="formLayout"
                class="login-form"
                @submit="handleSubmit">
            <a-form-item>
                    <span slot="label">
                        验证码已发送至：
                        <span class="ant-form-text" v-text="email" v-if="isEmail"></span>
                        <span class="ant-form-text" v-text="mobile" v-else></span>
                    </span>
                <a-row :gutter="16">
                    <a-col :span="14">
                        <a-input placeholder="验证码"
                                 v-decorator="['captcha',
                                 {validateTrigger: 'blur',
                                 rules: [{ validator:checkForm }]}]"/>
                    </a-col>
                    <a-col :span="8">
                        <a-button @click="getCaptcha()" class="captcha-bt"
                                  :disabled="disabledCapt">
                            {{catpBt}}
                        </a-button>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item
                    v-if="showPassword"
                    has-feedback>
                <a-input v-decorator="['password',
                                      { validateTrigger: 'blur',
                                      rules: [{ validator: checkForm}] }]"
                         type="password"
                         :read-only="readOnly"
                         @focus="changeReadOnly"
                         placeholder="交易密码">
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-button
                        type="primary"
                        html-type="submit"
                        class="login-form-button">
                    确定
                </a-button>
                <div class="login-form-forgot">
                    <template v-if="isEmail">
                        <a class="" href="javascript:;" v-if="mobile !== ''" @click="useMobile">使用手机获取验证码</a>
                        <a-popover
                                v-else
                                class="captcha-popover"
                                placement="topRight"
                                trigger="click"
                                :visible="clicked"
                                @visibleChange="handleClickChange">
                            <div slot="content">
                                <p class="content-p">由于你还未绑定手机</p>
                                <p class="content-p">号码，此功能不可用。</p>
                                <p class="content-p"><a @click="bindMobile">去绑定</a></p>
                            </div>
                            <a class="" href="javascript:;">使用手机获取验证码</a>
                        </a-popover>
                    </template>

                    <template v-if="!isEmail">
                        <a class="" href="javascript:;" v-if="email !== ''" @click="useEmail">使用邮箱获取验证码</a>
                        <a-popover
                                v-else
                                class="captcha-popover"
                                placement="topRight"
                                trigger="click"
                                :visible="clicked"
                                @visibleChange="handleClickChange">
                            <div slot="content">
                                <p class="content-p">由于你还未绑定邮箱，</p>
                                <p class="content-p">此功能不可用。</p>
                                <p class="content-p"><a @click="bindEmail">去绑定</a></p>
                            </div>
                            <a class="" href="javascript:;">使用邮箱获取验证码</a>
                        </a-popover>
                    </template>
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script>
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'

    export default {
        /**
         * @param visible 显示窗口
         * @param showPassword 显示密码输入框
         * @param captchaTitle 窗口标题
         */
        props: ['visible', 'showPassword', 'captchaTitle'],
        data () {
            return {
                // 表单排版方式
                formLayout: 'vertical',
                // 显示跳转绑定按钮
                clicked: false,
                // 用户手机号
                mobile: '',
                // 用户邮箱
                email: '',
                // 验证码发送至邮箱或手机
                isEmail: true,
                // 手机验证码倒计时
                countDown: 60,
                // 手机验证码按钮禁用
                disabledCapt: false,
                // 密码只读，防止浏览器自动填充
                readOnly: true,
                // 手机验证码国际化
                catpBt: this.$t('Captcha.vcode_btn_send')
            }
        },
        // 初始化form
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        mounted () {
            this.initUserMsg()
        },
        methods: {
            /**
             * 获取登录用户邮箱或手机号码
             */
            initUserMsg () {
                let data = {traceId: tool.UUID()}
                axios.post('/user/info/query', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.mobile = res.data.data.mobile || ''
                            this.email = res.data.data.email || ''
                            this.isEmail = this.email !== ''
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            // 获取验证码
            getCaptcha () {
                let account = this.isEmail ? this.email : this.mobile
                this.disabledCapt = true
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        account: account,
                        business: 'REGISTER'
                    }
                }
                axios.post('/user/verifiycode/get', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.$message.success(this.$t('register.register_result_success_msg'))
                            this.countdown()
                        } else {
                            this.disabledCapt = false
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.disabledCapt = false
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 倒计时
             */
            countdown () {
                let setIntervalCD
                this.disabledCapt = true
                this.catpBt = '60 s'
                setIntervalCD = self.setInterval(() => {
                    if (this.countDown > 0) {
                        this.countDown--
                        this.catpBt = `${this.countDown} s`
                    } else {
                        this.countDown = 60
                        this.catpBt = this.$t('Captcha.vcode_btn_resend')
                        window.clearInterval(setIntervalCD)
                        this.disabledCapt = false
                    }
                }, 1000)
            },
            /**
             * form 表单提交
             * @param e 提交事件
             */
            handleSubmit (e) {
                e.preventDefault()
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let data = {
                            traceId: tool.UUID(),
                            data: {
                                code: values['captcha'],
                                password: values['password']
                            }
                        }
                        axios.post('/user/verifiycode/get', data)
                            .then(res => {
                                if (res.data.code.toString() === '0') {
                                    this.$message.success('提交成功')
                                } else {
                                    this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                                }
                            })
                            .catch(err => {
                                this.$message.error(this.$t(err.message))
                            })
                    }
                })
            },
            /**
             * form 检测
             * @param rule 检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkForm (rule, value, callback) {
                switch (rule.fullField) {
                case 'captcha' :
                    if (value && value.replace(/(^\s*)|(\s*$)/g, '') !== '') {
                        callback()
                    }
                    // eslint-disable-next-line
                        callback('请填写你的验证码！')
                    break
                case 'password' :
                    if (value && value.replace(/(^\s*)|(\s*$)/g, '') !== '') {
                        callback()
                    }
                    // eslint-disable-next-line
                        callback('请填写你的密码！')
                    break
                default:
                    callback()
                }
            },
            /**
             * 跳转手机绑定界面
             */
            bindMobile () {
                this.clicked = false
                this.$router.push({path: '/computer/user/UserCenter/MyMessage/BindMobile'})
            },
            /**
             * 跳转邮箱绑定界面
             */
            bindEmail () {
                this.clicked = false
                this.$router.push({path: '/computer/user/UserCenter/MyMessage/BindMailbox'})
            },
            /**
             * 切换提示
             */
            handleClickChange (visible) {
                this.clicked = visible
            },
            /**
             * 关闭窗口
             */
            cancel () {
                this.$emit('changeVisible')
            },
            /**
             * 使用手机获取验证码
             */
            useMobile () {
                this.isEmail = false
            },
            /**
             * 使用邮箱获取验证码
             */
            useEmail () {
                this.isEmail = true
            },
            // 改变密码框为可编辑
            changeReadOnly () {
                this.readOnly = false
            }
        }
    }
</script>

<style lang="less">
    .captcha-modal {
        .ant-modal-header {
            border-bottom: none;
        }

        .ant-modal-title {
            font-size: 18px;
        }

        .ant-modal-body {
            padding-bottom: 0;
            padding-top: 0;
        }

        .ant-popover-title {
            display: none !important;
        }
    }

    .captcha-popover {
        .ant-popover-title {
            display: none;
        }

        .ant-popover-inner {
            border-radius: 8px;
        }
    }
</style>

<style lang="less" scoped>
    .captcha-bt {
        width: 102px;
        color: #2EA9DF;
        border: 1px solid rgba(217, 217, 217, 1);
    }

    .ant-form-text {
        font-size: 14px;
        color: #FF542B;
    }

    .ant-input, .ant-btn {
        height: 40px;
    }

    .ant-form-vertical .ant-form-item {
        padding-bottom: 0;
    }

    a, a:hover, a:focus, a:visited {
        color: #2EA9DF;
        font-size: 14px;
    }

    .ant-form-item-label {
        color: rgba(0, 0, 0, 0.85);
    }

    .login-form-button {
        font-size: 16px;
        width: 100%;
    }

    .login-form-forgot {
        float: right;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .content-p {
        margin-bottom: 0;
    }

</style>

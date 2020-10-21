<template>
    <a-layout id="components-layout-mobile-top" class="layout"
              :class="drawer">
        <fs-head :SelectedKey="key"
                 :SelectedType="type"
                 :centerKey="centerKey"
                 @openDrawer="openDrawer"
                 @closeDrawer="closeDrawer"/>
        <section class="container">
            <a-layout-content>
                <div class="content content-register">
                    <div id="components-form-BindMailbox">
                        <p class="components-form-BindMailbox">
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
                                        v-decorator="['email',{validateTrigger: 'blur', rules: [{ validator: checkEmailCount}] }]"
                                        :placeholder="$t('BindMailbox.account_bind_placeholder_email')"
                                        type="email">
                                </a-input>
                            </a-form-item>
                            <a-form-item :label="$t('Captcha.vcode_title_vcode')">
                                <a-row class="BindMailbox-check">
                                    <a-input
                                            @focus="setFields('captcha')"
                                            v-decorator="['captcha',{validateTrigger: 'blur', rules: [{ validator: checkEmailCount}] }]"
                                            :placeholder="$t('Captcha.vcode_title_vcode')"/>
                                    <a-button
                                            :disabled="formObject.disabled"
                                            @click="checkFun"
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
                                        class="BindMailbox-button">
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
    import FsHead from '~/components/mobile/FangseaHeader'
    import fonter from '~/components/mobile/Footer'
    import validate from '~/assets/utils/validate'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'

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
                centerKey: 5,
                // 定时器
                waitTimer: false,
                // 验证码按钮点击状态
                isSendCaptcha: false,
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
                emailFeedback: false
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
             */
            checkEmailCount (rule, value, callback) {
                switch (rule.fullField) {
                case 'email' :
                    validate.email(value) ? callback() : callback(this.$t('BindMailbox.account_bind_err_emailerr'))
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
                    data: {account: account, business: 'BIND'}
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
                // 按钮修改状态
                this.formObject.isSendCapchta = true
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
                // 阻止表单默认事件
                e.preventDefault()
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.loading = true
                        axios.post('/user/account/bind', {
                            traceId: tool.UUID(),
                            data: {
                                account: values['email'], // 手机/邮箱
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
             * **/
            nextStep () {
                this.$router.push({path: '/mobile/user/UserCenter/MyMessage'})
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
                title: this.$t('PageTitle.bindaccount_email_pagetitle')
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
            margin-bottom: 0.32rem;
            font-size: 0.24rem;
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
            .captcha-bt {
                font-size: 16px;
                color: #2EA9DF;
                border: 1px solid rgba(46, 169, 223, 1);;
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
        }
        .gray {
            color: rgba(0, 0, 0, 0.25);
            border-color: rgba(0, 0, 0, 0.25);
        }
    }

</style>

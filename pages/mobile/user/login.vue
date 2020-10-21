<template>
    <a-layout id="components-layout-mobile-top" class="layout" :class="drawer">
        <fs-head :SelectedKey="key"
                 :SelectedType="type"
                 :centerKey="centerKey"
                 @openDrawer="openDrawer"
                 @closeDrawer="closeDrawer"/>
        <section class="container">
            <a-layout-content>
                <div class="content-login content">
                    <div id="components-form-normal-login">
                        <!--        登录表单   start       -->
                        <a-form
                                :form="form"
                                :layout="formLayout"
                                class="login-form"
                                @submit="handleSubmit">
                            <p class="components-form-login-title">{{$t('login.login_title_headline')}}</p>
                            <a-form-item
                                    :label="$t('login.login_title_account')"
                                    :has-feedback="accountFeedback">
                                <a-input
                                        class="family-san"
                                        @focus="setFields('account')"
                                        v-decorator="['account',
                                    {validateTrigger: 'blur',
                                     rules: [{ validator: checkUserName}] }]"
                                         :placeholder="$t('login.login_placeholder_account')">
                                </a-input>
                            </a-form-item>
                            <a-form-item
                                    :label="$t('login.login_title_psw')"
                                    :has-feedback="passwordFeedback">
                                <a-input
                                        class="family-san"
                                        @focus="setFields('password')"
                                        v-decorator="['password',
                                      {validateTrigger: 'blur',
                                       rules: [{ validator: checkPassword}] }]"
                                         type="password"
                                         :placeholder="$t('login.login_placeholder_psw')">
                                </a-input>
                            </a-form-item>
                            <a-form-item
                                    v-show="base64Captcha !== ''"
                                    :label="$t('register.register_title_captcha')">
                                <a-row :gutter="14">
                                    <a-col :span="16" class="validataCode-col">
                                        <a-input
                                                class="family-san"
                                                @focus="setFields('validataCode')"
                                                :placeholder="$t('register.register_title_captcha')"
                                                 v-decorator="['validataCode',
                                                          {validateTrigger: 'blur',
                                                          rules: [{ validator:checkCaptcha }]}]"/>
                                    </a-col>
                                    <a-col :span="8">
                                        <div class="base64Captcha-content" @click="getCaptcha()">
                                            <img :src="base64Captcha">
                                        </div>
                                    </a-col>
                                </a-row>
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                        :loading="flag"
                                        type="primary"
                                        html-type="submit"
                                        class="login-form-button">
                                    {{$t('login.login_btn_login')}}
                                </a-button>
                                <div class="login-form-forgot">
                                    <span class="forget-padding">
                                        <nuxt-link to="/mobile/user/ForgetPassword">
                                            {{$t('login.login_btn_forgotpsw')}}
                                        </nuxt-link>
                                    </span>
                                    {{$t('login.login_content_noaccount')}}
                                    <span >
                                        <nuxt-link to="/mobile/user/register">
                                            {{$t('login.login_btn_register')}}
                                        </nuxt-link>
                                    </span>
                                </div>
                            </a-form-item>
                        </a-form>
                        <!--        登录表单   end       -->
                    </div>
                </div>
            </a-layout-content>
        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import FsHead from '~/components/mobile/FangseaHeader'
    import {removeSpaces} from '~/assets/utils/rules'
    import fonter from '~/components/mobile/Footer'
    import validate from '~/assets/utils/validate'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'

    export default {
        data () {
            return {
                // 首页导航下标
                key: '0',
                // 登录、注册导航下标
                type: 1,
                // 表单排版风格
                formLayout: 'vertical',
                // 图片验证码
                base64Captcha: '',
                // 用户中心导航下标
                centerKey: 0,
                // 抽屉动画
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 跳转地址
                redirectURL: '/mobile',
                // 防止多次点击登录
                flag: false,
                // 账号校验图标
                accountFeedback: false,
                // 密码校验图标
                passwordFeedback: false
            }
        },
        // 初始化form
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        mounted () {
            this.getParams()
            this.listenI18n()
        },
        methods: {
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.form.getFieldError('account') && this.form.validateFields(['account'], { force: true })
                    this.form.getFieldError('password') && this.form.validateFields(['password'], { force: true })
                })
            },
            // 获取路由参数
            getParams () {
                this.$route.query.redirectUrl ? this.redirectURL = this.$route.query.redirectUrl : this.redirectURL = '/mobile'
            },
            // 获取图形验证码
            getCaptcha () {
                let account = removeSpaces(this.form.getFieldValue('account')) || ''
                let data = {
                    traceId: tool.UUID(),
                    data: {account}
                }
                axios.post('/user/image/verifiycode/get', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            res.data.data ? this.base64Captcha = res.data.data.validataCode : this.base64Captcha = ''
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * form 表单提交
             * @param e 提交事件
             */
            handleSubmit (e) {
                e.preventDefault()
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.flag = true
                        let formdata = new FormData()
                        formdata.append('traceId', tool.UUID())
                        formdata.append('username', removeSpaces(values['account']))
                        formdata.append('password', values['password'])
                        if (values['validataCode']) {
                            formdata.append('validataCode', values['validataCode'])
                        }
                        formdata.append('CLIENT_ID', 'user')
                        axios.defaults.headers['Authorization'] = ''
                        axios.post('/authentication/form', formdata)
                            .then(res => {
                                if (res.data.code.toString() === '0') {
                                    // 用于登录权限拦截
                                    Cookie.set('token', res.data.tokenData.access_token)
                                    Cookie.set('refresh_token', res.data.tokenData.refresh_token, {expires: res.data.tokenData.refresh_token_validity_seconds / 60 / 60 / 24})
                                    // 刷新token时放head
                                    Cookie.set('authorization', res.data.tokenData.authorization)
                                    // 用于后端校验登录状态
                                    axios.defaults.headers['Authorization'] = 'bearer' + ' ' + res.data.tokenData.access_token
                                    // 清空图片验证码
                                    this.base64Captcha = ''
                                    // 保存用户语种
                                    axios.post('/user/account/language/save').then(() => {
                                        if (this.$route.query.redirectUrl) {
                                            // 跳转一期
                                            window.location.href = this.redirectURL
                                        } else if (Cookie.get('redirectUrl') && Cookie.get('redirectUrl').indexOf('/computer/user/login') === -1) {
                                            // 跳转至登录前的页面
                                            window.location.href = Cookie.get('redirectUrl')
                                        } else {
                                            // 跳转首页
                                            window.location.href = this.redirectURL
                                        }
                                    })
                                } else if (res.data.code.toString() === '1004') {
                                    this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                                    if (res.data.data) {
                                        this.base64Captcha = res.data.data.validataCode
                                    }
                                    this.flag = false
                                } else {
                                    this.flag = false
                                    this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                                }
                            })
                            .catch(err => {
                                this.$message.error(this.$t(err.message))
                                this.flag = false
                            })
                    }
                })
            },
            /**
             * 检测账号
             * @param rule 检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkUserName (rule, value, callback) {
                value = removeSpaces(value)
                if (!validate.required(value)) {
                    callback(this.$t('login.login_err_account'))
                } else if (value.indexOf('@') === -1 && !validate.plus(value)) {
                    callback(this.$t('login.login_err_account'))
                } else if (value.indexOf('@') !== -1 && !validate.email(value)) {
                    callback(this.$t('login.login_err_account'))
                } else {
                    this.getCaptcha()
                    callback()
                }
                this.accountFeedback = true
            },
            /**
             * 检测密码
             * @param rule 检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkPassword (rule, value, callback) {
                if (!validate.required(value)) {
                    callback(this.$t('login.login_err_psw'))
                } else if (!validate.password(value)) {
                    callback(this.$t('login.login_err_psw'))
                } else if (!validate.rangelength(value, [6, 20])) {
                    callback(this.$t('login.login_err_psw'))
                } else {
                    callback()
                }
                this.passwordFeedback = true
            },
            // 设置手机注册获取焦点状态
            setFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'account' : this.accountFeedback = false; break
                case 'password' : this.passwordFeedback = false; break
                }
                let fieldsValue = this.form.getFieldsValue([field])
                this.form.resetFields([field])
                this.form.setFieldsValue(fieldsValue)
            },
            /**
             * 检测图形验证码
             * @param rule 检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkCaptcha (rule, value, callback) {
                if (this.base64Captcha !== '') {
                    validate.required(value) ? callback() : callback(this.$t('register.register_err_captcha'))
                } else {
                    callback()
                }
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
            }
        },
        components: {
            FsHead,
            fonter
        },
        head () {
            return {
                title: this.$t('PageTitle.login_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    .family-san {
        font-family: 'San Francisco' !important;
    }

    .validataCode-col {
        padding-right: 5px;
    }

    .forget-padding {
        margin-right: 0.1rem;
    }

    .content-login {
        min-height: calc(100vh - 0.50rem) !important;
    }

    #components-form-normal-login {
        .base64Captcha-content {
            border: 1px solid #d9d9d9;
            border-radius: 4px;

            img {
                width: 100%;
                height: 0.38rem;
            }
        }

        .ant-form-item-required:before {
            content: ''
        }

        .ant-form-item {
            font-size: 12px;
        }

        .login-form {
            margin: 0 auto;
            max-width: 5.52rem;
        }

        .login-form-forgot {
            float: right;
            margin-top: 0.14rem;
        }

        .login-form-button {
            width: 100%;
        }

        .components-form-login-title {
            margin-bottom: 0.32rem;
            font-size: 18px;
            color: rgba(0, 0, 0, 0.85);
        }

        a, a:hover, a:focus, a:visited {
            color: #2EA9DF;
            font-size: 12px;
        }

        .ant-form-item-label {
            line-height: 0.24rem;
        }

        .ant-input, .ant-btn {
            height: 0.4rem;
        }
    }
</style>

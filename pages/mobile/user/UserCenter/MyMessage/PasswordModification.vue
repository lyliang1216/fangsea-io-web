<template>
    <a-layout id="components-layout-mobile-top" class="layout"
              :class="drawer">
        <fs-head
                :centerKey="centerKey"
                :SelectedKey="key"
                :SelectedType="type"
                @openDrawer="openDrawer"
                @closeDrawer="closeDrawer"/>
        <section class="container">
            <a-layout-content>
                <div class="content content-register">
                    <div id="components-form-BindMailbox">
                        <p class="components-form-BindMailbox">{{$t('PasswordModification.account_changepsw_title_headline')}}</p>
                        <a-form
                                :form="form"
                                :layout="formLayout"
                                class=""
                                @submit="handleSubmit">
                            <a-form-item :has-feedback="oldPasswordFeedback" colon>
                                <span slot="label">{{$t('PasswordModification.account_changepsw_title_oldpwd')}}</span>
                                <a-input
                                        style="font-family: 'San Francisco' !important;"
                                        @focus="setFields('password')"
                                        :placeholder="$t('ForgetPasswordStepTwo.account_forgotpsw_step2_placeholder_newpsw')"
                                        type="password"
                                        v-decorator="['password', {rules: [{ validator:checkForm }],validateTrigger: 'blur'}]">
                                </a-input>
                            </a-form-item>
                            <a-form-item :has-feedback="passwordFeedback" colon>
                                <span slot="label">{{$t('PasswordModification.account_changepsw_title_newpwd')}}</span>
                                <a-input
                                        style="font-family: 'San Francisco' !important;"
                                        @focus="setFields('passwordNew')"
                                        :placeholder="$t('ForgetPasswordStepTwo.account_forgotpsw_step2_placeholder_newpsw')"
                                        type="password"
                                        v-decorator="['passwordNew', {rules: [{ validator:checkForm }],validateTrigger: 'blur'}]">
                                </a-input>
                            </a-form-item>
                            <a-form-item :has-feedback="confirmPasswordFeedback"
                                         colon>
                                <span slot="label">{{$t('PasswordModification.account_changepsw_title_confirmpwd')}}</span>
                                <a-input
                                        style="font-family: 'San Francisco' !important;"
                                        @focus="setFields('passwordConfirm')"
                                        :placeholder="$t('ForgetPasswordStepTwo.account_forgotpsw_step2_placeholder_newpsw')"
                                        type="password"
                                        v-decorator="['passwordConfirm', {rules: [{ validator:checkForm }],validateTrigger: 'blur'}]">
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                        @click="handleSubmit"
                                        type="primary"
                                        :loading="loading"
                                        html-type="submit"
                                        class="BindMailbox-button">
                                    {{$t('PasswordModification.account_changepsw_btn_submit')}}
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
                disabled: true,
                formLayout: 'vertical',
                centerKey: 5,
                // 加载loading
                loading: false,
                // 旧密码校验图标
                oldPasswordFeedback: false,
                // 新密码校验图标
                passwordFeedback: false,
                // 新密码确认校验图标
                confirmPasswordFeedback: false
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
                    this.form.getFieldError('password') && this.form.validateFields(['password'], { force: true })
                    this.form.getFieldError('passwordNew') && this.form.validateFields(['passwordNew'], { force: true })
                    this.form.getFieldError('passwordConfirm') && this.form.validateFields(['passwordConfirm'], { force: true })
                })
            },
            // 设置手机注册获取焦点状态
            setFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'password' : this.oldPasswordFeedback = false; break
                case 'passwordNew' : this.passwordFeedback = false; break
                case 'passwordConfirm' : this.confirmPasswordFeedback = false; break
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
                case 'password' :
                    if (!validate.required(value)) {
                        callback(this.$t('PasswordModification.account_changepsw_err_wrongoldpsw'))
                    } else if (!validate.password(value)) {
                        callback(this.$t('PasswordModification.account_changepsw_err_wrong'))
                    } else if (!validate.rangelength(value, [6, 20])) {
                        callback(this.$t('ForgetPasswordStepTwo.account_forgotpsw_step2_err_1'))
                    } else {
                        callback()
                    }
                    this.oldPasswordFeedback = true
                    break
                case 'passwordNew' :
                    if (!validate.required(value)) {
                        callback(this.$t('PasswordModification.account_changepsw_err_wrongoldpsw'))
                    } else if (!validate.password(value)) {
                        callback(this.$t('PasswordModification.account_changepsw_err_wrong'))
                    } else if (validate.equalTo(value, this.form.getFieldValue('password'))) {
                        callback(this.$t('PasswordModification.account_changepsw_err_sameas'))
                    } else if (!validate.rangelength(value, [6, 20])) {
                        callback(this.$t('ForgetPasswordStepTwo.account_forgotpsw_step2_err_1'))
                    } else {
                        callback()
                    }
                    this.passwordFeedback = true
                    break
                case 'passwordConfirm' :
                    if (!validate.required(value)) {
                        callback(this.$t('PasswordModification.account_changepsw_err_wrongoldpsw'))
                    } else if (!validate.equalTo(value, this.form.getFieldValue('passwordNew'))) {
                        callback(this.$t('PasswordModification.account_changepsw_err_diff'))
                    } else {
                        callback()
                    }
                    this.confirmPasswordFeedback = true
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
             * form 表单提交
             * @param e 提交事件 不管提交的时候有没有验证对不对都去校验一次
             */
            handleSubmit (e) {
                e.preventDefault()
                this.form.validateFields((err, values) => {
                    if (!err) {
                        if ((this.form.getFieldValue('password')) === (this.form.getFieldValue('passwordNew'))) {
                            // 当原密码与新密码一致的情况
                            this.form.validateFields(['passwordNew'], { force: true })
                        } else {
                            if ((this.form.getFieldValue('passwordNew')) !== (this.form.getFieldValue('passwordConfirm'))) {
                                // 当输入的新的密码和确认的密码不一致的情况下去验证
                                this.form.validateFields(['passwordConfirm'], { force: true })
                            } else {
                                // 验证密码
                                this.verifyPassword()
                            }
                        }
                    } else {
                        if ((this.form.getFieldValue('password')) === (this.form.getFieldValue('passwordNew'))) {
                            // 当原密码与新密码一致的情况
                            this.form.validateFields(['passwordNew'], { force: true })
                        } else {
                            if ((this.form.getFieldValue('passwordNew')) === (this.form.getFieldValue('passwordConfirm'))) {
                                // 当输入的新的密码和确认的密码一致的情况下去验证
                                this.form.validateFields(['passwordConfirm'], { force: true })
                                // 验证密码
                                this.verifyPassword()
                            } else {
                                // 当输入的新的密码和确认的密码不一致的情况下去验证
                                this.form.validateFields(['passwordConfirm'], { force: true })
                            }
                        }
                    }
                })
            },
            /**
             * 验证原密码
             */
            verifyPassword () {
                this.loading = true
                axios.post('/user/password/modifiy', {
                    traceId: tool.UUID(),
                    data: {
                        password: this.form.getFieldValue('password'),
                        newPassword: this.form.getFieldValue('passwordNew'),
                        confirmPassword: this.form.getFieldValue('passwordConfirm')
                    }
                })
                    .then(res => {
                        this.loading = false
                        if (res.data.code.toString() === '0') {
                            this.$message.success(this.$t(`code.${res.data.code.toString()}`))
                            // 跳转
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
                title: this.$t('PageTitle.modify_psw_login_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    .content-register {
        padding-top: 0.65rem;
        min-height: calc(100vh - 126px);
    }
    #components-form-BindMailbox {
        max-width: 5.52rem;
        margin: 0 auto;
        .components-form-BindMailbox {
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
            .ant-input{
                font-size:16px;
                padding: 0.08rem 0.12rem;
                height: 0.4rem;
                color:#000000;
            }
            .ant-btn {
                padding: 0.08rem 0.16rem;
                height: 0.4rem;
                font-size: 16px;
            }
            .BindMailbox-button {
                width: 100%;
                font-size: 16px;
                color:rgba(255,255,255,1)!important;
            }
        }
        .ant-form-vertical .ant-form-explain {
            margin-top: -0.01rem;
            margin-bottom: -0.02rem;
        }
    }
</style>

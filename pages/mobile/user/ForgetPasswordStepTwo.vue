<template>
    <a-layout id="components-layout-mobile-top"
              class="layout"
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
                    <div id="components-form-bind-mobile">
                        <p class="components-form-bind-mobile">
                            {{$t('ForgetPasswordStepTwo.account_forgotpsw_step2_title_headline')}}</p>
                        <a-form
                                :form="form"
                                :layout="formLayout"
                                @submit="handleSubmit">
                            <a-form-item :has-feedback="passwordFeedback" colon>
                                <span slot="label">{{$t('ForgetPasswordStepTwo.account_forgotpsw_step2_title_newpsw')}}</span>
                                <a-input
                                        style="font-family: 'San Francisco' !important;width: 100%;"
                                        @focus="setFields('passwordNew')"
                                        :placeholder="$t('ForgetPasswordStepTwo.account_forgotpsw_step2_placeholder_newpsw')"
                                        type="password"
                                        v-decorator="['passwordNew', {rules: [{ validator:checkForm }], validateTrigger: 'blur'}]">
                                </a-input>
                            </a-form-item>
                            <a-form-item :has-feedback="confirmPasswordFeedback" colon>
                                <span slot="label">{{$t('ForgetPasswordStepTwo.account_forgotpsw_step2_title_confirmpsw')}}</span>
                                <a-input
                                        style="font-family: 'San Francisco' !important;width: 100%;"
                                        @focus="setFields('passwordCofirm')"
                                        :placeholder="$t('ForgetPasswordStepTwo.account_forgotpsw_step2_placeholder_newpsw')"
                                        type="password"
                                        v-decorator="['passwordCofirm', {rules: [{ validator:checkForm }], validateTrigger: 'blur'}]">
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                        @click="handleSubmit"
                                        :loading="loading"
                                        type="primary"
                                        html-type="submit"
                                        class="bind-mobile-button">
                                    {{$t('ForgetPasswordStepTwo.account_forgotpsw_step2_btn_submit')}}
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
                type: 1,
                drawer: false,
                formLayout: 'vertical',
                centerKey: 0,
                // 表单参数
                formObject: {
                    // 接受参数
                    account: this.$route.query.account
                },
                // 加载loading
                loading: false,
                // 重置密码校验图标
                passwordFeedback: false,
                // 重置确认密码校验图标
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
                    this.form.getFieldError('passwordNew') && this.form.validateFields(['passwordNew'], {force: true})
                    this.form.getFieldError('passwordCofirm') && this.form.validateFields(['passwordCofirm'], {force: true})
                })
            },
            // 设置手机注册获取焦点状态
            setFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'passwordNew' : this.passwordFeedback = false; break
                case 'passwordCofirm' : this.confirmPasswordFeedback = false; break
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
             * 先判断位数最后判断值是否相等
             */
            checkForm (rule, value, callback) {
                switch (rule.fullField) {
                case 'passwordNew' :
                    if (!validate.required(value)) {
                        callback(this.$t('login.login_err_psw'))
                    } else if (!validate.password(value)) {
                        callback(this.$t('ForgetPasswordStepTwo.account_forgotpsw_step2_err_1'))
                    } else if (!validate.rangelength(value, [6, 20])) {
                        callback(this.$t('ForgetPasswordStepTwo.account_forgotpsw_step2_err_1'))
                    } else {
                        callback()
                    }
                    this.passwordFeedback = true
                    break
                case 'passwordCofirm' :
                    if (!validate.required(value)) {
                        callback(this.$t('login.login_err_psw'))
                    } else if ((this.form.getFieldValue('passwordNew')) !== (this.form.getFieldValue('passwordCofirm'))) {
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
            // 初始化form状态
            changeTabs () {
                this.form.resetFields()
            },
            /**
             * form 表单提交
             * @param e 提交事件
             */
            handleSubmit (e) {
                e.preventDefault()
                this.form.validateFields((err, values) => {
                    if (!err && (this.form.getFieldValue('passwordNew')) === (this.form.getFieldValue('passwordCofirm'))) {
                        // 重置密码密码
                        this.retrievePassword()
                    } else {
                        this.form.validateFields(['passwordCofirm'], {force: true})
                    }
                })
            },
            /**
             * 重置密码
             */
            retrievePassword () {
                this.loading = true
                axios.post('/user/password/retrieve', {
                    traceId: tool.UUID(),
                    data: {
                        account: this.formObject.account,
                        newPassword: this.form.getFieldValue('passwordNew'),
                        confirmPassword: this.form.getFieldValue('passwordCofirm')
                    }
                })
                    .then(res => {
                        this.loading = false
                        if (res.data.code.toString() === '0') {
                            this.$message.success(this.$t(`code.${res.data.code.toString()}`))
                            // （ 成功 ）跳转
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
                this.$router.push({path: '/mobile/user/login'})
            },
            // 开启右侧抽屉导航
            openDrawer () {
                this.drawer = true
            },
            // 关闭右侧抽屉导航
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
                title: this.$t('PageTitle.retrievepsw_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    .content-register {
        padding-top: 0.65rem;
        min-height: calc(100vh);
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
            .bind-mobile-button {
                width: 100%;
                font-size: 16px;
                color: rgba(255, 255, 255, 1) !important;
            }
        }
    }
</style>

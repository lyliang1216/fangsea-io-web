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
                            {{$t('ChangeMailBox.account_changbind_email_title_headline')}}</p>
                        <a-form
                                :form="form"
                                :layout="formLayout"
                                class=""
                                @submit="handleSubmit">
                            <a-form-item :has-feedback="emailOldFeedback" colon>
                                <span slot="label">{{$t('ChangeMailBox.account_changbind_email_title_oldemail')}}</span>
                                <a-input
                                        :placeholder="$t('ChangeMailBox.account_changbind_err_oldemailwrong')"
                                        type="email"
                                        @focus="setFields('emailOld')"
                                        v-decorator="['emailOld', {rules: [{ validator:checkForm }],validateTrigger: 'blur'}]">
                                </a-input>
                            </a-form-item>
                            <a-form-item :has-feedback="emailNewFeedback" colon>
                                <span slot="label">{{$t('ChangeMailBox.account_changbind_email_title_headline')}}</span>
                                <a-input
                                        :placeholder="$t('ChangeMailBox.account_changbind_err_newemailwrong')"
                                        type="email"
                                        @focus="setFields('emailNew')"
                                        v-decorator="['emailNew', {rules: [{ validator:checkForm }],validateTrigger: 'blur'}]">
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                        @click="handleSubmit"
                                        type="primary"
                                        :loading="loading"
                                        html-type="submit"
                                        class="BindMailbox-button">
                                    {{$t('ChangeMobile.account_changbind_btn_next')}}
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
                centerKey: 5,
                // 加载loading
                loading: false,
                // 账号状态标识
                emailOldFeedback: false,
                // 账号状态标识
                emailNewFeedback: false
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
                    this.form.getFieldError('emailOld') && this.form.validateFields(['emailOld'], {force: true})
                    this.form.getFieldError('emailNew') && this.form.validateFields(['emailNew'], {force: true})
                })
            },
            // 设置手机注册获取焦点状态
            setFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'emailOld' : this.emailOldFeedback = false; break
                case 'emailNew' : this.emailNewFeedback = false; break
                }
                let fieldsValue = this.form.getFieldsValue([field])
                this.form.resetFields([field])
                this.form.setFieldsValue(fieldsValue)
            },
            /**
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkForm (rule, value, callback) {
                switch (rule.fullField) {
                case 'emailOld' :
                    validate.email(value) ? callback() : callback(this.$t('register.register_email_err_email'))
                    this.emailOldFeedback = true
                    break
                case 'emailNew' :
                    if (!validate.email(value)) {
                        callback(this.$t('register.register_email_err_email'))
                    } else if ((this.form.getFieldValue('emailOld')) === (this.form.getFieldValue('emailNew'))) {
                        callback(this.$t('ChangeMailBox.account_changbind_err_emailsame'))
                    } else {
                        callback()
                    }
                    this.emailNewFeedback = true
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
                    if (!err) {
                        // 格式验证和非空验证之后
                        if ((this.form.getFieldValue('emailOld')) !== (this.form.getFieldValue('emailNew'))) {
                            //  验证原邮箱号码
                            this.verifyOriginal()
                        } else {
                            this.form.validateFields(['emailNew'], {force: true})
                        }
                    }
                })
            },
            /**
             *  下一步事件
             */
            nextStep () {
                this.$router.push({
                    path: '/mobile/user/UserCenter/MyMessage/ChangeMailBoxStepTwo',
                    query: {
                        account: this.form.getFieldValue('emailOld'),
                        newAccount: this.form.getFieldValue('emailNew')
                    }
                })
            },
            /**
             * 验证原邮箱号码
             */
            verifyOriginal () {
                this.loading = true
                axios.post('/user/account/self/check', {
                    traceId: tool.UUID(),
                    data: {
                        account: this.form.getFieldValue('emailOld'),
                        areaCode: ''
                    }
                })
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            // ( 成功 )则去验证换绑邮箱
                            this.verifyNewMailbox()
                        } else {
                            this.loading = false
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    }).catch(err => {
                        this.loading = false
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 验证新邮箱账号
             */
            verifyNewMailbox () {
                axios.post('/user/account/used/check', {
                    data: {
                        account: this.form.getFieldValue('emailNew'),
                        areaCode: ''
                    }
                })
                    .then(res => {
                        this.loading = false
                        if (res.data.code.toString() === '0') {
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
                border: 1rem solid rgba(46, 169, 223, 1);;
            }
        }
    }
</style>

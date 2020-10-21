<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key"/>
        <section class="container">
            <a-layout-content>
                <div class="content content-bind-mailbox">
                    <div id="components-form-bind-mailbox">
                        <p class="components-form-bind-mailbox">
                            {{$t('ChangeMailBox.account_changbind_email_title_headline')}}</p>
                        <a-form
                                :form="form"
                                :layout="formLayout"
                                @submit="handleSubmit">
                            <a-form-item :has-feedback="emailOldFeedback" colon>
                                <span slot="label">{{$t('ChangeMailBox.account_changbind_email_title_oldemail')}}</span>
                                <a-input
                                        :placeholder="$t('ChangeMailBox.account_changbind_err_oldemailwrong')"
                                        type="email"
                                        @focus="setFields('emailOld')"
                                        v-decorator="['emailOld', {rules: [{ validator:checkForm }],validateTrigger: 'blur'}]"
                                        style="width: 100%">
                                </a-input>
                            </a-form-item>
                            <a-form-item :has-feedback="emailNewFeedback" colon>
                                <span slot="label">{{$t('ChangeMailBox.account_changbind_email_title_headline')}}</span>
                                <a-input
                                        :placeholder="$t('ChangeMailBox.account_changbind_err_newemailwrong')"
                                        type="email"
                                        @focus="setFields('emailNew')"
                                        v-decorator="['emailNew', {rules: [{ validator:checkForm }],validateTrigger: 'blur'}]"
                                        style="width: 100%">
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                        @click="handleSubmit"
                                        type="primary"
                                        :loading="loading"
                                        html-type="submit"
                                        class="bind-mailbox-button">
                                    {{$t('ChangeMobile.account_changbind_btn_next')}}
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                </div>
            </a-layout-content>
        </section>
        <footer/>
    </a-layout>
</template>

<script>
    import FsHead from '~/components/computer/FangseaHeader'
    import footer from '~/components/computer/Footer'
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
                // 加载loading
                loading: false,
                // 账号状态标识
                emailOldFeedback: false,
                // 账号状态标识
                emailNewFeedback: false
            }
        },
        /**
         * 初始化form
         * **/
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
             * 表单验证
             * @param rule 检测对象
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
            /**
             * 初始化form状态
             * **/
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
                            // ( 成功 ) 则去验证换绑邮箱
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
                this.$router.push({
                    path: '/computer/user/UserCenter/MyMessage/ChangeMailboxStepTwo',
                    query: {
                        account: this.form.getFieldValue('emailOld'),
                        newAccount: this.form.getFieldValue('emailNew')
                    }
                })
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        components: {
            FsHead,
            footer
        },
        head () {
            return {
                title: this.$t('PageTitle.changbind_email_pagetitle')
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
            .ant-form-item-label {
                color: rgba(0, 0, 0, 0.85);
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

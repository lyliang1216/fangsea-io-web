<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key"/>
        <section class="container">
            <a-layout-content>
                <div class="content content-bind-mobile">
                    <div id="components-form-bind-mobile">
                        <p class="components-form-bind-mobile">
                            {{$t('BindMobile.account_bind_title_phoneheadline')}} </p>
                        <a-form
                                has-feedback
                                :form="form"
                                :layout="formLayout"
                                @submit="handleSubmit">
                            <a-form-item :has-feedback="phoneFeedback" colon>
                                <span slot="label"> {{$t('BindMobile.account_bind_title_phone')}} </span>
                                <a-input
                                        :placeholder="$t('BindMobile.account_bind_placeholder_phone')"
                                        type="tel"
                                        @focus="setFields('phone')"
                                        v-decorator="['phone', {rules: [{ validator:checkForm }],validateTrigger: 'blur',}]"
                                        style="width: 100%">
                                    <!-- 老手机区号 -->
                                    <select class="msg-select"
                                            @change="search"
                                            slot="addonBefore">
                                        <option v-for="val in mobileZones"
                                                :key="val.code"
                                                :selected="val.code === 'THA'"
                                                :value="`+${val.intelCode} ${val.code}`"
                                                v-if="val.disabled !== 'false'">
                                            {{val.localName}}&nbsp(+{{val.intelCode}})
                                        </option>
                                    </select>
                                </a-input>
                                <div class="my-code">{{myCode}}</div>
                            </a-form-item>
                            <a-form-item
                                    :label="$t('Captcha.vcode_title_vcode')">
                                <a-row class="bind-mobile-check">
                                    <a-input
                                            :placeholder="$t('Captcha.vcode_title_vcode')"
                                            @focus="setFields('captcha')"
                                            v-decorator="['captcha',{rules: [{ validator:checkForm }],validateTrigger: 'blur'}]"/>
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
                                        class="bind-mobile-button">
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
                formLayout: 'vertical',
                // 验证码
                captcha: '',
                // 计时器防止重复点击
                waitTimer: false,
                // 触发计时器前能否点击
                afterInterval: false,
                // 手机区号
                mobileZones: [],
                // 验证码按钮点击状态
                isSendCaptcha: false,
                // 表单数据
                formObject: {
                    // 按钮状态
                    disabled: false,
                    // 是否点击验证码发送按钮
                    isSendCapchta: false
                },
                //  国家编码
                nationalCode: {
                    old: 'THA'
                },
                // 加载loading
                loading: false,
                // 手机区号
                oldAreaCode: '66',
                // 当前手机区号
                myCode: '+66',
                // 账号状态标识
                phoneFeedback: false
            }
        },
        // 初始化form
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        created () {
            // 获取手机区号
            if (process.client) {
                this.listenI18n()
                this.getmobileZones()
            }
        },
        methods: {
            /**
             * 渲染老区号选中值
             * @param e 选中的值
             */
            search (e) {
                let arr = e.target.value.split(' ')
                this.oldAreaCode = arr[0].slice(1, arr[0].length)
                this.nationalCode.old = arr[1]
                this.myCode = arr[0]
            },
            // 设置手机注册获取焦点状态
            setFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'phone' : this.phoneFeedback = false; break
                }
                let fieldsValue = this.form.getFieldsValue([field])
                this.form.resetFields([field])
                this.form.setFieldsValue(fieldsValue)
            },
            /**
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             * 非空數字檢驗
             */
            checkForm (rule, value, callback) {
                switch (rule.fullField) {
                case 'phone' :
                    if (!validate.required(value)) {
                        callback(this.$t('BindMobile.account_bind_err_phone'))
                    } else if (!validate.number(value)) {
                        callback(this.$t('BindMobile.account_bind_err_phoneerr'))
                    } else {
                        callback()
                    }
                    this.phoneFeedback = true
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
             *  初始化form状态
             *  @param e 表单对象
             */
            changeTabs () {
                this.form.resetFields()
            },
            /**
             *  点击发送验证码需要验证手机号码是否为空以及各式
             *  校验邮箱账号以及发送验证码
             */
            checkFun () {
                // 触发表单验证
                if (validate.number(this.form.getFieldValue('phone')) && validate.required(this.form.getFieldValue('phone'))) {
                    // 发送请求
                    axios.post('/user/account/bind/check', {
                        traceId: tool.UUID(),
                        data: this.form.getFieldValue('phone')
                    })
                        .then(res => {
                            if (res.data.code.toString() === '0') {
                                this.captchaGet(this.form.getFieldValue('phone'))
                            } else {
                                this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                            }
                        }).catch(err => {
                            this.$message.error(this.$t(err.message))
                        })
                } else {
                    this.form.validateFields(['phone'], {force: true})
                }
            },
            /**
             *  监听动态数据国际化
             */
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.getmobileZones()
                    this.form.getFieldError('phone') && this.form.validateFields(['phone'], {force: true})
                    this.form.getFieldError('captcha') && this.form.validateFields(['captcha'], {force: true})
                })
            },
            /**
             * 获取手机区号
             */
            getmobileZones () {
                let data = {traceId: tool.UUID()}
                axios.post('/cms/region/query', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.mobileZones = res.data.data
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
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
                // 发送请求、拼接验证码、校验成功 ( 需要接受账号 ) 邮箱账号验证成功并发送验证码
                axios.post('/user/verifiycode/get', {
                    traceId: tool.UUID(),
                    data: {
                        areaCode: this.oldAreaCode,
                        account: account,
                        business: 'BIND'}
                })
                    .then(res => {
                        this.afterInterval = false
                        if (res.data.code.toString() === '0') {
                            this.$message.success(this.$t('Captcha.vcode_msg_success'))
                            // 成功才去开启定时器
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
             * **/
            nextStep () {
                this.$router.push({name: 'computer-user-UserCenter', query: {getKey: '5'}})
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
                        // 确认后添加按钮loading
                        this.loading = true
                        // 手机号添加区号
                        axios.post('/user/account/bind', {
                            traceId: tool.UUID(),
                            data: {
                                code: this.nationalCode.old,
                                account: values['phone'],
                                areaCode: this.oldAreaCode,
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
                title: this.$t('PageTitle.bindaccount_phone_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    .content-bind-mobile {
        padding-top: 65px;
        min-height: calc(100vh - 126px);
    }

    #components-form-bind-mobile {
        max-width: 552px;
        margin: 0 auto;
        .components-form-bind-mobile {
            margin-bottom: 32px;
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
            .ant-form-item-label {
                color: rgba(0, 0, 0, 0.85);
            }
            .ant-input-group-addon {
                font-size: 16px;
                padding: 8px 12px;
            }
            .ant-input {
                font-size: 16px;
                padding: 8px 12px;
                height: 40px;
                color: #000000;
            }
            .bind-mobile-check {
                display: flex;
                justify-content: space-between;
                input {
                    margin-right: 24px;
                }
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
            .bind-mobile-button {
                width: 100%;
                font-size: 16px;
                color: rgba(255, 255, 255, 1) !important;
            }
        }
    }
    .msg-select {
        color: rgba(0, 0, 0, 0.65);
        width: 70px;
        border: 0;
        background: none;
        outline: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
</style>

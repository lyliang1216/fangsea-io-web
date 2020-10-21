<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key"/>
        <section class="container">
            <a-layout-content>
                <div class="content content-bind-mailbox">
                    <div id="components-form-bind-mailbox">
                        <p class="components-form-bind-mailbox">{{$t('ChangeMobile.account_changbind_title_phone')}}</p>
                        <a-form
                                :form="form"
                                :layout="formLayout"
                                class=""
                                @submit="handleSubmit">
                            <a-form-item :has-feedback="phoneOldFeedback" colon>
                                <span slot="label">{{$t('ChangeMobile.account_changbind_title_oldphone')}}</span>
                                <a-input
                                        :placeholder="$t('ChangeMobile.account_changbind_placeholder_oldphone')"
                                        type="tel"
                                        @focus="setFields('phoneOld')"
                                        v-decorator="['phoneOld', {rules: [{ validator:checkForm }],validateTrigger: 'blur'}]"
                                        style="width: 100%">
                                    <!-- 老手机区号 -->
                                    <select class="msg-select"
                                            @change="searchOld"
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
                                <div class="my-code">{{oldMyCode}}</div>
                            </a-form-item>
                            <a-form-item :has-feedback="phoneNewFeedback" colon>
                                <span slot="label">{{$t('ChangeMobile.account_changbind_title_newphone')}}</span>
                                <a-input
                                        :placeholder="$t('ChangeMobile.account_changbind_placeholder_newphone')"
                                        type="tel"
                                        @focus="setFields('phoneNew')"
                                        v-decorator="['phoneNew', {rules: [{ validator:checkForm }],validateTrigger: 'blur'}]"
                                        style="width: 100%">
                                    <!-- 新手机区号 -->
                                    <select class="msg-select"
                                            @change="searchNew"
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
                                <div class="my-code">{{newMyCode}}</div>
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
        <fonter/>
    </a-layout>
</template>
<script>
    import FsHead from '~/components/computer/FangseaHeader'
    import fonter from '~/components/computer/Footer'
    import detector from '~/assets/utils/validate'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'

    export default {
        data () {
            return {
                key: '',
                visible: true,
                formLayout: 'vertical',
                // 手机区号
                mobileZones: [],
                //  国家编码
                nationalCode: {
                    old: 'THA',
                    new: 'THA'
                },
                // 原手机区号
                oldAreaCode: '66',
                // 新手机区号
                newAreaCode: '66',
                // 当前手机区号
                oldMyCode: '+66',
                // 新手机区号
                newMyCode: '+66',
                // 加载loading
                loading: false,
                // 账号状态标识
                phoneOldFeedback: false,
                // 账号状态标识
                phoneNewFeedback: false
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
            searchOld (e) {
                let arr = e.target.value.split(' ')
                this.oldAreaCode = arr[0].slice(1, arr[0].length)
                this.nationalCode.old = arr[1]
                this.oldMyCode = arr[0]
            },
            // 设置手机注册获取焦点状态
            setFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'phoneOld' : this.phoneOldFeedback = false; break
                case 'phoneNew' : this.phoneNewFeedback = false; break
                }
                let fieldsValue = this.form.getFieldsValue([field])
                this.form.resetFields([field])
                this.form.setFieldsValue(fieldsValue)
            },
            /**
             * 渲染新区号选中值
             * @param e 选中的值
             */
            searchNew (e) {
                let arr = e.target.value.split(' ')
                this.newAreaCode = arr[0].slice(1, arr[0].length)
                this.nationalCode.new = arr[1]
                this.newMyCode = arr[0]
            },
            /**
             *  监听动态数据国际化
             */
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.getmobileZones()
                    this.form.getFieldError('phoneOld') && this.form.validateFields(['phoneOld'], {force: true})
                    this.form.getFieldError('phoneNew') && this.form.validateFields(['phoneNew'], {force: true})
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
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkForm (rule, value, callback) {
                switch (rule.fullField) {
                case 'phoneOld' :
                    if (detector.amount(value)) {
                        callback()
                    }
                    callback(this.$t('ChangeMobile.account_changbind_err_oldphonewrong'))
                    this.phoneOldFeedback = true
                    break
                case 'phoneNew' :
                    if (detector.amount(value)) {
                        callback()
                    }
                    callback(this.$t('ChangeMobile.account_changbind_err_newphonewrong'))
                    this.phoneNewFeedback = true
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
                        if ((this.form.getFieldValue('phoneOld')) !== (this.form.getFieldValue('phoneNew'))) {
                            //  验证原手机号码
                            // this.verifyOriginalMobile(values)
                            // 手机号添加区号
                            this.loading = true
                            axios.post('/user/account/self/check', {
                                traceId: tool.UUID(),
                                data: {
                                    code: this.nationalCode.old,
                                    areaCode: this.oldAreaCode,
                                    account: values['phoneOld']
                                }
                            })
                                .then(res => {
                                    if (res.data.code.toString() === '0') {
                                        // ( 成功 )则去验证
                                        // this.verifyNewMobile(values)
                                        axios.post('/user/account/used/check', {
                                            traceId: tool.UUID(),
                                            data: {
                                                code: this.nationalCode.new,
                                                areaCode: this.newAreaCode,
                                                account: values['phoneNew']
                                            }
                                        })
                                            .then(response => {
                                                this.loading = false
                                                if (response.data.code.toString() === '0') {
                                                    // 跳转
                                                    this.nextStep()
                                                } else {
                                                    this.$message.error(this.$t(`code.${response.data.code.toString()}`))
                                                }
                                            }).catch(error => {
                                                this.loading = false
                                                this.$message.error(this.$t(error.message))
                                            })
                                    } else {
                                        this.loading = false
                                        this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                                    }
                                }).catch(err => {
                                    this.loading = false
                                    this.$message.error(this.$t(err.message))
                                })
                        } else {
                            this.$message.error(this.$t('ChangeMobile.account_changbind_err_phonesame'))
                        }
                    }
                })
            },
            /**
             *  下一步事件
             */
            nextStep () {
                this.$router.push({
                    path: '/computer/user/UserCenter/MyMessage/ChangeMobileStepTwo',
                    query: {
                        // 手机区号 （ 字母 ）
                        codeOld: this.nationalCode.old,
                        codeNew: this.nationalCode.new,
                        // 账号
                        account: this.form.getFieldValue('phoneOld'),
                        accountNew: this.form.getFieldValue('phoneNew'),
                        // 手机地区区号 （ 号码）
                        areaCodeOld: this.oldAreaCode,
                        areaCodeNew: this.newAreaCode

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
        .bind-mailbox-button {
            width: 100%;
            font-size: 16px;
            color: rgba(255, 255, 255, 1) !important;
        }
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
            .ant-btn {
                padding: 8px 16px;
                height: 40px;
                font-size: 16px;
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
    .msg-select {
        color: rgba(0, 0, 0, 0.65);
        width: 70px;
        border: 0;
        background: none;
        outline: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
</style>

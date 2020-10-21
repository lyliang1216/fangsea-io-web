<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key" :SelectedType="type"/>
        <section class="container">
            <a-layout-content>
                <div class="content content-register">
                    <div id="components-form-normal-register">
                        <p class="components-form-login-title">{{$t('register.register_title_headline')}}</p>
                        <!--            tabs 切换注册方式            -->
                        <a-tabs :defaultActiveKey="tabsKey" @change="changeTabs">
                            <a-tab-pane :tab="$t('register.register_tab_title_phone')" key="1"
                                        class="ant-tabs-nav-register">
                                <!--                 手机注册 start              -->
                                <a-form
                                        :form="form"
                                        :layout="formLayout"
                                        class="login-form"
                                        @submit="handleSubmit">
                                    <a-form-item :has-feedback="phoneFeedback" colon>
                                        <span slot="label">
                                            {{$t('register.register_tab_placeholder_phone')}}
                                             <span class="ant-form-text" id="ant-form-text">
                                                {{$t('register.register_tab_tip_phone')}}
                                             </span>
                                        </span>
                                        <a-input
                                                class="phone-input"
                                                @focus="setFields('phone')"
                                                style="width: 100%"
                                                :placeholder="$t('register.register_placeholder_phone')"
                                                v-decorator="[
                                                  'phone',
                                                  {
                                                  rules: [{ validator:checkForm }],
                                                  validateTrigger: 'blur'
                                                  }]">
                                            <select class="register-select"
                                                    @change="search"
                                                    slot="addonBefore">
                                                <option v-for="val in mobileZones"
                                                        :key="val.code"
                                                        :selected="val.code === 'THA'"
                                                        :value="`+${val.intelCode} ${val.code}`"
                                                        v-if="val.isRegiste !== 'false'">
                                                    {{val.localName}}&nbsp(+{{val.intelCode}})
                                                </option>
                                            </select>
                                        </a-input>
                                        <div class="my-code">{{myCode}}</div>
                                    </a-form-item>
                                    <a-form-item
                                            :has-feedback="passwordFeedback">
                                          <span slot="label">
                                             {{$t('register.register_title_psw')}}&nbsp;
                                              <a-tooltip placement="right"
                                                         :title="$t('register.register_psw_tip_1')">
                                                <a-icon type="info-circle" style="color: #FFC32B"/>
                                              </a-tooltip>
                                            </span>
                                        <a-input
                                                class="family-san"
                                                type="password"
                                                :read-only="readOnly"
                                                @focus="setFields('password')"
                                                v-decorator="['password',
                                                 {
                                                  validateTrigger: 'blur',
                                                  rules: [{ validator: checkForm}] }]"
                                                :placeholder="$t('register.register_tab_placeholder_psw')">
                                        </a-input>
                                    </a-form-item>
                                    <a-form-item
                                            :label="$t('register.register_tab_placeholder_repsw')"
                                            :has-feedback="confirmPasswordFeedback">
                                        <a-input
                                                class="family-san"
                                                type="password"
                                                :read-only="readOnly"
                                                @focus="setFields('confirmPassword')"
                                                v-decorator="[
                                                  'confirmPassword',
                                                  {
                                                  validateTrigger: 'blur',
                                                  rules: [{ validator:checkForm }]}]"
                                                :placeholder="$t('register.register_tab_placeholder_repsw')">
                                        </a-input>
                                    </a-form-item>
                                    <a-form-item
                                            :label="$t('register.register_tab_vcode_placeholder')">
                                        <a-row :gutter="24">
                                            <a-col :span="spanInput">
                                                <a-input
                                                        class="family-san"
                                                        @focus="setFields('captcha')"
                                                        :placeholder="$t('register.register_tab_vcode_placeholder')"
                                                        v-decorator="[
                                                          'captcha',
                                                          {
                                                          validateTrigger: 'blur',
                                                          rules: [{ validator:checkForm }]}
                                                        ]"/>
                                            </a-col>
                                            <a-col :span="spanButton">
                                                <a-button @click="getCaptcha('phone')" class="captcha-bt"
                                                          :disabled="disabledCapt">
                                                    {{catpBt}}
                                                </a-button>
                                            </a-col>
                                        </a-row>
                                    </a-form-item>
                                    <a-form-item
                                            v-if="isPlan"
                                            :label="$t('register.register_tab_title_plan')">
                                        <a-input
                                                v-model="UID"
                                                class="family-san"
                                                :placeholder="$t('register.register_tab_placeholder_plan')">
                                        </a-input>
                                    </a-form-item>
                                    <a-form-item v-show="licenseVisible">
                                        <a-checkbox
                                                @change="changeProtocol"
                                                v-decorator="['agreement', {valuePropName: 'checked', initialValue: true}]">
                                            {{$t('register.register_tab_content_agree')}}
                                            <a href="javascript:;" @click="showUserClose">
                                                {{$t('register.register_btn_protocol')}}
                                            </a>
                                        </a-checkbox>
                                    </a-form-item>
                                    <a-form-item>
                                        <a-button
                                                :loading="loadingProtocol"
                                                :disabled="disabledProtocol"
                                                type="primary"
                                                html-type="submit"
                                                class="login-form-button">
                                            {{$t('register.register_btn_sub')}}
                                        </a-button>
                                        <div class="login-form-forgot">
                                            {{$t('register.register_content_isregisted')}}
                                            <nuxt-link to="/computer/user/login">
                                                {{$t('register.register_btn_tologin')}}
                                            </nuxt-link>
                                        </div>
                                    </a-form-item>
                                </a-form>
                                <!--                 手机注册 end              -->
                            </a-tab-pane>
                            <a-tab-pane :tab="$t('register.register_tab_title_email')" key="2" forceRender class="ant-tabs-nav-register">
                                <!--               邮箱注册 start              -->
                                <a-form
                                        :form="emailForm"
                                        :layout="formLayout"
                                        class="login-form"
                                        @submit="handleEamilSubmit">
                                    <a-form-item
                                            :has-feedback="emailFeedback">
                                        <span slot="label">
                                           {{$t('register.register_tab_placeholder_email')}}&nbsp;
                                            <a-tooltip placement="right"
                                                       :title="$t('register.register_account_tip_email')">
                                              <a-icon type="info-circle" style="color: #FFC32B"/>
                                            </a-tooltip>
                                        </span>
                                        <a-input
                                                class="family-san"
                                                @focus="setEmailFields('email')"
                                                v-decorator="['email',
                                              {
                                              validateTrigger: 'blur',
                                              rules: [{ validator: checkForm}],
                                              initialValue: emailDafault}]"
                                                type="email"
                                                :placeholder="$t('register.register_tab_placeholder_email')">
                                        </a-input>
                                    </a-form-item>
                                    <a-form-item
                                            :has-feedback="passwordEmailFeedback">
                                        <span slot="label">
                                            {{$t('register.register_title_psw')}}&nbsp;
                                            <a-tooltip placement="right"
                                                       :title="$t('register.register_psw_tip_1')">
                                              <a-icon type="info-circle" style="color: #FFC32B"/>
                                            </a-tooltip>
                                          </span>
                                        <a-input
                                                class="family-san"
                                                type="password"
                                                :read-only="readOnly"
                                                @focus="setEmailFields('password-email')"
                                                v-decorator="['password-email',
                                                  {validateTrigger: 'blur',
                                                   rules: [{ validator: checkForm}] }]"
                                                :placeholder="$t('register.register_tab_placeholder_psw')">
                                        </a-input>
                                    </a-form-item>
                                    <a-form-item
                                            :label="$t('register.register_tab_placeholder_repsw')"
                                            :has-feedback="confirmPasswordEmailFeedback">
                                        <a-input class="family-san"
                                                 type="password"
                                                 :read-only="readOnly"
                                                 @focus="setEmailFields('confirmPassword-email')"
                                                 v-decorator="['confirmPassword-email',
                                                 {validateTrigger: 'blur',
                                                  rules: [{ validator:checkForm }]}]"
                                                 :placeholder="$t('register.register_tab_placeholder_repsw')">
                                        </a-input>
                                    </a-form-item>
                                    <a-form-item
                                            :label="$t('register.register_tab_vcode_placeholder')">
                                        <a-row :gutter="24">
                                            <a-col :span="spanInput">
                                                <a-input
                                                        class="family-san"
                                                        @focus="setEmailFields('captchaEmail')"
                                                        :placeholder="$t('register.register_tab_vcode_placeholder')"
                                                        v-decorator="['captchaEmail',
                                                          {validateTrigger: 'blur',
                                                          rules: [{ validator:checkForm }]}]"/>
                                            </a-col>
                                            <a-col :span="spanButton">
                                                <a-button @click="getCaptcha('email')" class="captcha-bt"
                                                          :disabled="disabledCaptEmail">
                                                    {{catpBtEmail}}
                                                </a-button>
                                            </a-col>
                                        </a-row>
                                    </a-form-item>
                                    <a-form-item
                                            v-if="isPlan"
                                            :label="$t('register.register_tab_title_plan')">
                                        <a-input
                                                v-model="UID"
                                                class="family-san"
                                                :placeholder="$t('register.register_tab_placeholder_plan')">
                                        </a-input>
                                    </a-form-item>
                                    <a-form-item v-show="licenseVisible">
                                        <a-checkbox
                                                @change="changeProtocolEmail"
                                                v-decorator="['agreement-email', {valuePropName: 'checked', initialValue: true}]">
                                            {{$t('register.register_tab_content_agree')}}
                                            <a href="javascript:;" @click="showUserClose">
                                                {{$t('register.register_btn_protocol')}}
                                            </a>
                                        </a-checkbox>
                                    </a-form-item>
                                    <a-form-item>
                                        <a-button
                                                :loading="loadingProtocolEmail"
                                                :disabled="disabledProtocolEmail"
                                                type="primary"
                                                html-type="submit"
                                                class="login-form-button">
                                            {{$t('register.register_btn_sub')}}
                                        </a-button>
                                        <div class="login-form-forgot">
                                            {{$t('register.register_content_isregisted')}}
                                            <nuxt-link to="/computer/user/login">
                                                {{$t('register.register_btn_tologin')}}
                                            </nuxt-link>
                                        </div>
                                    </a-form-item>
                                </a-form>
                                <!--               邮箱注册 end              -->
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                    <!--               免责协议            -->
                    <a-modal
                            class="modal-register"
                            v-model="visible"
                            :title="$t('register.register_title_disclaimer')"
                            :centered="true"
                            :closable="false"
                            :keyboard="false"
                            :maskClosable="false"
                            :width="640"
                            :height="480">
                        <template slot="footer">
                            <a-checkbox @change="change" style="float: left;"
                                        v-decorator="['agreement-modal', {valuePropName: 'checked'}]">
                                {{$t('register.register_tab_content_agree')}}
                            </a-checkbox>
                            <a-button type="primary" @click="handleClose" :disabled="disabled">
                                {{$t('register.register_btn_disclaimeragree')}}
                            </a-button>
                        </template>
                        <p v-html="exemptionAgreement"></p>
                    </a-modal>
                    <!--               用户协议              -->
                    <a-modal
                            class="modal-register"
                            v-model="userVisible"
                            :title="$t('register.register_popup_title_protocol')"
                            :centered="true"
                            :closable="false"
                            :keyboard="false"
                            :maskClosable="false"
                            :width="640"
                            :height="480">
                        <template slot="footer">
                            <a-button type="primary" @click="closeUserClose">
                                {{$t('register.register_btn_disclaimeragree')}}
                            </a-button>
                        </template>
                        <p v-html="userAgreement"></p>
                    </a-modal>
                </div>
            </a-layout-content>
        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import FsHead from '~/components/computer/FangseaHeader'
    import fonter from '~/components/computer/Footer'
    import {removeSpaces} from '~/assets/utils/rules'
    import validate from '~/assets/utils/validate'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'

    export default {
        /**
         * 请求手机区号
         */
        asyncData ({req, error}) {
            if (process.server) {
                let data = {traceId: tool.UUID()}
                return axios.post(`${tool.getAddress(req)}/cms/region/register/query`, data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            return {mobileZones: res.data.data}
                        }
                    })
                    .catch((e) => {
                        error({ statusCode: 500, message: e.toString() })
                    })
            }
        },
        data () {
            return {
                // 首页导航下标
                key: '0',
                // 登录、注册导航下标
                type: 2,
                // 表单排版风格
                formLayout: 'vertical',
                // 显示免责协议
                visible: false,
                // 显示用户协议
                userVisible: false,
                // 显示注册协议
                licenseVisible: false,
                // 免责协议确定按钮禁用
                disabled: true,
                // 手机表单提交按钮禁用
                disabledProtocol: false,
                // 手机表单提交按钮loading
                loadingProtocol: false,
                // 邮箱表单提交按钮禁用
                disabledProtocolEmail: false,
                // 邮箱表单提交按钮loading
                loadingProtocolEmail: false,
                // 免责协议内容
                exemptionAgreement: '',
                // 用户协议内容
                userAgreement: '',
                // 手机区号
                mobileZones: [],
                // 手机验证码倒计时
                countDown: 60,
                // 手机验证码按钮禁用
                disabledCapt: false,
                // 手机验证码国际化
                catpBt: this.$t('Captcha.vcode_btn_send'),
                // 邮箱验证码按钮倒计时
                countDownEmail: 60,
                // 邮箱验证码按钮禁用
                disabledCaptEmail: false,
                // 邮箱验证码国际化
                catpBtEmail: this.$t('Captcha.vcode_btn_send'),
                // 保存注册账号
                account: '',
                // 保存注册密码
                password: '',
                // 密码只读，防止浏览器自动填充
                readOnly: true,
                // 当前手机区号
                areacode: '66',
                // 当前区号的国际码
                code: 'THA',
                // 跳转地址
                redirectURL: '/',
                // 验证码输入框
                spanInput: 18,
                // 验证码按钮宽度
                spanButton: 6,
                // 手机校验图标
                phoneFeedback: false,
                // 手机密码校验图标
                passwordFeedback: false,
                // 手机确认密码校验图标
                confirmPasswordFeedback: false,
                // 邮箱校验图标
                emailFeedback: false,
                // 邮箱密码校验图标
                passwordEmailFeedback: false,
                // 邮箱确认密码校验图标
                confirmPasswordEmailFeedback: false,
                // 推荐码输入框
                isPlan: true,
                // 推荐码
                UID: '',
                // 倒计时
                setIntervalCD: '',
                // 当前手机区号
                myCode: '+66',
                // 三期邮箱传参
                emailDafault: '',
                // 切换邮箱手机tabs
                tabsKey: '1'
            }
        },
        // 初始化form
        beforeCreate () {
            this.form = this.$form.createForm(this)
            this.emailForm = this.$form.createForm(this)
        },
        created () {
            if (process.client) {
                this.getParams()
                this.listenI18n()
                this.queryExceptions('user.register.setting_member_license')
                this.queryExceptions('user.register.setting_member_exceptions')
                // 校验手机区号
                if (this.mobileZones.length === 0) {
                    this.getmobileZones()
                }
                if (Cookie.get('passEmail')) {
                    this.tabsKey = '2'
                    this.emailDafault = Cookie.get('passEmail')
                    Cookie.remove('passEmail')
                }
            }
        },
        mounted () {
            this.changeSpan()
        },
        methods: {
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.getmobileZones()
                    this.queryExceptions('user.register.setting_member_license')
                    this.queryExceptions('user.register.setting_member_exceptions')
                    this.changeSpan()
                    this.decoratorI18n()
                })
            },
            // 校验信息国际化
            decoratorI18n () {
                this.form.getFieldError('phone') && this.form.validateFields(['phone'], { force: true })
                this.form.getFieldError('password') && this.form.validateFields(['password'], { force: true })
                this.form.getFieldError('confirmPassword') && this.form.validateFields(['confirmPassword'], { force: true })
                this.form.getFieldError('captcha') && this.form.validateFields(['captcha'], { force: true })
                this.emailForm.getFieldError('email') && this.emailForm.validateFields(['email'], { force: true })
                this.emailForm.getFieldError('password-email') && this.emailForm.validateFields(['password-email'], { force: true })
                this.emailForm.getFieldError('confirmPassword-email') && this.emailForm.validateFields(['confirmPassword-email'], { force: true })
                this.emailForm.getFieldError('captchaEmail') && this.emailForm.validateFields(['captchaEmail'], { force: true })
            },
            // 获取路由参数
            getParams () {
                this.$route.query.redirectUrl ? this.redirectURL = this.$route.query.redirectUrl : this.redirectURL = '/'
                if (this.$route.query.UID) {
                    this.isPlan = false
                    this.UID = this.$route.query.UID
                } else {
                    this.isPlan = true
                    this.UID = ''
                }
            },
            // 设置手机注册获取焦点状态
            setFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'phone' : this.phoneFeedback = false; break
                case 'password' : this.passwordFeedback = false; break
                case 'confirmPassword' : this.confirmPasswordFeedback = false; break
                }
                // 改变手机密码框为可编辑
                if (field === 'password' || field === 'confirmPassword') {
                    this.readOnly = false
                }
                let fieldsValue = this.form.getFieldsValue([field])
                this.form.resetFields([field])
                this.form.setFieldsValue(fieldsValue)
            },
            // 设置邮箱注册获取焦点状态
            setEmailFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'email' : this.emailFeedback = false; break
                case 'password-email' : this.passwordEmailFeedback = false; break
                case 'confirmPassword-email' : this.confirmPasswordEmailFeedback = false; break
                }
                // 改变手机密码框为可编辑
                if (field === 'password-email' || field === 'confirmPassword-email') {
                    this.readOnly = false
                }
                let fieldsValue = this.emailForm.getFieldsValue([field])
                this.emailForm.resetFields([field])
                this.emailForm.setFieldsValue(fieldsValue)
            },
            /**
             * 表单验证
             * @param rule 检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkForm (rule, value, callback) {
                value = removeSpaces(value)
                switch (rule.fullField) {
                case 'phone' :
                    if (!validate.required(value)) {
                        callback(this.$t('register.register_phone_err_phonenum'))
                    } else if (!validate.plus(value)) {
                        callback(this.$t('register.register_phone_err_phonenum'))
                    } else {
                        callback()
                    }
                    this.phoneFeedback = true
                    break
                case 'password' :
                    if (!validate.required(value)) {
                        callback(this.$t('register.register_err_psw'))
                    } else if (!validate.password(value)) {
                        callback(this.$t('register.register_err_psw'))
                    } else if (!validate.rangelength(value, [6, 20])) {
                        callback(this.$t('register.register_err_psw'))
                    } else {
                        callback()
                    }
                    if (this.form.getFieldValue('confirmPassword')) {
                        this.form.validateFields(['confirmPassword'], { force: true })
                    }
                    this.passwordFeedback = true
                    break
                case 'confirmPassword' :
                    if (!validate.required(value)) {
                        callback(this.$t('register.register_err_psw'))
                    } else if (!validate.equalTo(value, this.form.getFieldValue('password'))) {
                        callback(this.$t('register.register_err_repswerr'))
                    } else {
                        callback()
                    }
                    this.confirmPasswordFeedback = true
                    break
                case 'captcha' :
                    if (!validate.required(value)) {
                        callback(this.$t('Captcha.vcode_err_code'))
                    } else if (!validate.minlength(value, 6)) {
                        callback(this.$t('Captcha.vcode_err_code'))
                    } else if (!validate.maxlength(value, 6)) {
                        callback(this.$t('Captcha.vcode_err_code'))
                    } else {
                        callback()
                    }
                    break
                case 'email' :
                    validate.email(value) ? callback() : callback(this.$t('register.register_email_err_email'))
                    this.emailFeedback = true
                    break
                case 'password-email' :
                    if (!validate.required(value)) {
                        callback(this.$t('register.register_err_psw'))
                    } else if (!validate.password(value)) {
                        callback(this.$t('register.register_err_psw'))
                    } else if (!validate.rangelength(value, [6, 20])) {
                        callback(this.$t('register.register_err_psw'))
                    } else {
                        callback()
                    }
                    if (this.emailForm.getFieldValue('confirmPassword-email')) {
                        this.emailForm.validateFields(['confirmPassword-email'], { force: true })
                    }
                    this.passwordEmailFeedback = true
                    break
                case 'confirmPassword-email' :
                    if (!validate.required(value)) {
                        callback(this.$t('register.register_err_psw'))
                    } else if (!validate.equalTo(value, this.emailForm.getFieldValue('password-email'))) {
                        callback(this.$t('register.register_err_repswerr'))
                    } else {
                        callback()
                    }
                    this.confirmPasswordEmailFeedback = true
                    break
                case 'captchaEmail' :
                    if (!validate.required(value)) {
                        callback(this.$t('Captcha.vcode_err_code'))
                    } else if (!validate.minlength(value, 6)) {
                        callback(this.$t('Captcha.vcode_err_code'))
                    } else if (!validate.maxlength(value, 6)) {
                        callback(this.$t('Captcha.vcode_err_code'))
                    } else {
                        callback()
                    }
                    break
                default:
                    callback()
                }
            },
            // 根据国际化布局
            changeSpan () {
                this.catpBt = this.$t('Captcha.vcode_btn_send')
                this.catpBtEmail = this.$t('Captcha.vcode_btn_send')
                // 根据语言长度布局
                switch (Cookie.get('language')) {
                case 'zh_TW' :
                    this.spanInput = 18
                    this.spanButton = 6
                    if (document.querySelector('#ant-form-text')) {
                        document.querySelector('#ant-form-text').style.cssText = 'display: inline-block'
                    }
                    break
                case 'zh_CN' :
                    this.spanInput = 18
                    this.spanButton = 6
                    if (document.querySelector('#ant-form-text')) {
                        document.querySelector('#ant-form-text').style.cssText = 'display: inline-block'
                    }
                    break
                case 'en_US' :
                    this.spanInput = 15
                    this.spanButton = 9
                    if (document.querySelector('#ant-form-text')) {
                        document.querySelector('#ant-form-text').style.cssText = 'display: block'
                    }
                    break
                }
            },
            /**
             * 获取选中手机区号和区号唯一标识
             * @param e 手机区号选中值
             */
            search (e) {
                let arr = e.target.value.split(' ')
                this.areacode = arr[0].slice(1, arr[0].length)
                this.code = arr[1]
                this.myCode = arr[0]
            },
            /**
             * 获取手机区号
             */
            getmobileZones () {
                let data = {traceId: tool.UUID()}
                axios.post('/cms/region/register/query', data)
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
             * @param key 查询关键字
             */
            queryExceptions (key) {
                let data = {traceId: tool.UUID(), data: { app: 'user', key: key }}
                axios.post('/cms/config/query', data)
                    .then(res => {
                        if (res.data.code.toString() === '0' && res.data.data) {
                            if (key === 'user.register.setting_member_license') {
                                this.licenseVisible = res.data.data.isUse
                                this.userAgreement = res.data.data.value
                            } else {
                                this.visible = res.data.data.isUse
                                this.exemptionAgreement = res.data.data.value
                            }
                        } else {
                            this.visible = false
                            this.licenseVisible = false
                            this.exemptionAgreement = ''
                            this.userAgreement = ''
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * form 手机注册
             * @param e 提交事件
             */
            handleSubmit (e) {
                e.preventDefault()
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.loadingProtocol = true
                        this.account = values['phone']
                        this.password = values['password']
                        // 手机号添加区号
                        let data = {
                            traceId: tool.UUID(),
                            data: {
                                code: this.code,
                                areaCode: this.areacode,
                                recommendCode: removeSpaces(this.UID),
                                recommendCodeAuto: !this.isPlan,
                                account: removeSpaces(values['phone']),
                                password: values['password'],
                                confirmPassword: values['confirmPassword'],
                                verifyCode: removeSpaces(values['captcha'])
                            }
                        }
                        new Promise((resolve, reject) => {
                            axios.post('/user/register', data)
                                .then(res => {
                                    resolve(res)
                                })
                                .catch(err => {
                                    reject(err)
                                })
                        })
                            .then(res => {
                                if (res.data.code.toString() === '0') {
                                    let data = {
                                        traceId: tool.UUID(),
                                        data: {
                                            account: this.account,
                                            password: this.password
                                        }
                                    }
                                    this.login(data)
                                } else {
                                    this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                                }
                                this.loadingProtocol = false
                            })
                            .catch(err => {
                                this.loadingProtocol = false
                                this.$message.error(this.$t(err.message))
                            })
                    }
                })
            },
            /**
             * form 邮箱注册
             * @param e 提交事件
             */
            handleEamilSubmit (e) {
                e.preventDefault()
                this.emailForm.validateFields((err, values) => {
                    if (!err) {
                        this.loadingProtocolEmail = true
                        this.account = values['email']
                        this.password = values['password-email']
                        let data = {
                            traceId: tool.UUID(),
                            data: {
                                account: removeSpaces(values['email']),
                                password: values['password-email'],
                                confirmPassword: values['confirmPassword-email'],
                                verifyCode: removeSpaces(values['captchaEmail']),
                                recommendCode: removeSpaces(this.UID),
                                recommendCodeAuto: !this.isPlan
                            }
                        }
                        new Promise((resolve, reject) => {
                            axios.post('/user/register', data)
                                .then(res => {
                                    resolve(res)
                                })
                                .catch(err => {
                                    reject(err)
                                })
                        })
                            .then(res => {
                                if (res.data.code.toString() === '0') {
                                    let data = {
                                        traceId: tool.UUID(),
                                        data: {
                                            account: this.account,
                                            password: this.password
                                        }
                                    }
                                    this.login(data)
                                } else {
                                    this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                                }
                                this.loadingProtocolEmail = false
                            })
                            .catch(err => {
                                this.loadingProtocolEmail = false
                                this.$message.error(this.$t(err.message))
                            })
                    }
                })
            },
            /**
             * 注册成功自动登录
             * @param data 登录提交信息
             */
            login (data) {
                let formdata = new FormData()
                formdata.append('traceId', tool.UUID())
                formdata.append('username', removeSpaces(data.data.account))
                formdata.append('password', data.data.password)
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
                            // 保存用户语种
                            axios.post('/user/account/language/save').then(() => {
                                // 跳转首页
                                window.location.href = this.redirectURL
                            })
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 获取注册验证码
             * @ param type 验证码类型
             */
            getCaptcha (type) {
                let account = type === 'phone' ? this.form.getFieldValue('phone') : this.emailForm.getFieldValue('email')
                if (!validate.required(account)) {
                    type === 'phone' ? this.form.validateFields(['phone'], { force: true }) : this.emailForm.validateFields(['email'], { force: true })
                } else if (type === 'phone' && !validate.plus(account)) {
                    this.form.validateFields(['phone'], { force: true })
                } else if (type === 'email' && !validate.email(account)) {
                    this.form.validateFields(['email'], { force: true })
                } else {
                    type === 'phone' ? this.disabledCapt = true : this.disabledCaptEmail = true
                    let data = {
                        traceId: tool.UUID(),
                        data: {
                            areaCode: this.areacode,
                            account: removeSpaces(account),
                            business: 'REGISTER'
                        }
                    }
                    this.countdown(type)
                    axios.post('/user/verifiycode/get', data)
                        .then(res => {
                            if (res.data.code.toString() === '0') {
                                this.$message.success(this.$t('register.register_result_success_msg'))
                            } else {
                                type === 'phone' ? this.disabledCapt = false : this.disabledCaptEmail = false
                                this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                            }
                        })
                        .catch(err => {
                            type === 'phone' ? this.disabledCapt = false : this.disabledCaptEmail = false
                            this.$message.error(this.$t(err.message))
                        })
                }
            },
            /**
             * 倒计时
             * @param type 倒计时类型
             */
            countdown (type) {
                if (type === 'phone') {
                    this.disabledCapt = true
                    this.catpBt = '60 s'
                    this.setIntervalCD = self.setInterval(() => {
                        if (this.countDown > 0) {
                            this.countDown--
                            this.catpBt = `${this.countDown} s`
                        } else {
                            this.countDown = 60
                            this.catpBt = this.$t('Captcha.vcode_btn_resend')
                            window.clearInterval(this.setIntervalCD)
                            this.disabledCapt = false
                        }
                    }, 1000)
                } else {
                    this.disabledCaptEmail = true
                    this.catpBtEmail = '60 s'
                    this.setIntervalCD = self.setInterval(() => {
                        if (this.countDownEmail > 0) {
                            this.countDownEmail--
                            this.catpBtEmail = `${this.countDownEmail} s`
                        } else {
                            this.countDownEmail = 60
                            this.catpBtEmail = this.$t('Captcha.vcode_btn_resend')
                            window.clearInterval(this.setIntervalCD)
                            this.disabledCaptEmail = false
                        }
                    }, 1000)
                }
            },
            // 关闭免责窗口
            handleClose () {
                this.visible = false
            },
            // 显示协议窗口
            showUserClose () {
                this.userVisible = true
            },
            // 关闭协议窗口
            closeUserClose () {
                this.userVisible = false
            },
            /**
             * 是否同意免责
             * @param e checkbox对象
             */
            change (e) {
                this.disabled = !e.target.checked
            },
            /**
             * 是否同意协议：手机
             * @param e checkbox对象
             */
            changeProtocol (e) {
                this.disabledProtocol = !e.target.checked
            },
            /**
             * 是否同意协议：邮件
             * @param e checkbox对象
             */
            changeProtocolEmail (e) {
                this.disabledProtocolEmail = !e.target.checked
            },
            /**
             * 初始化form状态
             * @param e tabs对象
             */
            changeTabs (e) {
                this.code = 'THA'
                this.readOnly = true
                this.disabledProtocol = false
                this.loadingProtocol = false
                this.disabledProtocolEmail = false
                this.loadingProtocolEmail = false
                this.form.resetFields()
                this.emailForm.resetFields()
                if (this.isPlan) {
                    this.UID = ''
                }
            }
        },
        // 销毁事件监听
        beforeDestroy () {
            Bus.$off('checkLange')
            window.clearInterval(this.setIntervalCD)
        },
        components: {
            FsHead,
            fonter
        },
        head () {
            return {
                title: this.$t('PageTitle.register_pagetitle')
            }
        }
    }
</script>

<style lang="less">
    .modal-register {
        max-height: 480px;
        min-height: 480px;

        .ant-modal-body {
            min-height: 350px;
            max-height: 350px;
            overflow-y: auto;
        }

        .ant-modal-footer {
            padding: 20px 24px;
        }
    }

    .ant-tooltip-placement-right /deep/ .ant-tooltip-inner {
        white-space: pre-wrap;
    }
</style>

<style lang="less" scoped>
    .family-san {
        font-family: 'San Francisco' !important;
    }

    .register-select {
        color: rgba(0, 0, 0, 0.65);
        width: 70px;
        border: 0;
        background: none;
        outline: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }

    .content-register {
        padding-top: 65px !important;
        min-height: calc(100vh - 126px) !important;
    }

    #components-form-normal-register {
        max-width: 552px;
        margin: 0 auto;

        /deep/ .ant-form-item-required:before {
            display: none;
        }

        /deep/ .ant-tabs-bar {
            border: none;
        }

        /deep/ .ant-tabs-tab {
            font-size: 16px;
        }

        .login-form-forgot {
            float: right;
            margin-top: 14px;
        }

        .login-form-button {
            width: 100%;
        }

        .components-form-login-title {
            margin-bottom: 13px;
            font-size: 24px;
            color: rgba(0, 0, 0, 0.85);
        }

        a, a:hover, a:focus, a:visited {
            color: #2EA9DF;
            font-size: 14px;
        }

        .ant-form-item-label {
            color: rgba(0, 0, 0, 0.85);
        }

        /deep/ .ant-input, .ant-btn {
            height: 40px;
        }

        /deep/ .ant-input {
            font-family: "San Francisco" !important;
        }

        .ant-form-text {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.45);
        }

        .captcha-bt {
            width: 100%;
            color: #2EA9DF;
            border: 1px solid rgba(46, 169, 223, 1);
        }

        .captcha-bt-dis{
            color: #F5F5F5;
            border: 1px solid #F5F5F5;
        }
    }
</style>

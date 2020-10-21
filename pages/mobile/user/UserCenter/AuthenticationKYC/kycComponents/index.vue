<template>
    <section class="container">
        <a-locale-provider :locale="localeLange">
            <a-layout-content>
            <div class="kyc-content">
                <div class="kycfaild" v-if="auditState === 1">
                    <a-icon class="closecircle" type="close-circle"/>
                    <p>{{auditRemark}}</p>
                </div>
                <div class="kyc-title">
                    <h3 v-if="auditState !== 3">{{$t('AuthenticationKYC.kyc_title_headline')}}</h3>
                    <h3 v-else>{{$t('AuthenticationKYC.kyc_update_title')}}</h3>
                    <p class="title-two" v-if="auditState !== 3">{{$t('AuthenticationKYC.kyc_content_1')}}</p>
                    <p class="title-two" v-else>{{$t('AuthenticationKYC.kyc_update_tips')}}</p>
                </div>
                <a-form
                        :form="form"
                        :layout="formlayout"
                        @submit="handleSubmit"
                        class="kcy-form">
                    <!-- 选择国家 -->
                    <a-form-item :label="$t('AuthenticationKYC.kyc_title_nationality')" :colon="false" v-if="auditState !== 3">
                        <select class="checkcountry"
                                v-if="kycform.countryid !== ''"
                                @change="checkcountry"
                                :placeholder="$t('AuthenticationKYC.kyc_err_nationality')"
                                name="country">
                            <option
                                    v-for="val in country"
                                    :key="val.localName"
                                    :selected="kycform.countryid === '' ? false : val.regionId.toString() === kycform.countryid.toString()"
                                    :value="val.regionId">
                                {{val.localName}}
                            </option>
                        </select>
                        <select class="checkcountry"
                                v-else
                                @change="checkcountry"
                                :placeholder="$t('AuthenticationKYC.kyc_err_nationality')"
                                name="country">
                            <option
                                    v-for="val in country"
                                    :key="val.localName"
                                    :selected="val.regionId === '199'"
                                    :value="val.regionId">
                                {{val.localName}}
                            </option>
                        </select>
                    </a-form-item>
                    <!-- 姓名 -->
                    <a-form-item :label="$t('AuthenticationKYC.kyc_title_lastname')" :colon="false" v-if="auditState !== 3"
                                 :has-feedback="lastnameFeedback">
                        <a-input class="last-name" @focus="setFields('lastname')"
                                 v-decorator="[
                                        'lastname',
                                        {validateTrigger: 'blur', rules: [{validator: checkLastname}],
                                        initialValue: lastnamevalue}]"
                                 :placeholder="$t('AuthenticationKYC.kyc_placeholder_lastname')"/>
                    </a-form-item>
                    <a-form-item :label="$t('AuthenticationKYC.kyc_title_firstname')" :colon="false" v-if="auditState !== 3"
                                 :has-feedback="firstnameFeedback">
                        <a-input class="first-name" @focus="setFields('firstname')"
                                 v-decorator="[
                                        'firstname',
                                        {validateTrigger: 'blur', rules: [{validator: checkFirstname}],
                                        initialValue: firstnamevalue}]"
                                 :placeholder="$t('AuthenticationKYC.kyc_placeholder_firstname')"/>
                    </a-form-item>
                    <!-- 出生日期 -->
                    <a-form-item :label="$t('AuthenticationKYC.kyc_title_borthday')" :colon="false" v-if="auditState !== 3">
                        <a-date-picker
                                class="kyc-item-input"
                                :disabledDate="disabledDate"
                                width="100%"
                                @change="dateChange"
                                v-decorator="[
                                    'defaultbirth',
                                    {rules: [
                                        {type: 'object', validator: checkBirth}
                                    ],
                                    initialValue: defaultbirth}]"
                                :placeholder="$t('AuthenticationKYC.kyc_err_borthday')"
                                :format="dateFormat"/>
                    </a-form-item>
                    <!-- 护照号码 -->
                    <a-form-item :label="$t('AuthenticationKYC.kyc_title_identification')" :colon="false"
                                 :has-feedback="passportIDFeedback">
                        <a-input class="kyc-item-input" @focus="setFields('passportID')"
                                 v-decorator="[
                                    'passportID',
                                    {validateTrigger: 'blur', rules: [{validator: checkPassportID}],
                                    initialValue: passportIDvalue}]"
                                 :placeholder="$t('AuthenticationKYC.kyc_err_identification')"/>
                    </a-form-item>
                    <!-- 护照有效期 -->
                    <a-form-item :colon="false">
                        <label slot="label">
                            {{$t('AuthenticationKYC.kyc_title_passport_validity')}}
                            <span class="kyc-sublabel">{{$t('AuthenticationKYC.kyc_tip_passport_validity')}}</span>
                        </label>
                        <a-date-picker
                                class="kyc-item-input"
                                width="100%"
                                :placeholder="$t('AuthenticationKYC.kyc_placeholder_passport_validity')"
                                v-decorator="[
                                    'passportValidityDate',
                                    {rules: [{
                                        type: 'object', validator: checkPassportValidityDate}],
                                        initialValue: passportValidityDate
                                    }]"
                                :format="dateFormat"/>
                    </a-form-item>
                    <!-- 图片上传 -->
                    <a-form-item :label="$t('AuthenticationKYC.kyc_title_photo')" :colon="false">
                        <p class="title-two-no">{{$t('AuthenticationKYC.kyc_content_phototip')}}</p>
                        <div class="passport">
                            <!-- 护照封面 -->
                            <imgUpload
                                    :txt="$t('AuthenticationKYC.kyc_content_photo1')"
                                    :action="action"
                                    :num="1"
                                    :defaultfilelist="coverfilelist"
                                    :imageType="1"
                                    :maxsize="5"
                                    :ispic="true"
                                    @removepic="removeCover"
                                    @changepic="successSaveCover"></imgUpload>
                            <!-- 护照内页 -->
                            <imgUpload
                                    :txt="$t('AuthenticationKYC.kyc_content_photo2')"
                                    :action="action"
                                    :num="1"
                                    :defaultfilelist="infofilelist"
                                    :imageType="1"
                                    :maxsize="5"
                                    :ispic="true"
                                    @removepic="removeInfo"
                                    @changepic="successSaveInfo"></imgUpload>
                        </div>
                        <div class="right-img">
                            <div class="img">
                                <img src="/content//passport_photo1.jpg">
                                <div @click="handlePreviewimg('cover')">
                                    <span>{{$t('AuthenticationKYC.kyc_photo_btn_view')}}</span></div>
                            </div>
                            <div class="img">
                                <img src="/content//passport_photo2.jpg">
                                <div @click="handlePreviewimg('info')">
                                    <span>{{$t('AuthenticationKYC.kyc_photo_btn_view')}}</span></div>
                            </div>
                        </div>
                        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                            <img alt="example" style="width: 100%" :src="previewImage"/>
                        </a-modal>
                    </a-form-item>
                    <a-form-item class="submit-box">
                        <a-button
                                @click="handleSubmit"
                                type="primary"
                                :loading="loading"
                                html-type="submit"
                                class="submit-button">
                            {{$t('AuthenticationKYC.kyc_btn_submit')}}
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-layout-content>
        </a-locale-provider>
    </section>
</template>

<script>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW'
    import enUS from 'ant-design-vue/lib/locale-provider/en_US'
    import ImgUpload from '~/components/computer/ImgUpload'
    import validate from '~/assets/utils/validate'
    import {parseTime} from '~/assets/utils/index'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'
    import moment from 'moment'

    export default {
        props: ['kycData', 'country'],
        data () {
            return {
                // 组件国际化
                localeLange: zhTW,
                id: '',
                // 日期格式
                dateFormat: 'YYYY/MM/DD',
                // 表单格式
                formlayout: 'vertical',
                // 上传内容
                kycform: {
                    birthday: '1970-01-01',
                    passportCover: '',
                    passportInfo: '',
                    countryid: ''
                },
                // 显示预览
                previewVisible: false,
                // 预览图片路径
                previewImage: '',
                // 图片上传地址
                action: '/file/upload',
                // 默认姓氏
                lastnamevalue: '',
                // 默认名字
                firstnamevalue: '',
                // 默认出生日期
                defaultbirth: null,
                // 默认护照号码
                passportIDvalue: '',
                // 默认护照有效期
                passportValidityDate: null,
                // 默认封面
                coverfilelist: [],
                // 默认内页
                infofilelist: [],
                // 备注信息
                auditRemark: '',
                // 审核状态 true是未通过
                auditState: false,
                // 创建时间
                createTime: '',
                // 加载loading
                loading: false,
                // 姓名校验图标
                lastnameFeedback: false,
                // 姓名校验图标
                firstnameFeedback: false,
                // 护照号校验图标
                passportIDFeedback: false
            }
        },
        /**
         * 初始化form
         */
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        created () {
            if (process.client) {
                this.listenI18n()
                this.initLang()
                this.getkycinfo()
            }
        },
        methods: {
            /**
             * 初始化国际化
             */
            initLang () {
                switch (Cookie.get('language')) {
                case 'zh_CN':
                    this.localeLange = zhCN
                    break
                case 'zh_TW':
                    this.localeLange = zhTW
                    break
                case 'en_US':
                    this.localeLange = enUS
                    break
                default:
                    this.localeLange = zhTW
                    break
                }
            },
            /**
             * 获取kyc认证信息
             */
            getkycinfo () {
                this.auditState = false
                if (JSON.stringify(this.kycData) !== '{}') {
                    let data = this.kycData
                    this.id = data.id
                    this.kycform.countryid = data.nationality
                    this.lastnamevalue = data.familyName
                    this.firstnamevalue = data.selfName
                    this.auditRemark = data.auditRemark
                    this.createTime = data.createTime * 1000
                    if ((data.passportEndTime - parseInt(this.getnowtime() / 1000) < 30 * 24 * 60 * 60) && data.auditState === 2) {
                        this.auditState = 3
                    } else {
                        this.auditState = data.auditState
                        this.passportIDvalue = data.passportNo
                        this.passportValidityDate = moment.unix(data.passportEndTime + 1 - 24 * 3600)
                        this.kycform.passportCover = data.passportCover
                        this.kycform.passportInfo = data.passportInfo
                        this.coverfilelist = [{
                            uid: this.kycform.passportCover,
                            name: 'passportCover.jpg',
                            url: '/' + data.passportCoverUrl
                        }]
                        this.infofilelist = [{
                            uid: this.kycform.passportInfo,
                            name: 'passportInfo.jpg',
                            url: '/' + data.passportInfoUrl
                        }]
                    }
                    this.defaultbirth = moment(parseTime(data.birthday, '{y}-{m}-{d}'), 'YYYY-MM-DD')
                    this.kycform.birthday = parseTime(data.birthday, '{y}-{m}-{d}')
                }
            },
            /**
             *  选择国家
             *  @param e 元素
             */
            checkcountry (e) {
                let arr = e.target.value.split(' ')
                this.kycform.countryid = arr[0]
            },
            moment,
            /**
             *  禁选未来时间
             */
            disabledDate (current) {
                return current && current > moment().endOf('day')
            },
            /**
             *  获取当前时间戳
             */
            getnowtime () {
                return (new Date()).getTime()
            },
            /**
             *  关闭查看大图弹框
             */
            handleCancel () {
                this.previewVisible = false
            },
            /**
             *  点击查看示例图
             */
            handlePreviewimg (val) {
                if (val === 'cover') {
                    this.previewImage = '/passport_photo1.jpg'
                } else {
                    this.previewImage = '/passport_photo2.jpg'
                }
                this.previewVisible = true
            },
            /**
             *  图片上传成功，封面
             *  @param data 上传图片id
             */
            successSaveCover (data) {
                this.kycform.passportCover = data.imageId
            },
            /**
             *  图片删除，封面
             */
            removeCover () {
                this.kycform.passportCover = ''
            },
            /**
             *  图片上传成功，内页
             *  @param data 上传图片id
             */
            successSaveInfo (data) {
                this.kycform.passportInfo = data.imageId
            },
            /**
             *  图片删除，内页
             */
            removeInfo () {
                this.kycform.passportInfo = ''
            },
            /**
             *  日期选择变化后获取
             *  @param date 日期
             *  @param dateString 完整日期
             */
            dateChange (date, dateString) {
                let birth = dateString.split('/')
                this.kycform.birthday = birth[0] + '-' + birth[1] + '-' + birth[2]
            },
            /**
             * 检测姓氏
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkLastname (rule, value, callback) {
                if (!validate.required(value)) {
                    callback(this.$t('AuthenticationKYC.kyc_placeholder_lastname'))
                } else if (value.length > 50) {
                    callback(this.$t('AuthenticationKYC.kyc_placeholder_name_length'))
                } else {
                    callback()
                }
            },
            /**
             * 检测名
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkFirstname (rule, value, callback) {
                if (!validate.required(value)) {
                    callback(this.$t('AuthenticationKYC.kyc_placeholder_firstname'))
                } else if (value.length > 50) {
                    callback(this.$t('AuthenticationKYC.kyc_placeholder_name_length'))
                } else {
                    callback()
                }
            },
            /**
             * 检测出生日期
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkBirth (rule, value, callback) {
                if (value === null) {
                    callback(this.$t('AuthenticationKYC.kyc_err_borthday'))
                } else {
                    callback()
                }
            },
            /**
             * 检测护照号码
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkPassportID (rule, value, callback) {
                if (!validate.required(value)) {
                    callback(this.$t('AuthenticationKYC.kyc_err_identification'))
                } else if (value.length > 100) {
                    callback(this.$t('AuthenticationKYC.kyc_placeholder_num_length'))
                } else {
                    callback()
                }
            },
            /**
             * 检测护照有效期
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkPassportValidityDate (rule, value, callback) {
                if (value === null) {
                    callback(this.$t('AuthenticationKYC.kyc_placeholder_passport_validity'))
                } else {
                    callback()
                }
            },
            /**
             *  提交表单
             *  @param e 提交事件
             */
            handleSubmit (e) {
                e.preventDefault()
                if (this.kycform.countryid === '') {
                    this.kycform.countryid = '199'
                }
                // 表单验证
                this.form.validateFieldsAndScroll((err, values) => {
                    let passportValidate = true
                    let passportEndDate = Date.parse(new Date(values.passportValidityDate.format('YYYY-MM-DD') + ' 23:59:59')) / 1000
                    if (this.kycform.passportCover === '' || this.kycform.passportInfo === '') {
                        this.$message.error(this.$t('AuthenticationKYC.kyc_err_photo12'))
                        passportValidate = false
                    }
                    if ((passportEndDate - Date.parse(new Date()) / 1000) < 90 * 24 * 3600) {
                        this.$message.error(this.$t('AuthenticationKYC.kyc_err_passport_validity'))
                        return false
                    }
                    if (!err && passportValidate) {
                        let time = ''
                        this.createTime !== '' ? time = this.createTime : time = this.getnowtime()
                        this.loading = true
                        axios.post('/user/kyc/save', {
                            traceId: tool.UUID(),
                            data: {
                                id: this.id,
                                // 国家
                                nationality: this.kycform.countryid,
                                // 生日
                                birthday: this.kycform.birthday.substring(0, 10),
                                // 姓
                                familyName: values.lastname,
                                // 名
                                selfName: values.firstname,
                                // 护照号
                                passportNo: values.passportID,
                                // 护照封面
                                passportCover: this.kycform.passportCover,
                                // 护照内页
                                passportInfo: this.kycform.passportInfo,
                                auditState: '',
                                auditRemark: '',
                                updateTime: parseInt(this.getnowtime() / 1000),
                                // 创建时间
                                createTime: parseInt(time / 1000),
                                // 护照有效期
                                passportEndTime: passportEndDate
                            }
                        })
                            .then(res => {
                                this.loading = false
                                if (res.data.code.toString() === '0') {
                                    this.$emit('sbmitsuccess', 0)
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
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    switch (Cookie.get('language')) {
                    case 'zh_CN':
                        this.localeLange = zhCN
                        break
                    case 'zh_TW':
                        this.localeLange = zhTW
                        break
                    case 'en_US':
                        this.localeLange = enUS
                        break
                    default:
                        this.localeLange = zhTW
                        break
                    }
                    this.form.getFieldError('lastname') && this.form.validateFields(['lastname'], { force: true })
                    this.form.getFieldError('firstname') && this.form.validateFields(['firstname'], { force: true })
                    this.form.getFieldError('defaultbirth') && this.form.validateFields(['defaultbirth'], { force: true })
                    this.form.getFieldError('passportID') && this.form.validateFields(['passportID'], { force: true })
                    this.form.getFieldError('passportValidityDate') && this.form.validateFields(['passportValidityDate'], { force: true })
                })
            },
            // 设置获取焦点状态
            setFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'lastname' : this.lastnameFeedback = false; break
                case 'firstname' : this.firstnameFeedback = false; break
                case 'passportID' : this.passportIDFeedback = false; break
                }
                let fieldsValue = this.form.getFieldsValue([field])
                this.form.resetFields([field])
                this.form.setFieldsValue(fieldsValue)
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        components: {
            ImgUpload
        }
    }
</script>

<style lang="less" scoped>
    .container {
        background: #fff;
    }

    .kyc-content {
        padding: 0 0.16rem;
        background: #fff;
    }

    .checkcountry {
        width: 100%;
        height: 0.4rem;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.65);
        background-color: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 0 2.8%;
        box-sizing: border-box;
    }

    .kycfaild {
        width: 100%;
        border: 1px solid #FF9483;
        box-sizing: border-box;
        background: #FFE5E2;
        font-size: 14px;
        line-height: 0.2rem;
        padding: 2.6% 2.3%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        border-radius: 4px;
        color: rgba(0, 0, 0, 0.65);
        margin-top: 4.67%;

        .closecircle {
            margin-top: 0.04rem;
            margin-right: 0.08rem;
            color: #F56A00;
        }

        p {
            margin: 0;
        }
    }

    p {
        margin-bottom: 0;
    }

    .kyc-title {
        background: #fff;

        h3 {
            font-weight: 500;
            font-size: 18px;
            margin-bottom: 0;
            padding: 0.08rem 0 0.08rem;
        }
    }

    .title-two {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        padding-bottom: 0.14rem;
    }

    .title-two-no {
        font-size: 14px;
        color: #9d9d9d;
        padding-bottom: 0;
        margin-bottom: 0;
        line-height: 0.2rem;
    }

    .kcy-form {
        background: #fff;

        .kyc-item-input {
            width: 100%;
        }

        .ant-form-item {
            padding-bottom: 0;
            margin-bottom: 0.2rem;

            /deep/ .kyc-item-input {
                height: 0.4rem;
                font-size: 16px;
                color: rgba(0, 0, 0, 0.65);

                /deep/ .ant-select-selection {
                    height: 0.4rem;
                    line-height: 0.4rem;

                    /deep/ .ant-select-selection__rendered {
                        height: 0.4rem;
                        line-height: 0.4rem;
                    }
                }
            }

            label {

                .kyc-sublabel {
                    font-size: 12px;
                    line-height: 0.12rem;
                    color: #999999;
                    margin-top: 0.08rem;
                    display: block;
                }
            }
        }

        /deep/ .ant-input {
            width: 100%;
            height: 0.4rem;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.65);
        }

        .ant-form-item-control-wrapper {
            position: relative;

            .ant-form-explain {
                position: absolute;
                left: 0;
                top: 100%;
            }
        }

        .passport {
            width: 100%;
            height: 2.16rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.16rem;
        }

        .right-img {
            display: flex;
            justify-content: flex-start;
            align-content: space-between;
            width: 0.72rem;

            div.img {
                position: relative;

                img {
                    display: block;
                    width: 0.72rem;
                    height: 1rem;
                    margin-right: 0.16rem;
                }

                div {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0.72rem;
                    height: 1rem;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.4);
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    span {
                        color: #dfdfdf;
                        font-size: 0.14rem;
                    }
                }
            }
        }

        /deep/ .ant-upload.ant-upload-select-picture-card {
            width: 1.62rem;
            height: 2.16rem;
            margin: 0;
        }

        /deep/ .ant-upload-list-item {
            width: 1.62rem;
            height: 2.16rem;
            margin: 0;
        }

        /deep/ .gray-text {
            color: #9f9f9f;
        }

        .submit-box {
            width: 100%;

            .submit-button {
                width: 100%;
                height: 0.32rem;
                display: block;
                background: #2ea9df;
                color: #fff;
                border: 0;
                margin: 0;
                padding: 0;
                cursor: pointer;
            }
        }

        /deep/ .ant-form-item-required:before {
            display: none;
        }
    }
</style>

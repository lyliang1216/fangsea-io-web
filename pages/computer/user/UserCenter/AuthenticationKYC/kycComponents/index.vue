<template>
    <section class="container">
        <a-locale-provider :locale="localeLange">
            <a-layout-content>
                <div class="kyc-content">
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
                    <div class="kycfaild" v-if="auditState === 1">
                        <a-icon class="closecircle" type="close-circle"/>
                        <p>{{auditRemark}}</p>
                    </div>
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
                    <div class="namebox" v-if="auditState !== 3">
                        <a-form-item :label="$t('AuthenticationKYC.kyc_title_lastname')" :colon="false" :has-feedback="lastnameFeedback">
                            <a-input
                                    class="last-name kyc-item-input" @focus="setFields('lastname')"
                                    v-decorator="[
                                        'lastname',
                                        {validateTrigger: 'blur', rules: [{validator: checkLastname}],
                                        initialValue: lastnamevalue}]"
                                    :placeholder="$t('AuthenticationKYC.kyc_placeholder_lastname')"/>
                        </a-form-item>
                        <a-form-item :label="$t('AuthenticationKYC.kyc_title_firstname')" :colon="false" :has-feedback="firstnameFeedback">
                            <a-input
                                    class="first-name kyc-item-input" @focus="setFields('firstname')"
                                    v-decorator="[
                                        'firstname',
                                        {validateTrigger: 'blur', rules: [{validator: checkFirstname}],
                                        initialValue: firstnamevalue}]"
                                    :placeholder="$t('AuthenticationKYC.kyc_placeholder_firstname')"/>
                        </a-form-item>
                    </div>
                    <!-- 出生日期 -->
                    <a-form-item :label="$t('AuthenticationKYC.kyc_title_borthday')" :colon="false" v-if="auditState !== 3" :has-feedback="defaultbirthFeedback">
                        <a-date-picker
                                class="kyc-item-input"
                                :disabledDate="disabledDate"
                                width="100%"
                                @focus="setFields('defaultbirth')"
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
                    <a-form-item :label="$t('AuthenticationKYC.kyc_title_identification')" :colon="false" :has-feedback="passportIDFeedback">
                        <a-input
                                class="kyc-item-input" @focus="setFields('passportID')"
                                v-decorator="[
                                    'passportID',
                                    {validateTrigger: 'blur', rules: [{validator: checkPassportID}],
                                    initialValue: passportIDvalue}]"
                                :placeholder="$t('AuthenticationKYC.kyc_err_identification')"/>
                    </a-form-item>
                    <!-- 护照有效期 -->
                    <a-form-item :colon="false" :has-feedback="passportValidityDateFeedback">
                        <label slot="label">
                            {{$t('AuthenticationKYC.kyc_title_passport_validity')}}
                            <span class="kyc-sublabel">({{$t('AuthenticationKYC.kyc_tip_passport_validity')}})</span>
                        </label>
                        <a-date-picker
                                class="kyc-item-input"
                                width="100%"
                                @focus="setFields('passportValidityDate')"
                                :placeholder="$t('AuthenticationKYC.kyc_placeholder_passport_validity')"
                                v-decorator="[
                                    'passportValidityDate',
                                    {rules: [{
                                        type: 'object', validator: checkPassportValidityDate}],
                                        initialValue: passportValidityDate
                                    }]"
                                :format="dateFormat"/>
                    </a-form-item>
                    <p class="itme-title">{{$t('AuthenticationKYC.kyc_title_photo')}}</p>
                    <p class="title-two-no">{{$t('AuthenticationKYC.kyc_content_phototip')}}</p>
                    <!-- 图片上传 -->
                    <a-form-item>
                        <div class="passport">
                            <!-- 护照封面 -->
                            <div class="cover-img">
                                <!-- pc端上传 -->
                                <a-tooltip
                                        v-if="showqrLeft && kycform.passportCover === ''"
                                        :defaultVisible="true"
                                        placement="left"
                                        v-model="showqrLeftTooltip"
                                        @visibleChange="visibleChange"
                                        :destroyTooltipOnHide="true"
                                        overlayClassName="qrcodeTips">
                                    <template slot="title">
                                        <span>{{$t('AuthenticationKYC.kyc_updateimg_tips')}}</span>
                                    </template>
                                    <div class="position"></div>
                                </a-tooltip>
                                <img class="rt-icon" v-if="showqrLeft && kycform.passportCover === '' && !loadQr" src="/content/kyc-qr.png" @click="showqrCover" alt="">
                                <img class="rt-icon" v-if="showqrLeft && kycform.passportCover === '' && loadQr" src="/content/kyc-qr-in.png" alt="">
                                <div class="spin-img" v-if="showqrLeft && kycform.passportCover === '' && loadQr">
                                    <a-spin size="small" />
                                </div>
                                <!-- 移动端上传 -->
                                <div class="qrcode-box" v-if="!showqrLeft">
                                    <img class="rt-icon" src="/content/kyc-pc.png" @click="showImgCover" alt="">
                                    <div class="qrcode-img">
                                        <qrcode :value="mobileUrl" :size="140"></qrcode>
                                    </div>
                                    <div class="invalid-box" v-if="qrcodeInvalid">
                                        <p>{{$t('AuthenticationKYC.kyc_qrcode_invalid')}}</p>
                                        <a-button type="primary" class="refresh-btn" @click="getbusinessId">
                                            {{$t('AuthenticationKYC.kyc_qrcode_refresh')}}
                                        </a-button>
                                    </div>
                                </div>
                                <imgUpload
                                        :txt="$t('AuthenticationKYC.kyc_content_photo1')"
                                        :action="action"
                                        :num="1"
                                        :defaultfilelist="coverfilelist"
                                        :imageType="1"
                                        :maxsize="5"
                                        :ispic="true"
                                        @removepic="removeCover"
                                        @changepic="successSaveCover">
                                </imgUpload>
                            </div>
                            <!-- 护照内页 -->
                            <div class="info-img">
                                <!-- pc端上传 -->
                                <a-tooltip
                                        :defaultVisible="true"
                                        placement="left"
                                        v-model="showqrRightTooltip"
                                        @visibleChange="visibleChange"
                                        :destroyTooltipOnHide="true"
                                        overlayClassName="qrcodeTips">
                                    <template slot="title">
                                        <span>{{$t('AuthenticationKYC.kyc_updateimg_tips')}}</span>
                                    </template>
                                    <div class="position"></div>
                                </a-tooltip>
                                <img class="rt-icon" v-if="showqrRight && kycform.passportInfo === '' && !loadQr" src="/content/kyc-qr.png" @click="showqrInfo" alt="">
                                <img class="rt-icon" v-if="showqrRight && kycform.passportInfo === '' && loadQr" src="/content/kyc-qr-in.png" alt="">
                                <div class="spin-img" v-if="showqrRight && kycform.passportInfo === '' && loadQr">
                                    <a-spin size="small" />
                                </div>
                                <!-- 移动端上传 -->
                                <div class="qrcode-box" v-if="!showqrRight">
                                    <img class="rt-icon" src="/content/kyc-pc.png" @click="showImgInfo" alt="">
                                    <div class="qrcode-img">
                                        <qrcode :value="mobileUrl" :size="140"></qrcode>
                                    </div>
                                    <div class="invalid-box" v-if="qrcodeInvalid">
                                        <p>{{$t('AuthenticationKYC.kyc_qrcode_invalid')}}</p>
                                        <a-button type="primary" class="refresh-btn" @click="getbusinessId">
                                            {{$t('AuthenticationKYC.kyc_qrcode_refresh')}}
                                        </a-button>
                                    </div>
                                </div>
                                <imgUpload
                                        :txt="$t('AuthenticationKYC.kyc_content_photo2')"
                                        :action="action"
                                        :num="1"
                                        :defaultfilelist="infofilelist"
                                        :imageType="1"
                                        :maxsize="5"
                                        :ispic="true"
                                        @removepic="removeInfo"
                                        @changepic="successSaveInfo">
                                </imgUpload>
                            </div>
                            <div class="right-img">
                                <div class="img" @click="handlePreviewimg('cover')">
                                    <div><span>{{$t('AuthenticationKYC.kyc_photo_btn_view')}}</span></div>
                                    <img src="/content/passport_photo1.jpg">
                                </div>
                                <div class="img" @click="handlePreviewimg('info')">
                                    <div><span>{{$t('AuthenticationKYC.kyc_photo_btn_view')}}</span></div>
                                    <img src="/content/passport_photo2.jpg">
                                </div>
                            </div>
                            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                                <img alt="example" style="width: 100%" :src="previewImage"/>
                            </a-modal>
                        </div>
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
    import {parseTime, getWsUri, removeSlash} from '~/assets/utils/index'
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW'
    import enUS from 'ant-design-vue/lib/locale-provider/en_US'
    import ImgUpload from '~/components/computer/ImgUpload'
    import qrcode from '~/components/computer/QrCode'
    import validate from '~/assets/utils/validate'
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
                dateFormat: 'YYYY-MM-DD',
                // 表单布局模式
                formlayout: 'vertical',
                // 上传内容
                kycform: {
                    birthday: '1970-01-01',
                    passportCover: '',
                    passportInfo: '',
                    countryid: ''
                },
                // 是否显示预览框
                previewVisible: false,
                // 预览图片路径
                previewImage: '',
                // 护照封面
                filecover: [],
                // 护照信息
                filepersonal: [],
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
                // 封面页显示二维码右上角图片
                showqrLeft: true,
                // 内页显示二维码右上角图片
                showqrRight: true,
                // 封面页显示提示
                showqrLeftTooltip: true,
                // 内页显示提示
                showqrRightTooltip: true,
                // 二维码地址
                mobileUrl: '',
                // websocket
                websock: '',
                // 二维码是否失效
                qrcodeInvalid: false,
                // 通道建立id
                businessId: '',
                // 是否显示封面二维码
                leftClose: false,
                // 是否显示信息二维码
                rightClose: false,
                // 正常上传path
                coverPath: '',
                // 正常上传path
                infoPath: '',
                // 二维码加载中
                loadQr: false,
                // 生成二维码计时器
                qrTimer: null,
                // 倒计时
                timer: 0,
                // 姓名校验图标
                lastnameFeedback: false,
                // 姓名校验图标
                firstnameFeedback: false,
                // 护照号校验图标
                passportIDFeedback: false,
                // 护照有效期校验图标
                passportValidityDateFeedback: false,
                // 出生日期校验图标
                defaultbirthFeedback: false
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
                        this.showqrLeftTooltip = false
                        this.showqrRightTooltip = false
                        this.coverPath = data.passportCoverUrl
                        this.infoPath = data.passportInfoUrl
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
                this.coverPath = data.filePath
                this.showqrLeftTooltip = false
                if (this.websock !== '') {
                    this.setQrCode()
                    this.websocketsend({
                        name: 'cover',
                        id: data.imageId,
                        path: removeSlash(data.filePath)
                    })
                }
            },
            /**
             *  图片删除，封面
             */
            removeCover () {
                this.kycform.passportCover = ''
                this.coverPath = ''
                if (this.websock !== '') {
                    this.setQrCode()
                    this.websocketsend('delcover')
                }
                this.setTooltipShow()
            },
            /**
             *  图片上传成功，内页
             *  @param data 上传图片id
             */
            successSaveInfo (data) {
                this.kycform.passportInfo = data.imageId
                this.infoPath = data.filePath
                this.showqrRightTooltip = false
                if (this.websock !== '') {
                    this.setQrCode()
                    this.websocketsend({
                        name: 'info',
                        id: data.imageId,
                        path: removeSlash(data.filePath)
                    })
                }
            },
            /**
             *  图片删除，内页
             */
            removeInfo () {
                this.kycform.passportInfo = ''
                this.infoPath = ''
                if (this.websock !== '') {
                    this.setQrCode()
                    this.websocketsend('delinfo')
                }
                this.setTooltipShow()
            },
            /**
             *  显示封面页二维码
             */
            showqrCover () {
                if (this.websock === '') {
                    this.leftClose = true
                    this.getbusinessId()
                } else {
                    this.showqrLeft = false
                    this.showqrLeftTooltip = false
                }
            },
            /**
             *  显示封面页图片上传
             */
            showImgCover () {
                this.showqrLeft = true
                this.showqrLeftTooltip = true
            },
            /**
             *  显示信息页二维码
             */
            showqrInfo () {
                if (this.websock === '') {
                    this.rightClose = true
                    this.getbusinessId()
                } else {
                    this.showqrRight = false
                    this.showqrRightTooltip = false
                }
            },
            /**
             *  显示信息页图片上传
             */
            showImgInfo () {
                this.showqrRight = true
                this.showqrRightTooltip = true
            },
            /**
             * tooltips隐藏回调
             */
            visibleChange () {
                this.showqrLeftTooltip = true
                this.showqrRightTooltip = true
            },
            /**
             * 设置tooltip显示
             */
            setTooltipShow () {
                this.showqrLeftTooltip = false
                this.showqrRightTooltip = false
                this.$nextTick(() => {
                    setTimeout(() => {
                        if (this.showqrLeft && this.kycform.passportCover === '') {
                            this.showqrLeftTooltip = true
                        } else {
                            this.showqrLeftTooltip = false
                        }
                        if (this.showqrRight && this.kycform.passportInfo === '') {
                            this.showqrRightTooltip = true
                        } else {
                            this.showqrRightTooltip = false
                        }
                    }, 500)
                })
            },
            /**
             * 获取businessId（建立通道时使用）
             */
            getbusinessId () {
                this.loadQr = true
                axios.post('/user/kyc/QR/code/get', {
                    traceId: tool.UUID()
                })
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            if (res.data.data) {
                                this.businessId = res.data.data
                                this.qrcodeInvalid = false
                                this.initWebSocket()
                            } else {
                                this.loadQr = false
                                this.$message.error(this.$t('AuthenticationKYC.kyc_getqrcode_fail'))
                            }
                        } else {
                            this.loadQr = false
                            this.$message.error(this.$t('AuthenticationKYC.kyc_getqrcode_fail'))
                        }
                    }).catch(err => {
                        this.loadQr = false
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 生成二维码
             */
            setQrCode () {
                let coverID = this.kycform.passportCover
                let coverPath = removeSlash(this.coverPath)
                let infoID = this.kycform.passportInfo
                let infoPath = removeSlash(this.infoPath)
                this.mobileUrl = `http://${window.location.host}/mobile/AuthenticationKYC?lang=
                ${Cookie.get('language')}&businessId=${this.businessId}&coverid=${coverID}&coverpath=
                ${coverPath}&infoid=${infoID}&infopath=${infoPath}`
            },
            /**
             *  初始化weosocket
             */
            initWebSocket () {
                const wsuri = getWsUri()
                this.websock = new WebSocket(wsuri)
                this.websock.onmessage = this.websocketonmessage
                this.websock.onopen = this.websocketonopen
                this.websock.onerror = this.websocketonerror
                this.websock.onclose = this.websocketclose
            },
            /**
             * 连接建立之后执行send方法发送数据
             */
            websocketonopen () {
                this.loadQr = false
                if (this.timer !== 0) {
                    clearInterval(this.qrTimer)
                    this.timer = 0
                }
                if (this.leftClose) {
                    this.showqrLeft = false
                    this.showqrLeftTooltip = false
                }
                if (this.rightClose) {
                    this.showqrRight = false
                    this.showqrRightTooltip = false
                }
                this.websocketsend('', 8106)
                this.setQrCode()
            },
            /**
             * 连接建立失败重连
             */
            websocketonerror () {
                if (this.websock !== '') {
                    if (this.timer === 0) {
                        clearInterval(this.qrTimer)
                        this.qrTimer = null
                        this.setTimer()
                    }
                    if (this.timer > 30) {
                        this.loadQr = false
                        clearInterval(this.qrTimer)
                        this.qrTimer = null
                        this.websock.close()
                        this.websock = ''
                        this.timer = 0
                        this.$message.error(this.$t('AuthenticationKYC.kyc_getqrcode_fail'))
                    } else if (this.qrTimer !== null) {
                        this.initWebSocket()
                    }
                } else {
                    clearInterval(this.qrTimer)
                    this.qrTimer = null
                }
            },
            /**
             * 设置定时器
             */
            setTimer () {
                this.qrTimer = setInterval(() => {
                    this.timer++
                }, 1000)
            },
            /**
             * 数据接收
             */
            websocketonmessage (e) {
                let data = e.data
                if (data === 'delcover') {
                    this.kycform.passportCover = ''
                    this.coverPath = ''
                    this.coverfilelist = []
                    this.showqrLeft = true
                } else if (data === 'delinfo') {
                    this.kycform.passportInfo = ''
                    this.infoPath = ''
                    this.infofilelist = []
                    this.showqrRight = true
                } else if (JSON.parse(data).name === 'cover') {
                    this.kycform.passportCover = JSON.parse(data).id
                    this.coverfilelist = []
                    this.$nextTick(() => {
                        this.coverfilelist = [{
                            uid: this.kycform.passportCover,
                            name: 'passportCover.jpg',
                            url: '/' + JSON.parse(data).path
                        }]
                    })
                    this.coverPath = '/' + JSON.parse(data).path
                    this.showqrLeft = true // 因为显示二维码是!showqrLeft，所以为true，由id为空控制显示二维码按钮
                } else if (JSON.parse(data).name === 'info') {
                    this.kycform.passportInfo = JSON.parse(data).id
                    this.infofilelist = []
                    this.$nextTick(() => {
                        this.infofilelist = [{
                            uid: this.kycform.passportInfo,
                            name: 'passportInfo.jpg',
                            url: '/' + JSON.parse(data).path
                        }]
                    })
                    this.infoPath = '/' + JSON.parse(data).path
                    this.showqrRight = true // 因为显示二维码是!showqrLeft，所以为true，由id为空控制显示二维码按钮
                } else if (JSON.parse(data).action && JSON.parse(data).action.toString() === '8109') {
                    this.websock.close()
                }
                this.setQrCode()
                this.setTooltipShow()
            },
            /**
             * 数据发送
             * @param msg 发送的数据
             * @param action 操作码
             */
            websocketsend (msg, action) {
                let data = {
                    businessId: this.businessId,
                    data: msg,
                    action: 8102
                }
                if (action === 8106) {
                    data.action = action
                }
                this.websock.send(JSON.stringify(data))
            },
            /**
             * 关闭
             */
            websocketclose () {
                this.websock = ''
                if (!this.showqrLeft) {
                    this.qrcodeInvalid = true
                }
                if (!this.showqrRight) {
                    this.qrcodeInvalid = true
                }
                this.leftClose = false
                this.rightClose = false
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
                                    if (this.websock !== '') {
                                        this.websock.close()
                                    }
                                    // 更新kyc认证状态
                                    Bus.$emit('setKycState')
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
                    if (this.websock !== '') {
                        this.setQrCode()
                    }
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
                case 'passportValidityDate' : this.passportValidityDateFeedback = false; break
                case 'defaultbirth' : this.defaultbirthFeedback = false; break
                }
                let fieldsValue = this.form.getFieldsValue([field])
                this.form.resetFields([field])
                this.form.setFieldsValue(fieldsValue)
            }
        },
        beforeDestroy () {
            if (this.websock !== '') {
                this.websock.close()
            }
            if (this.timer !== 0) {
                clearInterval(this.qrTimer)
                this.qrTimer = null
            }
        },
        components: {
            ImgUpload,
            qrcode
        }
    }
</script>

<style lang="less">
    .qrcodeTips {
        z-index: 9;
        .ant-tooltip-arrow {
            border-left-color: #fff
        }
        .ant-tooltip-inner {
            font-size: 12px;
            color: #333;
            line-height: 22px;
            padding-top: 3px;
            padding-bottom: 3px;
            min-height: 28px;
            background: #fff;
        }
    }
</style>
<style lang="less" scoped>
    .container {
        margin-bottom: 26px;
    }
    .kyc-title {
        background: #fff;
        padding-left: 32px;
        margin-bottom: 24px;

        h3 {
            font-size: 20px;
            color: rgba(0, 0, 0, 0.85);
            line-height: 28px;
            font-weight: 500;
            margin-bottom: 0;
            padding: 16px 0;
        }

        padding-bottom: 16px;
    }

    .title-two {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
        margin-bottom: 0;
    }

    .title-two-no {
        font-size: 14px;
        color: #999;
        padding-bottom: 0;
        margin-bottom: 9px;
    }

    .checkcountry {
        width: 552px;
        height: 40px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.65);
        background-color: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 0 11px;
        box-sizing: border-box;
    }

    .kycfaild {
        width: 552px;
        border: 1px solid #FF9483;
        box-sizing: border-box;
        background: #FFE5E2;
        font-size: 14px;
        line-height: 22px;
        padding: 9px 8px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        border-radius: 4px;
        color: rgba(0, 0, 0, 0.65);
        margin-bottom: 16px;

        .closecircle {
            margin-top: 4px;
            margin-right: 8px;
            color: #F56A00;
        }

        p {
            margin: 0;
        }
    }

    .kcy-form {
        background: #fff;
        padding-left: 32px;
        padding-top: 16px;
        padding-bottom: 1px;
        min-height: 700px;

        .ant-form-item-label {
            margin-bottom: 8px;

            label {
                font-size: 14px;
                color: rgba(0, 0, 0, 0.85);
                line-height: 22px;

                .kyc-sublabel {
                    font-size: 12px;
                    line-height: 20px;
                    color: #999999;
                    margin-left: 8px;
                }
            }
        }

        /deep/ .ant-form-item {
            margin-bottom: 24px;
            padding-bottom: 0;

            /deep/ .kyc-item-input {
                width: 552px;
                height: 40px;
                font-size: 16px;
                color: rgba(0, 0, 0, 0.65);

                /deep/ .ant-select-selection {
                    height: 40px;
                    line-height: 40px;

                    /deep/ .ant-select-selection__rendered {
                        height: 40px;
                        line-height: 40px;
                    }
                }
            }

            /deep/ .ant-input {
                width: 552px;
                height: 40px;
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

        }

        .itme-title {
            margin-bottom: 8px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
            line-height: 22px;
        }

        .namebox {
            display: flex;
            justify-content: flex-start;

            & > div {
                margin-right: 32px;
            }

            .first-name {
                width: 260px;
            }

            .last-name {
                width: 260px;
            }
        }

        .passport {
            width: 552px;
            height: 216px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .cover-img, .info-img {
                position: relative;
                .position {
                    position: absolute;
                    right: 33px;
                    top: 28px;
                }
                .rt-icon {
                    position: absolute;
                    right: 3px;
                    top: 3px;
                    display: block;
                    width: 42px;
                    height: 40px;
                    z-index: 20;
                    cursor: pointer;
                }
                .qrcode-box {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 162px;
                    height: 216px;
                    .rt-icon {
                        position: absolute;
                        right: 3px;
                        top: 3px;
                        display: block;
                        width: 42px;
                        height: 40px;
                        z-index: 20;
                        cursor: pointer;
                    }
                    .qrcode-img {
                        position: absolute;
                        left: 1px;
                        top: 1px;
                        width: 160px;
                        height: 214px;
                        background: #fafafa;
                        z-index: 10;
                        div {
                            width: 140px;
                            height: 140px;
                            margin: 37px 10px;
                        }
                    }
                    .invalid-box {
                        position: absolute;
                        left: 1px;
                        top: 1px;
                        width: 160px;
                        height: 214px;
                        background: rgba(255, 255, 255, 0.95);
                        z-index: 12;
                        p {
                            font-size: 14px;
                            color: #333;
                            line-height: 20px;
                            text-align: center;
                            margin-bottom: 8px;
                            margin-top: 86px;
                        }
                        .refresh-btn {
                            display: block;
                            width: 98px;
                            height: 30px;
                            font-size: 14px;
                            margin: 0 auto;
                        }
                    }
                }
                .spin-img {
                    position: absolute;
                    right: 10px;
                    top: 6px;
                }
            }
            .cover-img {
                margin-right: 24px;
            }
            .right-img {
                display: flex;
                justify-content: flex-start;
                align-content: space-between;
                flex-wrap: wrap;
                margin-left: 32px;
                width: 72px;
                height: 216px;

                div.img {
                    position: relative;

                    div {
                        position: absolute;
                        width: 72px;
                        height: 100px;
                        left: 0;
                        top: 0;
                        background: rgba(0, 0, 0, 0.4);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;

                        span {
                            font-size: 12px;
                            color: #fff;
                            text-align: center;
                        }
                    }

                    img {
                        display: block;
                        width: 72px;
                        height: 100px;
                    }
                }
            }
        }

        /deep/ .ant-upload.ant-upload-select-picture-card {
            width: 162px;
            height: 216px;
            margin: 0;
        }

        /deep/ .ant-upload-list-item {
            width: 162px;
            height: 216px;
            margin: 0;
        }

        .gray-text {
            color: #9f9f9f !important;
        }

        .submit-box {
            width: 552px;
            display: flex;
            justify-content: flex-start;
            padding-bottom: 32px;

            .submit-button {
                width: 168px;
                height: 32px;
                display: block;
                background: #2ea9df;
                color: #fff;
                border: 0;
                margin: 0;
                padding: 0;
                cursor: pointer;
                font-size: 14px;
            }
        }

        /deep/ .ant-form-item-required:before {
            display: none;
        }
    }

    /deep/ .ant-form-item-with-help {
        margin-bottom: 21px !important;
    }
</style>

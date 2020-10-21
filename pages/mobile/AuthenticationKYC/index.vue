<template>
    <a-spin :spinning="spinning">
        <a-layout id="components-layout-mobile-top"
                  class="layout"
                  :class="drawer">
            <fs-head
                    :SelectedKey="key"
                    :SelectedType="type"
                    :centerKey="centerKey"/>
            <section id="mobile-uploadkyc" v-if="haswebsock">
                <a-layout-content>
                    <!-- 图片上传 -->
                    <div class="img-upload-box">
                        <h3>{{$t('AuthenticationKYC.kyc_uploadimg_title')}}</h3>
                        <p class="title-tips">{{$t('AuthenticationKYC.kyc_content_phototip')}}</p>
                        <div class="passport">
                            <!-- 护照封面 -->
                            <imgUpload
                                    :txt="$t('AuthenticationKYC.kyc_uploadimg_tips_cover')"
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
                                    :txt="$t('AuthenticationKYC.kyc_uploadimg_tips_info')"
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
                                <img src="/content/passport_photo1.jpg">
                                <div @click="handlePreviewimg('cover')">
                                    <span>{{$t('AuthenticationKYC.kyc_photo_btn_view')}}</span></div>
                            </div>
                            <div class="img">
                                <img src="/content/passport_photo2.jpg">
                                <div @click="handlePreviewimg('info')">
                                    <span>{{$t('AuthenticationKYC.kyc_photo_btn_view')}}</span></div>
                            </div>
                        </div>
                        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                            <img alt="example" style="width: 100%" :src="previewImage"/>
                        </a-modal>
                        <p class="success-tips" v-if="kycform.passportCover !== '' && kycform.passportInfo !== ''">{{$t('AuthenticationKYC.kyc_uploadimg_success')}}</p>
                    </div>
                </a-layout-content>
            </section>
            <section id="mobile-updatekyc-fail" v-if="!haswebsock">
                <a-layout-content>
                    <div class="fail-icon">
                        <a-icon type="exclamation-circle" theme="filled"/>
                    </div>
                    <p>{{$t('AuthenticationKYC.kyc_urlinvalid_tips')}}</p>
                </a-layout-content>
            </section>
        </a-layout>
    </a-spin>
</template>

<script>
    import {getWsUri, removeSlash} from '~/assets/utils/index'
    import ImgUpload from '~/components/computer/ImgUpload'
    import FsHead from '~/components/mobile/FangseaHeader'
    import {removeSpaces} from '~/assets/utils/rules'
    import Cookie from 'js-cookie'

    export default {
        data () {
            return {
                // 首页高亮下标
                key: '0',
                // 登录、注册导航下标
                type: 0,
                // 用户中心导航下标
                centerKey: 6,
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 表单格式
                formlayout: 'vertical',
                // 显示预览
                previewVisible: false,
                // 预览图片路径
                previewImage: '',
                // 默认封面
                coverfilelist: [],
                // 默认内页
                infofilelist: [],
                // 上传内容
                kycform: {
                    passportCover: '',
                    passportInfo: ''
                },
                // 图片上传地址
                action: '/file/upload',
                // websocket
                websock: '',
                // 等待效果
                spinning: false,
                // 通道建立id
                businessId: '',
                // 链接是否有效
                haswebsock: true
            }
        },
        mounted () {
            if (this.$route.query.businessId) {
                this.businessId = this.$route.query.businessId
                this.initWebSocket()
                // 设置国际化
                switch (removeSpaces(this.$route.query.lang)) {
                case 'zh_TW' :
                    Cookie.set('language', 'zh_TW')
                    this.$i18n.locale = 'zh_TW'
                    this.$store.dispatch('updateLang', 'zh_TW')
                    break
                case 'zh_CN' :
                    Cookie.set('language', 'zh_CN')
                    this.$i18n.locale = 'zh_CN'
                    this.$store.dispatch('updateLang', 'zh_CN')
                    break
                case 'en_US' :
                    Cookie.set('language', 'en_US')
                    this.$i18n.locale = 'en_US'
                    this.$store.dispatch('updateLang', 'en_US')
                    break
                }
                this.setImg()
            } else {
                this.haswebsock = true
            }
        },
        methods: {
            /**
             * 设置默认图片
             */
            setImg () {
                if (this.$route.query.coverid !== '') {
                    this.kycform.passportCover = this.$route.query.coverid
                    this.coverfilelist = [{
                        uid: this.kycform.passportCover,
                        name: 'passportCover.jpg',
                        url: '/' + removeSpaces(this.$route.query.coverpath)
                    }]
                }
                if (this.$route.query.infoid !== '') {
                    this.kycform.passportInfo = this.$route.query.infoid
                    this.infofilelist = [{
                        uid: this.kycform.passportInfo,
                        name: 'passportInfo.jpg',
                        url: '/' + removeSpaces(this.$route.query.infopath)
                    }]
                }
            },
            /**
             *  初始化weosocket
             */
            initWebSocket () {
                this.spinning = true
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
                this.spinning = false
                this.websocketsend('', 8107)
            },
            /**
             * 连接建立失败重连
             */
            websocketonerror () {
                this.spinning = false
                this.haswebsock = false
                this.websock = ''
            },
            /**
             * 数据接收
             */
            websocketonmessage (e) {
                let data = e.data
                if (data === 'delcover') {
                    this.kycform.passportCover = ''
                    this.coverfilelist = []
                } else if (data === 'delinfo') {
                    this.kycform.passportInfo = ''
                    this.infofilelist = []
                } else if (JSON.parse(data).name === 'cover') {
                    this.kycform.passportCover = JSON.parse(data).id
                    this.coverfilelist = []
                    this.$nextTick(() => {
                        this.coverfilelist = [{
                            uid: this.kycform.passportInfo,
                            name: 'passportCover.jpg',
                            url: '/' + JSON.parse(data).path
                        }]
                    })
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
                }
                if (JSON.parse(data).action.toString() === '8109' || JSON.parse(data).action.toString() === '8001') {
                    this.haswebsock = false
                    this.websock.close()
                }
            },
            /**
             * 数据发送
             */
            websocketsend (msg, action) {
                let data = {
                    businessId: this.businessId,
                    data: msg,
                    action: 8102
                }
                if (action === 8107) {
                    data.action = action
                }
                this.websock.send(JSON.stringify(data))
            },
            /**
             * 关闭
             */
            websocketclose () {
                this.haswebsock = false
                this.websock = ''
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
                this.websocketsend({
                    name: 'cover',
                    id: data.imageId,
                    path: removeSlash(data.filePath)
                })
                this.$router.push({
                    query: {
                        businessId: this.businessId,
                        coverid: data.imageId,
                        coverpath: removeSlash(data.filePath),
                        infoid: this.$route.query.infoid,
                        infopath: removeSpaces(this.$route.query.infopath)
                    }
                })
            },
            /**
             *  图片删除，封面
             */
            removeCover () {
                this.kycform.passportCover = ''
                this.websocketsend('delcover')
                this.$router.push({
                    query: {
                        'businessId': this.businessId,
                        'coverid': '',
                        'coverpath': '',
                        'infoid': this.$route.query.infoid,
                        'infopath': removeSpaces(this.$route.query.infopath)
                    }
                })
            },
            /**
             *  图片上传成功，内页
             *  @param data 上传图片id
             */
            successSaveInfo (data) {
                this.kycform.passportInfo = data.imageId
                this.websocketsend({
                    name: 'info',
                    id: data.imageId,
                    path: removeSlash(data.filePath)
                })
                this.$router.push({
                    query: {
                        'businessId': this.businessId,
                        'coverid': this.$route.query.coverid,
                        'coverpath': removeSpaces(this.$route.query.coverpath),
                        'infoid': data.imageId,
                        'infopath': removeSlash(data.filePath)
                    }
                })
            },
            /**
             *  图片删除，内页
             */
            removeInfo () {
                this.kycform.passportInfo = ''
                this.websocketsend('delinfo')
                this.$router.push({
                    query: {
                        'businessId': this.businessId,
                        'coverid': this.$route.query.coverid,
                        'coverpath': removeSpaces(this.$route.query.coverpath),
                        'infoid': '',
                        'infopath': ''
                    }
                })
            }
        },
        beforeDestroy () {
            this.websock.close()
        },
        components: {
            FsHead,
            ImgUpload
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../assets/css/mobile/main.less';

    /deep/ .header-content {
        button {
            display: none;
        }
    }

    #mobile-uploadkyc {
        background: #fff;
        padding: 0 0.16rem 0.2rem;
        .img-upload-box {
            h3 {
                font-size: 14px;
                color: #333;
                font-weight: normal;
                line-height: 0.22rem;
                padding: 0.15rem 0 0.06rem 0;
                margin: 0;
            }
            .title-tips {
                font-size: 12px;
                line-height: 0.17rem;
                color: #999;
                margin-bottom: 0.13rem;
            }
            /deep/ .clearfix {
                width: 100%;
                height: 1.5rem;
                margin-bottom: 0.15rem;
            }
            /deep/ .ant-upload.ant-upload-select-picture-card {
                width: 100%;
                height: 1.5rem;
            }

            /deep/ .ant-upload-list-item {
                width: 100%;
                height: 1.5rem;
                margin: 0;
                /deep/ .ant-upload-list-item-info {
                    overflow: hidden;
                }
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
            .success-tips {
                color: #F04134;
                font-size: 12px;
                line-height: 0.22rem;
                margin-top: 0.24rem;
            }
        }
    }

    #mobile-updatekyc-fail {
        background: #fff;
        padding: 0 0.16rem;
        .fail-icon {
            display: flex;
            justify-content: center;
            padding-top: 1.68rem;
            padding-bottom: 0.2rem;
            .anticon-exclamation-circle {
                font-size: 58px;
                color: #F04134;
            }
        }
        p {
            font-size: 16px;
            color: #333333;
            text-align: center;
        }
    }
</style>

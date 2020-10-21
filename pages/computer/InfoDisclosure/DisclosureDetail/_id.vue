<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key" :SelectedType="type"/>
        <section class="section">
            <div class="container">
                <a-layout-content>
                    <!--         面包屑导航           -->
                    <Breadcrumb :routes="routes"/>
                    <div class="content" v-if="hasContent">
                        <div class="content-titlebox">
                            <h2>{{title}}</h2>
                            <p>{{$t('infoDisclosure.infoDisclosure_detail_appointmentTime')}} {{appointmentTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
                        </div>
                        <div class="detail-box" v-html="content"></div>
                        <div class="title-info shadowDown-parent title-info-width" v-if="files.length !== 0">
                            <!--      文件组件      -->
                            <div class="files-contair">
                                <a-tooltip v-for="(item, index) in files" :key="index" :overlayStyle="{'max-width': '342px','word-break': 'break-all','display': 'inline-block'}">
                                    <template slot="title">
                                        <span>{{item.name}}</span>
                                    </template>
                                    <div class="file-item" v-show="downloadFiles.indexOf(index) < 0">
                                            <span class="file-name">{{item.name | namerole}}</span>
                                            <a href="javascript:;" @click="downFile(item.filePath, item.name, index)" class="download-file">
                                                <img src="/content/certificatePurchase/icon_download_normal.png"/>
                                            </a>
                                    </div>
                                    <div class="file-item-click" v-show="!(downloadFiles.indexOf(index) < 0)">
                                            <span class="file-name-click">{{item.name | namerole}}</span>
                                            <a href="javascript:;" @click="downFile(item.filePath, item.name, index)" class="download-file">
                                                <div class="down-icon" />
                                            </a>
                                    </div>
                                </a-tooltip>
                            </div>
                        </div>
                        <div class="title-info shadowDown-parent title-info-width" v-if="loginFiles.length !== 0">
                            <div class="shadowDown" v-show="!isLogin">
                                <div>
                                    <a href="javascript:;" @click="toLogin">
                                        <span>{{$t('CertificatePurchase.certificatePurchase_login')}}</span>
                                    </a>
                                    {{$t('CertificatePurchase.certificatePurchase_after_view_file')}}
                                </div>
                            </div>
                            <!--      文件组件      -->
                            <div class="files-contair">
                                <a-tooltip v-for="(item, index) in loginFiles" :key="index" :overlayStyle="{'max-width': '342px','word-break': 'break-all','display': 'inline-block'}">
                                    <template slot="title">
                                        <span>{{item.name}}</span>
                                    </template>
                                    <div class="file-item" v-show="downloadloginFiles.indexOf(index) < 0">
                                            <span class="file-name">{{item.name | namerole}}</span>
                                            <a href="javascript:;" @click="downFile(item.filePath, item.name, index, 'loged')" class="download-file">
                                                <img src="/content/certificatePurchase/icon_download_normal.png"/>
                                            </a>
                                    </div>
                                    <div class="file-item-click" v-show="!(downloadloginFiles.indexOf(index) < 0)">
                                        <span class="file-name-click">{{item.name | namerole}}</span>
                                        <a href="javascript:;" @click="downFile(item.filePath, item.name, index, 'loged')" class="download-file">
                                            <div class="down-icon" />
                                        </a>
                                    </div>
                                </a-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="content" v-if="!hasContent">
                        <div class="content-titlebox">
                            <h2>{{$t('infoDisclosure.infoDisclosure_detail_dataError')}}</h2>
                        </div>
                    </div>
                </a-layout-content>
            </div>
        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import Breadcrumb from '~/components/computer/Breadcrumb'
    import FsHead from '~/components/computer/FangseaHeader'
    import FilesDown from '~/components/computer/FilesDown'
    import fonter from '~/components/computer/Footer'
    import {parseTime} from '~/assets/utils/index'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import download from 'ly-downloader'
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'

    export default {
        /**
         * 服务端拉取信息披露详情数据
         * @param params
         * @param req
         */
        async asyncData ({params, req}) {
            if (process.server) {
                let title = ''
                let content = ''
                let appointmentTime = ''
                let files = []
                let loginFiles = []
                let hasContent = true
                // 服务端请求左侧菜单数据
                let disclosureContent = await axios.post(`${tool.getAddress(req)}/article/detail/${params.id}`, {traceId: tool.UUID()})
                // 处理左侧菜单服务端请求数据
                if (disclosureContent.data.code.toString() === '0') {
                    title = disclosureContent.data.data.title
                    content = disclosureContent.data.data.content
                    appointmentTime = disclosureContent.data.data.appointmentTime
                    files = JSON.parse(disclosureContent.data.data.attachment)
                    loginFiles = JSON.parse(disclosureContent.data.data.attachmentLogin)
                    hasContent = true
                } else {
                    hasContent = false
                }
                return {title, content, appointmentTime, files, loginFiles, hasContent}
            } else {
                return {title: '', content: '', appointmentTime: '', files: [], loginFiles: [], hasContent: true}
            }
        },
        data () {
            return {
                // 首页导航下标
                key: '8',
                // 登录、注册导航下标
                type: 0,
                // 面包屑
                routes: [],
                // 是否登录
                isLogin: false,
                // 消息标题
                title: '',
                // 消息正文
                content: '',
                // 消息缺失
                hasContent: true,
                // 消息发布时间
                appointmentTime: '',
                // 文件列表
                files: [],
                // 登录后可查看文件列表
                loginFiles: [],
                // 已下载文件下标集合
                downloadFiles: [],
                // 登录后已下载文件下标集合
                downloadloginFiles: []
            }
        },
        created () {
            if (process.client) {
                if (this.title === '') {
                    this.getDetail()
                }
                this.initBreadcrumb()
                this.listenI18n()
            }
        },
        // 初始化数据
        mounted () {
            // 设置登录状态
            Cookie.get('refresh_token') ? this.isLogin = true : this.isLogin = false
        },
        methods: {
            /**
             * 初始化面包屑国际化
             */
            initBreadcrumb () {
                this.routes = [{
                    path: '/computer',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_home')
                }, {
                    path: '/computer/InfoDisclosure',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_infoDisclosure')
                }, {
                    path: '/computer/InfoDisclosure/DisclosureDetail/' + this.$route.params.id,
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_infoDisclosure_detail')
                }]
            },
            /**
             * 获取详情数据
             */
            getDetail () {
                let id_ = this.$route.params.id
                let data = {
                    traceId: tool.UUID()
                }
                axios.post('/article/detail/' + id_, data).then((res) => {
                    if (res.data.code.toString() === '0') {
                        let res_ = res.data.data
                        this.title = res_.title
                        this.content = res_.content
                        this.appointmentTime = res_.appointmentTime
                        this.files = JSON.parse(res_.attachment)
                        this.loginFiles = JSON.parse(res_.attachmentLogin)
                        this.hasContent = true
                    } else {
                        this.hasContent = false
                    }
                })
            },
            /**
             * 单文件组件下载项目文件
             * @param src 文件地址
             * @param name 文件名
             */
            downFile (src, name, index_, str) {
                if (str && str === 'loged') {
                    this.downloadloginFiles.push(index_)
                } else {
                    this.downloadFiles.push(index_)
                }
                download(1, src, name)
            },
            /**
             * 跳转登录
             */
            toLogin () {
                let url = this.$route.path
                Cookie.set('redirectUrl', url)
                this.$router.push(`/computer/user/login`)
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.initBreadcrumb()
                    this.getDetail()
                })
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        components: {
            FsHead,
            fonter,
            Breadcrumb,
            FilesDown
        },
        filters: {
            // 时间格式化
            parseTime,
            namerole (val) {
                return val.substring(0, val.lastIndexOf('.'))
            }
        },
        head () {
            return {
                title: this.$t('PageTitle.passpurlist_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    .text-ellipsis(){
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        //word-wrap:break-word;
    }

    .section {
        background: #FFFFFF;

        .container {
            margin: 0 auto;
            width: 1200px;

            .content {
                width: 872px;
                margin: 0 auto;
                padding: 0 0 16px !important;
                .content-titlebox{
                    text-align: center;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #F1F1F1;
                    h2{
                        font-size: 24px;
                        line-height: 32px;
                        color: #333333;
                        font-weight: 500;
                        margin-bottom: 16px;
                    }
                    p{
                        margin-bottom: 0;
                    }
                }
                .detail-box{
                    width: 840px;
                    margin: 24px auto 36px;
                    /deep/ img{
                        max-width: 100% !important;
                    }
                    /deep/ table p{
                        margin-bottom: 0 !important;
                    }
                    /deep/ table p {
                        margin-bottom: 0 !important;
                    }
                }
                .title-info {
                    width: 840px;
                    margin: 0 16px;
                    font-size: 16px;
                    font-weight: 600;
                    color: rgba(51, 51, 51, 1);

                    .download-file {
                        width: 28px;
                        height: 28px;
                    }

                }
                .files-contair {
                    width: 840px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                }
                .file-item {
                    width: 380px;
                    height: 48px;
                    border-radius:24px;
                    border:1px solid rgba(235,235,235,1);
                    padding: 0 12px 0 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 8px 0;
                    .file-name{
                        display: block;
                        width: 340px;
                        .text-ellipsis();
                    }
                }

                .file-item-click {
                    font-size:14px;
                    width: 380px;
                    height: 48px;
                    border-radius:24px;
                    border:none;
                    padding: 0 12px 0 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background:rgba(249,249,249,1);
                    color:rgba(11,164,232,1);
                    margin: 8px 0;
                    .file-name{
                        display: block;
                        width: 340px;
                        .text-ellipsis();
                    }

                    .down-icon {
                        width: 28px;
                        height: 28px;
                        background: url("/certificatePurchase/icon_download_accomplish.png");
                    }

                    &:hover {
                        color:rgba(51,51,51,1);
                        background: #ffffff;
                        border:1px solid rgba(235,235,235,1);

                        .down-icon {
                            background: url("/certificatePurchase/icon_download_normal.png");
                        }
                    }
                }
                .shadowDown-parent {
                    position: relative;
                    .shadowDown {
                        left: 0;
                        top: 0;
                        position: absolute;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 1px;
                        z-index: 200;
                        height: 100%;
                        width: 100%;
                        font-size: 24px;
                        color: rgba(255, 255, 255, 1);

                        div {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            margin-left: -123px;
                            margin-top: -22px;

                            a {
                                text-decoration: underline;
                                color: rgba(255, 255, 255, 1);
                            }
                        }
                    }
                }
            }
        }
    }
</style>

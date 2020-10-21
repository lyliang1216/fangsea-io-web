<template>
    <section class="container">
        <a-layout-content>
            <div class="content-plan">
                <!--        推荐人链接        -->
                <a-row class="flex-row">
                    <a-col :span="4">{{$t('PositionPlan.positionPlan_recommended_link')}}</a-col>
                    <a-col :span="18">
                        <a-input class="link-input" v-model="registerPath" id="linkInput" :read-only="true">
                            <div class="small-code" slot="prefix" @mouseover="mouseover" @mouseout="mouseout"></div>
                        </a-input>
                    </a-col>
                    <a-col :span="2"><div class="copy-link" @click="copytips" :data-clipboard-text="registerPath"></div></a-col>
                </a-row>
                <!--       推荐人二维码         -->
                <a-row class="flex-row">
                    <a-col :span="16">
                        <div class="normal-code" :class="{'hoverStyle': isHover}">
                            <div class="qrcode-contair">
                                <qrcode :value="exclusiveLink" :size="99" v-show="!isHover"></qrcode>
                                <qrcode :value="outLink" :size="99" v-show="isHover"></qrcode>
                            </div>
                            <p class="code-desc" v-if="planDesc">
                                <span>{{$t('PositionPlan.positionPlan_sweep_code_acquisition')}}</span>
                                <span>{{$t('PositionPlan.positionPlan_exclusive_qr_code')}}</span>
                            </p>
                            <p class="code-desc" v-else>
                                <span>{{$t('PositionPlan.positionPlan_scan_code_registration')}}</span>
                            </p>
                            <span class="arrow-down" @click="downPlan">{{$t('PositionPlan.positionPlan_download_promotional_posters')}} <a-icon type="arrow-down" /></span>
                        </div>
                    </a-col>
                    <a-col :span="5">
                        <div class="plan-number">
                            <p class="number-desc">
                                <span class="span-number">{{UID}}</span>
                                <span class="span-desc">{{$t('PositionPlan.positionPlan_recommendation_code')}}</span>
                            </p>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </a-layout-content>
    </section>
</template>

<script>
    import qrcode from '~/components/computer/QrCode'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import download from 'ly-downloader'
    import axios from '~/plugins/axios'
    import Clipboard from 'clipboard'

    export default {
        data () {
            return {
                // 推广码
                UID: '',
                // 注册链接
                registerPath: '',
                // 海报界面链接
                exclusiveLink: '',
                // 过渡界面链接
                outLink: '',
                // 海报图片地址
                imgPath: '',
                // 显示专属推广二维码描述
                planDesc: true,
                // 显示注册二维码
                isHover: false
            }
        },
        created () {
            if (process.client) {
                this.listenI18n()
                this.getUserPlanLink()
            }
        },
        methods: {
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.getUserPlanLink()
                })
            },
            /**
             * 显示注册二维码
             */
            mouseover () {
                this.isHover = true
                this.planDesc = false
            },
            /**
             * 显示推广二维码
             */
            mouseout () {
                this.isHover = false
                this.planDesc = true
            },
            /**
             *  点击复制事件
             */
            copytips () {
                let clipboard = new Clipboard('.copy-link')
                clipboard.on('success', e => {
                    this.$message.success(this.$t('AddressManagement.addressbook_add_btn_copied'))
                    clipboard.destroy()
                })
                clipboard.on('error', e => {
                    this.$message.error(this.$t('AddressManagement.addressbook_add_err_copy'))
                    clipboard.destroy()
                })
            },
            /**
             * 用户UID
             */
            getUserPlanLink () {
                let data = {traceId: tool.UUID()}
                axios.post('/user/recommend/view', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            // 当前服务器地址
                            let server = `${window.location.protocol}//${window.location.host}`
                            this.UID = res.data.data.userCode
                            this.registerPath = `${server}/user/register?UID=${res.data.data.userCode}`
                            this.exclusiveLink = `${server}/mobile/PositionPlan?UID=${res.data.data.userCode}`
                            this.outLink = `${server}/mobile/PositionPlan/PointOut?UID=${res.data.data.userCode}`
                            this.imgPath = res.data.data.recommendPostersUrl
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 下载海报
             */
            downPlan () {
                download(1, '/' + this.imgPath, 'promotion-poster.jpg')
            }
        },
        components: {
            qrcode
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        head () {
            return {
                title: this.$t('PageTitle.position_plan')
            }
        }
    }
</script>

<style lang="less" scoped>
    @background: #ffffff;

    .content-plan {
        margin-bottom: 26px;
        padding: 104px 100px;
        min-height: 705px;
        background: @background;

        .flex-row {
            display: flex;
            align-items: center;

            &:first-child {
                font-size:15px;
                color:rgba(51,51,51,1);
            }

            .link-input {
                height:50px;
                border-radius:6px;

                /deep/ .ant-input {
                    padding-left: 45px;
                }
            }

            .small-code {
                height: 22px;
                width: 22px;
                background: url("/positionPlan/icon_erweima_nor.png");

                &:hover {
                    background: url("/positionPlan/icon_erweima_highlight.png");
                }
            }

            .copy-link {
                cursor: pointer;
                margin-left: 15px;
                height: 22px;
                width: 22px;
                background: url("/positionPlan/icon_copy_nor.png");

                &:hover {
                    background: url("/positionPlan/icon_copy_highlight.png");
                }
            }

            .normal-code {
                margin-top: 51px;
                padding-left: 30px;
                display: flex;
                align-items: center;
                height: 142px;
                width: 458px;
                color:#A3A3A3;
                background: url("/positionPlan/pic_card_nor.png");

                &:hover {
                    color:rgba(46,169,223,1);
                    background: url("/positionPlan/pic_card_highlight.png");
                }

                .qrcode-contair {
                    width: 99px;
                    height: 99px;
                }

                .code-desc {
                    min-width: 110px;
                    max-width: 110px;
                    margin-left: 30px;
                    margin-bottom: 0;

                    span {
                        display: block;
                        font-size:15px;
                        line-height:20px;
                    }
                }

                .arrow-down {
                    cursor: pointer;
                    margin-left: 55px;
                }
            }

            .plan-number {
                margin-top: 51px;
                padding-left: 30px;
                display: flex;
                align-items: center;
                height: 142px;
                width: 174px;
                border-radius:10px;
                border:1px solid rgba(235,235,235,1);

                &:hover {
                    background:rgba(113,219,255,0.1);
                    border:1px solid rgba(46,169,223,1);

                    span {
                        color:rgba(46,169,223,1) !important;
                    }
                }

                .number-desc {
                    min-width: 110px;
                    margin-bottom: 0;

                    .span-number {
                        display: block;
                        line-height:20px;
                        font-size:18px;
                        color:rgba(51,51,51,1);
                    }

                    .span-desc {
                        display: block;
                        line-height:20px;
                        font-size:14px;
                        font-weight:400;
                        color:rgba(136,136,136,1);
                    }
                }
            }

            .hoverStyle {
                color:rgba(46,169,223,1);
                background: url("/positionPlan/pic_card_highlight.png");
            }
        }
    }

</style>

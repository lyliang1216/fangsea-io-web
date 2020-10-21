<template>
    <a-layout id="components-layout-mobile-top"
              class="layout"
              :class="drawer">
        <fs-head
                :SelectedKey="key"
                :SelectedType="type"
                :centerKey="centerKey"
                @openDrawer="openDrawer"
                @closeDrawer="closeDrawer"/>
        <section id="mobile-positionplan">
            <a-layout-content>
                <div class="plan-bg">
                    <div class="plan-body">
                        <img :src="imgPath" class="shadow">
                        <div class="plan-img">
                            <p class="plan-img-id-desc">{{$t('PositionPlan.positionPlan_recommendation_code')}}</p>
                            <p class="plan-img-id">{{UID}}</p>
                            <p class="plan-img-code-desc">{{$t('PositionPlan.positionPlan_register_to_win')}}</p>
                            <div class="qrcode-contair">
                                <qrcode :value="outLink" :size="120"></qrcode>
                            </div>
                            <p class="plan-img-code-down">{{$t('PositionPlan.positionPlan_save_to_album_by_picture')}}</p>
                        </div>
                        <div class="plan-button">
                            <a-row>
                                <a-col :span="18">
                                    <p class="plan-link">{{registerPath}}</p>
                                    <p class="plan-link-desc">{{$t('PositionPlan.positionPlan_your_exclusive_recommendation_link')}}</p>
                                </a-col>
                                <a-col :span="6">
                                    <a-button type="primary" class="plan-link-copy" @click="copytips" :data-clipboard-text="registerPath">{{$t('AddressManagement.addressbook_add_btn_copy')}}</a-button>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                    <div class="plan-footer">
                        <p class="plan-www">www.ptohome.com</p>
                        <p class="plan-desc">*{{$t('PositionPlan.positionPlan_the_right_interpret_activity')}}</p>
                    </div>
                </div>
            </a-layout-content>
        </section>
    </a-layout>
</template>

<script>
    import FsHead from '~/components/mobile/FangseaHeader'
    import qrcode from '~/components/computer/QrCode'
    import fonter from '~/components/mobile/Footer'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import download from 'ly-downloader'
    import axios from '~/plugins/axios'
    import Clipboard from 'clipboard'

    export default {
        data () {
            return {
                // 首页高亮下标
                key: '0',
                // 登录、注册导航下标
                type: 0,
                // 用户中心导航下标
                centerKey: 8,
                // 抽屉动画
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 推广码
                UID: '',
                // 注册链接
                registerPath: '',
                // 过渡界面链接
                outLink: '',
                // 海报链接
                imgPath: '',
                // 长按时间达标
                isDown: false,
                // 时间倒计时
                timer: null
            }
        },
        created () {
            if (process.client) {
                this.listenI18n()
                this.getUserPlanLink()
            }
        },
        mounted () {
            this.downImg()
        },
        methods: {
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.getUserPlanLink()
                })
            },
            /**
             *  点击复制事件
             */
            copytips () {
                let clipboard = new Clipboard('.plan-link-copy')
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
             * 长按保存海报
             */
            downImg () {
                let _this = this
                let Img = document.querySelector('.plan-img')
                Img.addEventListener('touchstart', function () {
                    _this.timer = setTimeout(function () {
                        _this.isDown = true
                    }, 200)
                })
                Img.addEventListener('touchend', e => {
                    clearTimeout(_this.timer)
                    if (_this.isDown) {
                        download(1, '/' + 'public/images/06/15/2y/61d591e42e5a43ff965fea9f2681f962.jpg', 'promotion.jpg')
                        _this.isDown = false
                    }
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
                            this.outLink = `${server}/mobile/PositionPlan/PointOut?UID=${res.data.data.userCode}`
                            this.imgPath = '/' + res.data.data.recommendPostersUrl
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
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
        components: {
            FsHead,
            fonter,
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
    #mobile-positionplan {
        margin-top: -0.06rem;
        background-color: #FFFFFF;

        .plan-bg {
            width: 100vw;
            height: 100vh;
            padding-top: 0.3rem;
            background: url("/positionPlan/plan_bg.png");

            .plan-body {
                width: 2.95rem;
                margin: 0 auto;
                position: relative;

                .shadow {
                    width: 100%;
                    height: 3.48rem;
                    z-index: 9999;
                    position: absolute;
                    top: 0;
                    left: 0;
                    opacity: 0;
                }

                .plan-img {
                    width: 100%;
                    height: 3.48rem;
                    padding-top: 0.26rem;
                    background: url("/positionPlan/pic_card.png");
                    text-align: center;
                    position: relative;

                    .qrcode-contair {
                        height: 1.25rem;
                    }

                    .plan-img-id-desc {
                        font-size:12px;
                        font-weight:400;
                        color:rgba(255,255,255,1);
                    }

                    .plan-img-id {
                        min-height: 0.25rem;
                        font-size:32px;
                        color:rgba(255,255,255,1);
                        line-height:25px;
                    }

                    .plan-img-code-desc {
                        font-size:14px;
                        font-weight:400;
                        color:rgba(0,0,0,1);
                        line-height:20px;
                        margin-top: 0.65rem;
                        margin-bottom: 0.07rem;
                    }

                    .plan-img-code-down {
                        margin-top: 0.02rem;
                        font-size:14px;
                        color:rgba(46,169,223,1);
                        line-height:20px;
                    }
                }

                .plan-button {
                    height: 0.57rem;
                    margin-top: 0.3rem;
                    padding: 0.1rem;
                    background-color: #232933;
                    border: 1px solid #434851;

                    .plan-link {
                        max-width: 160px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                        font-size:14px;
                        color:rgba(255,255,255,1);
                        margin-bottom: 0;
                    }

                    .plan-link-desc {
                        font-size:12px;
                        font-weight:400;
                        color:rgba(255,255,255,1);
                        opacity: 0.6;
                    }

                    .plan-link-copy {
                        border-radius: 16px;
                        font-size:14px;
                        color:rgba(255,255,255,1);
                    }
                }
            }

            .plan-footer {
                padding-bottom: 0.2rem;
                margin-top: 0.57rem;
                width: 100vw;
                text-align: center;
                font-size:12px;
                color:rgba(255,255,255,0.35);
            }

            .plan-www {
                margin-bottom: 0.02rem;
            }
        }

    }
</style>

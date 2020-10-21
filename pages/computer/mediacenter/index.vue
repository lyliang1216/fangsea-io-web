<template>
    <a-layout id="" class="layout">
        <section id="computer-mediacenter">
            <a-layout-content>
                <div class="mediacenter">
                    <a class="logo" href="https://www.ptohome.com">
                        <img src="/content//logo.png" alt="">
                    </a>
                    <h2>MultiLingual Services 服务</h2>
                    <div class="part">
                        <div class="list">
                            <div class="pag">
                                <img class="img-btn" v-show="visiable1" @click="lookQrcode('1')" src="/content//services/services_qrcode.svg" alt="">
                                <img class="img-btn" v-show="!visiable1" @click="lookQrcode('1')" src="/content//services/services_return.svg" alt="">
                                <p class="title">English<br>PTOHome Group</p>
                                <div class="init" v-show="visiable1">
                                    <p class="img">
                                        <img src="/content//services/services_icon1.svg" alt="">
                                        <img src="/content//services/services_icon2.svg" alt="">
                                    </p>
                                    <p class="tip">More than<br>1,000 group member here</p>
                                    <p class="btn">
                                        <a-button>
                                            <a href="https://t.me/PTOHome">JOIN <a-icon type="right" /></a>
                                        </a-button>
                                    </p>
                                </div>
                                <div class="qrcode-box" v-show="!visiable1">
                                    <qrcode value="https://t.me/PTOHome" :size="80"></qrcode>
                                </div>
                            </div>
                            <div class="pag">
                                <img class="img-btn" v-show="visiable2" @click="lookQrcode('2')" src="/content//services/services_qrcode.svg" alt="">
                                <img class="img-btn" v-show="!visiable2" @click="lookQrcode('2')" src="/content//services/services_return.svg" alt="">
                                <p class="title">中文 | 简/繁<br>PTOHome 官方團</p>
                                <div class="init" v-show="visiable2">
                                    <p class="img">
                                        <img src="/content//services/services_icon3.svg" alt="">
                                        <img src="/content//services/services_icon4.svg" alt="">
                                    </p>
                                    <p class="tip" style="line-height: 1.2">超過<br>一千人加入社群</p>
                                    <p class="btn">
                                        <a-button>
                                            <a href="https://t.me/PTOHomeCN">加入 <a-icon type="right" /></a>
                                        </a-button>
                                    </p>
                                </div>
                                <div class="qrcode-box" v-show="!visiable2">
                                    <qrcode value="https://t.me/PTOHomeCN" :size="80"></qrcode>
                                </div>
                            </div>
                            <div class="pag">
                                <img class="img-btn" v-show="visiable3" @click="lookQrcode('3')" src="/content//services/services_qrcode.svg" alt="">
                                <img class="img-btn" v-show="!visiable3" @click="lookQrcode('3')" src="/content//services/services_return.svg" alt="">
                                <p class="title">微信客服<br>WeChat Services</p>
                                <div class="init" v-show="visiable3">
                                    <p class="img">
                                        <a-icon type="wechat" />
                                    </p>
                                    <p class="tip">加入社群<br>group member here</p>
                                    <p class="btn">
                                        <span class="copyWechat" @click="copyId" data-clipboard-text="FangseaIO">FangseaIO<img src="/content//services/services_copy.svg" style="margin-left: 6px" alt=""></span>
                                    </p>
                                </div>
                                <div class="qrcode-box" v-show="!visiable3">
                                    <qrcode value="https://u.wechat.com/IEzP-CvF4facXTKZqbt6OQ8" :size="88"></qrcode>
                                </div>
                            </div>
                        </div>
                        <a-button>
                            <a href="https://www.ptohome.com">
                                <span>PTOHome</span>
                                <span>PTOHome Homepage 官網 <a-icon type="right" /></span>
                            </a>
                        </a-button>
                    </div>
                    <div class="part">
                        <div class="list">
                            <div class="pag">
                                <img class="img-btn" v-show="visiable4" @click="lookQrcode('4')" src="/content//services/services_qrcode.svg" alt="">
                                <img class="img-btn" v-show="!visiable4" @click="lookQrcode('4')" src="/content//services/services_return.svg" alt="">
                                <p class="title">English<br>PTEx Group</p>
                                <div class="init" v-show="visiable4">
                                    <p class="img">
                                        <img src="/content//services/services_icon1.svg" alt="">
                                        <img src="/content//services/services_icon2.svg" alt="">
                                    </p>
                                    <p class="tip">More than<br>1,000 group member here</p>
                                    <p class="btn">
                                        <a-button>
                                            <a href="https://t.me/PTExEN">JOIN <a-icon type="right" /></a>
                                        </a-button>
                                    </p>
                                </div>
                                <div class="qrcode-box" v-show="!visiable4">
                                    <qrcode value="https://t.me/PTExEN" :size="80"></qrcode>
                                </div>
                            </div>
                            <div class="pag">
                                <img class="img-btn" v-show="visiable5" @click="lookQrcode('5')" src="/content//services/services_qrcode.svg" alt="">
                                <img class="img-btn" v-show="!visiable5" @click="lookQrcode('5')" src="/content//services/services_return.svg" alt="">
                                <p class="title">中文 | 简/繁<br>PTEx 官方團</p>
                                <div class="init" v-show="visiable5">
                                    <p class="img">
                                        <img src="/content//services/services_icon3.svg" alt="">
                                        <img src="/content//services/services_icon4.svg" alt="">
                                    </p>
                                    <p class="tip"></p>
                                    <p class="btn">
                                        <a-button>
                                            <a href="https://t.me/PTExcn">加入 <a-icon type="right" /></a>
                                        </a-button>
                                    </p>
                                </div>
                                <div class="qrcode-box" v-show="!visiable5">
                                    <qrcode value="https://t.me/PTExcn" :size="80"></qrcode>
                                </div>
                            </div>
                        </div>
                        <a-button>
                            <a href="https://www.ptex.vip">
                                <div><span>PTEx</span><span>PT Exchange 交易所</span></div>
                                <span>PTEx Homepage 官網 <a-icon type="right" /></span>
                            </a>
                        </a-button>
                    </div>
                </div>
                <div class="msg-copy-right" style="">
                    <p>©2018-2020 PTOHome|All Rights Reserved.</p>
                    <p><a href="https://www.ptohome.com">www.ptohome.com</a></p>
                </div>
                <a-modal class="wechatTips"
                         v-model="visible"
                         :footer="null">
                    <p class="tips">WeChat ID copy successful, please open WeChat search to add friends.</p>
                    <p class="tips">微信號複製成功，請打開微信搜索添加好友</p>
                </a-modal>
            </a-layout-content>
        </section>
    </a-layout>
</template>

<script>
    import qrcode from '~/components/computer/QrCode'
    import Clipboard from 'clipboard'

    export default {
        data () {
            return {
                // 显示复制成功弹窗
                visible: false,
                // 显示卡片文字或二维码
                visiable1: true,
                visiable2: true,
                visiable3: true,
                visiable4: true,
                visiable5: true
            }
        },
        mounted () {
            // 加入统计代码
            this.loadScript()
        },
        methods: {
            /**
             * 显示或影藏二维码
             * @param n 第几个卡片
             */
            lookQrcode (n) {
                this['visiable' + n] = !this['visiable' + n]
            },
            /**
             * 复制微信号
             */
            copyId () {
                let clipboard = new Clipboard('.copyWechat')
                clipboard.on('success', e => {
                    this.visible = true
                    clipboard.destroy()
                })
                clipboard.on('error', e => {
                    clipboard.destroy()
                })
            },
            /**
             * 加入统计代码
             */
            loadScript () {
                let script = document.createElement('script')
                let code = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K597J4T');`
                try {
                    script.appendChild(document.createTextNode(code))
                } catch (ex) {
                    script.text = code
                }
                document.getElementsByTagName('head')[0].appendChild(script)

                let noscript = document.createElement('noscript')
                let iframe = document.createElement('iframe')
                iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-K597J4T'
                iframe.height = '0'
                iframe.width = '0'
                iframe.style.display = 'none'
                iframe.style.visibility = 'hidden'
                document.getElementsByTagName('body')[0].appendChild(noscript)
                document.getElementsByTagName('noscript')[0].appendChild(iframe)
            }
        },
        components: {
            qrcode
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../assets/css/computer/main.less';

    p {
        margin: 0;
    }
    .layout {
        background: #fff;
    }
    .mediacenter {
        position: relative;
        background: #fff;
        border: 1px solid #e8e8e8;
        border-radius: 20px;
        width: 1000px;
        margin: 100px auto 0;
        padding-top: 80px;
        .logo {
            position: absolute;
            left: 60px;
            top: 60px;
            img {
                display: block;
                width: 48px;
                height: 48px;
            }
        }
        h2 {
            font-size: 32px;
            line-height: 1;
            color: #000;
            font-weight: 600;
            text-align: center;
        }
        .part {
            width: 566px;
            margin: 40px auto 0;
            padding-bottom: 40px;
            border-bottom: 1px solid #e8e8e8;
            &:last-child {
                border-bottom: none;
            }
            .list {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 24px;
                .pag {
                    width: 178px;
                    height: 222px;
                    box-sizing: border-box;
                    border: 1px solid #f1f1f1;
                    padding: 40px 0 20px;
                    border-radius: 12px;
                    margin-right: 16px;
                    box-shadow:0 0 8px 2px rgba(0, 0, 0, 0.06);
                    position: relative;
                    cursor: pointer;
                    &:last-child {
                        margin-right: 0;
                    }
                    &:hover {
                        border: 1px solid #2EA9DF;
                    }
                    .img-btn {
                        position: absolute;
                        top: 8px;
                        right: 8px;
                        width: 32px;
                        height: 32px;
                        cursor: pointer;
                        z-index: 1000;
                    }
                    .title {
                        font-size: 16px;
                        line-height: 18px;
                        text-align: center;
                        color: #111;
                        margin-bottom: 20px;
                    }
                    .init {
                        height: 128px;
                        .img {
                            margin-bottom: 6px;
                            text-align: center;
                            img {
                                width: 20px;
                                height: 20px;
                            }
                            i {
                                font-size: 20px;
                                color: #111;
                            }
                        }
                        .tip {
                            text-align: center;
                            font-size: 12px;
                            line-height: 1;
                            color: #999;
                            font-weight: 300;
                        }
                        .btn {
                            position: absolute;
                            width: 100%;
                            bottom: 20px;
                            display: flex;
                            justify-content: center;
                            button {
                                width: 76px;
                                height: 28px;
                                border-radius: 38px;
                                border: 0.5px solid #aaa;
                                a {
                                    font-size: 14px;
                                    line-height: 28px;
                                    color: #111;
                                }
                            }
                            span {
                                font-size: 16px;
                                line-height: 1;
                                color: #111;
                                cursor: pointer;
                                text-align: center;
                                padding-bottom: 6px;
                                img {
                                    width: 16px;
                                    height: 16px;
                                }
                            }
                        }
                    }
                    .qrcode-box {
                        div {
                            display: flex;
                            justify-content: center;
                        }
                    }
                }
            }
            & > button {
                width: 100%;
                height: 36px;
                padding: 0;
                border-radius: 18px;
                a {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    & > span:nth-child(1) {
                        font-size: 16px;
                        color: #111;
                        margin-left: 20px;
                        font-weight: 600;
                    }
                    & > span:nth-child(2) {
                        font-size: 14px;
                        color: #111;
                        font-weight: 300;
                        display: block;
                        height: 28px;
                        line-height: 28px;
                        background: #f5f5f5;
                        border-radius: 14px;
                        margin-right: 4px;
                        padding: 0 20px;
                    }
                    div {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        margin-left: 20px;
                        span {
                            font-size: 16px;
                            color: #111;
                            font-weight: 600;
                            line-height: 16px;
                            display: inline-block;
                            height: 16px;
                            &:nth-child(2) {
                                padding-left: 6px;
                                margin-left: 6px;
                                border-left: 1px solid #aaa;
                            }
                        }
                    }
                }
                &:hover {
                    a {
                        & > span:nth-child(2) {
                            color: #fff;
                            background: #2EA9DF;
                        }
                    }
                }
            }
        }
    }
    .msg-copy-right {
        margin: 40px 15px 0;
        padding-bottom: 68px;
        p {
            font-size: 14px;
            color: #999;
            margin-bottom: 6px;
            text-align: center;
        }
        a {
            font-size: 14px;
            color: #999;
            border-bottom: 1px solid #888;
        }
    }
</style>

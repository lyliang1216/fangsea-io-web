<template>
    <a-layout id="components-layout-mobile-top"
              class="layout">
        <section id="mobile-mediacenter">
            <a-layout-content>
                <div class="mediacenter">
                    <h2>Services 服務</h2>
                    <div class="part">
                        <h3>PTOHome</h3>
                        <div class="list">
                            <ul>
                                <li>
                                    <div class="top">
                                        <div>
                                            <p>English</p>
                                            <p>PTOHome Group</p>
                                        </div>
                                        <a-button><a href="https://t.me/PTOHome">JOIN <a-icon type="right" /></a></a-button>
                                    </div>
                                    <p><img src="/content/services/services_icon1.svg" alt=""><img src="/content/services/services_icon2.svg" alt="">
                                        <span>More than 1,000 group members here.</span>
                                    </p>
                                </li>
                                <li>
                                    <div class="top">
                                        <div>
                                            <p>中文 | 简/繁</p>
                                            <p>PTOHome 官方團</p>
                                        </div>
                                        <a-button><a href="https://t.me/PTOHomeCN">加入 <a-icon type="right" /></a></a-button>
                                    </div>
                                    <p><img src="/content/services/services_icon3.svg" alt=""><img src="/content/services/services_icon4.svg" alt="">
                                        <span>超過一千人加入社群</span>
                                    </p>
                                </li>
                                <li>
                                    <div class="top">
                                        <div>
                                            <p>微信客服</p>
                                            <p>WeChat Services</p>
                                        </div>
                                        <a-button class="btn" @click="copyId" data-clipboard-text="FangseaIO"><a-icon style="margin-right: 18px" type="wechat" /><a-icon type="right" /></a-button>
                                    </div>
                                </li>
                            </ul>
                            <a-button><a href="https://www.ptohome.com">PTOHome Homepage 官網 <a-icon type="right" /></a></a-button>
                        </div>
                    </div>
                    <div class="part">
                        <h3>PTEx | PT Exchange 交易所 </h3>
                        <div class="list">
                            <ul>
                                <li>
                                    <div class="top">
                                        <div>
                                            <p>English</p>
                                            <p>PTEx Group</p>
                                        </div>
                                        <a-button><a href="https://t.me/PTExEN">JOIN <a-icon type="right" /></a></a-button>
                                    </div>
                                    <p><img src="/content/services/services_icon1.svg" alt=""><img src="/content/services/services_icon2.svg" alt="">
                                        <span>More than 1,000 group members here.</span>
                                    </p>
                                </li>
                                <li>
                                    <div class="top">
                                        <div>
                                            <p>中文 | 简/繁</p>
                                            <p>PTEx 官方團</p>
                                        </div>
                                        <a-button><a href="https://t.me/PTExcn">加入 <a-icon type="right" /></a></a-button>
                                    </div>
                                    <p><img src="/content/services/services_icon3.svg" alt=""><img src="/content/services/services_icon4.svg" alt=""><span></span></p>
                                </li>
                            </ul>
                            <a-button><a href="https://www.ptex.vip">PTEx Homepage 官網 <a-icon type="right" /></a></a-button>
                        </div>
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
    import Clipboard from 'clipboard'

    export default {
        data () {
            return {
                // 显示复制成功弹窗
                visible: false
            }
        },
        mounted () {
            // 加入统计代码
            this.loadScript()
        },
        methods: {
            /**
             * 复制微信号
             */
            copyId () {
                let clipboard = new Clipboard('.btn')
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
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../assets/css/mobile/main.less';

    p {
        margin: 0;
    }
    .mediacenter {
        padding: 0.3rem;
        margin-bottom: 0.2rem;
        background: #fff;
        h2 {
            font-size: 32px;
            font-family: DIN-Black,DIN;
            font-weight: 900;
            color: #000;
            line-height: 32px;
        }
        .part {
            margin-top: 0.3rem;
            h3 {
                font-size: 16px;
                font-weight: 600;
                color: #111;
                line-height: 16px;
                margin-bottom: 0.15rem;
            }
            .list {
                width: 100%;
                box-sizing: border-box;
                padding: 0.3rem 0.2rem;
                box-shadow:0 0 10px 5px rgba(0, 0, 0, 0.08);
                border-radius: 12px;
                ul {
                    padding: 0;
                    li {
                        list-style: none;
                        margin-bottom: 0.25rem;
                        border-bottom: 1px solid #e8e8e8;
                        padding-bottom: 0.2rem;
                        .top {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            div {
                                p {
                                    font-size: 18px;
                                    line-height: 18px;
                                    color: #111;
                                    &:nth-child(1) {
                                        margin-bottom: 4px;
                                    }
                                    &:nth-child(2) {
                                        margin-bottom: 10px;
                                    }
                                }
                            }
                            button {
                                width: 0.86rem;
                                height: 0.34rem;
                                border-radius: 17px;
                                border: 1px solid #aaa;
                                font-weight: 500;
                                font-size: 16px;
                                color: #111;
                                a {
                                    font-weight: 500;
                                    font-size: 16px;
                                    color: #111;
                                }
                            }
                        }
                        & > p {
                            font-size: 18px;
                            line-height: 18px;
                            color: #111;
                            display: flex;
                            justify-content: flex-start;
                            align-items: flex-start;
                            img {
                                display: inline-block;
                                width: 0.2rem;
                                height: 0.2rem;
                                margin-right: 3px;
                            }
                            span {
                                font-size: 14px;
                                line-height: 1;
                                color: #999;
                                margin-left: 6px;
                            }
                        }
                        &:last-child {
                            border-bottom: none;
                            padding-bottom: 0;
                            margin-bottom: 0.3rem;
                        }
                    }
                }
                & > button {
                    width: 100%;
                    border: 1px solid #aaa;
                    border-radius: 17px;
                    height: 0.34rem;
                    a {
                        font-weight: 500;
                        font-size: 16px;
                        color: #111;
                    }
                }
            }
        }
    }
    .msg-copy-right {
        margin: 0.15rem 0.15rem 0;
        p {
            margin-bottom: 6px;
            text-align: center;
        }
        a {
            border-bottom: 1px solid #888;
        }
    }
    .wechatTips {
        .tips {
            font-size: 18px;
            color: #111;
            line-height: 32px;
            padding: 5px 10px;
        }
    }
</style>

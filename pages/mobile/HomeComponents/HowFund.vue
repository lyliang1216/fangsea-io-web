<template>
    <div class="howFundBox">
        <p class="howFundTitle">{{$t('Home.home_how_title_headline')}}</p>
        <div class="videoBg" v-html="videoHTML"></div>
        <a-row type="flex" justify="space-between" align="top" class="howFundMain">
            <a-col :span="4" class="mainItem">
                <img class="itmeIcon" src="/content/homeImgs/howFundIcon1.png" alt="">
                <p class="itemTitle">{{$t('Home.home_how_content_1')}}</p>
                <p class="itemContent">{{$t('Home.home_how_tip_1')}}</p>
            </a-col>
            <a-col :span="4" class="mainItem">
                <img class="itmeIcon" src="/content/homeImgs/howFundIcon2.png" alt="">
                <p class="itemTitle">{{$t('Home.home_how_content_2')}}</p>
                <p class="itemContent">{{$t('Home.home_how_tip_2')}}</p>
            </a-col>
            <a-col :span="4" class="mainItem">
                <img class="itmeIcon" src="/content/homeImgs/howFundIcon3.png" alt="">
                <p class="itemTitle">{{$t('Home.home_how_content_4')}}</p>
                <p class="itemContent">{{$t('Home.home_how_tip_4')}}</p>
            </a-col>
            <a-col :span="4" class="mainItem">
                <img class="itmeIcon" src="/content/homeImgs/howFundIcon4.png" alt="">
                <p class="itemTitle">{{$t('Home.home_how_content_5')}}</p>
                <p class="itemContent">{{$t('Home.home_how_tip_5')}}</p>
            </a-col>
        </a-row>
    </div>
</template>


<script>
    import Cookie from 'js-cookie'
    import {Bus} from '~/assets/utils/bus'

    export default {
        data () {
            return {
                videoHTML: '',
                nowLang: ''
            }
        },
        created () {
            this.listenCookie()
        },
        methods: {
            changeVideoWithLong () {
                switch (this.nowLang) {
                case 'zh_CN':
                    this.videoHTML = '<video style="object-fit:fill;width: 100%;height: 100%;" ' +
                        'src="http://video.ptohome.com/PTOHOME_TW_1080p.mp4" controls preload="auto"></video>'
                    break
                case 'zh_TW':
                    this.videoHTML = '<video style="object-fit:fill;width: 100%;height: 100%;" ' +
                        'src="http://video.ptohome.com/PTOHOME_TW_1080p.mp4" controls preload="auto"></video>'
                    break
                case 'en_US':
                    this.videoHTML = '<video style="object-fit:fill;width: 100%;height: 100%;" ' +
                        'src="http://video.ptohome.com/PTOHOME_EN_1080p.mp4" controls preload="auto"></video>'
                    break
                }
            },
            // 语言切换监听
            changelang () {
                Bus.$on('checkLange', () => {
                    this.videoLoad = true
                    this.nowLang = Cookie.get('language')
                    this.changeVideoWithLong()
                })
            },
            // 循环监听语言cookie
            listenCookie () {
                this.nowLang = Cookie.get('language')
                if (this.nowLang) {
                    this.changeVideoWithLong()
                    this.changelang()
                } else {
                    setTimeout(this.listenCookie, 100)
                }
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        }
    }
</script>

<style lang="less" scoped>
    .howFundBox {
        width: 100%;
        margin: 0 auto;
        padding: 24px 16px 0;
        border-bottom: 8px solid #FAFAFA;

        .howFundTitle {
            font-size: 24px;
            line-height: 32px;
            color: #333333;
            font-weight: 500;
            margin: 0;
            text-align: center;
        }

        .videoBg{
            width: 100%;
            height: calc(~'62vw - 32px');
            position: relative;
            overflow: hidden;
            background-color: #D8D8D8;
            margin: 29px auto 0;
            border-radius:8px;
            text-align: center;
            .loadingIcon{
                font-size: 30px;
                margin-top: 60px;
                color: #999999;
            }
            .loadingText{
                max-width: 80%;
                word-break: break-all;
                font-size: 14px;
                line-height: 20px;
                margin: 20px auto 0;
                color: #666666;
            }
            .videoBox{
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
        }

        .howFundMain {
            padding-top: 28px;

            .mainItem {
                width: calc(~"50% - 10px");
                text-align: center;

                .itmeIcon {
                    width: 56px;
                }

                .itemTitle {
                    font-size: 16px;
                    line-height: 22px;
                    color: #333333;
                    font-weight: 500;
                    margin: 0;
                    letter-spacing: 1px;
                }

                .itemContent {
                    font-size: 12px;
                    line-height: 17px;
                    color: #666666;
                    letter-spacing: 1px;
                    margin: 0 0 13px;
                }
            }

            .mainNextItem {
                width: 40px;

                img {
                    width: 100%;
                }
            }
        }
    }
</style>

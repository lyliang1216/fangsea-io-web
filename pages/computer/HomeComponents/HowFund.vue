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
            <a-col :span="1" class="mainNextItem">
                <img src="/content//homeImgs/howFundNext.png" alt="">
            </a-col>
            <a-col :span="4" class="mainItem">
                <img class="itmeIcon" src="/content//homeImgs/howFundIcon2.png" alt="">
                <p class="itemTitle">{{$t('Home.home_how_content_2')}}</p>
                <p class="itemContent">{{$t('Home.home_how_tip_2')}}</p>
            </a-col>
            <a-col :span="1" class="mainNextItem">
                <img src="/content//homeImgs/howFundNext.png" alt="">
            </a-col>
            <a-col :span="4" class="mainItem">
                <img class="itmeIcon" src="/content//homeImgs/howFundIcon3.png" alt="">
                <p class="itemTitle">{{$t('Home.home_how_content_4')}}</p>
                <p class="itemContent">{{$t('Home.home_how_tip_4')}}</p>
            </a-col>
            <a-col :span="1" class="mainNextItem">
                <img src="/content//homeImgs/howFundNext.png" alt="">
            </a-col>
            <a-col :span="4" class="mainItem">
                <img class="itmeIcon" src="/content//homeImgs/howFundIcon4.png" alt="">
                <p class="itemTitle">{{$t('Home.home_how_content_5')}}</p>
                <p class="itemContent">{{$t('Home.home_how_tip_5')}}</p>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        props: ['videoHTML']
    }
</script>

<style lang="less" scoped>
    .howFundBox {
        width: 1200px;
        margin: 0 auto;
        padding: 40px 0 66px;
        border-bottom: 1px solid #D9D9D9;

        .howFundTitle {
            font-size: 24px;
            line-height: 32px;
            color: #333333;
            font-weight: 500;
            margin: 0;
            text-align: center;
        }

        .videoBg {
            width: 684px;
            height: 386px;
            position: relative;
            overflow: hidden;
            background-color: #D8D8D8;
            margin: 29px auto 0;
            border-radius: 8px;
            text-align: center;

            .loadingIcon {
                font-size: 58px;
                margin-top: 151px;
                color: #999999;
            }

            .loadingText {
                font-size: 18px;
                line-height: 26px;
                margin-top: 40px;
                color: #666666;
            }

            .videoBox {
                position: absolute;
                top: 0;
                left: 0;
            }
        }

        .howFundMain {
            padding-top: 28px;

            .mainItem {
                width: 210px;
                text-align: center;

                .itmeIcon {
                    width: 96px;
                }

                .itemTitle {
                    font-size: 24px;
                    line-height: 32px;
                    color: #333333;
                    font-weight: 500;
                    margin: 16px 0 0;
                    letter-spacing: 1px;
                }

                .itemContent {
                    font-size: 14px;
                    line-height: 20px;
                    color: #666666;
                    letter-spacing: 1px;
                    margin: 8px 0 0;
                }
            }

            .mainNextItem {
                width: 40px;
                padding-top: 90px;

                img {
                    width: 100%;
                }
            }
        }
    }
</style>

<template>
    <div class="webDescBox">
        <a-row type="flex" justify="space-between" align="top" class="webDescContent">
            <a-col :span="4" class="webDescItem">
                <img src="/content/homeImgs/webdesc1.png" alt="">
                <p class="item_tt">{{$t('Home.home_features_content_1')}}</p>
                <p class="item_msg">{{$t('Home.home_features_tip_1')}}</p>
            </a-col>
            <a-col :span="4" class="webDescItem">
                <img src="/content/homeImgs/webdesc2.png" alt="">
                <p class="item_tt">{{$t('Home.home_features_content_2')}}</p>
                <p class="item_msg">{{$t('Home.home_features_tip_2')}}</p>
            </a-col>
            <a-col :span="4" class="webDescItem">
                <img src="/content/homeImgs/webdesc3.png" alt="">
                <p class="item_tt">{{$t('Home.home_features_content_3')}}</p>
                <p class="item_msg">{{$t('Home.home_features_tip_3')}}</p>
            </a-col>
            <a-col :span="4" class="webDescItem">
                <img src="/content/homeImgs/webdesc4.png" alt="">
                <p class="item_tt">{{$t('Home.home_features_content_4')}}</p>
                <p class="item_msg">{{$t('Home.home_features_tip_4')}}</p>
            </a-col>
            <a-col :span="4" class="webDescItem">
                <img src="/content/homeImgs/webdesc5.png" alt="">
                <p class="item_tt" v-html="$t('Home.home_features_content_5')"></p>
                <p class="item_msg" v-html="$t('Home.home_features_tip_5')"></p>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        head () {
            return {
                title: this.$t('PageTitle.house_index_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    .webDescBox{
        width: 1200px;
        margin: 55px auto 90px;
        .webDescContent{
            .webDescItem{
                &:nth-child(1){
                    width:204px;
                }
                &:nth-child(2){
                    width:192px;
                }
                &:nth-child(3){
                    width:217px;
                }
                &:nth-child(4){
                    width:138px;
                }
                &:nth-child(5){
                    width:164px;
                }
                img{
                    width:38px;
                    height:38px;
                    margin:0 auto;
                    display: block;
                }
                .item_tt{
                    font-size:16px;
                    line-height:20px;
                    margin-top:20px;
                    color: #333333;
                    text-align: center;
                    font-weight:bold;
                    margin-bottom:0;
                }
                .item_msg{
                    font-size:12px;
                    line-height:18px;
                    color: #999999;
                    margin-bottom:0;
                    margin-top:13px;
                    text-align: center;
                }
            }
        }
    }
</style>

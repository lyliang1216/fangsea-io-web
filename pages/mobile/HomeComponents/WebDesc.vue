<template>
    <div class="webDescBox">
        <a-row type="flex" justify="space-between" align="middle" class="webDescItem">
            <a-col :span="6" class="webDescItemL">
                <img src="/content//homeImgs/webdesc1.png" alt="">
            </a-col>
            <a-col :span="18" class="webDescItemR">
                <p class="item_tt">{{$t('Home.home_features_content_1')}}</p>
                <p class="item_msg">{{$t('Home.home_features_tip_1')}}</p>
            </a-col>
        </a-row>
        <a-row type="flex" justify="space-between" align="middle" class="webDescItem">
            <a-col :span="6" class="webDescItemL">
                <img src="/content//homeImgs/webdesc2.png" alt="">
            </a-col>
            <a-col :span="18" class="webDescItemR">
                <p class="item_tt">{{$t('Home.home_features_content_2')}}</p>
                <p class="item_msg">{{$t('Home.home_features_tip_2')}}</p>
            </a-col>
        </a-row>
        <a-row type="flex" justify="space-between" align="middle" class="webDescItem">
            <a-col :span="6" class="webDescItemL">
                <img src="/content//homeImgs/webdesc3.png" alt="">
            </a-col>
            <a-col :span="18" class="webDescItemR">
                <p class="item_tt">{{$t('Home.home_features_content_3')}}</p>
                <p class="item_msg">{{$t('Home.home_features_tip_3')}}</p>
            </a-col>
        </a-row>
        <a-row type="flex" justify="space-between" align="middle" class="webDescItem">
            <a-col :span="6" class="webDescItemL">
                <img src="/content//homeImgs/webdesc4.png" alt="">
            </a-col>
            <a-col :span="18" class="webDescItemR">
                <p class="item_tt">{{$t('Home.home_features_content_4')}}</p>
                <p class="item_msg">{{$t('Home.home_features_tip_4')}}</p>
            </a-col>
        </a-row>
        <a-row type="flex" justify="space-between" align="middle" class="webDescItem">
            <a-col :span="6" class="webDescItemL">
                <img src="/content//homeImgs/webdesc5.png" alt="">
            </a-col>
            <a-col :span="18" class="webDescItemR">
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
        width: 100%;
        margin: 0 auto;
        padding: 24px 35px 0;
        .webDescItem{
            padding-bottom: 24px;
            .webDescItemL{
                width: 43px;
                img{
                    width:43px;
                    height:43px;
                    margin:0 auto;
                    display: block;
                }
            }
            .webDescItemR{
                .item_tt{
                    font-size:14px;
                    line-height:16px;
                    color: #333333;
                    text-align: left;
                    font-weight:bold;
                    margin-bottom:0;
                }
                .item_msg{
                    font-size:12px;
                    line-height:18px;
                    color: #999999;
                    margin-bottom:0;
                    margin-top:6px;
                    text-align: left;
                }
            }
        }

    }
</style>

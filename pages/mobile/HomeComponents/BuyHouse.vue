<template>
    <div class="buyHouseBox" v-if="houseListLength !== 0">
        <a-row type="flex" justify="space-between" align="middle" class="buyTitle">
            <a-col :span="12" class="titleL">{{$t('Home.home_title_wholebuy')}}</a-col>
            <a-col :span="12" class="titleR" @click="redirectOne('/house/list/pg1.html')">{{$t('Home.home_btn_more')}} ></a-col>
        </a-row>
        <a-row type="flex" justify="space-between" align="top" class="houseContent">
            <a-col :span="8" class="houseItem" v-for="(item, index) in houseList" :key="index">
                <div class="itemImg" @click="redirectOne(item.requestUrl)" :style="{backgroundImage: 'url(' + item.imageUrl.url + ')'}"></div>
                <p class="itmeName" @click="redirectOne(item.requestUrl)">{{item.name}}</p>
                <a-row type="flex" justify="start" align="middle" class="itemPrice">
                    <a-col :span="6" class="totalPrice">{{item.price}}</a-col>
                    <a-col :span="3" class="totalPriceR">≈{{item.yueprice}}</a-col>
                </a-row>
                <p class="itemIncome">{{$t('Home.home_buy_house_content_downpayment')}}<span class="proportion">{{item.putDown}}</span></p>
                <p class="itemIncome">{{$t('Home.home_buy_house_content_rent')}}<span class="proportion">{{item.theRent}}</span></p>
                <p class="localtion">
                    <img src="/content/homeImgs/location.png" alt="">
                    {{item.localName}}
                </p>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        props: ['houseList', 'houseListLength'],
        methods: {
            /**
             * 跳转至一期
             */
            redirectOne (url) {
                window.location.href = url
            }
        }
    }
</script>

<style lang="less" scoped>
    .text-ellipsis-lines(@line:2){
        overflow: hidden;
        display: -webkit-box;
        /*! autoprefixer: ignore next */
        -webkit-box-orient: vertical;
        -webkit-line-clamp: @line;
        //word-wrap:break-word;
    }

    .buyHouseBox{
        width: 100%;
        margin: 0 auto;
        padding: 24px 16px 0;
        border-bottom: 8px solid #FAFAFA;
        .buyTitle{
            margin-bottom: 18px;
            .titleL{
                font-size: 16px;
                line-height: 12px;
                color: #333333;
                font-weight: 500;
            }
            .titleR{
                font-size: 14px;
                line-height: 20px;
                text-align: right;
                cursor: pointer;
                color: #333333;
            }
        }
        .houseContent{
            .houseItem{
                width: calc(~"50% - 4px");
                margin-bottom: 18px;
                .itemImg{
                    width: 100%;
                    height: 126px;
                    border-radius:4px;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: center center;
                    cursor: pointer;
                }
                .itmeName{
                    width: 100%;
                    font-size: 14px;
                    line-height: 20px;
                    font-weight: 500;
                    margin-bottom: 13px;
                    color: #333333;
                    .text-ellipsis-lines(2);
                    cursor: pointer;
                }
                .itemPrice{
                    margin-bottom: 8px;
                    .totalPrice{
                        width: 100%;
                        font-size: 14px;
                        color: #FF3428;
                        line-height: 22px;
                        font-weight: 600;
                    }
                    .totalPriceR{
                        width: 100%;
                        font-size: 12px;
                        line-height: 20px;
                        color: #999999;
                    }
                }
                .itemIncome{
                    font-size: 12px;
                    line-height: 16px;
                    margin-bottom: 0;
                    .proportion{
                        color: #FF3428;
                        font-weight: 500;
                    }
                }
                .localtion{
                    font-size: 12px;
                    line-height: 20px;
                    margin-top: 4px;
                    img{
                        height: 16px;
                    }
                }
            }
        }
    }
</style>

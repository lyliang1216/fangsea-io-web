<template>
    <div class="buyHouseBox" v-if="houseListLength !== 0">
        <a-row type="flex" justify="space-between" align="middle" class="buyTitle">
            <a-col :span="6" class="titleL">{{$t('Home.home_title_wholebuy')}}</a-col>
            <a-col :span="3" class="titleR" @click="redirectOne('/house/list/pg1.html')">{{$t('Home.home_btn_more')}} ></a-col>
        </a-row>
        <a-row type="flex" justify="space-between" align="top" class="houseContent">
            <a-col :span="8" class="houseItem" v-for="(item, index) in houseList" :key="index">
                <div class="itemImg" @click="redirectOne(item.requestUrl)" :style="{backgroundImage: 'url(' + item.imageUrl.url + ')'}"></div>
                <p class="itmeName" @click="redirectOne(item.requestUrl)">{{item.name}}</p>
                <a-row type="flex" justify="start" align="middle" class="itemPrice">
                    <a-col :span="6" class="totalPrice">{{item.price}}</a-col>
                    <a-col :span="3" class="totalPriceR">≈{{item.yueprice}}</a-col>
                </a-row>
                <p class="itemIncome">
                    {{$t('Home.home_buy_house_content_downpayment')}}<span class="proportion">{{item.putDown}}</span>
                    /{{$t('Home.home_buy_house_content_rent')}}<span class="proportion">{{item.theRent}}</span></p>
                <p class="localtion">
                    <img src="/content//homeImgs/location.png" alt="">
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
        -webkit-box-orient: vertical;
        -webkit-line-clamp: @line;
        //word-wrap:break-word;
    }

    .buyHouseBox{
        width: 1200px;
        margin: 0 auto;
        .buyTitle{
            margin: 40px 0 28px;
            .titleL{
                font-size: 20px;
                line-height: 28px;
                color: #333333;
                font-weight: 500;
            }
            .titleR{
                width: auto;
                font-size: 14px;
                line-height: 20px;
                text-align: right;
                cursor: pointer;
                color: #2EA9DF;
            }
        }
        .houseContent{
            .houseItem{
                width: 379px;
                margin-bottom: 45px;
                .itemImg{
                    width: 379px;
                    height: 265px;
                    border-radius:8px 8px 0 0;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: center center;
                    cursor: pointer;
                }
                .itmeName{
                    width: 349px;
                    font-size: 16px;
                    line-height: 28px;
                    font-weight: 500;
                    margin: 14px 0 13px;
                    color: #333333;
                    .text-ellipsis-lines(2);
                    cursor: pointer;
                }
                .itemPrice{
                    margin-bottom: 8px;
                    .totalPrice{
                        width: auto;
                        font-size: 18px;
                        color: #FF3428;
                        line-height: 18px;
                        font-weight: 600;
                    }
                    .totalPriceR{
                        width: auto;
                        font-size: 14px;
                        line-height: 18px;
                        color: #999999;
                    }
                }
                .itemIncome{
                    font-size: 14px;
                    .proportion{
                        color: #FF3428;
                        font-weight: 500;
                    }
                }
                .localtion{
                    font-size: 12px;
                    line-height: 21px;
                    img{
                        height: 16px;
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="shareBox" v-if="listLength !== 0">
        <a-row type="flex" justify="space-between" align="middle" class="shareTitle">
            <a-col :span="12" class="titleL">{{$t('Home.home_title_unitbuy')}}</a-col>
            <a-col :span="12" class="titleR">
                <nuxt-link to="/mobile/CertificatePurchase">{{$t('Home.home_btn_more')}} ></nuxt-link>
            </a-col>
        </a-row>
        <section v-for="(item, index) in shareList" :key="index" @click="targetInfo(item.projectId)">
            <a-row type="flex" justify="space-between" align="middle" class="shareProject">
                <div class="icon-contair" v-show="item.saleRatio === 100">
                    <sell-out :isZh="isZh"/>
                </div>
                <a-col :span="12" class="projectL">
                    <div class="leftImg" :style="{backgroundImage: 'url(/' + item.imgPath + ')'}"></div>
                </a-col>
                <a-col :span="12" class="projectR">
                    <div class="rightHead">
                        <nuxt-link :to="`/mobile/CertificatePurchase/info/${item.projectId}`">
                            <p class="projectName">{{item.name}}</p>
                        </nuxt-link>
                        <a-row type="flex" justify="start" align="middle" class="totalPrice">
                            <a-col :span="3" class="totalPriceL">{{$t('CertificatePurchase.ptpurchase_title_totalprice')}}</a-col>
                            <a-col :span="12" class="totalPriceR">{{item.totalPrice | formatNumber}} {{item.priceCurCode}}</a-col>
                        </a-row>
                    </div>
                    <a-row type="flex" justify="space-between" align="middle" class="projectData">
                        <a-col :span="6" class="dataItem" v-if="item.prospectiveYield">
                            <p class="itemNum">{{item.prospectiveYield}}</p>
                            <p class="itemDesc">{{$t('CertificatePurchase.ptpurchase_title_annualrental')}}</p>
                        </a-col>
                        <a-col :span="6" class="dataItem" v-if="item.apartment">
                            <p class="itemNum">{{item.apartment}}</p>
                            <p class="itemDesc">{{$t('CertificatePurchase.ptpurchase_title_accounttype')}}</p>
                        </a-col>
                        <a-col :span="6" class="dataItem">
                            <p class="itemNum">{{item.measure}}m<sup>2</sup></p>
                            <p class="itemDesc">{{$t('CertificatePurchase.ptpurchase_title_area')}}</p>
                        </a-col>
                    </a-row>
                    <div class="rightFoot">
                        <a-row type="flex" justify="space-between" align="middle" class="footMsg">
                            <a-col :span="6" class="msgTitle">{{$t('CertificatePurchase.certificatePurchase_item_number')}}</a-col>
                            <a-col :span="12" class="msgContent blue">{{item.ptCurCode}}</a-col>
                        </a-row>
                        <a-row type="flex" justify="space-between" align="middle" class="footMsg">
                            <a-col :span="6" class="msgTitle">{{$t('CertificatePurchase.ptpurchase_title_itemtype')}}</a-col>
                            <a-col :span="12" class="msgContent">{{item.projectTypeName}}</a-col>
                        </a-row>
                        <a-row type="flex" justify="space-between" align="middle" class="footMsg">
                            <a-col :span="6" class="msgTitle">{{$t('CertificatePurchase.ptpurchase_title_itemaddress')}}</a-col>
                            <a-col :span="12" class="msgContent">
                                <p class="shareAddress">{{item.address}}</p>
                            </a-col>
                        </a-row>
                        <!--         通证进度条           -->
                        <pto-progress class="info-progress"
                                      :saleRatio="item.saleRatio"
                                      :successRatio="item.successRatio"
                                      :sellOutRatio="item.sellOutRatio"
                                      :issueState="item.issueState"
                                      :saleableAmount="item.saleableAmount"
                                      :isFail="(item.issueState === 2 || item.issueState === 3) ? false : true">
                        </pto-progress>
                        <a-row type="flex" justify="space-between" align="middle" class="progressData">
                            <a-col :span="6" class="dataItem">
                                <p class="itemNum">{{item.minimumBuyAmount | formatNumber}}</p>
                                <p class="itemDesc">{{$t('CertificatePurchase.certificatePurchase_item_total')}}</p>
                            </a-col>
                            <a-col :span="6" class="dataItem">
                                <p class="itemNum">{{item.userMinAmount | formatNumber}}</p>
                                <p class="itemDesc">{{$t('CertificatePurchase.certificatePurchase_item_minimum_subscription')}}</p>
                            </a-col>
                            <a-col :span="6" class="dataItem">
                                <p class="itemNum">{{item.saleableAmount | formatNumber}}</p>
                                <p class="itemDesc">{{$t('CertificatePurchase.certificatePurchase_remaining_quantity')}}</p>
                            </a-col>
                        </a-row>
                    </div>
                </a-col>
            </a-row>
        </section>
    </div>
</template>

<script>
    import PtoProgress from '~/components/mobile/PtoProgress'
    import {formatNumber} from '~/assets/utils/index'
    import SellOut from '~/components/mobile/SellOut'
    import {Bus} from '~/assets/utils/bus'
    import Cookie from 'js-cookie'

    export default {
        props: ['shareList', 'listLength'],
        data () {
            return {
                // 进度条状态颜色
                strokeColorNormal: '#2FAAE0',
                strokeColorError: '#D9D9D9',
                // 售罄图标是否是中文
                isZh: true,
                // 是否显示售罄图标
                showSalesIcon: false
            }
        },
        filters: {
            formatNumber
        },
        created () {
            this.listenI18n()
            this.setIconI18n()
        },
        methods: {
            // 获取当前国际化标识
            setIconI18n () {
                // 售罄图标同步国际化
                switch (Cookie.get('language')) {
                case 'zh_TW' :
                    this.isZh = true
                    break
                case 'zh_CN' :
                    this.isZh = true
                    break
                case 'en_US' :
                    this.isZh = false
                    break
                }
            },
            // 跳转项目详情
            targetInfo (projectId) {
                this.$router.push(`/mobile/CertificatePurchase/info/${projectId}`)
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.setIconI18n()
                })
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        components: {
            SellOut,
            PtoProgress
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
    .text-ellipsis(){
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        //word-wrap:break-word;
    }

    .shareBox{
        width: 100%;
        margin: 0 auto;
        padding: 24px 0 0;
        border-bottom: 8px solid #FAFAFA;
        .shareTitle{
            padding: 0 16px;
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
        .shareProject{
            position: relative;
            margin: 0;
            padding: 24px 16px ;
            border-bottom: 4px solid rgba(242,242,242,1);
            .projectL{
                width: 100%;
                height: 229px;
                .leftImg{
                    width: 100%;
                    height: 229px;
                    border-radius: 8px;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: center center;
                }
            }
            .projectR{
                width: 100%;
                .rightHead{
                    margin-top: 14px;
                    padding-bottom: 16px;
                    .projectName{
                        font-size: 16px;
                        line-height: 24px;
                        color: #333333;
                        font-weight:500;
                        margin-bottom: 15px;
                        .text-ellipsis-lines(2)
                    }
                    .totalPrice{
                        .totalPriceL{
                            width: auto;
                            font-size: 12px;
                            line-height: 17px;
                            color: #333333;
                            font-weight: 500;
                        }
                        .totalPriceR{
                            font-size: 16px;
                            line-height: 22px;
                            color: #F04134;
                            font-weight: 500;
                            margin-left: 12px;

                        }
                    }
                }
                .projectData{
                    padding: 12px 0;
                    border-bottom: 1px solid #D8D8D8;
                    .dataItem{
                        width: auto;
                        text-align: center;
                        .itemNum{
                            font-size: 16px;
                            line-height: 32px;
                            margin: 0;
                            color: #F04134;
                            font-weight: 500;
                        }
                        .itemDesc{
                            font-size: 12px;
                            line-height: 17px;
                            color: #999999;
                            margin: 0;
                        }
                    }
                }
                .rightFoot{
                    padding-top: 12px;
                    .footMsg{
                        font-size: 12px;
                        line-height: 17px;
                        margin-bottom: 8px;
                        .msgTitle{
                            color: #999999;
                        }
                        .msgContent{
                            color: #333333;
                            text-align: right;
                            &.blue{
                                color: #2EA9DF;
                            }
                            .shareAddress{
                                margin-bottom: 0;
                                width: 100%;
                                .text-ellipsis();
                            }
                        }
                    }

                    .info-progress{
                        .progress-title{
                            span{
                                &:first-child{
                                    color: #999999;
                                    font-size: 12px;
                                    line-height: 17px;
                                }
                                &:last-child{
                                    color: #333333;
                                    font-size: 12px;
                                    line-height: 12px;
                                }
                            }
                        }
                    }
                    .progressData{
                        margin-top: 20px;
                        .dataItem{
                            width: auto;
                            text-align: center;
                            .itemNum{
                                font-size: 12px;
                                line-height: 12px;
                                margin: 0;
                                color: #333333;
                                font-weight: 500;
                            }
                            .itemDesc{
                                font-size: 12px;
                                line-height: 17px;
                                color: #999999;
                                margin: 5px 0 0;
                            }
                        }
                    }
                    .footBtn{
                        width: 100%;
                        height: 40px;
                        font-size: 16px;
                        margin-top: 16px;
                    }
                }
            }
        }
    }

    /deep/ .ant-progress-inner {
        background-color: rgba(47,170,224,0.2);
    }
</style>

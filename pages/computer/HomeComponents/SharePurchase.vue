<template>
    <div class="shareBox" v-if="listLength !== 0">
        <a-row type="flex" justify="space-between" align="middle" class="shareTitle">
            <a-col :span="6" class="titleL">{{$t('Home.home_title_unitbuy')}}</a-col>
            <a-col :span="3" class="titleR">
                <nuxt-link to="/computer/CertificatePurchase">{{$t('Home.home_btn_more')}} ></nuxt-link>
            </a-col>
        </a-row>
        <section v-for="(item, index) in shareList" :key="index" @click="targetInfo(item.projectId)">
            <a-row type="flex" justify="space-between" align="middle" class="shareProject">
                <div class="icon-contair" :class="{'icon-zh': isZh, 'icon-en': !isZh}" v-show="item.saleRatio === 100"></div>
                <a-col :span="12" class="projectL">
                    <div class="leftImg" :style="{backgroundImage: 'url(/' + item.imgPath + ')'}"></div>
                </a-col>
                <a-col :span="12" class="projectR">
                    <div class="rightHead">
                        <p class="projectName">{{item.name}}</p>
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
    import PtoProgress from '~/components/computer/PtoProgress'
    import {formatNumber} from '~/assets/utils/index'
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
                this.$router.push(`/computer/CertificatePurchase/info/${projectId}`)
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
            PtoProgress
        }
    }
</script>

<style lang="less" scoped>
    /*********售罄********/
    .icon-contair {
        pointer-events: none;
        position: absolute;
        left: 275px;
        top: 110px;
        width: 230px;
        height: 182px;
        z-index: 998;
    }

    .icon-zh {
        background: url("/content/certificatePurchase/230_zh.png");
    }

    .icon-en {
        background: url("/certificatePurchase/230_en.png");
    }
    /*********售罄********/

    .normal {
        /deep/ .ant-progress-inner {
            background-color: #F8DFB6;
        }
    }

    .success {
        /deep/ .ant-progress-inner {
            background-color: #C0EFD3;
        }
    }

    .exception {
        /deep/ .ant-progress-inner {
            background-color: #FEDBD3;
        }
    }

    .active {
        /deep/ .ant-progress-inner {
            background-color: #D5EEF9;
        }
    }

    .info-progress {
        height: 60px;
        width: 100%;

        .pto-progress {
            position: relative;
            padding-top: 3px;

            span {
                font-size:14px;
            }

            /deep/ .ant-progress-text {
                width: auto;
                margin-left: 0;
                display: block;
                font-size:14px;
                float: right;
            }

            .start-circle {
                background-color: transparent;
                width: 8px;
                height: 8px;
                border: 1px solid #ffffff;
                border-radius: 50%;
                position: absolute;
                top: 25px;
                left: 3px;
                z-index: 2;
            }

            .success-circle {
                background: url("/content/certificatePurchase/success.png");
                width: 11px;
                height: 11px;
                position: absolute;
                top: 23px;
                z-index: 3;
            }

            .hot-circle {
                background: url("/certificatePurchase/hot.png");
                width: 12px;
                height: 14px;
                position: absolute;
                top: 2px;
                z-index: 1;
            }

            .hot-sellOutRatio {
                background: url("/content/certificatePurchase/success.png");
                width: 12px;
                height: 12px;
                position: absolute;
                top: 23px;
                z-index: 3;
            }

            .current-circle {
                background:rgba(255,255,255,1);
                width: 8px;
                height: 8px;
                border-radius: 50%;
                position: absolute;
                top: 25px;
                z-index: 2;
            }

            .end-circle {
                background:#FFFFFF;
                opacity: 0.5;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                position: absolute;
                top: 25px;
                right: 0.4%;
                z-index: 1;
            }

            .progress-presale {
                margin-left: 0;
                display: block;
                font-size:12px;
                float: right;
                min-width: 50px;
            }

            .fail-pto-color {
                font-size:12px;
                color: #2EA9DF !important;
            }

            .progress-sellout {
                margin-left: 0;
                display: block;
                font-size:12px;
                float: right;
                width: auto;
                margin-top: -20px;
            }
        }
    }

    .text-ellipsis-lines(@line:2){
        overflow: hidden;
        display: -webkit-box;
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
        width: 1200px;
        margin: 0 auto;
        .shareTitle{
            margin-top: 40px;
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
                a{
                    color: #2EA9DF;
                }
            }
        }
        .shareProject{
            position: relative;
            margin: 28px 0 42px;
            &:hover{
                box-shadow:0 2px 8px 0 rgba(0,0,0,0.15);
                border-radius:8px;
                background-color: #ffffff;
            }
            .projectL{
                width: 637px;
                height: 425px;
                .leftImg{
                    width: 637px;
                    height: 425px;
                    border-radius: 8px;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: center center;
                    background-color: #fff;
                }
            }
            .projectR{
                width: 478px;
                margin-right: 36px;
                .rightHead{
                    border-bottom: 1px solid #D8D8D8;
                    padding-bottom: 14px;
                    .projectName{
                        font-size: 18px;
                        line-height: 22px;
                        color: #222222;
                        font-weight:500;
                        margin-bottom: 0;
                        .text-ellipsis-lines(2)
                    }
                    .totalPrice{
                        .totalPriceL{
                            width: auto;
                            font-size: 14px;
                            line-height: 20px;
                            color: #888888;
                            font-weight: 500;
                        }
                        .totalPriceR{
                            font-size: 18px;
                            line-height: 32px;
                            font-weight: 500;
                            margin-left: 6px;
                            color:rgba(255,52,40,1);
                        }
                    }
                }
                .projectData{
                    padding: 15px 0;
                    border-bottom: 1px solid #D8D8D8;
                    .dataItem{
                        width: auto;
                        text-align: left;
                        .itemNum{
                            margin: 0;
                            font-size:16px;
                            color:rgba(34,34,34,1);
                            line-height:16px;
                        }
                        .itemDesc{
                            font-size: 14px;
                            line-height: 20px;
                            color: #999999;
                            margin: 8px 0 0;
                        }
                    }
                }
                .rightFoot{
                    padding-top: 18px;
                    .footMsg{
                        font-size: 14px;
                        line-height: 17px;
                        margin-bottom: 13px;
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
                        margin-top: 14px;
                        .dataItem{
                            width: auto;
                            text-align: left;
                            .itemNum{
                                font-size: 16px;
                                margin: 0;
                                color: #222222;
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
                        height: 48px;
                        font-size: 20px;
                        margin-top: 32px;
                    }
                }
            }
        }
    }
</style>

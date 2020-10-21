<template>
    <div class="whyBox">
        <div class="whyContent">
            <a-row type="flex" justify="space-between" align="middle" class="contentTitle">
                <a-col :span="12" class="titleL">{{$t('Home.home_why_title_headline')}}</a-col>
                <a-col :span="12" class="titleR">
                    <span style="cursor: pointer;" @click="showDialog = true">{{$t('Home.home_why_btn_conpare')}} ></span>
                </a-col>
            </a-row>
            <a-row type="flex" justify="space-around" align="top" class="contentMain">
                <a-col :span="4" class="mainItem">
                    <img class="itmeIcon" src="/content/homeImgs/whyPtoIcon1.png" alt="">
                    <p class="itemTitle">{{$t('Home.home_why_content_1')}}</p>
                    <p class="itemMsg">{{$t('Home.home_why_tip_1')}}</p>
                </a-col>
                <a-col :span="4" class="mainItem">
                    <img class="itmeIcon" src="/content/homeImgs/whyPtoIcon2.png" alt="">
                    <p class="itemTitle">{{$t('Home.home_why_content_2')}}</p>
                    <p class="itemMsg">{{$t('Home.home_why_tip_2')}}</p>
                </a-col>
                <a-col :span="4" class="mainItem">
                    <img class="itmeIcon" src="/content/homeImgs/whyPtoIcon3.png" alt="">
                    <p class="itemTitle">{{$t('Home.home_why_content_3')}}</p>
                    <p class="itemMsg">{{$t('Home.home_why_tip_3')}}</p>
                </a-col>
                <a-col :span="4" class="mainItem">
                    <img class="itmeIcon" src="/content/homeImgs/whyPtoIcon4.png" alt="">
                    <p class="itemTitle">{{$t('Home.home_why_content_4')}}</p>
                    <p class="itemMsg">{{$t('Home.home_why_tip_4')}}</p>
                </a-col>
                <a-col :span="4" class="mainItem">
                    <img class="itmeIcon" src="/content/homeImgs/whyPtoIcon5.png" alt="">
                    <p class="itemTitle">{{$t('Home.home_why_content_5')}}</p>
                    <p class="itemMsg">{{$t('Home.home_why_tip_5')}}</p>
                </a-col>
            </a-row>
        </div>
        <a-modal
                title=""
                width="650px"
                :zIndex="2000"
                :centered="true"
                :footer="null"
                :maskClosable="false"
                v-model="showDialog">
            <div class="dialogBox">
                <p class="title">{{$t('Home.home_popup_compare_title_re')}}</p>
                <a-table
                        :dataSource="dialogData1"
                        size="middle"
                        :pagination="false"
                        bordered>
                    <a-table-column
                            dataIndex="type"
                            key="1">
                    </a-table-column>
                    <a-table-column
                            :title="$t('Home.home_popup_compare_table_re')"
                            dataIndex="traditionBuy"
                            align="center"
                            key="2">
                    </a-table-column>
                    <a-table-column
                            :title="$t('Home.home_popup_compare_table_ptohome')"
                            dataIndex="PTOHome"
                            align="center"
                            className="dialogTableTitle"
                            key="3">
                        <template slot-scope="text, record">
                            <span slot="title" style="color: #2EA9DF">{{record.PTOHome}}</span>
                        </template>
                    </a-table-column>
                </a-table>
                <p class="title">{{$t('Home.home_popup_compare_title_fin')}}</p>
                <a-table
                        :dataSource="dialogData2"
                        size="middle"
                        :pagination="false"
                        bordered>
                    <a-table-column
                            dataIndex="type"
                            key="1">
                    </a-table-column>
                    <a-table-column
                            :title="$t('Home.home_popup_compare_table_fin')"
                            dataIndex="traditionBuy"
                            align="center"
                            key="2">
                    </a-table-column>
                    <a-table-column
                            :title="$t('Home.home_popup_compare_table_ptohome')"
                            dataIndex="PTOHome"
                            align="center"
                            className="dialogTableTitle"
                            key="3">
                        <template slot-scope="text, record">
                            <span slot="title" style="color: #2EA9DF">{{record.PTOHome}}</span>
                        </template>
                    </a-table-column>
                </a-table>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import {Bus} from '~/assets/utils/bus'

    export default {
        data () {
            return {
                showDialog: false,
                dialogData1: [],
                dialogData2: []
            }
        },
        created () {
            this.reloadTableData()
            this.listenI18n()
        },
        methods: {
            // 更新表格数据
            reloadTableData () {
                this.dialogData1 = [{
                    type: this.$t('Home.home_popup_compare_table_rerow1'),
                    traditionBuy: this.$t('Home.home_popup_compare_table_con1'),
                    PTOHome: this.$t('Home.home_popup_compare_table_con2')
                }, {
                    type: this.$t('Home.home_popup_compare_table_rerow2'),
                    traditionBuy: this.$t('Home.home_popup_compare_table_con4'),
                    PTOHome: this.$t('Home.home_popup_compare_table_con5')
                }, {
                    type: this.$t('Home.home_popup_compare_table_rerow3'),
                    traditionBuy: this.$t('Home.home_popup_compare_table_con6'),
                    PTOHome: this.$t('Home.home_popup_compare_table_con5')
                }, {
                    type: this.$t('Home.home_popup_compare_table_rerow4'),
                    traditionBuy: this.$t('Home.home_popup_compare_table_con2'),
                    PTOHome: this.$t('Home.home_popup_compare_table_con1')
                }]
                this.dialogData2 = [{
                    type: this.$t('Home.home_popup_compare_table_finrow1'),
                    traditionBuy: this.$t('Home.home_popup_compare_table_con1'),
                    PTOHome: this.$t('Home.home_popup_compare_table_con2')
                }, {
                    type: this.$t('Home.home_popup_compare_table_finrow2'),
                    traditionBuy: this.$t('Home.home_popup_compare_table_con3'),
                    PTOHome: this.$t('Home.home_popup_compare_table_con1')
                }, {
                    type: this.$t('Home.home_popup_compare_table_finrow3'),
                    traditionBuy: this.$t('Home.home_popup_compare_table_con7'),
                    PTOHome: this.$t('Home.home_popup_compare_table_con8')
                }, {
                    type: this.$t('Home.home_popup_compare_table_finrow4'),
                    traditionBuy: this.$t('Home.home_popup_compare_table_con9'),
                    PTOHome: this.$t('Home.home_popup_compare_table_con10')
                }, {
                    type: this.$t('Home.home_popup_compare_table_finrow5'),
                    traditionBuy: this.$t('Home.home_popup_compare_table_con2'),
                    PTOHome: this.$t('Home.home_popup_compare_table_con1')
                }]
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.reloadTableData()
                })
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        }
    }
</script>

<style lang="less" scoped>
    .whyBox{
        width: 100%;
        min-height: 300px;
        margin-top: -6px;
        /*background:linear-gradient(89deg,rgba(2,62,109,1) 0%,rgba(65,156,226,1) 100%);*/
        background-color: #232933;
        .whyContent{
            width: 1200px;
            height: auto;
            margin: 0 auto;
            padding: 36px 0;
            box-sizing: border-box;
            .contentTitle{
                color: #ffffff;
                .titleL{
                    font-size: 16px;
                    line-height: 22px;
                }
                .titleR{
                    font-size: 14px;
                    line-height: 20px;
                    text-align: right;
                    /*cursor: pointer;*/
                }
            }
            .contentMain{
                .mainItem{
                    width: 180px;
                    text-align: center;
                    .itmeIcon{
                        width: 66px;
                        margin-top: 32px;
                    }
                    .itemTitle{
                        font-size: 16px;
                        line-height: 22px;
                        color: #ffffff;
                        margin: 20px 0 0;
                        font-weight: 500;
                        letter-spacing: 1px;
                    }
                    .itemMsg{
                        font-size: 12px;
                        line-height: 18px;
                        color: rgba(255,255,255,0.8);
                        margin: 8px 0 0;
                        letter-spacing: 1px;
                    }
                }
            }
        }
    }

    .dialogBox{
        padding: 0 60px 50px;
        .title{
            font-size: 20px;
            line-height: 28px;
            letter-spacing: 1px;
            margin-top: 48px;
            color: #333333;
            text-align: center;
        }
        /deep/.dialogTableTitle{
            color: #2EA9DF!important;
        }
        /deep/.ant-table{
            font-weight: 500!important;
            color: #333333!important;
        }
        /deep/.ant-table-thead > tr > th{
            background-color: #F4F4F4!important;
            border-color: #F4F4F4!important;
        }
        /deep/.ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td{
            background-color: #fff!important;
        }
        /deep/.ant-table-bordered .ant-table-tbody > tr > td:not(:last-child){
            border-right-color: #fff!important;
        }
    }
</style>

<template>
    <div class="whyBox">
        <div class="whyContent">
            <a-row type="flex" justify="space-between" align="middle" class="contentTitle">
                <a-col :span="24" class="title">{{$t('Home.home_why_title_headline')}}</a-col>
            </a-row>
            <a-row type="flex" justify="space-around" align="top" class="contentMain">
                <a-col :span="24" class="mainItem">
                    <img class="itmeIcon" src="/content/homeImgs/whyPtoIcon1.png" alt="">
                    <p class="itemTitle">{{$t('Home.home_why_content_1')}}</p>
                    <p class="itemMsg">{{$t('Home.home_why_tip_1')}}</p>
                </a-col>
                <a-col :span="24" class="mainItem">
                    <img class="itmeIcon" src="/content/homeImgs/whyPtoIcon2.png" alt="">
                    <p class="itemTitle">{{$t('Home.home_why_content_2')}}</p>
                    <p class="itemMsg">{{$t('Home.home_why_tip_2')}}</p>
                </a-col>
                <a-col :span="24" class="mainItem">
                    <img class="itmeIcon" src="/content/homeImgs/whyPtoIcon3.png" alt="">
                    <p class="itemTitle">{{$t('Home.home_why_content_3')}}</p>
                    <p class="itemMsg">{{$t('Home.home_why_tip_3')}}</p>
                </a-col>
                <a-col :span="24" class="mainItem">
                    <img class="itmeIcon" src="/content/homeImgs/whyPtoIcon4.png" alt="">
                    <p class="itemTitle">{{$t('Home.home_why_content_4')}}</p>
                    <p class="itemMsg">{{$t('Home.home_why_tip_4')}}</p>
                </a-col>
                <a-col :span="24" class="mainItem">
                    <img class="itmeIcon" src="/content/homeImgs/whyPtoIcon5.png" alt="">
                    <p class="itemTitle">{{$t('Home.home_why_content_5')}}</p>
                    <p class="itemMsg">{{$t('Home.home_why_tip_5')}}</p>
                </a-col>
            </a-row>
            <p class="contrast" @click="showDialog = true">{{$t('Home.home_why_btn_conpare')}} ></p>
        </div>
        <a-modal
                title=""
                width="83%!important"
                :centered="true"
                :footer="null"
                :maskClosable="false"
                :bodyStyle="{padding:'50px 17px'}"
                v-model="showDialog">
            <div class="dialogBox">
                <p class="title">{{$t('Home.home_popup_compare_title_re')}}</p>
                <a-table
                        style="margin-bottom: 30px;"
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
                            <span slot="title" style="color: #1890ff">{{record.PTOHome}}</span>
                        </template>
                    </a-table-column>
                </a-table>
                <p class="title">{{$t('Home.home_popup_compare_title_fin')}}</p>
                <a-table
                        style="width: 100%;"
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
                            <span slot="title" style="color: #1890ff">{{record.PTOHome}}</span>
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
        margin-top: -6px;
        /*background:linear-gradient(51deg,rgba(2,62,109,1) 0%,rgba(65,156,226,1) 100%);*/
        background-color: #232933;
        .whyContent{
            width: 100%;
            margin: 0 auto;
            padding: 24px 0 36px;
            box-sizing: border-box;
            .contentTitle{
                color: #ffffff;
                .title{
                    font-size: 14px;
                    line-height: 20px;
                    text-align: center;
                }
            }
            .contentMain{
                .mainItem{
                    width: 100%;
                    text-align: center;
                    .itmeIcon{
                        width: 53px;
                        margin-top: 40px;
                    }
                    .itemTitle{
                        font-size: 12px;
                        line-height: 17px;
                        color: #ffffff;
                        margin: 20px 0 0;
                        font-weight: 500;
                        letter-spacing: 1px;
                    }
                    .itemMsg{
                        max-width: 275px;
                        font-size: 12px;
                        line-height: 15px;
                        color: rgba(255,255,255,0.8);
                        margin: 8px auto 0;
                        letter-spacing: 1px;
                    }
                }
            }
            .contrast{
                min-width: 147px;
                height: 30px;
                font-size: 12px;
                line-height: 30px;
                color: #ffffff;
                font-weight: 500;
                text-align: center;
                margin: 32px auto 0;
                padding: 0 26px;
                display: table;
                background:rgba(46,169,223,1);
                border-radius:8px;
            }
        }
    }
    .dialogBox{
        padding: 0 0 50px;
        max-height: 70vh;
        overflow-y: auto;
        .title{
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 1px;
            color: #333333;
            text-align: center;
            font-weight: bold;
        }
        /deep/.dialogTableTitle{
            color: #1890ff!important;
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

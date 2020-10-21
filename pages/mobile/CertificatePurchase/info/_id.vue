<template>
    <a-layout id="components-layout-mobile-top" class="layout" :class="drawer">
        <fs-head :SelectedKey="key"
                 :SelectedType="type"
                 :centerKey="centerKey"
                 @openDrawer="openDrawer"
                 @closeDrawer="closeDrawer"/>
        <section class="section">
            <div class="container">
                <a-layout-content>
                    <Breadcrumb :routes="routes"/>
                    <div class="content">
                        <div>
                            <!--              骨架屏              -->
                            <a-skeleton avatar :loading="loading" active :paragraph="{rows: 20}" class="skeleton-padding"/>
                            <!--             通证详细             -->
                            <a-list itemLayout="vertical"
                                    size="large"
                                    :dataSource="listData"
                                    :locale="{emptyText: ''}">
                                <a-list-item slot="renderItem" slot-scope="item, index" key="item.title"
                                             class="skeleton">
                                    <section v-if="!loading">
                                        <!--      通证名称       -->
                                        <a-list-item-meta>
                                            <template slot="title">
                                                <span class="title">{{item.projectMaterial.name}}</span>
                                            </template>
                                        </a-list-item-meta>
                                        <!--      通证类型       -->
                                        <div class="info-tag">
                                            <a-tag color="blue">{{item.projectBase.projectNatureName}}</a-tag>
                                            <a-tag color="green">{{item.projectBase.projectTypeName}}</a-tag>
                                            <a-tag class="ant-tag-redTag">{{item.projectMaterial.propertyRight}}</a-tag>
                                            <a-tag class="ant-tag-grayTag" :key="index" v-for="(child, index) in item.projectMaterial.projectLabel">{{child}}</a-tag>
                                        </div>
                                        <!--      通证信息       -->
                                        <div class="list-body">
                                            <!--      售罄图标      -->
                                            <div class="icon-contair" v-show="showSalesIcon">
                                                <sell-out :isZh="isZh"/>
                                            </div>
                                            <!--      售罄图标      -->
                                            <a-tag :color="item.issueState === 5 ? '#8C8C8C' : '#2FAAE0'"
                                                   class="tag-state">
                                                {{item.projectBase.i18nState}}
                                            </a-tag>
                                            <div class="total-imgs">
                                                {{currentIndex}}/{{projectMaterialImgs}}
                                            </div>
                                            <!--       走马灯组件       -->
                                            <a-carousel arrows dotsClass="slick-dots slick-thumb" class="fangsea-img"
                                                        :beforeChange="beforeChange" id="carousel">
                                                <div v-for="file in item.projectMaterial.imgs" class="carousel-imgs">
                                                    <video class="video"
                                                           controls="controls"
                                                           controlsList='nodownload noremote footbar'
                                                           :src="file.fileUrl"
                                                           v-if="file.type === 1">
                                                    </video>
                                                    <img :src="file.largeUrl" v-if="file.type !== 1">
                                                </div>
                                            </a-carousel>
                                            <!--      通证坐标       -->
                                            <div class="info-address">
                                                <span v-if="item.projectBase.issueState === 3">
                                                    {{$t('CertificatePurchase.certificatePurchase_distance_end')}}：{{item.projectDist.planEndTime | toCountDown}}
                                                </span>
                                                <span class="title-time projectBase-i18nState" v-else>{{item.projectBase.i18nState}}</span>
                                            </div>
                                            <!--      基本信息       -->
                                            <div class="body-info">
                                                <div class="total-price">
                                                    <span class="item-title">{{$t('CertificatePurchase.ptpurchase_title_totalprice')}}</span>
                                                    <span class="item-value">{{item.projectDist.changeCurPrice | formatNumber}} {{item.projectDist.changeCurCode}}</span>
                                                </div>
                                                <a-divider class="divider-info"/>

                                                <div class="info-item" v-if="item.projectBase.projectType !== 5">
                                                    <span class="item-value red-value">{{item.projectDist.prospectiveYield}}</span>
                                                    <span class="item-title">
                                                        {{$t('CertificatePurchase.ptpurchase_title_annualrental')}}
                                                    </span>
                                                </div>
                                                <div class="info-item" v-if="item.projectBase.projectType !== 5">
                                                    <span class="item-value red-value">{{item.projectMaterial.apartment}}</span>
                                                    <span class="item-title">{{$t('CertificatePurchase.ptpurchase_title_accounttype')}}</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="item-value red-value">{{item.projectMaterial.measure}}㎡</span>
                                                    <span class="item-title">{{$t('CertificatePurchase.ptpurchase_title_area')}}</span>
                                                </div>
                                                <a-divider/>

                                                <div class="broadwise-item">
                                                    <span class="item-title">{{$t('CertificatePurchase.certificatePurchase_item_number')}}</span>
                                                    <span class="item-value projectDist-ptCurCode">{{item.projectDist.ptCurCode}}</span>
                                                </div>
                                                <div class="broadwise-item">
                                                    <span class="item-title">{{$t('CertificatePurchase.ptpurchase_title_itemtype')}}</span>
                                                    <span class="item-value">{{item.projectBase.projectTypeName}}</span>
                                                </div>
                                                <div class="broadwise-item">
                                                    <span class="item-title">{{$t('CertificatePurchase.ptpurchase_title_itemaddress')}}</span>
                                                    <span class="item-value">{{item.projectBase.regionsName | toRegionsName}}</span>
                                                </div>
                                                <!--         通证进度条           -->
                                                <pto-progress class="info-progress"
                                                              :hideTips="nowTips"
                                                              :saleRatio="item.projectBase.saleRatio"
                                                              :successRatio="item.projectBase.successRatio"
                                                              :sellOutRatio="item.projectDistSetting.sellOutRatio"
                                                              :issueState="item.projectBase.issueState"
                                                              :saleableAmount="item.projectDist.totalAmount - item.projectDistSetting.selfAmount"
                                                              :isFail="(item.projectBase.issueState === 2 || item.projectBase.issueState === 3) ? false : true">
                                                </pto-progress>
                                                <div class="info-item">
                                                    <span class="item-value">{{item.projectDistSetting.minimumBuyAmount | formatNumber}}</span>
                                                    <span class="item-title">{{$t('CertificatePurchase.certificatePurchase_item_total')}}</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="item-value">{{item.projectDistSetting.userMinAmount | formatNumber}}</span>
                                                    <span class="item-title">{{$t('CertificatePurchase.certificatePurchase_item_minimum_subscription')}}</span>
                                                </div>
                                                <div class="info-item">
                                                    <span class="item-value">
                                                        {{item.projectDist.totalAmount - item.projectDistSetting.selfAmount | formatNumber}}
                                                    </span>
                                                    <span class="item-title">{{$t('CertificatePurchase.certificatePurchase_remaining_quantity')}}</span>
                                                </div>

                                                <a-divider class="divider-info"/>

                                                <a-button :disabled="listData[0].projectBase.issueState !== 3"
                                                          :loading="flag"
                                                          type="primary"
                                                          block
                                                          class="now-buy" @click="checkKycStatus">
                                                    {{$t('CertificatePurchase.ptpurchase_title_buynow')}}
                                                </a-button>
                                            </div>
                                        </div>
                                    </section>
                                </a-list-item>
                            </a-list>
                            <!--      立即认购       -->
                            <div class="fixed-div" v-if="listData.length !== 0">
                                <div class="title">
                                    {{listData[0].projectDist.ptCurCode}}
                                </div>
                                <div class="body">
                                    <a-row>
                                        <a-col :span="24" class="item red-item">
                                                <span class="item-time">
                                                    {{$t('CertificatePurchase.certificatePurchase_pre_sale_time')}} {{listData[0].projectDist.planStartTime | parseTime('{y}-{m}-{d} {h}:{i}')}} - {{listData[0].projectDist.planEndTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
                                                </span>
                                        </a-col>
                                    </a-row>
                                    <a-row class="mg-bm-8">
                                        <a-col :span="24" class="item">
                                            <span class="item-key" style="width: 115px">
                                                {{$t('CertificatePurchase.certificatePurchase_risk_rating')}}
                                                <a-popover placement="right">
                                                    <template slot="content">
                                                        <p v-if="listData[0].projectExamine.ventureCapitalLevel === 'S1'">S1: {{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_desc1')}}</p>
                                                        <p v-if="listData[0].projectExamine.ventureCapitalLevel === 'S2'">S2: {{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_desc2')}}</p>
                                                        <p v-if="listData[0].projectExamine.ventureCapitalLevel === 'S3'">S3: {{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_desc3')}}</p>
                                                        <p v-if="listData[0].projectExamine.ventureCapitalLevel === 'S4'">S4: {{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_desc4')}}</p>
                                                        <p @click="showDialog = true" class="more">{{$t('CertificatePurchase.ptpurchase_tip_risk_rating_more')}}</p>
                                                    </template>
                                                    <a-icon type="info-circle"/>
                                                </a-popover>
                                            </span>
                                            <span class="item-value projectDist-curCode" v-if="listData[0].projectExamine.ventureCapitalLevel === 'S1'">
                                                    {{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type1')}}
                                                </span>
                                            <span class="item-value projectDist-curCode" v-if="listData[0].projectExamine.ventureCapitalLevel === 'S2'">
                                                    {{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type2')}}
                                                </span>
                                            <span class="item-value projectDist-curCode" v-if="listData[0].projectExamine.ventureCapitalLevel === 'S3'">
                                                    {{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type3')}}
                                                </span>
                                            <span class="item-value projectDist-curCode" v-if="listData[0].projectExamine.ventureCapitalLevel === 'S4'">
                                                    {{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type4')}}
                                                </span>
                                        </a-col>
                                    </a-row>
                                    <a-row class="mg-bm-8">
                                        <a-col :span="24" class="item">
                                            <span class="item-key certificatePurchase-issue-price">
                                                {{$t('CertificatePurchase.certificatePurchase_issue_price')}}
                                                <a-tooltip placement="right"
                                                           :title="$t('CertificatePurchase.ptpurchase_tip_issueprice')">
                                                    <a-icon type="info-circle"/>
                                                </a-tooltip>
                                            </span>
                                            <span class="item-value projectBase-convertPrice">
                                                {{listData[0].projectBase.convertPrice}}{{listData[0]. projectDist.curCode}}/{{$t('CertificatePurchase.certificatePurchase_portion')}}
                                            </span>
                                        </a-col>
                                    </a-row>
                                    <a-row class="mg-bm-8">
                                        <a-col :span="24" class="item">
                                            <span class="item-key">{{$t('CertificatePurchase.certificatePurchase_market_evaluation')}}
                                                <a-tooltip placement="right"
                                                           :title="$t('CertificatePurchase.ptpurchase_tip_evalprice')">
                                                    <a-icon type="info-circle"/>
                                                </a-tooltip>
                                            </span>
                                            <span class="item-value">
                                                {{listData[0].projectExamine.changeCurPrice | formatNumber}} {{listData[0].projectExamine.changeCurCode}}
                                            </span>
                                        </a-col>
                                    </a-row>
                                    <a-row class="mg-bm-8">
                                        <a-col :span="24" class="item">
                                            <span class="item-key">{{$t('CertificatePurchase.certificatePurchase_pts_total')}}
                                                <a-tooltip placement="right"
                                                           :title="$t('CertificatePurchase.ptpurchase_tip_ptamount')">
                                                    <a-icon type="info-circle"/>
                                                </a-tooltip>
                                            </span>
                                            <span class="item-value">{{listData[0].projectDist.totalAmount | formatNumber}}</span>
                                        </a-col>
                                    </a-row>
                                    <a-row class="mg-bm-8">
                                        <a-col :span="24" class="item">
                                            <span class="item-key">{{$t('CertificatePurchase.certificatePurchase_maximum_number_subscriptions')}}
                                                <a-tooltip placement="right" :title="$t('CertificatePurchase.ptpurchase_tip_maxmum')">
                                                    <a-icon type="info-circle"/></a-tooltip>
                                            </span>
                                            <span class="item-value">{{listData[0].projectDistSetting.userMaxAmount | formatNumber}}</span>
                                        </a-col>
                                    </a-row>
                                    <a-row class="mg-bm-8">
                                        <a-col :span="24" class="item">
                                            <span class="item-key">{{$t('CertificatePurchase.ptpurchase_issuer_information')}}
                                                <a-tooltip placement="right"
                                                           :title="$t('CertificatePurchase.ptpurchase_tip_issuerinfo')">
                                                    <a-icon type="info-circle"/>
                                                </a-tooltip>
                                            </span>
                                            <span
                                                class="item-value span-text-overflow projectIssuer-issuerName" >{{listData[0].projectIssuer.issuerName}}
                                            </span>
                                        </a-col>
                                    </a-row>
                                </div>
                            </div>
                            <a-divider class="divider-info"/>
                            <!--      tabs导航       -->
                            <a-tabs v-if="listData.length !== 0"
                                    :class="{'isFixed': searchBarFixed}"
                                    id="tabsAnthor"
                                    :tabBarGutter="24"
                                    :activeKey="activeKey"
                                    @change="changeTabs">
                                <a-tab-pane :tab="$t('CertificatePurchase.ptpurchase_essential_information')" key="1"/>
                                <a-tab-pane :tab="$t('CertificatePurchase.certificatePurchase_item_publicinfor')" key="8" v-if="showPublicInfo"/>
                                <a-tab-pane :tab="$t('CertificatePurchase.certificatePurchase_item_information')" key="2"/>
                                <a-tab-pane :tab="$t('CertificatePurchase.certificatePurchase_rule_business')" key="3"/>
                                <a-tab-pane :tab="$t('CertificatePurchase.certificatePurchase_items_file')" key="5"/>
                                <a-tab-pane :tab="$t('CertificatePurchase.certificatePurchase_subscription_information')" key="7" v-if="data.length !== 0"/>
                            </a-tabs>
                            <div v-if="listData.length !== 0" class="tabs-contair">
                                <!--      基本信息       -->
                                <div class="tags-title" id="anthor1">
                                    {{$t('CertificatePurchase.ptpurchase_essential_information')}}
                                </div>
                                <div class="title-info">
                                    <a-row class="mg-bm-8">
                                        <a-col :span="24" class="mg-bm-8">
                                            <span class="item-key">{{$t('CertificatePurchase.ptpurchase_title_itemtype')}}：</span>
                                            <span class="item-value">{{listData[0].projectBase.projectTypeName}}</span>
                                        </a-col>
                                        <a-col :span="24" class="mg-bm-8">
                                            <span class="item-key">{{$t('CertificatePurchase.certificatePurchase_ptos_number')}}：</span>
                                            <span class="item-value">{{listData[0].projectDist.totalAmount | formatNumber}}</span>
                                        </a-col>
                                        <a-col :span="24" class="mg-bm-8">
                                            <span class="item-key">{{$t('CertificatePurchase.ptpurchase_title_area')}}：</span>
                                            <span class="item-value">{{listData[0].projectMaterial.measure}}㎡</span>
                                        </a-col>
                                        <a-col :span="24" class="mg-bm-8">
                                            <span class="item-key">{{$t('CertificatePurchase.certificatePurchase_project_properties')}}：</span>
                                            <span class="item-value">{{listData[0].projectBase.projectNatureName}}</span>
                                        </a-col>
<!--                                        <a-col :span="24" class="mg-bm-8"><span class="item-key">{{$t('CertificatePurchase.certificatePurchase_financial_period')}}：</span><span class="item-value">360{{$t('CertificatePurchase.certificatePurchase_day')}}</span>-->
<!--                                        </a-col>-->
                                        <a-col :span="24" class="mg-bm-8">
                                            <span class="item-key">{{$t('CertificatePurchase.ptpurchase_property_right')}}：</span>
                                            <span class="item-value span-todo">{{listData[0].projectMaterial.propertyRight}}</span>
                                        </a-col>
                                        <a-col :span="24" class="mg-bm-8">
                                            <span class="item-key">{{$t('CertificatePurchase.certificatePurchase_developer')}}：</span>
                                            <span class="item-value span-todo">{{listData[0].projectIssuer.issuerName}}</span>
                                        </a-col>
                                        <a-col :span="24" class="mg-bm-8">
                                            <span class="item-key">{{$t('CertificatePurchase.certificatePurchase_details_address')}}：</span>
                                            <span class="item-value projectMaterial-address">{{listData[0].projectMaterial.address}}</span>
                                        </a-col>
                                    </a-row>
                                </div>
                                <!--      公示信息       -->
                                <div class="tags-title" id="anthor8" v-if="showPublicInfo">
                                    {{$t('CertificatePurchase.certificatePurchase_item_publicinfor')}}
                                </div>
                                <div class="title-info title-info-html" v-if="showPublicInfo">
                                    <a-row class="mg-bm-8">
                                        <a-col :span="24" class="theme-img">
                                            <div v-html="publicInfo" class="projectMaterial-introduce"></div>
                                        </a-col>
                                    </a-row>
                                </div>
                                <!--      项目信息       -->
                                <div class="tags-title" id="anthor2">
                                    {{$t('CertificatePurchase.certificatePurchase_item_information')}}
                                </div>
                                <div class="title-info title-info-html">
                                    <a-row class="mg-bm-8">
                                        <a-col :span="24" class="theme-img">
                                            <div v-html="listData[0].projectMaterial.introduce" class="projectMaterial-introduce"></div>
                                        </a-col>
                                    </a-row>
                                </div>
                                <!--      交易规则       -->
                                <div class="tags-title" id="anthor3">
                                    {{$t('CertificatePurchase.certificatePurchase_rule_business')}}
                                </div>
                                <div class="title-info">
                                    <a-row class="mg-bm-8">
                                        <div v-if="listData[0].projectBase.projectNature !== 8">
                                            <a-col :span="24">
                                                <span class="item-key rule-body rule-body-title">
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement')}}
                                                </span>
                                            </a-col>
                                            <a-col :span="24" class="mg-bm-8">
                                                <span class="item-key rule-body">
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info1')}}
                                                </span>
                                                <span class="item-key rule-body" >
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info2')}}
                                                </span>
                                                <span class="item-key rule-body" >
                                                    {{certificatePurchase_investment_statement_info3}}
                                                </span>
                                                <span class="item-key rule-body" >
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info4')}}
                                                </span>
                                                <span class="item-key rule-body" >
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info5')}}
                                                </span>
                                                <span class="item-key rule-body" >
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info6')}}
                                                </span>
                                                <span class="item-key rule-body" >
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info7')}}
                                                </span>
                                                <span class="item-key rule-body" >
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info8')}}
                                                </span>
                                                <span class="item-key rule-body" >
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info9')}}
                                                </span>
                                                <span class="item-key rule-body" >
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info10')}}
                                                </span>
                                            </a-col>
                                        </div>


                                        <a-col :span="24">
                                            <span class="item-key rule-body rule-body-title">
                                                {{$t('CertificatePurchase.certificatePurchase_rule_buy_offtake')}}
                                            </span>
                                        </a-col>
                                        <a-col :span="24" class="mg-bm-8">
                                            <span class="item-key rule-body">
                                                {{$t('CertificatePurchase.certificatePurchase_rule_buy_offtake_info1')}}
                                            </span>
                                            <span class="item-key rule-body">
                                                {{certificatePurchase_rule_buy_offtake_info2}}
                                            </span>
                                            <span class="item-key rule-body">
                                                {{certificatePurchase_rule_buy_offtake_info3}}
                                            </span>
                                            <span class="item-key rule-body">
                                                {{$t('CertificatePurchase.certificatePurchase_rule_buy_offtake_info4')}}
                                            </span>
                                            <span class="item-key rule-body">
                                                {{$t('CertificatePurchase.certificatePurchase_rule_buy_offtake_info5')}}
                                            </span>
                                        </a-col>
                                        <div v-if="listData[0].projectBase.projectNature !== 8">
                                            <a-col :span="24">
                                                <span class="item-key rule-body rule-body-title">
                                                    {{$t('CertificatePurchase.certificatePurchase_rule_income')}}
                                                </span>
                                            </a-col>
                                            <a-col :span="24" class="mg-bm-8">
                                                <span class="item-key rule-body">
                                                    {{$t('CertificatePurchase.certificatePurchase_rule_income_info1')}}
                                                </span>
                                                <span class="item-key rule-body">
                                                    {{$t('CertificatePurchase.certificatePurchase_rule_income_info2')}}
                                                </span>
                                                <span class="item-key rule-body">
                                                    {{$t('CertificatePurchase.certificatePurchase_rule_income_info3')}}
                                                </span>
                                            </a-col>
                                        </div>
                                        <a-col :span="24">
                                            <span class="item-key rule-body rule-body-title" v-if="listData[0].projectBase.projectNature !== 8">
                                                {{$t('CertificatePurchase.certificatePurchase_rule_offtake')}}
                                            </span>
                                            <span class="item-key rule-body rule-body-title" v-else>
                                                {{$t('CertificatePurchase.certificatePurchase_rule_offtake2')}}
                                            </span>
                                        </a-col>
                                        <a-col :span="24" class="mg-bm-8">
                                            <span class="item-key rule-body">
                                                {{$t('CertificatePurchase.certificatePurchase_rule_offtake_info1')}}
                                            </span>
                                            <span class="item-key rule-body" >
                                                {{$t('CertificatePurchase.certificatePurchase_rule_offtake_info2')}}
                                            </span>
                                        </a-col>
                                    </a-row>
                                </div>
                                <!--      项目文件       -->
                                <div class="tags-title" id="anthor5">
                                    {{$t('CertificatePurchase.certificatePurchase_items_file')}}
                                </div>
                                <div class="title-info shadowDown-parent certificatePurchase-after-view-file">
                                    <div class="shadowDown" v-if="!isLogin">
                                        <div>
                                            <a href="javascript:;" @click="toLogin">
                                                <span>{{$t('CertificatePurchase.certificatePurchase_login')}}</span>
                                            </a>
                                            {{$t('CertificatePurchase.certificatePurchase_after_view_file')}}
                                        </div>
                                    </div>
                                    <!--      文件组件      -->
                                    <div class="files-contair">
                                        <files-down v-if="files.licenseImg.length !== 0"
                                                    :files="files.licenseImg"
                                                    :name="'files.files_developer_business_license'"/>
                                        <files-down v-if="files.houseCertificateImg.length !== 0"
                                                    :files="files.houseCertificateImg"
                                                    :name="'files.files_ownership_certificate'"/>
                                        <files-down v-if="files.eiaImg.length !== 0"
                                                    :files="files.eiaImg"
                                                    :name="'files.files_eia'"/>
                                        <files-down v-if="files.buildingPermitsImg.length !== 0"
                                                    :files="files.buildingPermitsImg"
                                                    :name="'files.files_building_permit'"/>
                                        <files-down v-if="files.landCertificateImg.length !== 0"
                                                    :files="files.landCertificateImg"
                                                    :name="'files.files_land_title'"/>
                                        <files-down v-if="files.landContractImg.length !== 0"
                                                    :files="files.landContractImg"
                                                    :name="'files.files_land_purchase_agreement'"/>
                                        <files-down v-if="files.landMasterImg.length !== 0"
                                                    :files="files.landMasterImg"
                                                    :name="'files.files_landlord_details'"/>
                                        <files-down v-if="files.installmentImg.length !== 0"
                                                    :files="files.installmentImg"
                                                    :name="'files.files_land_payment_details'"/>
                                        <files-down v-if="files.lawFirmSurveyImg.length !== 0"
                                                    :files="files.lawFirmSurveyImg"
                                                    :name="'files.files_due_diligence_report'"/>
                                        <files-down v-if="files.intermediarySurveyImg.length !== 0"
                                                    :files="files.intermediarySurveyImg"
                                                    :name="'files.files_valuation_report'"/>
                                        <files-down v-if="files.propertyCertificateImg.length !== 0"
                                                    :files="files.propertyCertificateImg"
                                                    :name="'files.files_property_license'"/>
                                        <files-down v-if="files.agreementImg.length !== 0"
                                                    :files="files.agreementImg"
                                                    :name="'files.files_general_certificate'"/>
                                        <files-down v-if="files.otherFile.length !== 0"
                                                    :files="files.otherFile"
                                                    :name="'files.files_otherFile'"/>
                                    </div>
                                </div>
                                <!--        认购信息       -->
                                <template v-if="data.length !== 0">
                                    <div class="tags-title" id="anthor7">
                                        {{$t('CertificatePurchase.certificatePurchase_subscription_information')}}
                                    </div>
                                    <div class="title-info shadowDown-parent">
                                        <div class="shadowDown" v-if="!isLogin">
                                            <div>
                                                <a href="javascript:;" @click="toLogin">
                                                    <span>{{$t('CertificatePurchase.certificatePurchase_login')}}</span>
                                                </a>
                                                {{$t('CertificatePurchase.certificatePurchase_after_view_data')}}
                                            </div>
                                        </div>
                                        <a-table :columns="columns" :dataSource="data" :pagination="pagination" :scroll="{x: 500}" :locale="{emptyText: $t('NoData.NoData_table')}">
                                            <template slot="ptTotalAmount" slot-scope="ptTotalAmount">{{ptTotalAmount | formatNumberOrHide(isLogin)}}</template>
                                            <template slot="curAmount" slot-scope="curAmount">{{curAmount | formatNumberOrHide(isLogin)}}</template>
                                            <template slot="saleTime" slot-scope="saleTime">{{saleTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</template>
                                        </a-table>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </a-layout-content>
            </div>
        </section>
        <fonter/>
        <div class="shadow" v-if="isShow"></div>
        <a-modal
                :zIndex="2000"
                :centered="true"
                :footer="null"
                :maskClosable="false"
                wrapClassName="ptpurchase-risk"
                v-model="showDialog">
            <div class="dialogBox">
                <p class="title">{{$t('CertificatePurchase.ptpurchase_tip_risk_rating_title')}}</p>
                <a-table
                        :dataSource="dialogData1"
                        size="middle"
                        :pagination="false">
                    <a-table-column
                            width="50px"
                            dataIndex="type"
                            align="center"
                            key="1">
                        <template slot-scope="text, record, index">
                            <div slot="title" v-show="index === 0" class="type">{{record.type}}</div>
                            <div slot="title" v-show="index === 1" class="type">{{record.type}}</div>
                            <div slot="title" v-show="index === 2" class="type">{{record.type}}</div>
                            <div slot="title" v-show="index === 3" class="type" >{{record.type}}</div>
                        </template>
                    </a-table-column>
                    <a-table-column
                            :title="$t('CertificatePurchase.ptpurchase_tip_risk_rating_th1')"
                            width="50px"
                            dataIndex="income"
                            align="center"
                            key="2">
                        <template slot-scope="text, record, index">
                            <div slot="income" v-show="index === 0" class="type">{{record.income}}</div>
                            <div slot="income" v-show="index === 1" class="type">{{record.income}}</div>
                            <div slot="income" v-show="index === 2" class="type">{{record.income}}</div>
                            <div slot="income" v-show="index === 3" class="type" >{{record.income}}</div>
                        </template>
                    </a-table-column>
                    <a-table-column
                            :title="$t('CertificatePurchase.ptpurchase_tip_risk_rating_th2')"
                            dataIndex="property"
                            align="center"
                            key="3">
                        <template slot-scope="text, record, index">
                            <div slot="property" v-show="index === 0" class="type">{{record.property}}</div>
                            <div slot="property" v-show="index === 1" class="type">{{record.property}}</div>
                            <div slot="property" v-show="index === 2" class="type">{{record.property}}</div>
                            <div slot="property" v-show="index === 3" class="type" >{{record.property}}</div>
                        </template>
                    </a-table-column>
                    <a-table-column
                            :title="$t('CertificatePurchase.ptpurchase_tip_risk_rating_th3')"
                            dataIndex="capital"
                            align="center"
                            key="4">
                        <template slot-scope="text, record, index">
                            <div slot="capital" v-show="index === 0" class="type">{{record.capital}}</div>
                            <div slot="capital" v-show="index === 1" class="type">{{record.capital}}</div>
                            <div slot="capital" v-show="index === 2" class="type">{{record.capital}}</div>
                            <div slot="capital" v-show="index === 3" class="type" >{{record.capital}}</div>
                        </template>
                    </a-table-column>
                </a-table>
                <div class="type-desc">
                    <p>
                        <span>S1: </span><span class="value">{{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_desc1')}}</span>
                    </p>
                    <p >
                        <span>S2: </span><span class="value">{{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_desc2')}}</span>
                    </p>
                    <p >
                        <span>S3: </span><span class="value">{{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_desc3')}}</span>
                    </p>
                    <p >
                        <span>S4: </span><span class="value">{{$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_desc4')}}</span>
                    </p>
                </div>
            </div>
        </a-modal>
    </a-layout>
</template>

<script>
    import {toCountDown, toRegionsName, formatNumber, parseTime} from '~/assets/utils/index'
    import PtoProgress from '~/components/mobile/PtoProgress'
    import Breadcrumb from '~/components/mobile/Breadcrumb'
    import FsHead from '~/components/mobile/FangseaHeader'
    import FilesDown from '~/components/mobile/FilesDown'
    import SellOut from '~/components/mobile/SellOut'
    import fonter from '~/components/mobile/Footer'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import download from 'ly-downloader'
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'
    import jquery from 'jquery'

    export default {
        /**
         * 服务端渲染
         * @param params 项目ID
         * @returns {{pagination, data: Array, showPublicInfo: boolean, publicInfo: string}}
         */
        asyncData ({req, params}) {
            if (process.server) {
                let _params = params
                /**
                 * 用户购买历史
                 */
                let p1 = new Promise((resolve, reject) => {
                    let pageData = {
                        traceId: tool.UUID(),
                        data: {
                            pageNum: 1,
                            pageSize: 10,
                            filter: {
                                projectId: _params.id
                            }
                        }
                    }
                    axios.post(`${tool.getAddress(req)}/pto/invest/project/list`, pageData)
                        .then(res => {
                            resolve(res)
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
                /**
                 * 公示信息
                 */
                let p2 = new Promise((resolve, reject) => {
                    let params = {
                        traceId: tool.UUID(),
                        data: {
                            projectId: _params.id
                        }
                    }
                    axios.post(`${tool.getAddress(req)}/pto/project/publicity/get`, params)
                        .then(res => {
                            resolve(res)
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
                let data = []
                let pagination = {}
                let publicInfo = ''
                let showPublicInfo = false
                return Promise.all([p1, p2]).then((array) => {
                    if (array[0].data.code.toString() === '0') {
                        data = array[0].data.data.list
                        pagination.total = array[0].data.data.total
                        pagination.pageSize = 10
                    }
                    if (array[1].data.code.toString() === '0' && array[1].data.data) {
                        let r = array[1].data.data.publicContent.replace(/\s*/g, '')
                        r = r.replace(/<p><\/p>/g, '')
                        if (r.length !== 0) {
                            showPublicInfo = true
                        }
                        publicInfo = array[1].data.data.publicContent
                    }
                    return {data, pagination, publicInfo, showPublicInfo}
                })
            } else {
                let data = []
                let pagination = {
                    pageSize: 10,
                    total: 0
                }
                let publicInfo = ''
                let showPublicInfo = false
                return {data, pagination, publicInfo, showPublicInfo}
            }
        },
        /* eslint */
        data () {
            return {
                // 产品对比
                showDialog: false,
                // 对比数据
                dialogData1: [],
                // 是否登录
                isLogin: false,
                // 登录、注册导航下标
                type: 0,
                // 首页导航下标
                key: 3,
                // 用户中心导航下标
                centerKey: 0,
                // 正在进行是否隐藏Tips
                nowTips: false,
                // 抽屉切换动画
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 面包屑数据
                routes: [],
                // 显示骨架屏
                loading: true,
                // 详情数据
                listData: [],
                // 立即认购等待
                flag: false,
                // 当前图片下标
                currentIndex: 1,
                // 进度条状态颜色
                strokeColorNormal: '#2FAAE0',
                strokeColorError: '#D9D9D9',
                // 当前项目ID
                projectId: 0,
                // 是否吸顶
                searchBarFixed: false,
                // 当前选中的tabs key
                activeKey: '1',
                // tabs锚点
                tabsAnthor: 0,
                // 悬浮窗口
                fixedDiv: 0,
                // 国际化参数
                globalarr: [],
                // 交易规则内容动态
                certificatePurchase_rule_buy_offtake_info2: '',
                certificatePurchase_rule_buy_offtake_info3: '',
                certificatePurchase_investment_statement_info3: '',
                // 是否显示遮罩层
                isShow: false,
                // 是否可用动画
                isAnimation: true,
                // 表格数据
                data: [],
                // 表格头数据
                columns: [],
                // 分页组件
                pagination: {
                    onChange: (currentPage) => {
                        this.current = currentPage
                        this.buyHistory()
                    },
                    pageSize: 10,
                    total: 0
                },
                // 初始页码
                current: 1,
                // 初始总数
                total: 0,
                // 分页
                pageSize: 10,
                // 错误提示信息
                errorMsg: '',
                // 售罄图标是否是中文
                isZh: true,
                // 是否显示售罄图标
                showSalesIcon: false,
                // 公示信息
                publicInfo: '',
                // 显示公示信息
                showPublicInfo: true,
                /**
                 * 资料类别-中英文对照及排序：
                 * 1、开发商营业执照 DEVELOPER BUSINESS LICENSE
                 * 2、产权证 OWNERSHIP CERTIFICATE
                 * 3、EIA EIA
                 * 4、建筑许可证 BUILDING PERMIT
                 * 5、土地证 LAND TITLE
                 * 6、土地购买合同 LAND PURCHASE AGREEMENT
                 * 7、土地地主资料 LANDLORD DETAILS
                 * 8、分期付款资料 LAND PAYMENT DETAILS
                 * 9、律所尽调报告 DUE DILIGENCE REPORT
                 * 10、市场评估报告 VALUATION REPORT
                 * 11、物业运营商执照 PROPERTY MANAGER CERTIFICATE
                 * 12、房产通证发行协议 PROPERTY TOKENISATION AGREEMENT
                 * 13、其他 OTHERS （不仅限于文本）
                 */
                files: {
                    // * 1、开发商营业执照
                    licenseImg: [],
                    // * 2、产权证
                    houseCertificateImg: [],
                    // * 3、EIA
                    eiaImg: [],
                    // * 4、建筑许可证
                    buildingPermitsImg: [],
                    // * 5、土地证
                    landCertificateImg: [],
                    // * 6、土地购买合同
                    landContractImg: [],
                    // * 7、土地地主资料
                    landMasterImg: [],
                    // * 8、分期付款资料
                    installmentImg: [],
                    // * 9、律所尽调报告
                    lawFirmSurveyImg: [],
                    // * 10、市场评估报告
                    intermediarySurveyImg: [],
                    // * 11、物业运营商执照
                    propertyCertificateImg: [],
                    // * 12、房产通证发行协议
                    agreementImg: [],
                    // * 13、其他
                    otherFile: []
                },
                // 走马灯数量
                projectMaterialImgs: 0,
                // 是否显示视频
                showVideo: false
            }
        },
        created () {
            if (process.client) {
                this.getProjectId()
                this.setIconI18n()
                this.listenI18n()
                this.initBreadcrumb()
                this.reloadTableData()
                this.pagination.onChange = (currentPage) => {
                    this.current = currentPage
                    this.buyHistory()
                }
                if (this.data.length === 0) {
                    this.buyHistory()
                }
                if (this.publicInfo === '') {
                    this.getPublicInfor()
                }
            }
        },
        mounted () {
            this.documentTitleI18n()
            this.checkAndroid()
        },
        methods: {
            // 判断是否是安卓QQBrowser
            checkAndroid () {
                let explorer = navigator.userAgent.toLowerCase()
                if (explorer.indexOf('android') > -1) {
                    if (explorer.indexOf('firefox') >= 0) {
                        // 火狐浏览器
                        let regStrFf = /firefox\/[\d.]+/gi
                        let browser = explorer.match(regStrFf)
                        let verinfo = (browser + '').replace(/[^0-9.]/ig, '')
                        let end = verinfo.indexOf('.')
                        verinfo = verinfo.substring(0, end)
                        if (parseInt(verinfo) > 68) {
                            this.showVideo = true
                        }
                    } else if (explorer.indexOf('qqbrowser') >= 0) {
                        // QQ浏览器
                        this.showVideo = false
                    } else if (explorer.indexOf('chrome') >= 0) {
                        // 谷歌浏览器
                        let regStrChrome = /chrome\/[\d.]+/gi
                        let browser = explorer.match(regStrChrome)
                        let verinfo = (browser + '').replace(/[^0-9.]/ig, '')
                        let end = verinfo.indexOf('.')
                        verinfo = verinfo.substring(0, end)
                        if (parseInt(verinfo) > 62) {
                            this.showVideo = true
                        }
                    } else if (explorer.indexOf('msie') >= 0) {
                        // IE
                        let regStrIe = /msie [\d.]+;/gi
                        let browser = explorer.match(regStrIe)
                        let verinfo = (browser + '').replace(/[^0-9.]/ig, '')
                        let end = verinfo.indexOf('.')
                        verinfo = verinfo.substring(0, end)
                        if (parseInt(verinfo) >= 10) {
                            this.showVideo = true
                        }
                    } else if (explorer.indexOf('edge') >= 0) {
                        // Edge
                        let regStrIe = /edge [\d.]+;/gi
                        let browser = explorer.match(regStrIe)
                        let verinfo = (browser + '').replace(/[^0-9.]/ig, '')
                        let end = verinfo.indexOf('.')
                        verinfo = verinfo.substring(0, end)
                        if (parseInt(verinfo) >= 12) {
                            this.showVideo = true
                        }
                    } else if (explorer.indexOf('blackberry') >= 0) {
                        // BlackBerry
                        let regStrIe = /blackberry\/[\d.]+/gi
                        let browser = explorer.match(regStrIe)
                        let verinfo = (browser + '').replace(/[^0-9.]/ig, '')
                        let end = verinfo.indexOf('.')
                        verinfo = verinfo.substring(0, end)
                        if (parseInt(verinfo) >= 10.3) {
                            this.showVideo = true
                        }
                    } else if (explorer.indexOf('opera') >= 0) {
                        // opera浏览器
                        let regStrOpera = /opera\/[\d.]+/gi
                        let browser = explorer.match(regStrOpera)
                        let verinfo = (browser + '').replace(/[^0-9.]/ig, '')
                        let end = verinfo.indexOf('.')
                        verinfo = verinfo.substring(0, end)
                        if (parseInt(verinfo) >= 12.1) {
                            this.showVideo = true
                        }
                    } else if (explorer.indexOf('samsung') >= 0) {
                        // Samsung
                        let regStrOpera = /samsung\/[\d.]+/gi
                        let browser = explorer.match(regStrOpera)
                        let verinfo = (browser + '').replace(/[^0-9.]/ig, '')
                        let end = verinfo.indexOf('.')
                        verinfo = verinfo.substring(0, end)
                        if (parseInt(verinfo) >= 2) {
                            this.showVideo = true
                        }
                    } else if (explorer.indexOf('se 2.x') >= 0) {
                        // 搜狗浏览器
                        this.showVideo = true
                    } else {
                        this.showVideo = false
                    }
                } else {
                    this.showVideo = true
                }
                this.initInfo()
            },
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
            // 更新表格数据
            reloadTableData () {
                this.dialogData1 = [{
                    type: 'S1',
                    income: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td2'),
                    property: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td1'),
                    capital: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td1')
                }, {
                    type: 'S2',
                    income: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td4'),
                    property: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td3'),
                    capital: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td2')
                }, {
                    type: 'S3',
                    income: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td6'),
                    property: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td4'),
                    capital: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td4')
                }, {
                    type: 'S4',
                    income: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td7'),
                    property: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td5'),
                    capital: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td6')
                }]
            },
            // 页面标题国际化
            documentTitleI18n () {
                if (sessionStorage.getItem('info_projectname')) {
                    document.title = tool.intervariable(this.$t('PageTitle.passpurdetail_pagetitle'), [sessionStorage.getItem('info_projectname')])
                }
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.getPublicInfor()
                    this.setIconI18n()
                    this.reloadTableData()
                })
            },
            /**
             * 初始化面包屑国际化
             */
            initBreadcrumb () {
                this.routes = [{
                    path: '/mobile',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_home')
                }, {
                    path: '/mobile/CertificatePurchase',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts')
                }, {
                    path: '/mobile/CertificatePurchase/info',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts_info')
                }]
            },
            /**
             * 走马灯
             * 切换主图片改变小图标位置
             * @param from 上一个图片
             * @param to 下一个图片
             */
            beforeChange (from, to) {
                this.currentIndex = to + 1
            },
            /**
             * tabs点击切换锚点
             * @param activeKey tabs 当前下标
             */
            changeTabs (activeKey) {
                this.isShow = true
                this.activeKey = activeKey
                switch (activeKey) {
                case '1' :
                    let anthor1 = document.querySelector('#anthor1').offsetTop - 5
                    this.scrollAnimation(anthor1)
                    break
                case '2' :
                    let anthor2 = document.querySelector('#anthor2').offsetTop - 60
                    this.scrollAnimation(anthor2)
                    break
                case '3' :
                    let anthor3 = document.querySelector('#anthor3').offsetTop - 60
                    this.scrollAnimation(anthor3)
                    break
                case '4' :
                    let anthor4 = document.querySelector('#anthor4').offsetTop - 60
                    this.scrollAnimation(anthor4)
                    break
                case '5' :
                    let anthor5 = document.querySelector('#anthor5').offsetTop - 60
                    this.scrollAnimation(anthor5)
                    break
                case '6' :
                    let anthor6 = document.querySelector('#anthor6').offsetTop - 60
                    this.scrollAnimation(anthor6)
                    break
                case '7' :
                    let anthor7 = document.querySelector('#anthor7').offsetTop - 95
                    this.scrollAnimation(anthor7)
                    break
                case '8' :
                    let anthor8 = document.querySelector('#anthor8').offsetTop - 60
                    this.scrollAnimation(anthor8)
                    break
                }
            },
            /**
             * 锚点滚动动画
             * @param targetPageY 滚动至
             */
            scrollAnimation (targetPageY) {
                jquery('html,body').animate({scrollTop: targetPageY}, 500)
                let _this = this
                setTimeout(() => {
                    _this.isShow = false
                }, 500)
            },
            /**
             * 操作锚点
             */
            handleScroll () {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                // tabs吸顶
                this.searchBarFixed = scrollTop > this.tabsAnthor
                if (scrollTop >= (document.querySelector('#anthor1').offsetTop)) {
                    this.activeKey = '1'
                    if (document.querySelector('#anthor8')) {
                        if (scrollTop >= (document.querySelector('#anthor8').offsetTop - 70)) {
                            this.activeKey = '8'
                            if (scrollTop >= (document.querySelector('#anthor2').offsetTop - 70)) {
                                this.activeKey = '2'
                                if (scrollTop >= (document.querySelector('#anthor3').offsetTop - 70)) {
                                    this.activeKey = '3'
                                    if (scrollTop >= (document.querySelector('#anthor5').offsetTop - 70)) {
                                        this.activeKey = '5'
                                        if (scrollTop >= (document.querySelector('#anthor7').offsetTop - 95)) {
                                            this.activeKey = '7'
                                        } else {
                                            if (document.documentElement.scrollHeight === document.documentElement.clientHeight + scrollTop) {
                                                this.activeKey = '7'
                                            }
                                        }
                                    } else {
                                        if (document.documentElement.scrollHeight === document.documentElement.clientHeight + scrollTop) {
                                            this.activeKey = '7'
                                        }
                                    }
                                } else {
                                    if (document.documentElement.scrollHeight === document.documentElement.clientHeight + scrollTop) {
                                        this.activeKey = '3'
                                    }
                                }
                            } else {
                                if (document.documentElement.scrollHeight === document.documentElement.clientHeight + scrollTop) {
                                    this.activeKey = '2'
                                }
                            }
                        } else {
                            if (document.documentElement.scrollHeight === document.documentElement.clientHeight + scrollTop) {
                                this.activeKey = '8'
                            }
                        }
                    } else {
                        if (scrollTop >= (document.querySelector('#anthor2').offsetTop - 70)) {
                            this.activeKey = '2'
                            if (scrollTop >= (document.querySelector('#anthor3').offsetTop - 70)) {
                                this.activeKey = '3'
                                if (scrollTop >= (document.querySelector('#anthor5').offsetTop - 70)) {
                                    this.activeKey = '5'
                                    if (scrollTop >= (document.querySelector('#anthor7').offsetTop - 95)) {
                                        this.activeKey = '7'
                                    } else {
                                        if (document.documentElement.scrollHeight === document.documentElement.clientHeight + scrollTop) {
                                            this.activeKey = '7'
                                        }
                                    }
                                } else {
                                    if (document.documentElement.scrollHeight === document.documentElement.clientHeight + scrollTop) {
                                        this.activeKey = '7'
                                    }
                                }
                            } else {
                                if (document.documentElement.scrollHeight === document.documentElement.clientHeight + scrollTop) {
                                    this.activeKey = '3'
                                }
                            }
                        } else {
                            if (document.documentElement.scrollHeight === document.documentElement.clientHeight + scrollTop) {
                                this.activeKey = '2'
                            }
                        }
                    }
                } else {
                    if (document.documentElement.scrollHeight === document.documentElement.clientHeight + scrollTop) {
                        this.activeKey = '1'
                    }
                }
            },
            /**
             * 获取动态路由ID
             */
            getProjectId () {
                this.projectId = this.$route.params.id
            },
            /**
             *  查询购买详情
             */
            initInfo () {
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        projectId: this.$route.params.id
                    }
                }
                axios.post('/pto/detail/get', data).then((res) => {
                    if (res.data.code.toString() === '0' && res.data.data) {
                        this.listData = [res.data.data]
                        // 初始化表头
                        this.tableColumbsI18n(res)
                        // 页面标题国际化
                        if (this.globalarr.indexOf(res.data.data.projectMaterial.name) === -1) {
                            this.globalarr.push(res.data.data.projectMaterial.name)
                            document.title = tool.intervariable(this.$t('PageTitle.passpurdetail_pagetitle'), this.globalarr)
                        }
                        // 合并图片和视频、图片地址添加根路径,  安卓不显示视频
                        if (this.showVideo) {
                            this.listData[0].projectMaterial.imgs = this.listData[0].projectMaterial.video.concat(this.listData[0].projectMaterial.imgs).map((item) => {
                                return {...item, largeUrl: '/' + item.largeUrl, fileUrl: '/' + item.fileUrl}
                            })
                        } else {
                            this.listData[0].projectMaterial.imgs = this.listData[0].projectMaterial.imgs.map((item) => {
                                return {...item, largeUrl: '/' + item.largeUrl, fileUrl: '/' + item.fileUrl}
                            })
                        }
                        this.projectMaterialImgs = this.listData[0].projectMaterial.imgs.length
                        // 交易规则动态变量
                        this.certificatePurchase_investment_statement_info3 = tool.intervariable(this.$t('CertificatePurchase.certificatePurchase_investment_statement_info3'), [this.listData[0].projectDist.curCode, this.listData[0].projectDist.curCode])
                        this.certificatePurchase_rule_buy_offtake_info2 = tool.intervariable(this.$t('CertificatePurchase.certificatePurchase_rule_buy_offtake_info2'), [this.listData[0].projectDistSetting.userMinAmount, this.listData[0].projectDistSetting.userMaxAmount])
                        this.certificatePurchase_rule_buy_offtake_info3 = tool.intervariable(this.$t('CertificatePurchase.certificatePurchase_rule_buy_offtake_info3'), [this.listData[0].projectDist.curCode, this.listData[0].projectDist.curCode])
                        // 状态国际化
                        this.listData[0].projectBase = {
                            ...this.listData[0].projectBase,
                            i18nState: this.issueState(this.listData[0].projectBase.issueState)
                        }
                        // 项目标签处理成数组
                        this.listData[0].projectMaterial.projectLabel = this.listData[0].projectMaterial.projectLabel ? this.listData[0].projectMaterial.projectLabel.split(',') : ''
                        // 合并项目文件
                        this.forData(res.data.data)
                        // 添加滚动条监听
                        this.$nextTick(() => {
                            this.tabsAnthor = document.querySelector('#tabsAnthor').offsetTop
                            window.addEventListener('scroll', this.handleScroll)
                            // 设置登录状态
                            Cookie.get('refresh_token') ? this.isLogin = true : this.isLogin = false
                        })
                        // 是否售罄
                        res.data.data.projectBase.saleRatio === 100 ? this.showSalesIcon = true : this.showSalesIcon = false
                        this.loading = false
                    } else {
                        this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                    }
                })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             *  获取项目公示信息
             */
            getPublicInfor () {
                let params = {
                    traceId: tool.UUID(),
                    data: {
                        projectId: this.$route.params.id
                    }
                }
                this.showPublicInfo = true
                axios.post('/pto/project/publicity/get', params)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            if (res.data.data) {
                                let r = res.data.data.publicContent.replace(/\s*/g, '')
                                r = r.replace(/<p><\/p>/g, '')
                                if (r.length === 0) {
                                    this.showPublicInfo = false
                                }
                                this.publicInfo = res.data.data.publicContent
                            } else {
                                this.showPublicInfo = false
                            }
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             *  国际化表头
             *  @param res 通证详情数据
             */
            tableColumbsI18n (res) {
                this.columns = [
                    {title: 'UID', dataIndex: 'userCode', key: 'userCode'},
                    {title: this.$t('CertificatePurchase.certificatePurchase_available'), dataIndex: 'ptTotalAmount', key: 'ptTotalAmount', scopedSlots: {customRender: 'ptTotalAmount'}},
                    {title: `${this.$t('CertificatePurchase.certificatePurchase_investment_quantity')} (${res.data.data.projectDist.curCode})`, dataIndex: 'curAmount', key: 'curAmount', scopedSlots: {customRender: 'curAmount'}},
                    {title: this.$t('CertificatePurchase.certificatePurchase_buy_time'), dataIndex: 'saleTime', key: 'saleTime', scopedSlots: {customRender: 'saleTime'}}
                ]
            },
            /**
             *  遍历数据
             *  @param data 通证详情数据
             */
            forData (data) {
                this.files.licenseImg = this.reErection(data.projectIssuer.licenseImg)
                this.files.houseCertificateImg = this.reErection(data.projectMaterial.houseCertificateImg)
                this.files.eiaImg = this.reErection(data.projectMaterial.eiaImg)
                this.files.buildingPermitsImg = this.reErection(data.projectMaterial.buildingPermitsImg)
                this.files.landCertificateImg = this.reErection(data.projectMaterial.landCertificateImg)
                this.files.landContractImg = this.reErection(data.projectMaterial.landContractImg)
                this.files.landMasterImg = this.reErection(data.projectMaterial.landMasterImg)
                this.files.installmentImg = this.reErection(data.projectMaterial.installmentImg)
                this.files.lawFirmSurveyImg = this.reErection(data.projectExamine.lawFirmSurveyImg)
                this.files.intermediarySurveyImg = this.reErection(data.projectExamine.intermediarySurveyImg)
                this.files.propertyCertificateImg = this.reErection(data.projectMaterial.propertyCertificateImg)
                this.files.agreementImg = this.reErection(data.projectExamine.agreementImg)
                this.files.otherFile = this.reErection(data.projectExamine.otherFile)
            },
            /**
             * 组装数据
             * @param items 文件对象
             */
            reErection (items) {
                let files = []
                if (items.length !== 0) {
                    files = items.map((item, index) => {
                        let file = {}
                        file.name = item.name
                        // 判断图片还是文件
                        if (item.type === 0) {
                            file.fileUrl = item.largeUrl
                        } else {
                            file.fileUrl = item.fileUrl
                        }
                        return file
                    })
                }
                return files
            },
            /**
             * 状态添加国际化
             * @param val 状态码
             */
            issueState (val) {
                let state
                //  0创建、1未发行、2等待预售、3开始预售、4预售完成、5预售失败、6已发行、7已取消
                switch (val) {
                case 0 :
                    state = this.$t('CertificatePurchase.certificatePurchase_status_found')
                    break
                case 1 :
                    state = this.$t('CertificatePurchase.certificatePurchase_status_unissued')
                    break
                case 2 :
                    state = this.$t('CertificatePurchase.certificatePurchase_status_wait')
                    break
                case 3 :
                    state = this.$t('CertificatePurchase.certificatePurchase_status_start')
                    break
                case 4 :
                    state = this.$t('CertificatePurchase.certificatePurchase_status_completed')
                    break
                case 5 :
                    state = this.$t('CertificatePurchase.certificatePurchase_status_failure')
                    break
                case 6 :
                    state = this.$t('CertificatePurchase.certificatePurchase_status_issued')
                    break
                default:
                    state = this.$t('CertificatePurchase.certificatePurchase_status_canceled')
                }
                return state
            },
            /**
             * 跳转登录
             */
            toLogin () {
                let url = this.$route.path
                Cookie.set('redirectUrl', url)
                this.$router.push(`/mobile/user/login`)
            },
            /**
             * 下载项目文件
             * @param src 文件地址
             * @param name 文件名称
             */
            downFile (src, name) {
                let _src = '/' + src
                download(1, _src, name)
            },
            // 开启右侧抽屉导航
            openDrawer () {
                this.nowTips = true
                this.drawer = {'drawer-containel-left': true, 'drawer-containel-right': false}
            },
            // 关闭右侧抽屉导航
            closeDrawer () {
                this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': true}
                let _this = this
                this.loading = true
                this.nowTips = false
                setTimeout(function () {
                    _this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': false}
                }, 200)
                setTimeout(function () {
                    _this.initBreadcrumb()
                    _this.initInfo()
                }, 500)
            },
            /**
             * 用户购买历史
             */
            buyHistory () {
                let pageData = {
                    traceId: tool.UUID(),
                    data: {
                        pageNum: this.current,
                        pageSize: this.pageSize,
                        filter: {
                            projectId: this.$route.params.id
                        }
                    }
                }
                axios.post('/pto/invest/project/list', pageData)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.data = res.data.data.list
                            this.pagination.total = res.data.data.total
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 跳转认购订单
             */
            buyPto () {
                this.$router.push(`/mobile/CertificatePurchase/SubscribeImmediately/${this.projectId}`)
            },
            // 获取kyc认证信息
            checkKycStatus () {
                let data = {traceId: tool.UUID()}
                axios.post('/dc/user/kyc/query/user', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            if (!res.data.data) {
                                window.location.href = '/mobile/user/UserCenter/AuthenticationKYC'
                            } else if (res.data.data.auditState !== 2) {
                                window.location.href = '/mobile/user/UserCenter/AuthenticationKYC'
                            } else {
                                this.investBalanceQquery()
                            }
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
            },
            /**
             * 用户余额查询
             * 余额检查如果不够提示将不再跳转支付页面
             */
            investBalanceQquery () {
                this.flag = true
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        projectId: this.projectId
                    }
                }
                axios
                    .post('/pto/invest/balance/query', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.buyPto()
                        } else {
                            this.flag = false
                            if (res.data.code.toString() === '3059') {
                                this.errorMsg = res.data.msg
                                this.$message.error(tool.intervariable(this.$t(`code.${res.data.code.toString()}`), [this.errorMsg]))
                            } else {
                                this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                            }
                        }
                    })
                    .catch(err => {
                        this.flag = false
                        this.$message.error(this.$t(err.message))
                    })
            }
        },
        filters: {
            // 倒计时
            toCountDown,
            // 时间格式化
            parseTime,
            // 坐标地址格式化
            toRegionsName,
            // 数字优化
            formatNumber,
            // 数字优化
            formatNumberOrHide (val, isLogin) {
                val += ''
                let x = val.split('.')
                let x1 = x[0]
                let x2 = x.length > 1 ? '.' + x[1] : ''
                let rgx = /(\d+)(\d{3})/
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2')
                }
                if (isLogin) {
                    return x1 + x2
                } else {
                    return '****'
                }
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
            window.removeEventListener('scroll', this.handleScroll)
        },
        components: {
            FsHead,
            fonter,
            SellOut,
            FilesDown,
            Breadcrumb,
            PtoProgress
        }
    }
</script>

<style lang="less">
    /**产品风险评估**/
    .ant-popover-placement-right > .ant-popover-content > .ant-popover-arrow {
        border-bottom-color: rgba(0, 0, 0, 0.75);
        border-left-color: rgba(0, 0, 0, 0.75);
    }
    .ant-popover-placement-right {
        .ant-popover-inner {
            color: #fff;
            text-align: left;
            text-decoration: none;
            background-color: rgba(0, 0, 0, 0.75);
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            min-height: 32px;
            word-wrap: break-word;

            .ant-popover-inner-content {
                color: #fff;
                padding: 6px 8px;
                p {
                    max-width: 200px;
                    margin-bottom: 0;
                }

                .more {
                    color: #2EA9DF;
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
        }
    }
</style>

<style lang="less" scoped>
    /deep/ .ant-table-tbody > tr > td {
        border-bottom: none;
        height: 63px;
        padding: 0 !important;
    }

    .dialogBox{
        padding: 0;

        .title{
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            letter-spacing: 1px;
            margin-top: 28px;
            color: #333333;
            text-align: center;
        }

        .type {
            width: 100%;
            height: 100%;
            line-height: 1;
            padding: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .type-desc {
            margin-top: 27px;

            p {
                font-size:14px;
                font-weight:400;
                color:rgba(51,51,51,1);

                .value {
                    display: inline-flex;
                    width: 88%;
                    word-break: break-word;
                }
            }
        }

        /deep/.dialogTableTitle{
            color: #2EA9DF!important;
        }
        /deep/.ant-table{
            font-size: 14px;
            font-weight: 500!important;
            color: rgba(0,0,0,0.8)!important;
        }
        /deep/.ant-table-thead > tr > th{
            padding: 4px !important;
            background-color: #E0E0E0!important;
            border-color: #E0E0E0!important;
            word-break: break-all;
        }
        /deep/.ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td{
            background-color: #fff!important;
        }
        /deep/.ant-table-bordered .ant-table-tbody > tr > td:not(:last-child){
            border-right-color: #fff!important;
        }
        /deep/.ant-table-tbody > tr:nth-child(1) {
            background-color: #40B740;
            > td:first-child {
                background-color: #2BAF2B;
            }
        }
        /deep/.ant-table-tbody > tr:nth-child(2) {
            background-color: #9CAFFF;
            > td:first-child {
                background-color: #91A7FF;
            }
        }
        /deep/.ant-table-tbody > tr:nth-child(3) {
            background-color: #FFC246;
            > td:first-child {
                background-color: #FFBC32;
            }
        }
        /deep/.ant-table-tbody > tr:nth-child(4) {
            background-color: #EA5F53;
            > td:first-child {
                background-color: #EA5F53;
            }
        }
    }

    .icon-contair {
        top: 50px;
    }

    .container {
        .video-player-box {
            min-height: 200px;
        }
    }

    /*********项目下载文件********/
    .files-contair {
        width: 91vw;
    }

    .files-row {
        display: flex;
        width: 100vw;
        flex-wrap: wrap;
        .files-col {
            display: flex;
            justify-content: space-between;
        }
    }

    .certificatePurchase-after-view-file {
        margin-bottom: 0.5rem;
    }

    .projectMaterial-introduce {
        width: 93vw;

        /deep/ img {
            width: 96vw;
            padding-right: 0.16rem;
        }
        /deep/ table p {
            margin-bottom: 0 !important;
        }
    }

    .projectMaterial-address {
        display: inline-flex;
        max-width: 2rem;
        white-space: normal;
    }

    .planStartTime {
        font-size: 13px
    }

    .projectIssuer-issuerName {
        width: 150px;
        white-space: normal;
    }

    .projectBase-convertPrice{
        color: #F04134;
        width: 220px
    }

    .certificatePurchase-issue-price {
        width: 115px
    }

    .projectDist-ptCurCode {
        color: #2EA9DF
    }

    .projectBase-i18nState {
        float: left
    }

    .skeleton-padding{
        padding: 0 0.16rem;
    }

    .shadow {
        z-index: 9999;
        position: fixed;
        width: 100%;
        height: 100%;
        background: #FFFFFF;
        opacity: 0;
    }

    .span-text-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .tabs-contair {
        padding: 0 0.16rem;

        .item-key {
            display: inline-block;
            width: 1.4rem;
            font-size: 14px;
            color: rgba(153, 153, 153, 1);
            font-weight:400;
        }

        .item-value {
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
            font-weight: 400;
            font-size: 14px;
            color: rgba(51, 51, 51, 1);
        }

        .tags-title {
            margin-top: 0.14rem;
            border-left: 2px solid #2FAAE0;
            line-height: 16px;
            border-radius: 2px;
            font-size: 16px;
            font-weight: 600;
            color: rgba(51, 51, 51, 1);
            padding-left: 0.1rem;
        }

        .title-info {
            margin: 0.12rem 0;
            font-size: 12px;
            font-weight: 600;
            color: #333333;

            &.title-info-html {
                font-weight: normal;
            }

            .rule-title {
                font-weight: 500;
                display: inline-flex;
                width: 95vw;
                color: #333333;
                margin-bottom: 4px;
            }

            .rule-body-title {
                margin-bottom: 4px;
            }

            .rule-body {
                color: #333333;
                opacity: 0.8;
                display: -webkit-box;
                width: 95vw;
                font-weight: 400;
            }

            .theme-title {
                margin-top: 0.19rem;
                text-align: center;
                font-size: 16px;
                font-weight: 600;
                color: rgba(51, 51, 51, 1);
            }

            .theme-desc {
                margin-top: 0.1rem;
            }

            .theme-img {
                margin-top: 0.08rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .img-item {
                    margin-top: 0.08rem;
                    height: 1.78rem;
                    border-radius: 8px;
                }
            }
        }
    }

    .hidden-input {
        width: 100px;
        height: 30px;
    }

    .download-file {
        width: 0.24rem;
        height: 0.24rem;
        margin-right: 0.3rem;
    }

    /* For  carousel*/
    .left-div {
        width: 0.3rem;
        height: 1.24rem;
        background: rgba(0, 0, 0, 1);
        border-radius: 8px 0px 0px 8px;
        opacity: 0.5004;
        padding-top: 0.4rem;
    }

    .right-div {
        padding-top: 0.4rem;
        width: 0.3rem;
        height: 1.24rem;
        background: rgba(0, 0, 0, 1);
        border-radius: 0px 8px 8px 0px;
        opacity: 0.5004;
    }

    .red-item {
        width: 368px;
        height: 30px;
        background: rgba(240, 65, 52, 0.2);
        padding-left: 16px;
        margin: 0 -16px 20px -16px;
        margin-bottom: 20px;

        .item-time {
            line-height: 30px;
            display: inline-block;
            font-size: 12px;
            color: #F04134;
            font-weight: 400;
        }
    }

    .ant-carousel .slick-prev:before {
        content: '';
    }

    .ant-carousel .slick-next:before {
        content: '';
    }

    .ant-carousel /deep/ .slick-slide {
        text-align: center;
        overflow: hidden;
        border: 1px solid #E9E9E9;
        border-radius: 8px;
        height: 217px;
    }

    .ant-carousel /deep/ .custom-slick-arrow {
        width: 0.25rem;
        height: 0.25rem;
        font-size: 25px;
        color: #fff;
        background-color: rgba(31, 45, 61, .11);
        opacity: 0.3;
    }

    .ant-carousel /deep/ .custom-slick-arrow:before {
        // display: none;
    }

    .ant-carousel /deep/ .custom-slick-arrow:hover {
        opacity: 0.5;
    }

    .ant-carousel /deep/ .slick-slide h3 {
        color: #fff;
    }

    .ant-carousel /deep/ .slick-dots {
        text-align: left;
        height: auto
    }

    .ant-carousel /deep/ .slick-slide img {
        display: block;
        margin: auto;
        height: 217px;
        border-radius: 8px;
    }

    .ant-carousel /deep/ .slick-thumb {
        width: 2000px;
        display: block;
        white-space: nowrap;
        height: 1.24rem;
        bottom: -1.25rem;
    }

    .ant-carousel /deep/ .slick-thumb li {
        display: inline-block; //使li对象显示为一行
        width: 1.86rem;
        height: 1.24rem;
    }

    .ant-carousel /deep/ .slick-thumb li img {
        border-radius: 8px;
        width: 100%;
        height: 100%;
        filter: grayscale(100%);
    }

    .ant-carousel /deep/ .slick-thumb li.slick-active img {
        filter: grayscale(0%);
    }

    .shadowDown-parent {
        position: relative;

        .file-name {
            white-space: normal;
            word-break: break-all;
        }

        .shadowDown {
            left: 0;
            top: 0;
            position: absolute;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 1px;
            z-index: 200;
            height: 100%;
            width: 100%;
            font-size: 18px;
            color: rgba(255, 255, 255, 1);
            display: flex;
            justify-content: center;
            align-items: center;

            div {
                a {
                    text-decoration: underline;
                    color: rgba(255, 255, 255, 1);
                }
            }
        }

    }


    .fixed-div {
        z-index: 1000;
        width: 100vw;
        padding: 0 0.16rem;
        margin-top: -0.15rem;

        .title {
            font-size: 16px;
            color: rgba(51, 51, 51, 1);
            line-height: 28px;
        }

        .body {
            margin: 0.14rem 0;
            font-size: 14px;
            font-weight: 600;
            color: rgba(51, 51, 51, 1);

            .item {
                display: flex;
                justify-content: space-between;

                .item-key {
                    display: inline-block;
                    width: 1.95rem;
                    font-size: 14px;
                    color: rgba(153, 153, 153, 1);
                }

                .item-value {
                    width: 1.5rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: right;
                    font-weight: 400;
                    font-size: 14px;
                    color: rgba(51, 51, 51, 1);
                }
            }
        }
    }

    .isFixed {
        position: fixed;
        background-color: #fff;
        top: 0px;
        z-index: 999;
        width: 100vw;
    }

    .ant-tag-blue {
        color: #2EA9DF;
    }

    .ant-tag-green {
        color: #12AD50;
        background: rgba(18, 173, 80, 0.2);
    }

    .ant-tag-redTag {
        color: #F04134;
        background: rgba(240, 65, 52, 0.2);
    }

    .ant-tag-grayTag {
        color: #333;
        background: rgba(51, 51, 51, 0.2);
    }

    .ant-tag {
        font-size: 12px;
        border: none;
        padding: 0.02rem 0.08rem;
        line-height: 0.18rem;
        height: 0.22rem;
        margin-right: 0.1rem;
    }

    .mg-bm-8 {
        margin-bottom: 0.08rem;
    }

    .mg-bm-12 {
        margin-bottom: 0.12rem;
    }

    .video {
        z-index: 100;
        width: 100%;
        /*object-fit: fill;*/
        height: 2.17rem;
        border-radius: 8px;
    }

    .canvas {
        width: 100%;
        height: 2.17rem;
        border-radius: 8px;
    }

    .ant-divider-horizontal {
        margin: 0.13rem 0;
    }

    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 0.08rem;
        color: #666;
    }

    .section {
        background: #FFFFFF;

        .container {
            margin: 0 auto;

            .content {
                padding: 0 !important;

                /deep/ .ant-tabs-nav-container {
                    line-height: 0.6;
                }

                /deep/ .ant-tabs-top {
                    padding: 0 0.16rem;
                }

                /deep/ .ant-tabs-nav .ant-tabs-tab:hover {
                    color: rgba(0, 0, 0, 0.65);
                }

                /deep/ .ant-tabs-nav .ant-tabs-tab-active:hover {
                    color: #2EA9DF !important;
                }

                /deep/ .ant-tabs-bar {
                    margin: 0.08rem 0;

                    .ant-tabs-tab {
                        font-size: 12px;
                        padding: 0.16rem 0;
                    }
                }

                .tab-normal {
                    color: rgba(0, 0, 0, 0.65) !important;
                }

                .tab-active {
                    color: #2EA9DF !important;
                }
            }
        }
    }

    .divider-info {
        margin: 0.11rem 0;
        width: 100vw;
        height: 0.08rem;
        background: rgba(250, 250, 250, 1);
        margin-left: -0.16rem;
        margin-right: -0.16rem;
    }

    .ant-list-item {
        padding: 0;
    }

    .span-todo {
        display: inline-flex;
        max-width: 2rem;
        white-space: normal !important;
    }

    .skeleton {
        margin: 0.08rem 0.16rem;

        .title {
            font-size: 16px;
            color: #333333;
        }

        .title-time {
            font-size: 14px;
            color: rgba(47, 170, 224, 1);
            padding-right: 10px;
        }

        .ant-list-item-meta-title {
            margin-bottom: 0.04rem;
        }

        .info-tag {
            width: 100%;
            max-height: 0.64rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            overflow: hidden;
            .ant-tag {
                margin-bottom: 0.1rem;
            }

            .ant-tag-has-color {
                border-radius: 8px;
                height: 0.22rem;
                line-height: 1.5;
            }
        }

        .list-body {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;

            .tag-state {
                opacity: 0.8;
                text-align: center;
                min-width: 0.6rem;
                height: 0.3rem;
                border-radius: 0px 8px 0px 12px;
                position: absolute;
                right: 0;
                line-height: 25px;
                z-index: 1000;
                font-size: 12px;
                color: #ffffff;
                margin-right: 0;
            }

            .total-imgs {
                color: #ffffff;
                z-index: 1000;
                width: 0.5rem;
                height: 0.3rem;
                background:rgba(0,0,0,0.5);
                border-radius: 8px;
                position: absolute;
                right: 0.01rem;
                top: 1.55rem;
                line-height: 30px;
                text-align: center;
            }

            .fangsea-img {
                overflow: hidden;
                width: 100%;
                height: 2.17rem;
                border-radius: 8px;
                position: relative;
            }

            .body-info {
                width: 100%;
                margin-top: 0.1rem;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-content: space-between;

                .info-item {
                    display: flex;
                    flex-direction: column;
                    width: 1rem;
                    text-align: center;

                    .item-title {
                        line-height: 18px;
                        font-size: 12px;
                        color: rgba(153, 153, 153, 1);
                    }

                    .item-value {
                        line-height: 25px;
                        font-size: 14px;
                        color: rgba(51, 51, 51, 1);
                    }

                    .red-value {
                        font-size: 16px;
                        color: rgba(240, 65, 52, 1);
                        line-height: 32px;
                    }
                }

                .total-price {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    align-items: flex-end;

                    .item-title {
                        font-size: 12px;
                        color: rgba(51, 51, 51, 1);
                        line-height: 32px;
                    }

                    .item-value {
                        margin-left: 0.13rem;
                        line-height: 32px;
                        font-size: 16px;
                        color: rgba(240, 65, 52, 1);
                        letter-spacing: 1px;
                    }
                }

                .broadwise-item {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    justify-content: space-between;
                    font-size: 12px;
                    line-height: 28px;

                    .item-title {
                        color: rgba(153, 153, 153, 1);
                    }

                    .item-value {
                        color: rgba(51, 51, 51, 1);
                    }
                }

                .second-item {
                    margin-top: -0.3rem;
                }
            }

            .info-progress {
                width: 100%;
                margin-bottom: 0.16rem;
                padding-top: 0.06rem;
            }
        }

        .info-address {
            margin-left: -0.16rem;
            padding-left: 0.16rem;
            width: 100vw;
            height: 0.3rem;
            background: rgba(46, 169, 223, 1);
            margin-top: 0.14rem;

            span:first-child {
                line-height: 30px;
                color: #ffffff;
                vertical-align: middle;
            }
        }
    }

    .now-buy {
        z-index: 1061;
        position: fixed;
        bottom: 0.05rem;
        font-size: 16px;
        font-weight: 600;
        left: 0.16rem;
        width: calc(100vw - 0.32rem);
        height: 0.4rem;
        border-radius: 8px;
    }

    .ant-list-item-meta {
        margin-bottom: 0;
    }

</style>
<style lang="less">
    .ptpurchase-risk {
        padding: 0 10px;
        .ant-modal {
            width: 100% !important;
            margin-right: 0;
            margin-left: 0;
        }
    }
</style>

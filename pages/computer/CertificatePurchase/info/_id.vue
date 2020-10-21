<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key" :SelectedType="type"/>
        <section class="section">
            <div class="container">
                <a-layout-content>
                    <Breadcrumb :routes="routes"/>
                    <div class="content">
                        <div>
                            <!--              骨架屏              -->
                            <a-skeleton avatar :loading="loading" active :paragraph="{rows: 24}"/>
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
                                                <span class="title-time" v-if="item.projectBase.issueState === 3">
                                                    <span class="planEndTime">{{$t('CertificatePurchase.certificatePurchase_distance_end')}}: {{item.projectDist.planEndTime | toCountDown}}</span>
                                                </span>
                                                <span class="title-time" v-else>{{item.projectBase.i18nState}}</span>
                                            </template>
                                        </a-list-item-meta>
                                        <!--      通证类型       -->
                                        <div class="info-tag">
                                            <a-tag color="blue">{{item.projectBase.projectTypeName}}</a-tag>
                                            <a-tag color="green">{{item.projectBase.projectNatureName}}</a-tag>
                                            <a-tag class="ant-tag-redTag">{{item.projectMaterial.propertyRight}}</a-tag>
                                            <a-tag class="ant-tag-grayTag" :key="index" v-for="(child, index) in item.projectMaterial.projectLabel">{{child}}</a-tag>
                                        </div>
                                        <!--      通证信息       -->
                                        <div class="list-body">
                                            <!--      售罄图标      -->
                                            <div class="icon-contair" :class="{'icon-zh': isZh, 'icon-en': !isZh}"
                                                 v-show="showSalesIcon"></div>
                                            <a-tag :color="item.issueState === 5 ? '#8C8C8C' : '#2FAAE0' "
                                                   class="tag-state">
                                                {{item.projectBase.i18nState}}
                                            </a-tag>
                                            <!--      走马灯组件       -->
                                            <a-carousel arrows dotsClass="slick-dots slick-thumb" class="fangsea-img"
                                                        :beforeChange="beforeChange" id="carousel">
                                                <div v-for="file in item.projectMaterial.imgs" class="carousel-imgs">
                                                    <template v-if="file.type === 1">
                                                        <video class="video"
                                                               controls="controls"
                                                               controlsList='nodownload noremote footbar'
                                                               :src="file.fileUrl"/>
                                                        <div class="total-imgs" v-show="isVideo"></div>
                                                    </template>
                                                    <img :src="file.largeUrl" v-else>
                                                </div>
                                                <a slot="customPaging" slot-scope="props" class="customPaging-a">
                                                    <img :src="getImgUrl(props.i)"/>
                                                </a>
                                                <div v-if="item.projectMaterial.imgs.length > 3"
                                                     slot="prevArrow" slot-scope="props"
                                                     class="custom-slick-arrow projectMaterial-imgs-left">
                                                    <div class="left-div">
                                                        <a-icon type="left"/>
                                                    </div>
                                                </div>
                                                <div v-if="item.projectMaterial.imgs.length > 3"
                                                     slot="nextArrow" slot-scope="props"
                                                     class="custom-slick-arrow projectMaterial-imgs-right">
                                                    <div class="right-div">
                                                        <a-icon type="right"/>
                                                    </div>
                                                </div>
                                            </a-carousel>
                                            <!--      基本信息       -->
                                            <div class="body-info-contair">
                                                <div class="body-info">
                                                    <div class="total-price">
                                                    <span class="item-value">
                                                        {{item.projectDist.changeCurPrice | formatNumber}} {{item.projectDist.changeCurCode}}
                                                    </span>
                                                        <span class="item-title">
                                                        {{$t('CertificatePurchase.ptpurchase_title_totalprice')}}
                                                    </span>
                                                    </div>
                                                    <a-divider/>

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
                                                    <div class="broadwise-item-contair">
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
                                                    </div>
                                                    <!--         通证进度条           -->
                                                    <pto-progress class="info-progress"
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
                                                </div>
                                                <a-button :disabled="item.projectBase.issueState !== 3"
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
                            <!--      tabs导航       -->
                            <a-tabs v-if="listData.length !== 0"
                                    :class="{'isFixed': searchBarFixed}"
                                    id="tabsAnthor"
                                    :tabBarGutter="50"
                                    :activeKey="activeKey"
                                    @change="changeTabs">
                                <a-tab-pane :tab="$t('CertificatePurchase.ptpurchase_essential_information')" key="1"/>
                                <a-tab-pane :tab="$t('CertificatePurchase.certificatePurchase_item_publicinfor')"
                                            v-if="showPublicInfo" key="8"/>
                                <a-tab-pane :tab="$t('CertificatePurchase.certificatePurchase_item_information')"
                                            key="2"/>
                                <a-tab-pane :tab="$t('CertificatePurchase.certificatePurchase_rule_business')" key="3"/>
                                <a-tab-pane :tab="$t('CertificatePurchase.certificatePurchase_items_file')" key="5"/>
                                <a-tab-pane
                                        :tab="$t('CertificatePurchase.certificatePurchase_subscription_information')"
                                        key="7" v-if="data.length !== 0"/>
                            </a-tabs>
                            <div v-if="listData.length !== 0" class="tabs-contair">
                                <!--      基本信息       -->
                                <div class="tags-title" id="anthor1">
                                    {{$t('CertificatePurchase.ptpurchase_essential_information')}}
                                </div>
                                <div class="title-info">
                                    <a-row class="mg-bm-8">
                                        <a-col :span="8">
                                            <span class="item-key">{{$t('CertificatePurchase.ptpurchase_title_itemtype')}}：</span>
                                            <span class="item-value">{{listData[0].projectBase.projectTypeName}}</span>
                                        </a-col>
                                        <a-col :span="8">
                                            <span class="item-key">{{$t('CertificatePurchase.certificatePurchase_ptos_number')}}：</span>
                                            <span class="item-value">{{listData[0].projectDist.totalAmount | formatNumber}}</span>
                                        </a-col>
                                    </a-row>
                                    <a-row class="mg-bm-8">
                                        <a-col :span="8">
                                            <span class="item-key">{{$t('CertificatePurchase.ptpurchase_title_area')}}：</span>
                                            <span class="item-value">{{listData[0].projectMaterial.measure}}㎡</span>
                                        </a-col>
                                        <a-col :span="8">
                                            <span class="item-key">{{$t('CertificatePurchase.certificatePurchase_project_properties')}}：</span>
                                            <span class="item-value">{{listData[0].projectBase.projectNatureName}}</span>
                                        </a-col>
                                    </a-row>
                                    <a-row class="mg-bm-8">
                                        <!--                                        <a-col :span="8"><span class="item-key">{{$t('CertificatePurchase.certificatePurchase_financial_period')}}：</span><span class="item-value">360{{$t('CertificatePurchase.certificatePurchase_day')}}</span>-->
                                        <!--                                        </a-col>-->
                                        <a-col :span="8"><span class="item-key">{{$t('CertificatePurchase.ptpurchase_property_right')}}：</span><span
                                                class="item-value projectMaterial-propertyRight">{{listData[0].projectMaterial.propertyRight}}</span>
                                        </a-col>
                                    </a-row>
                                    <a-row class="mg-bm-8">
                                        <a-col :span="16" class="item-col">
                                            <span class="item-key">{{$t('CertificatePurchase.certificatePurchase_developer')}}：</span>
                                            <span class="item-value projectIssuer-issuerName">
                                                {{listData[0].projectIssuer.issuerName}}
                                            </span>
                                        </a-col>
                                    </a-row>
                                    <a-row>
                                        <a-col :span="16" class="item-col">
                                            <span class="item-key">{{$t('CertificatePurchase.certificatePurchase_details_address')}}：</span>
                                            <span class="item-value projectIssuer-issuerName">{{listData[0].projectMaterial.address}}</span>
                                        </a-col>
                                    </a-row>
                                </div>
                                <!--      公示信息       -->
                                <div class="tags-title" id="anthor8" v-if="showPublicInfo">
                                    {{$t('CertificatePurchase.certificatePurchase_item_publicinfor')}}
                                </div>
                                <div class="title-info title-info-html" v-if="showPublicInfo">
                                    <a-row>
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
                                    <a-row>
                                        <a-col :span="24" class="theme-img">
                                            <div v-html="listData[0].projectMaterial.introduce"
                                                 class="projectMaterial-introduce"></div>
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
                                                <span class="item-key rule-body">
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info2')}}
                                                </span>
                                                <span class="item-key rule-body">
                                                    {{certificatePurchase_investment_statement_info3}}
                                                </span>
                                                <span class="item-key rule-body">
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info4')}}
                                                </span>
                                                <span class="item-key rule-body">
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info5')}}
                                                </span>
                                                <span class="item-key rule-body">
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info6')}}
                                                </span>
                                                <span class="item-key rule-body">
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info7')}}
                                                </span>
                                                <span class="item-key rule-body">
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info8')}}
                                                </span>
                                                <span class="item-key rule-body">
                                                    {{$t('CertificatePurchase.certificatePurchase_investment_statement_info9')}}
                                                </span>
                                                <span class="item-key rule-body">
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
                                            <span class="item-key rule-body">
                                                {{$t('CertificatePurchase.certificatePurchase_rule_offtake_info2')}}
                                            </span>
                                        </a-col>
                                    </a-row>
                                </div>
                                <div class="tags-title" id="anthor5">
                                    {{$t('CertificatePurchase.certificatePurchase_items_file')}}
                                </div>
                                <div class="title-info shadowDown-parent title-info-width">
                                    <div class="shadowDown" v-show="!isLogin">
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
                                                    :files="files.eiaImg" :name="'files.files_eia'"/>
                                        <files-down v-if="files.buildingPermitsImg.length !== 0"
                                                    :files="files.buildingPermitsImg"
                                                    :name="'files.files_building_permit'"/>
                                        <files-down v-if="files.landCertificateImg.length !== 0"
                                                    :files="files.landCertificateImg" :name="'files.files_land_title'"/>
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
                                <!--        认购信息        -->
                                <template v-if="data.length !== 0">
                                    <div class="tags-title" id="anthor7">
                                        {{$t('CertificatePurchase.certificatePurchase_subscription_information')}}
                                    </div>
                                    <div class="title-info shadowDown-parent" style="width: 800px;">
                                        <div class="shadowDown" v-show="!isLogin">
                                            <div>
                                                <a href="javascript:;" @click="toLogin">
                                                    <span>{{$t('CertificatePurchase.certificatePurchase_login')}}</span>
                                                </a>
                                                {{$t('CertificatePurchase.certificatePurchase_after_view_data')}}
                                            </div>
                                        </div>
                                        <a-table :columns="columns" :dataSource="data" :pagination="pagination"
                                                 :locale="{emptyText: $t('NoData.NoData_table')}">
                                            <template slot="ptTotalAmount" slot-scope="ptTotalAmount">{{ptTotalAmount |
                                                formatNumberOrHide(isLogin)}}
                                            </template>
                                            <template slot="curAmount" slot-scope="curAmount">{{curAmount | formatNumberOrHide(isLogin)}}
                                            </template>
                                            <template slot="saleTime" slot-scope="saleTime">{{saleTime |
                                                parseTime('{y}-{m}-{d} {h}:{i}')}}
                                            </template>
                                        </a-table>
                                    </div>
                                </template>
                                <!--        悬浮框       -->
                                <div class="fixed-div" :class="{'isDivFixed': divFixed}" id="fixed-div">
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
                                                            <span @click="showDialog = true" class="more">{{$t('CertificatePurchase.ptpurchase_tip_risk_rating_more')}}</span>
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
                                                <span class="item-key" style="width: 115px">
                                                    {{$t('CertificatePurchase.certificatePurchase_issue_price')}}
                                                    <a-tooltip placement="right"
                                                               :title="$t('CertificatePurchase.ptpurchase_tip_issueprice')">
                                                        <a-icon type="info-circle"/>
                                                    </a-tooltip>
                                                </span>
                                                <span class="item-value projectDist-curCode">
                                                    {{listData[0].projectBase.convertPrice}} {{listData[0]. projectDist.curCode}}/{{$t('CertificatePurchase.certificatePurchase_portion')}}
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
                                            <a-col :span="24" class="item"><span class="item-key">{{$t('CertificatePurchase.certificatePurchase_pts_total')}}
                                                          <a-tooltip placement="right"
                                                                     :title="$t('CertificatePurchase.ptpurchase_tip_ptamount')">
                                                        <a-icon type="info-circle"/>
                                                    </a-tooltip>
                                            </span><span class="item-value">{{listData[0].projectDist.totalAmount | formatNumber}}</span>
                                            </a-col>
                                        </a-row>
                                        <a-row class="mg-bm-8">
                                            <a-col :span="24" class="item"><span class="item-key">{{$t('CertificatePurchase.certificatePurchase_maximum_number_subscriptions')}}
                                                          <a-tooltip placement="right"
                                                                     :title="$t('CertificatePurchase.ptpurchase_tip_maxmum')">
                                                        <a-icon type="info-circle"/>
                                                    </a-tooltip>
                                            </span><span class="item-value">{{listData[0].projectDistSetting.userMaxAmount | formatNumber}}</span>
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
                                                        class="item-value span-text-overflow" style="width: 150px;"
                                                        :title="listData[0].projectIssuer.issuerName">
                                                    {{listData[0].projectIssuer.issuerName}}
                                                </span>
                                            </a-col>
                                        </a-row>
                                    </div>
                                    <div>
                                        <a-button :disabled="listData[0].projectBase.issueState !== 3"
                                                  :loading="flag"
                                                  type="primary"
                                                  block
                                                  class="now-buy"
                                                  @click="checkKycStatus">
                                            {{$t('CertificatePurchase.ptpurchase_title_buynow')}}
                                        </a-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-layout-content>
            </div>
        </section>
        <fonter id="fonter" class="fonter"/>
        <div class="shadow" v-if="isShow"></div>
        <a-modal
                title=""
                width="840px"
                :zIndex="2000"
                :centered="true"
                :footer="null"
                v-model="showDialog">
            <div class="dialogBox">
                <p class="title">{{$t('CertificatePurchase.ptpurchase_tip_risk_rating_title')}}</p>
                <a-table
                        :dataSource="dialogData1"
                        size="middle"
                        :pagination="false">
                    <a-table-column
                            dataIndex="type"
                            align="center"
                            key="1">
                        <template slot-scope="text, record, index">
                            <div slot="title" v-show="index === 0" class="type type1">{{record.type}}</div>
                            <div slot="title" v-show="index === 1" class="type type2">{{record.type}}</div>
                            <div slot="title" v-show="index === 2" class="type type3">{{record.type}}</div>
                            <div slot="title" v-show="index === 3" class="type type4" >{{record.type}}</div>
                        </template>
                    </a-table-column>
                    <a-table-column
                            :title="$t('CertificatePurchase.ptpurchase_tip_risk_rating_th1')"
                            dataIndex="income"
                            align="center"
                            key="2">
                        <template slot-scope="text, record, index">
                            <div slot="income" v-show="index === 0" class="type type-td-1">{{record.income}}</div>
                            <div slot="income" v-show="index === 1" class="type type-td-2">{{record.income}}</div>
                            <div slot="income" v-show="index === 2" class="type type-td-3">{{record.income}}</div>
                            <div slot="income" v-show="index === 3" class="type type-td-4" >{{record.income}}</div>
                        </template>
                    </a-table-column>
                    <a-table-column
                            :title="$t('CertificatePurchase.ptpurchase_tip_risk_rating_th2')"
                            dataIndex="property"
                            align="center"
                            key="3">
                        <template slot-scope="text, record, index">
                            <div slot="property" v-show="index === 0" class="type type-td-1">{{record.property}}</div>
                            <div slot="property" v-show="index === 1" class="type type-td-2">{{record.property}}</div>
                            <div slot="property" v-show="index === 2" class="type type-td-3">{{record.property}}</div>
                            <div slot="property" v-show="index === 3" class="type type-td-4" >{{record.property}}</div>
                        </template>
                    </a-table-column>
                    <a-table-column
                            :title="$t('CertificatePurchase.ptpurchase_tip_risk_rating_th3')"
                            dataIndex="capital"
                            align="center"
                            key="4">
                        <template slot-scope="text, record, index">
                            <div slot="capital" v-show="index === 0" class="type type-td-1">{{record.capital}}</div>
                            <div slot="capital" v-show="index === 1" class="type type-td-2">{{record.capital}}</div>
                            <div slot="capital" v-show="index === 2" class="type type-td-3">{{record.capital}}</div>
                            <div slot="capital" v-show="index === 3" class="type type-td-4" >{{record.capital}}</div>
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
    import {toRegionsName, formatNumber, parseTime, toCountDown} from '~/assets/utils/index'
    import PtoProgress from '~/components/computer/PtoProgress'
    import Breadcrumb from '~/components/computer/Breadcrumb'
    import FsHead from '~/components/computer/FangseaHeader'
    import FilesDown from '~/components/computer/FilesDown'
    import fonter from '~/components/computer/Footer'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
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
        data () {
            return {
                // 产品对比
                showDialog: false,
                // 对比数据
                dialogData1: [],
                // 是否登录
                isLogin: false,
                // 首页导航下标
                key: '3',
                // 登录、注册导航下标
                type: 0,
                // 面包屑数据
                routes: [],
                // 显示骨架屏
                loading: true,
                // 详情数据
                listData: [],
                // 进度条状态颜色
                strokeColorNormal: '#2FAAE0',
                strokeColorError: '#D9D9D9',
                // 当前项目ID
                projectId: 0,
                // 是否吸顶
                searchBarFixed: false,
                // 立即购买是否吸顶
                divFixed: false,
                // 当前选中的tabs key
                activeKey: '1',
                // tabs锚点
                tabsAnthor: 0,
                // 悬浮窗口
                fixedDiv: 0,
                // 国际化参数
                globalarr: [],
                // 遮掩更多选项
                isVideo: true,
                // 交易规则内容动态
                certificatePurchase_rule_buy_offtake_info2: '',
                certificatePurchase_rule_buy_offtake_info3: '',
                certificatePurchase_investment_statement_info3: '',
                // 是否显示遮罩层
                isShow: false,
                // 立即认购等待
                flag: false,
                // 是否执行动画
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
                showPublicInfo: false,
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
                    otherFile: [],
                    // 是否吸底
                    isBottom: false
                }
            }
        },
        created () {
            if (process.client) {
                this.getProjectId()
                this.setIconI18n()
                this.listenI18n()
                this.initBreadcrumb()
                this.reloadTableData()
                this.initInfo()
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
            this.scrollEvent()
        },
        methods: {
            // 更新表格数据
            reloadTableData () {
                this.dialogData1 = [{
                    type: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type1'),
                    income: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td2'),
                    property: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td1'),
                    capital: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td1')
                }, {
                    type: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type2'),
                    income: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td4'),
                    property: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td3'),
                    capital: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td2')
                }, {
                    type: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type3'),
                    income: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td6'),
                    property: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td4'),
                    capital: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td4')
                }, {
                    type: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type4'),
                    income: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td7'),
                    property: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td5'),
                    capital: this.$t('CertificatePurchase.ptpurchase_tip_risk_rating_type_td6')
                }]
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
            // 页面标题国际化
            documentTitleI18n () {
                if (sessionStorage.getItem('info_projectname')) {
                    document.title = tool.intervariable(this.$t('PageTitle.passpurdetail_pagetitle'), [sessionStorage.getItem('info_projectname')])
                }
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.initBreadcrumb()
                    this.initInfo()
                    this.getPublicInfor()
                    this.setIconI18n()
                    this.reloadTableData()
                })
            },
            // 监听横向滚动条
            scrollEvent () {
                window.addEventListener('scroll', this.tabsScroll)
                window.addEventListener('resize', () => {
                    if (document.body.clientWidth < 1200) {
                        this.tabsScroll()
                    } else {
                        document.querySelector('#tabsAnthor').style.cssText = `left: auto`
                    }
                    if (this.divFixed) {
                        document.querySelector('#fixed-div').style.cssText = `left: ${document.querySelector('#tabsAnthor').offsetLeft + 1200 - 368}px !important`
                    } else {
                        if (this.isBottom) {
                            document.querySelector('#fixed-div').style.cssText = `left: 832px !important;bottom: 0px;top: unset;`
                        } else {
                            document.querySelector('#fixed-div').style.cssText = `left: 832px !important;`
                        }
                    }
                })
            },
            /**
             * 头部跟着页面横向滚动
             */
            tabsScroll () {
                let scrollTop = '-' + window.pageXOffset + 'px'
                if (document.body.clientWidth < 1200) {
                    // 兼容error页面移动端滚动
                    if (process.client) {
                        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
                        if (!flag) {
                            document.querySelector('#tabsAnthor').style.cssText = `left: ${scrollTop}`
                        }
                    }
                }
            },
            /**
             * 初始化面包屑国际化
             */
            initBreadcrumb () {
                this.routes = [{
                    path: '/computer',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_home')
                }, {
                    path: '/computer/CertificatePurchase',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts')
                }, {
                    path: '/computer/CertificatePurchase/info',
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
                if (this.listData[0].projectMaterial.imgs.length > 3) {
                    if (to > 2) {
                        let _left = (to - 3) * 190 + 130
                        document.querySelector('#carousel').firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.style.transform = `translate3d(-${_left}px, 0px, 0px)`
                    } else {
                        to === 0 ? this.isVideo = true : this.isVideo = false
                        let _left = 0
                        document.querySelector('#carousel').firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.style.transform = `translate3d(-${_left}px, 0px, 0px)`
                    }
                }
            },
            /**
             * 是否显示视频占位图
             * @param index 走马灯图片下标
             */
            getImgUrl (index) {
                let bool = this.listData[0].projectMaterial.imgs[index].type === 0
                return bool ? this.listData[0].projectMaterial.imgs[index].largeUrl : '/' + this.listData[0].projectMaterial.videoImg[0].largeUrl
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
                    let anthor1 = document.querySelector('#anthor1').offsetTop + this.tabsAnthor
                    this.scrollAnimation(anthor1)
                    break
                case '2' :
                    let anthor2 = document.querySelector('#anthor2').offsetTop + this.tabsAnthor - 40
                    this.scrollAnimation(anthor2)
                    break
                case '3' :
                    let anthor3 = document.querySelector('#anthor3').offsetTop + this.tabsAnthor - 40
                    this.scrollAnimation(anthor3)
                    break
                case '4' :
                    let anthor4 = document.querySelector('#anthor4').offsetTop + this.tabsAnthor - 40
                    this.scrollAnimation(anthor4)
                    break
                case '5' :
                    let anthor5 = document.querySelector('#anthor5').offsetTop + this.tabsAnthor - 40
                    this.scrollAnimation(anthor5)
                    break
                case '6' :
                    let anthor6 = document.querySelector('#anthor6').offsetTop + this.tabsAnthor - 40
                    this.scrollAnimation(anthor6)
                    break
                case '7' :
                    let anthor7 = document.querySelector('#anthor7').offsetTop + this.tabsAnthor - 40
                    this.scrollAnimation(anthor7)
                    break
                case '8' :
                    let anthor8 = document.querySelector('#anthor8').offsetTop + this.tabsAnthor - 40
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
                this.isBottom = false
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                // tabs吸顶
                this.searchBarFixed = scrollTop > this.tabsAnthor
                if ((document.querySelector('#fonter').offsetTop - scrollTop) < 512) {
                    this.isBottom = true
                    this.divFixed = false
                    document.querySelector('#fixed-div').style.cssText = `left: 832px !important;bottom: 0px;top: unset;`
                } else {
                    this.isBottom = false
                    // 立即购买窗口
                    this.divFixed = scrollTop > this.fixedDiv
                }
                if (scrollTop >= (document.querySelector('#anthor1').offsetTop + this.tabsAnthor)) {
                    this.activeKey = '1'
                    if (document.querySelector('#anthor8')) {
                        if (scrollTop >= (document.querySelector('#anthor8').offsetTop + this.tabsAnthor - 60)) {
                            this.activeKey = '8'
                            if (scrollTop >= (document.querySelector('#anthor2').offsetTop + this.tabsAnthor - 60)) {
                                this.activeKey = '2'
                                if (scrollTop >= (document.querySelector('#anthor3').offsetTop + this.tabsAnthor - 60)) {
                                    this.activeKey = '3'
                                    if (scrollTop >= (document.querySelector('#anthor5').offsetTop + this.tabsAnthor - 60)) {
                                        this.activeKey = '5'
                                        if (document.querySelector('#anthor7') && scrollTop >= (document.querySelector('#anthor7').offsetTop + this.tabsAnthor - 85)) {
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
                        if (scrollTop >= (document.querySelector('#anthor2').offsetTop + this.tabsAnthor - 60)) {
                            this.activeKey = '2'
                            if (scrollTop >= (document.querySelector('#anthor3').offsetTop + this.tabsAnthor - 60)) {
                                this.activeKey = '3'
                                if (scrollTop >= (document.querySelector('#anthor5').offsetTop + this.tabsAnthor - 60)) {
                                    this.activeKey = '5'
                                    if (document.querySelector('#anthor7') && scrollTop >= (document.querySelector('#anthor7').offsetTop + this.tabsAnthor - 85)) {
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
                if (this.divFixed) {
                    document.querySelector('#fixed-div').style.cssText = `left: ${document.querySelector('#tabsAnthor').offsetLeft + 1200 - 368}px !important`
                } else {
                    if (this.isBottom) {
                        document.querySelector('#fixed-div').style.cssText = `left: 832px !important;bottom: 0px;top: unset;`
                    } else {
                        document.querySelector('#fixed-div').style.cssText = `left: 832px !important;`
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
                        // 合并图片和视频、图片地址添加根路径
                        this.listData[0].projectMaterial.imgs = this.listData[0].projectMaterial.video.concat(this.listData[0].projectMaterial.imgs).map((item) => {
                            return {...item, largeUrl: '/' + item.largeUrl, fileUrl: '/' + item.fileUrl}
                        })
                        // 项目标签处理成数组
                        this.listData[0].projectMaterial.projectLabel = this.listData[0].projectMaterial.projectLabel ? this.listData[0].projectMaterial.projectLabel.split(',') : ''
                        // 状态国际化
                        this.listData[0].projectBase = {
                            ...this.listData[0].projectBase,
                            i18nState: this.issueState(this.listData[0].projectBase.issueState)
                        }
                        // 交易规则动态变量
                        this.certificatePurchase_investment_statement_info3 = tool.intervariable(this.$t('CertificatePurchase.certificatePurchase_investment_statement_info3'), [this.listData[0].projectDist.curCode, this.listData[0].projectDist.curCode])
                        this.certificatePurchase_rule_buy_offtake_info2 = tool.intervariable(this.$t('CertificatePurchase.certificatePurchase_rule_buy_offtake_info2'), [this.listData[0].projectDistSetting.userMinAmount, this.listData[0].projectDistSetting.userMaxAmount])
                        this.certificatePurchase_rule_buy_offtake_info3 = tool.intervariable(this.$t('CertificatePurchase.certificatePurchase_rule_buy_offtake_info3'), [this.listData[0].projectDist.curCode, this.listData[0].projectDist.curCode])
                        // 合并项目文件
                        this.forData(res.data.data)
                        // 添加滚动条监听
                        this.$nextTick(() => {
                            this.tabsAnthor = document.querySelector('#tabsAnthor').offsetTop - 70
                            if (document.querySelector('#fixed-div').offsetParent) {
                                this.fixedDiv = document.querySelector('#fixed-div').offsetParent.offsetTop - 150
                            }
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
                axios.post('/pto/project/publicity/get', params)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            if (res.data.data) {
                                let r = res.data.data.publicContent.replace(/\s*/g, '')
                                r = r.replace(/<p><\/p>/g, '')
                                if (r.length !== 0) {
                                    this.showPublicInfo = true
                                }
                                this.publicInfo = res.data.data.publicContent
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
                    {
                        title: this.$t('CertificatePurchase.certificatePurchase_available'),
                        dataIndex: 'ptTotalAmount',
                        key: 'ptTotalAmount',
                        scopedSlots: {customRender: 'ptTotalAmount'}
                    },
                    {
                        title: `${this.$t('CertificatePurchase.certificatePurchase_investment_quantity')} (${res.data.data.projectDist.curCode})`,
                        dataIndex: 'curAmount',
                        key: 'curAmount',
                        scopedSlots: {customRender: 'curAmount'}
                    },
                    {
                        title: this.$t('CertificatePurchase.certificatePurchase_buy_time'),
                        dataIndex: 'saleTime',
                        key: 'saleTime',
                        scopedSlots: {customRender: 'saleTime'}
                    }
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
                this.$router.push(`/computer/user/login`)
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
                this.$router.push(`/computer/CertificatePurchase/SubscribeImmediately/${this.projectId}`)
            },
            // 获取kyc认证信息
            checkKycStatus () {
                let data = {traceId: tool.UUID()}
                axios.post('/dc/user/kyc/query/user', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            if (!res.data.data) {
                                window.location.href = '/computer/user/UserCenter?getKey=6'
                            } else if (res.data.data.auditState !== 2) {
                                window.location.href = '/computer/user/UserCenter?getKey=6'
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
                axios.post('/pto/invest/balance/query', data)
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
            window.removeEventListener('scroll', this.handleScroll)
            window.removeEventListener('scroll', this.tabsScroll)
            Bus.$off('checkLange')
        },
        components: {
            FsHead,
            fonter,
            Breadcrumb,
            PtoProgress,
            FilesDown
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
        padding: 0 80px 50px;

        .title{
            font-size: 20px;
            font-weight: 600;
            line-height: 28px;
            letter-spacing: 1px;
            margin-top: 48px;
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

        .type1 {
            background-color: #2BAF2B;
        }

        .type2 {
            background-color: #91A7FF;
        }

        .type3 {
            background-color: #FFBC32;
        }

        .type4 {
            background-color: #E84E40;
        }

        .type-td-1 {
            background-color: #40B740;
        }

        .type-td-2 {
            background-color: #9CAFFF;
        }

        .type-td-3 {
            background-color: #FFC246;
        }

        .type-td-4 {
            background-color: #EA5F53;
        }

        .type-desc {
            margin-top: 32px;

            p {
                font-size:14px;
                font-weight:400;
                color:rgba(51,51,51,1);

                .value {
                    display: inline-flex;
                    width: 605px;
                    word-break: break-word;
                }
            }
        }

        /deep/.dialogTableTitle{
            color: #2EA9DF!important;
        }
        /deep/.ant-table{
            font-size: 16px;
            font-weight: 500!important;
            color: rgba(0,0,0,0.8)!important;
        }
        /deep/.ant-table-thead > tr > th{
            background-color: #E0E0E0!important;
            border-color: #E0E0E0!important;
        }
        /deep/.ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td{
            background-color: #fff!important;
        }
        /deep/.ant-table-bordered .ant-table-tbody > tr > td:not(:last-child){
            border-right-color: #fff!important;
        }
    }

    .fonter {
        z-index: 999;
    }

    /*********售罄********/
    .icon-contair {
        pointer-events: none;
        position: absolute;
        left: 255px;
        top: 180px;
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

    .projectDist-curCode {
        color: #F04134;
        width: 220px
    }

    .files-contair {
        width: 800px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .title-info-width {
        width: 740px;
    }

    .projectMaterial-introduce {
        max-width: 800px;

        /deep/ img {
            width: 100% !important;
        }
        /deep/ table p {
            margin-bottom: 0 !important;
        }
    }

    .projectIssuer-issuerName {
        display: inline-flex;
        width: 650px;
        word-break: break-word;
    }

    .projectMaterial-propertyRight {
        display: inline-flex;
        width: 240px;
    }

    .planEndTime {
        color: #2EA9DF;
        font-size: 20px
    }

    .customPaging-a {
        display: block !important;
    }

    .projectMaterial-imgs-left {
        left: 2px;
        zIndex: 9999;
        top: 419px;
    }

    .projectMaterial-imgs-right {
        right: 2px;
        top: 419px;
        zIndex: 9999;
    }

    .shadow {
        z-index: 9999;
        position: fixed;
        top: 70px;
        width: 100%;
        height: 100%;
        background: #ffffff;
        opacity: 0;
    }

    .span-text-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* For  carousel*/
    .left-div {
        width: 30px;
        height: 124px;
        background: rgba(0, 0, 0, 1);
        border-radius: 8px 0px 0px 8px;
        opacity: 0.5004;
        padding-top: 40px;
    }

    .right-div {
        padding-top: 40px;
        width: 30px;
        height: 124px;
        background: rgba(0, 0, 0, 1);
        border-radius: 0px 8px 8px 0px;
        opacity: 0.5004;
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
    }

    .ant-carousel /deep/ .slick-slide .carousel-imgs {
        position: relative;
        border-radius: 8px;
        border: 1px solid #E9E9E9;
    }

    .ant-carousel /deep/ .custom-slick-arrow {
        width: 30px;
        height: 124px;
        font-size: 25px;
        color: #fff;
        background-color: rgba(31, 45, 61, 0.11);
        opacity: 0.3;
        z-index: 999;
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
        height: 400px;
        border-radius: 8px;
    }

    .ant-carousel /deep/ .slick-thumb {
        width: 2000px;
        display: block;
        white-space: nowrap;
        height: 124px;
        bottom: -125px;
    }

    .ant-carousel /deep/ .slick-thumb li {
        display: inline-block; //使li对象显示为一行
        width: 186px;
        height: 124px;
    }

    .ant-carousel /deep/ .slick-thumb li img {
        border-radius: 8px;
        width: 186px;
        height: 124px;
        filter: grayscale(100%);
    }

    .ant-carousel /deep/ .slick-thumb li.slick-active img {
        filter: grayscale(0%);
    }

    .shadowDown-parent {
        position: relative;
        display: table;

        .shadowDown {
            left: 0;
            top: 0;
            position: absolute;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 1px;
            z-index: 200;
            height: 100%;
            width: 100%;
            font-size: 20px;
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

    .tabs-contair {
        position: relative;

        .fixed-div {
            background-color: #ffffff;
            z-index: 998;
            width: 368px;
            height: 348px;
            border-radius: 8px;
            border: 1px solid rgba(217, 217, 217, 1);
            padding: 16px;
            position: absolute;
            left: 832px;
            top: 0;

            .title {
                font-size: 20px;
                color: rgba(51, 51, 51, 1);
                line-height: 28px;
            }

            .body {
                margin: 12px 0 14px 0;
                font-size: 16px;
                font-weight: 600;
                color: rgba(51, 51, 51, 1);

                .item {
                    display: flex;
                    justify-content: space-between;

                    .item-key {
                        display: inline-block;
                        width: 196px;
                        font-size: 14px;
                        color: rgba(153, 153, 153, 1);
                    }

                    .item-value {
                        text-align: right;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: 140px;
                        font-weight: 400;
                        font-size: 14px;
                        color: rgba(51, 51, 51, 1);
                    }
                }
            }

            .now-buy {
                width: 340px;
                height: 50px;
                border-radius: 8px;
                font-size: 20px;
                line-height: 28px;
            }
        }
    }

    .total-imgs {
        z-index: 1000;
        width: 50px;
        height: 50px;
        background: #ff4500;
        position: absolute;
        right: 0px;
        bottom: 29px;
        opacity: 0;
    }

    .isFixed {
        position: fixed;
        background-color: #fff;
        top: 70px;
        z-index: 999;
        width: 1200px;
    }

    .isDivFixed {
        z-index: 998;
        position: fixed !important;
        top: 165px !important;
    }

    .ant-divider-horizontal {
        margin: 0;
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
        border-radius: 8px;
        font-size: 16px;
        line-height: 22px;
        border: none;
        padding: 2px 8px;
        height: 26px;
        margin-right: 24px;
    }

    .mg-bm-8 {
        margin-bottom: 8px;
    }

    .mg-bm-20 {
        margin-bottom: 20px;
    }

    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }

    .video {
        object-fit: fill;
        max-width: 630px;
        height: 400px;
        border-radius: 8px;
    }

    .section {
        background: #FFFFFF;

        .container {
            margin: 0 auto;
            width: 1200px;

            .content {
                padding: 0 !important;

                /deep/ .ant-tabs-bar {
                    margin: 0;

                    .ant-tabs-tab {
                        padding: 0 0 20px 0;
                        font-size: 16px;
                        font-weight: 600;
                    }
                }

                .tags-title {
                    margin-top: 40px;
                    border-left: 4px solid #2FAAE0;
                    line-height: 24px;
                    border-radius: 2px;
                    font-weight: 600;
                    color: rgba(51, 51, 51, 1);
                    padding-left: 10px;
                    font-size: 20px;
                }

                .title-info {
                    margin: 24px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: rgba(51, 51, 51, 1);

                    &.title-info-html {
                        font-weight: normal;
                    }

                    .rule-title {
                        font-weight: 500;
                        display: inline-flex;
                        width: 800px;
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
                        width: 800px;
                        font-weight: 400;
                    }

                    .theme-title {
                        margin-top: 35px;
                        font-size: 24px;
                        font-weight: 600;
                        color: rgba(51, 51, 51, 1);
                        text-align: center;
                    }

                    .theme-desc {
                        font-size: 16px;
                        font-weight: 600;
                        color: rgba(153, 153, 153, 1);
                        margin-top: 20px;
                    }

                    .theme-img {
                        display: flex;
                        flex-direction: column;

                        .img-item {
                            margin-top: 30px;
                            width: 800px;
                            height: 300px;
                            border-radius: 8px;
                        }
                    }

                    .download-file {
                        width: 28px;
                        height: 28px;
                    }

                }
            }
        }
    }

    .ant-list-item {
        padding: 0;
    }

    .skeleton {
        height: 700px;

        .title {
            width: 640px;
            display: inline-block;
            font-size: 24px;
            color: #333333;
        }

        .title-time {
            color: #999999;
            font-size: 18px;
            float: right;
        }

        .info-tag {
            margin-top: 10px;
            margin-bottom: 20px;
            width: 830px;
            height: 26px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            overflow: hidden;
            .ant-tag-has-color {
                border-radius: 8px;
                height: 26px;
                line-height: 1.4;
                font-size: 16px;
            }
        }

        .list-body {
            height: 540px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .tag-state {
                opacity: 0.8;
                z-index: 998;
                position: absolute;
                right: 548px;
                line-height: 35px;
                min-width: 100px;
                height: 40px;
                border-radius: 1px 8px 1px 17px;
                font-size: 16px;
                text-align: center;
            }

            .fangsea-img {
                overflow: hidden;
                width: 630px;
                height: 540px;
                border-radius: 8px;
            }

            .body-info-contair {
                .now-buy {
                    margin-left: 31px;
                    width: 540px;
                    margin-top: 87px;
                    height: 42px;
                    font-size: 20px;
                    border-radius: 8px;
                }

                .body-info {
                    height: 411px;
                    margin-left: 31px;
                    width: 540px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-content: space-between;
                    padding-bottom: 9px;

                    .info-item {
                        display: flex;
                        flex-direction: column;
                        width: auto;
                        text-align: left;

                        .item-title {
                            line-height: 20px;
                            font-size: 14px;
                            color: rgba(153, 153, 153, 1);
                        }

                        .item-value {
                            line-height: 30px;
                            font-size: 14px;
                            color: rgba(51, 51, 51, 1);
                        }

                        .red-value {
                            letter-spacing: 1px;
                            font-size: 16px;
                            color: rgba(34, 34, 34, 1);
                            line-height: 16px;
                        }
                    }

                    .total-price {
                        margin-top: -4px;
                        display: flex;
                        flex-direction: column;
                        width: 100%;

                        .item-title {
                            font-size: 14px;
                            color: rgba(51, 51, 51, 1);
                            line-height: 25px;
                        }

                        .item-value {
                            line-height: 32px;
                            font-size: 24px;
                            color: rgba(255, 52, 40, 1);
                            letter-spacing: 1px;
                        }
                    }
                    .broadwise-item-contair {
                        width: 100%;

                        .projectDist-ptCurCode {
                            color: #2EA9DF !important;
                        }

                        .broadwise-item {
                            display: flex;
                            flex-direction: row;
                            width: 100%;
                            justify-content: space-between;
                            font-size: 14px;
                            line-height: 28px;

                            .item-title {
                                color: rgba(153, 153, 153, 1);
                            }

                            .item-value {
                                color: rgba(51, 51, 51, 1);
                            }
                        }
                    }

                    .second-item {
                        margin-top: -30px;
                    }
                }
            }

            .info-progress {
                width: 540px;
            }
        }

        .info-address {
            margin-top: 14px;
            font-size: 20px;

            span:first-child {
                vertical-align: middle;
            }
        }
    }

    .ant-list-item-meta {
        margin-bottom: 0;
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

    .item-key {
        display: inline-block;
        width: 150px;
        font-size: 14px;
        color: rgba(153, 153, 153, 1);
    }

    .item-value {
        font-weight: 400;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
    }

    .item-col {
        display: flex;
    }

    .ant-list-item-meta-title {
        margin-bottom: 0;
    }

    #tabsAnthor {
        padding-top: 15px;
    }

</style>

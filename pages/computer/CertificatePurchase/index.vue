<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key" :SelectedType="type"/>
        <section class="section">
            <div class="container">
                <a-layout-content>
                    <!--         面包屑导航           -->
                    <Breadcrumb :routes="routes"/>
                    <div class="content">
                        <a-tabs defaultActiveKey="1" size="large" :tabBarGutter="8" @change="change" @tabClick="tabClick">
                            <!--              正在进行的PT              -->
                            <a-tab-pane :tab="$t('CertificatePurchase.certificatePurchase_underway')" key="1">
                                <div>
                                    <a-list itemLayout="vertical"
                                            size="large"
                                            :pagination="paginationNew"
                                            :dataSource="listDataNew"
                                            :locale="{emptyText: ''}">
                                        <a-list-item slot="renderItem" slot-scope="item, index" key="item.title"
                                                     class="skeleton">
                                            <!--            加载骨架屏             -->
                                            <a-skeleton :loading="loading" active :paragraph="{rows: 4}"/>
                                            <section v-if="!loading" >
                                                <!--         通证倒计时           -->
                                                <a-list-item-meta>
                                                    <template slot="title">
                                                        <span class="title" @click="setprojectname(item)">{{item.name}}</span>
                                                        <span class="title-time" v-if="item.issueState === 3">
                                                            {{$t('CertificatePurchase.certificatePurchase_distance_end')}}: {{item.planEndTime | toCountDown}}
                                                        </span>
                                                        <span class="title-time" v-else>{{item.i18nState}}</span>
                                                    </template>
                                                </a-list-item-meta>
                                                <!--         售罄图标           -->
                                                <div class="icon-contair" :class="{'icon-zh': isZh, 'icon-en': !isZh}" v-show="item.saleRatio === 100"></div>
                                                <!--         通证类型           -->
                                                <div class="info-tag">
                                                    <a-tag color="blue">{{item.projectTypeName}}</a-tag>
                                                    <a-tag color="green">{{item.projectNatureName}}</a-tag>
                                                    <a-tag class="ant-tag-redTag">{{item.propertyRight}}</a-tag>
                                                    <a-tag class="ant-tag-grayTag" :key="index" v-for="(child, index) in item.projectLabel">{{child}}</a-tag>
                                                </div>
                                                <!--         通证信息           -->
                                                <div class="list-body">
                                                    <a-tag color="#2FAAE0" class="tag-state">{{item.i18nState }}</a-tag>
                                                    <img class="fangsea-img" :src="item.imgPath" @click="setprojectname(item)"/>
                                                    <div class="body-info">
                                                        <div class="info-item">
                                                            <span class="item-title">{{$t('CertificatePurchase.certificatePurchase_project_number')}}</span>
                                                            <span class="item-value">{{item.ptCurCode}}</span>
                                                        </div>
                                                        <div class="info-item" v-if="item.projectType !== 5">
                                                            <span class="item-title">{{$t('CertificatePurchase.ptpurchase_title_annualrental')}}</span>
                                                            <span class="item-value prospective-yield">{{item.prospectiveYield}}</span>
                                                        </div>
                                                        <div class="info-item">
                                                            <span class="item-title">{{$t('CertificatePurchase.ptpurchase_title_area')}}</span>
                                                            <span class="item-value">{{item.measure}}㎡</span>
                                                        </div>
                                                        <div class="info-item">
                                                            <span class="item-title">{{$t('CertificatePurchase.ptpurchase_project_total_price')}}({{item.priceCurCode}})</span>
                                                            <span class="item-value">{{item.totalPrice | formatNumber}}</span>
                                                        </div>
                                                        <div class="info-item">
                                                            <span class="item-title">{{$t('CertificatePurchase.certificatePurchase_project_number_portion')}}</span>
                                                            <span class="item-value">{{item.totalAmount | formatNumber}}</span>
                                                        </div>
                                                        <div class="info-item">
                                                            <span class="item-title">{{item.curCode}}/{{$t('CertificatePurchase.certificatePurchase_portion')}}</span>
                                                            <span class="item-value">{{item.ptNowPrice | formatNumber}}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div @click="setprojectname(item)" class="info-bt-contair">
                                                            <a-button type="primary" block class="goInfo">
                                                                {{$t('CertificatePurchase.certificatePurchase_view_detail')}}
                                                            </a-button>
                                                        </div>
                                                        <!--         通证进度条           -->
                                                        <pto-progress class="info-progress"
                                                                      :hideTips="nowTips"
                                                                      :saleRatio="item.saleRatio"
                                                                      :successRatio="item.successRatio"
                                                                      :sellOutRatio="item.sellOutRatio"
                                                                      :issueState="item.issueState"
                                                                      :saleableAmount="item.totalAmount - item.selfAmount"
                                                                      :isFail="(item.issueState === 2 || item.issueState === 3) ? false : true">
                                                        </pto-progress>
                                                    </div>
                                                </div>
                                                <!--         通证坐标           -->
                                                <div class="info-address">
                                                    <span>
                                                        <svg t="1557975475830" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2706" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14"><defs><style type="text/css"></style></defs><path d="M512.237068 272.247087c-82.269507 0-149.265035 66.993271-149.265035 149.265035 0 82.269507 66.995529 149.265035 149.265035 149.265035s149.265035-66.995529 149.265035-149.265035c0-82.271764-66.995529-149.265035-149.265035-149.265035z m0 29.852556c66.119504 0 119.41248 53.292975 119.41248 119.412479 0 66.119504-53.292975 119.41248-119.41248 119.41248s-119.41248-53.292975-119.412479-119.41248c0-66.119504 53.292975-119.41248 119.412479-119.412479z m0-238.824959c-197.631503 0-358.237439 160.605936-358.237438 358.237438 0 117.924593 69.442977 249.989752 147.282691 354.0402 38.890506 52.125696 80.083962 97.021934 116.671518 129.439344 18.308453 16.150002 35.449627 29.184248 50.958416 38.484102 15.511046 9.268245 29.096194 15.391383 43.293204 15.391384 14.199268 0 27.784416-6.093787 43.295463-15.391384 15.508789-9.270503 32.681572-22.334101 50.987767-38.540547 36.587556-32.302262 77.753918-77.315906 116.642166-129.324197 77.898417-104.077541 147.341394-236.172051 147.341394-354.096644 0-197.631503-160.605936-358.239697-358.235181-358.239696z m0 29.854813c181.508595 0 328.382626 146.874031 328.382626 328.384883 0 105.974088-65.740195 235.122177-141.335662 336.255554-37.813538 50.552013-77.898417 94.222269-112.53298 124.776999-17.317282 15.36429-33.322785 27.405106-46.528624 35.332222-13.208096 7.931631-23.993579 11.137699-27.987617 11.137699-3.996296 0-14.781779-3.206068-27.987618-11.137699-13.205839-7.929373-29.211342-19.997284-46.526366-35.273519-34.634564-30.613432-74.7217-74.283688-112.53298-124.779257-75.595467-101.248525-141.335662-230.398871-141.335662-336.314257 0-181.508595 146.874031-328.382626 328.384883-328.382625z" fill="#515151" p-id="2707"></path></svg>
                                                    </span>
                                                    <span>{{item.regionsName | toRegionsName}}</span>
                                                    <!--         可售总量           -->
                                                    <span class="total-available">
                                                        {{$t('CertificatePurchase.certificatePurchase_remaining_quantity')}}:{{item.totalAmount - item.selfAmount | formatNumber}}
                                                    </span>
                                                </div>
                                            </section>
                                        </a-list-item>
                                    </a-list>
                                    <div v-if="!loading && paginationNew.total === 0" class="ant-list-empty-text">
                                        <a href="https://www.ptex.vip" target="_blank">{{$t('CertificatePurchase.ptpurchase_title_noitem')}}</a>
                                    </div>
                                </div>
                            </a-tab-pane>
                            <!--              往期回顾的PT              -->
                            <a-tab-pane :tab="$t('CertificatePurchase.ptpurchase_past_period_review')" key="2">
                                <div>
                                    <a-list itemLayout="vertical"
                                            size="large"
                                            :pagination="paginationOld"
                                            :dataSource="listDataOld"
                                            :locale="{emptyText: ''}">
                                        <a-list-item slot="renderItem" slot-scope="item, index" key="item.title"
                                                     class="skeleton">
                                            <!--            加载骨架屏             -->
                                            <a-skeleton :loading="oldLoading" active :paragraph="{rows: 4}"/>
                                            <section v-if="!oldLoading">
                                                <!--         售罄图标           -->
                                                <div class="icon-contair" :class="{'icon-zh': isZh, 'icon-en': !isZh}" v-show="item.saleRatio === 100"></div>
                                                <!--         通证倒计时           -->
                                                <a-list-item-meta>
                                                    <template slot="title">
                                                        <span class="title" @click="setprojectname(item)">{{item.name}}</span>
                                                    </template>
                                                </a-list-item-meta>
                                                <!--         通证类型           -->
                                                <div class="info-tag">
                                                    <a-tag color="blue">{{item.projectTypeName}}</a-tag>
                                                    <a-tag color="green">{{item.projectNatureName}}</a-tag>
                                                    <a-tag class="ant-tag-redTag">{{item.propertyRight}}</a-tag>
                                                    <a-tag class="ant-tag-grayTag" :key="index" v-for="(child, index) in item.projectLabel">{{child}}</a-tag>
                                                </div>
                                                <!--         通证信息           -->
                                                <div class="list-body">
                                                    <a-tag :color="item.issueState !== 4 ? '#8C8C8C' : '#2FAAE0' " class="tag-state">{{item.i18nState}}</a-tag>
                                                    <img class="fangsea-img" :src="item.imgPath" @click="setprojectname(item)"/>
                                                    <div class="body-info">
                                                        <div class="info-item">
                                                            <span class="item-title">{{$t('CertificatePurchase.certificatePurchase_project_number')}}</span>
                                                            <span class="item-value">{{item.ptCurCode}}</span>
                                                        </div>
                                                        <div class="info-item" v-if="item.projectType !== 5">
                                                            <span class="item-title">{{$t('CertificatePurchase.ptpurchase_title_annualrental')}}</span>
                                                            <span class="item-value prospective-yield">{{item.prospectiveYield}}</span>
                                                        </div>
                                                        <div class="info-item">
                                                            <span class="item-title">{{$t('CertificatePurchase.ptpurchase_title_area')}}</span>
                                                            <span class="item-value">{{item.measure}}㎡</span>
                                                        </div>
                                                        <div class="info-item">
                                                            <span class="item-title">{{$t('CertificatePurchase.ptpurchase_project_total_price')}}({{item.priceCurCode}})</span>
                                                            <span class="item-value">{{item.totalPrice | formatNumber}}</span>
                                                        </div>
                                                        <div class="info-item">
                                                            <span class="item-title">{{$t('CertificatePurchase.certificatePurchase_project_number_portion')}}</span>
                                                            <span class="item-value">{{item.totalAmount | formatNumber}}</span>
                                                        </div>
                                                        <div class="info-item">
                                                            <span class="item-title">{{item.curCode}}/{{$t('CertificatePurchase.certificatePurchase_portion')}}</span>
                                                            <span class="item-value">{{item.ptNowPrice | formatNumber}}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div @click="setprojectname(item)" class="info-bt-contair">
                                                            <a-button type="primary" block class="goInfo">
                                                                {{$t('CertificatePurchase.certificatePurchase_view_detail')}}
                                                            </a-button>
                                                        </div>
                                                        <!--         通证进度条           -->
                                                        <pto-progress class="info-progress"
                                                                      :hideTips="oldTips"
                                                                      :saleRatio="item.saleRatio"
                                                                      :successRatio="item.successRatio"
                                                                      :sellOutRatio="item.sellOutRatio"
                                                                      :issueState="item.issueState"
                                                                      :saleableAmount="item.totalAmount - item.selfAmount"
                                                                      :isFail="true">
                                                        </pto-progress>
                                                    </div>
                                                </div>
                                                <!--         通证坐标           -->
                                                <div class="info-address">
                                                    <span>
                                                        <svg t="1557975475830" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2706" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14"><defs><style type="text/css"></style></defs><path d="M512.237068 272.247087c-82.269507 0-149.265035 66.993271-149.265035 149.265035 0 82.269507 66.995529 149.265035 149.265035 149.265035s149.265035-66.995529 149.265035-149.265035c0-82.271764-66.995529-149.265035-149.265035-149.265035z m0 29.852556c66.119504 0 119.41248 53.292975 119.41248 119.412479 0 66.119504-53.292975 119.41248-119.41248 119.41248s-119.41248-53.292975-119.412479-119.41248c0-66.119504 53.292975-119.41248 119.412479-119.412479z m0-238.824959c-197.631503 0-358.237439 160.605936-358.237438 358.237438 0 117.924593 69.442977 249.989752 147.282691 354.0402 38.890506 52.125696 80.083962 97.021934 116.671518 129.439344 18.308453 16.150002 35.449627 29.184248 50.958416 38.484102 15.511046 9.268245 29.096194 15.391383 43.293204 15.391384 14.199268 0 27.784416-6.093787 43.295463-15.391384 15.508789-9.270503 32.681572-22.334101 50.987767-38.540547 36.587556-32.302262 77.753918-77.315906 116.642166-129.324197 77.898417-104.077541 147.341394-236.172051 147.341394-354.096644 0-197.631503-160.605936-358.239697-358.235181-358.239696z m0 29.854813c181.508595 0 328.382626 146.874031 328.382626 328.384883 0 105.974088-65.740195 235.122177-141.335662 336.255554-37.813538 50.552013-77.898417 94.222269-112.53298 124.776999-17.317282 15.36429-33.322785 27.405106-46.528624 35.332222-13.208096 7.931631-23.993579 11.137699-27.987617 11.137699-3.996296 0-14.781779-3.206068-27.987618-11.137699-13.205839-7.929373-29.211342-19.997284-46.526366-35.273519-34.634564-30.613432-74.7217-74.283688-112.53298-124.779257-75.595467-101.248525-141.335662-230.398871-141.335662-336.314257 0-181.508595 146.874031-328.382626 328.384883-328.382625z" fill="#515151" p-id="2707"></path></svg>
                                                    </span>
                                                    <span>{{item.regionsName | toRegionsName}}</span>
                                                </div>
                                            </section>
                                        </a-list-item>
                                    </a-list>
                                    <div v-if="!oldLoading && paginationOld.total === 0" class="ant-list-empty-text">
                                        {{$t('CertificatePurchase.certificatePurchase_review_past_period')}}
                                    </div>
                                </div>
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                </a-layout-content>
            </div>
        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import {toRegionsName, formatNumber, toCountDown} from '~/assets/utils/index'
    import PtoProgress from '~/components/computer/PtoProgress'
    import Breadcrumb from '~/components/computer/Breadcrumb'
    import FsHead from '~/components/computer/FangseaHeader'
    import fonter from '~/components/computer/Footer'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'

    export default {
        data () {
            // 骨架屏假数据
            const listDataNew = []
            for (let i = 0; i < 10; i++) {
                listDataNew.push({
                    saleRatio: 100,
                    prospectiveYield: 25,
                    intermediaryPrice: '11000',
                    ptNowPrice: 500,
                    measure: '89',
                    totalAmount: 9999,
                    number: 'BKK007',
                    regionsName: '泰国,普吉岛',
                    issueState: 5,
                    i18nState: '开始预售',
                    projectTypeName: '期房',
                    projectNatureName: '公寓',
                    planEndTime: '1658865565403',
                    projectId: '14',
                    href: '/computer/CertificatePurchase/info/',
                    name: `水星之城A户型-包租5年7%固定利益，每年免费入住30天，可回购`,
                    imgPath: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
                })
            }
            const listDataOld = [].concat(listDataNew)
            return {
                // 首页导航下标
                key: '3',
                // 登录、注册导航下标
                type: 0,
                // 面包屑
                routes: [],
                // 显示进行骨架屏
                loading: true,
                // 显示往期骨架屏
                oldLoading: true,
                // 正在进行列表数据
                listDataNew,
                // 往期回顾列表数据
                listDataOld,
                // 正在进行当前页
                currentNew: 1,
                // 正在进行当前页
                currentOld: 1,
                // 正在进行分页配置
                paginationNew: {
                    onChange: (currentPage) => {
                        this.currentNew = currentPage
                        this.initList(currentPage, 0)
                    },
                    hideOnSinglePage: false,
                    pageSize: 10,
                    current: 1,
                    total: 0
                },
                // 往期回顾分页配置
                paginationOld: {
                    onChange: (currentPage) => {
                        this.currentOld = currentPage
                        this.initList(currentPage, 1)
                    },
                    hideOnSinglePage: false,
                    pageSize: 10,
                    current: 1,
                    total: 0
                },
                // 售罄图标是否是中文
                isZh: true,
                // 正在进行是否隐藏Tips
                nowTips: false,
                // 往期回顾是否隐藏Tips
                oldTips: false,
                // 当前tabs下标
                tabsKey: '1'
            }
        },
        // 初始化数据
        created () {
            if (process.client) {
                this.listenI18n()
                this.initBreadcrumb()
                this.setIconI18n()
                this.initList(1, 0)
            }
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
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.initBreadcrumb()
                    this.setIconI18n()
                    this.initList(this.currentNew, 0)
                    this.initList(this.currentOld, 1)
                })
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
                }]
            },
            /**
             * 查询购买列表
             * @param currentPage  当前页
             * @param type 列表类型 0正在进行 1往期回顾
             */
            initList (currentPage, type) {
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        pageNum: currentPage,
                        pageSize: 10,
                        filter: {
                            issueType: type
                        }
                    }
                }
                axios.post('/pto/list', data).then((res) => {
                    if (res.data.code.toString() === '0') {
                        if (type === 0) {
                            this.paginationNew.current = currentPage
                            this.paginationNew.total = res.data.data.total
                            res.data.data.total === 0 ? this.paginationNew.hideOnSinglePage = true : this.paginationNew.hideOnSinglePage = false
                            if (res.data.data.list) {
                                this.listDataNew = res.data.data.list.map((item) => {
                                    return {...item, i18nState: this.issueState(item.issueState), imgPath: '/' + item.imgPath, projectLabel: item.projectLabel ? item.projectLabel.split(',') : ''}
                                })
                            }
                            this.loading = false
                        } else {
                            this.paginationOld.current = currentPage
                            this.paginationOld.total = res.data.data.total
                            res.data.data.total === 0 ? this.paginationOld.hideOnSinglePage = true : this.paginationOld.hideOnSinglePage = false
                            if (res.data.data.list) {
                                this.listDataOld = res.data.data.list.map((item) => {
                                    return {...item, i18nState: this.issueState(item.issueState), imgPath: '/' + item.imgPath, projectLabel: item.projectLabel ? item.projectLabel.split(',') : ''}
                                })
                            }
                            this.oldLoading = false
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
             * 状态添加国际化
             * @param val 状态码
             */
            issueState (val) {
                let state
                //  0创建、1未发行、2等待预售、3开始预售、4预售完成、5预售失败、6已发行、7已取消
                switch (val) {
                case 0 : state = this.$t('CertificatePurchase.certificatePurchase_status_found'); break
                case 1 : state = this.$t('CertificatePurchase.certificatePurchase_status_unissued'); break
                case 2 : state = this.$t('CertificatePurchase.certificatePurchase_status_wait'); break
                case 3 : state = this.$t('CertificatePurchase.certificatePurchase_status_start'); break
                case 4 : state = this.$t('CertificatePurchase.certificatePurchase_status_completed'); break
                case 5 : state = this.$t('CertificatePurchase.certificatePurchase_status_failure'); break
                case 6 : state = this.$t('CertificatePurchase.certificatePurchase_status_issued'); break
                default: state = this.$t('CertificatePurchase.certificatePurchase_status_canceled')
                }
                return state
            },
            /**
             * tabs切换后查询列表
             * @param key 下标
             */
            change (key) {
                let _this = this
                this.tabsKey = key
                setTimeout(() => {
                    _this.initList(1, key === '1' ? 0 : 1)
                }, 300)
            },
            /**
             * tabs点击切换
             * @param activeKey 下标
             */
            tabClick (activeKey) {
                if (this.tabsKey !== activeKey) {
                    if (activeKey === '1') {
                        this.loading = true
                        this.nowTips = false
                        this.oldTips = true
                    } else {
                        this.oldLoading = true
                        this.nowTips = true
                        this.oldTips = false
                    }
                }
            },
            /**
             * 前往详情
             * @data 项目数据
             */
            setprojectname (data) {
                sessionStorage.setItem('info_projectname', data.name)
                this.$router.push(`/computer/CertificatePurchase/info/${data.projectId}`)
            }
        },
        filters: {
            toCountDown,
            toRegionsName,
            formatNumber
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        components: {
            FsHead,
            fonter,
            Breadcrumb,
            PtoProgress
        },
        head () {
            return {
                title: this.$t('PageTitle.passpurlist_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    /*********售罄********/
    .icon-contair {
        pointer-events: none;
        position: absolute;
        left: 710px;
        top: 60px;
        width: 200px;
        height: 156px;
        z-index: 998;
    }

    .icon-zh {
        background: url("/content/certificatePurchase/200_zh.png");
    }

    .icon-en {
        background: url("/content/certificatePurchase/200_en.png");
    }
    /*********售罄********/

    .prospective-yield {
        color: #FF3428 !important;
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
        border-radius:8px;
        border: none;
        font-size: 12px;
        padding: 0 8px;
        line-height: 18px;
    }

    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }

    .section {
        background: #FFFFFF;

        .container {
            margin: 0 auto;
            width: 1200px;

            .content {
                padding: 0 !important;
            }

            /deep/ .ant-tabs-bar {
                margin: 0;
                padding-left: 20px;
                border-radius: 8px;
                border: 1px solid rgba(234, 234, 234, 1);

                .ant-tabs-ink-bar {
                    left: 15px;
                    width: 65px !important;
                }
            }
        }
    }

    .skeleton {
        position: relative;
        margin: 24px 0;
        padding: 16px 35px;
        border-radius: 8px;
        border: 1px solid rgba(234, 234, 234, 1) !important;

        .title {
            cursor: pointer;
            width: 640px;
            display: inline-block;
            font-size: 18px;
            color: #333333;
        }

        .title-time {
            float: right;
            font-size: 16px;
            color: rgba(47, 170, 224, 1);
        }

        .info-tag {
            width: 664px;
            height: 22px;
            overflow: hidden;
            margin-bottom: 24px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
        }

        .list-body {
            height: 136px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            position: relative;

            .tag-state {
                text-align: center;
                min-width: 60px;
                height: 24px;
                border-radius: 0px 8px 0px 12px;
                position: absolute;
                right: 927px;
                line-height: 20px;
            }

            .fangsea-img {
                cursor: pointer;
                width:193px;
                height:136px;
                border-radius: 8px;
                border: 1px solid #E9E9E9;
            }

            .body-info {
                margin-left: 30px;
                width: 580px;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                align-items: flex-end;

                .info-item {
                    display: flex;
                    flex-direction: column;
                    width: 33%;

                    .item-title {
                        line-height: 20px;
                        font-size:14px;
                        color:rgba(153,153,153,1);
                    }

                    .item-value {
                        line-height: 20px;
                        font-size: 18px;
                        color: #222222;
                        white-space: normal;
                        overflow: hidden;
                        overflow-wrap: break-word;

                    }
                }

                .second-item {
                    padding-top: 10px;
                }
            }

            .info-bt-contair {
                text-align: right;

                .goInfo {
                    font-size:16px;
                    width:120px;
                    height:36px;
                    border-radius:20px;
                }
            }

            .info-progress {
                margin-top: 30px;
                width: 320px;
                height: 58px;
            }

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
        }

        .info-address {
            margin-top: 14px;

            span:first-child {
                vertical-align: middle;
            }
        }

        .total-available {
            float: right;
            font-size:14px;
            font-weight:400;
            color:rgba(34,34,34,1);
        }
    }

    /deep/ .ant-list-pagination {
        margin: 40px 0;
        text-align: center;
    }

    .ant-list-item-meta {
        margin-bottom: 0;
    }

    .ant-tag-has-color {
        border-radius: 8px;
        height: 18px;
        line-height: 1.4;
    }
</style>

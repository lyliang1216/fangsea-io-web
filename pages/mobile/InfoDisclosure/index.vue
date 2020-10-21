<template>
    <a-spin :spinning="spinning">
        <a-layout id="components-layout-mobile-top" class="layout" ref="mobile-top" :class="drawer">
        <fs-head :SelectedKey="key"
                 :SelectedType="type"
                 :centerKey="centerKey"
                 @openDrawer="openDrawer"
                 @closeDrawer="closeDrawer"
                 style="z-index: 999;"
                 :style="{position:isFilterShow?'fixed':'relative', zIndex: '999'}"/>
        <a-locale-provider :locale="localeLange">
            <section class="section" >
                <div class="container">
                    <a-layout-content>
                        <!--         面包屑导航           -->
                        <Breadcrumb :routes="routes"/>
                        <div class="content">
                            <div class="menu-box" v-if="isFilterShow">
                                <a-tabs :defaultActiveKey="0" tabPosition="left" type="card" @change="resetTabpane"
                                        v-model="activeTabsKey" :tabBarStyle="{width: '36.67vw'}">
                                    <template v-for="item in menuList">
                                        <a-tab-pane :key="item.id">
                                            <div class="tabsItem" slot="tab">
                                                {{item.categoryName}}
                                            </div>
                                            <div class="filterBox">
                                                <div class="firstItem">
                                                    <div class="itemTitle mailTitle" @click="titleClick(item.id)"
                                                         :class="item.id === leftMenuKey ? 'filterItemClicked' : ''">
                                                        <span>{{$t('infoDisclosure.infoDisclosure_filter_all')}}</span>
                                                    </div>
                                                </div>
                                                <div class="firstItem" v-for="childItem in item.children">
                                                    <div class="itemTitle" @click="titleClick(childItem.id)"
                                                         :class="childItem.id === leftMenuKey ? 'filterItemClicked' : ''">
                                                        <span>{{childItem.categoryName}}</span>
                                                    </div>
                                                    <div class="secItem" v-for="childrenItem in childItem.children">
                                                        <div class="secItemTitle" @click="titleClick(childrenItem.id)"
                                                             :class="childrenItem.id === leftMenuKey ? 'filterItemClicked' : ''">
                                                            {{childrenItem.categoryName}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a-tab-pane>
                                    </template>
                                </a-tabs>
                            </div>
                            <div class="content-right-box" :style="{display:isFilterShow?'none':'block'}">
                                <div class="search-box">
                                    <a-input-group compact>
                                        <a-select dropdownClassName="disclosureSelectDropdown"
                                                  v-model="searchData.selectVal" class="search-select" size="large"
                                                  @change="handleChange">
                                            <a-select-opt-group>
                                                <span slot="label">{{$t('infoDisclosure.infoDisclosure_search_select_lable_result')}}</span>
                                                <a-select-option value="allResult">
                                                    {{$t('infoDisclosure.infoDisclosure_search_select_option_fullText')}}
                                                </a-select-option>
                                                <a-select-option value="title">
                                                    {{$t('infoDisclosure.infoDisclosure_search_select_option_title')}}
                                                </a-select-option>
                                                <a-select-option value="content">
                                                    {{$t('infoDisclosure.infoDisclosure_search_select_option_content')}}
                                                </a-select-option>
                                                <a-select-option value="attachment">
                                                    {{$t('infoDisclosure.infoDisclosure_search_select_option_attachment')}}
                                                </a-select-option>
                                                <a-select-option value="ptcode">
                                                    {{$t('CertificatePurchase.certificatePurchase_project_number')}}
                                                </a-select-option>
                                            </a-select-opt-group>
                                            <a-select-opt-group
                                                    :label="$t('infoDisclosure.infoDisclosure_search_select_lable_allInfo')"
                                                    v-if="leftMenuKey !== 0">
                                                <a-select-option value="all">
                                                    {{$t('infoDisclosure.infoDisclosure_search_select_option_fullText')}}
                                                </a-select-option>
                                            </a-select-opt-group>
                                        </a-select>
                                        <div class="my-code-search">{{searchSelData}}</div>
                                        <a-input-search v-model="searchData.inputVal" style="width: 65%;"
                                                        :placeholder="$t('infoDisclosure.infoDisclosure_search_input_placeholder')"
                                                        @focus="inputFocused = true"
                                                        @blur="inputFocused = false"
                                                        @search="searchList" size="large">
                                            <a-button slot="enterButton" :class="inputFocused ? 'inputFocusedBtn' : ''">
                                                <a-icon type="search"/>
                                            </a-button>
                                        </a-input-search>
                                    </a-input-group>
                                </div>
                                <div class="list-box">
                                    <div class="listTitle">
                                        <span class="titleText">{{listTitle}}</span>
                                        <span class="screen" @click="showFilter">
                                            {{$t('PositionPlan.positionPlan_search_placeholder')}}
                                            <img src="/global/filter.png" alt=""/>
                                        </span>
                                    </div>
                                    <a-list
                                            itemLayout="horizontal"
                                            :dataSource="serverListData"
                                            :locale="{emptyText: $t('NoData.NoData_table')}"
                                    >
                                        <a-list-item slot="renderItem" slot-scope="item, index" @click="setprojectname(item)">
                                            <span slot="actions" v-if="!isToday(item.appointmentTime)">
                                                {{item.appointmentTime | parseTime('{y}-{m}-{d}')}}
                                            </span>
                                            <span slot="actions"
                                                  v-else>{{item.appointmentTime | parseTime('{h}:{i}')}}</span>
                                            <a-list-item-meta>
                                                <a slot="title">{{item.title}}</a>
                                            </a-list-item-meta>
                                        </a-list-item>
                                    </a-list>

                                    <!-- 分页 -->
                                    <div class="info-disclosure-list-pages"
                                         v-if="pagesData.total!==0 && pagesData.pages>1">
                                        <a-pagination
                                                class="list-pagination"
                                                :hideOnSinglePage="true"
                                                @change="changepag"
                                                :defaultCurrent="1"
                                                :defaultPageSize="pagesData.pageSize"
                                                :total="pagesData.total"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a-layout-content>
                </div>
            </section>
        </a-locale-provider>
        <fonter/>
    </a-layout>
    </a-spin>
</template>

<script>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW'
    import enUS from 'ant-design-vue/lib/locale-provider/en_US'
    import Breadcrumb from '~/components/mobile/Breadcrumb'
    import FsHead from '~/components/mobile/FangseaHeader'
    import fonter from '~/components/mobile/Footer'
    import {removeSpaces} from '~/assets/utils/rules'
    import {parseTime} from '~/assets/utils/index'
    import LeftMenu from './components/leftMenu'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'

    export default {
        /**
         * 服务端拉取信息披露初始数据
         * @param req
         */
        async asyncData ({req}) {
            if (process.server) {
                // 获取左侧菜单数据
                let serverMenuData = []
                let serverListData = []
                let pagesData = {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0,
                    pages: ''
                }
                // 列表请求参数
                let p1 = new Promise((resolve, reject) => {
                    axios.post(`${tool.getAddress(req)}/article/category/open/query`, {traceId: tool.UUID()})
                        .then(res => {
                            resolve(res)
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
                let p2 = new Promise((resolve, reject) => {
                    let listReqData = {
                        traceId: tool.UUID(),
                        data: {
                            pageNum: 1,
                            pageSize: 10,
                            filter: {
                                categoryId: 0
                            }
                        }
                    }
                    axios.post(`${tool.getAddress(req)}/dc/article/list`, listReqData)
                        .then(res => {
                            resolve(res)
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
                return Promise.all([p1, p2]).then((array) => {
                    // 处理左侧菜单服务端请求数据
                    if (array[0].data.code.toString() === '0' && array[0].data.data) {
                        serverMenuData = array[0].data.data
                    }
                    // 处理列表请求数据
                    if (array[1].data.code.toString() === '0') {
                        serverListData = array[1].data.data.list
                        pagesData.total = array[1].data.data.total
                        pagesData.pageNum = array[1].data.data.pageNum
                        pagesData.pages = array[1].data.data.pages
                    }
                    return {serverMenuData, serverListData, pagesData}
                })
            } else {
                return {
                    serverMenuData: [],
                    serverListData: [],
                    pagesData: {
                        pageNum: 1,
                        pageSize: 10,
                        total: 0,
                        pages: ''
                    }}
            }
        },
        data () {
            return {
                // 组件国际化
                localeLange: zhTW,
                // 首页导航下标
                key: 8,
                // 登录、注册导航下标
                type: 0,
                // 用户中心导航下标
                centerKey: 0,
                // 抽屉切换动画
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 面包屑
                routes: [],
                openKeys: [0],
                // 列表数据
                data: [],
                // 服务端列表数据
                serverListData: [],
                // 左侧菜单数据
                menuList: [],
                // 服务端左侧菜单数据
                serverMenuData: [],
                // 左侧菜单原始数据
                originalMenuList: [],
                // 分页数据
                pagesData: {
                    // 当前页
                    pageNum: 1,
                    // 每页条数
                    pageSize: 10,
                    // 总条数
                    total: 0,
                    // 总页数
                    pages: ''
                },
                // 查询数据绑定
                searchData: {
                    selectVal: 'allResult',
                    inputVal: ''
                },
                // 查询下拉框显示文字
                searchSelData: this.$t('infoDisclosure.infoDisclosure_search_select_lable_result'),
                leftMenuKey: 0,
                searchLoading: false,
                // 是否显示菜单
                isFilterShow: false,
                // 初始菜单
                initMenu: [],
                // tab切换
                activeTabsKey: 0,
                // 列表显示title
                listTitle: this.$t('infoDisclosure.infoDisclosure_leftMenu_default'),
                // 搜索输入框是否获得焦点
                inputFocused: false,
                // 等待效果
                spinning: false
            }
        },
        created () {
            if (process.client) {
                if (this.serverMenuData.length === 0) {
                    this.getLeftMenu()
                } else {
                    this.funcHandleLeftMenuData(this.serverMenuData)
                }
                if (this.serverListData.length === 0) {
                    this.getInfoList()
                }
                this.setLocaleLange()
                this.initBreadcrumb()
                this.listenI18n()
            }
        },
        // 初始化数据
        mounted () {
            this.searchData.inputVal = sessionStorage.getItem('disclosure_searchinfo') ? sessionStorage.getItem('disclosure_searchinfo') : ''
        },
        methods: {
            /**
             * 获取列表
             */
            getInfoList () {
                this.spinning = true
                let data = {
                    traceId: tool.UUID(),
                    data: {
                        pageNum: this.pagesData.pageNum,
                        pageSize: this.pagesData.pageSize,
                        filter: {
                            categoryId: this.leftMenuKey
                        }
                    }
                }
                switch (this.searchData.selectVal) {
                case 'allResult':
                    if (this.searchData.inputVal !== '') {
                        data.data.filter['allInfo'] = this.searchData.inputVal
                        this.searchSelData = this.$t('infoDisclosure.infoDisclosure_search_select_lable_result')
                    }
                    break
                case 'title':
                    data.data.filter['title'] = this.searchData.inputVal
                    break
                case 'content':
                    data.data.filter['content'] = this.searchData.inputVal
                    break
                case 'attachment':
                    data.data.filter['attachment'] = this.searchData.inputVal
                    break
                case 'ptcode':
                    data.data.filter['ptCurCode'] = this.searchData.inputVal
                    break
                case 'all':
                    sessionStorage.setItem('disclosure_searchinfo', this.searchData.inputVal)
                    window.open('/computer/InfoDisclosure')
                    return
                }
                for (let i in data.data.filter) {
                    data.data.filter[i] = removeSpaces(data.data.filter[i])
                }
                for (let j in this.searchData) {
                    this.searchData[j] = removeSpaces(this.searchData[j])
                }
                axios.post('/dc/article/list', data).then((res) => {
                    if (res.data.code.toString() === '0') {
                        this.serverListData = res.data.data.list
                        this.pagesData.total = res.data.data.total
                        this.pagesData.pageNum = res.data.data.pageNum
                        this.spinning = false
                        this.pagesData.pages = res.data.data.pages
                        this.handleListTitle()
                    } else {
                        this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                    }
                })
            },
            /**
             * 获取左侧菜单
             */
            getLeftMenu () {
                let data = {
                    traceId: tool.UUID()
                }
                axios.post('/article/category/open/query', data).then((res) => {
                    if (res.data.code.toString() === '0' && res.data.data) {
                        this.funcHandleLeftMenuData(res.data.data)
                    } else {
                        this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                    }
                })
            },
            // 处理左侧菜单数据
            funcHandleLeftMenuData (res) {
                let list = res
                this.originalMenuList = res
                list.sort(sortId)

                function sortId (a, b) {
                    return a.sort - b.sort
                }

                let menuList_ = [{
                    categoryName: this.$t('infoDisclosure.infoDisclosure_leftMenu_default'),
                    id: 0,
                    parentId: 0,
                    sort: 1,
                    status: 0
                }]
                if (list.length !== 0) {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].parentId === 0) {
                            menuList_.push(list[i])
                            this.openKeys.push(list[i].id)
                            list.splice(i, 1)
                            i--
                        }
                    }
                    this.menuList = this.childMenu(list, menuList_)
                    // this.titleClick(this.leftMenuKey)
                } else {
                    this.menuList = menuList_
                }
            },
            /**
             * 循环menu子集
             */
            childMenu (list, menu) {
                if (list && list.length !== 0) {
                    for (let i = 0; i < menu.length; i++) {
                        for (let j = 0; j < list.length; j++) {
                            if (list[j].parentId === menu[i].id) {
                                if (!menu[i].children) {
                                    menu[i].children = []
                                }
                                menu[i].children.push(list[j])
                                this.openKeys.push(list[j].id)
                                list.splice(j, 1)
                                j--
                            }
                        }
                        if (menu[i].children) {
                            let childMenu = menu[i].children
                            for (let k = 0; k < childMenu.length; k++) {
                                for (let o = 0; o < list.length; o++) {
                                    if (list[o].parentId === childMenu[k].id) {
                                        if (!childMenu[k].children) {
                                            childMenu[k].children = []
                                        }
                                        childMenu[k].children.push(list[o])
                                        this.openKeys.push(list[o].id)
                                        list.splice(o, 1)
                                        o--
                                    }
                                }
                            }
                        }
                    }
                }
                return menu
            },
            /*
            *  显示菜单
            * */
            showFilter () {
                this.isFilterShow = !this.isFilterShow
                if (this.isFilterShow) {
                    document.getElementsByClassName('header')[0].setAttribute('style', 'position: fixed;width: 100%;z-index: 999')
                } else {
                    document.getElementsByClassName('header')[0].setAttribute('style', 'position: relative;width: 100%')
                }
            },
            /**
             * 初始化面包屑国际化
             */
            initBreadcrumb () {
                this.routes = [{
                    path: '/mobile',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_home')
                }, {
                    path: '/mobile/InfoDisclosure',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_infoDisclosure')
                }]
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.setLocaleLange()
                    if (this.leftMenuKey === 0) {
                        this.listTitle = this.$t('infoDisclosure.infoDisclosure_leftMenu_default')
                    }
                    this.getLeftMenu()
                    this.getInfoList()
                    this.initBreadcrumb()
                    this.handleChange(this.searchData.selectVal)
                })
            },
            /**
             * 前往详情
             * @data 项目数据
             */
            setprojectname (data) {
                this.$router.push(`/mobile/InfoDisclosure/DisclosureDetail/${data.id}`)
            },

            /**
             * 点击分页
             */
            changepag (page) {
                this.pagesData.pageNum = page
                this.getInfoList()
            },
            // 左侧菜单点击
            titleClick (key) {
                this.leftMenuKey = key
                this.searchData.selectVal = 'allResult'
                this.searchData.inputVal = ''
                this.searchSelData = this.$t('infoDisclosure.infoDisclosure_search_select_lable_result')
                this.pagesData.pageNum = 1
                this.handleListTitle()
                this.getInfoList()
                this.showFilter()
            },
            handleListTitle () {
                for (let i = 0; i < this.menuList.length; i++) {
                    if (this.leftMenuKey === 0) {
                        this.listTitle = this.$t('infoDisclosure.infoDisclosure_leftMenu_default')
                    } else {
                        if (this.leftMenuKey === this.menuList[i].id) {
                            this.listTitle = this.menuList[i].categoryName
                        } else if (this.menuList[i].children !== undefined) {
                            for (let j = 0; j < this.menuList[i].children.length; j++) {
                                if (this.leftMenuKey === this.menuList[i].children[j].id) {
                                    this.listTitle = this.menuList[i].children[j].categoryName
                                } else if (this.menuList[i].children[j].children !== undefined) {
                                    for (let k = 0; k < this.menuList[i].children[j].children.length; k++) {
                                        if (this.leftMenuKey === this.menuList[i].children[j].children[k].id) {
                                            this.listTitle = this.menuList[i].children[j].children[k].categoryName
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            resetTabpane () {
                this.initMenu = []
            },
            // 点击搜索
            searchList (val) {
                this.searchData.inputVal = val
                sessionStorage.removeItem('disclosure_searchinfo')
                this.getInfoList()
            },
            // select改变事件监听
            handleChange (val) {
                this.searchData.selectVal = val
                switch (this.searchData.selectVal) {
                case 'allResult':
                    this.searchSelData = this.$t('infoDisclosure.infoDisclosure_search_select_lable_result')
                    break
                case 'title':
                    this.searchSelData = this.$t('infoDisclosure.infoDisclosure_search_select_option_title')
                    break
                case 'content':
                    this.searchSelData = this.$t('infoDisclosure.infoDisclosure_search_select_option_content')
                    break
                case 'attachment':
                    this.searchSelData = this.$t('infoDisclosure.infoDisclosure_search_select_option_attachment')
                    break
                case 'ptcode':
                    this.searchSelData = this.$t('CertificatePurchase.certificatePurchase_project_number')
                    break
                case 'all':
                    this.searchSelData = this.$t('infoDisclosure.infoDisclosure_search_select_lable_allInfo')
                    break
                }
            },
            isToday (date) {
                return new Date(date * 1000).toDateString() === new Date().toDateString()
            },
            // 开启右侧抽屉导航
            openDrawer () {
                this.drawer = {'drawer-containel-left': true, 'drawer-containel-right': false}
            },
            // 关闭右侧抽屉导航
            closeDrawer () {
                this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': true}
                let _this = this
                this.loading = true
                setTimeout(function () {
                    _this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': false}
                }, 200)
                setTimeout(function () {
                    _this.initBreadcrumb()
                }, 500)
            },
            // 设置语言参数
            setLocaleLange () {
                switch (Cookie.get('language')) {
                case 'zh_CN':
                    this.localeLange = zhCN
                    break
                case 'zh_TW':
                    this.localeLange = zhTW
                    break
                case 'en_US':
                    this.localeLange = enUS
                    break
                }
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        components: {
            FsHead,
            fonter,
            LeftMenu,
            Breadcrumb
        },
        filters: {
            // 时间格式化
            parseTime
        },
        head () {
            return {
                title: this.$t('PageTitle.infoDisclosure_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>

    .text-ellipsis-lines(@line:2) {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        /*! autoprefixer: ignore next */
        -webkit-box-orient: vertical;
        -webkit-line-clamp: @line;
    }

    .section {
        background: #FFFFFF;

        .container {
            margin: 0 auto;
            width: 100%;

            .content {
                padding: 0 0 20px !important;
                .menu-box {
                    width: 100vw;
                    height: 100vh;
                    position: fixed;
                    top: 0.44rem;
                    left: 0;
                    background-color: #ffffff;
                    z-index: 999;
                    /deep/ .ant-tabs {
                        .ant-tabs-left-bar {
                            .ant-tabs-nav-container-scrolling{
                                padding: 0;
                            }
                            .ant-tabs-tab-prev, .ant-tabs-tab-next{
                                display: none;
                            }
                            .ant-tabs-nav {
                                height: ~'calc(100vh - 44px)';
                                overflow: auto;
                                background-color: #FAFAFA;
                                padding-bottom: 70px;
                                -webkit-overflow-scrolling: touch;
                            }
                            .ant-tabs-tab {
                                text-align: left;
                                padding: 5px 9px;
                                margin: 0;
                                color: #333333;
                                height: 70px;
                                border: none;
                                border-radius: unset;
                                word-break: break-all;
                                display: flex;
                                align-items: center;
                                &.ant-tabs-tab-active {
                                    background-color: #fff;
                                    color: #2EA9DF;
                                    position: relative;
                                    &:after {
                                        content: '';
                                        display: inline-block;
                                        height: 56px;
                                        width: 4px;
                                        position: absolute;
                                        left: 0;
                                        top: 7px;
                                        background-color: #2EA9DF;
                                    }
                                }
                                .tabsItem {
                                    word-break: break-all;
                                    width: 100%;
                                    font-size: 14px;
                                    line-height: 20px;
                                    white-space: normal;
                                }
                            }
                            .ant-tabs-ink-bar {
                                left: 0;
                                height: 56px !important;
                                width: 4px;
                            }
                        }
                        .ant-tabs-left-content{
                            padding: 0 8px 70px;
                            border-left: none;
                            height: calc(100vh - 44px);
                            overflow: auto;
                            -webkit-overflow-scrolling: touch;
                            .filterBox{
                                padding: 0 8px;
                                .firstItem{
                                    width: 100%;
                                    border-bottom: 1px solid #F1F1F1;
                                    &:last-child {
                                        border-bottom: none;
                                    }
                                    .filterItemClicked {
                                        color: #2EA9DF!important;
                                    }
                                    .itemTitle{
                                        font-size: 14px;
                                        line-height: 20px;
                                        border-radius: unset;
                                        word-break: break-all;
                                        white-space: normal;
                                        display: flex;
                                        align-items: center;
                                        height: 50px;
                                        color: #333333;
                                        &.mailTitle{
                                            font-size: 16px;
                                            line-height: 22px;
                                            font-weight: bold;
                                        }
                                        span{
                                            display: inline-block;
                                            position: relative;
                                            word-break: break-word;
                                            white-space: normal;
                                            &:before{
                                                content: '';
                                                display: inline-block;
                                                position: absolute;
                                                width: 4px;
                                                height: 4px;
                                                background-color: #D9D9D9;
                                                border-radius: 50%;
                                                top: 8px;
                                                left: -8px;
                                            }
                                        }
                                    }
                                    .secItem{
                                        padding-left: 16px;
                                        .secItemTitle{
                                            font-size: 12px;
                                            line-height: 16px;
                                            border-radius: unset;
                                            word-break: break-all;
                                            white-space: normal;
                                            display: flex;
                                            align-items: center;
                                            height: 40px;
                                            color: #666666;
                                            span{
                                                display: inline-block;
                                                position: relative;
                                                &:before{
                                                    content: '';
                                                    display: inline-block;
                                                    position: absolute;
                                                    width: 4px;
                                                    height: 4px;
                                                    background-color: #D9D9D9;
                                                    border-radius: 50%;
                                                    top: 8px;
                                                    left: -8px;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .ant-menu-item-selected {
                        background-color: #ffffff;
                        color: #2EA9DF;
                        &:after {
                            display: none;
                        }
                    }
                    .ant-menu {
                        width: ~'calc(100% - 1px)';
                        border-right: none;
                    }
                    .blockSpan {
                        display: inline-block;
                        pointer-events: none;
                        width: 100%;
                        word-break: break-all;
                        word-wrap: break-word;
                        white-space: normal;
                        i{
                            color: #d9d9d9;
                        }
                    }
                    /deep/ .ant-menu-inline .ant-menu-item, .ant-menu-inline .ant-menu-submenu-title {
                        width: 100%;
                        padding-right: 0;
                    }
                    .firstMenu{
                        padding-left: 0!important;
                        height: auto;
                        /deep/.ant-menu-submenu-title{
                            height: 60px;
                            line-height: 20px;
                            display: flex;
                            align-items: center;
                        }
                    }
                    .listCircle{
                        position: relative;
                        line-height: 20px;
                        padding-right: 16px;
                        word-break: break-all;
                        word-wrap: break-word;
                        white-space: normal;
                        .jumpIcon{
                            float: right;
                            line-height: 20px;
                            font-size: 8px;
                            margin-right: 0;
                            position: absolute;
                            right: 0;
                            top: 0;
                        }
                        &:before{
                            content: '';
                            display: inline-block;
                            position: absolute;
                            width: 4px;
                            height: 4px;
                            background-color: #D9D9D9;
                            border-radius: 50%;
                            top: 8px;
                            left: -12px;
                        }
                    }
                    /deep/ .ant-menu-submenu-arrow {
                        &:before, &:after {
                            pointer-events: none;
                            background-image: linear-gradient(to right, #D9D9D9, #D9D9D9);
                        }
                    }
                    /deep/ .disclosure-menu-blue {
                        color: #2EA9DF !important;
                        .ant-menu-submenu-arrow {
                            &:before, &:after {
                                background-image: linear-gradient(to right, #2EA9DF, #2EA9DF);
                            }
                        }
                        i{
                            color: #2EA9DF;
                        }
                    }
                }
                .content-right-box {
                    width: 100%;
                    padding-bottom: 52px;
                    .search-box {
                        width: 93.33%;
                        margin: 24px auto 0;
                        .search-select {
                            width: 35%;
                            height: 40px;
                            /deep/ .ant-select-selection-selected-value {
                                font-size: 14px;
                            }
                        }
                        /deep/ .ant-input-search-button {
                            font-size: 14px;
                            width: 50px;
                            border-left: none;
                            color: #D8D8D8;
                            &.inputFocusedBtn {
                                color: #ffffff;
                                background-color: #2EA9DF;
                            }
                        }
                        /deep/ .ant-input {
                            font-size: 14px;
                        }
                        /deep/ .my-code-search {
                            top: 1px !important;
                            width: 90px !important;
                            z-index: 99;
                            color: rgba(0, 0, 0, 0.45);
                            pointer-events: none;
                            width: 68px;
                            height: 38px;
                            background-color: #ffffff;
                            position: absolute;
                            left: 1px;
                            top: -9px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 6px;
                        }
                    }
                    .list-box {
                        margin-top: 18px;
                        .listTitle {
                            width: 100%;
                            padding: 0 12px;
                            background-color: #FAFAFA;
                            span {
                                display: inline-block;
                                line-height: 38px;
                                &.titleText {
                                    max-width: ~'calc(100% - 60px)';
                                    font-size: 14px;
                                    font-weight: 500;
                                    color: #333333;
                                }
                                &.screen {
                                    font-size: 12px;
                                    color: #666666;
                                    vertical-align: top;
                                    float: right;
                                    img {
                                        width: 12px;
                                        margin-top: -2px;
                                    }
                                }
                            }
                        }
                        .ant-list-item {
                            padding: 16px 12px;
                            border-bottom: 1px solid #F1F1F1;
                            display: block;
                            h4 {
                                width: ~'calc(100vw - 24px)';
                                .text-ellipsis-lines(2);
                            }
                            a {
                                color: #333333;
                                font-size: 14px;
                                line-height: 20px;
                                &:hover {
                                    color: #333333;
                                }
                            }
                            /deep/ .ant-list-item-action {
                                margin-left: 0 !important;
                                span {
                                    color: #999999;
                                    margin-top: 4px;
                                }
                            }
                            &:last-child {
                                border-bottom: 1px solid #F1F1F1;
                            }
                        }
                        .info-disclosure-list-pages {
                            /*display: flex;*/
                            /*justify-content: center;*/
                            margin-top: 36px;
                            /deep/.list-pagination{
                                padding: 0 6px;
                                text-align: center;
                                li{
                                    min-width: 22px;
                                    height: 24px;
                                    margin-right: 6px;
                                    line-height: 24px;
                                    font-size: 12px;
                                    &:last-child{
                                        margin-right: 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>

<style lang="less">
    .menu-box {
        /deep/ .ant-menu-item, .ant-menu-submenu-title {
            padding-left: auto !important;
            padding-right: 0;
            .ant-menu-submenu-arrow{
                right: 0;
            }
        }
    }

    .disclosureSelectDropdown .ant-select-dropdown-menu {
        max-height: 260px;
    }
</style>

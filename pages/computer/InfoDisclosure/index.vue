<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key" :SelectedType="type"/>
        <a-locale-provider :locale="localeLange">
            <section class="section">
            <div class="container">
                <a-layout-content>
                    <!--         面包屑导航           -->
                    <Breadcrumb :routes="routes"/>
                    <div class="content">
                        <div class="menu-box">
                            <a-menu
                                    @click="titleClick"
                                    :inlineIndent="16"
                                    :defaultSelectedKeys="[0]"
                                    :openKeys.sync="openKeys"
                                    mode="inline"
                            >
                                <template v-for="item in menuList">
                                    <a-menu-item v-if="!item.children" :key="item.id">
                                        <span class="blockSpan" style="pointer-events:auto"
                                              :class="item.id === 0 ? 'disclosure-menu-blue' : ''">
                                            {{item.categoryName}}
                                        </span>
                                    </a-menu-item>
                                    <a-sub-menu @titleClick="titleClick" v-else :key="item.id">
                                        <template slot="title">
                                            <span class="blockSpan">{{item.categoryName}}</span>
                                        </template>
                                        <template v-for="childItem in item.children">
                                            <a-menu-item v-if="!childItem.children" :key="childItem.id">
                                                <span class="blockSpan" style="font-size: 12px;"
                                                      :class="childItem.id === leftMenuKey ? 'disclosure-menu-blue' : ''">
                                                    {{childItem.categoryName}}
                                                </span>
                                            </a-menu-item>
                                            <a-sub-menu v-else :key="childItem.id" @titleClick="titleClick">
                                                <template slot="title">
                                                    <span class="blockSpan" style="font-size: 12px;">{{childItem.categoryName}}</span>
                                                </template>
                                                <template v-for="childrenItem in childItem.children">
                                                    <a-menu-item :key="childrenItem.id">
                                                        <span class="blockSpan" style="font-size: 12px;"
                                                              :class="childrenItem.id === leftMenuKey ? 'disclosure-menu-blue' : ''">
                                                            {{childrenItem.categoryName}}
                                                        </span>
                                                    </a-menu-item>
                                                </template>
                                            </a-sub-menu>
                                        </template>
                                    </a-sub-menu>
                                </template>
                            </a-menu>
                        </div>
                        <div class="content-right-box">
                            <div class="search-box">
                                <a-input-group compact>
                                    <a-select dropdownClassName="disclosureSelectDropdown" v-model="searchData.selectVal" class="search-select" size="large" @change="handleChange">
                                        <a-select-opt-group>
                                            <span slot="label">{{$t('infoDisclosure.infoDisclosure_search_select_lable_result')}}</span>
                                            <a-select-option value="allResult">{{$t('infoDisclosure.infoDisclosure_search_select_option_fullText')}}</a-select-option>
                                            <a-select-option value="title">{{$t('infoDisclosure.infoDisclosure_search_select_option_title')}}</a-select-option>
                                            <a-select-option value="content">{{$t('infoDisclosure.infoDisclosure_search_select_option_content')}}</a-select-option>
                                            <a-select-option value="attachment">{{$t('infoDisclosure.infoDisclosure_search_select_option_attachment')}}</a-select-option>
                                            <a-select-option value="ptcode">{{$t('CertificatePurchase.certificatePurchase_project_number')}}</a-select-option>
                                        </a-select-opt-group>
                                        <a-select-opt-group :label="$t('infoDisclosure.infoDisclosure_search_select_lable_allInfo')" v-if="leftMenuKey !== 0">
                                            <a-select-option value="all">{{$t('infoDisclosure.infoDisclosure_search_select_option_fullText')}}</a-select-option>
                                        </a-select-opt-group>
                                    </a-select>
                                    <div class="my-code">{{searchSelData}}</div>
                                    <a-input-search v-model="searchData.inputVal" style="width: 480px"
                                                    :placeholder="$t('infoDisclosure.infoDisclosure_search_input_placeholder')"
                                                    @search="searchList" size="large">
                                        <a-button slot="enterButton" type="primary"
                                                  :loading="searchLoading">
                                            {{$t('infoDisclosure.infoDisclosure_search_btn')}}
                                        </a-button>
                                    </a-input-search>
                                </a-input-group>
                            </div>
                            <div class="list-box">
                                <a-list
                                        itemLayout="horizontal"
                                        :dataSource="serverListData"
                                        :locale="{emptyText: $t('NoData.NoData_table')}"
                                >
                                    <a-list-item slot="renderItem" slot-scope="item, index">
                                        <span slot="actions" v-if="!isToday(item.appointmentTime)">{{item.appointmentTime | parseTime('{y}-{m}-{d}')}}</span>
                                        <span slot="actions" v-else>{{item.appointmentTime | parseTime('{h}:{i}')}}</span>
                                        <a-list-item-meta>
                                            <a slot="title" @click="setprojectname(item)">{{item.title}}</a>
                                        </a-list-item-meta>
                                    </a-list-item>
                                </a-list>

                                <!-- 分页 -->
                                <div class="info-disclosure-list-pages" v-if="pagesData.total!==0 && pagesData.pages>1">
                                    <a-pagination
                                            class="list-pagination"
                                            @change="changepag"
                                            showQuickJumper
                                            :defaultCurrent="1"
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
</template>

<script>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW'
    import enUS from 'ant-design-vue/lib/locale-provider/en_US'
    import Breadcrumb from '~/components/computer/Breadcrumb'
    import FsHead from '~/components/computer/FangseaHeader'
    import fonter from '~/components/computer/Footer'
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
        asyncData ({req}) {
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
                key: '8',
                // 登录、注册导航下标
                type: 0,
                // 面包屑
                routes: [],
                openKeys: [0],
                // 服务端列表数据
                serverListData: [],
                // 左侧菜单数据
                menuList: [],
                // 服务端左侧菜单数据
                serverMenuData: [],
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
                searchLoading: false
            }
        },
        // 初始化数据
        mounted () {
            this.searchData.inputVal = sessionStorage.getItem('disclosure_searchinfo') ? sessionStorage.getItem('disclosure_searchinfo') : ''
            if (process.client) {
                if (this.serverMenuData.length === 0) {
                    this.getLeftMenu()
                } else {
                    this.funcHandleLeftMenuData(this.serverMenuData)
                }
                if (this.serverListData.length === 0) {
                    this.getList()
                }
                this.setLocaleLange()
                this.initBreadcrumb()
                this.listenI18n()
            }
        },
        methods: {
            /**
             * 获取列表
             */
            getList () {
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
                this.searchLoading = true
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
                    this.searchLoading = false
                    window.open('/computer/InfoDisclosure')
                    return
                }
                for (let i in data.data.filter) {
                    data.data.filter[i] = removeSpaces(data.data.filter[i])
                }
                for (let i in this.searchData) {
                    this.searchData[i] = removeSpaces(this.searchData[i])
                }
                axios.post('/dc/article/list', data).then((res) => {
                    if (res.data.code.toString() === '0') {
                        this.serverListData = res.data.data.list
                        this.pagesData.total = res.data.data.total
                        this.pagesData.pageNum = res.data.data.pageNum
                        this.searchLoading = false
                        this.pagesData.pages = this.pagesData.total / this.pagesData.pageSize
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
                function sortId (a, b) {
                    return a.sort - b.sort
                }
                let list = res
                list.sort(sortId)
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
                            list.splice(i, 1)
                            i--
                        }
                    }
                    this.menuList = this.childMenu(list, menuList_)
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
            /**
             * 初始化面包屑国际化
             */
            initBreadcrumb () {
                this.routes = [{
                    path: '/computer',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_home')
                }, {
                    path: '/computer/InfoDisclosure',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_infoDisclosure')
                }]
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.setLocaleLange()
                    this.getLeftMenu()
                    this.initBreadcrumb()
                    this.handleChange(this.searchData.selectVal)
                    this.getList()
                })
            },
            /**
             * 前往详情
             * @data 项目数据
             */
            setprojectname (data) {
                this.$router.push(`/computer/InfoDisclosure/DisclosureDetail/${data.id}`)
            },

            /**
             * 点击分页
             */
            changepag (page) {
                this.pagesData.pageNum = page
                this.getList()
            },
            // 左侧菜单点击
            titleClick (e) {
                this.leftMenuKey = e.key
                this.searchData.selectVal = 'allResult'
                this.searchData.inputVal = ''
                this.searchSelData = this.$t('infoDisclosure.infoDisclosure_search_select_lable_result')
                let blueDom = document.getElementsByClassName('disclosure-menu-blue')
                for (let i = 0; i < blueDom.length; i++) {
                    blueDom[i].classList.remove('disclosure-menu-blue')
                }
                e.domEvent.target.classList.add('disclosure-menu-blue')
                this.getList()
            },
            // 点击搜索
            searchList (val) {
                this.searchData.inputVal = val
                sessionStorage.removeItem('disclosure_searchinfo')
                this.getList()
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

    .text-ellipsis-lines(@line:2){
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
            width: 1200px;

            .content {
                padding: 0 0 20px !important;
                .menu-box{
                    width: 280px;
                    float: left;
                    height: 680px;
                    overflow-y: auto;
                    /*min-height: calc(100vh - 199px);*/
                    border-radius: 4px;
                    margin-bottom: 20px;
                    border:1px solid rgba(241,241,241,1);
                    .ant-menu-item-selected{
                        background-color: #ffffff;
                        color: rgba(0, 0, 0, 0.65);
                        &:after{
                            display: none;
                        }
                    }
                    .ant-menu{
                        width: ~'calc(100% - 1px)';
                        border-right: none;
                    }
                    .blockSpan{
                        display: inline-block;
                        pointer-events: none;
                        width: 100%;
                    }
                    /deep/.ant-menu-inline .ant-menu-item, .ant-menu-inline .ant-menu-submenu-title{
                        width: 100%;
                    }
                    /deep/ .ant-menu-submenu-arrow{
                        &:before, &:after{
                            pointer-events: none;
                            background-image: linear-gradient(to right, #D9D9D9, #D9D9D9);
                        }
                    }
                    /deep/.disclosure-menu-blue{
                        color: #2EA9DF!important;
                        .ant-menu-submenu-arrow{
                            &:before, &:after{
                                background-image: linear-gradient(to right, #2EA9DF, #2EA9DF);
                            }
                        }
                        &:after{
                            content: '';
                            display: block;
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
                            left: 0;
                            background-color: #d9d9d9;
                            opacity: 0.2;
                        }
                    }
                }
                .content-right-box{
                    width: 908px;
                    float: right;
                    padding-bottom: 52px;
                    .search-box{
                        width: 610px;
                        .search-select{
                            width: 130px;
                            height: 40px;
                            /deep/.ant-select-selection-selected-value{
                                font-size: 14px;
                            }
                        }
                        /deep/.ant-input-search-button{
                            font-size: 14px;
                            width: 100px;
                        }
                        /deep/.ant-input{
                            font-size: 14px;
                        }
                        /deep/.my-code{
                            width: 105px!important;
                            z-index: 99;
                            color: rgba(0, 0, 0, 0.45);
                        }
                    }
                    .list-box{
                        margin-top: 42px;
                        .ant-list-item{
                            padding-left: 28px;
                            position: relative;
                            border-bottom: 1px solid #F1F1F1;
                            &:before{
                                content: '';
                                display: inline-block;
                                position: absolute;
                                width: 4px;
                                height: 4px;
                                background-color: #D9D9D9;
                                left: 16px;
                                top: 20px;
                                border-radius: 4px;
                            }
                            h4{
                                width: 748px;
                                .text-ellipsis-lines(2);
                            }
                            a{
                                color: #333333;
                                font-size: 14px;
                                line-height: 20px;
                                &:hover{
                                    color: #333333;
                                }
                            }
                            .ant-list-item-action span{
                                color: #999999;
                            }
                            &:last-child{
                                border-bottom: 1px solid #F1F1F1;
                            }
                        }
                        .info-disclosure-list-pages{
                            display: flex;
                            justify-content: flex-end;
                            margin-top: 36px;
                        }
                    }
                }
            }
        }
    }
</style>

<style lang="less">
    .menu-box{
        /deep/.ant-menu-item, .ant-menu-submenu-title{
            padding-left: auto!important;
        }
    }
    .disclosureSelectDropdown .ant-select-dropdown-menu{
        max-height: 260px;
    }
</style>

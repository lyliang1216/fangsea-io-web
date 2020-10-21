<template>
    <a-layout-header class="header">
        <div class="header-content">
            <a href="javascript:;" @click="JudgeRedirect('/mobile')" class="logobox">
                <div class="logo">
                </div>
            </a>
            <a-badge :dot="hasUpdated('USERCENTER')" :offset="[4, 2]" class="menu-bar">
                <a-button :ghost="true" @click="showDrawer" class="hamb-bt hamburger">
                    <span class="hamb hamb-top"></span>
                    <span class="hamb hamb-middle"></span>
                    <span class="hamb hamb-bottom"></span>
                </a-button>
            </a-badge>
            <a-drawer
                    placement="left"
                    :closable="false"
                    @close="onClose"
                    :visible="visible"
                    width="85vw">
                <template slot="title">
                    <ul class="drawer-title">
                        <a href="javascript:;" @click="JudgeRedirect('/mobile')">
                            <li :class="SelectedKey === 1 ? 'drawer-title-li-active' : ''" @click="onClose">
                                {{$t('header.header_nav_home')}}&nbsp<span v-show="localeLange !== 'English'">({{$t('header.header_nav_home_en')}})</span>
                            </li>
                        </a>
                        <a href="javascript:;" @click="JudgeRedirect('/mobile/CertificatePurchase')">
                            <li :class="SelectedKey === 3 ? 'drawer-title-li-active' : ''" @click="onClose">
                                {{$t('header.header_nav_buypts')}}&nbsp<span v-show="localeLange !== 'English'">({{$t('header.header_nav_buypts_en')}})</span>
                            </li>
                        </a>
                        <nuxt-link to="/mobile/InfoDisclosure">
                            <li :class="SelectedKey === 8 ? 'drawer-title-li-active' : ''" @click="onClose">
                                {{$t('header.header_nav_disclosure')}}&nbsp<span v-show="localeLange !== 'English'">({{$t('header.header_nav_disclosure_en')}})</span>
                            </li>
                        </nuxt-link>
                        <a href="javascript:;" @click="windowopen('https://www.ptex.vip')">
                            <li :class="SelectedKey === 4 ? 'drawer-title-li-active' : ''" @click="onClose">
                                {{$t('header.header_nav_tradepts')}}&nbsp<span v-show="localeLange !== 'English'">({{$t('header.header_nav_tradepts_en')}})</span>
                            </li>
                        </a>
                        <a href="javascript:;" @click="redirectOne('/house/list/pg1.html')">
                            <li :class="SelectedKey === 2 ? 'drawer-title-li-active' : ''" @click="onClose">
                                {{$t('header.header_nav_buyhouse')}}&nbsp<span v-show="localeLange !== 'English'">({{$t('header.header_nav_buyhouse_en')}})</span>
                            </li>
                        </a>
                        <a href="javascript:;" @click="windowopen('services')">
                            <li :class="SelectedKey === 6 ? 'drawer-title-li-active' : ''" @click="onClose">
                                {{$t('header.header_nav_services')}}&nbsp<span v-show="localeLange !== 'English'">({{$t('header.header_nav_services_en')}})</span>
                            </li>
                        </a>
                        <li :class="SelectedKey === 5 ? 'drawer-title-li-active' : ''" @click="onClose" style="color: #7D7D7D">
                            {{$t('header.header_nav_applypto')}}&nbsp<span v-show="localeLange !== 'English'">({{$t('header.header_nav_applypto_en')}})</span>
                        </li>
                    </ul>
                    <div class="slide-item">
                        <section v-show="!isLogin" class="not-login">
                            <a href="javascript:;" @click="redirectOne('/mobile/user/login')">
                                <span class="loginbtn link_btn" @click="onClose"
                                      :class="SelectedType === 1 ? 'drawer-title-li-active' :''">
                                    {{$t('header.header_login')}}
                                </span>
                            </a>
                            <a href="javascript:;" @click="redirectOne('/mobile/user/register')">
                                <span class="loginbtn link_btn" @click="onClose"
                                      :class="SelectedType === 2 ? 'drawer-title-li-active' :''">
                                    {{$t('header.header_register')}}
                                </span>
                            </a>
                        </section>
                        <ul class="drawer-title" v-show="isLogin">
                            <li class="drawer-title-li">
                                <p>
                                    <i>{{$t('sider.sidebar_name_8')}}</i>
                                    <span class="caret"></span>
                                </p>
                                <ul class="positionplan-child">
                                    <li :class="centerKey === 8 ? 'drawer-title-li-active' : 'drawer-title-li'" @click="onClose">
                                        <nuxt-link to="/mobile/user/UserCenter/PositionPlan">
                                            <a-badge :dot="false" :offset="[3, 0]" class="fz14">
                                                {{$t('sider.sidebar_name_8_1')}}
                                            </a-badge>
                                        </nuxt-link>
                                    </li>
                                    <li :class="centerKey === 9 ? 'drawer-title-li-active' : 'drawer-title-li'" @click="onClose">
                                        <nuxt-link to="/mobile/user/UserCenter/PositionPlan/RecommendList">
                                            <a-badge :dot="hasUpdated('POSITIONPLAN')" :offset="[3, 0]" class="fz14">
                                                {{$t('sider.sidebar_name_8_2')}}
                                            </a-badge>
                                        </nuxt-link>
                                    </li>
                                </ul>
                            </li>
                            <li :class="centerKey === 1 ? 'drawer-title-li-active' : 'drawer-title-li'" @click="onClose">
                                <a href="javascript:;" @click="redirectOne('/order/list/ot0opg1.html')">
                                    <a-badge :dot="hasUpdated('MYPROPERTY')" :offset="[3, 0]">
                                        {{$t('sider.sidebar_name_2')}}
                                    </a-badge>
                                </a>
                            </li>
                            <li :class="centerKey === 2 ? 'drawer-title-li-active' : 'drawer-title-li'" @click="onClose">
                                <nuxt-link to="/mobile/user/UserCenter/MyWallet">
                                    <a-badge :dot="hasUpdated('MYWALLET')" :offset="[3, 0]">
                                        {{$t('sider.sidebar_name_3')}}
                                    </a-badge>
                                </nuxt-link>
                            </li>
                            <li :class="centerKey === 4 ? 'drawer-title-li-active' : 'drawer-title-li'" @click="onClose">
                                <nuxt-link to="/mobile/user/UserCenter/TransactionRecord">
                                    <a-badge :dot="hasUpdated('TRANSACTIONRECORD')" :offset="[3, 0]">
                                        {{$t('sider.sidebar_name_5')}}
                                    </a-badge>
                                </nuxt-link>
                            </li>
                            <li :class="centerKey === 3 ? 'drawer-title-li-active' : 'drawer-title-li'" @click="onClose">
                                <nuxt-link to="/mobile/user/UserCenter/AddressManagement">
                                    <a-badge :dot="hasUpdated('ADDRESSMANAGEMENT')" :offset="[3, 0]">
                                        {{$t('sider.sidebar_name_4')}}
                                    </a-badge>
                                </nuxt-link>
                            </li>
                            <li :class="centerKey === 5 ? 'drawer-title-li-active' : 'drawer-title-li'" @click="onClose">
                                <nuxt-link to="/mobile/user/UserCenter/MyMessage">
                                    <a-badge :dot="hasUpdated('MYMESSAGE')" :offset="[3, 0]">
                                        {{$t('sider.sidebar_name_0')}}
                                    </a-badge>
                                </nuxt-link>
                            </li>
                            <li :class="centerKey === 6 ? 'drawer-title-li-active' : 'drawer-title-li'" @click="onClose">
                                <nuxt-link to="/mobile/user/UserCenter/AuthenticationKYC">
                                    <a-badge :dot="hasUpdated('AUTHENTICATIONKYC')" :offset="[3, 0]">
                                        {{$t('sider.sidebar_name_7')}}
                                    </a-badge>
                                </nuxt-link>
                            </li>
                            <li :class="centerKey === 7 ? 'drawer-title-li-active' : 'drawer-title-li'" @click="loginOut">
                                {{$t('sider.header_title_logout')}}
                            </li>
                        </ul>
                    </div>
                </template>
                <div class="slide-boby" :class="isLogin ? 'slide-boby-change' : ''">
                    <!--<a class="link" href="javascript:;" id="setting_btn">-->
                        <!--{{$t('sider.header_title_setting')}}-->
                    <!--</a>-->
                    <!--暂时屏蔽白皮书-->
                    <!--<a class="link showmore" href="javascript:;">白皮书 <span class="caret"></span></a>-->
                    <!--<ul class="more">-->
                    <!--<li class="link_btn">简体中文<a href="javascript:;"></a></li>-->
                    <!--<li class="link_btn">English<a href="javascript:;"></a></li>-->
                    <!--</ul>-->
                    <a class="link showmore lang_btn" href="javascript:;">{{localeLange}} <span
                            class="caret"></span></a>
                    <ul class="more lang_menu">
                        <li class="link_btn" @click="setLocale('繁體中文')">繁體中文
                        </li>
                        <li class="link_btn" @click="setLocale('English')">English
                        </li>
                        <li class="link_btn" @click="setLocale('简体中文')">简体中文
                        </li>
                    </ul>
                </div>
            </a-drawer>
        </div>
    </a-layout-header>
</template>

<script>
    import {Bus} from '~/assets/utils/bus'
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'

    export default {
        name: 'fshead',
        // 主导航下标，登录注册下标，用户中心导航下标
        props: ['SelectedKey', 'SelectedType', 'centerKey'],
        data () {
            return {
                // 显示抽屉
                visible: false,
                // 国际化下拉框
                locales: ['繁體中文', 'English', '简体中文'],
                // 默认语言
                localeLange: '繁體中文',
                // 国际化为英文，切换显示效果
                isEnglish: false,
                // 是否登录
                isLogin: false
            }
        },
        created () {
            if (process.client) {
                this.initData()
            }
        },
        methods: {
            /**
             * 修改红点状态
             * @param name 菜单名
             */
            hasUpdated (name) {
                let arr = this.$store.state.hasUpdated
                for (let i in arr) {
                    if (arr[i].name === name) {
                        return arr[i].isShow
                    }
                }
                return false
            },
            /**
             * 跳转判断语言
             * @param val 跳转路径
             */
            JudgeRedirect (val) {
                let url = val
                if (url.substr(url.length - 1, 1) === '/') {
                    url = url.substr(0, url.length - 1)
                }
                if (url === '/computer' || url === '/mobile' || url === '/') {
                    window.location.href = '/'
                } else {
                    this.$router.push(val)
                }
            },
            /**
             * 跳转至一期
             */
            redirectOne (url) {
                if (url === '/mobile/user/login' || url === '/mobile/user/register') {
                    let path = window.location.pathname
                    let whiteUrl = ['/user/login', '/user/register', '/user/ForgetPassword', '/user/ForgetPasswordStepTwo']
                    if (whiteUrl.indexOf(path.substring(path.indexOf('/user'), path.length)) === -1) {
                        Cookie.set('redirectUrl', path)
                    }
                    this.$router.push(url)
                } else {
                    window.location.href = url
                }
            },
            /**
             * 新开页
             */
            windowopen (url) {
                if (url === 'services') {
                    if (Cookie.get('language') === 'en_US') {
                        window.open('https://support.ptohome.com/hc/en-us')
                    } else {
                        window.open('https://support.ptohome.com/hc/zh-hk')
                    }
                } else {
                    window.open(url)
                }
            },
            /**
             * 初始化header数据
             */
            initData () {
                // 判断是否登陆
                Cookie.get('refresh_token') ? this.isLogin = true : this.isLogin = false
                // 如果没有登录，清除所有红点状态
                if (!Cookie.get('refresh_token')) {
                    this.$store.dispatch('updateRedDot', 'logOut')
                }
                // 设置当前国际化
                if (!Cookie.get('language')) {
                    let headerLanguage = (navigator.language || navigator.userLanguage) // 获取浏览器语种
                    let language = headerLanguage.replace('-', '_')
                    language === 'en_US' ? Cookie.set('language', language) : Cookie.set('language', 'zh_TW')
                }
                // 同步国际化
                switch (Cookie.get('language')) {
                case 'zh_TW' :
                    this.isEnglish = false
                    this.localeLange = '繁體中文'
                    this.$i18n.locale = 'zh_TW'
                    this.$store.dispatch('updateLang', 'zh_TW')
                    break
                case 'zh_CN' :
                    this.isEnglish = false
                    this.localeLange = '简体中文'
                    this.$i18n.locale = 'zh_CN'
                    this.$store.dispatch('updateLang', 'zh_CN')
                    break
                case 'en_US' :
                    this.isEnglish = true
                    this.localeLange = 'English'
                    this.$i18n.locale = 'en_US'
                    this.$store.dispatch('updateLang', 'en_US')
                    break
                }
            },
            // 触发父组件显示右侧抽屉导航
            showDrawer () {
                this.$emit('openDrawer')
                this.visible = true
            },
            // 触发父组件关闭右侧抽屉导航
            onClose () {
                this.$emit('closeDrawer')
                this.visible = false
            },
            /**
             * 国际化切换
             * @param key 国际化标识
             */
            setLocale (key) {
                let locale = ''
                switch (key) {
                case '繁體中文' :
                    locale = 'zh_TW'
                    this.$store.dispatch('updateLang', 'zh_TW')
                    axios.defaults.headers['Accept-Language'] = 'zh-TW,zh;q=0.9'
                    break
                case '简体中文' :
                    locale = 'zh_CN'
                    this.$store.dispatch('updateLang', 'zh_CN')
                    axios.defaults.headers['Accept-Language'] = 'zh-CN,zh;q=0.9'
                    break
                case 'English' :
                    locale = 'en_US'
                    this.$store.dispatch('updateLang', 'en_US')
                    axios.defaults.headers['Accept-Language'] = 'en-US,en;q=0.9'
                    break
                }
                this.onClose()
                this.localeLange = key
                this.$i18n.locale = locale
                Cookie.set('language', locale)
                if (locale === 'en_US') {
                    this.routerPush()
                }
                // 保存用户语种
                if (this.isLogin) {
                    this.saveUserLanguage()
                }
                Bus.$emit('checkLange')
            },
            /**
             * 跳转三期判断
             */
            routerPush () {
                let url = window.location.pathname
                if (url.substr(url.length - 1, 1) === '/') {
                    url = url.substr(0, url.length - 1)
                }
                if (url === '/mobile') {
                    window.location.href = '/'
                }
            },
            // 保存用户语种
            saveUserLanguage () {
                axios.post('/user/account/language/save')
            },
            /**
             * 退出登录
             */
            loginOut () {
                this.onClose()
                // 删除Cookie登录Token
                Cookie.remove('token')
                Cookie.remove('authorization')
                Cookie.remove('refresh_token')
                Cookie.remove('redirectUrl')
                axios.defaults.headers['Authorization'] = ''
                // 隐藏用户中心导航
                this.isLogin = false
                this.$store.dispatch('updateRedDot', 'logOut')
                window.location.href = '/'
            }
        }
    }
</script>

<style lang="less">
    @import '../../assets/css/mobile/main.less';

    .hamburger {
        background: transparent;
        border: none;
        display: block;
        height: 0.28rem!important;
        width: 0.28rem;
        z-index: 1000;
        float: left;
        margin-right: -0.02rem;
    }

    .ant-drawer-content-wrapper {

        .ant-drawer-header {
            padding: 0.05rem 0 0 0.2rem;
        }

        .ant-drawer-body {
            padding-bottom: 0;
        }

        .drawer-title {
            margin-bottom: 0.05rem;
            list-style: none;
            padding: 0;

            li {
                height: auto;
                line-height: 0.16rem;
                font-size: 16px;
                color: #333333;
                padding: 0.12rem 0.2rem;

                span {
                    font-size: 16px;
                    &.fz14{
                        font-size: 14px;
                    }
                }

                .positionplan-child {
                    list-style: none;
                    margin-left: -0.2rem;
                    li{
                        padding-left: 0;
                        font-size: 14px;
                        color: #333;
                        &:last-child {
                            padding-bottom: 0;
                        }
                        &.drawer-title-li-active {
                            a {
                                color: #2EA9DF!important;
                            }
                        }
                    }
                }

            }

            &>li:first-child {
                p{
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    i {
                        font-style: normal;
                    }
                    .caret {
                        display: inline-block;
                        width: 0;
                        height: 0;
                        margin-left: 0.2rem;
                        vertical-align: middle;
                        border-top: 4px dashed;
                        border-top: 4px solid \9;
                        border-right: 4px solid transparent;
                        border-left: 4px solid transparent;
                    }
                }
            }
        }

        .slide-item {
            border-top: 1px solid #E9E9E9;
            padding: 0.05rem 0.2rem;
            margin-left: -0.2rem;
            min-height: 0.51rem;

            .not-login span {
                width: 50%;
                text-align: center;
                float: left;
                text-decoration: none;
                height: 0.4rem;
                line-height: 0.4rem;
                font-size: 16px;
                color: #666666;
                display: block;
            }

        }

        .ant-drawer-body {

            .slide-boby {
                margin-left: -0.24rem;
                margin-top: -0.24rem;
                border-bottom: 1px solid #E9E9E9;
                padding: 0.05rem 0.2rem 0.01rem;

                .link {
                    height: auto;
                    width: 100%;
                    line-height: 0.16rem;
                    font-size: 16px;
                    color: #333333;
                    padding: 0.12rem 0.2rem;
                    text-decoration: none;
                    display: inline-block;

                    .caret {
                        display: inline-block;
                        width: 0;
                        height: 0;
                        margin-left: 0.2rem;
                        vertical-align: middle;
                        border-top: 4px dashed;
                        border-top: 4px solid \9;
                        border-right: 4px solid transparent;
                        border-left: 4px solid transparent;
                    }

                }

                li {
                    list-style: none;
                    height: 0.4rem;
                    line-height: 0.4rem;
                    font-size: 14px;
                    color: #333;
                }

            }
        }
    }

    .drawer-title-li-active {
        color: #2EA9DF !important;

        a {
            color: #2EA9DF !important;
        }
    }

    .drawer-title-li {
        color: #333 !important;

        a {
            color: #333 !important;
        }
    }

    .slide-boby-change {
        border-bottom: none !important;
    }

    .menu-bar {
        /deep/.ant-badge-dot {
            box-shadow: none;
            width: 9px;
            height: 9px;
            border: 1px solid #232933;
            z-index: 1001;
        }
    }
</style>

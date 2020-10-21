<template>
    <a-layout-header class="header">
        <div id="headscroll" class="header-content">
            <a href="javascript:;" @click="JudgeRedirect('/computer')">
                <div class="logo">
                </div>
            </a>
            <a-menu
                    theme="dark"
                    mode="horizontal"
                    :selectedKeys="[SelectedKey]"
                    :defaultSelectedKeys="['1']"
                    :style="{ lineHeight: '64px',maxWidth: '750px' }">
                <a-menu-item key="1">
                    <a href="javascript:;" @click="JudgeRedirect('/computer')">
                        <div class="item-flex" :class="isEnglish ?  'item-flex-padding' : ''">
                            <span>{{$t('header.header_nav_home')}}</span><span class="item-en" v-show="!isEnglish">{{$t('header.header_nav_home_en')}}</span>
                        </div>
                    </a>
                </a-menu-item>
                <a-menu-item key="3">
                    <a href="javascript:;" @click="JudgeRedirect('/computer/CertificatePurchase')">
                        <div class="item-flex" :class="isEnglish ?  'item-flex-padding' : ''">
                            <span>{{$t('header.header_nav_buypts')}}</span><span class="item-en" v-show="!isEnglish">{{$t('header.header_nav_buypts_en')}}</span>
                        </div>
                    </a>
                </a-menu-item>
                <a-menu-item key="8">
                    <nuxt-link to="/computer/InfoDisclosure">
                        <div class="item-flex" :class="isEnglish ?  'item-flex-padding' : ''">
                            <span>{{$t('header.header_nav_disclosure')}}</span><span class="item-en"
                                                                                     v-show="!isEnglish">{{$t('header.header_nav_disclosure_en')}}</span>
                        </div>
                    </nuxt-link>
                </a-menu-item>
                <a-menu-item key="4">
                    <a href="javascript:;" @click="windowopen('https://www.ptex.vip')">
                        <div class="item-flex" :class="isEnglish ?  'item-flex-padding' : ''">
                            <span>{{$t('header.header_nav_tradepts')}}</span><span class="item-en" v-show="!isEnglish">{{$t('header.header_nav_tradepts_en')}}</span>
                        </div>
                    </a>
                </a-menu-item>
                <a-menu-item key="2">
                    <a href="javascript:;" @click="redirectOne('/house/list/pg1.html')">
                        <div class="item-flex" :class="isEnglish ?  'item-flex-padding' : ''">
                            <span>{{$t('header.header_nav_buyhouse')}}</span><span class="item-en" v-show="!isEnglish">{{$t('header.header_nav_buyhouse_en')}}</span>
                        </div>
                    </a>
                </a-menu-item>
                <a-menu-item key="6">
                    <a href="javascript:;" @click="windowopen('services')">
                        <div class="item-flex" :class="isEnglish ?  'item-flex-padding' : ''">
                            <span>{{$t('header.header_nav_services')}}</span><span class="item-en" v-show="!isEnglish">{{$t('header.header_nav_services_en')}}</span>
                        </div>
                    </a>
                </a-menu-item>
                <a-menu-item key="5">
                    <div class="item-flex" :class="isEnglish ?  'item-flex-padding' : ''" style="color: #7D7D7D">
                        <span>{{$t('header.header_nav_applypto')}}</span><span class="item-en"
                                                                               v-show="!isEnglish">{{$t('header.header_nav_applypto_en')}}</span>
                    </div>
                </a-menu-item>
            </a-menu>
            <div class="menu-right">
                <div v-show="flag">
                    <section v-show="!isLogin">
                        <a href="javascript:;" @click="redirectOne('/computer/user/login')">
                            <a-button ghost class="menu-bt" :class="SelectedType === 1 ? 'drawer-title-li-active' :''">
                                {{$t('header.header_login')}}
                            </a-button>
                        </a>
                        <span class="line">|</span>
                        <a href="javascript:;" @click="redirectOne('/computer/user/register')">
                            <a-button ghost class="menu-bt" :class="SelectedType === 2 ? 'drawer-title-li-active' :''">
                                {{$t('header.header_register')}}
                            </a-button>
                        </a>
                    </section>
                    <section class="head-active-box">
                        <div :class="kycTooltipClass"
                             v-if="isLogin && (auditState === 4 || auditState === 3 || auditState === 1)">
                            <nuxt-link v-if="auditState === 4"
                                       :to="{path:'/computer/user/UserCenter',query: {getKey: '6'}}">
                                {{$t('MyMessage.myprofile_kyc_status_not')}}
                            </nuxt-link>
                            <nuxt-link v-if="auditState === 3"
                                       :to="{path:'/computer/user/UserCenter',query: {getKey: '6'}}">
                                {{$t('AuthenticationKYC.kyc_update_title')}}
                            </nuxt-link>
                            <nuxt-link v-if="auditState === 1"
                                       :to="{path:'/computer/user/UserCenter',query: {getKey: '6'}}">
                                {{$t('MyMessage.myprofile_kyc_status_fail')}}
                            </nuxt-link>
                            <span></span>
                        </div>
                        <a-dropdown v-show="isLogin" placement="bottomRight">
                            <div class="head-img">
                                <a-badge :dot="hasUpdated('USERCENTER')" :offset="[-3, 0]">
                                    <div>
                                        <img src="/content/personal_center.png" alt="">
                                        <img src="/content/personal_center_active.png" alt="">
                                    </div>
                                </a-badge>
                            </div>
                            <a-menu slot="overlay">
                                <a-menu-item key="8">
                                    <nuxt-link :to="{path:'/computer/user/UserCenter',query: {getKey: '7'}}">
                                        <a-badge :dot="hasUpdated('POSITIONPLAN')" :offset="[3, 0]">
                                            {{$t('sider.sidebar_name_8')}}
                                        </a-badge>
                                    </nuxt-link>
                                </a-menu-item>
                                <a-menu-item key="1">
                                    <a href="javascript:;" @click="redirectOne('/order/list/ot0opg1.html')">
                                        <a-badge :dot="hasUpdated('MYPROPERTY')" :offset="[3, 0]">
                                            {{$t('sider.sidebar_name_2')}}
                                        </a-badge>
                                    </a>
                                </a-menu-item>
                                <a-menu-item key="2">
                                    <nuxt-link :to="{path:'/computer/user/UserCenter',query: {getKey: '2'}}">
                                        <a-badge :dot="hasUpdated('MYWALLET')" :offset="[3, 0]">
                                            {{$t('sider.sidebar_name_3')}}
                                        </a-badge>
                                    </nuxt-link>
                                </a-menu-item>
                                <a-menu-item key="4">
                                    <nuxt-link :to="{path:'/computer/user/UserCenter',query: {getKey: '4'}}">
                                        <a-badge :dot="hasUpdated('TRANSACTIONRECORD')" :offset="[3, 0]">
                                            {{$t('sider.sidebar_name_5')}}
                                        </a-badge>
                                    </nuxt-link>
                                </a-menu-item>
                                <a-menu-item key="5">
                                    <nuxt-link :to="{path:'/computer/user/UserCenter',query: {getKey: '5'}}">
                                        <a-badge :dot="hasUpdated('MYMESSAGE')" :offset="[3, 0]">
                                            {{$t('sider.sidebar_name_0')}}
                                        </a-badge>
                                    </nuxt-link>
                                </a-menu-item>
                                <a-menu-item key="6">
                                    <nuxt-link :to="{path:'/computer/user/UserCenter',query: {getKey: '6'}}">
                                        <a-badge :dot="hasUpdated('AUTHENTICATIONKYC')" :offset="[3, 0]">
                                            {{$t('sider.sidebar_name_7')}}
                                        </a-badge>
                                    </nuxt-link>
                                </a-menu-item>
                                <a-menu-item key="7" @click="loginOut">
                                    {{$t('sider.header_title_logout')}}
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </section>
                </div>
                <a-dropdown class="i18n-dropdown" v-if="showlange">
                    <a class="ant-dropdown-link" href="javascript:;">
                        {{localeLange}}
                        <a-icon type="down"/>
                    </a>
                    <a-menu slot="overlay" @click="setLocale">
                        <a-menu-item v-for="locale in locales" :key="locale">
                            <a href="javascript:;">{{locale}}</a>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </div>
        </div>
    </a-layout-header>
</template>

<script>
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'

    export default {
        name: 'fshead',
        // 导航下标，登录注册下标
        props: ['SelectedKey', 'SelectedType'],
        data () {
            return {
                // 国际化下拉框
                locales: ['繁體中文', 'English', '简体中文'],
                // 默认语言
                localeLange: '',
                // 国际化为英文，切换显示效果
                isEnglish: false,
                // 是否登录
                isLogin: false,
                // 优化头部滚动
                flag: false,
                // 显示语言栏
                showlange: true,
                // kyc认证状态
                auditState: '',
                // 鼠标是否移入头像
                showMouseEnter: true,
                kycTooltipClass: 'kyc-tooltip'
            }
        },
        created () {
            if (process.client) {
                this.initData()
                this.getkycinfo()
                this.addScrollListen()
                this.listenI18n()
            }
        },
        mounted () {
            this.flag = true
        },
        methods: {
            /**
             * 初始化header数据
             */
            initData () {
                // 判断是否登录
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
            /**
             * 获取kyc认证信息
             */
            getkycinfo () {
                if (Cookie.get('refresh_token')) {
                    let data = {traceId: tool.UUID()}
                    axios.post('/dc/user/kyc/query/user', data)
                        .then(res => {
                            if (res.data.code.toString() === '0') {
                                if (res.data.data) {
                                    if ((res.data.data.passportEndTime - parseInt(this.getnowtime() / 1000) < 30 * 24 * 60 * 60) && res.data.data.auditState === 2) {
                                        this.auditState = 3
                                    } else {
                                        this.auditState = res.data.data.auditState
                                    }
                                } else {
                                    // 0认证中 1未通过 2已通过 3更新护照 4未认证
                                    this.auditState = 4
                                }
                            } else if (res.data.code.toString() === '404') {
                                this.isLogin = false
                            } else {
                                this.auditState = 4
                                this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                            }
                        })
                        .catch(err => {
                            this.$message.error(this.$t(err.message))
                        })
                }
            },
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
             * 国际化切换
             * @param item.key 国际化标识
             */
            setLocale (item) {
                let locale = ''
                switch (item.key) {
                case '繁體中文' :
                    this.isEnglish = false
                    this.$store.dispatch('updateLang', 'zh_TW')
                    axios.defaults.headers['Accept-Language'] = 'zh-TW,zh;q=0.9'
                    locale = 'zh_TW'
                    break
                case '简体中文' :
                    this.isEnglish = false
                    this.$store.dispatch('updateLang', 'zh_CN')
                    axios.defaults.headers['Accept-Language'] = 'zh-CN,zh;q=0.9'
                    locale = 'zh_CN'
                    break
                case 'English' :
                    this.isEnglish = true
                    this.$store.dispatch('updateLang', 'en_US')
                    axios.defaults.headers['Accept-Language'] = 'en-US,en;q=0.9'
                    locale = 'en_US'
                    break
                }
                this.localeLange = item.key
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
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('setKycState', () => {
                    // 获取kyc认证状态
                    this.getkycinfo()
                })
            },
            /**
             * 跳转三期判断
             */
            routerPush () {
                let url = window.location.pathname
                if (url.substr(url.length - 1, 1) === '/') {
                    url = url.substr(0, url.length - 1)
                }
                if (url === '/computer') {
                    window.location.href = '/'
                }
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
            // 保存用户语种
            saveUserLanguage () {
                axios.post('/user/account/language/save')
            },
            // 添加滚动条监听
            addScrollListen () {
                window.scrollTo(0, window.scrollTop)
                window.addEventListener('scroll', this.handleScroll)
                window.addEventListener('resize', () => {
                    if (document.body.clientWidth < 1200) {
                        this.handleScroll()
                    } else {
                        document.querySelector('#headscroll').style.margin = '0 auto'
                    }
                })
            },
            /**
             * 头部跟着页面横向滚动
             */
            handleScroll () {
                let scrollTop = '-' + window.pageXOffset + 'px'
                if (document.body.clientWidth < 1200) {
                    // 兼容error页面移动端滚动
                    if (process.client) {
                        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
                        if (!flag) {
                            document.querySelector('#headscroll').style.marginLeft = scrollTop
                        }
                    }
                }
            },
            /**
             * 跳转至一期
             */
            redirectOne (url) {
                if (url === '/computer/user/login' || url === '/computer/user/register') {
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
             * 退出登录
             */
            loginOut () {
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
            },
            /**
             *  获取当前时间戳
             */
            getnowtime () {
                return (new Date()).getTime()
            }
        },
        beforeDestroy () {
            window.removeEventListener('scroll', this.handleScroll)
            window.onresize = null
        }
    }
</script>

<style lang="less">
    @import '../../assets/css/computer/main.less';
</style>
<style lang="less" scoped>
    .i18n-dropdown {
        margin-left: 15px;
    }

    .drawer-title-li-active {
        color: #2EA9DF !important;
    }

    .item-flex {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 64px;
        line-height: 64px;
        padding-top: 15px;

        span {
            line-height: 20px;
        }

        .item-en {
            font-size: 12px;
        }
    }

    .item-flex-padding {
        padding-top: 22px;
    }

    .ant-menu-dark .ant-menu-item > a {
        color: #fff;
    }

    .head-active-box {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .kyc-tooltip {
            background: #F04134;
            font-size: 14px;
            min-width: 73px;
            text-align: center;
            border-radius: 4px;
            height: 30px;
            cursor: pointer;
            box-sizing: border-box;
            padding: 0 10px;
            margin-right: 10px;
            position: relative;
            a {
                display: block;
                color: #fff;
                line-height: 30px;
                width: 100%;
                text-decoration: none;
            }
            span {
                position: absolute;
                right: -10px;
                top: 50%;
                transform: translate(0, -50%);
                display: block;
                width: 10px;
                height: 12px;
                border: 5px solid transparent;
                border-left-color: #F04134;
            }
        }
        .head-img {
            width: 22px;
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 20px;
                height: 20px;
            }

            img:last-child {
                display: none;
            }

            img:first-child {
                display: block;
            }

            &:hover {
                img:first-child {
                    display: none;
                }

                img:last-child {
                    display: block;
                }
            }
        }
    }

    .header {
        .ant-menu-item, .ant-menu-submenu-title {
            padding: 0 11px !important;
        }
    }
    /deep/.head-img .ant-badge-dot {
        box-shadow: none;
        width: 9px;
        height: 9px;
        border: 1px solid #232933;
    }
</style>

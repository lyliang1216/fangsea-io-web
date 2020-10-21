<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key" :SelectedType="type"/>
        <section class="container">
            <a-layout-content>
                <banner :showBanner="showBanner" :bannerUrls="bannerUrls"/>
                <why-ptohome />
                <how-fund :videoHTML="videoHTML"/>
                <share-purchase :shareList="shareList" :listLength="listLength"/>
                <buy-house :houseList="houseList" :houseListLength="houseListLength"/>
                <web-desc />
            </a-layout-content>
        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import banner from '~/pages/computer/HomeComponents/HomeBanner'
    import WhyPtohome from '~/pages/computer/HomeComponents/WhyPtohome'
    import FsHead from '~/components/computer/FangseaHeader'
    import BannerData from '~/assets/utils/banner-data'
    import fonter from '~/components/computer/Footer'
    import Tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'

    // 组件异步加载
    const HowFund = () => import('~/pages/computer/HomeComponents/HowFund')
    const SharePurchase = () => import('~/pages/computer/HomeComponents/SharePurchase')
    const BuyHouse = () => import('~/pages/computer/HomeComponents/BuyHouse')
    const WebDesc = () => import('~/pages/computer/HomeComponents/WebDesc')

    export default {
        /**
         * 服务端渲染banner、视频地址
         * @param req
         */
        async asyncData ({req}) {
            if (process.server) {
                // 获取banner、视频地址
                let bannerUrls = []
                let videoHTML = ''
                let cookies = Tool.getcookiesInServer(req)
                let language = cookies.language
                try {
                    let bannerData = await axios.post(`${Tool.getAddress(req)}/cms/banner/list`, {traceId: Tool.UUID()})
                    if (bannerData.data.code.toString() === '0') {
                        let resData = bannerData.data.data
                        for (let i = 0; i < resData.length; i++) {
                            if (resData[i].type === 'PC') {
                                for (let j in resData[i].info) {
                                    if (resData[i].info[j].path !== '') {
                                        let dataItem = {}
                                        dataItem['imgUrl'] = resData[i].info[j].path
                                        dataItem['jumpUrl'] = resData[i].info[j].link
                                        bannerUrls.push(dataItem)
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    bannerUrls = []
                    console.log(e)
                }

                switch (cookies.language) {
                case 'zh_CN':
                    videoHTML = BannerData.videoHTMLCN
                    break
                case 'zh_TW':
                    videoHTML = BannerData.videoHTMLTW
                    break
                case 'en_US':
                    videoHTML = BannerData.videoHTMLEN
                    break
                default :
                    videoHTML = BannerData.videoHTMLTW
                }
                // 初始化数据
                return {bannerUrls, videoHTML, language}
            } else {
                return {bannerUrls: [], videoHTML: '', language: ''}
            }
        },
        data () {
            return {
                // 导航下标
                key: '1',
                // 登录下标
                type: 0,
                // 轮播图图片地址
                bannerUrls: [],
                // 视频地址
                videoHTML: '',
                // 地址当前所属语言
                language: '',
                // 数据初始化
                videoHTMLCN: BannerData.videoHTMLCN,
                videoHTMLTW: BannerData.videoHTMLTW,
                videoHTMLEN: BannerData.videoHTMLEN,
                // 份额购买
                shareList: [],
                // 份额购买数据长度
                listLength: -1,
                // 整房购买
                houseList: [],
                // 整房购买长度
                houseListLength: -1,
                showBanner: true
            }
        },
        created () {
            // 客服端渲染
            if (process.client) {
                this.updateImg()
                this.getBanner()
                this.changelang()
                window.addEventListener('scroll', this.listenSrcoll, true)
            }
        },
        methods: {
            // 获取banner
            getBanner () {
                this.showBanner = false
                let data = {
                    traceId: Tool.UUID()
                }
                axios.post('/cms/banner/list', data).then((res) => {
                    if (res.data.code.toString() === '0') {
                        this.bannerUrls = []
                        let resData = res.data.data
                        if (resData.length > 0 && JSON.stringify(resData).indexOf('PC') > 0) {
                            for (let i = 0; i < resData.length; i++) {
                                if (resData[i].type === 'PC') {
                                    for (let j in resData[i].info) {
                                        if (resData[i].info[j].path !== '') {
                                            let dataItem = {}
                                            this.showBanner = true
                                            dataItem['imgUrl'] = resData[i].info[j].path
                                            dataItem['jumpUrl'] = resData[i].info[j].link
                                            this.bannerUrls.push(dataItem)
                                        }
                                    }
                                }
                            }
                        } else {
                            let dataItem = {}
                            this.showBanner = true
                            switch (Cookie.get('language')) {
                            case 'zh_CN':
                                dataItem['imgUrl'] = 'homeImgs/banner/pc/web_default_cn.png'
                                break
                            case 'zh_TW':
                                dataItem['imgUrl'] = 'homeImgs/banner/pc/web_default_hk.png'
                                break
                            case 'en_US':
                                dataItem['imgUrl'] = 'homeImgs/banner/pc/web_default_en.png'
                                break
                            default :
                                dataItem['imgUrl'] = 'homeImgs/banner/pc/web_default_hk.png'
                            }
                            dataItem['jumpUrl'] = ''
                            this.bannerUrls.push(dataItem)
                        }
                    }
                }).catch((err) => {
                    let dataItem = {}
                    this.showBanner = true
                    switch (Cookie.get('language')) {
                    case 'zh_CN':
                        dataItem['imgUrl'] = 'homeImgs/banner/pc/web_default_cn.png'
                        break
                    case 'zh_TW':
                        dataItem['imgUrl'] = 'homeImgs/banner/pc/web_default_hk.png'
                        break
                    case 'en_US':
                        dataItem['imgUrl'] = 'homeImgs/banner/pc/web_default_en.png'
                        break
                    default :
                        dataItem['imgUrl'] = 'homeImgs/banner/pc/web_default_hk.png'
                    }
                    dataItem['jumpUrl'] = ''
                    this.bannerUrls.push(dataItem)
                    console.log(err)
                })
            },
            // 图片同步国际化
            updateImg () {
                if (this.language !== Cookie.get('language') || this.bannerUrls.length !== 0) {
                    switch (Cookie.get('language')) {
                    case 'zh_CN':
                        this.videoHTML = this.videoHTMLCN
                        break
                    case 'zh_TW':
                        this.videoHTML = this.videoHTMLTW
                        break
                    case 'en_US':
                        this.videoHTML = this.videoHTMLEN
                        break
                    }
                }
            },
            // 滚动加载组件数据
            listenSrcoll (e) {
                if (e.target.documentElement.scrollTop > 400) {
                    this.selectShareList()
                    this.getHouseList()
                    window.removeEventListener('scroll', this.listenSrcoll, true)
                }
            },
            // 查询份额购买
            selectShareList () {
                // 获取通证项目
                let data = { pageNum: 1, pageSize: 2 }
                axios.post('/pto/index/list', { traceId: Tool.UUID(), data })
                    .then(res => {
                        if (res.data.code.toString() === '0' && res.data.data.list) {
                            this.shareList = res.data.data.list
                            this.listLength = res.data.data.list.length
                        } else {
                            this.shareList = []
                            this.listLength = 0
                        }
                    })
            },
            // 获取房源列表数据
            getHouseList () {
                axios.post('/index/house/list')
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.houseList = res.data.data
                            this.houseListLength = res.data.data.length
                        }
                    })
            },
            changelang () {
                Bus.$on('checkLange', () => {
                    this.bannerUrls = []
                    this.getBanner()
                    this.selectShareList()
                    this.getHouseList()
                    this.updateImg()
                })
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
            window.removeEventListener('scroll', this.listenSrcoll, true)
        },
        components: {
            FsHead,
            fonter,
            banner,
            WhyPtohome,
            HowFund,
            SharePurchase,
            BuyHouse,
            WebDesc
        },
        head () {
            return {
                title: this.$t('PageTitle.house_index_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    #components-layout-computer-top {
        background: #ffffff;
    }

    /deep/ .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    /deep/ .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>

<template>
    <footer>
        <div class="footer-items">
            <div class="item">
                <p class="item-tt" @click="windowopen('AboutUs')">
                    {{$t('footer.footer_nav_aboutus')}}
                </p>
                <p class="item-href" @click="windowopen('PlatformIntroduction')">
                    {{$t('footer.footer_nav_platformintroduction')}}
                </p>
                <p class="item-href" @click="windowopen('TermsConditions')">
                    {{$t('footer.footer_nav_termsconditions')}}
                </p>
                <p class="item-href" @click="windowopen('IntroductionDigitalAssets')">
                    {{$t('footer.footer_nav_introductiondigitalassets')}}
                </p>
            </div>
            <div class="item">
                <p class="item-tt" @click="windowopen('Meida')">
                    {{$t('footer.footer_nav_meida')}}
                </p>
                <p class="item-href" @click="windowopen('PlatformMedia')">
                    {{$t('footer.footer_nav_platformmedia')}}
                </p>
                <p class="item-href" @click="windowopen('ProjectMedia')">
                    {{$t('footer.footer_nav_projectmedia')}}
                </p>
                <p class="item-href" @click="windowopen('EstateMedia')">
                    {{$t('footer.footer_nav_estatemedia')}}
                </p>
                <p class="item-href" @click="windowopen('BlackchainMedia')">
                    {{$t('footer.footer_nav_blackchainmedia')}}
                </p>
                <p class="item-href" @click="windowopen('OtherMedia')">
                    {{$t('footer.footer_nav_othermedia')}}
                </p>
            </div>
            <div class="item">
                <p class="item-tt" @click="windowopen('Knowledge')">
                    {{$t('footer.footer_nav_knowledge')}}
                </p>
                <p class="item-href" @click="windowopen('Blockchain')">
                    {{$t('footer.footer_nav_blockchain')}}
                </p>
                <p class="item-href" @click="windowopen('GlobalProperty')">
                    {{$t('footer.footer_nav_globalproperty')}}
                </p>
                <p class="item-href" @click="windowopen('InvestmentFinancial')">
                    {{$t('footer.footer_nav_investmentfinancial')}}
                </p>
            </div>
            <div class="item">
                <p class="item-tt" @click="windowopen('Promotion')">
                    {{$t('footer.footer_nav_promotion')}}
                </p>
                <p class="item-href" @click="windowopen('Platform')">
                    {{$t('footer.footer_nav_platform')}}
                </p>
                <p class="item-href" @click="windowopen('BuyPTs')">
                    {{$t('footer.footer_nav_buypts')}}
                </p>
                <p class="item-href" @click="windowopen('BuyUnits')">
                    {{$t('footer.footer_nav_buyunits')}}
                </p>
            </div>
            <div class="item">
                <p class="item-tt" @click="windowopen('HelpCenter')">
                    {{$t('footer.footer_nav_helpcenter')}}
                </p>
                <p class="item-href" @click="windowopen('FAQ')">
                    {{$t('footer.footer_nav_faq')}}
                </p>
                <p class="item-href" @click="windowopen('Services')">
                    {{$t('footer.footer_nav_services')}}
                </p>
                <p class="item-href" @click="windowopen('TradingProcess')">
                    {{$t('footer.footer_nav_tradingprocess')}}
                </p>
                <p class="item-href" @click="windowopen('Instructions')">
                    {{$t('footer.footer_nav_instructions')}}
                </p>
                <p class="item-href" @click="windowopen('AccountSecurity')">
                    {{$t('footer.footer_nav_accountsecurity')}}
                </p>
                <p class="item-href" @click="windowopen('Feedback')">
                    {{$t('footer.footer_nav_feedback')}}
                </p>
            </div>
            <div class="item">
                <p class="item-tt">
                    {{$t('footer.footer_nav_socialmedia')}}
                </p>
                <p class="item-href p-svg">
                    <a href="javascript:;" @click="totele">
                        <svg t="1557481649542" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2049" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><defs><style type="text/css"></style></defs><path d="M417.28 795.733333 429.226667 615.253333 756.906667 320C771.413333 306.773333 753.92 300.373333 734.72 311.893333L330.24 567.466667 155.306667 512C117.76 501.333333 117.333333 475.306667 163.84 456.533333L845.226667 193.706667C876.373333 179.626667 906.24 201.386667 894.293333 249.173333L778.24 795.733333C770.133333 834.56 746.666667 843.946667 714.24 826.026667L537.6 695.466667 452.693333 777.813333C442.88 787.626667 434.773333 795.733333 417.28 795.733333Z" p-id="2050" fill="#2EA9DF" data-spm-anchor-id="a313x.7781069.0.i6"></path></svg>
                        <svg t="1557481649542" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2049" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><defs><style type="text/css"></style></defs><path d="M417.28 795.733333 429.226667 615.253333 756.906667 320C771.413333 306.773333 753.92 300.373333 734.72 311.893333L330.24 567.466667 155.306667 512C117.76 501.333333 117.333333 475.306667 163.84 456.533333L845.226667 193.706667C876.373333 179.626667 906.24 201.386667 894.293333 249.173333L778.24 795.733333C770.133333 834.56 746.666667 843.946667 714.24 826.026667L537.6 695.466667 452.693333 777.813333C442.88 787.626667 434.773333 795.733333 417.28 795.733333Z" p-id="2050" fill="#999999" data-spm-anchor-id="a313x.7781069.0.i6"></path></svg>
                        <span>{{$t('footer.footer_nav_telegram')}}</span>
                    </a>
                </p>
                <p class="item-href p-svg">
                    <a href="https://www.facebook.com/ptohome" target="_blank">
                        <svg t="1557714017956" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2209" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><defs><style type="text/css"></style></defs><path d="M767.414857 6.838857v150.857143h-89.709714c-70.290286 0-83.419429 33.718857-83.419429 82.285714v107.995429h167.424l-22.272 169.142857H594.285714v433.700571H419.437714V517.12H273.737143V347.977143h145.700571V223.414857C419.437714 78.848 508.013714 0 637.147429 0c61.696 0 114.870857 4.571429 130.304 6.838857z" fill="#2EA9DF" p-id="2210"></path></svg>
                        <svg t="1557714017956" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2209" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><defs><style type="text/css"></style></defs><path d="M767.414857 6.838857v150.857143h-89.709714c-70.290286 0-83.419429 33.718857-83.419429 82.285714v107.995429h167.424l-22.272 169.142857H594.285714v433.700571H419.437714V517.12H273.737143V347.977143h145.700571V223.414857C419.437714 78.848 508.013714 0 637.147429 0c61.696 0 114.870857 4.571429 130.304 6.838857z" fill="#999999" p-id="2210"></path></svg>
                        <span>{{$t('footer.footer_nav_facebook')}}</span>
                    </a>
                </p>
                <p class="item-href p-svg">
                    <a href="https://twitter.com/pto_home" target="_blank">
                        <svg t="1557714044969" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3564" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><defs><style type="text/css"></style></defs><path d="M962.267429 233.179429q-38.253714 56.027429-92.598857 95.451429 0.585143 7.972571 0.585143 23.990857 0 74.313143-21.723429 148.260571t-65.974857 141.970286-105.398857 120.32-147.456 83.456-184.539429 31.158857q-154.843429 0-283.428571-82.870857 19.968 2.267429 44.544 2.267429 128.585143 0 229.156571-78.848-59.977143-1.170286-107.446857-36.864t-65.170286-91.136q18.870857 2.852571 34.889143 2.852571 24.576 0 48.566857-6.290286-64-13.165714-105.984-63.707429t-41.984-117.394286l0-2.267429q38.838857 21.723429 83.456 23.405714-37.741714-25.161143-59.977143-65.682286t-22.308571-87.990857q0-50.322286 25.161143-93.110857 69.12 85.138286 168.301714 136.265143t212.260571 56.832q-4.534857-21.723429-4.534857-42.276571 0-76.580571 53.979429-130.56t130.56-53.979429q80.018286 0 134.875429 58.294857 62.317714-11.995429 117.174857-44.544-21.138286 65.682286-81.115429 101.741714 53.174857-5.705143 106.276571-28.598857z" fill="#2EA9DF" p-id="3565"></path></svg>
                        <svg t="1557714044969" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3564" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><defs><style type="text/css"></style></defs><path d="M962.267429 233.179429q-38.253714 56.027429-92.598857 95.451429 0.585143 7.972571 0.585143 23.990857 0 74.313143-21.723429 148.260571t-65.974857 141.970286-105.398857 120.32-147.456 83.456-184.539429 31.158857q-154.843429 0-283.428571-82.870857 19.968 2.267429 44.544 2.267429 128.585143 0 229.156571-78.848-59.977143-1.170286-107.446857-36.864t-65.170286-91.136q18.870857 2.852571 34.889143 2.852571 24.576 0 48.566857-6.290286-64-13.165714-105.984-63.707429t-41.984-117.394286l0-2.267429q38.838857 21.723429 83.456 23.405714-37.741714-25.161143-59.977143-65.682286t-22.308571-87.990857q0-50.322286 25.161143-93.110857 69.12 85.138286 168.301714 136.265143t212.260571 56.832q-4.534857-21.723429-4.534857-42.276571 0-76.580571 53.979429-130.56t130.56-53.979429q80.018286 0 134.875429 58.294857 62.317714-11.995429 117.174857-44.544-21.138286 65.682286-81.115429 101.741714 53.174857-5.705143 106.276571-28.598857z" fill="#999999" p-id="3565"></path></svg>
                        <span>{{$t('footer.footer_nav_twitter')}}</span>
                    </a>
                </p>
            </div>
        </div>
        <p class="copyright">Copyright © 2018-2020 PTOHome | All Rights Reserved.</p>
    </footer>
</template>
<script>
    import Cookie from 'js-cookie'
    export default {
        name: 'fonter',
        data () {
            return {
                index: 0,
                platformJump: true
            }
        },
        methods: {
            /**
             * 新开页
             * @param name 目录名称
             */
            windowopen (name) {
                let lang = Cookie.get('language') === 'en_US'
                let url = ''
                switch (name) {
                case 'AboutUs' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/categories/360002188051-About-Us' : 'https://support.ptohome.com/hc/zh-hk/categories/360002188051-關於我們'
                    break
                case 'PlatformIntroduction' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006866052-Platform-Introduction' : 'https://support.ptohome.com/hc/zh-hk/sections/360006866052-%E5%B9%B3%E5%8F%B0%E4%BB%8B%E7%B4%B9'
                    break
                case 'TermsConditions' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006958991-Terms-Conditions' : 'https://support.ptohome.com/hc/zh-hk/sections/360006958991-%E6%A2%9D%E6%AC%BE%E8%81%B2%E6%98%8E'
                    break
                case 'IntroductionDigitalAssets' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360007020811-Introduction-of-Digital-Assets' : 'https://support.ptohome.com/hc/zh-hk/sections/360007020811-%E6%95%B8%E5%AD%97%E8%B3%87%E7%94%A2%E4%BB%8B%E7%B4%B9'
                    break
                case 'Meida' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/categories/360002188031-Media' : 'https://support.ptohome.com/hc/zh-hk/categories/360002188031-媒體資訊'
                    break
                case 'PlatformMedia' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006866072-Platform-Media' : 'https://support.ptohome.com/hc/zh-hk/sections/360006866072-%E5%B9%B3%E5%8F%B0%E8%B3%87%E8%A8%8A'
                    break
                case 'ProjectMedia' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006959011-Project-Media' : 'https://support.ptohome.com/hc/zh-hk/sections/360006959011-%E9%A0%85%E7%9B%AE%E8%B3%87%E8%A8%8A'
                    break
                case 'EstateMedia' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006959031-Estate-Media' : 'https://support.ptohome.com/hc/zh-hk/sections/360006959031-%E5%9C%B0%E7%94%A2%E8%B3%87%E8%A8%8A'
                    break
                case 'BlackchainMedia' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360007064171-Blockchain-Media' : 'https://support.ptohome.com/hc/zh-hk/sections/360007064171-%E9%8F%88%E5%9C%88%E8%B3%87%E8%A8%8A'
                    break
                case 'OtherMedia' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006959051-Other-Media' : 'https://support.ptohome.com/hc/zh-hk/sections/360006959051-%E5%85%B6%E4%BB%96%E8%B3%87%E8%A8%8A'
                    break
                case 'Knowledge' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/categories/360002188091-Knowledge' : 'https://support.ptohome.com/hc/zh-hk/categories/360002188091-知識百科'
                    break
                case 'Blockchain' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006866172-Blockchain' : 'https://support.ptohome.com/hc/zh-hk/sections/360006866172-%E8%A9%B1%E5%8D%80%E5%A1%8A%E9%8F%88'
                    break
                case 'GlobalProperty' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006959111-Global-Property' : 'https://support.ptohome.com/hc/zh-hk/sections/360006959111-全球房產'
                    break
                case 'InvestmentFinancial' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006959131-Investment-Financial' : 'https://support.ptohome.com/hc/zh-hk/sections/360006959131-%E6%8A%95%E8%B3%87%E7%90%86%E8%B2%A1'
                    break
                case 'Promotion' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/categories/360002177792-Promotion' : 'https://support.ptohome.com/hc/zh-hk/categories/360002177792-精彩活動'
                    break
                case 'Platform' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006960311-Platform' : 'https://support.ptohome.com/hc/zh-hk/sections/360006960311-%E5%B9%B3%E5%8F%B0%E6%B4%BB%E5%8B%95'
                    break
                case 'BuyPTs' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006959091-Buy-PTs' : 'https://support.ptohome.com/hc/zh-hk/sections/360006959091-%E4%BB%BD%E9%A1%8D%E4%BA%A4%E6%98%93'
                    break
                case 'BuyUnits' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006959071-Buy-Units' : 'https://support.ptohome.com/hc/zh-hk/sections/360006959071-%E6%95%B4%E6%88%BF%E8%B3%BC%E8%B2%B7'
                    break
                case 'HelpCenter' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/categories/360002188071-Help-Center' : 'https://support.ptohome.com/hc/zh-hk/categories/360002188071-幫助中心'
                    break
                case 'FAQ' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006865972-FAQ' : 'https://support.ptohome.com/hc/zh-hk/sections/360006865972-%E5%B8%B8%E8%A6%8B%E5%95%8F%E9%A1%8C'
                    break
                case 'Services' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006865992-Services' : 'https://support.ptohome.com/hc/zh-hk/sections/360006865992-%E6%9C%8D%E5%8B%99%E4%BB%8B%E7%B4%B9'
                    break
                case 'TradingProcess' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006866012-Trading-Process' : 'https://support.ptohome.com/hc/zh-hk/sections/360006866012-%E4%BA%A4%E6%98%93%E6%B5%81%E7%A8%8B'
                    break
                case 'Instructions' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006925472-Instructions' : 'https://support.ptohome.com/hc/zh-hk/sections/360006925472-%E6%93%8D%E4%BD%9C%E8%AA%AA%E6%98%8E'
                    break
                case 'AccountSecurity' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006925312-Account-Security' : 'https://support.ptohome.com/hc/zh-hk/sections/360006925312-%E5%AE%89%E5%85%A8%E5%B0%88%E6%AC%84'
                    break
                case 'Feedback' :
                    url = lang ? 'https://support.ptohome.com/hc/en-us/sections/360006866032-Feedback' : 'https://support.ptohome.com/hc/zh-hk/sections/360006866032-%E6%84%8F%E8%A6%8B%E5%8F%8D%E9%A5%8B'
                    break
                }
                window.open(url)
            },
            // telegram
            totele () {
                let url = 'https://t.me/PTOHomeCN'
                if (Cookie.get('language')) {
                    switch (Cookie.get('language')) {
                    case 'zh_TW' :
                        url = 'https://t.me/PTOHomeCN'
                        break
                    case 'zh_CN' :
                        url = 'https://t.me/PTOHomeCN'
                        break
                    case 'en_US' :
                        url = 'https://t.me/PTOHome'
                        break
                    }
                }
                window.open(url)
            }
        }
    }
</script>

<style lang="less">
    @import '../../assets/css/computer/main.less';
</style>
<style lang="less" scoped>
    .has-link{
        &:hover{
            color: #2EA9DF!important;
            cursor: pointer;
        }
    }
</style>

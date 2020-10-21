<template>
    <a-layout id="components-layout-mobile-top"
              class="layout">
        <section id="mobile-positionplan">
            <a-layout-content>
                <div class="point-out">
                    <p class="point-out-desc">{{$t('PositionPlan.positionPlan_to_access')}}</p>
                    <p class="point-out-link">{{link}}</p>
                    <div class="point-out-button">
                        <a-row style="width: 2.1rem;margin: 0 auto">
                            <a-col :span="3"><img src="/content/positionPlan/icon_safe.png"></a-col>
                            <a-col :span="21" class="point-out-button-desc">
                                {{$t('PositionPlan.positionPlan_360_complete_detection')}}
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="24">
                                <a-button type="primary" class="point-out-button-bt" @click="click">
                                    {{$t('PositionPlan.positionPlan_continue_acc')}}
                                </a-button>
                            </a-col>
                        </a-row>
                    </div>
                </div>
            </a-layout-content>
        </section>
    </a-layout>
</template>

<script>
    import axios from '~/plugins/axios'
    import Cookie from 'js-cookie'

    export default {
        data () {
            return {
                // 继续访问
                link: '',
                // 继续访问
                pushLink: ''
            }
        },
        mounted () {
            this.setLanguage()
            this.getPath()
        },
        methods: {
            /**
             * 初始化国际化
             */
            setLanguage () {
                let headerLanguage = (navigator.language || navigator.userLanguage) // 常规浏览器语言和IE浏览器
                let language = headerLanguage.replace('-', '_')
                this.$i18n.locale = language
                this.$store.dispatch('updateLang', language)
                Cookie.set('language', language)
                let acceptLanguage = headerLanguage.indexOf('en') === -1 ? `${headerLanguage},zh;q=0.9` : `${headerLanguage},en;q=0.9`
                axios.defaults.headers['Accept-Language'] = acceptLanguage
            },
            /**
             * 获取用户 UID
             */
            getPath () {
                // 当前服务器地址
                let server = `${window.location.protocol}//${window.location.host}`
                this.link = `${server}/mobile/user/register?UID=${this.$route.query.UID}`
                this.pushLink = `/mobile/user/register?UID=${this.$route.query.UID}`
            },
            /**
             *  继续访问
             */
            click () {
                this.$router.push(this.pushLink)
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../assets/css/mobile/main.less';

    #mobile-positionplan {
        background-color: #FFFFFF;

        .point-out {
            margin: 0.7rem auto 0;
            width: 3.15rem;
            text-align: center;

            .point-out-desc {
                font-size:20px;
                font-weight:400;
                color:rgba(0,0,0,1);
                line-height:28px;
            }

            .point-out-link {
                border: 1px solid #2EA9DF;
                height: 0.44rem;
                width: 100%;
                background-color: #D5EEF9;
                font-size:14px;
                color:rgba(46,169,223,1);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 0.11rem 0.15rem;
            }

            .point-out-button {
                margin: 1rem auto 0;

                .point-out-button-desc {
                    font-size:15px;
                    font-weight:400;
                    color:rgba(0,0,0,1);
                }

                .point-out-button-bt {
                    margin-top: 0.11rem;
                    font-size:20px;
                    font-weight:400;
                    color:rgba(255,255,255,1);
                    border-radius: 4px;
                    min-width: 2.06rem;
                    height: 0.44rem;
                }
            }
        }

    }
</style>

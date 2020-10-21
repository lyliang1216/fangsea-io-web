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
                    <!--          面包屑导航          -->
                    <Breadcrumb :routes="routes"/>
                    <div class="content">
                        <div class="tags-title">
                            {{$t('ImmediatelySuccess.immediatelySuccess_buy_success')}}
                        </div>
                        <!--           认购信息             -->
                        <div class="info-body">
                            <a-row class="mg-bm-8">
                                <a-col :span="24" class="mg-bm-8">
                                    {{$t('SubscribeImmediately.subscribeImmediately_project_number')}}: {{number}}
                                </a-col>
                                <a-col :span="24" class="mg-bm-8">
                                    {{$t('ImmediatelySuccess.immediatelySuccess_buy_number')}}: {{buyNumber | formatNumber}}{{$t('SubscribeImmediately.subscribeImmediately_project_portion')}}
                                </a-col>
                                <a-col :span="24" class="mg-bm-8">
                                    {{$t('SubscribeImmediately.subscribeImmediately_wallet_pay')}}: {{payNumber | formatNumber}} {{curCode}}
                                </a-col>
                            </a-row>
                        </div>
                        <!--           继续认购、查看详情             -->
                        <div class="protocol-row">
                            <a href="javascript:;" @click="JudgeRedirect(`/mobile/CertificatePurchase/info`)">
                                <a-button
                                        ghost
                                        type="primary"
                                        class="login-form-button">
                                    {{$t('ImmediatelySuccess.immediatelySuccess_continue_subscribe')}}
                                </a-button>
                            </a>
                            <nuxt-link :to="{path: '/mobile/user/UserCenter/TransactionRecord', query: { initCheckPan: '4'}}">
                                <a-button
                                        type="primary"
                                        class="login-form-button">
                                    {{$t('ImmediatelySuccess.immediatelySuccess_order_info')}}
                                </a-button>
                            </nuxt-link>
                        </div>
                    </div>
                </a-layout-content>
            </div>
        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import Breadcrumb from '~/components/mobile/Breadcrumb'
    import FsHead from '~/components/mobile/FangseaHeader'
    import {formatNumber} from '~/assets/utils/index'
    import fonter from '~/components/mobile/Footer'
    import {Bus} from '~/assets/utils/bus'

    export default {
        data () {
            return {
                // 登录、注册导航下标
                type: 0,
                // 首页导航下标
                key: 3,
                // 用户中心导航下标
                centerKey: 0,
                // 抽屉切换动画
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                routes: [],
                // 当前项目编号
                number: 0,
                // 当前项目ID
                projectId: 0,
                // 购买份数
                buyNumber: 0,
                // 花费金额
                payNumber: 0,
                // 当前支付币种符号
                curCode: 0
            }
        },
        // 初始化数据
        mounted () {
            this.listenI18n()
            this.initInfo()
        },
        methods: {
            /**
             * 跳转判断语言 (参数特殊处理，不能复制到其他地方使用)
             * @param val 跳转路径
             */
            JudgeRedirect (val) {
                this.$router.push(`${val}/${this.projectId}`)
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.initInfo()
                })
            },
            /**
             * 初始化面包屑国际化
             */
            initBreadcrumb (projectId) {
                this.routes = [ {
                    path: '/mobile',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_home')
                },
                {
                    path: '/mobile/CertificatePurchase',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts')
                },
                {
                    path: `/mobile/CertificatePurchase/info/${projectId}`,
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts_info')
                },
                {
                    path: `/mobile/CertificatePurchase/SubscribeImmediately/${projectId}`,
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts_buy')
                },
                {
                    path: '/mobile/CertificatePurchase/ImmediatelySuccess',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts_buy_success')
                }]
            },
            /**
             *  查询认购成功信息
             */
            initInfo () {
                this.curCode = sessionStorage.getItem('curCode')
                this.number = sessionStorage.getItem('number')
                this.projectId = sessionStorage.getItem('projectId')
                this.buyNumber = sessionStorage.getItem('buyNumber')
                this.payNumber = sessionStorage.getItem('payNumber')
                this.initBreadcrumb(sessionStorage.getItem('projectId'))
            },
            // 开启右侧抽屉导航
            openDrawer () {
                this.drawer = {'drawer-containel-left': true, 'drawer-containel-right': false}
            },
            // 关闭右侧抽屉导航
            closeDrawer () {
                this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': true}
                let _this = this
                setTimeout(function () {
                    _this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': false}
                }, 200)
            }
        },
        filters: {
            formatNumber
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        components: {
            FsHead,
            fonter,
            Breadcrumb
        },
        head () {
            return {
                title: this.$t('PageTitle.successsub_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    .section {
        background: #ffffff;

        .container {
            margin: 0 auto;

            .content {
                padding: 0 !important;

                .tags-title {
                    text-align: center;
                    font-size: 20px;
                    color: rgba(47, 170, 224, 1);
                    letter-spacing: 2px;
                }

                .protocol-row {
                    padding: 0 0.16rem;

                    /deep/ .ant-checkbox-wrapper {
                        font-size: 16px;
                    }
                }

                .info-body {
                    padding-left: 0.85rem;
                    margin-top: 0.2rem;
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    letter-spacing: 2px;

                    /deep/ .ant-checkbox-wrapper {
                        font-size: 16px;
                    }

                    .mg-bm-8 {
                        margin-bottom: 0.12rem;
                    }
                }

                .login-form-button {
                    margin-top: 0.16rem;
                    height: 0.34rem;
                    border-radius: 8px;
                    width: 100%;
                    font-size: 16px;
                }
            }
        }
    }
</style>

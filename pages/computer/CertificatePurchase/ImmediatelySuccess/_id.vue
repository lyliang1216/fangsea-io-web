<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key" :SelectedType="type"/>
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
                                    {{$t('ImmediatelySuccess.immediatelySuccess_buy_number')}}: {{buyNumber | formatNumber}}
                                    {{$t('SubscribeImmediately.subscribeImmediately_project_portion')}}
                                </a-col>
                                <a-col :span="24" class="mg-bm-8">
                                    {{$t('SubscribeImmediately.subscribeImmediately_wallet_pay')}}: {{payNumber | formatNumber}} {{curCode}}
                                </a-col>
                            </a-row>
                        </div>
                        <!--           继续认购、查看详情             -->
                        <div class="protocol-row">
                            <a href="javascript:;" @click="JudgeRedirect(`/computer/CertificatePurchase/info`)">
                                <a-button
                                        ghost
                                        type="primary"
                                        class="login-form-button">
                                    {{$t('ImmediatelySuccess.immediatelySuccess_continue_subscribe')}}
                                </a-button>
                            </a>
                            <nuxt-link :to="{path: '/computer/user/UserCenter', query: {getKey: '4', initCheckPan: '4'}}">
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
    import Breadcrumb from '~/components/computer/Breadcrumb'
    import FsHead from '~/components/computer/FangseaHeader'
    import fonter from '~/components/computer/Footer'
    import {formatNumber} from '~/assets/utils/index'
    import {Bus} from '~/assets/utils/bus'

    export default {
        data () {
            return {
                // 首页导航下标
                key: '3',
                // 登录、注册导航下标
                type: 0,
                // 面包屑数据
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
                this.routes = [{
                    path: '/computer',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_home')
                },
                {
                    path: '/computer/CertificatePurchase',
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts')
                },
                {
                    path: `/computer/CertificatePurchase/info/${projectId}`,
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts_info')
                },
                {
                    path: `/computer/CertificatePurchase/SubscribeImmediately/${projectId}`,
                    breadcrumbName: this.$t('Breadcrumb.breadcrumb_title_buypts_buy')
                },
                {
                    path: '/computer/CertificatePurchase/ImmediatelySuccess',
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
            width: 1200px;

            .content {
                margin: 0 auto;
                width: 440px;
                padding: 0 !important;

                .tags-title {
                    text-align: center;
                    font-size: 24px;
                    color: rgba(47, 170, 224, 1);
                    letter-spacing: 2px;
                }

                .protocol-row {
                    display: flex;
                    justify-content: space-around;

                   /deep/ .ant-checkbox-wrapper {
                        font-size: 16px;
                    }
                }

                .info-body {
                    padding-left: 117px;
                    margin-top: 20px;
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(51, 51, 51, 1);
                    letter-spacing: 2px;

                    /deep/ .ant-checkbox-wrapper {
                        font-size: 16px;
                    }

                    .mg-bm-8 {
                        margin-bottom: 12px;
                    }
                }

                .login-form-button {
                    margin-top: 16px;
                    height: 60px;
                    border-radius: 8px;
                    min-width: 160px;
                    font-size: 20px;
                    font-weight: 600;
                }
            }
        }
    }
</style>

<template>
    <div>
        <a-layout id="components-layout-mobile-top"
                  class="layout"
                  :class="drawer">
            <fs-head
                    :SelectedKey="key"
                    :SelectedType="type"
                    :centerKey="centerKey"
                    @openDrawer="openDrawer"
                    @closeDrawer="closeDrawer"/>
            <kyc-authentication v-if="state===1" @sbmitsuccess="sbmitsuccess" :kycData="kycData" :country="country"></kyc-authentication>
            <kyc-info v-if="state===2" :kycData="kycData" :country="country"></kyc-info>
            <In-authentication v-if="state===0" @toedit="showedit" @getInfo="getInfo"></In-authentication>
            <fonter/>
        </a-layout>
    </div>
</template>

<script>
    import InAuthentication from '~/pages/mobile/user/UserCenter/AuthenticationKYC/kycComponents/InAuthentication'
    import KycAuthentication from '~/pages/mobile/user/UserCenter/AuthenticationKYC/kycComponents/index'
    import KycInfo from '~/pages/mobile/user/UserCenter/AuthenticationKYC/kycComponents/KYCInfo'
    import FsHead from '~/components/mobile/FangseaHeader'
    import fonter from '~/components/mobile/Footer'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import axios from '~/plugins/axios'

    export default {
        name: 'kyccontent',
        data () {
            return {
                // 身份认证状态
                state: -1,
                // 首页高亮下标
                key: '0',
                // 表单布局模式
                formLayout: 'vertical',
                // 登录、注册导航下标
                type: 0,
                // 用户中心导航下标
                centerKey: 6,
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // kyc信息
                kycData: {},
                // 国家列表
                country: []
            }
        },
        created () {
            if (process.client) {
                this.getcountry()
                this.getKycActive()
                this.listenI18n()
            }
        },
        mounted () {
            setTimeout(() => {
                Bus.$emit('publicEvent', 'AUTHENTICATIONKYC')
            }, 300)
        },
        methods: {
            /**
             * 第一次提交后更新数据
             */
            getInfo (data) {
                this.kycData = data
            },
            /**
             *  获取国家列表
             */
            getcountry () {
                axios.post('/cms/region/usable/country/query', {
                    traceId: tool.UUID()
                })
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.country = res.data.data
                        }
                    }).catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 查询用户kyc
             */
            getKycActive () {
                let params = {
                    traceId: tool.UUID()
                }
                // 查询用户kyc
                axios.post('/dc/user/kyc/query/user', params)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            if (res.data.data) {
                                this.kycData = res.data.data
                                switch (res.data.data.auditState) {
                                case 0:
                                    this.state = 0
                                    break
                                case 1:
                                    this.state = 1
                                    break
                                case 2:
                                    if (res.data.data.passportEndTime - parseInt(this.getnowtime() / 1000) < 30 * 24 * 60 * 60) {
                                        this.state = 1
                                    } else {
                                        this.state = 2
                                    }
                                    break
                                default:
                                    break
                                }
                            } else {
                                this.state = 1
                            }
                        }
                    }).catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 显示编辑审核
             */
            showedit (index) {
                this.state = index
            },
            /**
             * 显示认证中
             */
            sbmitsuccess (index) {
                this.state = index
            },
            /**
             *  获取当前时间戳
             */
            getnowtime () {
                return (new Date()).getTime()
            },
            /**
             * 开启右侧抽屉导航
             */
            openDrawer () {
                this.drawer = {'drawer-containel-left': true, 'drawer-containel-right': false}
            },
            /**
             * 关闭右侧抽屉导航
             */
            closeDrawer () {
                this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': true}
                let _this = this
                setTimeout(function () {
                    _this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': false}
                }, 200)
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.getcountry()
                })
            }
        },
        components: {
            KycAuthentication,
            KycInfo,
            InAuthentication,
            FsHead,
            fonter
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        head () {
            return {
                title: this.$t('PageTitle.kyc_pagetitle')
            }
        }
    }
</script>
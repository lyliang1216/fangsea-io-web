<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key" :SelectedType="type"/>
        <a-layout class="user-center-content">
            <a-layout-sider width="200" style="background: #fff">
                <a-menu
                        mode="inline"
                        :selectedKeys=siderKey
                        :defaultSelectedKeys="['1']"
                        :defaultOpenKeys="['sub1']"
                        @select="selectItem"
                        :style="{ height: '100%', borderRight: 0 }">
                    <a-menu-item key="7">
                        <a-badge :dot="hasUpdated('POSITIONPLAN')" :offset="[3, 0]">
                            {{$t('sider.sidebar_name_8')}}
                        </a-badge>
                    </a-menu-item>
                    <a-menu-item key="1">
                        <a-badge :dot="hasUpdated('MYPROPERTY')" :offset="[3, 0]">
                            {{$t('sider.sidebar_name_2')}}
                        </a-badge>
                    </a-menu-item>
                    <a-menu-item key="2">
                        <a-badge :dot="hasUpdated('MYWALLET')" :offset="[3, 0]">
                            {{$t('sider.sidebar_name_3')}}
                        </a-badge>
                    </a-menu-item>
                    <a-menu-item key="4">
                        <a-badge :dot="hasUpdated('TRANSACTIONRECORD')" :offset="[3, 0]">
                            {{$t('sider.sidebar_name_5')}}
                        </a-badge>
                    </a-menu-item>
                    <a-menu-item key="3">
                        <a-badge :dot="hasUpdated('ADDRESSMANAGEMENT')" :offset="[3, 0]">
                            {{$t('sider.sidebar_name_4')}}
                        </a-badge>
                    </a-menu-item>
                    <a-menu-item key="5">
                        <a-badge :dot="hasUpdated('MYMESSAGE')" :offset="[3, 0]">
                            {{$t('sider.sidebar_name_0')}}
                        </a-badge>
                    </a-menu-item>
                    <a-menu-item key="6">
                        <a-badge :dot="hasUpdated('AUTHENTICATIONKYC')" :offset="[3, 0]">
                            {{$t('sider.sidebar_name_7')}}
                        </a-badge>
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
            <a-layout style="padding-left:24px">
                <a-layout-content class="a-layout-content">
                    <wallet-info v-if="siderIndex === '2'"></wallet-info>
                    <address-management v-if="siderIndex === '3'"></address-management>
                    <transation-record :initCheckPan="initCheckPan" v-if="siderIndex === '4'"></transation-record>
                    <message-info v-if="siderIndex === '5'"></message-info>
                    <kyc-content v-if="siderIndex === '6'"></kyc-content>
                    <position-plan v-if="siderIndex === '7'"></position-plan>
                </a-layout-content>
            </a-layout>
        </a-layout>
        <fonter/>
    </a-layout>
</template>

<script>
    import AddressManagement from '~/pages/computer/user/UserCenter/AddressManagement/index'
    import TransationRecord from '~/pages/computer/user/UserCenter/TransactionRecord/index'
    import KycContent from '~/pages/computer/user/UserCenter/AuthenticationKYC/index'
    import PositionPlan from '~/pages/computer/user/UserCenter/PositionPlan/index'
    import MessageInfo from '~/pages/computer/user/UserCenter/MyMessage/index'
    import WalletInfo from '~/pages/computer/user/UserCenter/MyWallet/index'
    import FsHead from '~/components/computer/FangseaHeader'
    import fonter from '~/components/computer/Footer'

    export default {
        /**
         * 返回对应的组件
         */
        asyncData ({query}) {
            return query.getKey ? {
                siderKey: [query.getKey],
                siderIndex: query.getKey,
                initCheckPan: query.initCheckPan === '' ? '' : query.initCheckPan
            } : {
                siderKey: ['1'],
                siderIndex: '1'
            }
        },
        data () {
            return {
                // 首页导航下标
                key: '0',
                // 登录、注册导航下标
                type: 0,
                // 用户中心下标
                siderKey: ['1'],
                // 组件下标
                siderIndex: '1',
                // 默认选中的交易记录的提现记录
                initCheckPan: ''
            }
        },
        watch: {
            '$route': 'changeView'
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
             * @param item
             * @param key sider选中的item
             * @param selectedKeys
             */
            selectItem ({item, key, selectedKeys}) {
                if (key === '1') {
                    window.location.href = '/order/list/ot0opg1.html'
                } else {
                    this.$router.push({path: '/computer/user/UserCenter', query: {getKey: key}})
                }
            },
            /**
             * 监听路由改变视图
             */
            changeView () {
                if (this.$route.query.getKey) {
                    this.siderKey = [this.$route.query.getKey]
                    this.siderIndex = this.$route.query.getKey
                } else {
                    this.siderKey = ['1']
                    this.siderIndex = '1'
                }
            }
        },
        components: {
            AddressManagement,
            TransationRecord,
            PositionPlan,
            MessageInfo,
            KycContent,
            WalletInfo,
            FsHead,
            fonter
        },
        head () {
            return {
                title: this.$t('PageTitle.mycenter_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>

    .content {
        margin-left: 30px;
        background-color: #ffffff;
    }

    .user-center-content {
        flex-direction: row;
        margin: 0 auto;
        min-height: e("calc(100vh - 126px)");
    }

    .a-layout-content {
        background: none;
        padding: 0;
        margin: 0;
        max-width: 898px;
        width: 898px;
    }

    .ant-menu-vertical .ant-menu-item, .ant-menu-vertical-left .ant-menu-item, .ant-menu-vertical-right .ant-menu-item, .ant-menu-inline .ant-menu-item, .ant-menu-vertical .ant-menu-submenu-title, .ant-menu-vertical-left .ant-menu-submenu-title, .ant-menu-vertical-right .ant-menu-submenu-title, .ant-menu-inline .ant-menu-submenu-title {
        margin-top: 0;
    }

    .ant-menu-vertical .ant-menu-item:not(:last-child), .ant-menu-vertical-left .ant-menu-item:not(:last-child), .ant-menu-vertical-right .ant-menu-item:not(:last-child), .ant-menu-inline .ant-menu-item:not(:last-child) {
        margin-bottom: 0;
    }

    .ant-menu-vertical > .ant-menu-item, .ant-menu-vertical-left > .ant-menu-item, .ant-menu-vertical-right > .ant-menu-item, .ant-menu-inline > .ant-menu-item, .ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title, .ant-menu-vertical-left > .ant-menu-submenu > .ant-menu-submenu-title, .ant-menu-vertical-right > .ant-menu-submenu > .ant-menu-submenu-title, .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
        line-height: 54px;
        height: 54px;
        padding-left: 24px !important;
    }

    .ant-menu-item-selected {
        color: #2EA9DF;
    }

    .ant-menu-vertical .ant-menu-item:after, .ant-menu-vertical-left .ant-menu-item:after, .ant-menu-vertical-right .ant-menu-item:after, .ant-menu-inline .ant-menu-item:after {
        border-right: 2px solid #2EA9DF
    }

    .a-layout-content {
        background: none;
    }
</style>

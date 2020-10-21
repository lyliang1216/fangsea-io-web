<template>
    <a-layout id="components-layout-mobile-top" class="layout" :class="drawer">
        <fs-head :SelectedKey="key"
                 :SelectedType="type"
                 :centerKey="centerKey"
                 @openDrawer="openDrawer"
                 @closeDrawer="closeDrawer"/>
        <section class="container">
            <a-layout-content>
                <div class="flex-column">
                    <!--        基本信息        -->
                    <div class="message-info-item item-basic">
                        <p class="item-title">{{$t('MyMessage.myprofile_basicinfo_title_info')}}</p>
                        <div class="item-body">
                            <span class="head-img-info">{{headimg}}</span>
                            <span class="user-name">{{nikeName}}</span>
                            <a-tag color="#FFF3D8" v-if="auditState===0" @click="tokyc">
                                <a-icon type="exclamation-circle" theme="filled"
                                        style="color: #FFC32B"/>
                                &nbsp<span class="user-status">{{$t('MyMessage.myprofile_kyc_status_progressing')}}</span></a-tag>
                            <a-tag color="#FFF3D8" v-if="auditState===1" @click="tokyc">
                                <a-icon type="check-circle" theme="filled"
                                        style="color: #FFC32B"/>
                                &nbsp<span class="user-status">{{$t('MyMessage.myprofile_kyc_status_fail')}}</span></a-tag>
                            <a-tag color="#D8FFE1" v-if="auditState===2" @click="tokyc">
                                <a-icon type="check-circle" theme="filled"
                                        style="color: #27E774"/>
                                &nbsp<span class="user-status">{{$t('MyMessage.myprofile_kyc_status_succ')}}</span></a-tag>
                            <a-tag color="#FFF3D8" v-if="auditState===3" @click="tokyc">
                                <a-icon type="check-circle" theme="filled"
                                        style="color: #FFC32B"/>
                                &nbsp<span class="user-status">{{$t('MyMessage.myprofile_kyc_status_not')}}</span></a-tag>
                        </div>
                    </div>
                    <!--        账号绑定信息        -->
                    <div class="message-info-item item-bind">
                        <p class="item-title">{{$t('MyMessage.myprofile_bindinfo_title_bindinfo')}}</p>
                        <div class="item-body">
                            <a-row type="flex" justify="space-between">
                                <a-col :span="9" class="body-key">{{$t('MyMessage.myprofile_bindinfo_title_phonenum')}}：</a-col>
                                <a-col :span="11" class="body-value">{{mobile}}</a-col>
                                <a-col
                                        @click="goCorrespondingPage('mobile-user-UserCenter-MyMessage-ChangeMobile')"
                                        :span="4"
                                        class="change-mobile"
                                        v-if="mobile">
                                    {{$t('MyMessage.myprofile_bindinfo_btn_changebind')}}
                                </a-col>
                                <a-col
                                        @click="goCorrespondingPage('mobile-user-UserCenter-MyMessage-BindMobile')"
                                        :span="4"
                                        class="change-mobile"
                                        v-if="!mobile">
                                    {{$t('MyMessage.myprofile_bindinfo_btn_bind')}}
                                </a-col>
                            </a-row>
                            <a-divider class="divider"></a-divider>
                            <a-row type="flex" justify="space-around" align="middle">
                                <a-col :span="9" class="body-key">{{$t('MyMessage.myprofile_bindinfo_title_email')}}：</a-col>
                                <a-col :span="11" class="body-value">{{email}}</a-col>
                                <a-col
                                        @click="goCorrespondingPage('mobile-user-UserCenter-MyMessage-ChangeMailBox')"
                                        :span="4"
                                        class="change-mobile"
                                        v-if="email">{{$t('MyMessage.myprofile_bindinfo_btn_changebind')}}
                                </a-col>
                                <a-col
                                        @click="goCorrespondingPage('mobile-user-UserCenter-MyMessage-BindMailbox')"
                                        :span="4"
                                        class="change-mobile"
                                        v-if="!email">{{$t('MyMessage.myprofile_bindinfo_btn_bind')}}
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                    <!--        登录密码        -->
                    <div class="message-info-item item-password">
                        <p class="item-title">{{$t('MyMessage.myprofile_pswmanage_title_manage')}}</p>
                        <div class="item-body">
                            <a-row type="flex" justify="space-between">
                                <a-col :span="9" class="body-key">{{$t('MyMessage.myprofile_pswmanage_title_loginpsw')}}：</a-col>
                                <a-col :span="11" class="body-value">*******</a-col>
                                <a-col
                                        @click="goModification"
                                        :span="4"
                                        class="change-mobile">{{$t('MyMessage.myprofile_btn_changepsw')}}</a-col>
                            </a-row>
                        </div>
                    </div>
                    <!--       登录记录         -->
                    <div class="item-login">
                        <p class="item-title">{{$t('MyMessage.myprofile_loginhistory_title_headline')}}</p>
                        <div class="item-body">
                            <a-tabs defaultActiveKey="1">
                                <a-tab-pane :tab="$t('MyMessage.myprofile_loginhistory_title_history')" key="1">
                                    <a-table :scroll="{ x: 670 }" :columns="columns" :dataSource="data" :pagination="pagination">
                                        <template slot="loginTime" slot-scope="loginTime">{{loginTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</template>
                                    </a-table>
                                </a-tab-pane>
                            </a-tabs>
                        </div>
                    </div>
                </div>
            </a-layout-content>
        </section>
        <fonter/>
    </a-layout>
</template>
<script>
    import FsHead from '~/components/mobile/FangseaHeader'
    import fonter from '~/components/mobile/Footer'
    import {parseTime} from '~/assets/utils/index'
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'
    import axios from '~/plugins/axios'

    export default {
        data () {
            return {
                // 登录、注册导航下标
                type: 0,
                // 首页导航下标
                key: '0',
                // 用户中心导航下标
                centerKey: 5,
                // 抽屉切换动画
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 表格头数据
                columns: [
                    {title: this.$t('MyMessage.myprofile_loginhistory_table_col1'), width: 175, dataIndex: 'loginTime', key: 'loginTime', scopedSlots: { customRender: 'loginTime' }},
                    {title: this.$t('MyMessage.myprofile_loginhistory_table_col2'), width: 90, dataIndex: 'loginType', key: 'loginType'},
                    {title: this.$t('MyMessage.myprofile_loginhistory_table_col3'), dataIndex: 'loginLocal', key: 'loginLocal', width: 175},
                    {title: this.$t('MyMessage.myprofile_loginhistory_table_col4'), dataIndex: 'loginIp', key: 'loginIp', width: 150},
                    {title: this.$t('MyMessage.myprofile_loginhistory_table_col5'), dataIndex: 'loginStatus', key: 'loginStatus'}
                ],
                // 分页组件
                pagination: {
                    onChange: (currentPage) => {
                        this.current = currentPage
                        this.loginHistory()
                    },
                    pageSize: 10,
                    total: 0
                },
                // 表格数据
                data: [],
                // 昵称
                nikeName: '',
                // 手机号
                mobile: '',
                // 邮件
                email: '',
                // 初始页码
                current: 1,
                // 初始总数
                total: 0,
                // 分页
                pageSize: 10,
                // kyc认证状态
                auditState: 3,
                // 头像中间数字
                headimg: ''
            }
        },
        created () {
            if (process.client) {
                this.listenI18n()
                this.tableColumns()
                this.userInfo()
                this.loginHistory()
                this.getkycinfo()
            }
        },
        mounted () {
            setTimeout(() => {
                Bus.$emit('publicEvent', 'MYMESSAGE')
            }, 300)
        },
        // 转换时间格式
        filters: {
            parseTime
        },
        methods: {
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.tableColumns()
                    this.loginHistory()
                })
            },
            // 表格头国际化
            tableColumns () {
                this.columns = [
                    {title: this.$t('MyMessage.myprofile_loginhistory_table_col1'), width: 175, dataIndex: 'loginTime', key: 'loginTime', scopedSlots: { customRender: 'loginTime' }},
                    {title: this.$t('MyMessage.myprofile_loginhistory_table_col2'), width: 90, dataIndex: 'loginType', key: 'loginType'},
                    {title: this.$t('MyMessage.myprofile_loginhistory_table_col3'), dataIndex: 'loginLocal', key: 'loginLocal', width: 175},
                    {title: this.$t('MyMessage.myprofile_loginhistory_table_col4'), dataIndex: 'loginIp', key: 'loginIp', width: 150},
                    {title: this.$t('MyMessage.myprofile_loginhistory_table_col5'), dataIndex: 'loginStatus', key: 'loginStatus'}
                ]
            },
            /**
             * 用户基本信息
             */
            userInfo () {
                let data = {traceId: tool.UUID()}
                axios.post('/user/info/query', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.nikeName = res.data.data.userCode
                            this.mobile = res.data.data.mobile
                            this.email = res.data.data.email
                            if (this.email) {
                                this.headimg = this.email.substring(0, 2)
                            } else {
                                this.headimg = this.mobile.substring(res.data.data.mobile.length - 2)
                            }
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 获取kyc认证信息
             */
            getkycinfo () {
                let data = {traceId: tool.UUID()}
                axios.post('/dc/user/kyc/query/user', data)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            if (res.data.data) {
                                this.auditState = res.data.data.auditState
                            } else {
                                // 0认证中 1未通过 2已通过 3未认证
                                this.auditState = 3
                            }
                        } else {
                            this.auditState = 3
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             * 用户登录历史
             */
            loginHistory () {
                let pageData = {traceId: tool.UUID(), data: {pageNum: this.current, pageSize: this.pageSize}}
                axios.post('/user/login/histroy/query', pageData)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.data = []
                            this.pagination.total = res.data.data.total
                            for (let item of res.data.data.list) {
                                this.data.push({
                                    key: item['id'],
                                    loginTime: item['loginTime'],
                                    loginType: item['loginType'] === '0' ? 'Web' : 'Moblie',
                                    loginLocal: item['loginLocal'],
                                    loginIp: item['loginIp'],
                                    loginStatus: item['loginStatus'] === '0' ? this.$t('MyMessage.myprofile_loginhistory_table_status_1') : this.$t('MyMessage.myprofile_loginhistory_table_status_2')
                                })
                            }
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
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
            },
            /**
             * 点击跳转某个页面
             */
            goCorrespondingPage (name) {
                this.$router.push({name: name})
            },
            /**
             * 点击跳转密码修改页面
             */
            goModification () {
                this.$router.push({
                    name: 'mobile-user-UserCenter-MyMessage-PasswordModification',
                    query: {
                        account: this.mobile
                    }
                })
            },
            /**
             * 点击前往kyc页面
             */
            tokyc () {
                this.$router.push({path: '/mobile/user/UserCenter/AuthenticationKYC'})
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        components: {
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
    @background: #ffffff;

    .content {
        padding-top: 0.65rem;
        min-height: calc(100vh - 1.26rem);
    }

    .flex-column {
        display: flex;
        flex-direction: column;

        > div {
            background: @background;
        }

        .message-info-item {
            margin-bottom: 0.12rem;
        }

        .item-basic {
            height: 1.37rem;

            .item-body {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }

            .head-img-info {
                display: inline-block;
                width: 0.48rem;
                height: 0.48rem;
                font-size: 16px;
                color: #fff;
                background: #2EA9DF;
                border-radius: 50%;
                text-align: center;
                line-height: 3;
            }

            .user-name {
                margin: 0 0.08rem;
                font-size: 14px;
                font-family: PingFangSC-Medium;
                color: rgba(0, 0, 0, 0.85);
                line-height: 0.22rem;
            }

            .user-status {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.65);
            }
        }

        .item-bind {
            height: 1.66rem;
        }

        .change-mobile {
            color: #2EA9DF;
            font-size: 14px;
            text-align: right;
        }

        .item-password {
            height: 1.11rem;
        }

        .item-login {
            min-height: 4rem;

            .item-body {
                padding-top: 0;
            }
        }

        .item-title {
            padding: 0.12rem 0.16rem;
            font-size: 16px;
            font-family: PingFangSC-Medium;
            color: rgba(0, 0, 0, 0.85);
            border-bottom: 1px solid rgba(0, 0, 0, 0.09);
            margin-bottom: 0;
        }

        .divider {
            margin: 0.16rem 0;
        }

        .item-body {
            padding: 0.12rem 0.16rem;

            .body-key {
                color: rgba(0, 0, 0, 0.85);
                font-size: 14px;
            }

            .body-value {
                color: rgba(0, 0, 0, 0.65);
                font-size: 14px;
            }

            /deep/ .ant-tabs-nav-container {
                font-size: 14px;
            }
        }
    }
</style>

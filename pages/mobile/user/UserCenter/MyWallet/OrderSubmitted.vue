<template>
    <a-layout id="components-layout-mobile-top"
              class="layout"
              :class="drawer">
        <fs-head
                :SelectedKey="key"
                :SelectedType="type"
                :centerKey="centerKey"
                @openDrawer="openDrawer"
                @closeDrawer="closeDrawer"/>
        <section id="mobile-order-submitted">
            <a-layout-content>
                <!-- 顶部标题 -->
                <div class="mobile-order-submitted-title">
                    <h2> {{$t('orderSubmitted.withdraw_apply_title_headline')}} </h2>
                </div>
                <!-- 步骤条 -->
                <div class="submitted-steps-wrap">
                    <div class="mobile-order-submitted-steps">
                        <div class="order-submitted-steps-submited">
                        <span>
                            <a-icon
                                    style="color: #2EA9DF"
                                    type="check"/>
                        </span>
                            <span> {{$t('orderSubmitted.withdraw_apply_process_1')}} </span>
                            <span>
                            <i></i>
                        </span>
                        </div>
                        <div class="order-submitted-steps-submited">
                        <span style="background-color: #2EA9DF;color: #FFFFFF;display: flex;align-items: center;justify-content: center">
                            <span>2</span>
                        </span>
                            <span style="font-weight:500;"> {{$t('orderSubmitted.withdraw_apply_process_2')}} </span>
                            <span>
                            <i></i>
                        </span>
                        </div>
                        <div class="order-submitted-steps-submited">
                        <span style="border-color:#B1B1B1">
                             <span style="color: #B1B1B1 "> 3 </span>
                        </span>
                            <span style="color: #B1B1B1"> {{$t('orderSubmitted.withdraw_apply_process_3')}} </span>
                        </div>
                    </div>
                </div>
                <!-- 表格 -->
                <div class="submitted-steps-table">
                    <table>
                        <tr style="border-bottom: 1px solid #E8E8E8;">
                            <td style="width: 30%"> {{$t('orderSubmitted.withdraw_apply_title_currency')}}</td>
                            <td> {{ placeOrder.currency }}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #E8E8E8;">
                            <td> {{$t('orderSubmitted.withdraw_apply_title_address')}}</td>
                            <td style=" width: 70%; word-wrap: break-word;word-break: break-all;overflow: hidden;"> {{
                                placeOrder.cashAddress }}
                            </td>
                        </tr>
                        <tr style="border-bottom: 1px solid #E8E8E8;">
                            <td> {{$t('orderSubmitted.withdraw_apply_title_receiveamount')}}</td>
                            <td> {{ placeOrder.magnitude }}
                                <span style="font-size:16px;color:rgba(46,169,223,1);margin-left: 0.16rem "
                                      @click="revoke"> {{placeOrder.revokeWord}} </span>
                            </td>
                        </tr>
                        <tr style="border-bottom: 1px solid #E8E8E8;">
                            <td> {{$t('orderSubmitted.withdraw_apply_title_fee')}}</td>
                            <td> {{ placeOrder.serviceCharge }} &nbsp; {{placeOrder.feeCurCode}}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #E8E8E8;">
                            <td> {{$t('orderSubmitted.withdraw_apply_title_withdrawtime')}}</td>
                            <td> {{ placeOrder.cashTime | parseTime}}</td>
                        </tr>
                    </table>
                </div>
                <!-- 查看交易记录 -->
                <div class="submitted-steps-record">
                    <span @click="viewTransactionRecords">
                        {{$t('orderSubmitted.withdraw_apply_btn_view')}}
                    </span>
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
    import axios from '~/plugins/axios'

    export default {
        data () {
            return {
                // 首页高亮下标
                key: '0',
                // 表单布局模式
                formLayout: 'vertical',
                // 登录、注册导航下标
                type: 0,
                // 用户中心导航下标
                centerKey: 2,
                // 提交订单
                placeOrder: {
                    // 币种
                    currency: this.$route.params.currency,
                    // 提现地址
                    cashAddress: this.$route.params.cashAddress,
                    // 手续费币种
                    feeCurCode: this.$route.params.feeCurCode,
                    // 到账数量
                    magnitude: this.$route.params.magnitude,
                    // 手续费
                    serviceCharge: this.$route.params.serviceCharge,
                    // 支付 ID
                    applyId: this.$route.params.applyId,
                    // 提现时间
                    cashTime: this.$route.params.cashTime,
                    // 撤销提现
                    revokeWord: '',
                    // 是否已经点击撤销
                    isRevoke: false
                },
                // 抽屉动画
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 默认选中的key
                initCheckPan: '2'
            }
        },
        created () {
            this.isRefresh()
        },
        mounted () {
            this.placeOrder.revokeWord = this.$t('orderSubmitted.withdraw_apply_btn_undo')
        },
        methods: {
            /**
             * 撤销事件
             */
            revoke () {
                if (!this.isRevoke) {
                    let data = {applyId: this.placeOrder.applyId}
                    // 发送请求
                    axios.post('/cms/wallet/withdraw/rollback', {traceId: tool.UUID(), data})
                        .then(res => {
                            if (res.data.code.toString() === '0') {
                                this.placeOrder.revokeWord = this.$t('orderSubmitted.withdraw_apply_btn_rescinded')
                                this.isRevoke = true
                            } else {
                                this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                            }
                        })
                }
            },
            /**
             * 查看交易记录
             */
            viewTransactionRecords () {
                this.$router.push({
                    name: 'mobile-user-UserCenter-TransactionRecord',
                    params: {initCheckPan: this.initCheckPan}
                })
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
            /**
             * 判断用的刷新动作
             */
            isRefresh () {
                if (this.placeOrder.currency === undefined) {
                    this.viewTransactionRecords()
                }
            }
        },
        filters: {
            parseTime
        },
        components: {
            FsHead,
            fonter
        }
    }
</script>

<style lang="less" scoped>

    #mobile-order-submitted {
        background-color: #FFFFFF;
        padding: 0 0.16rem;
        min-height: calc(100vh - 1.26rem);

        .mobile-order-submitted-title {
            display: flex;
            justify-content: center;

            > h2 {
                padding: 0.28rem 0;
                font-size: 16px;
                margin-bottom: 0;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.85);
                line-height: 24px;
            }
        }

        .submitted-steps-wrap {
            margin-bottom: 0.12rem;
            display: flex;
            align-items: center;
            justify-content: center;

            .mobile-order-submitted-steps {
                display: flex;

                .order-submitted-steps-submited {
                    display: flex;
                    align-items: center;

                    > span {
                        &:nth-child(1) {
                            margin-right: 0.08rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 50%;
                            width: 24px;
                            height: 24px;
                            border: 1px solid rgba(46, 169, 223, 1);
                        }

                        &:nth-child(2) {
                            font-size: 14px;
                            font-family: PingFangSC-Regular;
                            font-weight: 400;
                            color: rgba(0, 0, 0, 0.65);
                            line-height: 22px;
                        }

                        &:nth-child(3) {
                            margin: 0 0.08rem;
                            width: 0.32rem;
                            height: 0.01rem;
                            background-color: #2EA9DF;
                        }
                    }
                }
            }
        }

        .submitted-steps-table {
            margin-bottom: 0.2rem;

            > table {
                width: 100%;

                > tr {

                    > td {
                        padding: 0.13rem 0;

                        &:nth-child(1) {
                            color: rgba(51, 51, 51, 0.65);
                        }

                        &:nth-child(2) {
                            color: rgba(51, 51, 51, 0.85);
                        }
                    }
                }
            }
        }

        .submitted-steps-record {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 400;
            color: rgba(46, 169, 223, 1);
            line-height: 24px;

            &:hover {
                cursor: auto;
            }
        }

    }

</style>

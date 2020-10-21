<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key"/>
        <section class="content">
            <a-layout-content>
                <div class=" content-oder-submitted">
                    <!-- 头部 -->
                    <div class="content-oder-submitted-head">
                        <span> {{$t('orderSubmitted.withdraw_apply_title_headline')}} </span>
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
                             <span style="color: #B1B1B1    "> 3 </span>
                        </span>
                                <span style="color: #B1B1B1"> {{$t('orderSubmitted.withdraw_apply_process_3')}} </span>
                            </div>
                        </div>
                    </div>
                    <!--表单-->
                    <div class="content-oder-submitted-table">
                        <table style="width: 706px;">
                            <tbody>
                            <tr>
                                <td> {{$t('orderSubmitted.withdraw_apply_title_currency')}}</td>
                                <td> {{ placeOrder.currency }}</td>
                            </tr>
                            <tr>
                                <td style="width: 25%"> {{$t('orderSubmitted.withdraw_apply_title_address')}}</td>
                                <td style="width: 75%"> {{ placeOrder.cashAddress }}</td>
                            </tr>
                            <tr>
                                <td> {{$t('orderSubmitted.withdraw_apply_title_receiveamount')}}</td>
                                <td> {{ placeOrder.magnitude }} <span @click="revoke"> {{placeOrder.revokeWord}} </span>
                                </td>
                            </tr>
                            <tr>
                                <td> {{$t('orderSubmitted.withdraw_apply_title_fee')}}</td>
                                <td> {{ placeOrder.serviceCharge }} {{placeOrder.feeCurCode}}</td>
                            </tr>
                            <tr>
                                <td> {{$t('orderSubmitted.withdraw_apply_title_withdrawtime')}}</td>
                                <td> {{ placeOrder.cashTime | parseTime}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- 查看 -->
                    <div class="content-oder-submitted-check">
                        <span @click="viewTransactionRecords">
                            {{$t('orderSubmitted.withdraw_apply_btn_view')}}
                        </span>
                    </div>
                </div>
            </a-layout-content>
        </section>
        <fonter/>
    </a-layout>
</template>
<script>
    import FsHead from '~/components/computer/FangseaHeader'
    import fonter from '~/components/computer/Footer'
    import {parseTime} from '~/assets/utils/index'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'

    export default {
        data () {
            return {
                // 首页高亮
                key: '',
                // 提交订单
                placeOrder: {
                    // 币种
                    currency: this.$route.params.currency,
                    // 手续费币种
                    feeCurCode: this.$route.params.feeCurCode,
                    // 提现地址
                    cashAddress: this.$route.params.cashAddress,
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
                }
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
                this.$router.push({path: '/computer/user/UserCenter', query: {getKey: '4', initCheckPan: '2'}})
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


    #components-layout-computer-top .content {
        background: #F0F2F5;
        padding: 0;
        min-height: calc(100vh - 179px);
    }

    .content-oder-submitted {
        margin: 0 auto 26px auto;
        width: 1128px;
        height: 745px;
        background: #FFFFFF;
        border-radius: 2px;
    }

    .content-oder-submitted-head {
        padding: 32px 0;
        display: flex;
        justify-content: center;

        > span {
            font-size: 24px;
            font-weight: 500;
            line-height: 32px;

        }
    }

    .content-oder-submitted-table {
        font-size: 14px;
        margin-top: 24px;
        display: flex;
        justify-content: center;

        tbody {

            > tr {
                border-bottom: 1px solid #E8E8E8;

                > td {
                    padding: 16px 0;

                    > span {
                        margin-left: 24px;
                        color: #2EA9DF;

                        &:hover {
                            cursor: pointer;
                        }
                    }
                }
            }

        }
    }

    .content-oder-submitted-check {
        padding: 24px 211px;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        > span {
            font-size: 16px;
            color: rgba(46, 169, 223, 1);
            line-height: 24px;

            &:hover {
                cursor: pointer;
            }
        }
    }

    .submitted-steps-wrap {
        margin-bottom: 12px;
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
                        margin-right: 8px;
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
                        margin: 0 0.8px;
                        width: 145px;
                        height: 1px;
                        background-color: #2EA9DF;
                    }
                }
            }
        }
    }

</style>
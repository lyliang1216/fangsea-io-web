<template>
    <section class="container">
        <a-layout-content>
            <div class="kycing">
                <a-icon class="check-circle" theme="filled" type="check-circle"/>
                <h3>{{$t('InAuthentication.kyc_result_title_headline')}}</h3>
                <p>{{$t('InAuthentication.kyc_result_content_waiting')}}</p>
                <div>
                    <!--首页-->
                    <button class="toindex" @click="toindex">{{$t('InAuthentication.kyc_result_btn_home')}}</button>
                    <!--继续修改-->
                    <button class="toedit" @click="toedit">{{$t('InAuthentication.kyc_result_btn_modify')}}</button>
                </div>
            </div>
        </a-layout-content>
    </section>
</template>

<script>
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'

    export default {
        name: 'InAuthentication',
        methods: {
            /**
             *  点击继续修改
             */
            toedit () {
                let params = {
                    traceId: tool.UUID()
                }
                // 查询用户kyc，判断状态后跳转页面
                axios.post('/dc/user/kyc/query/user', params)
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            if (res.data.data) {
                                this.$emit('getInfo', res.data.data)
                                if (res.data.data.auditState === 2) {
                                    this.$emit('toedit', 2)
                                } else {
                                    this.$emit('toedit', 1)
                                }
                            }
                        } else {
                            this.$emit('toedit', 1)
                        }
                    }).catch(() => {
                        this.$emit('toedit', 1)
                    })
            },
            /**
             *  点击首页
             */
            toindex () {
                this.$router.push({path: '/computer'})
            }
        }
    }
</script>

<style lang="less" scoped>
    .container {
        background: #fff;
        height: 785px;
    }

    .kycing {
        padding-top: 32px;
        .check-circle {
            color: #27e774;
            font-size: 48px;
            display: block;
            margin: 0 auto 24px;
        }
        h3 {
            font-size: 24px;
            color: rgba(0, 0, 0, 0.85);
            text-align: center;
            margin-bottom: 16px;
        }
        p {
            color: rgba(0, 0, 0, 0.45);
            color: #9c9c9c;
            text-align: center;
            margin-bottom: 24px;
        }
        div {
            display: flex;
            justify-content: center;
            align-items: center;
            button {
                border: 1px solid #d9d9d9;
                background: #ffffff;
                line-height: 30px;
                color: rgba(0, 0, 0, 0.65);
                margin: 0 16px 0 0;
                padding: 0 16px;
                font-size: 14px;
                cursor: pointer;
                border-radius: 3px;
            }
            .toedit {
                border: 1px solid #2ea9df;
                background: #2EA9DF;
                color: #fff;
                margin: 0;
            }
        }
    }
</style>
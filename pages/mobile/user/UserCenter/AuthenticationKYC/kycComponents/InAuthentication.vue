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
                this.$router.push({path: '/mobile'})
            }
        }
    }
</script>

<style lang="less" scoped>
    .kycing {
        background: #fff;
        padding-top: 30/375*100%;
        .check-circle {
            color: #27e774;
            font-size: 48px;
            display: block;
            margin: 0 auto 0.24rem;
        }
        h3 {
            font-size: 16px;
            color: #262626;
            text-align: center;
            margin-bottom: 0.08rem;
            font-weight: 500;
        }
        p {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.45);
            text-align: center;
            margin-bottom: 0.2rem;
        }
        div {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-bottom: 0.24rem;
            button {
                border: 1px solid #d9d9d9;
                background: #ffffff;
                line-height: 2.3;
                color: #5f5f5f;
                margin: 0 16px 0 0;
                padding: 0 0.16rem;
                font-size: 14px;
                cursor: pointer;
                border-radius: 4px;
            }
            .toedit {
                border: 1px solid #2ea9df;
                background: #2ea9df;
                color: #fff;
                margin: 0;
            }
        }
    }
</style>

<template>
    <section class="container">
        <a-layout-content>
            <div class="kyvinfo">
                <div class="infocard">
                    <img src="/kycinfo.jpg" alt="">
                </div>
                <h3>{{$t('KYCInfo.kyc_info_title_headline')}}</h3>
                <!--国籍-->
                <p>{{$t('KYCInfo.kyc_info_title_nationality')}}&emsp;{{nationalityNameEn}}({{nationalityName}})</p>
                <!--姓名-->
                <p>{{$t('KYCInfo.kyc_info_title_name')}}&emsp;{{name}}</p>
                <!--护照号-->
                <p>{{passportid}}</p>
            </div>
        </a-layout-content>
    </section>
</template>

<script>
    export default {
        name: 'InAuthentication',
        props: ['kycData', 'country'],
        data () {
            return {
                // 国籍
                nationalityName: '',
                // 国籍国际化
                nationalityNameEn: '',
                // 姓名
                name: '',
                // 护照号
                passportid: '',
                // 姓在前名在后的区域
                enname: ['China', 'Hong Kong', 'Macau', 'Taiwan']
            }
        },
        watch: {
            country () {
                this.getuserinfo()
            }
        },
        created () {
            if (process.client) {
                this.getuserinfo()
            }
        },
        methods: {
            /**
             *  查询用户kyc
             */
            getuserinfo () {
                if (JSON.stringify(this.kycData) !== '{}') {
                    let data = this.kycData
                    for (let i in this.country) {
                        if (this.country[i].regionId === data.nationality.toString()) {
                            this.nationalityName = this.country[i].localName
                            break
                        }
                    }
                    this.nationalityNameEn = data.nationalityNameEn
                    this.passportid = data.passportNo
                    if (this.enname.indexOf(data.nationalityNameEn) !== -1) {
                        this.name = data.familyName + '' + data.selfName
                    } else {
                        this.name = data.selfName + ' ' + data.familyName
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .container {
        background: #fff;
    }

    .kyvinfo {
        width: 100%;
        padding-top: 32/375*100%;
        background: #fff;
        .infocard {
            width: 200/375*100%;
            margin: 0 auto 0.2rem;
            img {
                display: block;
                width: 100%;
            }
        }
        h3 {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
            text-align: center;
            margin-bottom: 0.16rem;
        }
        p {
            margin-bottom: 0.08rem;
            font-size: 14px;
            text-align: center;
            color: rgba(0, 0, 0, 0.65);
        }
    }
</style>

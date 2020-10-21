<template>
    <a-layout id="components-layout-mobile-top" class="layout">
        <fs-head :SelectedKey="key" :SelectedType="type" :centerKey="centerKey" @openDrawer="openDrawer" @closeDrawer="closeDrawer" style="margin-bottom: 0;"/>
        <section class="container">
            <img src="/content/error_img_m.jpg" alt="">
            <div class="error-word">
                <h2><span style="font-weight: 600">{{error.statusCode}}</span>{{$t('errorpage.error_statuscode_tip')}}</h2>
                <p>{{returntime}}</p>
                <button @click="back">{{$t('errorpage.error_return_btn')}}</button>
            </div>
        </section>
        <fonter/>
    </a-layout>
</template>
<script>
    import FsHead from '~/components/mobile/FangseaHeader'
    import fonter from '~/components/mobile/Footer'
    import tool from '~/assets/utils/tool'

    export default {
        props: ['error'],
        data () {
            return {
                key: '1',
                type: 0,
                centerKey: 0,
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                time: 5,
                setIntervalCD: null,
                returntime: ''
            }
        },
        mounted () {
            let _this = this
            this.setIntervalCD = setInterval(function () {
                if (_this.time !== 0) {
                    _this.time--
                    _this.returntime = tool.intervariable(_this.$t('errorpage.error_prompt_return'), [_this.time])
                } else {
                    window.clearInterval(_this.setIntervalCD)
                    _this.setIntervalCD = null
                    _this.$router.go(-1)
                }
            }, 1000)
        },
        methods: {
            back () {
                this.$router.go(-1)
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
        beforeDestroy () {
            window.clearInterval(this.setIntervalCD)
            this.setIntervalCD = null
        },
        components: {
            FsHead,
            fonter
        }
    }
</script>

<style scoped lang="less">
    .container {
        width: 100%;
        position: relative;
        img {
            display: block;
            width: 100%;
        }
        .error-word {
            width: 100%;
            position: absolute;
            left: 0;
            top: 57.78%;
            h2 {
                font-size: 0.2rem;
                color: #fff;
                margin: 0;
                text-align: center;
                font-weight: normal;
            }
            p{
                font-size: 0.12rem;
                color: #fff;
                margin-bottom: 0.25rem;
                text-align: center;
            }
            button {
                display: block;
                width: 53.33%;
                height: 0.38rem;
                color: #fff;
                font-size: 0.15rem;
                background: #2EA9DF;
                border-radius: 0.19rem;
                padding: 0;
                border: 0;
                outline: none;
                cursor: pointer;
                text-align: center;
                margin: 0 auto;
            }
        }
    }
</style>

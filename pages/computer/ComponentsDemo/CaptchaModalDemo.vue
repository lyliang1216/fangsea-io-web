<template>
    <a-layout id="components-layout-computer-top" class="layout">
        <fs-head :SelectedKey="key" :SelectedType="type"/>
        <section class="container">
            <a-button @click="showCaptchaModal">显示验证码窗口</a-button>
            <a-button @click="showPasswordInput">切换密码输入框</a-button>

            <!--验证码窗口组件-->
            <captcha-modal :visible="visible"
                           :showPassword="showPassword"
                           :captchaTitle="captchaTitle"
                            @changeVisible="changeVisible"/>

        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import CaptchaModal from '~/components/computer/CaptchaModal'
    import FsHead from '~/components/computer/FangseaHeader'
    import fonter from '~/components/computer/Footer'

    export default {
        name: 'CaptchaModalDemo',
        data () {
            /**
             * @param visible 显示窗口
             * @param showPassword 显示密码输入框
             * @param captchaTitle 窗口标题
             */
            return {
                key: '1',
                type: 0,
                visible: false,
                showPassword: false,
                captchaTitle: '这是窗口标题'
            }
        },
        methods: {
            // 显示窗口
            showCaptchaModal () {
                this.visible = true
            },
            // 关闭窗口
            changeVisible () {
                this.visible = false
            },
            // 切换密码输入框显示
            showPasswordInput () {
                this.showPassword = !this.showPassword
            }
        },
        components: {
            CaptchaModal,
            FsHead,
            fonter
        }
    }
</script>

<style scoped lang="less">
    .container {
        text-align: center;
        padding-top: 65px !important;
        min-height: calc(100vh - 307px) !important;
    }
</style>
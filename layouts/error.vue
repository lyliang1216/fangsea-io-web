<template>
    <div>
        <error-pc v-if="!isMobile&&isshow" :error="error"></error-pc>
        <error-mob v-if="isMobile&&isshow" :error="error"></error-mob>
    </div>
</template>
<script>
    import ErrorPc from '~/components/computer/error'
    import ErrorMob from '~/components/mobile/error'

    export default {
        props: ['error'],
        data () {
            return {
                isMobile: '',
                isshow: false
            }
        },
        beforeCreate () {
            if (process.client) {
                // 判断是否是移动端
                let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
                this.$nextTick(() => {
                    flag ? this.isMobile = true : this.isMobile = false
                    this.isshow = true
                })
            }
        },
        components: {
            ErrorPc,
            ErrorMob
        }
    }
</script>

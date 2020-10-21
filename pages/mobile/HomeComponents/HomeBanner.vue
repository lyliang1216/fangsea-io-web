<template>
    <div style="background-color: #232933;height: 140px;">
        <a-carousel v-if="showBanner" style="height: 140px" autoplay>
            <section v-for="item in bannerUrls">
                <div class="bannerBox" @click="jump(item.jumpUrl)" :style="{backgroundImage: 'url(/' + item.imgUrl + ')'}"></div>
            </section>
        </a-carousel>
    </div>
</template>

<script>
    export default {
        props: ['bannerUrls', 'showBanner'],
        methods: {
            jump (url) {
                if (url !== '') {
                    window.open(url)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .bannerBox{
        width: 100%;
        height: 140px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
    }
    /deep/.slick-dots{
        li{
            button{
                &:focus{
                    opacity: 0.3;
                }
            }
        }
    }
</style>

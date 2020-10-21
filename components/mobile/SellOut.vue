<template>
    <div>
        <img src="~/assets/image/230_zh.png" v-if="isZh" width="140" height="110"/>
        <img src="~/assets/image/230_en.png" v-else width="140" height="110"/>
    </div>
</template>

<script>
    export default {
        name: 'SellOut',
        props: ['isZh']
    }
</script>

<style scoped>


</style>
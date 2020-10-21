<template>
    <div>
        <imgUpload
                :txt="txt"
                :action="action"
                :num="1"
                :maxsize="2"
                @changepic="handleChange"
                :ispic="true"
                style="margin-right: 24px;"></imgUpload>
    </div>
</template>
<script>
    import ImgUpload from '~/components/computer/ImgUpload'
    export default {
        name: 'imgUploadDemo',
        data () {
            return {
                action: '',
                txt: '上传图片'
            }
        },
        methods: {
            handleChange (url) {
                console.log(url)
            }
        },
        components: {
            ImgUpload
        }
    }
</script>
<style lang="less" scoped>
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>

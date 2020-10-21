<template>
    <div class="clearfix">
        <a-upload
                class="uploadbox"
                :action="action"
                listType="picture-card"
                :fileList="fileList"
                @preview="handlePreview"
                @change="handleChange"
                :beforeUpload="beforeUpload"
                :data="mydata"
                name="file"
        >
            <div v-if="fileList.length < num">
                <a-icon type="plus" />
                <div class="ant-upload-text">{{txt}}</div>
            </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>
<script>
    export default {
        name: 'imgUpload',
        props: {
            //  数量限制
            num: {
                type: Number
            },
            //  上传提示文字
            txt: {
                type: String
            },
            //  上传地址
            action: {
                type: String
            },
            //  图片大小限制，单位MB
            maxsize: {
                type: Number
            },
            //  是否为图片
            ispic: {
                type: Boolean,
                default: false
            },
            imageType: {
                type: Number
            },
            defaultfilelist: {
                type: Array
            }
        },
        data () {
            return {
                //  是否预览
                previewVisible: false,
                //  预览图片路径
                previewImage: '',
                //  上传文件列表
                fileList: [],
                //  上传添加内容
                mydata: {
                    imageType: 0
                }
            }
        },
        watch: {
            defaultfilelist: function (val) {
                this.fileList = this.defaultfilelist
            }
        },
        mounted () {
            this.mydata.imageType = this.imageType
            this.fileList = this.defaultfilelist
        },
        methods: {
            /**
             *  关闭预览
             */
            handleCancel () {
                this.previewVisible = false
            },
            /**
             *  预览
             *  @param file 预览的文件
             */
            handlePreview (file) {
                this.previewImage = file.url || file.thumbUrl
                this.previewVisible = true
            },
            /**
             *  上传文件改变时的状态
             *  @param file 上传文件
             *  @param fileList 上传所有文件列表
             *  @param $event 上传中，完成，失败
             */
            handleChange ({ file, fileList, $event }) {
                this.fileList = fileList
                //  执行上传得到服务器路径
                if (file.status === 'done') {
                    if (file.response.code.toString() === '0') {
                        this.$message.success(this.$t('imgupload.upload_success'))
                        //  传给父组件值触发changepic
                        this.$emit('changepic', file.response.data)
                    } else {
                        this.fileList = []
                        this.$message.error(this.$t('imgupload.upload_fail'))
                    }
                } else if (file.status === 'removed') {
                    this.$emit('removepic')
                } else if (file.status === 'error') {
                    this.fileList = []
                    this.$message.error(this.$t('imgupload.upload_fail'))
                }
            },
            /**
             *  上传前执行
             *  @param file 要上传文件
             */
            beforeUpload (file) {
                if (this.num === 1) {
                    this.fileList = []
                }
                return new Promise((resolve, reject) => {
                    const maxsize = this.maxsize
                    if (this.ispic) {
                        const isJPEG = file.type === 'image/jpeg'
                        const isPNG = file.type === 'image/png'
                        if (!isJPEG && !isPNG) {
                            this.$message.error(this.$t('imgupload.upload_format'))
                        }
                        const isLt2M = file.size / 1024 / 1024 < maxsize
                        if (!isLt2M) {
                            this.$message.error(this.$t('imgupload.upload_size'))
                        }
                        if ((isJPEG || isPNG) && isLt2M) {
                            return resolve(Blob)
                        }
                        return reject(new Error())
                    } else {
                        const isLt2M = file.size / 1024 / 1024 < maxsize
                        if (!isLt2M) {
                            this.$message.error(this.$t('imgupload.upload_size'))
                            return reject(new Error())
                        } else {
                            return resolve(Blob)
                        }
                    }
                })
            }
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
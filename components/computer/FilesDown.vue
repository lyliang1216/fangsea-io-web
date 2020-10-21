<template>
    <div class="files-content">
        <!--    单个文件没有点击效果    -->
        <div class="mg-bm-20 file-item" v-show="single && !singleDowned">
            <span class="file-name">{{$t(name)}}</span>
            <a href="javascript:;" @click="downFile(files[0].fileUrl, files[0].name)" class="download-file">
                <img src="/content/certificatePurchase/icon_download_normal.png"/>
            </a>
        </div>
        <!--    单个文件点击后效果    -->
        <div class="mg-bm-20 file-item-click" v-show="singleDowned">
            <span class="file-name-click">{{$t(name)}}</span>
            <a href="javascript:;" @click="downFile(files[0].fileUrl, files[0].name)"
               class="download-file">
                <div class="down-icon" />
            </a>
        </div>
        <!--    多个文件正常    -->
        <div class="mg-bm-20 file-item file-item-many" v-show="!single" @mouseenter="mouseover">
            <span class="file-name">{{$t(name)}}</span>
            <a href="javascript:;" class="download-file">
                <img src="/content/certificatePurchase/icon_down.png"/>
            </a>
        </div>
        <!--    多个文件展开    -->
        <div class="mg-bm-20 file-info" v-show="!single && many" @mouseleave="mouseout" >
            <div class="file-info-title">
                <span class="file-name">{{$t(name)}}</span>
                <a href="javascript:;" class="download-file file-info-title-a">
                    <img src="/content/certificatePurchase/icon_up.png"/>
                </a>
            </div>
            <div class="file-info-body">
                <template v-for="item, index in files">
                    <!--    单个文件没有点击效果    -->
                    <div class="mg-bm-20 many-file-item" v-show="!manyStatus[index]" :key="item.fileUrl">
                        <div class="many-file-item-left">
                            <div class="file-index"></div>
                            <span class="file-name">Document {{index + 1 | formatNumber}}</span>
                        </div>
                        <a href="javascript:;" @click="manyDownFile(item.fileUrl, item.name, index + 1)" class="download-file">
                            <img src="/content/certificatePurchase/icon_download_normal.png"/>
                        </a>
                    </div>
                    <!--    单个文件点击后效果    -->
                    <div class="mg-bm-20 many-file-item many-file-item-click" v-show="manyStatus[index]" :key="item.fileUrl + index">
                        <div class="many-file-item-left">
                            <div class="file-index"></div>
                            <span class="file-name file-name-click">Document {{index + 1 | formatNumber}}</span>
                        </div>
                        <a href="javascript:;" @click="manyDownFile(item.fileUrl, item.name, index + 1)" class="download-file">
                            <div class="down-icon" />
                        </a>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import download from 'ly-downloader'

    export default {
        name: 'FilesDown',
        props: ['files', 'name'],
        data () {
            return {
                // 是否单个文件
                single: true,
                // 单个文件是否已下载
                singleDowned: false,
                // 多个文件展示详情
                many: false,
                // 多个文件下载状态
                manyStatus: {}
            }
        },
        created () {
            if (this.files.length > 1) {
                this.single = false
                this.files.forEach((item, index) => {
                    this.$set(this.manyStatus, index, false)
                })
            } else {
                this.single = true
            }
        },
        methods: {
            /**
             * 单文件组件下载项目文件
             * @param src 文件地址
             * @param name 文件名
             */
            downFile (src, name) {
                let _src = '/' + src
                download(1, _src, this.$t(this.name) + '_' + name)
                this.singleDowned = true
            },
            /**
             * 多文件组件下载项目文件
             * @param src 文件地址
             * @param name 文件名
             * @param bool 显示下载后的状态
             */
            manyDownFile (src, name, index) {
                let _src = '/' + src
                download(1, _src, this.$t(this.name) + '_' + name)
                index = index - 1
                this.$set(this.manyStatus, index, true)
            },
            // 展示多个文件详情
            mouseover () {
                this.many = true
            },
            // 隐藏多个文件详情
            mouseout () {
                this.many = false
            },
            // 十位自动补0
            formatNumber (val) {
                if (parseInt(val) < 10) {
                    return '0' + val
                } else {
                    return val
                }
            }
        },
        filters: {
            // 十位自动补0
            formatNumber (val) {
                if (parseInt(val) < 10) {
                    return '0' + val
                } else {
                    return val
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .files-content {
        margin-bottom: 20px;
        min-height: 48px;
        position: relative;

        .download-file {

        }

        .file-info {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 100;
            width:380px;
            height: 283px;
            box-shadow:0px 0px 10px 5px rgba(0,0,0,0.05);
            border-radius:24px;

            .file-info-title {
                height: 48px;
                background: #0ba4e8;
                border-radius: 24px 24px 0px 0px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px 0 16px;

                .file-info-title-a {
                    cursor: default;
                }

                .file-name {
                    font-size:14px;
                    font-weight: 500;
                    color:rgba(255,255,255,1);
                    line-height:14px;
                }
            }

            .file-info-body {
                height: 235px;
                overflow-y: auto;
                background: #ffffff;
                padding: 5px 0;
                border-radius: 0px 0px 24px 24px;

                .many-file-item {
                    height: 45px;
                    padding: 0 13px 0 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .many-file-item-left {
                        display: flex;
                        align-items: center;

                        .file-index {
                            width:5px;
                            height:5px;
                            margin-right: 16px;
                            border-radius: 50%;
                            background:rgba(46,169,223,1);
                        }

                        .file-name{
                            font-size:14px;
                            font-weight:400;
                            color:rgba(51,51,51,1);
                            line-height:14px;
                        }

                        .file-name-click {
                            color:rgba(11,164,232,1);
                        }
                    }
                }

                .many-file-item-click {
                    .down-icon {
                        width: 28px;
                        height: 28px;
                        background: url("/certificatePurchase/icon_download_accomplish.png");
                    }

                    &:hover {
                        .down-icon {
                            background: url("/certificatePurchase/icon_download_normal.png");
                        }

                        .file-name-click {
                            color:rgba(51,51,51,1);
                        }
                    }
                }
            }
        }

        .file-item {
            width: 380px;
            height: 48px;
            border-radius:24px;
            border:1px solid rgba(235,235,235,1);
            padding: 0 12px 0 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .file-item-many {
            padding: 0 20px 0 16px;
        }

        .file-name {
            font-size:14px;
            color:rgba(51,51,51,1);
            line-height:14px;
        }

        .file-item-click {
            font-size:14px;
            width: 380px;
            height: 48px;
            border-radius:24px;
            border:none;
            padding: 0 12px 0 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background:rgba(249,249,249,1);
            color:rgba(11,164,232,1);

            .down-icon {
                width: 28px;
                height: 28px;
                background: url("/certificatePurchase/icon_download_accomplish.png");
            }

            &:hover {
                color:rgba(51,51,51,1);
                background: #ffffff;
                border:1px solid rgba(235,235,235,1);

                .down-icon {
                    background: url("/certificatePurchase/icon_download_normal.png");
                }
            }
        }
    }
</style>

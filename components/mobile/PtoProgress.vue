<template>
    <div class="info-progress" :class="progressBg(saleRatio, successRatio, sellOutRatio)">
        <div class="pto-progress">
            <!--      开始圆圈      -->
            <div class="start-circle" v-show="successRatio > 6.5"></div>
            <!--      当前圆圈      -->
            <div class="current-circle" :style="progressCurrentCircle(saleRatio)"></div>
            <!--      预售成功文字      -->
            <a-tooltip placement="bottomLeft"
                       overlayClassName="successTipsClass"
                       :arrowPointAtCenter="true"
                       v-model="showBottomLeft"
                       @visibleChange="visibleChange"
                       trigger="click"
                       :destroyTooltipOnHide="true">
                <template slot="title">
                    <span @click="showSaleableAmountTips">
                        {{$t('PtoProgress.ptoProgress_preSale_success')}}
                    </span>
                </template>
                <div class="success-circle-text" :style="successCircle(successRatio)"></div>
            </a-tooltip>
            <!--      预售成功Tips      -->
            <a-tooltip placement="top"
                       overlayClassName="tipsClass"
                       v-model="showSaleableAmount"
                       :destroyTooltipOnHide="true">
                <template slot="title">
                    <span>{{saleableAmountTips}}</span>
                </template>
                <svg class="success-circle" :style="progressSuccessCircle(successRatio)" width="8px" height="8px" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <title>形状结合</title>
                    <desc>Created with Sketch.</desc>
                    <g id="页面1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="进度条-详情页" transform="translate(-1138.000000, -533.000000)" fill="#FFFFFF" stroke="#FFFFFF">
                            <path d="M1142,540.5 C1143.933,540.5 1145.5,538.932997 1145.5,537 C1145.5,535.067003 1143.933,533.5 1142,533.5 C1140.067,533.5 1138.5,535.067003 1138.5,537 C1138.5,538.932997 1140.067,540.5 1142,540.5 Z M1141.66341,537.018566 L1143.40868,535.289585 C1143.80104,534.900897 1144.43419,534.903865 1144.82288,535.296217 C1145.21157,535.688568 1145.2086,536.321726 1144.81625,536.710415 L1142.39364,539.110415 C1142.01444,539.486069 1141.40706,539.497695 1141.01377,539.136826 L1139.70596,537.936826 C1139.29902,537.563437 1139.27182,536.930856 1139.64521,536.523918 C1140.0186,536.11698 1140.65118,536.089784 1141.05812,536.463174 L1141.66341,537.018566 Z" id="形状结合"></path>
                        </g>
                    </g>
                </svg>
            </a-tooltip>
            <!--      结束圆圈      -->
            <div class="end-circle"></div>
            <!--      进度条      -->
            <a-progress :percent="saleRatio" status="active" :strokeColor="progress(saleRatio, successRatio, sellOutRatio)"
                        :showInfo="false"
                        :strokeWidth="12" />
            <!--      当前百分比及即将售罄火图标      -->
            <div class="hot-circle" :style="progressHotCircle(saleRatio)">
                <span class="ant-progress-text" :style="progressText(saleRatio, successRatio, sellOutRatio)">{{saleRatio}}%</span>
                <img src="/content/certificatePurchase/hot.png" v-show="!isFail && sellOutRatio !== 0 && saleRatio >= sellOutRatio && saleRatio !== 100 && successRatio < sellOutRatio && (issueState === 2 || issueState === 3)">
            </div>
            <!--      即将售罄文字      -->
            <a-tooltip placement="bottomRight"
                       overlayClassName="outTipsClass"
                       :arrowPointAtCenter="true"
                       v-model="showBottomRight"
                       @visibleChange="visibleChangeRight"
                       trigger="click"
                       :destroyTooltipOnHide="true">
                <template slot="title">
                    <span>
                        {{$t('PtoProgress.ptoProgress_sold_out')}}
                    </span>
                </template>
                <div class="hot-sellOutRatio-text" :style="sellOutRatioText(sellOutRatio)"></div>
            </a-tooltip>
            <!--      即将售罄Tips      -->
            <div class="hot-sellOutRatio" :style="progressSellOutRatio(sellOutRatio)"
                 v-show="!isFail && sellOutRatio !== 0 && saleRatio >= sellOutRatio && saleRatio !== 100 && successRatio < sellOutRatio && (issueState === 2 || issueState === 3)">
            </div>
            <!--      售罄文字      -->
            <a-tooltip placement="bottomRight"
                       overlayClassName="allTipsClass"
                       :arrowPointAtCenter="true"
                       v-model="showAllRight"
                       @visibleChange="visibleAllChangeRight"
                       trigger="click"
                       :destroyTooltipOnHide="true">
                <template slot="title">
                    <span>
                        {{$t('PtoProgress.ptoProgress_sell_out')}}
                    </span>
                </template>
                <div class="all-text"></div>
            </a-tooltip>
        </div>
    </div>
</template>

<script>
    import tool from '~/assets/utils/tool'
    import {Bus} from '~/assets/utils/bus'

    export default {
        name: 'PtoProcess',
        props: ['saleRatio', 'successRatio', 'sellOutRatio', 'issueState', 'isFail', 'saleableAmount', 'hideTips'],
        data () {
            return {
                // 预售成功Tips内容
                saleableAmountTips: '',
                // 预售成功Tips
                showSaleableAmount: false,
                // 显示预售成功
                showBottomLeft: false,
                // 显示即将售罄
                showBottomRight: false,
                // 显示售罄
                showAllRight: false
            }
        },
        watch: {
            hideTips: 'allTipsHide'
        },
        mounted () {
            this.listenI18n()
            this.showAllRight = this.saleRatio === 100
            if (this.sellOutRatio === 0) {
                this.saleRatio >= this.successRatio && this.saleRatio < 100 && (this.issueState === 2 || this.issueState === 3) ? this.showBottomLeft = true : this.showBottomLeft = false
            } else {
                this.saleRatio >= this.successRatio && this.saleRatio < this.sellOutRatio && (this.issueState === 2 || this.issueState === 3) ? this.showBottomLeft = true : this.showBottomLeft = false
            }
            !this.isFail && this.sellOutRatio !== 0 && this.saleRatio >= this.sellOutRatio && this.saleRatio !== 100 && this.successRatio < this.sellOutRatio && (this.issueState === 2 || this.issueState === 3) ? this.showBottomRight = true : this.showBottomRight = false
            this.saleableAmountTips = tool.intervariable(this.$t('PtoProgress.ptoProgress_preSale_success_tips'), [this.saleableAmount, this.successRatio])
        },
        methods: {
            allTipsHide () {
                if (this.hideTips) {
                    this.showSaleableAmount = false
                    this.showBottomLeft = false
                    this.showBottomRight = false
                    this.showAllRight = false
                }
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.saleableAmountTips = tool.intervariable(this.$t('PtoProgress.ptoProgress_preSale_success_tips'), [this.saleableAmount, this.successRatio])
                })
            },
            // 显示预售成功
            visibleChange () {
                this.showBottomLeft = true
            },
            // 显示即将售罄
            visibleChangeRight () {
                this.showBottomRight = true
            },
            // 显示售罄
            visibleAllChangeRight () {
                this.showAllRight = true
            },
            // 预售成功点击显示Tips
            showSaleableAmountTips (e) {
                e.stopPropagation()
                this.showSaleableAmount = !this.showSaleableAmount
            },
            /**
             * 根据当前项目判断进度条颜色
             * @param current 当前进度
             * @param minPresell 最低预售
             * @param maxPresell 即将售罄
             */
            progress (current, minPresell, maxPresell) {
                if (this.isFail) {
                    return '#0BA4E8'
                } else {
                    current = parseFloat(current)
                    minPresell = parseFloat(minPresell)
                    maxPresell = parseFloat(maxPresell)
                    if (maxPresell !== 0) {
                        if (current < minPresell) {
                            return '#F5A623'
                        } else if (current >= minPresell && current < maxPresell) {
                            return '#05BA4B'
                        } else if (current >= maxPresell && current < 100) {
                            return maxPresell > minPresell ? '#FE542B' : '#05BA4B'
                        } else {
                            return '#0BA4E8'
                        }
                    } else {
                        if (current < minPresell) {
                            return '#F5A623'
                        } else if (current >= minPresell && current < 100) {
                            return '#05BA4B'
                        } else {
                            return '#0BA4E8'
                        }
                    }
                }
            },
            /**
             * 当前精度%位置
             * @param current 当前进度
             * @param minPresell 最低预售
             * @param maxPresell 即将售罄
             */
            progressText (current, minPresell, maxPresell) {
                let color = `color: ${this.progress(current, minPresell, maxPresell)}`
                return `${color}`
            },
            /**
             * 预售成功颜色和位置
             * @param current 当前进度
             * @param minPresell 最低预售
             * @param maxPresell 即将售罄
             */
            progressPresale (current, minPresell, maxPresell) {
                let color = `color: ${this.progress(current, minPresell, maxPresell)}`
                if (minPresell > 12) {
                    return `right: ${100 - minPresell}%;${color}`
                } else {
                    return `right: ${88}%;${color}`
                }
            },
            /**
             * 即将售罄颜色和位置
             * @param current 当前进度
             * @param minPresell 最低预售
             * @param maxPresell 即将售罄
             */
            progressSellout (current, minPresell, maxPresell) {
                let color = `color: ${this.progress(current, minPresell, maxPresell)}`
                if (maxPresell > 16) {
                    return `right: ${100 - maxPresell}%;${color}`
                } else {
                    return `right: ${84}%;${color}`
                }
            },
            /**
             * 当前实心圆位置
             * @param current 当前进度
             */
            progressCurrentCircle (current) {
                return `right: ${100 - current + 0.4}%;`
            },
            /**
             * 即将售罄圆位置
             * @param current 当前进度
             */
            progressSellOutRatio (current) {
                if (parseFloat(current) <= 97) {
                    return `right: ${100 - current + 0.2}%;`
                } else {
                    return `right: ${3}%;`
                }
            },
            /**
             * 即将售罄文字位置
             * @param current 当前进度
             */
            sellOutRatioText (current) {
                if (parseFloat(current) <= 97) {
                    return `right: calc(${100 - current + 0.2}% + 12px);`
                } else {
                    return `right: calc(3% + 12px);`
                }
            },
            /**
             * 预售成功图标、预售成功文字位置
             * @param current 当前进度
             */
            progressSuccessCircle (current) {
                if (parseFloat(current) > 4) {
                    return `right: ${100 - current}%;`
                } else {
                    return `right: 96%;`
                }
            },
            /**
             * 预售成功文字位置
             * @param current 当前进度
             */
            successCircle (current) {
                if (parseFloat(current) > 4) {
                    return `right: calc(${100 - current}% - 12px);`
                } else {
                    return `right: calc(96% - 12px);`
                }
            },
            /**
             * 即将售罄火图位置
             * @param current 当前进度
             */
            progressHotCircle (current) {
                if (current > 4) {
                    return `right: calc(${100 - current}% - 4px);`
                } else {
                    return `left: ${current}%;`
                }
            },
            /**
             * 根据当前项目判断进度条背景颜色
             * @param current 当前进度
             * @param minPresell 最低预售
             * @param maxPresell 即将售罄
             */
            progressBg (current, minPresell, maxPresell) {
                if (this.isFail) {
                    return 'active'
                } else {
                    current = parseFloat(current)
                    minPresell = parseFloat(minPresell)
                    maxPresell = parseFloat(maxPresell)
                    if (maxPresell !== 0) {
                        if (current < minPresell) {
                            return 'normal'
                        } else if (current >= minPresell && current < maxPresell) {
                            return 'success'
                        } else if (current >= maxPresell && current < 100) {
                            return maxPresell > minPresell ? 'exception' : 'success'
                        } else {
                            return 'active'
                        }
                    } else {
                        if (current < minPresell) {
                            return 'normal'
                        } else if (current >= minPresell && current < 100) {
                            return 'success'
                        } else {
                            return 'active'
                        }
                    }
                }
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        }
    }
</script>

<style lang="less">
    .tipsClass {
        .ant-tooltip-arrow {
            display: none;
            border-top-color: #ffffff !important;
        }

        .ant-tooltip-inner {
            background-color: #ffffff !important;
            font-size:12px;
            font-weight:400;
            color:rgba(102,102,102,1);
        }
    }

    .successTipsClass {
        .ant-tooltip-arrow {
            left: 4px;
            border-bottom-color: #C0EFD3 !important;
        }

        .ant-tooltip-inner {
            box-shadow: none;
            padding: 1px 6px 2px 5px;
            min-height: 22px;
            border-radius: 2px;
            background-color: #C0EFD3 !important;
            font-size:12px;
            font-weight:400;
            color: #05BA4B;
            span {
                cursor: pointer;
            }
        }
    }

    .outTipsClass {
        .ant-tooltip-arrow {
            right: 4px;
            border-bottom-color: #FFDDD5 !important;
        }

        .ant-tooltip-inner {
            box-shadow: none;
            padding: 1px 6px 2px 5px;
            min-height: 22px;
            border-radius: 2px;
            background-color: #FFDDD5 !important;
            font-size:12px;
            font-weight:400;
            color: #FE542B;
        }
    }

    .allTipsClass {
        .ant-tooltip-arrow {
            right: 4px;
            border-bottom-color: #CEEDFA !important;
        }

        .ant-tooltip-inner {
            box-shadow: none;
            padding: 1px 6px 2px 5px;
            min-height: 22px;
            border-radius: 2px;
            background-color: #CEEDFA !important;
            font-size:12px;
            font-weight:400;
            color: #0BA4E8;
        }
    }
</style>

<style scoped lang="less">
    .normal {
        /deep/ .ant-progress-inner {
            background-color: #F8DFB6;
        }
    }

    .success {
        /deep/ .ant-progress-inner {
            background-color: #C0EFD3;
        }
    }

    .exception {
        /deep/ .ant-progress-inner {
            background-color: #FEDBD3;
        }
    }

    .active {
        /deep/ .ant-progress-inner {
            background-color: #D5EEF9;
        }
    }

    .info-progress {
        min-height: 60px;

        .pto-progress {
            position: relative;
            padding-top: 16px;
            min-height: 60px;

            span {
                font-size:14px;
            }

            /deep/ .ant-progress-text {
                margin-left: 0;
                display: block;
                font-size:14px;
                width: auto;
            }

            .start-circle {
                background-color: transparent;
                width: 8px;
                height: 8px;
                border: 1px solid #ffffff;
                border-radius: 50%;
                position: absolute;
                top: 23.5px;
                left: 3px;
                z-index: 2;
            }

            .success-circle {
                background: url("/content/certificatePurchase/success.png");
                width: 8px;
                height: 8px;
                position: absolute;
                top: 23.2px;
                z-index: 3;
            }

            .success-circle-text {
                pointer-events: none;
                width: 10px;
                height: 10px;
                position: absolute;
                top: 23px;
                z-index: 2;
                opacity: 0;
            }

            .hot-circle {
                position: absolute;
                top: 2px;
                z-index: 1;
                display: flex;
            }

            .hot-sellOutRatio {
                background: url("/content/certificatePurchase/success.png");
                width: 8px;
                height: 8px;
                position: absolute;
                top: 24px;
                z-index: 3;
            }

            .hot-sellOutRatio-text {
                pointer-events: none;
                opacity: 0;
                width: 10px;
                height: 10px;
                position: absolute;
                top: 23px;
                z-index: 3;
            }

            .all-text {
                pointer-events: none;
                opacity: 0;
                width: 10px;
                height: 10px;
                position: absolute;
                top: 23px;
                right: 13px;
                z-index: 3;
            }

            .current-circle {
                background:rgba(255,255,255,1);
                width: 8px;
                height: 8px;
                border-radius: 50%;
                position: absolute;
                top: 23.3px;
                z-index: 2;
            }

            .end-circle {
                background:#FFFFFF;
                opacity: 0.5;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                position: absolute;
                top: 23.3px;
                right: 0.4%;
                z-index: 1;
            }

            .progress-presale {
                cursor: pointer;
                margin-left: 0;
                display: block;
                font-size:12px;
                min-width: 50px;
                position: absolute;
                line-height: 12px;
            }

            .fail-pto-color {
                font-size:12px;
                color: #2EA9DF !important;
            }

            .progress-sellout {
                margin-left: 0;
                display: block;
                font-size:12px;
                width: auto;
                position: absolute;
            }

            .progress-all {
                position: absolute;
                right: 0;
                font-size:12px;
                color: #2EA9DF;
            }
        }
    }
</style>

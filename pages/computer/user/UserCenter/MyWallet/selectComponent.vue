<template>
    <div id="selectWrap">
        <div class="searchBox">
            <a-input type="text"
                     ref="selectInput"
                     @blur="offSelectTips"
                     @focus="setFields"
                     v-on:change="inputChange"
                     v-model="selectVal"
                     :placeholder="$t('indexWallet.mywallet_withdrawal_placeholder_address')"
                     @click='isShowTip'/>
            <div style="position: absolute; right: 12px ; bottom: 0;color: #d9d9d9;">
                <a-icon :type="iconType"/>
            </div>
            <selectTips
                    style="position: absolute;left: 0; width: 100%;z-index: 120;"
                    v-show='ulShow'
                    v-bind:list='list'
                    v-on:receive='changeVal'>
            </selectTips>
        </div>
    </div>
</template>

<script>
    import selectTips from '~/pages/computer/user/UserCenter/MyWallet/selectTips'

    export default {
        name: 'selectComponent',
        props: ['list'],
        data () {
            return {
                // 默认ul不显示，单击input改变ul的显示状态
                ulShow: false,
                // 选项值，input的值与选项值动态绑定
                selectVal: '',
                // 下拉类型
                iconType: 'down',
                // input框的状态
                selectStatus: '',
                // 提示文案
                selectHelp: '',
                // 定时器
                timer: ''
            }
        },
        methods: {
            /**
             * 赋值
             */
            changeVal (value) {
                this.selectVal = value
                this.$emit('checkedAdreeData', value)
                this.offSelectTips()
                this.iconType = 'down'
                this.checkAdress()
            },
            /**
             * 输入框值改变事件
             */
            inputChange () {
                this.$emit('checkedAdreeData', this.selectVal)
                this.ulShow = false
                this.iconType = '-1'
            },
            /**
             * 是否显示下拉框
             */
            isShowTip () {
                this.ulShow = !this.ulShow
                if (this.ulShow) {
                    this.iconType = 'up'
                } else {
                    this.iconType = 'down'
                }
            },
            /**
             * 地址检测
             */
            checkAdress () {
                if (this.selectVal === '') {
                    this.selectStatus = 'error'
                    this.selectHelp = this.$t('indexWallet.mywallet_err_address')
                    this.$emit('checkedAdree', this.selectStatus, this.selectHelp)
                } else {
                    this.selectStatus = 'success'
                    this.selectHelp = ''
                    this.$emit('checkedAdree', this.selectStatus, this.selectHelp)
                }
            },
            /**
             * 延时失去焦点
             */
            offSelectTips () {
                this.$emit('blurStatusAdress')
                this.timer = setTimeout(() => {
                    this.offSelcetTipsFun()
                    clearTimeout(this.timer)
                }, 230)
            },
            // 获取焦点
            setFields () {
                this.$emit('setFields')
            },
            /**
             * 关闭下拉框
             */
            offSelcetTipsFun () {
                // input 框失去焦点，隐藏下拉框
                this.ulShow = false
                this.iconType = 'down'
            }
        },
        components: {
            selectTips
        }
    }
</script>

<style scoped>
    ul, li {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    #selectWrap {
        width: 392px;
    }

    .searchBox {
        position: relative;
    }

    .searchBox input {
        width: 100%;
        line-height: 40px;
        height: 40px;
        padding: 0 5px;
        vertical-align: middle;
        border-radius: 5px;
        outline: none;

    }

    .searchBox a {
        display: inline-block;
        text-decoration: none;
        background-color: #b1d85c;

    }
</style>
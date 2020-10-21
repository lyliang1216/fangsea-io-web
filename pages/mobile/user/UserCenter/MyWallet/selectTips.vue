<template>
    <div class="skill">
        <ul class="skill-list"
            @mouseenter="enterSpan(index)"
            @mouseleave="leaveSpan()"
            v-for='(item, index) of list'
            v-on:click='selectLi(item.address)'>
            <li> {{ item.comments }}</li>
            <li> {{ item.address }}</li>
            <transition>
                <span class="hover-style-span"
                      v-show="isShowHoverSpan === index"></span>
            </transition>
        </ul>
        <!-- 添加地址 -->
        <div class="addTress" @click="goAdress">
            <span> <a-icon type="plus"/> </span>
            <span style="line-height: 22px"> {{$t('indexWallet.mywallet_popup_select_tip_add_address')}} </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'selectTips',
        props: ['list'],
        data () {
            return {
                isShowHoverSpan: false
            }
        },
        methods: {
            /**
             * 点击事件
             */
            selectLi: function (item) {
                // $emit触发当前实例上的自定义事件 receive
                this.$emit('receive', item)
            },
            /**
             * 点击跳转地址管理页面
             */
            goAdress () {
                this.$router.push('/mobile/user/UserCenter/AddressManagement')
            },
            /**
             * 鼠标进入事件
             */
            enterSpan (index) {
                this.isShowHoverSpan = index
            },
            /**
             * 鼠标离开事件
             */
            leaveSpan () {
                this.isShowHoverSpan = false
            }

        }
    }
</script>

<style lang="less" scoped>

    .skill {
        ul {
            margin-bottom: 0;
        }

        margin-bottom: 0 !important;
        list-style: none;
        max-height: 2.88rem;
        overflow: auto;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        background-clip: padding-box;
        -webkit-transform: translate3d(0, 0, 0);
        padding: 0 25px;
        display: flex;
        flex-direction: column;

        .skill-list {
            position: relative;
            list-style: none;
            padding: 15px 0 16px 0;
            border-bottom: 1px solid #e5e5e5;

            &:last-of-type {
                border-bottom: none;
            }

            li {
                line-height: 22px !important;

                &:nth-child(1) {
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.45);
                }

                &:nth-child(2) {
                    font-size: 14px;
                    color: #000000;
                }
            }
        }

        .skill-list {
            &:hover {
                cursor: pointer;

                > li {
                    color: #2EA9DF;
                }

            }
        }

        .addTress {
            padding: 28px 0 20px 0;
            margin-left: -13px;
            display: flex;
            align-items: center;

            span {
                font-size: 14px;

                &:nth-child(1) {
                    margin-right: 3px;
                }
            }

            &:hover {
                cursor: pointer;
            }
        }
    }

    .hover-style-span {
        border-radius: 4px;
        position: absolute;
        display: inline-flex;
        background-color: #2EA9DF;
        width: 5px;
        height: 36px;
        left: -15px;
        top: 19px;;
    }

    .v-enter,
    .v-leave-to {
        opacity: 0;
    }

    .v-enter-active,
    .v-leave-active {
        transition: all 0.2s ease;
    }

</style>
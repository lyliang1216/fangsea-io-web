<template>
    <div class="menu-box">
        <a-menu
                @click="handleClick"
                style="width: 200px; border-radius: 4px; border:1px solid rgba(241,241,241,1);"
                :defaultSelectedKeys="['5']"
                :openKeys.sync="openKeys"
                mode="inline"
        >
            <a-sub-menu key="sub2" @titleClick="titleClick">
                <span slot="title"><span>Navigation Two</span></span>
                <a-menu-item key="5">Option 5</a-menu-item>
                <a-menu-item key="6">Option 6</a-menu-item>
                <a-sub-menu key="sub3" title="Submenu">
                    <a-menu-item key="7">Option 7</a-menu-item>
                    <a-menu-item key="8">Option 8</a-menu-item>
                </a-sub-menu>
            </a-sub-menu>
            <a-sub-menu key="sub4">
                <span slot="title"><span>Navigation Three</span></span>
                <a-menu-item key="9">Option 9</a-menu-item>
                <a-menu-item key="10">Option 10</a-menu-item>
                <a-menu-item key="11">Option 11</a-menu-item>
                <a-menu-item key="12">Option 12</a-menu-item>
            </a-sub-menu>
        </a-menu>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                openKeys: ['sub2']
            }
        },
        methods: {
            handleClick (e) {
                console.log('click', e)
            },
            titleClick (e) {
                console.log('titleClick', e)
            }
        }
    }
</script>

<style lang="less" scoped>
    .menu-box{
        width: 200px;
        float: left;
    }
</style>
<style lang="less">
    .menu-box{
        /deep/.ant-menu-item, .ant-menu-submenu-title{
            padding-left: auto!important;
        }
    }
</style>

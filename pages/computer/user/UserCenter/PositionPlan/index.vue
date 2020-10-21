<template>
    <div>
        <a-tabs defaultActiveKey="1" @change="callback">
            <a-tab-pane :tab="$t('PositionPlan.positionPlan_tabs_title1')" key="1">
                <recommendation-code v-if="key === '1'"></recommendation-code>
            </a-tab-pane>
            <a-tab-pane key="2">
                <template slot="tab">
                    <a-badge :dot="hasUpdated('POSITIONPLAN')" :offset="[3, 0]">
                        {{$t('PositionPlan.positionPlan_tabs_title2')}}
                    </a-badge>
                </template>
                <recommend-list v-if="key === '2'"></recommend-list>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
    import RecommendationCode from '~/pages/computer/user/UserCenter/PositionPlan/components/RecommendationCode'
    import RecommendList from '~/pages/computer/user/UserCenter/PositionPlan/components/RecommendList'

    export default {
        data () {
            return {
                key: '1'
            }
        },
        methods: {
            callback (key) {
                this.key = key
            },
            /**
             * 修改红点状态
             * @param name 菜单名
             */
            hasUpdated (name) {
                let arr = this.$store.state.hasUpdated
                for (let i in arr) {
                    if (arr[i].name === name) {
                        return arr[i].isShow
                    }
                }
                return false
            }
        },
        components: {
            RecommendationCode,
            RecommendList
        },
        beforeDestroy () {
        },
        head () {
            return {
                title: this.$t('PageTitle.position_plan')
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/.ant-tabs-bar {
        margin-bottom: 25px;
        .ant-tabs-nav-scroll {
            padding: 0 32px;
            background: #fff;
            .ant-tabs-tab {
                width: 110px;
                font-size: 16px;
                color: #333;
                line-height: 56px;
                padding: 0;
                text-align: center;
                margin-right: 0;
            }
            .ant-tabs-tab-active {
                color: #2EA9DF;
            }
            .ant-tabs-ink-bar {
                background: #2EA9DF;
            }
        }
    }
</style>

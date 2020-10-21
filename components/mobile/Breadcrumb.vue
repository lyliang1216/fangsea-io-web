<template>
    <div class="breadcrumb">
        <a-breadcrumb :routes="routes">
            <template slot="itemRender" slot-scope="{route, params, routes, paths}">
                <span v-if="routes.indexOf(route) === routes.length - 1">
                    {{route.breadcrumbName}}
                </span>
                <a v-else href="javascript:;" @click="JudgeRedirect(route.path)">
                    {{route.breadcrumbName}}
                </a>
            </template>
        </a-breadcrumb>
    </div>
</template>
<script>
    export default {
        props: ['routes'],
        data () {
            return {
            }
        },
        methods: {
            /**
             * 跳转判断语言
             * @param val 跳转路径
             */
            JudgeRedirect (val) {
                let url = val
                if (url.substr(url.length - 1, 1) === '/') {
                    url = url.substr(0, url.length - 1)
                }
                if (url === '/computer' || url === '/mobile' || url === '/') {
                    window.location.href = '/'
                } else {
                    this.$router.push(val)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .breadcrumb {
        margin: 8px 16px;

        /deep/ .ant-breadcrumb-separator {
            margin: 0 2px;
        }

        /deep/ .ant-breadcrumb {
            font-size: 12px;
        }

        /deep/ .ant-breadcrumb-link {
            color: #333333;

            a {
                color: #333333;
            }
        }
    }
</style>

const webpack = require('webpack')

module.exports = {
    /*
      ** Headers of the page
      */
    head: {
        title: 'PTOHome',
        meta: [
            {charset: 'utf-8'},
            {
                name: 'viewport',
                content: 'maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0'
            },
            {hid: 'description', name: 'description', content: 'Leading Blockchain Platform for Global Property Investments'},
            {'http-equiv': 'pragma', content: 'no-cache'},
            {'http-equiv': 'cache-control', content: 'no-cache, no-store, must-revalidate'},
            {'http-equiv': 'expires', content: '0'},
            {'http-equiv': 'X-UA-Compatible', content: 'IE=edge'}, // 让IE使用最新的浏览器渲染
            {name: 'apple-mobile-web-app-capable', 'content': 'yes'}, // 删除默认的苹果工具栏和菜单栏
            {name: 'keywords', content: 'fst, ptohome, property token offering, tokenized assets, real estate, blockchain, platform'},
            // 添加至主屏幕配置
            {name: 'mobile-web-app-capable', 'content': 'yes'},
            {name: 'apple-mobile-web-app-title', 'content': 'PTOHome'},
            // 针对微软手机配置
            {name: 'application-name', 'content': 'PTOHome'},
            {name: 'msapplication-TileColor', 'content': '#232933'},
            {name: 'msapplication-square70x70logo', 'content': '/content/appIcons/logo-72.jpg'},
            {name: 'msapplication-square150x150logo', 'content': '/content/appIcons/logo-192.jpg'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/content/favicon.ico'},
            {rel: 'Shortcut Icon', href: '/content/appIcons/logo-192.jpg'},
            // 添加至主屏幕配置
            {rel: 'manifest', href: '/content/manifest.json'},
            // 针对苹果手机配置
            {rel: 'apple-touch-icon-precomposed', sizes: '54x54', href: '/content/appIcons/logo-60.jpg'},
            {rel: 'apple-touch-icon-precomposed', sizes: '72x72', href: '/content/appIcons/logo-72.jpg'},
            {rel: 'apple-touch-icon-precomposed', sizes: '114x114', href: '/content/appIcons/logo-120.jpg'},
            {rel: 'apple-touch-icon-precomposed', sizes: '144x144', href: '/content/appIcons/logo-144.jpg'},
            {rel: 'apple-touch-icon-precomposed', sizes: '192x192', href: '/content/appIcons/logo-192.jpg'}
        ],
        // 不对<script>标签中内容做转义处理
        __dangerouslyDisableSanitizers: ['script']
    },
    /**
     * 第三方插件
     */
    plugins: [
        {src: '~/plugins/antd.js', ssr: true},
        {src: '~/plugins/i18n.js', ssr: true},
        {src: '~/plugins/qr-code.js', ssr: true}
    ],
    vue: {
        config: {
            productionTip: false, // 阻止 vue 在生产启动时生成提示
            devtools: true // 开启调试工具
        }
    },
    /**
     * 编译配置
     */
    build: {
        publicPath: '/_global/',
        vendor: ['axios'],
        extend (config, ctx) {
            /*
             ** Run ESLINT on save
             */
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules|.nuxt)/
                })
            }
            /**
             * 修改打包资源请求地址
             */
            if (!ctx.isDev) {
                config.output.publicPath = '/_global/'
            }
            /**
             * 自定义 ant-design-vue 主题颜色
             */
            config.module.rules.push({
                test: /\.less$/,
                use: [{
                    loader: 'less-loader',
                    options: {
                        modifyVars: {
                            'primary-color': '#2EA9DF',
                            'link-color': '#2EA9DF',
                            'border-radius-base': '4px'
                        },
                        javascriptEnabled: true
                    }
                }]
            })
        },
        postcss: {
            preset: {
                // 更改postcss-preset-env 设置
                autoprefixer: {
                    grid: true
                }
            }
        },
        plugins: [
            // 默认英语，语言包只引入简体繁体
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|zh-tw/)
        ]
    },
    /**
     * API middleware 中间件
     */
    serverMiddleware: [
        '~/api/index.js'
    ],
    /**
     * 中间件拦截器
     */
    router: {
        middleware: ['i18n', 'route', 'config']
    },
    /**
     * 加载进度条风格
     */
    loading: {
        color: '#41B883'
    },
    /**
     * APP启动端口
     * 默认: 3000
     */
    server: {
        port: 80,
        host: '0.0.0.0'
    },
    /**
     * 跨域代理
     */
    modules: ['@nuxtjs/axios'],
    axios: {
        proxy: process.env.NODE_ENV === 'development', // 是否使用代理
        // prefix: '',
        credentials: true
    },
    proxy: {
        // 全局拦截代理
        '/api/v2': {
            target: (process.env.NODE_ENV === 'development') ? 'https://stg.ptohome.com' : 'https://stg.ptohome.com',
            changeOrigin: true,
            pathRewrite: {'': ''}
        }
    }
}

import Tool from '~/assets/utils/tool'
import Cookie from 'js-cookie'

export default ({app, redirect, req}) => {
    // 一期房产购买
    let pg1 = '/house/list/pg1.html'
    // 一期我的房产
    let pg2 = '/order/list/ot0opg1.html'
    // 不做授权拦截跳转的地址
    let path
    // 没有登录授权跳转的地址
    let redirectLoginURL = ''
    // 返回登录前的界面
    let redirectURL = ''
    // 移动端类型
    let clientType = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    // 服务端渲染时判断客户端类型
    if (process.server) {
        let cookies = Tool.getcookiesInServer(req)
        let token = cookies.refresh_token ? cookies.refresh_token : ''
        // 根据request消息头，动态改变路由的跳转
        let flag = req.headers['user-agent'].match(clientType)
        // eslint-disable-next-line
        let mobileFlag = req.url.indexOf('/mobile') !== -1,
            computerFlag = req.url.indexOf('/computer') !== -1
        if (flag) {
            if (computerFlag) {
                path = `/mobile${req.url.substr(9, req.url.length)}`
            } else {
                path = mobileFlag ? req.url : `/mobile${req.url}`
            }
            redirectLoginURL = '/mobile/user/login'
            redirectURL = cookies.redirectUrl || '/mobile'
        } else {
            if (mobileFlag) {
                path = `/computer${req.url.substr(7, req.url.length)}`
            } else {
                path = computerFlag ? req.url : `/computer${req.url}`
            }
            redirectLoginURL = '/computer/user/login'
            redirectURL = cookies.redirectUrl || '/computer'
        }
        if (req.url.indexOf(pg1) === -1 && req.url.indexOf(pg2) === -1) {
            if (token === '' && (req.url.indexOf('/UserCenter') !== -1 || req.url.indexOf('/SubscribeImmediately') !== -1)) {
                Cookie.set('redirectUrl', req.url)
                redirect(redirectLoginURL)
            } else if (token !== '' && (req.url.indexOf('/user/login') !== -1 || req.url.indexOf('/user/register') !== -1)) {
                redirect(redirectURL)
            } else {
                if (path !== req.url) {
                    redirect({path: path})
                }
            }
        }
    }
    // 客户端渲染时判断客户端类型
    if (process.client) {
        // 添加路由守卫，动态改变路由的跳转
        app.router.beforeEach((to, from, next) => {
            let token = Cookie.get('refresh_token')
            let flag = navigator.userAgent.match(clientType)
            // eslint-disable-next-line
            let mobileFlag = to.path.indexOf('/mobile') !== -1,
                computerFlag = to.path.indexOf('/computer') !== -1
            if (flag) {
                if (computerFlag) {
                    path = `/mobile/${to.path.substr(9, to.path.length)}`
                } else {
                    path = mobileFlag ? to.path : `/mobile${to.path}`
                }
                redirectLoginURL = '/mobile/user/login'
                redirectURL = Cookie.get('redirectUrl') || '/mobile'
            } else {
                if (mobileFlag) {
                    path = `/computer/${to.path.substr(8, to.path.length)}`
                } else {
                    path = computerFlag ? to.path : `/computer${to.path}`
                }
                redirectLoginURL = '/computer/user/login'
                redirectURL = Cookie.get('redirectUrl') || '/computer'
            }
            if (to.path.indexOf(pg1) === -1 && to.path.indexOf(pg2) === -1) {
                if (!token && (to.path.indexOf('/UserCenter') !== -1 || to.path.indexOf('/SubscribeImmediately') !== -1)) {
                    Cookie.set('redirectUrl', to.fullPath)
                    next({path: redirectLoginURL})
                } else if (token && (to.path.indexOf('/user/login') !== -1 || to.path.indexOf('/user/register') !== -1)) {
                    next({path: redirectURL})
                } else {
                    if (path !== to.path) {
                        next({path: path})
                    } else {
                        next()
                    }
                }
            }
        })
    }
}

import Tool from '~/assets/utils/tool'
import axios from '~/plugins/axios'

export default ({req}) => {
    // 服务端渲染时判断客户端类型
    if (process.server) {
        let cookies = Tool.getcookiesInServer(req)
        if (cookies.refresh_token) {
            // 设置默认消息头
            axios.defaults.headers['Authorization'] = 'bearer' + ' ' + cookies.token
        }
        // 初始国际化
        switch (cookies.language) {
        case 'zh_TW' :
            axios.defaults.headers['Accept-Language'] = 'zh-TW,zh;q=0.9'
            break
        case 'zh_CN' :
            axios.defaults.headers['Accept-Language'] = 'zh-CN,zh;q=0.9'
            break
        case 'en_US' :
            axios.defaults.headers['Accept-Language'] = 'en-US,en;q=0.9'
            break
        default:
            axios.defaults.headers['Accept-Language'] = 'zh-TW,zh;q=0.9'
        }
    }
}

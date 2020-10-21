import Vue from 'vue'
import {
    Button,
    Row,
    Col,
    Icon,
    Layout,
    Breadcrumb,
    Dropdown,
    Menu,
    Pagination,
    DatePicker,
    Form,
    Input,
    LocaleProvider,
    Divider,
    Spin,
    Skeleton,
    Progress,
    Modal,
    Drawer,
    Tooltip,
    Tag,
    Tabs,
    Table,
    List,
    Collapse,
    Carousel,
    Badge,
    Upload,
    Select,
    Checkbox,
    Popover
} from 'ant-design-vue'
import Message from 'ant-design-vue/lib/message'

import 'ant-design-vue/lib/button/style/index.less'
import 'ant-design-vue/lib/grid/style/index.less'
import 'ant-design-vue/lib/icon/style/index.less'
import 'ant-design-vue/lib/layout/style/index.less'
import 'ant-design-vue/lib/breadcrumb/style/index.less'
import 'ant-design-vue/lib/dropdown/style/index.less'
import 'ant-design-vue/lib/menu/style/index.less'
import 'ant-design-vue/lib/pagination/style/index.less'
import 'ant-design-vue/lib/date-picker/style/index.less'
import 'ant-design-vue/lib/form/style/index.less'
import 'ant-design-vue/lib/input/style/index.less'
import 'ant-design-vue/lib/locale-provider/style/index.less'
import 'ant-design-vue/lib/divider/style/index.less'
import 'ant-design-vue/lib/spin/style/index.less'
import 'ant-design-vue/lib/skeleton/style/index.less'
import 'ant-design-vue/lib/progress/style/index.less'
import 'ant-design-vue/lib/modal/style/index.less'
import 'ant-design-vue/lib/drawer/style/index.less'
import 'ant-design-vue/lib/tooltip/style/index.less'
import 'ant-design-vue/lib/tag/style/index.less'
import 'ant-design-vue/lib/tabs/style/index.less'
import 'ant-design-vue/lib/table/style/index.less'
import 'ant-design-vue/lib/list/style/index.less'
import 'ant-design-vue/lib/collapse/style/index.less'
import 'ant-design-vue/lib/carousel/style/index.less'
import 'ant-design-vue/lib/badge/style/index.less'
import 'ant-design-vue/lib/upload/style/index.less'
import 'ant-design-vue/lib/select/style/index.less'
import 'ant-design-vue/lib/message/style/index.less'
import 'ant-design-vue/lib/checkbox/style/index.less'
import 'ant-design-vue/lib/popover/style/index.less'
import 'ant-design-vue/lib/style/index.less'

import '~/assets/css/common.less'

// Vue载入组件
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Icon)
Vue.use(Layout)
Vue.use(Breadcrumb)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(Pagination)
Vue.use(DatePicker)
Vue.use(Form)
Vue.use(Input)
Vue.use(LocaleProvider)
Vue.use(Divider)
Vue.use(Spin)
Vue.use(Skeleton)
Vue.use(Progress)
Vue.use(Modal)
Vue.use(Drawer)
Vue.use(Tooltip)
Vue.use(Tag)
Vue.use(Tabs)
Vue.use(Table)
Vue.use(List)
Vue.use(Collapse)
Vue.use(Carousel)
Vue.use(Badge)
Vue.use(Upload)
Vue.use(Select)
Vue.use(Checkbox)
Vue.use(Popover)

Vue.prototype.$message = Message
Vue.prototype.$confirm = Modal.confirm

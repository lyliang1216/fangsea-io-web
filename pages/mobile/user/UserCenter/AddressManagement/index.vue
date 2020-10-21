<template>
    <a-layout id="components-layout-mobile-top"
              class="layout"
              :class="drawer">
        <fs-head
                :SelectedKey="key"
                :SelectedType="type"
                :centerKey="centerKey"
                @openDrawer="openDrawer"
                @closeDrawer="closeDrawer"/>
        <section class="container">
            <a-layout-content>
                <div class="address-admin">
                    <div class="head-title">
                        <h3> {{$t('AddressManagement.addressbook_add_title_headline')}} </h3>
                        <button @click="editform">{{$t('AddressManagement.addressbook_add_btn_add')}}</button>
                    </div>
                    <a-modal
                            wrapClassName="addressModal"
                            :visible="visible"
                            :footer="null"
                            @cancel="handleCancel">
                        <!-- 添加转账地址 -->
                        <a-form
                                class="add-form"
                                layout="vertical"
                                :form="form"
                                @submit="handleSubmit">
                            <!--币种选择-->
                            <a-form-item class="currency" :label="$t('AddressManagement.addressbook_add_item_title1')"
                                         :colon="false" :has-feedback="currencyFeedback">
                                <a-select @change="choosecurrency" size="large" @focus="setFields('currency')"
                                          v-decorator="['currencyId',
                                            {validateTrigger: 'change', rules: [{validator: checkCurrencyId}]}]">
                                    <a-select-option
                                            v-for="val in currency"
                                            :key="val.curName"
                                            :value="val.curId">
                                        {{val.curName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                            <!--转账地址-->
                            <a-form-item class="address" :label="$t('AddressManagement.addressbook_add_item_title2')"
                                         :colon="false" :has-feedback="addressFeedback">
                                <a-input @focus="setFields('address')" v-decorator="['address',
                                     {validateTrigger: 'blur', rules: [{validator: checkAddress}]}]"/>
                            </a-form-item>
                            <!--备注-->
                            <a-form-item class="remarks" :label="$t('AddressManagement.addressbook_add_item_title3')"
                                         :colon="false" :has-feedback="remarksFeedback">
                                <a-input @focus="setFields('comments')" v-decorator="['comments',
                                     {validateTrigger: 'blur', rules: [{validator: checkComments}]}]"/>
                            </a-form-item>
                            <!--添加-->
                            <a-form-item class="submit-box">
                                <a-button
                                        @click="handleSubmit"
                                        type="primary"
                                        :loading="loading"
                                        html-type="submit"
                                        class="submit-button">
                                    {{$t('AddressManagement.addressbook_add_btn_submit')}}
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </a-modal>
                    <!-- 转账地址管理 -->
                    <div class="address-table">
                        <h4>{{$t('AddressManagement.addressbook_add_title_list')}}</h4>
                        <div class="address-list">
                            <div class="address-box" v-for="(value, index) in addresslist">
                                <div class="address-twocode">
                                    <qrcode :value="value.address" :size="72"></qrcode>
                                </div>
                                <div class="address-info">
                                    <!--币种名称-->
                                    <div>
                                        <p class="info-name">
                                            {{$t('AddressManagement.addressbook_add_item_title1')}}:</p>
                                        <p>{{value.currencyName}}</p>
                                    </div>
                                    <!--转账地址-->
                                    <div class="copyurl">
                                        <p class="info-name">
                                            {{$t('AddressManagement.addressbook_add_item_title2')}}:</p>
                                        <p>
                                            {{value.address | replacenull}}
                                        </p>
                                        <button class="btn" @click="copytips" :data-clipboard-text="value.address">
                                            {{$t('AddressManagement.addressbook_add_btn_copy')}}
                                        </button>
                                    </div>
                                    <!--备注-->
                                    <div>
                                        <p class="info-name">
                                            {{$t('AddressManagement.addressbook_add_item_title3')}}:</p>
                                        <p>{{value.comments}}</p>
                                    </div>
                                    <!--创建时间-->
                                    <div>
                                        <p class="info-name">
                                            {{$t('AddressManagement.addressbook_add_item_title4')}}:</p>
                                        <p>{{value.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
                                    </div>
                                </div>
                                <!--删除-->
                                <a-icon class="delete-address" @click="deladdress(value)" type="delete"/>
                            </div>
                        </div>
                        <!--分页-->
                        <a-pagination v-if="total!==0" class="list-pagination" @change="changepag" :defaultCurrent="1"
                                      :total="total"/>
                    </div>
                </div>
            </a-layout-content>
        </section>
        <fonter/>
    </a-layout>
</template>

<script>
    import FsHead from '~/components/mobile/FangseaHeader'
    import qrcode from '~/components/computer/QrCode'
    import fonter from '~/components/mobile/Footer'
    import validate from '~/assets/utils/validate'
    import {parseTime} from '~/assets/utils/index'
    import {Bus} from '~/assets/utils/bus'
    import tool from '~/assets/utils/tool'
    import axios from '~/plugins/axios'
    import Clipboard from 'clipboard'

    export default {
        name: 'AddressManagement',
        data () {
            return {
                // 首页高亮下标
                key: '0',
                // 表单布局模式
                formLayout: 'vertical',
                // 登录、注册导航下标
                type: 0,
                // 用户中心导航下标
                centerKey: 3,
                drawer: {'drawer-containel-left': false, 'drawer-containel-right': false},
                // 弹窗显示
                visible: false,
                // 币种列表
                currency: [],
                // 地址列表
                addresslist: [],
                // 当前页
                pageNum: 1,
                // 每页条数
                pageSize: 10,
                // 币种名称
                curName: '',
                // 地址总数
                total: 0,
                // 加载loading
                loading: false,
                // 币种校验图标
                currencyFeedback: false,
                // 地址校验图标
                addressFeedback: false,
                // 备注校验图标
                remarksFeedback: false
            }
        },
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
        created () {
            if (process.client) {
                this.listenI18n()
                this.getcur()
                this.getaddresslist()
            }
        },
        mounted () {
            setTimeout(() => {
                Bus.$emit('publicEvent', 'ADDRESSMANAGEMENT')
            }, 300)
        },
        methods: {
            /**
             *  获取币种列表
             */
            getcur () {
                axios.post('/wallet/currency/front/query', {
                    traceId: tool.UUID(),
                    data: {
                        pageNum: 1,
                        pageSize: 0
                    }
                })
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.currency = res.data.data.list
                        }
                    }).catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             *  地址列表查询
             */
            getaddresslist () {
                axios.post('/user/config/address/query', {
                    traceId: tool.UUID(),
                    data: {
                        // 页码
                        pageNum: this.pageNum,
                        // 每页条数
                        pageSize: 10
                    }
                })
                    .then(res => {
                        if (res.data.code.toString() === '0') {
                            this.addresslist = res.data.data.list.reverse()
                            this.total = res.data.data.total
                        } else {
                            this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                        }
                    }).catch(err => {
                        this.$message.error(this.$t(err.message))
                    })
            },
            /**
             *  选择币种
             *  @param value select值
             *  @param option 选中项
             */
            choosecurrency (value, option) {
                this.curName = option.data.key
            },
            /**
             *  获取当前时间戳
             */
            getnowtime () {
                return (new Date()).getTime()
            },
            /**
             * 检测币种选择
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkCurrencyId (rule, value, callback) {
                if (!validate.required(value)) {
                    callback(this.$t('AddressManagement.addressbook_err_choosetoken'))
                } else {
                    callback()
                }
            },
            /**
             * 检测转账地址
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkAddress (rule, value, callback) {
                if (!validate.required(value)) {
                    callback(this.$t('AddressManagement.addressbook_add_err_address'))
                } else {
                    callback()
                }
            },
            /**
             * 检测转账地址
             * @param rule  检测对象
             * @param value 检测的值
             * @param callback 回调
             */
            checkComments (rule, value, callback) {
                if (!validate.required(value)) {
                    callback(this.$t('AddressManagement.addressbook_add_err_note'))
                } else if (value.length > 100) {
                    callback(this.$t('AddressManagement.addressbook_add_err_note'))
                } else {
                    callback()
                }
            },
            /**
             *  提交
             *  @param e 提交事件
             */
            handleSubmit (e) {
                e.preventDefault()
                this.form.validateFields((err, values) => {
                    if (!err) {
                        // 校验地址
                        this.loading = true
                        axios.post('/wallet/save/address/check', {
                            traceId: tool.UUID(),
                            data: values.address.replace(/\s*/g, '')
                        }).then(res => {
                            if (res.data.code.toString() === '0') {
                                // 添加钱包地址备注
                                axios.post('/user/config/address/save', {
                                    traceId: tool.UUID(),
                                    data: {
                                        id: '',
                                        currencyId: values.currencyId,
                                        currencyName: this.curName,
                                        address: values.address.replace(/\s*/g, ''),
                                        comments: values.comments,
                                        createTime: this.getnowtime()
                                    }
                                })
                                    .then(response => {
                                        this.loading = false
                                        if (response.data.code.toString() === '0') {
                                            this.$message.success(this.$t(`code.${response.data.code.toString()}`))
                                            this.form.resetFields()
                                            this.handleCancel()
                                            this.getaddresslist()
                                        } else {
                                            this.$message.error(this.$t(`code.${response.data.code.toString()}`))
                                        }
                                    }).catch(error => {
                                        this.loading = false
                                        this.$message.error(this.$t(error.message))
                                    })
                            } else {
                                this.loading = false
                                this.$message.error(this.$t(`code.${res.data.code.toString()}`))
                            }
                        }).catch(err1 => {
                            this.loading = false
                            this.$message.error(this.$t(err1.message))
                        })
                    }
                })
            },
            /**
             *  点击复制事件
             */
            copytips () {
                let clipboard = new Clipboard('.btn')
                clipboard.on('success', e => {
                    this.$message.success(this.$t('AddressManagement.addressbook_add_btn_copied'))
                    clipboard.destroy()
                })
                clipboard.on('error', e => {
                    this.$message.error(this.$t('AddressManagement.addressbook_add_err_copy'))
                    clipboard.destroy()
                })
            },
            /**
             *  删除地址
             *  @param value 删除行的内容
             */
            deladdress (value) {
                let _this = this
                this.$confirm({
                    title: this.$t('AddressManagement.addressbook_delete_title_content'),
                    okText: this.$t('AddressManagement.addressbook_delete_btn_delete'),
                    cancelText: this.$t('AddressManagement.addressbook_delete_btn_cancel'),
                    onOk () {
                        // 删除钱包地址备注
                        axios.post('/user/config/address/delete', {
                            traceId: tool.UUID(),
                            data: {
                                id: value.id
                            }
                        })
                            .then(res => {
                                if (res.data.code.toString() === '0') {
                                    _this.$message.success(_this.$t(`code.${res.data.code.toString()}`))
                                    _this.getaddresslist()
                                } else {
                                    _this.$message.error(_this.$t(`code.${res.data.code.toString()}`))
                                }
                            }).catch(err => {
                                _this.$message.error(_this.$t(err.message))
                            })
                    }
                })
            },
            /**
             *  切换页码
             *  @param page 改变后的页码
             */
            changepag (page) {
                this.pageNum = page
                this.getaddresslist()
            },
            /**
             *  打开弹窗
             */
            editform () {
                this.visible = true
            },
            /**
             *  关闭弹窗
             *  @param e 关闭事件
             */
            handleCancel (e) {
                this.form.resetFields()
                this.form.getFieldError('currencyId') && this.form.validateFields(['currencyId'], { force: true })
                this.form.getFieldError('address') && this.form.validateFields(['address'], { force: true })
                this.form.getFieldError('comments') && this.form.validateFields(['comments'], { force: true })
                this.visible = false
            },
            /**
             * 开启右侧抽屉导航
             */
            openDrawer () {
                this.drawer = {'drawer-containel-left': true, 'drawer-containel-right': false}
            },
            /**
             * 关闭右侧抽屉导航
             */
            closeDrawer () {
                this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': true}
                let _this = this
                setTimeout(function () {
                    _this.drawer = {'drawer-containel-left': false, 'drawer-containel-right': false}
                }, 200)
            },
            // 监听动态数据国际化
            listenI18n () {
                Bus.$on('checkLange', () => {
                    this.getcur()
                    this.getaddresslist()
                    this.form.getFieldError('currencyId') && this.form.validateFields(['currencyId'], { force: true })
                    this.form.getFieldError('address') && this.form.validateFields(['address'], { force: true })
                    this.form.getFieldError('comments') && this.form.validateFields(['comments'], { force: true })
                })
            },
            // 设置获取焦点状态
            setFields (field) {
                // 隐藏成功标志
                switch (field) {
                case 'currency' : this.currencyFeedback = false; break
                case 'address' : this.addressFeedback = false; break
                case 'comments' : this.remarksFeedback = false; break
                }
                let fieldsValue = this.form.getFieldsValue([field])
                this.form.resetFields([field])
                this.form.setFieldsValue(fieldsValue)
            }
        },
        filters: {
            // 时间格式化
            parseTime,
            // 地址去空
            replacenull (val) {
                return val.replace(/\s*/g, '')
            }
        },
        beforeDestroy () {
            Bus.$off('checkLange')
        },
        components: {
            FsHead,
            fonter,
            qrcode
        },
        head () {
            return {
                title: this.$t('PageTitle.transaddr_pagetitle')
            }
        }
    }
</script>

<style lang="less" scoped>
    .address-admin {
        .head-title {
            height: 0.64rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            margin-bottom: 0.2rem;
            padding: 0 0.16rem;
            h3 {
                font-size: 18px;
                color: #333333;
                margin: 0;
                padding: 0;
                font-weight: 500;
            }
            button {
                min-width: 0.88rem;
                padding: 0 0.16rem;
                height: 0.32rem;
                display: block;
                background: #2ea9df;
                color: #fff;
                border: 0;
                cursor: pointer;
                border-radius: 4px;
                outline: none;
            }
        }
        .address-table {
            background: #fff;
            padding: 0 0.16rem 0.32rem 0.16rem;
            h4 {
                font-size: 16px;
                color: #333;
                line-height: 0.5rem;
                border-bottom: 1px solid #e9e9e9;
            }
            .address-list {
                padding-bottom: 0.32rem;
                .address-box {
                    position: relative;;
                    border-bottom: 1px solid #e9e9e9;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    padding: 0.16rem 0 0.32rem;
                    .address-twocode {
                        width: 70/368*100%;
                        img {
                            display: block;
                            width: 100%;
                        }
                    }
                    .address-info {
                        margin-left: 0.12rem;
                        width: 286/368*100%;
                        div {
                            display: flex;
                            justify-content: flex-start;
                            align-items: flex-start;
                            p {
                                width: 178/286*100%;
                                font-size: 14px;
                                color: #333333;
                                margin: 0 0 8/286*100% 0;
                                word-wrap: break-word;
                            }
                            .info-name {
                                width: 70/286*100%;
                                font-size: 14px;
                                color: #9a9a9a;
                            }
                        }
                        .copyurl {
                            display: flex;
                            justify-content: flex-start;
                            align-items: flex-start;
                            position: relative;
                            button {
                                position: absolute;
                                right: 0;
                                top: 0;
                                display: block;
                                background: none;
                                outline: none;
                                border: none;
                                color: #2ea9df;
                                font-size: 14px;
                                margin-left: 20/368*100%;
                                cursor: pointer;
                                padding: 0;
                            }
                        }
                    }
                    .delete-address {
                        position: absolute;
                        bottom: 5%;
                        right: 0;
                        font-size: 22px;
                        color: #999999;
                        cursor: pointer;
                    }
                }
            }
            .list-pagination {
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
        }
    }

    .add-form {
        background: #fff;
        padding: 0.16rem 0.16rem 0.22rem 0.16rem;
        .ant-row {
            margin-bottom: 0.20rem;
            padding: 0;
        }
        .currency {
            width: 100%;
        }
        .address {
            width: 100%;
        }
        .remarks {
            width: 100%;
        }
        .submit-box {
            padding: 0;
            margin: 0;
            width: 100%;
            .submit-button {
                width: 100%;
                height: 0.32rem;
                display: block;
                background: #2ea9df;
                color: #fff;
                border: 0;
                margin: 0;
                padding: 0;
                cursor: pointer;
            }
        }
        /deep/ .ant-form-item-required:before {
            display: none;
        }
    }
</style>
<style lang="less">
    .addressModal .ant-modal {
        top: 0.82rem!important;
    }
</style>
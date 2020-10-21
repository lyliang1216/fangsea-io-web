<template>
    <section class="container">
        <a-layout-content>
            <div class="address-admin">
                <h3> {{$t('AddressManagement.addressbook_add_title_headline')}} </h3>
                <!-- 添加转账地址 -->
                <a-form
                        class="add-form"
                        layout="vertical"
                        :form="form"
                        @submit="handleSubmit">
                    <div class="inputbox">
                        <!--币种选择-->
                        <a-form-item class="currency" :label="$t('AddressManagement.addressbook_add_item_title1')"
                                     :colon="false" :has-feedback="currencyFeedback">
                            <a-select class="currency-select" @change="choosecurrency" @focus="setFields('currency')"
                                      v-decorator="['currencyId',
                                    {validateTrigger: 'change', rules: [{validator: checkCurrencyId}]}]">
                                <a-select-option
                                        v-for="(val, index) in currency"
                                        :key="val.curName"
                                        :value="val.curId">
                                    {{val.curName}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <!--转账地址-->
                        <a-form-item class="address" :label="$t('AddressManagement.addressbook_add_item_title2')"
                                     :colon="false" :has-feedback="addressFeedback">
                            <a-input class="address-input" @focus="setFields('address')"
                                     v-decorator="['address',
                                     {validateTrigger: 'blur', rules: [{validator: checkAddress}]}]"/>
                        </a-form-item>
                        <!--备注-->
                        <a-form-item class="remarks" :label="$t('AddressManagement.addressbook_add_item_title3')"
                                     :colon="false" :has-feedback="remarksFeedback">
                            <a-input class="remarks-input" @focus="setFields('comments')"
                                     v-decorator="['comments',
                                     {validateTrigger: 'blur', rules: [{validator: checkComments}]}]"/>
                        </a-form-item>
                    </div>
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
                                    <p class="info-name">{{$t('AddressManagement.addressbook_add_item_title1')}}：</p>
                                    <p>{{value.currencyName}}</p>
                                </div>
                                <!--转账地址-->
                                <div>
                                    <p class="info-name">{{$t('AddressManagement.addressbook_add_item_title2')}}：</p>
                                    <p>
                                        {{value.address | replacenull}}
                                        <button class="btn" @click="copytips" :data-clipboard-text="value.address">
                                            {{$t('AddressManagement.addressbook_add_btn_copy')}}
                                        </button>
                                    </p>
                                </div>
                                <!--备注-->
                                <div>
                                    <p class="info-name">{{$t('AddressManagement.addressbook_add_item_title3')}}：</p>
                                    <p>{{value.comments}}</p>
                                </div>
                                <!--创建时间-->
                                <div>
                                    <p class="info-name">{{$t('AddressManagement.addressbook_add_item_title4')}}：</p>
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
</template>

<script>
    import qrcode from '~/components/computer/QrCode'
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
        /**
         * 初始化form
         */
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
                    // 点击确认
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
        margin-bottom: 26px;

        h3 {
            font-size: 20px;
            color: rgba(0, 0, 0, 0.85);
            background: #fff;
            line-height: 60px;
            margin-bottom: 24px;
            padding: 0 0 0 32px;
        }
        .add-form {
            background: #fff;
            padding: 16px 32px;
            margin-bottom: 24px;
            .ant-form-item {
                padding-bottom: 0;
            }
            .ant-form-item-label {
                margin-bottom: 8px;
                label {
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.85);
                    line-height: 22px;
                }
            }
            .inputbox {
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                .currency {
                    margin-right: 16px;
                    .currency-select {
                        width: 140px;
                        height: 40px;
                    }
                }
                /deep/ .ant-select-selection {
                    height: 40px;
                    line-height: 40px;
                    /deep/ .ant-select-selection__rendered {
                        height: 40px;
                        line-height: 40px;
                    }
                }
                .address {
                    margin-right: 16px;
                    .address-input {
                        width: 408px;
                        height: 40px;
                    }
                }
                .remarks {
                    .remarks-input {
                        width: 254px;
                        height: 40px;
                    }
                }
            }
            .submit-box {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 0;
                .submit-button {
                    width: 168px;
                    height: 32px;
                    display: block;
                    background: #2ea9df;
                    color: #fff;
                    border: 0;
                    padding: 0;
                    cursor: pointer;
                    box-shadow: 0px 2px 2px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
                    border-radius: 4px;
                }
            }
            /deep/ .ant-form-item-required:before {
                display: none;
            }
        }
        .address-table {
            min-height: 498px;
            background: #fff;
            padding: 16px 32px 58px 32px;
            h4 {
                font-size: 16px;
                color: rgba(0, 0, 0, 0.85);
                padding-bottom: 16px;
                line-height: 24px;
                font-weight: 500;
                border-bottom: 1px solid #E9E9E9;
                margin-bottom: 0;
            }
            .address-list {
                margin-bottom: 24px;
                .address-box {
                    padding: 24px 0 16px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    border-bottom: 1px solid #E9E9E9;
                    position: relative;
                    .address-twocode {
                        width: 72px;
                        height: 72px;
                        margin-right: 16px;
                        img {
                            display: block;
                            width: 100%;
                        }
                    }
                    .address-info {
                        div {
                            margin-bottom: 8px;
                            display: flex;
                            justify-content: flex-start;
                            align-items: flex-start;
                            p {
                                color: rgba(0, 0, 0, 0.65);
                                line-height: 22px;
                                font-size: 14px;
                                margin-bottom: 0;
                                &.info-name {
                                    color: rgba(0, 0, 0, 0.85);
                                    width: auto;
                                    min-width: 80px;
                                }
                                &:nth-child(2) {
                                    width: 600px;
                                }
                                .btn {
                                    display: inline;
                                    color: #2EA9DF;
                                    margin-left: 16px;
                                    border: none;
                                    background: transparent;
                                    outline: none;
                                    cursor: pointer;
                                    line-height: 22px;
                                    font-size: 14px;
                                    padding: 0;
                                }
                            }
                            &:last-child {
                                margin-bottom: 0;
                            }
                        }
                    }
                    .delete-address {
                        position: absolute;
                        font-size: 16px;
                        bottom: 16px;
                        right: 0;
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
</style>
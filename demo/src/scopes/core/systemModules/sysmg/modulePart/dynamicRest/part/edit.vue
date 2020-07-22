<template>
  <ta-drawer destroyOnClose title="动态服务" width="500" placement="right" :closable="true" @close="closeDrawer"
             :visible="visible">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item id="sysName" label='服务名称'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="restName"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入服务名称' },{max:10,message:'不能超过10个字符'}],initialValue: dynamicData.restName}">
        <ta-input placeholder="服务名称"></ta-input>
      </ta-form-item>
      <ta-form-item
        label="服务ID"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="restId"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入服务ID' },{max:36,message:'不能超过36个字符'},{pattern:new RegExp('^[a-z0-9]*$'),message:'输入格式错误,只能有小写字母或数字'}],initialValue: dynamicData.restId}"
      >
        <ta-input placeholder="请输入服务ID"></ta-input>
      </ta-form-item>
      <ta-form-item
        label="SQL"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="sql"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入SQL' },{max:1024,message:'不能超过1024个字符'}],initialValue: dynamicData.sql}"
      >
        <ta-textarea></ta-textarea>
      </ta-form-item>
      <ta-form-item
        label="数据源"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="dsName"
        :fieldDecoratorOptions="{ initialValue: dynamicData.dsName, rules: [{ required: true, message: '请选择执行数据源' }]}"
      >
        <ta-select allowClear placeholder="请选择数据源">
          <ta-select-option v-for="item in dsList" :key="item">{{item}}</ta-select-option>
        </ta-select>
      </ta-form-item>
    </ta-form>
    <div slot="footer">
      <ta-button-group>
        <ta-button @click="form.resetFields()">重置</ta-button>
        <ta-button type="primary" @click="handleSubmit">保存</ta-button>
      </ta-button-group>
    </div>
  </ta-drawer>
</template>
<script>
    import $api from '../api/index'

    export default {
        name: 'edit',
        props: ['visible', 'rowData'],
        data() {
            return {
                form: null,
                formItemLayout: {
                    labelCol: {span: 6},
                    wrapperCol: {span: 18}
                },
                isPortal: true,
                dynamicData: {},
                // opType true => add， false => update
                op_add: true,
                // ds List
                dsList: []
            }
        },
        watch: {
            visible(val) {
                if (val) {
                    this.initForm()
                }
            }
        },
        methods: {
            initForm() {
                this.dynamicData = this.rowData
                this.queryDsList()
                if (this.dynamicData.id != null && this.dynamicData.id !== '') {
                    // it means that update
                    this.op_add = false
                }
            },
            queryDsList() {
                $api.queryDsList(this, null, data => {
                    this.dsList = data.data.dsList
                })
            },
            // handle the submit button
            handleSubmit() {
                if (this.op_add) {
                    this.save()
                } else {
                    this.update()
                }
            },
            // save
            save() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        $api.save(this, values, (data) => {
                            this.$emit('queryTable')
                            this.$message.success('新增成功')
                            this.closeDrawer()
                        })
                    }
                })
            },
            // update
            update() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        values.id = this.dynamicData.id
                        $api.update(this, values, (data) => {
                            this.$emit('queryTable')
                            this.$message.success('更新成功')
                            this.closeDrawer()
                        })
                    }
                })
            },
            // close the drawer
            closeDrawer() {
                this.$emit('close')
                this.dynamicData = {}
                this.form.resetFields()
            }
        }
    }
</script>

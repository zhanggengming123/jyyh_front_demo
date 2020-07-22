<template>
  <ta-drawer :destroyOnClose="true" width="500" :title="title" placement="right" :closable="true" @close="closeDrawer" :visible="visible">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item label="IP地址"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="node"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: 'IP地址不能为空' }], initialValue: formData.node}">
        <ta-input placeholder="请输入IP地址"/>
      </ta-form-item>
      <ta-form-item label="端口"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="port"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '端口不能为空' }], initialValue: formData.port}">
        <ta-input placeholder="请输入端口"/>
      </ta-form-item>
      <template v-if="editType == 'tomcat'">
        <ta-form-item label="部署用户名"
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      fieldDecoratorId="temp1"
                      :fieldDecoratorOptions="{ rules: [{ required: true, message: '部署用户名不能为空' }], initialValue: formData.temp}">
          <ta-input placeholder="请输入部署用户名"/>
        </ta-form-item>
        <ta-form-item label="部署密码"
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      fieldDecoratorId="temp2"
                      :fieldDecoratorOptions="{ rules: [{ required: true, message: '部署密码不能为空' }], initialValue: formData.temp}">
          <ta-input placeholder="请输入部署密码" type='password'/>
        </ta-form-item>
      </template>
      <template v-else>
        <ta-form-item label="操作系统用户名"
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      fieldDecoratorId="temp3"
                      :fieldDecoratorOptions="{ rules: [{ required: true, message: '操作系统用户名不能为空' }], initialValue: formData.temp}">
          <ta-input placeholder="请输入操作系统用户名"/>
        </ta-form-item>
        <ta-form-item label="操作系统密码"
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      fieldDecoratorId="temp4"
                      :fieldDecoratorOptions="{ rules: [{ required: true, message: '操作系统密码不能为空' }], initialValue: formData.temp}">
          <ta-input placeholder="请输入操作系统密码" type='password'/>
        </ta-form-item>
        <ta-form-item label="nginx部署目录"
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      fieldDecoratorId="temp5"
                      :fieldDecoratorOptions="{ rules: [{ required: true, message: 'nginx部署目录不能为空' }], initialValue: formData.temp}">
          <ta-input placeholder="请输入nginx部署目录"/>
        </ta-form-item>
        <ta-form-item label="部署目录端口"
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      fieldDecoratorId="temp6"
                      :fieldDecoratorOptions="{ rules: [{ required: true, message: '端口不能为空' }], initialValue: formData.temp}">
          <ta-input placeholder="请输入部署目录端口"/>
        </ta-form-item>
      </template>
      <ta-form-item label="有效标识"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="effective"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '请选择有效标识' }], initialValue: formData.effective}">
        <ta-radio-group buttonStyle="solid">
          <ta-radio-button v-for="item in CollectionData('EFFECTIVE')" :key="item.value" :value="item.value">{{item.label}}</ta-radio-button>
        </ta-radio-group>
      </ta-form-item>
      <ta-form-item label="备注"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="remarks"
                    :fieldDecoratorOptions="{ initialValue: formData.remarks}">
        <ta-textarea style="width: 100%" placeholder="请输入备注" :rows="4"/>
      </ta-form-item>
    </ta-form>
    <div slot="footer">
      <ta-button-group>
        <ta-button @click="form.resetFields()">重置</ta-button>
        <ta-button @click="fnTest">测试 <ta-icon type="loading" spin v-if="saveLoading"/></ta-button>
        <ta-button type="primary" @click="fnSave" :disabled="saveDisabled">保存</ta-button>
      </ta-button-group>
    </div>
  </ta-drawer>

</template>
<script>
import $api from '../api/index'
export default {
  name: 'editTag',
  props: ['visible', 'rowData', 'editType'],
  data () {
    return {
      formItemLayout: {
        labelCol: {span: 7},
        wrapperCol: {span: 17}
      },
      formData: {},
      saveDisabled: true,
      saveLoading: false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.setValue()
      }
    }
  },
  computed: {
    title () {
      return (this.rowData.serverId ? '编辑' : '新增') + (this.editType == 'tomcat' ? ' Tomcat 服务器' : ' Nginx 服务器')
    }
  },
  methods: {
    setValue () {
      const { serverId, node, port, effective } = this.rowData
      if (serverId == undefined) {
        this.formData = {
          effective: '1'
        }
      } else {
        this.formData = {
          serverId: serverId,
          node: node,
          port: port,
          effective: effective
        }
      }
    },
    // 提交修改或者新增应用
    fnTest () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.saveLoading = true
          setTimeout(() => {
            this.saveDisabled = false
            this.saveLoading = false
          }, 1000)
        }
      })
    },
    fnSave () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.closeDrawer()
          /*       values.effective = values.effective ? '1' : '0'
             if (this.rowData.serverId == undefined) {
               $api.addTag(values, (data) => {
                 this.$message.success('新增应用成功')
                 this.$emit('search', {})
                 this.closeDrawer()
               })
             } else {
               values.serverId = this.rowData.serverId
               $api.updateTag(values, (data) => {
                 this.$message.success('修改应用成功')
                 this.$emit('search', {})
                 this.closeDrawer()
               })
             } */
        }
      })
    },
    closeDrawer () {
      this.formData = {}
      this.saveDisabled = true
      this.saveLoading = false
      this.$emit('close')
    }
  }
}
</script>

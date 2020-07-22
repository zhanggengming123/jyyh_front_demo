<template>
  <ta-modal :visible="visible" :title="editType == 'add' ? '新增页面' : '编辑页面'" @cancel="closeModal">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item label="页面名称"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="pageName"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '页面名称不能为空' }], initialValue: formData.pageName}">
        <ta-input placeholder="请输入页面名称"/>
      </ta-form-item>
    </ta-form>
    <template slot="footer">
      <ta-button @click="closeModal">取消</ta-button>
      <ta-button type="primary" @click="fnSave">保存</ta-button>
    </template>
  </ta-modal>
</template>
<script>
import $api from '../../api/appPageRestService'
export default {
  name: 'editPage',
  props: ['visible', 'rowData', 'editType'],
  data () {
    return {
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18}
      },
      formData: {}
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.setValue()
      }
    }
  },
  methods: {
    setValue () {
      const { pageName, children, pagePid } = this.rowData
      if (this.editType == 'edit') {
        this.formData = {
          pageName: pageName
        }
      } else {
        let index = (children && children.length) ? parseInt(children[children.length - 1].pageIndex) + 1 : 0
        if (pagePid == '0') {
          this.formData = {
            pageName: 'page' + (index + 1),
            pageIndex: index
          }
        } else {
          this.formData = {
            pageName: pageName + '-' + (index + 1),
            pageIndex: index
          }
        }
      }
    },
    // 提交修改或者新增页面
    fnSave () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.editType == 'add') {
            const {appId, pageId} = this.rowData
            values.appId = appId
            values.pagePid = pageId
            values.pageType = '3'
            values.pageIndex = this.formData.pageIndex
            $api.addAppPage(values, (data) => {
              values.pageId = data.data.pageId
              this.$message.success('新增成功')
              this.closeModal('add', values)
            })
          } else {
            values.pageId = this.rowData.pageId
            $api.updateAppPageByVo(values, (data) => {
              this.$message.success('修改成功')
              this.closeModal('edit', values)
            })
          }
        }
      })
    },
    closeModal (type, data) {
      this.formData = {}
      this.form.resetFields()
      this.$emit('close', type, data)
    }
  }
}
</script>

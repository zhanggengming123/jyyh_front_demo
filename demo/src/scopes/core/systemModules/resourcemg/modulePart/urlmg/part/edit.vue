<template>
  <ta-drawer destroyOnClose title="动态服务" width="500" placement="right" :closable="true" @close="closeDrawer" :visible="visible">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item id="name" label='名称'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="name"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入名称' },{max:90,message:'不能超过90个字符'}],initialValue: urlData.name}">
        <ta-input placeholder="名称"></ta-input>
      </ta-form-item>
      <ta-form-item
        label="URL"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="url"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入URL' },{max:200,message:'不能超过200个字符'},{ pattern: /^[^\u4e00-\u9fa5]+$/, message: 'URL不允许出现中文'}],initialValue: urlData.url}"
      >
        <ta-input placeholder="请输入URL"></ta-input>
      </ta-form-item>
      <ta-form-item
        v-if="opBody=='1'"
        label="命名空间"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        fieldDecoratorId="namespaceName"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入' },{max:1024,message:'不能超过1024个字符'}],initialValue: urlData.namespaceName}"
      >
        <ta-input :disabled="true"></ta-input>
      </ta-form-item>
      <!--  <ta-form-item
         label="数据源"
         :labelCol="formItemLayout.labelCol"
         :wrapperCol="formItemLayout.wrapperCol"
         fieldDecoratorId="dsName"
         :fieldDecoratorOptions="{ initialValue: dynamicData.dsName, rules: [{ required: true, message: '请选择执行数据源' }]}"
       >
         <ta-select allowClear placeholder="请选择数据源">
           <ta-select-option v-for="item in dsList" :key="item">{{item}}</ta-select-option>
         </ta-select>
       </ta-form-item>-->
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
  data () {
    return {
      form: null,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      isPortal: true,
      urlData: {},
      // opType true => add， false => update
      op_add: true,
      // op body -- 0 => namespace ,1 => rest url
      opBody: '1'
      // ds List
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.initForm()
      }
    }
  },
  methods: {
    initForm () {
      this.urlData = this.rowData
      // this.queryDsList()
      if (this.urlData.id != null && this.urlData.id !== '') {
        // it means that update
        this.op_add = false
        if (this.urlData.namespaceName == '' || this.urlData.namespaceName == null) {
          this.urlData.namespaceName = '无'
        }
        this.opBody = this.urlData.type
      } else {
        // it means that add
        this.op_add = true
        if (this.urlData.namespace != null && this.urlData.namespace !== '') {
          this.opBody = '1'
        } else {
          this.opBody = '0'
        }
      }
    },

    // handle the submit button
    handleSubmit () {
      if (this.op_add) {
        this.save()
      } else {
        this.update()
      }
    },
    // save
    save () {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.namespace = this.urlData.namespace
          $api.saveUrl(values, (data) => {
            this.$emit('searchUrl')
            this.$message.success('新增成功')
            this.closeDrawer()
          })
        }
      })
    },
    // update
    update () {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.id = this.urlData.id
          $api.updateUrl(values, (data) => {
            this.$emit('searchUrl')
            this.$message.success('更新成功')
            this.closeDrawer()
          })
        }
      })
    },
    // close the drawer
    closeDrawer () {
      this.$emit('close')
      this.urlData = {}
      this.form.resetFields()
    }
  }
}
</script>

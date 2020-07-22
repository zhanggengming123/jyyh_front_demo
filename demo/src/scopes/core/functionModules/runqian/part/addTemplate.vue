<template>
  <div>
    <!--右侧弹出框添加修改组织信息-->
    <ta-drawer :title="editType == '1'? '新增报表':'编辑报表'" width="500" placement="right" :closable="true" @close="closeEdit" :visible="visible" destroyOnClose>
      <ta-form :autoFormCreate="(form)=>{this.form = form}">
        <ta-form-item
          label='父报表标志'
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
          fieldDecoratorId="parentraqfilename"
          v-if="raqType == '2'"
          :fieldDecoratorOptions="{initialValue: record.parentraqfilename?record.parentraqfilename:'' }"
        >
          <ta-input disabled/>
        </ta-form-item>
        <ta-form-item
          label='报表类型'
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
          fieldDecoratorId="raqType"
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择报表类型' }],initialValue: raqType}"
        >
          <ta-select style="width: 100%"  placeholder="请选择报表类型" disabled >
            <ta-select-option v-for="item in  CollectionData('RAQTYPE')" :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
          </ta-select>
        </ta-form-item>
        <ta-form-item
          label='资源文件'
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
           fieldDecoratorId="raqSrc"
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择报表文件' }]}"
        >
          <ta-button><ta-icon type="upload" /> 上传<input type="file" class="upload-btn" ref="file" @change="fnChooseFile"/></ta-button>
        </ta-form-item>
        <ta-form-item
          label='是否公用'
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
          fieldDecoratorId="yab109"
        >
          <ta-checkbox :checked="checkAll" value="com"> </ta-checkbox>
        </ta-form-item>
        <ta-form-item
          label='报表标志'
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
          fieldDecoratorId="raqfilename"
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请填写报表标志' }],initialValue: record.raqfilename?record.raqfilename:'' }"
        >
          <ta-input :disabled="editType == '2'" />
        </ta-form-item>
        <ta-form-item
          label='报表名称'
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
          fieldDecoratorId="raqname"
          :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入报表名称' }],initialValue: record.raqname?record.raqname:''}"
        >
          <ta-input />
        </ta-form-item>
      </ta-form>
      <div slot="footer">
        <ta-button-group>
          <ta-button>重置</ta-button>
          <ta-button type="primary" @click="submitAddForm()" v-if="editType == '1'">保存</ta-button>
          <ta-button type="primary" @click="submitEditForm()" v-if="editType != '1'">保存</ta-button>
        </ta-button-group>
      </div>
    </ta-drawer>
  </div>
</template>
<script>
import $api from '../api/index'
export default {
  name: 'addTemplate',
  props: {
    visible: {
      type: Boolean
    },
    editType: {
      type: String
    },
    raqType: {
      type: String,
      default: ''
    },
    record: {
      type: Object
    }
  },
  data () {
    return {
      form: null,
      checkAll: true,
      formItemLayout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } }
    }
  },
  methods: {
    closeEdit () {
      this.$emit('close')
    },
    fnChooseFile (e) {
      let obj = event.srcElement ? event.srcElement : event.target
      let fileName = obj.files[0].name

      let suffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length)
      if (suffix != 'raq') {
        this.$message.warning('请选择.raq结尾的报表文件')
        this.$refs.file.value = ''
        return
      }
      this.form.setFieldsValue({
        raqname: fileName
      })
    },
    submitEditForm () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = this.form.getFieldsValue()
          let file = this.$refs.file.files[0]
          if (file != null && file != undefined) {
            let fileName = file.name
            let suffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length)
            if (suffix != 'raq') {
              this.$message.warning('请选择.raq结尾的报表文件')
              this.$refs.file.value = ''
              return
            }
            formData.theFile = file
          } else {
            this.$message.warning('请选择报表文件')
            return
          }
          $api.editRunqianResource(formData, (result) => {
            this.$message.success('编辑成功')
            this.$emit('close')
          })
        }
      })
    },
    submitAddForm () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = this.form.getFieldsValue()
          let file = this.$refs.file.files[0]
          if (file == null || file == undefined) {
            this.$message.warning('请选择报表文件')
            return
          }
          let fileName = file.name
          let suffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length)
          if (suffix != 'raq') {
            this.$message.warning('请选择.raq结尾的报表文件')
            this.$refs.file.value = ''
            return
          }
          formData.theFile = file
          $api.addRunqianResource(formData, (result) => {
            this.$message.success('新增成功')
            this.$emit('close')
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped type="text/less">
  .upload-btn { position: absolute; cursor: pointer; left: 0; top: 0; right: 0; bottom: 0; width: 80px; opacity: 0; background: transparent; }
</style>

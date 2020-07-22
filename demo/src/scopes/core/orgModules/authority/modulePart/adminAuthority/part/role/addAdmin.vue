<template>
  <div>
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item label="角色名称"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="roleName"
                    :initValue="formData.roleName"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '角色名称不能为空' },,{ max: 50, message: '角色名称最大长度为50' }]}">
        <ta-input placeholder="请输入角色名称"/>
      </ta-form-item>

      <ta-form-item label='所属组织'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="orgId"
                    :require="{message:'请选择所属组织'}"
                    :fieldDecoratorOptions="{initialValue: formData.idPath}">
        <ta-cascader
          :url="casCaderOrgUrl"
          treeId="orgVos"
          :options.sync="options"
          expandTrigger="hover"
          :showSearch="{filter}"
          @change="onChange"
          :changeOnSelect="true"
          :fieldNames="{ label: 'orgName', value: 'orgId', children: 'children' }"
          placeholder="请选择组织机构"/>
      </ta-form-item>

      <ta-form-item label="有效期"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    :initValue="formData.effectiveTime"
                    fieldDecoratorId="effectiveTime">
        <ta-date-picker format="YYYY-MM-DD" allowClear style="width: 100%" placeholder="请选择有效时间"
                        :disabledDate="disabledDate"/>
      </ta-form-item>

      <ta-form-item label="有效标识"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="effective"
                    :fieldDecoratorOptions="{initialValue: formData.effective,valuePropName: 'checked'}">
        <ta-switch checkedChildren="启用" unCheckedChildren="禁用"/>
      </ta-form-item>

      <ta-form-item label="角色描述"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="roleDesc"
                    :initValue="formData.roleDesc"
                    :fieldDecoratorOptions="{rules: [{ max: 50, message: '角色描述最大长度为50' }]}"
      >
        <ta-textarea :rows="4" placeholder="角色描述"/>
      </ta-form-item>
    </ta-form>
  </div>
</template>

<script>

import moment from 'moment'
import $api from '../../api/index'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'addAdmin',
  props: ['admin'],
  data () {
    return {
      casCaderOrgUrl: 'org/authority/adminAuthorityManagementRestService/queryCurrentAdminRoleWrapOrgTree', // 组织级联选择框
      options: [],
      formData: {},
      formItemLayout
    }
  },
  mounted: function () {
    const { type, roleObj } = this.admin
    // 如果是编辑的话,则进行初始化处理
    if (type == 'edit') {
      this.formData = { ...roleObj }
      this.formData.idPath = roleObj.idPath.split('/')
      this.formData.effective = roleObj.effective == '1'
      this.formData.roleDesc = roleObj.roleDesc || ''
      this.formData.effectiveTime = roleObj.effectiveTime ? moment(roleObj.effectiveTime, 'YYYY-MM-DD') : null
    } else {
      // 如果是新增的话,默认是启用的
      this.formData.effective = true
    }
  },
  methods: {
    moment,
    // 重置表单
    fnResetForm () {
      this.fnInitForm()
    },
    // 添加或者修改管理员信息
    fnAddAdminInfo () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const self = this
          const { type, roleObj } = this.admin
          const reqData = self.form.getFieldsValue()
          reqData.effective = reqData.effective ? '1' : '0'
          const orgIds = self.form.getFieldValue('orgId')
          let orgId = !orgIds || orgIds.length === 0 ? null : orgIds[orgIds.length - 1]

          if (type === 'edit' && !orgId) { // 如果是编辑并且为null,则使用原组织的orgId
            orgId = roleObj.orgId
          }
          reqData.orgId = orgId
          const time = self.form.getFieldValue('effectiveTime')
          if (time) {
            reqData.effectiveTime = time.format('YYYY-MM-DD') + ' 23:59:59'
          } else {
            reqData.effectiveTime = null
          }
          if (type === 'add') {
            $api.addAdminRole(reqData, data => {
              self.$message.success('新增角色成功')
              self.$emit('closeAdminDrawer')
            })
          } else {
            reqData.roleType = roleObj.roleType
            reqData.roleId = roleObj.roleId
            $api.updateAdmin(reqData, data => {
              self.$message.success('修改角色成功')
              self.$emit('closeAdminDrawer', reqData)
            })
          }
        }
      })
    },
    // 初始化表单
    fnInitForm () {
      this.form.resetFields()
    },
    // 禁用时间,不能选择比当前时间小的日期
    disabledDate (current) {
      return current && current < (moment().endOf('day'))
    },
    // 过滤组织
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    // 数据改变发生
    onChange (value, selectedOptions) {
      if (selectedOptions && selectedOptions[selectedOptions.length - 1].isAuthority == '0') {
        this.$message.error('没有权限在该组织下操作角色')
        this.$nextTick(() => {
          this.form.resetFields(`orgId`)
        })
      }
    }

  }
}
</script>

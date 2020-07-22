<template>
  <ta-form :autoFormCreate="(form)=>{this.form = form}">
    <ta-form-item label="角色名称"
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="roleName"
                  :fieldDecoratorOptions="{ rules: [{ required: true, message: '角色名称不能为空' }]}">
      <ta-input placeholder="请输入角色名称"/>
    </ta-form-item>

    <ta-form-item label='所属组织'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="orgId"
                  :fieldDecoratorOptions="type==='add'?{rules: [{ required: true, message: '请选择所属组织' }]}:null">
      <ta-cascader
        :url="casCaderOrgUrl"
        treeId="orgVos"
        :options.sync="options"
        :changeOnSelect="true"
        :fieldNames="{ label: 'orgName', value: 'orgId', children: 'children' }"
        :placeholder="orgPlaceholder"/>
    </ta-form-item>

    <ta-form-item label="有效期"
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="effectiveTime">
      <ta-date-picker format="YYYY-MM-DD" allowClear style="width: 100%" placeholder="请选择有效时间"
                      :disabledDate="disabledDate"/>
    </ta-form-item>

    <ta-form-item label="有效标识"
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="effective">
      <ta-switch checkedChildren="启用" unCheckedChildren="禁用" v-model="effective"/>
    </ta-form-item>

    <ta-form-item label="角色描述"
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="roleDesc">
      <ta-textarea :rows="4" placeholder="角色描述"/>
    </ta-form-item>
  </ta-form>
</template>

<script>

import moment from 'moment'
import $api from '../../api/index'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'addRole',
  props: ['role'],
  data () {
    return {
      casCaderOrgUrl: 'org/authority/examinerAuthorityRestService/queryOrgTreeByAsync', // 组织级联选择框
      options: [],
      formItemLayout,
      orgOptions: [], // 级联组织选择
      effective: true,
      roleId: '', // 角色id
      type: '', // 打开类型
      orgId: '', // 组织id
      orgPlaceholder: '请选择组织', // 组织提示框
      effectiveTime: ''
    }
  },
  created () {
    this.roleId = this.role.roleId ? this.role.roleId : null
    this.orgId = this.role.orgId ? this.role.orgId : null
    this.type = this.role.type
  },
  mounted: function () {
    this.fnInitForm()
  },
  methods: {
    moment,
    // 重置表单
    fnResetForm () {
      this.fnInitForm()
    },
    // 添加或者修改审核信息
    fnAddRoleInfo () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const self = this
          const effective = self.effective ? '1' : '0'
          const reqData = self.form.getFieldsValue()
          reqData.effective = effective
          const orgIds = self.form.getFieldValue('orgId')
          let orgId = !orgIds || orgIds.length === 0 ? null : orgIds[orgIds.length - 1]

          if (self.type === 'edit' && !orgId) { // 如果是编辑并且为null,则使用原组织的orgId
            orgId = self.orgId
          }
          reqData.orgId = orgId
          let time = self.form.getFieldValue('effectiveTime')
          if (time) {
            reqData.effectiveTime = time.format('YYYY-MM-DD') + ' 23:59:59'
          } else {
            reqData.effectiveTime = null
          }
          const type = this.type
          if (type === 'add') {
            $api.addExaminer(reqData, data => {
              self.$message.success('新增角色成功')
              self.$emit('closeRoleDrawer')
            })
          } else {
            reqData.roleType = self.role.roleType
            reqData.roleId = self.roleId
            $api.updateExaminer(reqData, data => {
              self.$message.success('修改角色成功')
              self.$emit('closeRoleDrawer', reqData)
            })
          }
        }
      })
    },
    // 初始化表单
    fnInitForm () {
      const effective = !this.role.effective ? true : this.role.effective === '1'
      const type = this.type
      if (type === 'edit') {
        this.orgPlaceholder = type === 'add' ? '请选择组织路径' : this.role.namePath
        const time = this.role.effectiveTime
        if (time) {
          this.form.setFieldsValue({
            effectiveTime: moment(new Date(time), 'YYYY/MM/DD HH:mm:ss')
          })
        }
        this.form.setFieldsValue({
          roleName: this.role.roleName,
          roleDesc: this.role.roleDesc,
          orgId: []
        })
      }
      this.effective = effective
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
      if (selectedOptions && selectedOptions[selectedOptions.length - 1].isAuthority === '0') {
        this.$message.error('没有权限在该组织下新增角色')
        this.form.setFieldsValue({
          orgId: []
        })
      }
    }
  }
}
</script>

<template>
  <ta-form :autoFormCreate="(form)=>{this.form = form}">
    <ta-form-item
      label='角色名称'
      fieldDecoratorId="roleName"
      :fieldDecoratorOptions="{initialValue: formData.roleName, rules: [{ required: true, message: '请输入角色名称' },{ max: 50, message: '角色名称最大长度为50' }]}"
    >
      <ta-input placeholder='请输入角色名称'/>
    </ta-form-item>
    <ta-form-item
      label='所属组织'
      fieldDecoratorId="orgId"
      :require="{message:'请选择所属组织'}"
      :fieldDecoratorOptions="{initialValue: formData.idPath}"
      style="margin-bottom: 0"
    >
      <ta-cascader
        :options.sync="orgOptions"
        :showSearch="{filter}"
        @change="onChange"
        changeOnSelect
        placeholder="请选择组织机构"
        expandTrigger="hover"
        class="vertical-space cascader-box"
        :fieldNames="{label:'orgName',value:'orgId',children:'children'}"
        url="org/authority/roleAuthorityManagementRestService/queryCurrentAdminRoleWrapeOrgTree"
        treeId="orgVos"
      />
    </ta-form-item>
    <ta-form-item
      :wrapperCol="{ span: 18, offset: 6 }"
      fieldDecoratorId="subordinate"
      :fieldDecoratorOptions="{initialValue: formData.subordinate, valuePropName: 'checked'}"
    >
      <ta-checkbox>
        可分配该角色到子组织人员
      </ta-checkbox>
    </ta-form-item>
    <ta-form-item
      label="有效期"
      fieldDecoratorId="effectiveTime"
      :fieldDecoratorOptions="{initialValue: formData.effectiveTime}"
    >
      <ta-date-picker style="width: 100%" format="YYYY-MM-DD" :valid-now-time="'left'"/>
    </ta-form-item>
    <ta-form-item
      label="角色标识"
      fieldDecoratorId="roleSign"
      :fieldDecoratorOptions="{initialValue: formData.roleSign}"
    >
      <ta-select placeholder='请选择角色标识'>
        <ta-select-option
          v-for="item in CollectionData('ROLESIGN')"
          :key="item.value"
          :value="item.value">
          {{item.label}}
        </ta-select-option>
      </ta-select>
    </ta-form-item>
    <ta-form-item
      label="角色描述"
      fieldDecoratorId="roleDesc"
      :fieldDecoratorOptions="{initialValue: formData.roleDesc, rules: [{ max: 50, message: '角色描述最大长度为50' }]}"
    >
      <ta-textarea :rows="4" placeholder='请选择角色描述'/>
    </ta-form-item>
  </ta-form>
</template>
<script>
import moment from 'moment'
import $api from '../../api/index'
export default {
  name: 'newRole',
  props: ['updateObj'],
  data () {
    return {
      orgOptions: [],
      formData: {}
    }
  },
  mounted () {
    const { isUpdate, roleObj } = this.updateObj
    if (isUpdate) {
      this.formData = { ...roleObj }
      this.formData.idPath = roleObj.idPath.split('/')
      this.formData.subordinate = roleObj.subordinate == '1'
      this.formData.roleDesc = roleObj.roleDesc || ''
      this.formData.effectiveTime = roleObj.effectiveTime ? moment(roleObj.effectiveTime, 'YYYY-MM-DD HH:mm:ss') : null
    }
  },
  methods: {
    moment,
    fnResetForm () {
      this.form.resetFields()
    },
    onChange (value, selectedOptions) {
      if (selectedOptions && selectedOptions[selectedOptions.length - 1].isAuthority == '0') {
        this.$message.error('没有权限在该组织下操作角色')
        this.$nextTick(() => {
          this.form.resetFields(`orgId`)
        })
      }
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    loadOrgTree () {
      $api.queryCurrentAdminRoleWrapeOrgTree({}, (data) => {
        this.orgOptions = data.data.orgVos
      })
    },
    fnNewRole () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const casValue = values.orgId
          values.orgId = casValue ? casValue[casValue.length - 1] : ''
          values.subordinate = values.subordinate ? '1' : '0'
          values.roleType = '01'
          values.effectiveTime = values.effectiveTime ? values.effectiveTime.format('YYYY-MM-DD') + ' 23:59:59' : ''
        }
        $api.addRole(this.form, { ...values, effective: '1' }, (data) => {
          this.$message.success('新增角色成功')
          this.$emit('fnQueryRolesByOrgId')
          this.$emit('onNewRoleClose')
        })
      })
    },
    fnUpdateRole () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const casValue = values.orgId
          values.orgId = casValue ? casValue[casValue.length - 1] : ''
          let editFlag = false
          const keys = Object.keys(values)
          for (let i = 0; i < keys.length; i++) {
            if (values[keys[i]] != this.formData[keys[i]]) {
              editFlag = true; break
            }
          }
          if (editFlag) {
            values.subordinate = values.subordinate ? '1' : '0'
            values.roleType = '01'
            values.effectiveTime = values.effectiveTime ? values.effectiveTime.format('YYYY-MM-DD') + ' 23:59:59' : ''
            $api.updateRoleByRoleId(this.form, { roleId: this.updateObj.roleObj.roleId, ...values, effective: '1' }, (data) => {
              this.$message.success('修改角色成功')
              this.$emit('fnQueryRolesByOrgId')
              this.$emit('onNewRoleClose')
            })
          } else {
            this.$message.warning('没有需要保存的修改')
          }
        }
      })
    },
    fnAddOrUpdateRole () {
      if (this.updateObj.isUpdate) {
        this.fnUpdateRole()
      } else {
        this.fnNewRole()
      }
    }
  }
}
</script>

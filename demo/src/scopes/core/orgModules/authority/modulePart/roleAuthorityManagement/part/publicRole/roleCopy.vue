<template>
  <div id="roleCopy" class="fit">
    <ta-row class="fit">
      <ta-col :span="12" class="fit">
        <ta-border-layout :layout="{header:'50px'}" style="border-right-width: 7px;">
          <template slot="header">{{this.roleObj.roleName}}下的权限</template>
          <ta-tabs defaultActiveKey="1" class="fit">
            <ta-tab-pane tab="功能菜单权限" key="1" style="padding-top: 10px">
              <ta-table :columns="menuAuthorityColumns" :dataSource="menuAuthorityData" defaultExpandAllRows size="small" :pagination="false"></ta-table>
            </ta-tab-pane>
            <ta-tab-pane tab="自定义对象权限" key="2" style="padding-top: 10px">
              <ta-table :columns="customAuthorityColumns" :dataSource="customAuthorityData" defaultExpandAllRows size="small" :pagination="false"></ta-table>
            </ta-tab-pane>
          </ta-tabs>
        </ta-border-layout>
      </ta-col>
      <ta-col :span="12" class="fit">
        <ta-border-layout :layout="{header:'50px'}" style="border-left-width: 7px;">
          <template slot="header">复制的新角色信息</template>
          <ta-form :autoFormCreate="(form)=>{this.form = form}" style="padding-top: 10px;">
            <ta-form-item
              label='新名称'
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              fieldDecoratorId="newRoleName"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入角色名称' }]}"
            >
              <ta-input/>
            </ta-form-item>
            <ta-form-item
              label='目标组织'
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              fieldDecoratorId="orgId"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择目标组织' }]}"
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
          </ta-form>
        </ta-border-layout>
      </ta-col>
    </ta-row>
  </div>
</template>

<script>
import $api from '../../api/index'

const menuAuthorityColumns = [{
  title: '功能名称',
  dataIndex: 'resourceName'
}, {
  title: '有效期',
  dataIndex: 'effectTime',
  customRender: (text) => {
    return text ? text.split(' ')[0] : '永久'
  }
}]

const customAuthorityColumns = [{
  title: '功能名称',
  dataIndex: 'resourceName'
}, {
  title: '有效期',
  dataIndex: 'effectTime',
  customRender: (text) => {
    return text ? text.split(' ')[0] : '永久'
  }
}]

export default {
  name: 'roleCopy',
  props: ['roleObj', 'orgTreeData'],
  data () {
    return {
      orgOptions: this.orgTreeData,
      menuAuthorityColumns,
      menuAuthorityData: [],
      customAuthorityColumns,
      customAuthorityData: [],
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18}
      }
    }
  },
  mounted () {
    this.fnQueryAuthorityByRoleId()
    this.fnQueryCustomUsePermissionByRoleId()
  },
  methods: {
    onChange (value, selectedOptions) {
      if (selectedOptions && selectedOptions[selectedOptions.length - 1].isAuthority == '0') {
        this.$message.error('没有权限在该组织下新增角色')
        this.$nextTick(() => {
          this.form.resetFields(`orgId`)
        })
      }
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    fnSave () {
      let newRoleName = this.form.getFieldValue('newRoleName'), orgIds = this.form.getFieldValue('orgId')
      let param = {
        roleId: this.roleObj.roleId,
        roleName: newRoleName,
        orgId: orgIds ? orgIds[orgIds.length - 1] : null
      }
      $api.copyRole(this.form, param, (data) => {
        if (data.serviceSuccess) {
          this.$message.success('角色复制成功')
          this.$emit('fnQueryRolesByOrgId')
        } else {
          this.$message.error('角色复制失败')
        }
      })
    },
    fnQueryAuthorityByRoleId () {
      $api.queryUsePermissionByRoleId({roleId: this.roleObj.roleId}, (data) => {
        this.menuAuthorityData = data.data.usePermissionPos
      })
    },
    fnQueryCustomUsePermissionByRoleId () {
      $api.queryCustomUsePermissionByRoleId({roleId: this.roleObj.roleId}, (data) => {
        this.customAuthorityData = data.data.customUsePermissionPos
      })
    }
  }
}
</script>

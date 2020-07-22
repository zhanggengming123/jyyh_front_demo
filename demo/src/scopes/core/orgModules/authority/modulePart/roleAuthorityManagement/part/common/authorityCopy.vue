<template>
  <div id="authrityCopy" class="fit">
    <ta-row class="fit">
      <ta-col :span="12" class="fit">
        <ta-border-layout :layout="{header:'50px'}" style="border-right-width: 7px;">
          <template slot="header">{{this.roleObj.roleName}}下的权限</template>
          <ta-tabs defaultActiveKey="1" class="fit">
            <ta-tab-pane tab="功能菜单权限" key="1" style="padding-top: 10px">
              <ta-table :columns="menuAuthorityColumns"
                        :dataSource="menuAuthorityData"
                        defaultExpandAllRows
                        size="small"
                        :pagination=false>
              </ta-table>
            </ta-tab-pane>
            <ta-tab-pane tab="自定义对象权限" key="2" style="padding-top: 10px">
              <ta-table :columns="customAuthorityColumns"
                        :dataSource="customAuthorityData"
                        defaultExpandAllRows
                        size="small"
                        :pagination=false>
              </ta-table>
            </ta-tab-pane>
          </ta-tabs>
        </ta-border-layout>
      </ta-col>
      <ta-col :span="12" class="fit">
        <ta-border-layout :layout="{header:'50px'}" style="border-left-width: 7px;">
          <template slot="header">权限复制的目标角色</template>
          <ta-form :autoFormCreate="(form)=>{this.form = form}" style="padding-top: 10px">
            <ta-form-item
              label='目标角色'
              :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 16 }"
              fieldDecoratorId="targetRole"
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择目标角色' }]}"
            >
              <ta-input-search
                ref="targetRoleInput"
                placeholder="请选择目标角色"
                @focus="handleShwoRolePanel"
                @search="isUserShow = true"
              />
            </ta-form-item>
          </ta-form>
        </ta-border-layout>
      </ta-col>
    </ta-row>
    <ta-user-select title="目标角色选择"
                    :is-show="isUserShow"
                    include-child-title="包含子部门下角色"
                    @close="handleClose"
                    :user-tree-data="orgOptions"
                    :user-list-data="roleListData"
                    :defaultUserList="defaultUserList"
                    @queryUserList="fnQueryRoleList"
                    :props="selectRoleProps"
                    :is-multi=true
                    @getUserListResult="fnGetRoleListResult"
                    id="targetRoleSelect"
                    :load="loadNode"
                    :is-select="false"
                    :pagination="true"
    >
    </ta-user-select>
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
  name: 'authorityCopy',
  props: ['roleObj'],
  data () {
    return {
      roleListData: [],
      orgOptions: [],
      defaultUserList: [],
      isUserShow: false,
      menuAuthorityColumns,
      menuAuthorityData: [],
      customAuthorityColumns,
      customAuthorityData: [],
      targetRoleIds: '',
      selectRoleProps: {
        treeNodeKey: 'value', // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
        treeLabel: 'label', // 树节点的属性名称
        treeChildren: 'children', // 树子节点对象的属性名称
        listKey: 'roleId', // 每条用户信息的唯一标识（默认：userId）
        listTitle: 'roleName', // 用户信息第一行显示内容
        listSubTitle: 'mobile', // 用户信息第二行显示内容
        listDescription: 'namePath' // 用户信息鼠标移上去显示描述信息
      }
    }
  },
  mounted () {
    this.fnQueryAuthorityByRoleId()
    this.fnQueryCustomUsePermissionByRoleId()
  },
  methods: {
    handleShwoRolePanel () {
      this.$refs['targetRoleInput'].blur()
      this.isUserShow = true
    },
    handleClose () {
      this.isUserShow = false
    },
    loadNode (node, resolve) {
      $api.queryCurrentAdminRoleWrapeOrgTree({ orgId: node.data ? node.data.value : null }, (data) => {
        resolve(data.data.orgVos)
      })
    },
    fnGetRoleListResult (data) {
      const roleNameArry = []
      const roleIdArry = []
      data.forEach((value, index) => {
        roleNameArry.push(value.roleName)
        roleIdArry.push(value.roleId)
      })
      this.defaultUserList = data
      this.form.setFieldsValue({
        targetRole: roleNameArry.join(',')
      })
      this.targetRoleIds = roleIdArry.join(',')
    },
    fnQueryRoleList (id, includeChild, pageNum) {
      const param = {
        pageNumber: pageNum,
        pageSize: 10,
        orgId: id,
        isSub: includeChild,
        roleType: this.roleObj.roleType
      }
      $api.queryAuthRole(param, (data) => {
        this.roleListData = data.data.pageBean.list
      })
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    fnSave () {
      const param = {
        sourceRoleId: this.roleObj.roleId,
        targetRoleIds: this.targetRoleIds
      }
      $api.copyResource(this.form, param, (data) => {
        if (data.serviceSuccess) {
          this.$message.success('权限复制成功')
        } else {
          this.$message.error('权限复制失败')
        }
      })
    },
    fnQueryAuthorityByRoleId () {
      $api.queryUsePermissionByRoleId({ roleId: this.roleObj.roleId }, (data) => {
        this.menuAuthorityData = data.data.usePermissionPos
      })
    },
    fnQueryCustomUsePermissionByRoleId () {
      $api.queryCustomUsePermissionByRoleId({ roleId: this.roleObj.roleId }, (data) => {
        this.customAuthorityData = data.data.customUsePermissionPos
      })
    }
  }
}
</script>

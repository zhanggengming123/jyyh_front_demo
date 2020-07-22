<template>
  <ta-drawer title="权限复制" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
  <div class="fit">
    <ta-row class="fit">
        <ta-border-layout :layout="{header:'70px'}" style="border-right-width: 7px;">
          <template slot="header">
            <div>原角色：<strong>{{sourceRoleName}}</strong></div>
            <div> 目标角色：<strong>{{targetRoleName}}</strong></div>
          </template>
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
    </ta-row>
  </div>

  </ta-drawer>
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
  name: 'showCopyResource',
  props: ['visible', 'rowData'],
  data () {
    return {
      menuAuthorityColumns,
      menuAuthorityData: [],
      customAuthorityColumns,
      customAuthorityData: [],
      sourceRoleName: '',
      targetRoleName: ''
    }
  },

  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          this.sourceRoleName = result.data.before['sourceRoleName']
          this.targetRoleName = result.data.before['targetRoleName']
          const sourceRoleId = result.data.before['sourceRoleId']
          this.fnQueryAuthorityByRoleId(sourceRoleId)
          this.fnQueryCustomUsePermissionByRoleId(sourceRoleId)
        })
      }
    }
  },
  methods: {
    closeDrawer () {
      this.menuAuthorityData = []
      this.customAuthorityData = []
      this.$emit('close')
    },
    fnQueryAuthorityByRoleId (sourceRoleId) {
      $api.queryUsePermissionByRoleId({ roleId: sourceRoleId }, (data) => {
        this.menuAuthorityData = data.data.usePermissionPos
      })
    },
    fnQueryCustomUsePermissionByRoleId (sourceRoleId) {
      $api.queryCustomUsePermissionByRoleId({ roleId: sourceRoleId }, (data) => {
        this.customAuthorityData = data.data.customUsePermissionPos
      })
    }
  }
}
</script>

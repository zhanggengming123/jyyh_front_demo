<template>
  <ta-drawer title="权限代理" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
  <div class="fit">
    <ta-row class="fit">
        <ta-border-layout :layout="{header:'70px'}" style="border-right-width: 7px;">
          <template slot="header">
            <div>代理角色名称：<strong>{{delegateUser}}</strong></div>
            <div>委派截止日期：<strong>{{delegateExpireDate}}</strong></div>
          </template>
          <ta-tabs defaultActiveKey="1" class="fit">
            <ta-tab-pane tab="功能菜单权限" key="1" style="padding-top: 10px">
              <ta-table :columns="menuAuthorityColumns"
                        :dataSource="repermissionsData"
                        defaultExpandAllRows
                        size="small"
                        :pagination=false>
              </ta-table>
            </ta-tab-pane>
            <ta-tab-pane tab="授权对象权限" key="2" style="padding-top: 10px">
              <ta-table :columns="customAuthorityColumns"
                        :dataSource="customRepermissionsData"
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
}]

const customAuthorityColumns = [{
  title: '功能名称',
  dataIndex: 'resourceName'
}]

export default {
  name: 'showAgentAuthority',
  props: ['visible', 'rowData'],
  data () {
    return {
      menuAuthorityColumns,
      repermissionsData: [],
      customAuthorityColumns,
      customRepermissionsData: [],
      delegateUser: '',
      delegateExpireDate: ''
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          this.delegateUser = result.data.after['delegateUser']
          this.delegateExpireDate = result.data.after['delegateExpireDate']
          const sourceRoleId = result.data.after['sourceRoleId']
          this.repermissionsData = result.data.after['repermissions']
          this.customRepermissionsData = result.data.after['customRepermissions']
        })
      }
    }
  },
  methods: {
    closeDrawer () {
      this.repermissionsData = []
      this.customRepermissionsData = []
      this.$emit('close')
    }
  }
}
</script>

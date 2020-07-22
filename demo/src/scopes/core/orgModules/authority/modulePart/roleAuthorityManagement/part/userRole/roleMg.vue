<template>
  <div id="roleMg" class="fit">
    <ta-border-layout :layout="{header:'55px', footer: '70px'}" :footer-cfg="{showBorder: false}">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBack">人员维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>角色管理</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>
      <ta-alert :message="'当前人员为：'+currentUser.name" type="info" showIcon class="notice-box"/>
      <ta-tabs class="fit content-box">
        <ta-tab-pane tab="人员下角色">
          <ta-table :columns="roleColumns"
                    :dataSource="roleData"
                    :pagination=false
                    :rowSelection="{selectedRowKeys: selectedRolesKeys, onChange: onSelectRoleChange}"
          >
            <span slot="roleSign" slot-scope="text">{{CollectionLabel('ROLESIGN',text)}}</span>
            <span slot="effective" slot-scope="text">{{CollectionLabel('STATE',text)}}</span>
          </ta-table>
        </ta-tab-pane>
        <template slot="tabBarExtraContent">
          <ta-button @click="fnBack"><ta-icon type="rollback"></ta-icon> 返回</ta-button>
          <ta-button @click="fnAssociateRole" type="primary">分配角色</ta-button>
          <ta-popconfirm title="确认删除选择的角色？" @confirm="fnDelete" okText="确定" cancelText="取消">
            <ta-button>批量移除</ta-button>
          </ta-popconfirm>
        </template>
      </ta-tabs>
      <div slot="footer">
        <ta-pagination
          style="float: right;margin-top: 10px"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="roleData"
          :defaultPageSize="10"
          :params="rolePageParams"
          url="org/authority/roleAuthorityManagementRestService/queryRolesByUserId"
          ref="gridPager"
        />
      </div>
    </ta-border-layout>
    <ta-modal
      title="分配角色"
      v-model="associateVisible"
      width="1000px"
      :height="500"
      :bodyStyle="{padding:'10px'}"
      :destroyOnClose='true'
      :maskClosable='false'
      @ok="fnSave"
    >
      <ta-border-layout :layout="{footer: '70px'}" :showBorder="false" :footer-cfg="{showBorder: false}">
        <ta-table
          :columns="roleColumns"
          :dataSource="roleReData"
          :pagination=false
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        >
          <span slot="roleSign" slot-scope="text">{{CollectionLabel('ROLESIGN',text)}}</span>
          <span slot="effective" slot-scope="text">{{CollectionLabel('STATE',text)}}</span>
        </ta-table>
        <div slot="footer">
          <ta-pagination
            style="float: right;margin-top: 20px"
            showSizeChanger
            showQuickJumper
            :dataSource.sync="roleReData"
            :defaultPageSize="10"
            :params="rolePageParams"
            url="org/authority/roleAuthorityManagementRestService/queryNoWrapperRolesByUserId"
            ref="modalGridPager"
          />
        </div>
      </ta-border-layout>
    </ta-modal>
  </div>
</template>
<script>
import $api from '../../api/index'
const roleColumns = [{
  title: '角色名称',
  dataIndex: 'roleName',
  width: '20%',
  overflowTooltip: true
}, {
  title: '组织路径',
  dataIndex: 'namePath',
  width: '20%',
  overflowTooltip: 'namePath',
  customRender: (text) => {
    return text.slice(text.lastIndexOf('/') + 1)
  }
}, {
  title: '有效期',
  dataIndex: 'effectiveTime',
  width: '15%',
  customRender: (text) => {
    return text ? text.split(' ')[0] : '永久'
  }
}, {
  title: '角色标识',
  dataIndex: 'roleSign',
  width: '10%',
  scopedSlots: {customRender: 'roleSign'}
}, {
  title: '角色描述',
  dataIndex: 'roleDesc',
  width: '10%',
  overflowTooltip: true
}, {
  title: '可分配该角色到子组织人员',
  dataIndex: 'subordinate',
  width: '15%',
  customRender: function (text) {
    return text == '1' ? '是' : '否'
  },
  align: 'center'
}, {
  title: '状态',
  dataIndex: 'effective',
  width: '10%',
  yesOrNoTag: true,
  scopedSlots: {customRender: 'effective'}
}]

export default {
  name: 'roleMg',
  data () {
    return {
      currentUser: {},
      roleColumns,
      roleData: [],
      roleReData: [],
      associateVisible: false,
      selectedRowKeys: [],
      selectedRoles: [],
      selectedRolesKeys: [],
      selectedCurrentRoles: []
    }
  },
  methods: {
    fnBack () {
      this.$router.push(
        {
          name: 'userRole'
        }
      )
    },
    fnAssociateRole () {
      this.associateVisible = true
      this.$nextTick(() => {
        this.$refs.modalGridPager.loadData()
      })
    },
    rolePageParams () {
      return {
        userId: this.currentUser.userId
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRoles = selectedRows
    },
    onSelectRoleChange (selectedRowKeys, selectedRows) {
      this.selectedRolesKeys = selectedRowKeys
      this.selectedCurrentRoles = selectedRows
    },
    fnSave () {
      let roleIds = []
      this.selectedRoles.forEach((value, index) => {
        roleIds.push(value.roleId)
      })
      $api.addBatchUserRole({userId: this.currentUser.userId, roleIds: roleIds.join(',')}, (data) => {
        this.$message.success('分配权限成功')
        this.$refs.gridPager.loadData()
        this.associateVisible = false
      })
    },
    fnDelete () {
      if (this.selectedCurrentRoles.length < 1) {
        this.$message.warn('请先勾选要删除的角色')
        return
      }
      let roleIds = []
      this.selectedCurrentRoles.forEach((value, index) => {
        roleIds.push(value.roleId)
      })
      $api.deleteBatchUserRole({userId: this.currentUser.userId, roleIds: roleIds.join(',')}, (data) => {
        this.$message.success('删除人员下角色成功')
        this.$refs.gridPager.loadData((data) => {
          this.selectedRolesKeys = []
        })
      })
    }
  },
  activated () {
    if (this.$route.params.user instanceof Object) {
      this.currentUser = this.$route.params.user
      this.$refs.gridPager.loadData()
    } else {
      this.$router.push({name: 'publicRoleManager'})
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .ant-tabs-tabpane-active {
    padding-top: 10px;
  }

  .notice-box {
    float: right;
    width: 100%;
  }

  .content-box {
    padding-top: 40px;
    overflow: visible;
  }
</style>

<template>
  <div id="adminUserRoleMg" class="fit">
    <ta-border-layout :layout="{header:'55px'}" :center-cfg="{showBar:true}" :header-cfg="{showBorder: false}"
                      :showBorder="false" :footer-cfg="{showBorder: false}">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBack">人员维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>角色管理</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>

      <div slot="centerExtraContent">
        <ta-alert :message="'当前人员：'+this.$route.query.name" type="info" showIcon/>
      </div>
      <ta-tabs class="fit">
        <ta-tab-pane tab="人员下角色列表">
          <ta-table :columns="userRoleColumns"
                    :dataSource="roleData"
                    size="small"
                    :pagination=false
                    style="padding-top: 10px"
                    :rowSelection="{selectedRowKeys: selectedRolesKeys, onChange: onSelectRoleChange}">
            <span slot="roleSign" slot-scope="text">{{CollectionLabel('ROLESIGN',text)}}</span>
            <span slot="namePath" slot-scope="text">{{getLastName(text)}}</span>

            <span slot="action" slot-scope="text,record">
              <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
            </span>
          </ta-table>
          <ta-pagination style="float: right;padding-top: 10px"
                         showSizeChanger
                         showQuickJumper
                         :dataSource.sync="roleData"
                         :defaultPageSize="10"
                         :params="rolePageParams"
                         :url="adminUserRoleUrl"
                         ref="gridPager"/>
        </ta-tab-pane>
        <template slot="tabBarExtraContent">
          <ta-button @click="fnBack">
            <ta-icon type="rollback"/>
            返回
          </ta-button>
          <ta-button-group>
            <ta-button @click="fnBatchDeleteUserRoles">批量移除</ta-button>
            <ta-button @click="fnAssociateRole" type="primary">分配角色</ta-button>
          </ta-button-group>
        </template>
      </ta-tabs>
    </ta-border-layout>
    <ta-modal centered
              v-model="associateVisible"
              width="1000px"
              :bodyStyle="{height:'500px',padding:'0'}"
              destroyOnClose
              :maskClosable=false>
      <div slot="title" style="text-align: center">
        给人员 [{{this.$route.query.name}}] 分配管理员角色
      </div>
      <div slot="footer" style="text-align: center">
        <ta-button @click="associateVisible=false">
          <ta-icon type="rollback"/>
          返回
        </ta-button>
        <ta-button @click="fnSave" type="primary">保存</ta-button>
      </div>
      <!--<ta-alert :message="'当前人员：'+this.$route.query.name" type="info" showIcon-->
      <!--style="width: 300px;margin: 10px 0 0 5px"/>-->

      <ta-tabs class="fit">
        <ta-tab-pane tab="可分配管理员角色列表">
          <ta-table :columns="roleColumns"
                    :dataSource="roleReData"
                    size="small"
                    :pagination=false
                    style="width: 100%;padding-top: 10px"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
            <span slot="roleSign" slot-scope="text">{{CollectionLabel('ROLESIGN',text)}}</span>
          </ta-table>
          <ta-pagination style="float: right;margin-top: 10px;padding-right: 10px"
                         showSizeChanger
                         showQuickJumper
                         :dataSource.sync="roleReData"
                         :defaultPageSize="10"
                         :params="rolePageParams"
                         :url="adminUserModalRoleUrl"
                         ref="modalGridPager"/>
        </ta-tab-pane>
      </ta-tabs>
    </ta-modal>
  </div>
</template>
<script>
  import $api from '../../api/index'

  const userRoleColumns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      overflowTooltip: true,
      width: '20%'
    },
    {
      title: '组织路径',
      overflowTooltip: true,
      dataIndex: 'namePath',
      scopedSlots: {customRender: 'namePath'},
      width: '30%'
    },
    {
      title: '角色标识',
      dataIndex: 'roleSign',
      width: '20%',
      scopedSlots: {customRender: 'roleSign'}
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      width: '20%',
      overflowTooltip: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      scopedSlots: {customRender: 'action'},
      align: 'center'
    }
  ]

  const roleColumns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      overflowTooltip: true,
      width: '20%'
    },
    {
      title: '组织路径',
      overflowTooltip: true,
      dataIndex: 'namePath',
      width: '30%'
    },
    {
      title: '角色标识',
      dataIndex: 'roleSign',
      width: '20%',
      scopedSlots: {customRender: 'roleSign'}
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      width: '30%',
      overflowTooltip: true
    }
  ]
  export default {
    name: 'adminUserRoleMg',
    data() {
      return {
        adminUserRoleUrl: 'org/authority/adminAuthorityManagementRestService/queryRolesByUserId', // 根据用户id查询该用户拥有的角色列表url
        adminUserModalRoleUrl: 'org/authority/adminAuthorityManagementRestService/queryNoWrapperRolesByUserId', // 模态框加载可以分配角色的url
        userRoleColumns, // 人员角色列属性
        operateMenu: [{
          name: '移除',
          type: 'confirm',
          confirmTitle: '确认移除该管理员角色吗?',
          onOk: (record) => {
            this.fnAdminRecordDelete(record)
          }
        }],
        roleColumns, // 模态框角色人员列属性
        roleData: [], // 角色人员数据
        roleReData: [],
        associateVisible: false,
        selectedRowKeys: [], // 选中的key
        selectedRoles: [], //
        selectedRolesKeys: [],
        selectedCurrentRoles: []
      }
    },
    methods: {
      // 获取路径的最后一个
      getLastName(name) {
        return name && name.indexOf('/') != -1 ? name.slice(name.lastIndexOf('/') + 1) : name
      },
      // 加载默认用户角色
      fnLoadDefaultAdminUserRoles() {
        this.$refs.gridPager.loadData()
      },
      // 删除管理员记录
      fnAdminRecordDelete(record) {
        const data = {
          userId: this.$route.query.userId,
          roleIds: record.roleId
        }
        $api.deleteBatchUserRole(data, (data) => {
          this.$message.success('移除成功')
          this.fnLoadDefaultAdminUserRoles()
        })
      },
      // 点击返回
      fnBack() {
        this.$router.push({name: 'adminUserManagement'})
      },
      // 点击分配角色
      fnAssociateRole() {
        this.associateVisible = true
        this.$nextTick(() => {
          // 加载模态框可选角色列表
          this.$refs.modalGridPager.loadData()
        })
      },
      // 分页查询参数
      rolePageParams() {
        return {
          userId: this.$route.query.userId
        }
      },
      // 点击选中事件
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRoles = selectedRows
      },
      // 点击选择
      onSelectRoleChange(selectedRowKeys, selectedRows) {
        this.selectedRolesKeys = selectedRowKeys
        this.selectedCurrentRoles = selectedRows
      },
      // 点击模态框进行保存
      fnSave() {
        if (this.selectedRoles.length === 0) {
          this.$message.warn('请先勾选要分配的角色')
          return
        }
        const roleIds = this.selectedRoles.map((role) => {
          return role.roleId
        })
        const data = {
          userId: this.$route.query.userId,
          roleIds: roleIds.join(',')
        }
        $api.addBatchUserRole(data, dd => {
          this.$message.success('分配角色成功')
          this.fnLoadDefaultAdminUserRoles()
          this.associateVisible = false
        })
      },
      // 点击批量删除
      fnBatchDeleteUserRoles() {
        if (this.selectedCurrentRoles.length === 0) {
          this.$message.warn('请先勾选要移除的角色')
          return
        }
        this.$confirm({
          title: '批量移除管理员角色',
          content: '确认移除这些管理员角色吗?',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            const roleIds = this.selectedCurrentRoles.map((role) => {
              return role.roleId
            })
            const data = {
              userId: this.$route.query.userId,
              roleIds: roleIds.join(',')
            }
            $api.deleteBatchUserRole(data, dd => {
              this.$message.success('移除人员下角色成功')
              this.fnLoadDefaultAdminUserRoles()
            })
          }
        })
      }
    },
    activated() {
      const user = this.$route.query
      if (!user.userId || !user.name) {
        this.fnBack()
      } else {
        this.fnLoadDefaultAdminUserRoles()
      }
    }
  }
</script>

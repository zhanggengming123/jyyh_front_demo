<template>
  <div class="fit">
    <ta-border-layout :layout="{header:'55px', footer: '70px'}" :center-cfg="{showBar:true}" :header-cfg="{showBorder: false}" :showBorder="false" :footer-cfg="{showBorder: false}">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBackToHome">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>人员管理</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>
      <div slot="centerExtraContent">
        <ta-alert :message="'当前角色为：'+this.$route.query.roleName" type="info" showIcon/>
      </div>
      <ta-tabs class="fit">
        <div slot="tabBarExtraContent">
          <ta-button @click="fnBackToHome"><ta-icon type="rollback"/>返回</ta-button>
          <ta-button type="primary" @click="fnShowUserModal">分配人员</ta-button>
          <ta-button @click="fnBatchDeleteUser">批量移除</ta-button>
        </div>
        <ta-tab-pane :tab="tabTitle">
          <ta-table :columns="userColumns"
                    :dataSource="userData"
                    :pagination="false"
                    rowKey="orgId"
                    :rowSelection="{selectedRowKeys: selectedRowKeys,onChange:fnOnChange}"
                    ref="userRef"
                    style="padding-top: 10px"
          >
            <template slot="sex" slot-scope="text">{{CollectionLabel('SEX',text)}}</template>
            <span slot="namePath" slot-scope="text">{{getLastName(text)}}</span>
            <span slot="action" slot-scope="text,record">
              <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
            </span>
          </ta-table>
        </ta-tab-pane>
      </ta-tabs>
      <div slot="footer">
        <ta-pagination
          style="float: right; margin-top: 10px;"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="userData"
          :defaultPageSize="10"
          :params="adminUserParams"
          :url="userPageUrl"
          ref="adminUserPager"/>
      </div>
    </ta-border-layout>
       <ta-user-select title="新增审核角色"
                      :props="defaultProps"
                      width="800px"
                      :is-show="isShow"
                      :user-tree-data="orgTreeData"
                      id="adminMg"
                      :load="loadOrgTreeNode"
                      :user-list-data="userListData"
                      :default-user-list="result"
                      @close="isShow = false, userListData = []"
                      :pagination="true"
                      @queryUserList="fnQueryUserList"
                      @getUserListResult="fnGetUserListResult">
      </ta-user-select>
  </div>
</template>
<script>
import $api from '../../api/index'
const userColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: '15%'
  },
  {
    title: '登录号',
    dataIndex: 'loginId',
    width: '15%'
  },
  {
    title: '所属组织',
    dataIndex: 'namePath',
    scopedSlots: { customRender: 'namePath' },
    width: '20%'
  },
  {
    title: '证件号',
    dataIndex: 'idCardNo',
    width: '20%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    scopedSlots: { customRender: 'sex' }
  },
  {
    title: '操作',
    align: 'center',
    width: '20%',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'adminUserMg',
  data () {
    return {
      item: {}, // 路由数据
      tabTitle: '审核角色人员管理列表', //
      userData: [], // 用户数据
      userColumns, // 用户列名称
      operateMenu: [{
        name: '移除',
        type: 'confirm',
        confirmTitle: '确定要移除该人员吗?',
        onOk: (record) => {
          this.fnAdminUserDelete(record)
        }
      }],
      userPageUrl: 'org/authority/adminAuthorityManagementRestService/queryUsersByRoleId', // 用户分页请求url
      isShow: false, // 是否打开人员选择框
      orgTreeData: [], // 人员选择的左侧组织树
      userListData: [], // 相应组织人员信息
      result: [], // 选择的人员信息
      defaultProps: {
        treeNodeKey: 'value', // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
        treeLabel: 'label', // 树节点的属性名称
        treeChildren: 'children', // 树子节点对象的属性名称
        listKey: 'userId', // 每条用户信息的唯一标识（默认：roleId）
        listTitle: 'name', // 用户信息第一行显示内容
        listSubTitle: 'mobile', // 用户信息第二行显示内容
        listDescription: 'namePath' // 用户信息鼠标移上去显示描述信息
      },
      roleId: '', // 角色id
      selectedRows: [], // 选中的人员列表
      selectedRowKeys: []// 选中的keys
    }
  },
  mounted () {
    this.item = this.$route.query
    if (!this.item.roleId) {
      this.fnBackToHome()
      return
    }
    this.roleId = this.item.roleId
    this.fnLoadUserData()
    this.initTableColumn(this.$refs.userRef, ['sex', 'action'])
  },
  computed: {
    rowSelection () {
      const self = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          self.selectedRows = selectedRows
        }
      }
    }
  },
  methods: {
    fnOnChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 获取路径的最后一个
    getLastName (name) {
      return name && name.indexOf('/') != -1 ? name.slice(name.lastIndexOf('/') + 1) : name
    },
    // 删除人员
    fnAdminUserDelete (record) {
      const data = {
        roleId: this.roleId,
        userIds: record.userId
      }
      $api.deleteBatchRoleUser(data, data => {
        this.$message.success('移除人员成功')
        this.fnLoadUserData()
        // const userData = this.userData.filter(item => item.userId !== record.userId);
        // this.userData = userData;
      })
    },
    // table引用,排除的元素,传入数组eg:this.initTableColumn(this.$refs.adminRef,['operation'])
    initTableColumn (ref, excludeArray) {
      const columns = [...ref.columns]
      const column = columns.map(v => {
        if (excludeArray && excludeArray.length > 0) {
          for (const key in excludeArray) {
            if (v.dataIndex === excludeArray[key] || v.key === excludeArray[key]) {
              return v
            }
          }
        }
        v.overflowTooltip = true
        return v
      })
      Object.assign(column, ref.columns)
    },
    adminUserParams () {
      return {
        roleId: this.item.roleId
      }
    },
    // 加载默认数据
    fnLoadUserData () {
      this.$refs.adminUserPager.loadData()
    },
    // 返回
    fnBackToHome () {
      this.$router.push({ name: 'roleManagement' })
    },
    // 查询人员信息
    fnQueryUserList (orgId, includeChildren, pageNum, searchType, searchParam) {
      // 查询用户信息
      const data = {
        roleId: this.roleId,
        orgId: orgId,
        pageNumber: pageNum,
        pageSize: 10,
        includeChild: includeChildren ? '1' : '0'
      }
      if (searchType) {
        data[searchType] = searchParam
      }
      $api.queryUserNoWrapperByRoleId(data, (data) => {
        this.userListData = data.data.pageBean.list
      })
    },
    // 提交选择的人员信息
    fnGetUserListResult (data) {
      const delUsers = this.result.filter(el => {
        const userIds = []
        data.forEach(function (value) {
          userIds.push(value.userId)
        })
        return !userIds.includes(el.userId)
      })
      const addData = data.filter(el => {
        let userIds = []
        this.result.forEach(function (value) {
          userIds.push(value.userId)
        })
        return !userIds.includes(el.userId)
      })
      // 保存数组中有的人员
      if (addData.length > 0) {
        let userIdArr = []
        addData.forEach(function (value, index) {
          userIdArr.push(value.userId)
        })
        $api.addBatchExaminerUser({ roleId: this.roleId, userIds: userIdArr.join(',') }, (data) => {
          this.$message.success('关联人员成功')
          this.isShow = false
          this.fnLoadUserData()
        })
      }
      // 删除数组中剔除的人
      if (delUsers.length > 0) {
        let delUserIdArr = []
        delUsers.forEach(function (value, index) {
          delUserIdArr.push(value.userId)
        })
        $api.deleteBatchRoleUser({ roleId: this.roleId, userIds: delUserIdArr.join(',') }, (data) => {
          this.$message.success('移除人员成功')
          this.isShow = false
          this.fnLoadUserData()
        })
      }
    },
    // 批量删除人员信息
    fnBatchDeleteUser () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择需要移除的人员')
        return
      }
      this.$confirm({
        title: '移除人员',
        content: '确认移除这些人员吗?',
        cancelText: '取消',
        okText: '确认',
        onOk: () => {
          const userIds = this.selectedRows.map(v => {
            return v.userId
          })
          const data = {
            userIds: userIds.join(','),
            roleId: this.roleId
          }
          $api.deleteBatchRoleUser(data, dd => {
            this.$message.success('移除成功')
            this.fnLoadUserData()
          })
        }
      })
    },
    // 展示人员模态框
    fnShowUserModal () {
      this.isShow = true
    },
    // 加载左侧组织树
    loadOrgTreeNode (node, resolve) {
      if (node.level === 0) {
        $api.queryOrgTreeByAsync(null, data => {
          // 数据成功后默认返回的数据

          const orgVos = data.data.orgVos
          if (orgVos[0].children) {
            const dd = orgVos[0].children.map(v => {
              let obj = v
              if (v.childNum > 0) {
                obj.children = []
              }
            })
            orgVos[0].children = dd
          }
          return resolve(orgVos)
        })
      }
      if (node.level >= 1) {
        const orgId = node.data.orgId
        const isLeaf = node.data.isLeaf
        const data = {
          orgId: orgId
        }
        $api.queryOrgTreeByAsync(data, data => {
          // 数据成功后默认返回的数据
          let dd = data.data.orgVos
          if (isLeaf) {
            dd = dd.map(v => {
              let obj = v
              obj.children = []
            })
          }
          return resolve(dd)
        })
      }
    }
  }
}
</script>

<template>
  <div id="publicRoleUser" class="fit">
    <ta-border-layout :layout="{header:'55px', footer: '70px'}" :footer-cfg="{showBorder: false}">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBack">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>人员管理</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>
      <ta-alert :message="'当前角色为：'+role.roleName" type="info" showIcon class="notice-box"/>
        <ta-tabs class="fit content-box">
        <ta-tab-pane tab="角色下已分配的人员">
          <ta-table :columns="roleUserColumns"
                    :dataSource="roleUserData"
                    :pagination=false
          >
            <span slot="sex" slot-scope="text">{{CollectionLabel('SEX',text)}}</span>
            <span slot="operation" slot-scope="text, record">
              <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
            </span>
          </ta-table>
        </ta-tab-pane>
        <template slot="tabBarExtraContent">
          <ta-button @click="fnBack"><ta-icon type="rollback"/>返回</ta-button>
          <ta-button @click="fnOpenAssociate" type="primary">可分配人员</ta-button>
        </template>
      </ta-tabs>
      <div slot="footer">
        <ta-pagination
          style="float: right;margin-top: 10px"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="roleUserData"
          :defaultPageSize="10"
          :params="roleUserPageParams"
          url="org/authority/roleAuthorityManagementRestService/queryUsersByRoleId"
          ref="roleUserPager"
        />
      </div>
    </ta-border-layout>
    <ta-user-select title="人员选择"
                    :is-show="isUserShow"
                    @close="isUserShow = false"
                    :user-tree-data="orgOptions"
                    :user-list-data="userListData"
                    :default-user-list="defaultUserList"
                    @queryUserList="fnQueryUserList"
                    @getUserListResult="fnGetUserListResult"
                    :props="selectUserProps"
                    id="roleUserSelect"
                    :load="loadNode"
                    :user-select-data="userSelectData"
                    @search="fnSearchUser"
                    :pagination="true"
    >
    </ta-user-select>
  </div>
</template>
<script>
import $api from '../../api/index'
const roleUserColumns = [{
  title: '姓名',
  dataIndex: 'name',
  width: '25%',
  overflowTooltip: true
}, {
  title: '登录号',
  dataIndex: 'loginId',
  width: '15%'
}, {
  title: '所属组织',
  dataIndex: 'namePath',
  width: '25%',
  overflowTooltip: 'namePath',
  customRender: (text) => {
    return text.slice(text.lastIndexOf('/') + 1)
  }
}, {
  title: '证件号',
  dataIndex: 'idCardNo',
  width: '20%',
  overflowTooltip: true
}, {
  title: '性别',
  dataIndex: 'sex',
  scopedSlots: { customRender: 'sex' },
  width: '15%'
}, {
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' },
  align: 'center',
  width: '200px'
}]

export default {
  name: 'publicRoleUser',
  data () {
    return {
      role: {},
      roleUserColumns,
      operateMenu: [{
        name: '移除',
        type: 'confirm',
        confirmTitle: '确认移除吗？',
        onOk: (record) => {
          this.fnRemoveRoleUser(record)
        }
      }],
      roleUserData: [],
      collectionList: ['SEX'],
      isUserShow: false,
      orgOptions: [],
      userListData: [],
      defaultUserList: [],
      userSelectData: [],
      selectUserProps: {
        treeNodeKey: 'value', // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
        treeLabel: 'label', // 树节点的属性名称
        treeChildren: 'children', // 树子节点对象的属性名称
        listKey: 'userId', // 每条用户信息的唯一标识（默认：userId）
        listTitle: 'name', // 用户信息第一行显示内容
        listSubTitle: 'mobile', // 用户信息第二行显示内容
        listDescription: 'namePath' // 用户信息鼠标移上去显示描述信息
      }
    }
  },
  methods: {
    fnRemoveRoleUser (record) {
      $api.deleteRoleUserByKey({ roleId: record.roleId, userId: record.userId }, (data) => {
        this.$message.success('移除成功')
        this.fnQueryUsersByRoleId()
      })
    },
    fnOpenAssociate () {
      this.isUserShow = true
      this.userListData = []
      this.defaultUserList = []
      $api.queryUsersByRoleId({ roleId: this.role.roleId }, (data) => {
        this.defaultUserList = data.data.pageBean.list
      })
    },
    fnBack () {
      this.$router.push({ name: 'publicRoleManager' })
    },
    loadNode (node, resolve) {
      $api.queryCurrentAdminRoleWrapeOrgTree({ orgId: node.data ? node.data.value : null }, (data) => {
        resolve(data.data.orgVos)
      })
    },
    fnSearchUser (value) {
      if (value) {
        $api.queryUsersNoWraperByRoleId({ roleId: this.role.roleId, orgId: '', includeChild: 1, userName: value }, (data) => {
          this.userSelectData = data.data.userVos.list
        })
      }
    },
    fnQueryUserList (id, includeChild, pageNum, searchType, searchParam) {
      const param = {
        roleId: this.role.roleId,
        orgId: id,
        pageNumber: pageNum,
        pageSize: 10,
        includeChild: includeChild ? 1 : 0
      }
      if (searchType) {
        param[searchType] = searchParam
      }
      $api.queryUsersNoWraperByRoleId(param, (data) => {
        this.userListData = data.data.userVos.list
      })
    },
    fnGetUserListResult (data) {
      this.Base.pageMask({ show: true, text: '加载中' })
      const delUsers = this.defaultUserList.filter(el => {
        const userIds = []
        data.forEach(function (value) {
          userIds.push(value.userId)
        })
        return !userIds.includes(el.userId)
      })
      const addData = data.filter(el => {
        const userIds = []
        this.defaultUserList.forEach(function (value) {
          userIds.push(value.userId)
        })
        return !userIds.includes(el.userId)
      })
      const userIdArray = [], delUserIdArray = []
      // 保存数组中有的人员
      if (addData.length > 0) {
        addData.forEach(function (value, index) {
          userIdArray.push(value.userId)
        })
      }
      // 删除数组中剔除的人
      if (delUsers.length > 0) {
        delUsers.forEach(function (value, index) {
          delUserIdArray.push(value.userId)
        })
      }

      new Promise((resolve, reject) => {
        if (userIdArray.length) {
          $api.addBatchRoleUsers({ roleId: this.role.roleId, userIds: userIdArray.join(',') }, (data) => {
            this.$message.success('关联人员成功')
            resolve()
          }, (data) => {
            this.isUserShow = false
            this.Base.pageMask({ show: false })
          })
        } else {
          resolve()
        }
      }).then(() => {
        return new Promise((resolve, reject) => {
          if (delUserIdArray.length) {
            $api.deleteBatchRoleUser({ roleId: this.role.roleId, userIds: delUserIdArray.join(',') }, (data) => {
              this.$message.success('移除人员成功')
              resolve()
            }, (data) => {
              this.isUserShow = false
              this.Base.pageMask({ show: false })
            })
          } else {
            resolve()
          }
        })
      }).then(() => {
        this.isUserShow = false
        this.Base.pageMask({ show: false })
        this.fnQueryUsersByRoleId()
      })
    },
    // 分页参数
    roleUserPageParams () {
      return {
        roleId: this.role.roleId
      }
    },
    fnQueryUsersByRoleId () {
      this.$refs.roleUserPager.loadData()
    }
  },
  activated () {
    if (this.$route.params.role instanceof Object) {
      this.role = this.$route.params.role || {}
      this.fnQueryUsersByRoleId()
    } else {
      this.$router.push({ name: 'publicRoleManager' })
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

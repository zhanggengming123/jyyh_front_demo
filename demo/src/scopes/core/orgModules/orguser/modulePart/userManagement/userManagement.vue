<template>
  <div id="app" class="fit">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}" :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <div class="center-item">
          <ta-input-search placeholder="请输入人员姓名、帐号" class="search-box" @search="onSearchUser" v-model="searchInfo" enterButton="搜索"></ta-input-search>
        </div>
        <div class="center-item">
          <userSearchPanel @dealSearchPanelResult="dealSearchPanelResult"></userSearchPanel>
        </div>
      </div>
      <div slot="centerExtraContent">
        <ta-cascader
          v-model="orgIds"
          url="org/orguser/orgManagementRestService/getOrgByAsync"
          treeId="orgTreeData"
          :options.sync="options"
          expandTrigger="hover"
          changeOnSelect
          :fieldNames="{ label: 'orgName', value: 'orgId', children: 'children' }"
          @change="onSearchUser"
          style="width:250px; margin-right: 10px;"
          placeholder="请选择人员的所属组织"/>
        <ta-checkbox @change="onChangeChildOrg" :checked="checkedOrgChild">包含子组织</ta-checkbox>
        <ta-checkbox @change="onChangeVirtualOrg" :checked="checkedVirtualOrg">无组织人员</ta-checkbox>
        <ta-tag-select title="锁定" :data="CollectionData('YESORNO')" v-model="islockList" @change="onSearchUser" class="filter-name"></ta-tag-select>
        <ta-tag-select title="有效性" :data="CollectionData('EFFECTIVE')" v-model="userEffectiveList" @change="onSearchUser" class="filter-name"></ta-tag-select>
        <div style="float: right">
          <ta-button type="primary" @click="editVisible = true; editType = '1'; rowData = {}">新增</ta-button>
          <ta-dropdown :trigger="['click']">
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="btnDisable" >
                <ta-popconfirm title="确认启用所选账户?" cancelText="取消" okText="确认" @confirm="changeEffectiveUnlock(1)">
                  <ta-icon type="check-circle"></ta-icon>
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="btnDisable">
                <ta-popconfirm title="确认禁用所选账户?" cancelText="取消" okText="确认" @confirm="changeEffectiveUnlock(2)">
                  <ta-icon type="stop"/>
                  <span class="mg-l12">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="btnDisable" @click="changeEffectiveUnlock(3)">
                <ta-icon type="unlock"/>
                解锁
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="btnDisable" @click="fnDeleteUser">
                <ta-icon type="close-circle"/>
                删除
              </ta-menu-item>
            </ta-menu>
            <ta-button>
              批量操作
              <ta-icon type="down"/>
            </ta-button>
          </ta-dropdown>
        </div>
      </div>
      <ta-table rowKey="userId" :columns="columns" :dataSource="userList" :pagination=false :locale="{filterConfirm: '确定',filterReset: '重置',emptyText: '暂无数据'}" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleSelectChange}">
        <a slot="name" slot-scope="text,record" class="operate" @click="showVisible = true; rowData = record" :class="{'disable-color': record.effective == '0' }">{{text}}</a>
        <span slot="sex" slot-scope="text">{{CollectionLabel('SEX', text)}}</span>
        <span slot="namePath" slot-scope="text, record">
          <span v-if="config == '0'">{{getLastName(text)}}</span>
          <a v-else>
            <ta-popover
              placement="right"
              width="400"
              trigger="click">
              <ta-table :columns="gridColumns" :dataSource="orgInfo" bordered size="small" :pagination=false></ta-table>
              <ta-icon slot="reference" type="search" @click="queryOrgInfo(record.userId)"></ta-icon>
            </ta-popover>
          </a>
        </span>
        <span slot="isLock" slot-scope="text">
          <ta-tag v-if="text == '1'" type="danger" class='no-cursor'>是</ta-tag>
          <ta-tag v-else type="success" class='no-cursor'>否</ta-tag>
        </span>
        <span slot="mobile" slot-scope="text">{{formatSensitiveValue('mobile', text)}}</span>
        <span slot="effective" slot-scope="text">{{CollectionLabel('EFFECTIVE', text)}}</span>
        <span slot="operation" slot-scope="text, record, index">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
      </ta-table>
      <div slot="footer">
        <ta-pagination style="float: right; margin-top: 10px;" showSizeChanger showQuickJumper :dataSource.sync="userList" :defaultPageSize="10" :params="userPageParams" :url="userSearchUrl" ref="gridPager" />
      </div>
    </ta-border-layout>
    <!--编辑、新增框-->
    <edit-user :visible="editVisible" v-if="editVisible" @close="editVisible = false" :editType="editType" :rowData="rowData" @editSuccess="editSuccess" @queryTable="onSearchUser"></edit-user>
    <!--人员信息展示-->
    <show-user :visible="showVisible" v-if="showVisible" @close="showVisible = false" :rowData="rowData"></show-user>
    <!--重置密码-->
    <reset-pwd :visible="resetVisible" @close="resetVisible = false" :userId="rowData.userId" @queryTable="onSearchUser"></reset-pwd>
    <!--批量删除-->
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="deleteBatch" title="人员删除" description="选中人员"></ta-careful-delete>
    <!--更改组织-->
    <change-org :visible="changeVisible" :config="config" :rowData="rowData" @close="changeVisible = false" @queryTable="onSearchUser" ></change-org>
  </div>
</template>

<script>
import showUser from './part/showUser.vue'
import editUser from './part/editUser.vue'
import userSearchPanel from './part/searchPanel.vue'
import resetPwd from './part/resetPwd.vue'
import changeOrg from './part/changeOrg.vue'
import $api from './api/index'
import mixins from './mixins'

const columns = [
  { title: '姓名', dataIndex: 'name', width: '15%', overflowTooltip: true, scopedSlots: { customRender: 'name' } },
  { title: '帐号', dataIndex: 'loginId', width: '15%', overflowTooltip: true },
  { title: '性别', dataIndex: 'sex', width: 80, scopedSlots: { customRender: 'sex' } },
  { title: '所属组织', width: '15%', overflowTooltip: 'namePath', dataIndex: 'namePath', scopedSlots: { customRender: 'namePath' } },
  { title: '手机号', dataIndex: 'mobile', width: '15%', overflowTooltip: true, scopedSlots: { customRender: 'mobile' } },
  { title: '锁定', dataIndex: 'isLock', width: 80, scopedSlots: { customRender: 'isLock' } },
  { title: '有效性', dataIndex: 'effective', width: 80, yesOrNoTag: true, scopedSlots: { customRender: 'effective' } },
  { title: '操作', dataIndex: 'operation', align: 'center', width: 240, scopedSlots: { customRender: 'operation' } }
]
const gridColumns = [{
  title: '组织名称',
  dataIndex: 'orgName'
}, {
  title: '组织路径',
  dataIndex: 'namePath'
}]
export default {
  name: 'app',
  mixins: [mixins],
  data () {
    return {
      gridColumns,
      columns,
      operateMenu: [{
        name: '编辑',
        disabled: (record) => {
          return record.effective == '0'
        },
        title: (record) => record.effective == '0' ? '禁用的人员不允许编辑' : '',
        onClick: (record, index) => {
          this.editVisible = true
          this.editType = '2'
          this.rowData = record
          this.editIndex = index
        }
      }, {
        name: '更改组织',
        disabled: (record) => {
          return record.effective == '0'
        },
        title: (record) => record.effective == '0' ? '禁用的人员不允许更改组织' : '',
        onClick: (record) => {
          this.changeVisible = true
          this.rowData = record
        }
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该账户?',
          onOk: (record) => {
            this.changeEffectiveUnlock(1, record)
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该账户?',
          onOk: (record) => {
            this.changeEffectiveUnlock(2, record)
          }
        }, {
          name: '解锁',
          onClick: (record) => {
            this.changeEffectiveUnlock(3, record)
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该用户?',
          isShow: (record) => {
            return this.userList.length
          },
          onOk: (record) => {
            this.onDeleteUser(record.userId)
          }
        }, {
          name: '重置密码',
          onClick: (record) => {
            this.resetVisible = true
            this.rowData = record
          }
        }]
      }],
      userList: [],
      editType: '',
      editVisible: false,
      showVisible: false,
      resetVisible: false,
      deleteVisible: false,
      changeVisible: false,
      deleteUserIds: '',
      rowData: {},
      editIndex: '',
      selectedRowKeys: [],
      selectedRows: [],
      searchInfo: '',
      orgIds: [],
      checkedOrgChild: true,
      checkedVirtualOrg: false,
      searchFlag: 'normal',
      searchPanelResult: {},
      userSearchUrl: 'org/orguser/userManagementRestService/queryUserByConditon',
      options: [],
      islockList: [],
      userEffectiveList: [],
      config: '',
      orgInfo: []
    }
  },
  components: { editUser, showUser, userSearchPanel, resetPwd, changeOrg },
  computed: {
    btnDisable () { return !this.selectedRowKeys.length }
  },
  mounted () {
    this.getUsers()
    this.getConfig()
  },
  methods: {
    getConfig () {
      $api.getUserOrgMultiConfig({}, (data) => {
        this.config = data.data.config
      })
    },
    // 分页提交参数
    userPageParams () {
      if (this.searchFlag == 'normal') {
        const param = {}
        // 所属组织框
        const orgIds = this.orgIds
        if (orgIds != undefined && orgIds != '') {
          const orgId = orgIds[orgIds.length - 1]
          param.orgId = orgId
        }
        // 子组织按钮
        if (this.searchInfo != '') {
          param.name = this.searchInfo
          param.loginId = this.searchInfo
          param.idCardNo = this.searchInfo
        }
        param.showChildUser = this.checkedOrgChild
        param.virtualOrg = this.checkedVirtualOrg
        param.islock = this.islockList
        param.userEffective = this.userEffectiveList
        param.searchType = 'normal'
        return param
      } else {
        return this.searchPanelResult
      }
    },
    // 查询用户
    onSearchUser () {
      this.searchFlag = 'normal'
      this.getUsers()
    },
    // 查询
    getUsers () {
      this.$nextTick(() => {
        this.$refs.gridPager.loadData()
      })
    },
    // 处理高级查询的返回值
    dealSearchPanelResult (data) {
      this.searchFlag = 'advance'
      if (data != null) {
        this.searchPanelResult = data
      }
      this.searchPanelResult.searchType = 'advance'
      this.getUsers()
    },
    handleSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 包含子组织
    onChangeChildOrg (e) {
      this.checkedOrgChild = e.target.checked
      this.onSearchUser()
    },
    onChangeVirtualOrg (e) {
      this.checkedVirtualOrg = e.target.checked
      this.orgIds = []
      this.onSearchUser()
    },
    // 编辑
    editSuccess (record) {
      this.getUsers()
      // this.userList[this.editIndex] = Object.assign({}, this.rowData, record)
    },
    // 启用1 禁用2 解锁3
    changeEffectiveUnlock (type, record) {
      let userIds = []
      // const dataSource = [...this.userList]
      if (record) {
        if (type == 1) {
          if (record.effective == '0') {
            userIds.push(record.userId)
          }else {
            this.$message.warning('该记录已经启用，请勿重复操作！')
            return
          }
        } else if (type == 2) {
          if (record.effective == '1') {
            userIds.push(record.userId)
          }else {
            this.$message.warning('该记录已经禁用，请勿重复操作！')
            return
          }
        } else {
          if (record.isLock == '1') {
            userIds.push(record.userId)
          }else {
            this.$message.warning('该记录未锁定，无需解锁！')
            return
          }
        }
      } else {
        userIds = this.selectedRowKeys
        // const { selectedRows } = this
        // for (let i = 0; i < selectedRows.length; i++) {
        //   if (type == 1) {
        //     if (selectedRows[i].effective == '0') {
        //       userIds.push(selectedRows[i].userId)
        //     }
        //   } else if (type == 2) {
        //     if (selectedRows[i].effective == '1') {
        //       userIds.push(selectedRows[i].userId)
        //     }
        //   } else {
        //     if (selectedRows[i].isLock == '1') {
        //       userIds.push(selectedRows[i].userId)
        //     }
        //   }
        // }
      }
      // if (userIds.length == 0) {
      //   this.$message.warning('所选项已是' + (type == 1 ? '启用' : (type == 2 ? '禁用' : '正常')) + '状态')
      //   return false
      // }

      $api.changeEffectiveUnlock({ userIds: userIds.join(','), type: type }, (data) => {
        // this.userList = dataSource.filter((item) => {
        //   if (userIds.indexOf(item.userId) > -1) {
        //     if (type == 3) {
        //       item.isLock = '0'
        //     } else {
        //       item.effective = type == 1 ? '1' : '0'
        //     }
        //   }
        //   return item
        // })
        this.onSearchUser()
        this.selectedRowKeys = []
        this.selectedRows = []
        if (type == 3) {
          this.$message.success('解锁成功')
        } else {
          this.$message.success((type == 1 ? '启用' : '禁用') + '成功')
        }
      })
    },
    // 删除
    fnDeleteUser (val) {
      this.deleteUserIds = this.selectedRowKeys.join(',')
      this.deleteVisible = true
    },
    deleteBatch () {
      $api.deleteBatchUserByUserIds({ userIds: this.deleteUserIds }, (data) => {
        this.$message.success('删除成功')
        this.onSearchUser()
        this.deleteVisible = false
        this.selectedRowKeys = []
        this.selectedRows = []
      })
    },
    // 删除操作
    onDeleteUser (userId) {
      $api.deleteBatchUserByUserIds({ userIds: userId }, (data) => {
        this.$message.success('删除操作成功')
        this.onSearchUser() // 刷新表格数据, 所以不需要手动清理表格选择信息
      })
    },
    queryOrgInfo (userId) {
      $api.queryOrgInfoByUserId({ userId: userId }, (data) => {
        this.orgInfo = data.data.list
      })
    },
    getLastName (name) {
      return name && name.indexOf('/') != -1 ? name.slice(name.lastIndexOf('/') + 1) : name
    }
  }
}
</script>
<style type="text/less" lang="less">
  .ant-collapse-content > .ant-collapse-content-box{ padding: 0;}
</style>
<style scoped type="text/less" lang="less">
  .disable-color { color: @normal-color !important; }
  .no-cursor {cursor: default;}
  .filter-box { display: inline-block }
  .filter-name { margin-left: 20px }
  .mg-l8 { margin-left: 8px; }
  .mg-l12 { margin-left: 12px; }
  .search-box { width: 340px; margin-right: 10px; }
  .center-box {
    display: table; text-align:center; width: 100%; height: 100%; overflow: hidden;
    .center-item {
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      &:first-child { text-align: right; width: 55%; }
      &:last-child { text-align: left; width: 45%; }
    }
  }
</style>

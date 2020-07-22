<template>
  <div class="fit" id="app">
    <ta-border-layout :layout="{header:'70px'}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}">
      <!--搜索-->
      <div slot="header" class="center-box">
        <ta-input-search v-model="param" placeholder="操作事件" class="search-box" @search="searchQuery"  enterButton="搜索"  />
      </div>
      <!--过滤-->
      <div slot="centerExtraContent">
        <ta-tag-select title="审核状态" :data="CollectionData('EXAMINEISCHECK')" :is-multi="true" v-model="isCheckParam" @change="fnQuery"></ta-tag-select>
        创建时间：
        <ta-range-picker
          v-model="createTime"
          :placeholder="['创建开始时间', '创建结束时间']"
          @change="onChangeTime"
          :get-calendar-container="getContainer"
        />
        <!-- eChart-->
        <div style="float: right">
          <ta-button icon="area-chart" @click="showChart()" />
        </div>

      </div>

      <div>
        <ta-table
          rowKey="id"
          :columns="columns"
          :dataSource="gridData"
          :pagination=false
          :locale="{filterConfirm: '确定',filterReset: '重置',emptyText: '暂无数据'}">
          <span slot="opName"  slot-scope="text, record" ><a @click="showDetail(record)">{{text}}</a></span>
          <span slot="opUsername" slot-scope="text">{{text}}</span>
          <span slot="checkStatus" slot-scope="text">{{CollectionLabel('EXAMINEISCHECK', text)}}</span>
          <span slot="createTime" slot-scope="text">{{text}}</span>
          <span slot="updateTime" slot-scope="text">{{text}}</span>
          <span slot="action" slot-scope="text, record, index">
            <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
          </span>

        </ta-table>

        <ta-pagination style="float: right; margin-top: 10px;" showSizeChanger showQuickJumper :dataSource.sync="gridData" :defaultPageSize="10" :params="pageParams" :url="searchUrl" ref="gridPager" />

      </div>
    </ta-border-layout>

    <ta-modal
      centered
      v-model="showChartVisible"
      width="800px"
      :bodyStyle="{height:'500px',padding:'0'}"
      :footer="null"
      :destroyOnClose=true
      :maskClosable=true
      :title="'数据分析(默认显示最近7天)'"
      :closable=true
      @close="closeChart(false)"
    >
      <examine-chart ref="examineChart" :queryData="queryData" @closeModal="closeChart"></examine-chart>
    </ta-modal>


    <!--显示框-->
    <show-org :visible="orgEditVisible" :rowData="rowData" :tags="tags" @close="orgEditVisible = false"></show-org>
    <show-org-add v-if="orgAddVisible" :visible="orgAddVisible" :rowData="rowData" :tags="tags" :chooseResult="chooseResult" @close="orgAddVisible = false"></show-org-add>
    <show-org-batch :visible="orgBatchVisible" :row-data="rowData" :tags="tags" @close="orgBatchVisible = false"></show-org-batch>

    <show-add-user v-if="userAddVisible" :visible="userAddVisible" :rowData="rowData" :chooseUserResult="chooseUserResult" @close="userAddVisible = false"></show-add-user>
    <show-edit-user :visible="userEditVisible" :rowData="rowData" @close="userEditVisible = false"></show-edit-user>
    <show-user-edit-org :visible="userEditOrgVisible" :rowData="rowData" @close="userEditOrgVisible = false"></show-user-edit-org>
    <show-user-batch :visible="userBatchVisible" :row-data="rowData" :tags="tags" :roleUserVisible="roleUserVisible" @close="userBatchVisible = false"></show-user-batch>

    <show-add-role :visible="roleAddVisible" :rowData="rowData" :chooseRoleResult="chooseRoleResult" :adminRole="adminRole" @close="roleAddVisible = false"></show-add-role>
    <show-edit-role :visible="roleEditVisible" :rowData="rowData" :chooseRoleResult="chooseRoleResult" :adminRole="adminRole" @close="roleEditVisible = false"></show-edit-role>
    <show-role-batch :visible="roleBatchVisible" :row-data="rowData" :userRoleVisible="userRoleVisible" @close="roleBatchVisible = false"></show-role-batch>

    <show-copy-role :visible="copyRoleVisible" :rowData="rowData" @close="copyRoleVisible = false"></show-copy-role>
    <show-copy-resource :visible="copyResourceVisible" :rowData="rowData" @close="copyResourceVisible = false"></show-copy-resource>
    <show-similar-authority :visible="similarAuthorityVisible" :rowData="rowData" @close="similarAuthorityVisible = false"></show-similar-authority>
    <show-agent-authority :visible="agentAuthorityVisible" :rowData="rowData" @close="agentAuthorityVisible = false"></show-agent-authority>
    <show-agent-authority-batch :visible="agentAuthorityBatchVisible" :rowData="rowData" @close="agentAuthorityBatchVisible = false"></show-agent-authority-batch>
    <show-use-permission-authority :visible="usePermissionVisible" :rowData="rowData" @close="usePermissionVisible = false"></show-use-permission-authority>
    <show-custom-resource-use-permission :visible="customResourceUsePermissionVisible" :rowData="rowData" @close="customResourceUsePermissionVisible = false"></show-custom-resource-use-permission>
    <show-custom-resource-authority :visible="customResourceAuthorityVisible" :rowData="rowData" @close="customResourceAuthorityVisible = false"></show-custom-resource-authority>
    <show-resource-authority :visible="resourceAuthorityVisible" :rowData="rowData" @close="resourceAuthorityVisible = false"></show-resource-authority>
    <show-batch-op-authority :visible="batchOpAuthorityVisible" :rowData="rowData" @close="batchOpAuthorityVisible = false"></show-batch-op-authority>
    <show-permission-effective-time-batch :visible="permissionEffectiveTimeBatchVisible" :rowData="rowData" @close="permissionEffectiveTimeBatchVisible = false"></show-permission-effective-time-batch>
    <show-org-scope :visible="orgScopeVisible" :rowData="rowData" @close="orgScopeVisible = false"></show-org-scope>
  </div>
</template>

<script>
import moment from 'moment'
import $api from './api/index'
import showOrg from './part/org/showOrg'
import showOrgAdd from './part/org/showOrgAdd'
import showOrgBatch from './part/org/showOrgBatch'

import showAddUser from './part/user/showAddUser'
import showEditUser from './part/user/showEditUser'
import showUserEditOrg from './part/user/showUserEditOrg'
import showUserBatch from './part/user/showUserBatch'

import showAddRole from './part/role/showAddRole'
import showEditRole from './part/role/showEditRole'
import showRoleBatch from './part/role/showRoleBatch'

import showCopyRole from './part/authority/showCopyRole'
import showCopyResource from './part/authority/showCopyResource'
import showSimilarAuthority from './part/authority/showSimilarAuthority'
import showAgentAuthority from './part/authority/showAgentAuthority'
import showUsePermissionAuthority from './part/authority/showUsePermissionAuthority'
import showCustomResourceUsePermission from './part/authority/showCustomResourceUsePermission'
import showResourceAuthority from './part/authority/showResourceAuthority'
import showBatchOpAuthority from './part/authority/showBatchOpAuthority'
import showCustomResourceAuthority from './part/authority/showCustomResourceAuthority'
import showAgentAuthorityBatch from './part/authority/showAgentAuthorityBatch'
import showOrgScope from './part/authority/showOrgScope'
import showPermissionEffectiveTimeBatch from './part/authority/showPermissionEffectiveTimeBatch'
import examineChart from './part/examineChart'

const columns = [
  { title: '操作事件', dataIndex: 'opName', width: '15%', scopedSlots: { customRender: 'opName' } },
  { title: '操作人', dataIndex: 'opUsername', width: '10%', scopedSlots: { customRender: 'opUsername' } },
  // { title: '审核状态', dataIndex: 'checkStatus', width: '10%', scopedSlots: { customRender: 'checkStatus' } },
  { title: '创建时间', dataIndex: 'createTime', width: '20%', scopedSlots: { customRender: 'createTime' } },
  { title: '审核时间', dataIndex: 'updateTime', width: '20%', scopedSlots: { customRender: 'updateTime' } },
  { title: '审核意见', dataIndex: 'checkerOpinion', width: '20%', overflowTooltip: true, scopedSlots: { customRender: 'checkerOpinion' } },
  { title: '状态', align: 'center', width: 200, scopedSlots: { customRender: 'action' } }]

export default {
  name: 'app',
  data () {
    return {
      columns: columns,
      operateMenu: [{
        name: '已审核',
        isShow: (record) => {
          return record.checkStatus == 1
        }
      },{
        name: '拒审核',
        isShow: (record) => {
          return record.checkStatus == 2
        }
      }],
      gridData: [],
      tags: [],
      orgAddVisible: false,
      showVisible: false,
      orgEditVisible: false,
      orgBatchVisible: false,
      userAddVisible: false,
      userEditVisible: false,
      userEditOrgVisible: false,
      userBatchVisible: false,
      roleAddVisible: false,
      roleEditVisible: false,
      roleBatchVisible: false,
      roleUserVisible: false,
      userRoleVisible: false,
      copyRoleVisible: false,
      copyResourceVisible: false,
      orgScopeVisible: false,
      similarAuthorityVisible: false,
      agentAuthorityVisible: false,
      agentAuthorityBatchVisible: false,
      permissionEffectiveTimeBatchVisible: false,
      usePermissionVisible: false,
      customResourceUsePermissionVisible: false,
      customResourceAuthorityVisible: false,
      batchOpAuthorityVisible: false,
      resourceAuthorityVisible: false,
      showChartVisible: false,
      chooseResult: '',
      chooseUserResult: '',
      chooseRoleResult: '',
      adminRole: false,
      currentExpand: [],
      createTime: [],
      createTimeStartDate: '',
      createTimeEndDate: '',
      isCheckParam: [],
      editType: '',
      rowData: {},
      selectedRowKeys: [],
      param: '',
      searchType: '',
      searchUrl: 'examine/taExamineRestService/queryExamineLog',
      queryData: []
    }
  },
  components: {
    showOrg,
    showOrgAdd,
    showOrgBatch,
    showAddUser,
    showEditUser,
    showUserEditOrg,
    showUserBatch,
    showAddRole,
    showEditRole,
    showRoleBatch,
    showCopyRole,
    showOrgScope,
    showCopyResource,
    showSimilarAuthority,
    showAgentAuthority,
    showAgentAuthorityBatch,
    showPermissionEffectiveTimeBatch,
    showUsePermissionAuthority,
    showCustomResourceUsePermission,
    showCustomResourceAuthority,
    showBatchOpAuthority,
    showResourceAuthority,
    examineChart},
  mounted () {
    this.fnQuery()
  },
  methods: {
    moment,
    pageParams () {
      const param = {}
      if (this.isCheckParam.length) {
        param.checkStatusArray = this.isCheckParam
      }

      param.createTimeStartDate = this.createTimeStartDate
      param.createTimeEndDate = this.createTimeEndDate
      param.opName = this.param

      return param
    },

    // 查询表格数据
    fnQuery: function (data = {}) {
      this.$refs.gridPager.loadData()
    },

    searchQuery () {
      this.searchType = 'search'
      this.fnQuery()
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },

    /**
     * 显示弹窗
     */
    showChart(){
      this.showChartVisible = true;
      this.queryData = {
        checkStatusArray: this.isCheckParam,
        opName: this.param,
        createTimeStartDate: this.createTimeStartDate,
        createTimeEndDate: this.createTimeEndDate,
      }
    },

    /**
     * 关闭弹窗
     */
    closeChart(load){
      this.showChartVisible = false;
    },

    onChangeTime (value, dateString) {

      if (dateString && dateString.length && dateString[0] != '' && dateString[1] != '') {
        this.createTimeStartDate = moment(dateString[0]).format('YYYY-MM-DD') + ' 00:00:00'
        this.createTimeEndDate = moment(dateString[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }else {
        this.createTimeStartDate = ''
        this.createTimeEndDate = ''
      }
      this.fnQuery()
    },

    showDetail (record) {
      this.rowData = record
      this.tags = []
      // 组织
      if (record.opObjectType == 'ORG') {
        $api.queryTags({ type: 'org' }, (data) => {
          this.tags = data.data.tags
        })
        if (record.opName.indexOf('新增') != -1) {
          this.chooseResult = 'after'
          this.orgAddVisible = true
        } else if (record.opName.indexOf('更新') != -1) {
          this.orgEditVisible = true
        } else if (record.opName.indexOf('批量') != -1) {
          this.orgBatchVisible = true
        } else if (record.opName.indexOf('删除') != -1) {
          this.chooseResult = 'before'
          this.orgAddVisible = true
        }
      } else if (record.opObjectType == 'USER') {
        if (record.opName.indexOf('新增') != -1) {
          this.chooseUserResult = 'after'
          this.userAddVisible = true
        } else if (record.opName.indexOf('更新') != -1) {
          this.userEditVisible = true
        } else if (record.opName.indexOf('批量') != -1) {
          this.roleUserVisible = false
          this.userBatchVisible = true
        } else if (record.opName.indexOf('删除') != -1) {
          this.chooseUserResult = 'before'
          this.userAddVisible = true
        }  else if (record.opName.indexOf('人员更改组织') != -1) {
          this.userEditOrgVisible = true
        } else {
          this.roleUserVisible = false
          this.userBatchVisible = true
        }
      } else if (record.opObjectType == 'ROLE' || record.opObjectType == 'ADMIN_ROLE') {
        if (record.opObjectType == 'ADMIN_ROLE') {
          this.adminRole = true
        } else {
          this.adminRole = false
        }
        if (record.opName.indexOf('新增') != -1) {
          this.chooseRoleResult = 'after'
          this.roleAddVisible = true
        } else if (record.opName.indexOf('更新') != -1) {
          this.chooseRoleResult = 'edit'
          this.roleEditVisible = true
        } else if (record.opName.indexOf('批量') != -1) {
          this.roleBatchVisible = true
          this.userRoleVisible = false
        } else if (record.opName.indexOf('删除') != -1) {
          this.chooseRoleResult = 'before'
          this.roleAddVisible = true
        } else {
          this.roleBatchVisible = true
          this.userRoleVisible = false
        }
      } else if (record.opObjectType == 'ROLE_USER') {
        if (record.opName.indexOf('角色人员') != -1) {
          this.userBatchVisible = true
          this.roleUserVisible = true
        } else if (record.opName.indexOf('人员角色') != -1) {
          this.roleBatchVisible = true
          this.userRoleVisible = true
        }
      } else if (record.opObjectType == 'ROLE_AUTHORITY') {
        if (record.opName.indexOf('角色复制') != -1) {
          this.copyRoleVisible = true
        } else if (record.opName.indexOf('权限复制') != -1) {
          this.copyResourceVisible = true
        } else if (record.opName.indexOf('管理员组织范围权限') != -1) {
          this.orgScopeVisible = true
        } else if (record.opName.indexOf('相似权限') != -1) {
          this.similarAuthorityVisible = true
        } else if (record.opName.indexOf('代理') != -1) {
          if (record.opName.indexOf('批量') != -1) {
            this.agentAuthorityBatchVisible = true
          } else {
            this.agentAuthorityVisible = true
          }
        } else if (record.opName.indexOf('有效时间') != -1) {
          this.permissionEffectiveTimeBatchVisible = true
        } else if (record.opName.indexOf('新增功能菜单权限') != -1) {
          this.usePermissionVisible = true
        }  else if (record.opName.indexOf('新增自定义对象权限') != -1) {
          this.customResourceUsePermissionVisible = true
        }else if (record.opName.indexOf('批量收回') != -1 || record.opName.indexOf('批量授权') != -1) {
          this.batchOpAuthorityVisible = true
        } else if (record.opName.indexOf('再授权') != -1) {
          if (record.opName.indexOf('自定义权限') != -1) {
            this.customResourceAuthorityVisible = true
          } else {
            this.resourceAuthorityVisible = true
          }
        }
      }
    },
    getContainer(){
      return document.getElementById('app')
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .search-box {width: 340px; line-height: 42px; }
  .center-box { text-align: center; }
  .disable-color { color: @normal-color; &:hover { color: @normal-color } }
</style>

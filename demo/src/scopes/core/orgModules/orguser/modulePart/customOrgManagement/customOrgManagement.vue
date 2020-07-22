<template id="app">
  <div class="fit" ref="customOrg">
    <ta-border-layout :layout="{left:'300px'}" :center-cfg="{layoutConStyle:{padding:0,border: 0}}">
      <!--begin 加载左侧选择栏-->
      <div slot="left">
        <ta-card :bordered="false"
                 style="width: 100%"
                 :bodyStyle="{'padding':0}">
          <div slot="title">
            自定义组织列表
            <div style="float: right">
              <ta-button @click="customOrgTypeNameVisible = true"
                         size="small"
                         icon="edit"
                         style="font-size: 12px">
                组织类别管理
              </ta-button>
            </div>
          </div>
          <a v-for="(item, index) in orgTypeNameList"
             :key="item.customOrgTypeNameId"
             :value="item.customOrgTypeNameId"
             @click="fnHandleOrgTypeNameChange(item.customOrgTypeNameId,index)">
            <div class="left-item" :class="{'activeClass':index == clickIndex}">{{item.customOrgTypeName}}</div>
          </a>
        </ta-card>
      </div>
      <ta-border-layout :layout="{header:'70px'}" :showBorder="false" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}">
        <div slot="header" class="center-box">
          <ta-input-search placeholder="请输入组织名称,自定义编码查询"
                           @search="fnQueryOrg"
                           class="search-box"
                           v-model="validId">
            <ta-button slot="enterButton" type="primary">搜索</ta-button>
          </ta-input-search>
        </div>
        <!--begin 加载左侧选择栏-->
        <div slot="centerExtraContent">
          <ta-tag-select title="有效性"
                         :data="CollectionData('EFFECTIVE')"
                         v-model="selectFilter"
                         @change="filterClick">
          </ta-tag-select>
          <div style="float: right">
            <ta-button type="primary" v-if="showAddTop" @click="fnAddTopOrg">新增组织</ta-button>
            <ta-dropdown :trigger="['click']">
              <ta-menu slot="overlay">
                <ta-menu-item :disabled="!selectedRowKeys.length">
                  <ta-popconfirm title="确认启用所选账户?" cancelText="取消" okText="确认" @confirm="fnBatchPickOrg(false)">
                    <ta-icon type="check-circle"></ta-icon>
                    <span class="mg-l12">启用</span>
                  </ta-popconfirm>
                </ta-menu-item>
                <ta-menu-divider/>
                <ta-menu-item :disabled="!selectedRowKeys.length">
                  <ta-popconfirm title="确认禁用所选账户?" cancelText="取消" okText="确认" @confirm="fnBatchBanOrg(false)">
                    <ta-icon type="stop"/>
                    <span class="mg-l12">禁用</span>
                  </ta-popconfirm>
                </ta-menu-item>
                <ta-menu-divider/>
                <ta-menu-item :disabled="!selectedRowKeys.length" @click="selectedRows.length === 0 ?$message.warning('请先选择数据'):batchDeleteVisible = true">
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
        <!--begin 加载组织人员数据-->
        <ta-table :columns="orgColumns"
                  :scroll="{ y: '100%' }"
                  :dataSource="orgData"
                  :rowSelection="{selectedRowKeys: selectedRowKeys,onChange:fnOnChange}"
                  rowKey="customOrgId"
                  :pagination="false"
                  @expand="fnLoadSubTreeData"
                  :defaultExpandedRowKeys="currentExpand"
                  :expandedRowKeys="currentExpand"
                  ref="customOrgTableRef">
          <!--处理组织名称显示-->
          <span slot="customOrgName" slot-scope="text,record" :class="{'invalidStyle': record.effective == '0' }">{{text}}</span>
          <!--处理时间格式-->
          <span slot="updateTime" slot-scope="text,record">{{moment(record.updateTime).format('YYYY-MM-DD')}}</span>
          <!--处理有效标识-->
          <span slot="effective" slot-scope="text">{{CollectionLabel('EFFECTIVE', text)}}</span>
          <!--处理操作-->
          <span slot="action" slot-scope="text, record">
            <span style="display: inline-block" :title="record.effective==='0'? '禁用的自定义组织不允许进行人员管理':''">
              <router-link
                :to="{ path: 'customOrgUser' , query: {customOrgId:record.customOrgId,customOrgPath:record.customOrgPath}}"
                :disabled="record.effective==='0'"
                :class="{'invalidStyle': record.effective == '0' }">
                人员管理
              </router-link>
            </span>
            <ta-divider type="vertical"/>
            <ta-table-operate style="display: inline-block" :operateMenu="operateMenu"></ta-table-operate>
          </span>
        </ta-table>
        <!--end 加载组织人员数据-->
      </ta-border-layout>
      <!--end 加载右侧输入栏-->
    </ta-border-layout>

    <ta-drawer destroyOnClose
               :getContainer="setContainer"
               :title="customOrg.orgTitle"
               width="500"
               placement="right"
               :visible="customOrg.visible"
               @close="customOrg.visible = false">
      <div slot="footer">
        <ta-button-group>
          <ta-button @click="fnResetForm">重置</ta-button>
          <ta-button type="primary" @click="fnUpdateOrSaveOrg" :loading="btnLoading">保存</ta-button>
        </ta-button-group>
      </div>
      <add-custom-org :org="org" @closeCustomOrgDrawer="drawerClose" ref="customOrgChild"></add-custom-org>
    </ta-drawer>
    <ta-careful-delete :visible="batchDeleteVisible" @close="batchDeleteVisible = false" @delete="fnBatchDeleteOrg(false)" title="自定义组织删除" description="选中自定义组织"></ta-careful-delete>
    <ta-modal width="80%"
              :destroy-on-close="true"
              title="自定义组织类别管理"
              :visible="customOrgTypeNameVisible"
              :centered="true"
              @cancel="fnCloseCustomOrgTypeNameModal"
              :bodyStyle="{'height':'400px'}"
              :footer="null">
      <add-custom-org-type-name></add-custom-org-type-name>
    </ta-modal>
  </div>
</template>
<script>
import treeDataUtil from '@projectCommon/js/util/treeDataUtil'
import $api from './api/index'
import moment from 'moment'

import addCustomOrg from './part/addCustomOrg'
import AddCustomOrgTypeName from './part/addCustomOrgTypeName'
// 定义列名
const orgColumns = [
  {
    title: '组织名称',
    width: '25%',
    dataIndex: 'customOrgName',
    overflowTooltip: true,
    scopedSlots: { customRender: 'customOrgName' }
  },
  {
    title: '自定义编码',
    width: '16%',
    overflowTooltip: true,
    dataIndex: 'customCode'
  },
  {
    title: '状态',
    width: '9%',
    dataIndex: 'effective',
    yesOrNoTag: true,
    scopedSlots: { customRender: 'effective' }
  },
  {
    title: '最后修改时间',
    width: '19%',
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'updateTime' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '38%',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'customOrgManagement',
  components: { AddCustomOrgTypeName, addCustomOrg },
  data () {
    return {
      selectFilter: [], // 需要过滤的数据
      clickIndex: 0, // 默认选中的下标
      tabTitle: '自定义组织列表', // tab标题
      btnLoading: false, // 保存按钮显示加载中
      currentExpand: [], // 扩展的数据
      orgTypeNameList: [], // 自定义组织类型数组
      orgTypeNameSelVal: 'baa315851d3c4a90a47889672404505d', // 自定义组织默认值id
      effectiveSelVal: null, // 默认有效性
      validId: '',
      orgColumns,
      operateMenu: [{
        name: '新增下级',
        disabled: (record) => record.effective == '0',
        title: (record) => record.effective == '0' ? '禁用的自定义组织不允许使用新增下级' : '',
        onClick: (record) => this.fnShowCustomOrgDrawer(record)
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '编辑',
          disabled: (record) => record.effective == '0',
          title: (record) => record.effective == '0' ? '禁用的自定义组织不允许使用编辑' : '',
          onClick: (record) => this.fnShowEditOrgModal(record)
        }, {
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该自定义组织?',
          onOk: (record) => {
            this.fnBatchPickOrg(record)
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该自定义组织?',
          onOk: (record) => {
            this.fnBatchBanOrg(record)
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该组织?',
          onOk: (record) => {
            this.fnBatchDeleteOrg(record)
          }
        }]
      }],
      orgData: [],
      filteredInfo: null,
      sortedInfo: null,
      customOrg: {
        orgTitle: '新增组织机构',
        orgId: '',
        orgName: '',
        visible: false
      },
      org: {},
      selectedRowKeys: [], // 选中的keys
      selectedRows: [], // 选择的记录
      customOrgTypeNameVisible: false, // 自定义组织类别信息
      defaultExpandAll: true, // 是否展开所有行
      arrayData: {}, // 行数据
      isDetailShow: false, // 是否展示详细信息
      showAddTop: false, // 是否显示新增顶级组织
      batchDeleteVisible: false
    }
  },
  mounted () {
    this.currentExpand = []
    this.fnLoadDefaultCustomOrg()
  },
  methods: {
    setContainer () {
      return this.$refs.customOrg
    },
    // 时间处理函数
    moment,
    fnOnChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    filterClick () {
      this.effectiveSelVal = this.selectFilter.join(',')
      this.fnInitDefaultOrg(this.orgTypeNameSelVal, null)
    },
    // 加载默认自定义组织
    fnLoadDefaultCustomOrg () {
      this.fnQueryAllCustomOrgTypeName()
    },
    // 点击当前行,加载子行
    fnLoadSubTreeData (expanded, record) {
      // 如果为展开,则进行请求
      const customOrgId = record.customOrgId
      if (expanded) {
        // 如果children元素不为空,则不进行加载,如果为空,则进行加载
        if (record.children && record.children.length > 0) {
          this.currentExpand.push(customOrgId)
        } else {
          const data = {
            customOrgTypeNameId: this.orgTypeNameSelVal,
            parentId: customOrgId
          }
          $api.queryCustomOrgByParentId(data, (data) => {
            record.children = data.data.customOrgList
            // 设置默认展开的层级,默认展开第一层,显示两级
            this.currentExpand.push(customOrgId)
          })
        }
      } else {
        // 如果为关闭,则进行关闭
        const index = this.currentExpand.indexOf(customOrgId)
        this.currentExpand.splice(index, 1)
      }
    },
    // 初始化组织列表信息
    fnInitDefaultOrg (val, pid) {
      const effective = this.effectiveSelVal
      let ef = null
      if (effective && effective.length > 0) { // 如果选择，则进行判断是否有逗号，没有则只选择了一个，否则为null
        const index = effective.indexOf(',')
        if (index == -1) {
          ef = effective
        }
      }
      const data = {
        customOrgTypeNameId: val,
        parentId: pid,
        effective: ef
      }
      $api.queryCustomOrgByParentId(data, (data) => {
        this.currentExpand.length = 0
        this.orgData = data.data.customOrgList
        this.$nextTick(() => {
          const hasData = this.orgData && this.orgData.length > 0
          if (hasData) {
            this.currentExpand.push(this.orgData[0].customOrgId)
          }
          if (!ef) {
            if (hasData) {
              this.showAddTop = false
            } else {
              this.showAddTop = true
            }
          }
        })
      })
    },
    fnResetForm () {
      this.$refs.customOrgChild.fnResetForm()
    },
    fnUpdateOrSaveOrg () {
      this.btnLoading = true
      this.$refs.customOrgChild.fnUpdateOrSaveOrg()
      this.btnLoading = false
    },
    fnShowCustomOrgTypeNameModal () {
      this.customOrgTypeNameVisible = true
    },
    // 查询所有自定义组织名称
    fnQueryAllCustomOrgTypeName () {
      $api.queryCustomOrgTypeName(null, (data) => {
        this.orgTypeNameList = data.data.customOrgTypeNameList
        // 判断组织是否禁用,则默认加载
        const res = this.orgTypeNameList.filter((v, index) => {
          if (v.customOrgTypeNameId === this.orgTypeNameSelVal) {
            this.clickIndex = index
            return v
          }
          return null
        })
        // 如果结果为空,则进行加载数组第一个
        if (!res || res.length === 0) {
          // 如果前面选择的已经被禁用或者删除,则重新加载
          this.orgTypeNameSelVal = this.orgTypeNameList[0].customOrgTypeNameId
        }
        this.fnInitDefaultOrg(this.orgTypeNameSelVal, null)
      })
    },
    // 处理选择组织名称
    fnHandleOrgTypeNameChange (value, index) {
      // 如果等于当前就不进行加载
      if (this.clickIndex == index) {
        return
      }
      this.orgTypeNameSelVal = value
      this.clickIndex = index
      // 先进行扩展清空
      this.currentExpand = []
      // 清空过滤项
      this.selectFilter = []
      this.showAddTop = false
      this.effectiveSelVal = null
      this.fnInitDefaultOrg(value, null)
    },
    // 查询组织
    fnQueryOrg () {
      // 如果没选择组织的话
      if (!this.orgTypeNameSelVal) {
        this.$message.warning('请选择组织类别')
        return
      }

      const validId = this.validId
      let effective = this.effectiveSelVal
      effective = (!effective || effective === 'all') ? null : effective

      const data = {
        validId: validId,
        customOrgTypeNameId: this.orgTypeNameSelVal,
        effective: effective
      }
      $api.queryCustomOrgByValidId(data, (data) => {
        this.orgData = data.data.customOrgList
      })
    },
    // 批量删除自定义组织
    fnBatchDeleteOrg (record) {
      const data = {}
      if (record) {
        data.customOrgIds = record.customOrgId
        this.selectedRows.push(record)
      } else {
        const customOrgIds = this.selectedRows.map((org) => {
          return org.customOrgId
        })
        data.customOrgIds = customOrgIds.join(',')
      }

      $api.deleteBatchCustomOrg(data, (data) => {
        this.$message.success('更新数据成功')
        this.fnInitDefaultOrg(this.orgTypeNameSelVal, null)
        // treeDataUtil.removeTreeData(this.orgData, this.selectedRows, 'customOrgId')
        this.selectedRowKeys = []
        this.selectedRows = []
        this.batchDeleteVisible = false
        // 如果移除完后发现数据的长度已经为空,那么则显示新增
        if (this.orgData.length == 0) {
          this.showAddTop = true
        }
      })
    },

    // 批量禁用组织
    fnBatchBanOrg (record) {
      const data = {}
      if (record) {
        if (record.effective == '0') {
          this.$message.warning('该记录已经已禁用，请勿重复操作！')
          return
        }
        data.customOrgIds = record.customOrgId
        data.effective = '0'
      } else {
        data.customOrgIds = this.selectedRowKeys.join(',')
        data.effective = '0'
      }

      $api.updateBatchCustomOrgStatus(data, (data) => {
        this.$message.success('更新数据成功')
        this.fnInitDefaultOrg(this.orgTypeNameSelVal, null)
        // treeDataUtil.updateTreeDataDown(this.orgData, record ? [record] : this.selectedRows, { effective: '0' }, 'customOrgId')
        this.selectedRowKeys = []
        this.selectedRows = []
      })
    },
    // 批量启用组织
    fnBatchPickOrg (record) {
      const data = {}
      if (record) {
        if (record.effective == '1' && record.isLeaf) {
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        data.customOrgIds = record.customOrgId
        data.effective = '1'
      } else {
        data.customOrgIds = this.selectedRowKeys.join(',')
        data.effective = '1'
      }

      $api.updateBatchCustomOrgStatus(data, (data) => {
        this.$message.success('更新数据成功')
        this.fnInitDefaultOrg(this.orgTypeNameSelVal, null)
        // treeDataUtil.updateTreeDataDown(this.orgData, record ? [record] : this.selectedRows, { effective: '1' }, 'customOrgId')
        this.selectedRowKeys = []
        this.selectedRows = []
      })
    },
    // 点击打开模态框
    fnShowRelationUserModal (record) {
      this.isShow = true
      $api.queryAllTaOrg(null, (data) => {
        this.orgTreeData = data.data.orgTreeData
        // 如果当前的数组为0,则进行查询

        // 加载已经选择的人员信息
        const reqData = {
          customOrgId: this.org.customOrgId,
          includeChildren: '0',
          pageNumber: 0,
          pageSize: 10
        }
        $api.queryBatchUserByCustomOrgId(reqData, (da) => {
          this.result = da.data.customOrgUserList.list
        })
      })
      this.org = record
    },
    // 导出提示
    fnExportOpenNotification () {
      this.$notification.open({
        message: '导出文件提醒',
        description: '导出文件默认为xlsx文件格式,下载完成后,请使用office等工具进行打开,如果没有,请进行安装'
      })
    },
    // 打开新增组织信息
    fnShowCustomOrgDrawer (record) {
      this.customOrg.visible = true
      this.org = {}
      this.org = record
      this.org.type = 'add'
      this.customOrg.orgTitle = '新增下级组织机构'
    },
    drawerClose (newData) {
      this.customOrg.visible = false
      // 不再手动前端构建节点，调用后台接口刷新同级节点（树状表格）或列表
      this.fnInitDefaultOrg(this.orgTypeNameSelVal, null)
      // 新增顶级组织
      // if (newData && newData.addTop) {
      //   // 如果是添加顶级组织,则直接进行加载数据
      //   this.fnInitDefaultOrg(this.orgTypeNameSelVal, null)
      //   return false
      // }
      // const type = this.org.type
      // if (type == 'edit') { // 如果是编辑,则加载当前节点的父节点
      //   // 由于不能马上进行删除并进行刷新,则进行关闭上一级的处理
      //   this.changeRowData(this.orgData, 'customOrgId', newData)
      //   if (this.org.effective != newData.effective) {
      //     treeDataUtil.updateTreeDataDown(this.org, newData, { effective: newData.effective }, 'customOrgId')
      //   }
      // } else if (type == 'add') { // 如果是新增,则加载当前节点的数据
      //   treeDataUtil.addTreeData(this.orgData, { ...this.org }, 'customOrgId', { ...newData }, this)
      // }
    },
    // 加载左侧列表选中信息
    fnLoadLeftTab () {
      // 判断组织是否禁用,则默认加载
      const res = this.orgTypeNameList.filter((v, index) => {
        if (v.customOrgTypeNameId === this.orgTypeNameSelVal) {
          this.clickIndex = index
          return v
        }
        return null
      })
      // 如果结果为空,则进行加载数组第一个
      if (!res || res.length === 0) {
        // 如果前面选择的已经被禁用或者删除,则重新加载
        this.orgTypeNameSelVal = this.orgTypeNameList[0].customOrgTypeNameId
      }
      this.fnInitDefaultOrg(this.orgTypeNameSelVal, null)
    },
    changeRowData (data, key, newData) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][key] == newData[key]) {
          data[i] = Object.assign(data[i], newData)
          if (data[i].children) {
            for (let j = 0; j < data[i].children.length; j++) {
              data[i].children[j].customOrgPath = newData.customOrgName + '/' + data[i].children[j].customOrgName
            }
          }
          break
        }
        if (data[i].children) {
          this.changeRowData(data[i].children, 'customOrgId', newData)
        }
      }
    },
    // 修改组织信息
    fnShowEditOrgModal (record) {
      this.customOrg.visible = true
      this.org = {}
      this.org = record
      this.org.type = 'edit'
      this.customOrg.orgTitle = '修改组织结构'
    },
    fnAddTopOrg () {
      this.customOrg.visible = true
      this.customOrg.orgTitle = '新增组织结构'
      this.org = {}
      this.org.type = 'addTop'
      this.org.customOrgName = ''
      this.org.customCode = ''
      this.org.customOrgTypeNameId = this.orgTypeNameSelVal
    },
    // 关闭自定义组织类别模态框
    fnCloseCustomOrgTypeNameModal () {
      this.customOrgTypeNameVisible = false
      this.fnQueryAllCustomOrgTypeName()
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .mg-l12 { margin-left: 12px; }
  .invalidStyle {
    color: @normal-color;
    &:hover {
      color: @normal-color;
    }
    cursor: not-allowed;
  }

  html a.disabled {
    color: @normal-color;
    &:hover {
      color: @normal-color;
    }
    cursor: not-allowed;
  }

  .activeClass {
    background-color: #fafafa;
    color: @primary-color;
    border-right: 6px solid @primary-color;
  }

  .search-box {
    width: 340px;
    line-height: 42px;
  }
  .left-item { width: 100%;height: 50px;line-height: 50px;padding-left: 24px; }
  .center-box { text-align:center; overflow: hidden; }
</style>

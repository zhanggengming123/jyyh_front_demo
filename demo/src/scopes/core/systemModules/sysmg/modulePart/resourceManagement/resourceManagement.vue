<template>
  <div id="content" class="fit">
    <ta-border-layout
        :layout="{header:'70px'}"
        :centerCfg="{showBar: true, barHeight: '100px'}">
      <search-head
          slot="header"
          ref="searchHeader"
          :search="handleSearchResource"
          :search-tag-param="getSearchParam"
          :advancedSearch="handleAdvancedSearchResource"></search-head>
      <div slot="centerExtraContent">
        <div style="margin-bottom: 10px">
          <ta-tag-select
              title="菜单类型"
              :data="CollectionData('RESOURCETYPE')"
              :is-multi="true"
              v-model="filterQuery.resourceType"
              @change="handleSearchFilter"></ta-tag-select>
        </div>
        <ta-tag-select
            title="安全策略"
            :data="CollectionData('SECURITYPOLICY')"
            :is-multi="true"
            v-model="filterQuery.securityPolicy"
            @change="handleSearchFilter"></ta-tag-select>
        <ta-tag-select
            title="有效性"
            :data="CollectionData('EFFECTIVE')"
            :is-multi="true"
            v-model="filterQuery.effective"
            @change="handleSearchFilter"></ta-tag-select>
        <div style="float: right">
          <ta-dropdown :trigger="['click']">
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="!resourceSelectList.length">
                <ta-popconfirm
                    title="确认启用所选资源?"
                    cancelText="取消"
                    okText="确认"
                    @confirm="handleEnableResourceBatch(false)">
                  <ta-icon type="check-circle"></ta-icon>
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!resourceSelectList.length">
                <ta-popconfirm
                    title="确认禁用所选资源?"
                    cancelText="取消"
                    okText="确认"
                    @confirm="handleDisableResourceBatch(false)">
                  <ta-icon type="stop"/>
                  <span class="mg-l12">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!resourceSelectList.length" @click="deleteVisible = true">
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
      <ta-table
          :columns="columns"
          :pagination="false"
          rowKey="resourceId"
          :defaultExpandAllRows="defaultExpandAllRows"
          @expand="handleLoadChild"
          :dataSource="gridData"
          :scroll="{ y: '100%' }"
          :rowSelection="{selectedRowKeys: resourceSelectKeysList, onChange: handleResourceSelected}">
        <span slot="resourceType" slot-scope="text">{{ CollectionLabel('RESOURCETYPE', text) }}</span>
        <span slot="effective" slot-scope="text">{{ CollectionLabel('EFFECTIVE', text) }}</span>
        <span slot="securityLevel" slot-scope="text">{{ CollectionLabel('SECURIYTLEVEL', text) }}</span>
        <span slot="securityPolicy" slot-scope="text">{{ CollectionLabel('SECURITYPOLICY', text) }}</span>

        <template slot="name" slot-scope="text,record">
          <a @click="handleViewDetail(record)">
            <span :class="{greySpan: record.effective !='1'}">{{ text }}</span>
          </a>
        </template>
        <div slot="restUrl" slot-scope="text,record">
            <span v-if="text && text.length > 0">
              <ta-tooltip
                  placement="topLeft"
                  v-for="(item,index) in getJsonArray(text)"
                  v-if="index < 1"
                  :key="item.urlId">
                <template slot="title">
                  <p>服务路径：{{ item.url }}</p>
                  <p>独立授权：{{ CollectionLabel('YESORNO', item.authorityPolicy) }}</p>
                </template>
                <ta-tag>{{ item.name }}</ta-tag>
              </ta-tooltip>
              <ta-popover
                  v-if="getJsonArray(text).length > 1"
                  placement="right"
                  title="服务列表"
                  width="360"
                  trigger="click">
                <ta-divider/>
                <div style="word-break:break-all;max-height: 420px;overflow: auto">
                  <div v-for="item in getJsonArray(text)" :key="item.urlId" style="overflow:hidden;">
                        <p>
                        <span>服务名称：{{ item.name }}</span><br/>
                        <span>服务路径：<br/>{{ item.url }}</span><br/>
                        <span>独立授权：{{ CollectionLabel('YESORNO', item.authorityPolicy) }}</span><br/>
                                                  <ta-divider/>

                        </p>
                      </div>
                </div>
                <span slot="reference" style="cursor: pointer"><ta-icon type="share-alt"/>查看</span>
              </ta-popover>
            </span>
        </div>
        <span slot="action" slot-scope="text, record">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
      </ta-table>
    </ta-border-layout>
    <ta-drawer
        title="功能资源管理"
        width="520"
        @close="handleCloseResourceDrawer"
        :getContainer="()=>this.$el"
        :visible="resourceDrawerVisible">
      <resource-data
          ref="resourceSave"
          :initData="resourceData"
          :operationType="operationType"
          @close="handleHideResourceDrawer"></resource-data>
      <template slot="footer">
        <ta-button-group>
          <ta-button @click="handleResetForm()">重置</ta-button>
          <ta-button type="primary" @click="handleSaveResource()">保存</ta-button>
        </ta-button-group>
      </template>
    </ta-drawer>
    <ta-drawer
        :getContainer="()=>this.$el"
        title="功能资源管理-查看"
        width="520"
        @close="handleCloseResourceShowDrawer"
        :visible="resourceShowDrawerVisible">
      <resource-data-show ref="resourceSaveShow" :initData="resourceData"></resource-data-show>
    </ta-drawer>
    <!--    <ta-modal title="界面元素信息"-->
    <!--              v-model="uiModelVisible"-->
    <!--              :centered="true"-->
    <!--              width="1000px"-->
    <!--              :footer="null">-->
    <!--      <resourceUi :initData="uiInitData" @close="handleHideResourceUi"></resourceUi>-->
    <!--    </ta-modal>-->
    <ta-careful-delete
        :visible="deleteVisible"
        @close="deleteVisible = false"
        @delete="handleConfirmDeleteResourceBatch(false)"
        title="资源删除"
        description="所选资源"></ta-careful-delete>
  </div>

</template>
<script>

import api from './api'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import toString from 'lodash/toString'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import searchHead from './part/searchHead'
import resourceUi from './part/resourceUi'
import resourceData from './part/resourceData'
import resourceDataShow from './part/resourceDataShow'
import treeDataUtil from '@projectCommon/js/util/treeDataUtil'

// 资源表格列定义
const columns = [
  { title: '功能名称', dataIndex: 'name', width: '20%', overflowTooltip: true, scopedSlots: { customRender: 'name', }, },
  { title: '功能路径', dataIndex: 'url', width: '14%', overflowTooltip: true, },
  { title: '服务路径', dataIndex: 'restUrl', width: '24%', overflowTooltip: true, scopedSlots: { customRender: 'restUrl', }, },
  { title: '菜单类型', dataIndex: 'resourceType', width: 100, scopedSlots: { customRender: 'resourceType', }, },
  { title: '安全策略', dataIndex: 'securityPolicy', width: 140, scopedSlots: { customRender: 'securityPolicy', }, },
  { title: '操作', key: 'action', width: 220, align: 'center', scopedSlots: { customRender: 'action', }, }
]

export default {
  name: 'resourceManagement',
  components: { searchHead, resourceUi, resourceData, resourceDataShow, },
  data () {
    return {
      gridData: [],
      columns: columns,
      operateMenu: [{
        name: '添加下级',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的资源不允许添加下级' : '',
        onClick: record => this.handleShowResourceDrawer(record, '1'),
      }, {
        name: '编辑',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的资源不允许编辑' : '',
        onClick: record => this.handleShowResourceDrawer(record, '2'),
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该资源?',
          onOk: (record) => {
            this.handleEnableResourceBatch(record)
          },
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该资源?',
          onOk: (record) => {
            this.handleDisableResourceBatch(record)
          },
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该资源?',
          onOk: (record) => {
            this.handleConfirmDeleteResourceBatch(record)
          },
        }],
      }],
      resourceSelectKeysList: [],
      resourceSelectList: [], // 表格选中的数据
      defaultExpandAllRows: true, // 控制表格是否展开全部

      isAsync: true, // 是否异步加载 (资源列表查询模式)
      // 功能资源 新增/更新
      resourceDrawerVisible: false, // 编辑区域显示标志
      operationType: '1', // 判断新增还是编辑 1新增  2编辑
      resourceData: {},
      // 功能资源 展示
      resourceShowDrawerVisible: false,
      // 界面元素管理
      uiModelVisible: false, // 界面元素显示标志
      uiInitData: {},

      // 过滤条件
      filterQuery: {
        name: '',
        code: '',
        resourceType: [],
        securityPolicy: [],
        effective: [],
      },
      deleteVisible: false,
    }
  },
  mounted () {
    // 进入页面, 默认加载资源列表
    this.fnToHandleQueryResource()
  },
  methods: {
    toString,
    getJsonArray (text) {
      let array = []
      try {
        array = JSON.parse(text)
      } catch (e) {
        array = []
      }
      return array
    },
    getSearchParam () {
      const param = {}
      let searchStr = ''
      if (this.$refs.searchHeader) searchStr = this.$refs.searchHeader.getSearchParam()
      Object.assign(this.filterQuery, {
        name: searchStr,
        code: searchStr,
      })
      Object.keys(this.filterQuery).forEach(key => {
        const keyVal = this.filterQuery[key]
        if (isString(keyVal) && keyVal.trim() !== '') {
          param[key] = keyVal
        }
        if (isArray(keyVal) && keyVal.length > 0) {
          param[key] = keyVal.join(',')
        }
      })

      return param
    },
    // 条件过滤
    handleSearchFilter () {
      this.handleSearch(this.getSearchParam())
    },
    handleSearchResource (searchParam) {
      this.handleSearch(searchParam)
    },
    // 查询事件
    handleSearch (searchParam) {
      // let searchParam = this.getSearchParam();
      // 查询结构模块全部展开
      this.defaultExpandAllRows = true
      // 功能表格数据加载模式: 有参数时全部加载,无参数时异步加载
      if (isPlainObject(searchParam) && !isEmpty(searchParam)) {
        this.isAsync = false
        api.queryResourceList(searchParam, (data) => {
          this.gridData = data.resourceList
        })
      } else {
        this.isAsync = true
        api.queryResourceListNoParam((data) => {
          this.gridData = data.resourceList
        })
      }
    },
    // 高级查询事件
    handleAdvancedSearchResource (searchParamObject) {
      this.handleSearch(searchParamObject)
    },
    // 点击行展开时  加载下级功能菜单
    handleLoadChild (expanded, record) {
      // 如果不是展开,不做任何操作
      if (expanded == false) return
      // 只有异步加载模式才会 加载子节点, 有条件查询时 ,不需要该操作
      if (this.isAsync) {
        // 已加载节点不重复请求
        if (record.children && record.children.length > 0) return
        api.loadChildResource(record, (data) => {
          // 异步加载禁用全部展开
          this.defaultExpandAllRows = false
          record.children = data.resourceList[0].children
        })
      }
    },
    // 功能资源列表 选择事件
    handleResourceSelected (selectedRowKeys, selectedRows) {
      this.resourceSelectKeysList = selectedRowKeys
      this.resourceSelectList = selectedRows
    },
    // 批量禁用资源
    handleDisableResourceBatch: function (record) {
      let resourceIds, resources
      if (record) {
        if (record.effective == '0') {
          this.$message.warning('该记录已经禁用，请勿重复操作！')
          return
        }
        resourceIds = [record.resourceId]
        resources = [record]
      } else {
        const obj = this.fnGetBatchResourceIds('禁用')
        resourceIds = obj.resourceIds
        resources = obj.resources
      }
      api.disableResourceBatch(resourceIds, (data) => {
        treeDataUtil.updateTreeDataDown(this.gridData, resources, { effective: '0', }, 'resourceId')
        this.resourceSelectKeysList = []
        this.resourceSelectList = []
      })
    },
    // 批量启用资源
    handleEnableResourceBatch: function (record) {
      let resourceIds, resources
      if (record) {
        if (record.effective == '1') {
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        resourceIds = [record.resourceId]
        resources = [record]
      } else {
        const obj = this.fnGetBatchResourceIds('启用', false)
        resourceIds = obj.resourceIds
        resources = obj.resources
      }
      api.enableResourceBatch(resourceIds, (data) => {
        treeDataUtil.updateTreeDataDown(this.gridData, resources, { effective: '1', }, 'resourceId')
        this.resourceSelectList = []
        this.resourceSelectKeysList = []
      })
    },
    // 批量删除确认
    handleConfirmDeleteResourceBatch (record) {
      let resourceIds, resources
      if (record) {
        resourceIds = [record.resourceId]
        resources = [record]
      } else {
        const obj = this.fnGetBatchResourceIds('删除')
        resourceIds = obj.resourceIds
        resources = obj.resources
      }
      api.deleteResourceBatch(resourceIds, (data) => {
        this.resourceSelectList = []
        this.resourceSelectKeysList = []
        treeDataUtil.removeTreeData(this.gridData, resources, 'resourceId')
        this.deleteVisible = false
      })
    },
    // 展示界面元素管理面板
    handleShowResourceUi (record) {
      if (record.pResourceId == '0') {
        this.$message.warning('顶级菜单无法添加表单元素', 2)
        return
      }
      if (record.uiAuthorityPolicy == '1') {
        this.uiInitData = record
        this.uiModelVisible = true
      } else {
        this.$message.warning('该菜单表单元素授权方式为继承当前菜单权限', 2)
      }
    },
    // 隐藏界面元素管理面板
    handleHideResourceUi () {
      this.uiModelVisible = false
    },
    // 展示功能资源变更 新增/编辑
    handleShowResourceDrawer (record, type) {
      if (type == '1') {
        if (record != '' && record.effective != '1') {
          this.$message.warn('禁用的功能资源节点不允许添加下级', 2)
          return
        }
      }
      this.operationType = type

      this.resourceData = record
      this.resourceDrawerVisible = true
    },
    // 关闭功能资源变更 新增/编辑
    handleCloseResourceDrawer () {
      this.handleHideResourceDrawer(false)
    },
    handleHideResourceDrawer (isReLoad) {
      this.handleResetForm()
      if (isReLoad) this.fnToHandleQueryResource()
      this.resourceDrawerVisible = false
    },
    // 展示 功能资源-查看 窗口
    handleViewDetail (record) {
      this.resourceData = record
      this.resourceShowDrawerVisible = true
    },
    // 关闭功能资源-查看 窗口
    handleCloseResourceShowDrawer () {
      this.resourceShowDrawerVisible = false
    },
    // 功能资源变更 重置
    handleResetForm () {
      this.$refs.resourceSave.fnResetForm()
    },
    // 功能资源变更 保存
    handleSaveResource () {
      this.$refs.resourceSave.fnSaveResource()
    },
    // 触发searchHeader 查询
    fnToHandleQueryResource () {
      this.$refs.searchHeader.handleSearch()
    },
    // 批量操作 公共行为提取 获取当前选中的功能资源ID
    fnGetBatchResourceIds (controlDesc, isCheckRoot) {
      if (isCheckRoot !== false) isCheckRoot = true
      if (!controlDesc) controlDesc = '处理'

      // 检查根节点 判断
      if (isCheckRoot) {
        const index = this.resourceSelectList.findIndex(node => {
          return node.pResourceId == '0'
        })
        if (index > -1) {
          this.$message.warning('当前选中的功能资源包含根节点，请重新选择', 2)
          return false
        }
      }

      const resourceIds = this.resourceSelectList.map(node => {
        return node.resourceId
      })
      return {
        resourceIds,
        resources: this.resourceSelectList,
      }
    },
  },
}

</script>
<style type="text/less" lang="less">
.ant-collapse-content > .ant-collapse-content-box {
  padding: 0;
}
</style>
<style scoped type="text/less" lang="less">
.mg-l12 {
  margin-left: 12px;
}

.greySpan {
  color: #CCCCCC;
}
</style>

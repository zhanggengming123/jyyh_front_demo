<template>
  <div class="fit">
    <ta-border-layout :layout="{header:'70px'}"
                      :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}">
      <!--搜索-->
      <div slot="header" class="center-box">
        <ta-input-search v-model="param" placeholder="站点名称、域名" class="search-box" @search="searchQuery"
                         enterButton="搜索"/>
      </div>
      <!--过滤-->
      <div slot="centerExtraContent">
        <ta-tag-select title="可用标志" :data="CollectionData('SITEEFFECTIVE')" :is-multi="false"
                       v-model="siteEffectiveParam" @change="searchQuery"></ta-tag-select>
        <ta-tag-select title="站点类型" :data="CollectionData('SITETYPE')" :is-multi="false" v-model="siteTypeParam"
                       @change="searchQuery"></ta-tag-select>
        <!--右侧操作-->
        <div style="float: right;">
          <ta-button type="primary" @click="editVisible = true; editType = '0'; rowData = {}">新增站点</ta-button>
        </div>
      </div>
      <!--显示table-->
      <ta-table :columns="columns"
                style="width:100%;"
                :pagination='false'
                rowKey="siteId"
                :data-source="gridData"
                :expandedRowKeys="currentExpand"
                @expand="loadChild"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onSelect: fnOnSelect, onSelectAll : fnOnSelectAll}">

        <span slot="effective" slot-scope="text">{{CollectionLabel('EFFECTIVE', text)}}</span>
        <span slot="siteType" slot-scope="text">{{CollectionLabel('SITETYPE', text)}}</span>
        <span slot="action" slot-scope="text, record">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
      </ta-table>
    </ta-border-layout>

    <!--编辑、新增框-->
    <add-or-edit-site :visible="editVisible" :editType="editType" :rowData="rowData" @close="editVisible = false"
                      @addSuccess="addSuccess" @queryTable="fnQuery"></add-or-edit-site>
  </div>
</template>

<script>
import $api from './api/index'

import addOrEditSite from './part/addOrEditSite'

import treeDataUtil from '@projectCommon/js/util/treeDataUtil'

const columns = [
  {
    title: '站点名称',
    dataIndex: 'siteName',
    width: '20%',
    overflowTooltip: true,
    scopedSlots: { customRender: 'siteName' }
  },
  { title: '域名', dataIndex: 'siteDomain', width: '25%' },
  {
    title: '站点类型',
    dataIndex: 'siteType',
    width: '15%',
    overflowTooltip: false,
    scopedSlots: { customRender: 'siteType' }
  },
  { title: '有效标识', dataIndex: 'effective', width: '15%', yesOrNoTag: true, scopedSlots: { customRender: 'effective' } },
  { title: '创建时间', dataIndex: 'createTime', width: '25%' },
  { title: '操作', align: 'center', width: 240, scopedSlots: { customRender: 'action' } }]

export default {
  name: 'app',
  data () {
    return {
      columns: columns,
      operateMenu: [{
        name:'访问',
        onClick:(record)=>{
          this.access(record)
        }
      },{
        name: '编辑',
        onClick: (record) => {
          this.operateClick(record, '1')
        }
      },{
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name:'添加下级',
          onClick: (record) => {
            this.operateClick(record, '2')
          }
        },{
          name: '删除',
          type: 'confirm',
          confirmTitle: '确定删除该站点?',
          onOk: (record) => {
            this.handleConfirmDeleteSite(record)
          }
        }]
      }],
      gridData: [],
      editVisible: false,
      showVisible: false,
      currentExpand: [],
      editType: '',
      rowData: {},
      dataList: [],
      selectedRowKeys: [],
      deleteSiteIds: '',
      param: '',
      siteEffectiveParam: [],
      siteTypeParam: []
    }
  },
  components: { addOrEditSite },
  mounted () {
    this.fnQuery()
  },
  methods: {

    // 查询表格数据
    fnQuery: function (data = {}) {
      $api.querySiteByParentId({ parentId: '' }, (data) => {
        this.currentExpand = []
        this.gridData = data.data.siteList
      })
    },

    // 点击搜索
    searchQuery () {
      const data = {}
      data.needSearch = false
      if (this.siteTypeParam.length) {
        data.siteType = this.siteTypeParam.join(',')
      }
      if (this.siteEffectiveParam.length) {
        data.effective = this.siteEffectiveParam.join(',')
      }
      if (this.param.length) {
        data.siteName = this.param
        data.siteDomain = this.param
      }
      if (this.siteTypeParam.length || this.siteEffectiveParam.length || this.param.length) {
        data.needSearch = true
      }

      if (data.needSearch) {
        $api.querySiteByCondition(data, (data) => {
          this.currentExpand = []
          this.gridData = data.data.siteList
        })
      } else {
        this.fnQuery()
      }
    },

    // 操作
    operateClick: function (obj, type) {
      if (type == '2' && obj.effective == '0') {
        this.$message.warning('禁用的站点不允许添加下级')
        return
      }
      this.editVisible = true
      this.editType = type
      this.rowData = obj
    },

    // 成功回调  1
    addSuccess (type, pRecords, newData) {
      if (type == '0') { // 新增
        this.gridData.push(newData)
      } else if (type == '1') { // 编辑
        this.changeRowData(this.gridData, 'siteId', newData)
      } else if (type == '2') { // 添加下级
        treeDataUtil.addTreeData(this.gridData, { ...pRecords }, 'siteId', { ...newData }, this)
      }
    },

    // 复选框选择
    fnOnSelect: function (record, selected) {
      const { selectedRowKeys, dataList } = this
      if (selected) {
        selectedRowKeys.push(record.siteId)
        dataList.push(record)
      } else {
        this.selectedRowKeys = selectedRowKeys.filter(siteId => siteId != record.siteId)
        this.dataList = dataList.filter(item => item.siteId != record.siteId)
      }
    },

    // 复选框全选
    fnOnSelectAll: function (selected, selectedRows) {
      this.dataList = [], this.selectedRowKeys = []
      if (selected) {
        selectedRows.map(item => {
          this.selectedRowKeys.push(item.siteId)
        })
        this.dataList = selectedRows
      }
    },

    // 行删除确认  1
    handleConfirmDeleteSite: function (record) {
      $api.deleteBatchSite({ siteIds: record.siteId }, () => {
        treeDataUtil.removeTreeData(this.gridData, [record], 'siteId')
        this.$message.success('删除数据成功')
      })
    },

    // 异步加载  1
    loadChild (expanded, record) {
      // 如果为展开,则进行请求
      const siteId = record.siteId
      if (expanded) {
        if (record.children && record.children.length) {
          this.currentExpand.push(siteId)
        } else {
          $api.querySiteByParentId({ parentId: siteId }, (data) => {
            record.children = data.data.siteList
            this.currentExpand.push(siteId)
          })
        }
      } else {
        // 如果为关闭,则进行关闭
        const index = this.currentExpand.indexOf(siteId)
        this.currentExpand.splice(index, 1)
      }
    },

    changeRowData (data, key, newData) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][key] == newData[key]) {
          data[i] = Object.assign({}, data[i], newData)
          break
        }
        if (data[i].children) {
          this.changeRowData(data[i].children, 'siteId', newData)
        }
      }
    },

    // 访问站点网址
    access (record) {
      const siteDomain = record.siteDomain
      window.open(siteDomain)
    }

  }
}
</script>
<style lang="less" scoped type="text/less">
  .search-box {
    width: 340px;
    line-height: 42px;
  }

  .center-box {
    text-align: center;
    overflow: hidden;
  }

  .disable-color {
    color:@text-color-secondary;

    &:hover {
      color: @text-color-secondary;
    }
  }
</style>

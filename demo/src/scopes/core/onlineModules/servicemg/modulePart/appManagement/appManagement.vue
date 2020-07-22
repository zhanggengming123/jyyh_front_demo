<template>
  <div class="fit">

    <ta-border-layout :layout="{header:'70px'}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}">
      <div slot="header" class="center-box">
        <ta-input-search v-model="param" placeholder="应用名称" class="search-box" @search="searchQuery"  enterButton="搜索"  />
      </div>
      <!--过滤-->
      <div slot="centerExtraContent">
        <ta-tag-select title="应用类型" :data="CollectionData('SITETYPE')" v-model="appTypeParam" @change="searchQuery" class="mg-r"></ta-tag-select>
        <ta-tag-select title="可用标识" :data="CollectionData('AVAILABLE')" v-model="appEffectiveParam" @change="searchQuery"></ta-tag-select>
        <!--右侧操作-->
        <div style="float: right;">
          <ta-button type="primary" @click="editVisible = true; rowData = {}">新增应用</ta-button>
        </div>
      </div>
      <!--显示table-->
      <ta-table :columns="columns" style="width:100%;" :pagination='false' rowKey="appId" :data-source="gridData" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
        <span slot="appName" slot-scope="text, record"><a @click="fnVisit(record)">{{text}}</a></span>
        <span slot="appType" slot-scope="text">{{CollectionLabel('SITETYPE', text)}}</span>
        <span slot="appEffective" slot-scope="text">{{CollectionLabel('AVAILABLE', text)}}</span>

        <span slot="operation" slot-scope="text, record, index">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
      </ta-table>
      <ta-pagination style="float: right; margin-top: 10px;" showSizeChanger showQuickJumper :dataSource.sync="gridData" :defaultPageSize="10" :params="pageParams" :url="appSearchUrl" ref="gridPager" />
    </ta-border-layout>

    <!--编辑、新增框-->
    <add-or-edit-app :visible="editVisible" :rowData="rowData" @close="editVisible = false" @search="fnQuery" @editSuccess="editSuccess"></add-or-edit-app>
  </div>
</template>

<script>
  import $api from './api/index'
  import addOrEditApp from './part/addOrEditApp'

  const columns = [
  { title: '应用名称', dataIndex: 'appName', width: '50%', overflowTooltip: true, scopedSlots: {customRender: 'appName'} },
  { title: '应用类型', dataIndex: 'appType', width: '25%', overflowTooltip: false, scopedSlots: {customRender: 'appType'} },
  { title: '可用标识', dataIndex: 'appEffective', width: '25%', yesOrNoTag: true, scopedSlots: {customRender: 'appEffective'} },
  { title: '操作', align: 'center', width: 240, scopedSlots: {customRender: 'operation'} }
]

export default {
  name: 'app',
  data () {
    return {
      columns,
      operateMenu: [{
        name: '编辑',
        onClick: (record, index) => {
          this.editVisible = true
          this.rowData = record
          this.editIndex = index
        }
      }, {
        name: '删除',
        type: 'confirm',
        confirmTitle: '确认删除该应用?',
        onOk: (record) => {
          this.deleteOne(record.appId)
        }
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '进入设置',
          onClick: (record) => {
            this.fnVisit(record)
          }
        }, {
          name: '访问'
        }]
      }],
      gridData: [],
      selectedRowKeys: [],
      param: '',
      appTypeParam: [],
      appEffectiveParam: [],
      editVisible: false,
      editIndex: '',
      rowData: {},
      appSearchUrl: 'appMg/appMgRestService/queryAppVosByCondition',
      searchType: 'normal'
    }
  },
  components: {addOrEditApp},
  mounted () {
    this.fnQuery()
  },
  methods: {
    pageParams () {
      let param = {}
      if (this.searchType == 'search') {
        if (this.param.length) { param.appName = this.param }
        if (this.appTypeParam.length) { param.appType = this.appTypeParam[0] }
        if (this.appEffectiveParam.length) { param.appEffective = this.appEffectiveParam[0] }
      }
      return param
    },
    fnQuery () {
      this.$refs.gridPager.loadData()
    },
    searchQuery () {
      this.searchType = 'search'
      this.fnQuery()
    },
    editSuccess (data) {
      this.gridData[this.editIndex] = Object.assign({}, this.rowData, data)
    },
    deleteOne (appId) {
      $api.removeAppById({appId: appId}, (data) => {
        this.$message.success('删除应用成功')
        this.fnQuery()
      })
    },
    fnVisit (record) {
      const { href } = this.$router.resolve({path: 'assemble', query: {appId: record.appId, appName: record.appName}})
      window.open(href, '_blank')
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>
<style lang="less" scoped type="less/less">
  .search-box {width: 340px; line-height: 42px; }
  .center-box { text-align: center; overflow: hidden; }
  .mg-r { margin-right: 30px; }
  .no-cursor { cursor: default; }
</style>

<template>
  <div id="jobDatasourceConfig" class="fit">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}" :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-input-search placeholder="请输入数据源名称" class="search-box" v-model="datasourceName" @search="loadData" enterButton="搜索"></ta-input-search>
      </div>
      <div slot="centerExtraContent">
        <div style="float: right">
          <ta-button type="primary" @click="visible = true;">新增</ta-button>
          <ta-button :disabled="btnDisable" @click="batchDelete">批量删除</ta-button>
        </div>
      </div>
      <ta-table :columns="columns" :dataSource="gridData" rowKey="datasourceId"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onSelect: fnOnSelect, onSelectAll: fnOnSelectAll}"
                :pagination=false>
                <span slot="action" slot-scope="text, record">
                  <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
                </span>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          style="float: right; margin-top: 10px;"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="gridData"
          :defaultPageSize="10"
          :params="pageParams"
          url="jobmg/elasticjob/jobDatasourceManagementRestService/getJobDatasource"
          ref="gridPager"
        >
        </ta-pagination>
      </div>
    </ta-border-layout>
    <add-datasource :visible="visible" @close="visible = false" @queryTable="loadData"></add-datasource>
  </div>
</template>
<script>

import addDatasource from './addDatasource.vue'
import api from '../api/index'

const columns = [{
  title: '数据源名称',
  dataIndex: 'datasourceName',
  width: '20%'
}, {
  title: '数据源驱动',
  dataIndex: 'driver',
  width: '20%',
  overflowTooltip: true
}, {
  title: '数据源url',
  dataIndex: 'url',
  width: '30%',
  overflowTooltip: true
}, {
  title: '数据源用户',
  dataIndex: 'userName',
  width: '10%'
}, {
  title: '操作选项',
  dataIndex: 'action',
  width: '20%',
  scopedSlots: {customRender: 'action'},
  align: 'center'
}]

export default {
  name: 'jobDatasourceConfig',
  data () {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      columns,
      operateMenu: [{
        name: '历史轨迹',
        onClick:(record)=>{
          this.routeToJobExecutionTrace(record)
        }
      },{
        name: '历史状态',
        onClick:(record)=>{
          this.routeToJobStatusTrace(record)
        }
      },{
        name: '删除',
        type: 'confirm',
        confirmTitle: '确定要删除吗?',
        isShow:(record)=>{
          return this.gridData.length
        },
        onOk:(record)=>{
          this.onDelete(record.datasourceId)
        }
      }],
      gridData: [],
      datasourceName: '',
      visible: false
    }
  },

  components: {addDatasource},

  mounted: function () {
    this.loadData()
  },

  computed: {
    btnDisable () {
      return !this.selectedRowKeys.length
    }
  },

  methods: {
    loadData: function () {
      this.$refs.gridPager.loadData((data) => {
        this.selectedRowKeys = []
        this.selectedRows = []
      })
    },

    pageParams: function () {
      return {
        datasourceName: this.datasourceName
      }
    },

    fnOnSelect: function (record, selected) {
      const {selectedRowKeys, selectedRows} = this
      if (selected) {
        selectedRowKeys.push(record.datasourceId)
        selectedRows.push(record)
      } else {
        this.selectedRowKeys = selectedRowKeys.filter(datasourceId => datasourceId != record.datasourceId)
        this.selectedRows = selectedRows.filter(item => item.datasourceId != record.datasourceId)
      }
    },

    fnOnSelectAll: function (selected, selectedRows) {
      this.selectedRows = []
      this.selectedRowKeys = []
      if (selected) {
        selectedRows.map(item => {
          this.selectedRowKeys.push(item.datasourceId)
        })
        this.selectedRows = selectedRows
      }
    },

    onDelete: function (datasourceId) {
      api.deleteJobDatasource({datasourceIds: datasourceId}, (result) => {
        this.$message.success('删除成功')
        this.loadData()
      })
    },

    batchDelete () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择数据')
        return
      }
      this.$confirm({
        title: '批量删除数据源',
        content: '确认删除数据源吗?',
        cancelText: '取消',
        okText: '确认',
        onOk: () => {
          let datasourceIds = this.selectedRows.map(function (record) {
            return record.datasourceId
          })
          api.deleteJobDatasource({datasourceIds: datasourceIds.join(',')}, (result) => {
            this.$message.success('批量删除成功')
            this.loadData()
          })
        }
      })
    },

    routeToJobExecutionTrace (record) {
      this.$router.push(
        {
          name: 'jobExecutionTrace',
          params: {
            dsData: record
          }
        }
      )
    },

    routeToJobStatusTrace (record) {
      this.$router.push(
        {
          name: 'jobStatusTrace',
          params: {
            dsData: record
          }
        }
      )
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .search-box { width: 340px; line-height: 42px; }
  .center-box { text-align: center; overflow: hidden; }
</style>

<template>
  <div class="fit" id="auditLog">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}" :footer-cfg="{showBorder: false}">
      <!--搜索-->
      <div slot="header" class="center-box">
        <ta-input-search v-model="param" placeholder="用户搜索" class="search-box" @search="searchQuery"  enterButton="搜索"  />
      </div>
      <!--过滤-->
      <div slot="centerExtraContent">

        <ta-range-picker
          v-model="createTime"
          :placeholder="['开始时间', '结束时间']"
          @change="onChange"
          class="distance"
          :get-calendar-container="getContainer"
        />
        <ta-select allowClear placeholder="请选择审计类型" v-model="auditType" @change="loadData" style="width: 220px" class="filter-name">
          <ta-select-option v-for="item in CollectionData('AUDITTYPE')" :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
        </ta-select>
        <!-- eChart-->
        <div style="float: right">
        <ta-button icon="area-chart" @click="showChart()" />
        </div>
      </div>
      <!-- table-->
      <ta-table :columns="columns" :dataSource="gridData" :pagination=false>
        <span slot="auditType" slot-scope="text">{{CollectionLabel('AUDITTYPE', text)}}</span>
        <span slot="storeType" slot-scope="text">{{CollectionLabel('STORETYPE', text)}}</span>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          style="float: right; margin-top: 10px;"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="gridData"
          :params="pageParams"
          url="audit/taAuditResService/audit"
          ref="gridPager"
        />
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
      :title="'数据分析（默认显示最近7天）'"
      :closable=true
      @close="closeChart(false)"
    >
      <audit-chart ref="auditChart" :queryData="queryData" @closeModal="closeChart"></audit-chart>
    </ta-modal>

  </div>
</template>



<script>
import moment from 'moment'
import auditChart from './part/auditChart'
import $api from './api'

const columns = [
  { title: '用户', dataIndex: 'name', width: '10%', scopedSlots: { customRender: 'name' } },
  { title: '审计内容', dataIndex: 'auditContent', width: '10%', overflowTooltip: true, scopedSlots: { customRender: 'auditContent' } },
  { title: '审计时间', dataIndex: 'auditDate', width: '15%', scopedSlots: { customRender: 'auditDate' } },
  { title: 'excel名', dataIndex: 'excelName', width: '15%', overflowTooltip: true, scopedSlots: { customRender: 'excelName' } },
  { title: 'excel别名', dataIndex: 'aliasExcelName', width: '10%', overflowTooltip: true, scopedSlots: { customRender: 'aliasExcelName' } },
  { title: '审计类型', dataIndex: 'auditType', width: '10%', scopedSlots: { customRender: 'auditType' } },
  { title: '存储类型', dataIndex: 'storeType', width: '8%', scopedSlots: { customRender: 'storeType' } },
  ]
export default {
  name: 'app',
  data () {
    return {
      columns: columns,
      onlineDate: null,
      onlineStartTime: null,
      onlineEndTime: null,
      createTime: [],
      gridData: [],
      param: '',
      startDate: '',
      endDate: '',
      showChartVisible: false,
      accessDenyTypeParam: '',
      auditType: undefined,
      queryData: []
    }
  },
  components: {auditChart},
  mounted () {
    this.loadData()
  },
  methods: {
    moment,
    pageParams () {
      let param = {}
      param.startDate = this.startDate
      param.endDate = this.endDate
      param.name = this.param
      param.auditType = this.auditType
      return param
    },

    onChange (value, dateString) {
      if (dateString && dateString.length && dateString[0] != '' && dateString[1] != '') {
        this.startDate = moment(dateString[0]).format('YYYY-MM-DD') + ' 00:00:00'
        this.endDate = moment(dateString[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }else {
        this.startDate = ''
        this.endDate = ''
      }
      this.loadData()
    },

    // 查询表格数据
    loadData () {
      this.$refs.gridPager.loadData()
    },

    searchQuery () {
      this.loadData()
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },

    /**
     * 关闭弹窗
     */
    closeChart(load){
      this.showChartVisible = false;
    },
    /**
     * 显示弹窗
     */
    showChart(){
      this.showChartVisible = true;

      this.queryData = {
        startDate: this.startDate,
        endDate: this.endDate,
        name: this.param,
        auditType: this.auditType,
      }
    },
    getContainer(){
      return document.getElementById('auditLog')
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .search-box {width: 340px; line-height: 42px; }
  .center-box { text-align: center; }
  .disable-color { color: @normal-color; &:hover { color: @normal-color } }
  .distance {
    margin-top: 4px;
    margin-left: 20px;
    margin-right: 20px;
  }
  .filter-name {
    margin-left: 20px
  }
</style>

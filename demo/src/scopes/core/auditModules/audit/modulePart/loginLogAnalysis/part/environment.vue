<template>
  <div id="environment" class="fit">
    <ta-border-layout :layout="{header:'0px'}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}" :showBorder="false">
      <!--过滤-->
      <div slot="centerExtraContent">
        <!--<ta-range-picker-->
          <!--v-model="createTime"-->
          <!--:placeholder="['开始时间', '结束时间']"-->
          <!--@change="onChange"-->
        <!--/>-->
        <div style="float: right">
          <ta-button icon="area-chart" @click="showEnvironmentChart()" />
          <ta-button @click="exportData()" >导出</ta-button>
        </div>
      </div>
      <!-- table-->
      <ta-table :columns="environmentColumns" :dataSource="environmentGridData" :pagination=false>
        <a slot="numday" slot-scope="text, record" @click="clickNumber('day',record)">{{text}}</a>
        <a slot="numweek" slot-scope="text, record" @click="clickNumber('week',record)">{{text}}</a>
        <a slot="nummonth" slot-scope="text, record" @click="clickNumber('month',record)">{{text}}</a>
        <a slot="numyear" slot-scope="text, record" @click="clickNumber('year',record)">{{text}}</a>
        <a slot="numall" slot-scope="text, record" @click="clickNumber('all',record)">{{text}}</a>
      </ta-table>

    </ta-border-layout>

    <ta-modal
      centered
      v-model="showChartVisible"
      width="1000px"
      :bodyStyle="{height:'600px',padding:'0'}"
      :footer="null"
      :destroyOnClose=true
      :maskClosable=true
      :title="'数据分析'"
      :closable=true
      @close="closeEnvironmentChart(false)"
    >
      <environment-chart ref="loginHistoryChart" @closeModal="closeEnvironmentChart"></environment-chart>
    </ta-modal>

    <ta-modal :title="pieModelTitle"
              :visible="pieModelVisible"
              :destroyOnClose=true
              :centered="true"
              width="1200px"
              :bodyStyle="{'height': '520px', 'padding':'0px 0px 0px 0px', 'overflow-y':'auto'}"
              :footer="null"
              @cancel="fnCloseModel">
      <environment-detail :bindData="bindData" ref="environmentChart"></environment-detail>
    </ta-modal>
  </div>
</template>
<script>
import $api from '../api'
import $auditApi from '../../api'
import TaECharts from '@yh/ta404-ui/es/echarts'
import environmentDetail from './environmentDetail.vue'
import environmentChart from './enviromentChart.vue'


const environmentColumns = [
  {title: '客户端系统版本', dataIndex: 'typecs', key: 'typecs', align: 'center', width: 280},
  {title: '24小时内', dataIndex: 'numday', key: 'numday', align: 'center', scopedSlots: {customRender: 'numday'}, width: 280},
  {title: '1周内', dataIndex: 'numweek', key: 'numweek', align: 'center', scopedSlots: {customRender: 'numweek'}, width: 280},
  {title: '1月内', dataIndex: 'nummonth', key: 'nummonth', align: 'center', scopedSlots: {customRender: 'nummonth'}, width: 280},
  {title: '1年内', dataIndex: 'numyear', key: 'numyear', align: 'center', scopedSlots: {customRender: 'numyear'}, width: 280},
  {title: '总计', key: 'numall', dataIndex: 'numall', align: 'center', scopedSlots: {customRender: 'numall'}, width: 280}
]
export default {
  name: 'environment',
  components: {environmentDetail, TaECharts, environmentChart},
  data () {
    this.chartEvents = {
      click: (e) => { this.getEnvironmentDetailInfo(e.name) }
    }
    return {
      showChartVisible: false,
      loginName: '',
      startDate: null,
      endDate: null,
      radioValue: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      environmentColumns,
      environmentGridData: [],
      bindData: {},
      pieModelVisible: false,
      pieModelTitle: '',
      chartSetting: {
        title: {
          text: '客户端系统版本统计',
          top: 10,
          x: 'center'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          top: 40,
          right: 10
        },
        settings: {
          selectedMode: 'single',
          hoverAnimation: false
        }
      },
      chartData: {
        columns: ['name', 'value'],
        rows: []
      }
    }
  },
  mounted: function () {
    this.getEnvironmentInfo()
  },
  methods: {
    getEnvironmentInfo () {
      let startDate = this.startDate ? this.startDate.format('YYYY-MM-DD') : ''
      let endDate = this.endDate ? this.endDate.format('YYYY-MM-DD') : ''
      if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        this.$message.error('开始日期不能大于结束日期')
        return
      }
      let data = { startDate: startDate, endDate: endDate }
      if (this.radioValue === 1) {
        $api.analysisClientSystemInfo(data, (result) => {
          this.chartSetting.title.text = '客户端系统版本统计'
          this.chartData.rows = this.taGetSeriesData(result.data.csSeriesData)
          this.environmentColumns.shift()
          this.environmentColumns.unshift({
            title: '客户端系统版本',
            dataIndex: 'typecs',
            key: 'typecs',
            width: 280,
            align: 'center'
          })
          this.environmentGridData = result.data.csEnvironmentGridData
          if (result.data.csSeriesData.length === 0) {
            this.$message.error('未获取到图表数据')
          }
        })
      } else if (this.radioValue === 2) {
        $api.analysisClientScreenInfo(data, (result) => {
          this.chartSetting.title.text = '客户端分辨率统计'
          this.chartData.rows = this.taGetSeriesData(result.data.cssSeriesData)
          this.environmentColumns.shift()
          this.environmentColumns.unshift({
            title: '客户端分辨率',
            dataIndex: 'typecss',
            key: 'typecss',
            width: 280,
            align: 'center'
          })
          this.environmentGridData = result.data.cssEnvironmentGridData
          if (result.data.cssSeriesData.length === 0) {
            this.$message.error('未获取到图表数据')
          }
        })
      } else if (this.radioValue === 3) {
        $api.analysisClientBrowserInfo(data, (result) => {
          this.chartSetting.title.text = '客户端浏览器版本统计'
          this.chartData.rows = this.taGetSeriesData(result.data.cbSeriesData)
          this.environmentColumns.shift()
          this.environmentColumns.unshift({
            title: '客户端浏览器版本',
            dataIndex: 'typecb',
            key: 'typecb',
            width: 280,
            align: 'center'
          })
          this.environmentGridData = result.data.cbEnvironmentGridData
          if (result.data.cbSeriesData.length === 0) {
            this.$message.error('未获取到图表数据')
          }
        })
      }
    },
    getEnvironmentDetailInfo (name) {
      let startDate = this.startDate ? this.startDate.format('YYYY-MM-DD') : ''
      let endDate = this.endDate ? this.endDate.format('YYYY-MM-DD') : ''
      if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        this.$message.error('开始日期不能大于结束日期')
        return
      }
      this.bindData.startDate = startDate
      this.bindData.endDate = endDate
      this.pieModelTitle = name + '--' + '用户登录环境查询'
      if (this.radioValue === 1) {
        this.bindData.isTypecs = true
        this.bindData.typecs = name
      } else if (this.radioValue === 2) {
        this.bindData.isTypecss = true
        this.bindData.typecss = name
      } else if (this.radioValue === 3) {
        this.bindData.isTypecb = true
        this.bindData.typecb = name
      }
      this.pieModelVisible = true
    },
    clickNumber (timeType, record) {
      this.bindData.gridColumnType = timeType
      let name
      if (this.radioValue === 1) {
        name = record.typecs
      } else if (this.radioValue === 2) {
        name = record.typecss
      } else if (this.radioValue === 3) {
        name = record.typecb
      }
      this.getEnvironmentDetailInfo(name)
    },
    environmentReload () {
      this.startDate = null
      this.endDate = null
    },
    taGetSeriesData (data) {
      let rdata = []
      for (let i in data) {
        rdata.push({'name': data[i].type, 'value': data[i].count})
      }
      return rdata
    },
    fnCloseModel () {
      this.pieModelVisible = false
      this.bindData = {}
    },
    closeEnvironmentChart(){
      this.showChartVisible = false;
    },
    showEnvironmentChart(){
      this.showChartVisible = true;
    },
    searchQuery: function() {
      this.getEnvironmentInfo()
    },

    // 导出
    exportData(){
      let startDate = this.startDate ? this.startDate.format('YYYY-MM-DD') : ''
      let endDate = this.endDate ? this.endDate.format('YYYY-MM-DD') : ''
      if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        this.$message.error('开始日期不能大于结束日期')
        return
      }
      let data = { startDate: startDate, endDate: endDate }
      $auditApi.exportExcel(data, 'audit/auditExportRestService/loginLogAnalysis');
    }
  }
}
</script>

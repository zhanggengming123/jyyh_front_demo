<template>
  <div>
    <ta-row :gutter="10">
      <ta-col :span="4">
        <ta-date-picker v-model="startDate" format="YYYY-MM-DD" placeholder="开始日期" style="width: 100%;"/>
      </ta-col>
      <ta-col :span="4">
        <ta-date-picker v-model="endDate" format="YYYY-MM-DD" placeholder="结束日期" style="width: 100%;"/>
      </ta-col>
      <ta-col :span="16">
        <ta-button-group>
          <ta-button type='primary' icon="search" @click="getEnvironmentInfo">查询</ta-button>
          <ta-button icon="reload" @click="environmentReload">重置</ta-button>
        </ta-button-group>
      </ta-col>
    </ta-row>
    <ta-divider style="padding-top: 5px;margin-top: 7px;margin-bottom: 0;background-color: #F5F5F5;"></ta-divider>
    <div style="position:absolute; left: 30px; height: 80px; z-index:99; margin-top: 10px;">
      <ta-radio-group v-model="radioValue" @change="getEnvironmentInfo">
        <ta-radio :style="radioStyle" :value="1">客户端系统版本分析</ta-radio>
        <ta-radio :style="radioStyle" :value="2">客户端分辨率分析</ta-radio>
        <ta-radio :style="radioStyle" :value="3">客户端浏览器版本分析</ta-radio>
      </ta-radio-group>
    </div>
    <ta-e-charts
      height="360px"
      :chartsType="'pie'"
      :data="chartData"
      :settings="chartSetting.settings"
      :legend="chartSetting.legend"
      :title="chartSetting.title"
      :events="chartEvents">
    </ta-e-charts>
  </div>
</template>



<script>
import api from '../api'
import moment from 'moment/moment'
import TaECharts from '@yh/ta404-ui/es/echarts'

const environmentColumns = [
  {title: '客户端系统版本', dataIndex: 'typecs', key: 'typecs', align: 'center', width: 280},
  {title: '24小时内', dataIndex: 'numday', key: 'numday', align: 'center', scopedSlots: {customRender: 'numday'}, width: 280},
  {title: '1周内', dataIndex: 'numweek', key: 'numweek', align: 'center', scopedSlots: {customRender: 'numweek'}, width: 280},
  {title: '1月内', dataIndex: 'nummonth', key: 'nummonth', align: 'center', scopedSlots: {customRender: 'nummonth'}, width: 280},
  {title: '1年内', dataIndex: 'numyear', key: 'numyear', align: 'center', scopedSlots: {customRender: 'numyear'}, width: 280},
  {title: '总计', key: 'numall', dataIndex: 'numall', align: 'center', scopedSlots: {customRender: 'numall'}, width: 280}
]

export default {
  name: 'environmentChart',
  components: { TaECharts },
  data () {
    this.chartEvents = {
      click: (e) => { this.getEnvironmentDetailInfo(e.name) }
    }
    return {
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
    moment,
    getEnvironmentInfo () {
      let startDate = this.startDate ? this.startDate.format('YYYY-MM-DD') : ''
      let endDate = this.endDate ? this.endDate.format('YYYY-MM-DD') : ''
      if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        this.$message.error('开始日期不能大于结束日期')
        return
      }
      let data = { startDate: startDate, endDate: endDate }
      if (this.radioValue === 1) {
        api.analysisClientSystemInfo(data, (result) => {
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
        api.analysisClientScreenInfo(data, (result) => {
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
        api.analysisClientBrowserInfo(data, (result) => {
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

  }
}
</script>


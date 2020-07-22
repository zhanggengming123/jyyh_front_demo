<template>
  <div id="online" class="fit">
    <ta-border-layout :layout="{header:'345px'}" :header-cfg="{showBorder: false, layoutConStyle: {lineHeight: '46px'}}" :showBorder="false">
      <div slot="header">
        <ta-row :gutter="10">
          <ta-col :span="3">
            <ta-date-picker
              v-model="onlineDate"
              format="YYYY-MM-DD"
              placeholder="开始日期"
              style="width: 100%"
            />
          </ta-col>
          <ta-col :span="3">
            <ta-time-picker v-model="onlineStartTime" :open.sync="onlineStartOpen" format="HH:mm" placeholder="开始时间" style="width: 100%">
              <ta-button slot="addon" size="small" type="primary" @click="handleOnlineClose">确定</ta-button>
            </ta-time-picker>
          </ta-col>
          <ta-col :span="3">
            <ta-time-picker v-model="onlineEndTime" :open.sync="onlineEndOpen" format="HH:mm" placeholder="结束时间" style="width: 100%">
              <ta-button slot="addon" size="small" type="primary" @click="handleOnlineClose">确定</ta-button>
            </ta-time-picker>
          </ta-col>
          <ta-col :span="15">
            <ta-button-group>
              <ta-button type='primary' icon="search" @click="getOnlineInfo">查询</ta-button>
              <ta-button icon="reload" @click="onlineReload">重置</ta-button>
            </ta-button-group>
          </ta-col>
        </ta-row>
        <ta-divider style="padding-top: 5px;margin-top: 7px;margin-bottom: 0;background-color: #F5F5F5;"></ta-divider>
        <div style="height: 255px;">
          <ta-e-charts
            height="255px"
            :chartsType="'line'"
            :data="chartData"
            :legend="chartSetting.legend"
            :tooltip="chartSetting.tooltip"
            :xAxis="chartSetting.xAxis"
            :yAxis="chartSetting.yAxis"
            :grid="chartSetting.grid"
            :toolbox="chartSetting.toolbox"
          >
          </ta-e-charts>
        </div>
      </div>
      <ta-table :columns="onlineColumns" :dataSource="onlineGridData" :pagination=false />
      <ta-pagination
        style="float: right; margin-top: 10px;"
        showSizeChanger
        showQuickJumper
        :dataSource.sync="onlineGridData"
        :defaultPageSize="6"
        :params="onlinePageParams"
        url="logmg/loginLog/loginLogAnalysisRestService/getOnlineInfo"
        ref="onlineGridPager"
      />
    </ta-border-layout>
  </div>
</template>

<script>
import TaECharts from '@yh/ta404-ui/es/echarts'
import api from '../api'
import moment from 'moment'
const onlineColumns = [
  {
    title: '登录ID',
    dataIndex: 'loginId',
    key: 'loginId',
    width: 244,
    align: 'center'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: 244
  }, {
    title: '登录时间',
    dataIndex: 'loginTime',
    key: 'loginTime',
    scopedSlots: {customRender: 'onlineLoginTime'},
    align: 'center',
    width: 244
  }, {
    title: '客户端ip',
    dataIndex: 'clientIp',
    key: 'clientIp',
    align: 'center',
    width: 244
  }, {
    title: '客户端系统',
    dataIndex: 'clientSystem',
    key: 'clientSystem',
    align: 'center',
    width: 244
  }, {
    title: '客户端浏览器',
    key: 'clientBrowser',
    dataIndex: 'clientBrowser',
    align: 'center',
    width: 244
  }, {
    title: '客户端分辨率',
    key: 'clientScreenSize',
    dataIndex: 'clientScreenSize',
    align: 'center',
    width: 244
  }]

export default {
  name: 'online',
  components: { TaECharts },
  data () {
    return {
      onlineDate: null,
      onlineStartTime: null,
      onlineEndTime: null,
      onlineStartOpen: false,
      onlineEndOpen: false,
      isClickOnlineTab: false,
      onlineChartData: [],
      onlineColumns,
      onlineGridData: [],
      onlineXInterval: 4,
      onlineXdata: [],
      onlineSeriesData: [],
      onlineLine: {},
      chartSetting: {
        legend: {
          top: 10,
          formatter: '时点在线人数'
        },
        tooltip: {
          formatter: (data) => {
            return data.seriesName + '<br/>' + data.data[0] + ' (' + data.data[1] + '人)'
          }
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}人'
          }
        },
        grid: {
          bottom: 10
        },
        toolbox: {
          feature: {
            magicType: {type: ['line', 'bar']},
            saveAsImage: {}
          }
        }
      },
      chartData: {
        columns: ['日期', '时点在线人数'],
        rows: []
      }
    }
  },
  mounted: function () {
    this.loadData()
  },
  methods: {
    moment,
    onlinePageParams: function () {
      return {}
    },
    loadData () {
      let timeData = {}
      api.getSysTime(timeData, (result) => {
        this.onlineDate = moment(result.data.sysdate, 'YYYY-MM-DD')
        this.onlineStartTime = moment(result.data.sysStartTime, 'HH:mm')
        this.onlineEndTime = moment(result.data.sysEndTime, 'HH:mm')
        let searchDate = this.onlineDate ? this.onlineDate.format('YYYY-MM-DD') : ''
        let onlineStartTime = this.onlineStartTime ? this.onlineStartTime.format('HH:mm') : ''
        let onlineEndTime = this.onlineEndTime ? this.onlineEndTime.format('HH:mm') : ''
        let data = {
          searchDate: searchDate,
          startTime: onlineStartTime,
          endTime: onlineEndTime
        }
        api.analysisOnlineStatInfo(data, (result) => {
          this.onlineChartData = result.data.onlineChartData
          this.onlineXdata = api.getStatLogInfoXdata(this, 'online')
          this.onlineSeriesData = api.sortStatLogDataByHours(this, 'online')
          let showData = []
          this.onlineXdata.map((item, index) => {
            showData.push({'日期': item, '时点在线人数': this.onlineSeriesData[index]})
          })
          this.chartData.rows = showData
        })
        this.$refs.onlineGridPager.loadData()
      })
    },
    getOnlineInfo () {
      if (!this.onlineDate) {
        this.$message.warning('开始日期不能为空')
        return
      }
      if (!this.onlineStartTime) {
        this.$message.warning('开始时间不能为空')
        return
      }
      if (!this.onlineEndTime) {
        this.$message.warning('结束时间不能为空')
        return
      }
      if (new Date(this.onlineDate.format('YYYY-MM-DD') + ' ' + this.onlineStartTime.format('HH:mm')).getTime() > new Date(this.onlineDate.format('YYYY-MM-DD') + ' ' + this.onlineEndTime.format('HH:mm')).getTime()) {
        this.$message.warning('开始时间不能大于结束时间')
        return
      }
      let searchDate = this.onlineDate.format('YYYY-MM-DD')
      let onlineStartTime = this.onlineStartTime.format('HH:mm')
      let onlineEndTime = this.onlineEndTime.format('HH:mm')
      let data = {
        searchDate: searchDate,
        startTime: onlineStartTime,
        endTime: onlineEndTime
      }
      api.analysisOnlineStatInfo(data, (result) => {
        this.onlineChartData = result.data.onlineChartData
        this.onlineXdata = api.getStatLogInfoXdata(this, 'online')
        this.onlineSeriesData = api.sortStatLogDataByHours(this, 'online')
        let showData = []
        this.onlineXdata.map((item, index) => {
          showData.push({'日期': item, '时点在线人数': this.onlineSeriesData[index]})
        })
        this.chartData.rows = showData
      })
      this.$refs.onlineGridPager.loadData()
    },
    handleOnlineClose () {
      this.onlineStartOpen = false
      this.onlineEndOpen = false
    },
    onlineReload () {
      this.onlineDate = null
      this.onlineStartTime = null
      this.onlineEndTime = null
    }
  }
}
</script>

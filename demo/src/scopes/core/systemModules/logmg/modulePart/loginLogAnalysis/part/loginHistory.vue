<template>
  <div id="loginHistory" class="fit">
    <ta-border-layout :layout="{header:'345px'}" :header-cfg="{showBorder: false, layoutConStyle: {lineHeight: '46px'}}" :showBorder="false">
      <div slot="header">
        <ta-row :gutter="10">
          <ta-col :span="3">
            <ta-date-picker v-model="loginDate" format="YYYY-MM-DD" placeholder="开始日期" style="width: 100%" />
          </ta-col>
          <ta-col :span="3">
            <ta-time-picker v-model="loginStartTime" :open.sync="loginStartOpen" format="HH:mm" placeholder="开始时间" style="width: 100%">
              <ta-button slot="addon" size="small" type="primary" @click="handleLoginClose">确定</ta-button>
            </ta-time-picker>
          </ta-col>
          <ta-col :span="3">
            <ta-time-picker v-model="loginEndTime" :open.sync="loginEndOpen" format="HH:mm" placeholder="结束时间" style="width: 100%">
              <ta-button slot="addon" size="small" type="primary" @click="handleLoginClose">确定</ta-button>
            </ta-time-picker>
          </ta-col>
          <ta-col :span="15">
            <ta-button-group>
              <ta-button type='primary' icon="search" @click="getLoginInfo">查询</ta-button>
              <ta-button icon="reload" @click="loginReload">重置</ta-button>
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
      <ta-table :columns="loginColumns"
                :dataSource="loginGridData"
                :pagination=false>
      </ta-table>
      <ta-pagination
        style="float: right; margin-top: 10px;"
        showSizeChanger
        showQuickJumper
        :dataSource.sync="loginGridData"
        :defaultPageSize="6"
        :params="loginPageParams"
        url="logmg/loginLog/loginLogAnalysisRestService/getLoginInfo"
        ref="loginGridPager"
      />
    </ta-border-layout>
  </div>
</template>
<script>
import api from '../api'
import moment from 'moment'
import TaECharts from '@yh/ta404-ui/es/echarts'

const loginColumns = [
  {
    title: '登录ID',
    dataIndex: 'loginId',
    key: 'loginId',
    width: '12%',
    align: 'center'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: '12%'
  }, {
    title: '登录时间',
    dataIndex: 'loginTime',
    key: 'loginTime',
    align: 'center',
    overflowTooltip: true,
    width: '14%'
  }, {
    title: '注销时间',
    dataIndex: 'logoutTime',
    key: 'logoutTime',
    align: 'center',
    overflowTooltip: true,
    width: '14%'
  }, {
    title: '客户端ip',
    dataIndex: 'clientIp',
    key: 'clientIp',
    align: 'center',
    width: '12%'
  }, {
    title: '客户端系统',
    dataIndex: 'clientSystem',
    key: 'clientSystem',
    align: 'center',
    width: '12%'
  }, {
    title: '客户端浏览器',
    key: 'clientBrowser',
    dataIndex: 'clientBrowser',
    align: 'center',
    width: '12%'
  }, {
    title: '客户端分辨率',
    key: 'clientScreenSize',
    dataIndex: 'clientScreenSize',
    align: 'center',
    width: '12%'
  }]

export default {
  name: 'loginHistory',
  components: { TaECharts },
  data () {
    return {
      loginDate: null,
      loginStartTime: null,
      loginEndTime: null,
      loginStartOpen: false,
      loginEndOpen: false,
      isClickLoginTab: false,
      loginChartData: [],
      loginColumns,
      loginGridData: [],
      loginXInterval: 4,
      loginXdata: [],
      loginSeriesData: [],
      chartSetting: {
        legend: {
          top: 10,
          formatter: '时点登录人数'
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
        columns: ['日期', '时点登录人数'],
        rows: []
      }
    }
  },
  mounted: function () {
    this.loadData()
  },
  methods: {
    moment,
    loginPageParams () {
      return {}
    },
    loadData () {
      let timeData = {}
      api.getSysTime(timeData, (result) => {
        this.loginDate = moment(result.data.sysdate, 'YYYY-MM-DD')
        this.loginStartTime = moment(result.data.sysStartTime, 'HH:mm')
        this.loginEndTime = moment(result.data.sysEndTime, 'HH:mm')
        let searchDate = this.loginDate ? this.loginDate.format('YYYY-MM-DD') : ''
        let loginStartTime = this.loginStartTime ? this.loginStartTime.format('HH:mm') : ''
        let loginEndTime = this.loginEndTime ? this.loginEndTime.format('HH:mm') : ''
        let data = {
          searchDate: searchDate,
          startTime: loginStartTime,
          endTime: loginEndTime
        }
        api.analysisLoginStatInfo(data, (result) => {
          this.loginChartData = result.data.loginChartData
          this.loginXdata = api.getStatLogInfoXdata(this, 'login')
          this.loginSeriesData = api.sortStatLogDataByHours(this, 'login')
          let showData = []
          this.loginXdata.map((item, index) => {
            showData.push({'日期': item, '时点登录人数': this.loginSeriesData[index]})
          })
          this.chartData.rows = showData
        })
        this.$refs.loginGridPager.loadData()
      })
    },
    getLoginInfo () {
      if (!this.loginDate) {
        this.$message.warning('开始日期不能为空')
        return
      }
      if (!this.loginStartTime) {
        this.$message.warning('开始时间不能为空')
        return
      }
      if (!this.loginEndTime) {
        this.$message.warning('结束时间不能为空')
        return
      }
      if (new Date(this.loginDate.format('YYYY-MM-DD') + ' ' + this.loginStartTime.format('HH:mm')).getTime() > new Date(this.loginDate.format('YYYY-MM-DD') + ' ' + this.loginEndTime.format('HH:mm')).getTime()) {
        this.$message.warning('开始时间不能大于结束时间')
        return
      }
      let searchDate = this.loginDate.format('YYYY-MM-DD')
      let loginStartTime = this.loginStartTime.format('HH:mm')
      let loginEndTime = this.loginEndTime.format('HH:mm')
      let data = {
        searchDate: searchDate,
        startTime: loginStartTime,
        endTime: loginEndTime
      }
      api.analysisLoginStatInfo(data, (result) => {
        this.loginChartData = result.data.loginChartData
        this.loginXdata = api.getStatLogInfoXdata(this, 'login')
        this.loginSeriesData = api.sortStatLogDataByHours(this, 'login')
        let showData = []
        this.loginXdata.map((item, index) => {
          showData.push({'日期': item, '时点登录人数': this.loginSeriesData[index]})
        })
        this.chartData.rows = showData
      })
      this.$refs.loginGridPager.loadData()
    },
    handleLoginClose () {
      this.loginStartOpen = false
      this.loginEndOpen = false
    },
    loginReload () {
      this.loginDate = null
      this.loginStartTime = null
      this.loginEndTime = null
    }
  }
}
</script>

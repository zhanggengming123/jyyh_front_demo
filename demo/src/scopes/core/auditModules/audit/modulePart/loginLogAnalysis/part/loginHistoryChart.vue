<template>
  <div>
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
</template>



<script>
import api from '../api'
import moment from 'moment/moment'
import TaECharts from '@yh/ta404-ui/es/echarts'

export default {
  name: 'loginHistoryChart',
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
      loginGridData: [],
      loginXInterval: 4,
      loginXdata: [],
      loginSeriesData: [],
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
        columns: ['日期', '时点登录人数'],
        rows: []
      },
      toolbox: {
        feature: {
          magicType: {type: ['line', 'bar']},
          saveAsImage: {}
        }
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
    },
    handleLoginClose () {
      this.loginStartOpen = false
      this.loginEndOpen = false
    },
    loginReload () {
      this.loginDate = null
      this.loginStartTime = null
      this.loginEndTime = null
    },
  }
}
</script>
<!--<template>-->
<!--  <div style="height: 100%; overflow-x: auto">-->
<!--    <div style="padding: 30px 30px 0 50px">-->
<!--      <ta-e-charts :series="series"-->
<!--                   :xAxis="xAxis"-->
<!--                   :yAxis="yAxis"-->
<!--                   :legend="legend"/>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import TaECharts from '@yh/ta404-ui/es/echarts/echarts'-->
<!--  import $api from '../api/index'-->
<!--  export default {-->
<!--    name: 'cpuUsedRateModel',-->
<!--    props:['rowData'],-->
<!--    data(){-->
<!--      return{-->
<!--        legend: {-->
<!--          data:['cpu使用率']-->
<!--        },-->
<!--        xAxis: {-->
<!--          type: 'category',-->
<!--          data: []-->
<!--        },-->
<!--        yAxis: {-->
<!--          type: 'value'-->
<!--        },-->
<!--        series:{-->
<!--          data: [],-->
<!--          type: 'line',-->
<!--          smooth: false,-->
<!--          name:'cpu使用率',-->
<!--        },-->
<!--        timeSender: '',-->
<!--        isFirst: true-->
<!--      }-->
<!--    },-->
<!--    components: {-->
<!--      TaECharts-->
<!--    },-->
<!--    mounted() {-->
<!--      this.setValue();-->

<!--      if (this.isFirst) {-->
<!--        this.isFirst = false-->
<!--      }-->
<!--      // 25秒刷新一次（此数字大于监控端定时秒数x，小于2x)-->
<!--      this.timeSender = setInterval(this.setValue, 25000)-->
<!--    },-->
<!--    beforeDestroy() {-->
<!--      clearInterval(this.timeSender)-->
<!--    },-->
<!--    methods: {-->
<!--      setValue(){-->
<!--        const {hostIp} = this.rowData;-->
<!--        let data = {-->
<!--          "hostIp": hostIp,-->
<!--          "isFirst": this.isFirst-->
<!--        }-->
<!--        this.series.data.shift();-->
<!--        this.xAxis.data.shift();-->
<!--        $api.queryCpuUsedRate(this, data, (data) => {-->
<!--          for (let i = data.data.cpuUsedRate.length - 1; i >= 0; i&#45;&#45;) {-->
<!--            this.series.data.push(data.data.cpuUsedRate[i].cpuUsedRate);-->
<!--            this.xAxis.data.push(data.data.cpuUsedRate[i].time);-->
<!--          }-->
<!--        });-->
<!--      },-->

<!--    }-->
<!--  }-->
<!--</script>-->

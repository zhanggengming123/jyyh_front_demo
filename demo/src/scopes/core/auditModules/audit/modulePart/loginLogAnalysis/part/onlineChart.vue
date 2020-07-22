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
import TaECharts from '@yh/ta404-ui/es/echarts'
import api from '../api'
import moment from 'moment'

export default {
  name: 'onlineChart',
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

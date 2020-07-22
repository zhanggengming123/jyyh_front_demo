<template>
  <div>
    <ta-e-charts
      height="500px"
      :title="chartSetting.title"
      :legend="chartSetting.legend"
      :tooltip="chartSetting.tooltip"
      :xAxis="chartSetting.xAxis"
      :yAxis="chartSetting.yAxis"
      :series="chartSetting.series"
      :toolbox="chartSetting.toolbox"
    >
    </ta-e-charts>
  </div>
</template>
<script>
import TaECharts from '@yh/ta404-ui/es/echarts'
import $api from '../api'
export default {
  name: 'accessDenyChart',
  components: { TaECharts },
  data () {
    return {
      collectionList: ['ACCESSDENYTYPE'],
      startTime: null,
      chartSetting: {
        legend: {
          top: 10
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            params = params[0]
            const ary = params.name.split(',')
            ary[0] = '受限类型: ' + this.CollectionLabel('ACCESSDENYTYPE', ary[0])
            ary[1] = '访问时间: ' + ary[1]
            ary[2] = '受限次数: ' + ary[2]
            return ary.join('<br/>')
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          }
        },
        toolbox: {
          feature: {
            magicType: { type: ['line', 'bar'] },
            saveAsImage: {}
          }
        },
        series: []
      }
    }
  },
  created () {
    this.init()
  },
  destroyed () {
    window.clearInterval(window.analysisChartInterval)
  },
  methods: {
    init () {
      Base.asyncGetCodeData('ACCESSDENYTYPE').then((codeList) => {
        this.chartSetting.series = codeList.map(function (code) {
          return {
            id: code.value,
            name: code.label,
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: []
          }
        })
        this.startAnalysis()
      })
    },
    startAnalysis () {
      this.httpAnalysis()
      window.analysisChartInterval = setInterval(() => {
        this.httpAnalysis()
      }, 10000)
    },
    httpAnalysis () {
      $api.getAnalysisAccessDenyInfo({ startTime: this.startTime }, (data) => {
        this.startTime = data.analysisData.startTime
        const analysisData = data.analysisData.accessDenyAnalysisData || []
        analysisData.forEach(a => {
          const updataChart = this.chartSetting.series.find(chart => chart.id == a.accessDenyType)
          // updataChart.data.shift()
          updataChart.data.push({
            name: [a.accessDenyType, a.accessAnalysisTime, a.count].join(','),
            value: [
              a.accessAnalysisTime,
              a.count
            ]
          })
        })
      })
    }
  }
}
</script>

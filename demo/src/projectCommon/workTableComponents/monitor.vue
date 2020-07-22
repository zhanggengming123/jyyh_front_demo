<template>
  <div style="height: 255px;width: 95%;margin: 0 auto">
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
  import moment from 'moment'

  export default {
    name: 'monitor',
    components: { TaECharts },
    props: {
      moduleId: String,
    },
    data: function () {
      return {
        BASE_URL: '/logmg/loginLog/loginLogAnalysisRestService/',
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
            splitNumber: 10,
            minInterval: 1,
            axisLabel: {
              formatter: '{value}人'
            }
          },
          grid: {
            bottom: 10
          },
          toolbox: {
            feature: {
              magicType: { type: ['line', 'bar'] },
              saveAsImage: {}
            }
          }
        },
        chartData: {
          columns: ['日期', '时点在线人数'],
          rows: []
        },
        timer: ''
      }
    },
    created () {
      this.timer = setInterval(this.loadData, 60000)
      // 销毁定时器
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.timer)
      })
    },
    mounted () {
      this.loadData()
    },
    methods: {
      loadData () {
        let timeData = {}
        this.getSysTime(timeData, (result) => {
          this.onlineDate = moment(result.data.sysdate, 'YYYY-MM-DD')
          this.onlineEndTime = moment()
          let temp = this.onlineEndTime.clone()
          this.onlineStartTime = temp.subtract('1', 'hours')
          let searchDate = this.onlineDate ? this.onlineDate.format('YYYY-MM-DD') : ''
          let onlineStartTime = this.onlineStartTime ? this.onlineStartTime.format('HH:mm') : ''
          let onlineEndTime = this.onlineEndTime ? this.onlineEndTime.format('HH:mm') : ''
          let data = {
            searchDate: searchDate,
            startTime: onlineStartTime,
            endTime: onlineEndTime
          }
          this.analysisOnlineStatInfo(data, (result) => {
            this.onlineChartData = result.data.onlineChartData
            this.onlineXdata = this.getStatLogInfoXdata(this, 'online')
            this.onlineSeriesData = this.sortStatLogDataByHours(this, 'online')
            let showData = []
            this.onlineXdata.map((item, index) => {
              showData.push({ '日期': item, '时点在线人数': this.onlineSeriesData[index] })
            })
            this.chartData.rows = showData
          })
        })
      },
      getSysTime (data, callBack) {
        Base.submit(null, {
          url: this.BASE_URL + 'getSysTime',
          data: data,
          _modulePartId_: this.moduleId,
          showPageLoading: false
        }, {
          successCallback: (data) => callBack(data)
        })
      },
      analysisOnlineStatInfo (data, callBack) {
        Base.submit(null, {
          url: this.BASE_URL + 'analysisOnlineStatInfo',
          data: data,
          _modulePartId_: this.moduleId,
          showPageLoading: false
        }, {
          successCallback: (data) => callBack(data)
        })
      },
      getStatLogInfoXdata (_source, tabId) {
        let start = []
        let end = []
        if (tabId === 'online') {
          start = _source.onlineStartTime.format('HH:mm').split(':')
          end = _source.onlineEndTime.format('HH:mm').split(':')
        } else if (tabId === 'login') {
          start = _source.loginStartTime.format('HH:mm').split(':')
          end = _source.loginEndTime.format('HH:mm').split(':')
        }
        let start_hour = parseInt(start[0])
        let start_minut = parseInt(start[1])
        let end_hour = parseInt(end[0])
        let end_minut = parseInt(end[1])
        let rdata = []
        do {
          rdata.push(formatXdata(start_hour, start_minut))
          if (start_hour == end_hour && start_minut == end_minut) {
            break
          }
          if (start_minut < 59 && start_minut >= 0) {
            start_minut++
          } else if (start_minut == 59) {
            start_hour++
            start_minut = 0
          } else {
            _source.$message.error('在线时点分析图表构造出错！')
            break
          }
        } while (true)

        function formatXdata (start_hour, start_minut) {
          let tmp_hour = '' + start_hour
          let tmp_minut = '' + start_minut
          if (tmp_hour.length < 2) {
            tmp_hour = '0' + tmp_hour
          }
          if (tmp_minut.length < 2) {
            tmp_minut = '0' + tmp_minut
          }

          return tmp_hour + ':' + tmp_minut
        }

        if (rdata.length <= 60) {
          if (tabId === 'online') {
            _source.onlineXInterval = 4
          } else if (tabId === 'login') {
            _source.loginXInterval = 4
          }
        } else if (rdata.length > 60) {
          if (tabId === 'online') {
            _source.onlineXInterval = parseInt(rdata.length / 10 - 1)
          } else if (tabId === 'login') {
            _source.loginXInterval = parseInt(rdata.length / 10 - 1)
          }
        }
        return rdata
      },

      sortStatLogDataByHours (_source, tabId) {
        let data = []
        let start = []
        let end = []
        if (tabId === 'online') {
          data = _source.onlineChartData
          start = _source.onlineStartTime.format('HH:mm').split(':')
          end = _source.onlineEndTime.format('HH:mm').split(':')
        } else if (tabId === 'login') {
          data = _source.loginChartData
          start = _source.loginStartTime.format('HH:mm').split(':')
          end = _source.loginEndTime.format('HH:mm').split(':')
        }
        let start_hour = parseInt(start[0])
        let start_minut = parseInt(start[1])
        let end_hour = parseInt(end[0])
        let end_minut = parseInt(end[1])
        let rdata = []

        let con = 0
        do {
          let tmp_hour = '' + start_hour
          let tmp_minut = '' + start_minut
          if (tmp_hour.length < 2) {
            tmp_hour = '0' + tmp_hour
          }
          if (tmp_minut.length < 2) {
            tmp_minut = '0' + tmp_minut
          }
          let result_time = tmp_hour + ':' + tmp_minut
          for (let i in data) {
            if (result_time == data[i].type) {
              rdata.push(data[i].count)
            }
          }
          con++
          if (rdata.length < con) {
            rdata.push(0)
          }
          if (start_hour === end_hour && start_minut === end_minut) {
            break
          }
          if (start_minut < 59 && start_minut >= 0) {
            start_minut++
          } else if (start_minut == 59) {
            start_hour++
            start_minut = 0
          } else {
            _source.$message.error('时点分析图表构造出错！')
            break
          }
        } while (true)
        return rdata
      },
    }
  }
</script>

<style scoped>

</style>

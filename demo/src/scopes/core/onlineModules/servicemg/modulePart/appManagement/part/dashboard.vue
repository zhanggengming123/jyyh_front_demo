<template>
  <div class="dashboard">
    <ta-row :gutter="16">
      <ta-col :span="6">
        <div class="chart-content">
          <div class="chart-title">今日访问量</div>
          <div class="chart-num">8,352</div>
          <div class="chart-box">
            <!--            <IEcharts :option="option"></IEcharts>-->
          </div>
        </div>
      </ta-col>
      <ta-col :span="6">
        <div class="chart-content">
          <div class="chart-title">今日访问量</div>
          <div class="chart-num">8,352</div>
          <div class="chart-box">
            <!--            <IEcharts :option="option"></IEcharts>-->
          </div>
        </div>
      </ta-col>
      <ta-col :span="6">
        <div class="chart-content">
          <div class="chart-title">今日访问量</div>
          <div class="chart-num">8,352</div>
          <div class="chart-box">
            <!--            <IEcharts :option="option"></IEcharts>-->
          </div>
        </div>
      </ta-col>
      <ta-col :span="6">
        <div class="chart-content">
          <div class="chart-title">今日访问量</div>
          <div class="chart-num">8,352</div>
          <div class="chart-box">
            <!--            <IEcharts :option="option"></IEcharts>-->
          </div>
        </div>
      </ta-col>
    </ta-row>
    <div class="part2-box">
      <div class="part2-title">
        <span>访问量</span>
        <div class="fl-r">
          <a class="time-btn">今日</a>
          <a class="time-btn">本周</a>
          <a class="time-btn">本月</a>
          <a class="time-btn">全年</a>
          <ta-month-picker/>
        </div>
      </div>
      <ta-row>
        <ta-col :span="16">
          <div class="histogram-box">
            <!--            <IEcharts :option="lineOption"></IEcharts>-->
          </div>
        </ta-col>
        <ta-col :span="8">
          <div class="ranking-box">
            <div class="rank-title">访问量排名</div>
            <ta-row class="mg-t2">
              <ta-col :span="18" class="ft-ellipsis">1.社保公众号社保公众号社保公众号社保公众号社保公众号社保公众号社保公众号社保公众号社保公众号社保公众号社保公众号社保公众号
              </ta-col>
              <ta-col :span="6"><span class="rank-num">43123</span></ta-col>
            </ta-row>
            <ta-row class="mg-t2">
              <ta-col :span="18" class="ft-ellipsis">2.公共服务</ta-col>
              <ta-col :span="6"><span class="rank-num">24452</span></ta-col>
            </ta-row>
            <ta-row class="mg-t2">
              <ta-col :span="18" class="ft-ellipsis">3.医疗待遇</ta-col>
              <ta-col :span="6"><span class="rank-num">1235</span></ta-col>
            </ta-row>
            <ta-row class="mg-t2">
              <ta-col :span="18" class="ft-ellipsis">4.123APP</ta-col>
              <ta-col :span="6"><span class="rank-num">423</span></ta-col>
            </ta-row>
            <ta-row class="mg-t2">
              <ta-col :span="18" class="ft-ellipsis">5.人社APP</ta-col>
              <ta-col :span="6"><span class="rank-num">243</span></ta-col>
            </ta-row>
          </div>
        </ta-col>
      </ta-row>
    </div>
  </div>
</template>
<script>
// import $api from '../api/index'
// import IEcharts from 'vue-echarts-v3/src/lite.js'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/component/legend'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/toolbox'
// import 'echarts/lib/component/markPoint'
// import 'echarts/lib/component/markLine'

const option = {
  tooltip: { trigger: 'axis' },
  xAxis: [
    {
      show: false,
      type: 'category',
      boundaryGap: false,
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      splitLine: { show: false }
    }
  ],
  yAxis: [
    {
      show: false,
      type: 'value',
      splitLine: { show: false }
    }
  ],
  grid: { top: '0', left: '0', right: '0', bottom: '0' },
  series: [
    {
      name: '数据',
      type: 'line',
      smooth: true,
      itemStyle: {
        normal: {
          lineStyle: { color: '#975fe4' },
          areaStyle: { color: '#975fe4' }
        }
      },
      data: [5, 2, 4, 5, 4, 6, 5, 5, 3, 4, 2, 4, 7, 5]
    }
  ]
}

const lineOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['蒸发量', '降水量']
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  grid: { top: '30', left: '30', right: '30', bottom: '20' },
  series: [
    {
      name: '访问量',
      type: 'bar',
      data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      markPoint: {
        data: [
          { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183, symbolSize: 18 },
          { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
        ]
      },
      itemStyle: {
        normal: { color: '#58afff' }
      },
      barWidth: 20,
      markLine: {
        data: [
          { type: 'average', name: '平均值' }
        ]
      }
    }
  ]
}

export default {
  name: 'dashboard',
  data () {
    return {
      option,
      lineOption
    }
  },
  // components: { IEcharts },
  methods: {}
}
</script>
<style lang="less" scoped type="text/less">
  .mg-t2 {
    margin-top: 20px;
  }

  .fl-r {
    float: right;
  }

  .fl-l {
    float: left;
  }

  .chart-content {
    background-color: #ffffff;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 2px;
  }

  .chart-title {
    font-size: 14px;
    color: #666666;
  }

  .chart-num {
    font-size: 30px;
    color: #222222;
  }

  .chart-box {
    width: 100%;
    height: 100px;
  }

  .part2-box {
    background-color: #ffffff;
    margin-top: 16px;
    box-sizing: border-box;
    border-radius: 2px;
  }

  .part2-title {
    border-bottom: 1px solid #e8e8e8;
    height: 50px;
    font-size: 16px;
    line-height: 50px;
    padding: 0 20px;
  }

  .time-btn {
    font-size: 14px;
    margin-right: 10px;
  }

  .histogram-box {
    width: 100%;
    height: 300px;
    box-sizing: border-box;
    padding: 20px;
  }

  .ranking-box {
    padding: 15px 20px 20px 0
  }

  .rank-title {
    font-size: 16px;
  }

  .rank-num {
    margin-left: 10px;
  }

  .ft-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>

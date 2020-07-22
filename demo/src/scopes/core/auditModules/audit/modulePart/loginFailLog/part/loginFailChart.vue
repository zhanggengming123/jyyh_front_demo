<template>
  <div style="height: 100%; overflow-x: auto">

    <div style="padding: 30px 30px 0 50px">
      <ta-e-charts :chartsType="'chart'" :data="chartData" :title="title" :settings="chartSettings" :data-empty="dataEmpty" :extend="chartExtend" />
    </div>
  </div>
</template>

<script>
import TaECharts from '@yh/ta404-ui/es/echarts'
import '@yh/ta404-ui/es/echarts/lib/style.min.css'
import $api from '../api/index'
export default {
  name: 'systemExceptionChart',
  props: ['queryData'],
  data(){
    return{
      chartData: {
        columns: ['日期', '登录失败次数'],
        rows: []
      },
      chartSettings: {type: 'line', area: true},
      dataEmpty: false, // '暂无数据'
      title: {
        subtext: '默认显示最近7天',
      },
      chartExtend: {
        series: {
          smooth: false
        }
      },
    }
  },
  components: {
    TaECharts
  },
  mounted() {
    this.setValue();
  },
  methods: {
    setValue(){
      this.dataEmpty = false;
      this.chartData.rows = [];
      $api.loginFailChart(this.queryData, (data) => {
        if (Object.keys(data.data.loginFailChartData).length == 0){
          this.dataEmpty = true;
        }
        for (let logKey in data.data.loginFailChartData) {
          let temp = [];
          temp['日期'] = logKey;
          temp['登录失败次数'] = data.data.loginFailChartData[logKey]
          this.chartData.rows.push(temp);
        }
      })
    },


  }
}
</script>






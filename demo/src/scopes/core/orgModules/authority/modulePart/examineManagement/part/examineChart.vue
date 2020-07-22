<template>
  <div style="height: 100%; overflow-x: auto">

    <div style="padding: 30px 30px 0 50px">
      <!--<button @click="changeType">切换图表类型</button>-->
      <ta-e-charts :chartsType="'chart'" :data="chartData" :title="title" :data-empty="dataEmpty" :settings="chartSettings" :legend="legend" />
    </div>
  </div>
</template>

<script>
import $api from '../api/index'
import TaECharts from '@yh/ta404-ui/es/echarts'
import '@yh/ta404-ui/es/echarts/lib/style.min.css'
export default {
  name: 'examineChart',
  props: ['queryData'],
  data(){
    this.typeArr = ['line', 'histogram', 'pie']
    this.index = 2,
      this.legend = {
        bottom: -30,
      }
    return{
      chartData: {
        columns: ['操作事件', '操作事件统计数'],
        rows: []
      },
      dataEmpty: false, // '暂无数据'
      title: {
        subtext: '默认显示最近7天',
      },
      chartSettings: {type: this.typeArr[this.index], },
      chartsType:this.typeArr[this.index]
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
      $api.examineChart(this.queryData, (data) => {
        if (Object.keys(data.examineChartData).length == 0){
          this.dataEmpty = true;
        }
        for (let i = 0; i < data.examineChartData.length; i++) {
          let temp = [];

          temp = {
            '操作事件' : data.examineChartData[i].opName,
            '操作事件统计数' : data.examineChartData[i].count
          }
          this.chartData.rows.push(temp);
        }
      })
    },


    changeType: function () {
      this.index++
      if (this.index >= this.typeArr.length) { this.index = 0 }
      this.chartSettings = { type: this.typeArr[this.index] }
    }

  }
}
</script>






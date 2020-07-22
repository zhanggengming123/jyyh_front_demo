<template>
  <div style="height: 100%; overflow-x: auto">

    <div style="padding: 30px 30px 0 50px">
      <!--<button @click="changeType">切换图表类型</button>-->
      <ta-e-charts :chartsType="'chart'" :data="chartData" :data-empty="dataEmpty" :settings="chartSettings"/>
    </div>
  </div>
</template>

<script>
import TaECharts from '@yh/ta404-ui/es/echarts'
import '@yh/ta404-ui/es/echarts/lib/style.min.css'
import $api from '../api/index'
export default {
  name: 'auditChart',
  props: ['queryData'],
  data(){
    this.typeArr = ['line', 'histogram', 'pie']
    this.index = 2
    return{
      chartData: {
        columns: ['审计类型', '审计类型统计数'],
        rows: []
      },
      dataEmpty: false, // '暂无数据'
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
      $api.auditChart(this.queryData, (data) => {
        if (Object.keys(data.data.auditChartData).length == 0){
          this.dataEmpty = true;
        }
        for (let i = 0; i < data.data.auditChartData.length; i++) {
          let temp = [];

          temp = {
            '审计类型' : data.data.auditChartData[i].label,
            '审计类型统计数' : data.data.auditChartData[i].count
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






<template>
  <div style="height: 100%; overflow-x: auto">

    <div style="padding: 30px 30px 0 50px">
      <ta-radio-group :value="buttonValue" @change="handleChange">
        <ta-radio-button value="byHour"  @click="changeType('0')">按小时</ta-radio-button>
        <ta-radio-button value="byDay" @click="changeType('1')">按天</ta-radio-button>
      </ta-radio-group>
      <ta-e-charts :chartsType="'chart'" :data="chartData"  :settings="chartSettings"/>
    </div>
  </div>
</template>

<script>
import TaECharts from '@yh/ta404-ui/es/echarts'
import $api from '../api/index'
export default {
  name: 'systemExceptionChart',
  props: ['queryData'],
  data(){
    return{
      chartData: {
        columns: ['日期', '异常次数'],
        rows: []
      },
      chartSettings: {type: 'line', area: true},
      buttonValue: 'byHour' // 默认开启按小时
    }
  },
  components: {
    TaECharts
  },
  mounted() {
    this.setValue('0');
  },
  methods: {
    setValue(value){
      this.queryData['showType'] = value

      this.chartData.rows = [];
      $api.exceptionChart(this.queryData, (data) => {
        for (let logKey in data.data.exceptionChartData) {
            let temp = [];
            temp['日期'] = logKey;
            temp['异常次数'] = data.data.exceptionChartData[logKey]
            this.chartData.rows.push(temp);
        }
      })
    },

    changeType(value) {
      this.setValue(value);
    },

    handleChange (e) {
      this.buttonValue = e.target.value
    },


  }
}
</script>






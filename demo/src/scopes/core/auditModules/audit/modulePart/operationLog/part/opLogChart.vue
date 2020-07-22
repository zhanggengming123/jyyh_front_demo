<template>
  <div style="height: 100%; overflow-x: auto">

    <div style="padding: 30px 30px 0 50px">
      <ta-radio-group :value="buttonValue" @change="handleChange">
        <ta-radio-button value="opType"  @click="changeType(1)">操作类型</ta-radio-button>
        <ta-radio-button value="bodyType" @click="changeType(0)">影响主体类型</ta-radio-button>
      </ta-radio-group>
      <ta-e-charts :chartsType="'scatter'" :data="chartData" :data-empty="dataEmpty" :grid="grid"/>
    </div>
  </div>
</template>

<script>
import TaECharts from '@yh/ta404-ui/es/echarts'
import '@yh/ta404-ui/es/echarts/lib/style.min.css'
import $api from '../api/index'
export default {
  name: 'opLogChart',
  props: ['queryData'],
  data () {
    return {
      chartData: {
        columns: ['日期'],
        rows: []
      },
      grid: {
        top: 90,
      },
      buttonValue: 'bodyType', // 默认开启影响主体类型
      dataEmpty: false, // '暂无数据'
    }
  },
  components: {
    TaECharts
  },
  mounted () {
    this.setValue(0);
  },
  methods: {
     setValue (value) {
       this.dataEmpty = false;
       this.chartData.rows = [];
       this.chartData.columns = ['日期'];
       let set = new Set([]);

       this.queryData['typeForChart'] = value
       $api.opLogChart(this.queryData, (data) => {
         if (data.data.opLogChartData.length == 0){
           this.dataEmpty = true;
         }
        for (let i = 0; i < data.data.opLogChartData.length; i++) {
          let temp = {};
          for (let logKey in data.data.opLogChartData[i]) {
            if (logKey.match("日期")) {
              temp['日期'] = data.data.opLogChartData[i][logKey] + '';
            } else {
              set.add(logKey)
              temp[logKey] = data.data.opLogChartData[i][logKey];
            }
          }
          this.chartData.rows.push(temp);
        }
        // 为columns赋值
        for(let item of set.keys()) {
          this.chartData.columns.push(item)
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














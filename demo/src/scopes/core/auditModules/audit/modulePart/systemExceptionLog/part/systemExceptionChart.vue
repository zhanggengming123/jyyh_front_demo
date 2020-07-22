<template>
  <div style="height: 100%; overflow-x: auto">

    <div style="padding: 30px 30px 0 50px">
      <ta-radio-group :value="buttonValue" @change="handleChange">
        <ta-popover
          width="100"
          trigger="hover"
          content="按当天日期绘图">
          <ta-radio-button slot="reference" value="byHour" @click="changeType('0')" >按小时</ta-radio-button>
        </ta-popover>
        <ta-radio-button value="byDay" @click="changeType('1')">按天</ta-radio-button>
      </ta-radio-group>
      <p class="defaultp" v-show="type == '1'"> 默认显示最近7天</p>
      <ta-e-charts :charts-type="'line'" :data="chartData"  :data-empty="dataEmpty"  :settings="chartSettings" :extend="chartExtend" />
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
        columns: ['日期', '异常次数'],
        rows: []
      },
      chartSettings: {area: true},
      buttonValue: 'byHour',// 默认开启按小时
      dataEmpty: false, // '暂无数据'
      chartExtend: {
        series: {
          smooth: false
        }
      },
      type: '0',
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
      this.queryData['showType'] = this.type
      $api.exceptionChart(this.queryData, (data) => {
        if (Object.keys(data.data.exceptionChartData).length == 0){
          this.dataEmpty = true;
        }
        for (let logKey in data.data.exceptionChartData) {
            let temp = [];
            temp['日期'] = logKey;
            temp['异常次数'] = data.data.exceptionChartData[logKey]
            this.chartData.rows.push(temp);
        }
      })
    },

    changeType(value) {
      this.type = value;
      this.setValue();
    },

    handleChange (e) {
      this.buttonValue = e.target.value
    },


  }
}
</script>
<style>
  .defaultp {
    margin: 0 0 0 0;
    color: #00000222;
    font-size: small;
  }
</style>





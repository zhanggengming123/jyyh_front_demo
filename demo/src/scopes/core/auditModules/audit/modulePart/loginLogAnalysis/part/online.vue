<template>
  <div class="fit" id="online">
  <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}" :showBorder="false" :footer-cfg="{showBorder: false}">
    <!--搜索-->
    <div slot="header" class="center-box">
      <ta-input-search v-model="param" placeholder="登录人员搜索" class="search-box" @search="searchQuery"  enterButton="搜索"  />
    </div>
    <!--过滤-->
    <div slot="centerExtraContent">
      <ta-range-picker
        v-model="createTime"
        :placeholder="['开始时间', '结束时间']"
        @change="onChange"
        :get-calendar-container="getContainer"
      />
      <!-- eChart-->
      <div style="float: right">
        <ta-button icon="area-chart" @click="showOnlineChart()" />
        <ta-button @click="exportData()" >导出</ta-button>
      </div>
    </div>
    <!-- table-->
    <ta-table :columns="onlineColumns" :dataSource="onlineGridData" :pagination=false />
    <div slot="footer">
      <ta-pagination
        style="float: right; margin-top: 10px;"
        showSizeChanger
        showQuickJumper
        :dataSource.sync="onlineGridData"
        :params="onlinePageParams"
        url="logmg/loginLog/loginLogAnalysisRestService/online"
        ref="onlineGridPager"
      />
    </div>
  </ta-border-layout>

  <ta-modal
    centered
    v-model="showChartVisible"
    width="1000px"
    :bodyStyle="{height:'600px',padding:'0'}"
    :footer="null"
    :destroyOnClose=true
    :maskClosable=true
    :title="'数据分析'"
    :closable=true
    @close="closeOnlineChart(false)"
  >
    <online-chart ref="onlineChart" @closeModal="closeOnlineChart"></online-chart>
  </ta-modal>
  </div>
</template>


<script>
  import $api from '../api'
  import $auditApi from '../../api'
  import moment from 'moment'
  import onlineChart from './onlineChart'


  const onlineColumns = [
   { title: '登录ID', dataIndex: 'loginId', key: 'loginId', width: 244, align: 'center' },
   { title: '姓名', dataIndex: 'name', key: 'name', align: 'center', width: 244 },
   { title: '登录时间', dataIndex: 'loginTime', key: 'loginTime', scopedSlots: {customRender: 'onlineLoginTime'}, align: 'center', width: 244 },
   { title: '客户端ip', dataIndex: 'clientIp', key: 'clientIp', align: 'center', width: 244 },
   { title: '客户端系统', dataIndex: 'clientSystem', key: 'clientSystem', align: 'center', width: 244 },
   { title: '客户端浏览器', key: 'clientBrowser', dataIndex: 'clientBrowser', align: 'center', width: 244 },
   { title: '客户端分辨率', key: 'clientScreenSize', dataIndex: 'clientScreenSize', align: 'center', width: 244 },
   { title: '数据是否被篡改', key: 'isTampered', dataIndex: 'isTampered', align: 'center', width: 244 }]

  export default {
    name: 'online',
    components: {onlineChart},
    data () {
      return {
        onlineDate: null,
        onlineStartTime: null,
        onlineEndTime: null,
        createTime: [],
        onlineColumns,
        onlineGridData: [],
        param: "",
        startDate: '',
        endDate: '',
        showChartVisible: false,
      }
    },
    mounted: function () {
      this.loadData()
    },
    methods: {
      moment,

      // 参数
      onlinePageParams() {
        let param = {}
        param.startDate = this.startDate
        param.endDate = this.endDate
        param.name = this.param
        return param
      },


      searchQuery() {
        this.$refs.onlineGridPager.loadData()
      },
      loadData () {
          this.$refs.onlineGridPager.loadData()
      },

      onChange (value, dateString) {
        if (dateString && dateString.length && dateString[0] != '' && dateString[1] != '') {
          this.startDate = moment(dateString[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.endDate = moment(dateString[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }else {
          this.startDate = ''
          this.endDate = ''
        }
        this.loadData()
      },
      /**
       * 关闭弹窗
       */
      closeOnlineChart(load){
        this.showChartVisible = false;
      },
      /**
       * 显示弹窗
       */
      showOnlineChart(){
        this.showChartVisible = true;
      },

      // 导出
      exportData(){
        let data = {
          name: this.param,
          startDate: this.startDate,
          endDate: this.endDate
        }
        $auditApi.exportExcel(data, 'audit/auditExportRestService/online');
      },
      getContainer(){
        return document.getElementById('online')
      }

    }
  }
</script>
<style>
  .search-box {
    width: 340px;
    line-height: 42px;
  }
  .center-box { text-align: center; overflow: hidden; }
</style>

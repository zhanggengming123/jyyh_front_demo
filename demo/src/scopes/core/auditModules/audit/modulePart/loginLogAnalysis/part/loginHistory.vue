<template>
  <div id="loginHistory" class="fit">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}" :showBorder="false" :footer-cfg="{showBorder: false}">
      <!--搜索-->
      <div slot="header" class="center-box">
        <ta-input-search v-model="loginName" placeholder="登录人员搜索" class="search-box" @search="searchQuery"  enterButton="搜索"  />
      </div>
      <!--过滤-->
      <div slot="centerExtraContent">
        <ta-range-picker
          v-model="createTime"
          :placeholder="['开始时间', '结束时间']"
          @change="onChange"
          :get-calendar-container="getContainer"
        />
        <div style="float: right">
          <ta-button icon="area-chart" @click="showLoginHistoryChart()" />
          <ta-button @click="exportData()" >导出</ta-button>
        </div>
      </div>
      <!-- table-->
      <ta-table :columns="loginColumns"
                :dataSource="loginGridData"
                :pagination=false>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          style="float: right; margin-top: 10px;"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="loginGridData"
          :params="loginPageParams"
          url="logmg/loginLog/loginLogAnalysisRestService/login"
          ref="loginGridPager"
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
      @close="closeLoginHistoryChart(false)"
    >
      <login-history-chart ref="loginHistoryChart" @closeModal="closeLoginHistoryChart"></login-history-chart>
    </ta-modal>
  </div>
</template>
<script>
import $api from '../api'
import $auditApi from '../../api'
import moment from 'moment/moment'
import loginHistoryChart from './loginHistoryChart'

const loginColumns = [
  { title: '登录ID', dataIndex: 'loginId', key: 'loginId', width: 244, align: 'center' },
  { title: '姓名', dataIndex: 'name', key: 'name', align: 'center', width: 244 },
  { title: '登录时间', dataIndex: 'loginTime', key: 'loginTime', align: 'center', width: 244 },
  { title: '注销时间', dataIndex: 'logoutTime', key: 'logoutTime', align: 'center', width: 244 },
  { title: '客户端ip', dataIndex: 'clientIp', key: 'clientIp', align: 'center', width: 244 },
  { title: '客户端系统', dataIndex: 'clientSystem', key: 'clientSystem', align: 'center', width: 244 },
  { title: '客户端浏览器', key: 'clientBrowser', dataIndex: 'clientBrowser', align: 'center', width: 244 },
  { title: '客户端分辨率', key: 'clientScreenSize', dataIndex: 'clientScreenSize', align: 'center', width: 244 },
  { title: '数据是否被篡改', key: 'isTampered', dataIndex: 'isTampered', align: 'center', width: 244 }]

export default {
  name: 'loginHistory',
  components: {loginHistoryChart},
  data () {
    return {
      loginColumns,
      loginGridData: [],
      showChartVisible: false,
      loginName: "",
      createTime: []
    }
  },
  mounted: function () {
    this.loadData()
  },
  methods: {
    moment,
    loginPageParams () {
      let param = {}
      if (this.loginName){
          param.name = this.loginName
      }
      if (this.startDate){
        param.startDate = this.startDate
      }
      if (this.endDate){
        param.endDate = this.endDate
      }
      return param
    },
    loadData () {
        this.$refs.loginGridPager.loadData()
    },
    searchQuery: function() {
      this.loadData()
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
    showLoginHistoryChart(){
      this.showChartVisible = true;
    },
    closeLoginHistoryChart(){
      this.showChartVisible = false;
    },
    // 导出
    exportData(){
    let data = {
      loginName: this.loginName,
      startDate: this.startDate,
      endDate: this.endDate
      }

      $auditApi.exportExcel(data, 'audit/auditExportRestService/login');

    },
    getContainer(){
      return document.getElementById('loginHistory')
    }



  }
}
</script>

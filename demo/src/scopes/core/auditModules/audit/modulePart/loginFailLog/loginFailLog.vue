<template>
  <div class="fit" id="loginFailLog">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}" :footer-cfg="{showBorder: false}">
      <!--搜索-->
      <div slot="header" class="center-box">
        <ta-input-search v-model="param" placeholder="登录账号搜索" class="search-box" @search="searchQuery"  enterButton="搜索"  />
      </div>
      <!--过滤-->
      <div slot="centerExtraContent">
        <ta-range-picker
          v-model="createTime"
          :placeholder="['开始时间', '结束时间']"
          @change="onChange"
          class="distance"
          :get-calendar-container="getContainer"
        />
        <!-- eChart-->
        <div style="float: right">
          <ta-button icon="area-chart" @click="showChart()" />
          <ta-button @click="exportData()" >导出</ta-button>
        </div>
      </div>
      <!-- table-->
      <ta-table :columns="columns" :dataSource="gridData" :pagination=false />
      <div slot="footer">
        <ta-pagination
          style="float: right; margin-top: 10px;"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="gridData"
          :params="pageParams"
          url="logMg/loginFailLog/taLoginFailLogRestService/queryLoginFailLog"
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
      :title="'登录失败-日期图'"
      :closable=true
      @close="closeChart(false)"
    >
      <login-fail-chart ref="loginFailChart" :queryData="queryData" @closeModal="closeChart"></login-fail-chart>
    </ta-modal>

  </div>
</template>

<script>
import moment from 'moment'
import loginFailChart from './part/loginFailChart'
import $api from './api'
import $auditApi from '../api'

const columns = [
  { title: '登录账号', dataIndex: 'loginId', width: '10%', scopedSlots: { customRender: 'loginId' } },
  { title: '登录时间', dataIndex: 'loginTime', width: '15%', overflowTooltip: true, scopedSlots: { customRender: 'loginTime' } },
  { title: '登录失败原因', dataIndex: 'failReason', width: '15%', overflowTooltip: true, scopedSlots: { customRender: 'failReason' } },
  { title: '客户端IP', dataIndex: 'clientIp', width: '10%', scopedSlots: { customRender: 'clientIp' } },
  { title: '服务端IP', dataIndex: 'serverIp', width: '10%', scopedSlots: { customRender: 'serverIp' } },
  { title: '客户端系统', dataIndex: 'clientSystem', width: '10%', scopedSlots: { customRender: 'clientSystem' } },
  { title: '客户端浏览器', dataIndex: 'clientBrowser', width: '10%', scopedSlots: { customRender: 'clientBrowser' } },
  { title: '浏览器分辨率', dataIndex: 'clientScreenSize', width: '15%', scopedSlots: { customRender: 'clientScreenSize' } },
  { title: '系统路径', dataIndex: 'sysPath', width: '10%', scopedSlots: { customRender: 'sysPath' } },
  { title: '数据是否被篡改', dataIndex: 'isTampered', width: '7%', scopedSlots: { customRender: 'isTampered' } }
]
export default {
  name: 'app',
  data () {
    return {
      columns: columns,
      onlineDate: null,
      onlineStartTime: null,
      onlineEndTime: null,
      createTime: [],
      gridData: [],
      param: '',
      startDate: '',
      endDate: '',
      showChartVisible: false,
      accessDenyTypeParam: '',
      queryData: []
    }
  },
  components: { loginFailChart },
  mounted () {
    this.loadData()
  },
  methods: {
    moment,
    pageParams () {
      const param = {}
      param.startDate = this.startDate
      param.endDate = this.endDate
      param.loginId = this.param
      return param
    },

    onChange (value, dateString) {
      if (dateString && dateString.length && dateString[0] != '' && dateString[1] != '') {
        this.startDate = moment(dateString[0]).format('YYYY-MM-DD') + ' 00:00:00'
        this.endDate = moment(dateString[1]).format('YYYY-MM-DD') + ' 23:59:59'
      } else {
        this.startDate = ''
        this.endDate = ''
      }

      this.loadData()
    },

    // 查询表格数据
    loadData () {
      this.$refs.onlineGridPager.loadData()
    },

    searchQuery () {
      this.loadData()
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },

    /**
     * 关闭弹窗
     */
    closeChart (load) {
      this.showChartVisible = false
    },
    /**
     * 显示弹窗
     */
    showChart () {
      this.queryData = {
        startDate: this.startDate,
        endDate: this.endDate,
        loginId: this.param
      }

      this.showChartVisible = true
    },

    // 导出
    exportData () {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        loginId: this.param
      }
      $auditApi.exportExcel(data, 'audit/auditExportRestService/loginFail')
    },
    getContainer(){
      return document.getElementById('loginFailLog')
    }

  }
}
</script>
<style scoped type="text/less" lang="less">
  .search-box {width: 340px; line-height: 42px; }
  .center-box { text-align: center; }
  .disable-color { color: @normal-color; &:hover { color: @normal-color } }
  .distance {
    margin-top: 4px;
    margin-left: 20px;
    margin-right: 20px;
  }
</style>

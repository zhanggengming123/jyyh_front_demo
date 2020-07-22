<template>
  <div class="fit" id="accessDenyLog">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}" :footer-cfg="{showBorder: false}">
      <!--搜索-->
      <div slot="header" class="center-box">
        <ta-input-search v-model="param" placeholder="操作用户搜索" class="search-box" @search="searchQuery"  enterButton="搜索"  />
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
        <ta-tag-select title="限制类型" :data="CollectionData('ACCESSDENYTYPE')" :is-multi="true" v-model="accessDenyTypeParam" @change="searchQuery"></ta-tag-select>

        <!-- eChart-->
        <div style="float: right">
          <ta-button icon="area-chart" @click="showChart()" />
          <ta-button @click="exportData()" >导出</ta-button>
        </div>
      </div>
      <!-- table-->
      <ta-table :columns="columns" :dataSource="gridData" :pagination=false>
        <span slot="accessDenyType" slot-scope="text">{{CollectionLabel('ACCESSDENYTYPE',text)}}</span>
        <span slot="userName" slot-scope="text">{{text == null ? '匿名用户' : text}}</span>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          style="float: right; margin-top: 10px;"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="gridData"
          :params="pageParams"
          url="logMg/accessLog/taAccessDenyLogRestService/queryAccessDenyLog"
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
      :title="'实时分析跟踪'"
      :closable=true
      @close="closeChart(false)"
    >
      <access-deny-chart ref="accessDenyChart" @closeModal="closeChart"></access-deny-chart>
    </ta-modal>

  </div>
</template>

<script>

import moment from 'moment'
import accessDenyChart from './part/accessDenyChart'
import $api from './api'
import $auditApi from '../api'

const columns = [
  { title: '操作用户', dataIndex: 'userName', width: '9%', scopedSlots: { customRender: 'userName' } },
  { title: '限制类型', dataIndex: 'accessDenyType', width: '7%', overflowTooltip: true, scopedSlots: { customRender: 'accessDenyType' } },
  { title: '访问URL', dataIndex: 'url', width: '15%', overflowTooltip: true, scopedSlots: { customRender: 'url' } },
  { title: '访问时间', dataIndex: 'accessTime', width: '10%', overflowTooltip: true, scopedSlots: { customRender: 'accessTime' } },
  { title: '客户端IP', dataIndex: 'clientIp', width: '13%', scopedSlots: { customRender: 'clientIp' } },
  { title: '服务端IP', dataIndex: 'serverIp', width: '13%', scopedSlots: { customRender: 'serverIp' } },
  { title: '客户端系统', dataIndex: 'clientSystem', width: '10%', scopedSlots: { customRender: 'clientSystem' } },
  { title: '客户端浏览器', dataIndex: 'clientBrowser', width: '10%', scopedSlots: { customRender: 'clientBrowser' } },
  { title: '浏览器分辨率', dataIndex: 'clientScreenSize', width: '10%', scopedSlots: { customRender: 'clientScreenSize' } },
  { title: '数据是否被篡改', dataIndex: 'isTampered', width: '6%', scopedSlots: { customRender: 'isTampered' } }
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
      accessDenyTypeParam: []
    }
  },
  components: { accessDenyChart },
  mounted () {
    this.loadData()
  },
  methods: {
    moment,
    pageParams () {
      const param = {}
      param.startDate = this.startDate
      param.endDate = this.endDate
      param.userName = this.param
      param.accessDenyTypeArray = this.accessDenyTypeParam
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
      this.showChartVisible = true
    },

    // 导出
    exportData () {
      const data = {
        userName: this.param,
        startDate: this.startDate,
        endDate: this.endDate,
        accessDenyTypeArray: this.accessDenyTypeParam
      }

      $auditApi.exportExcel(data, 'audit/auditExportRestService/accessDeny')
    },
    getContainer(){
      return document.getElementById('accessDenyLog')
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

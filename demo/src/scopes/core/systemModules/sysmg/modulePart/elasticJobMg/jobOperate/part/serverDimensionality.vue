<template>
  <div id="serverDimensionality" class="fit">
    <ta-border-layout :layout="{header:'70px'}" :centerCfg="{showBar: false}" :footer-cfg="{showBorder: false}">
      <div slot="header">
      </div>
      <ta-table :columns="serverColumns" :dataSource="serverGridData" :pagination=false />
      <ta-pagination
              style="float: right; margin-top: 10px;"
              showSizeChanger
              showQuickJumper
              :dataSource.sync="serverGridData"
              :defaultPageSize="6"
              :params="jobPageParams"
              url="logmg/loginLog/loginLogAnalysisRestService/getOnlineInfo"
              ref="onlineGridPager"
      />
    </ta-border-layout>
  </div>
</template>
<script>
import api from '../api'
const serverColumns = [
  {
    title: '服务器IP',
    dataIndex: 'serverIp',
    width: '20%'
  }, {
    title: '运行实例数',
    dataIndex: 'instancesNum',
    width: '20%'
  }, {
    title: '作业总数',
    dataIndex: 'jobsNum',
    width: '20%'
  }, {
    title: '禁用作业数',
    dataIndex: 'disabledJobsNum',
    width: '20%'
  }, {
    title: '操作',
    dataIndex: 'clientSystem',
    width: '20%'
  }]

export default {
  name: 'serverDimensionality',

  components: {
  },

  data () {
    return {
      serverGridData: [],
      serverColumns
    }
  },
  mounted: function () {
  },

  methods: {
    serverPageParams: function () {
      return {}
    },

    loadData () {
    }
  }
}

</script>

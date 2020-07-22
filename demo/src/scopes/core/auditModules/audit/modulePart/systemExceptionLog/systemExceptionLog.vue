<template>
  <div id="systemExceptionLog" class="fit">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}" :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-input-search placeholder="请输入服务器异常ID、IP地址、访问端口" class="search-box" v-model="serverAddress" @search="loadData" enterButton="搜索"></ta-input-search>
      </div>
      <div slot="centerExtraContent">
        <ta-range-picker
          v-model="createTime"
          :placeholder="['开始时间', '结束时间']"
          @change="onChange"
          :get-calendar-container="getContainer"
        />
        <div style="float: right">
          <ta-button icon="area-chart" @click="showChart()" />
        </div>
      </div>
      <ta-table :columns="columns" :dataSource="gridData" rowKey="logId" :pagination=false>
        <span slot="operate" slot-scope="text, record">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          style="float: right; margin-top: 10px;"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="gridData"
          :defaultPageSize="10"
          :params="pageParams"
          url="logmg/exceptionlog/serverExceptionLogRestService/getServerExceptionLog"
          ref="gridPager"
        >
        </ta-pagination>
      </div>
    </ta-border-layout>
    <ta-modal v-model="visible"
              centered
              :footer="null"
              width="1000px"
              :destroyOnClose="true"
              :get-container="getContainer">

      <ta-label-con label="服务地址"
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      style="margin-bottom: 0px">
          <span>{{detailExceptionInfo.server}}</span>
      </ta-label-con>
      <ta-label-con label="异常类型"
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      style="margin-bottom: 20px">
          <span>{{detailExceptionInfo.exceptionName}}</span>
      </ta-label-con>
      <ta-label-con label="异常信息"
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      style="margin-bottom: 0px">
          <ta-textarea :autosize="{ minRows: 20, maxRows: 20 }" v-model="detailExceptionInfo.contentStr"
                       readonly="readonly" class="textarea"></ta-textarea>
      </ta-label-con>
    </ta-modal>

    <ta-modal
      centered
      v-model="showChartVisible"
      width="1000px"
      :bodyStyle="{height:'500px',padding:'0'}"
      :footer="null"
      :destroyOnClose=true
      :maskClosable=true
      :title="'异常次数图'"
      :closable=true
      @close="closeChart(false)"
      :get-container="getContainer"
    >
      <system-exception-chart ref="systemExceptionChart" :queryData="queryData" @closeModal="closeChart" ></system-exception-chart>
    </ta-modal>
  </div>
</template>
<script>
import api from './api'
import systemExceptionChart from './part/systemExceptionChart'
const columns = [{
  title: '异常类型',
  dataIndex: 'exceptionName',
  width: '25%',
  overflowTooltip: true
}, {
  title: '访问URL',
  dataIndex: 'url',
  width: '25%',
  overflowTooltip: true
}, {
  title: '服务器ip地址',
  dataIndex: 'ipAddress',
  width: '14%',
  overflowTooltip: true
}, {
  title: '访问端口',
  dataIndex: 'port',
  width: '80px'
}, {
  title: '客户端ip地址',
  dataIndex: 'clientIp',
  width: '14%',
  overflowTooltip: true
}, {
  title: '报错时间',
  dataIndex: 'createTime',
  width: '11%',
  overflowTooltip: true
}, {
  title: '数据是否被篡改',
  dataIndex: 'isTampered',
  width: '10%',
  overflowTooltip: true
}, {
  title: '操作选项',
  dataIndex: 'operate',
  width: '120px',
  scopedSlots: { customRender: 'operate' },
  align: 'center'
}]
export default {
  name: 'app',
  components: { systemExceptionChart },
  data () {
    return {
      formItemLayout: {
        labelCol: {span: 2},
        wrapperCol: {span: 22}
      },
      serverAddress: '',
      createTime: [],
      startDate: '',
      endDate: '',
      visible: false,
      detailExceptionInfo: {
        server: '',
        exceptionName: '',
        contentStr: ''
      },
      columns,
      operateMenu: [{
        name: '详细异常信息',
        onClick: (record) => {
          this.showModal(record)
        }
      }],
      gridData: [],
      showChartVisible: false,
      queryData: [],
    }
  },
  mounted: function () {
    this.loadData()
  },
  methods: {
    loadData: function () {
      this.$refs.gridPager.loadData((data) => {
      })
    },
    pageParams: function () {
      if (this.startDate !== '' && this.endDate !== '') {
        if (new Date(this.startDate).getTime() > new Date(this.endDate).getTime()) {
          this.$message.error('开始日期不能大于结束日期')
          return
        }
      }
      return {
        startDate: this.startDate,
        endDate: this.endDate,
        serverAddress: this.serverAddress,
      }
    },
    onChange (value, dateString) {
      this.startDate = dateString[0]
      this.endDate = dateString[1]
      this.loadData()
    },
    onDelete: function (logId) {
      let data = {
        logId: logId
      }
      api.deleteExceptionLogByLogId(data, (result) => {
        this.$message.success('删除成功')
        this.loadData()
      })
    },
    showModal: function (record) {
      this.visible = true
      let data = {
        logId: record.logId
      }
      api.getDetalExceptionLog(data, (result) => {
        this.detailExceptionInfo.server = result.data.detailExceptionInfo.ipAddress + ':' + result.data.detailExceptionInfo.port
        this.detailExceptionInfo.exceptionName = result.data.detailExceptionInfo.exceptionName
        this.detailExceptionInfo.contentStr = result.data.detailExceptionInfo.contentStr
      })
    },
    showChart(){
      this.showChartVisible = true;
      if (this.startDate !== '' && this.endDate !== '') {
        if (new Date(this.startDate).getTime() > new Date(this.endDate).getTime()) {
          this.$message.error('开始日期不能大于结束日期')
          return
        }
      }

      this.queryData = {
        startDate: this.startDate,
        endDate: this.endDate,
        serverAddress: this.serverAddress
      }

    },
    closeChart(){
      this.showChartVisible = false;
    },
    getContainer(){
      return document.getElementById('systemExceptionLog')
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .search-box {
    width: 340px;
    line-height: 42px;
  }
  .textarea { .beautifyScrollbar(); }
  .center-box { text-align:center; overflow: hidden; }
</style>

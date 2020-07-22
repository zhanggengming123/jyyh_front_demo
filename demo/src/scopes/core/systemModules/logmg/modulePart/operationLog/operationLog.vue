<template>
  <div id="app" class="fit">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}" :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-input-search placeholder="请输入经办人姓名" class="search-box" v-model="opUser" @search="loadData" enterButton="搜索"></ta-input-search>
      </div>
      <div slot="centerExtraContent">
        <ta-range-picker
          v-model="opTime"
          :placeholder="['开始时间', '结束时间']"
          @change="onChange"
        />
        <div style="float: right">
          <ta-button icon="area-chart" @click="showChart()" />
          <ta-button @click="exportData()" >导出</ta-button>
        </div>
        <ta-select allowClear placeholder="请选择操作类型" v-model="opType" @change="loadData" style="width: 220px" class="filter-name">
          <ta-select-option v-for="item in CollectionData('OPTYPE')" :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
        </ta-select>
        <ta-select allowClear placeholder="请选择影响主体类型" v-model="influenceBodyType" @change="loadData" style="width: 220px" class="filter-name">
          <ta-select-option v-for="item in CollectionData('OPOBJTYPE')" :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
        </ta-select>
        <ta-tag-select title="操作权限" class="filter-name" :data="CollectionData('HAVAORNOT')" :is-multi="true" @change="loadData" v-model="isPermissions"></ta-tag-select>
      </div>
      <ta-table :columns="columns"
                :dataSource="gridData"
                ref="table"
                rowKey="logId"
                :pagination=false>
        <span slot="action" slot-scope="text, record">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
        <span slot="isPermission" slot-scope="text">{{CollectionLabel('HAVAORNOT',text)}}</span>
        <span slot="opType" slot-scope="text">{{CollectionLabel('OPTYPE',text)}}</span>
        <span slot="influenceBodyType" slot-scope="text">{{CollectionLabel('OPOBJTYPE',text)}}</span>
        <span slot="opBodyType" slot-scope="text">{{CollectionLabel('OPOBJTYPE',text)}}</span>
        <span slot="influenceBodyNameSlot" slot-scope="text, record">
            <ta-tag v-if="record.influenceBody && record.influenceBody != '@empty' && !record.influenceBodyName" type="danger" class='no-cursor'>已删除</ta-tag>
            <ta-tag v-else-if="record.influenceBody == '@empty'" type="danger" class='no-cursor'>无操作权限</ta-tag>
            <span v-else>{{record.influenceBodyName}}</span>
          </span>
        <span slot="opSubjectNameSlot" slot-scope="text, record">
          <ta-tag v-if="record.opSubject && !record.opSubjectName" type="danger" class='no-cursor'>已删除</ta-tag>
          <span v-else-if="!record.opSubject && !record.opSubjectName">--</span>
          <span v-else>{{record.opSubjectName}}</span>
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
          url="org/sysmg/orgOpLogRestService/getOrgOpLog"
          ref="gridPager"
        >
        </ta-pagination>
      </div>
    </ta-border-layout>
    <ta-modal v-model="visible"
              centered
              :footer="null"
              width="800px"
              :destroyOnClose="true">
      <ta-form :autoFormCreate="(form)=>{this.form = form}" :layout="formLayout">
        <ta-form-item label="操作内容" style="margin-bottom: 0px">
          <ta-textarea :autosize="{ minRows: 20, maxRows: 20 }" v-model="changeContent" readonly="readonly"/>
        </ta-form-item>
      </ta-form>
    </ta-modal>


    <ta-modal
      centered
      v-model="showChartVisible"
      width="1000px"
      :bodyStyle="{height:'500px',padding:'0'}"
      :footer="null"
      :destroyOnClose=true
      :maskClosable=true
      :title="'数据分析'"
      :closable=true
      @close="closeChart(false)"
    >
      <op-log-chart ref="opLogChart" :queryData="queryData" @closeModal="closeChart"></op-log-chart>
    </ta-modal>
  </div>
</template>
<script>

import api from './api'
import opLogChart from './part/opLogChart'

const columns = [{
  title: '经办人',
  dataIndex: 'name',
  width: '5%',
}, {
  title: '经办时间',
  dataIndex: 'opTime',
  width: '10%',
}, {
  title: '操作权限',
  dataIndex: 'isPermission',
  yesOrNoTag: true,
  width: '10%',
  scopedSlots: {customRender: 'isPermission'}
}, {
  title: '操作类型',
  dataIndex: 'opType',
  width: '10%',
  scopedSlots: {customRender: 'opType'}
}, {
  title: '影响主体类型',
  dataIndex: 'influenceBodyType',
  width: '10%',
  scopedSlots: {customRender: 'influenceBodyType'}
}, {
  title: '影响主体名称',
  dataIndex: 'influenceBodyNameSlot',
  width: '10%',
  scopedSlots: {customRender: 'influenceBodyNameSlot'}
}, {
  title: '操作主体类型',
  dataIndex: 'opBodyType',
  width: '10%',
  scopedSlots: {customRender: 'opBodyType'}
}, {
  title: '操作主体名称',
  dataIndex: 'opSubjectNameSlot',
  width: '10%',
  scopedSlots: {customRender: 'opSubjectNameSlot'}
}, {
  title: '数据是否被篡改',
  dataIndex: 'isTampered',
  width: '10%',
  scopedSlots: {customRender: 'isTampered'}
}, {
  title: '操作',
  dataIndex: 'action',
  align: 'center',
  width: '120px',
  scopedSlots: {customRender: 'action'}
}]

export default {
  name: 'app',
  components: { opLogChart },
  data () {
    return {
      formLayout: 'vertical',
      columns,
      operateMenu: [{
        name: '操作内容',
        isShow: (record) => {
          return record.changeContent
        },
        onClick: (record) => {
          this.showModel(record.logId)
        }
      }],
      gridData: [],
      startDateStr: '',
      endDateStr: '',
      opTime: [],
      opUser: '',
      opType: undefined,
      influenceBodyType: undefined,
      isPermissions: [],
      visible: false,
      changeContent: '',
      showChartVisible: false,
      queryData: [],
    }
  },

  mounted: function () {
    this.loadData()
  },

  methods: {
    pageParams: function () {
      if (this.startDateStr !== '' && this.endDateStr !== '') {
        if (new Date(this.startDateStr).getTime() > new Date(this.endDateStr).getTime()) {
          this.$message.warn('开始日期不能大于结束日期')
          return
        }
      }
      return {
        startDateStr: this.startDateStr === '' ? '' : this.startDateStr + ' 00:00:00',
        endDateStr: this.endDateStr === '' ? '' : this.endDateStr + ' 23:59:59',
        opUser: this.opUser,
        opType: this.opType,
        influenceBodyType: this.influenceBodyType,
        isPermissions: this.isPermissions
      }
    },

    loadData: function () {
      this.$refs.gridPager.loadData((data) => {
      })
    },

    showModel (logId) {
      this.visible = true
      api.getChangeContent({logId: logId}, (result) => {
        this.changeContent = result.data.changeContent
      })
    },

    onChange (value, dateString) {
      this.startDateStr = dateString[0]
      this.endDateStr = dateString[1]
      this.loadData()
    },


    showChart(){
      this.showChartVisible = true;

      if (this.startDateStr !== '' && this.endDateStr !== '') {
        if (new Date(this.startDateStr).getTime() > new Date(this.endDateStr).getTime()) {
          this.$message.warn('开始日期不能大于结束日期')
          return
        }
      }
      this.queryData = {
        startDateStr: this.startDateStr,
        endDateStr: this.endDateStr,
        opUser: this.opUser,
        opType: this.opType,
        influenceBodyType: this.influenceBodyType,
        isPermissions: this.isPermissions
      }

    },
    closeChart(){
      this.showChartVisible = false;
    },

    // 导出
    exportData(){
      let data;
      data = {
        startDateStr: this.startDateStr,
        endDateStr: this.endDateStr,
        opUser: this.opUser,
        opType: this.opType,
        influenceBodyType: this.influenceBodyType,
        isPermissions: this.isPermissions,
        startDate: this.startDateStr,
        endDate: this.endDateStr
      }

      Base.submit(null, {
        url: 'audit/auditExportRestService/orgOp',
        data: data,
        responseType: 'blob'
      }).then((data) => {
        let blob = new Blob([data.data], { type: 'application/xlsx;charset=utf-8' })
        if (window.navigator.msSaveBlob) { // 没有此判断的话，ie11下的导出没有效果
          window.navigator.msSaveBlob(blob, unescape(data.headers.filename))
        } else {
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = unescape(data.headers.filename) // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素

          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
      })
    },
  }
}
</script>
<style scoped type="text/less" lang="less">
  .search-box {
    width: 340px;
    line-height: 42px;
  }
  .center-box { text-align: center; overflow: hidden; }
  .filter-name {
    margin-left: 20px
  }
</style>

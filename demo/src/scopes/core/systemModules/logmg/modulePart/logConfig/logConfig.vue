<template>
  <div id="app" class="fit">
    <ta-border-layout :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}">
      <div slot="centerExtraContent">
        <ta-tag-select title="日志级别" :data="CollectionData('LOGLEVEL')" :is-multi="true" @change="filterClick" v-model="logLevels"></ta-tag-select>
        <div style="float: right">
          <ta-button type="primary" @click="fnAddLogConfig">新增</ta-button>
          <ta-button @click="showFileConfigModal">配置文件路径</ta-button>
        </div>
      </div>
      <ta-form :autoFormCreate="(form)=>{this.form = form}">
        <ta-table :columns="columns" :dataSource="logGridData" :pagination=false>
            <span slot="levelTitle">日志级别 <ta-icon type="edit"/></span>
            <span slot="appenderTypeTitle">输出类型 <ta-icon type="edit"/></span>
            <ta-table-edit slot="level" slot-scope="text, record" type="select" :option="CollectionData('LOGLEVEL')" :beforeChange="changeData"></ta-table-edit>
            <ta-table-edit slot="appenderType" slot-scope="text, record" type="select" :option="output" :multiple="true" :beforeChange="changeData"></ta-table-edit>
            <span slot="action" slot-scope="text, record">
              <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
            </span>
          </ta-table>
      </ta-form>
    </ta-border-layout>

    <ta-drawer :destroyOnClose="true"
               title="新增日志配置"
               width="500px"
               placement="right"
               :closable="true"
               @close="fnCloseLogDrawer(false)" :visible="drawVisible"
               style="height: calc(100% - 55px);overflow: auto;paddingBottom: 53px"
    >
      <add-log-config :bindData="bindData" @closeLogDrawer="fnCloseLogDrawer" ref="addLogConfigDrawer"></add-log-config>
      <div slot="footer">
        <ta-button-group>
          <ta-button @click="handleReset">重置</ta-button>
          <ta-button type="primary" @click="saveLogConfig">保存</ta-button>
        </ta-button-group>
      </div>
    </ta-drawer>
    <ta-modal title="配置文件路径"
              v-model="fileVisible"
              :maskClosable="false"
              width="480px"
              @ok="handleFileConfig"
              :destroyOnClose=true>
      <template slot="footer">
        <ta-button key="back" @click="fileVisible = false">取消</ta-button>
        <ta-button key="submit" type="primary" @click="handleFileConfig">
          保存
        </ta-button>
      </template>

      <ta-label-con label="文件路径">
        <ta-input v-model="fileNamePattern"></ta-input>
      </ta-label-con>
    </ta-modal>
  </div>
</template>
<script>

import api from './api'
import addLogConfig from './part/addLogConfig.vue'

const columns = [{
  title: '包名称',
  dataIndex: 'packageName',
  width: '25%',
  overflowTooltip: true
}, {
  dataIndex: 'level',
  slots: { title: 'levelTitle' },
  scopedSlots: { customRender: 'level' },
  width: '200px'
}, {
  dataIndex: 'appenderType',
  slots: { title: 'appenderTypeTitle' },
  scopedSlots: { customRender: 'appenderType' },
  width: '200px'
}, {
  title: '文件路径',
  dataIndex: 'fileNamePattern',
  width: '25%',
  overflowTooltip: true
}, {
  title: '操作选项',
  dataIndex: 'action',
  scopedSlots: { customRender: 'action' },
  align: 'center',
  width: '200px'
}]

const logLevelList = {
  OFF: { value: '0', label: 'OFF' },
  ERROR: { value: '1', label: 'ERROR' },
  WARN: { value: '2', label: 'WARN' },
  INFO: { value: '3', label: 'INFO' },
  DEBUG: { value: '4', label: 'DEBUG' },
  TRACE: { value: '5', label: 'TRACE' },
  ALL: { value: '6', label: 'ALL' }
}
const output = [{ label: 'console', value: 'console' }, { label: 'file', value: 'file' }, { label: 'kafka', value: 'kafka' }]

export default {
  name: 'app',
  components: { addLogConfig },
  data () {
    return {
      fileVisible: false,
      isConsole: false,
      isFile: false,
      isKafka: false,
      fileNamePattern: '',
      level: '',
      appenderType: [],
      columns,
      operateMenu:[{
        name: '删除',
        type: 'confirm',
        confirmTitle: '确定要删除吗?',
        isShow: (record) => {
          return this.logGridData.length
        },
        onOk: (record) => {
          this.onDelete(record)
        }
      }],
      logGridData: [],
      drawVisible: false,
      bindData: {},
      logLevels: [],
      output,
      logLevelList
    }
  },
  mounted: function () {
    this.loadData()
  },
  methods: {
    loadData (levels) {
      let data = {}
      if (levels) {
        data = { levels: levels.join(',') }
      }
      api.getLogConfig(data, (result) => {
        this.isConsole = result.data.isConsole
        this.isFile = result.data.isFile
        this.isKafka = result.data.isKafka
        this.output.map((item) => {
          item.disabled = true
          if (item.value == 'console' && this.isConsole || item.value == 'file' && this.isFile || item.value == 'kafka' && this.isKafka) {
            item.disabled = false
          }
        })
        this.fileNamePattern = result.data.fileNamePattern
        this.logGridData = result.data.logGridData
        this.logGridData.forEach((item) => {
          item.appenderType = item.appenderType && item.appenderType.length ? item.appenderType.split(',') : []
          item.level = this.logLevelList[item.level].value
        })
      })
    },
    changeData ({ newData, columnKey, record }, callback) {
      const data = {
        packageName: record.packageName,
        level: columnKey == 'level' ? this.CollectionLabel('LOGLEVEL', newData) : this.CollectionLabel('LOGLEVEL', record.level),
        appenderType: columnKey == 'appenderType' ? newData.join(',') : record.appenderType.join(',')
      }
      api.configLevelAndAppenderType(data, (result) => {
        if (result.serviceSuccess) {
          this.$message.success('配置成功')
          record[columnKey] = newData
          callback()
        } else {
          callback('配置失败')
        }
      })
    },
    showFileConfigModal () {
      if (!this.fileNamePattern) {
        this.$message.warn("未配置'file'输出类型")
        return false
      }
      this.fileVisible = true
    },
    handleFileConfig (e) {
      const data = {
        fileNamePattern: this.fileNamePattern
      }
      api.configFileNamePattern(data, (result) => {
        this.loadData()
        this.fileVisible = false
        this.$message.success('配置成功')
      })
    },
    fnAddLogConfig () {
      this.bindData = {
        isConsole: this.isConsole,
        isFile: this.isFile,
        isKafka: this.isKafka
      }
      this.drawVisible = true
    },
    fnCloseLogDrawer (load) {
      this.drawVisible = false
      if (load) {
        this.loadData()
      }
    },
    onDelete: function (record) {
      const data = {
        packageName: record.packageName,
        appenderType: record.appenderType.join(',')
      }
      api.deleteLogConfigByName(data, (result) => {
        this.$message.success('删除成功')
        this.loadData()
      })
    },
    handleReset () {
      this.$refs.addLogConfigDrawer.handleReset()
    },
    saveLogConfig () {
      this.$refs.addLogConfigDrawer.saveLogConfig()
    },
    filterClick (e) {
      const logLevelStrList = []
      this.logLevels.map(item => {
        logLevelStrList.push(this.CollectionLabel('LOGLEVEL', item))
      })
      this.loadData(logLevelStrList)
    }
  }
}
</script>

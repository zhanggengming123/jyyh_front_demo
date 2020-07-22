<template>
  <div class="fit">
    <ta-border-layout :layout="{header:'70px', left: '250px', footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}"  :footer-cfg="{showBorder: false}">
      <!--搜索-->
      <div slot="header" class="center-box">
        <ta-input-search v-model="param" placeholder="字段搜索" class="search-box" @search="searchQuery"  enterButton="搜索"  />
      </div>
      <div slot="centerExtraContent">
        <div style="float: right">
          <ta-button icon="edit" @click="addConfig">
            新增配置
          </ta-button>
          <ta-popover
            width="150"
            trigger="hover"
            content="【功能配置、系统配置】一并重置">
            <ta-button  slot="reference"  icon="reload" @click="refreshConfig">
              重置配置
            </ta-button>
          </ta-popover>
        </div>
      </div>
      <!--begin 加载左侧选择栏-->
      <div slot="left">
        <ta-card :bordered="false" :bodyStyle="{'padding':0}">
          <div slot="title">
            配置类别
          </div>
          <a v-for="(item, index) in configCategory"
             :key="item.value"
             :value="item.label"
             @click="categoryChange(item.value, index)">
            <div class="left-item" :class="{'activeClass':index == clickIndex}">{{item.label}}</div>
          </a>
        </ta-card>
      </div>
      <ta-form :autoFormCreate="(form)=>{this.form = form}">
        <ta-table
          rowKey="id"
          :columns="columns"
          :dataSource="gridData"
        >
          <span slot="fieldName"  slot-scope="text, record" >{{text}}</span>
          <span slot="defaultValueTitle">当前设置 <ta-icon type="edit"/></span>

          <template slot="defaultValue" slot-scope="text, record, index">
            <template v-if="record.dataType == '1'"> <!--文本-->
              <ta-table-edit type="input" :beforeChange="changeData"></ta-table-edit>
            </template>
            <template v-else-if="record.dataType == '2'"><!--时间-->
              <ta-table-edit type="datePicker" :beforeChange="changeData"></ta-table-edit>
            </template>
            <template v-else-if="record.dataType == '3'"><!--选项-->
              <template v-if="record.collectionDatas != ''"><!--自定义码表值-->
                <ta-table-edit type="select" :option="stringToJson(record)" :beforeChange="changeData"></ta-table-edit>
              </template>
              <template v-else-if="record.collectionName != ''"><!--码表值-->
                <ta-table-edit type="select" :option="CollectionData(record.collectionName)" :beforeChange="changeData"></ta-table-edit>
              </template>
              <template v-else>
                <span>{{text}}</span>
              </template>
            </template>
            <template v-else-if="record.dataType == '4'"><!--数字-->
              <ta-table-edit type="inputNumber" :beforeChange="changeData"></ta-table-edit>
            </template>
            <template v-else><!--其他-->
              <span>{{text}}</span>
            </template>
          </template>

          <span slot="configComment"  slot-scope="text" >{{text}}</span>
          <span slot="updateTime"  slot-scope="text, record" >{{moment(record.updateTime).format('YYYY-MM-DD')}}</span>
          <span slot="opUsername"  slot-scope="text" >{{text == null ? '--' : text}}</span>

          <span slot="action" slot-scope="text, record">
            <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
          </span>

        </ta-table>
      </ta-form>
      <div slot="footer">
        <ta-pagination style="float: right; margin-top: 10px;" showSizeChanger showQuickJumper :dataSource.sync="gridData" :defaultPageSize="10" :params="pageParams" :url="searchUrl" ref="gridPager" />
      </div>
    </ta-border-layout>
    <add-config :visible="addConfigVisible" :rowData="rowData" @close="addConfigVisible = false" :configKey="configKey" @addSuccess="addSuccess"></add-config>
  </div>
</template>
<script>
import $api from './api/index'
import moment from 'moment'
import addConfig from './part/addConfig'

const columns = [
  { title: '字段名', dataIndex: 'fieldName', width: '26%', overflowTooltip: true, scopedSlots: { customRender: 'fieldName' } },
  { title: '备注', dataIndex: 'configComment', width: '20%', overflowTooltip: true, scopedSlots: { customRender: 'configComment' } },
  { slots: { title: 'defaultValueTitle' }, dataIndex: 'defaultValue', width: '20%', overflowTooltip: true, scopedSlots: { customRender: 'defaultValue' } },
  { title: '更新时间', dataIndex: 'updateTime', width: '16%', overflowTooltip: true, scopedSlots: { customRender: 'updateTime' } },
  { title: '操作人', dataIndex: 'opUsername', width: '10%', overflowTooltip: true, scopedSlots: { customRender: 'opUsername' } },
  { title: '操作', align: 'center', width: 100, scopedSlots: { customRender: 'action' } }
]

export default {
  name: 'app',
  data () {
    return {
      columns: columns,
      operateMenu: [{
        name: '删除',
        type: 'confirm',
        confirmTitle: '确定删除该配置?',
        onOk:(record)=>{
        this.deleteConfig(record.id)
        }
      }],
      gridData: [],
      isCheckParam: [],
      rowData: {},
      selectedRowKeys: [],
      param: '',
      configCategory: [],
      configKey: '',
      searchUrl: 'tasysconfig/taSysConfigRestService/querySysConfig',
      clickIndex: 0, // 默认选中的下标
      functionType: '1',
      configCategoryType: 'CONFIGSYSTEMCATEGORY',
      addConfigVisible: false
    }
  },
  components: { moment, addConfig },
  mounted () {
    this.initForm()
  },
  methods: {
    // 时间处理函数
    moment,
    pageParams () {
      const param = {}
      param.fieldName = this.param
      param.configKey = this.configKey
      param.functionType = this.functionType // 功能配置
      return param
    },

    // 查询表格数据
    initForm: function (data = {}) {
      this.Base.asyncGetCodeData(this.configCategoryType).then((codeList) => {
        this.configCategory = codeList
        if (this.configCategory != null) { // 默认选择第一个
          this.configKey = this.configCategory[0].value
          this.$refs.gridPager.loadData()
        }
      })
    },

    searchQuery () {
      this.$refs.gridPager.loadData()
    },

    stringToJson (record) {
      return JSON.parse(record.collectionDatas)
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },

    changeData ({ newData, record, columnKey }, callback) {
      this.$confirm({
        title: '确定修改配置？',
        onOk: () => {
          $api.updateSysConfig({ id: record.id, defaultValue: newData, fieldName: record.fieldName, dataType: record.dataType }, (data) => {
            record[columnKey] = newData
            callback()
          })
        },
        onCancel: () => {
          callback()
        }
      })
    },

    categoryChange (value, index) {
      this.configKey = value
      this.$refs.gridPager.loadData()
      // 如果等于当前就不进行加载
      if (this.clickIndex == index) {
        return
      }
      this.clickIndex = index
    },

    addConfig () {
      this.addConfigVisible = true
    },

    refreshConfig() {
      $api.refreshSysConfig({}, (data) => {
        this.$message.success('重置成功')
        this.$refs.gridPager.loadData()
      })
    },

    deleteConfig (id) {
      $api.deleteSysConfig({ id: id }, (data) => {
        this.$message.success('删除成功')
        this.$refs.gridPager.loadData()
      })
    },

    // 成功回调
    addSuccess () {
      this.$refs.gridPager.loadData()
    }

  }
}
</script>
<style scoped type="text/less" lang="less">
  .search-box {width: 340px; line-height: 42px;line-height: 36px\0; }
  .center-box { text-align: center; overflow: hidden; }
  .disable-color { color: @normal-color; &:hover { color: @normal-color } }
  .left-item { width: 100%; height: 50px; line-height: 50px; padding-left: 24px; }
  .activeClass {
    background-color: #fafafa;
    color: @primary-color;
    border-right: 6px solid @primary-color;
  }
</style>

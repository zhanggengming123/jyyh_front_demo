<template>
  <div class="fit">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}" :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-input-search v-model="search" placeholder="输入系统名称/编码/拼音简写" @search="querySystem" enterButton="搜索" class="search-box" />
      </div>
      <div slot="centerExtraContent" style="float: right">
        <ta-button type="primary" @click="addVisible = true">新增</ta-button>
        <ta-button :disabled="!hasSelected" @click="deleteVisible = true">批量删除</ta-button>
      </div>
      <ta-table
        :columns="columns"
        :dataSource="tableData"
        rowKey="id"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :pagination='false'
      >
        <span slot="effective" slot-scope="text">{{CollectionLabel('EFFECTIVE', text)}}</span>
        <span slot="modifyTime" slot-scope="time">{{fnDateFormate(time)}}</span>
        <template v-for="col in ['sysName', 'sysCode', 'backgroundAddress', 'address', 'portalSystem']" :slot="col" slot-scope="text, record, index">
          <div v-if="col!='portalSystem'">
            <ta-input v-if="record.editable" style="margin: -5px 0" :value="text" @change="e => handleChange(e.target.value, record.id, col)"/>
            <template v-else>{{text}}</template>
          </div>
          <div v-if="col=='portalSystem'">
            <ta-select v-if="record.editable" style="margin: -5px 0" defaultValue='是'>
              <ta-select-option value="1">是</ta-select-option>
              <ta-select-option value="0">否</ta-select-option>
            </ta-select>
            <template v-else>{{text}}</template>
          </div>
        </template>
        <span slot="operation" slot-scope="text, record, index">
          <ta-table-operate :operateMenu="operateMenu" ></ta-table-operate>
        </span>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          style="float: right; margin-top: 10px;"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="tableData"
          :defaultPageSize="10"
          :params="pageParams"
          url="org/sysmg/accessSystemManagementRestService/queryAccessSystemByParam"
          ref="accessGridPager"
        />
      </div>
    </ta-border-layout>
    <!--新增-->
    <add-system :visible="addVisible" @close="addVisible = false" @queryTable="querySystem"></add-system>
    <!--编辑-->
    <edit-system :visible="editVisible" @close="editVisible = false; " :rowData="rowData" @editSuccess="editSuccess"></edit-system>
    <!--删除-->
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="deleteOrgBatch" title="接入系统删除" description="所选系统"></ta-careful-delete>
  </div>
</template>
<script>

import addSystem from './part/addSystem'
import editSystem from './part/editSystem'
import $api from './api/index'

const columns = [
  { title: '系统名称', dataIndex: 'sysName', width: '20%', overflowTooltip: true, scopedSlots: { customRender: 'sysName' } },
  { title: '系统自定义编码', width: '15%', overflowTooltip: true, dataIndex: 'sysCode', scopedSlots: { customRender: 'sysCode' } },
  { title: '后台地址', width: '20%', overflowTooltip: true, dataIndex: 'backgroundAddress', scopedSlots: { customRender: 'backgroundAddress' } },
  { title: '系统地址', dataIndex: 'address', width: '20%', overflowTooltip: true, scopedSlots: { customRender: 'address' }, sorter: (a, b) => a.address.length - b.address.length },
  { title: '有效标识', width: '8%', dataIndex: 'effective', key: 'effective', yesOrNoTag: true, scopedSlots: { customRender: 'effective' } },
  { title: '操作', align: 'center', width: '20%', dataIndex: 'operation', scopedSlots: { customRender: 'operation' } }
]

const tableData = []
export default {
  name: 'app',
  data () {
    // 行编辑数据
    this.cacheData = tableData.map(item => ({ ...item }))
    return {
      portalSystem: '1',
      // 是否有效(暂定1为有效,0为无效,默认为1)
      effective: '1',
      addVisible: false,
      editVisible: false,
      deleteVisible: false,
      columns: columns,
      operateMenu: [{
        name: '编辑',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的接入系统不允许编辑' : '',
        onClick: (record) => {
          this.editAccessSystem(record)
        }
      },{
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确定启用该接入系统?',
          onOk: (record) => {
            this.editEffective(record,'1')
          }
        },{
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确定禁用该接入系统?',
          onOk: (record) => {
            this.editEffective(record,'0')
          }
        },{
          name: '删除',
          type: 'confirm',
          confirmTitle: '确定删除?',
          onOk: (record) => {
            this.handleDelete(record.id)
          }
        }]
      }],
      tableData,
      selectedRowKeys: [],
      selectedRows: [],
      rowData: {},
      search: ''
    }
  },
  components: { addSystem, editSystem },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  mounted () {
    this.querySystem()
  },
  methods: {
    // 编辑接入系统
    editAccessSystem (record) {
      this.editVisible = true
      this.rowData = record
    },
    // 分页参数
    pageParams () {
      return {
        sysCode: this.search,
        sysName: this.search,
        spell: this.search
      }
    },
    // 查询表格数据
    querySystem () {
      this.$refs.accessGridPager.loadData()
    },
    // 选中改变事件
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
    },
    editSuccess (newData) {
      this.changeRowData(this.tableData, 'id', newData)
      this.editVisible = false
    },
    changeRowData (data, key, newData) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][key] == newData[key]) {
          data[i] = Object.assign({}, data[i], newData)
          break
        }
        if (data[i].children) {
          this.changeRowData(data[i].children, 'id', newData)
        }
      }
    },
    fnCheckInput (column, value) {
      this.$message.destroy()
      if (column == 'address') {
        const reg = new RegExp('^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$|^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]+)?(\/?[a-zA-Z0-9]+\.?[a-zA-Z0-9]+)?$')
        if (!value.length) {
          this.$message.error('系统地址不能为空', 5)
          return false
        }
        if (!reg.test(value)) {
          this.$message.error('系统地址格式不正确', 5)
          return false
        }
      }
      if (column == 'sysCode') {
        if (!/^[a-z0-9]*$/.test(value)) {
          this.$message.error('格式不正确,接入系统标识只能为小写英文字母和数字组合', 5)
          return false
        }
        if (!value.length) {
          this.$message.error('系统自定义编码不能为空', 5)
          return false
        }
      }
      if (column == 'backgroundAddress') {
        if (!value.length) {
          this.$message.error('后台地址不能为空', 5)
          return false
        }
      }
      if (column == 'sysName') {
        if (!value.length) {
          this.$message.error('系统名称不能为空', 5)
          return false
        }
      }
      return true
    },
    fnCheckAllInput (data) {
      const BreakException = {}
      try {
        data.forEach(item => {
          Object.keys(item).forEach(column => {
            const result = this.fnCheckInput(column, item[column])
            if (!result) throw BreakException
          })
        })
      } catch (e) {
        return false
      }
      return true
    },
    // 行编辑改变值
    handleChange (value, id, column) {
      this.fnCheckInput(column, value)
      const newData = [...this.tableData]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        target[column] = value
        this.tableData = newData
      }
    },
    // 删除接入系统
    handleDelete (id) {
      $api.deleteTaAccessSystemById({ id: id }, (data) => {
        this.$message.success('删除成功')
        this.querySystem()
      })
    },
    // 时间转换
    fnDateFormate (time) {
      var date = new Date(time)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    },
    // 禁用和启用
    editEffective (record, value) {
      if(record.effective == value){
        this.$message.warning('该记录已经' + (value == '1' ? '启用' : '禁用') +'，请勿重复操作！')
        return
      }
      const param = { ...record }
      param.effective = value
      $api.updateTaAccessSystemById(param, (data) => {
        this.$message.success((value == '1' ? '启用' : '禁用') + '成功')
        this.querySystem()
      })
    },
    // 批量删除
    deleteOrgBatch () {
      $api.deleteBatchTaAccessSystemById({ id: this.selectedRowKeys.join(',') }, (data) => {
        this.$message.success('批量删除成功')
        this.querySystem()
        this.selectedRowKeys = []
        this.deleteVisible = false
      })
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .center-box { text-align: center; overflow: hidden; }
  .search-box { width: 340px; line-height: 42px; }
</style>

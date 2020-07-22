<template>
  <div class="fit">
    <div style="height: 48px">
      <ta-dropdown style="float: right">
        <ta-button type="primary">新增服务器 <ta-icon type="down" /></ta-button>
        <ta-menu slot="overlay" @click="clickAdd">
          <ta-menu-item key="tomcat">Tomcat服务器</ta-menu-item>
          <ta-menu-item key="nginx">Nginx服务器</ta-menu-item>
        </ta-menu>
      </ta-dropdown>
    </div>
    <ta-table :columns="columns" style="width:100%;" :pagination='false' rowKey="appId" :data-source="gridData" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
      <span slot="effective" slot-scope="text">{{CollectionLabel('EFFECTIVE', text)}}</span>

      <span slot="operation" slot-scope="text, record, index">
        <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
      </span>
    </ta-table>
    <!--编辑、新增框-->
    <add-or-edit-dep :visible="editVisible" :rowData="rowData" :editType="editType" @close="editVisible = false" @addSuccess="addSuccess" @queryTable="fnQuery"></add-or-edit-dep>
  </div>
</template>
<script>

import addOrEditDep from './addOrEditDep'
const columns = [
  { title: '服务器类型', dataIndex: 'serverType', width: '40%', overflowTooltip: true },
  { title: '节点地址', dataIndex: 'node', width: '60%', overflowTooltip: true },
  { title: '端口', dataIndex: 'port', width: 100 },
  { title: '有效标识', dataIndex: 'effective', width: 120, yesOrNoTag: true, scopedSlots: {customRender: 'effective'} },
  { title: '操作', align: 'center', width: 140, scopedSlots: {customRender: 'operation'} }
]

const gridData = [
  { serverId: 0, serverType: 'tomcat', node: '192.168.17.18', port: '8089', effective: '0' },
  { serverId: 1, serverType: 'tomcat', node: '192.168.17.18', port: '8089', effective: '1' },
  { serverId: 2, serverType: 'nginx', node: '192.168.17.18', port: '8089', effective: '1' },
  { serverId: 3, serverType: 'nginx', node: '192.168.17.18', port: '8080', effective: '0' },
  { serverId: 4, serverType: 'tomcat', node: '192.168.17.18', port: '8089', effective: '0' }
]

export default {
  name: 'app',
  data () {
    return {
      columns,
      operateMenu:[{
        name: '编辑',
        onClick:(record)=>{
          this.editVisible = true
          this.rowData = record
          this.editType = record.serverType
        }
      },{
        name:'删除',
        type: 'confirm',
        confirmTitle: '确认删除该应用?',
        onOk: (record) => {
          this.addSuccess(record)
        }
      }],
      gridData,
      editVisible: false,
      selectedRowKeys: [],
      editType: '',
      rowData: {}
    }
  },
  components: {addOrEditDep},
  mounted () {
    this.fnQuery()
  },
  methods: {
    // 查询表格数据
    fnQuery: function (data = {}) {
      /*   $api.querySiteByParentId({'parentId': ''}, (data) => {
            this.gridData = data.data.siteList
          }) */
    },
    // 点击搜索
    searchQuery () {
      this.fnQuery()
    },
    clickAdd ({ item, key, keyPath }) {
      this.editVisible = true
      this.rowData = {}
      this.editType = key
    },
    addSuccess () {},
    fnVisit (record) {
      const { href } = this.$router.resolve({path: 'console', query: {appId: record.appId, appName: record.appName}})
      window.open(href, '_blank')
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>
<style lang="less" scoped type="text/less">
  .mg-r { margin-right: 30px; }
  .btn-add { float: right; height: 42px; }
</style>

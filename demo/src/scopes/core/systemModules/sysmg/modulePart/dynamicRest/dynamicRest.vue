<template>
  <div class="fit">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true}" :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-input-search class="search-box" v-model="search" placeholder="服务ID/服务名称/sql" @search="queryDynamic"
                         enterButton="搜索"></ta-input-search>
      </div>
      <div slot="centerExtraContent" style="line-height: 44px; float: right">
        <ta-button type="primary" @click="openForm">新增</ta-button>
        <ta-dropdown :trigger="['click']">
          <ta-menu slot="overlay">
            <ta-menu-item :disabled="!selectedRowKeys.length">
              <ta-popconfirm title="确认启用所选动态服务?" @confirm="enable(false)">
                <ta-icon type="check-circle"/>
                <span class="mg-l12">启用</span>
              </ta-popconfirm>
            </ta-menu-item>
            <ta-menu-divider/>
            <ta-menu-item :disabled="!selectedRowKeys.length">
              <ta-popconfirm title="确认禁用所选动态服务?" @confirm="disable(false)">
                <ta-icon type="stop"/>
                <span class="mg-l12">禁用</span>
              </ta-popconfirm>
            </ta-menu-item>
            <ta-menu-divider/>
            <ta-menu-item :disabled="!selectedRowKeys.length" @click="deleteVisible = true">
              <ta-icon type="close-circle"/>
              删除
            </ta-menu-item>
          </ta-menu>
          <ta-button>
            批量操作
            <ta-icon type="down"/>
          </ta-button>
        </ta-dropdown>
      </div>
      <ta-table
        :columns="columns"
        :dataSource="tableData"
        rowKey="id"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :pagination='false'
      >
        <span slot="restName" slot-scope="text,record"
              :class="{'disable-color': record.effective === '0' }">{{text}}</span>
        <span slot="effective" slot-scope="text">{{CollectionLabel('EFFECTIVE', text)}}</span>
        <span slot="operation" slot-scope="text, record, index">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
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
          url="dynamic/rest/queryList"
          ref="dynamicGridPager"></ta-pagination>
      </div>
    </ta-border-layout>
    <dynamic-rest :visible="formVisible" @close="closeForm" :row-data="rowData"
                  @queryTable="queryDynamic"></dynamic-rest>

    <ta-modal v-model="contentVisible"
              centered
              :footer="null"
              width="800px"
              :destroyOnClose="true">
      <ta-form :autoFormCreate="(form)=>{this.form = form}" :layout="formLayout">
        <ta-form-item label="返回数据" style="margin-bottom: 0px">
          <ta-textarea :autosize="{ minRows: 20, maxRows: 20 }" v-model="content" readonly="readonly"></ta-textarea>
        </ta-form-item>
      </ta-form>
    </ta-modal>
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="deleteBatch" title="动态服务删除" description="选中动态服务"></ta-careful-delete>
  </div>
</template>
<script>

import dynamicRest from './part/edit'
import $api from './api/index'

const columns = [
  {
    title: '服务名称',
    dataIndex: 'restName',
    width: '17%',
    overflowTooltip: true,
    scopedSlots: { customRender: 'restName' }
  },
  { title: '服务SQL', width: '17%', overflowTooltip: true, dataIndex: 'sql', scopedSlots: { customRender: 'sql' } },
  {
    title: '服务ID',
    width: '20%',
    overflowTooltip: true,
    dataIndex: 'restId',
    scopedSlots: { customRender: 'restId' }
  },
  { title: '数据源', dataIndex: 'dsName', width: '16%', overflowTooltip: true, scopedSlots: { customRender: 'dsName' } },
  { title: '有效性', dataIndex: 'effective', width: '10%', yesOrNoTag: true, scopedSlots: { customRender: 'effective' } },
  { title: '操作', align: 'center', width: '20%', dataIndex: 'operation', scopedSlots: { customRender: 'operation' } }
]

export default {
  name: 'dynamic',
  data () {
    return {
      formLayout: 'vertical',
      content: '',
      contentVisible: false,
      search: '',
      formVisible: false,
      columns,
      operateMenu: [{
        name: '访问',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的服务不允许访问' : '',
        onClick: (record) => {
          this.visit(record)
        }
      }, {
        name: '编辑',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的服务不允许访问' : '',
        onClick: (record) => {
          this.openForm(record)
        }
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确定启用该动态服务?',
          onOk: (record) => {
            this.enable(record)
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确定禁用该动态服务?',
          onOk: (record) => {
            this.disable(record)
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确定删除该动态服务?',
          onOk: (record) => {
            this.handleDelete(record.id)
          }
        }]
      }],
      tableData: [],
      rowData: {},
      selectedRowKeys: [],
      selectRows: [],
      deleteVisible: false
    }
  },
  components: { dynamicRest },
  computed: {},
  mounted () {
    this.queryDynamic()
  },
  methods: {
    // drawer open event
    openForm (rowData) {
      this.formVisible = true
      // if the rowData is null or defined, it's mean that to add one dynamic service
      if (rowData === undefined || rowData.id == null) {
        this.rowData = {}
        this.rowData.restId = this.generateUUID()
      } else {
        this.rowData = rowData
      }
    },

    // get pageParams
    pageParams () {
      const searchParam = this.search
      if (searchParam === null || searchParam === '') {
        return {}
      }
      return {
        param: searchParam
      }
    },

    // drawer close event
    closeForm () {
      this.formVisible = false
    },

    // table select change event
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    // query table data
    queryDynamic () {
      this.$refs.dynamicGridPager.loadData()
    },

    /* delete batch */
    deleteBatch () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择需要删除的动态服务列表。')
      }
      this.$confirm({
        title: '删除服务',
        content: '确认删除所选服务列表吗?',
        cancelText: '取消',
        okText: '确认',
        onOk: () => {
          const idString = this.selectedRowKeys.join(',')
          this.delete(idString)
        }
      })
    },

    /* handle delete */
    handleDelete (id) {
      this.delete(id)
    },

    /* delete */
    delete (idList) {
      $api.deleteBatch(null, { ids: idList }, (data) => {
        this.queryDynamic()
        this.deleteVisible = false
        this.$message.success('删除成功')
      })
    },

    enable (record) {
      let selectKeys
      if (record) {
        if (record.effective == '1') {
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        selectKeys = record.id
      } else {
        selectKeys = this.selectedRowKeys.join(',')
      }
      $api.enable(this, { ids: selectKeys }, data => {
        this.queryDynamic()
        this.$message.success('启用成功')
      })
    },

    disable (record) {
      let selectKeys
      if (record) {
        if (record.effective == '0') {
          this.$message.warning('该记录已经禁用，请勿重复操作！')
          return
        }
        selectKeys = record.id
      } else {
        selectKeys = this.selectedRowKeys.join(',')
      }
      $api.disable(this, { ids: selectKeys }, data => {
        this.queryDynamic()
        this.$message.success('禁用成功')
      })
    },
    // visit the dynamic service
    visit (record) {
      $api.excutor(this, record.restId, data => {
        this.contentVisible = true
        this.content = JSON.stringify(data, null, 4)
      })
    },

    // generate uuid
    generateUUID () {
      /**
                 * String 4 char
                 * @return {string}
                 */
      function S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }

      return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .disable-color {
    color: #cccccc
  }

  .mg-l12 {
    margin-left: 12px
  }

  .search-box {
    width: 340px;
    line-height: 42px;
    line-height: 36px \0;
  }

  .center-box {
    text-align: center;
  }
</style>

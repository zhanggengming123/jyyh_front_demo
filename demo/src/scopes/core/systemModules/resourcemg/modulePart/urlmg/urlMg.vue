<template>
  <div class="fit">
    <ta-border-layout :layout="{header:'70px'}"
                      :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}">
      <div slot="header" class="center-box">
        <ta-input-search class="search-box" v-model="search" placeholder="名称/URL"
                         enterButton="搜索" @search="searchUrl"></ta-input-search>
      </div>
      <div slot="centerExtraContent" style="line-height: 44px; float: right">
        <ta-button type="primary" @click="addNameSpace">新增</ta-button>
        <ta-dropdown :trigger="['click']">
          <ta-menu slot="overlay">
            <ta-menu-item :disabled="!selectedRowKeys.length">
              <ta-popconfirm title="确认启用所选URL以及下级URL?" cancelText="取消" okText="确认" @confirm="enableBatch(false)">
                <ta-icon type="check-circle"/>
                <span class="mg-l12">启用</span>
              </ta-popconfirm>
            </ta-menu-item>
            <ta-menu-divider/>
            <ta-menu-item :disabled="!selectedRowKeys.length">
              <ta-popconfirm title="确认禁用所选动态服务?" cancelText="取消" okText="确认" @confirm="disableBatch(false)">
                <ta-icon type="stop"/>
                <span class="mg-l12">禁用</span>
              </ta-popconfirm>
            </ta-menu-item>
            <ta-menu-divider/>
            <ta-menu-item @click="deleteVisible = true" :disabled="!selectedRowKeys.length">
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
        :columns="tableColumn"
        :dataSource="tableData"
        @expand="loadChild"
        rowKey="id"
        :scroll="{ y: '100%' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :pagination='false'
      >
        <span slot="name" slot-scope="text,record"
              :class="{'disable-color': record.effective === '0' }">{{text}}</span>
        <span slot="effective" slot-scope="text">{{CollectionLabel('EFFECTIVE', text)}}</span>
        <span slot="type" slot-scope="text">{{CollectionLabel('URLTYPE', text)}}</span>
        <span slot="operation" slot-scope="text, record, index">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
      </ta-table>
    </ta-border-layout>
    <url-edit :visible="formVisible" @close="closeForm" :row-data="rowData"
              @searchUrl="searchUrl"></url-edit>
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="deleteBatch" title="URL删除" description="所选URL"></ta-careful-delete>

  </div>
</template>

<script>

import $api from './api/index'
import urlEdit from './part/edit'

const tableColumn = [
  {
    title: '名称',
    dataIndex: 'name',
    width: '15%',
    overflowTooltip: true,
    scopedSlots: { customRender: 'name' }
  },
  { title: 'URL', width: '25%', overflowTooltip: true, dataIndex: 'url', scopedSlots: { customRender: 'url' } },
  {
    title: '类型',
    width: '10%',
    overflowTooltip: true,
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '有效性',
    dataIndex: 'effective',
    width: '8%',
    yesOrNoTag: true,
    scopedSlots: { customRender: 'effective' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '15%',
    overflowTooltip: true,
    scopedSlots: { customRender: 'createTime' }
  },
  { title: '操作', align: 'center', width: '27%', dataIndex: 'operation', scopedSlots: { customRender: 'operation' } }
]

export default {
  name: 'urlMg',
  data () {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      search: '',
      tableColumn,
      operateMenu: [{
        name: '添加下级',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的URL不允许添加下级' : '',
        isShow: (record) => {
          return record.type == '0'
        },
        onClick: (record) => {
          this.addRestUrl(record)
        }
      }, {
        name: '编辑',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的URL不允许编辑' : '',
        onClick: (record) => {
          this.update(record)
        }
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该URL资源?',
          onOk: (record) => {
            this.enableBatch(record)
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该URL资源?',
          onOk: (record) => {
            this.disableBatch(record)
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该URL资源?',
          onOk: (record) => {
            this.deleteUrl(record.id)
          }
        }]
      }],
      tableData: [],
      // form control
      formVisible: false,
      rowData: {},
      deleteVisible: false
    }
  },
  // 引入组件
  components: { urlEdit },
  // 页面初始化时执行内容
  mounted () {
    this.queryUrl()
  },
  methods: {
    searchUrl () {
      // 搜索条件为空时，异步搜索
      if (this.search == null || this.search === '') {
        this.queryNamespace()
        return
      }
      const param = {
        url: this.search,
        name: this.search
      }
      this.queryUrlByParam(param)
    },
    queryUrlByParam (param) {
      $api.queryUrlByParam(param, (data) => {
        this.tableData = data.data.urls
      })
    },
    queryNamespace () {
      $api.queryNamespace(null, (data) => {
        this.tableData = data.data.urls
      })
    },
    loadChild (expanded, record) {
      if (expanded) {
        if (record.children.length === 0) {
          $api.queryUrlByNamespace({
            namespace: record.id
          }, data => {
            record.children = data.data.urls
          })
        }
      }
    },
    queryUrl () {
      this.queryNamespace()
    },
    deleteUrl (id) {
      const data = {
        ids: id
      }
      $api.deleteUrl(data, (data) => {
        this.$message.success('删除成功！')
        this.searchUrl()
        this.deleteVisible = false
      })
    },
    deleteBatch () {
      const arr = this.selectedRowKeys
      const idString = arr.join(',')
      this.deleteUrl(idString)
    },

    update (record) {
      this.rowData = record
      this.openForm()
    },
    addNameSpace () {
      this.rowData = {}
      this.openForm()
    },
    addRestUrl (record) {
      // 先置空
      this.rowData = {}
      this.rowData.namespace = record.id
      this.rowData.namespaceName = record.name
      this.openForm()
    },

    disableBatch (record) {
      let rowsArr = []
      if (record) {
        if (record.effective == '0') {
          this.$message.warning('该记录已经禁用，请勿重复操作！')
          return
        }
        rowsArr.push(record.id)
      } else {
        rowsArr = this.selectedRowKeys
      }
      const data = {
        ids: rowsArr.join(',')
      }
      $api.disableUrl(data, (data) => {
        this.$message.success('禁用成功！')
        this.searchUrl()
      })
    },

    enableBatch (record) {
      let rowsArr = []
      if (record) {
        if (record.effective == '1') {
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        rowsArr.push(record.id)
      } else {
        rowsArr = this.selectedRowKeys
      }
      const data = {
        ids: rowsArr.join(',')
      }
      $api.enableUrl(data, (data) => {
        this.$message.success('启用成功！')
        this.searchUrl()
      })
    },

    openForm () {
      this.formVisible = true
    },
    closeForm () {
      this.formVisible = false
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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

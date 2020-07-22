<template>
    <div id="freeBusyJobManager" class="fit">
        <ta-border-layout :layout="{header:'55px',footer:'70px'}" :centerCfg="{showBar: true}" :footer-cfg="{showBorder: false}">
            <template slot="header">
                <ta-breadcrumb separator=">" style="line-height: 29px">
                    <ta-breadcrumb-item><a @click="fnBackToHome">作业管理</a></ta-breadcrumb-item>
                    <ta-breadcrumb-item>闲忙任务管理</ta-breadcrumb-item>
                </ta-breadcrumb>
            </template>
            <div slot="centerExtraContent">
                <ta-alert :message="'当前注册中心名称：'+this.zkData.appName" type="info" showIcon/>
            </div>
            <ta-tabs class="fit content-box">
                <ta-tab-pane tab="闲忙任务列表">
                    <ta-table :columns="columns" :dataSource="gridData" rowKey="id"
                              :rowSelection="{selectedRowKeys: selectedRowKeys, onSelect: fnOnSelect, onSelectAll : fnOnSelectAll}"
                              :pagination=false>
                        <span slot="action" slot-scope="text, record">
                          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
                        </span>
                    </ta-table>
                </ta-tab-pane>
                <template slot="tabBarExtraContent">
                    <ta-button @click="fnBackToHome"><ta-icon type="rollback"/>返回</ta-button>
                    <ta-button type="primary" @click="clickAdd">新增</ta-button>
                    <ta-button :disabled="btnDisable" @click="batchDelete">批量删除</ta-button>
                </template>
            </ta-tabs>
          <div slot="footer">
            <ta-pagination
              style="float: right; margin-top: 10px;"
              showSizeChanger
              showQuickJumper
              :dataSource.sync="gridData"
              :defaultPageSize="10"
              :params="pageParams"
              url="jobmg/elasticjob/freeBusyJobManagerRestService/getFreeBusyJob"
              ref="gridPager"
            />
          </div>
        </ta-border-layout>
        <ta-drawer :title="drawerTitle"
                   width="520"
                   @close="handleCloseFreeBusyDrawer"
                   :visible="visible"
                   destroyOnClose>
            <add-free-busy-job ref="freeBusy" :editType="editType" :zkData="zkData" :fbData="fbData"
                               :jobNameList="jobNameList" :ipList="ipList"
                               @close="handleCloseFreeBusyDrawer"
                               @queryTable="loadData"></add-free-busy-job>
            <template slot="footer">
                <ta-button-group>
                    <ta-button @click="handleResetFreeBusy()">重置</ta-button>
                    <ta-button type="primary" @click="handleSaveFreeBusy()">保存</ta-button>
                </ta-button-group>
            </template>
        </ta-drawer>
    </div>
</template>
<script>

import api from '../api/index'
import addFreeBusyJob from '../part/addFreeBusyJob'

const columns = [{
  title: '任务名称',
  dataIndex: 'jobName',
  width: '20%',
  overflowTooltip: true
}, {
  title: '空闲时刻',
  dataIndex: 'freeMoment',
  width: '15%',
  overflowTooltip: false
}, {
  title: '繁忙时刻',
  dataIndex: 'busyMoment',
  width: '15%',
  overflowTooltip: false
}, {
  title: '被操作的服务器IP',
  dataIndex: 'serverIps',
  width: '40%',
  overflowTooltip: true
}, {
  title: '操作',
  dataIndex: 'action',
  width: '10%',
  scopedSlots: {customRender: 'action'},
  align: 'center'
}]

export default {
  name: 'app',
  data () {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      columns,
      operateMenu:[{
        name: '编辑',
        onClick: (record) =>{
          this.editFreeBusyJob(record)
        }
      },{
        name: '删除',
        type: 'confirm',
        confirmTitle: '确定要删除吗?',
        isShow: (record)=>{
          return this.gridData.length
        },
        onOk: (record) =>{
          this.onDelete(record.id)
        }
      },],
      gridData: [],
      zkId: undefined,
      appNameList: [],
      visible: false,
      editType: '',
      drawerTitle: '新增闲忙任务',
      zkData: {},
      fbData: {},
      jobNameList: [],
      ipList: []
    }
  },

  components: {addFreeBusyJob},

  mounted: function () {
    if (this.$route.params.zkData instanceof Object) {
      this.zkData = this.$route.params.zkData || {}
      this.loadData()
    } else {
      this.$router.push({name: 'zookeeperRegistryCenterConfig'})
    }
  },

  computed: {
    btnDisable () {
      return !this.selectedRowKeys.length
    }
  },

  methods: {

    fnBackToHome () {
      this.$router.push({name: 'zookeeperRegistryCenterConfig'})
    },

    handleResetFreeBusy () {
      this.$refs.freeBusy.onResetForm()
    },

    handleSaveFreeBusy () {
      this.$refs.freeBusy.onSubmitForm()
    },

    handleCloseFreeBusyDrawer () {
      this.visible = false
      this.fbData = {}
      this.jobNameList = []
      this.ipList = []
    },

    loadData: function () {
      this.$refs.gridPager.loadData((data) => {
        this.selectedRowKeys = []
        this.selectedRows = []
      })
    },

    pageParams: function () {
      return {
        zkId: this.zkData.zkId
      }
    },

    clickAdd () {
      this.drawerTitle = '新增闲忙任务'
      this.editType = 'add'
      let data = {
        zkId: this.zkData.zkId,
        zkAddress: this.zkData.zkAddress,
        appNamespace: this.zkData.appNamespace
      }
      api.getJobNameByZkId(data, (result) => {
        if (!result.data.jobNameList || result.data.jobNameList.length < 1) {
          this.$message.warn('没有可用任务添加')
        } else {
          this.jobNameList = result.data.jobNameList
          this.visible = true
        }
      })
    },

    onDelete (id) {
      api.deleteFreeBusyJob({ids: id}, (result) => {
        this.$message.success('删除成功')
        this.loadData()
      })
    },

    batchDelete () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择数据')
        return
      }
      this.$confirm({
        title: '批量删除闲忙任务',
        content: '确认删除闲忙任务吗?',
        cancelText: '取消',
        okText: '确认',
        onOk: () => {
          let ids = this.selectedRows.map(function (record) {
            return record.id
          })
          api.deleteFreeBusyJob({ids: ids.join(',')}, (result) => {
            this.$message.success('批量删除成功')
            this.loadData()
          })
        }
      })
    },

    fnOnSelect: function (record, selected) {
      const {selectedRowKeys, selectedRows} = this
      if (selected) {
        selectedRowKeys.push(record.id)
        selectedRows.push(record)
      } else {
        this.selectedRowKeys = selectedRowKeys.filter(id => id != record.id)
        this.selectedRows = selectedRows.filter(item => item.id != record.id)
      }
    },

    fnOnSelectAll: function (selected, selectedRows) {
      this.selectedRows = []
      this.selectedRowKeys = []
      if (selected) {
        selectedRows.map(item => {
          this.selectedRowKeys.push(item.id)
        })
        this.selectedRows = selectedRows
      }
    },

    editFreeBusyJob (record) {
      this.drawerTitle = '更新闲忙任务'
      this.editType = 'edit'
      this.fbData = record
      let data = {
        zkId: this.zkData.zkId,
        zkAddress: this.zkData.zkAddress,
        appNamespace: this.zkData.appNamespace,
        jobName: this.fbData.jobName
      }
      api.getAllServerIpsByJobName(data, (result) => {
        if (!result.data.ipList || result.data.ipList.length < 1) {
          this.$message.warn('任务没有启动，不可编辑')
        } else {
          this.ipList = result.data.ipList
          this.visible = true
        }
      })
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
    .notice-box {
        width: 100%;
        float: left;
    }
    .content-box {
        overflow: visible;
    }
</style>

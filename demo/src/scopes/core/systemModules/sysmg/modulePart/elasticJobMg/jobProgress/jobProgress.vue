<template>
    <div id="app" class="fit">
        <ta-border-layout :layout="{header:'70px'}" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}">
            <div slot="header" class="center-box">
                <ta-input-search placeholder="请输入作业名称" class="search-box" v-model="jobName" @search="loadData" enterButton="搜索"></ta-input-search>
            </div>
            <div slot="centerExtraContent" style="float: right">
              <ta-button @click="clearCache">清除已完成缓存</ta-button>
            </div>
            <ta-table :columns="columns" :dataSource="gridData" :pagination=false>
                <span slot="percent" slot-scope="text, record">
                   <ta-progress :percent="Math.round((record.progress / record.total) * 100)" size="small"/>
                </span>
                <span slot="action" slot-scope="text, record">
                   <ta-button size="small" class="refresh" @click="refresh(record.jobName,record.shardingItem)">刷新</ta-button>
                </span>
            </ta-table>
        </ta-border-layout>
    </div>
</template>
<script>

import api from './api'

const columns = [
  { title: '作业名称', dataIndex: 'jobName', width: '20%' },
  { title: '分片项', dataIndex: 'shardingItem', width: '10%' },
  { title: '数据总数', dataIndex: 'total', width: '10%' },
  { title: '当前处理数', dataIndex: 'progress', width: '10%' },
  { title: '处理异常数', dataIndex: 'errorNum', width: '10%' },
  { title: '开始时间', dataIndex: 'startDate', width: '10%' },
  { title: '作业进度', dataIndex: 'percent', width: '10%', scopedSlots: { customRender: 'percent' } },
  { title: '操作', dataIndex: 'action', width: '10%', scopedSlots: { customRender: 'action' }, align: 'center' }
]

export default {
  name: 'app',
  data () {
    return {
      timer: undefined,
      jobName: '',
      columns,
      gridData: []
    }
  },

  mounted: function () {
    this.loadData()
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.loadData()
      }, 5000)
    }
  },

  beforeDestroy () {
    clearInterval(this.timer)
  },

  methods: {
    loadData: function () {
      let data = {
        jobName: this.jobName
      }
      api.getJobProgress(data, (result) => {
        this.gridData = result.data.jobProgress
      })
    },

    refresh (jobName, shardingItem) {
      let newData = [...this.gridData]
      let target = newData.filter(item => jobName === item.jobName && item.shardingItem == shardingItem)[0]
      let data = {
        jobName: jobName,
        shardingItem: shardingItem
      }
      api.refreshProgress(data, (result) => {
        target.total = result.data.jobProgress.total
        target.progress = result.data.jobProgress.progress
        target.errorNum = result.data.jobProgress.errorNum
        target.startDate = result.data.jobProgress.startDate
        this.gridData = newData
      })
    },

    clearCache () {
      api.clearCache({}, (result) => {
        this.$message.success('清除已完成任务进度缓存成功')
        this.loadData()
      })
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
    .search-box {
        width: 340px;
        line-height: 42px;
    }
    .center-box { text-align: center; overflow: hidden; }
    .refresh {
        color: #fff;
        padding: 1px 5px;
        font-size: 12px;
        line-height: 1.5;
        border-radius: 3px;
        font-family: inherit;
        cursor: pointer;
        text-transform: none;
        overflow: visible;
        margin: 0;
        background-color: #3FCC6F;
        border-color: #3FCC6F;
    }
</style>

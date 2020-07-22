<template>
  <div id="jobDimensionality" class="fit">
    <ta-border-layout :layout="{header:'70px'}" :centerCfg="{showBar: false}">
      <div slot="header" class="center-box">
        <ta-input-search placeholder="请输入作业名称" class="search-box" @search="loadData" v-model="searchInfo" enterButton="搜索"></ta-input-search>
      </div>
      <ta-table :columns="jobColumns" :dataSource="jobGridData" :pagination=false>
        <template slot="status" slot-scope="text">
          <ta-tag v-if="text == 'OK'" color="#00a65a " class='no-cursor'>正常</ta-tag>
          <ta-tag v-else-if="text == 'CRASHED'" color="#FF0000" class='no-cursor'>已下线</ta-tag>
          <ta-tag v-else-if="text == 'DISABLED'" color="#f39c12" class='no-cursor'>已失效</ta-tag>
          <ta-tag v-else="text == 'SHARDING_FLAG'" color="#00c0ef" class='no-cursor'>分片待调整</ta-tag>
        </template>
        <template slot="action" slot-scope="text, record">
                    <span v-if="record.status == 'OK'">
                        <ta-button size="small" class="edit action-button-common" @click="handleShowJobDetailDrawer(record.jobName)">
                           修改
                        </ta-button>
                        <ta-button size="small" class="detail action-button-common">
                           详情
                        </ta-button>
                        <ta-button size="small" class="trigger action-button-common">
                           触发
                        </ta-button>
                        <ta-button size="small" class="failure action-button-common">
                           失效
                        </ta-button>
                        <ta-button size="small" class="terminate action-button-common">
                           终止
                        </ta-button>
                    </span>
          <span v-if="record.status == 'CRASHED'">
                        <ta-button size="small" class="edit action-button-common">
                           修改
                        </ta-button>
                        <ta-button size="small" class="delete action-button-common">
                           删除
                        </ta-button>
                    </span>
          <span v-if="record.status == 'DISABLED'">
                        <ta-button size="small" class="edit action-button-common">
                           修改
                        </ta-button>
                        <ta-button size="small" class="detail action-button-common">
                           详情
                        </ta-button>
                        <ta-button size="small" class="effect action-button-common">
                           生效
                        </ta-button>
                        <ta-button size="small" class="terminate action-button-common">
                           终止
                        </ta-button>
                    </span>
          <span v-if="record.status == 'SHARDING_FLAG'">
                         <ta-button size="small" class="edit action-button-common">
                           修改
                        </ta-button>
                        <ta-button size="small" class="detail action-button-common">
                           详情
                        </ta-button>
                        <ta-button size="small" class="terminate action-button-common">
                           终止
                        </ta-button>
                    </span>
        </template>
      </ta-table>
    </ta-border-layout>
    <ta-drawer title="修改作业"
               width="520"
               @close="handleCloseJobDetailDrawer"
               :visible="jobDetailDrawerVisible"
               destroyOnClose>
      <edit-job ref="jobDetail" :initData="jobDetailData" @close="handleHideJobDetailDrawer"></edit-job>
      <template slot="footer">
        <ta-button-group>
          <ta-button @click="handleResetJobDetail()">重置</ta-button>
          <ta-button type="primary" @click="handleSaveJobDetail()">保存</ta-button>
        </ta-button-group>
      </template>
    </ta-drawer>
  </div>
</template>

<script>

import api from '../api'
import editJob from '../part/job/editJob'

const jobColumns = [
  {
    title: '作业名称',
    dataIndex: 'jobName',
    width: '20%'
  }, {
    title: '分片总数',
    dataIndex: 'shardingTotalCount',
    width: '10%'
  }, {
    title: 'Cron表达式',
    dataIndex: 'cron',
    width: '15%'
  }, {
    title: '描述信息',
    dataIndex: 'description',
    width: '25%'
  }, {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: {customRender: 'status'},
    width: '10%'
  }, {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: {customRender: 'action'},
    width: '20%'
  }]

export default {
  name: 'jobDimensionality',

  components: {editJob},

  data () {
    return {
      jobGridData: [],
      jobColumns,
      searchInfo: '',
      jobDetailData: {},
      jobDetailDrawerVisible: false
    }
  },

  mounted: function () {
    this.loadData()
  },

  methods: {
    loadData () {
      let data = {
        jobName: this.searchInfo
      }
      api.getJobInfo(data, (result) => {
        this.jobGridData = result.data.jobGridData
      })
    },

    onSearchJob () {
      this.jobGridData.filter(data => data.jobName != this.searchInfo)
    },

    handleCloseJobDetailDrawer () {
      this.handleHideJobDetailDrawer(false)
    },

    handleHideJobDetailDrawer (isReLoad) {
      // if(isReLoad) this.fnToHandleQueryResource()
      this.jobDetailDrawerVisible = false
    },

    handleResetJobDetail () {
      this.$refs.jobDetail.fnResetJobDetail()
    },

    handleSaveJobDetail () {
      this.$refs.jobDetail.fnSaveJobDetail()
    },

    handleShowJobDetailDrawer (jobName) {
      let data = {
        jobName: jobName
      }
      api.getJobDetailInfo(data, (result) => {
        this.jobDetailData = result.data.jobDetailData
      })
      this.jobDetailDrawerVisible = true
    }
  }
}

</script>
<style scoped type="text/less" lang="less">
  .search-box {
    width: 340px;
    line-height: 42px;
    margin-right: 10px;
  }

  .edit {
    background-color: #3c8dbc;
    border-color: #367fa9;
  }

  .detail {
    background-color: #00acd6;
    border-color: #269abc;
  }

  .trigger {
    background-color: #008d4c;
    border-color: #398439;
  }

  .failure {
    background-color: #f39c12;
    border-color: #e08e0b;
  }

  .terminate {
    background-color: #d73925;
    border-color: #ac2925;

  }

  .effect {
    background-color: #008d4c;
    border-color: #398439;
  }

  .delete {
    background-color: #d73925;
    border-color: #ac2925;
  }

  .action-button-common {
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
  }
  .center-box { text-align: center; overflow: hidden; }
</style>

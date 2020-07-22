<template>
    <div id="jobDimensionality" class="fit">
        <ta-border-layout :layout="{header:'55px'}" :centerCfg="{showBar: true}">
            <template slot="header">
                <ta-breadcrumb separator=">" style="line-height: 29px">
                    <ta-breadcrumb-item><a @click="fnBackToHome">作业管理</a></ta-breadcrumb-item>
                    <ta-breadcrumb-item>作业维度</ta-breadcrumb-item>
                </ta-breadcrumb>
            </template>
            <div slot="centerExtraContent">
                <ta-alert :message="'当前注册中心名称：'+this.zkData.appName" type="info" showIcon/>
            </div>
            <ta-tabs class="fit content-box">
                <ta-tab-pane tab="作业详情">
                    <ta-table :columns="jobColumns" :dataSource="jobGridData" rowKey="jobName" :pagination=false>
                        <template slot="status" slot-scope="text">
                            <ta-tag v-if="text == 'OK'" color="#00a65a " class='no-cursor'>正常</ta-tag>
                            <ta-tag v-else-if="text == 'CRASHED'" color="#d2d6de" class='no-cursor'>已下线</ta-tag>
                            <ta-tag v-else-if="text == 'DISABLED'" color="#f39c12" class='no-cursor'>已失效</ta-tag>
                            <ta-tag v-else-if="text == 'SHARDING_FLAG'" color="#00c0ef" class='no-cursor'>分片待调整</ta-tag>
                        </template>
                        <template slot="action" slot-scope="text, record">
                    <span v-if="record.status == 'OK'">
                        <ta-button size="small" class="edit action-button-common"
                                   @click="handleShowJobDetailDrawer(record.jobName)">
                           修改
                        </ta-button>
                        <ta-button size="small" class="detail action-button-common"
                                   @click="routeToJobDetail(record.jobName)">
                           详情
                        </ta-button>
                        <ta-button size="small" class="trigger action-button-common"
                                   @click="triggerJob(record.jobName)">
                           触发
                        </ta-button>
                        <ta-button size="small" class="failure action-button-common"
                                   @click="disableJob(record.jobName)">
                           失效
                        </ta-button>
                        <ta-popconfirm title="确定要继续终止操作吗?" @confirm="() => shutdownJob(record.jobName)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="terminate action-button-common">
                               终止
                            </ta-button>
                        </ta-popconfirm>
                    </span>
                            <span v-if="record.status == 'CRASHED'">
                        <ta-button size="small" class="edit action-button-common"
                                   @click="handleShowJobDetailDrawer(record.jobName)">
                           修改
                        </ta-button>

                        <ta-popconfirm title="确定要继续删除操作吗?" @confirm="removeJob(record.jobName)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="delete action-button-common">
                                删除
                            </ta-button>
                        </ta-popconfirm>
                    </span>
                            <span v-if="record.status == 'DISABLED'">
                        <ta-button size="small" class="edit action-button-common"
                                   @click="
                                   (record.jobName)">
                           修改
                        </ta-button>
                        <ta-button size="small" class="detail action-button-common"
                                   @click="routeToJobDetail(record.jobName)">
                           详情
                        </ta-button>
                        <ta-button size="small" class="effect action-button-common" @click="enableJob(record.jobName)">
                           生效
                        </ta-button>
                        <ta-popconfirm title="确定要继续终止操作吗?" @confirm="() => shutdownJob(record.jobName)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="terminate action-button-common">
                               终止
                            </ta-button>
                        </ta-popconfirm>
                    </span>
                            <span v-if="record.status == 'SHARDING_FLAG'">
                         <ta-button size="small" class="edit action-button-common"
                                    @click="handleShowJobDetailDrawer(record.jobName)">
                           修改
                        </ta-button>
                        <ta-button size="small" class="detail action-button-common"
                                   @click="routeToJobDetail(record.jobName)">
                           详情
                        </ta-button>
                        <ta-popconfirm title="确定要继续终止操作吗?" @confirm="() => shutdownJob(record.jobName)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="terminate action-button-common">
                               终止
                            </ta-button>
                        </ta-popconfirm>
                    </span>
                        </template>
                    </ta-table>
                </ta-tab-pane>
                <template slot="tabBarExtraContent">
                    <ta-button @click="fnBackToHome"><ta-icon type="rollback"/>返回</ta-button>
                </template>
            </ta-tabs>
        </ta-border-layout>
        <ta-drawer title="修改作业"
                   width="520"
                   @close="handleCloseJobDetailDrawer"
                   :visible="jobDetailDrawerVisible"
                   destroyOnClose>
            <edit-job ref="jobDetail" :initData="jobDetailData" @close="handleHideJobDetailDrawer(true)"></edit-job>
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

import api from '../api/index'
import editJob from '../part/editJob'

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
    width: '20%',
    align: 'center'
  }]

export default {
  name: 'jobDimensionality',

  components: {editJob},

  data () {
    return {
      jobGridData: [],
      jobColumns,
      jobDetailData: {},
      jobDetailDrawerVisible: false,
      zkData: {}
    }
  },

  mounted: function () {
    if (this.$route.params.zkData instanceof Object) {
      this.zkData = this.$route.params.zkData || {}
      this.loadData()
    } else {
      this.$router.push({name: 'zookeeperRegistryCenterConfig'})
    }
  },

  methods: {
    loadData () {
      let data = {
        zkId: this.zkData.zkId,
        zkAddress: this.zkData.zkAddress,
        appNamespace: this.zkData.appNamespace
      }
      api.getJobInfo(data, (result) => {
        this.jobGridData = result.data.jobGridData
      })
    },

    handleCloseJobDetailDrawer () {
      this.handleHideJobDetailDrawer(false)
    },

    handleHideJobDetailDrawer (isReLoad) {
      this.jobDetailDrawerVisible = false
      if (isReLoad) {
        this.loadData()
      }
    },

    handleResetJobDetail () {
      this.$refs.jobDetail.fnResetJobDetail()
    },

    handleSaveJobDetail () {
      this.$refs.jobDetail.fnSaveJobDetail()
    },

    handleShowJobDetailDrawer (jobName) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: jobName
      }
      api.getJobDetailInfo(data, (result) => {
        this.jobDetailData = result.data.jobDetailData
        this.jobDetailData.zkId = this.zkData.zkId
      })
      this.jobDetailDrawerVisible = true
    },

    fnBackToHome () {
      this.$router.push({name: 'zookeeperRegistryCenterConfig'})
    },

    routeToJobDetail (jobName) {
      this.$router.push(
        {
          name: 'jobDetail',
          params: {
            jobDetailData: {
              zkData: this.zkData,
              jobName: jobName
            }
          }
        }
      )
    },

    triggerJob (jobName) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: jobName
      }
      api.triggerJob(data, (result) => {
        this.$message.success('触发操作成功')
        this.loadData()
      })
    },

    disableJob (jobName) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: jobName
      }
      api.disableJob(data, (result) => {
        this.$message.success('失效操作成功')
        this.loadData()
      })
    },

    enableJob (jobName) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: jobName
      }
      api.enableJob(data, (result) => {
        this.$message.success('生效操作成功')
        this.loadData()
      })
    },

    shutdownJob (jobName) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: jobName
      }
      api.shutdownJob(data, (result) => {
        this.$message.success('终止操作成功')
        this.loadData()
      })
    },

    removeJob (jobName) {
      api.removeJob({zkId: this.zkData.zkId, jobName: jobName}, (result) => {
        this.$message.success('删除操作成功')
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
        margin-right: 10px;
    }

    .notice-box {
        float: left;
        width: 50%;
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
</style>

<template>
    <div id="jobDetail" class="fit">
        <ta-border-layout :layout="{header:'55px'}" :centerCfg="{showBar: true, barHeight:'90px'}">
            <template slot="header">
                <ta-breadcrumb separator=">" style="line-height: 29px">
                    <ta-breadcrumb-item><a @click="fnBackToHome">作业管理</a></ta-breadcrumb-item>
                    <ta-breadcrumb-item><a @click="fnBackToServer">服务器维度</a></ta-breadcrumb-item>
                    <ta-breadcrumb-item>服务器详情</ta-breadcrumb-item>
                </ta-breadcrumb>
            </template>
            <div slot="centerExtraContent">
                <ta-alert :message="'当前服务器IP：'+this.serverIp" type="info" showIcon class="notice-box"/>
                <ta-tag-select title="状态"
                               :data="[{value: 'OK', label: '已启用'},{value: 'DISABLED', label: '已失效'},{value: 'CRASHED', label: '已下线'}]"
                               :is-multi="false"
                               @change="loadData"
                               v-model="statusArr"
                               style="float: left"
                               class="filter-name"></ta-tag-select>
                <div style="float: right">
                    <ta-button @click="fnBackToServer"><ta-icon type="rollback"/>返回</ta-button>
                </div>
            </div>
            <ta-table :columns="detailColumns" :dataSource="detailGridData" :pagination=false>
                <template slot="status" slot-scope="text, record">
                    <ta-tag v-if="text == 'OK' && record.instanceCount > 0" color="#00a65a " class='no-cursor'>已启用</ta-tag>
                    <ta-tag v-else-if="record.instanceCount == 0" color="#d2d6de" class='no-cursor'>已下线</ta-tag>
                    <ta-tag v-else-if="text == 'DISABLED'" color="#f39c12" class='no-cursor'>已失效</ta-tag>
                    <ta-tag v-else-if="text == 'SHARDING_FLAG'" color="#00c0ef" class='no-cursor'>分片待调整</ta-tag>
                </template>
                <template slot="action" slot-scope="text, record">
                    <span v-if="record.status == 'OK' && record.instanceCount > 0">
                        <ta-button size="small" class="failure action-button-common"
                                   @click="disabledServerJob(record.jobName)">
                           失效
                        </ta-button>
                        <ta-popconfirm title="确定要继续终止操作吗?" @confirm="shutdownServerJob(record.jobName)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="terminate action-button-common">
                               终止
                            </ta-button>
                        </ta-popconfirm>
                    </span>
                    <span v-if="record.instanceCount == 0">
                        <ta-popconfirm title="确定要继续删除操作吗?" @confirm="removeServerJob(record.jobName)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="delete action-button-common">
                                删除
                            </ta-button>
                        </ta-popconfirm>
                    </span>
                    <span v-if="record.status == 'DISABLED' && record.instanceCount > 0">
                        <ta-button size="small" class="effect action-button-common"
                                   @click="enableServerJob(record.jobName)">
                           生效
                        </ta-button>
                        <ta-popconfirm title="确定要继续终止操作吗?" @confirm="shutdownServerJob(record.jobName)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="terminate action-button-common">
                               终止
                            </ta-button>
                        </ta-popconfirm>
                    </span>
                    <span v-if="record.status == 'SHARDING_FLAG'">
                         <ta-button size="small" class="failure action-button-common"
                                    @click="disabledServerJob(record.jobName)">
                           失效
                        </ta-button>
                        <ta-popconfirm title="确定要继续终止操作吗?" @confirm="shutdownServerJob(record.jobName)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="terminate action-button-common">
                               终止
                            </ta-button>
                        </ta-popconfirm>
                    </span>
                </template>
            </ta-table>
        </ta-border-layout>
    </div>
</template>

<script>

import api from '../api/index'

const detailColumns = [
  {
    title: '作业名称',
    dataIndex: 'jobName',
    width: '30%'
  }, {
    title: '运行实例数',
    dataIndex: 'instanceCount',
    width: '30%'
  }, {
    title: '状态',
    dataIndex: 'status',
    width: '25%',
    scopedSlots: {customRender: 'status'}
  }, {
    title: '操作',
    dataIndex: 'action',
    width: '15%',
    align: 'center',
    scopedSlots: {customRender: 'action'}
  }]

export default {
  name: 'jobDetail',

  components: {},

  data () {
    return {
      detailGridData: [],
      detailColumns,
      zkData: {},
      serverIp: '',
      statusArr: []
    }
  },

  mounted: function () {
    if (this.$route.params.serverDetailData instanceof Object) {
      this.zkData = this.$route.params.serverDetailData.zkData || {}
      this.serverIp = this.$route.params.serverDetailData.serverIp
      this.loadData()
    } else {
      this.$router.push({name: 'serverDimensionality'})
    }
  },

  methods: {

    loadData () {
      let data = {
        zkId: this.zkData.zkId,
        serverIp: this.serverIp,
        runStatus: this.statusArr.join(',')
      }
      api.getServerJobDetail(data, (result) => {
        this.detailGridData = result.data.detailGridData
      })
    },

    fnBackToHome () {
      this.$router.push({
        name: 'zookeeperRegistryCenterConfig',
        params: {
          zkData: this.zkData
        }
      })
    },

    fnBackToServer () {
      this.$router.push({
        name: 'serverDimensionality',
        params: {
          zkData: this.zkData
        }
      })
    },

    disabledServerJob (jobName) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: jobName,
        serverIp: this.serverIp
      }
      api.disabledServerJob(data, (result) => {
        this.$message.success('失效操作成功')
        this.loadData()
      })
    },

    enableServerJob (jobName) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: jobName,
        serverIp: this.serverIp
      }
      api.enableServerJob(data, (result) => {
        this.$message.success('生效操作成功')
        this.loadData()
      })
    },

    shutdownServerJob (jobName) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: jobName,
        serverIp: this.serverIp
      }
      api.shutdownServerJob(data, (result) => {
        this.$message.success('终止操作成功')
        this.loadData()
      })
    },

    removeServerJob (jobName) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: jobName,
        serverIp: this.serverIp
      }
      api.removeServerJob(data, (result) => {
        this.$message.success('删除操作成功')
        this.loadData()
      })
    }
  }
}

</script>
<style scoped type="text/less" lang="less">
    .notice-box {
        width: 100%;
        margin-bottom: 10px;
    }

    .filter-name {
        margin-top: 7px;
        margin-left: 20px
    }

    .effect {
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

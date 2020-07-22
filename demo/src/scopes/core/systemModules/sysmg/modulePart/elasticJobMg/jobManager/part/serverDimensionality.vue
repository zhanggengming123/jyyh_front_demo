<template>
    <div id="serverDimensionality" class="fit">
        <ta-border-layout :layout="{header:'55px'}" :centerCfg="{showBar: true}">
            <template slot="header">
                <ta-breadcrumb separator=">" style="line-height: 29px">
                    <ta-breadcrumb-item><a @click="fnBackToHome">作业管理</a></ta-breadcrumb-item>
                    <ta-breadcrumb-item>服务器维度</ta-breadcrumb-item>
                </ta-breadcrumb>
            </template>
            <div slot="centerExtraContent">
                <ta-alert :message="'当前注册中心名称：'+this.zkData.appName" type="info" showIcon/>
            </div>
            <ta-tabs class="fit content-box">
                <ta-tab-pane tab="服务器详情">
                    <ta-table :columns="serverColumns" :dataSource="serverGridData" :pagination=false>
                        <template slot="action" slot-scope="text, record">
                    <span v-if="record.instancesNum > 0 && record.disabledJobsNum == 0">
                        <ta-button size="small" class="detail action-button-common"
                                   @click="routeToServerDetail(record.serverIp)">
                           详情
                        </ta-button>
                        <ta-button size="small" class="failure action-button-common"
                                   @click="disableServer(record.serverIp)">
                           失效
                        </ta-button>
                        <ta-popconfirm title="确定要继续终止操作吗?" @confirm="shutdownServer(record.serverIp)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="terminate action-button-common">
                               终止
                            </ta-button>
                        </ta-popconfirm>
                    </span>
                            <span v-if="record.instancesNum > 0 && record.disabledJobsNum > 0">
                        <ta-button size="small" class="detail action-button-common"
                                   @click="routeToServerDetail(record.serverIp)">
                           详情
                        </ta-button>
                        <ta-button size="small" class="effect action-button-common"
                                   @click="enableServer(record.serverIp)">
                           生效
                        </ta-button>
                        <ta-popconfirm title="确定要继续终止操作吗?" @confirm="shutdownServer(record.serverIp)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="terminate action-button-common">
                               终止
                            </ta-button>
                        </ta-popconfirm>
                    </span>
                            <span v-if="record.instancesNum == 0">
                        <ta-popconfirm title="确定要继续删除操作吗?" @confirm="removeServer(record.serverIp)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="delete action-button-common">
                                删除
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
    </div>
</template>

<script>

import api from '../api/index'

const serverColumns = [
  {
    title: '服务器IP',
    dataIndex: 'serverIp',
    width: '20%'
  }, {
    title: '运行实例数',
    dataIndex: 'instancesNum',
    width: '20%'
  }, {
    title: '作业总数',
    dataIndex: 'jobsNum',
    width: '20%'
  }, {
    title: '禁用作业数',
    dataIndex: 'disabledJobsNum',
    width: '20%'
  }, {
    title: '操作',
    dataIndex: 'action',
    width: '20%',
    align: 'center',
    scopedSlots: {customRender: 'action'}
  }]

export default {
  name: 'serverDimensionality',

  components: {},

  data () {
    return {
      serverGridData: [],
      serverColumns,
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
      api.getServerInfo(data, (result) => {
        this.serverGridData = result.data.serverGridData
      })
    },

    fnBackToHome () {
      this.$router.push({name: 'zookeeperRegistryCenterConfig'})
    },

    routeToServerDetail (serverIp) {
      this.$router.push(
        {
          name: 'serverDetail',
          params: {
            serverDetailData: {
              zkData: this.zkData,
              serverIp: serverIp
            }
          }
        }
      )
    },

    disableServer (serverIp) {
      let data = {
        zkId: this.zkData.zkId,
        serverIp: serverIp
      }
      api.disableServer(data, (result) => {
        this.$message.success('失效操作成功')
        this.loadData()
      })
    },

    enableServer (serverIp) {
      let data = {
        zkId: this.zkData.zkId,
        serverIp: serverIp
      }
      api.enableServer(data, (result) => {
        this.$message.success('生效操作成功')
        this.loadData()
      })
    },

    shutdownServer (serverIp) {
      let data = {
        zkId: this.zkData.zkId,
        serverIp: serverIp
      }
      api.shutdownServer(data, (result) => {
        this.$message.success('终止操作成功')
        this.loadData()
      })
    },

    removeServer (serverIp) {
      api.removeServer({zkId: this.zkData.zkId, serverIp: serverIp}, (result) => {
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

    .detail {
        background-color: #00acd6;
        border-color: #269abc;
    }

    .failure {
        background-color: #f39c12;
        border-color: #e08e0b;
    }

    .effect {
        background-color: #008d4c;
        border-color: #398439;
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

<template>
    <div id="jobDetail" class="fit">
        <ta-border-layout :layout="{header:'55px'}" :centerCfg="{showBar: true, barHeight:'90px'}">
            <template slot="header">
                <ta-breadcrumb separator=">" style="line-height: 29px">
                    <ta-breadcrumb-item><a @click="fnBackToHome">作业管理</a></ta-breadcrumb-item>
                    <ta-breadcrumb-item><a @click="fnBackToJob">作业维度</a></ta-breadcrumb-item>
                    <ta-breadcrumb-item>作业详情</ta-breadcrumb-item>
                </ta-breadcrumb>
            </template>
            <div slot="centerExtraContent">
                <ta-alert :message="'当前作业名称：'+this.jobName" type="info" showIcon class="notice-box"/>
                <ta-tag-select title="是否支持自动失效转移"
                               :data="[{value: '1', label: '是'},{value: '0', label: '否'}]"
                               @change="loadData"
                               v-model="isSupport"
                               class="filter-name"></ta-tag-select>
                <ta-tag-select title="状态" class="filter-name"
                               :data="[{value: 'RUNNING', label: '运行中'},{value: 'DISABLED', label: '已失效'},{value: 'SHARDING_FLAG', label: '分片待调整'},{value: 'PENDING', label: '等待运行'}]"
                               :is-multi="true"
                               @change="loadData"
                               v-model="statusArr"></ta-tag-select>
                <div style="float: right">
                    <ta-button @click="fnBackToJob"><ta-icon type="rollback"/>返回</ta-button>
                </div>
            </div>
            <ta-table :columns="detailColumns" :dataSource="detailGridData" :pagination=false>
                <template slot="status" slot-scope="text">
                    <ta-tag v-if="text == 'RUNNING'" color="#00a65a" class='no-cursor'>运行中</ta-tag>
                    <ta-tag v-else-if="text == 'DISABLED'" color="#f39c12" class='no-cursor'>已失效</ta-tag>
                    <ta-tag v-else-if="text == 'SHARDING_FLAG'" color="#00c0ef" class='no-cursor'>分片待调整</ta-tag>
                    <ta-tag v-else-if="text == 'PENDING'" color="#00c0ef" class='no-cursor'>等待运行</ta-tag>
                </template>
                <template slot="failover" slot-scope="text">
                    <ta-tag v-if="text" type="success" class='no-cursor'>是</ta-tag>
                    <ta-tag v-else type="danger" class='no-cursor'>否</ta-tag>
                </template>
                <template slot="action" slot-scope="text, record">
                    <span v-if="record.status == 'DISABLED'">
                        <ta-popconfirm title="确定要继续生效操作吗?" @confirm="effectSharding(record.item)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="effect action-button-common">
                                生效
                            </ta-button>
                        </ta-popconfirm>
                    </span>
                    <span v-else>
                        <ta-popconfirm title="确定要继续失效操作吗?" @confirm="disabledSharding(record.item)"
                                       okText="确定" cancelText="取消" okType="default">
                            <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                            <ta-button size="small" class="failure action-button-common">
                                失效
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
    title: '分片项',
    dataIndex: 'item',
    width: '18%'
  }, {
    title: '服务器IP',
    dataIndex: 'serverIp',
    width: '18%'
  }, {
    title: '进程ID',
    dataIndex: 'instanceId',
    width: '18%'
  }, {
    title: '状态',
    dataIndex: 'status',
    width: '18%',
    scopedSlots: {customRender: 'status'}
  }, {
    title: '支持自动失效转移',
    dataIndex: 'failover',
    width: '18%',
    scopedSlots: {customRender: 'failover'}
  }, {
    title: '操作',
    dataIndex: 'action',
    width: '10%',
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
      jobName: '',
      isSupport: [],
      statusArr: []
    }
  },

  mounted: function () {
    if (this.$route.params.jobDetailData instanceof Object) {
      this.zkData = this.$route.params.jobDetailData.zkData || {}
      this.jobName = this.$route.params.jobDetailData.jobName
      this.loadData()
    } else {
      this.$router.push({name: 'jobDimensionality'})
    }
  },

  methods: {

    loadData () {
      let data = {
        zkId: this.zkData.zkId,
        jobName: this.jobName,
        isSupport: this.isSupport.join(','),
        shardingStatus: this.statusArr.join(',')
      }
      api.getJobServerDetail(data, (result) => {
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

    fnBackToJob () {
      this.$router.push({
        name: 'jobDimensionality',
        params: {
          zkData: this.zkData
        }
      })
    },

    disabledSharding (item) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: this.jobName,
        item: item
      }
      api.disabledSharding(data, (result) => {
        this.$message.success('失效操作成功')
        this.loadData()
      })
    },

    effectSharding (item) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: this.jobName,
        item: item
      }
      api.effectSharding(data, (result) => {
        this.$message.success('生效操作成功')
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

<template>
  <div id="environmentDetail" class="fit">
    <ta-border-layout :layout="{header:'70px'}" :centerCfg="{showBar: false}">
      <div slot="header">
        <ta-form :autoFormCreate="(form)=>{this.form4= form}" layout="horizontal">
          <ta-row>
            <ta-col :span="5">
              <ta-form-item label='用户姓名'
                            :labelCol="{ span: 8 }"
                            :wrapperCol="{ span: 16 }"
                            style="margin-bottom: 0"
              >
                <ta-input v-model="name"/>
              </ta-form-item>
            </ta-col>
            <ta-col :span="5">
              <ta-form-item label="操作系统"
                            :labelCol="{ span: 11 }"
                            :wrapperCol="{ span: 13 }"
                            style="margin-bottom: 0"
              >
                <ta-input :disabled="bindData.isTypecs" v-model="bindData.typecs"/>
              </ta-form-item>
            </ta-col>
            <ta-col :span="5">
              <ta-form-item label="分辨率"
                            :labelCol="{ span: 10 }"
                            :wrapperCol="{ span: 14 }"
                            style="margin-bottom: 0"
              >
                <ta-input :disabled="bindData.isTypecss" v-model="bindData.typecss"/>
              </ta-form-item>
            </ta-col>
            <ta-col :span="5">
              <ta-form-item label="浏览器"
                            :labelCol="{ span: 10 }"
                            :wrapperCol="{ span: 14 }"
                            style="margin-bottom: 0"
              >
                <ta-input :disabled="bindData.isTypecb" v-model="bindData.typecb"/>
              </ta-form-item>
            </ta-col>
            <ta-col :offset="1" :span="3">
              <ta-form-item :wrapperCol="{ span: 24 }"
                            style="margin-bottom: 0">
                <ta-button-group>
                  <ta-button type='primary' icon="search" @click="queryLoginEnvironmentDetail">查询</ta-button>
                </ta-button-group>
              </ta-form-item>
            </ta-col>
          </ta-row>
        </ta-form>
      </div>
      <ta-table :columns="environmentDetialColumns"
                :dataSource="environmentDetialGridData"
                :pagination=false>
      </ta-table>
      <ta-pagination
        style="float: right; margin-top: 10px;"
        showSizeChanger
        showQuickJumper
        :dataSource.sync="environmentDetialGridData"
        :defaultPageSize="6"
        :params="detailPageParams"
        url="logmg/loginLog/loginLogAnalysisRestService/queryLoginEnvironmentDetail"
        ref="detailGridPager"
      />
    </ta-border-layout>
  </div>
</template>

<script>

import api from '../api'

const environmentDetialColumns = [
  {
    title: '登录ID',
    dataIndex: 'loginId',
    key: 'loginId',
    width: 167,
    align: 'center'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 167,
    align: 'center'
  }, {
    title: '登录时间',
    dataIndex: 'loginTime',
    key: 'loginTime',
    width: 167,
    align: 'center'
  }, {
    title: '客户端ip',
    dataIndex: 'clientIp',
    key: 'clientIp',
    width: 167,
    align: 'center'
  }, {
    title: '客户端系统',
    dataIndex: 'clientSystem',
    key: 'clientSystem',
    width: 167,
    align: 'center'
  }, {
    title: '客户端浏览器',
    key: 'clientBrowser',
    dataIndex: 'clientBrowser',
    width: 167,
    align: 'center'
  }, {
    title: '客户端分辨率',
    key: 'clientScreenSize',
    dataIndex: 'clientScreenSize',
    width: 167,
    align: 'center'
  }]

export default {
  name: 'environmentDetail',
  props: ['bindData'],
  data () {
    return {
      name: '',
      environmentDetialColumns,
      environmentDetialGridData: []
    }
  },

  mounted: function () {
    this.queryLoginEnvironmentDetail()
  },

  methods: {

    detailPageParams: function () {
      return {
        startDate: this.bindData.startDate,
        endDate: this.bindData.endDate,
        gridColumnType: this.bindData.gridColumnType,
        name: this.name,
        typecs: this.bindData.typecs,
        typecss: this.bindData.typecss,
        typecb: this.bindData.typecb
      }
    },

    queryLoginEnvironmentDetail () {
      this.$refs.detailGridPager.loadData((data) => {
      })
    }
  }
}

</script>



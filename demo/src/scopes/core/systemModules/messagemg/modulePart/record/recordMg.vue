<template>
  <div class="fit">
    <ta-tabs tabPosition="right" defaultActiveKey="notice" type="card">
      <ta-tab-pane key="notice" style="overflow: hidden">
        <span slot="tab"><ta-icon type="mail" />通知</span>
        <ta-tabs  v-model="activeNotice" @change="noticeTabChange">
          <ta-tab-pane key="1" tab="未读消息" style="height: 85%">
            <div class="msg-item msg-item-notice">
              <div v-if="noticeList1.length>0">
                <ta-collapse @change="noticeDetailChange">
                  <ta-collapse-panel v-for="item in noticeList1" :key="item.mId">
                    <template slot="header">
                      <ta-icon type="sound" style="color: #ca1064" v-if="item.type=='01'"/>
                      <ta-icon type="form" style="color: #04b2dc" v-else-if="item.type.indexOf('02') == 0"/>
                      <ta-icon type="mail" style="color: #108ee9" v-else-if="item.type=='03'"/>
                      <span class="msg-title">{{item.title}}</span>
                      <span class="msg-info">from: {{item.senderName}}-{{item.sendDate}}</span>
                    </template>
                    <p class="msg-detail-detail" v-html="item.content">{{item.content}}</p>
                    <div v-show="item.noticeFileList!=null && item.noticeFileList.length>=1">
                      <ta-divider orientation="left">附件</ta-divider>
                      <ta-list itemLayout="horizontal" :dataSource="item.noticeFileList">
                        <ta-list-item slot="renderItem" slot-scope="item, index">
                          <a :href="backUrl+'/message/downloadNoticeFile?annexId='+item.annexId">
                            <ta-icon type="download" style="color: #0f990f"/>
                            {{item.annexName}}</a>
                        </ta-list-item>
                      </ta-list>
                    </div>
                  </ta-collapse-panel>
                </ta-collapse>
              </div>
              <div v-else style="text-align: center;">
                没有通知
              </div>
            </div>
          </ta-tab-pane>
          <ta-tab-pane key="2" tab="全部消息" style="height: 85%">
            <div class="msg-item msg-item-notice" >
              <div v-if="noticeList2.length>0">
                <ta-collapse @change="noticeDetailChange">
                  <ta-collapse-panel v-for="item in noticeList2" :key="item.mId">
                    <template slot="header">
                      <ta-icon type="sound" style="color: #ca1064" v-if="item.type=='01'"/>
                      <ta-icon type="form" style="color: #04b2dc" v-else-if="item.type.indexOf('02') == 0"/>
                      <ta-icon type="mail" style="color: #108ee9" v-else-if="item.type=='03'"/>
                      <span class="msg-title">{{item.title}}</span>
                      <span class="msg-info">from: {{item.senderName}}-{{item.sendDate}}</span>
                    </template>
                    <p class="msg-detail-detail" v-html="item.content">{{item.content}}</p>
                    <div v-show="item.noticeFileList!=null && item.noticeFileList.length>=1">
                      <ta-divider orientation="left">附件</ta-divider>
                      <ta-list itemLayout="horizontal" :dataSource="item.noticeFileList">
                        <ta-list-item slot="renderItem" slot-scope="item, index">
                          <a :href="backUrl+'/message/downloadNoticeFile?annexId='+item.annexId">
                            <ta-icon type="download" style="color: #0f990f"/>
                            {{item.annexName}}</a>
                        </ta-list-item>
                      </ta-list>
                    </div>
                  </ta-collapse-panel>
                </ta-collapse>
              </div>
              <div v-else style="text-align: center;">
                没有通知
              </div>
            </div>
          </ta-tab-pane>
          <ta-tab-pane key="3" tab="已发消息记录" style="height: 85%">
            <div class="msg-item msg-item-notice">
              <div v-if="noticeList3.length>0">
                <ta-collapse @change="noticeDetailChange">
                  <ta-collapse-panel v-for="item in noticeList3" :key="item.mId">
                    <template slot="header">
                      <ta-icon type="sound" style="color: #ca1064" v-if="item.type=='01'"/>
                      <ta-icon type="form" style="color: #04b2dc" v-else-if="item.type.indexOf('02') == 0"/>
                      <ta-icon type="mail" style="color: #108ee9" v-else-if="item.type=='03'"/>
                      <span class="msg-title">{{item.title}}</span>
                      <span class="msg-info">{{item.sendDate}}</span>
                    </template>
                    <p class="msg-detail-detail" v-html="item.content">{{item.content}}</p>
                    <div v-show="item.noticeFileList!=null && item.noticeFileList.length>=1">
                      <ta-divider orientation="left">附件</ta-divider>
                      <ta-list itemLayout="horizontal" :dataSource="item.noticeFileList">
                        <ta-list-item slot="renderItem" slot-scope="item, index">
                          <a :href="backUrl+'/message/downloadNoticeFile?annexId='+item.annexId">
                            <ta-icon type="download" style="color: #0f990f"/>
                            {{item.annexName}}</a>
                        </ta-list-item>
                      </ta-list>
                    </div>
                  </ta-collapse-panel>
                </ta-collapse>
              </div>
              <div v-else style="text-align: center;">
                没有通知
              </div>
            </div>
          </ta-tab-pane>
        </ta-tabs>
        <div  class="msg-type-select">
          <ta-select defaultValue="00" style="width: 120px" @change="noticeTypeChange">
            <ta-select-option value="00">全部</ta-select-option>
            <ta-select-option value="01">系统通知</ta-select-option>
            <ta-select-option value="02">业务通知</ta-select-option>
            <ta-select-option value="03">普通通知</ta-select-option>
          </ta-select>
          <ta-button type="primary" v-show="activeNotice=='1'" @click="readNotices">全部标记已读</ta-button>
        </div>
        <div class="msg-page-foot">
          <ta-pagination v-model="page" :total="total" :pageSize="pageSize" @change="pageChange" @showSizeChange="pageSizeChange"/>
        </div>
      </ta-tab-pane>
     <!-- <ta-tab-pane key="letter">
        <span slot="tab"><ta-icon type="message" />私信</span>
        2
      </ta-tab-pane>-->
    </ta-tabs>
  </div>
</template>

<script>

import $api from './api/index'

export default {
  name: 'recordMg',
  data () {
    return {
      backUrl: '',
      activeNotice: '1',
      type: '',
      page: 1,
      pageSize: 20,
      total: 10,
      noticeList1: [],
      noticeList2: [],
      noticeList3: []
    }
  },
  // 页面初始化时执行内容
  mounted () {
    this.backUrl = faceConfig.basePath
    this.queryUserMessageNoRead()
  },
  methods: {
    queryUserMessageNoRead () {
      const param = {
        type: this.type,
        page: this.page,
        pageSize: this.pageSize
      }
      $api.queryUserMessageNoRead(param, (data) => {
        this.noticeList1 = data.data.noticeList
        if (data.data.total != -1) {
          this.total = data.data.total
        }
      })
    },
    queryUserMessageAll () {
      const param = {
        type: this.type,
        page: this.page,
        pageSize: this.pageSize
      }
      $api.queryUserMessageAll(param, (data) => {
        this.noticeList2 = data.data.noticeList
        if (data.data.total != -1) {
          this.total = data.data.total
        }
      })
    },
    queryUserMessageSend () {
      const param = {
        type: this.type,
        page: this.page,
        pageSize: this.pageSize
      }
      $api.queryUserMessageSend(param, (data) => {
        this.noticeList3 = data.data.noticeList
        if (data.data.total != -1) {
          this.total = data.data.total
        }
      })
    },
    noticeTabChange (activeKey) {
      if (activeKey == '1') {
        this.queryUserMessageNoRead()
      } else if (activeKey == '2') {
        this.queryUserMessageAll()
      } else if (activeKey == '3') {
        this.queryUserMessageSend()
      }
    },
    pageChange (page, pageSize) {
      this.page = page
      this.noticeTabChange(this.activeNotice)
    },
    pageSizeChange (current, size) {
      this.pageSize = size
      this.noticeTabChange(this.activeNotice)
    },
    noticeTypeChange (value) {
      this.type = value == '00' ? null : value
      this.noticeTabChange(this.activeNotice)
    },
    noticeDetailChange (key) {
      console.log(key)
      if (key.length > 0) {
        if (this.activeNotice == '1') {
          this.getNoticeFiles(this.noticeList1, key[key.length-1])
        } else if (this.activeNotice == '2') {
          this.getNoticeFiles(this.noticeList2, key[key.length-1])
        } else if (this.activeNotice == '3') {
          this.getNoticeFiles(this.noticeList3, key[key.length-1])
        }
      }
    },
    readNotices () {
      const ids = this.noticeList1.map(a => a.mId).join(',')
      const param = {
        mIds: ids
      }
      $api.readNotices(param, (data) => {
        this.queryUserMessageNoRead()
      })
    },
    getNoticeFiles (noticeList, mId) {
      let item = noticeList.find(a => a.mId == mId)
      if (!item.noticeFileList) {
        const param = {
          mId: mId
        }
        $api.queryNoticeFiles(param, (data) => {
          if (data.data.noticeFileList) {
            item.noticeFileList = data.data.noticeFileList
            this.$forceUpdate()
          }
        })
      }
    }
  }
}
</script>

<style type="text/less" lang="less">
  .ant-tabs{
    height:100%;
  }
  .ant-tabs-content{
    height:100%;
  }
  .ant-tabs-tabpane{
    height:100%;
    overflow: auto;
  }
  .msg-detail-detail{
    margin-top: 10px;
    padding: 10px;
    background: @background-color-light;
    border-radius: 4px;
    overflow: auto;
    >table td{    //通知查看表格样式 采用wangEditor-container 的
      border: 1px solid #999;
      padding: 3px 5px;
      min-width: 50px;
      height: 20px;
    }
  }
  .msg-title{
    overflow: hidden;
    padding: 0 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 800;
  }
  .msg-info{
    float: right;
    color: #999999;
    padding: 5px 16px 10px;
    border-bottom: 1px solid #eee;
  }
  .msg-page-foot{
    position: absolute;
    background: #fff;
    bottom: 0px;
    left: 0px;
    right: 0px;
    border-top: 1px solid @border-color-split;
    height: 55px;
    padding: 10px 15px;
    box-sizing: border-box;
    text-align: center;
  }
  .msg-type-select{
    position: absolute;
    top: 0px;
    right: 150px;
    margin: 5px 5px;
    text-align: right;
  }
</style>

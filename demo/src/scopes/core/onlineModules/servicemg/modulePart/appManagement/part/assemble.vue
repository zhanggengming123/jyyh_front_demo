<template>
  <div class="assemble">
    <div class="assemble-header">
      <span class="assemble-title">{{$route.query.appName}}</span>
      <div style="float: right">
        <div v-if="!getOnlineEditor.isShow">
          <span @click="fnDownload" class="btn-header"><ta-icon class="mg-r06" type="download"/>下载</span>
          <span @click="fnPreviewAll" class="btn-header"><ta-icon class="mg-r06" type="eye-o"/>预览</span>
          <span @click="fnPublishAll" class="btn-header"><ta-icon class="mg-r06" type="save"/>发布</span>
        </div>
        <div v-else>
          <span @click="fnGoBack" class="btn-header"><ta-icon class="mg-r06" type="rollback"/>返回</span>
          <span @click="fnSaveEditor" class="btn-header"><ta-icon class="mg-r06" type="save"/>保存</span>
        </div>
      </div>
    </div>
    <div class="content" v-show="!getOnlineEditor.isShow">
      <div class="left-content">
        <assemble-left ref="assembleLeft"></assemble-left>
      </div>
      <div class="center-content">
        <assemble-center></assemble-center>
      </div>
      <div class="right-content">
        <assemble-right></assemble-right>
      </div>
    </div>
    <div class="content" v-if="getOnlineEditor.isShow">
      <iframe :src="'onlineDesign.html#/?pageId=' + getOnlineEditor.pageInfo.pageId" frameborder="0"
              class="onlineDesign"></iframe>
    </div>
  </div>
</template>
<script>
import assembleLeft from './assemble/assembleLeft'
import assembleRight from './assemble/assembleRight'
import assembleCenter from './assemble/assembleCenter'
import axios from 'axios'
import $api from '../api/appPageRestService'
import { mapGetters } from 'vuex'

const baseServer = 'http://192.168.17.18:3000'
export default {
  name: 'assemble',
  data () {
    return {
      appId: this.$route.query.appId,
      onlineCode: {}
    }
  },
  computed: {
    ...mapGetters({
      getOnlineEditor: 'getOnlineEditor'
    })
  },
  components: { assembleLeft, assembleRight, assembleCenter },
  methods: {
    fnDownload () {
      window.open(baseServer + '/download?appId=' + this.appId, '_blank')
    },
    fnPreviewAll () {
      axios.post(baseServer + '/delete')
      $api.queryAllAppPagesWithContentByAppId({ appId: this.appId }, (resp) => {
        axios.post(baseServer + '/preview', {
          allPages: resp.data.pages
        }).then((response) => {
          window.open(baseServer + '/' + resp.data.rootPage.pageName, '_blank')
        }).catch(function (error) {
          window.open(baseServer + '/' + resp.data.rootPage.pageName, '_blank')
          console.log(error)
        })
      })
    },
    fnPublishAll () {

    },
    fnGoBack () {
      this.$store.commit('setOnlineEditor', { isShow: false })
    },
    fnSaveEditor () {
      let iframeObj
      document.getElementsByTagName('iframe').forEach((item, index) => {
        if (item.className == 'onlineDesign') {
          iframeObj = document.getElementsByTagName('iframe')[index].contentWindow
        }
      })
      const previewRef = iframeObj._Vue.$children[0].$refs.previewRef
      const { components, css, js } = iframeObj._Vue.$store.getters.getState
      const param = {}
      param.pageId = this.getOnlineEditor.pageInfo.pageId
      param.onlineDevCode = previewRef.getSource(components)
      param.onlineDevData = JSON.stringify({ components: components, css: css, js: js })
      $api.saveOnlineDevPage(param, (data) => {
        this.$message.success('保存成功')
        this.fnGoBack()
        this.$refs.assembleLeft.refreshTemplate()
      })
    }
  }
}
</script>
<style lang="less" scoped type="text/less">
  @top-header: 50px;
  @left-menu: 300px;
  @right-menu: 320px;
  @border: 1px solid @border-color-base;
  .mg-r06 {
    margin-right: 6px;
  }

  .assemble {
    width: 100%;
    height: 100%;
    position: relative;
    .user-select();
  }

  .assemble-title {
    padding: 0 15px;
    font-size: 16px;
  }

  .assemble-header {
    width: 100%;
    height: @top-header;
    line-height: @top-header;
    background-color: #001529;
    color: #ffffff;

    .btn-header {
      display: inline-block;
      padding: 0 15px;
      height: @top-header;
      cursor: pointer;
      .user-select();

      &:hover {
        background-color: #272a3b
      }
    }
  }

  .content {
    position: absolute;
    top: @top-header;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .left-content {
    position: absolute;
    width: @left-menu;
    left: 0;
    top: 0;
    bottom: 0;
  }

  .center-content {
    position: absolute;

    left: @left-menu;
    right: @right-menu;
    top: 0;
    bottom: 0;
    border-left: @border;
    border-right: @border;
    background-color: #f0f2f5;
  }

  .right-content {
    position: absolute;
    width: @right-menu;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: auto;
    .beautifyScrollbar();
  }

  .onlineDesign {
    width: 100%;
    height: 100%;
    vertical-align: top;
  }
</style>

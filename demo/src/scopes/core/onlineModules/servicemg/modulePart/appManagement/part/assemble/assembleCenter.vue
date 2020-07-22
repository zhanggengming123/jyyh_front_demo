<template>
  <div class="assemble-center">
    <ta-border-layout :layout="{header:'50px'}">
      <div slot="header">
        <span v-if="templateInfo.templateId" v-for="item in itemList" :key="item.type" class="top-menu" @click="clickItem(item.type)">
          <ta-icon :type="item.icon" class="item-icon"/>
          {{item.name}}
        </span>
      </div>
      <div class="has-data" v-if="templateInfo.templateId && iframeSrc">
        <iframe v-if="showIframe" :src="iframeSrc" frameborder="0"  class="iframe-style"></iframe>
      </div>
      <div v-else-if="templateInfo.type == 'ParentPage'"></div>
      <div class="no-data" v-else>
        <div class="one-item" v-for="(item, index) in itemList" :key="index" @click="clickItem(item.type)">
          <ta-icon :type="item.icon" class="item-icon"/>
          <div class="item-name">{{item.name}}</div>
        </div>
      </div>
    </ta-border-layout>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
const itemList = [{name: '模板选择', icon: 'file-text', type: '1'}, /* {name: '表单选择', icon: 'profile', type: '2'}, */ {name: '在线开发', icon: 'form', type: '3'}]
export default {
  name: 'assemble-center',
  data () {
    return {
      itemList,
      showIframe: false
    }
  },
  computed: {
    ...mapGetters({
      pageInfo: 'getPageInfo',
      templateInfo: 'getTemplateInfo'
    }),
    iframeSrc () {
      let src = '', _this = this
      const {templateType, showTemplateType, templateId, pageId, templateVisible, closeType} = this.templateInfo
      let iframeType = showTemplateType || templateType
      if (iframeType == '1') {
        src = 'onlinePreview.html#/?formId=' + templateId
      } else if (iframeType == '2') {
        src = 'formPreview.html#/?formId=' + templateId
      } else if (iframeType == '3') {
        src = 'onlinePreview.html#/?pageId=' + pageId
      }
      if (!templateVisible && closeType != 'close') {
        _this.showIframe = false
        _this.$nextTick(() => { _this.showIframe = true })
      }
      return src
    }
  },
  methods: {
    clickItem (type) {
      const {pageId} = this.pageInfo
      if (pageId) {
        if (type == '3') {
          this.$store.commit('setOnlineEditor', {isShow: true, pageInfo: this.pageInfo})
        } else {
          this.$store.commit('setTemplateInfo', Object.assign({}, this.templateInfo, { templateVisible: true }))
        }
      } else {
        this.$message.warning('请先选择页面')
      }
    }
  }
}
</script>
<style lang="less" scoped type="text/less">
  .assemble-center {
    height: 100%; width: 100%;
    .top-menu { cursor: pointer; margin-right: 20px; &:hover { color: @primary-color} }
    .no-data { text-align: center; height: 100%; padding-top: 180px;
      .one-item { width: 150px; padding: 30px 0; margin: 20px 20px 0; border-radius: 3px; display: inline-block; text-align: center; background-color: #fafafa; @include transition(); cursor: pointer; &:hover { box-shadow: 0 2px 12px 0 rgba(199,199,199,.5) } }
      .item-icon { font-size: 40px; padding-bottom: 10px; }
    }
    .has-data { width: 100%; background-color: rgba(227,234,241,0.4); height: 100%; overflow: auto; .beautifyScrollbar(); pre { overflow: unset } }
    .iframe-style { width: 100%; height: 100%; vertical-align:top; }
  }
</style>

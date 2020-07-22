<template>
  <div class="assemble-left">
    <ta-tabs defaultActiveKey="1" style="height: 100%">
      <ta-tab-pane tab="功能列表" key="1" style="position: relative; height: 100%">
        <div class="add-btn">
          <ta-button type="primary" icon="plus" @click="addOne">新增功能</ta-button>
        </div>
        <div class="add-box pd-10">
          <ta-e-tree ref="addPage" :data="pageData" :props="defaultProps" node-key="pageId" :highlight-current="true" default-expand-all :expand-on-click-node="false" draggable @node-drop="fnDrop" :allow-drop="allowDrop" :allow-drag="allowDrag">
            <div class="add-item" slot-scope="{ node, data }">
              <div class="add-name" :title="data.pageName" @click="toTemplate(data)"><ta-icon type="select" class="add-btn-drag" />{{data.pageName}}</div>
              <div class="add-btn-right" v-if="data.pageType != '1' && data.pageType != '2'">
                <ta-icon type="edit" class="right-btn" @click="fnEdit(node,data,'edit')"/>
                <ta-icon type="plus" class="right-btn" @click="fnEdit(node,data,'add')"/>
                <ta-popconfirm title="确认删除页面及所有下属页面？" @confirm="fnDelete(node,data)">
                  <ta-icon type="delete" class="right-btn"/>
                </ta-popconfirm>
              </div>
            </div>
          </ta-e-tree>
        </div>
      </ta-tab-pane>
    </ta-tabs>
    <edit-page :visible="editVisible" :rowData="rowData" :edit-type="editType" @close="editClose"></edit-page>
    <template-page :visible="templateVisible" :pageId="currPageId" @close="templateClose"></template-page>
  </div>
</template>
<script>
import editPage from './editPage'
import templatePage from './templatePage'
import $api from '../../api/appPageRestService'
import {mapGetters} from 'vuex'
export default {
  name: 'assemble-left',
  data () {
    return {
      appId: this.$route.query.appId,
      pageData: [],
      form: null,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      defaultProps: {
        children: 'children',
        label: 'pageName',
        id: 'pageId'
      },
      editVisible: false,
      currPageId: '',
      rowData: {},
      editType: ''
    }
  },
  computed: {
    ...mapGetters({
      pageInfo: 'getPageInfo',
      templateInfo: 'getTemplateInfo'
    }),
    templateVisible () {
      return this.templateInfo.templateVisible == true
    }
  },
  components: {editPage, templatePage},
  mounted () {
    this.queryTree()
  },
  methods: {
    /* 页面相关 */
    queryTree () {
      $api.queryAllAppPagesByAppId({appId: this.appId}, (data) => {
        if (data.data.treeView.length == 0) {
          this.addDefaultPage({ pagePid: 0, pageName: 'login', pageIndex: 0, appId: this.appId, pageType: '1' })
        } else {
          this.pageData = data.data.treeView
        }
      })
    },
    addDefaultPage (addParam) {
      $api.addAppPage(addParam, (data) => {
        if (addParam.pageName == 'index') {
          this.queryTree()
        } else {
          this.addDefaultPage({ pagePid: 0, pageName: 'index', pageIndex: 1, appId: this.appId, pageType: '2' })
        }
      })
    },
    fnEdit (node, data, type) {
      this.editVisible = true
      this.rowData = data
      this.editType = type
    },
    editClose (type, data) {
      if (type == 'add') {
        delete data.frontUrl
        this.$refs.addPage.append(data, this.rowData)
      } else if (type == 'edit') {
        this.$set(this.rowData, 'pageName', data.pageName)
      }
      this.editVisible = false
    },
    fnDelete (node, data) {
      let pageIds = this.getPageIds(data)
      if (pageIds.length == 1) {
        $api.removeAppPageByPageId({'pageId': pageIds[0]}, () => {
          this.$refs.addPage.remove(data.pageId)
          this.$message.success('删除成功')
        })
      } else {
        $api.removeBatchAppPagesByPageIds({'pageIds': pageIds.join(',')}, () => {
          this.$refs.addPage.remove(data.pageId)
          this.$message.success('删除成功')
        })
      }
    },
    addOne () {
      let addParam = {}
      if (this.pageData.length == 2) {
        addParam = { pagePid: 0, pageName: 'parentPage', pageIndex: 2 }
      } else {
        let childTemp = this.pageData[2].children
        let index = (childTemp && childTemp.length) ? parseInt(childTemp[childTemp.length - 1].pageIndex) + 1 : 0
        addParam = { pagePid: this.pageData[2].pageId, pageName: 'Page' + (index + 1), pageIndex: index }
      }
      addParam.appId = this.appId
      addParam.pageType = '3'
      $api.addAppPage(addParam, (data) => {
        delete addParam.frontUrl
        let temp = Object.assign({}, addParam, {'pageId': data.data.pageId, 'pageUrl': data.data.pageUrl})
        if (this.pageData.length == 2) {
          this.pageData.push(temp)
        } else {
          this.$refs.addPage.append(temp, this.pageData[2])
        }
        this.$message.success('新增成功')
      })
    },
    fnDrop (draggingNode) {
      let dragIds = [], pageVos = []
      dragIds = this.getPageIds(draggingNode.data)
      this.pageData.map((item, index) => {
        pageVos.push({ pagePid: item.pagePid, pageName: item.pageName, pageId: item.pageId, pageIndex: index })
      })
      pageVos = pageVos.concat(this.getDropLists(this.pageData[2], dragIds))
      $api.updateBatchAppPageByVos({pageVos: JSON.stringify(pageVos)}, (data) => {
        if (data.serviceSuccess) {
          this.$message.success('移动成功')
        } else {
          this.$message.error('移动失败')
        }
        this.queryTree()
      })
    },
    getPageIds (data) {
      let result = []
      result.push(data.pageId)
      if (data.children && data.children.length) {
        data.children.forEach((item) => {
          let temp = this.getPageIds(item)
          result = result.concat(temp)
        })
      }
      return result
    },
    getDropLists (data, dragIds) {
      let result = []
      if (data.children && data.children.length) {
        data.children.forEach((item, index) => {
          for (let i = 0; i < dragIds.length; i++) {
            if (item.pageId == dragIds[i]) {
              result.push({ pagePid: data.pageId, pageName: item.pageName, pageId: item.pageId, pageIndex: index })
              if (item.children) {
                let temp = this.getDropLists(item, dragIds)
                result = result.concat(temp)
              }
              break
            }
            if (i == dragIds.length - 1) {
              result.push({ pagePid: item.pagePid, pageName: item.pageName, pageId: item.pageId, pageIndex: index })
              if (item.children) {
                let temp = this.getDropLists(item, dragIds)
                result = result.concat(temp)
              }
            }
          }
        })
      }
      return result
    },
    allowDrop (draggingNode, dropNode, type) {
      return dropNode.data.pagePid != '0'
    },
    allowDrag (draggingNode) {
      return draggingNode.data.pagePid != '0'
    },
    refreshTemplate () {
      this.toTemplate(this.pageInfo)
    },
    toTemplate (info) {
      if (info.pagePid == '0' && info.pageIndex == '2') {
        this.$store.commit('setTemplateInfo', {type: 'ParentPage'})
      } else {
        this.currPageId = info.pageId
        $api.queryPageVoByPageId({pageId: info.pageId}, (data) => {
          const { templateContent, pageVo, templateVo } = data.data
          const { pageCode, pageId, pageUrl, pageType} = pageVo
          if (templateContent) {
            const { templateId, templateName, templateType } = templateVo
            this.$store.commit('setTemplateInfo', {
              pageId: pageId,
              pageCode: pageCode,
              pageUrl: pageUrl,
              pageType: pageType,
              templateId: templateId,
              templateName: templateName,
              templateContent: templateContent,
              templateType: templateType,
              showTemplateType: templateType == '3' ? '1' : templateType
            })
          } else {
            if (pageCode && pageCode.indexOf('onlineDevCode') != -1) {
              let code = JSON.parse(pageCode).onlineDevCode
              this.$store.commit('setTemplateInfo', {
                pageId: pageId,
                pageCode: code,
                templateId: 'onlineDevCode',
                templateType: '3',
                showTemplateType: '3',
                templateContent: code
              })
            } else {
              this.$store.commit('setTemplateInfo', {})
            }
          }
          this.$store.commit('setPageInfo', info)
        })
      }
    },
    templateClose (type) {
      let closeType = type == 'save' ? 'save' : 'close'
      this.$store.commit('setTemplateInfo', Object.assign({}, this.templateInfo, {templateVisible: false, closeType: closeType}))
    }
  }
}
</script>
<style lang="less" type="text/less">
  .assemble-left {
    .el-tree-node__content { height: 40px!important; margin-bottom: 10px!important; }
    .el-tree-node__content:hover { background-color: #ffffff!important; .add-item { background-color: #f5f7fa!important; } }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content { background-color: #ffffff!important; .add-item { background-color: #f0f7ff!important; } }
    .ant-tabs-content { height: calc(100% - 70px); }
    .el-tree { width: max-content; padding-right: 15px; min-width: 290px; box-sizing: border-box; }
  }
</style>
<style lang="less" scoped type="text/less">
  @border: 1px solid @border-color-base;
  .assemble-left {
    width: 100%; height: 100%;
    .add-btn { text-align: center; padding: 16px 0; }
    .add-box { position: absolute; width: 100%; top: 64px; left: 0; bottom: 0; overflow: auto; .beautifyScrollbar(); }
    .add-item { border: @border; border-radius: 3px; height: 40px; line-height: 40px; position: relative; width: 100%; max-width: 245px;
      .add-name { .text-overflow(); .user-select(); width: 100%; box-sizing: border-box; padding: 0 90px 0 40px; }
      .add-btn-drag { width: 30px; height: 40px; border-right: @border; color: #b3aebd; position: absolute; left: 0; top: 0; line-height: 40px; cursor: pointer; }
      .add-btn-right { position: absolute; top: 0; right: 0; width: 90px; .user-select(); }
      .right-btn { margin: 0 5px; cursor: pointer; }
    }
    .pd-10 { padding: 0 10px; }
  }
</style>

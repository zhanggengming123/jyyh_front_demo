<template>
  <ta-modal :visible="visible" title="选择模板" @cancel="closeModal" width="600px" class="template-page">
    <ta-tree-select showSearch style="width: 100%" :treeData="templateTreeData" v-model="templateSelect"
                    @change="templateChange" searchPlaceholder='选择所需模板' treeNodeFilterProp='label'/>
    <div class="template-box">
      <div style="margin-bottom: 10px">
        <ta-tag-select title="模板类型" :data="selectList" v-model="templateParam"
                       @change="queryTemplateList"></ta-tag-select>
      </div>
      <div class="col-3" v-for="(item, index) in templateList" :key="item.templateId">
        <div class="one-box" @click="clickTemplate(item, index)" :class="{'active': activeIndex === index}">
          <ta-icon type="file-text" class="template-icon"/>
          <div class="template-name">{{item.templateName}}</div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <ta-button @click="closeModal">取消</ta-button>
      <ta-button type="primary" @click="fnSave">保存</ta-button>
    </template>
  </ta-modal>
</template>
<script>
  import $api from '../../api/appPageRestService'
  import {mapGetters} from 'vuex'

  const selectList = [{label: 'code模板', value: 1}, {label: '表单选择', value: 2}, {label: '在线开发', value: 3}]
  export default {
    name: 'editPage',
    props: ['visible', 'pageId'],
    data() {
      return {
        templateTreeData: [],
        templateSelect: '',
        activeIndex: '',
        templateList: [],
        templateId: '',
        templateParam: [],
        selectList
      }
    },
    computed: {
      ...mapGetters({
        pageInfo: 'getPageInfo',
        templateInfo: 'getTemplateInfo'
      })
    },
    mounted() {
      this.queryTemplate()
    },
    methods: {
      /* 模板相关 */
      queryTemplate() {
        $api.loadTemplateCatalog({appId: this.appId}, (data) => {
          this.templateTreeData = this.getTreeData(data.data.templateCatalog)
        })
      },
      getTreeData(data) {
        data.forEach((item) => {
          item.value = item.id
          item.title = item.name
          item.key = item.id
          if (item.children && item.children.length) {
            this.getTreeData(item.children)
          }
        })
        return data
      },
      templateChange(value) {
        this.templateSelect = value
        this.activeIndex = ''
        this.queryTemplateList()
      },
      queryTemplateList() {
        this.activeIndex = ''
        const templateTypes = this.templateParam.toString() || ''
        $api.loadTemplateByCatalogId({catalogId: this.templateSelect, templateTypes: templateTypes}, (data) => {
          this.templateList = data.data.templateList
        })
      },
      clickTemplate(info, index) {
        this.activeIndex = index
        this.templateId = info.templateId
      },
      fnSave() {
        if (this.templateId && this.activeIndex.toString().length) {
          $api.getTemplateContent({templateId: this.templateId}, (data) => {
            const {templateContent} = data.data
            const {templateId, templateName, templateType} = data.data.templateVo
            const setData = {
              templateId: templateId,
              templateName: templateName,
              templateContent: templateContent,
              templateType: templateType,
              showTemplateType: templateType == '3' ? '1' : templateType
            }
            const param = {}
            param.appId = this.appId
            param.pageId = this.pageInfo.pageId
            param.templateId = templateId
            param.serverMap = {}
            $api.savePageTemplate({
              templateId: templateId,
              application: JSON.stringify(param),
              pageId: param.pageId
            }, (data) => {
              this.$message.success('保存成功')
              this.$store.commit('setTemplateInfo', Object.assign({}, this.templateInfo, setData))
              this.closeModal('save')
            })
          })
        } else {
          this.$message.warning('请先选择模板')
        }
      },
      closeModal(type) {
        this.activeIndex = ''
        this.templateSelect = ''
        this.templateList = []
        this.templateParam = []
        this.$emit('close', type)
      }
    }
  }
</script>
<style lang="less" type="text/less">
  .template-page {
    .ant-modal-body {
      height: 400px;
      overflow: auto;
      .beautifyScrollbar();
    }
  }
</style>
<style lang="less" scoped type="text/less">
  .template-box {
    margin-top: 10px;
    height: calc(100% - 50px);
    .beautifyScrollbar();

    &:after {
      content: ".";
      display: block;
      height: 0;
      width: 0;
      clear: both;
      visibility: hidden;
    }

    .col-3 {
      width: 33.3333%;
      height: 90px;
      float: left;
      padding: 2px;
      box-sizing: border-box;
    }

    .one-box {
      width: 100%;
      height: 100%;
      background-color: #fafafa;
      border: solid 1px #fafafa;
      cursor: pointer;
      border-radius: 3px;
      box-sizing: border-box;
      text-align: center;
      .user-select();

      &:hover, &.active {
        border: solid 1px @primary-color;
        color: @primary-color
      }

      .template-icon {
        font-size: 30px;
        padding: 10px 0
      }

      .template-name {
       .text-overflow();
      }
    }
  }
</style>

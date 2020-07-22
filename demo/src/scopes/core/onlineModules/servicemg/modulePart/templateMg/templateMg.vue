<template>
  <div id="templateMg" class="fit">
    <ta-tooltip placement="left" >
      <template slot='title'>返回模板管理页面</template>
      <span v-if="showIframe" class="backTemplateMg" @click="showIframe=false" >
      <ta-icon type="rollback"></ta-icon>
       </span>
    </ta-tooltip>
    <iframe
      v-if="showIframe"
     :src="showIframe?urlIframe:''"
      frameborder="0"
      style="height: 99.9%;width: 100%"
    ></iframe>
    <ta-border-layout
      v-show="!showIframe"
      :layout="{left:'300px'}"
      :leftCfg="{title:'模板分类',showBar:true}"
      :center-cfg="{layoutConStyle:{padding:'0px'}}"
    >
      <div slot="left">
        <ta-e-tree
          highlight-current
          ref="resourceTree"
          node-key="id"
          :props="defaultProps"
          :load="loadTemplateCatalogTree"
          lazy
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="custom-name" @click="onTreeNodeClick(node)">{{data.name}}</span>
            <span class="tree-operate">
              <a class="anticon anticon-plus-circle-o" @click="fnAddTemplateCatalog(node,data)"></a>
              <a class="anticon anticon-edit" @click="fnEditTemplateCatalog(node,data)"></a>
              <ta-popconfirm title="确认删除该功能模块?" cancelText="取消" okText="确认" okType="default" @confirm="fnRemoveTemplateCatalog(node,data)">
                <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
                <a class="anticon anticon-delete" @click="deleteVisible = true; deleteId = data.serviceNameId"></a>
              </ta-popconfirm>
            </span>
          </span>
        </ta-e-tree>
      </div>
      <ta-border-layout :layout="{header:'70px'}" :showBorder="false" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}">
        <div slot="header" class="center-box">
          <ta-input-search placeholder="请输入模板名称或编码" v-model="searchInfo" class="search-box" @search="fnSearchTemplate">
            <ta-button slot="enterButton" type="primary">搜索</ta-button>
          </ta-input-search>
        </div>
        <div slot="centerExtraContent">
          <ta-tag-select
            title="有效标志"
            :data="CollectionData('EFFECTIVE')"
            v-model="templateEffective"
            :is-multi="false"
            @change="fnSearchTemplate"
          />
          <ta-tag-select
            title="模板类型"
            :data="CollectionData('TEMPLATETYPE')"
            v-model="templateType"
            :is-multi="false"
            @change="fnSearchTemplate"
          />
          <ta-tag-select
            title="模板来源"
            :data="CollectionData('TEMPLATESOURCE')"
            v-model="templateSource"
            :is-multi="false"
            @change="fnSearchTemplate"
          />
          <div style="float: right">
            <ta-dropdown>
              <ta-menu slot="overlay" @click="handleTemplateAdd">
                <ta-menu-item key="1">
                  code模板
                </ta-menu-item>
                <ta-menu-item key="2">
                  表单模板
                </ta-menu-item>
                <ta-menu-item key="3">
                  在线开发
                </ta-menu-item>
              </ta-menu>
              <ta-button style="margin-left: 8px">
                新增模板
                <ta-icon type="down"/>
              </ta-button>
            </ta-dropdown>
          </div>
        </div>
        <ta-form :autoFormCreate="(form)=>{this.form = form}">
        <ta-table
          :dataSource="templateData"
          :columns="templateColumns"
          :pagination=false
        >
          <span slot="templateType" slot-scope="text">{{CollectionLabel('TEMPLATETYPE', text)}}</span>

          <span slot="templateSource" slot-scope="text">{{CollectionLabel('TEMPLATESOURCE', text)}}</span>

          <span slot="effective" slot-scope="text">{{CollectionLabel('EFFECTIVE', text)}}</span>

          <span slot="templateNameTitle">模板名称 <ta-icon type="edit"/></span>

          <ta-table-edit slot="templateName" slot-scope="text, record" type="input" @change="onCellChange"></ta-table-edit>

          <span slot="operation" slot-scope="text,record">
            <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
          </span>
        </ta-table>
        </ta-form>
        <ta-pagination
          style="float: right; margin-top: 10px;"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="templateData"
          :defaultPageSize="10"
          :params="pageParams"
          url="templateMg/templateMgRestService/queryTemplateByCondition"
          ref="templateGridPager"
        />
      </ta-border-layout>
    <!-- 新建功能模块弹窗 -->
    <ta-modal
      :title="editName? '修改功能模块' : '新建功能模块'"
      :visible="addTemplateCatalog"
      @cancel="addTemplateCatalog = false; editName = '' "
      @ok="fnSaveAddTemplateCatalog"
      centered
      destroyOnClose
    >
      <ta-form :autoFormCreate="(form)=>{this.addTemplateCatalogForm = form}">
        <ta-form-item
          label="功能模块名称"
          :labelCol="{span:6}"
          :wrapperCol="{span:18}"
          fieldDecoratorId="name"
          :fieldDecoratorOptions="{rules: [{ required: true,message:'功能模块名称为必输'}], initialValue: editName}"
        >
          <ta-input placeholder="请输入功能模块名称"></ta-input>
        </ta-form-item>
      </ta-form>
    </ta-modal>
    <!-- 新增code模板弹窗 -->
    <ta-modal
      title="新增code模板"
      :visible="addTemplate"
      @cancel="onCloseAddTemplate"
      centered
      destroyOnClose
    >
      <template slot="footer">
        <ta-button @click="onCloseAddTemplate">取消</ta-button>
        <ta-button type="primary" @click="fnSaveAddCodeTemplate">保存</ta-button>
      </template>
      <ta-form :autoFormCreate="(form)=>{this.addTemplateForm = form}">
        <ta-form-item
          label="code模板名称"
          :labelCol="{span:6}"
          :wrapperCol="{span:18}"
          fieldDecoratorId="templateName"
          :fieldDecoratorOptions="{rules: [{ required: true,message:'code模板名称为必输'}]}"
        >
          <ta-input placeholder="请输入code模板名称" ></ta-input>
        </ta-form-item>
      </ta-form>
      <ta-radio-group
        :options="[{ label: '在线创建', value: '1' },{ label: '本地上传', value: '2' }]"
        defaultValue="1"
        @change="onRadioChange"
      />
      <ta-upload
        name="uploadFile"
        :customRequest="fnUploadTemplate"
        :beforeUpload="fnBeforeUpload"
        accept=".vue"
        :withCredentials="true"
        :fileList="fileList"
        v-if="isUpload"
        @remove="fnRemoveFile"
      >
        <ta-button>
          <ta-icon type="upload"/>
          选择文件
        </ta-button>
      </ta-upload>
    </ta-modal>
    <!-- 创建空白表单模板弹窗 -->
    <ta-modal
      title="创建空白表单模板"
      :visible="addFormTemplate"
      @cancel="addFormTemplate=false"
      @ok="fnSaveFormTemplate"
      centered
      destroyOnClose
      okText="确定"
      cancelText="取消"
    >
      <ta-form :autoFormCreate="(form)=>{this.formTemplateForm = form}">
        <ta-form-item
          label="表单模板名称"
          :labelCol="{span:6}"
          :wrapperCol="{span:18}"
          fieldDecoratorId="formName"
          :fieldDecoratorOptions="{rules: [{ required: true,message:'表单模板名称为必输'}]}"
        >
          <ta-input placeholder="请输入表单模板名称" ></ta-input>
        </ta-form-item>
      </ta-form>
    </ta-modal>
    <!-- 创建在线开发模版弹窗 -->
    <ta-modal
      title="创建在线开发模板"
      :visible="addOnlineDev"
      @cancel="addOnlineDev=false"
      @ok="fnSaveOnlineDev"
      centered
      destroyOnClose
      okText="确定"
      cancelText="取消"
    >
      <ta-form :autoFormCreate="(form)=>{this.onlineDevForm = form}">
        <ta-form-item
          label="在线开发模板名称"
          :labelCol="{span:8}"
          :wrapperCol="{span:16}"
          fieldDecoratorId="onlineDevName"
          :fieldDecoratorOptions="{rules: [{ required: true,message:'模板名称为必输'}]}"
        >
          <ta-input placeholder="请输入模板名称" ></ta-input>
        </ta-form-item>
      </ta-form>
    </ta-modal>
    </ta-border-layout>
  </div>
</template>
<script>
import $api from './api/index'
const templateColumns = [
  {dataIndex: 'templateName', width: 300, slots: { title: 'templateNameTitle' }, scopedSlots: {customRender: 'templateName'}},
  {title: '模板类型', dataIndex: 'templateType', scopedSlots: {customRender: 'templateType'}},
  {title: '模板来源', dataIndex: 'templateSource', scopedSlots: {customRender: 'templateSource'}},
  {title: '可用标志', dataIndex: 'effective', yesOrNoTag: true, scopedSlots: {customRender: 'effective'}},
  {title: '操作', dataIndex: 'operation', scopedSlots: {customRender: 'operation'}, align: 'center'}
]

export default {
  name: 'templateMg',
  data () {
    return {
      searchInfo: '',
      templateEffective: [],
      templateType: [],
      templateSource: [],
      templateColumns,
      /*<a @click="">编辑</a>
            <ta-popconfirm title="确认删除该页面模板?" cancelText="取消" okText="确认" okType="default" @confirm="">
              <ta-icon slot="icon" type="question-circle-o" style="color: red"/>
              <a class="operate">删除</a>
            </ta-popconfirm>*/
      operateMenu: [{
        name: '编辑',
        onClick: (record) => {
          this.fnEditTemplate(record)
        }
      },{
        name: '删除',
        type: 'confirm',
        confirmTitle: '确认删除该页面模板?',
        onOk: (record) => {
          this.fnRemoveTemplate(record)
        }
      }],
      templateData: [],
      addTemplateCatalog: false,
      currentTemplateCatalog: {},
      addTemplate: false,
      addFormTemplate: false,
      addOnlineDev: false,
      currentNode: {},
      resolveMap: {},
      currentFile: {},
      editName: '',
      isUpload: false,
      fileList: [],
      showIframe: false,
      urlIframe: '',
      defaultProps: {
        children: 'children',
        label: 'label',
        id: 'id'
      }
    }
  },
  methods: {
    // 关闭新增code模板面板
    onCloseAddTemplate () {
      this.addTemplate = false
      this.fileList = []
      this.currentFile = {}
      this.isUpload = false
    },
    // radio切换事件
    onRadioChange (e) {
      this.isUpload = e.target.value !== '1'
    },
    // 返回管理页面
    backTemplateMg () {

    },
    // 新增空白在线开发模板
    fnSaveOnlineDev () {
      this.onlineDevForm.validateFields((err) => {
        if (!err) {
          $api.addOnlineDevTemplate({
            formName: this.onlineDevForm.getFieldValue('onlineDevName'),
            catalogId: this.currentNode.data.id
          }, (data) => {
            this.$message.success('新增在线开发模板成功')
            this.addOnlineDev = false
            this.fnSearchTemplate()
            this.fnEditTemplate(data.data)
          })
        }
      })
    },
    // 新增code模板
    fnSaveAddCodeTemplate () {
      if (this.isUpload) {
        this.fnUploadTemplate()
      } else {
        this.fnSaveAddTemplate()
      }
    },
    // 新增空白表单模板
    fnSaveFormTemplate () {
      this.formTemplateForm.validateFields((err) => {
        if (!err) {
          $api.addFormTemplate({
            formName: this.formTemplateForm.getFieldValue('formName'),
            catalogId: this.currentNode.data.id
          }, (data) => {
            this.$message.success('新增表单模板成功')
            this.addFormTemplate = false
            this.fnSearchTemplate()
            this.fnEditTemplate(data.data)
          })
        }
      })
    },
    // 新增模板按钮选择事件
    handleTemplateAdd ({item, key}) {
      if (!this.currentNode.data) {
        this.$message.warn('请先在左侧功能列表中选择一个功能')
        return
      }
      switch (key) {
        case '1':
          this.addTemplate = true
          break
        case '2':
          this.addFormTemplate = true
          break
        case '3':
          this.addOnlineDev = true
          break
      }
    },
    // 加载功能列表
    loadTemplateCatalogTree (node, resolve) {
      if (node.level === 0) {
        resolve([{name: '功能列表', id: '0', idPath: '0', namePath: '功能列表'}])
      }
      if (node.level >= 1) {
        $api.loadTemplateCatalogTree({parentId: node.data.id}, (data) => {
          // 将该节点的渲染方法存储，以方便后面动态刷新树使用
          this.resolveMap[node.data.id] = resolve
          if (data.data.treeData) {
            resolve(data.data.treeData)
          } else {
            resolve([])
          }
        })
      }
    },
    // 树点击事件
    onTreeNodeClick (node) {
      this.currentNode = node
      this.fnSearchTemplate()
    },
    fnSearchTemplate () {
      this.$refs.templateGridPager.loadData()
    },
    pageParams () {
      return {
        catalogId: this.currentNode.data ? this.currentNode.data.id : '',
        templateName: this.searchInfo,
        effective: this.templateEffective[0],
        templateType: this.templateType[0],
        templateSource: this.templateSource[0]
      }
    },
    // 显示新建功能
    fnAddTemplateCatalog (node, data) {
      this.currentTemplateCatalog = data
      this.addTemplateCatalog = true
    },
    fnEditTemplateCatalog (node, data) {
      this.currentTemplateCatalog = data
      this.addTemplateCatalog = true
      this.editName = data.name
    },
    // 保存新建功能
    fnSaveAddTemplateCatalog () {
      let name = this.addTemplateCatalogForm.getFieldValue('name')
      let param = {
        name: name,
        parentId: this.currentTemplateCatalog.id,
        idPath: this.currentTemplateCatalog.idPath,
        namePath: this.currentTemplateCatalog.namePath + '/' + name
      }
      if (this.editName) {
        if (param.name == this.editName) {
          this.addTemplateCatalog = false
          this.editName = ''
        } else {
          $api.updateTemplateCatalog({name: param.name, id: param.parentId}, (data) => {
            this.$message.success('修改模板功能名称成功')
            this.addTemplateCatalog = false
            this.editName = ''
            this.currentTemplateCatalog.name = param.name
            this.refreshLazyTree()
          })
        }
      } else {
        $api.addTemplateCatalog(param, (data) => {
          this.$message.success('新增功能模块成功')
          this.addTemplateCatalog = false
          this.editName = ''
          this.refreshLazyTree()
        })
      }
    },
    // 删除功能模块
    fnRemoveTemplateCatalog (node, data) {
      $api.removeTemplateCatalog({id: data.id}, (data) => {
        this.$message.success('移除功能模块成功')
        this.fnSearchTemplate()
        this.refreshParentLazyTree(node)
      })
    },
    // 保存新增模板
    fnSaveAddTemplate () {
      this.addTemplateForm.validateFields((err) => {
        if (!err) {
          $api.addTemplate({
            templateName: this.addTemplateForm.getFieldValue('templateName'),
            catalogId: this.currentNode.data.id
          }, (data) => {
            this.$message.success('新增模板成功')
            this.fnSearchTemplate()
            this.onCloseAddTemplate()
            this.fnEditTemplate(data.data)
          })
        }
      })
    },
    // 删除模板
    fnRemoveTemplate (record) {
      $api.removeTempalte({templateId: record.templateId}, (data) => {
        this.$message.success('删除模板成功')
        this.fnSearchTemplate()
      })
    },
    // 编辑模板
    fnEditTemplate (record) {
      switch (record.templateType) {
        // code模板
        case '1':
          this.showIframe = true
          this.urlIframe = 'onlineCodeDesign.html#/onlineCode?formId=' + record.templateId
          break
          // 表单模板
        case '2':
          this.showIframe = true
          this.urlIframe = 'formDesign.html?formId=' + record.templateId
          break
        case '3':
          this.showIframe = true
          this.urlIframe = 'onlineDesign.html#/?formId=' + record.templateId
          break
      }
    },
    // 上传文件前置条件
    fnBeforeUpload (file, fileList) {
      this.currentFile = file
      this.fileList = fileList
      return false
    },
    // 移除文件触发事件
    fnRemoveFile () {
      this.fileList = []
      this.currentFile = {}
    },
    // 上传模板
    fnUploadTemplate () {
      if (this.fileList.length < 1) {
        this.$message.warn('请先选择文件！')
        return
      }
      this.addTemplateForm.validateFields((err) => {
        if (!err) {
          $api.uploadTemplate({
            uploadFile: this.currentFile,
            templateName: this.addTemplateForm.getFieldValue('templateName'),
            catalogId: this.currentNode.data.id
          }, (data) => {
            this.fnSearchTemplate()
            this.$message.success(`上传成功`)
            this.onCloseAddTemplate()
            this.fnEditTemplate(data.data)
          })
        }
      })
    },
    // 刷新树当前节点
    refreshLazyTree () {
      this.currentNode.childNodes = []
      if (typeof this.resolveMap[this.currentTemplateCatalog.id] === 'function') {
        this.loadTemplateCatalogTree(this.currentNode, this.resolveMap[this.currentTemplateCatalog.id])
      }
    },
    // 刷新树父节点
    refreshParentLazyTree (node) {
      node.parent.childNodes = []
      if (typeof this.resolveMap[node.parent.data.id] === 'function') {
        this.loadTemplateCatalogTree(node.parent, this.resolveMap[node.parent.data.id])
      }
    },
    // 修改模板名称
    onCellChange ({newData, columnKey, record}) {
      $api.updateTemplateName({
        templateName: newData,
        templateId: record.templateId
      }, () => {
        this.$message.success('修改模板名称成功')
        this.fnSearchTemplate()
      })
    }

  },
  activated () {
    // this.$refs.templateGridPager.loadData();
  }
}
</script>
<style type="text/less" lang="less" scoped>
  .backTemplateMg{
    position: fixed;
    z-index: 999;
    right: -39px;
    top: -40px;
    width: 100px;
    height: 82px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 100%;
    display: inline-block;
    font-size: 24px;
    >i{
      position: absolute;
      bottom: 13px;
      left: 25px;
      color: rgba(255, 255, 255, 0.6);
    }
    &:hover{
      cursor: pointer;
      >i{
        color: rgba(255, 255, 255, 0.9)
      }
    }

  }
  .search-box {
    width: 340px;
    line-height: 42px;
  }
  .center-box { text-align: center; overflow: hidden; }
  .message-box{
    margin-bottom: 10px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .custom-name {flex: 1; display: flex; .text-overflow(); }
  .tree-operate .anticon { margin-left: 6px; }
</style>

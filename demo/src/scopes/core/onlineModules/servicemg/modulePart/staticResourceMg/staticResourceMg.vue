<template>
  <div id="staticResourceMg" class="fit">
    <ta-border-layout
      :layout="{left:'300px'}"
      :leftCfg="{title:'资源管理',showBar:true}"
      :center-cfg="{layoutConStyle:{padding:'0px'}}"
    >
      <div slot="left">
        <ta-e-tree
          highlight-current
          ref="resourceTree"
          node-key="key"
          :props="defaultProps"
          :load="loadFileResourceTree"
          lazy
          :expand-on-click-node="false"
          @node-click="onSearchResource"
        >
          <span slot-scope="{ node, data }">
            <span>{{data.fileName}}</span>
          </span>
        </ta-e-tree>
      </div>
      <ta-border-layout
        :show-border="false"
        :layout="{header:'60px'}"
        :headerCfg="{showBorder:false}"
        :centerCfg="{showBorder:false, showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}"
      >
        <div slot="header" class="center-box">
          <ta-input-search placeholder="请输入静态资源名称" v-model="searchInfo" @search="onSearchResource" class="search-box">
            <ta-button slot="enterButton" type="primary">搜索</ta-button>
          </ta-input-search>
        </div>
        <div slot="centerExtraContent">
          <ta-tag-select
            title="资源类型"
            :data="[{value:'0',label:'文件夹'},{value:'1',label:'css'},{value:'2',label:'png'}]"
            v-model="resourceType"
            :is-multi="true"
          />
          <div style="float: right">
            <ta-upload
              name="uploadFile"
              :action="uploadUrl"
              @change="handleChange"
              :data="uploadData"
              style="float: left;margin-right: 10px"
              :withCredentials="true"
              :showUploadList="false"
            >
              <ta-button type="primary">
                <ta-icon type="upload" /> 上传模板
              </ta-button>
            </ta-upload>
            <ta-button-group>
              <ta-button @click="fnShowAddDirectory">新建目录</ta-button>
              <ta-button @click="fnShowAddFile">新建文件</ta-button>
            </ta-button-group>
          </div>
        </div>
        <ta-table
          :dataSource="resourceData"
          :columns="resourceColumns"
        >
          <span slot="fileType" slot-scope="text">{{CollectionLabel('FILERESOURCETYPE',text)}}</span>
          <span slot="operation" slot-scope="text,record">
            <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
          </span>
        </ta-table>
      </ta-border-layout>
    </ta-border-layout>
    <ta-modal
      title="新建目录"
      :visible="addDirectory"
      @cancel="addDirectory=false"
      @ok="fnSaveAddDirectory"
      centered
      destroyOnClose
    >
      <ta-form :autoFormCreate="(form)=>{this.addDirectoryForm = form}">
        <ta-alert :message="'当前所在目录：'+ currentDirectory" type="info" showIcon class="message-box"/>
        <ta-form-item
          label="文件夹名称"
          :labelCol="{span:6}"
          :wrapperCol="{span:18}"
          fieldDecoratorId="fileName"
          :fieldDecoratorOptions="{rules: [{ required: true,message:'文件夹名为必输'}]}"
        >
          <ta-input placeholder="请输入目录名称，可建多级目录，用/分隔" ></ta-input>
        </ta-form-item>
      </ta-form>
    </ta-modal>
    <ta-modal
      title="新建文件"
      :visible="addFile"
      @cancel="addFile=false"
      @ok="fnSaveAddFile"
      centered
      destroyOnClose
    >
      <ta-form :autoFormCreate="(form)=>{this.addFileForm = form}">
        <ta-alert :message="'当前所在目录：'+ currentDirectory" type="info" showIcon class="message-box"/>
        <ta-form-item
          label="文件名称"
          :labelCol="{span:6}"
          :wrapperCol="{span:18}"
          fieldDecoratorId="fileName"
          :fieldDecoratorOptions="{rules: [{ required: true,message:'文件名为必输'}]}"
        >
          <ta-input placeholder="请输入文件名称，可在多级子目录下建立文件，用/分隔" ></ta-input>
        </ta-form-item>
        <ta-form-item
          label="文件内容"
          :labelCol="{span:6}"
          :wrapperCol="{span:18}"
          fieldDecoratorId="content"
          :fieldDecoratorOptions="{rules: [{ required: true,message:'文件内容为必输'}]}"
        >
          <ta-textarea style="height: 150px;"></ta-textarea>
        </ta-form-item>
      </ta-form>
    </ta-modal>
  </div>
</template>
<script>

import $api from './api/index'

const resourceColumns = [{
  title: '文件名称',
  dataIndex: 'fileName'
}, {
  title: '文件大小（byte）',
  dataIndex: 'fileSize',
  customRender: (text) => {
    return text == 0 ? '--' : text
  }
}, {
  title: '类型',
  dataIndex: 'fileType',
  scopedSlots: {customRender: 'fileType'}
}, {
  title: '修改日期',
  dataIndex: 'updateTime'
}, {
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: {customRender: 'operation'},
  align: 'center'
}]

export default {
  name: 'staticResourceMg',
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        id: 'key'
      },
      searchInfo: '',
      resourceType: [],
      resourceColumns,
      operateMenu: [{
        name: '编辑'
      },{
        name: '删除',
        type: 'confirm',
        confirmTitle: '确认删除该资源?',
        onOk: (record) => {
          this.fnRemoveResource(record)
        }
      }],
      resourceData: [],
      addDirectory: false,
      addFile: false,
      // 当前目录
      currentDirectory: '/',
      currentNode: {},
      resolveMap: {},
      uploadUrl: faceConfig.basePath + '/fileResource/fileResourceManageRestService/addFileResource'
    }
  },
  methods: {
    // 加载静态资源树
    loadFileResourceTree (node, resolve) {
      if (node.level === 0) {
        resolve([{fileName: '根目录'}])
      }
      if (node.level === 1) {
        $api.loadFileResourceTree({path: '/'}, (data) => {
          // 将该节点的渲染方法存储，以方便后面动态刷新树使用
          this.resolveMap['/'] = resolve
          if (data.data.fileNodes) {
            resolve(data.data.fileNodes)
          } else {
            resolve([])
          }
        })
      }
      if (node.level > 1) {
        $api.loadFileResourceTree({path: node.data.filePath + '/' + node.data.fileName}, (data) => {
          // 将该节点的渲染方法存储，以方便后面动态刷新树使用
          this.resolveMap[node.data.filePath + '/' + node.data.fileName] = resolve
          if (data.data.fileNodes) {
            resolve(data.data.fileNodes)
          } else {
            resolve([])
          }
        })
      }
    },
    // 搜索目录下的资源
    onSearchResource (data, node) {
      if (node.level === 1) {
        this.currentDirectory = '/'
      } else {
        this.currentDirectory = data.filePath + '/' + data.fileName
      }
      this.currentNode = node
      this.fnSearchResourceByPath()
    },
    // 根据路径查询该路径下的资源
    fnSearchResourceByPath () {
      $api.listFileResource({path: this.currentDirectory}, (data) => {
        this.resourceData = data.data.fileResources
      })
    },
    // 显示新建目录弹窗
    fnShowAddDirectory () {
      this.addDirectory = true
    },
    // 保存新建目录
    fnSaveAddDirectory () {
      let param = {
        filePath: this.currentDirectory,
        fileName: this.addDirectoryForm.getFieldValue('fileName')
      }
      $api.addFileDirectoryResource(param, (data) => {
        this.$message.success('新建目录成功')
        this.addDirectory = false
        this.fnSearchResourceByPath()
        this.refreshLazyTree()
      })
    },
    // 显示新建文件弹窗
    fnShowAddFile () {
      this.addFile = true
    },
    // 保存新建文件
    fnSaveAddFile () {
      let param = {
        filePath: this.currentDirectory,
        ...this.addFileForm.getFieldsValue()
      }
      $api.addFileResourceText(param, (data) => {
        this.$message.success('新建文件成功')
        this.addFile = false
        this.fnSearchResourceByPath()
      })
    },
    // 删除静态资源
    fnRemoveResource (record) {
      // 如果是目录
      if (record.fileType === '1') {
        $api.removeFileDirectoryResource(record, (data) => {
          this.$message.success('删除目录成功')
          this.fnSearchResourceByPath()
          this.refreshLazyTree()
        })
      } else {
        $api.removeFileResource(record, (data) => {
          this.$message.success('删除文件成功')
          this.fnSearchResourceByPath()
        })
      }
    },
    // 树刷新方法
    refreshLazyTree () {
      this.currentNode.childNodes = []
      if (typeof this.resolveMap[this.currentDirectory] === 'function') {
        this.loadFileResourceTree(this.currentNode, this.resolveMap[this.currentDirectory])
      }
    },
    // 上传状态变化事件
    handleChange (info) {
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 上传成功`)
        this.fnSearchResourceByPath()
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      }
    },
    uploadData (file) {
      return {
        fileName: file.name,
        filePath: this.currentDirectory,
        ...this.Base.getProperty('TA$indexParam', {})
      }
    }
  },
  activated () {
    // this.loadFileResourceTree();
  }
}
</script>
<style type="text/less" lang="less" scoped>
  .search-box {
    width: 340px;
    line-height: 42px;
  }
  .center-box { text-align: center; overflow: hidden; }
  .message-box{
    margin-bottom: 10px;
  }
</style>

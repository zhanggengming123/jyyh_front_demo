<template>
  <div class="fit">
    <ta-border-layout :layout="{left:'300px'}" :leftCfg="{title:'服务项',showBar:true}"
                      :center-cfg="{layoutConStyle:{padding:'0px'}}">
      <div slot="left" class="fit">
        <ta-card :bordered="false" style="width: 100%" :bodyStyle="{'padding':0}">
          <ta-e-tree :load="loadNode" lazy :props="defaultProps" node-key="serviceNameId" :expand-on-click-node="false"
                     ref="tree" :highlight-current="true">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span @click="showTable(data.serviceNameId)" class="custom-name">{{ data.serviceName }}</span>
              <span class="tree-operate">
                <a class="anticon anticon-plus-circle-o"
                   @click="addTreeVisible = true; currIdPath = data.idPath; currData = data; addType = '0'"></a>
                <a class="anticon anticon-edit"
                   @click="addTreeVisible = true; currIdPath = data.idPath; currData = data; addType = '1'"></a>
                <a class="anticon anticon-delete" @click="deleteVisible = true; deleteId = data.serviceNameId"></a>
              </span>
            </span>
          </ta-e-tree>
        </ta-card>
      </div>
      <ta-border-layout
        :show-border="false"
        :layout="{header:'60px'}"
        :headerCfg="{showBorder:false}"
        :centerCfg="{showBorder:false,showBar:true,toolBarStyle:{height:'50px',lineHeight: '48px'}}"
      >
        <div slot="header" class="center-box">
          <ta-input-search v-model="param" placeholder="请输入名称/标识符查询" @search="searchType = 'search'; queryTable()"
                           enterButton="搜索" class="search-box"/>
        </div>
        <div slot="centerExtraContent">
          <ta-tag-select title="可用标识" :data="[{'value':'1','label':'可用'},{'value':'0','label':'不可用'}]"
                         @change="tagSearch"></ta-tag-select>
          <div style="float: right">
            <ta-button @click="addVisible = true; editType = '1'" type="primary">新增服务</ta-button>
          </div>
        </div>
        <ta-table :columns="columns" :pagination='false' rowKey="serviceId" :dataSource="dataSource">
          <span slot="effective" slot-scope="text">{{CollectionLabel('AVAILABLE', text)}}</span>
          <span slot="operate" slot-scope="text, record, index">
            <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
          </span>
        </ta-table>
        <ta-pagination style="float: right; margin-top: 10px;" showSizeChanger showQuickJumper
                       :dataSource.sync="dataSource" :defaultPageSize="10" :params="pageParams" :url="searchUrl"
                       ref="gridPager"/>
      </ta-border-layout>
    </ta-border-layout>
    <add-service :row-data="rowData" :serviceNameId="searchId" :visible="addVisible" :editType="editType"
                 @close="addVisible = false;" @success="queryTable"></add-service>
    <add-tree :visible="addTreeVisible" :idPath="currIdPath" :row="currData" @close="addSuccess"
              :addType="addType"></add-tree>
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="deleteTree" title="服务项删除"
                       description="该服务项及其所有下级服务项"></ta-careful-delete>
  </div>
</template>
<script>
  import $api from './api/index'
  import addService from './part/addService'
  import addTree from './part/addTree'

  const columns = [
    {title: '服务名称', dataIndex: 'serviceName', width: '20%', overflowTooltip: true},
    {title: '服务标识符', dataIndex: 'serviceType', width: '20%', overflowTooltip: true},
    {title: '服务地址', dataIndex: 'serviceUrl', width: '35%', overflowTooltip: true},
    {title: '可用标识', dataIndex: 'effective', width: 100, yesOrNoTag: true, scopedSlots: {customRender: 'effective'}},
    {title: '操作', dataIndex: 'operate', align: 'center', width: 200, scopedSlots: {customRender: 'operate'}}
  ]
  export default {
    name: 'app',
    data() {
      return {
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'serviceName',
          id: 'serviceNameId'
        },
        currNode: '5e3a06ed889b4b40ba88c5ee2ba192f3',
        dataSource: [],
        columns,
        operateMenu:[{
          name: '编辑',
          onClick: (record) => {
            this.editForm(record)
          }
        },{
          name: '删除',
          type: 'confirm',
          confirmTitle: '是否删除该服务?',
          onOk: (record) => {
            deleteForm(record.serviceId)
          }
        }],
        param: '',
        searchId: '',
        addVisible: false,
        addTreeVisible: false,
        deleteVisible: false,
        deleteId: '',
        currIdPath: '',
        addType: '',
        currData: '',
        searchUrl: 'onlinedev/onlineServiceManagementRestService/queryOnlineServiceByCondition',
        editType: '',
        rowData: '',
        searchType: '',
        effective: ''
      }
    },
    components: {addService, addTree},
    mounted() {
      this.searchId = this.currNode
      this.queryTable()
    },
    methods: {
      addSuccess(type, newData) {
        this.addTreeVisible = false
        if (type == 'add') {
          this.$refs.tree.append(newData, this.currData)
        } else if (type == 'edit') {
          this.$set(this.currData, 'serviceName', newData.serviceName)
        }
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          $api.queryOnlineServiceName({}, (data) => {
            return resolve(data.data.serviceNameList)
          })
        }
        if (node.level >= 1) {
          const parentId = node.data.serviceNameId
          $api.queryOnlineServiceName({parentId: parentId}, data => {
            const result = data.data.serviceNameList
            if (result.length) {
              return resolve(result)
            } else {
              resolve([])
            }
          })
        }
      },
      /* 表格 */
      showTable(serviceNameId) {
        this.searchType = 'tree'
        this.searchId = serviceNameId
        this.queryTable()
      },
      tagSearch(data) {
        this.searchType = 'search'
        this.effective = data[0]
        this.queryTable()
      },
      pageParams() {
        const param = {}
        if (this.searchType == 'search') {
          param.serviceName = this.param
          param.serviceType = this.param
          param.effective = this.effective
        }
        param.serviceNameId = this.searchId
        return param
      },
      // 查询表格数据
      queryTable() {
        this.$refs.gridPager.loadData()
      },
      editForm(data) {
        this.addVisible = true
        this.editType = '2'
        this.rowData = data
      },
      deleteForm(id) {
        $api.deleteBatchOnlineService({serviceIds: id}, (data) => {
          if (data.data.result == 1) {
            this.$message.success('删除服务成功')
            this.queryTable()
          }
        })
      },
      deleteTree() {
        $api.deleteBatchOnlineServiceName({serviceNameIds: this.deleteId}, (data) => {
          this.deleteVisible = false
          this.$refs.tree.remove(this.deleteId)
        })
      }
    }
  }
</script>
<style lang="less" scoped type="text/less">
  .search-box {
    width: 340px;
    line-height: 42px;
  }

  .center-box {
    text-align: center;
    overflow: hidden;
  }

  /*.centerTopBar { height: 30px; line-height: 30px; }*/
  .custom-name {
    flex: 1;
    display: flex;
    .text-overflow();
  }

  .tree-operate .anticon {
    margin-left: 6px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .no-cursor {
    cursor: default;
  }
</style>

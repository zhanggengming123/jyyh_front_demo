<template>
  <div class="fit">
    <ta-border-layout :layout="{header:'70px'}" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}">
      <div slot="header" class="center-box">
        <div class="center-item">
          <ta-input-search v-model="param" placeholder="根据名称、自定义编码、拼音简写查询" class="search-box" @search="searchQuery"  enterButton="搜索"/>
        </div>
        <div class="center-item">
          <search-info @search="fnQuery"></search-info>
        </div>
      </div>
      <div slot="centerExtraContent">
        <ta-tag-select title="组织类型" :data="CollectionData('ORGTYPE')" :is-multi="true" v-model="orgTypeParam" @change="searchQuery"></ta-tag-select>
        <div style="float: right;">
          <ta-dropdown>
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认启用所选组织?" cancelText="取消" okText="确认" @confirm="disableOrEnable('1')">
                  <ta-icon type="check-circle"></ta-icon>
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认禁用所选组织?" cancelText="取消" okText="确认" @confirm="disableOrEnable('0')">
                  <ta-icon type="stop"/>
                  <span class="mg-l12">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length" @click="confirmDeleteResource">
                <ta-icon type="close-circle"/>
                删除
              </ta-menu-item>
            </ta-menu>
            <ta-button>批量操作
              <ta-icon type="down"/>
            </ta-button>
          </ta-dropdown>
        </div>
      </div>
      <ta-table :columns="columns"
                style="width:100%;"
                :pagination='false'
                rowKey="orgId"
                :scroll="{y: '100%'}"
                :defaultExpandedRowKeys="defaultExpandedRowKeys"
                :expandedRowKeys="defaultExpandedRowKeys"
                :data-source="gridData"
                @expand="loadChild"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleSelectChange, getCheckboxProps:(record)=>({ props: { disabled: record.isAuthority == '0' } })}">
        <a slot="orgName" slot-scope="text,record" class="operate" @click="operateClick(record, '3')" :class="{'disable-color': record.effective == '0' }">{{text}}</a>
        <span slot="orgType" slot-scope="text">{{CollectionLabel('orgType', text)}}</span>
        <span slot="area" slot-scope="text">{{getLastName(text)}}</span>
        <span slot="action" slot-scope="text, record">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
      </ta-table>
    </ta-border-layout>
    <!--编辑、新增框-->
    <edit-org :visible="editVisible" v-if="editVisible" :editType="editType" :rowData="rowData" :tags="tags" @close="editVisible = false" @search="fnQuery" @addSuccess="addSuccess"></edit-org>
    <!--显示框-->
    <show-org :visible="showVisible" v-if="showVisible" :rowData="rowData" :tags="tags" @close="showVisible = false"></show-org>
    <!--批量删除框-->
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="deleteBatch" title="组织机构删除" description="该组织机构及其所有下级组织"></ta-careful-delete>
  </div>
</template>

<script>
import $api from './api/index'

import searchInfo from './part/searchInfo'
import editOrg from './part/editOrg'
import showOrg from './part/showOrg'
import mixins from './mixins'

import treeDataUtil from '@projectCommon/js/util/treeDataUtil'
const columns = [
  { title: '组织名称', dataIndex: 'orgName', width: '40%', overflowTooltip: true, scopedSlots: { customRender: 'orgName' } },
  { title: '组织类型', dataIndex: 'orgType', width: '15%', scopedSlots: { customRender: 'orgType' } },
  { title: '所属行政区', dataIndex: 'area', width: '15%', overflowTooltip: 'area', scopedSlots: { customRender: 'area' } },
  { title: '自定义编码', dataIndex: 'customNo', width: '15%' },
  { title: '操作', align: 'center', width: 240, scopedSlots: { customRender: 'action' } }]
export default {
  name: 'app',
  data () {
    return {
      defaultExpandedRowKeys: [],
      columns: columns,
      operateMenu: [{
        name: '添加下级',
        disabled: (record) => {
          return record.effective == '0' || record.isAuthority == '0'
        },
        title: record => record.effective == '0' || record.isAuthority == '0' ? '禁用的组织不允许添加下级' : '',
        onClick: (record) => {
          this.operateClick(record, '1')
        }
      }, {
        name: '编辑',
        disabled: (record) => {
          return record.effective == '0' || record.isAuthority == '0'
        },
        title: record => record.effective == '0' || record.isAuthority == '0' ? '禁用的组织不允许编辑' : '',
        onClick: (record) => {
          this.operateClick(record, '2')
        }
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该组织?',
          onOk: (record) => {
            this.disableOrEnable('1', record)
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该组织?',
          onOk: (record) => {
            this.disableOrEnable('0', record)
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该组织?',
          onOk: (record) => {
            this.deleteConfirm(record)
          }
        }]
      }],
      gridData: [],
      tags: [],
      editVisible: false,
      showVisible: false,
      deleteVisible: false,
      editType: '',
      rowData: {},
      dataList: [],
      selectedRowKeys: [],
      deleteOrgIds: '',
      param: '',
      orgTypeParam: []
    }
  },
  mixins: [mixins],
  components: { searchInfo, editOrg, showOrg },
  mounted () {
    this.fnQuery()
  },
  methods: {
    /* 查询表格数据 */
    fnQuery: function (obj = {}) {
      obj.needSearch = obj.needSearch == '1' ? '1' : '0'
      $api.queryAllOrgByOrgId(obj, (data) => {
        this.gridData = data.data.orgData
        const defaultExpandedRowKeys = this.gridData[0] && this.gridData[0].orgId ? this.gridData[0].orgId : ''
        this.defaultExpandedRowKeys = [defaultExpandedRowKeys]
        this.tags = data.data.tags
      })
    },
    // 点击搜索
    searchQuery () {
      const data = {}
      data.needSearch = (this.param.length || this.orgTypeParam.length) ? '1' : '0'
      if (this.orgTypeParam.length) {
        data.orgTypeParam = this.orgTypeParam.join(',')
      }
      if (this.param.length) {
        data.param = this.param
      }
      this.fnQuery(data)
    },
    operateClick: function (obj, type) {
      if (type == '3') {
        this.rowData = obj
        this.showVisible = true
        return
      }

      if (obj.isAuthority == '0') {
        this.$message.destroy()
        this.$message.warning('你没有当前组织的管理权限')
        return
      }

      if (type == '1' && obj.effective == '0') {
        this.$message.warning('禁用的组织不允许添加下级')
        return
      }
      if (type == '2' && obj.effective == '0') {
        this.$message.warning('禁用的组织不允许编辑')
        return
      }
      this.editVisible = true
      this.editType = type
      this.rowData = obj
    },
    handleSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.dataList = selectedRows
    },
    confirmDeleteResource: function () {
      if (this.dataList.length == 0) {
        this.$message.warning('请选择需要删除的组织机构')
      } else {
        const tempOrgIds = []
        for (let i = 0; i < this.dataList.length; i++) {
          if (this.dataList[i].porgId == '0') {
            this.$message.warning('选中的组织包含顶级组织,请重新选择')
            return
          }
          tempOrgIds.push(this.dataList[i].orgId)
        }
        if (tempOrgIds.length) {
          this.deleteOrgIds = tempOrgIds.join(',')
          this.deleteVisible = true
        }
      }
    },
    deleteBatch () {
      $api.deleteBatchOrgs({ orgIds: this.deleteOrgIds }, (data) => {
        this.$message.success('删除成功')
        this.deleteVisible = false
        this.fnQuery()
        // treeDataUtil.removeTreeData(this.gridData, this.dataList, 'orgId')
        this.selectedRowKeys = []
        this.dataList = []
      })
    },
    disableOrEnable (type, record) {
      /* type: '1' 启用 '0': 禁用 */
      let orgIds = ''
      if (record) {
        if (type == '1' && record.effective == '1' && record.childNum == 0) {
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        if (type == '0' && record.effective == '0') {
          this.$message.warning('该记录已经禁用，请勿重复操作！')
          return
        }
        orgIds = record.orgId
      } else {
        orgIds = this.selectedRowKeys.join(',')
      }
      $api.disableOrEnableOrgs({ orgIds: orgIds, type: type }, (data) => {
        this.$message.success((type == '1' ? '启用' : '禁用') + '成功')
        this.fnQuery()
        // treeDataUtil.updateTreeDataDown(this.gridData, this.dataList, { effective: type }, 'orgId')
      })
    },
    // 点击行展开时  加载下级组织机构
    loadChild (expanded, record) {
      // 如果为展开,则进行请求
      const orgId = record.orgId
      if (expanded) {
        if (record.children && record.children.length) {
          this.defaultExpandedRowKeys.push(orgId)
        } else {
          $api.queryChildOrgByOrgId({ orgId: orgId }, (data) => {
            record.children = data.data.childOrg
            this.defaultExpandedRowKeys.push(orgId)
          })
        }
      } else {
        // 如果为关闭,则进行关闭
        const index = this.defaultExpandedRowKeys.indexOf(orgId)
        this.defaultExpandedRowKeys.splice(index, 1)
      }
    },
    deleteConfirm (record) {
      this.$message.destroy()
      if (record.porgId == '0') {
        this.$message.warning('组织机构顶级节点不允许删除')
        return false
      }
      if (record.isAuthority == '0') {
        this.$message.warning('你没有当前组织的管理权限')
        return false
      }

      const deleteIds = this.getDeleteIds(record)
      $api.deleteOrgByOrgId({ orgId: record.orgId }, (data) => {
        this.fnQuery()
        // treeDataUtil.removeTreeData(this.gridData, [record], 'orgId')
        // this.selectedRowKeys = this.selectedRowKeys.filter((orgId) => deleteIds.indexOf(orgId) == -1)
        // this.dataList = this.dataList.filter((item) => deleteIds.indexOf(item.orgId) == -1)
        this.$message.success('删除成功')
      })
    },
    getDeleteIds (data) {
      let result = []
      result.push(data.orgId)
      if (data.children && data.children.length) {
        data.children.forEach((item) => {
          result = result.concat(this.getDeleteIds(item))
        })
      }
      return result
    },
    getLastName (name) {
      return name && name.indexOf('/') != -1 ? name.slice(name.lastIndexOf('/') + 1) : name
    },
    addSuccess (pRecords, newData) {
      this.fnQuery()
      // if (newData.editType == '1') {
      //   treeDataUtil.addTreeData(this.gridData, { ...pRecords }, 'orgId', { ...newData }, this)
      // } else {
      //   this.changeRowData(this.gridData, 'orgId', newData)
      // }
    },
    changeRowData (data, key, newData) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][key] == newData[key]) {
          data[i] = Object.assign({}, data[i], newData)
          break
        }
        if (data[i].children) {
          this.changeRowData(data[i].children, 'orgId', newData)
        }
      }
    }
  }
}
</script>
<style type="text/less" lang="less">
  .ant-collapse-content > .ant-collapse-content-box{ padding: 0;}
</style>
<style scoped type="text/less" lang="less">
  .search-box {width: 340px; margin-right: 10px; }
  .disable-color { color: @normal-color; &:hover { color: @normal-color } }
  .center-box {
    display: table; text-align:center; width: 100%; height: 100%; overflow: hidden;
    .center-item { display: table-cell;
      text-align: center;
      vertical-align: middle;
      &:first-child { text-align: right; width: 55%; }
      &:last-child { text-align: left; width: 45%; }
    }
  }

  .mg-l12{
    margin-left: 12px;
  }
</style>

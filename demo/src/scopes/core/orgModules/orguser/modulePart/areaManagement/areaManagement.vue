<template>
  <div id="app" class="fit" ref="areaMg">
    <ta-border-layout :layout="{header:'70px'}" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}">
      <!--begin 行政搜索-->
      <div slot="header" class="center-box">
        <ta-input-search v-model="searchStr" placeholder="请输入区划名称\代码" class="search-box" @search="queryAreaByCondition" enterButton="搜索"/>
      </div>
      <!--end 行政搜索-->
      <div slot="centerExtraContent">
        <ta-tag-select title="有效性" :data="CollectionData('EFFECTIVE')" v-model="selectFilter" @change="filterClick" class="filter-name"></ta-tag-select>
        <div style="float: right">
          <ta-button type="primary" @click="showAddDrawer('0')">新增顶级行政区划</ta-button>
          <!--begin 批量操作按钮-->
          <ta-dropdown>
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认启用所选行政区?" cancelText="取消" okText="确认" @confirm="fnBatchPickArea(false)">
                  <ta-icon type="check-circle"></ta-icon>
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认禁用所选行政区?" cancelText="取消" okText="确认" @confirm="fnBatchBanArea(false)">
                  <ta-icon type="stop"/>
                  <span class="mg-l12">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length" @click="selectedRows.length === 0 ? $message.warning('请先选择数据') : batchDeleteVisible = true">
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
                :scroll="{ y: '100%' }"
                :dataSource="areaList"
                :pagination="false"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleSelectChange, getCheckboxProps:(record)=>({ props: { disabled: record.isAuthority == '0' } })}"
                rowKey="areaId"
                :expandedRowKeys="currentExpand"
                @expand="loadChild"
                :locale="{filterConfirm: '确定',filterReset: '重置',emptyText: '暂无数据'}">
        <!--begin 对行政区划名称进行处理-->
        <template slot="areaName" slot-scope="text,record">
          <a class="operate" :class="{'disable-color': record.effective == '0' }" @click="showDrawer(record,true); ">{{text}}</a>
        </template>
        <!--end 对行政区划名称进行处理-->
        <!--begin 对有效性进行处理-->
        <span slot="effective" slot-scope="text">{{CollectionLabel('EFFECTIVE', text)}}</span>
        <!--end 对有效性进行处理-->

        <!--begin 对行政级别进行处理-->
        <template slot="areaLevel" slot-scope="text,record">
          <span v-for="item in CollectionData('AREALEVEL')" :key="item.value" v-if="item.value == record.areaLevel">{{item.label}}</span>
        </template>
        <!--end 对行政级别进行处理-->

        <!--begin 用户操作项处理-->
        <span slot="operation" slot-scope="text,record" class="table-operation">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
        <!--end 用户操作项处理-->

      </ta-table>
    </ta-border-layout>
    <ta-drawer :getContainer="setContainer" :destroyOnClose="true" :title="editOrShowTitle" placement="right"
               :closable="true" @close="showVisible = false" :visible="showVisible" width="500" footerHeight>
      <showArea :showArea="editAreaParam" ref="showArea"></showArea>
    </ta-drawer>
    <ta-drawer :getContainer="setContainer" :destroyOnClose="true" :title="editOrShowTitle" placement="right"
               :closable="true" @close="onClose" :visible="editVisible" width="500" footerHeight>
      <div slot="footer">
        <ta-button-group>
          <ta-button @click="onResetForm">重置</ta-button>
          <ta-button type="primary" @click="onSubmitForm">保存</ta-button>
        </ta-button-group>
      </div>
      <edit-area-info :area="editAreaParam" :flag="flag" @editSuccess="editSuccess"
                      ref="editAreaDrawer"></edit-area-info>
    </ta-drawer>
    <ta-drawer :getContainer="setContainer" :destroyOnClose="true" :title="addOrChildTitle" placement="right"
               :closable="true" @close="onClose" :visible="addVisible" width="500">
      <div slot="footer">
        <ta-button-group>
          <ta-button @click="onAddAreaResetForm">重置</ta-button>
          <ta-button type="primary" @click="addAreaSubmit">保存</ta-button>
        </ta-button-group>
      </div>
      <addArea :area="areaItem" @addSuccess="addSuccess" ref="addAreaDrawer"></addArea>
    </ta-drawer>
    <ta-careful-delete :visible="batchDeleteVisible" @close="batchDeleteVisible = false" @delete="fnBatchDeleteArea(false)" title="行政区删除" description="选中行政区"></ta-careful-delete>
  </div>
</template>
<script>
import $api from './api/index'
// 新增组件
import editAreaInfo from './part/editArea.vue'
import addArea from './part/addArea.vue'
import showArea from './part/showArea'

import treeDataUtil from '@projectCommon/js/util/treeDataUtil'

const columns = [
  { title: '区划名称', key: 'areaName', width: '35%', overflowTooltip: true, dataIndex: 'areaName', scopedSlots: { customRender: 'areaName' } },
  { title: '区划代码', key: 'areaCode', width: '15%', dataIndex: 'areaCode' },
  {
    title: '区划层级',
    key: 'areaLevel',
    dataIndex: 'areaLevel',
    width: '15%',
    scopedSlots: { customRender: 'areaLevel' }
  },
  { title: '状态', key: 'effective', dataIndex: 'effective', width: '10%', yesOrNoTag: true, scopedSlots: { customRender: 'effective' } },
  { title: '最后修改时间', overflowTooltip: true, key: 'modifyTime', width: '15%', dataIndex: 'modifyTime' },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 220,
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'app',
  data () {
    return {
      currentExpand: [],
      searchStr: '',
      effective: '',
      columns: columns,
      operateMenu: [{
        name: '新增下级',
        disabled: (record) => record.effective == '0',
        title: (record) => record.effective == '0' ? '禁用的行政区不允许新增下级' : '',
        onClick: (record) => this.showAddDrawer(record)
      }, {
        name: '编辑',
        disabled: (record) => record.effective == '0',
        title: (record) => record.effective == '0' ? '禁用的行政区不允许编辑' : '',
        onClick: (record) => this.showDrawer(record, false)
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该行政区?',
          onOk: (record) => {
            this.fnBatchPickArea(record)
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该行政区?',
          onOk: (record) => {
            this.fnBatchBanArea(record)
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该行政区?',
          onOk: (record) => {
            this.fnBatchDeleteArea(record)
          }
        }]
      }],
      areaList: [],
      // 抽屉
      editVisible: false, // 编辑
      showVisible: false, // 展示
      addVisible: false, // 增加
      editAreaParam: {},
      flag: true, // 抽屉是否可编辑标志
      areaItem: '0',
      parentId: [], // 级联的选择
      areaFieldNames: {
        label: 'areaName',
        value: 'areaId',
        children: 'children'
      },
      areaOptions: [], // 下拉选择数据
      selectedRows: [], // 选择的记录
      selectedRowKeys: [],
      editOrShowTitle: '编辑行政区划',
      addOrChildTitle: '新增下级行政区划',
      selectFilter: [], // 过滤
      batchDeleteVisible: false
    }
  },
  mounted () {
    this.fnLoadAllArea()
  },
  activated () {
  },
  computed: {},
  components: { editAreaInfo, addArea, showArea },
  methods: {
    setContainer () {
      return this.$refs.areaMg
    },
    onResetForm () {
      this.$refs.editAreaDrawer.onResetForm()
    },
    onSubmitForm () {
      this.$refs.editAreaDrawer.onSubmitForm()
    },
    onAddAreaResetForm () {
      this.$refs.addAreaDrawer.onResetForm()
    },
    addAreaSubmit () {
      this.$refs.addAreaDrawer.handleSubmit()
    },
    addSuccess (pRecords, newData) {
      // 新增顶级行政区划
      // if (pRecords === '0') {
      //   this.areaList.push(newData)
      // } else {
      //   treeDataUtil.addTreeData(this.areaList, { ...pRecords }, 'areaId', { ...newData }, this)
      // }
      this.fnLoadAllArea()
      this.onClose()
    },
    editSuccess (newData) {
      // this.changeRowData(this.areaList, 'areaId', newData)
      this.fnLoadAllArea()
      this.onClose()
    },
    changeRowData (data, key, newData) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][key] == newData[key]) {
          data[i] = Object.assign({}, data[i], newData)
          break
        }
        if (data[i].children) {
          this.changeRowData(data[i].children, 'areaId', newData)
        }
      }
    },
    filterClick (data) {
      this.effective = data[0]
      this.queryAreaByCondition()
    },
    // 点击行展开时  加载下级功能菜单
    loadChild (expanded, record) {
      if (expanded == false) {
        const index = this.currentExpand.indexOf(record.areaId)
        this.currentExpand.splice(index, 1)
        return
      }

      $api.queryAllArea({ areaId: record.areaId, effective: this.effective }, (data) => {
        if (!data.data.areaList[0].children) {
          this.$message.warning('当前行政区划不存在下级!')
          return
        }
        record.children = data.data.areaList[0].children
        this.currentExpand.push(record.areaId)
      })
    },
    // 加载所有的行政区划
    fnLoadAllArea () {
      this.currentExpand = []
      let data = {
        effective: this.effective
      }
      $api.queryAllArea(data, (data) => {
        this.areaList = data.data.areaList
      })
    },
    onChange (value) {
      if (!value) {
        return
      }
      this.parentId = value
      this.queryAreaByCondition()
    },
    queryAreaByCondition () {
      // 判断搜索字符串
      const selectStr = this.searchStr
      // 级联选择的数据
      const areaId = this.parentId[this.parentId.length - 1]

      const data = {
        nameOrCode: selectStr,
        areaId: areaId,
        effective: this.effective
      }
      $api.queryAreaByCondition(data, (data) => {
        this.currentExpand = []
        this.areaList = data.data.areaList
      })
    },
    handleSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 批量删除行政区划
    fnBatchDeleteArea (record) {
      let data
      let areaIdPaths = []
      if (record) {
        areaIdPaths.push(record.idPath)
        data = {
          idPaths: areaIdPaths.join(',')
        }
      } else {
        areaIdPaths = this.selectedRows.map((v) => {
          return v.idPath
        })
        data = {
          idPaths: areaIdPaths.join(',')
        }
      }

      $api.deleteBatchAreaByAreaIds(data, (data) => {
        this.$message.success('删除数据成功')
        // treeDataUtil.removeTreeData(this.areaList, this.selectedRows, 'areaId')
        this.fnLoadAllArea()
        this.batchDeleteVisible = false
        // 重新加载级联下拉选项
      })
    },
    // 批量禁用行政区划
    fnBatchBanArea (record) {
      let data
      let areaIdPaths = []
      if (record) {
        if (record.effective == '0') {
          this.$message.warning('该记录已经禁用，请勿重复操作！')
          return
        }
        areaIdPaths.push(record.idPath)
        data = {
          areaIdPaths: areaIdPaths.join(','),
          effective: '0'
        }
      } else {
        for (let i = 0; i < this.selectedRows.length; i++) {
          areaIdPaths.push((this.selectedRows[i].idPath))
        }
        data = {
          areaIdPaths: areaIdPaths.join(','),
          effective: '0'
        }
      }
      $api.updateBatchAreaStatus(data, (data) => {
        this.fnLoadAllArea()
        // treeDataUtil.updateTreeDataDown(this.areaList, this.selectedRows, { effective: 0 }, 'areaId')
        this.selectedRowKeys = []
        this.selectedRows = []
        this.$message.success('更新数据成功')
      })
    },
    // 批量启用行政区划
    fnBatchPickArea (record) {
      let data
      let areaIdPaths = []
      if (record) {
        if (record.effective == '1' && record.childNum == 0) {
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        areaIdPaths.push(record.idPath)
        data = {
          areaIdPaths: areaIdPaths.join(','),
          effective: '1'
        }
      } else {
        for (let i = 0; i < this.selectedRows.length; i++) {
          areaIdPaths.push((this.selectedRows[i].idPath))
        }
        data = {
          areaIdPaths: areaIdPaths.join(','),
          effective: '1'
        }
      }

      $api.updateBatchAreaStatus(data, (data) => {
        this.fnLoadAllArea()
        // treeDataUtil.updateTreeDataDown(this.areaList, this.selectedRows, { effective: '1' }, 'areaId')
        this.selectedRowKeys = []
        this.selectedRows = []
        this.$message.success('更新数据成功')
      })
    },

    showDrawer (record, flag) {
      this.flag = flag
      this.editAreaParam = record
      if (flag) {
        this.editOrShowTitle = '查看行政区划'
        this.showVisible = true
      } else {
        this.editOrShowTitle = '修改行政区划'
        this.editVisible = true
      }
    },
    showAddDrawer (area) {
      if (area === '0') {
        this.addOrChildTitle = '新增行政区划'
      } else {
        if (area.effective == '0') {
          this.$message.warning('禁用的行政区划不允许添加下级')
          return
        }
      }
      this.areaItem = area
      this.addVisible = true
    },
    onClose () {
      this.editVisible = false
      this.addVisible = false
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .mg-l12 { margin-left: 12px; }
  .filter-box {
    display: inline-block
  }
  .filter-name {
    margin-left: 20px
  }
  .disable-color {
    color: @normal-color;
    &:hover {
      color: @normal-color
    }
  }
  .search-box {
    width: 340px;
    line-height: 42px;
  }
  .center-box { text-align:center; overflow: hidden; }
</style>

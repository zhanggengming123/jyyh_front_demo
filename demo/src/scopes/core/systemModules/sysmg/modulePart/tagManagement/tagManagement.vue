<template>
  <div id="app" class="fit">
    <ta-border-layout :layout="{footer:'70px'}"  :centerCfg="{showBar: true, toolBarStyle:{height: '50px'}}" :footer-cfg="{showBorder:false}">
      <div slot="centerExtraContent">
        <ta-tag-select title="标签组" :data="tagGroupList" :props="tagProps" required v-model="tagFilter" @change="filterClick"></ta-tag-select>
        <ta-tag-select title="有效标识" :data="CollectionData('EFFECTIVE')" v-model="effectiveFilter" @change="filterClick" class="filter-name"></ta-tag-select>
        <div style="float: right">
          <ta-button type="primary" @click="fnEditTag()">新增标签</ta-button>
          <ta-dropdown :trigger="['click']">
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认启用所选标签?" cancelText="取消" okText="确认" @confirm="changeTagStatus('1')">
                  <ta-icon type="check-circle"></ta-icon>
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认禁用所选标签?" cancelText="取消" okText="确认" @confirm="changeTagStatus('0')">
                  <ta-icon type="stop"/>
                  <span class="mg-l12">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length" @click="deleteVisible = true">
                <ta-icon type="close-circle"/>
                删除
              </ta-menu-item>
            </ta-menu>
            <ta-button>批量操作<ta-icon type="down"/></ta-button>
          </ta-dropdown>
        </div>
      </div>
      <ta-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        rowKey="tagId"
        :columns="tagColumns"
        :dataSource="tagData"
        :pagination="false">
        <template slot="createTime" slot-scope="text,record">{{moment(record.createTime).format('YYYY-MM-DD')}}</template>
        <!--判断标签名称-->
        <template slot="tagName" slot-scope="text,record">
          <span :class="{invalidStyle: record.effective === '0'}">{{text}}</span>
        </template>
        <!--判断有效性-->
        <span slot="effective" slot-scope="text">{{CollectionLabel('EFFECTIVE', text)}}</span>
        <span slot="action" slot-scope="text, record">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
      </ta-table>
      <!--begin 分页信息-->
      <div slot="footer">
        <ta-pagination style="float: right;margin-top: 10px"
                       showSizeChanger
                       showQuickJumper
                       :dataSource.sync="tagData"
                       :defaultPageSize="10"
                       :params="tagPageParams"
                       :url="tagTableUrl"
                       ref="tagPager"/>
      </div>
      <!--end 分页信息-->
    </ta-border-layout>
    <!--新增编辑-->
    <edit-tag :tag="tagRowData" :tagGroupList="tagGroupList" :visible="visible" @close="visible = false" @search="filterClick"></edit-tag>
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="tagBatchDelete" title="标签删除" description="选中标签"></ta-careful-delete>
  </div>
</template>
<script>
import $api from './api/index'
import EditTag from './part/editTag'
import moment from 'moment'

const tagColumns = [
  { title: '标签名称', width: '20%', overflowTooltip: true, dataIndex: 'tagName', key: 'tagName', scopedSlots: { customRender: 'tagName' } },
  { title: '标签组', width: '20%', dataIndex: 'tagGroupName', key: 'tagGroupName' },
  { title: '创建时间', width: '20%', overflowTooltip: true, dataIndex: 'createTime', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
  { title: '有效标识', width: '20%', dataIndex: 'effective', key: 'effective', yesOrNoTag: true, scopedSlots: { customRender: 'effective' } },
  { title: '操作', key: 'operation', width: '20%', align: 'center', scopedSlots: { customRender: 'action' } }
]

const DEFAULT_TAGGROUPID = '002'
export default {
  name: 'tagManagement',
  components: { EditTag },
  data () {
    return {
      tagGroupList: [],
      tagColumns,
      tagTableUrl: 'org/sysmg/tagManagementRestService/queryTagByCondition',
      operateMenu: [{
        name: '编辑',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的标签不允许编辑' : '',
        onClick: (record) => {
          this.fnEditTag(record)
        }
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该标签?',
          onOk: (record) => {
            this.changeTagStatus('1', record)
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该标签?',
          onOk: (record) => {
            this.changeTagStatus('0', record)
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该标签?',
          onOk: (record) => {
            this.fnTagRecordDelete(record)
          }
        }]
      }],
      tagData: [],
      tagRowData: {},
      visible: false,
      selectedRowKeys: [], // 表格选择的数据
      selectedRows: [], // 表格选择的数据
      tagFilter: [],
      effectiveFilter: [],
      tagProps: {
        value: 'tagGroupId',
        label: 'tagGroupName'
      },
      deleteVisible: false
    }
  },
  mounted () {
    this.fnQueryAllTagGroup()
    this.filterClick()
  },
  methods: {
    moment,
    // tag 分页信息
    tagPageParams () {
      return {
        tagGroupId: this.tagFilter[0],
        effective: this.effectiveFilter.join(',')
      }
    },
    // 查询所有的标签组
    fnQueryAllTagGroup () {
      $api.queryAllTagGroup(null, (data) => {
        this.tagGroupList = data.data.tagGroupList
        this.tagFilter = [DEFAULT_TAGGROUPID]
      })
    },
    // 加载表格数据信息
    filterClick () {
      this.$refs.tagPager.loadData()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    changeTagStatus (effective, record) {
      let param = {}
      if (record) {
        if (record.effective == effective) {
          this.$message.warning('该记录已经' + (effective == '0' ? '禁用' : '启用') + '，请勿重复操作！')
          return
        }
        param = {
          tagIds: record.tagId,
          effective: effective
        }
      } else {
        const validIds = this.selectedRows.filter((item) => {
          return item.effective != effective
        })
        if (validIds.length == 0) {
          this.$message.warning('所选记录已经全部' + (effective == '0' ? '禁用' : '启用') + '，请勿重复操作！')
          return
        }
        const selectedIds = validIds.map((item) => {
          return item.tagId
        })
        param = {
          tagIds: selectedIds.join(','),
          effective: effective
        }
      }
      $api.updateBatchTagStatus(param, (data) => {
        if (record) {
          this.$message.success(effective == '1' ? '启用成功' : '禁用成功')
          record.effective = effective
        } else {
          this.$message.success(effective == '1' ? '批量启用成功' : '批量禁用成功')
          this.selectedRows.map((item) => {
            item.effective = effective
          })
          this.selectedRowKeys = []
          this.selectedRows = []
        }
        // 重新刷新
        this.filterClick()
      }
      )
    },
    fnTagRecordDelete (record) {
      $api.deleteBatchTag({ tagIds: record.tagId }, (data) => {
        this.$message.success('删除成功')
        this.tagData = this.tagData.filter((tag) => {
          return tag.tagId !== record.tagId
        })
        this.selectedRows = []
        this.selectedRowKeys = []
      })
    },
    // 批量删除
    tagBatchDelete () {
      $api.deleteBatchTag({ tagIds: this.selectedRowKeys.join(',') }, (data) => {
        this.$message.success('批量删除成功')
        for (let i = 0; i < this.selectedRows.length; i++) {
          this.tagData = this.tagData.filter((tag) => {
            return tag.tagId !== this.selectedRows[i].tagId
          })
        }
        this.deleteVisible = false
        this.selectedRowKeys = []
        this.selectedRows = []
      })
    },
    fnEditTag (record) {
      if (record) {
        this.tagRowData = record
      } else {
        this.tagRowData = {}
        this.tagRowData.tagGroupId = this.tagFilter[0]
      }
      this.visible = true
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .mg-l12 { margin-left: 12px; }
  .invalidStyle { color: #ccc; cursor: not-allowed; }
  .no-cursor { cursor: default; }
  .filter-name { margin-left: 20px }
</style>

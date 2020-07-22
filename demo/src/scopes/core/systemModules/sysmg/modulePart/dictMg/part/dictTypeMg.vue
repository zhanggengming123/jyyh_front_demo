<template>
  <div id="dictTypeMg" class="fit">
    <ta-border-layout :layout="{header:'70px'}"
                      :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}">
      <div slot="header" class="center-box">
        <ta-input-search class="search-box" v-model="dictQueryParam.dictInfo" @search="queryDictByTypeWithParam"
                         placeholder="根据字典标签、键值查询" enter-button="搜索"/>
      </div>
      <div slot="centerExtraContent">
        <ta-tag-select title="字典状态" :data="CollectionData('EFFECTIVE')" v-model="isEffectiveList"
                       @change="filterClick"></ta-tag-select>
        <ta-tag-select title="缓存状态" :data="CollectionData('DICTDATATYPE')" v-model="cacheStatusList"
                       @change="filterClick" class="filter-name"></ta-tag-select>
        <div style="float: right">
          <ta-button @click="fnBackToHome">
            <ta-icon type="rollback"/>
            返回
          </ta-button>
          <ta-button type="primary" @click="fnToAddDict">新增字典</ta-button>
          <ta-dropdown>
            <ta-menu slot="overlay">
              <ta-menu-divider/>
              <ta-menu-item :disabled="btnDisable">
                <ta-popconfirm title="确认启用所选字典?" cancelText="取消" okText="确认" @confirm="fnStartDicts(false)">
                  <ta-icon type="check-circle"></ta-icon>
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="btnDisable">
                <ta-popconfirm title="确认禁用所选字典?" cancelText="取消" okText="确认" @confirm="fnStopDicts(false)">
                  <ta-icon type="stop"/>
                  <span class="mg-l12">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="btnDisable" @click="deleteVisible = true">
                <ta-icon type="close-circle"/>
                删除
              </ta-menu-item>
            </ta-menu>
            <ta-button>
              批量操作
              <ta-icon type="down"/>
            </ta-button>
          </ta-dropdown>
          <ta-button @click="fnRefreshCache">刷新缓存</ta-button>
        </div>
      </div>
      <div>
        <ta-table :columns="dictContentColumns"
                  :pagination=false
                  ref="dictContentGrid"
                  :dataSource="dictContentGridData"
                  rowKey="value"
                  :rowSelection="{selectedRowKeys: selectedRowKeys, onSelect: fnOnSelect, onSelectAll : fnOnSelectAll}"
                  :defaultExpandAllRows="defaultExpandAllRows">
          <!--字典状态-->
          <span slot="status" slot-scope="text">{{CollectionLabel('EFFECTIVE', text)}}</span>
          <!--系统字典-->
          <span slot="system" slot-scope="text">
              {{CollectionLabel('YESORNO',text)}}
          </span>
          <!--缓存状态-->
          <span slot="cacheStatus" slot-scope="text">
            <ta-tag v-if="text == '2'" type="success" class='no-cursor'>已同步</ta-tag>
            <ta-tag v-else-if="text == '0'" type="danger" class='no-cursor'>未同步</ta-tag>
            <ta-tag v-else type="danger" class='no-cursor'>脏数据</ta-tag>
          </span>
          <span slot="action" slot-scope="text, record">
            <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
          </span>
        </ta-table>
      </div>
    </ta-border-layout>
    <!--字典管理抽屉-->
    <ta-drawer destroyOnClose title="系统字典管理" width="500" placement="right" closable
               footerHeight @close="fnDictAddOrEditDrawerClose(false)" :visible="dictAddOrEditVisible">
      <div slot="footer">
        <ta-button-group>
          <ta-button @click="resetForm">重置</ta-button>
          <ta-button type="primary" @click="saveDict">保存</ta-button>
        </ta-button-group>
      </div>
      <system-dict-mg :dict="bindDict" ref="sysDictChild" @closeSystemDictMgDrawer="fnDictAddOrEditDrawerClose(true)"/>
    </ta-drawer>
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="fnDeleteDicts" title="字典类型删除"
                       description="所选字典(当前字典及其下级所有字典都会被删除)"></ta-careful-delete>
  </div>

</template>

<script>
import SystemDictMg from './systemDictMg'
import $api from '../api/index'

const dictContentColumns = [
  {
    title: '字典标签',
    dataIndex: 'label',
    width: '20%'
  },
  {
    title: '字典键值',
    dataIndex: 'value',
    sorter: (a, b) => a.value - b.value,
    width: '13%'
  },
  {
    title: '字典状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    width: '10%'
  },
  {
    title: '系统字典',
    dataIndex: 'system',
    yesOrNoTag: true,
    scopedSlots: { customRender: 'system' },
    width: '10%'
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    width: '17%'
  },
  {
    title: '缓存状态',
    dataIndex: 'cacheStatus',
    scopedSlots: { customRender: 'cacheStatus' },
    width: '10%'
  },
  {
    title: '操作',
    dataIndex: 'dictAction',
    align: 'center',
    scopedSlots: { customRender: 'action' },
    width: '20%'
  }]

export default {
  name: 'dictTypeMg',
  components: { SystemDictMg },
  data () {
    return {
      defaultExpandAllRows: true,
      dict: {}, // 路由传入的数据
      bindDict: {},
      dictContentColumns, // 列名
      operateMenu: [{
        name: '添加下级',
        title: record => record.cacheStatus == '1' || record.system == '0' || record.status == '0' ? '禁用的字典不能添加下级' : '',
        disabled: (record) => {
          return record.cacheStatus == '1' || record.system == '0' || record.status == '0'
        },
        onClick: (record) => {
          this.fnToAddNextLevelDict(record)
        }
      }, {
        name: '编辑',
        isShow: (record) => {
          return record.cacheStatus == '1' || record.system == '0'
        },
        disabled: () => {
          return true
        }
      }, {
        name: '编辑',
        title: record => record.cacheStatus == '1' || record.system == '0' || record.status == '0' ? '禁用的字典不能编辑' : '',
        disabled: (record) => {
          return record.cacheStatus == '1' || record.system == '0' || record.status == '0'
        },
        isShow: (record) => {
          return !(record.cacheStatus == '1' || record.system == '0')
        },
        onClick: (record) => {
          this.fnToEditDict(record)
        }
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该字典?',
          onOk: (record) => {
            this.fnStartDicts(record)
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该字典?',
          onOk: (record) => {
            this.fnStopDicts(record)
          }
        }, {
          name: '删除',
          isShow: (record) => {
            return record.cacheStatus == '1' || record.system == '0'
          },
          disabled: () => {
            return true
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: (record) => {
            if (record.cacheStatus == '2') return '确定删除该字典数据并更新该字典类型下的缓存？'
            if (record.cacheStatus == '0') return '确定从数据库删除该字典数据并更新该字典类型下的缓存？'
          },
          isShow: (record) => {
            return !(record.cacheStatus == '1' || record.system == '0')
          },
          onOk: (record) => {
            this.fnDeleteDict(record)
          }
        }]
      }],
      dictContentGridData: [], // 展示数据
      selectedRowKeys: [],
      selectedRows: [], // 选中的数据
      dictQueryParam: {}, // 字典查询
      dictAddOrEditVisible: false, // 是否打开抽屉
      isEffectiveList: [],
      cacheStatusList: [],
      deleteVisible: false
    }
  },

  computed: {
    btnDisable () {
      return !this.selectedRowKeys.length
    }
  },

  mounted () {
    this.dict = this.$route.params.dict
    if (this.dict) {
      this.fnLoadDeFaultDict()
    }
  },

  filters: {
    statusFilter: function (val) {
      let status = ''
      switch (val) {
        case '1':
          status = '有效'
          break
        case '0':
          status = '无效'
          break
        default:
          status = '--'
      }
      return status
    }
  },
  methods: {
    // 返回到前一页
    fnBackToHome () {
      this.$router.push({ name: 'dictMg' })
    },
    // 重置字典表单
    resetForm () {
      this.$refs.sysDictChild.resetForm()
    },
    fnOnSelect (record, selected) {
      const { selectedRowKeys, selectedRows } = this
      if (selected) {
        selectedRowKeys.push(record.value)
        selectedRows.push(record)
      } else {
        this.selectedRowKeys = selectedRowKeys.filter(value => value != record.value)
        this.selectedRows = selectedRows.filter(item => item.value != record.value)
      }
    },
    fnOnSelectAll (selected, selectedRows) {
      this.selectedRows = []
      this.selectedRowKeys = []
      if (selected) {
        selectedRows.map(item => {
          this.selectedRowKeys.push(item.value)
        })
        this.selectedRows = selectedRows
      }
    },
    // 保存字典表单
    saveDict () {
      this.$refs.sysDictChild.saveDict()
    },
    fnDictAddOrEditDrawerClose (isRefresh) {
      this.dictAddOrEditVisible = false
      this.bindDict = {}
      const a = this.dict
      if (isRefresh) {
        this.queryDictByTypeWithParam()
      }
    },
    // to add dict
    fnToAddDict () {
      if (this.dict.system == '0') {
        this.$message.warning('非系统字典不能进行新增字典操作！')
        return
      }
      this.bindDict = this.dict
      this.bindDict.drawerType = 'add'
      this.bindDict.parentLabel = ''
      this.bindDict.parentValue = ''
      this.dictAddOrEditVisible = true
    },
    fnToEditDict (record) {
      this.bindDict = record
      this.bindDict.parentLabel = ''
      this.bindDict.parentValue = ''
      this.bindDict.drawerType = 'edit'
      this.dictAddOrEditVisible = true
    },
    // 添加下级字典
    fnToAddNextLevelDict (record) {
      this.bindDict.drawerType = 'add'
      this.bindDict.parentLabel = record.label
      this.bindDict.parentValue = record.value
      this.bindDict.type = record.type
      this.bindDict.name = record.name
      this.bindDict.authority = record.authority
      this.dictAddOrEditVisible = true
    },
    fnRefreshCache () {
      const key = this.dict.type + '.' + this.dict.authority
      const data = {
        keys: key
      }
      $api.refreshDictByType(data, (data) => {
        this.$message.success('同步成功！')
        this.queryDictByTypeWithParam()
      })
    },
    fnStartDicts (record) {
      let values, data
      if (record) {
        if (record.cacheStatus == '2') {
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        data = {
          type: this.dict.type,
          authority: this.dict.authority,
          values: record.value
        }
      } else {
        if (this.dict.system == '0') {
          this.$message.warning('非系统字典不能进行批量禁用操作！')
          return
        }
        values = this.selectedRows.map((v) => v.value)
        data = {
          type: this.dict.type,
          authority: this.dict.authority,
          values: values.join(',')
        }
      }
      $api.startBatchDict(data, (data) => {
        this.$message.success('启用成功！')
        this.selectedRows = []

        this.queryDictByTypeWithParam()
      })
    },
    // 删除字典
    fnDeleteDict (record) {
      const data = {
        type: this.dict.type,
        authority: this.dict.authority,
        values: record.value
      }
      $api.deleteBatchDict(data, (data) => {
        this.$message.success('删除成功！')
        this.selectedRows = []
        this.queryDictByTypeWithParam()
      })
    },
    fnStopDicts (record) {
      let values, data
      if (record) {
        if (record.cacheStatus == '0') {
          this.$message.warning('该记录已经禁用，请勿重复操作！')
          return
        }
        data = {
          type: this.dict.type,
          authority: this.dict.authority,
          values: record.value
        }
      } else {
        if (this.dict.system == '0') {
          this.$message.warning('非系统字典不能进行批量禁用操作！')
          return
        }
        values = this.selectedRows.map((v) => v.value)
        data = {
          type: this.dict.type,
          authority: this.dict.authority,
          values: values.join(',')
        }
      }

      $api.stopBatchDict(data, (data) => {
        this.$message.success('禁用成功！')
        this.selectedRows = []

        this.queryDictByTypeWithParam()
      })
    },
    // 删除字典数据
    fnDeleteDicts () {
      this.deleteVisible = false
      if (this.dict.system == '0') {
        this.$message.warning('非系统字典不能进行批量删除操作！')
        return
      }
      const values = this.selectedRows.map((v) => v.value)
      const data = {
        type: this.dict.type,
        authority: this.dict.authority,
        values: values.join(',')
      }
      $api.deleteBatchDict(data, (data) => {
        this.$message.success('删除成功！')
        this.selectedRows = []

        this.queryDictByTypeWithParam()
      })
    },
    // 查看字典
    fnLoadDeFaultDict () {
      const data = {
        type: this.dict.type || '',
        authority: this.dict.authority
      }
      $api.queryDictByType(data, (data) => {
        this.dictContentGridData = data.data.dictContentGridData
      })
    },
    // 点击查询
    queryDictByTypeWithParam () {
      const data = {
        type: this.dict.type,
        authority: this.dict.authority,
        status: this.dictQueryParam.status,
        dictInfo: this.dictQueryParam.dictInfo,
        cacheStatus: this.dictQueryParam.cacheStatus
      }
      $api.queryDictByType(data, (data) => {
        this.dictContentGridData = data.data.dictContentGridData
        this.selectedRowKeys = []
        this.selectedRows = []
      })
    },
    filterClick () {
      this.dictQueryParam.status = this.isEffectiveList[0]
      this.dictQueryParam.cacheStatus = this.cacheStatusList[0]
      this.queryDictByTypeWithParam()
    }

  }
}
</script>
<style scoped type="text/less" lang="less">
  .mg-l12 { margin-left: 12px; }
  .search-box {
    width: 340px;
    line-height: 42px;
  }

  .center-box {
    text-align: center;
    overflow: hidden;
  }

  .filter-name {
    margin-left: 20px
  }

  .no-cursor {
    cursor: default;
  }
</style>

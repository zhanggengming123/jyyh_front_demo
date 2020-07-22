<template>
  <div>
    <ta-collapse v-model="activeKey" :bordered="false">
      <ta-collapse-panel v-for="(tag,index) in tagArray" :key="generateKey(index)"  :showArrow="false" >
        <template slot="header">
          {{tag.name}}
          <div class="rest-input-delete">
            <template>
              <a v-if="activeKey.indexOf(generateKey(index)) < 0" @click.stop="handleViewRest(generateKey(index))">查看</a>
              <a v-else @click.stop="handleHiddenRest(generateKey(index))">隐藏</a>
            </template>
            <ta-divider type="vertical" />
            <a  @click.stop="handleRemoveRest(tag,generateKey(index),index)">删除</a>
          </div>
        </template>
        <p>服务路径：{{tag.url}}</p>
        <p>独立授权：{{CollectionLabel('YESORNO',tag.authorityPolicy)}}</p>
      </ta-collapse-panel>
      <ta-collapse-panel style="display: none"></ta-collapse-panel>
    </ta-collapse>
    <a @click.stop="initRestUrlDrawer">
      <ta-icon type="plus" /> {{newLabel}}
    </a>
    <ta-modal title="服务列表"
               width="50%"
               height="500px"
               @cancel="handleCloseRestUrlDrawer"
               :visible="restUrlDrawerVisible"
    :get-container="getContainer">
      <ta-row>
        <ta-col><ta-input-search v-model="restSearch" placeholder="输入服务名称/路径回车检索" @search="handleSearchRestUrl"></ta-input-search></ta-col>
      </ta-row>
      <ta-table :columns="columns"
                :pagination="false"
                rowKey="id"
                :dataSource="gridData"
                @expand="handleLoadChild"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleSelectChange}">
         <span slot="action" slot-scope="text, record">
              <ta-switch checkedChildren="是" unCheckedChildren="否"  @change='handleChangeDlAuth(record)'/>
         </span>
      </ta-table>
      <template slot="footer">
        <ta-button-group>
          <ta-button @click="handleResetRestUrl()">重置</ta-button>
          <ta-button type="primary" @click="handleSaveRestUrl()">确定</ta-button>
        </ta-button-group>
      </template>
    </ta-modal>
  </div>
</template>
<script>

import $api from '../api/resourceUiApi'
const columns = [
  { title: '服务名称', dataIndex: 'name', width: '40%', overflowTooltip: true },
  { title: '服务路径', dataIndex: 'url', width: '40%', overflowTooltip: true },
  { title: '独立授权', key: 'action', width: 100, align: 'center', scopedSlots: { customRender: 'action' } }
]

function fixControlledValue (value) {
  if (typeof value === 'undefined' || value === null) {
    return '[]'
  }
  try {
    JSON.parse(value)
  } catch (e) {
    value = '[]'
  }
  return value
}

export default {
  name: 'restUrlSelectTag',
  props: ['value', 'newLabel'],
  data () {
    const { value } = this.$props
    return {
      // form布局配置
      formLayout: 'horizontal',
      formItemLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      },
      tags: fixControlledValue(value),
      activeKey: [],
      keySeparator: '_',
      keySuffix: 'key',

      restSearch: '',
      columns,
      gridData: [],
      selectedRowKeys: [],
      selectedRows: [],
      isAsync: true, // 是否异步加载 (资源列表查询模式)
      restUrlDrawerVisible: false
    }
  },
  computed: {
    tagArray () {
      return JSON.parse(this.tags) || []
    }
  },
  watch: {
    value (val) {
      this.tags = fixControlledValue(val)
      this.activeKey = []
    }
  },
  methods: {
    generateKey (index) {
      return index + this.keySeparator + this.keySuffix
    },
    handleViewRest (key) {
      if (this.activeKey.indexOf(key) > -1) return
      this.activeKey.push(key)
    },
    handleHiddenRest (key) {
      this.activeKey = this.activeKey.filter(a => a !== key)
    },
    handleRemoveRest (item, key, index) {
      const tagList = JSON.parse(this.tags) || []
      tagList.splice(index, 1)
      this.tags = JSON.stringify(tagList)
      this.triggerChange()
    },
    triggerChange  () {
      const changeValue = this.tags
      this.$emit('change', changeValue)
    },
    initRestUrlDrawer () {
      this.restSearch = ''
      this.selectedRowKeys = []
      this.selectedRows = []
      this.handleSearchRestUrl()
    },
    initRestUrlData (urls = []) {
      urls.forEach(obj => {
        obj.authorityPolicy = '0'
      })
      return urls
    },
    handleToSelectRestUrl () {
      this.gridData = []
      this.$nextTick(() => {
        $api.queryNamespace(null, (data) => {
          this.gridData = this.initRestUrlData(data.urls)
          this.restUrlDrawerVisible = true
        })
      })
    },
    handleSearchRestUrl (value) {
      // 搜索条件为空时，异步搜索
      if (value == null || value === '') {
        this.handleToSelectRestUrl()
        this.isAsync = true
        return
      }
      this.isAsync = false
      $api.queryUrlByParam({
        name: value,
        url: value
      }, (data) => {
        this.gridData = this.initRestUrlData(data.urls)
      })
    },
    handleLoadChild (expanded, record) {
      // 如果不是展开,不做任何操作
      if (expanded) {
        // 只有异步加载模式才会 加载子节点, 有条件查询时 ,不需要该操作
        if (this.isAsync) {
          // 已加载节点不重复请求
          if (record.children && record.children.length > 0) return
          $api.queryUrlByNamespace({
            namespace: record.id
          }, data => {
            record.children = this.initRestUrlData(data.urls)
          })
        }
      }
    },
    handleCloseRestUrlDrawer () {
      this.restUrlDrawerVisible = false
    },
    handleResetRestUrl () {
      this.initRestUrlDrawer()
    },
    handleSaveRestUrl () {
      let tagList = JSON.parse(this.tags) || []
      tagList = tagList.filter(tag => this.selectedRowKeys.indexOf(tag.id) === -1).concat(this.selectedRows)
      this.tags = JSON.stringify(tagList)
      this.triggerChange()
      this.restUrlDrawerVisible = false
    },
    handleChangeDlAuth (record) {
      record.authorityPolicy === '1' ? record.authorityPolicy = '0' : record.authorityPolicy = '1'
      this.selectedRows.forEach(item => {
        if(item.id === record.id){
          item.authorityPolicy = record.authorityPolicy
        }
      })
    },
    handleSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      const tempList = JSON.parse(JSON.stringify(selectedRows))
      tempList.forEach(item => !item.authorityPolicy ? item.authorityPolicy = '0' : undefined)
      this.selectedRows = tempList
    },
    getContainer () {
      return document.getElementById('restUrlSelectTagContainer')
    }
  }
}

</script>
<style scoped type="text/less" lang="less">
  .rest-input-delete{
    float: right;
    right:10px;
  }
</style>

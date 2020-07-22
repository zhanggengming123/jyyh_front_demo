<template id="app">
  <ta-border-layout :layout="{header:'70px',footer:'70px'}" :footer-cfg="{showBorder: false}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}">
    <div slot="header" class="center-box">
      <ta-input-search v-model="cacheName" class="search-box" placeholder="请输入缓存名称" @search="fnQueryCache"  enterButton="搜索"/>
    </div>
    <div slot="centerExtraContent">
      <ta-tag-select title="缓存类型" :data="CollectionData('CACHETYPE')" v-model="cacheType" @change="cacheQuery"></ta-tag-select>
    </div>
    <ta-table :columns="cacheColumns"
              :dataSource="cacheData"
              :loading="loading"
              :pagination="false"
              rowKey="cacheId"
              :showOverflowTooltip="true"
              :locale="{filterConfirm: '确定',filterReset: '重置',emptyText: '暂无数据'}">
      <!--begin 用户操作项处理-->
      <span slot="action" slot-scope="text,record">
        <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
      </span>
      <!--end 用户操作项处理-->
    </ta-table>
    <div slot="footer">
      <ta-pagination style="float: right; margin-top: 10px;" showSizeChanger showQuickJumper :dataSource.sync="cacheData" :defaultPageSize="10" :params="cachePageParams" :url="cacheUrl" ref="gridPager" />
    </div>
    <!--begin 编辑模态框-->
    <ta-modal :visible="cache.visible"
              :centered="true"
              destroyOnClose
              :footer="null"
              width="90%"
              @cancel="onModalCancel"
              :bodyStyle="{'height':'400px'}">
        <template slot="title">
          <div style="text-align: center">
              {{cacheNameTitle}}缓存详情
          </div>
        </template>
        <cache-detail :cache="cacheItem"></cache-detail>
    </ta-modal>
    <!--end 编辑模态框-->
  </ta-border-layout>
</template>
<script>
import $api from './api/index'
import CacheDetail from './part/cacheDetail'

const cacheStateDict = [{ value: '', label: '所有' }, { value: '0', label: '未同步' }, { value: '1', label: '同步中' }, { value: '2', label: '同步完成' }, { value: '3', label: '不需同步' }]

const cacheColumns = [
  { title: '缓存名称', dataIndex: 'cacheName', width: '20%' },
  { title: '缓存类型', dataIndex: 'cacheType', width: '20%' },
  { title: '最近更新时间', dataIndex: 'lastUpdateDate', width: '20%' },
  { title: '最近使用时间', dataIndex: 'lastUseDate', width: '20%' },
  { title: '版本号', dataIndex: 'version', width: '20%' },
  {
    title: '操作',
    key: 'operation',
    align: 'center',
    width: '100px',
    overflowTooltip: false,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'cacheMg',
  components: { CacheDetail },
  data () {
    return {
      cacheUrl: 'cacheMg/cacheMgRestService',
      cacheStateDict, // 缓存状态
      cacheType: [], // 默认缓存类型
      cacheName: '', // 缓存名称
      loading: false, // 是否显示加载中
      cacheColumns, // 缓存表格列属性
      operateMenu: [{
        name: '编辑',
        onClick: (record) => {
          this.fnEditCache(record)
        }
      }],
      cacheData: [], // 表格数据
      pagination: {
        size: 10
      },
      defaultTitle: '编辑缓存',
      cache: {
        visible: false// 模态框是否可见
      },
      cacheItem: {}, // 选中的单行数据
      cacheNameTitle: ''// 缓存详情名称标题
    }
  },
  mounted: function () {
    this.fnQueryCache()
  },

  methods: {
    // 查询缓存
    cacheQuery (cacheType) {
      console.log('cacheType', cacheType)
    },
    // 分页参数
    cachePageParams () {

    },
    // 取消模态框,重新加载数据
    onModalCancel () {
      this.cache.visible = false
      this.fnQueryCache()
    },
    // 重置表单查询
    fnCacheReset () {
      this.cacheName = ''
    },
    // 查询表单
    fnQueryCache () {
      $api.queryCacheNameList({ cacheName: this.cacheName }, (data) => {
        this.cacheData = data.data.cacheNameList
      })
    },
    // 编辑缓存
    fnEditCache (record) {
      this.cache.visible = true
      this.cacheItem = record
      this.cacheNameTitle = record.cacheName
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .backGround {
    background: #fff !important;
    padding: 10px;
  }

  .divider {
    margin: 8px 0;
  }

  .title {
    font-weight: bold;
  }

  .filter {
    display: flex;
    margin-top: 10px;
  }
  .search-box { width: 340px; line-height:42px; line-height:36px\0; }
  .center-box { text-align: center; overflow: hidden; }
</style>

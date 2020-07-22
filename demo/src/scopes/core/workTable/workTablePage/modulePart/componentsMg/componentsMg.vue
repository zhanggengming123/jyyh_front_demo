<template>
  <div class="fit">
    <ta-border-layout :showBorder='true' :layout="{header:'70px',footer:'70px'}"
                      :header-cfg="{showBorder: true}"
                      :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-input-search
          placeholder="请输入组件名称"
          @search="fnOnSearch"
          v-model="search"
          class="search-box">
          <ta-button slot="enterButton" type="primary">搜索</ta-button>
        </ta-input-search>
      </div>
      <div style="padding-left: 10px;padding-right: 10px;margin-bottom: 10px;margin-top: 5px;">
        <ta-tag-select
          title="安全策略"
          :data="securityPolicyTagSelect"
          v-model="securityPolicyTagSelectData"
          @change="fnOnTagSelectChange"
          :isMulti="true">
        </ta-tag-select>
        <ta-tag-select
          title="有效性"
          :data="effectiveTagSelect"
          v-model="effectiveTagSelectData"
          @change="fnOnTagSelectChange"
          :isMulti="true">
        </ta-tag-select>
        <div style="float: right;">
          <ta-button type="primary" @click="fnOnAddClick">新增</ta-button>
          <ta-dropdown>
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="!selectedKeys.length">
                <ta-popconfirm title="确认启用所选工作台组件?" cancelText="取消" okText="确认" @confirm="fnUpdateStatus(false, '1')">
                  <ta-icon type="check-circle"></ta-icon>
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedKeys.length">
                <ta-popconfirm title="确认禁用所选工作台组件?" cancelText="取消" okText="确认" @confirm="fnUpdateStatus(false, '0')">
                  <ta-icon type="stop"/>
                  <span class="mg-l12">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedKeys.length" @click="deleteVisible = true">
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
      <ta-table ref="componentTable" :columns.sync="componentColumns" :dataSource="componentData" rowKey="resourceId" :pagination='false' :rowSelection="{selectedRowKeys: selectedKeys, onChange: handleSelectChange}">
        <span slot="operate" slot-scope="text, record">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
        <div slot="restUrl" slot-scope="text, record">
            <span v-if="text && text.length > 0">
              <ta-tooltip placement="topLeft" v-for="(item,index) in getJsonArray(text)" v-if="index < 1" :key="item.urlId">
                <template slot="title" >
                  <p>服务路径：{{item.url}}</p>
                  <p>独立授权：{{CollectionLabel('YESORNO',item.authorityPolicy)}}</p>
                </template>
                <ta-tag>{{item.name}}</ta-tag>
              </ta-tooltip>
              <ta-popover
                v-if="getJsonArray(text).length > 1"
                placement="right"
                title="服务列表"
                width="360"
                trigger="click">
                <ta-divider />
                <div style="word-break:break-all;max-height: 420px;overflow: auto">
                  <div v-for="item in getJsonArray(text)" :key="item.urlId" style="overflow:hidden;">
                    <p>
                      <span>
                        服务名称：{{item.name}}
                      </span><br/>
                      <span>
                        服务路径：
                        <br/>
                        {{item.url}}
                      </span><br/>
                      <span>
                        独立授权：{{CollectionLabel('YESORNO',item.authorityPolicy)}}
                      </span><br/>
                      <ta-divider />
                    </p>
                  </div>
                </div>
                <span slot="reference" style="cursor: pointer"><ta-icon type="share-alt" />查看</span>
              </ta-popover>
            </span>
        </div>
        <span slot="securityPolicy" slot-scope="text">{{CollectionLabel('SECURITYPOLICY',text)}}</span>
        <span slot="resourceType" slot-scope="text">{{CollectionLabel('WORKTABLECOMPONENTTYPE',text)}}</span>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          style="float: right;margin-top: 10px"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="componentData"
          :defaultPageSize="10"
          :params="pageParams"
          url="org/sysmg/WorkbenchManageRestService/queryResource"
          ref="gridPager"
        />
      </div>
    </ta-border-layout>
    <componentEditDrawer
      :visible.sync="visible"
      :operateType="operateType"
      :formInitValue="formInitValue"
      @onSaveClick="fnOnSave">
    </componentEditDrawer>
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="fnOnDeleteClick" title="工作台组件删除" description="选中的工作台组件"></ta-careful-delete>
  </div>
</template>

<script>
import api from './api/index'
import componentEditDrawer from './part/componentEditDrawer'

export default {
  name: 'componentsMg',
  components: { componentEditDrawer },
  data () {
    const componentColumns = [
      {
        title: '组件名称',
        dataIndex: 'name',
        width: '15%',
        overflowTooltip: true,
        scopedSlots: { customRender: 'name' }
      }, {
        title: '组件文件名',
        dataIndex: 'url',
        width: '15%',
        overflowTooltip: true,
        customRender: (text) => {
          return (text == null || text === '') ? '--' : text.slice(text.lastIndexOf('/') + 1)
        }
      }, {
        title: '服务路径',
        dataIndex: 'restUrl',
        width: '20%',
        overflowTooltip: true,
        scopedSlots: { customRender: 'restUrl' }
      }, {
        title: '组件类型',
        dataIndex: 'resourceType',
        width: '10%',
        scopedSlots: { customRender: 'resourceType' }
      }, {
        title: '安全策略',
        dataIndex: 'securityPolicy',
        width: '12%',
        scopedSlots: { customRender: 'securityPolicy' }
      }, {
        title: '有效性',
        dataIndex: 'effective',
        width: '8%',
        yesOrNoTag: true,
        customRender: (text) => {
          return text === '1' ? '有效' : '无效'
        }
      }, {
        title: '操作',
        align: 'center',
        width: '20%',
        scopedSlots: { customRender: 'operate' }
      }, {
        title: '排序',
        dataIndex: 'orderNo',
        width: '0%',
        sorter: (a, b) => b.orderNo - a.orderNo,
        sortOrder: 'desc'
      }]
    const securityPolicyTagSelect = [{ value: '0', label: '无需登录可访问' }, { value: '1', label: '登录均可访问' }, {
      value: '2',
      label: '授权可访问'
    }]
    const effectiveTagSelect = [{ value: '0', label: '无效' }, { value: '1', label: '有效' }]
    return {
      securityPolicyTagSelect: securityPolicyTagSelect,
      securityPolicyTagSelectData: [],
      effectiveTagSelect: effectiveTagSelect,
      effectiveTagSelectData: [],
      componentColumns: componentColumns, // 表头行
      operateMenu: [{
        name: '编辑',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的工作台组件不允许编辑' : '',
        onClick: (record) => {
          this.fnOnEditClick(record)
        }
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确定启用该组件吗?',
          onOk: (record) => {
            this.fnUpdateStatus(record, '1')
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确定禁用该组件吗?',
          onOk: (record) => {
            this.fnUpdateStatus(record, '0')
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确定删除该组件吗?',
          onOk: (record) => {
            this.fnOnDeleteClick(record)
          }
        }]
      }],
      componentData: [], // 表格数据
      search: '',
      visible: false,
      operateType: true, // true:添加  false:编辑
      formInitValue: {},
      componentDefaultValue: {},
      resourceId: '',
      selectedKeys: [],
      deleteVisible: false
    }
  },
  mounted () {
    api.queryDefaultValue({}, res => {
      this.componentDefaultValue = Object.assign({}, res.data)
    })
    this.$refs.gridPager.loadData()
    this.$refs.componentTable.hideColumns(['orderNo'])
  },
  methods: {
    getJsonArray (text) {
      let array = []
      try {
        array = JSON.parse(text)
      } catch (e) {
        array = []
      }
      return array
    },
    pageParams: function () {
      const param = {}
      param.search = this.search
      param.securityPolicyTags = this.securityPolicyTagSelectData.join(',')
      param.effectiveTags = this.effectiveTagSelectData.join(',')
      return param
    },
    fnOnSearch: function () {
      this.$refs.gridPager.loadData()
    },
    fnOnTagSelectChange: function () {
      this.$refs.gridPager.loadData()
    },
    handleSelectChange: function (selectedRowKeys, selectedRows) {
      this.selectedKeys = selectedRowKeys
    },
    fnUpdateStatus: function (record, effective) {
      let data
      if (record) {
        if (record.effective == effective) {
          this.$message.warning('该记录已经' + (effective == '0' ? '禁用' : '启用') + '，请勿重复操作！')
          return
        }
        data = {
          resourceIds: record.resourceId,
          effective: effective
        }
      } else {
        data = {
          resourceIds: this.selectedKeys.join(','),
          effective: effective
        }
      }
      api.updateStatus(data, data => {
        this.selectedKeys = []
        if (data.serviceSuccess) {
          this.$message.success((effective == '0' ? '禁用' : '启用') + '成功')
          this.$refs.gridPager.loadData()
        } else {
          this.$message.error((effective == '0' ? '禁用' : '启用') + '失败')
        }
      })
    },
    fnOnAddClick: function () {
      this.formInitValue = { resourceType: '0', securityPolicy: '2', securityLevel: '1', effectiveFlag: true }
      this.operateType = true
      this.visible = true
    },
    fnOnEditClick: function (record) {
      this.formInitValue = Object.assign({}, record, { effectiveFlag: record.effective === '1' })
      this.resourceId = record.resourceId
      this.operateType = false
      this.visible = true
    },
    fnOnSave: function (form) {
      form.validateFieldsAndScroll((error) => {
        if (!error) {
          this.visible = false
          const effective = form.getFieldValue('effectiveFlag') ? '1' : '0'
          const data = Object.assign({
            effective: effective,
            workbench: '1'
          }, form.getFieldsValue(), this.componentDefaultValue)
          if (data.restUrl) {
            const restUrl = JSON.parse(data.restUrl)
            restUrl.forEach(item => {
              if (!item.authorityPolicy) {
                item.authorityPolicy = 0
              }
            })
            data.restUrl = JSON.stringify(restUrl)
          }
          if (this.operateType) {
            api.addResource(data, () => {
              this.$message.success('新增成功')
              this.$refs.gridPager.loadData()
            })
          } else {
            api.updateResourceByResourceId(Object.assign({}, data, { resourceId: this.resourceId }), () => {
              this.$message.success('修改成功')
              this.resourceId = ''
              this.$refs.gridPager.loadData()
            })
          }
        }
      })
    },
    fnOnDeleteClick: function (record) {
      let resourceIds
      if (record) {
        resourceIds = record.resourceId
      } else {
        resourceIds = this.selectedKeys.join(',')
      }
      api.deleteResourceByResourceIds({ resourceIds: resourceIds }, () => {
        this.$message.success('删除成功')
        this.deleteVisible = false
        this.$refs.gridPager.loadData()
      })
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

  .no-cursor {
    cursor: default;
  }

  .filter-name {
    margin-left: 20px
  }

  .filter-box {
    display: inline-block
  }
</style>

<template>
  <div id="dictMg" class="fit">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}"
                      :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}"
                      :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-input-search class="search-box" v-model="typeInfo" @search="queryDictType" placeholder="根据字典名称、字典类型" enter-button="搜索"/>
      </div>
      <div slot="centerExtraContent">
        <div style="float: right">
          <ta-button type="primary" @click="fnToAddDictType">新增类型</ta-button>
          <ta-dropdown>
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="btnDisable">
                <ta-popconfirm title="确认启用所选字典类型?" cancelText="取消" okText="确认" @confirm="fnStartDictByTypes(false)">
                  <ta-icon type="check-circle"></ta-icon>
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="btnDisable">
                <ta-popconfirm title="确认禁用所选字典类型?" cancelText="取消" okText="确认" @confirm="fnStopDictByTypes(false)">
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
          <ta-button @click="fnRefreshCaches">刷新缓存</ta-button>
        </div>
      </div>
      <ta-table :columns="dictTypeColumns"
                :dataSource="typeGridData"
                ref="typeGrid"
                :rowKey="getRowKey"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: fnOnChange}"
                :pagination=false
      >
        <span slot="system" slot-scope="text">{{CollectionLabel('YESORNO',text)}}</span>
        <span slot="authority" slot-scope="text">{{getAuthorityLabel(text)}}</span>
        <span slot="action" slot-scope="text, record">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          style="float: right; margin-top: 10px;"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="typeGridData"
          :defaultPageSize="10"
          :params="pageParams"
          url="dictmg/dictMgRestService/queryType"
          ref="gridPager"/>
      </div>
    </ta-border-layout>
    <ta-drawer :destroyOnClose="true" title="新增字典类型" width="500" placement="right" closable
               @close="fnTypeDrawCloseEvent" :visible="typeDrawerVisible">
      <ta-form :autoFormCreate="(form)=>{this.form = form}">
        <ta-form-item label='字典类型'
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      fieldDecoratorId="type"
                      :initValue="typeFormData.type"
                      :fieldDecoratorOptions="{ rules: [{ required: true, message: '请输入字典类型' }]}">
          <ta-input/>
        </ta-form-item>
        <ta-form-item label='字典名称'
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      fieldDecoratorId="name"
                      :initValue="typeFormData.name"
                      :fieldDecoratorOptions="{ rules: [{ required: true, message: '请输入字典名称'  }]}">
          <ta-input/>
        </ta-form-item>
        <ta-form-item label='权限标识'
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol"
                      fieldDecoratorId="authority"
                      :initValue="typeFormData.authority"
                      :fieldDecoratorOptions="{ rules: [{ required: true, message: '请选择所属权限标识' }]}">
          <ta-select placeholder="请选择权限标识">
            <ta-select-option v-for="item in authorityList" :key="item.value">{{item.label}}</ta-select-option>
          </ta-select>
          <!--          <ta-input v-model="typeFormData.authority"/>-->
        </ta-form-item>
      </ta-form>
      <div slot="footer">
        <ta-button-group>
          <ta-button @click="form.resetFields()">重置</ta-button>
          <ta-button type="primary" @click="saveType">保存</ta-button>
        </ta-button-group>
      </div>
    </ta-drawer>

    <ta-drawer destroyOnClose title="新增字典" width="500" placement="right" closable footerHeight
               @close="fnDictAddOrEditDrawerClose" :visible="dictAddOrEditVisible">
      <div slot="footer">
        <ta-button-group>
          <ta-button @click="resetForm">重置</ta-button>
          <ta-button type="primary" @click="saveDict">保存</ta-button>
        </ta-button-group>
      </div>
      <system-dict-mg :dict="dict" ref="sysDictMgChild"
                      @closeSystemDictMgDrawer="fnDictAddOrEditDrawerClose"></system-dict-mg>
    </ta-drawer>
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="fnDeleteDictByTypes" title="字典类型删除" description="所选字典类型"></ta-careful-delete>
  </div>
</template>
<script>

import systemDictMg from './systemDictMg'
import dictTypeMg from './dictTypeMg'

import $api from '../api/index'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const dictTypeColumns = [
  {
    title: '字典名称',
    dataIndex: 'name',
    key: 'name',
    width: '25%',
    overflowTooltip: true
  }, {
    title: '字典类型',
    dataIndex: 'type',
    key: 'type',
    width: '30%',
    overflowTooltip: true
  }, {
    title: '权限标识',
    dataIndex: 'authority',
    width: '10%',
    scopedSlots: { customRender: 'authority' }
  }, {
    title: '系统字典',
    dataIndex: 'system',
    scopedSlots: { customRender: 'system' },
    width: '10%'
  }, {
    title: '操作',
    dataIndex: 'typeAction',
    align: 'center',
    scopedSlots: { customRender: 'action' },
    width: '20%'
  }]

export default {
  name: 'dictMg',
  components: { systemDictMg },
  data () {
    return {
      dictTypeColumns, // 缓存字典列名
      operateMenu:[{
        name:'新增字典',
        disabled: (record) => {
          return record.system == '0'
        },
        title: record => record.system == '0' ? '存在系统字典，不能新增字典!' : '',
        onClick: (record)=>{
          this.fnToAddDictByType(record)
        }
      },{
        name:'查看',
        onClick:(record)=>{
          this.fnRouteToDictTypeMg(record)
        }
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该字典类型?',
          onOk:(record) =>{
            this.fnStartDictByTypes(record)
          },
          title: record => record.system == '0' ? '存在系统字典不能启用!' : '',
          disabled: (record) => {
            return record.system == '0'
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该字典类型?',
          title: record => record.system == '0' ? '存在系统字典不能禁用!' : '',
          onOk:(record) =>{
            this.fnStopDictByTypes(record)
          },
          disabled: (record) => {
            return record.system == '0'
          }
        }, {
          name:'删除',
          type:'confirm',
          confirmTitle: '确定删除该字典类型?',
          onOk: (record)=>{
            this.fnDeleteDictByType(record)
          },
          title: record => record.system == '0' ? '存在系统字典不能删除!' : '',
          disabled: (record) => {
            return record.system == '0'
          }
        }],
      }],
      typeGridData: [], // 缓存字典数据
      dict: {}, // 传入下级表单的数据
      dictAddOrEditVisible: false, // 是否显示新增字典抽屉
      formItemLayout, // 布局
      // query
      typeInfo: '', // 搜索查询字段
      dictQueryParam: {},
      typeDrawerVisible: false,
      dictStatus: true,
      dictNameDisable: false,
      parentValueSelect: true,
      dictContentModal: false,
      // page Data transfer
      selectedType: {},
      selectedRows: [],
      selectedRowKeys: [],
      // '1' means to add , '2' means to edit
      operateType: '',
      keyJoin: '.',
      keySeparater: ',',
      typeFormData: {
        type: '',
        name: '',
        authority: ''
      },
      dictContentGridData: [],
      parentValueList: [],
      authorityList: [],
      deleteVisible: false
    }
  },

  mounted () {
    this.queryDictType()
    this.queryDictAuthorityList()
  },

  computed: {
    btnDisable () {
      return !this.selectedRowKeys.length
    }
  },

  methods: {
    getRowKey: function (record) {
      return record.name + record.type + record.authority
    },
    queryDictAuthorityList () {
      $api.queryDictAuthorityList({}, (data) => {
        this.authorityList = data.data.list
      })
    },
    getAuthorityLabel (value) {
      let result = null
      if (value == '0') {
        result = '默认'
      }
      const arr = this.authorityList
      arr.forEach(element => {
        if (value == element.value) {
          result = element.label
        }
      })
      if (result === null) {
        result = '其它'
      }
      return result
    },
    pageParams () {
      const data = {
        typeInfo: this.typeInfo
      }
      return data
    },
    // 查询字典类型
    queryDictType () {
      this.$refs.gridPager.loadData((data) => {
        this.selectedRowKeys = []
        this.selectedRows = []
      })
    },
    fnOnChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 新增字典
    fnToAddDictByType (record) {
      this.dict = record
      this.dict.drawerType = 'add'
      this.dictAddOrEditVisible = true
    },
    // 查看字典
    queryDictByType (record) {
      this.dict = record
      this.dictContentModal = true
    },
    // 删除字典
    fnDeleteDictByType (record) {
      const key = record.type + this.keyJoin + record.authority
      $api.deleteDictByType({ keys: key }, (data) => {
        this.$message.success('删除成功！')
        this.queryDictType()
      })
    },
    // 重置字典表单
    resetForm () {
      this.$refs.sysDictMgChild.resetForm()
    },
    // 保存字典表单
    saveDict () {
      this.$refs.sysDictMgChild.saveDict()
    },
    fnToAddDictType () {
      this.typeDrawerVisible = true
    },
    saveType () {
      const data = this.form.getFieldsValue()
      $api.saveType(data, (data) => {
        this.typeDrawerVisible = false
        this.$message.success('新增类型成功！')
        this.queryDictType()
      })
    },

    // refresh cache
    fnRefreshCaches () {
      if (this.selectedRows.length == 0) {
        this.$message.warning('请选择需要同步缓存的字典类型！')
        return
      }
      const dictKeys = this.selectedRows.map(v => {
        return v.type + '.' + v.authority
      })
      const data = {
        keys: dictKeys.join(',')
      }
      $api.refreshDictCacheByType(data, (data) => {
        this.$message.success('同步成功！')
        this.queryDictType()
      })
    },

    // delete By Types
    fnDeleteDictByTypes () {
      for (let i = 0; i < this.selectedRows.length; i++) {
        if (this.selectedRows[i].system == '0') {
          this.$message.warning('存在非系统字典，不能进行批量删除操作！')
          return
        }
      }
      const dictKeys = this.selectedRows.map(v => {
        return v.type + '.' + v.authority
      })
      const data = {
        keys: dictKeys.join(',')
      }
      $api.deleteDictByType(data, (data) => {
        this.$message.success('删除数据成功')
        this.selectedRows = []
        this.deleteVisible = false
        this.queryDictType()
      })
    },

    // stop dict By types
    fnStartDictByTypes (record) {
      let dictKeys, data
      if(record){
        // if(record.effective == '1'){
        //   this.$message.warning('该记录已经启用，请勿重复操作！')
        //   return
        // }
        data = {
          keys: record.type + '.' + record.authority
        }
      }else {
        for (let i = 0; i < this.selectedRows.length; i++) {
          if (this.selectedRows[i].system == '0') {
            this.$message.warning('存在非系统字典，不能进行批量启用操作！')
            return
          }
        }
        dictKeys = this.selectedRows.map(v => {
          return v.type + '.' + v.authority
        })
        data = {
          keys: dictKeys.join(',')
        }
      }

      $api.startDictByType(data, (data) => {
        this.$message.success('启用数据成功')
        this.selectedRows = []
        this.queryDictType()
      })
    },

    // stop dict By types
    fnStopDictByTypes (record) {
      let dictKeys, data
      if(record){
        // if(record.effective == '0'){
        //   this.$message.warning('该记录已经禁用，请勿重复操作！')
        //   return
        // }
        data = {
          keys: record.type + '.' + record.authority
        }
      }else {
        for (let i = 0; i < this.selectedRows.length; i++) {
          if (this.selectedRows[i].system == '0') {
            this.$message.warning('存在非系统字典，不能进行批量启用操作！')
            return
          }
        }
        dictKeys = this.selectedRows.map(v => {
          return v.type + '.' + v.authority
        })
        data = {
          keys: dictKeys.join(',')
        }
      }
      $api.stopDictByType(data, (data) => {
        this.$message.success('禁用数据成功')
        this.selectedRows = []
        this.queryDictType()
      })

    },

    // UI Control method
    fnDictAddOrEditDrawerClose () {
      this.operateType = ''
      this.dictNameDisable = false
      this.dictFormData = {}
      this.dictAddOrEditVisible = false
    },

    fnDictModalCloseEvent () {
      this.dictContentModal = false
      this.selectedType = {}
    },

    fnTypeDrawCloseEvent (event) {
      this.typeDrawerVisible = false
    },

    fnRouteToDictTypeMg (record) {
      this.$router.push(
        {
          name: 'dictTypeMg',
          params: {
            dict: record
          }
        }
      )
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .mg-l12 { margin-left: 12px; }
  .search-box {
    width: 340px;
    line-height: 42px;
    line-height: 37px \0;
  }

  .center-box {
    text-align: center;
    overflow: hidden;
  }
</style>

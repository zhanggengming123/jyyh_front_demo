<template>
  <div id="app">
      <ta-form :autoFormCreate="(form)=>{this.form = form}" :layout="formLayout">
        <ta-row>
          <ta-col :span="0">
            <ta-form-item label='所属功能ID'
                          :labelCol="formItemLayout.labelCol"
                          :wrapperCol="formItemLayout.wrapperCol"
                          fieldDecoratorId="resourceId"
                          :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}">
              <ta-input/>
            </ta-form-item>
          </ta-col>
          <ta-col :span="0">
            <ta-form-item label='唯一标识'
                          :labelCol="formItemLayout.labelCol"
                          :wrapperCol="formItemLayout.wrapperCol"
                          fieldDecoratorId="pageElementId"
                          :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}">
              <ta-input/>
            </ta-form-item>
          </ta-col>
        </ta-row>
        <ta-row>
          <ta-col :span="12">
            <ta-form-item label='所属功能'
                          :labelCol="formItemLayout.labelCol"
                          :wrapperCol="formItemLayout.wrapperCol"
                          fieldDecoratorId="resourceName"
                          :fieldDecoratorOptions="{rules: [{ required: true, message: ' ' }]}">
              <ta-input :disabled="true"/>
            </ta-form-item>
          </ta-col>
          <ta-col :span="12">
            <ta-form-item label='表单元素名称'
                          :labelCol="formItemLayout.labelCol"
                          :wrapperCol="formItemLayout.wrapperCol"
                          fieldDecoratorId="elementName"
                          :fieldDecoratorOptions="{rules: [{ required: true, message: '请填写表单元素名称!' }]}">
              <ta-input/>
            </ta-form-item>
          </ta-col>
        </ta-row>
        <ta-row>
          <ta-col :span="12">
            <ta-form-item label='表单元素ID'
                          :labelCol="formItemLayout.labelCol"
                          :wrapperCol="formItemLayout.wrapperCol"
                          fieldDecoratorId="elementId"
                          :fieldDecoratorOptions="{rules: [{ required: true, message: '请填写表单元素ID!' }]}">
              <ta-input/>
            </ta-form-item>
          </ta-col>
          <ta-col :span="12">
            <ta-form-item label='自定义编码'
                          :labelCol="formItemLayout.labelCol"
                          :wrapperCol="formItemLayout.wrapperCol"
                          fieldDecoratorId="code"
                          :fieldDecoratorOptions="{rules: [{ required: true, message: '请填写自定义编码!' }]}">
              <ta-input/>
            </ta-form-item>
          </ta-col>
        </ta-row>
        <ta-row>
          <ta-col :span="12">
            <ta-form-item label='授权策略'
                          :labelCol="formItemLayout.labelCol"
                          :wrapperCol="formItemLayout.wrapperCol"
                          fieldDecoratorId="authorityPolicy"
                          :fieldDecoratorOptions="{initialValue: '0', rules: [{ required: true, message: '请选择授权策略!' }]}">
              <ta-radio-group buttonStyle="solid">
                <ta-radio-button v-for="item in CollectionData('ELEMENTAUTHORITYPOLICY')" :value="item.value" :key="item.value">
                  {{item.label}}
                </ta-radio-button>
              </ta-radio-group>
            </ta-form-item>
          </ta-col>
          <ta-col :span="12">
            <ta-form-item align="right">
              <ta-button-group>
                <ta-button @click="handleReturnHomePage">返回</ta-button>
                <ta-button @click="handleResetData">重置</ta-button>
                <ta-button type="primary" @click="handleSaveResourceUi">保存</ta-button>
              </ta-button-group>
            </ta-form-item>
          </ta-col>
        </ta-row>
      </ta-form>
      <ta-row class="gridRow">
        <ta-table size="small"
                  :pagination='false'
                  :columns="uiColumns"
                  rowKey="elementId"
                  :dataSource="uiGridData">
          <span slot="authorityPolicy" slot-scope="text">{{CollectionLabel('ELEMENTAUTHORITYPOLICY',text)}}</span>
          <span slot="actions" slot-scope="text, record">
            <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
        </ta-table>
      </ta-row>
  </div>

</template>
<script>

import api from '../api/resourceUiApi'

const uiColumns = [{
  title: '表单元素名称',
  dataIndex: 'elementName',
  key: 'elementName'
}, {
  title: '表单元素ID',
  dataIndex: 'elementId',
  key: 'elementId'
}, {
  title: '自定义编码',
  dataIndex: 'code',
  key: 'code'
}, {
  title: '授权策略',
  dataIndex: 'authorityPolicy',
  key: 'authorityPolicy',
  scopedSlots: {customRender: 'authorityPolicy'}
}, {
  title: '操作',
  key: 'actions',
  width: 160,
  align: 'center',
  scopedSlots: {customRender: 'actions'}
}]

const uiGridData = []

export default {
  name: 'resourceUi',
  props: {
    initData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // form布局配置
      formLayout: 'horizontal',
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18}
      },
      uiColumns: uiColumns,
      operateMenu: [{
        name:'编辑',
        onClick:(record)=>{
          this.handleEditResourceUi(record)
        }
      },{
        name:'删除',
        type: 'confirm',
        confirmTitle: '确定删除？',
        onOk:(record)=>{
          this.handleDeleteResourceUi(record)
        }
      }],
      uiGridData: uiGridData,
      elementDataAddOrEdit: '1' // 标志位: 表单元素 新增1  编辑2
    }
  },
  mounted () {
    // 初始化from数据
    this.handleResetData()
    // 加载界面元素列表
    this.fnLoadResourceUi()
  },
  methods: {
    handleEditResourceUi (record) {
      this.handleResetData()
      this.elementDataAddOrEdit = '2'
      this.form.setFieldsValue(record)
    },
    handleDeleteResourceUi (record) {
      api.deleteResourceUi(record, () => {
        this.fnLoadResourceUi()
      })
    },
    handleSaveResourceUi () {
      let formValue = this.form.getFieldsValue()
      if (formValue.elementId == '') {
        this.$message.warn('请输入界面元素ID')
        return
      }

      if (formValue.elementName == '') {
        this.$message.warn('请输入界面元素名称')
        return
      }

      api.saveResourceUi({
        ...formValue,
        elementDataAddOrEdit: this.elementDataAddOrEdit
      }, () => {
        // 初始化from数据
        this.handleResetData()
        // 加载界面元素列表
        this.fnLoadResourceUi()
      })
    },
    handleReturnHomePage () {
      this.$emit('close')
    },
    handleResetData () {
      this.form.resetFields()
      this.form.setFieldsValue({
        resourceId: this.initData.resourceId,
        resourceName: this.initData.name
      })
      this.elementDataAddOrEdit = '1'
    },
    fnLoadResourceUi () {
      api.queryResourceUi(this.initData.resourceId, (data) => {
        this.uiGridData = eval('(' + data.uiGridData + ')')
      })
    }
  },
  watch: {
    // 维持prop数据的向下传递性
    initData: {
      immediate: true,
      handler: function (now, old) {
        // 初始化from数据
        this.$nextTick(() => {
          this.handleResetData()
        })
        // 加载界面元素列表
        this.fnLoadResourceUi()
      }
    }
  }
}

</script>
<style scoped type="text/less" lang="less">
.gridRow{
  height: 240px;
  overflow: auto;
  .beautifyScrollbar();
}
</style>

<template>
  <div class="fit">
  <ta-tabs class="fit">
    <ta-button slot="tabBarExtraContent" @click="addCustomOrgModalVisible = true" type="primary">
      新增组织类别
    </ta-button>
    <ta-tab-pane tab="自定义组织类别列表">
      <ta-table :columns="customOrgTypeNameColumns" :dataSource="customOrgTypeNameData" rowKey="customOrgTypeNameId" style="padding-top: 10px">
        <ta-table-edit slot="customOrgTypeName" slot-scope="text, record" type="input" :row-editable="true" placeholder="请输入类别名称"></ta-table-edit>
        <ta-table-edit slot="customOrgTypeNameCode" slot-scope="text, record" type="input" :row-editable="true" placeholder="请输入类别自定义编码"></ta-table-edit>
        <ta-table-edit slot="customOrgTypeNameDesc" slot-scope="text, record" type="input" :row-editable="true" placeholder="请输入类别描述"></ta-table-edit>
        <ta-table-edit slot="effective" slot-scope="text, record" type="switch" trueText="有效" falseText="无效" :row-editable="true"></ta-table-edit>
        <ta-table-edit slot="action" slot-scope="text, record" :dataSource="customOrgTypeNameData" rowKey="customOrgTypeNameId" type="rowEdit" :beforeChange="beforeChange" @tableChange="changeTable" @rowDelete="fnDelete"></ta-table-edit>
      </ta-table>
    </ta-tab-pane>
  </ta-tabs>
  <ta-modal
    title="添加自定义组织"
    :visible="addCustomOrgModalVisible"
    :destroyOnClose="true"
    @cancel="addCustomOrgModalVisible = false">
    <ta-form :autoFormCreate="(form) => this.form = form">
      <ta-row>
        <ta-col :span="24">
          <ta-form-item
            label="类别名称"
            fieldDecoratorId="customOrgTypeName"
            :initValue="formInitValue.customOrgTypeName"
            :require="{message:'请输入类别名称!'}">
            <ta-input/>
          </ta-form-item>
        </ta-col>
      </ta-row>
      <ta-row>
        <ta-col :span="24">
          <ta-form-item
            label="类别自定义编码"
            fieldDecoratorId="customOrgTypeNameCode"
            :initValue="formInitValue.customOrgTypeNameCode"
            :require="{message:'请输入类别自定义编码!'}">
            <ta-input/>
          </ta-form-item>
        </ta-col>
      </ta-row>
      <ta-row>
        <ta-col :span="24">
          <ta-form-item
            label="类别描述"
            fieldDecoratorId="customOrgTypeNameDesc"
            :initValue="formInitValue.customOrgTypeNameDesc">
            <ta-input/>
          </ta-form-item>
        </ta-col>
      </ta-row>
      <ta-row>
        <ta-col :span="24">
          <ta-form-item
            label="有效标识"
            fieldDecoratorId="effective"
            :fieldDecoratorOptions="{initialValue: formInitValue.effective, valuePropName: 'checked'}">
            <ta-switch/>
          </ta-form-item>
        </ta-col>
      </ta-row>
    </ta-form>
    <template slot="footer">
      <ta-button @click="form.resetFields()">
        重置
      </ta-button>
      <ta-button key="submit" type="primary" @click="fnOnSave">
        保存
      </ta-button>
    </template>
  </ta-modal>
  </div>
</template>
<script>
  import $api from '../api/index'

  const customOrgTypeNameColumns = [
  {
    title: '类别名称',
    width: '20%',
    overflowTooltip: true,
    dataIndex: 'customOrgTypeName',
    scopedSlots: { customRender: 'customOrgTypeName' }
  },
  {
    title: '类别自定义编码',
    width: '23%',
    overflowTooltip: true,
    dataIndex: 'customOrgTypeNameCode',
    scopedSlots: { customRender: 'customOrgTypeNameCode' }
  },
  {
    title: '类别描述',
    width: '30%',
    overflowTooltip: true,
    dataIndex: 'customOrgTypeNameDesc',
    scopedSlots: { customRender: 'customOrgTypeNameDesc' }
  },
  {
    title: '有效标识',
    width: '12%',
    dataIndex: 'effective',
    scopedSlots: { customRender: 'effective' }
  },
  {
    title: '操作',
    width: '15%',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'addCustomOrgTypeName',
  data () {
    return {
      customOrgTypeNameColumns, // 自定义组织类别列属性
      customOrgTypeNameData: [], // 自定义组织名称类型数组
      formInitValue: { effective: true },
      addCustomOrgModalVisible: false
    }
  },
  mounted () {
    this.fnQueryAllCustomOrgTypeName()
  },
  methods: {
    // 查询所有自定义组织名称
    fnQueryAllCustomOrgTypeName () {
      $api.queryCustomOrgTypeNameByCondition(null, (data) => {
        const tableDate = data.data.customOrgTypeNameList
        tableDate.map(item => {
          item.effective = item.effective === '1'
        })
        this.customOrgTypeNameData = tableDate
      })
    },
    beforeChange ({ newData, record }, callback) {
      const { customOrgTypeName, customOrgTypeNameCode, customOrgTypeNameDesc, effective, customOrgTypeNameId } = Object.assign({}, record, newData)
      if (!customOrgTypeName || customOrgTypeName.trim() == '') {
        callback('自定义组织名称不能为空')
      } else {
        const param = {
          customOrgTypeName: customOrgTypeName,
          customOrgTypeNameCode: customOrgTypeNameCode,
          customOrgTypeNameDesc: customOrgTypeNameDesc,
          effective: effective ? '1' : '0'
        }
        if (!customOrgTypeNameId) {
          // 执行新增
          $api.addCustomOrgTypeName(param, (data) => {
            callback()
            this.$message.success('新增组织类别成功')
            this.fnQueryAllCustomOrgTypeName()
          })
        } else {
          param.customOrgTypeNameId = customOrgTypeNameId
          $api.updateCustomOrgTypeName(param, (data) => {
            callback()
            this.$message.success('修改组织类别成功')
            this.fnQueryAllCustomOrgTypeName()
          })
        }
      }
    },
    changeTable (dataSource) {
      const firstRow = dataSource[0]
      if (!firstRow.customOrgTypeName || firstRow.customOrgTypeName.trim() === '') {
        dataSource.splice(0, 1)
      }
      this.customOrgTypeNameData = dataSource
    },
    fnOnSave(){
      this.form.validateFieldsAndScroll((error) => {
        if (!error) {
          this.addCustomOrgModalVisible = false
          let effective = this.form.getFieldValue('effective') ? '1' : '0'
          let data = this.form.getFieldsValue()
          data.effective = effective
          $api.addCustomOrgTypeName(data, (data) => {
            this.$message.success('新增组织类别成功')
            this.fnQueryAllCustomOrgTypeName()
          })
        }
      })
    },
    // 点击删除自定义组织名称
    fnDelete (deleteId) {
      $api.deleteBatchCustomOrgTypeName({ customOrgTypeNameId: deleteId }, (data) => {
        this.$message.success('更新数据成功')
        // 从list中移除删除的数据
        this.customOrgTypeNameData = this.customOrgTypeNameData.filter(item => item.customOrgTypeNameId != deleteId)
      })
    }
  }
}
</script>

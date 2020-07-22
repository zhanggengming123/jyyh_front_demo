<template>
  <div id="app" class="fit">
    <ta-border-layout :layout="{left:'300px'}" :center-cfg="{layoutConStyle:{padding:0,border: 0}}">
      <div slot="left" class="fit">
        <ta-card :bordered="false" style="width: 100%" title="资源类别" :bodyStyle="{'padding':0}">
          <a v-for="(item, index) in selectData" :key="item.id" :value="item.id" @click="selectClick(item.id,index)">
            <div class="select-item" :class="{'active': item.id == selectCategory}"> {{item.name}}</div>
          </a>
        </ta-card>
      </div>
      <ta-border-layout :layout="{header:'70px'}" :showBorder="false" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}">
        <div slot="header" class="center-box">
          <ta-input-search v-model="param" placeholder="输入资源名称/自定义编码/所属系统" @search="queryAllCustomResource" enterButton="搜索" class="search-box"/>
        </div>
        <div slot="centerExtraContent" style="float: right">
          <ta-button @click="showCatagoryDrawer()" type="primary">新增授权对象类型</ta-button>
        </div>
        <ta-table
:columns="customResourceColumns"
                  :pagination='false'
                  rowKey="customResourceId"
                  defaultExpandAllRows
                  :indentSize=5
                  :scroll="{ y: '100%' }"
                  :dataSource="gridData"
        >
          <span slot="resourceName" slot-scope="text, record">
            <span :class="{'invalidStyle': record.effective == '0' }">{{record.resourceName}}</span>
          </span>
          <span slot="actions" slot-scope="text, record">
            <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
          </span>
        </ta-table>
      </ta-border-layout>
    </ta-border-layout>
    <ta-drawer
        :getContainer="()=>this.$el"
        :destroy-on-close="true" title="授权对象信息" width="500" placement="right" :closable="true" @close="visible = false" :visible="visible">
      <ta-form :autoFormCreate="(form)=>{this.form = form}">
        <ta-form-item
          label="资源ID"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          fieldDecoratorId="customResourceId"
          :fieldDecoratorOptions="{ initialValue: formData.customResourceId }"
          style="display: none;"
        >
          <ta-input/>
        </ta-form-item>
        <ta-form-item
          label="资源名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          fieldDecoratorId="resourceName"
          :fieldDecoratorOptions="{ initialValue: formData.resourceName, rules: [{ required: true, message: '请输入资源名称' },{max:450,message:'不能超过450个字符'}]}"
        >
          <ta-input placeholder="请输入资源名称"  />
        </ta-form-item>
        <ta-form-item
          label="自定义编码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          fieldDecoratorId="code"
          :fieldDecoratorOptions="{ initialValue: formData.code, rules: [{ required: true, message: '请输入自定义编码' },{max:100,message:'不能超过100个字符'},{pattern:new RegExp('^[a-z0-9]*$'),message:'输入格式错误'}]}"
        >
          <ta-input placeholder="请输入自定义编码" />
        </ta-form-item>
        <ta-form-item
          label="所属类别"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          fieldDecoratorId="resourceCategory"
          :fieldDecoratorOptions="{ initialValue: formData.resourceCategory, rules: [{ required: true, message: '请选择所属类别' }]}"
        >
          <ta-select allowClear placeholder="请选择所属类别" disabled>
            <ta-select-option v-for="item in selectData" :key="item.id">{{item.name}}</ta-select-option>
          </ta-select>
        </ta-form-item>
        <ta-form-item
          label="上级节点"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          fieldDecoratorId="parentId"
          :fieldDecoratorOptions="{ initialValue: formData.parentId, rules: [{ required: true, message: '请选择上级节点' }]}"
        >
          <ta-select allowClear placeholder="请选择上级节点"  :disabled="true">
            <ta-select-option v-for="item in selectParent" :key="item.id">{{item.name}}</ta-select-option>
          </ta-select>
        </ta-form-item>
        <ta-form-item
          label="自定义资源内容"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          fieldDecoratorId="resourceContent"
          :fieldDecoratorOptions="{ initialValue: formData.resourceContent }"
        >
          <ta-input placeholder="请输入自定义资源内容" />
        </ta-form-item>
        <ta-form-item
          label="所属系统"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          fieldDecoratorId="system"
          :fieldDecoratorOptions="{ initialValue: formData.system, rules: [{ required: true, message: '请选择所属系统' }]}"
        >
          <ta-select allowClear placeholder="请选择所属系统">
            <ta-select-option v-for="item in selectSystem" :key="item.sysCode">{{item.name}}</ta-select-option>
          </ta-select>
        </ta-form-item>
      </ta-form>
      <div slot="footer">
        <ta-button-group>
          <ta-button  @click="reSetForm()">重置</ta-button>
          <ta-button type="primary" @click="saveCustomResource">保存</ta-button>
        </ta-button-group>
      </div>
    </ta-drawer>
    <ta-drawer
        :getContainer="()=>this.$el"
        title="授权对象类型信息" width="500" placement="right" :closable="true" @close="categoryVisible = false; form1.resetFields(); formData1 = {}" :visible="categoryVisible" :get-container="setContainer">
      <ta-form :autoFormCreate="(form) => {this.form1 = form}">
        <ta-form-item
          label="类别ID"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          fieldDecoratorId="categoryId"
          :fieldDecoratorOptions="{ initialValue: formData1.categoryId }"
          style="display: none;"
        >
          <ta-input/>
        </ta-form-item>
        <ta-form-item
          label="类别名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          fieldDecoratorId="categoryName"
          :fieldDecoratorOptions="{initialValue: formData1.categoryName, rules: [{ required: true, message: '请输入类别名称' },{max:10,message:'不能超过10个字符'}]}"
        >
          <ta-input placeholder="请输入类别名称" />
        </ta-form-item>
        <ta-form-item
          label="类别编码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          fieldDecoratorId="code"
          :fieldDecoratorOptions="{initialValue: formData1.code, rules: [{ required: true, message: '请输入类别编码' },{max:100,message:'不能超过100个字符'}]}"
        >
          <ta-input placeholder="请输入类别编码" />
        </ta-form-item>
        <ta-form-item
          label="类别描述"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          fieldDecoratorId="categoryContent"
          :fieldDecoratorOptions="{initialValue: formData1.categoryContent, rules: [{ required: true, message: '请输入类别描述' },{max:1024,message:'不能超过1024个字符'}]}"
        >
          <ta-input placeholder="请输入类别描述" />
        </ta-form-item>
        <ta-form-item label='有效标识' :labelCol="labelCol" :wrapperCol="wrapperCol" fieldDecoratorId="effective" :fieldDecoratorOptions="{ valuePropName: 'checked', initialValue: formData1.effective}">
          <ta-switch @change='onchange' checkedChildren="有效" unCheckedChildren="无效" />
        </ta-form-item>
      </ta-form>
      <div slot="footer">
        <ta-button-group>
          <ta-button  @click="reSetForm()">重置</ta-button>
          <ta-button type="primary" @click="saveCatagory">保存</ta-button>
        </ta-button-group>
      </div>
    </ta-drawer>
  </div>
</template>
<script>
import $api from './api/index'
const gridData = []
const customResourceColumns = [
  { title: '资源名称', dataIndex: 'resourceName', key: 'resourceName', width: '30%', overflowTooltip: true, scopedSlots: { customRender: 'resourceName', }, },
  { title: '分类', dataIndex: 'categoryName', key: 'categoryName', align: 'center', width: '15%', overflowTooltip: true, },
  { title: '自定义编码', dataIndex: 'code', key: 'code', align: 'center', width: '15%', overflowTooltip: true, },
  { title: '自定义资源内容', dataIndex: 'resourceContent', key: 'resourceContent', align: 'center', width: '20%', overflowTooltip: true, },
  { title: '所属系统', dataIndex: 'systemName', key: 'systemName', align: 'center', width: '15%', overflowTooltip: true, },
  { title: '操作', key: 'actions', align: 'center', width: 205, scopedSlots: { customRender: 'actions', }, }
]
export default {
  name: 'app',
  data () {
    return {
      gridData, // 授权对象表格数据
      customResourceColumns, // 授权对象表格列
      operateMenu: [{
        name: '新增下级',
        disabled: (record) => {
          return record.effective == '0'
        },
        title: (record) => record.effective == '0' ? '禁用的顶级自定义授权类型不能新增下级' : '',
        onClick: (record) => {
          this.toAddResource(record)
        },
      }, {
        name: '编辑',
        disabled: record => record.effective == '0',
        title: (record) => record.effective == '0' ? '禁用的顶级自定义授权类型不能编辑' : '',
        onClick: (record) => {
          this.toUpdateResource(record)
        },
      }, {
        name: '删除',
        type: 'confirm',
        isShow: record => record.type == 'resource',
        confirmTitle: '确定删除该授权对象?',
        onOk: (record) => {
          this.toDeleteResource(record)
        },
      }, {
        name: '更多',
        type: 'more',
        isShow: record => record.type == 'category',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该账户?',
          onOk: (record) => {
            const values = {
              categoryId: record.customResourceId,
              categoryName: record.categoryName,
              code: record.code,
              categoryContent: record.categoryContent,
              effective: '1',
            }
            if (record.effective === '1') {
              this.$message.warn('该资源已经为启用状态')
              return
            }
            $api.updateTaResourceCategoryByCategoryId(values, (data) => {
              this.$message.success('启用成功')
              this.queryALLTaCustomOrgCategory()
              this.selectClick(this.selectCategory)
              this.queryAllCustomResourcePatent()
            })
          },
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该账户?',
          onOk: (record) => {
            const values = {
              categoryId: record.customResourceId,
              categoryName: record.categoryName,
              code: record.code,
              categoryContent: record.categoryContent,
              effective: '0',
            }
            if (record.effective === '0') {
              this.$message.warn('该资源已经为禁用状态')
              return
            }
            $api.updateTaResourceCategoryByCategoryId(values, (data) => {
              this.$message.success('禁用成功')
              this.queryALLTaCustomOrgCategory()
              this.selectClick(this.selectCategory)
              this.queryAllCustomResourcePatent()
            })
          },
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该用户?',
          onOk: (record) => {
            this.toDeleteResource(record)
          },
        }],
      }],
      selectData: [], // 分类列表 的下拉数据
      selectSystem: [],
      selectParent: [],
      selectCategory: '', // 选中类别
      param: '', // 输入框查询参数
      visible: false, //   显示标识
      categoryVisible: false, // 授权对象类型显示标识
      wrapperCol: { span: 17, },
      labelCol: { span: 7, },
      clickData: {},
      form: null,
      form1: null,
      formData: {},
      formData1: {},
    }
  },
  mounted () {
    this.queryALLTaCustomOrgCategory(true)
    this.queryALLTaAccessSystem()
    this.queryAllCustomResourcePatent()
  },

  methods: {
    setContainer () {
      return this.$el.parentNode
    },
    // 查询类别
    queryALLTaCustomOrgCategory (firstTime) {
      $api.queryALLTaResourceCategory({}, (data) => {
        const customResourceList = data.data.customResourceList
        this.selectData = []
        if (customResourceList.length) {
          customResourceList.forEach((item) => {
            this.selectData.push({
              id: item.categoryId,
              name: item.categoryName,
            })
          })
          if (firstTime) {
            this.selectCategory = this.selectData[0].id
            this.selectClick(this.selectData[0].id)
          }
        }
      })
    },
    // 选择资源类别
    selectClick (id) {
      this.selectCategory = id
      if (id) {
        $api.queryALLTaCustomResourceTreeByCategoryId({ categoryId: id, param: this.param, }, (data) => {
          this.gridData = data.data.customResourceTree
        })
      } else {
        this.queryAllCustomResource()
      }
    },
    // 查询系统列表
    queryALLTaAccessSystem () {
      $api.queryAccessSystemByParam({}, (data) => {
        const systems = data.data.list
        if (systems && systems.length) {
          systems.forEach(item => {
            this.selectSystem.push({
              sysCode: item.sysCode,
              name: item.sysName,
            })
          })
        }
      })
    },
    // 查询上级节点
    queryAllCustomResourcePatent () {
      $api.queryALLTaCustomResourceParent({}, (data) => {
        const parentList = data.data.parentList
        this.selectParent = []
        if (parentList.length) {
          parentList.forEach((item) => {
            this.selectParent.push({
              id: item.customResourceId,
              name: item.resourceName,
            })
          })
        }
      })
    },
    reSetForm () {
      const record = this.clickData
      if (this.visible) {
        this.form.resetFields()
        if (!this.form.getFieldValue('customResourceId')) {
          this.formData = {
            parentId: record.customResourceId,
            resourceCategory: record.type == 'resource' ? record.resourceCategory : record.customResourceId,
          }
        }
      }
      if (this.categoryVisible) {
        this.form1.resetFields()
      }
    },
    // 授权类型 信息保存  categoryId
    saveCatagory () {
      const record = this.clickData
      if (record.type) {
        this.updateCategory()
      } else {
        this.addCategory()
      }
    },
    // 显示授权类型  窗口
    showCatagoryDrawer () {
      this.categoryVisible = true
      this.clickData = {}
      this.formData1 = {
        categoryId: '',
        categoryName: '',
        categoryContent: '',
        code: '',
        effective: true,
      }
      this.reSetForm()
    },
    // 新增授权对象类型
    addCategory () {
      this.form1.validateFields((err, values) => {
        if (!err) {
          values.effective = this.form1.getFieldValue('effective') ? '1' : '0'
          $api.addTaResourceCategory(values, (data) => {
            this.$message.success('新增对象类型成功')
            this.queryALLTaCustomOrgCategory()
            this.selectCategory = data.data.categoryId
            this.selectClick(this.selectCategory)
            this.queryAllCustomResourcePatent()
            this.categoryVisible = false
          })
        }
      })
    },
    // 修改授权对象类型
    updateCategory () {
      this.form1.validateFields((err, values) => {
        if (!err) {
          if (!this.form1.getFieldValue('categoryId')) {
            this.$message.warn('授权对象类型ID不能为空')
            return
          }
          values.effective = this.form1.getFieldValue('effective') ? '1' : '0'
          $api.updateTaResourceCategoryByCategoryId(values, (data) => {
            this.$message.success('修改成功')
            this.queryALLTaCustomOrgCategory()
            this.selectClick(this.selectCategory)
            this.queryAllCustomResourcePatent()
            this.categoryVisible = false
          })
        }
      })
    },
    onchange (checked) {
      this.form1.setFieldsValue({ effective: checked == true ? '1' : '0', })
    },
    // 到新增资源
    toAddResource (record) {
      this.clickData = record
      this.visible = true
      this.formData = {
        parentId: record.customResourceId,
        resourceCategory: record.type == 'resource' ? record.resourceCategory : record.customResourceId,
      }
    },
    // 新增/修改保存
    saveCustomResource () {
      if (!this.form.getFieldValue('customResourceId')) {
        this.addResource()
      } else {
        this.updateResource()
      }
    },
    // 保存
    addResource () {
      this.form.validateFields((err, values) => {
        if (!err) {
          $api.addTaCustomResource(values, (data) => {
            this.$message.success('保存成功')
            this.queryALLTaCustomOrgCategory()
            this.selectClick(this.selectCategory)
            this.queryAllCustomResourcePatent()
            this.form.resetFields()
            this.visible = false
          })
        }
      })
    },
    // 修改自定义资源
    updateResource () {
      this.form.validateFields((err, values) => {
        if (!err) {
          $api.updateTaCustomResourceByCustomResourceId(values, (data) => {
            this.$message.success('修改成功')
            this.queryALLTaCustomOrgCategory()
            this.selectClick(this.selectCategory)
            this.form.resetFields()
            this.queryAllCustomResourcePatent()
            this.visible = false
          })
        }
      })
    },
    // 到删除资源
    toDeleteResource (record) {
      if (record.type == 'resource') {
        this.deleteResource(record)
      } else if (record.type == 'category') {
        this.deleteCategory(record)
      }
    },
    // 删除自定义资源
    deleteResource (data) {
      $api.deleteTaCustomResourceByCustomResourceId({ customResourceId: data.customResourceId, }, (data) => {
        this.$message.success('删除成功')
        this.queryALLTaCustomOrgCategory()
        this.selectClick(this.selectCategory)
        this.queryAllCustomResourcePatent()
      })
    },
    // 删除自定义资源类别
    deleteCategory (data) {
      $api.deleteTaResourceCategoryByCategoryId({ categoryId: data.customResourceId, }, (data) => {
        this.$message.success('删除成功')
        this.queryALLTaCustomOrgCategory(true)
        this.queryAllCustomResourcePatent()
        this.gridData = []
      })
    },
    // 到修改资源
    toUpdateResource (record) {
      this.clickData = record
      // 修改授权对象 信息
      const { type, customResourceId, resourceCategory, resourceName, parentId, resourceContent, code, effective, system, categoryContent, } = record
      if (type == 'resource') {
        this.visible = true
        this.formData = {
          customResourceId: customResourceId,
          resourceCategory: resourceCategory,
          resourceName: resourceName,
          parentId: parentId,
          resourceContent: resourceContent,
          code: code,
          effective: effective,
          system: system,
        }
      } else if (type == 'category') { //  修改授权对象类型信息
        this.categoryVisible = true
        this.formData1 = {
          categoryId: customResourceId,
          categoryName: resourceName,
          categoryContent: categoryContent,
          code: code,
          effective: effective == '1',
        }
        this.form1.resetFields()
      }
    },
    // 根据参数查询授权对象所有的数据
    queryAllCustomResource () {
      const paramObj = { param: this.param, selectCategory: this.selectCategory, }
      $api.queryALLTaCustomResourceTree(paramObj, (data) => {
        this.gridData = data.data.customResourceTree
      })
    },
  },
}
</script>
<style scoped type="text/less" lang="less">
  .select-item { width: 100%; height: 50px; line-height: 50px; padding-left: 24px;
    &.active { background-color: #fafafa; color: @primary-color; border-right: 6px solid @primary-color; }
  }
  .search-box { width: 340px; line-height: 42px; }
  .center-box { text-align:center; overflow: hidden; }
  .invalidStyle {
    color: @normal-color;
    &:hover {
      color: @normal-color;
    }
    cursor: not-allowed;
  }
</style>

<template>
  <div>
    <ta-drawer :title="editType == '1'? '编辑站点':'新增站点'" width="600" placement="right" :closable="true" @close="closeEdit" :visible="visible" destroyOnClose>
      <!--****************************步骤条**************************************-->
      <div>
        <ta-steps progressDot :current="currentPage">
          <ta-step title="站点基本信息"/>
          <ta-step title="高级信息"/>
          <ta-step title="服务器配置"/>
          <ta-step title="完成"/>
        </ta-steps>
      </div>
      <ta-form :autoFormCreate="(form)=>{this.form = form}">
        <template v-if="form">
          <!--****************************站点基本信息**************************************-->
          <div style="margin: 30px" v-show=drawerVisible[0]>
                <ta-form-item label='上级站点名称'
                              :labelCol="formItemLayout.labelCol"
                              :wrapperCol="formItemLayout.wrapperCol"
                              fieldDecoratorId="pSiteName"
                              :fieldDecoratorOptions="{initialValue: formData.pSiteName}">
                  <ta-input :disabled="true"/>
                </ta-form-item>
                <ta-form-item style="display: none;" label='站点idPath'
                              :labelCol="formItemLayout.labelCol"
                              :wrapperCol="formItemLayout.wrapperCol"
                              fieldDecoratorId="idPath"
                              :fieldDecoratorOptions="{initialValue: formData.idPath}">
                  <ta-input />
                </ta-form-item>
                <ta-form-item style="display: none;" label='站点id'
                              :labelCol="formItemLayout.labelCol"
                              :wrapperCol="formItemLayout.wrapperCol"
                              fieldDecoratorId="siteId"
                              :fieldDecoratorOptions="{initialValue: formData.siteId}">
                  <ta-input />
                </ta-form-item>
                <ta-form-item label='站点名称'
                              :labelCol="formItemLayout.labelCol"
                              :wrapperCol="formItemLayout.wrapperCol"
                              fieldDecoratorId="siteName"
                              :fieldDecoratorOptions="{ rules: [{ required: true, message: '站点名称不能为空!' },{ max: 300, message: '站点名称超过限制长度!' }], initialValue:formData.siteName}">
                  <ta-input/>
                </ta-form-item>
                <ta-form-item label='域名'
                              :labelCol="formItemLayout.labelCol"
                              :wrapperCol="formItemLayout.wrapperCol"
                              fieldDecoratorId="siteDomain"
                              :fieldDecoratorOptions="{ rules: [{ max: 300, message: '域名超过限制长度!' }], initialValue:formData.siteDomain}">
                  <ta-input/>
                </ta-form-item>
                <ta-form-item label='可用标识'
                              :labelCol="formItemLayout.labelCol"
                              :wrapperCol="formItemLayout.wrapperCol"
                              fieldDecoratorId="effective" :fieldDecoratorOptions="{ valuePropName: 'checked', initialValue: formData.effective }">
                  <ta-switch  checkedChildren="有效" unCheckedChildren="无效"/>
                </ta-form-item>
                <ta-form-item label='站点类型'
                              :labelCol="formItemLayout.labelCol"
                              :wrapperCol="formItemLayout.wrapperCol"
                              fieldDecoratorId="siteType"
                              :fieldDecoratorOptions="{rules: [{ message: '请选择对应站点类型' },{ required: true, message: '请选择站点类型' }], initialValue: formData.siteType}">
                  <ta-radio-group buttonStyle="solid">
                    <ta-radio-button v-for="item in CollectionData('SITETYPE')" :value="item.value"  :key="item.value">{{item.label}}</ta-radio-button>
                  </ta-radio-group>
                </ta-form-item>
                <ta-form-item label='站点描述'
                              :labelCol="formItemLayout.labelCol"
                              :wrapperCol="formItemLayout.wrapperCol"
                              fieldDecoratorId="siteDesc"
                              :fieldDecoratorOptions="{ rules: [{ max: 3000, message: '站点描述超过限制长度!' }], initialValue:formData.siteDesc}">
                  <ta-textarea />
                </ta-form-item>
          </div>
          <!--****************************高级信息**************************************-->
          <div style="margin: 30px" v-show=drawerVisible[1]>
            <ta-form-item label='高级信息'
                          :labelCol="formItemLayout.labelCol"
                          :wrapperCol="formItemLayout.wrapperCol"
                          fieldDecoratorId="big"
                          :fieldDecoratorOptions="{ initialValue:formData.big}">
              <ta-input/>
            </ta-form-item>
          </div>
          <!--****************************服务器配置**************************************-->
          <div style="margin: 30px" v-show=drawerVisible[2]>
            <ta-form-item label='服务器类型'
                          :labelCol="formItemLayout.labelCol"
                          :wrapperCol="formItemLayout.wrapperCol"
                          fieldDecoratorId="serverType">
            <ta-select >
              <ta-select-option v-for="item in CollectionData('SERVERTYPE')" :key='item.value' :value='item.value'>{{item.label}}</ta-select-option>
            </ta-select>
          </ta-form-item>
            <div style="margin-left: 35px;">
              <ta-transfer
              :dataSource="mockData"
              :titles="['可选Server', '已选Server']"
              :targetKeys="targetKeys"
              :selectedKeys="selectedKeys"
              @change="handleChange"
              @selectChange="handleSelectChange"
              @scroll="handleScroll"
              :render="item=>item.title"
              :lazy=false
              :listStyle="{width: '45%',height: '300px'}"
              >
              </ta-transfer>
            </div>
          </div>
          <!--****************************完成**************************************-->
          <div style="margin: 30px" v-show=drawerVisible[3]>
          </div>
        </template>
      </ta-form>

      <div slot="footer">
        <ta-button type="primary" @click="up(this)" v-if="currentPage>0" >上一步</ta-button>
        <ta-button type="primary" @click="next(this)" v-if="currentPage<drawerVisible.length-1">下一步</ta-button>
        <ta-button type="primary" @click="saveSite()" v-if="currentPage==drawerVisible.length-1" :loading="loading">保存</ta-button>
        <!--<ta-button  @click="reset()">重置</ta-button>-->
      </div>

    </ta-drawer>
  </div>
</template>
<script>
import $api from '../api/index'

export default {
  name: 'addOrEditSite',
  props: ['visible', 'editType', 'rowData'],
  data () {
    // 假数据
    const mockData = []
    for (let i = 0; i < 20; i++) {
      mockData.push({
        key: i.toString(),
        title: `网厅Server${i + 1}`,
        description: `description of content${i + 1}`,
        disabled: false
      })
    }
    const targetKeys = mockData
      .filter(item => +item.key % 3 > 1)
      .map(item => item.key)

    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      form: null,
      formData: {},
      loading: false,
      isShow: false,
      defaultList: [],
      currentPage: 0,
      drawerVisible: [true, false, false, false],
      server: [],
      targetServer: [],
      mockData,
      targetKeys,
      selectedKeys: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.setValue()
      }
    }
  },
  methods: {
    // 设置值
    setValue () {
      const {parentId, idPath, siteId, siteName, siteDomain, effective, siteType, siteDesc} = this.rowData
      // editType = 0 新增，editType=1  编辑，editType=2  新增下级
      if (this.editType == '0') { // 新增
        this.formData = {
          effective: true,
          idPath: '',
          pSiteName: '',
          siteType: '0'
        }
      } else if (this.editType == '1') { // 编辑
        this.formData = {
          pSiteName: parentId,
          idPath: idPath,
          siteId: siteId,
          siteName: siteName,
          siteDomain: siteDomain,
          effective: effective == '1',
          siteType: siteType,
          siteDesc: siteDesc
        }
      } else { // 新增下级
        this.formData = {
          effective: true,
          idPath: idPath,
          pSiteName: siteName,
          siteType: '0'
        }
      }
    },

    // 重置
    reset () {
      this.form.resetFields()
    },

    // 上一步
    up () {
      if (this.currentPage > 0) {
        this.currentPage = this.currentPage - 1
        let tempArray = [false, false, false, false]
        tempArray[this.currentPage] = true
        this.drawerVisible = tempArray
      }
    },

    // 下一步
    next () {
      if (this.currentPage < 3) {
        this.currentPage = this.currentPage + 1
        let tempArray = [false, false, false, false]
        tempArray[this.currentPage] = true
        this.drawerVisible = tempArray
      }
    },

    // 保存
    saveSite: function () {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.loading = true
          values.effective = values.effective ? '1' : '0'
          values.editType = this.editType
          if (this.editType == 1) {
            values.parentId = this.rowData.parentId
          } else {
            values.parentId = this.rowData.siteId
          }
          $api.addOrEditSite(values, (data) => {
            this.loading = false
            if (data.serviceSuccess) {
              if (this.editType == '0') { // 新增
                let newData = data.data.result
                this.showConfirm(0, this.rowData, newData)
              } else if (this.editType == '1') { // 编辑
                this.$message.success('修改成功')
                this.closeEdit()
                this.$emit('addSuccess', 1, this.rowData, values)
              } else if (this.editType == '2') { // 添加下级
                let newData = data.data.result
                this.showConfirm(2, this.rowData, newData)
              }
            }
          })
        }
      })
    },

    // 提示
    showConfirm (type, pRecords, newData) {
      this.$confirm({
        title: '添加站点成功',
        content: '保存成功。是否继续新增站点?',
        onOk: () => {
          this.form.resetFields()
          this.currentPage = 0
          this.drawerVisible = [true, false, false, false]
          this.$emit('addSuccess', type, pRecords, newData)
        },
        onCancel: () => {
          this.closeEdit()
          this.$emit('addSuccess', type, pRecords, newData)
        }
      })
    },

    // 关闭
    closeEdit () {
      this.$emit('close')
      this.loading = false
      this.form.resetFields()
      this.formData = {}
      this.currentPage = 0
      this.drawerVisible = [true, false, false, false]
    },

    // 穿梭框改变事件
    handleChange (nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys
    },
    // 穿梭框选择事件
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    // 穿梭框滚动事件
    handleScroll (direction, e) {
    }
  }
}
</script>

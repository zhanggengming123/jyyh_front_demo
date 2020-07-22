<template>
  <!--右侧弹出框添加修改组织信息-->
  <ta-drawer   :getContainer="setContainer" :title="editType == '1'? '添加组织机构':'编辑组织机构'" width="550" placement="right" :closable="true" @close="closeEdit" :visible="visible" destroyOnClose>
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <template v-if="form">
        <taContainerMask :show="editLoading"></taContainerMask>
        <template v-for="formSetting in formNormalSettings">
          <renderFormItem :key="formSetting.id" :formSetting="formSetting"  :renderType="renderType" :renderProp="renderProp">
            <ta-cascader v-if="formSetting.id == 'areaValue'" url="org/orguser/areaManagementRestService/queryAreaByAsync" treeId="areaList" :options.sync="areaOptions" expandTrigger="hover" changeOnSelect :fieldNames="{ label: 'areaName',value: 'areaId',children: 'children'}" placeholder="请选择行政区域"  style="width: 100%"/>
            <ta-switch v-else-if="formSetting.id == 'effective'" checkedChildren="有效" unCheckedChildren="无效"/>
            <ta-user-input v-else-if="formSetting.id == 'orgManager'" selectTitle="选择负责人" :orgLoadFn="handleLoadOrgNode" :userLoadFn="handleQueryUserList" :userSelectCall="getOrgManagerName"></ta-user-input>
            <ta-user-input v-else-if="formSetting.id == 'contacts'" selectTitle="选择联系人" :orgLoadFn="handleLoadOrgNode" :userLoadFn="handleQueryUserList" :userSelectCall="getContactsName"></ta-user-input>
            <template v-else-if="formSetting.id == 'tags'" v-for="tag in tags">
              <ta-tag :key="tag.tagId" @click="tagClick(tag.tagId)" :class="{'tag-active': selectedTags.indexOf(tag.tagId) > -1}" class="tag-select">
                {{tag.tagName}}<ta-icon type="check" v-if="selectedTags.indexOf(tag.tagId) > -1" style="margin-left: 5px;" />
              </ta-tag>
            </template>
          </renderFormItem>
        </template>
        <ta-collapse :bordered="false" v-if="formMoreSettings.length > 0">
          <ta-collapse-panel header="更多组织信息" key="1" style="border:none">
            <template v-for="formSetting in formMoreSettings">
              <renderFormItem :key="formSetting.id" :formSetting="formSetting" :renderType="renderType" :renderProp="renderProp">
                <ta-cascader v-if="formSetting.id == 'areaValue'" url="org/orguser/areaManagementRestService/queryAreaByAsync" treeId="areaList" :options.sync="areaOptions" expandTrigger="hover" changeOnSelect :fieldNames="{ label: 'areaName',value: 'areaId',children: 'children'}" placeholder="请选择行政区域" style="width: 100%"/>
                <ta-switch v-else-if="formSetting.id == 'effective'" checkedChildren="有效" unCheckedChildren="无效"/>
                <ta-user-input v-else-if="formSetting.id == 'orgManager'" selectTitle="选择负责人" :orgLoadFn="handleLoadOrgNode" :userLoadFn="handleQueryUserList" :userSelectCall="getOrgManagerName"></ta-user-input>
                <ta-user-input v-else-if="formSetting.id == 'contacts'" selectTitle="选择联系人" :orgLoadFn="handleLoadOrgNode" :userLoadFn="handleQueryUserList" :userSelectCall="getContactsName"></ta-user-input>
                <template v-else-if="formSetting.id == 'tags'" v-for="tag in tags">
                  <ta-tag :key="tag.tagId" @click="tagClick(tag.tagId)" :class="{'tag-active': selectedTags.indexOf(tag.tagId) > -1}" class="tag-select">
                    {{tag.tagName}}<ta-icon type="check" v-if="selectedTags.indexOf(tag.tagId) > -1" style="margin-left: 5px;" />
                  </ta-tag>
                </template>
              </renderFormItem>
            </template>
          </ta-collapse-panel>
        </ta-collapse>
      </template>
    </ta-form>
    <div slot="footer">
      <ta-button-group>
        <ta-button @click="reset()">重置</ta-button>
        <ta-button type="primary" @click="saveOrg()" :loading="loading">保存</ta-button>
      </ta-button-group>
    </div>
  </ta-drawer>
</template>
<script>
import $api from '../api/index'
import renderFormItem from '@projectCommon/components/renderFormItem'
import mixins from '../mixins'

export default {
  name: 'editOrg',
  props: ['visible', 'editType', 'rowData', 'tags'],
  components: { renderFormItem },
  mixins: [mixins],
  data () {
    return {
      form: null,
      formData: {},
      initTags: [],
      selectedTags: [],
      editLoading: false,
      loading: false,
      defaultProps: {
        listKey: 'userId',
        listTitle: 'name',
        listSubTitle: 'mobile',
        listDescription: 'namePath'
      },
      isShow: false,
      userListData: [],
      areaOptions: [],
      defaultList: [],
      initForm: {}
    }
  },
  mounted () {
    this.setValue()
  },
  computed: {
    renderType () {
      return this.editType == '2' ? 'EDIT' : 'ADD'
    },
    renderProp () {
      return {
        authRequest: (param, resolve) => {
          const { orgId } = this.rowData
          $api.authRequestForOrgInfo({
            ...param,
            orgId
          }, (data) => { resolve(data.orgInfo[param.inputKey]) })
        }
      }
    }
  },
  methods: {
    setContainer () {
      return this.$el.parentNode
    },
    setValue () {
      // type = 1 新增，type=2  编辑
      this.editLoading = true
      this.clearForm()
      // 抽屉展开再请求，防止设值时页面抖动
      setTimeout(() => { this.queryOrg({ orgId: this.rowData.orgId, type: '2' }) }, 300)
    },
    // 初始化查询所有 组织机构列表
    queryOrg (obj) {
      $api.queryTaOrgByOrgId(obj, (result) => {
        const { orgTags, pOrgName, areaValue } = result.data.taOrgInfoVo
        this.formData = {}
        const { parentId, orgManager, effective, contacts, orgName, orgId, orgType, customNo, orgCode, tel, address, orderNo, tagIds } = result.data.taOrgInfoVo.org
        if (this.editType == '1') {
          this.formData = {
            porgId: orgId,
            pOrgName: orgName,
            orgType: '02',
            effective: true,
            orderNo: '0',
            areaValue: areaValue
          }
        } else if (this.editType == '2') {
          this.initTags = orgTags
          this.selectedTags = orgTags

          const orgData = result.data.taOrgInfoVo.org
          Object.keys(orgData).forEach(field => {
            this.formData[field] = orgData[field] || ''
          })
          Object.assign(this.formData, {
            porgId: parentId,
            pOrgName: pOrgName,
            effective: effective == '1',
            areaValue: areaValue,
            orderNo: orderNo.toString(),
            tagIds: tagIds || '',
            customNo: customNo || '',
            orgCode: orgCode || '',
            orgManager: orgManager || '',
            contacts: contacts || '',
            tel: tel || '',
            address: address || ''
          })
          this.initForm = { ...this.formData }
        }

        this.buildForm(this.formData)
        this.editLoading = false
      })
    },
    // 组织机构新增、修改时  选择的组织标签
    tagClick (tagid) {
      const { selectedTags } = this
      const checked = selectedTags.some(t => t == tagid)
      this.selectedTags = checked ? selectedTags.filter(t => t !== tagid) : [...selectedTags, tagid]
    },
    reset () {
      this.form.resetFields()
      this.selectedTags = this.initTags
    },
    saveOrg () {
      // this.loading = true
      const values = this.form.getFieldsValue(), areaName = ''
      values.tagIds = this.selectedTags.toString()
      values.area = values.areaValue[values.areaValue.length - 1]
      values.spell = this.Base.pinyin.getCamelChars(values.orgName || '').toUpperCase()
      /* 判断提交时有无改变 */
      const tempValue = { ...values }, keys = Object.keys(tempValue), { initForm } = this
      let editFlag = false
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] == 'areaValue' && tempValue[keys[i]].toString() != initForm[keys[i]].toString()) {
          editFlag = true; break
        }
        if (keys[i] != 'area' && keys[i] != 'areaValue' && tempValue[keys[i]] != initForm[keys[i]]) {
          editFlag = true; break
        }
      }
      if (editFlag) {
        values.editType = this.editType
        values.parentId = values.porgId
        values.effective = values.effective ? '1' : '0'
        $api.addOrUpdateTaOrg(this.form, values, (data) => {
          this.loading = false
          if (data.serviceSuccess) {
            if (this.editType == '1') {
              let newData = data.data.addedOrg
              newData = Object.assign({}, values, newData)
              this.showConfirm(this.rowData, newData)
            } else {
              this.$message.success('修改成功')
              this.$emit('addSuccess', this.rowData, values)
              this.closeEdit()
            }
          }
        })
      } else {
        this.$message.warning('没有需要保存的修改')
      }
    },
    // 提示
    showConfirm (pRecords, newData) {
      this.$confirm({
        title: '添加组织机构成功',
        content: '保存成功。是否继续新增组织?',
        onOk: () => {
          this.form.resetFields()
          this.$emit('addSuccess', pRecords, newData)
          this.queryOrg({ orgId: pRecords.orgId, type: '2' })
        },
        onCancel: () => {
          this.closeEdit()
          this.$emit('addSuccess', pRecords, newData)
        }
      })
    },
    closeEdit () {
      this.$emit('close')
      this.editLoading = false
      this.loading = false
      this.form.resetFields()
      this.formData = {}
      this.selectedTags = []
      this.initTags = []
      this.contacts = ''
      this.orgManager = ''
    },
    /* 人员选择相关 */
    handleLoadOrgNode (node, resolve) {
      const nodeOrgId = (node.data && node.data.orgId) || ''
      $api.loadOrgTree(nodeOrgId, (data) => {
        resolve(data.orgTreeData)
      })
    },
    handleQueryUserList ({ orgId, userId, includeChild, pageSize, pageNum, searchVal, searchType, searchParam }, resolve) {
      $api.queryUserList({ orgId, userId, includeChild, pageSize, pageNum, searchVal, searchType, searchParam }, (data) => {
        resolve(data.userList.list)
      })
    },
    getOrgManagerName (data) {
      const { userId, name, address, mobile } = data
      this.form.setFieldsValue({
        orgManager: userId
      })
    },
    getContactsName (data) {
      const { userId, name, address, mobile } = data
      this.form.setFieldsValue({
        contacts: userId
      })
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .tag-select { border-color: @primary-color; color: @primary-color; .user-select() }
  .tag-active { background-color: @primary-color; color: #fff; }
</style>

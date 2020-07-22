<template>
  <ta-search-panel :form="searchForm" id="demo" :width="800" @search="onSearch">
    <ta-button slot="target">高级搜索</ta-button>
    <div slot="formPanel">
      <ta-form :autoFormCreate="(form)=>{this.searchForm = form}" :form-layout="true" :col="2">
        <template v-if="searchForm">
          <ta-form-item
            label='所属组织'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="userOrgIds"
          >
            <ta-cascader
              url="org/orguser/orgManagementRestService/getOrgByAsync"
              treeId="orgTreeData"
              :options.sync="options"
              expandTrigger="hover"
              changeOnSelect
              :fieldNames="{ label: 'orgName', value: 'orgId', children: 'children' }"
              placeholder="请选择人员的所属组织" />
          </ta-form-item>
          <ta-form-item
            label='包含子组织'
            :colon="false"
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="showChildUser"
            :fieldDecoratorOptions="{initialValue: true, valuePropName: 'checked'}"
          >
            <ta-checkbox></ta-checkbox>
          </ta-form-item>
          <ta-form-item
            label='姓名'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="name1"
          >
            <ta-user-input selectTitle="选择姓名" :orgLoadFn="handleLoadOrgNode" :userLoadFn="handleQueryUserList" :userSelectCall="(data) => {selectName = data.name}"></ta-user-input>
          </ta-form-item>
          <ta-form-item
            label='账号'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="loginId1"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label='性别'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="sex"
          >
            <ta-radio-group>
              <ta-radio v-for="item in CollectionData('SEX')" :key='item.value' :value='item.value'>{{item.label}}</ta-radio>
            </ta-radio-group>
            <a @click="searchForm.resetFields('sex')">清除选项</a>
          </ta-form-item>
          <ta-form-item
            label='工号'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="jobnumber"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label='证件类型'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="idCardType"
          >
            <ta-select mode="multiple" >
              <ta-select-option v-for="item in CollectionData('IDCARDTYPE')" :key='item.value' :value='item.value'>{{item.label}}</ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item
            label='证件号'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="idCardNo1"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label='手机号'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="mobile1"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label='学历'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="education"
          >
            <ta-select>
              <ta-select-option v-for="item in CollectionData('EDUCATION')" :key='item.value' :value='item.value'>{{item.label}}</ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item
            label='邮箱地址'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="email"
            :fieldDecoratorOptions="{ rules: [{ type: 'email', message: '请输入正确的邮箱地址' }]}"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label='邮政编码'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="zipCode"
            :fieldDecoratorOptions="{rules: [{ pattern: /^[0-9]{6}$/, message: '请输入正确的邮政编码' }]}"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label='工作单位'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="workplace"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label='创建时间'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="createtime"
          >
            <ta-range-picker style="width: 100%"/>
          </ta-form-item>
          <ta-form-item
            label='是否锁定'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="islock"
          >
            <ta-select mode="multiple" >
              <ta-select-option value="0">未锁定</ta-select-option>
              <ta-select-option value="1">已锁定</ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item
            label='是否有效'
            :labelCol="formItemLayout.labelCol"
            :wrapperCol="formItemLayout.wrapperCol"
            fieldDecoratorId="userEffective"
          >
            <ta-select mode="multiple" style="width: 100%">
              <ta-select-option v-for="item in CollectionData('EFFECTIVE')" :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
            </ta-select>
          </ta-form-item>
        </template>
      </ta-form>
    </div>
  </ta-search-panel>
</template>
<script>
import $api from '../api/index'
export default {
  name: 'search-panel',
  props: {
    result: {
      type: Object,
      default () {
        return { }
      }
    }
  },
  data () {
    return {
      searchForm: null,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      userOrgIds: [],
      options: [],
      selectName: ''
    }
  },
  methods: {
    onSearch (val) {
      if (val.createtime && val.createtime.length) {
        val.createtimeMin = val.createtime[0] + ' 00:00:00'
        val.createtimeMax = val.createtime[1] + ' 23:59:59'
        delete val.createtime
      }
      if (val.mobile1) { val.mobile = val.mobile1; delete val.mobile1 }
      if (val.name1) { val.name = this.selectName; delete val.name1 }
      if (val.idCardNo1) { val.idCardNo = val.idCardNo1; delete val.idCardNo1 }
      if (val.loginId1) { val.loginId = val.loginId1; delete val.loginId1 }
      if (val.userOrgIds) {
        val.orgId = val.userOrgIds[val.userOrgIds.length - 1]
      }
      this.$emit('dealSearchPanelResult', val)
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
    }
  }
}
</script>

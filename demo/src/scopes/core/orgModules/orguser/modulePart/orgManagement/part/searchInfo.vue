<template>
  <ta-search-panel :form="form1" id='form1' :width="800" @search="advancedQuery">
    <ta-button slot="target">高级搜索</ta-button>
    <div slot="formPanel">
      <ta-form :autoFormCreate="(form)=>{this.form1 = form}">
        <template v-if="form1">
          <ta-row>
            <ta-col :span="12">
              <ta-form-item
                label='所属行政区'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
                fieldDecoratorId="areaParam"
              >
                <ta-cascader
                  url="org/orguser/areaManagementRestService/queryAreaByAsync"
                  treeId="areaList"
                  :options.sync="areaOptions"
                  expandTrigger="hover"
                  changeOnSelect
                  :fieldNames="{ label: 'areaName',value: 'areaId',children: 'children'}"
                  placeholder="请选择行政区域"
                  style="width: 100%"/>
              </ta-form-item>
            </ta-col>
            <ta-col :span="12">
              <ta-form-item
                label='有效标识'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
                fieldDecoratorId="effectiveParam"
              >
                <ta-select mode="multiple"   style="width: 100%"  placeholder="请选择有效标识">
                  <ta-select-option v-for="item in  CollectionData('EFFECTIVE')" :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
                </ta-select>
              </ta-form-item>
            </ta-col>
            <ta-col :span="12">
              <ta-form-item
                label='组织类型'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
                fieldDecoratorId="orgTypeParam"
              >
                <ta-select mode="multiple"   style="width: 100%"  placeholder="请选择组织类型">
                  <ta-select-option v-for="item in CollectionData('ORGTYPE')" :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
                </ta-select>
              </ta-form-item>
            </ta-col>
            <ta-col :span="12">
              <ta-form-item
                label='组织代码'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
                fieldDecoratorId="orgCode"
              >
                <ta-input />
              </ta-form-item>
            </ta-col>
            <ta-col :span="12">
              <ta-form-item
                label='负责人'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
                fieldDecoratorId="orgManager"
              >
                <ta-user-input selectTitle="选择负责人" :orgLoadFn="handleLoadOrgNode" :userLoadFn="handleQueryUserList" :userSelectCall="() => {}"></ta-user-input>
              </ta-form-item>
            </ta-col>
            <ta-col :span="12">
              <ta-form-item
                label='联系人'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
                fieldDecoratorId="contacts"
              >
                <ta-user-input selectTitle="选择联系人" :orgLoadFn="handleLoadOrgNode" :userLoadFn="handleQueryUserList" :userSelectCall="() => {}"></ta-user-input>
              </ta-form-item>
            </ta-col>
            <ta-col :span="12">
              <ta-form-item
                label='联系电话'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
                fieldDecoratorId="tel"
              >
                <ta-input />
              </ta-form-item>
            </ta-col>
            <ta-col :span="12">
              <ta-form-item
                label='联系地址'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
                fieldDecoratorId="address"
              >
                <ta-input />
              </ta-form-item>
            </ta-col>
            <ta-col :span="12">
              <ta-form-item
                label='创建时间'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
                fieldDecoratorId="createTime"
              >
                <ta-range-picker />
              </ta-form-item>
            </ta-col>
          </ta-row>
        </template>
      </ta-form>
    </div>
  </ta-search-panel>
</template>
<script>
import moment from 'moment'
import $api from '../api/index'
export default {
  name: 'searchInfo',
  data () {
    return {
      form1: null,
      formItemLayout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
      areaOptions: []
    }
  },
  methods: {
    moment,
    // 通过高级查询框触发查询
    advancedQuery (data) {
      if (data.areaParam) {
        data.areaParam = data.areaParam[data.areaParam.length - 1]
      }
      if (data.orgTypeParam) { data.orgTypeParam = data.orgTypeParam.toString() }
      if (data.effectiveParam) { data.effectiveParam = data.effectiveParam.toString() }

      if (data.createTime && data.createTime.length) {
        data.createTimeMin = data.createTime[0] + ' 00:00:00'
        data.createTimeMax = data.createTime[1] + ' 23:59:59'
        delete data.createTime
      }
      const hasData = Object.keys(data).some(key => data[key])
      data.needSearch = hasData ? '1' : '0'
      this.$emit('search', data)
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

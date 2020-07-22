<template>
  <div class="center-box">
    <div class="center-item">
      <ta-input-search v-model="searchParam" placeholder="根据名称、自定义编码查询" @search="handleSearch" enterButton="查询" class="search-box"/>
    </div>
    <div class="center-item">
      <ta-search-panel :form="form" id='form' :width="800" :height="330" @search="handleAdvancedQueryResourceList">
        <ta-button slot="target">高级搜索</ta-button>
        <template slot="formPanel">
          <ta-form :autoFormCreate="(form)=>{this.form = form}" :layout="formLayout">
            <template v-if="form">
              <ta-row>
                <ta-col :span="row.col">
                  <ta-form-item label='功能名称'
                                :labelCol="formItemLayout.labelCol"
                                :wrapperCol="formItemLayout.wrapperCol"
                                fieldDecoratorId="advanceName">
                    <ta-input placeholder="请输入功能名称"></ta-input>
                  </ta-form-item>
                </ta-col>
                <ta-col :span="row.col">
                  <ta-form-item label='自定义编码'
                                :labelCol="formItemLayout.labelCol"
                                :wrapperCol="formItemLayout.wrapperCol"
                                fieldDecoratorId="advanceCode">
                    <ta-input placeholder="请输入自定义编码"></ta-input>
                  </ta-form-item>
                </ta-col>
              </ta-row>
              <ta-row>
                <ta-col :span="row.col">
                  <ta-form-item label='菜单类型'
                                :labelCol="formItemLayout.labelCol"
                                :wrapperCol="formItemLayout.wrapperCol"
                                fieldDecoratorId="resourceType">
                    <ta-select mode="multiple" placeholder="请选择菜单类型">
                      <ta-select-option v-for="item in CollectionData('RESOURCETYPE')" :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
                    </ta-select>
                  </ta-form-item>
                </ta-col>
                <ta-col :span="row.col">
                  <ta-form-item label='安全策略'
                                :labelCol="formItemLayout.labelCol"
                                :wrapperCol="formItemLayout.wrapperCol"
                                fieldDecoratorId="securityPolicy">
                    <ta-select mode="multiple" placeholder="请选择安全策略">
                      <ta-select-option v-for="item in CollectionData('SECURITYPOLICY')" :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
                    </ta-select>
                  </ta-form-item>
                </ta-col>
              </ta-row>
              <ta-row>
                <ta-col :span="row.col">
                  <ta-form-item label='认证级别'
                                :labelCol="formItemLayout.labelCol"
                                :wrapperCol="formItemLayout.wrapperCol"
                                fieldDecoratorId="securityLevel">
                    <ta-select mode="multiple" placeholder="请选择认证级别">
                      <ta-select-option v-for="item in CollectionData('SECURIYTLEVEL') " :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
                    </ta-select>
                  </ta-form-item>
                </ta-col>
                <ta-col :span="row.col">
                  <ta-form-item label='界面元素授权'
                                :labelCol="formItemLayout.labelCol"
                                :wrapperCol="formItemLayout.wrapperCol"
                                fieldDecoratorId="uiAuthorityPolicy">
                    <ta-select mode="multiple" placeholder="请选择界面元素授权方式">
                      <ta-select-option v-for="item in CollectionData('UIAUTHORITYPOLICY') " :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
                    </ta-select>
                  </ta-form-item>
                </ta-col>
              </ta-row>
              <ta-row>
                <ta-col :span="row.col">
                  <ta-form-item label='所属系统'
                                :labelCol="formItemLayout.labelCol"
                                :wrapperCol="formItemLayout.wrapperCol"
                                fieldDecoratorId="sysCode">
                    <ta-select mode="multiple" placeholder="请选择所属系统">
                      <ta-select-option v-for="item in systemList" :value="item.sysCode" :key="item.sysCode">{{item.sysName}}</ta-select-option>
                    </ta-select>
                  </ta-form-item>
                </ta-col>
                <ta-col :span="row.col">
                  <ta-form-item label='有效标识'
                                :labelCol="formItemLayout.labelCol"
                                :wrapperCol="formItemLayout.wrapperCol"
                                fieldDecoratorId="effective">
                    <ta-select mode="multiple" placeholder="请选择有效标识">
                      <ta-select-option v-for="item in CollectionData('EFFECTIVE') " :key="item.value" :value="item.value">{{item.label}}</ta-select-option>
                    </ta-select>
                  </ta-form-item>
                </ta-col>
              </ta-row>
            </template>
          </ta-form>
        </template>
      </ta-search-panel>
    </div>
  </div>
</template>
<script>
import api from '../api/index'
import isObject from 'lodash/isObject'
export default {
  name: 'searchHead',
  props: {
    search: {
      type: Function,
      required: true
    },
    searchTagParam: {
      type: Function,
      required: true
    },
    advancedSearch: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      // row  布局
      row: {
        col: 12
      },
      // form布局配置
      form: null,
      formLayout: 'horizontal',
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18}
      },
      // 搜索参数
      searchParam: '',
      // 所属系统码值
      systemList: []
    }
  },
  created () {
    if (this.systemList.length == 0) {
      api.queryAllAccessSystem((data) => {
        this.systemList = eval('(' + data.systemList + ')')
      })
    }
  },
  methods: {
    // input搜索
    handleSearch () {
      let param
      param = this.searchTagParam()
      this.search(param)
    },
    // 通过按钮进行高级查询
    handleAdvancedQueryResourceList (value) {
      let param = {}
      Object.keys(value).map((key) => {
        param[key] = isObject(value[key]) ? value[key].toString() : value[key]
      })
      this.advancedSearch(param)
    },
    // 获取当前输入条件
    getSearchParam () {
      return this.searchParam
    }
  }
}

</script>
<style scoped type="text/less" lang="less">
  .search-box { width: 340px; margin-right: 10px; }
  .center-box {
    display: table; text-align:center; width: 100%; height: 100%; overflow: hidden;
    .center-item { display: table-cell; vertical-align: middle; text-align: center;
      &:first-child { text-align: right; width: 55%; }
      &:last-child { text-align: left; width: 45%; }
    }
  }
</style>

<template>
  <ta-collapse v-model="activeKey" :bordered="false">
    <ta-collapse-panel v-for="(tag,index) in tagArray" :key="generateKey(index)"  :showArrow="false" >
      <template slot="header">
        {{tag.urlName}}
        <div class="rest-input-delete">
          <template>
            <a v-if="activeKey.indexOf(generateKey(index)) < 0" @click.stop="handleViewRest(generateKey(index))">查看</a>
            <a v-else @click.stop="handleHiddenRest(generateKey(index))">隐藏</a>
          </template>
          <ta-divider type="vertical" />
          <a  @click.stop="handleRemoveRest(tag,generateKey(index),index)">删除</a>
        </div>

      </template>
      <p>服务路径：{{tag.restUrl}}</p>
      <p>独立授权：{{CollectionLabel('YESORNO',tag.authorityPolicy)}}</p>
    </ta-collapse-panel>
    <ta-collapse-panel :key="keyAdd" :showArrow="false">
      <template slot="header">
        <a @click.stop="handleViewRest(keyAdd)">
          <ta-icon type="plus" /> {{newLabel}}
        </a>
      </template>
      <ta-card>
        <ta-form :autoFormCreate="(form)=>{this.form = form}">
          <ta-form-item label='服务名称'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="urlName"
                        :fieldDecoratorOptions="{rules: [{ required: true ,message: '请填写服务名称!'}]}">
            <ta-input/>
          </ta-form-item>
          <ta-form-item label='服务路径'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="restUrl"
                        :fieldDecoratorOptions="{rules: [{ required: true ,message: '请填写服务路径!'}]}">
            <ta-input/>
          </ta-form-item>
          <ta-form-item label='独立授权'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="authorityPolicy"
                        :fieldDecoratorOptions="{rules: [{ required: true ,message: '请确定是否独立授权!'}]}">
            <ta-select>
              <ta-select-option v-for="item in CollectionData('YESORNO')" :value="item.value" :key="item.value">
                {{item.label}}
              </ta-select-option>
            </ta-select>
          </ta-form-item>
        </ta-form>
        <ta-button @click.prevent="handleAddRest">
          添加
        </ta-button>
        <ta-button @click.prevent="handleHiddenRest(keyAdd)">
          取消
        </ta-button>
      </ta-card>
    </ta-collapse-panel>
  </ta-collapse>
</template>
<script>
function fixControlledValue (value) {
  if (typeof value === 'undefined' || value === null) {
    return '[]'
  }
  try {
    JSON.parse(value)
  } catch (e) {
    value = '[]'
  }
  return value
}

export default {
  name: 'restUrlInputTag',
  props: ['value', 'repeatMessage', 'newLabel'],
  data () {
    const { value } = this.$props
    return {
      // form布局配置
      formLayout: 'horizontal',
      formItemLayout: {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
      },
      tags: fixControlledValue(value),
      activeKey: [],
      keyAdd: 'newRestKey',
      keySeparator: '_',
      keySuffix: 'key'
    }
  },
  computed: {
    tagArray () {
      return JSON.parse(this.tags) || []
    }
  },
  watch: {
    value (val) {
      this.tags = fixControlledValue(val)
      this.activeKey = []
    }
  },
  methods: {
    generateKey (index) {
      return index + this.keySeparator + this.keySuffix
    },
    handleViewRest (key) {
      if (this.activeKey.indexOf(key) > -1) return
      this.activeKey.push(key)
    },
    handleHiddenRest (key) {
      this.activeKey = this.activeKey.filter(a => a != key)
    },
    handleRemoveRest (item, key, index) {
      let tagList = JSON.parse(this.tags) || []
      tagList.splice(index, 1)
      this.tags = JSON.stringify(tagList)
      this.triggerChange()
    },
    handleAddRest () {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let tagList = JSON.parse(this.tags) || []
          let index = tagList.findIndex(a => a.restUrl == values.restUrl)
          if (index === -1) {
            tagList.push(Object.assign({}, values))
            this.tags = JSON.stringify(tagList)
            this.triggerChange()
          } else {
            this.$message.warning(this.repeatMessage)
          }
        }
      })
    },
    triggerChange  () {
      let changeValue = this.tags
      this.$emit('change', changeValue)
    }
  }
}

</script>
<style scoped type="text/less" lang="less">
  .rest-input-delete{
    float: right;
    right:10px;
  }
</style>

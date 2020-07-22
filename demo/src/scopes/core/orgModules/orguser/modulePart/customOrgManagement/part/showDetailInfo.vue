<template>
    <!--isShow:是否展示抽屉-->
    <!--title:抽屉标题-->
    <!--width:抽屉宽度,默认500-->
    <!--@close:抽屉关闭时触发-->
    <!--data:需要展示的数据,需要是一个数组,每个元素的属性如下:-->
    <!--label:需要展示的标签名称-->
    <!--value:需要展示的值-->
    <!--type:暂支持如下几种:-->
    <!--text:输入框,默认-->
    <!--codeTable:码表,需要指定dictType字段-->
    <!--desc:描述内容,例如组织路径,或者描述等字段内容较长信息-->
    <!--boolean:以开关的方式进行展示,值必须是true或者fase-->
    <!--date:日期,格式化成日期形式展示-->
    <!--img:图片形式,value需要指定加载的绝对路径url-->
    <ta-drawer destroyOnClose
               centered
               :visible="isShow"
               :width="width"
               @close="fnCloseDrawer"
               :title="title">
      <ta-form :autoFormCreate="(form)=>{this.form = form}">
        <ta-form-item v-for="item in data"
                      :key="item.label"
                      :label='item.label'
                      :labelCol="formItemLayout.labelCol"
                      :wrapperCol="formItemLayout.wrapperCol">
          <span v-if="!item.type || item.type == 'text'">
            <ta-input v-if="item.value" :value="item.value" disabled/>
            <span v-else>--</span>
          </span>
          <span v-else-if="item.type == 'codeTable'">{{CollectionLabel(item.dictType,item.value)}}</span>
          <span v-else-if="item.type == 'desc'">{{item.value?item.value:'--'}}</span>
          <ta-switch v-else-if="item.type == 'boolean'" :defaultChecked="item.value" checkedChildren="有效" unCheckedChildren="无效" disabled/>
          <span v-else-if="item.type == 'date'">
            <ta-input v-if="item.value" :defaultValue="moment(item.value).format('YYYY-MM-DD')" disabled></ta-input>
            <span v-else>永久</span>
          </span>
          <img v-else-if="item.type == 'img'" :src="item.value"/>
          <span v-else>{{item.value}}</span>
        </ta-form-item>
      </ta-form>
    </ta-drawer>
</template>

<script>
import moment from 'moment'

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18}
}
export default {
  name: 'showDetailInfo',
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    title: {
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    },
    width: {
      type: [Number, String],
      default: function () {
        return '500'
      }
    }
  },
  data () {
    return {
      formItemLayout
    }
  },
  watch: {
    isShow (isShow) {
      if (isShow) {
        this.isShow = isShow
      }
    }
  },
  methods: {
    moment,
    // 关闭模态框
    fnCloseDrawer () {
      this.$emit('close')
    }
  }
}
</script>

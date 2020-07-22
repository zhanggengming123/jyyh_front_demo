<template>
  <div>
    <ta-modal
      title="添加组件"
      :destroy-on-close="true"
      :closable="false"
      :visible="visible">
      <ta-checkbox-group class="checkboxGroup" :options="getAllComponents" :default-value="checked" @change="onChange"/>
      <template slot="footer">
        <ta-button @click="$emit('update:visible',false)">
          关闭
        </ta-button>
      </template>
    </ta-modal>
  </div>
</template>

<script>
  export default {
    name: 'addItem',
    props: {
      checked: {
        type: Array,
        default: [],
        require: true
      },
      visible: {
        type: Boolean,
        default: false,
        require: true
      },
      allComponents: {
        type: Array,
        default: [],
        require: true
      }
    },
    computed: {
      getAllComponents: function () {
        return this.allComponents
      }
    },
    methods: {
      onChange: function (newChecked) {
        this.$emit('onChange', newChecked)
      }
    }
  }
</script>

<style lang="less" scoped>

  .checkboxGroup {
    line-height: 30px;
  }
</style>

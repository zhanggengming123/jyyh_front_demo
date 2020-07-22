<template>
  <div>
    <ta-modal
      title="选择工作台"
      :visible="visible"
      :destroyOnClose="true"
      onOk="generateWorkTable"
      :closable="false">
      <ta-tag-select class="tagSelect" :data="templateTags" v-model="selectedTag"
                     @change="onTagSelectChange"></ta-tag-select>
      <template slot="footer">
        <ta-button @click="$emit('update:visible',false)">
          取消
        </ta-button>
        <ta-button key="submit" type="primary" :loading="confirmLoading" @click="generateWorktable">
          确定
        </ta-button>
      </template>
    </ta-modal>
  </div>
</template>

<script>
  export default {
    name: 'switchModal',
    data: function () {
      return {
        selectedTag: this.templateSelectedTag
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
        require: true
      }, confirmLoading: {
        type: Boolean,
        default: false,
        require: true
      },
      templateTags: {
        type: Array,
        default: [],
        require: true
      },
      templateSelectedTag: {
        type: Array,
        default: [],
        require: true
      }
    },
    methods: {
      generateWorktable: function () {
        this.$emit('generateWorktable')
      },
      onTagSelectChange: function (data) {
        this.$emit('update:templateSelectedTag', data)
      }
    }
  }
</script>

<style lang="less" scoped>
  .tagSelect {
    line-height: 40px;
  }
</style>

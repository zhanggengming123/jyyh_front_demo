<template>
  <div id="inputTag">
    <template v-for="(tag) in tagArray">
      <ta-tooltip v-if="tag.length > 40" :key="tag" :title="tag" class="rest-input-Tag">
         <ta-tag :key="tag" :closable='true' :afterClose="() => handleClose(tag)">
             {{`${tag.slice(0, 40)}...`}}
         </ta-tag>
      </ta-tooltip>
      <ta-tag v-else :key="tag" :closable='true' :afterClose="() => handleClose(tag)" class="rest-input-Tag">
         {{tag}}
      </ta-tag>
    </template>
    <ta-input
      class="rest-input-Tag-input"
      v-if="inputVisible"
      ref="input"
      type="text"
      size="small"
      :value="inputValue"
      @change="handleInputChange"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <ta-tag v-else @click="showInput" class="rest-input-Tag rest-input-Tag-add">
      <ta-icon type="plus" /> {{newLabel}}
    </ta-tag>
  </div>
</template>
<script>
function fixControlledValue (value) {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  return value
}

export default {
  name: 'TaInputTag',
  props: ['value', 'repeatMessage', 'newLabel'],
  data () {
    const { value } = this.$props
    return {
      tags: fixControlledValue(value),
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    tagArray () {
      return this.tags.split(',').filter(tag => tag.length > 0)
    }
  },
  watch: {
    value (val) {
      this.tags = fixControlledValue(val)
    }
  },
  methods: {
    handleClose (removedTag) {
      const tags = this.tags.split(',').filter(tag => tag !== removedTag).join(',')
      this.tags = tags
      this.triggerChange()
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },

    handleInputChange (e) {
      this.inputValue = e.target.value
    },

    handleInputConfirm (e) {
      const inputValue = this.inputValue
      let tags = this.tags.split(',')
      if (inputValue) {
        if (tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue]
        } else {
          this.$message.warning(this.repeatMessage)
        }
      }
      tags = tags.join(',')
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: ''
      })
      this.triggerChange()
    },

    triggerChange  () {
      let changeValue = this.tags
      // Should provide an event to pass value to Form.
      if (changeValue.indexOf(',') == 0) {
        changeValue = changeValue.substring(1)
      }
      if (changeValue.indexOf(',') == changeValue.length - 1) {
        changeValue = changeValue.substring(-1)
      }
      this.$emit('change', changeValue)
    },
    fnConversion () {

    }
  }
}

</script>
<style type="text/less" lang="less">
  .rest-input-Tag{
    .anticon-close{
      float: right;
      margin: 4px;
    }
  }
  .rest-input-Tag{
    width: 100%;
    height: 32px;
    text-align: left;
    vertical-align: middle;
    padding:4px 11px;
  }
</style>
<style scoped type="text/less" lang="less">
  .rest-input-Tag-input{
    height:32px;
    padding:4px 11px;
  }
  .rest-input-Tag-add{
    background: #fff;
    borderStyle: dashed;
  }
</style>

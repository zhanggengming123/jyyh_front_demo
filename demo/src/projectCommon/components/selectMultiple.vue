<template>
  <ta-select mode="multiple" v-model="selectValue" :placeholder="placeholder" :options="CollectionData(collection)" :disabled="disabled" :allowClear="allowClear" @change="handleChange">
  </ta-select>
</template>

<script>
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
export default {
  name: 'selectMultiple',
  props: ['collection', 'value', 'disabled', 'placeholder', 'allowClear'],
  data () {
    return {
      selectValue: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val, old) {
        if (!isString(val) || val.trim() == '') {
          this.selectValue = []
          return
        }
        this.selectValue = val.split(',')
      }
    }
  },
  methods: {
    handleChange (value) {
      if (!isArray(value)) value = []
      this.$emit('input', value.join(','))
      this.$emit('change', value.join(','))
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <ta-drawer title="批量操作组织详情" width="500" placement="right" :closable="true" @close="closeEdit" :visible="visible" destroyOnClose>
    <div  style="padding: 30px 30px 0 50px; overflow-y: auto" v-html="this.msg"></div>
  </ta-drawer>
</template>
<script>
import $api from '../../api'

export default {
  name: 'showOrgBatch',
  props: ['visible', 'rowData', 'tags'],
  data () {
    return {
      form: null,
      formData: {},
      msg: ''
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.setValue()
      }
    }
  },
  methods: {
    setValue () {
      this.msg = ''
      $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
        this.msg = "<table class='gridtable' style='width: 100%; height: 100%'>" +
          '<tr><th>组织名</th><th>组织path</th></tr>'
        for (let temp = 0; temp < result.data.before.length; temp++) {
          this.msg = this.msg + '<tr><td>' + result.data.before[temp].orgName + ' </td><td>' + result.data.before[temp].namePath + '</td></tr>'
        }
        this.msg = this.msg + '</table>'
      })
    },

    closeEdit () {
      this.$emit('close')
      this.formData = {}
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .tag-select { .user-select() }
</style>


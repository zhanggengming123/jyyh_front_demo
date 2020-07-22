<template>
  <ta-drawer title="批量操作代理角色" width="500" placement="right" :closable="true" @close="closeEdit" :visible="visible" destroyOnClose>
    <div  style="padding: 30px 30px 0 50px; overflow-y: auto" v-html="this.msg"></div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'

export default {
  name: 'showAgentAuthorityBatch',
  props: ['visible', 'rowData'],
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
          '<tr><th>代理角色名称</th><th>组织path</th></tr>'
        for (let temp = 0; temp < result.data.before.length; temp++) {
          this.msg = this.msg + '<tr><td>' + result.data.before[temp].roleName + ' </td><td>' + result.data.before[temp].orgNamePath + '</td></tr>'
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

<template>
  <ta-drawer title="更新权限有效时间" width="500" placement="right" :closable="true" @close="closeEdit" :visible="visible" destroyOnClose>
    <div  style="padding: 30px 30px 0 50px; overflow-y: auto" v-html="this.msg"></div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'
export default {
  name: 'showPermissionEffectiveTimeBatch',
  props: ['visible', 'rowData'],
  data () {
    return {
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
          '<tr><th>资源名称</th><th>有效时间</th></tr>'
        for (let temp = 0; temp < result.data.after.length; temp++) {
          this.msg = this.msg + '<tr><td>' + result.data.after[temp].resourceName + ' </td><td>' + result.data.after[temp].effectTime + '</td></tr>'
        }
        this.msg = this.msg + '</table>'
      })
    },
    closeEdit () {
      this.$emit('close')
    }
  }
}
</script>

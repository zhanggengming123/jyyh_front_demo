<template>
  <ta-drawer :title="roleUserVisible ? '角色人员详情':'批量操作人员详情'" width="500" placement="right" :closable="true" @close="closeEdit" :visible="visible" destroyOnClose>
    <div v-show="roleUserVisible">
      <ta-alert :message="'当前角色为：'+ roleName" type="info" showIcon class="notice-box"/>
    </div>
    <div  style="padding: 30px 30px 0 50px; overflow-y: auto" v-html="this.msg"></div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'

export default {
  name: 'showUserBatch',
  props: ['visible', 'rowData', 'tags', 'roleUserVisible'],
  data () {
    return {
      form: null,
      formData: {},
      msg: '',
      roleName: ''
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
          '<tr><th>人员姓名</th><th>账号</th></tr>'
        for (let temp = 0; temp < result.data.before.length; temp++) {
          this.msg = this.msg + '<tr><td>' + result.data.before[temp].name + ' </td><td>' + result.data.before[temp].loginId + '</td></tr>'
        }
        this.msg = this.msg + '</table>'
        // 角色人员
        if (this.roleUserVisible) {
          this.roleName = result.data.before[0].pubRole
        }
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

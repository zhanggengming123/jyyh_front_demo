<template>
  <ta-drawer :title="userRoleVisible ? '人员角色详情' : '批量操作角色详情'" width="500" placement="right" :closable="true" @close="closeEdit" :visible="visible" destroyOnClose>
    <div v-show="userRoleVisible">
      <ta-alert :message="'当前人员为：'+ userName" type="info" showIcon class="notice-box"/>
    </div>
    <div  style="padding: 30px 30px 0 50px; overflow-y: auto" v-html="this.msg"></div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'

export default {
  name: 'showRoleBatch',
  props: ['visible', 'rowData', 'tags', 'userRoleVisible'],
  data () {
    return {
      form: null,
      formData: {},
      msg: '',
      userName: ''
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
          '<tr><th>角色名称</th><th>所在组织</th></tr>'
        for (let temp = 0; temp < result.data.before.length; temp++) {
          this.msg = this.msg + '<tr><td>' + result.data.before[temp].roleName + ' </td><td>' + result.data.before[temp].namePath + '</td></tr>'
        }
        this.msg = this.msg + '</table>'

        // 人员角色
        if (this.userRoleVisible) {
          this.userName = result.data.before[0].userName
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

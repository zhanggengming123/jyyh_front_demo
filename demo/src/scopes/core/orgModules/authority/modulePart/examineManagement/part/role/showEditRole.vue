<template>
  <ta-drawer title="角色信息" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <div  style="padding: 10px 10px 0 20px; overflow-y: auto;" v-html="this.msg" ></div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'
export default {
  name: 'showAddRole',
  props: ['visible', 'rowData', 'chooseRoleResult', 'adminRole'],
  data () {
    return {
      msg: ''
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {

          let roleArray = {
            roleName: '角色名称',
            namePath: '所属组织',
            effectiveTime: '有效时间',
            roleSign:'角色类型',
            roleDesc: '角色描述',
          }
          // 构建table
          this.msg = "<table class='gridtable' style='width: 100%; height: 100%'>" +
            '<tr><th>数据项</th><th>原数据</th><th>更新后数据</th></tr>'
          Object.keys(roleArray).forEach(field => {
            let beforeData = '', afterData = ''
            if (field == 'roleSign') {
              beforeData = this.CollectionLabel('ROLESIGN', result.data.before[field] == undefined ? '': result.data.before[field])
              afterData = this.CollectionLabel('ROLESIGN', result.data.after[field] == undefined ? '': result.data.after[field])
              // 管理员角色
              if (this.adminRole) {
                return;
              }
            }else {
              beforeData = result.data.before[field] == undefined ? '': result.data.before[field]
              afterData = result.data.after[field] == undefined ? '' : result.data.after[field]
            }

            // 突出显示
            if (beforeData != afterData){
              this.msg = this.msg + '<tr class="trstess"><td>' + roleArray[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
            } else {
              this.msg = this.msg + '<tr><td>' + roleArray[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
            }

          })
          this.msg = this.msg + '</table>'
        })
      }
    }
  },
  methods: {
    closeDrawer () {
      this.$emit('close')
    }
  }
}
</script>

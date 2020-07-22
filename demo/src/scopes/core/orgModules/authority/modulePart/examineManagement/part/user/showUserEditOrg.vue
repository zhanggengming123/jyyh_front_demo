<template>
  <ta-drawer title="人员更改组织" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <div  style="padding: 10px 10px 0 20px; overflow-y: auto;" v-html="this.msg" ></div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'

export default {
  name: 'showUserEditOrg',
  props: ['visible', 'rowData'],
  data () {
    return {
      msg: ''
    }
  },

  watch: {
    visible (val) {
      if (val) {
        const userArray = {
          userName: '用户姓名',
          orgNamePath: '组织路径',
        }
        // 构建table
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          this.msg = "<table class='gridtable' style='width: 100%; height: 100%'>" +
            '<tr><th>数据项</th><th>原数据</th><th>更新后数据</th></tr>'
          Object.keys(userArray).forEach((field => {
            let beforeData = result.data.before[field] == undefined ? '' : result.data.before[field]
            let afterData = result.data.after[field] == undefined ? '' : result.data.after[field]

            // 突出显示
            if (beforeData != afterData){
              this.msg = this.msg + '<tr class="trstess"><td>' + userArray[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
            } else {
              this.msg = this.msg + '<tr><td>' + userArray[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
            }

          }))
          this.msg = this.msg + '</table>'
        });
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
<style type="text/less" lang="less">
  .avatar-form-item .ant-form-item-label { margin-top: 12px; }
</style>
<style scoped type="text/less" lang="less">
  .pos-avatar { position: relative; overflow: hidden; width: 64px; height: 64px; line-height: 64px; margin-left: 10px; font-size: 32px; text-align: center; background: #ccc; color: #fff; border-radius: 100%; }
  .img-avatar { width: 64px; height: 64px; background-repeat: no-repeat; background-size: cover; background-position: center;}
  .tag-select { border-color: @primary-color; color: @primary-color; .user-select() }
</style>

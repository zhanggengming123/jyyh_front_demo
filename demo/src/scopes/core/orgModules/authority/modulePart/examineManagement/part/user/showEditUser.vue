<template>
  <ta-drawer title="个人信息" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <div  style="padding: 10px 10px 0 20px; overflow-y: auto;" v-html="this.msg" ></div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'

export default {
  name: 'showEditUser',
  props: ['visible', 'rowData'],
  data () {
    return {
      imageUrl: '',
      imageUrlAfter: '',
      tags: [],
      selectedTags: [],
      msg: ''
    }
  },

  watch: {
    visible (val) {
      if (val) {
        const userArray = {
          avatar: '用户头像',
          // orgIdShow: '所属组织',
          name: '姓名',
          loginId: '账号',
          sex: '性别',
          jobNumber: '工号',
          idCardType: '证件类型',
          idCardNo: '证件号',
          mobile: '手机号',
          userTags: '用户标签',
          education: '学历',
          email: '邮箱地址',
          address: '联系地址',
          zipCode: '邮政编码',
          workplace: '工作单位'

        }

        // 扩展字段
        let set = new Set(Object.keys(userArray))
        set.add("tags")
        $api.queryUserSettingTable((data) => {
          let resultData = data.resultData
          for (let i = 0; i < resultData.length; i++) {
            if (resultData[i].effective == '1' && resultData[i].hide == '0'){
              if (!set.has(resultData[i].fieldId)) {
                userArray[resultData[i].fieldId] = resultData[i].displayText
              }
            }
          }
        })

        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          // 构建table
          this.msg = "<table class='gridtable' style='width: 100%; height: 100%'>" +
            '<tr><th>数据项</th><th>原数据</th><th>更新后数据</th></tr>'
          Object.keys(userArray).forEach(field => {
            let beforeData = '', afterData = ''
            if (field == 'userTags') {
              for (let userTagBeforeIndex in result.data.before[field]) {
                let userTagBefore = result.data.before[field][userTagBeforeIndex]
                if (userTagBefore.ischecked == 1) {
                  beforeData = beforeData + userTagBefore.tagname+ "、"
                }
              }
              for (let userTagAfterIndex in result.data.after[field]) {
                let userTagAfter = result.data.after[field][userTagAfterIndex]
                if (userTagAfter.ischecked == 1) {
                  afterData = afterData + userTagAfter.tagname + "、"
                }
              }
            } else if (field == 'sex') {
              beforeData = this.CollectionLabel('SEX', result.data.before[field])
              afterData = this.CollectionLabel('SEX', result.data.after[field])
            } else if (field == 'idCardType') {
              beforeData = this.CollectionLabel('IDCARDTYPE', result.data.before[field] == undefined ? '' : result.data.before[field])
              afterData = this.CollectionLabel('IDCARDTYPE', result.data.after[field] == undefined ? '' : result.data.after[field])
            } else if (field == 'education') {
              beforeData = this.CollectionLabel('EDUCATION', result.data.before[field] == undefined ? '' : result.data.before[field])
              afterData = this.CollectionLabel('EDUCATION', result.data.after[field] == undefined ? '' : result.data.after[field])
            } else {
              beforeData = result.data.before[field] == undefined ? '' : result.data.before[field]
              afterData = result.data.after[field] == undefined ? '' : result.data.after[field]
            }
            if (field == 'avatar') {
              this.imageUrl = result.data.before.portrait || ''
              this.imageUrlAfter = result.data.after.portrait || ''
              this.msg = this.msg + '<tr><td>' + userArray[field] + '</td>' +
                '<td><div class="pos-avatar"> <div class="img-avatar" style="width: 64px; height: 64px; background-repeat: no-repeat; background-size: contain; background-position: center;background-image:url(' + this.imageUrl + ')"></div></div></td>' +
                '<td><div class="pos-avatar"> <div class="img-avatar" style="width: 64px; height: 64px; background-repeat: no-repeat; background-size: contain; background-position: center;background-image:url(' + this.imageUrlAfter + ')"></div></div></td></tr>'
            } else {

              // 突出显示
              if (beforeData != afterData){
                this.msg = this.msg + '<tr class="trstess"><td>' + userArray[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
              } else {
                this.msg = this.msg + '<tr><td>' + userArray[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
              }

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
<style type="text/less" lang="less">
  .avatar-form-item .ant-form-item-label { margin-top: 12px; }
</style>
<style scoped type="text/less" lang="less">
  .pos-avatar { position: relative; overflow: hidden; width: 64px; height: 64px; line-height: 64px; margin-left: 10px; font-size: 32px; text-align: center; background: #ccc; color: #fff; border-radius: 100%; }
  .img-avatar { width: 64px; height: 64px; background-repeat: no-repeat; background-size: cover; background-position: center;}
  .tag-select { border-color: @primary-color; color: @primary-color; .user-select() }
</style>

<template>
  <ta-drawer title="更新组织详情" width="600" placement="right" :closable="true" @close="closeEdit" :visible="visible" destroyOnClose>
    <div  style="padding: 10px 10px 0 20px; overflow-y: auto;" v-html="this.msg" ></div>
  </ta-drawer>
</template>
<script>
import $api from '../../api'
export default {
  name: 'showOrg',
  props: ['visible', 'rowData', 'tags'],
  data () {
    return {
      msg: ''
    }
  },
  watch: {
    visible (val) {
      if (val) {
        let orgArray1 = {
          orgName: '组织机构名称',
          namePath: '组织机构路径',
          orgType: '组织类型',
          effective:'有效标识',
          customNo: '自定义编码',
          orderNo: '排序号',
          orgCode: '组织代码',
          tel: '联系电话',
          address: '联系地址',
          createTime: '创建时间'
        }
        let orgArray2 = {
          pOrgName: '上级组织机构',// parentId: '上级组织机构ID',
          contactsName: '联系人',// contacts: '联系人',
          orgManagerName: '负责人',// orgManager:'负责人',
          areaValue: '所属行政区',// area: '所属行政区',
          orgTags: '组织标签', //tags
        }

        // 扩展字段
        let set = new Set(Object.keys(orgArray1))
        set.add('parentId').add('contacts').add('orgManager').add('area').add('tags')
        set.add('areaValue').add('pOrgName').add('contactsName').add('orgManagerName').add('orgTags')
        $api.queryOrgSettingTable((data) => {
          let resultData = data.resultData
          for (let i = 0; i < resultData.length; i++) {
            if (resultData[i].effective == '1' && resultData[i].hide == '0'){
              if (!set.has(resultData[i].fieldId)) {
                orgArray1[resultData[i].fieldId] = resultData[i].displayText
              }
            }
          }
        })

        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          const orgDataBefore = result.data.before.org
          const orgDataAfter = result.data.after.org

          // 构建table
          this.msg = "<table class='gridtable' style='width: 100%; height: 100%'>" +
            '<tr><th>数据项</th><th>原数据</th><th>更新后数据</th></tr>'
          Object.keys(orgArray1).forEach(field => {
            let beforeData = '', afterData = ''
            if (field == 'orgType') {
              beforeData = this.CollectionLabel('orgType', orgDataBefore[field])
              afterData = this.CollectionLabel('orgType', orgDataAfter[field])
            }else if (field == 'effective'){
               beforeData = orgDataBefore[field] == '1' ? '有效' : '无效'
               afterData = orgDataAfter[field] == '1' ? '有效' : '无效'
            }  else {
               beforeData = orgDataBefore[field] == undefined ? '' : orgDataBefore[field]
               afterData = orgDataAfter[field] == undefined ? '' : orgDataAfter[field]
            }
            // 突出显示
            if (beforeData != afterData){
              this.msg = this.msg + '<tr class="trstess"><td>' + orgArray1[field] + '</td><td>' + beforeData  + ' </td><td>' + afterData + '</td></tr>'
            } else {
              this.msg = this.msg + '<tr ><td>' + orgArray1[field] + '</td><td>' + beforeData  + ' </td><td>' + afterData + '</td></tr>'
            }
          })

          Object.keys(orgArray2).forEach(field => {
            let beforeData = '', afterData = ''
            if (field == 'orgTags' ) {
              for (let i in this.tags) {
                let tag = this.tags[i]
                if (result.data.before.orgTags.indexOf(tag.tagid) > -1){
                  beforeData = beforeData + tag.tagname + "、"
                }
                if (result.data.after.orgTags.indexOf(tag.tagid) > -1){
                  afterData = afterData + tag.tagname + "、"
                }
              }
            } else {
               beforeData = result.data.before[field]
               afterData = result.data.after[field]
            }
            if (beforeData == undefined){
              beforeData = ''
            }
            if (afterData == undefined){
              afterData = ''
            }
            // 突出显示
            if (beforeData.toString() != afterData.toString()){
              this.msg = this.msg + '<tr class="trstess"><td>' + orgArray2[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
            } else {
              this.msg = this.msg + '<tr><td>' + orgArray2[field] + '</td><td>' + beforeData + ' </td><td>' + afterData + '</td></tr>'
            }
          })

          this.msg = this.msg + '</table>'
        })
      }
    }
  },
  methods: {
    closeEdit () {
      this.$emit('close')
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .tag-select { .user-select() }
</style>
<style lang="less" type="text/less">
  table.gridtable {
    font-family: verdana,arial,sans-serif;
    font-size:11px;
    color:#333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
  }
  table.gridtable th {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #e6f7ff;
  }
  .trstess {
    color: red;
    background-color: #e9f4ff
  }

  table.gridtable td {
    max-width:80px;
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    /*background-color: #ffffff;*/
  }
</style>

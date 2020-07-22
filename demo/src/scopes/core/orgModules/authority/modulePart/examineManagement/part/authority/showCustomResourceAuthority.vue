<template>
  <ta-drawer title="管理员自定义权限授权&再授权查看" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <div>
      <ta-alert :message="'当前角色为: '+ roleName" type="info" showIcon class="notice-box"/>
      <p>授权后的权限为：</p>
      <div class="divide-equally" style="width: 100%;  border: 1px solid #e6f7ff; overflow-x: scroll">
        <p><strong>授权权限</strong></p>
        <ta-e-tree :data="treeData"
                   highlight-current
                   :props="defaultProps"
                   node-key="resourceId"
                   ref="tree"
        />
      </div>
      <div class="divide-equally" style="width: 100%; border: 1px solid #e6f7ff; overflow-x: scroll">
        <p><strong>再授权权限</strong></p>
        <ta-e-tree :data="treeData2"
                   highlight-current
                   :props="defaultProps"
                   node-key="resourceId"
                   ref="tree"
        />
      </div>
    </div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'
export default {
  name: 'showCustomResourceAuthority',
  props: ['visible', 'rowData'],
  data () {
    return {
      roleName: '',
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf',
        id: 'resourceId',
        disabled: 'resourceId'
      },
      treeData: [],
      treeData2: [],
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          this.treeData = result.data.after['rePerList']
          this.treeData2 = result.data.after['reAuthList']
          this.roleName = result.data.after['roleName']


        })
      }
    }
  },
  methods: {
    closeDrawer () {
      this.$emit('close')
      this.treeData = []
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .divide-equally { display:inline-block; }
</style>

<template>
  <ta-drawer title="管理员授权&再授权查看" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <div>
      <ta-alert :message="'当前角色为: '+ roleName" type="info" showIcon class="notice-box"/>
      <div class="divide-equally">
        <p><strong>授权权限</strong></p>
        <ta-e-tree :data="treeData"
                   show-checkbox
                   highlight-current
                   :props="defaultProps"
                   node-key="resourceId"
                   ref="tree"
                   :default-checked-keys='oneDefaultCheckedList'
                   default-expand-all
        />
      </div>
      <div class="divide-equally">
        <p><strong>再授权权限</strong></p>
        <ta-e-tree :data="treeData"
                   show-checkbox
                   highlight-current
                   :props="defaultProps"
                   node-key="resourceId"
                   ref="tree"
                   :default-checked-keys='twoDefaultCheckedList'
                   default-expand-all
        />
      </div>
    </div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'
export default {
  name: 'showUsePermissionAuthority',
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
      defaultCheckedList: [], // 默认选择的key
      customRePermissions: [],
      treeData: [],
      oneDefaultCheckedList: [],
      twoDefaultCheckedList: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          const oneChecked = result.data.after['rePermissionList']
          const twoChecked = result.data.after['reAuthorityList']
          this.roleName = result.data.after['roleName']
          this.treeData = result.data.after['resourceTree']
          this.$nextTick(() => {
            let arrySelect = []
            oneChecked.forEach((value, index) => {
              const node = this.$refs.tree.getNode(value)
              if (node.isLeaf) {
                arrySelect.push(node.data.resourceId)
              }
            })
            this.oneDefaultCheckedList = arrySelect
          })
          this.$nextTick(() => {
            let arrySelect = []
            twoChecked.forEach((value, index) => {
              const node = this.$refs.tree.getNode(value)
              if (node.isLeaf) {
                arrySelect.push(node.data.resourceId)
              }
            })
            this.twoDefaultCheckedList = arrySelect
          })
        })
      }
    }
  },
  methods: {
    closeDrawer () {
      this.$emit('close')
      this.treeData = []
      this.oneDefaultCheckedList = []
      this.twoDefaultCheckedList = []
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .divide-equally { display:inline-block; }
</style>

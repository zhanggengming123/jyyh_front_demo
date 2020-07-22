<template>
  <ta-drawer title="功能菜单权限" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <div>
      <ta-alert :message="'当前角色为: '+ roleName" type="info" showIcon class="notice-box"/>
      <ta-e-tree :data="treeData"
                 show-checkbox
                 highlight-current
                 :props="defaultProps"
                 node-key="resourceId"
                 ref="tree"
                 :default-checked-keys='defaultCheckedList'
                 default-expand-all
      />
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
      treeData: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          let checked = result.data.after['checkedList']
          this.roleName = result.data.after['roleName']
          this.treeData = result.data.after['rePermissions']
          this.$nextTick(() => {
            let arrySelect = []
            checked.forEach((value, index) => {
              let node = this.$refs.tree.getNode(value)
              if (node.isLeaf) {
                arrySelect.push(node.data.resourceId)
              }
            })
            this.defaultCheckedList = arrySelect
          })
        })
      }
    }
  },
  methods: {
    closeDrawer () {
      this.$emit('close')
      this.treeData = []
      this.defaultCheckedList = []
    }
  }
}
</script>

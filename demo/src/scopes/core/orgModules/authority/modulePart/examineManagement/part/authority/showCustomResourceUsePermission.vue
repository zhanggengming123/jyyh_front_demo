<template>
  <ta-drawer title="自定义对象权限" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <div>
      <ta-alert :message="'当前角色为: '+ roleName" type="info" showIcon class="notice-box"/>
      <p>授权后的权限为：</p>
      <div style=" border: 1px solid #e6f7ff; overflow-x: auto">
        <ta-e-tree :data="treeData"
                   highlight-current
                   :props="defaultProps"
                   node-key="resourceId"
                   ref="tree"
                   default-expand-all
        />
      </div>
    </div>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'
export default {
  name: 'showCustomResourceUsePermission',
  props: ['visible', 'rowData'],
  data () {
    return {
      roleName: '',
      defaultProps: {
        children: 'children',
        label: 'resourceName',
        id: 'resourceId',
        disabled: 'resourceId'
      },
      treeData: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          this.roleName = result.data.after['roleName']
          this.treeData = result.data.after['list']
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

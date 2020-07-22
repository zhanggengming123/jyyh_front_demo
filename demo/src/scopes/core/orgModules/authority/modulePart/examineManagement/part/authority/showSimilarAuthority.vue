<template>
  <ta-drawer title="相似权限" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <div>
      <ta-alert :message="'当前角色为: '+ roleName" type="info" showIcon class="notice-box"/>
      <ta-e-tree :load="handleLoadTreeNode"
                 show-checkbox
                 highlight-current
                 :props="defaultProps"
                 node-key="resourceId"
                 ref="tree"
                 :default-checked-keys='defaultCheckedList'
                 :default-expanded-keys="defaultExpandedNode"
                 lazy/>
    </div>
  </ta-drawer>
</template>

<script>
import $api from '../../api/index'
export default {
  name: 'showSimilarAuthority',
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
      defaultExpandedNode: [],
      customRePermissions: []
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          this.roleName = result.data.before['roleName']
          this.defaultCheckedList = result.data.before['resource']
        })
      }
    }
  },
  methods: {
    closeDrawer () {
      this.$emit('close')
    },
    handleLoadTreeNode (node, resolve) {
      if (node.level === 0) {
        $api.querySimilarAuthority(null, (data) => {
          // 数据成功后默认返回的数据
          this.defaultExpandedNode = [data.customRePermissions[0].resourceId]
          this.customRePermissions = data.customRePermissions
          return resolve(data.customRePermissions)
        })
      }
      if (node.level >= 1) {
        const resourceId = node.data.resourceId
        const data = {
          resourceId: resourceId
        }
        $api.querySimilarAuthority(data, data => {
          // 数据成功后默认返回的数据
          const res = data.customRePermissions
          if (res[0].children) {
            return resolve(res[0].children)
          }
        })
      }
    }
  }
}
</script>

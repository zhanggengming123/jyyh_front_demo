<template>
  <ta-modal :visible="treeVisible"
            title="选择组织名称"
            @cancel="fnCloseModal"
            :centered="true"
            :bodyStyle="{height:'450px',overflow:'auto',paddingBottom:'0px'}">
    <div style="display: flex;height: 10%">
      <ta-input placeholder="输入组织名称进行过滤" v-model="orgFilterText"/>
    </div>
    <div style="height: 90%">
      <ta-tabs class="fit">
        <ta-tab-pane tab="组织机构树">
          <ta-e-tree :load="loadOrgData"
                     show-checkbox
                     check-strictly
                     highlight-current
                     node-key="orgId"
                     :props="defaultProps"
                     ref="tree"
                     :filter-node-method="filterNode"
                     :default-expanded-keys="expandKeys"
                     @check-change="handleCheckNodeChange"
                     lazy>
              <span class="custom-tree-node" slot-scope="{ node, data }">
              {{data.orgName}}
              <span v-if="data.isAuthority === '0'">
                <span class="no-authority">无操作权限</span>
              </span>
            </span>
          </ta-e-tree>
        </ta-tab-pane>
      </ta-tabs>
    </div>
    <div slot="footer" style="text-align: center">
      <ta-button type="primary" @click="fnConfirmNode">保存</ta-button>
    </div>
  </ta-modal>
</template>
<script>
import $api from '../api/index'

export default {
  name: 'customOrgModalTree',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      treeVisible: false, // 是否显示模态框
      expandKeys: [], // 默认展开的树节点
      orgFilterText: '', // 树过滤
      defaultProps: {// 默认树属性
        children: 'children',
        label: 'orgName',
        isLeaf: 'isLeaf',
        id: 'orgId'
      }
    }
  },
  watch: {
    visible (visible) {
      this.treeVisible = visible
    },
    // 过滤内容,调用tree的filter-node-method
    orgFilterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 过滤节点
    filterNode (value, data, node) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 处理节点点击事件
    handleCheckNodeChange (data, checked, indeterminate) {
      // 如果已经选中,则移除所有的选项,然后进行选中,如果取消选择,
      let node = this.$refs.tree.getCheckedKeys()
      if (checked) { // 如果选中则进行提示
        if (data.isAuthority === '0') {
          this.$message.warning('您没有该组织的操作权限')
          this.$refs.tree.setChecked(data, false)
          return
        }
        if (node.length >= 2) {
          for (let i = 0; i < node.length; i++) {
            if (node[i] !== data.orgId) {
              this.$refs.tree.setChecked(node[i], false, false)
            }
          }
        }
      }
    },
    // 加载组织树
    loadOrgData (node, resolve) {
      if (node.level === 0) {
        $api.queryAllTaOrg(null, data => {
          // 数据成功后默认返回的数据
          let orgVos = data.data.orgTreeData
          if (orgVos[0] && orgVos[0].children && (orgVos[0].children instanceof Array) && orgVos[0].children.length > 0) {
            this.expandKeys.push(orgVos[0].orgId)
            let dd = orgVos[0].children.map(v => {
              let obj = v
              if (v.childNum > 0) {
                obj.children = []
              }
            })
            orgVos[0].children = dd
          }
          return resolve(orgVos)
        })
      }
      if (node.level >= 1) {
        let orgId = node.data.orgId
        let isLeaf = node.data.isLeaf
        let data = {
          orgId: orgId
        }
        $api.queryAllTaOrg(data, data => {
          // 数据成功后默认返回的数据
          let dd = data.data.orgTreeData
          if (isLeaf) {
            dd = dd.map(v => {
              let obj = v
              obj.children = []
            })
          }
          return resolve(dd)
        })
      }
    },
    // 关闭模态框
    fnCloseModal () {
      this.treeVisible = false
      this.$emit('close')
    },
    // 点击确认选择节点
    fnConfirmNode () {
      let node = this.$refs.tree.getCheckedNodes()
      if (node.length < 1) {
        this.$message.warning('请选择组织', 2.5)
        return
      }
      if (node.length >= 2) {
        this.$message.warning('只能选择一个组织,或取消当前选择,再选择其他组织', 2.5)
        return
      }
      this.treeVisible = false
      this.$emit('close', this.$refs.tree.getCheckedNodes()[0].label)
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .no-authority {float: right;color: #ccc;font-size: 12px;cursor: not-allowed }
</style>

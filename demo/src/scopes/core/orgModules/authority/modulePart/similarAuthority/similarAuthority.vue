<template id="app">
  <ta-border-layout :layout="{left:'300px',footer:'70px'}" :left-cfg="{showBar: true}" :footer-cfg="{showBorder: false}">
    <div slot="leftExtraContent">
      <ta-input placeholder="输入菜单名称进行过滤" type="primary" v-model="menuFilterText"/>
    </div>
    <div class="tree-container" slot="left">
      <div class="tree-context">
        <ta-e-tree :load="handleLoadTreeNode"
                   show-checkbox
                   highlight-current
                   :props="defaultProps"
                   :filter-node-method="fnFilterNode"
                   node-key="resourceId"
                   ref="tree"
                   @check="handleNodeCheck"
                   :default-expanded-keys="defaultExpandedNode"
                   lazy/>
      </div>
    </div>
    <div>
      <ta-alert :message="'请先选择左侧菜单列表，系统会自动加载拥有相应菜单权限的角色名单，这批角色即是我们要管理的相似权限角色，管理员再选择角色进行授权管理'" type="info" showIcon/>
      <ta-tabs class="fit define-tab-context">
        <ta-tab-pane tab="角色列表">
          <ta-table :columns="roleColumns" :dataSource="roleData" :rowSelection="{onChange: handleSelected, selectedRowKeys: selectedRowKeys,}" style="padding-top: 10px" :pagination="false">
            <span slot="roleType" slot-scope="text">{{CollectionLabel('ROLETYPE',text)}}</span>
          </ta-table>
        </ta-tab-pane>
        <!--挂载节点-->
        <ta-button type="primary" icon="plus-circle-o" @click="fnAuthorityToRoleModal" slot="tabBarExtraContent" :disabled="authorityDisabled">授权</ta-button>
      </ta-tabs>
    </div>
    <div slot="footer">
      <!--begin 分页信息-->
      <ta-pagination
        style="float: right;margin-top: 10px"
        showSizeChanger
        showQuickJumper
        :dataSource.sync="roleData"
        :defaultPageSize="10"
        :params="fnRolePageParams"
        url="org/authority/similarAuthorityManagementRestService/queryUsePermissionRoleByResourceId"
        ref="rolePager"
      />
      <!--end 分页信息-->
    </div>
  </ta-border-layout>
</template>
<script>
import isArray from 'lodash/isArray'
import $api from './api/index'
const roleColumns = [
  { title: '名称', overflowTooltip: true, dataIndex: 'roleName', width: 120 },
  { title: '类型', dataIndex: 'roleType', scopedSlots: {customRender: 'roleType'}, width: 100},
  { title: '组织路径', dataIndex: 'namePath', width: '40%', overflowTooltip: true }
]
export default {
  name: 'similarAuthority',
  data () {
    return {
      menuTree: [], // 菜单树
      menuFilterText: '', // 筛选的菜单
      defaultProps: { // 菜单组织结构
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf',
        id: 'resourceId'
      },
      defaultExpandedNode: [],
      customRePermissions: [],
      roleColumns, // 右侧角色表格
      roleData: [], // 角色数据
      selectedRows: [], // 选择的数据
      selectedRowKeys: [], // 选择的行的key值
      roleConfirmLoading: false, // 是否打开加载中
      authorityDisabled: true// 授权按钮是否禁用
    }
  },
  watch: {
    menuFilterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    handleNodeCheck (checkedNodes, checkedStatus) {
      if (!isArray(checkedStatus.checkedKeys) || checkedStatus.checkedKeys.length == 0) return
      this.$refs.rolePager.loadData()
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
        let resourceId = node.data.resourceId
        let data = {
          resourceId: resourceId
        }
        $api.querySimilarAuthority(data, data => {
          // 数据成功后默认返回的数据
          let res = data.customRePermissions
          if (res[0].children) {
            return resolve(res[0].children)
          }
        })
      }
    },
    fnRolePageParams () {
      // 得到选中的节点
      let node = this.$refs.tree.getCheckedNodes()
      let resourceIds = node.map(function (v) {
        return v.resourceId
      })
      return {
        resourceIds: resourceIds.join(',')
      }
    },
    // 过滤节点
    fnFilterNode (value, data, node) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 通过菜单id查询角色列表
    fnQueryRoleByMenuIds () {
      this.$refs.rolePager.loadData()
    },
    // 复选框改变事件
    handleSelected: function (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      if (this.selectedRows.length == 0) {
        // 如果选中的数据为0，则禁用授权按钮
        this.authorityDisabled = true
      } else {
        this.authorityDisabled = false
      }
    },
    // 打开给角色授权模态框
    fnAuthorityToRoleModal () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择数据后再进行授权')
        return
      }
      this.$router.push({
        name: 'grantAuthority',
        params: {
          roles: this.selectedRows
        }
      })
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .bottom-div{
    position: fixed;
    height: 55px;
    bottom: 0;
    width: 25%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    z-index: 1;
  }
  .tree-container{
    height: 100%;
    overflow: hidden;
  }
  .tree-head-container{
    height: 32px;
  }
  .tree-context{
    overflow: auto;
    height: 100%;
    padding-bottom: 32px;
    .beautifyScrollbar()
  }
  .define-tab-context{
    padding-bottom: 60px;
  }
</style>

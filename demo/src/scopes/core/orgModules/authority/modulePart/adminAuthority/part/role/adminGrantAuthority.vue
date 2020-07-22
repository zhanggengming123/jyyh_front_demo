<template>
  <div class="fit">
    <ta-border-layout  :layout="{header:'55px'}" :showBorder="false">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBackToHome">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>授权权限</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>

      <ta-alert :message="'当前角色为：'+this.$route.query.roleName" type="info" showIcon/>
      <ta-tabs class="fit content-box">
        <ta-tab-pane tab="授权权限&&再授权权限">
          <ta-row class="fit">
            <ta-col :span="4" class="fit" style="border-right: 1px solid #eee;">
              <admin-left-menu title="授权权限一级菜单"
                               :data="menuData"
                               :selectedKeys="menuSelectedKeys"
                               @click="onSelectMenu">
              </admin-left-menu>
            </ta-col>
            <ta-col :span="20" class="fit" style="padding: 5px;border-left: 1px solid #eee">
              <ta-row class="fit" :gutter="10">
                <ta-col :span="11">
                  <span style="font-weight: bold">授权权限:</span>
                  <div style="padding: 10px 0">
                    <ta-input
                      placeholder="输入关键字进行过滤"
                      v-model="leftFilterText"
                      style="width: 250px;">
                    </ta-input>
                  </div>
                  <ta-e-tree :data="adminGrantTree"
                             show-checkbox
                             node-key="resourceId"
                             ref="tree"
                             highlight-current
                             :props="defaultProps"
                             @check="fnCheckLeftTree"
                             :filter-node-method="filterNode"
                             :default-checked-keys="leftDefaultKeys"
                             default-expand-all>
                  </ta-e-tree>
                </ta-col>
                <ta-col :span="11">
                  <span style="font-weight: bold">再授权权限:</span>
                  <div style="padding: 10px 0">
                    <ta-input
                      placeholder="输入关键字进行过滤"
                      v-model="rightFilterText"
                      style="width: 250px;">
                    </ta-input>
                  </div>
                  <ta-e-tree :data="adminReGrantTree"
                             show-checkbox
                             node-key="resourceId"
                             ref="rtree"
                             highlight-current
                             :props="defaultProps"
                             @check-change="fnCheckRightTree"
                             :filter-node-method="filterNode"
                             :default-checked-keys="rightDefaultKeys"
                             default-expand-all>
                  </ta-e-tree>
                </ta-col>
              </ta-row>
            </ta-col>
          </ta-row>
        </ta-tab-pane>
        <template slot="tabBarExtraContent">
          <ta-button @click="fnBackToHome"><ta-icon type="rollback"/>返回</ta-button>
          <ta-button type="primary" @click="fnSaveAdminObjectUsePermission('refresh')">保存</ta-button>
        </template>
      </ta-tabs>
    </ta-border-layout>
  </div>
</template>
<script>
import $api from '../../api/index'
import AdminLeftMenu from './adminLeftMenu'

export default {
  name: 'adminGrantAuthority',
  components: {AdminLeftMenu},
  data () {
    return {
      menuData: [], // 左侧菜单栏列表
      adminGrantTree: [], // 管理员授权权限树
      leftFilterText: '', // 左侧权限过滤
      leftDefaultKeys: [], // 左侧默认选中元素
      menuSelectedKeys: [], // 选中的菜单
      adminReGrantTree: [], // 管理员再授权权限树
      rightDefaultKeys: [], // 右侧默认选中的数据
      rightFilterText: '', // 右侧权限过滤
      defaultProps: {// 默认树属性
        children: 'children',
        label: 'name',
        id: 'resourceId'
      },
      resourceItem: '', // 资源id
      row: {
        col: {
          span: 12
        }
      },
      item: {}, // 组织人员信息
      roleId: '' // 角色id
    }
  },
  watch: {
    leftFilterText (val) {
      this.$refs.tree.filter(val)
    },
    rightFilterText (val) {
      this.$refs.rtree.filter(val)
    }
  },
  activated() {
    this.item = this.$route.query
    if (!this.item.roleId) {
      this.fnBackToHome()
      return
    }
    this.roleId = this.item.roleId
    this.menuData = []
    this.adminGrantTree = []
    this.leftDefaultKeys = []
    this.adminReGrantTree = []
    this.rightDefaultKeys = []
    this.fnLoadDefault()
  },
  methods: {
    // 筛选
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 选中某一个的事件
    onSelectMenu ({item, key, keyPath}) {
      if (this.resourceItem.resouceId === key) {
        return
      }
      let selectArry = []
      const treeObj = this.$refs.tree
      selectArry = [...selectArry, ...treeObj.getCheckedKeys(), ...treeObj.getHalfCheckedKeys()]
      const newData = [...this.menuData]
      const menuItem = newData.filter(item => key === item.resourceId)[0]
      // 只需要判断左侧的数据是否有改动即可,因为右侧选中,左侧也会选中
      if (!(this.leftDefaultKeys.sort().toString() === selectArry.sort().toString())) {
        this.$confirm({
          title: '提示',
          content: '当前授权权限修改未保存，是否保存?',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            this.fnSaveAdminObjectUsePermission()
            this.menuSelectedKeys = keyPath
            this.$nextTick(() => {
              this.fnQueryGrantPermissionByResourceId(menuItem)
            })
          },
          onCancel: () => {
            this.menuSelectedKeys = keyPath
            this.fnQueryGrantPermissionByResourceId(menuItem)
          }
        })
      } else {
        this.menuSelectedKeys = keyPath
        this.fnQueryGrantPermissionByResourceId(menuItem)
      }
    },
    // 点击左边树进行处理
    fnCheckLeftTree (checkedKey, node) {
      // 如果左边没有选中,才进行选中
      if (!(this.$refs.tree.getNode(checkedKey.resourceId) && this.$refs.tree.getNode(checkedKey.resourceId).checked)) {
        this.$refs.rtree.setChecked(checkedKey.resourceId, false, true)
      }
    },
    // 点击右边树进行触发事件
    fnCheckRightTree (checkedKey, checked) {
      // 如果右边节点选中,才对左边进行选中
      if (!checked) {
        return
      }
      // 如果左边没有选中,才进行选中
      if (!(this.$refs.tree.getNode(checkedKey.resourceId)).checked) {
        let rCheckedKeys = this.$refs.tree.getCheckedKeys()
        rCheckedKeys.push(checkedKey.resourceId)
        this.$refs.tree.setCheckedKeys(rCheckedKeys)
      }
    },
    // 保存管理员授权权限树
    fnSaveAdminObjectUsePermission (type) {
      let leftResourceIds = this.$refs.tree.getCheckedNodes(false, true).map((node) => {
        return node.resourceId
      })

      let rightResourceIds = this.$refs.rtree.getCheckedNodes(false, true).map((node) => {
        return node.resourceId
      })

      let data = {
        roleId: this.roleId,
        rePermissionIds: leftResourceIds.join(','),
        reAuthorityIds: rightResourceIds.join(','),
        parentResourceId: this.resourceItem.resourceId,
        resourceType: this.resourceItem.resourceType
      }
      $api.saveAdminGrantPermission(data, dd => {
        this.$message.success('更新数据成功')
        if (type == 'refresh') {
          this.fnQueryGrantPermissionByResourceId(this.resourceItem)
        }
      })
    },
    fnLoadDefault () {
      let data = {
        roleId: this.roleId
      }
      $api.queryGrantSysPermission(data, dd => {
        this.menuData = dd.data.resourceList
        this.$nextTick(() => {
          if (this.menuData) {
            // 默认加载数组第一条数据
            this.menuSelectedKeys = [this.menuData[0].resourceId]
            this.fnQueryGrantPermissionByResourceId(this.menuData[0])
          }
        })
      })
    },
    // 点击左侧列表,加载右侧授权权限树
    fnQueryGrantPermissionByResourceId (item) {
      //todo 执行查询,请求左右两侧的权限
      this.resourceItem = item
      let data = {
        roleId: this.roleId,
        idPath: item.idPath
      }
      // 清空左右侧选择项
      this.leftDefaultKeys = []
      this.rightDefaultKeys = []
      $api.queryGrantPermissionByResourceId(data, dd => {
        this.adminGrantTree = dd.data.resourceTree
        this.adminReGrantTree = dd.data.resourceTree

        let selectedKeys = dd.data.rePermissionList.map(v => {
          return v.resourceId
        })
        // 设置左侧选中元素
        this.$nextTick(() => {
          selectedKeys.forEach(nodeKey => {
            var node = this.$refs.tree.getNode(nodeKey)
            if (node && node.isLeaf) {
              this.leftDefaultKeys.push(node.data.resourceId)
            }
          })
          this.$refs.tree.setCheckedKeys(this.leftDefaultKeys)
        })

        // 右侧默认选中的数据
        // let rDefaultKeys = dd.data.reAuthorityList;
        let rDefaultKeys = dd.data.reAuthorityList.map(v => {
          return v.resourceId
        })
        // 循环选中右边的数据
        this.$nextTick(() => {
          rDefaultKeys.forEach(nodeKey => {
            var node = this.$refs.rtree.getNode(nodeKey)
            if (node && node.isLeaf) {
              this.rightDefaultKeys.push(node.data.resourceId)
            }
          })
          this.$refs.rtree.setCheckedKeys(this.rightDefaultKeys)
        })
      })
    },
    // 返回
    fnBackToHome () {
      this.$router.push({name: 'adminRoleManagement'})
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .divider {
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    width: 1px;
    background-color: #e8e8e8;
    border-top: 10px solid #fff;
    border-bottom: 10px solid #fff;
    box-sizing: border-box;
    z-index: 1000;
  }
  .content-box {
    padding-top: 40px;
    overflow: visible;
  }
</style>

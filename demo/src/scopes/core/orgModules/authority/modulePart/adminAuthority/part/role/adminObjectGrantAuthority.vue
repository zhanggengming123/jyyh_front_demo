<template>
  <div class="fit">
    <ta-border-layout :layout="{header:'55px'}" :center-cfg="{showBar:true}" :header-cfg="{showBorder: false}"
                      :showBorder="false" :footer-cfg="{showBorder: false}">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBackToHome">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>自定义授权权限</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>
      <div slot="centerExtraContent">
        <ta-alert :message="'当前角色为：'+this.$route.query.roleName" type="info" showIcon/>
      </div>

      <ta-tabs class="fit">
        <ta-tab-pane tab="自定义授权权限&&自定义再授权权限">
          <ta-row class="fit">
            <ta-col :span="4" class="fit" style="border-right: 1px solid #eee;">
              <admin-left-menu title="自定义授权一级菜单"
                               :data="menuData"
                               :selectedKeys="menuSelectedKeys"
                               @click="onSelectMenu">
              </admin-left-menu>
            </ta-col>
            <ta-col :span="20" class="fit" style="padding: 5px;border-left: 1px solid #eee">
              <ta-row class="fit" :gutter="10">
                <ta-col :span="11">
                  <span style="font-weight: bold">对象授权权限:</span>
                  <div style="padding: 10px 0">
                    <ta-input
                      placeholder="输入关键字进行过滤"
                      v-model="leftFilterText"
                      style="width: 250px;">
                    </ta-input>
                  </div>
                  <ta-e-tree show-checkbox
                             v-if="leafKeys.length>0"
                             :load="loadLeftNode"
                             node-key="resourceId"
                             ref="tree"
                             highlight-current
                             :props="defaultProps"
                             :expand-on-click-node="true"
                             :check-strictly="true"
                             :filter-node-method="filterNode"
                             @check="fnCheckLeft"
                             lazy
                  >
                  </ta-e-tree>
                </ta-col>

                <ta-col :span="11">
                  <span style="font-weight: bold">对象再授权权限:</span>
                  <div style="padding: 10px 0">
                    <ta-input
                      placeholder="输入关键字进行过滤"
                      v-model="rightFilterText"
                      style="width: 250px;">
                    </ta-input>
                  </div>
                  <ta-e-tree show-checkbox
                             v-if="leafKeys.length>0"
                             :load="loadRightNode"
                             node-key="resourceId"
                             ref="rtree"
                             highlight-current
                             :check-strictly="true"
                             :props="defaultProps"
                             :expand-on-click-node="true"
                             :filter-node-method="filterNode"
                             @check="fnRightCheck"
                             lazy
                  >
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
  components: { AdminLeftMenu },
  data () {
    return {
      clickIndex: 0, // 点击的下标
      menuData: [], // 左侧菜单栏列表
      leftFilterText: '', // 左侧过滤框
      leftFullCheckKeys: [], // 左侧全选的keys
      leftHalfCheckKeys: [], // 左侧半选的keys
      leftDefaultCheckedKeys: [], // 左侧默认选中的节点
      leftExpandList: [], // 左侧展开列表
      menuSelectedKeys: [], // 选中的菜单
      rightFilterText: '', // 右侧过滤框
      rightFullCheckKeys: [], // 右侧全选的keys
      rightHalfCheckKeys: [], // 右侧半选的keys
      rightDefaultCheckedKeys: [], // 右侧默认选中的节点
      rightExpandList: [], // 右侧展开列表
      leafKeys: [], // 叶子节点的keys
      defaultProps: {// 默认树属性
        children: 'children',
        label: 'name',
        id: 'resourceId'
      },
      resourceItem: '', // 资源item
      row: {
        col: {
          span: 12
        }
      },
      item: {}, // 组织人员信息
      roleId: '' // 角色id
    }
  },
  activated () {
    this.item = this.$route.query
    if (!this.item.roleId) {
      this.fnBackToHome()
      return
    }
    this.roleId = this.item.roleId
    this.menuData = []
    // 清空数据
    this.leftFullCheckKeys = []
    this.leftHalfCheckKeys = []
    this.rightFullCheckKeys = []
    this.rightHalfCheckKeys = []
    this.leafKeys = []
    this.fnLoadDefault()
  },
  watch: {
    leftFilterText (val) {
      this.$refs.tree.filter(val)
    },
    rightFilterText (val) {
      this.$refs.rtree.filter(val)
    }
  },
  methods: {
    // 加载左侧节点信息
    loadLeftNode (node, resolve) {
      // 构建顶级节点
      const topNode = this.resourceItem
      const resourceId = topNode.resourceId
      if (node.level === 0) {
        const fullLocation = this.inArray(resourceId, this.leftFullCheckKeys)
        const halfLocation = this.inArray(resourceId, this.leftHalfCheckKeys)
        if (topNode.auth == false) {
          topNode.disabled = true
        }
        topNode.idPath = [resourceId]
        resolve([topNode])
        this.$nextTick(() => {
          const treeObj = this.$refs.tree
          if (halfLocation >= 0) {
            const node = treeObj.getNode(resourceId)
            node.isLeaf = topNode.isLeaf
            node.indeterminate = true
          } else if (fullLocation >= 0) {
            treeObj.setChecked(resourceId, true, false)
          } else {
            treeObj.setChecked(resourceId, false, false)
          }
        })
        return
      }
      const nodeId = node.data.resourceId
      // 展开当前节点时，保存为展开节点
      this.leftExpandList.push(nodeId)
      const param = {
        roleId: this.roleId,
        resourceId: nodeId
      }
      $api.queryChildCustomResourceAsync(param, (data) => {
        const menuCustomData = data.data.customResourceTree
        menuCustomData.forEach((data) => {
          if (data.auth == false) {
            data.disabled = true
          }
        })
        resolve(menuCustomData)
        const idPath = node.data.idPath
        menuCustomData.forEach((data) => {
          const inId = data.resourceId
          const treeObj = this.$refs.tree
          const nodeTmp = treeObj.getNode(inId)
          const leafLocation = this.inArray(inId, this.leafKeys)
          nodeTmp.isLeaf = leafLocation >= 0
          nodeTmp.data.idPath = [...idPath, nodeTmp.data.resourceId]

          // 如果上级已经手动勾选，则下级级联勾选
          if (node.checked) {
            nodeTmp.checked = true
          }
        })
        this.leftFullCheckKeys.forEach((data) => {
          const treeObj = this.$refs.tree
          treeObj.setChecked(data, true, false)
        })
        if (!node.checked) {
          this.leftHalfCheckKeys.forEach((data) => {
            const treeObj = this.$refs.tree
            const nodeTmp = treeObj.getNode(data)
            if (nodeTmp != null) {
              nodeTmp.indeterminate = true
            }
          })
        }
        this.$nextTick(() => {
          // 加载右边的树
          this.$refs.rtree.updateKeyChildren(node.id, menuCustomData)
          this.$refs.rtree.getNode(nodeId).expand()
        })
      })
    },
    // 加载左侧节点信息
    loadRightNode (node, resolve) {
      // 构建顶级节点
      const topNode = this.resourceItem
      const resourceId = topNode.resourceId
      if (node.level === 0) {
        const fullLocation = this.inArray(resourceId, this.rightFullCheckKeys)
        const halfLocation = this.inArray(resourceId, this.rightHalfCheckKeys)
        if (topNode.auth == false) {
          topNode.disabled = true
        }
        topNode.idPath = [resourceId]
        resolve([topNode])
        this.$nextTick(() => {
          const treeObj = this.$refs.rtree
          if (halfLocation >= 0) {
            const node = treeObj.getNode(resourceId)
            node.isLeaf = topNode.isLeaf
            node.indeterminate = true
          } else if (fullLocation >= 0) {
            treeObj.setChecked(resourceId, true, false)
          } else {
            treeObj.setChecked(resourceId, false, false)
          }
        })
        return
      }
      const nodeId = node.data.resourceId
      // 展开当前节点时，保存为展开节点
      this.rightExpandList.push(nodeId)
      const param = {
        roleId: this.roleId,
        resourceId: nodeId
      }
      $api.queryChildCustomResourceAsync(param, (data) => {
        const menuCustomData = data.data.customResourceTree
        menuCustomData.forEach((data) => {
          if (data.auth == false) {
            data.disabled = true
          }
        })
        resolve(menuCustomData)
        const idPath = node.data.idPath
        menuCustomData.forEach((data) => {
          const inId = data.resourceId
          const treeObj = this.$refs.rtree
          const nodeTmp = treeObj.getNode(inId)
          const leafLocation = this.inArray(inId, this.leafKeys)
          nodeTmp.isLeaf = leafLocation >= 0
          nodeTmp.data.idPath = [...idPath, nodeTmp.data.resourceId]

          // 如果上级已经手动勾选，则下级级联勾选
          if (node.checked) {
            nodeTmp.checked = true
          }
        })
        this.rightFullCheckKeys.forEach((data) => {
          const treeObj = this.$refs.rtree
          treeObj.setChecked(data, true, false)
        })
        if (!node.checked) {
          this.rightHalfCheckKeys.forEach((data) => {
            const treeObj = this.$refs.rtree
            const nodeTmp = treeObj.getNode(data)
            if (nodeTmp != null) {
              nodeTmp.indeterminate = true
            }
          })
        }
        // // 加载左边的树
        this.$nextTick(() => {
          this.$refs.tree.updateKeyChildren(node.id, menuCustomData)
          this.$refs.tree.getNode(nodeId).expand()
        })
      })
    },
    inArray (key, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (key == arr[i]) {
          return i
        }
      }
      return -1
    },
    // 筛选
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 选中某一个的事件
    onSelectMenu ({ item, key, keyPath }) {
      if (this.resourceItem.resouceId === key) {
        return
      }
      let selectArry = []
      const treeObj = this.$refs.tree
      selectArry = [...selectArry, ...treeObj.getCheckedKeys(true)]
      const newData = [...this.menuData]
      const menuItem = newData.filter(item => key === item.resourceId)[0]
      // 只需要判断左侧的数据是否有改动即可,因为右侧选中,左侧也会选中
      const rSelectArry = this.$refs.rtree.getCheckedKeys(true)
      // TODO 判断当前权限的界面需要进行保存,然后再进行切换
      if (!(this.leftDefaultCheckedKeys.sort().toString() === selectArry.sort().toString())) {
        this.$confirm({
          title: '提示',
          content: '当前对象授权权限修改未保存，是否保存?',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            this.fnSaveAdminObjectUsePermission()
            this.menuSelectedKeys = keyPath
            this.$nextTick(() => {
              this.fnQueryObjectGrantPermissionByResourceId(menuItem)
            })
          },
          onCancel: () => {
            this.menuSelectedKeys = keyPath
            this.fnQueryObjectGrantPermissionByResourceId(menuItem)
          }
        })
      } else {
        this.menuSelectedKeys = keyPath
        this.fnQueryObjectGrantPermissionByResourceId(menuItem)
      }
    },
    // add By MinusZero [hesh@yinhai.com] on 2019.09.09
    // update by wanggan
    // 点击左侧树事件触发
    fnCheckLeft (nodeData, keys) {
      if (!nodeData) {
        return
      }
      const status = this.$refs.tree.getNode(nodeData.resourceId).checked
      // 先进行左侧的树操作
      this.checkTree(nodeData, status, this.$refs.tree)
      if (!status) {
        // 如果是取消状态,则需要对右边的树进行相应的取消
        this.$refs.rtree.setChecked(nodeData.resourceId, false, false)
        this.checkTree(nodeData, status, this.$refs.rtree)
      }
    },
    // update by wanggan
    // 点击右侧树事件触发
    fnRightCheck (nodeData, keys) {
      if (!nodeData) {
        return
      }
      const status = this.$refs.rtree.getNode(nodeData.resourceId).checked
      this.checkTree(nodeData, status, this.$refs.rtree)
      // 如果右边被选中,那么需要选中左边
      if (status) {
        this.$refs.tree.setChecked(nodeData.resourceId, true, false)
        // 进行上下级循环
        this.checkTree(nodeData, status, this.$refs.tree)
      }
    },
    // update by wanggan
    // 检查树节点
    checkTree (nodeData, checked, treeObj) {
      const nowNode = treeObj.getNode(nodeData.resourceId)
      // 对上级节点进行处理
      if (checked) {
        // 如果当前节点勾选,上级节点该是什么状态就是什么状态,除非第一次被勾选,需要进行遍历
        let parentNode = treeObj.getNode(nodeData.parentId)
        while (parentNode != null && parentNode.parent.data !== null) {
          const node = treeObj.getNode(parentNode.data.resourceId)
          if (node.checked) {
            node.checked = true
          } else {
            node.indeterminate = true
          }
          parentNode = treeObj.getNode(parentNode.data.parentId)
        }
      } else {
        // 取消勾选状态,判断是够有节点勾选,如果有,则进行半勾选,如果没有,则进行全部取消
        let parentNode = treeObj.getNode(nodeData.parentId)
        while (parentNode != null && parentNode.parent.data !== null) {
          // 如果查询的是父级节点,那么肯定有子节点
          // 查询是否有孩子被选中或者半勾选
          const isAnyChildren = parentNode.childNodes.find(child => child.checked || child.indeterminate)
          // 如果每个子节点都选中的话,如果取消勾选,那么上级节点肯定都是半勾选,因为有一个不完成的
          // 如果有子节点,但是没有选中,则上级节点半勾选
          if (isAnyChildren) {
            parentNode.indeterminate = true
            parentNode.checked = false
          } else {
            // 如果子节点没有一个被选中或者半勾选,那么就取消选中
            parentNode.indeterminate = false
            parentNode.checked = false
          }
          parentNode = treeObj.getNode(parentNode.data.parentId)
        }
      }
      // 对下级节点进行处理
      this.checkChild(nowNode, checked)
    },
    // 设置当前节点的所有子节点的状态
    checkChild (node, status) {
      const child = node.childNodes
      if (child != null && child.length > 0) {
        child.forEach((childNode) => {
          childNode.indeterminate = false
          childNode.checked = status
          this.checkChild(childNode, status)
        })
      }
    },
    // 保存管理员对象使用权限树
    fnSaveAdminObjectUsePermission (type) {
      const data = this.getResourceTreeParam()
      $api.saveAdminObjectGrantPermission(data, dd => {
        this.$message.success('更新数据成功')
        if (type == 'refresh') {
          this.fnQueryObjectGrantPermissionByResourceId(this.resourceItem)
        }
      })
    },
    // 默认加载的数据
    fnLoadDefault () {
      const data = {
        roleId: this.roleId
      }
      $api.queryObjectGrantSysPermission(data, dd => {
        this.menuData = dd.data.customResourceList
        this.$nextTick(() => {
          if (this.menuData && this.menuData[0]) {
            // 默认加载数组第一条数据
            this.menuSelectedKeys = [this.menuData[0].resourceId]
            this.fnQueryObjectGrantPermissionByResourceId(this.menuData[0])
          }
        })
      })
    },
    // 点击左侧列表,加载右侧授权权限树
    fnQueryObjectGrantPermissionByResourceId (item) {
      this.resourceItem = item
      const data = {
        roleId: this.roleId,
        resourceId: item.resourceId
      }
      // 清空数据
      this.leftFullCheckKeys = []
      this.leftHalfCheckKeys = []
      this.rightFullCheckKeys = []
      this.rightHalfCheckKeys = []
      this.leafKeys = []
      $api.queryObjectGrantPermissionByResourceId(data, dd => {
        // 获取左边的
        this.leftFullCheckKeys = dd.data.rePerFullCheckList
        this.leftHalfCheckKeys = dd.data.rePerHalfCheckList
        this.leftDefaultCheckedKeys = [...this.leftFullCheckKeys, ...this.leftHalfCheckKeys]
        // 获取叶子节点
        this.leafKeys = dd.data.leafList
        // 获取右边的
        this.rightFullCheckKeys = dd.data.reAuthFullCheckList
        this.rightHalfCheckKeys = dd.data.reAuthHalfCheckList
        this.rightDefaultCheckedKeys = [...this.rightFullCheckKeys, ...this.rightHalfCheckKeys]
        // 清空左右展开的项
        this.leftExpandList = []
        this.rightExpandList = []
      })
    },
    // 获取请求后台的数据信息
    getResourceTreeParam () {
      // 查找左侧的节点信息
      const leftTreeObj = this.$refs.tree
      const leftCheckNodes = leftTreeObj.getCheckedNodes()
      const leftResourceIds = []
      const leftNeedChildIds = []
      const leftHalfNeedChildIds = []

      leftCheckNodes.forEach((data) => {
        if (!leftTreeObj.getNode(data.resourceId).expanded) {
          leftHalfNeedChildIds.push(data.resourceId)
        }
        // 叶子节点或者已展开的节点为直接添加节点
        if (data.isLeaf || this.inArray(data.resourceId, this.leftExpandList) >= 0) {
          leftResourceIds.push(data.resourceId)
        } else {
          // 或者将该节点添加到需要查询子节点的列表
          leftNeedChildIds.push(data.resourceId)
        }
      })

      // 查找右边的节点信息
      const rTreeObj = this.$refs.rtree
      const rCheckNodes = rTreeObj.getCheckedNodes()
      const rResourceIds = []
      const rNeedChildIds = []
      const rHalfNeedChildIds = []
      rCheckNodes.forEach((data) => {
        if (!rTreeObj.getNode(data.resourceId).expanded) {
          rHalfNeedChildIds.push(data.resourceId)
        }
        // 叶子节点或者已展开的节点为直接添加节点
        if (data.isLeaf || this.inArray(data.resourceId, this.rightExpandList) >= 0) {
          rResourceIds.push(data.resourceId)
        } else {
          // 或者将该节点添加到需要查询子节点的列表
          rNeedChildIds.push(data.resourceId)
        }
      })
      // 获取父级资源id
      const resourceId = this.resourceItem.resourceId
      // 构造请求data数据
      return {
        roleId: this.roleId,
        parentResourceId: resourceId,
        rePerResourceIds: leftResourceIds.join(','),
        rePerNeedChildResourceIds: leftNeedChildIds.join(','),
        rePerHalfNeedChildResourceIds: leftHalfNeedChildIds.join(','),
        reAuthResourceIds: rResourceIds.join(','),
        reAuthNeedChildResourceIds: rNeedChildIds.join(','),
        reAuthHalfNeedChildResourceIds: rHalfNeedChildIds.join(',')
      }
    },
    // 返回
    fnBackToHome () {
      this.$router.push({ name: 'adminRoleManagement' })
    }
  }
}
</script>

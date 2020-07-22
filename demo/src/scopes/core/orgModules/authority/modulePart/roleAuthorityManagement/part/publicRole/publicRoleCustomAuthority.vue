<template>
  <div id="publicRoleCustomAuthority" class="fit">
    <ta-border-layout :layout="{header:'55px'}">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBack">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>自定义对象权限管理</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>
      <ta-alert :message="'当前角色为：'+role.roleName" type="info" showIcon class="notice-box"/>
      <ta-tabs class="fit content-box">
        <template slot="tabBarExtraContent">
          <ta-button-group>
            <ta-button @click="fnBack"><ta-icon type="rollback"/>返回</ta-button>
          </ta-button-group>
        </template>
        <ta-tab-pane tab="自定义对象权限">
          <ta-row class="fit">
            <ta-col
              :span="4"
              class="fit"
              style="border-right:1px solid #eee"
            >
              <div class="menu-title">
                <ta-icon type="menu-fold"></ta-icon>
                <span style="margin-left: 5px">自定义对象一级菜单</span>
              </div>
              <ta-divider style="margin: 0"></ta-divider>
              <ta-menu
                mode="inline"
                :selectedKeys="menuSelectedKeys"
                @click="onSelectMenu"
              >
                <ta-menu-item :key="item.id" v-for="item in menuData">
                  <ta-icon type="appstore"/>
                  {{item.name}}
                </ta-menu-item>
              </ta-menu>
            </ta-col>
            <ta-col :span="18" class="right-box">
              <div style="border: 1px solid #e8e8e8" class="fit">
                <div class="divider"></div>
                <ta-row style="height: 5%">
                  <ta-col :span="17" class="col-header">
                    可授权的自定义对象
                  </ta-col>
                  <ta-col :span="7" class="col-header">
                    有效期
                  </ta-col>
                </ta-row>
                <ta-divider/>
                <div class="authority-box">
                  <ta-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText"
                    style="width: 250px;margin-left: 10px;"
                  >
                  </ta-input>
                  <ta-button type="primary" @click="fnCustomAuthorityMgSave" class="button-save">权限保存</ta-button>
                  <ta-popover
                    placement="bottom"
                    trigger="manual"
                    :value="batchPop"
                    v-if="defaultCheckedList.length>0"
                  >
                    <div class="pop-calendar">
                      <ta-calendar :fullscreen="false" @change="onPanelChange"/>
                    </div>
                    <div style="float: right;margin-top: 10px;">
                      <ta-button @click="batchPop=false" size="small">取消</ta-button>
                      <ta-button @click="fnSaveCustomEffectiveTime(true)" size="small">设为永久</ta-button>
                      <ta-button type="primary" size="small" @click="fnSaveCustomEffectiveTime(false)">确定
                      </ta-button>
                    </div>
                    <ta-button slot="reference" size="small" @click="batchPop=true"
                               style="float: right;margin-right: 10px">批量设置有效期
                    </ta-button>
                  </ta-popover>
                  <ta-e-tree
                    v-if="authorityTree.length>0"
                    show-checkbox
                    :load="loadNode"
                    node-key="id"
                    ref="atree"
                    highlight-current
                    :props="defaultProps"
                    :expand-on-click-node="true"
                    :filter-node-method="filterNode"
                    :check-strictly="true"
                    @check="nodeCheck"
                    lazy
                  >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span v-if="data.loginAccess" style="color: #67c23a">{{ node.label }} (登录即可访问)</span>
                      <span>{{ node.label }}</span>
                      <span v-if="data.checked && !data.disabled" class="node-right">
                        {{data.effectTime?data.effectTime.split(' ')[0]:'永久'}}
                        <ta-popover v-if="data.checked"
                                    placement="bottom"
                                    trigger="manual"
                                    :value="data.id==indexClick">
                            <div class="pop-calendar">
                              <ta-calendar :fullscreen="false" @change="onPanelChange"/>
                            </div>
                            <div style="float: right;margin-top: 10px;">
                              <ta-button @click="indexClick=null" size="small">取消</ta-button>
                              <ta-button @click="onCustomCellChange(node,data,true)" size="small">设为永久</ta-button>
                              <ta-button type="primary" size="small" @click="onCustomCellChange(node,data,false)">确定
                              </ta-button>
                            </div>
                            <ta-icon style="color: @primary-color;margin-left: 10px;" slot="reference" type="edit"
                                     @click="indexClick = data.id"/>
                          </ta-popover>
                      </span>
                      <span v-else></span>
                    </span>
                  </ta-e-tree>
                </div>
              </div>
            </ta-col>
          </ta-row>
        </ta-tab-pane>
      </ta-tabs>
    </ta-border-layout>
  </div>
</template>
<script>
import $api from '../../api/index'

export default {
  name: 'publicRoleCustomAuthority',
  data () {
    return {
      effectiveTime: '',
      role: {},
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id',
        isLeaf: 'isLeaf'
      },
      indexClick: null,
      currentCheckedList: [],
      authorityTree: [],
      defaultCheckedList: [],
      menuData: [],
      rootId: '',
      popVisible: false,
      batchPop: false,
      filterText: '',
      menuSelectedKeys: [],
      // add By MinusZero
      menuSelectedNode: {},
      virtualTree: {},
      fullCheckList: [],
      halfCheckList: [],
      leafList: [],
      changed: false,
      expandList: [],
      tmp: null
    }
  },
  watch: {
    filterText (val) {
      this.$refs.atree.filter(val)
    }
  },
  methods: {
    // add By MinusZero On 2019-09-02
    // 节点异步加载
    loadNode (node, resolve) {
      // 构建顶级节点

      const topNode = this.menuSelectedNode

      if (node.level === 0) {
        const fullLocation = this.inArray(topNode.id, this.fullCheckList)
        const halfLocation = this.inArray(topNode.id, this.halfCheckList)
        topNode.idPath = [topNode.id]
        if (topNode.auth == false) {
          topNode.disabled = true
        }
        resolve([topNode])
        this.$nextTick(() => {
          const treeObj = this.$refs.atree
          if (halfLocation >= 0) {
            const node = treeObj.getNode(topNode.id)
            node.isLeaf = topNode.isLeaf
            node.indeterminate = true
          } else if (fullLocation >= 0) {
            treeObj.setChecked(topNode.id, true, false)
          } else {
            treeObj.setChecked(topNode.id, false, false)
          }
        })
        return
      }
      const nodeId = node.data.id
      // 展开当前节点时，保存为展开节点
      this.expandList.push(nodeId)
      const param = {
        roleId: this.role.roleId,
        resourceId: nodeId
      }
      let changed = false
      $api.queryCustomRePermissionAsync(param, (data) => {
        const menuCustomData = data.data.customRePermissions
        const idPath = node.data.idPath
        menuCustomData.forEach((data) => {
          if (data.auth == false) {
            data.disabled = true
          }
        })
        resolve(menuCustomData)
        menuCustomData.forEach((data) => {
          const inId = data.id
          const treeObj = this.$refs.atree
          const nodeTmp = treeObj.getNode(inId)
          nodeTmp.data.idPath = [...idPath, nodeTmp.data.id]
          const leafLocation = this.inArray(inId, this.leafList)
          nodeTmp.isLeaf = leafLocation >= 0

          // 如果上级已经手动勾选，则下级级联勾选
          if (node.checked) {
            nodeTmp.checked = true
            changed = true
          } else {
            if (!node.indeterminate) {
              nodeTmp.checked = false
              changed = true
            }
          }
        })
        if (!changed) {
          this.fullCheckList.forEach((data) => {
            const treeObj = this.$refs.atree
            treeObj.setChecked(data, true, false)
          })
          if (!node.checked) {
            this.halfCheckList.forEach((data) => {
              const treeObj = this.$refs.atree
              const nodeTmp = treeObj.getNode(data)
              if (nodeTmp != null) {
                nodeTmp.indeterminate = true
              }
            })
          }
        }
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

    // 查询左侧二级菜单
    fnQueryCustomUsePermissionByRoleId () {
      $api.queryCustomRePermissionByRoleId({ roleId: this.role.roleId }, (data) => {
        this.menuData = data.data.customRePermissions
        if (this.menuData && (this.menuData.length > 0)) {
          const id = this.menuData[0].id
          this.rootId = id
          this.menuSelectedKeys = [id]
          this.menuSelectedNode = this.menuData[0]
          this.fnQueryCustomUsePermissionByResourceId(id, 0)
        }
      })
    },

    // 根据点击左侧二级菜单查询右侧权限树
    fnQueryCustomUsePermissionByResourceId (id, index) {
      this.authorityTree = []
      $api.queryCustomRePermissionByRoleId({ roleId: this.role.roleId, resourceId: id }, (data) => {
        // 树状
        this.fullCheckList = data.data.full
        this.halfCheckList = data.data.half
        this.leafList = data.data.leaf
        this.defaultCheckedList = [...this.fullCheckList, ...this.halfCheckList]

        // 控制树显示
        this.$nextTick(() => {
          this.authorityTree = [this.menuSelectedNode]
          // 重新加载时，展开节点列表为 空
          this.expandList = []
          this.changed = false
        })
      })
    },

    getResourceTreeParam () {
      const treeObj = this.$refs.atree
      const checkNodes = treeObj.getCheckedNodes()
      const resourceIds = []
      const halfCheckNodes = treeObj.getHalfCheckedNodes()
      const needChildIds = []
      const halfNeedChild = []
      halfCheckNodes.forEach((data) => {
        if (!treeObj.getNode(data.id).expanded) {
          halfNeedChild.push(data.id)
        }
      })
      checkNodes.forEach((data) => {
        // 叶子节点或者已展开的节点为直接添加节点
        if (data.isLeaf || this.inArray(data.id, this.expandList) >= 0) {
          resourceIds.push(data.id)
        } else {
          // 或者将该节点添加到需要查询子节点的列表
          needChildIds.push(data.id)
        }
      })

      return {
        roleId: this.role.roleId,
        categoryId: this.rootId,
        resourceIds: resourceIds.join(','),
        needChildIds: needChildIds.join(','),
        halfNeedChildIds: halfNeedChild.join(',')
      }
    },

    // 节点check状态改变
    nodeCheck (nodeData, v, f) {
      if (!f) {
        return
      }
      const idPath = nodeData.idPath
      const treeObj = this.$refs.atree

      const nowNode = treeObj.getNode(nodeData.id)
      const status = nowNode.checked
      if (status) {
        this.changeCheckStatus(nowNode, status)
        for (let i = idPath.length - 2; i >= 0; i--) {
          const data = idPath[i]
          const node = treeObj.getNode(data)
          if (!node.checked) {
            node.indeterminate = true
          }
        }
        /* let node = treeObj.getNode(nodeData.id);
                    let child = node.childNodes;
                    child.forEach((data) => {
                        data.checked = true
                    })
                    idPath.forEach((data) => {
                        if (data !== nodeData.id) {
                            let node = treeObj.getNode(data);
                            node.indeterminate = true
                        }
                    }) */
      } else {
        this.changeCheckStatus(nowNode, status)
        for (let i = idPath.length - 2; i >= 0; i--) {
          const data = idPath[i]
          const node = treeObj.getNode(data)
          const child = node.childNodes
          node.checked = false
          node.indeterminate = false
          if (child != null && child.length > 0) {
            child.forEach((data) => {
              if (data.checked || data.indeterminate) {
                node.indeterminate = true
              }
            })
          }
        }
      }
      this.changed = false
    },

    changeCheckStatus (node, check) {
      node.indeterminate = false
      node.checked = check
      const child = node.childNodes
      if (child != null && child.length > 0) {
        child.forEach((data) => {
          this.changeCheckStatus(data, check)
        })
      }
    },

    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    fnBack () {
      this.$router.push({ name: 'publicRoleManager' })
    },
    onPanelChange (value, mode) {
      this.effectiveTime = value.format('YYYY-MM-DD')
    },
    onSelectMenu ({ item, key, keyPath }) {
      if (this.changed) {
        this.$confirm({
          title: '提示',
          content: '当前自定义对象修改未保存，是否保存?',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            // 因为保存回调中有使用 rootId 参数，提前设置
            this.rootId = key
            // 保存权限信息
            this.fnCustomAuthorityMgSave()
            // 选中信息切换
            this.menuSelectedKeys = keyPath
            this.menuSelectedNode = this.menuData[item.index]
          },
          onCancel: () => {
            // 不保存切换，需要同步对应选中数据
            this.rootId = key
            // 选中信息切换
            this.menuSelectedKeys = keyPath
            this.menuSelectedNode = this.menuData[item.index]

            this.fnQueryCustomUsePermissionByResourceId(key)
          }
        })
      } else {
        this.rootId = key
        // 选中信息切换
        this.menuSelectedKeys = keyPath
        this.menuSelectedNode = this.menuData[item.index]

        this.fnQueryCustomUsePermissionByResourceId(key)
      }
    },
    // 递归遍历树checked
    fnCreateCheckedCustomResourceIds (item, resourceIds) {
      if (item.children) {
        item.children.forEach((value) => {
          this.fnCreateCheckedCustomResourceIds(value, resourceIds)
        })
      }
      if (item.checked) {
        resourceIds.push(item.id)
      }
    },
    fnSaveCustomEffectiveTime (forever) {
      const param = this.getResourceTreeParam()
      param.effectTime = forever ? null : this.effectiveTime

      $api.updateBatchCustomResourceUsePermissionEffectiveTime(param, (data) => {
        this.$message.success('批量设置有效期成功')
        $api.queryCustomRePermissionByRoleId({ roleId: this.role.roleId }, (data) => {
          this.menuData = data.data.customRePermissions
          if (this.menuData && (this.menuData.length > 0)) {
            let menu = null
            this.menuData.forEach((data) => {
              if (data.id == this.rootId) {
                menu = data
              }
            })
            if (menu == null) {
              menu = this.menuData[0]
            }
            const id = menu.id
            this.rootId = id
            this.menuSelectedKeys = [id]
            this.menuSelectedNode = menu
            this.fnQueryCustomUsePermissionByResourceId(id, 0)
          }
        })
        this.batchPop = false
      })
    },
    onCustomCellChange (node, data, forever) {
      const param = {
        roleId: this.role.roleId,
        resourceId: data.id,
        effectTime: forever ? null : this.effectiveTime
      }
      $api.updateCustomResourceUsePermissionEffectiveTime(param, (data) => {
        node.data.effectTime = param.effectTime
        this.indexClick = null
      })
    },

    // 保存修改权限
    fnCustomAuthorityMgSave () {
      const param = this.getResourceTreeParam()
      $api.addCustomResourceUsePermission(param, (data) => {
        this.$message.success('保存自定义对象权限成功')
        $api.queryCustomRePermissionByRoleId({ roleId: this.role.roleId }, (data) => {
          this.menuData = data.data.customRePermissions
          if (this.menuData && (this.menuData.length > 0)) {
            let menu = null
            this.menuData.forEach((data) => {
              if (data.id == this.rootId) {
                menu = data
              }
            })
            if (menu == null) {
              menu = this.menuData[0]
            }
            const id = menu.id
            this.rootId = id
            this.menuSelectedKeys = [id]
            this.menuSelectedNode = menu
            this.fnQueryCustomUsePermissionByResourceId(id, 0)
          }
        })
      })
    }
  },

  activated () {
    if (this.$route.params.role instanceof Object) {
      this.role = this.$route.params.role || {}
      this.fnQueryCustomUsePermissionByRoleId()
    } else {
      this.$router.push({ name: 'publicRoleManager' })
    }
    this.batchPop = false
    this.indexClick = null
  }
}
</script>
<style type="text/less" lang="less">
  .pop-calendar {
    width: 300px; border: 1px solid #d9d9d9; borderRadius: 4px;
    .ant-select { width: 100px }
  }
</style>
<style scoped type="text/less" lang="less">

  .divider {
    position: absolute;
    top: 0;
    right: 30%;
    height: 100%;
    width: 1px;
    background-color: #e8e8e8;
    border-top: 10px solid #fff;
    border-bottom: 10px solid #fff;
    box-sizing: border-box;
    z-index: 1000;
  }

  .right-box {
    height: 100%;
    padding: 10px;
  }

  .ant-divider-horizontal {
    margin: 5px 0;
  }

  .authority-box {
    height: 90%;
    overflow: auto;
    .beautifyScrollbar();
  }

  .col-header {
    text-align: center;
    line-height: 50px;
  }

  .button-save {
    position: absolute;
    right: 30%;
    margin-right: 10px;
  }

  .menu-title {
    height: 39px;
    line-height: 39px;
    width: 100%;
    padding: 0 0 0 25px;
  }

  .notice-box {
    float: right;
    width: 100%;
  }

  .content-box {
    padding-top: 40px;
    overflow: visible;
  }

  .custom-tree-node {
    width:100%;
  }

  .node-right{
    float: right;
  }

</style>

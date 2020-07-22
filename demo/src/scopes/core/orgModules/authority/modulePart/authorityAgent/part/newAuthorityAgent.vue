<template>
  <div id="newAuthorityAgent">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-row :gutter="row.gutter">
        <ta-col :span="row.formCol.span">
          <ta-form-item label="被代理人员"
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="resourceUser"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择被代理人员' }]}">
            <ta-user-input selectTitle="被代理人员选择" :orgLoadFn="handleLoadOrgNode" :userLoadFn="handleQueryUserList"
                           :userSelectCall="handleGetUserListResult"></ta-user-input>
          </ta-form-item>
        </ta-col>
        <ta-col :span="row.formCol.span">
          <ta-form-item label="委派人员"
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="targetUser"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择委派人员' }]}">
            <ta-user-input selectTitle="委派人员选择" :orgLoadFn="handleLoadOrgNode" :userLoadFn="handleQueryTargetUserList"
                           :userSelectCall="handleGetTargetUserListResult"></ta-user-input>
          </ta-form-item>
        </ta-col>
        <ta-col :span="row.formCol.span">
          <ta-form-item label="委派截止日期"
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="effectiveTime"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择委派截止日期' }]}">
            <ta-date-picker style="width: 100%"/>
          </ta-form-item>
        </ta-col>
      </ta-row>
    </ta-form>

    <ta-tabs defaultActiveKey="1">
      <ta-tab-pane tab="功能菜单权限" key="1">
        <ta-row style="height: 300px;">
          <ta-col :span="4" class="fit" style="border-right: 1px solid #eee;">
            <ta-menu mode="inline" v-model="selectedKeys" @select="handleLoadUserPermission">
              <ta-menu-item :key="menu.resourceId" v-for="menu in authorityMenuList">
                <ta-icon type="appstore"/>
                {{menu.resourceName}}
              </ta-menu-item>
            </ta-menu>
          </ta-col>
          <ta-col class="fit row-tree-context" :span="20">
            <ta-e-tree :data="authorityTree"
                       show-checkbox
                       node-key="resourceId"
                       default-expand-all
                       ref="authorityTreeRef"
                       highlight-current
                       :props="defaultProps"
                       :default-checked-keys="checkedList">
            </ta-e-tree>
          </ta-col>
        </ta-row>
      </ta-tab-pane>
      <ta-tab-pane tab="授权对象权限" key="2">
        <ta-row style="height: 300px;">
          <ta-col :span="4" class="fit" style="border-right: 1px solid #eee;">
            <ta-menu mode="inline"
                     v-model="customSelectKey"
                     @click="onSelectCustom">
              <ta-menu-item :key="menu.id" v-for="menu in authorityCustomMenuList">
                <ta-icon type="appstore"/>
                {{menu.name}}
              </ta-menu-item>
            </ta-menu>
          </ta-col>
          <ta-col class="fit row-tree-context" :span="20">
            <ta-e-tree v-if="customTreeVisible === true"
                       :load="loadNode"
                       show-checkbox
                       node-key="id"
                       :expand-on-click-node="true"
                       ref="authorityCustomTreeRef"
                       highlight-current
                       :props="defaultCustomProps"
                       :check-strictly="true"
                       @check="nodeCheck"
                       lazy
            >
            </ta-e-tree>
          </ta-col>
        </ta-row>
      </ta-tab-pane>
    </ta-tabs>
  </div>
</template>
<script>
import $api from '../api'

export default {
  name: 'newAuthorityAgent',
  data () {
    return {
      // 布局相关参数
      row: {
        gutter: 16,
        formCol: {
          span: 8
        },
        col: {
          span: 12
        }
      },
      formItemLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      },
      // 被代理人员与委派人员
      curUserId: '',
      targetUserId: '',

      // 功能菜单权限 树
      authorityMenuList: [],
      authorityTree: [],
      defaultProps: {
        children: 'children',
        label: 'resourceName',
        id: 'resourceId'
      },
      halfCheckedList: [],
      checkedList: [],
      resourceIdList: [],
      selectedKeys: [],
      resourceId: '',
      // 授权对象权限 树
      authorityCustomMenuList: [],
      authorityCustomTree: [],
      defaultCustomProps: {
        children: 'children',
        label: 'name',
        id: 'id',
        isLeaf: 'isLeaf'
      },

      customResourceIdList: [],
      customResourceId: '',
      // Minus Zero
      customSelectItem: {},
      customSelectKey: [],
      customLeafList: [],
      customTreeVisible: false,
      expandList: [],
      // data cache
      customCache: {},
      customHalfCheck: [],
      customFullCheck: [],
      customChange: false

    }
  },
  methods: {
    loadNode (node, resolve) {
      const topNode = this.customSelectItem

      if (node.level === 0) {
        const fullLocation = this.inArray(topNode.id, this.customFullCheck)
        const halfLocation = this.inArray(topNode.id, this.customHalfCheck)
        topNode.idPath = [topNode.id]
        if (topNode.auth == false) {
          topNode.disabled = true
        }
        resolve([topNode])
        this.$nextTick(() => {
          const treeObj = this.$refs.authorityCustomTreeRef
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
        userId: this.curUserId,
        resourceId: nodeId
      }
      let changed = false
      $api.queryCustomUsePermissionAsync(param, (data) => {
        const menuCustomData = data.list
        const idPath = node.data.idPath
        menuCustomData.forEach((data) => {
          if (data.auth == false) {
            data.disabled = true
          }
        })
        resolve(menuCustomData)
        menuCustomData.forEach((data) => {
          const inId = data.id
          const treeObj = this.$refs.authorityCustomTreeRef
          const nodeTmp = treeObj.getNode(inId)
          nodeTmp.data.idPath = [...idPath, nodeTmp.data.id]
          const leafLocation = this.inArray(inId, this.customLeafList)
          nodeTmp.isLeaf = leafLocation >= 0
          data.isLeaf = nodeTmp.isLeaf
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
          this.customFullCheck.forEach((data) => {
            const treeObj = this.$refs.authorityCustomTreeRef
            treeObj.setChecked(data, true, false)
          })
          if (!node.checked) {
            this.customHalfCheck.forEach((data) => {
              const treeObj = this.$refs.authorityCustomTreeRef
              const nodeTmp = treeObj.getNode(data)
              if (nodeTmp != null) {
                nodeTmp.indeterminate = true
              }
            })
          }
        }
      })
    },
    nodeCheck (nodeData, v, f) {
      if (!f) {
        return
      }
      this.customChange = true

      const idPath = nodeData.idPath
      const treeObj = this.$refs.authorityCustomTreeRef

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
    inArray (key, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (key == arr[i]) {
          return i
        }
      }
      return -1
    },

    onSelectCustom ({ item, key, keyPath }) {
      const name = this.customSelectItem.name
      this.customSelectItem = this.authorityCustomMenuList[item.index]
      // get custom authority tree status
      const treeObj = this.$refs.authorityCustomTreeRef
      const halfCheck = treeObj.getHalfCheckedKeys()
      const fullCheck = treeObj.getCheckedKeys()
      // cache data
      if (this.customChange) {
        const oldKey = this.customSelectKey[0]
        if (halfCheck.length > 0 || fullCheck.length > 0) {
          this.customCache[oldKey] = {
            half: halfCheck,
            full: fullCheck,
            result: this.getResourceTreeParam(oldKey)
          }
        }
      }

      // put data
      const oldCustomData = this.customCache[key]
      if (oldCustomData != null) {
        this.customHalfCheck = oldCustomData.half
        this.customFullCheck = oldCustomData.full
      } else {
        this.customHalfCheck = []
        this.customFullCheck = []
      }

      this.handleLoadCustomUserPermission(key)
    },

    getResourceTreeParam (categoryId) {
      const treeObj = this.$refs.authorityCustomTreeRef
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
        categoryId: categoryId,
        resourceIds: resourceIds,
        needChildIds: needChildIds,
        halfNeedChildIds: halfNeedChild
      }
    },
    handleLoadOrgNode (node, resolve) {
      const nodeOrgId = (node.data && node.data.orgId) || ''
      $api.loadOrgTree({ orgId: nodeOrgId }, (data) => {
        resolve(data.orgTree)
      })
    },
    handleGetTargetUserListResult (dataObj) {
      this.targetUserId = dataObj.userId
    },
    handleGetUserListResult (dataObj) {
      if (dataObj) {
        this.curUserId = dataObj.userId
        $api.queryUsePermissionByUserId({
          userId: dataObj.userId
        }, (data) => {
          this.authorityMenuList = data.usePermissionPos
          if(this.authorityMenuList[0]){
            this.handleLoadUserPermission(this.authorityMenuList[0])
          }
        })
        $api.queryCustomUsePermissionByUserId({
          userId: dataObj.userId
        }, (data) => {
          this.authorityCustomMenuList = data.customUsePermissionPos
          if (this.authorityCustomMenuList.length > 0) {
            // 如果大于 1， 默认选择 第一个
            this.customSelectItem = this.authorityCustomMenuList[0]
            // this.customSelectKey = [this.customSelectItem.id]
            this.handleLoadCustomUserPermission(this.customSelectItem.id)
          }
        })

        // 每次选择被代理人员之后需要初始化
        this.authorityTree = []
        this.authorityCustomTree = []
        this.resourceId = ''
        this.customResourceId = ''
        this.checkedList = []
        this.halfCheckedList = []

        // MinusZero
        this.customResourceIdList = []
        this.expandList = []
        this.customCache = {}
        this.customChange = false
        this.customTreeVisible = false
      }
    },
    handleLoadUserPermission (menuItem) {
      // 添加或覆盖
      if (this.resourceId !== null && this.resourceId !== '') {
        const checkedList = this.$refs.authorityTreeRef.getCheckedKeys()
        const index = this.resourceIdList.indexOf(this.resourceId)
        if (checkedList.length !== 0) {
          const halfCheckedList = this.$refs.authorityTreeRef.getHalfCheckedKeys()
          if (index === -1) {
            this.checkedList.push(checkedList)
            this.halfCheckedList.push(halfCheckedList)
            this.resourceIdList.push(this.resourceId)
          } else {
            this.checkedList.splice(index, 1, checkedList)
            this.halfCheckedList.splice(index, 1, halfCheckedList)
          }
        } else {
          if (index !== -1) {
            this.checkedList.splice(index, 1)
            this.halfCheckedList.splice(index, 1)
          }
        }
      }

      // 检测是正常的事件调用还是save方法主动调用，
      // save方法主动调用传递的是this.resourceId
      if (this.resourceId !== menuItem) {
        let tempId = menuItem.key ? menuItem.key : menuItem.resourceId
        this.resourceId = tempId
        this.selectedKeys = [tempId]
        $api.queryUsePermissionByUserId({
          userId: this.curUserId,
          resourceId: tempId
        }, (data) => {
          this.authorityTree = data.usePermissionPos
          // 回显
          const index = this.resourceIdList.indexOf(this.resourceId)
          if (index !== -1) {
            this.$refs.authorityTreeRef.setCheckedKeys(this.checkedList[index])
          }
        })
      }
    },
    /**
             *  加载右侧自定义资源树的 叶子节点信息和控制 树的显示
             */
    handleLoadCustomUserPermission (key) {
      this.customTreeVisible = false
      this.customChange = false
      this.customResourceId = key
      this.customSelectKey = [key]
      $api.queryCustomUsePermissionByUserId({
        userId: this.curUserId,
        resourceId: key
      }, (data) => {
        this.customLeafList = data.leafList
        this.customTreeVisible = true
      })
    },
    getCustomUsePermissionResult (key) {
      const customMenuList = this.authorityCustomMenuList
      const result = {
        resourceIds: [],
        needChildIds: [],
        halfNeedChildIds: []
      }
      customMenuList.forEach(menu => {
        const menuId = menu.id
        let tmp
        if (menuId == key) {
          if (this.customChange) {
            tmp = this.getResourceTreeParam(key)
          } else {
            const obj = this.customCache[menu.id]
            if (obj != null) {
              tmp = this.customCache[menu.id].result
            }
          }
        } else {
          const obj = this.customCache[menu.id]
          if (obj != null) {
            tmp = this.customCache[menu.id].result
          }
        }
        if (tmp != null) {
          result.resourceIds = [...result.resourceIds, ...tmp.resourceIds]
          result.needChildIds = [...result.needChildIds, ...tmp.needChildIds]
          result.halfNeedChildIds = [...result.halfNeedChildIds, ...tmp.halfNeedChildIds]
        }
      })
      return result
    },
    handleQueryUserList ({ orgId, userId, includeChild, pageSize, pageNum, searchVal, searchType, searchParam }, resolve) {
      $api.queryUserList({
        orgId,
        userId,
        includeChild,
        pageSize,
        pageNum,
        searchVal,
        searchType,
        searchParam
      }, (data) => {
        resolve(data.reAgentVos.list)
      })
    },
    handleQueryTargetUserList ({ orgId, userId, includeChild, pageSize, pageNum, searchVal, searchType, searchParam }, resolve) {
      $api.queryUserList({
        orgId,
        userId,
        includeChild,
        pageSize,
        pageNum,
        searchVal,
        searchType,
        searchParam
      }, (data) => {
        const list = data.reAgentVos.list && data.reAgentVos.list.filter(el => {
          if (this.curUserId == el.userId) {
            return false
          } else {
            return true
          }
        }) || []
        resolve(list)
      })
    },
    fnNewAgentRole () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.fnSave()
        }
      })
    },
    fnSave () {
      // 判断保存的时候显示的树是否是菜单权限，是的话进行更新数据的操作
      this.authorityMenuList.forEach(item => {
        if (item.resourceId === this.resourceId) {
          this.handleLoadUserPermission(this.resourceId)
        }
      })

      // 判断保存的时候显示的树是否是对象权限，是的话进行更新数据的操作
      const customResult = this.getCustomUsePermissionResult(this.customResourceId)

      // 检测是否选中一级菜单，也就是是否选中需要代理的权限
      if (this.checkedList.length === 0 && customResult.resourceIds.length === 0 && customResult.needChildIds.length === 0) {
        this.$message.error('未选择要代理的权限，不能保存！')
        return
      }

      // 在第一个参数中将二维数组展开为一维数组
      $api.addAuthorityAgent({
        targetUserId: this.targetUserId,
        authoritySelectArray: [...[].concat.apply([], this.checkedList), ...[].concat.apply([], this.halfCheckedList)],
        customResourceIds: customResult.resourceIds.join(','),
        customNeedChildIds: customResult.needChildIds.join(','),
        customHalfNeedIds: customResult.halfNeedChildIds.join(','),
        authorityCustomSelectArray: [],
        effectiveTime: this.form.getFieldValue('effectiveTime').format('YYYY-MM-DD') + ' 23:59:59',
        theAgent: this.curUserId
      }, (data) => {
        this.$message.success('新增代理角色成功')
        this.$emit('refreshAgentRole')
      })
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .row-tree-context {
    overflow: auto;
    .beautifyScrollbar()
  }
</style>

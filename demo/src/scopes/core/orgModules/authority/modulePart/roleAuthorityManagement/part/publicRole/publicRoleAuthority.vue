<template>
  <div id="publicRoleAuthority" class="fit">
    <ta-border-layout :layout="{header:'55px'}">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBack">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>功能菜单权限管理</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>
      <ta-alert :message="'当前角色为：'+role.roleName" type="info" showIcon class="notice-box"/>
      <ta-tabs class="fit content-box">
        <template slot="tabBarExtraContent">
          <ta-button-group>
            <ta-button @click="fnBack"><ta-icon type="rollback"/>返回</ta-button>
          </ta-button-group>
        </template>
        <ta-tab-pane tab="功能菜单权限">
          <ta-row class="fit">
            <ta-col :span="4" class="fit" style="border-right: 1px solid #eee;">
              <div class="menu-title">
                <ta-icon type="menu-fold"></ta-icon>
                <span style="margin-left: 5px">功能一级菜单</span>
              </div>
              <ta-divider style="margin: 0"></ta-divider>
              <ta-menu
                mode="inline"
                :selectedKeys="menuSelectedKeys"
                @click="onSelectMenu"
              >
                <ta-menu-item :key="item.resourceId" v-for="item in menuData">
                  <ta-icon type="appstore" />{{item.name}}
                </ta-menu-item>
              </ta-menu>
            </ta-col>
            <ta-col :span="18" class="right-box">
              <div style="border: 1px solid #e8e8e8" class="fit" v-if="authrityTree.length>0">
                <div class="divider"></div>
                <ta-row style="height: 5%">
                  <ta-col :span="17" class="col-header">
                    可授权的功能菜单
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
                  <ta-button type="primary" @click="fnAuthorityMgSave" class="button-save" >权限保存</ta-button>
                  <ta-popover
                    placement="bottom"
                    trigger="manual"
                    :value="batchPop"
                    v-if="defaultCheckedList.length>0"
                  >
                    <div class="pop-calendar">
                      <ta-calendar :fullscreen="false" @select="onPanelChange"/>
                    </div>
                    <div style="float: right;margin-top: 10px;">
                      <ta-button @click="batchPop=false" size="small">取消</ta-button>
                      <ta-button @click="fnSaveAuthorityEffectiveTime(true)" size="small">设为永久</ta-button>
                      <ta-button type="primary" size="small" @click="fnSaveAuthorityEffectiveTime(false)">确定
                      </ta-button>
                    </div>
                    <ta-button  slot="reference" @click="batchPop=true"
                                style="float: right;margin-right: 10px">批量设置有效期
                    </ta-button>
                  </ta-popover>
                  <ta-e-tree
                    :data="authrityTree"
                    show-checkbox
                    node-key="resourceId"
                    ref="atree"
                    highlight-current
                    :props="defaultProps"
                    :default-checked-keys="defaultCheckedList"
                    default-expand-all
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                    @check="onNodeCheck"
                  >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span v-if="data.loginAccess" style="color: #67c23a">{{ node.label }} (登录即可访问)</span>
                      <span v-else>{{ node.label }}</span>
                      <div v-if="data.restUrlAuthorityPoList" class="resturl-box">
                        <ta-col  :ref="data.restUrlAuthorityPoList[0].resourceId">
                          <ta-checkbox v-for="item in data.restUrlAuthorityPoList" :key="item.urlId" :value="item" :defaultChecked="item.checked=='1'?true:false">{{item.urlName}}</ta-checkbox>
                        </ta-col>
                      </div>
                      <span v-if="data.checked" class="node-right">
                        {{data.effectTime?data.effectTime.split(' ')[0]:'永久'}}
                        <ta-popover
                          placement="bottom"
                          trigger="manual"
                          :value="data.resourceId==indexClick">
                            <div class="pop-calendar">
                              <ta-calendar :fullscreen="false" @select="onPanelChange"/>
                            </div>
                            <div style="float: right;margin-top: 10px;">
                              <ta-button @click="indexClick=null" size="small">取消</ta-button>
                              <ta-button size="small" @click="onCellChange(node,data,true)">设为永久</ta-button>
                              <ta-button type="primary" size="small" @click="onCellChange(node,data,false)">确定
                              </ta-button>
                            </div>
                            <ta-icon style="color: @primary-color;margin-left: 10px;" slot="reference" type="edit"
                                     @click="indexClick = data.resourceId"/>
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
const menuColumns = [{
  title: '一级功能菜单',
  dataIndex: 'name'
}]
export default {
  name: 'publicRoleAuthority',
  data () {
    return {
      menuColumns,
      selectedRowKeys: [],
      effectiveTime: '',
      role: {},
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'resourceId',
        disabled: 'loginAccess'
      },
      indexClick: null,
      allCheckedList: [],
      currentCheckedList: [],
      tempCheckedList: [],
      authrityTree: [],
      defaultCheckedList: [],
      menuData: [],
      rootId: '',
      popVisible: false,
      batchPop: false,
      filterText: '',
      menuSelectedKeys: [],
      tempNodeCheck: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.atree.filter(val)
    }
  },
  methods: {
    onNodeCheck (node, nodeKeys) {
      let selectArray = []
      selectArray = [...nodeKeys.checkedKeys, ...nodeKeys.halfCheckedKeys]
      // 过滤出相比上次删除的
      const delNode = this.tempNodeCheck.filter(el => {
        return !selectArray.includes(el)
      })
      // 过滤出相比上次新增的
      const addNode = selectArray.filter(el => {
        return !this.tempNodeCheck.includes(el)
      })
      this.tempNodeCheck = selectArray
      addNode.forEach((value) => {
        const checkBoxGroup = this.$refs[value]
        if (checkBoxGroup) {
          const checkBoxArrays = checkBoxGroup.$children
          console.log(checkBoxArrays)
          checkBoxArrays.forEach((value, index) => {
            // value.$emit("update:disabled",false);
            // value.disabled = false;
            this.$nextTick(() => {
              value.$el.click()
            })
          })
        }
      })
      delNode.forEach((value) => {
        const checkBoxGroup = this.$refs[value]
        if (checkBoxGroup) {
          const checkBoxArrays = checkBoxGroup.$children
          checkBoxArrays.forEach((value, index) => {
            if (value.$refs.vcCheckbox.$refs.input.checked) {
              value.$el.click()
            }
            // value.disabled = true;
            value.$emit('update:disabled', true)
          })
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    fnBack () {
      this.$router.push(
        {
          name: 'publicRoleManager'
        }
      )
    },
    onPanelChange (value, mode) {
      this.effectiveTime = value.format('YYYY-MM-DD')
    },
    onSelectMenu ({ item, key, keyPath }) {
      let selectArry = []
      const treeObj = this.$refs.atree
      selectArry = [...selectArry, ...treeObj.getCheckedKeys(), ...treeObj.getHalfCheckedKeys()]
      // 过滤掉登录即可访问的菜单
      // 注释该段逻辑 2019-11-25 by zhouhy
      // selectArry = selectArry.filter(el => {
      //   return !treeObj.getNode(el).data.loginAccess
      // })
      if (!(this.currentCheckedList.sort().toString() === selectArry.sort().toString())) {
        this.$confirm({
          title: '提示',
          content: '当前菜单授权修改未保存，是否保存?',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            this.rootId = key
            this.fnAuthorityMgSave()
            this.menuSelectedKeys = keyPath
          },
          onCancel: () => {
            this.menuSelectedKeys = keyPath
            this.fnQueryRePermissionByResourceId(key)
          }
        })
      } else {
        this.menuSelectedKeys = keyPath
        this.fnQueryRePermissionByResourceId(key)
      }
    },
    // 递归遍历权限树下所有的resouceId
    fnCreateResourceIds (item, resourceIds) {
      if (item.children) {
        item.children.forEach((value) => {
          this.fnCreateResourceIds(value, resourceIds)
        })
      }
      resourceIds.push(item.resourceId)
    },
    // 递归查找checked
    fnCreateCheckedResourceIds (item, resourceIds) {
      if (item.children) {
        item.children.forEach((value) => {
          this.fnCreateCheckedResourceIds(value, resourceIds)
        })
      }
      if (item.checked) {
        resourceIds.push(item.resourceId)
      }
    },
    fnSaveAuthorityEffectiveTime (forever) {
      const resourceIds = []
      this.fnCreateCheckedResourceIds(this.authrityTree[0], resourceIds)
      const param = {
        roleId: this.role.roleId,
        resourceIds: resourceIds.join(','),
        effectTime: forever ? null : this.effectiveTime
      }
      $api.updateBatchUsePermissionEffectiveTime(param, (data) => {
        this.$message.success('批量设置有效期成功')
        this.fnQueryRePermissionByResourceId(this.rootId)
        this.batchPop = false
      })
      this.indexClick = null
    },
    onCellChange (node, data, forever) {
      const param = {
        roleId: this.role.roleId,
        resourceId: data.resourceId,
        effectTime: forever ? null : this.effectiveTime
      }
      $api.updateUsePermissionEffectiveTime(param, (data) => {
        this.$message.success('修改有效期成功')
        this.fnQueryRePermissionByResourceId(this.rootId)
        this.indexClick = null
      })
    },
    fnAuthorityMgSave () {
      let selectArry = []
      const treeObj = this.$refs.atree
      selectArry = [...selectArry, ...treeObj.getCheckedKeys(), ...treeObj.getHalfCheckedKeys()]
      // 过滤掉登录即可访问的菜单
      selectArry = selectArry.filter(el => {
        return !treeObj.getNode(el).data.loginAccess
      })
      selectArry = [...selectArry, ...this.tempCheckedList]
      $api.addUsePermission({ roleId: this.role.roleId, resourceIds: selectArry.join(',') }, (data) => {
        this.fnSaveRestUrl()
      })
    },
    fnSaveRestUrl () {
      let selectArry = []
      const treeObj = this.$refs.atree
      selectArry = [...selectArry, ...treeObj.getCheckedKeys(), ...treeObj.getHalfCheckedKeys()]
      const jsonArray = []
      selectArry.forEach((value) => {
        const checkBoxGroup = this.$refs[value]
        if (checkBoxGroup) {
          const checkBoxArrays = checkBoxGroup.$children
          checkBoxArrays.forEach((el) => {
            if (el.$refs.vcCheckbox.$refs.input.checked) {
              jsonArray.push({
                resourceId: el.value.resourceId,
                urlId: el.value.urlId
              })
            }
          })
        }
      })
      $api.changeRestAuthority({ roleId: this.role.roleId, resourceId: this.rootId, jsonArray: JSON.stringify(jsonArray) }, (data) => {
        this.$message.success('保存功能菜单权限成功')
        this.fnQueryRePermissionByResourceId(this.rootId)
      })
    },
    // 查询左侧二级菜单
    fnQueryRePermissionByRoleId () {
      $api.queryRePermissionByRoleId({ roleId: this.role.roleId }, (data) => {
        this.menuData = data.data.rePermissions
        // 默认选中右侧第一个二级菜单
        this.$nextTick(() => {
          this.menuSelectedKeys = [this.menuData[0].resourceId]
          this.fnQueryRePermissionByResourceId(this.menuData[0].resourceId, 0)
        })
      })
    },
    // 根据点击左侧二级菜单查询右侧权限树
    fnQueryRePermissionByResourceId (resourceId, index) {
      this.rootId = resourceId
      this.defaultCheckedList = []
      $api.queryRePermissionByRoleId({ roleId: this.role.roleId, resourceId: resourceId }, (data) => {
        this.authrityTree = data.data.rePermissions
        // 当前选中权限
        this.currentCheckedList = data.data.checkedList
        // 所有选中权限
        this.allCheckedList = data.data.allCheckedList
        // 过滤掉当前显示权限树中选中的权限
        this.tempCheckedList = this.allCheckedList.filter(el => {
          return !data.data.checkedList.includes(el)
        })
        this.$nextTick(() => {
          const arrySelect = []
          data.data.checkedList.forEach((value, index) => {
            const node = this.$refs.atree.getNode(value)
            if (node.isLeaf) {
              arrySelect.push(node.data.resourceId)
            }
          })
          this.defaultCheckedList = arrySelect
          this.tempNodeCheck = data.data.checkedList
        })
      })
    }
  },
  activated () {
    if (this.$route.params.role instanceof Object) {
      this.role = this.$route.params.role || {}
      this.fnQueryRePermissionByRoleId()
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

  .button-save{
    position: absolute;
    right: 30%;
    margin-right: 10px;
  }

  .menu-title{
    height: 39px;
    line-height: 39px;
    width:100%;
    padding: 0 0 0 25px;
  }

  .notice-box{
    float:right;
    width:100%;
  }

  .content-box{
    padding-top: 40px;
    overflow: visible;
  }

  .resturl-box {
    display: inline-block;
    position: absolute;
    right: 30%;
  }

  .custom-tree-node {
    width:100%;
  }

  .node-right{
    float: right;
  }
</style>

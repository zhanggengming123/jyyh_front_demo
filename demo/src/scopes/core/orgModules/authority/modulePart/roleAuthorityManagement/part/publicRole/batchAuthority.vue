<template>
  <div id="batchAuthority" class="fit">
    <ta-border-layout :layout="{header:'55px'}">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBack">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item v-if="batchType=='add'">批量授权</ta-breadcrumb-item>
          <ta-breadcrumb-item v-else>批量回收权限</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>
      <ta-alert :message="'当前批量操作的角色为：'+roleNames" type="info" showIcon class="notice-box" />
      <ta-tabs class="fit content-box" defaultActiveKey="1" @change="onTabsChange">
        <template slot="tabBarExtraContent">
          <ta-button-group>
            <ta-button @click="fnBack"><ta-icon type="rollback"/>返回</ta-button>
          </ta-button-group>
        </template>
        <ta-tab-pane tab="功能菜单权限" key="1">
          <ta-row class="fit">
            <ta-col :span="4"
                    class="fit"
                    style="border-right: 1px solid #eee"
            >
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
            <ta-col :span="14" class="right-box">
              <div style="border:1px solid #e8e8e8" class="fit" v-if="authrityTree.length>0">
                <ta-row style="height: 5%">
                  <ta-col :span="24" class="col-header">
                    可操作功能菜单权限
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
                  <ta-button type="primary" @click="fnSave" class="button-save" v-if="batchType=='add'">批量授予</ta-button>
                  <ta-button type="primary" @click="fnSave" class="button-save" v-else>批量回收</ta-button>
                  <ta-e-tree
                    :data="authrityTree"
                    show-checkbox
                    node-key="resourceId"
                    ref="atree"
                    highlight-current
                    :props="defaultProps"
                    default-expand-all
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                  >
                  </ta-e-tree>
                </div>
              </div>
            </ta-col>
          </ta-row>
        </ta-tab-pane>
<!--        <ta-tab-pane tab="自定义对象权限" key="2">-->
<!--          <ta-row class="fit">-->
<!--            <ta-col :span="4" class="fit" style="border-right: 1px solid #eee">-->
<!--              <div class="menu-title">-->
<!--                <ta-icon type="menu-fold"></ta-icon>-->
<!--                <span style="margin-left: 5px">自定义对象一级菜单</span>-->
<!--              </div>-->
<!--              <ta-divider style="margin: 0"></ta-divider>-->
<!--              <ta-menu-->
<!--                mode="inline"-->
<!--                :selectedKeys="customMenuSelectedKeys"-->
<!--                @click="onSelectCustomMenu"-->
<!--              >-->
<!--                <ta-menu-item :key="item.id" v-for="item in menuCustomData">-->
<!--                  <ta-icon type="appstore"/>-->
<!--                  {{item.name}}-->
<!--                </ta-menu-item>-->
<!--              </ta-menu>-->
<!--            </ta-col>-->
<!--            <ta-col :span="14" class="right-box">-->
<!--              <div style="border: 1px solid #e8e8e8" class="fit" v-if="authrityCustomTree.length>0">-->
<!--                <ta-row style="height: 5%">-->
<!--                  <ta-col :span="24" class="col-header">-->
<!--                    可操作自定义对象权限-->
<!--                  </ta-col>-->
<!--                </ta-row>-->
<!--                <ta-divider/>-->
<!--                <div class="authority-box">-->
<!--                  <ta-input-->
<!--                    placeholder="输入关键字进行过滤"-->
<!--                    v-model="filterCustomText"-->
<!--                    style="width: 250px;margin-left: 10px;"-->
<!--                  >-->
<!--                  </ta-input>-->
<!--                  <ta-button type="primary" @click="fnSave" class="button-save" v-if="batchType=='add'">批量授予</ta-button>-->
<!--                  <ta-button type="primary" @click="fnSave" class="button-save" v-else>批量回收</ta-button>-->
<!--                  <ta-e-tree-->
<!--                    :data="authrityCustomTree"-->
<!--                    show-checkbox-->
<!--                    node-key="id"-->
<!--                    ref="btree"-->
<!--                    highlight-current-->
<!--                    :props="defaultCustomProps"-->
<!--                    default-expand-all-->
<!--                    :expand-on-click-node="false"-->
<!--                    :filter-node-method="filterNode"-->
<!--                  >-->
<!--                  </ta-e-tree>-->
<!--                </div>-->
<!--              </div>-->
<!--            </ta-col>-->
<!--          </ta-row>-->
<!--        </ta-tab-pane>-->
      </ta-tabs>
    </ta-border-layout>
  </div>
</template>
<script>
import $api from '../../api/index'

export default {
  name: 'batchAuthority',
  data () {
    return {
      roles: [],
      roleNames: '',
      batchType: '',
      activeKey: '1',
      menuData: [],
      menuCustomData: [],
      authrityTree: [],
      authrityCustomTree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'resourceId'
      },
      defaultCustomProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      filterText: '',
      filterCustomText: '',
      menuSelectedKeys: [],
      customMenuSelectedKeys: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.atree.filter(val)
    },
    filterCustomText (val) {
      this.$refs.btree.filter(val)
    }
  },
  methods: {
    // 返回
    fnBack () {
      this.$router.push({ name: 'publicRoleManager' })
    },
    // tabs切换事件
    onTabsChange (activeKey) {
      this.activeKey = activeKey
    },
    onSelectMenu ({item, key, keyPath}) {
      this.menuSelectedKeys = keyPath
      this.fnQueryRePermissionByResourceId(key)
    },
    onSelectCustomMenu ({item, key, keyPath}) {
      this.customMenuSelectedKeys = keyPath
      this.fnQueryReCustomPermissionByResourceId(key)
    },
    // 查询左侧功能资源二级菜单
    fnQueryRePermissionByRoleId () {
      $api.queryRePermission(null, (data) => {
        this.menuData = data.data.rePermissions
        // 默认选中右侧第一个二级菜单
        this.$nextTick(() => {
          this.menuSelectedKeys = [this.menuData[0].resourceId]
          this.fnQueryRePermissionByResourceId(this.menuData[0].resourceId)
        })
      })
    },
    // 根据点击左侧功能资源二级菜单查询右侧权限树
    fnQueryRePermissionByResourceId (resourceId) {
      $api.queryRePermission({resourceId: resourceId}, (data) => {
        this.authrityTree = data.data.rePermissions
      })
    },
    // 查询左侧授权对象二级菜单
    fnQueryReCustomPermissionByRoleId () {
      $api.queryCustomRePermission(null, (data) => {
        this.menuCustomData = data.data.customRePermissions
        // 默认选中右侧第一个二级菜单
        this.$nextTick(() => {
          this.customMenuSelectedKeys = this.menuCustomData.length ? [this.menuCustomData[0].id] : []
          this.fnQueryReCustomPermissionByResourceId(this.menuData[0].id)
        })
      })
    },
    // 根据点击授权对象二级菜单查询右侧授权对象权限树
    fnQueryReCustomPermissionByResourceId (resourceId) {
      $api.queryCustomRePermission({resourceId: resourceId}, (data) => {
        this.authrityCustomTree = data.data.customRePermissions
      })
    },
    // 过滤权限树
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    fnSave () {
      if (this.batchType === 'add') {
        this.fnAddBatch()
      } else {
        this.fnDeleteBatch()
      }
    },
    // 批量授权
    fnAddBatch () {
      let roleIds = []
      this.roles.forEach((value, index) => {
        roleIds.push(value.roleId)
      })
      let param = {}
      param = {roleIds: roleIds.join(',')}
      if (this.activeKey == '1') {
        let treeObj = this.$refs.atree
        let selectArray = [...treeObj.getCheckedKeys(), ...treeObj.getHalfCheckedKeys()]
        param.resourceIds = selectArray.join(',')
      } else if (this.activeKey == '2') {
        let treeObj = this.$refs.btree
        let selectArray = [...treeObj.getCheckedKeys(), ...treeObj.getHalfCheckedKeys()]
        param.customResourceIds = selectArray.join(',')
      }
      $api.addBatchUsePermissionByMoreRole(param, (data) => {
        this.$message.success('批量授权成功')
      })
    },
    // 批量回收权限
    fnDeleteBatch () {
      let roleIds = []
      this.roles.forEach((value, index) => {
        roleIds.push(value.roleId)
      })

      let param = {}
      param = {roleIds: roleIds.join(',')}
      if (this.activeKey == '1') {
        let treeObj = this.$refs.atree
        let selectArray = [...treeObj.getCheckedKeys(), ...treeObj.getHalfCheckedKeys()]
        param.resourceIds = selectArray.join(',')
      } else if (this.activeKey == '2') {
        let treeObj = this.$refs.btree
        let selectArray = [...treeObj.getCheckedKeys(), ...treeObj.getHalfCheckedKeys()]
        param.customResourceIds = selectArray.join(',')
      }
      $api.deleteBatchUsePermissionByMoreRole(param, (data) => {
        this.$message.success('批量回收权限成功')
      })
    }
  },
  activated () {
    if (this.$route.params.roles instanceof Object) {
      this.roles = this.$route.params.roles
      let rolesNameArray = []
      this.roles.forEach((value, index) => {
        rolesNameArray.push(value.roleName)
      })
      this.roleNames = rolesNameArray.join('，')
      this.batchType = this.$route.params.batchType

      this.fnQueryRePermissionByRoleId()
      this.fnQueryReCustomPermissionByRoleId()
    } else {
      this.$router.push({name: 'publicRoleManager'})
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .notice-box{
    float:right;
    width:100%;
  }

  .content-box{
    padding-top: 40px;
    overflow: visible;
  }

  .menu-title{
    height: 39px;
    line-height: 39px;
    width:100%;
    padding: 0 0 0 25px;
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
    right: 20px;
  }
</style>

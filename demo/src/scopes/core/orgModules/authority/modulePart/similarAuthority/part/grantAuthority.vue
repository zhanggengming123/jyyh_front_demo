<template>
  <div id="publicRoleCustomAuthority" class="fit" >
    <ta-border-layout :layout="{header:'55px'}" v-if="role.length">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="$router.push({name: 'similarAuthority'})">相似权限管理</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>相似权限授权</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>
      <ta-alert :message="'当前角色为：'+ getNames() " type="info" showIcon class="notice-box"/>
      <ta-tabs class="fit content-box">
        <template slot="tabBarExtraContent">
          <ta-button-group>
            <ta-button @click="$router.push({name: 'similarAuthority'})"><ta-icon type="rollback"/>返回</ta-button>
          </ta-button-group>
        </template>
        <ta-tab-pane tab="相似权限">
          <ta-row class="fit">
            <ta-col :span="4" class="fit" style="border-right:1px solid #eee">
              <div class="menu-title">
                <ta-icon type="menu-fold"></ta-icon>
                <span style="margin-left: 5px;">相似权限一级菜单</span>
              </div>
              <ta-divider style="margin: 0"></ta-divider>
              <ta-menu mode="inline" :selectedKeys="menuSelectedKeys" @click="onSelectMenu">
                <ta-menu-item :key="item.resourceId" v-for="item in menuData">
                  <ta-icon type="appstore"/>
                  {{item.name}}
                </ta-menu-item>
              </ta-menu>
            </ta-col>
            <ta-col :span="20" class="right-box">
              <div class="info-box">
                <div class="col-header">可授权的自定义对象</div>
                <div class="divider"></div>
                <div class="search-box">
                  <ta-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 250px;"/>
                  <ta-button type="primary" @click="saveAuthority" class="button-save">权限保存</ta-button>
                </div>
                <div class="tree-box">
                  <ta-e-tree :data="treeData" @check-change="treeCheck" show-checkbox :expand-on-click-node="false" :default-expand-all="true" highlight-current node-key="resourceId" :props="defaultProps" ref="roleTree" :filter-node-method="filterNode">
                    <span slot-scope="{ node, data }">
                      <span>{{data.name}}</span>
                      <ta-checkbox-group class="grant-checkbox" v-if="data.restUrlAuthorityPoList.length" :ref="data.restUrlAuthorityPoList[0].resourceId">
                        <ta-checkbox v-for="item in data.restUrlAuthorityPoList" :value="item.urlId" :key="item.urlId" @click="onChangeCheckbox($event,item)">{{item.urlName}}</ta-checkbox>
                      </ta-checkbox-group>
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
import $api from '../api/index'
export default {
  name: '',
  data () {
    return {
      menuSelectedKeys: [],
      menuData: [],
      treeData: [],
      roleIds: [],
      defaultProps: { // 菜单组织结构
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf',
        id: 'resourceId'
      },
      filterText: '',
      grantCheckbox: [],
      resourceId: ''
    }
  },
  watch: {
    filterText (val) {
      this.$refs.roleTree.filter(val)
    }
  },
  computed: {
    role () {
      return this.$route.params.roles || []
    },
    grantCheckUrlIDs () {
      const result = []
      this.grantCheckbox.map((item) => {
        result.push(item.urlId)
      })
      return result
    }
  },
  activated () {
    if (!this.role.length) {
      this.$router.push({ name: 'similarAuthority' })
    }
    this.queryOne()
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getNames () {
      const names = [], roleIds = []
      this.role.map((item) => {
        names.push(item.roleName)
        roleIds.push(item.roleId)
      })
      this.roleIds = roleIds
      return names.join('、')
    },
    queryOne () {
      $api.queryRePermissionResource(null, (data) => {
        this.menuData = data.customRePermissions
        this.menuSelectedKeys = [this.menuData[0].resourceId]
        this.queryTwo(this.menuData[0].resourceId)
      })
    },
    queryTwo (resourceId) {
      $api.queryRePermissionResource({ resourceId: resourceId }, (data) => {
        this.treeData = data.customRePermissions
      })
    },
    onSelectMenu ({ item, key, keyPath }) {
      const resourceIds = this.$refs.roleTree.getCheckedKeys() || []
      const urlIds = this.grantCheckUrlIDs || []
      this.resourceId = key
      if (resourceIds.length || urlIds.length) {
        this.$confirm({
          title: '提示',
          content: '当前相似权限修改未保存，是否保存?',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            this.saveAuthority()
          },
          onCancel: () => {
            this.grantCheckbox = []
            this.filterText = ''
            this.menuSelectedKeys = keyPath
            this.queryTwo(key)
          }
        })
      } else {
        this.grantCheckbox = []
        this.filterText = ''
        this.menuSelectedKeys = keyPath
        this.queryTwo(key)
      }
    },
    treeCheck (checkedNodes, checked) {
      const urlList = checkedNodes.restUrlAuthorityPoList, urlRefs = this.$refs[checkedNodes.resourceId]
      if (urlList.length) {
        urlRefs.$children.map((item) => {
          if ((this.grantCheckUrlIDs.indexOf(item.value) == -1) === checked) {
            item.$el.click()
          }
        })
      }
    },
    onChangeCheckbox ($event, item) {
      const checked = $event.target.checked
      if (checked) {
        this.grantCheckbox.push({ resourceId: item.resourceId, urlId: item.urlId })
      } else {
        this.grantCheckbox = this.grantCheckbox.filter((i) => i.urlId != item.urlId)
      }
    },
    saveAuthority () {
      const resourceIds = this.$refs.roleTree.getCheckedKeys()
      const jsonArray = this.grantCheckbox
      const param = { roleIds: this.roleIds.join(','), resourceIds: resourceIds.join(','), resourceId: this.resourceId, jsonArray: JSON.stringify(jsonArray) }
      $api.addBatchSimilarAuthority(param, (data) => {
        this.$message.success('授权成功')
        this.$refs.roleTree.setCheckedKeys([])
      })
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .menu-title { height: 39px; line-height: 39px; width: 100%; padding: 0 0 0 25px; overflow: hidden }
  .notice-box { float: right; width: 100%; }
  .content-box { padding-top: 40px; overflow: visible; }
  .right-box { height: 100%; padding: 10px; }
  .info-box { width: 100%; height: 100%; border: solid 1px #e8e8e8; position: relative;}
  .col-header { text-align: center; line-height: 50px; border-bottom: solid 1px #e8e8e8 }
  .search-box { margin: 5px 10px}
  .tree-box { position: absolute; top: 95px; left: 10px; right: 10px; bottom: 10px; overflow: auto; .beautifyScrollbar(); }
  .button-save { float: right }
  .grant-checkbox { margin-left: 30px; }
</style>

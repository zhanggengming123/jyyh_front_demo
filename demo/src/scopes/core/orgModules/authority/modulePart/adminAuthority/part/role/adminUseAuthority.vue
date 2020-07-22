<template>
  <div class="fit">
    <ta-border-layout  :layout="{header:'55px'}" :center-cfg="{showBar:true}" :header-cfg="{showBorder: false}" :showBorder="false" :footer-cfg="{showBorder: false}">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBackToHome">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>功能使用权限</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>
      <div slot="centerExtraContent">
        <ta-alert :message="'当前角色为：'+this.$route.query.roleName" type="info" showIcon/>
      </div>
      <ta-tabs class="fit">
        <ta-tab-pane tab="功能使用权限">
          <ta-row>
            <ta-col :span="4" class="fit" style="border-right: 1px solid #eee;">
              <admin-left-menu title="功能使用一级菜单"
                               :data="menuData"
                               @click="onSelectMenu"
                               :selectedKeys="menuSelectedKeys">
              </admin-left-menu>
            </ta-col>
            <ta-col :span="18" class="right-box fit">
              <div style="border: 1px solid #e8e8e8" class="fit">
                <!--显示表格中间的竖线-->
                <div class="divider"></div>
                <!--定义左右表格列名-->
                <ta-row style="height: 5%">
                  <ta-col :span="19" class="col-header">
                    可授权的功能菜单
                  </ta-col>
                  <ta-col :span="5" class="col-header">
                    有效期
                  </ta-col>
                </ta-row>
                <ta-divider/>
                <div class="authority-box">
                  <ta-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText"
                    style="width: 250px;margin-left: 10px;">
                  </ta-input>
                  <ta-button type="primary" @click="fnSaveAdminUsePermission('refresh')" class="button-save">权限保存</ta-button>
                  <!--begin 批量设置有效期日期弹出框-->
                  <ta-popover
                    placement="bottom"
                    trigger="manual"
                    :value="batchPop">
                    <div class="pop-calendar">
                      <ta-calendar :fullscreen="false" @select="onPanelChange"/>
                    </div>
                    <div style="float: right;margin-top: 10px;">
                      <ta-button @click="batchPop=false" size="small">取消</ta-button>
                      <ta-button @click="fnSaveAuthorityEffectiveTime(true)" size="small">设为永久</ta-button>
                      <ta-button type="primary" size="small" @click="fnSaveAuthorityEffectiveTime(false)">确定
                      </ta-button>
                    </div>
                    <ta-button slot="reference" @click="batchPop = true" style="float: right;margin-right: 10px">批量设置有效期
                    </ta-button>
                  </ta-popover>
                  <!--end 批量设置有效期日期弹出框-->
                  <ta-e-tree :data="adminUseTreeData"
                             show-checkbox
                             node-key="resourceId"
                             ref="tree"
                             highlight-current
                             :props="defaultProps"
                             :default-checked-keys="defaultKeys"
                             :filter-node-method="filterNode"
                             :expand-on-click-node="false"
                             style="min-height: 300px"
                             default-expand-all>
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                      <span v-if="data.checked" style="float: right">
                        {{!data.effectTime|| null == data.effectTime?'永久':moment(data.effectTime).format('YYYY-MM-DD')}}
                        <!--begin 设置单个有效期-->
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
                            <ta-icon style="color:@primary-color;margin-left: 10px;" slot="reference" type="edit"
                                     @click="indexClick = data.resourceId"/>
                          </ta-popover>
                        <!--end 设置单个有效期-->
                      </span>
                      <span v-else></span>
                    </span>
                  </ta-e-tree>
                </div>
              </div>
            </ta-col>
          </ta-row>
        </ta-tab-pane>
        <template slot="tabBarExtraContent">
          <ta-button @click="fnBackToHome"><ta-icon type="rollback"/>返回</ta-button>
        </template>
      </ta-tabs>
    </ta-border-layout>
  </div>
</template>
<script>
import $api from '../../api/index'
import AdminLeftMenu from './adminLeftMenu'
import moment from 'moment'

export default {
  name: 'adminUseAuthority',
  components: { AdminLeftMenu },
  data () {
    return {
      indexClick: null,
      menuSelectedKeys: [], // 默认选中的数据
      filterText: '', // 过滤菜单
      batchPop: false, // 批量设置有效期
      effectiveTime: '', // 有效时间
      menuData: [], // 左侧菜单栏列表
      adminUseTreeData: [], // 管理员使用权限树数据
      defaultKeys: [], // 使用权限树默认选中的数据
      defaultProps: {// 默认树属性
        children: 'children',
        label: 'name',
        id: 'resourceId'
      },
      resourceItem: {}, // 资源信息
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
    this.adminUseTreeData = []
    this.defaultKeys = []
    this.batchPop = false
    this.indexClick = null
    this.fnLoadDefault()
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 时间处理函数
    moment,
    // 筛选
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 修改有效期
    onCellChange (node, data, forever) {
      const dd = {
        roleId: this.roleId,
        resourceId: data.resourceId,
        effectTime: forever ? null : this.effectiveTime
      }
      $api.updateAdminUsePermissionEffectiveTime(dd, () => {
        this.$message.success('更新有效期成功')
        this.fnQueryUsePermissionByResourceId(this.resourceItem)
        this.indexClick = null
        this.batchPop = false
      })
    },
    // 批量保存授权时间
    fnSaveAuthorityEffectiveTime (forever) {
      const resourceIds = this.$refs.tree.getCheckedNodes(false, true).map((node) => {
        return node.resourceId
      })
      const data = {
        roleId: this.roleId,
        resourceIds: resourceIds.join(','),
        effectTime: forever ? null : this.effectiveTime
      }
      $api.saveBatchAdminUsePermissionEffectiveTime(data, dd => {
        this.$message.success('批量设置有效期成功')
        this.fnQueryUsePermissionByResourceId(this.resourceItem)
        this.indexClick = null
        this.batchPop = false
      })
    },
    onPanelChange (value, mode) {
      this.effectiveTime = value.format('YYYY-MM-DD')
    },
    onSelectMenu ({ item, key, keyPath }) {
      if (this.resourceItem.resouceId === key) {
        return
      }
      let selectArry = []
      const treeObj = this.$refs.tree
      selectArry = [...selectArry, ...treeObj.getCheckedKeys(true)]
      // let selectArry = this.$refs.tree.getCheckedKeys(true);
      const newData = [...this.menuData]
      const menuItem = newData.filter(item => key === item.resourceId)[0]
      if (!(this.defaultKeys.sort().toString() === selectArry.sort().toString())) {
        this.$confirm({
          title: '提示',
          content: '当前使用授权权限修改未保存，是否保存?',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            this.fnSaveAdminUsePermission()
            this.menuSelectedKeys = keyPath
            this.fnQueryUsePermissionByResourceId(menuItem)
          },
          onCancel: () => {
            this.menuSelectedKeys = keyPath
            this.fnQueryUsePermissionByResourceId(menuItem)
          }
        })
      } else {
        this.menuSelectedKeys = keyPath
        this.fnQueryUsePermissionByResourceId(menuItem)
      }
    },
    // 保存管理员使用权限树
    fnSaveAdminUsePermission (type) {
      const resourceIds = this.$refs.tree.getCheckedNodes(false, true).map((node) => {
        return node.resourceId
      })
      const data = {
        roleId: this.roleId,
        resourceIds: resourceIds.join(','),
        parentResourceId: this.resourceItem.resourceId,
        resourceType: this.resourceItem.resourceType
      }
      $api.saveAdminUsePermission(data, dd => {
        this.$message.success('更新数据成功')
        // 重新加载组织数据,如果是当期页面进行保存才进行刷新,其他进行跳转不需要刷新
        if (type == 'refresh') {
          this.fnQueryUsePermissionByResourceId(this.resourceItem)
        }
      })
    },
    fnLoadDefault () {
      const data = {
        roleId: this.roleId
      }
      $api.queryUseSysPermission(data, dd => {
        this.menuData = dd.data.resourceList
        this.$nextTick(() => {
          if (this.menuData && this.menuData.length > 0) {
            // 默认加载数组第一条数据
            this.menuSelectedKeys = [this.menuData[0].resourceId]
            this.fnQueryUsePermissionByResourceId(this.menuData[0])
          }
        })
      })
    },
    // 点击左侧列表,加载右侧使用权限树
    fnQueryUsePermissionByResourceId (item) {
      this.resourceItem = item
      const data = {
        roleId: this.roleId,
        idPath: item.idPath
      }
      $api.queryUsePermissionByResourceId(data, dd => {
        this.adminUseTreeData = dd.data.resourceTree
        // this.currentCheckedList = dd.data.usePermissionList;
        const selectedKeys = dd.data.usePermissionList.map(v => {
          return v.resourceId
        })
        // 清空选中项
        this.defaultKeys = []
        // 设置选中元素
        this.$nextTick(() => {
          selectedKeys.forEach(nodeKey => {
            const node = this.$refs.tree.getNode(nodeKey)
            if (node && node.isLeaf) {
              this.defaultKeys.push(node.data.resourceId)
            }
          })
          this.$refs.tree.setCheckedKeys(this.defaultKeys, true)
        })
      })
    },
    // 返回
    fnBackToHome () {
      this.$router.push({ name: 'adminRoleManagement' })
    }
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
  .active {
    display: block;
    background-color: #e9f8ff;
  }

  .custom-tree-node {
    width: 100%;
  }

  .divider {
    position: absolute;
    top: 0;
    right: 20%;
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
    right: 20%;
    margin-right: 10px;
  }

  .menu-title {
    height: 39px;
    line-height: 39px;
    width: 100%;
    padding: 0 0 0 25px;
  }
</style>

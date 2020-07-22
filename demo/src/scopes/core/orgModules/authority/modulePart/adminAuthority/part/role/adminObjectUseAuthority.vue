<template>
  <div class="fit">
    <ta-border-layout  :layout="{header:'55px'}" :center-cfg="{showBar:true}" :header-cfg="{showBorder: false}" :showBorder="false" :footer-cfg="{showBorder: false}">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBackToHome">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>自定义功能使用权限</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>
      <div slot="centerExtraContent">
        <ta-alert :message="'当前角色为：'+this.$route.query.roleName" type="info" showIcon/>
      </div>
      <ta-tabs class="fit">
        <ta-tab-pane tab="自定义功能使用权限">
          <ta-row class="fit">
            <ta-col :span="4" class="fit" style="border-right: 1px solid #eee;">
              <admin-left-menu title="自定义使用一级菜单"
                               :data="menuData"
                               :selectedKeys="menuSelectedKeys"
                               @click="onSelectMenu">
              </admin-left-menu>
            </ta-col>
            <ta-col :span="18" class="right-box fit">
              <div style="border: 1px solid #e8e8e8" class="fit">
                <!--显示表格中间的竖线-->
                <div class="divider"></div>
                <!--定义左右表格列名-->
                <ta-row style="height: 5%">
                  <ta-col :span="19" class="col-header">
                    可授权的自定义功能菜单
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
                  <ta-button type="primary" @click="fnSaveAdminObjectUsePermission('refresh')" class="button-save">权限保存
                  </ta-button>
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
                    <ta-button slot="reference" @click="batchPop=true"
                               style="float: right;margin-right: 10px">批量设置有效期
                    </ta-button>
                  </ta-popover>
                  <!--end 批量设置有效期日期弹出框-->
                  <ta-e-tree :data="adminUseTree"
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
                            <ta-icon class="icon-style"  slot="reference" type="edit"
                                     @click="indexClick = data.resourceId"/>
                          </ta-popover>
                        <!--end 设置单个有效期-->
                      </span>
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
  name: 'adminObjectUseAuthority',
  components: { AdminLeftMenu },
  data () {
    return {
      clickIndex: 0, // 点击的下标
      menuData: [], // 左侧菜单栏列表
      adminUseTree: [], // 管理员使用权限树
      defaultKeys: [], // 使用权限树默认选中的数据
      defaultProps: {// 默认树属性
        children: 'children',
        label: 'name',
        id: 'resourceId'
      },
      resourceItem: {}, // 资源id
      row: {
        col: {
          span: 12
        }
      },
      item: {}, // 组织人员信息
      roleId: '', // 角色id
      menuSelectedKeys: [], // 选中的数据
      effectiveTime: '', // 有效时间
      indexClick: null,
      filterText: '', // 过滤菜单
      batchPop: false// 批量设置有效期
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
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
    this.adminUseTree = []
    this.defaultKeys = []
    this.batchPop = false
    this.indexClick = null
    this.fnLoadDefault()
  },
  methods: {
    // 日期处理函数
    moment,
    onPanelChange (value, mode) {
      this.effectiveTime = value.format('YYYY-MM-DD')
    },
    // 修改有效期
    onCellChange (node, data, forever) {
      const dd = {
        roleId: this.roleId,
        resourceId: data.resourceId,
        effectTime: forever ? null : this.effectiveTime
      }
      $api.updateAdminObjectUsePermissionEffectiveTime(dd, () => {
        this.$message.success('更新有效期成功')
        this.fnQueryObjectUsePermissionByResourceId(this.resourceItem)
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
      $api.updateBatchAdminObjectUsePermissionEffectiveTime(data, dd => {
        this.$message.success('批量设置有效期成功')
        this.fnQueryObjectUsePermissionByResourceId(this.resourceItem)
        this.indexClick = null
        this.batchPop = false
      })
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
      // let selectArry = this.$refs.tree.getCheckedKeys(true);
      const newData = [...this.menuData]
      const menuItem = newData.filter(item => key === item.resourceId)[0]
      if (!(this.defaultKeys.sort().toString() === selectArry.sort().toString())) {
        this.$confirm({
          title: '提示',
          content: '当前自定义使用权限修改未保存，是否保存?',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            this.fnSaveAdminObjectUsePermission()
            this.menuSelectedKeys = keyPath
            this.fnQueryObjectUsePermissionByResourceId(menuItem)
          },
          onCancel: () => {
            this.menuSelectedKeys = keyPath
            this.fnQueryObjectUsePermissionByResourceId(menuItem)
          }
        })
      } else {
        this.menuSelectedKeys = keyPath
        this.fnQueryObjectUsePermissionByResourceId(menuItem)
      }
    },
    // 保存管理员对象使用权限树
    fnSaveAdminObjectUsePermission (type) {
      const resourceIds = this.$refs.tree.getCheckedNodes(false, true).map((node) => {
        return node.resourceId
      })
      const data = {
        roleId: this.roleId,
        resourceIds: resourceIds.join(','),
        parentResourceId: this.resourceItem.resourceId
      }
      $api.saveAdminObjectUsePermission(data, dd => {
        this.$message.success('更新数据成功')
        if (type == 'refresh') {
          this.fnQueryObjectUsePermissionByResourceId(this.resourceItem)
        }
      })
    },
    fnLoadDefault () {
      const data = {
        roleId: this.roleId
      }
      $api.queryObjectUseSysPermission(data, dd => {
        this.menuData = dd.data.customResourceList
        this.$nextTick(() => {
          if (this.menuData && (this.menuData.length > 0)) {
            // 默认加载数组第一条数据
            this.menuSelectedKeys = [this.menuData[0].resourceId]
            this.fnQueryObjectUsePermissionByResourceId(this.menuData[0])
          }
        })
      })
    },
    // 点击左侧列表,加载右侧使用权限树
    fnQueryObjectUsePermissionByResourceId (item) {
      this.resourceItem = item
      const data = {
        roleId: this.roleId,
        resourceId: item.resourceId
      }
      $api.queryObjectUsePermissionByResourceId(data, dd => {
        this.adminUseTree = dd.data.customResourceTree
        const selectedKeys = dd.data.usePermissionList.map(v => {
          return v.resourceId
        })
        this.defaultKeys = []
        // 设置选中元素
        this.$nextTick(() => {
          selectedKeys.forEach(nodeKey => {
            var node = this.$refs.tree.getNode(nodeKey)
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
  .icon-style{
    color:@primary-color;margin-left: 10px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
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

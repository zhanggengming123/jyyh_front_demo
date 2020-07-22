<template>
  <div id="roleManagement" class="fit">
    <ta-border-layout :layout="{header:'55px',footer:'70px'}"
                      :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}"
                      :header-cfg="{showBorder: false}" :showBorder="false" :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-input-search placeholder="请输入角色名称"
                         @search="onSearchRole"
                         class="search-box"
                         v-model="searchInfo">
          <ta-button slot="enterButton" type="primary">搜索</ta-button>
        </ta-input-search>
      </div>
      <div slot="centerExtraContent">
        <ta-cascader style="width: 250px;margin-right: 10px;"
                     :url='casCaderOrgUrl'
                     treeId="orgVos"
                     expandTrigger="hover"
                     :options.sync="options"
                     :changeOnSelect="true"
                     @change="fnQueryAdmin"
                     :fieldNames="{ label: 'orgName', value: 'orgId', children: 'children' }"
                     placeholder="请选择组织机构"
                     v-model="orgId"
                     :loadedDataCallBack="fnLoadedOrgCallBack"/>
        <ta-checkbox :checked="includeSub" @change="onChangeIsSub">包含子组织</ta-checkbox>

        <ta-tag-select title="状态"
                       :data="CollectionData('STATE')"
                       v-model="selectFilter"
                       @change="filterClick">
        </ta-tag-select>

        <div style="float: right">
          <ta-button @click="fnAddAdmin" type="primary">新增角色</ta-button>
          <!--begin 批量操作按钮-->
          <ta-dropdown :trigger="clickTrigger">
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认启用所选管理员角色?" cancelText="取消" okText="确认" @confirm="fnBatchPickAdmin(false)">
                  <ta-icon type="check-circle"></ta-icon>
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认禁用所选管理员角色?" cancelText="取消" okText="确认" @confirm="fnBatchBanAdmin(false)">
                  <ta-icon type="stop"/>
                  <span class="mg-l12">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length" @click="deleteVisible = true">
                <ta-icon type="close-circle"/>
                删除
              </ta-menu-item>
              <!--<ta-menu-item @click="fnGrantAuthority">授予使用权限</ta-menu-item>-->
              <!--<ta-menu-item @click="fnRevokeAuthority">回收使用权限</ta-menu-item>-->
            </ta-menu>
            <ta-button>批量操作
              <ta-icon type="down"/>
            </ta-button>
          </ta-dropdown>

          <!--end 批量操作按钮-->
        </div>
      </div>
      <!--begin 加载组织人员数据-->
      <ta-table :columns="adminColumns"
                :dataSource="adminData"
                rowKey="roleId"
                :rowSelection="{selectedRowKeys: selectedRowKeys,onChange:fnOnChange}"
                autoExpandParent
                :pagination="false"
                :scroll="{ x: 1200 }"
                ref="adminRef">
        <template slot="customOrgName" slot-scope="text,record">
          <span
            :class="{'invalidStyle': record.effective == '0' || record.expire == '1' }">{{text}}</span>
          <!--</a>-->
        </template>
        <span slot="namePath" slot-scope="text">{{getLastName(text)}}</span>
        <template slot="effecttime" slot-scope="text,record">
          <span :class="{'invalidStyle': record.expire == '1' }">
            {{record.effectiveTime == null?'永久':moment(record.effectiveTime).format('YYYY-MM-DD')}}
          </span>
        </template>
        <span slot="expire" slot-scope="text">
            <ta-tag v-if="text == '0'" type="success" class='no-cursor'>未过期</ta-tag>
            <ta-tag v-else-if="text == '1'" type="danger" class='no-cursor'>过期</ta-tag>
        </span>
        <!--处理有效标识-->
        <span slot="effective" slot-scope="text">{{CollectionLabel('STATE',text)}}</span>
        <span slot="action" slot-scope="text,record">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
        <template slot="adminMg" slot-scope="text,record">
          <span v-if="record.effective == '1'">
            <router-link :to="{ path: 'adminUserMg' , query: {roleName:record.roleName,roleId:record.roleId}}">
              人员管理
            </router-link>
          </span>
          <span v-else title="禁用的管理员角色不允许进行人员管理">
            <span class="invalidStyle">人员管理</span>
          </span>
          <!--begin 权限管理界面-->
          <ta-divider type="vertical"/>
          <span v-if="record.effective == '1'">
            <ta-dropdown :trigger="clickTrigger">
              <a class="ant-dropdown-link">权限管理
                <ta-icon type="down"/>
              </a>
              <ta-menu slot="overlay">
                <ta-menu-item>
                  <a @click="fnToPath('adminUseAuthority',record)">功能使用权限</a>
                </ta-menu-item>
                <ta-menu-item>
                  <router-link
                    :to="{ path: 'adminGrantAuthority' , query: {roleName:record.roleName,roleId:record.roleId}}">授权权限</router-link>
                </ta-menu-item>
                <ta-menu-item>
                  <router-link
                    :to="{ path: 'adminOrgAuthority' , query: {roleName:record.roleName,roleId:record.roleId}}">组织范围权限</router-link>
                </ta-menu-item>
              </ta-menu>
            </ta-dropdown>
          </span>
          <span v-else title="禁用的管理员角色不允许进行权限管理">
            <span class="ant-dropdown-link invalidStyle">权限管理
              <ta-icon type="down"/>
            </span>
          </span>
          <!--end 权限管理界面-->
          <ta-divider type="vertical"/>
          <span v-if="record.effective == '1'">
            <ta-dropdown :trigger="clickTrigger">
              <a class="ant-dropdown-link">自定义权限管理
                <ta-icon type="down"/>
              </a>
              <ta-menu slot="overlay">
               <!-- <ta-menu-item>
                  <a @click="fnToPath('adminObjectUseAuthority',record)">自定义功能使用权限</a>
                </ta-menu-item>-->
                <ta-menu-item>
                  <router-link
                    :to="{ path: 'adminObjectGrantAuthority' , query: {roleName:record.roleName,roleId:record.roleId}}">自定义授权权限</router-link>
                </ta-menu-item>
              </ta-menu>
            </ta-dropdown>
          </span>
          <span v-else title="禁用的管理员角色不允许进行自定义权限管理">
            <span class="ant-dropdown-link invalidStyle">自定义权限管理
              <ta-icon type="down"/>
            </span>
          </span>
        </template>
      </ta-table>
      <!--end 加载组织人员数据-->
      <!--begin 分页信息-->
      <div slot="footer">
        <ta-pagination style="float: right;margin-top: 10px"
                       showSizeChanger
                       showQuickJumper
                       :dataSource.sync="adminData"
                       :defaultPageSize="10"
                       :params="adminPageParams"
                       :url="adminTableUrl"
                       ref="adminPager"/>
      </div>
      <!--end 分页信息-->

    </ta-border-layout>
    <!--使用权限模态框加载-->
    <ta-modal :visible="batch.visible"    :centered="true" :destroyOnClose="true"
              width="800px" @cancel="batch.visible=false" :bodyStyle="{'height':'400px'}">
      <template slot="title">
        <div style="text-align: center">
          {{batch.title}}
        </div>
      </template>
      <template slot="footer">
        <div style="text-align: center">
          <ta-button @click="batch.visible = false">取消</ta-button>
          <ta-button type="primary" @click="fnSaveModalAuthority">保存</ta-button>
        </div>
      </template>
      <ta-row :gutter="10" style="width: 100%">
        <ta-col :span="row.col.span">
          <span class="title">使用权限</span>
          <div class="filter">
            <ta-input placeholder="请输入资源名称" v-model="adminLeftFilterText"/>
          </div>
          <div class="modalTreeStyle">
            <ta-e-tree :data="leftTreeData"
                       :props="modalDefaultProps"
                       :filter-node-method="filterNode"
                       :default-checked-keys="leftDefaultKeys"
                       show-checkbox
                       highlight-current
                       node-key="resourceId"
                       ref="tree">
            </ta-e-tree>
          </div>
        </ta-col>
        <ta-col :span="row.col.span">
          <span class="title">对象使用权限</span>
          <div class="filter">
            <ta-input placeholder="请输入资源名称" v-model="adminRightFilterText"/>
          </div>
          <div class="modalTreeStyle">
            <ta-e-tree :data="rightTreeData"
                       :props="modalDefaultProps"
                       :filter-node-method="filterNode"
                       :default-checked-keys="rightDefaultKeys"
                       show-checkbox
                       highlight-current
                       node-key="resourceId"
                       ref="rtree">
            </ta-e-tree>
          </div>
        </ta-col>
      </ta-row>
    </ta-modal>

    <!--新增管理员角色-->
    <ta-drawer destroyOnClose
               width="500"
               :title="adminDrawerTitle"
               placement="right"
               closable
               @close="fnCloseAdminDrawer"
               :visible="adminDrawerVisible"
               :get-container="()=>this.$el.parentNode.parentNode"
               footerHeight>
      <div slot="footer">
        <ta-button-group>
          <ta-button @click="fnResetForm">重置</ta-button>
          <ta-button type="primary" @click="fnAddAdminInfo">保存</ta-button>
        </ta-button-group>
      </div>
      <add-admin :admin="adminItem" @closeAdminDrawer="fnCloseAdminDrawer" ref="addAdmin"></add-admin>
    </ta-drawer>
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="fnDeleteBatchAdmin(false)"
                       title="管理员角色删除" description="所选管理员角色"></ta-careful-delete>
  </div>
</template>

<script>
import $api from '../../api/index'
import moment from 'moment'
import AddAdmin from './addAdmin'

const adminColumns = [
  {
    title: '角色名称',
    width: 120,
    dataIndex: 'roleName',
    overflowTooltip: true,
    scopedSlots: { customRender: 'customOrgName' }
  },
  {
    title: '组织路径',
    width: 120,
    dataIndex: 'namePath',
    overflowTooltip: 'namePath',
    scopedSlots: { customRender: 'namePath' }
  },
  {
    title: '角色描述',
    width: 120,
    dataIndex: 'roleDesc',
    overflowTooltip: true
  },
  {
    title: '有效期',
    width: 120,
    dataIndex: 'effecttime',
    scopedSlots: { customRender: 'effecttime' }
  }, {
    title: '是否过期',
    width: 120,
    dataIndex: 'expire',
    scopedSlots: { customRender: 'expire' }
  }, {
    title: '状态',
    width: 120,
    dataIndex: 'effective',
    yesOrNoTag: true,
    scopedSlots: { customRender: 'effective' }
  },
  {
    title: '角色操作',
    dataIndex: 'operation',
    width: 150,
    align: 'center',
    scopedSlots: { customRender: 'action' }
  },

  {
    title: '管理',
    dataIndex: 'adminMg',
    width: 340,
    align: 'center',
    scopedSlots: { customRender: 'adminMg' }
  }
]
export default {
  name: 'adminRoleManagement',
  components: { AddAdmin },
  data () {
    return {
      searchInfo: '', // 角色名称搜索
      clickTrigger: ['click'], // 点击触发
      selectFilter: [], // 过滤的元素信息
      casCaderOrgUrl: 'org/authority/adminAuthorityManagementRestService/queryCurrentAdminRoleWrapOrgTree', // 级联组织选择url
      adminTableUrl: 'org/authority/adminAuthorityManagementRestService/queryAdminRoleByOrgId', // 管理员分页url
      options: [],
      orgId: [], // 级联选择框的数组id
      includeSub: true, // 是否包含子组织,默认包含
      adminDrawerTitle: '', // 抽屉标题
      adminLeftFilterText: '', // 模态框左侧搜索栏
      adminRightFilterText: '', // 模态框右侧搜索栏
      leftTreeData: [], // 模态框左侧数据
      rightTreeData: [], // 模态框右侧数据
      leftDefaultKeys: [], // 模态框左侧默认选中数据
      rightDefaultKeys: [], // 模态框右侧默认选中数据
      modalDefaultProps: {
        label: 'name'
      },
      adminColumns, // 左侧管理员信息表格列属性
      operateMenu: [{
        name: '编辑',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的管理员角色不允许进行编辑' : '',
        onClick: (record) => {
          this.fnEditAdmin(record)
        }
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该管理员角色?',
          onOk: (record) => {
            this.fnBatchPickAdmin(record)
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该管理员角色?',
          onOk: (record) => {
            this.fnBatchBanAdmin(record)
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该管理员角色?',
          onOk: (record) => {
            this.fnDeleteBatchAdmin(record)
          }
        }]
      }],
      adminData: [], // 左侧管理员数据
      selectedRows: [], // 左侧的选择数据
      selectedRowKeys: [],
      adminDrawerVisible: false, // 是否展示新增管理员抽屉
      adminItem: {}, // 选中的记录
      batch: {
        title: '', // 批量操作的标题
        visible: false, // 是否打开模态框
        type: 'grant'// 批量操作类型,有grant,授予权限,以及revoke,回收使用权限
      },
      arrayData: {}, // 行数据
      isDetailShow: false, // 是否展示详细信息
      row: { // 对布局进行排列
        col: {
          span: 12
        }
      },
      deleteVisible: false,
      currentTime: ''
    }
  },
  mounted () {
    this.currentTime = moment().format('YYYY-MM-DD HH:MM:SS')
  },
  watch: {
    // 过滤左边树
    adminLeftFilterText (val) {
      this.$refs.tree.filter(val)
    },
    // 过滤右边树
    adminRightFilterText (val) {
      this.$refs.rtree.filter(val)
    }
  },
  methods: {

    fnOnChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    moment, // 处理时间的方法
    onSearchRole (val) {
      this.fnLoadDefaultAdmin()
    },
    // 点击过滤
    filterClick () {
      this.fnLoadDefaultAdmin()
    },
    // 获取路径的最后一个
    getLastName (name) {
      return name && name.indexOf('/') != -1 ? name.slice(name.lastIndexOf('/') + 1) : name
    },
    // 新增管理员信息
    fnAddAdminInfo () {
      this.$refs.addAdmin.fnAddAdminInfo()
    },
    // 重置表单
    fnResetForm () {
      this.$refs.addAdmin.fnResetForm()
    },
    // 关闭新增管理员抽屉
    fnCloseAdminDrawer () {
      this.adminDrawerVisible = false
      this.fnLoadDefaultAdmin()
    },
    fnToPath (pathName, record) {
      this.$router.push({ path: pathName, query: { roleName: record.roleName, roleId: record.roleId } })
    },
    // 保存模态框数据
    fnSaveModalAuthority () {
      let leftCheckNodes
      let rightCheckNodes
      if (this.batch.type == 'grant') {
        // 获取左边选中的数据
        leftCheckNodes = this.$refs.tree.getCheckedNodes(false, true).map((node) => {
          return node.resourceId
        })
        // 右边选中的数据
        rightCheckNodes = this.$refs.rtree.getCheckedNodes(false, true).map((node) => {
          return node.resourceId
        })
      } else {
        leftCheckNodes = this.$refs.tree.getCheckedKeys()
        rightCheckNodes = this.$refs.rtree.getCheckedKeys()
      }
      const data = {
        isAdd: this.batch.type == 'grant' ? '1' : '0',
        roles: JSON.stringify(this.selectedRows),
        resourceIds: JSON.stringify(leftCheckNodes),
        objectResourceIds: JSON.stringify(rightCheckNodes)
      }
      $api.batchChangeAdminPermission(data, (data) => {
        this.$message.success('操作成功')
        this.batch.visible = false
      })
    },
    // 过滤树
    filterNode (value, data, node) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    adminPageParams () {
      const orgIds = this.orgId
      const orgId = !orgIds ? this.options[0].orgId : orgIds[orgIds.length - 1]
      let effective = this.selectFilter
      if (effective.length == 1) {
        effective = effective.join(',')
      } else {
        effective = null
      }
      return {
        roleName: this.searchInfo,
        effective: effective,
        orgId: orgId,
        isSub: this.includeSub
      }
    },
    // 查询管理员名称.如果为空,则查询所有管理员信息
    fnLoadDefaultAdmin () {
      this.$refs.adminPager.loadData()
    },
    onChangeIsSub (e) {
      this.includeSub = e.target.checked
      this.fnLoadDefaultAdmin()
    },
    fnLoadedOrgCallBack (data) {
      this.fnLoadDefaultAdmin()
    },
    // 点击查询管理员名称
    fnQueryAdmin (val) {
      this.orgId = val
      this.fnLoadDefaultAdmin()
    },
    // 加载用户选择模态框默认数据
    fnLoadModalDefault () {
      this.batch.visible = true
      $api.queryBatchPermissionTreeData(null, (data) => {
        this.leftTreeData = data.data.batchPermissionTree
        this.rightTreeData = data.data.batchCustomPermissionTree
      })
    },
    // 授予使用权限模态框
    fnGrantAuthority () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择数据')
        return
      }
      this.batch.title = '授予使用权限'
      this.batch.type = 'grant'
      // 加载数据
      this.fnLoadModalDefault()
    },
    // 回收使用权限模态框
    fnRevokeAuthority () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择数据')
        return
      }
      this.batch.title = '回收使用权限'
      this.batch.type = 'revoke'
      this.fnLoadModalDefault()
    },
    // 编辑管理员信息
    fnEditAdmin (record) {
      this.adminDrawerTitle = '修改管理员角色'
      this.adminDrawerVisible = true
      this.adminItem.roleObj = record
      this.adminItem.type = 'edit'
    },
    // 删除管理员信息
    fnDeleteBatchAdmin (record) {
      let roleIds = []
      if (record) {
        roleIds.push(record.roleId)
      } else {
        roleIds = this.selectedRows.map((admin) => {
          return admin.roleId
        })
      }
      const data = {
        roleIds: roleIds.join(',')
      }
      $api.deleteBatchAdmin(data, (data) => {
        this.$message.success('移除管理员角色成功')
        this.deleteVisible = false
        this.fnLoadDefaultAdmin()
      })
    },
    // 新增管理员信息
    fnAddAdmin () {
      this.adminDrawerTitle = '新增管理员角色'
      this.adminDrawerVisible = true
      this.adminItem = {}
      this.adminItem.type = 'add'
    },
    // 批量启用管理员状态
    fnBatchPickAdmin (record) {
      let roleIds = []
      if (record) {
        if (record.effective == '1') {
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        roleIds.push(record.roleId)
      } else {
        const roles = this.selectedRows.filter((role) => {
          // 只有禁用了的,才进行启用,已经启用的不再进行启用,防止后台做重复操作
          return role.effective == '0'
        })
        if (roles.length == 0) {
          this.$message.warning('所选记录已经全部启用，请勿重复操作！')
          return
        }
        roleIds = roles.map(role => {
          return role.roleId
        })
      }
      const data = {
        roleIds: roleIds.join(','),
        effective: '1'
      }
      $api.updateBatchAdminStatus(data, (data) => {
        this.$message.success('更新数据成功')
        this.fnQueryAdmin()
      })
    },
    // 批量禁用管理员状态
    fnBatchBanAdmin (record) {
      let roleIds = []
      if (record) {
        if (record.effective == '0') {
          this.$message.warning('该记录已经禁用，请勿重复操作！')
          return
        }
        roleIds.push(record.roleId)
      } else {
        const roles = this.selectedRows.filter((role) => {
          // 只有开启了的,才进行禁用,已经禁用的不再进行禁用,防止后台做重复操作
          return role.effective == '1'
        })
        if (roles.length == 0) {
          this.$message.warning('所选记录已经全部禁用，请勿重复操作！')
          return
        }
        roleIds = roles.map(role => {
          return role.roleId
        })
      }
      const data = {
        roleIds: roleIds.join(','),
        effective: '0'
      }
      $api.updateBatchAdminStatus(data, (data) => {
        this.$message.success('更新数据成功')
        this.fnQueryAdmin()
      })
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .mg-l12 { margin-left: 12px; }
  .title {
    font-weight: bold;
  }

  .filter {
    display: flex;
    margin-top: 10px;
  }

  .modalTreeStyle {
    height: 290px;
    margin: 10px 0;
    overflow-y: scroll;
    border: 1px dashed lightgray;
  }

  .invalidStyle {
    color: @normal-color;

    &:hover {
      color: @normal-color
    }

    cursor: not-allowed;
  }

  .filter-box {
    display: inline-block
  }

  .filter-name {
    margin-left: 20px
  }

  .search-box {
    width: 340px;
    line-height: 42px;
  }

  .center-box {
    text-align: center;
    overflow: hidden;
  }
  .no-cursor {cursor: default;}
</style>

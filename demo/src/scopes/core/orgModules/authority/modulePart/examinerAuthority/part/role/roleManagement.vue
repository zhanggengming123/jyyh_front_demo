<template>
  <div id="roleManagement" class="fit">
    <ta-border-layout :layout="{header:'70px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}" :header-cfg="{showBorder: false}" :showBorder="false" :footer-cfg="{showBorder: false}">
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
                     @change="fnQueryRole"
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
          <ta-button @click="fnAddRole" type="primary">新增角色</ta-button>
          <!--begin 批量操作按钮-->
          <ta-dropdown :trigger="clickTrigger">
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认启用所选审核角色?" cancelText="取消" okText="确认" @confirm="fnBatchPickRole(false)">
                  <ta-icon type="check-circle"></ta-icon>
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider />
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认禁用所选审核角色?" cancelText="取消" okText="确认" @confirm="fnBatchBanRole(false)">
                  <ta-icon type="stop"/>
                  <span class="mg-l12">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider />
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
      <ta-table :columns="roleColumns"
                :dataSource="roleData"
                :rowSelection="{selectedRowKeys: selectedRowKeys,onChange:fnOnChange}"
                autoExpandParent
                :pagination="false"
                ref="roleRef">
        <template slot="customOrgName" slot-scope="text,record">
          <span :class="{'invalidStyle': record.effective == '0' }">{{text}}</span>
          <!--</a>-->
        </template>
        <span slot="namePath" slot-scope="text">{{getLastName(text)}}</span>
        <template slot="effecttime" slot-scope="text,record">
          {{record.effectiveTime == null?'永久':moment(record.effectiveTime).format('YYYY-MM-DD')}}
        </template>
        <!--处理有效标识-->
        <span slot="effective" slot-scope="text">{{CollectionLabel('STATE',text)}}</span>
        <span slot="action" slot-scope="text,record">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
        <span slot="roleMg" slot-scope="text,record">
          <span v-if="record.effective == '1'">
            <router-link :to="{ path: 'roleUserMg' , query: {roleName:record.roleName,roleId:record.roleId}}">
              人员管理
            </router-link>
          </span>
          <span v-else title="禁用的审核角色不能进行人员管理">
            <span class="invalidStyle">人员管理</span>
          </span>
          <!--begin 权限管理界面-->
          <ta-divider type="vertical"/>
          <span v-if="record.effective == '1' ">
             <router-link
               :to="{ path: 'roleOrgAuthority' , query: {roleName:record.roleName,roleId:record.roleId}}">组织范围权限</router-link>
          </span>
          <span v-else title="禁用的审核角色不能进行组织范围权限操作">
            <span class="ant-dropdown-link invalidStyle">
              组织范围权限
            </span>
          </span>
          <!--end 权限管理界面-->
        </span>
      </ta-table>
      <!--end 加载组织人员数据-->
      <!--begin 分页信息-->
      <div slot="footer">
        <ta-pagination style="float: right;margin-top: 10px"
                       showSizeChanger
                       showQuickJumper
                       :dataSource.sync="roleData"
                       :defaultPageSize="10"
                       :params="rolePageParams"
                       :url="roleTableUrl"
                       ref="rolePager"/>
      </div>
      <!--end 分页信息-->
      <!--使用权限模态框加载-->
      <ta-modal :visible="batch.visible" :centered="true" :destroyOnClose="true"
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
              <ta-input placeholder="请输入资源名称" v-model="roleLeftFilterText"/>
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
              <ta-input placeholder="请输入资源名称" v-model="roleRightFilterText"/>
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
      <!--新增审核角色-->
      <ta-drawer destroyOnClose
                 width="500"
                 :title="roleDrawerTitle"
                 placement="right"
                 closable
                 @close="fnCloseRoleDrawer"
                 :visible="roleDrawerVisible"
                 footerHeight>
        <div slot="footer">
          <ta-button-group>
            <ta-button @click="fnResetForm">重置</ta-button>
            <ta-button type="primary" @click="fnAddRoleInfo">保存</ta-button>
          </ta-button-group>
        </div>
        <add-role :role="roleItem" @closeRoleDrawer="fnCloseRoleDrawer" ref="addRole"></add-role>
      </ta-drawer>
    </ta-border-layout>
    <ta-careful-delete :visible="deleteVisible" @close="deleteVisible = false" @delete="fnDeleteBatchRole" title="审核角色删除" description="选中审核角色"></ta-careful-delete>
  </div>
</template>

<script>
import $api from '../../api/index'
import moment from 'moment'
import AddRole from './addRole'

const roleColumns = [
  {
    title: '角色名称',
    width: '15%',
    dataIndex: 'roleName',
    overflowTooltip: true,
    scopedSlots: { customRender: 'customOrgName' }
  },
  {
    title: '组织路径',
    width: '10%',
    dataIndex: 'namePath',
    overflowTooltip: true,
    scopedSlots: { customRender: 'namePath' }
  },
  {
    title: '有效期',
    width: '10%',
    dataIndex: 'effecttime',
    scopedSlots: { customRender: 'effecttime' }
  },
  {
    title: '角色描述',
    width: '10%',
    dataIndex: 'roleDesc',
    overflowTooltip: true
  },
  {
    title: '状态',
    width: '10%',
    dataIndex: 'effective',
    yesOrNoTag: true,
    scopedSlots: { customRender: 'effective' }
  },
  {
    title: '角色操作',
    dataIndex: 'operation',
    width: '15%',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  },

  {
    title: '管理',
    dataIndex: 'roleMg',
    width: 360,
    align: 'center',
    scopedSlots: { customRender: 'roleMg' }
  }
]
export default {
  name: 'roleRoleManagement',
  components: { AddRole },
  data () {
    return {
      searchInfo: '', // 角色名称搜索
      clickTrigger: ['click'], // 点击触发
      selectFilter: [], // 过滤的元素信息
      casCaderOrgUrl: 'org/authority/adminAuthorityManagementRestService/queryCurrentAdminRoleWrapOrgTree', // 级联组织选择url
      roleTableUrl: 'org/authority/examinerAuthorityRestService/queryExaminer', // 审核分页url
      options: [],
      orgId: [], // 级联选择框的数组id
      includeSub: true, // 是否包含子组织,默认包含
      roleDrawerTitle: '', // 抽屉标题
      roleLeftFilterText: '', // 模态框左侧搜索栏
      roleRightFilterText: '', // 模态框右侧搜索栏
      leftTreeData: [], // 模态框左侧数据
      rightTreeData: [], // 模态框右侧数据
      leftDefaultKeys: [], // 模态框左侧默认选中数据
      rightDefaultKeys: [], // 模态框右侧默认选中数据
      modalDefaultProps: {
        label: 'name'
      },
      roleName: '', // 查询的审核角色名称
      roleColumns, // 左侧审核信息表格列属性
      operateMenu: [{
        name: '编辑',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的审核角色不允许编辑' : '',
        onClick: (record) => {
          this.fnEditRole(record)
        }
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该审核角色?',
          onOk: (record) => {
            this.fnBatchPickRole(record)
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该审核角色?',
          onOk: (record) => {
            this.fnBatchBanRole(record)
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该审核角色吗？',
          onOk: (record) => {
            this.fnRoleRecordDelete(record)
          }
        }]
      }],
      roleData: [], // 左侧审核数据
      selectedRows: [], // 左侧的选择数据
      selectedRowKeys: [],
      roleDrawerVisible: false, // 是否展示新增审核抽屉
      roleItem: {}, // 选中的记录
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
      deleteVisible: false
    }
  },
  watch: {
    // 过滤左边树
    roleLeftFilterText (val) {
      this.$refs.tree.filter(val)
    },
    // 过滤右边树
    roleRightFilterText (val) {
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
      this.roleName = val
      this.fnLoadDefaultRole()
    },
    // 点击过滤
    filterClick () {
      this.fnLoadDefaultRole()
    },
    // 获取路径的最后一个
    getLastName (name) {
      return name && name.indexOf('/') !== -1 ? name.slice(name.lastIndexOf('/') + 1) : name
    },
    // 新增审核信息
    fnAddRoleInfo () {
      this.$refs.addRole.fnAddRoleInfo()
    },
    // 重置表单
    fnResetForm () {
      this.$refs.addRole.fnResetForm()
    },
    // 关闭新增审核抽屉
    fnCloseRoleDrawer () {
      this.roleDrawerVisible = false
      this.fnLoadDefaultRole()
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
      $api.batchChangeRolePermission(data, (data) => {
        this.$message.success('操作成功')
        this.batch.visible = false
      })
    },
    // 过滤树
    filterNode (value, data, node) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    rolePageParams () {
      const orgIds = this.orgId
      const orgId = !orgIds ? this.options[0].orgId : orgIds[orgIds.length - 1]
      let effective = this.selectFilter
      if (effective.length == 1) {
        effective = effective.join(',')
      } else {
        effective = null
      }
      return {
        roleName: this.roleName,
        effective: effective,
        orgId: orgId,
        isSub: this.includeSub
      }
    },
    // 查询审核名称.如果为空,则查询所有审核信息
    fnLoadDefaultRole () {
      this.$refs.rolePager.loadData()
    },
    onChangeIsSub (e) {
      this.includeSub = e.target.checked
      this.fnLoadDefaultRole()
    },
    fnLoadedOrgCallBack (data) {
      this.fnLoadDefaultRole()
    },
    // 点击查询审核名称
    fnQueryRole (val) {
      this.orgId = val
      this.fnLoadDefaultRole()
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
    // 删除审核记录
    fnRoleRecordDelete (record) {
      const data = {
        roleIds: record.roleId
      }
      $api.deleteBatchExaminer(data, (data) => {
        this.$message.success('移除审核角色成功')
        this.fnLoadDefaultRole()
      })
    },
    // 编辑审核信息
    fnEditRole (record) {
      this.roleDrawerTitle = '修改审核角色'
      this.roleDrawerVisible = true
      this.roleItem = record
      this.roleItem.type = 'edit'
    },
    // 删除审核信息
    fnDeleteBatchRole () {
      const roleIds = this.selectedRows.map((role) => {
        return role.roleId
      })
      const data = {
        roleIds: roleIds.join(',')
      }
      $api.deleteBatchExaminer(data, (data) => {
        this.$message.success('移除审核角色成功')
        this.deleteVisible = false
        this.fnLoadDefaultRole()
      })
    },
    // 新增审核信息
    fnAddRole () {
      this.roleDrawerTitle = '新增审核角色'
      this.roleDrawerVisible = true
      this.roleItem = {}
      this.roleItem.type = 'add'
    },
    // 批量启用审核状态
    fnBatchPickRole (record) {
      let roleIds
      if (record) {
        if (record.effective == '1') {
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        roleIds = [record.roleId]
      } else {
        roleIds = this.selectedRows.map((role) => {
          return role.roleId
        })
      }
      const data = {
        roleIds: roleIds.join(','),
        effective: '1'
      }
      $api.enableExaminer(data, (data) => {
        this.$message.success('更新数据成功')
        this.fnQueryRole()
      })
    },
    // 批量禁用审核状态
    fnBatchBanRole (record) {
      let roleIds
      if (record) {
        if (record.effective == '0') {
          this.$message.warning('该记录已经禁用，请勿重复操作！')
          return
        }
        roleIds = [record.roleId]
      } else {
        roleIds = this.selectedRows.map((role) => {
          return role.roleId
        })
      }

      const data = {
        roleIds: roleIds.join(','),
        effective: '0'
      }
      $api.unableExaminer(data, (data) => {
        this.$message.success('更新数据成功')
        this.fnQueryRole()
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
  .center-box { text-align:center; overflow: hidden; }
</style>

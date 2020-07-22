<template>
  <div id="publicRoleManager" class="fit">
    <ta-border-layout :layout="{header:'55px',footer:'70px'}" :centerCfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}" :header-cfg="{showBorder: false}" :showBorder="false" :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-input-search placeholder="请输入角色名称" v-model="searchInfo" @search="fnQueryRolesByOrgId" class="search-box">
          <ta-button slot="enterButton" type="primary">搜索</ta-button>
        </ta-input-search>
      </div>
      <div slot="centerExtraContent">
        <ta-cascader :value="casValue"
                     :options.sync="orgOptions"
                     :showSearch="{filter}"
                     @change="onChange"
                     changeOnSelect
                     placeholder="请选择组织机构"
                     expandTrigger="hover"
                     class="vertical-space cascader-box"
                     :fieldNames="{label:'orgName',value:'orgId',children:'children'}"
                     url="org/authority/roleAuthorityManagementRestService/queryCurrentAdminRoleWrapeOrgTree"
                     treeId="orgVos"
                     :loadedDataCallBack="fnLoadedOrgCallBack"
                     style="width:250px; margin-right: 10px;"
        />
        <ta-checkbox :checked="isSub" @change="onChangeIsSub">包含子组织</ta-checkbox>
        <ta-tag-select title="状态" :data="[{value:'1',label:'启用'},{value:'0',label:'禁用'}]" v-model="effective" @change="fnQueryRolesByOrgId"></ta-tag-select>
        <ta-tag-select title="可分配该角色到子组织人员" :data="[{value:'1',label:'是'},{value:'0',label:'否'}]" v-model="subordinate" @change="fnQueryRolesByOrgId"></ta-tag-select>
        <div style="float: right">
          <ta-button type="primary" @click="fnNewPublicRole">新增角色</ta-button>
          <ta-dropdown :trigger="['click']">
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="!selectedRowKeys.length" >
                <ta-popconfirm title="确认启用所选角色?" cancelText="取消" okText="确认" @confirm="handleMenuClick(1)">
                  <ta-icon type="check-circle"></ta-icon>
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认禁用所选角色?" cancelText="取消" okText="确认" @confirm="handleMenuClick(0)">
                  <ta-icon type="stop"></ta-icon>
                  <span class="mg-l12">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length" @click="selectedRowKeys.length === 0 ?$message.warning('请先选择数据'):batchDeleteVisible = true">
                <ta-icon type="close-circle"/>
                删除
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length" key="1" @click="fnBatchRoles(1)">
                <ta-icon type="setting"/>
                批量授予
              </ta-menu-item>
              <ta-menu-divider/>
              <ta-menu-item :disabled="!selectedRowKeys.length" key="2" @click="fnBatchRoles(2)">
                <ta-icon type="setting"/>
                批量收回
              </ta-menu-item>
            </ta-menu>
            <ta-button>
              批量操作
              <ta-icon type="down"/>
            </ta-button>
          </ta-dropdown>
        </div>
      </div>
      <ta-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps:customCheckbox}"
                :columns="roleColumns"
                :dataSource="roleData"
                :pagination=false
                :customRow="onRowClick"
                :rowClassName="changeRowStyle"
                :scroll="{ x: 1200 }"
      >
        <template slot="customOrgName" slot-scope="text,record">
          <span :class="{'invalidStyle': record.effective == '0' || record.expire == '1' }">{{text}}</span>
          <!--</a>-->
        </template>
        <template slot="effectiveTime" slot-scope="text,record">
         <span :class="{'invalidStyle': record.expire == '1' }">
            {{record.effectiveTime == null?'永久' : moment(record.effectiveTime).format('YYYY-MM-DD')}}
         </span>
        </template>
        <span slot="expire" slot-scope="text">
            <ta-tag v-if="text == '0'" type="success" class='no-cursor'>未过期</ta-tag>
            <ta-tag v-else-if="text == '1'" type="danger" class='no-cursor'>过期</ta-tag>
        </span>
        <span slot="effective" slot-scope="text">{{CollectionLabel('STATE',text)}}</span>
        <span slot="roleSign" slot-scope="text">{{CollectionLabel('ROLESIGN',text)}}</span>
        <span slot="roleOperation" slot-scope="text,record">
          <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
        </span>
        <span slot="operation" slot-scope="text, record">
          <ta-table-operate :operateMenu="manageOperateMenu"></ta-table-operate>
        </span>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          style="float: right; margin-top: 10px;"
          showSizeChanger
          showQuickJumper
          :dataSource.sync="roleData"
          :defaultPageSize="10"
          :params="rolePageParams"
          url="org/authority/roleAuthorityManagementRestService/queryRolesByOrgId"
          ref="roleGridPager"
        />
      </div>
    </ta-border-layout>
    <ta-modal
      title="角色复制"
      centered
      v-model="roleCopyVisible"
      width="1000px"
      :bodyStyle="{height:'500px',padding:'0'}"
      :destroyOnClose=true
      :maskClosable=false
    >
      <template slot="footer">
        <ta-button @click="roleCopyVisible=false">
          取消
        </ta-button>
        <ta-button key="submit" type="primary" @click="fnRoleCopySave">
          保存
        </ta-button>
      </template>
      <roleCopy ref="roleCopyChild" v-bind:roleObj="currentSelectedPublicRole" v-bind:orgTreeData="orgOptions"
                @fnQueryRolesByOrgId="fnQueryRolesByOrgId"></roleCopy>
    </ta-modal>
    <ta-modal
      title="权限复制"
      centered
      v-model="authorityCopyVisible"
      width="1000px"
      :bodyStyle="{height:'500px',padding:'0'}"
      :destroyOnClose=true
      :maskClosable=false
    >
      <template slot="footer">
        <ta-button @click="authorityCopyVisible=false">
          取消
        </ta-button>
        <ta-button key="submit" type="primary" @click="fnAuthorityCopySave">
          保存
        </ta-button>
      </template>
      <authorityCopy ref="authorityCopyChild" v-bind:roleObj="currentSelectedPublicRole"></authorityCopy>
    </ta-modal>
    <ta-drawer
        :get-container="()=>this.$el.parentNode.parentNode"
      :title="newRoleTitle"
      placement="right"
      @close="newRoleVisible = false"
      :visible="newRoleVisible"
      :destroyOnClose=true
      width="500"
    >
      <newRole v-bind:updateObj="updateObj" @onNewRoleClose="newRoleVisible = false" @fnQueryRolesByOrgId="fnQueryRolesByOrgId" ref="newRole"></newRole>
      <div slot="footer">
        <ta-button-group>
          <ta-button @click="$refs.newRole.fnResetForm()">重置</ta-button>
          <ta-button @click="$refs.newRole.fnAddOrUpdateRole()" type="primary">保存</ta-button>
        </ta-button-group>
      </div>
    </ta-drawer>
    <ta-careful-delete :visible="batchDeleteVisible" @close="batchDeleteVisible = false" @delete="fnBeforeDeleteRole" title="角色删除" description="选中角色"></ta-careful-delete>
  </div>
</template>
<script>
import $api from '../../api/index'
import roleCopy from './roleCopy'
import authorityCopy from '../common/authorityCopy'
import newRole from './newRole'
import moment from 'moment'

export default {
  name: 'publicRoleManager',
  components: { roleCopy, authorityCopy, newRole },
  data () {
    const roleColumns = [{
      title: '角色名称',
      dataIndex: 'roleName',
      width: 120,
      overflowTooltip: true,
      scopedSlots: { customRender: 'customOrgName' },
      customCell: this.customCellOfRollName
    }, {
      title: '组织路径',
      dataIndex: 'namePath',
      width: 120,
      overflowTooltip: 'namePath',
      customRender: (text) => {
        return text.slice(text.lastIndexOf('/') + 1)
      }
    }, {
      title: '角色标识',
      dataIndex: 'roleSign',
      width: 120,
      scopedSlots: { customRender: 'roleSign' }
    }, {
      title: '角色描述',
      dataIndex: 'roleDesc',
      width: 120,
      overflowTooltip: true
    }, {
      title: '可分配该角色到子组织人员',
      dataIndex: 'subordinate',
      width: 120,
      customRender: function (text) {
        return text == '1' ? '是' : '否'
      },
      align: 'center',
      customHeaderCell: this.customHeaderCellOfSubordinate
    }, {
      title: '有效期',
      dataIndex: 'effectiveTime',
      width: 120,
      scopedSlots: { customRender: 'effectiveTime' },
    } , {
      title: '是否过期',
      width: 120,
      dataIndex: 'expire',
      scopedSlots: { customRender: 'expire' }
    }, {
      title: '状态',
      dataIndex: 'effective',
      width: 120,
      yesOrNoTag: true,
      scopedSlots: { customRender: 'effective' }
    }, {
      title: '角色操作',
      dataIndex: 'roleOperation',
      scopedSlots: { customRender: 'roleOperation' },
      width: 150,
      align: 'center'
    }, {
      title: '管理',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
      width: 200,
      align: 'center'
    }]
    return {
      searchInfo: '',
      orgOptions: [],
      isSub: true,
      casValue: [],
      roleColumns,
      operateMenu: [{
        name: '编辑',
        isShow: record => record.roleMark=='1',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的角色不允许编辑' : '',
        onClick: record => this.updatePublicRole(record),
      }, {
        name: '编辑',
        style: {
          color: 'rgb(204,204,204)',
          cursor: 'not-allowed'
        },
        isShow: record => record.roleMark!='1',
        title: record => record.roleMark!='1' ? '您对相应组织下的该角色无编辑权限' : ''
      }, {
        name: '更多',
        type: 'more',
        isShow: record => record.roleMark=='1',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该角色?',
          onOk:(record) =>{
            this.handleMenuClick(1, record)
          }
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该角色?',
          onOk:(record) =>{
            this.handleMenuClick(0, record)
          }
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该角色?',
          onOk:(record) =>{
            this.fnBeforeDeleteRole(record)
          }
        }, {
          name: '角色复制',
          disabled: record => record.effective == '0',
          onClick: record => this.fnRoleCopy(record)
        }, {
          name: '权限复制',
          disabled: record => record.effective == '0',
          onClick: record => this.fnAuthorityCopy(record)
        }]
      },{
        name: '更多',
        type: 'more',
        style: {
          color: 'rgb(204,204,204)',
          cursor: 'not-allowed'
        },        isShow: record => record.roleMark!='1',
        title: record => record.roleMark!='1' ? '您对相应组织下的该角色无操作权限' : ''
      }],
      manageOperateMenu: [{
        name: '人员管理',
        disabled: (record) => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的角色不允许进行人员管理' : '',
        onClick: (record) => this.fnRouteTo(record, 'publicRoleUser')
      },{
        name: '权限管理',
        type: 'more',
        disabled: record => record.effective == '0',
        title: record => record.effective == '0' ? '禁用的角色不允许进行权限管理' : '',
        isShow: record => record.roleMark == '1',
        moreMenuList: [{
          name: '功能菜单权限管理',
          onClick: record => this.fnRouteTo(record,'publicRoleAuthority')
        },{
          name: '自定义对象权限管理',
          onClick: record => this.fnRouteTo(record,'publicRoleCustomAuthority')
        }]
      },{
        name: '权限管理',
        type: 'more',
        title: record => record.roleMark!='1' ? '您对相应组织下的该角色无权限管理权限' : '',
        isShow: record => record.roleMark != '1',
        style: {
          color: 'rgb(204,204,204)',
          cursor: 'not-allowed'
        },
      }],
      roleData: [],
      selectedRowKeys: [],
      selectedPublicRole: [],
      currentSelectedPublicRole: {},
      roleCopyVisible: false,
      authorityCopyVisible: false,
      updateObj: {},
      newRoleVisible: false,
      newRoleTitle: '新增角色',
      batchRoles: {},
      effective: [],
      subordinate: [],
      batchDeleteVisible: false,
      currentTime:''
    }
  },
  mounted(){
    this.currentTime = moment().format('YYYY-MM-DD HH:MM:SS');
  },
  methods: {
    moment, // 处理时间的方法
    // 分页参数
    rolePageParams () {
      const orgId = this.orgOptions[0] && this.orgOptions[0].orgId ? this.orgOptions[0].orgId : ''
      return {
        orgId: this.casValue.length > 0 ? this.casValue[this.casValue.length - 1] : orgId, // 'fd811ab9c30440088df3e29ea784460a',
        isSub: this.isSub,
        roleType: '01',
        roleName: this.searchInfo,
        effective: this.effective.length > 0 ? this.effective[0] : null,
        subordinate: this.subordinate.length > 0 ? this.subordinate[0] : null
      }
    },
    // 路由到界面
    fnRouteTo (record, name) {
      this.$router.push({
        name: name,
        params: { role: record }
      })
    },
    fnBatchRoles (type) {
      if (this.selectedPublicRole.length < 1) {
        this.$message.warn('请先选择角色')
        return
      }
      this.$router.push({
        name: 'batchAuthority',
        params: {
          roles: this.selectedPublicRole,
          batchType: type == 1 ? 'add' : 'delete'
        }
      })
    },
    fnAuthorityMgSave () {
      this.$refs.authorityMgChild.fnSave()
    },
    handleMenuClick (e, record) {
      let roleIdArray = []
      if(record){
        if(e == '1' && record.effective == '1'){
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        if(e == '0' && record.effective == '0'){
          this.$message.warning('该记录已经禁用，请勿重复操作！')
          return
        }
        roleIdArray.push(record.roleId)
      } else {
        this.selectedPublicRole.forEach(function (value, index) {
          roleIdArray.push(value.roleId)
        })
        if (roleIdArray.length < 1) {
          this.$message.warn('请先勾选要操作的角色')
          return
        }
      }
      $api.updateRoleEffectiveByRoleId({ roleIds: roleIdArray.join(','), effective: e == '1' ? '1' : '0' }, (data) => {
        this.$message.success(e=='1' ? '启用成功' : '禁用成功')
        this.fnQueryRolesByOrgId()
      })
    },
    fnBeforeDeleteRole (record) {
      const roleIdArry = []
      if(record){
        roleIdArry.push(record.roleId)
      } else {
        this.selectedPublicRole.forEach(function (value, index) {
          roleIdArry.push(value.roleId)
        })
        if (roleIdArry.length < 1) {
          this.$message.warn('请勾选要删除的角色')
          return
        }
      }
      this.deletePublicRole(roleIdArry)
    },
    deletePublicRole (roleIdArry) {
      $api.deleteBatchRole({ roleIds: roleIdArry.join(',') }, (data) => {
        this.$message.success('删除角色成功')
        this.batchDeleteVisible = false
        this.fnQueryRolesByOrgId()
      })
    },
    fnLoadedOrgCallBack (data) {
      this.fnQueryRolesByOrgId()
    },
    onChange (value, selectedOptions) {
      this.casValue = value
      this.fnQueryRolesByOrgId()
    },
    onChangeIsSub (e) {
      this.isSub = e.target.checked
      this.fnQueryRolesByOrgId()
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedPublicRole = selectedRows
    },
    customCheckbox (record) {
      return {
        props: {
          disabled: record.roleMark !== '1'
        }
      }
    },
    onRowClick (record, index) {
      return {
        on: {
          click: () => {
            this.currentSelectedPublicRole = record
            this.rowFlag = index
          }
        }
      }
    },
    changeRowStyle (record, index) {
      if (this.rowFlag == index) {
        return 'row-active-bg'
      }
    },
    fnRoleCopy (record) {
      this.roleCopyVisible = true
      this.currentSelectedPublicRole = record
    },
    fnRoleCopySave () {
      this.$refs.roleCopyChild.fnSave()
    },
    fnAuthorityCopy (record) {
      this.authorityCopyVisible = true
      this.currentSelectedPublicRole = record
    },
    fnAuthorityCopySave () {
      this.$refs.authorityCopyChild.fnSave()
    },
    fnNewPublicRole () {
      this.newRoleTitle = '新增角色'
      this.newRoleVisible = true
      this.updateObj = {
        isUpdate: false
      }
    },
    updatePublicRole (record) {
      this.newRoleTitle = '修改角色'
      this.newRoleVisible = true
      this.updateObj = {
        isUpdate: true,
        roleObj: record
      }
    },
    fnQueryRolesByOrgId () {
      this.$refs.roleGridPager.loadData()
    },
    customCellOfRollName(record){
      if(record.effectiveTime && record.effectiveTime < this.currentTime){
        return {
          style:{
            color: 'rgb(204,204,204)'
          }
        }
      }
    },
    customHeaderCellOfSubordinate(){
      let myCol = {
        style: {
          font: '14px'
        }
      }
      return myCol
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .mg-l12 { margin-left: 12px; }
  .row-active-bg {
    background: #E6F7FF;
  }

  .cascader-box {
    width: 50%;
  }

  .ant-divider-vertical {
    margin: 0 3px;
  }

  .ant-modal-header {
    text-align: center;
  }

  .ant-modal-footer {
    text-align: center;
  }

  .ant-tabs-tabpane-active {
    padding-top: 10px;
  }

  .vertical-space {
    &.btn-group-position {
      float: left;
    }
  }

  .ant-calendar-picker-container {
    z-index: 2012;
  }

  .no-cursor {
    cursor: default;
  }
  .filter-name {
    margin-left: 20px
  }

  .filter-box {
    display: inline-block
  }
  .search-box {
    width: 340px;
    line-height: 42px;
  }
  .center-box { text-align:center; overflow: hidden; }

  .invalidStyle {
    color: @normal-color;
    &:hover {
      color: @normal-color
    }
    cursor: not-allowed;
  }
</style>

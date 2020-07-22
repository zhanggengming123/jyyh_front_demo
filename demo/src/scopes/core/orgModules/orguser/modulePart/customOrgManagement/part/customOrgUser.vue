<template>
  <div id="customOrgUser" class="fit">
    <ta-border-layout :layout="{header:'70px', footer: '70px'}" :center-cfg="{showBar: true}" :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-breadcrumb separator=">" style="line-height: 42px; position: absolute">
          <ta-breadcrumb-item><a @click="fnBack">自定义组织</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>人员管理</ta-breadcrumb-item>
        </ta-breadcrumb>
        <ta-input-search placeholder="请输入人员姓名、帐号、证件号"
                         @search="fnQueryUserByOrgId"
                         class="search-box"
                         v-model="searchInfo">
          <ta-button slot="enterButton" type="primary">搜索</ta-button>
        </ta-input-search>
      </div>
      <ta-alert slot="centerExtraContent" :message="'当前组织路径：'+this.$route.query.customOrgPath" type="info" showIcon/>
      <ta-tabs class="fit">
        <template slot="tabBarExtraContent">
          <ta-button @click="fnBack"><ta-icon type="rollback"/>返回</ta-button>
          <ta-button-group>
            <ta-button @click="fnBatchDeleteUser">批量移除</ta-button>
            <ta-button @click="fnShowUserSelectModal" type="primary">分配人员</ta-button>
          </ta-button-group>
        </template>
        <ta-tab-pane tab="组织下人员列表">
          <ta-table :columns="userColumns"
                    :dataSource="userData"
                    :pagination=false
                    style="padding-top: 10px"
                    :rowSelection="{selectedRowKeys: selectedRowKeys,onChange:fnOnChange}">
            <span slot="name" slot-scope="text,record" :class="{'invalidStyle': record.effective == '0' }">{{text}}</span>
            <span slot="namePath" slot-scope="text">{{getLastName(text)}}</span>
            <span slot="sex" slot-scope="text">{{CollectionLabel('SEX',text)}}</span>
            <span slot="action" slot-scope="text,record">
              <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
            </span>
          </ta-table>
        </ta-tab-pane>
      </ta-tabs>
      <div slot="footer">
        <ta-pagination style="float: right; padding-top: 10px"
                       showSizeChanger
                       showQuickJumper
                       :dataSource.sync="userData"
                       :defaultPageSize="10"
                       :params="userPageParams"
                       :url="customOrgUserUrl"
                       ref="userGridPager"/>
      </div>
    </ta-border-layout>
    <custom-org-user-select :visible="visible" @close="fnCloseUserSelectModal"></custom-org-user-select>
  </div>
</template>

<script>
import $api from '../api/index'
import CustomOrgUserSelect from './customOrgUserSelect'
const userColumns = [
  {title: '姓名', dataIndex: 'name', scopedSlots: {customRender: 'name'}},
  {title: '账号', dataIndex: 'loginId'}, {title: '性别', dataIndex: 'sex', scopedSlots: {customRender: 'sex'}},
  {title: '组织路径', dataIndex: 'namePath', width: '30%', overflowTooltip: true, scopedSlots: {customRender: 'namePath'}},
  {title: '操作', dataIndex: 'operation', scopedSlots: {customRender: 'action'}, align: 'center'}
]
export default {
  name: 'customOrgUser',
  components: {CustomOrgUserSelect},
  data () {
    return {
      customOrgId: '', // 自定义组织id
      orgOptions: [], // 组织选择级联数据
      casValue: [], // 级联组织默认数据
      isSub: true, // 是否包含子组织
      searchInfo: '', // 搜索人员信息
      userColumns, // 用户列属性
      operateMenu: [{
        name: '移除',
        type: 'confirm',
        confirmTitle: '确认移除该人员吗?',
        onOk: (record) => {
          this.fnUserRecordDelete(record)
        }
      }],
      userData: [], // 用户数据
      selectedRows: [], // 选中的数据信息
      selectedRowKeys: [], // 选中的keys
      customOrgUserUrl: 'org/orguser/customOrgManagementRestService/queryBatchUserByCustomOrgId', // 自定义组织人员信息请求url
      visible: false, // 是否选择人员选择框
      arrayData: {}, // 行数据
      isDetailShow: false// 是否展示详细信息
    }
  },
  methods: {
    fnOnChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 获取路径的最后一个
    getLastName (name) {
      return name && name.indexOf('/') != -1 ? name.slice(name.lastIndexOf('/') + 1) : name
    },
    // 显示详情信息
    showRecordDetail (record) {
      this.isDetailShow = true
      this.arrayData = [
        {
          label: '姓名',
          value: record.name
        },
        {
          label: '账号',
          value: record.loginId
        },
        {
          label: '性别',
          type: 'codeTable',
          dictType: 'SEX',
          value: record.sex
        },
        {
          label: '组织路径',
          type: 'desc',
          value: record.namePath
        }
      ]
    },
    // 打开人员选择框数据
    fnShowUserSelectModal () {
      this.visible = true
    },
    // 关闭人员选择框
    fnCloseUserSelectModal (userIds) {
      this.visible = false
      if (userIds) {
        let data = {
          cutomOrgUserIds: userIds,
          customOrgId: this.customOrgId
        }
        $api.addBatchCustomOrgUser(data, (data) => {
          this.$message.success('分配成功')
          this.fnQueryUserByOrgId()
        })
      }
      this.$nextTick(() => {
        // 重新加载组织人员信息
        this.fnQueryUserByOrgId()
      })
    },
    // 点击是否包含子组织
    onChangeIsSub (e) {
      this.isSub = e.target.checked
      this.$nextTick(() => {
        this.fnQueryUserByOrgId()
      })
    },
    // 组织数据加载完成后触发
    fnLoadedOrgCallBack (data) {
      this.fnQueryUserByOrgId()
    },
    // 加载数据
    fnQueryUserByOrgId () {
      this.$refs.userGridPager.loadData()
    },
    // 用户分页参数
    userPageParams () {
      let params = {}
      params.customOrgId = this.customOrgId
      params.includeChildren = this.isSub ? '1' : '0'
      if (this.searchInfo) {
        params.name = this.searchInfo
        params.loginId = this.searchInfo
        params.idCardNo = this.searchInfo
      }
      return params
    },
    // 返回上一级
    fnBack () {
      this.$router.push({name: 'customOrgManagement'})
    },
    // 移除自定义组织人员信息
    fnUserRecordDelete (record) {
      let data = {
        cutomOrgUserIds: record.userId,
        customOrgId: this.customOrgId
      }
      $api.deleteBatchCustomOrgUser(data, (data) => {
        this.$message.success('移除成功')
        this.fnQueryUserByOrgId()
      })
    },
    // 批量删除人员信息
    fnBatchDeleteUser () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择需要移除的人员')
        return
      }
      this.$confirm({
        title: '移除人员',
        content: '确认移除这些人员吗?',
        cancelText: '取消',
        okText: '确认',
        onOk: () => {
          let userIds = this.selectedRows.map(v => {
            return v.userId
          })
          let data = {
            cutomOrgUserIds: userIds.join(','),
            customOrgId: this.customOrgId
          }
          $api.deleteBatchCustomOrgUser(data, (data) => {
            this.$message.success('移除成功')
            this.fnQueryUserByOrgId()
          })
        }
      })
    }
  },
  activated () {
    let org = this.$route.query
    this.customOrgId = org.customOrgId
    this.fnQueryUserByOrgId()
  }
}
</script>
<style scoped type="text/less" lang="less">
  .invalidStyle {
    color: @normal-color;
    &:hover {
      color: @normal-color
    }
    cursor: not-allowed;
  }
  .search-box {
    width: 340px;
    line-height: 42px;
  }
  .center-box { text-align:center; overflow: hidden; }
</style>

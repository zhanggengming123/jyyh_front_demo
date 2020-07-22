<template>
  <div class="fit">
    <ta-border-layout  :layout="{header:'55px'}" :center-cfg="{showBar:true}" :header-cfg="{showBorder: false}" :showBorder="false" :footer-cfg="{showBorder: false}">
      <template slot="header">
        <ta-breadcrumb separator=">" style="line-height: 29px">
          <ta-breadcrumb-item><a @click="fnBackToHome">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>组织范围权限</ta-breadcrumb-item>
        </ta-breadcrumb>
      </template>

      <div slot="centerExtraContent">
        <ta-alert :message="'当前角色为：'+this.$route.query.roleName" type="info" showIcon/>
      </div>
      <ta-tabs class="fit">
        <ta-tab-pane tab="组织范围权限">
          <ta-row style="width: 100%;padding-top: 10px">
            <ta-col :span="row.col.span">
              <ta-table :columns="orgColumns"
                        :dataSource="orgData"
                        :pagination="false"
                        rowKey="orgId"
                        :defaultExpandedRowKeys="defaultExpandedRowKeys">
                <span slot="customOrgNameTitle"><ta-icon type="smile-o"/> Name</span>

                <!--<span slot="customTitle" slot-scope="text">-->
                <!--{{text}}vjnaekr-->
                <!--<ta-tooltip>-->
                <!--包含子组织-->
                <!--</ta-tooltip>-->
                <!--</span>-->

                <template slot="effecttime" slot-scope="text,record">
                <span v-if="record.isAuthority==1">
                  {{record.effectTime == null?'永久':moment(record.effectTime).format('YYYY-MM-DD')}}
                </span>
                  <span v-else>
                  --
                </span>
                </template>

                <span slot="action" slot-scope="record">
                  <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
                </span>
              </ta-table>

            </ta-col>
          </ta-row>
        </ta-tab-pane>
        <template slot="tabBarExtraContent">
          <ta-button @click="fnBackToHome"><ta-icon type="rollback"/>返回</ta-button>
          <ta-button type="primary" @click="fnShowModal">组织权限管理</ta-button>
        </template>

      </ta-tabs>

      <!--begin 权限管理模态框加载-->
      <ta-modal :visible="authority.visible" :centered="true" :destroyOnClose="true"
                :width="authority.width" @cancel="authority.visible=false" :footer="null"
                :bodyStyle="{'height':'500px'}">
        <template slot="title">
          <div style="text-align: center">
            组织权限管理
          </div>
        </template>
        <!--<template slot="footer">-->
        <!--<div style="text-align: center">-->
        <!--<ta-button @click="authority.visible = false">取消</ta-button>-->
        <!--<ta-button type="primary">保存</ta-button>-->
        <!--</div>-->
        <!--</template>-->
        <role-authority-mg :item="item" @modalCancel="fnReLoadAuthority"></role-authority-mg>
      </ta-modal>
      <!--end 权限管理模态框加载-->
    </ta-border-layout>
  </div>

</template>
<script>
import $api from '../../api/index'
import moment from 'moment'
import roleAuthorityMg from './roleAuthorityMg'

const orgColumns = [
  {
    title: '组织名称',
    dataIndex: 'orgName',
    slots: { title: 'customOrgNameTitle' }
  },
  {
    title: '有效期',
    scopedSlots: { customRender: 'effecttime' }
  },
  {
    title: '组织路径',
    dataIndex: 'namePath'
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'roleOrgAuthority',
  components: { roleAuthorityMg },
  data () {
    return {
      row: {
        col: {
          span: 24
        }
      },
      authority: {
        visible: false, // 是否打开模态框
        width: '500px'// 默认宽度
      },
      item: {}, // 路由数据
      orgColumns, // 表格列属性
      operateMenu: [{
        name: '删除',
        type: 'confirm',
        confirmTitle: '确定要移除该审核的组织权限及其所有子权限吗?',
        onOk: (record) => {
          this.fnAdminOrgDelete(record)
        }
      }],
      orgData: [], // 组织数据,
      roleId: '', // 角色id
      defaultExpandedRowKeys: []// 组织默认展开
    }
  },

  activated () {
    this.item = this.$route.query
    if (!this.item.roleId) {
      this.fnBackToHome()
      return
    }
    this.fnLoadDefault()
  },
  methods: {
    moment,
    // 关闭模态框,重新加载数据
    fnReLoadAuthority () {
      // 关闭模态框
      this.authority.visible = false
      this.fnLoadDefault()
    },
    // 返回
    fnBackToHome () {
      this.$router.push({ name: 'roleManagement' })
    },
    fnShowModal () {
      this.authority.visible = true
    },
    // 加载组织权限
    fnLoadDefault () {
      $api.queryOrgAuth({ roleId: this.item.roleId }, (data) => {
        this.orgData = data.data.orgScopeList
      })
    },
    // 移除组织权限
    fnAdminOrgDelete (record) {
      const data = {
        roleId: this.roleId,
        orgId: record.orgId
      }
      $api.removeOrgAuth(data, (data) => {
        this.$message.success('删除成功')
        this.fnLoadDefault()
      })
    }
  }
}
</script>

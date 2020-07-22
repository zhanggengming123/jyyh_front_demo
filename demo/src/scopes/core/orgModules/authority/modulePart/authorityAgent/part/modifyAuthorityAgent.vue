<template>
  <div id="modifyAuthorityAgent">
    <ta-form :autoFormCreate="(form)=>{this.form = form}" layout="inline">
      <ta-form-item label="代理角色名称"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="agentRoleName"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '缺少代理角色名' }]}">
        <ta-input disabled />
      </ta-form-item>
      <ta-form-item label="委派截止日期"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="effectiveTime"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择委派截止日期' }]}">
        <ta-date-picker/>
      </ta-form-item>
    </ta-form>
    <ta-row :gutter="row.gutter">
      <ta-col :span="row.col.span" style="height: 360px">
        <ta-tabs defaultActiveKey="1" class="fit">
          <ta-tab-pane tab="功能菜单权限" key="1">
            <ta-table :columns="menuAuthorityColumns"
                      :dataSource="menuData"
                      defaultExpandAllRows
                      size="small"
                      style="padding-top: 10px"
                      :pagination=false >
            </ta-table>
          </ta-tab-pane>
        </ta-tabs>
      </ta-col>
      <ta-col :span="row.col.span" style="height: 360px">
        <ta-tabs defaultActiveKey="1" class="fit">
          <ta-tab-pane tab="授权对象权限" key="1">
            <ta-table :columns="customAuthorityColumns"
                      :dataSource="customData"
                      defaultExpandAllRows
                      size="small"
                      style="padding-top: 10px"
                      :pagination=false >
            </ta-table>
          </ta-tab-pane>
        </ta-tabs>
      </ta-col>
    </ta-row>

  </div>
</template>
<script>
import $api from '../api'
import moment from 'moment'

const menuAuthorityColumns = [{
  title: '功能名称',
  dataIndex: 'resourceName'
}]

const customAuthorityColumns = [{
  title: '功能名称',
  dataIndex: 'resourceName'
}]

export default {
  name: 'modifyAuthorityAgent',
  props: {
    agentRole: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 布局相关参数
      row: {
        gutter: 16,
        col: {
          span: 12
        }
      },
      formItemLayout: {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 }
      },
      // 列定义
      menuAuthorityColumns,
      customAuthorityColumns,
      // 表格数据
      menuData: [],
      customData: []
    }
  },
  methods: {
    moment,
    fnSaveModifyAgentRole () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.fnSave()
        }
      })
    },
    fnSave () {
      $api.updateAgentRoleAuthority({
        roleId: this.agentRole.roleId,
        effectTime: this.form.getFieldValue('effectiveTime').format('YYYY-MM-DD') + ' 23:59:59'
      }, (data) => {
        this.$message.success('修改成功')
        this.$emit('refreshAgentRole')
      })
    },
    fnLoadAuthorityTree () {
      $api.loadAuthorityTree({ targetRoleId: this.agentRole.roleId }, (data) => {
        this.menuData = data.repermissions
        this.customData = data.customRepermissions
      })
    }
  },
  mounted () {
    const effectiveTime = moment(this.agentRole.effectiveTime || '', 'YYYY-MM-DD')
    this.form.setFieldsValue({
      agentRoleName: this.agentRole.roleName,
      effectiveTime: effectiveTime._isValid ? effectiveTime : null
    })
    this.fnLoadAuthorityTree()
  }
}
</script>

<template>
    <div id="jobDetail">
        <ta-form id="bfForm" :autoFormCreate="(form)=>{this.form = form}">
            <ta-form-item
                    label='应用名称'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="appName"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入应用名称' }],initialValue: zkData.appName}"
            >
                <ta-input :disabled=true />
            </ta-form-item>
            <ta-form-item
                    label='任务名称'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="jobName"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入任务名称' }],initialValue: jobName}"
            >
                <ta-select allowClear :disabled="editType == 'edit'" @change="handleJobNameSelectChange"
                           placeholder="请选择任务名称">
                    <ta-select-option v-for="jobName in jobNameList" :value="jobName" :key="jobName">{{jobName}}
                    </ta-select-option>
                </ta-select>
            </ta-form-item>
            <ta-form-item
                    v-if="editType == 'edit' && ipList.length>0"
                    label='服务器IP'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="serverIps"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入服务器IP' }],initialValue: checkedList}"
            >
                <ta-checkbox-group :options="ipList" @change="checkboxChange"/>
            </ta-form-item>
            <ta-form-item
                    v-if="editType == 'add' && addIpList.length>0"
                    label='服务器IP'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="serverIps"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入服务器IP' }],initialValue: checkedList}"
            >
                <ta-checkbox-group :options="addIpList" @change="checkboxChange"/>
            </ta-form-item>
            <ta-form-item
                    label='空闲时刻'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="freeMoment"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入空闲时刻' }],initialValue: freeMoment}"
            >
                <ta-time-picker format="HH:mm"/>
            </ta-form-item>
            <ta-form-item
                    label='繁忙时刻'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="busyMoment"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入繁忙时刻' }],initialValue: busyMoment}"
            >
                <ta-time-picker format="HH:mm"/>
            </ta-form-item>
        </ta-form>
    </div>
</template>
<script>

import api from '../api/index'
import moment from 'moment'

export default {
  name: 'addFreeBusyJob',
  props: ['editType', 'fbData', 'zkData', 'jobNameList', 'ipList'],
  data () {
    return {
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18}
      },
      checkedList: [],
      addIpList: [],
      jobName: undefined,
      freeMoment: undefined,
      busyMoment: undefined
    }
  },

  mounted: function () {
    if (this.editType == 'edit') {
      this.checkedList = this.fbData.serverIps.split(',')
      this.jobName = this.fbData.jobName
      this.freeMoment = moment(this.fbData.freeMoment, 'HH:mm')
      this.busyMoment = moment(this.fbData.busyMoment, 'HH:mm')
    }
  },

  methods: {

    moment,

    handleJobNameSelectChange (value) {
      let data = {
        zkId: this.zkData.zkId,
        jobName: value
      }
      api.getServerIpsByJobName(data, (result) => {
        this.addIpList = result.data.addIpList
      })
    },

    closeDrawer () {
      this.$emit('close')
      this.form.resetFields()
    },

    onResetForm () {
      this.form.resetFields()
      if (this.editType == 'add') {
        this.addIpList = []
      }
    },

    onSubmitForm () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.form.getFieldValue('freeMoment').format('HH:mm') == this.form.getFieldValue('busyMoment').format('HH:mm')) {
            this.$message.warn('空闲时刻和繁忙时刻不能相等')
            return
          }
          if (this.editType == 'add') {
            let data = {
              zkId: this.zkData.zkId,
              jobName: this.form.getFieldValue('jobName'),
              serverIps: this.form.getFieldValue('serverIps').join(','),
              freeMoment: this.form.getFieldValue('freeMoment').format('HH:mm'),
              busyMoment: this.form.getFieldValue('busyMoment').format('HH:mm')
            }
            api.addFreeBusyJob(data, (result) => {
              this.$message.success('保存成功')
              this.closeDrawer()
              this.$emit('queryTable')
            })
          } else if (this.editType == 'edit') {
            let data = {
              id: this.fbData.id,
              serverIps: this.form.getFieldValue('serverIps').join(','),
              freeMoment: this.form.getFieldValue('freeMoment').format('HH:mm'),
              busyMoment: this.form.getFieldValue('busyMoment').format('HH:mm')
            }
            api.updateFreeBusyJob(data, (result) => {
              this.$message.success('更新成功')
              this.closeDrawer()
              this.$emit('queryTable')
            })
          }
        }
      })
    },

    checkboxChange (checkedValues) {
    }
  }
}
</script>

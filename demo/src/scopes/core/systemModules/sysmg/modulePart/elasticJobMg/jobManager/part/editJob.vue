<template>
  <ta-form :autoFormCreate="(form)=>{this.form = form}" :layout="formLayout">
    <ta-form-item label='作业名称'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="jobName"
                  :fieldDecoratorOptions="{ initialValue: initData.jobName }">
      <ta-input :disabled="true"/>
    </ta-form-item>
    <ta-form-item label='作业类型'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="jobType"
                  :fieldDecoratorOptions="{ initialValue: initData.jobType }">
      <ta-input :disabled="true"/>
    </ta-form-item>
    <ta-form-item label='作业实现类'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="jobClass"
                  :fieldDecoratorOptions="{ initialValue: initData.jobClass }">
      <ta-input :disabled="true"/>
    </ta-form-item>
    <ta-form-item label='Cron表达式'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="cron"
                  :fieldDecoratorOptions="{ initialValue: initData.cron }">
      <ta-input/>
    </ta-form-item>
    <ta-form-item label='自定义参数'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="jobParameter"
                  :fieldDecoratorOptions="{ initialValue: initData.jobParameter }">
      <ta-input/>
    </ta-form-item>
    <ta-form-item label='分片总数'
                  :labelCol="formItemLayout.labelColTwo"
                  :wrapperCol="formItemLayout.wrapperColTwo"
                  fieldDecoratorId="shardingTotalCount"
                  :fieldDecoratorOptions="{ initialValue: initData.shardingTotalCount }">
      <ta-input-number/>
    </ta-form-item>
    <ta-form-item label='监听作业端口'
                  :labelCol="formItemLayout.labelColTwo"
                  :wrapperCol="formItemLayout.wrapperColTwo"
                  fieldDecoratorId="monitorPort"
                  :fieldDecoratorOptions="{ initialValue: initData.monitorPort }">
      <ta-input-number/>
    </ta-form-item>
    <ta-form-item label='时间误差秒数'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="maxTimeDiffSeconds"
                  :fieldDecoratorOptions="{ initialValue: initData.maxTimeDiffSeconds }"
                  extra="全称：最大容忍本机与注册中心的时间误差秒数">
      <ta-input-number/>
    </ta-form-item>
    <ta-form-item label='状态修复周期'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="reconcileIntervalMinutes"
                  :fieldDecoratorOptions="{ initialValue: initData.reconcileIntervalMinutes }"
                  extra="全称：作业服务器状态修复周期">
      <ta-input-number/>
    </ta-form-item>
    <ta-form-item label='监控状态'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="monitorExecution"
                  :fieldDecoratorOptions="{ initialValue: initData.monitorExecution, valuePropName: 'checked' }"
                  extra="全称：监控作业执行时状态">
      <ta-switch checkedChildren="是" unCheckedChildren="否"/>
    </ta-form-item>
    <ta-form-item label='支持转移'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="failover"
                  :fieldDecoratorOptions="{ initialValue: initData.failover, valuePropName: 'checked' }"
                  extra="全称：支持自动失效转移">
      <ta-switch checkedChildren="是" unCheckedChildren="否"/>
    </ta-form-item>
    <ta-form-item label='支持错过重执行'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="misfire"
                  :fieldDecoratorOptions="{ initialValue: initData.misfire, valuePropName: 'checked' }">
      <ta-switch checkedChildren="是" unCheckedChildren="否"/>
    </ta-form-item>
    <ta-form-item label='分片对照表'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="shardingItemParameters"
                  :fieldDecoratorOptions="{ initialValue: initData.shardingItemParameters }"
                  extra="全称：分片序列号/参数对照表">
      <ta-textarea :autosize="{ minRows: 2, maxRows: 2 }"></ta-textarea>
    </ta-form-item>
    <ta-form-item label='策略类全路径'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="jobShardingStrategyClass"
                  :fieldDecoratorOptions="{ initialValue: initData.jobShardingStrategyClass }"
                  extra="全称：作业分片策略实现类全路径">
      <ta-input/>
    </ta-form-item>
    <ta-form-item label='异常类全路径'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="job_exception_handler"
                  :fieldDecoratorOptions="{ initialValue: initData.jobExceptionHandler }"
                  extra="全称：定制异常处理类全路径">
      <ta-input/>
    </ta-form-item>
    <ta-form-item label='线程池全路径'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="executor_service_handler"
                  :fieldDecoratorOptions="{ initialValue: initData.executorServiceHandler }"
                  extra="全称：定制线程池全路径">
      <ta-input/>
    </ta-form-item>
    <ta-form-item label='作业描述'
                  :labelCol="formItemLayout.labelCol"
                  :wrapperCol="formItemLayout.wrapperCol"
                  fieldDecoratorId="description"
                  :fieldDecoratorOptions="{ initialValue: initData.description }">
      <ta-input/>
    </ta-form-item>
  </ta-form>
</template>
<script>

import api from '../api/index'

export default {
  name: 'jobDetail',
  props: ['initData'],
  components: {},
  data () {
    return {
      // form布局配置
      formLayout: 'horizontal',
      formItemLayout: {
        labelCol: {span: 6},
        wrapperCol: {span: 18},
        labelColTwo: {span: 12},
        wrapperColTwo: {span: 12}
      }
    }
  },
  methods: {
    // 重置作业详细信息表单
    fnResetJobDetail () {
      this.form.resetFields()
    },
    // 保存作业详细信息
    fnSaveJobDetail () {
      this.form.validateFields((err, values) => {
        values.zkId = this.initData.zkId
        if (!err) {
          api.saveJobDetailInfo(values, (result) => {
            this.$message.success('更新作业信息成功')
            this.$emit('close')
          })
        }
      })
    }
  }
}
</script>

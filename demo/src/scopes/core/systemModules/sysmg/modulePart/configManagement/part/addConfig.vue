<template>
  <ta-drawer title="新增配置" width="500" placement="right" :closable="true" @close="closeEdit" :visible="visible" destroyOnClose>
    <ta-form :autoFormCreate="(form)=>{this.form = form}">

      <ta-form-item label='字段名'
                    fieldDecoratorId="fieldName"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '字段名不能为空!' }]}">
        <ta-input />
      </ta-form-item>

      <ta-form-item label='备注'
                    fieldDecoratorId="configComment"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '备注不能为空!' }], initialValue:''}">
        <ta-input />
      </ta-form-item>

      <ta-form-item style="display: none;"
                    label='功能类型'
                    fieldDecoratorId="functionType"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '功能类型不能为空!' }], initialValue:functionType}">
        <ta-input />
      </ta-form-item>


      <ta-form-item label='配置类型'
                    fieldDecoratorId="dataType"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '配置类型不能为空!' }], initialValue:''}">
        <ta-select style="width: 90%" @change="dataTypeChange">
          <ta-select-option v-for="item in CollectionData('CONFIGDATATYPE')" :key='item.value' :value='item.value'>{{item.label}}</ta-select-option>
        </ta-select>
        <ta-popover
          width="100"
          trigger="hover"
          content="1.如果配置类型是选项,则需要设置码表类型或码表值；2.配置类型应与默认值匹配；如：选择日期，则默认值为日期字符串，eg：2019-11-14">
          <ta-icon slot="reference" type="question-circle" style='cursor: pointer;margin-left: 10px;'/>
        </ta-popover>
      </ta-form-item>
      <ta-label-con label="选项名称" v-if="type == '3'">
        <ta-radio-group :options="[{label:'码表类型',value:'collectionName'},{label:'自定义码表',value:'collectionDatas'}]" @change="fnOnRadioChange" :defaultValue="'collectionName'" />
      </ta-label-con>
      <ta-form-item v-if="type == '3' && radioChecked == '1'"
                    label='码表类型'
                    fieldDecoratorId="collectionName"
                    :fieldDecoratorOptions="{initialValue:'',rules: [{ required: true, message: '码表类型不能为空!' }]}">
        <ta-input key="collectionName" style="width: 90%" placeholder="输入字典类型，如BL、SEX"/>
        <ta-popover
          width="100"
          trigger="hover"
          content="如果输入BL，则默认值可填true或false">
          <ta-icon slot="reference" type="question-circle" style='cursor: pointer;margin-left: 10px;'/>
        </ta-popover>
      </ta-form-item>
      <ta-form-item v-if="type == '3' && radioChecked == '2'"
                    label='自定义码表'
                    fieldDecoratorId="collectionDatas"
                    :fieldDecoratorOptions="{initialValue:'',rules: [{ required: true, message: '自定义码表不能为空!' }]}">
        <ta-input key="collectionDatas" style="width: 90%" placeholder='输入类似：[{"value":"on","label":"开启状态"}]'/>
        <ta-popover
          width="300"
          trigger="hover"
          content='输入类似：[{"value":"on","label":"开启状态"},{"value":"off","label":"关闭状态"}]， 默认值可填on或off'>
          <ta-icon slot="reference" type="question-circle" style='cursor: pointer;margin-left: 10px;'/>
        </ta-popover>
      </ta-form-item>
      <!-- 配置类型不同，展示的默认值框不同 -->

      <ta-form-item v-if="type == '2'"
                    label='默认值'
                    fieldDecoratorId="defaultDateValue"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '默认值不能为空!' }]}">
        <ta-date-picker format="YYYY-MM-DD" />
      </ta-form-item>
      <ta-form-item v-else-if="type == '4'"
                    label='默认值'
                    fieldDecoratorId="defaultNumValue"
                    :fieldDecoratorOptions="{ rules: [{required: true, message: '默认值不能为空/格式错误!' }]}">
        <ta-input-number />
      </ta-form-item>
      <ta-form-item v-else
                    label='默认值'
                    fieldDecoratorId="defaultValue"
                    :fieldDecoratorOptions="{ rules: [{ required: true, message: '默认值不能为空!' }], initialValue:''}">
        <ta-input />
      </ta-form-item>
    </ta-form>
    <div slot="footer" >
      <ta-button-group>
        <ta-button  @click="reset()">重置</ta-button>
        <ta-button type="primary" @click="save()" >保存</ta-button>
      </ta-button-group>
    </div>
  </ta-drawer>
</template>
<script>
import $api from '../api'
import moment from 'moment'

export default {
  name: 'addConfig',
  props: ['visible', 'rowData', 'configKey'],
  components: {  },
  data () {
    return {
      type: '',
      form: null,
      loading: false,
      functionType: '2',
      radioChecked: '1',
    }
  },
  watch: {
    visible (val) {
      if (val) {

      }
    }
  },
  methods: {
    moment,
    closeEdit () {
      this.type = '',
      this.$emit('close')
    },


    save () {
      this.form.validateFields((err, values) => {
        if (err){
         return
        }
        if (this.configKey == null || this.configKey == '') {
          this.$message.error('未选择配置类别！')
          return
        }
        let data = this.form.getFieldsValue();
        data.fieldName = this.configKey + "." + data.fieldName;

        if (this.form.getFieldValue("fieldName").trim()  == ''){
          this.$message.error('字段名不能为空')
          return;
        }

        if (this.type  == '3'){
          if (this.form.getFieldValue("collectionName") == '' && this.form.getFieldValue("collectionDatas") == '') {
            this.$message.error('字典类型不能同时为空')
            return;
          }

          if (this.radioChecked == '2' && this.form.getFieldValue("collectionDatas") != ''){
            try {
              JSON.parse(this.form.getFieldValue("collectionDatas"))
            }catch (e) {
              this.$message.error('自定义码表数据有误')
              return
            }
          }
        }

        if (this.type == '2'){
          data.defaultValue = moment(data.defaultDateValue).format('YYYY-MM-DD')
        }else if (this.type == '4'){
          data.defaultValue = data.defaultNumValue
        }

        if(this.radioChecked == '1'){
          data.collectionDatas=''
        }else {
          data.collectionName=''
        }

        $api.addSysConfig(data, (data) => {
          this.$message.success('添加成功')
          this.closeEdit()
          this.radioChecked = '1'
          this.$emit('addSuccess')
        })
      })

    },

    dataTypeChange(val){
      this.form.resetFields("defaultValue")
      this.type = val;
    },

    reset(){
      this.form.resetFields()
      this.type = ''
    },
    fnOnRadioChange(e){
      if (e.target.value == 'collectionName'){
        this.radioChecked = '1'
      }else {
        this.radioChecked = '2'
      }
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .tag-select { .user-select() }
</style>

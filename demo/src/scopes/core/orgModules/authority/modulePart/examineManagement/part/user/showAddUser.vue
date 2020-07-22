<template>
  <ta-drawer title="个人信息" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <template v-for="formSetting in formNormalShowSettings">
        <renderFormItem :key="formSetting.id" :formSetting="formSetting" :isShow="true" :showValues="formData" :simpleShowSlot="simpleShowSlot"  renderType="SHOW">
          <div class="pos-avatar" v-if="formSetting.id == 'avatar'">
            <div v-if="imageUrl && imageUrl.length" class="img-avatar" :style="{ backgroundImage: 'url('+imageUrl+')'}"></div>
            <i v-else class="anticon anticon-user icon-upload"></i>
          </div>
          <template v-else-if="formSetting.id == 'orgIdShow'">{{formData.namePath}}</template>
          <template v-else-if="formSetting.id == 'tags'" v-for="tag in tags">
            <ta-tag :key="tag.tagid" v-if="selectedTags.indexOf(tag.tagid) > -1" class="tag-select">{{tag.tagname}}</ta-tag>
          </template>
        </renderFormItem>
      </template>
      <ta-collapse :bordered="false" v-if="formMoreShowSettings.length > 0">
        <ta-collapse-panel header="更多个人信息" key="1" style="border:none">
          <template v-for="formSetting in formMoreShowSettings">
            <renderFormItem :key="formSetting.id" :formSetting="formSetting" :isShow="true" :showValues="formData" :simpleShowSlot="simpleShowSlot" renderType="SHOW">
              <div class="pos-avatar" v-if="formSetting.id == 'avatar'">
                <div v-if="imageUrl && imageUrl.length" class="img-avatar" :style="{ backgroundImage: 'url('+imageUrl+')'}"></div>
                <i v-else class="anticon anticon-user icon-upload"></i>
              </div>
              <template v-else-if="formSetting.id == 'orgIdShow'">{{formData.namePath}}</template>
              <template v-else-if="formSetting.id == 'tags'" v-for="tag in tags">
                <ta-tag :key="tag.tagid" v-if="selectedTags.indexOf(tag.tagid) > -1" class="tag-select">{{tag.tagname}}</ta-tag>
              </template>
            </renderFormItem>
          </template>
        </ta-collapse-panel>
      </ta-collapse>
    </ta-form>
  </ta-drawer>
</template>
<script>
import $api from '../../api/index'
import renderFormItem from '@projectCommon/components/renderFormItem'
import mixins from '../../mixinsUser'

const showColumnFilter = ['password', 'password_2']
const simpleShowSlot = ['loginId']

export default {
  name: 'showAddUser',
  props: ['visible', 'rowData', 'chooseUserResult'],
  components: { renderFormItem },
  mixins: [mixins],
  data () {
    return {
      formData: {},
      simpleShowSlot,
      imageUrl: '',
      tags: [],
      selectedTags: []
    }
  },
  computed: {
    formNormalShowSettings () {
      return this.formNormalSettings.filter(a => showColumnFilter.indexOf(a.id) == -1) || []
    },
    formMoreShowSettings () {
      return this.formMoreSettings.filter(a => showColumnFilter.indexOf(a.id) == -1) || []
    }
  },
  mounted () {
    $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
      this.formData = result.data[this.chooseUserResult][0]
      this.buildForm(this.formData)
      this.formData.orgIdShow = '2'
      this.imageUrl = result.data[this.chooseUserResult][0].portrait || ''

      // 用户标签显示
      this.selectedTags = []
      this.tags = []
      for (const i in result.data[this.chooseUserResult][0].userTags) {
        const orgTag = result.data[this.chooseUserResult][0].userTags[i]
        this.tags = result.data[this.chooseUserResult][0].userTags
        if (orgTag.ischecked == 1) {
          this.selectedTags.push(orgTag.tagid)
        }
      }
    })
  },
  methods: {
    getFormNecessarySettings (initData) {
      return [
        {
          id: 'avatar',
          formId: '',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: '用户头像',
          class: 'avatar-form-item',
          display: true,
          exist: true,
          formItemLayout: this.formItemLayouts.default
        },
        {
          id: 'orgIdShow',
          formId: '',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: '所属组织',
          decoratorOptions: {},
          display: true,
          exist: true,
          formItemLayout: this.formItemLayouts.default
        },
        {
          id: 'name',
          formId: 'name',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '姓名',
          decoratorOptions: {},
          display: true,
          exist: true,
          formItemLayout: this.formItemLayouts.default
        },
        {
          id: 'loginId',
          formId: 'loginId',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: '账号',
          decoratorOptions: {},
          display: true,
          exist: true,
          formItemLayout: this.formItemLayouts.default
        }
      ]
    },

    closeDrawer () {
      this.$emit('close')
    }

  }
}
</script>
<style type="text/less" lang="less">
  .avatar-form-item .ant-form-item-label { margin-top: 12px; }
</style>
<style scoped type="text/less" lang="less">
  .pos-avatar { position: relative; overflow: hidden; width: 64px; height: 64px; line-height: 64px; margin-left: 10px; font-size: 32px; text-align: center; background: #ccc; color: #fff; border-radius: 100%; }
  .img-avatar { width: 64px; height: 64px; background-repeat: no-repeat; background-size: cover; background-position: center; }
  .tag-select { border-color: @primary-color; color: @primary-color; .user-select() }
</style>

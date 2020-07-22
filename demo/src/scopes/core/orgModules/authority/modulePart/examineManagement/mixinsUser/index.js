// 所有页面需要执行的mixins
import $api from '../api/index'
import extendUserSetting from '@projectCommon/js/extendConfig/extendUserSetting'
import isArray from 'lodash/isArray'

const formItemLayouts = {
  default: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }
}

const mixins = {
  data () {
    return {
      formItemLayouts,
      extendSettings: extendUserSetting,
      formSettings: []
    }
  },
  created () {
    $api.queryUserSettingTable((data) => {
      if (isArray(data.resultData) && data.resultData.length > 0) this.extendSettings = data.resultData
    })
  },
  computed: {
    formNormalSettings () {
      return this.formSettings.filter(a => !a.isMore && a.exist) || []
    },
    formMoreSettings () {
      return this.formSettings.filter(a => a.isMore && a.exist) || []
    }
  },
  methods: {
    buildForm (initData) {
      this.formSettings = this.getFormSettings(initData)
    },
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
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'orgId',
          formId: 'orgId',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: '所属组织',
          decoratorOptions: {
            rules: [{ required: true, message: '请选择人员的所属组织' }]
          },
          display: true,
          exist: this.editType == '1',
          formItemLayout: formItemLayouts.default
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
          exist: this.editType == '2',
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'name',
          formId: 'name',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '姓名',
          decoratorOptions: {
            rules: [{ required: true, message: '请输入人员姓名' }, { max: 20, message: '姓名长度不能大于20' }], initialValue: initData.name
          },
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'loginId',
          formId: 'loginId',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '账号',
          decoratorOptions: {
            rules: [{ required: true, message: '请输入人员登录帐号' }], initialValue: initData.loginId
          },
          display: true,
          exist: true,
          disabled: this.editType == '2',
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'password',
          formId: 'password',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: '登录口令',
          decoratorOptions: {
            rules: [{
              required: true, message: '请输入登录口令'
            }, {
              min: 6, message: '登录口令不能少于6位字符'
            }, {
              validator: this.validatePwd
            }]
          },
          display: true,
          exist: this.editType == '1',
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'password_2',
          formId: 'password_2',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: '确认口令',
          decoratorOptions: {
            rules: [{ validator: this.compareToFirstPwd}, { required: true, message: '请再次输入登录口令' }]
          },
          display: true,
          exist: this.editType == '1',
          formItemLayout: formItemLayouts.default
        }
      ]
    },
    getFormSettings (initData = {}) {
      let propSettings = this.extendSettings.sort((a, b) => {
        return a.orderNo - b.orderNo
      }).map(setting => {
        let formId = setting.formId
        let label = setting.displayText || ''
        let propSetting = {
          id: setting.fieldId,
          formId: formId,
          class: null,
          formItem: {
            type: setting.formType,
            collection: setting.connectAA10
          },
          label: label,
          display: setting.hide === '0',
          exist: setting.effective === '1',
          disabled: setting.unchangeable === '1',
          formItemLayout: formItemLayouts[formId] || formItemLayouts.default,
          decoratorOptions: {},
          isMore: setting.more === '1'
        }

        // todo protectPrivacy

        // rule 解析
        let rules = []
        if (setting.required === '1') {
          rules.push({ required: true, message: label + '是必须的' })
        }
        if (!isNaN(parseInt(setting.contentSize))) {
          rules.push({ max: setting.contentSize, message: label + '内容长度不能超过' + setting.contentSize })
        }
        if (setting.validReg) {
          let isreg
          try {
            isreg = eval(setting.validReg) instanceof RegExp
          } catch (e) {
            isreg = false
          }
          if (isreg) {
            rules.push({ pattern: eval(setting.validReg), message: '请输入正确的' + label + '内容' })
          }
        }
        propSetting.decoratorOptions.rules = rules

        // 初始值
        if (initData.hasOwnProperty(formId)) {
          propSetting.decoratorOptions.initialValue = initData[formId]
        }

        return propSetting
      })

      return this.getFormNecessarySettings(initData).concat(propSettings)
    }
  }
}

export default mixins

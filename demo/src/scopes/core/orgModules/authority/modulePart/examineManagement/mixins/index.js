// 动态配置支持 mixins
import $api from '../api/index'
import extendOrgSetting from '@projectCommon/js/extendConfig/extendOrgSetting'
import isArray from 'lodash/isArray'

const formItemLayouts = {
  default: {
    labelCol: {span: 6},
    wrapperCol: {span: 18}
  }
}

const mixins = {
  data () {
    return {
      formItemLayouts,
      extendSettings: extendOrgSetting,
      formSettings: []
    }
  },
  created () {
    $api.queryOrgSettingTable((data) => {
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
          id: 'porgId',
          formId: 'porgId',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '上级组织机构ID',
          decoratorOptions: {
            rules: [{required: true}], initialValue: initData.porgId
          },
          display: false,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'pOrgName',
          formId: 'pOrgName',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '上级组织机构',
          decoratorOptions: {
            initialValue: initData.pOrgName
          },
          display: initData.porgId != '0',
          exist: true,
          disabled: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'orgId',
          formId: 'orgId',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '组织机构ID',
          decoratorOptions: {
            initialValue: initData.orgId
          },
          display: false,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'orgName',
          formId: 'orgName',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '组织机构名称',
          decoratorOptions: {
            rules: [{required: true, message: '组织机构名称不能为空!'}, {max: 300, message: '组织机构名称超过限制长度!'}],
            initialValue: initData.orgName
          },
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'orgType',
          formId: 'orgType',
          formItem: {
            type: 'radioButton',
            collection: 'ORGTYPE'
          },
          label: '组织类型',
          decoratorOptions: {
            rules: [{required: true, message: '请选择对应组织类型'}], initialValue: initData.orgType
          },
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'effective',
          formId: 'effective',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: '有效标识',
          decoratorOptions: {
            valuePropName: 'checked', initialValue: initData.effective
          },
          display: true,
          exist: true,
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
          rules.push({required: true, message: label + '是必须的'})
        }
        if (!isNaN(parseInt(setting.contentSize))) {
          rules.push({max: setting.contentSize, message: label + '内容长度不能超过' + setting.contentSize})
        }
        if (setting.validReg) {
          let isreg
          try {
            isreg = eval(setting.validReg) instanceof RegExp
          } catch (e) {
            isreg = false
          }
          if (isreg) {
            rules.push({pattern: eval(setting.validReg), message: '请输入正确的' + label + '内容'})
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

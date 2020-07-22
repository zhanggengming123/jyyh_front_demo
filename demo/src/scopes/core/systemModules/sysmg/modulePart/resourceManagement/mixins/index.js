// 所有页面需要执行的mixins
import rapi from '../api/index'
import extendResourceSetting from '@projectCommon/js/extendConfig/extendResourceSetting'
import isArray from 'lodash/isArray'
import commonMixins from '@projectCommon/js/extendConfig/commonMixins'

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
      extendSettings: extendResourceSetting,
      formSettings: [],
      ...commonMixins.data
    }
  },
  created () {
    if (!window.mixinsResource) {
      window.mixinsResource = true
      rapi.queryResourceSettingTable((data) => {
        if (isArray(data.resultData) && data.resultData.length > 0) this.extendSettings = data.resultData
        window.mixinsResource = data.resultData
        this.buildForm({})
      })
    } else {
      this.extendSettings = isArray(window.mixinsResource) && window.mixinsResource.length ? window.mixinsResource : this.extendSettings
      this.buildForm({})
    }
  },
  computed: {
    formNormalSettings () {
      return this.formSettings.filter(a => !a.isMore && a.exist) || []
    },
    formMoreSettings () {
      return this.formSettings.filter(a => a.isMore && a.exist) || []
    }
  },
  watch: {
    ...commonMixins.watch
  },
  methods: {
    ...commonMixins.methods,
    buildForm (initData) {
      this.formSettings = this.getFormSettings(initData)
    },
    getFormNecessarySettings (initData) {
      return [
        {
          id: 'pResourceId',
          formId: 'pResourceId',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '上级功能资源ID',
          decoratorOptions: {
            rules: [{ required: true }], initialValue: initData.porgId
          },
          display: false,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'pResourceName',
          formId: 'pResourceName',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '上级功能名称',
          decoratorOptions: {},
          display: true,
          exist: true,
          disabled: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'resourceId',
          formId: 'resourceId',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '功能资源ID',
          decoratorOptions: {},
          display: false,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'name',
          formId: 'name',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '功能名称',
          decoratorOptions: {
            rules: [{ required: true, message: '请填写功能名称!' }]
          },
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'url',
          formId: 'url',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '功能URL',
          decoratorOptions: {},
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'restUrl',
          formId: 'restUrl',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: '后台RestURL',
          decoratorOptions: {},
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'code',
          formId: 'code',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '自定义编码',
          decoratorOptions: {},
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'orderNo',
          formId: 'orderNo',
          formItem: {
            type: 'input',
            collection: null
          },
          label: '排序号',
          decoratorOptions: {
            rules: [{ type: 'number' }]
          },
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'resourceType',
          formId: 'resourceType',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: '菜单类型',
          decoratorOptions: {
            initialValue: initData.resourceType, rules: [{ required: true, message: '请选择菜单类型!' }]
          },
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        },
        {
          id: 'securityPolicy',
          formId: 'securityPolicy',
          formItem: {
            type: 'radioButton',
            collection: 'SECURITYPOLICY'
          },
          label: '安全策略',
          decoratorOptions: {
            initialValue: initData.securityPolicy, rules: [{ required: true, message: '请选择安全策略!' }]
          },
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        }, {
        //   id: 'uiAuthorityPolicy',
        //   formId: 'uiAuthorityPolicy',
        //   formItem: {
        //     type: 'radioButton',
        //     collection: 'UIAUTHORITYPOLICY'
        //   },
        //   label: '界面元素授权',
        //   decoratorOptions: {
        //     initialValue: initData.uiAuthorityPolicy
        //   },
        //   display: true,
        //   exist: true,
        //   formItemLayout: formItemLayouts.default
        // }, {
          id: 'securityLevel',
          formId: 'securityLevel',
          formItem: {
            type: 'radioButton',
            collection: 'SECURIYTLEVEL'
          },
          label: '安全认证级别',
          decoratorOptions: {
            initialValue: `${initData.securityLevel}`, rules: [{ required: true, message: '请选择安全认证级别!' }]
          },
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        }, {
          id: 'sysCode',
          formId: 'sysCode',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: '功能所属系统',
          decoratorOptions: {
            initialValue: initData.sysCode, rules: [{ required: true, message: '请选择功能所属系统!' }]
          },
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        }, {
          id: 'effectiveFlag',
          formId: 'effectiveFlag',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: '有效性',
          decoratorOptions: {
            initialValue: true, valuePropName: 'checked'
          },
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        }, {
          id: 'menuImage',
          formId: 'menuImage',
          formItem: {
            type: 'slot',
            collection: null
          },
          label: 'APP菜单图片',
          decoratorOptions: {
            // initialValue: true
          },
          display: true,
          exist: true,
          formItemLayout: formItemLayouts.default
        }
      ]
    },
    getFormSettings (initData = {}) {
      const propSettings = this.extendSettings.sort((a, b) => {
        return a.orderNo - b.orderNo
      }).map(setting => {
        const formId = setting.formId
        const label = setting.displayText || ''
        const placeholder = setting.tiText || ''
        const propSetting = {
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
          placeholder: placeholder,
          isMore: setting.more === '1'
        }

        // todo protectPrivacy

        // rule 解析
        const rules = []
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

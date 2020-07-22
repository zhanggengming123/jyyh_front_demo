<script type="text/jsx">
/**
   * renderType: add edit show
   */
import selectMultiple from '@projectCommon/components/selectMultiple'
import taSensitiveInput from '@yh/ta404-ui/es/sensitive-input'
import '@yh/ta404-ui/es/sensitive-input/style/index.less'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
const RENDER_TYPE = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  SHOW: 'SHOW'
}
export default {
  components: { selectMultiple, taSensitiveInput },
  props: {
    renderType: {
      type: String,
      default: RENDER_TYPE.ADD
    },
    renderProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showValues: {
      type: Object,
      default: () => {
        return {}
      }
    },
    simpleShowSlot: {
      type: Array,
      default: () => {
        return []
      }
    },
    formSetting: {
      required: true,
      type: Object,
      default: () => {
        return {}
      }
    },
    isShowParentItem: {
      type: Boolean,
      default: true
    }
  },
  data () {
    const { formSetting } = this.$props
    return {

    }
  },
  methods: {
    buildItemShowContext (type) {
      const slot = this.$slots.default
      const formItem = this.formSetting.formItem
      const formItemId = this.formSetting.formId || ''

      const val = this.showValues[formItemId]
      switch (type) {
        case 'slot':
          return this.simpleShowSlot.indexOf(formItemId) == -1 ? slot : val
        case 'select':
        case 'radio':
        case 'radioButton':
          return this.CollectionLabel(formItem.collection, val)
        case 'select-multiple':
          return isString(val) ? val.split(',').map(value => this.CollectionLabel(formItem.collection, value)).join(',') : val
        case 'sensitive-input':
          let objVal = (isString(val) && val != '')?JSON.parse(val) : val
          return isObject(objVal) ? objVal.sensitiveField : val
        default:
          return val
      }
    },
    buildItemContext (type) {
      const slot = this.$slots.default
      const disabled = this.formSetting.disabled
      const formItem = this.formSetting.formItem
      const formItemId = this.formSetting.formId
      const formLabel = this.formSetting.label
      const placeholder = this.formSetting.placeholder
      const renderType = this.renderType
      const renderProp = this.renderProp

      switch (type) {
        case 'slot':
          return slot
        case 'select':
          return (<ta-select placeholder={placeholder} disabled={disabled} allowClear={true} collection-type={formItem.collection}>
          </ta-select>)
        case 'select-multiple':
          return (<select-multiple placeholder={placeholder} collection={formItem.collection} disabled={disabled} allowClear={true}>
          </select-multiple>)
        case 'radio':
          return (<ta-radio-group disabled={disabled} collection-type={formItem.collection}>
          </ta-radio-group>)
        case 'radioButton':
          return (<ta-radio-group buttonStyle="solid" disabled={disabled} collection-type={formItem.collection}>
            {
              this.CollectionData(formItem.collection)?.map(({ label, value }) =>
                <ta-radio-button key={value} value={value}>
                  {label}
                </ta-radio-button>)
            }
          </ta-radio-group>)
        case 'sensitive-input':
          return (<ta-sensitive-input inputKey={formItemId} placeholder={placeholder} description={formLabel} auth-user={renderType == RENDER_TYPE.EDIT} authRequest={renderProp.authRequest}/>)
        default:
          return (<ta-input placeholder={placeholder} disabled={disabled}/>)
      }
    }
  },
  render () {
    const renderType = this.renderType
    let _class = this.formSetting.class || ''
    const formItemId = this.formSetting.formId || ''
    const formLabel = this.formSetting.label
    const decoratorOptions = this.formSetting.decoratorOptions
    if (decoratorOptions && decoratorOptions.rules) {
      const rules = decoratorOptions.rules
      rules.map((item) => {
        if (item.type == 'number') {
          item.transform = (value) => { return Number(value) }
          item.message = '请输入数字'
        }
      })
    }
    const formItemLayout = this.formSetting.formItemLayout
    const formItem = this.formSetting.formItem

    const display = this.formSetting.display !== false
    if (!display) {
      _class += ' displayNone'
    }
    if (this.formSetting.formId == 'pResourceName' && !this.isShowParentItem) {
      _class += ' displayNone'
    }
    return (
      renderType == RENDER_TYPE.SHOW ? <ta-form-item
        label={formLabel}
        className={_class}
        labelCol={formItemLayout.labelCol}
        wrapperCol={formItemLayout.wrapperCol}
      >
        {this.buildItemShowContext(formItem.type)
        }
      </ta-form-item>
        : <ta-form-item
          label={formLabel}
          class={_class}
          labelCol={formItemLayout.labelCol}
          wrapperCol={formItemLayout.wrapperCol}
          fieldDecoratorId={formItemId}
          fieldDecoratorOptions={decoratorOptions}
        >
          {this.buildItemContext(formItem.type)}
        </ta-form-item>
    )
  }
}
</script>
<style type="text/less" lang="less" scoped>
  .displayNone{
    display: none;
  }
</style>

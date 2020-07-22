// todo protectPrivacy 未实现
// 新增 字段 formId, effective, more
// formType 类型 input select radio slot, 其中 slot 适用复杂情况, 需要更改框架页面内容(可能需要优化)

// 框架默认配置
const extendSettings = [ {
  fieldId: 'icon',
  formId: 'icon',
  displayText: '图标名称',
  hide: '0',
  effective: '1',
  required: '0',
  unchangeable: '0',
  protectPrivacy: '0',
  orderNo: 1,
  contentSize: 30,
  tiText: null,
  validReg: null,
  connectAA10: null,
  formType: 'input',
  more: '0'
// }, {
//   fieldId: 'iconColor',
//   formId: 'iconColor',
//   displayText: '图标颜色',
//   hide: '0',
//   effective: '1',
//   required: '0',
//   unchangeable: '0',
//   protectPrivacy: '0',
//   orderNo: 2,
//   contentSize: 7,
//   tiText: '',
//   validReg: '',
//   connectAA10: null,
//   formType: 'slot',
//   more: '0'
}]

// 扩展属性默认配置
let extendSettingDefault = {
  fieldId: 'field',
  formId: 'field',
  displayText: '扩展信息',
  effective: '0',
  hide: '1',
  required: '0',
  unchangeable: '0',
  protectPrivacy: '0',
  orderNo: 1,
  contentSize: null,
  tiText: null,
  validReg: null,
  connectAA10: null,
  formType: 'input',
  more: '1'
}

// 补位辅助函数
function PrefixInteger (num, n) {
  return (Array(n).join(0) + num).slice(-n)
}

// 扩展属性个数
const extendLength = 10

// 构造合并, 返回有效队列
for (let i = 1; i <= extendLength; i++) {
  let setting = Object.assign({}, extendSettingDefault)
  let field = PrefixInteger(i, 2)
  setting.fieldId = setting.fieldId + field
  setting.formId = setting.formId + field
  setting.displayText = setting.displayText + field
  setting.orderNo = extendSettings.length + 1
  extendSettings.push(setting)
}

export default extendSettings

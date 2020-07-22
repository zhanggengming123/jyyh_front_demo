//todo protectPrivacy tiText 未实现
//新增 字段 formId, isMore
// formType 类型 input select radio radioButton slot, 其中 slot 适用复杂情况, 需要更改框架页面内容(可能需要优化)

//框架默认配置
const extendSettings = [{
  fieldId: 'areaValue',
  formId: 'areaValue',
  displayText: '所属行政区',
  hide: '0',
  effective: '1',
  required: '0',
  unchangeable: '0',
  protectPrivacy: '0',
  orderNo: 1,
  contentSize: null,
  tiText: null,
  validReg: null,
  connectAA10: null,
  formType:'slot',
  more: '0',
},{
  fieldId: 'customNo',
  formId: 'customNo',
  displayText: '自定义编码',
  hide: '0',
  effective: '1',
  required: '0',
  unchangeable: '0',
  protectPrivacy: '0',
  orderNo: 2,
  contentSize: 30,
  tiText: '',
  validReg: '',
  connectAA10: null,
  formType: 'input',
  more: '0',
},{
  fieldId: 'orderNo',
  formId: 'orderNo',
  displayText: '排序号',
  hide: '1',
  effective: '1',
  required: '0',
  unchangeable: '1',
  protectPrivacy: '0',
  orderNo: 3,
  contentSize: null,
  tiText: '',
  validReg: '',
  connectAA10: null,
  formType: 'input',
  more: '0',
},{
  fieldId: 'orgCode',
  formId: 'orgCode',
  displayText: '组织代码',
  hide: '0',
  effective: '1',
  required: '0',
  unchangeable: '0',
  protectPrivacy: '0',
  orderNo: 4,
  contentSize: 18,
  tiText: '',
  validReg: null,
  connectAA10: null,
  formType: 'input',
  more: '0',
},{
  fieldId: 'orgManager',
  formId: 'orgManager',
  displayText: '负责人',
  hide: '0',
  effective: '1',
  required: '0',
  unchangeable: '0',
  protectPrivacy: '0',
  orderNo: 5,
  contentSize: null,
  tiText: '',
  validReg: null,
  connectAA10: null,
  formType: 'slot',
  more: '0',
},{
  fieldId: 'contacts',
  formId: 'contacts',
  displayText: '联系人',
  hide: '0',
  effective: '1',
  required: '0',
  unchangeable: '0',
  protectPrivacy: '0',
  orderNo: 6,
  contentSize: null,
  tiText: '',
  validReg: null,
  connectAA10: null,
  formType: 'slot',
  more: '0',
},{
  fieldId: 'tel',
  formId: 'tel',
  displayText: '联系电话',
  hide: '0',
  effective: '1',
  required: '0',
  unchangeable: '0',
  protectPrivacy: '0',
  orderNo: 7,
  contentSize: 20,
  tiText: '',
  validReg: '/^((\\d{3,4})|\\d{3,4}-)?\\d{7,8}$/',
  connectAA10: null,
  formType: 'input',
  more: '0',
},{
  fieldId: 'address',
  formId: 'address',
  displayText: '联系地址',
  hide: '0',
  effective: '1',
  required: '0',
  unchangeable: '0',
  protectPrivacy: '0',
  orderNo: 8,
  contentSize: 450,
  tiText: '',
  validReg: null,
  connectAA10: null,
  formType: 'input',
  more: '0',
}, {
  fieldId: 'tags',
  formId: 'tags',
  displayText: '组织标签',
  hide: '0',
  effective: '1',
  required: '0',
  unchangeable: '0',
  protectPrivacy: '0',
  orderNo: 10,
  contentSize: null,
  tiText: '',
  validReg: null,
  connectAA10: null,
  formType: 'slot',
  more: '0',
}]

//扩展属性默认配置
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
  more: '1',
}

//补位辅助函数
function PrefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}

//扩展属性个数
const extendLength = 10;

//构造合并, 返回有效队列
for(let i=1;i<=extendLength;i++){
  let setting = Object.assign({},extendSettingDefault)
  let field = PrefixInteger(i,2)
  setting.fieldId = setting.fieldId+field
  setting.formId = setting.formId+field
  setting.displayText = setting.displayText+field
  setting.orderNo = extendSettings.length + 1
  extendSettings.push(setting)
}

export default extendSettings

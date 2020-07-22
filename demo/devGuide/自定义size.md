# 自定义每个组件的默认size

## 步骤

1. 在入口文件中添加以下代码

```javascript
Vue.prototype.$ELEMENT = {
  size: 'large', // 全局size，如果组件的size存在默认值，则会使用这个值替代默认值
  button: { // button及button-group的size
    size: 'large' // large,small,default
  },
  avatar: { // avatar的size
    size: 'large'
  },
  cascader: {// cascader 的size指的是cascader中的input输入框的size，这个值会被全局size及input单独设置的size覆盖
    size: 'large'
  },
  'date-picker': { // date-picker的size，影响所有日期组件，包括：date-picker,month-picker,range-picker,week-picker,year-picker,quarter-picker
    size: 'large'
  },
  'dropdown-button': { // dropdown-button的size，这个值不会被button的size覆盖
    size: 'large'
  },
  input: { // input 的size
    size: 'large'
  },
  'input-number': { // input-number的size
    size: 'large'
  },
  list: { // list的size
    size: 'large'
  },
  radio: {
    size: 'large'
  },
  select: {
    size: 'large'
  },
  skeleton: {
    size: 'large'
  },
  spin: {
    size: 'large'
  },
  steps: { // steps的size参数
    size: 'large'
  },
  switch: { // switch的size参数
    size: 'large'
  },
  table: { // table的size参数
    size: 'small'
  },
  tabs: { // tabs的size参数，实际生效于tabs-bar
    size: 'large'
  },
  'tag-select': { // tag-select的size
    size: 'small'
  },
  'tree-select': { // tree-select的size参数
    size: 'large'
  }
}
```

## 注意

1. 所有组件均包含`large、default、small`3种大小
1. 优先级如下：`标签上的size属性>$ELEMENT['component'].size>$ELEMENT.size>default`
1. 某些组件的size可能会被其他组件的size设置影响，

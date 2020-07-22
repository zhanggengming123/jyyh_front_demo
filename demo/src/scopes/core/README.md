# 工作台模块

## 注意事项

由于新版工作台使用了一个布局组件，但该组件不支持IE9，所以如果需要支持IE9的话需要自己开发工作台，必须使用 `faceConfig.js` 文件中的自定义工作台页面配置进行替换工作台页面，否则登录进入后工作台打不开，IE其他版本（IE10、IE11）及其他浏览器没有影响。

**示例：**

当前开发了一个新的工作台，该组件的名字为 `newWorkTable.vue` ，所挂载的页面为 `demo.html` ,则在 `faceConfig.js` 文件中关于自定义工作台的配置如下：

```
indexPageConfig: {
  ......

  worktable: {
    name: '工作台',
    url: 'demo.html#/newWorkTable'
  }

  ......
}
```

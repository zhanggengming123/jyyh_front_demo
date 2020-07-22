<template>
  <div class="page">
    <work-table
      v-if="showAll"
      :layout-props="layout"
      :editable="editable"
      :type="type"
      :isRoleTemplate="isRoleTemplate"
      @deleteItem="deleteItem"
      @changeTitleStatus="changeTitleStatus"
      @cancel="cancel"
      @add="add"
      @save="save"
      @swap="swap">
    </work-table>

    <addItemModal
      :allComponents="allComponents"
      :checked="checked"
      :visible.sync="addItemModalVisible"
      :layout="layout"
      @onChange="onCkbgChange">
    </addItemModal>

    <switchModal
      :visible.sync="switchModalVisible"
      :confirmLoading="confirmLoading"
      :templateTags="templateTags"
      :templateSelectedTag.sync="templateSelectedTag"
      @generateWorktable="generateWorktable">
    </switchModal>
    <ta-page-tool :toolMenu="toolMenu" :isRefresh="false"></ta-page-tool>
  </div>
</template>

<script>
  import workTable from './part/workTable'
  import addItemModal from './part/addItemModal'
  import switchModal from './part/switchModal'
  import api from './api'

  /**
   * ======================================
   *   重要：由于新版工作台使用了一个布局组件，
   *        但该组件不支持IE9，所以如果需要支
   *        持IE9的话需要自己开发工作台，必须
   *        使用faceConfig.js文件中的自定义
   *        工作台页面进行替换，否则在IE9浏览
   *        器下登录进入后工作台打不开，IE其
   *        他版本(IE10、IE11)及其他浏览器
   *        没有影响
   * ======================================
   */

  export default {
    name: 'page',
    components: { workTable, addItemModal, switchModal },
    data () {
      const toolMenu = [{
        icon: 'edit',
        name: '编辑',
        onClick: this.edit
      }, {
        icon: 'sync',
        name: '刷新',
        onClick: () => {
          top.indexTool.reload()
        }
      }]
      return {
        toolMenu: toolMenu,
        type: '0', // '0':个人工作台  '1':修改角色工作台模板
        roleId: '', // 修改角色工作台模板时的角色ID
        templateTags: [{ value: 'user', label: '自定义' }], // 选择工作台的tag数据
        templateSelectedTag: ['user'], // 选择工作台选中的tag
        oldLayout: [], // 备份，用于取消编辑恢复原状
        layout: [], // 当前实时布局
        checked: [], // 存储CheckBoxGroup中选中的组件
        showAll: false, // 控制是否展示页面
        isRoleTemplate: false, // 当前是不是模板，控制添加和保存按钮
        editable: false, // 控制编辑状态
        addItemModalVisible: false, // 控制添加组件弹出框是否可见
        allComponents: [], // 当前用户或者角色拥有权限的所有组件信息
        switchModalVisible: false, // 控制切换工作台Modal框是否显示
        confirmLoading: false, // 控制切换工作台Modal框内的确定按钮的loading状态
      }
    },
    mounted () {
      // 延迟5秒进行加载
      if (this.type === '0') setTimeout(this.openNotification(), 5000)
    },
    /*directives: {
      drag: function (el) {
        let dragBox = el //获取当前元素
        let throttle = function (func, wait) {
          let previous = 0
          return function () {
            let now = Date.now()
            let context = this
            let args = arguments
            if (now - previous > wait) {
              func.apply(context, args)
              previous = now
            }
          }
        }

        dragBox.onmousedown = e => {
          //算出鼠标相对元素的位置
          let disY = e.clientY - dragBox.offsetTop
          document.onmousemove = throttle(e => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let top = e.clientY - disY
            //移动当前元素
            dragBox.style.top = top + 'px'
          }, 50, {})
          document.onmouseup = e => {
            //鼠标弹起来的时候不再移动
            document.onmousemove = null
            //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
            document.onmouseup = null
          }
        }
      }
    },*/
    methods: {
      // 打开通知框
      openNotification () {
        // 进行ajax请求,刷新数据
        const data = {
          pageNumber: 1,
          pageSize: 1
        }
        api.queryCurrentUserLastLoginLog(data, (res) => {
          // 如果不存在或者长度为0,则不进行弹出
          if (!res.data.pageBean || !res.data.pageBean.list || res.data.pageBean.list.length == 0) {
            return
          }
          // 如果存在,暂时取第一条进行
          const log = res.data.pageBean.list[0]
          this.$notification['info']({
            message: '最近登录通知',
            description: (
              <div>
              <p>登录IP: {log.clientIp}</p>
          <p>客户端: {log.clientSystem}</p>
          <p>登录时间: {log.loginTime}</p>
          <p>退出时间: {log.logoutTime}</p>
          </div>),
          duration: 10
        })
        })
      },
      generateWorktable: function () {
        this.confirmLoading = true
        this.editable = false
        if (this.templateSelectedTag[0] === 'user') {
          api.queryUserWorkbenchByUserId({}, (res) => {
            this.layout = res.data.layout
            this.checked.splice(0, this.checked.length)
            this.layout.forEach(item => {
              this.checked.push(item.i)
            })
            this.isRoleTemplate = false
            this.switchModalVisible = false
            this.confirmLoading = false
            this.showAll = true
            if (res.data.warn !== null && res.data.warn !== undefined) {
              this.$message.warn(res.data.warn)
            }
            let lastChoose = {}
            lastChoose.isRole = 0
            api.saveLastChooseWorkbenchData({ lastChoose: JSON.stringify(lastChoose) })
          })
        } else {
          api.queryRoleWorkbenchByRoleId({ roleId: this.templateSelectedTag[0] }, (res) => {
            this.layout = res.data.layout
            this.switchModalVisible = false
            this.confirmLoading = false
            this.isRoleTemplate = true
            this.showAll = true
            if (res.data.warn !== null && res.data.warn !== undefined) {
              this.$message.warn(res.data.warn)
            }
            let lastChoose = {}
            lastChoose.isRole = 1
            lastChoose.roleId = this.templateSelectedTag[0]
            this.templateTags.forEach(item => {
              if (item.value === this.templateSelectedTag[0]) {
                lastChoose.roleName = item.label
              }
            })
            api.saveLastChooseWorkbenchData({ lastChoose: JSON.stringify(lastChoose) })
          })
        }
      },
      edit: function () {
        if (this.editable !== true) {
          this.oldLayout.splice(0, this.oldLayout.length)
          this.layout.forEach(item => {
            this.oldLayout.push(Object.assign({}, item))
          })
          this.editable = true
        }
      },
      cancel: function () {
        this.layout = this.oldLayout.slice(0)
        this.checked.splice(0, this.checked.length)
        this.editable = false
        this.layout.forEach(item => {
          this.checked.push(item.i)
        })
        if (this.type === '1') {
          this.$nextTick(function () {
            window.parent.indexTool.closeTabMenu('roleWorktableTemplateModify')
            window.parent.indexTool.openTabMenu({ id: '0aac95c1e73947bea41be639cc4e9036' })
          })
        }
      },
      add: function () {
        if (this.type === '1') {
          api.queryResourceEffectiveByRoleId({ roleId: this.roleId }, res => {
            this.allComponents = res.data.components
          })
        } else {
          api.queryResourceEffectiveByUserId({}, res => {
            this.allComponents = res.data.components
          })
        }
        this.addItemModalVisible = true
      },
      save: function () {
        if (this.type === '1') {
          this.$confirm({
            title: '',
            content: '确定保存吗？保存后该页面将关闭！',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              api.saveRoleWorkbench({ roleId: this.roleId, workbenchStr: JSON.stringify(this.layout) }, res => {
                this.$message.success('保存成功！')
                window.parent.indexTool.closeTabMenu('roleWorktableTemplateModify')
                window.parent.indexTool.openTabMenu({ id: '0aac95c1e73947bea41be639cc4e9036' })
                this.editable = false
                this.showAll = false
              })
            }
          })
        } else {
          api.saveUserWorkbench({ workbenchStr: JSON.stringify(this.layout) }, res => {
            this.$message.success('保存成功！')
            this.editable = false
          })
        }
      },
      deleteItem: function (id) {
        this.checked.splice(this.checked.indexOf(id), 1)
      },
      changeTitleStatus: function (itemFixed, id) {
        this.layout.forEach(item => {
          if (item.i === id) {
            item.itemFixed = itemFixed
          }
        })
      },
      onCkbgChange: function (newChecked) {
        let maxH = 0
        this.layout.forEach(item => {
          if (item.y + item.h > maxH) maxH = item.y + item.h
        })

        let temp = this.getArrDifference(this.checked, newChecked)
        temp.forEach(tempItem => {
          if (this.checked.includes(tempItem)) {
            // 删除
            this.layout.forEach(function (layoutItem, index, object) {
              if (layoutItem.i === tempItem) object.splice(index, 1)
            })
          }
          if (newChecked.includes(tempItem)) {
            this.allComponents.forEach(componentItem => {
              if (componentItem.value === tempItem) {
                this.layout.push({
                  'x': 0,
                  'y': maxH,
                  'w': 14,
                  'h': 13,
                  'minW': 2,
                  'minH': 4,
                  'i': tempItem,
                  'name': componentItem.label,
                  'url': componentItem.url,
                  'itemFixed': true,
                })
              }
            })
          }
        })
        this.checked = newChecked
      },
      getArrDifference: function (arr1, arr2) {
        return arr1.concat(arr2).filter(function (v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v)
        })
      },
      swap: function () {
        api.queryRoleListByUserId({}, res => {
          if (res.data.roles.length !== 0) {
            this.templateTags.splice(0, this.templateTags.length - 1)
            res.data.roles.forEach(item => {
              this.templateTags.unshift({ value: item.roleId, label: item.roleName })
            })
          }
          this.switchModalVisible = true
        })
      },
    },
    watch: {
      $route: {
        handler: function (val) {
          this.type = val.query.type
          this.roleId = val.query.roleId
          if (val.name === 'page') {
            if (this.type === '1') {
              api.queryRoleWorkbenchByRoleId({ roleId: this.roleId }, (res) => {
                this.layout = res.data.layout
                this.checked.splice(0, this.checked.length)
                this.layout.forEach(item => {
                  this.checked.push(item.i)
                })
                this.showAll = true
                this.$message.info('请点击右下角编辑按钮修改角色默认模板！')
              })
            } else {
              this.type = '0'
              api.queryLastChooseWorkbench({}, (res) => {
                this.layout = res.data.layout
                this.checked.splice(0, this.checked.length)
                this.layout.forEach(item => {
                  this.checked.push(item.i)
                })
                if (res.data.warn !== null && res.data.warn !== undefined) {
                  this.$message.warn(res.data.warn)
                }
                if (res.data.roleId !== null && res.data.roleId !== undefined) {
                  this.isRoleTemplate = true
                  this.templateSelectedTag[0] = res.data.roleId
                }
                this.showAll = true
              })
            }
          } else {
            this.editable = false
            this.addItemModalVisible = false
            this.switchModalVisible = false
          }
        },
        // 深度观察监听
        deep: true,
        immediate: true
      }
    },
  }
</script>

<style scoped lang="less">
  .page {
    height: 100%;
    width: 100%;
    background-color: @background-color-base;
    overflow-y: hidden;
  }
</style>

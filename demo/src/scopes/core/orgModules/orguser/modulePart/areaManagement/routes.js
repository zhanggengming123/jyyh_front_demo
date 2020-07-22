// 导出该模块路由
export default [
  {
    title: '行政区划管理',
    name: 'areaManagement',
    path: 'areaManagement',
    component: () => import('./areaManagement.vue')
  },
  {path: '', redirect: {name: 'areaManagement'}}
]

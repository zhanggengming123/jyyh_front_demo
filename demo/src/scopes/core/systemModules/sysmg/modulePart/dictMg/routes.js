// 导出该模块路由
export default [
  {
    title: '系统字典管理',
    name: 'dictionaryManager',
    path: 'dictionaryManager',
    component: () => import('./dictionaryManager.vue'),
    children: [
      {
        path: 'dictMg',
        name: 'dictMg',
        component: ()=>import('./part/dictMg.vue')
      },
      {
        path: 'dictTypeMg',
        name: 'dictTypeMg',
        component: ()=>import('./part/dictTypeMg.vue')
      },
      {path: '', redirect: {name: 'dictMg'}}
    ]
  },
];

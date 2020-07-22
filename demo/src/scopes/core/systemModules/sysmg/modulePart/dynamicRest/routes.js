//导出该模块路由
export default [
  {
    title:'动态服务列表',
    name: 'dynamicRest',
    path: 'dynamicRest',
    component: ()=>import('./dynamicRest.vue'),
  }
];

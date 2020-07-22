//导出该模块路由
export default [
  {
    title:"自定义资源管理",
    name: "customResource",
    path: 'customResource',
    component: ()=>import("./customResource.vue"),
  }
];

import Vue from 'vue'//引入vue
import VueRouter from 'vue-router'//引入vue路由支持
import routes from './routes'// 引入路由列表配置


//使用注册使用路由
Vue.use(VueRouter);
//定义该模块的路由
const router = new VueRouter({
    routes: routes
});
//导出该模块路由
export default router;

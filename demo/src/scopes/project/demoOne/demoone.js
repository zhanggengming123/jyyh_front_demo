import {Vue, store, taMixins} from 'common/js/public-ant.js'// 引入公共文件
import router from './router/index' // 引入 改模块的路由模块

// 自己引入各种插件

// 把组件化页面挂载到节点app上
new Vue({
    mixins: [taMixins],
    router,
    store
}).$mount('#app');

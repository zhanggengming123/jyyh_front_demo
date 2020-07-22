<template>
  <div>
    <h1>modulePart2</h1>
    路由名字：{{routeName}}<br>
    路由参数：{{routeParams}}<br>
    <router-link to="/modulePart2/part1">part1</router-link> |
    <router-link to="/modulePart2/part2">part2</router-link> |
    <router-link to="/modulePart2/part3">part3</router-link>
    <hr>
    <router-view></router-view>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  name: 'moudlePart2',
  data () {
    //这里存放数据
    return {
      data: "modulePart2",
      routeParams: {},
      routeName: ''
    };
  },
  created () {
    console.log(this.$router)
    console.log(this.$router.currentRoute.name)
    this.routeName = this.$router.currentRoute.name
    this.routeParams = this.$router.currentRoute.query
  }
}
</script>
<style scoped>
/*@import url(); 引入公共css类*/
</style>
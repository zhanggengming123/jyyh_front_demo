<template>
  <div>
    part1
    {{routeName}}
    <part4 :arr="arr1"></part4>
    <part4 :arr="arr2"></part4>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import part4 from './part4'
export default {
  //import引入的组件需要注入到对象中才能使用
  name: 'part1',
  components: {
    part4
  },
  data () {
    //这里存放数据
    return {
      routeName: '',
      arr1: ['四川', '浙江', '广东'],
      arr2: [{ name: '四川', city: '成都' }, { name: '浙江', city: '杭州' }, { name: '广东', city: '广州' }]
    };
  },
  created () {
    console.log(this.$router.currentRoute.name)
    this.routeName = this.$router.currentRoute.name
  }
}
</script>
<style scoped>
/*@import url(); 引入公共css类*/
</style>
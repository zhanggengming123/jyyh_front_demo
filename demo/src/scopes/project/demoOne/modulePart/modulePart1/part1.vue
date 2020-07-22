<template>
  <div>
    {{$props}}
    <part2 v-on="$listeners"></part2>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import part2 from './part2.vue'
export default {
  //import引入的组件需要注入到对象中才能使用
  name: 'part1',
  props: ['name'],
  components: {
    part2
  },
  data () {
    //这里存放数据
    return {

    };
  },
  created: function () {
    this.$emit('getMessage', 'part1');
  }
}
</script>
<style scoped>
/*@import url(); 引入公共css类*/
</style>
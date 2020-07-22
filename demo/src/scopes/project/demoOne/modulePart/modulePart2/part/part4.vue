<template>
  <div>
    part1
    {{routeName}}
    {{arr}}
    <hr>
    <!-- <div v-if="typeof(arr[0]) === 'string'">
      <select>
        <option v-for="item in arr"
                :value="item"
                :key="item">{{item}}</option>
      </select>
    </div>

    <div v-else>
      <select v-model="city"
              placeholder="请选择">
        <option v-for="item in arr"
                :value="item.city"
                :key="item">{{item.name}}</option>
      </select>
      {{city}}
    </div> -->

    <div>
      <select v-model="city">
        <option selected>请选择</option>
        <option v-for="(item,index) in arr"
                :value="typeof(item) === 'string'?item:item.city"
                :key="index">{{typeof(item) === 'string'?item:item.name}}</option>
      </select>
    </div>
    {{(typeof(arr[0])==='object')?city:''}}
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  name: 'part1',
  props: ['arr'],
  data () {
    //这里存放数据
    return {
      routeName: '',
      province: '请选择',
      city: ''
    };
  },

}
</script>
<style scoped>
/*@import url(); 引入公共css类*/
</style>
<template>
  <div>
    <!--作用域插槽-->
    <slot name="title"
          :val1="val1"
          val2="参数2"></slot>
    <!--将users传出去，放在作用域对象内-->
    <slot :users="users"></slot>
  </div>
</template>

<script>
export default {
  //import引入的组件需要注入到对象中才能使用
  name: 'slotScope',
  data () {
    //这里存放数据
    return {
      users: ['Henry', 'Bucky', 'Emily'],
      val1: '参数1'
    }
  }
}
</script>
<style>
</style>

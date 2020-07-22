<template>
  <div>
    <button @click="toModulePart2">点击跳转到toModulePart2></button>
    <hr>
    <h1>1、测试props</h1>
    <partComponent :title="title"></partComponent>
    <hr>
    <h1>2、测试指令: v-text v-html v-pre</h1>
    <div v-text="htmlPro"></div>
    <div v-html="htmlPro"></div>
    <div v-pre>{{htmlPro}}</div>
    <hr>
    <h1>3、插槽 part</h1>
    <slotPart>
      <p slot="header">这里是页头：</p>
      <ul>
        <li v-for="user in data"
            :key="user">{{user}}</li>
      </ul>
      <p slot="footer">这里是页脚：</p>
    </slotPart>
    <hr>
    <h1>3.1、作用域插槽 slotScope</h1>
    <slotScope>
      <!--data1：为插槽作用域的全部数据{key: value}-->
      <!-- 
      <p slot="title"
         slot-scope="data1">
        <span>插槽作用域：{{data1}}</span><br>
        <span>val1：{{data1.val1}}</span><br>
        <span>val2：{{data1.val2}}</span>
      </p> -->
      <!--{val1}：指定为插槽作用域中的va1参数-->
      <!-- <p slot="title"
         slot-scope="{val1}">
        {{val1}}
      </p> -->
      <!--v-slot 2.6取代slot和slot-scope-->
      <template v-slot:title="{val}">
        {{val}}
      </template>
      <ul slot-scope="data2">
        <li v-for="user in data2.users"
            :key="user">{{user}}</li>
      </ul>
    </slotScope>
    <hr>
    <h1>4、watch | computed | v-model</h1>
    <input v-if="testCount"
           :placeholder="testCount">
    <button @click="handleClick()">点击</button>
    {{computedTest}}
    <div>
      watch | computed | v-model
    </div>
    <hr>
    <h1>Vue实例属性</h1>
    <h2>vm.$data：获取当前Vue组件data属性值</h2>
    {{$data}}<br>
    <h2>vm.$props: </h2>
    <part1 @getMessage="handleEvent1"
           name="part1name"></part1>
    <hr>
    {{testSet}}
    <button @click="handleTestSet()">修改testSet</button>
    <br>
    <slot name="aaa"
          message="msg">111</slot>
    <div ref="ref1">ref1</div>
  </div>
</template>
<script>
import partComponent from './part/partComponent'
import slotPart from './slotPart'
import slotScope from './slotScope'
import part1 from './part1'
export default {
  name: 'modulePart1',
  components: { partComponent, slotPart, slotScope, part1 },
  props: ['name'],
  data () {
    return {
      title: "飞机",
      testSet: {
        key1: 'value1',
        key2: 'valu22'
      },
      htmlPro: '<h2>222<2>',
      data: ['Herry', 'Bucky', 'Emily'],
      testCount: '100'
    }
  },
  computed: {
    computedTest () {
      return '满分：' + this.testCount
    }
  },
  created () {

  },
  mounted () {
    this.$nextTick(function () {
      console.log(this.$el)
      console.log(this.$root)
      console.log(this.$slots)
      console.log(this.$refs)
      console.log(this.$isServer)
      console.log(this.$attrs)
    })
  },
  watch: {
    testCount (newVal, oldVal) {
      console.log("newVal", newVal);
      console.log("oldVal", oldVal);
    }
  },
  methods: {
    handleEvent1 (val) {
      console.log(val)
    },
    handleTestSet () {
      this.$set(this.testSet, 'key1', 2)
    },
    toModulePart2 () {
      this.$router.push({
        path: 'modulePart2',
        query: {
          name: 'zgm',
          company: 'jyyh'
        }
      })
    }
  }
}

</script>
<style scoped type="text/less">
</style>

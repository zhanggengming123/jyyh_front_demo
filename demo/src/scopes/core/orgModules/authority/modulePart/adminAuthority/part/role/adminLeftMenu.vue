<template>
  <div>
    <div class="menu-title">
      <ta-icon type="menu-fold"></ta-icon>
      <span style="margin-left: 5px;font-weight: bold">{{title}}</span>
    </div>
    <ta-divider style="margin: 0"></ta-divider>
    <ta-menu mode="inline"
             :selectedKeys="selectedKeys"
             @click="onClick">
      <ta-menu-item v-for="item in data" :key="item.resourceId">
        <ta-icon type="appstore"/>
        {{item.name}}
      </ta-menu-item>
    </ta-menu>
  </div>
</template>

<script>
export default {
  name: 'adminLeftMenu',
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    selectedKeys: {
      type: Array
    }
  },
  data() {
    return {

    }
  },
  methods: {
    onClick ({item, key, keyPath}) {
      this.$emit('click', {item, key, keyPath})
    }
  }
}
</script>
<style scoped type="text/less" lang="less">
  .menu-title {
    height: 39px;
    line-height: 39px;
    width: 100%;
    padding: 0 0 0 25px;
  }
</style>

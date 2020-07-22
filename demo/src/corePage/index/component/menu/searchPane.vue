<template>
  <div class="searchPane">
    <ta-menu mode="inline" theme="dark" :data="menuList" :props="props" :selectedKeys="[state.activeMenuTwo || '']" @click="clickMenu" :style="{width:'100%'}"></ta-menu>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'search-pane',
  data () {
    return {
      props: {
        key: 'id',
        title: 'name'
      }
    }
  },
  computed: {
    ...mapGetters({
      state: 'getStateValue',
      menuList: 'getSearchMenuList'
    })
  },
  methods: {
    clickMenu ({key, keyPath}) {
      this.$store.dispatch('setActiveMenu', {level: 'two', menuId: key})
      let tabMenu = this.menuList.filter(item => item.id == key)[0]
      console.log(tabMenu)
      this.$store.dispatch('addTabMenuList', {value: tabMenu})
    }
  }
}
</script>

<style scoped type="text/less" lang="less">
  .searchPane {
    background-color: #001529;
    height: 100%;
    width: 100%;
    overflow: auto;
    position: absolute;
    top: 0px;
    left: 0px;
    .beautifyScrollbar();
  }
</style>

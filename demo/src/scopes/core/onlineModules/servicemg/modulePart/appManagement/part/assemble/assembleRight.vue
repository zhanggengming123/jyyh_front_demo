<template>
  <div class="assemble-right">
    <ta-tabs>
      <ta-tab-pane tab="服务关联" key="server" class="pd-10">
        <server-relate></server-relate>
      </ta-tab-pane>
    </ta-tabs>
  </div>
</template>
<script>
import serverRelate from './serverRelate'
import {mapGetters} from 'vuex'
export default {
  name: 'assemble-right',
  components: {serverRelate},
  data () {
    return {

    }
  }
}
</script>
<style lang="less" scoped type="text/less">
  .assemble-right {
    .pd-10 { padding: 0 10px; }
  }
</style>

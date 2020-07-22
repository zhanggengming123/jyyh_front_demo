<template>
    <div id="jobOperate" class="fit">
        <ta-tabs @change="tabChange" v-model="activeKey" class="fit">
            <ta-tab-pane tab="作业维度" key="jobDimensionality">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </ta-tab-pane>
            <ta-tab-pane tab="服务器维度" key="serverDimensionality">
                <keep-alive>
                    <router-view name="serverDimensionality"></router-view>
                </keep-alive>
            </ta-tab-pane>
        </ta-tabs>
    </div>
</template>
<script>
export default {
  name: 'jobOperate',
  data () {
    return {
      activeKey: 'jobDimensionality'
    }
  },
  methods: {
    tabChange (activeKey) {
      if (activeKey === 'jobDimensionality') {
        this.$router.push({ name: 'jobDimensionality' })
      } else if (activeKey === 'serverDimensionality') {
        this.$router.push({ name: 'serverDimensionality' })
      }
    }
  },
  activated () {
    if (this.activeKey) {
      this.$router.push({ name: this.activeKey })
    }
  }
}
</script>

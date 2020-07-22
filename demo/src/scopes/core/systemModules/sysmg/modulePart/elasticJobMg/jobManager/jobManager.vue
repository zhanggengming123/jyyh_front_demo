<template>
  <div id="jobManager" class="fit">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'jobManager',
  data () {
    return {}
  },
  created () {
    if (this.$route.name != 'zookeeperRegistryCenterConfig') {
      this.$router.push({ name: 'zookeeperRegistryCenterConfig' })
    }
  }
}
</script>

<template>
  <div id="dictionaryManager" class="fit">
      <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'dictionaryManager',
  data () {
    return {}
  },
  created () {
    if (this.$route.name != 'dictMg') {
      this.$router.push({ name: 'dictMg' })
    }
  }
}
</script>

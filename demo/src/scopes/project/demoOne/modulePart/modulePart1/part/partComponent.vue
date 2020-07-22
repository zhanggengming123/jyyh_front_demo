<template>
  <div>
    <h2>{{title}}</h2>
  </div>
</template>

<script>
export default {
  name: 'partComponent',
  props: {
    title: {
      type: String,
      default: 'default',
    },
  },
  data () {
    return {}
  },
  methods: {
    fun1 () {
      return ''
    },
  },
};
</script>

<style scoped type="text/less">
</style>

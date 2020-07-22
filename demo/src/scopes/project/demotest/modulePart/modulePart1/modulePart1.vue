<template>
  <h1>
    modulePart1 功能
    {{name}}
    <br>
    <part-component buttonKey="详细信息"></part-component>
  </h1>
</template>

<script>
import partComponent from './part/partComponent'
export default {
  name: 'modulePart1',
  components: { partComponent },
  data () {
    return {
      name
    }
  }
}
</script>

<style scoped type="text/less">
</style>

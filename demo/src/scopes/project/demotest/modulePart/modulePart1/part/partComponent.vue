<template>
  <ta-button>{{buttonKey}}</ta-button>
</template>

<script>
  export default {
    name: "partComponent",
    props: {
      buttonKey: {
        type: String
      }
    },
    data(){
      return {

      }
    }
  }
</script>

<style scoped type="text/less">

</style>

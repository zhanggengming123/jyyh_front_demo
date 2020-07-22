<template>
  <div>
    <ta-button style="margin-right: 5px" v-for="(item, index) in providerIds" :key="index" type="primary" shape="circle" @click="socialLogin(item)">
      <ta-icon :type="item" />
    </ta-button>
  </div>
</template>

<script>

export default {
  name: 'social-List',
  data () {
    return {
      providerIds: []
    }
  },
  mounted () {
    this.queryProviderIds()
  },
  methods: {
    queryProviderIds () {
      this.Base.submit(null, {
        url: 'connect/providerIds',
        method: 'GET'
      }, {
        successCallback: (data) => {
          this.providerIds = data.data.providerIds
        }
      })
    },
    socialLogin (providerId) {
      window.open(faceConfig.basePath + '/login/' + providerId, '_blank')
      window.close()
    }

  }
}
</script>

<style scoped>

</style>

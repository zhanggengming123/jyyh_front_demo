<template>
  <div>
    <ta-button @click="getPage">获取还原页面</ta-button>
    <ta-modal
      title="Basic Modal"
      v-model="visible"
      height="500px"
      width="50%"
      :destroyOnClose="true"
    >
      <div style="height:100%">
        <iframe style="width: 100%;height:100%" :src="src" frameborder="0"></iframe>
      </div>

    </ta-modal>
  </div>
</template>
<script>
  import rePageMixins from '@/common/js/mixins/rePageMixins'

  export default {
    components: {},
    mixins: [rePageMixins],
    data() {
      return {
        src: '',
        visible: false,
      }
    },
    methods: {
      getPage() {
        //这里自己通过查询获取保存的pageId
        let pageId = localStorage.pageId
        this.visible = true
        //获取还原页面的url
        this.getRePageUrl(pageId).then(url=>{
          this.src=url
        })
      }
    }
  }
</script>

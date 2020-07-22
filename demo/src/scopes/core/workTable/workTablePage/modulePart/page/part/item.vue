<template>
  <div class="item" :class="{'contentHeight':!itemFixed,'headFixed':editable&&!itemFixed}">
    <div class="head vue-draggable-handle" :class="{'headNotFixed':!itemFixed,'moveCursor':editable}">
      <span class="title">{{moduleName}}</span>
      <div style="float: right;display: table;height: 56px">
        <deleteIcon title="删除组件" class="deleteIcon" style="display: table-cell;vertical-align: middle;text-align: center"
                    @deleteItem="$emit('deleteItem',moduleId)" v-show="editable"/>
        <ta-icon title="固定组件标题" style="display: table-cell;vertical-align: middle;text-align: center" type="pushpin"
                 @click="changeTitleStatus" v-show="editable" class="fixedIcon"
                 :class="{'iconColor':itemFixed}"></ta-icon>
      </div>
    </div>
    <div class="content">
      <component v-if="exists" :module-id="moduleId" class="component" :is="this.modulePath"></component>
      <pageNotFound v-else></pageNotFound>
    </div>
  </div>

</template>

<script>
  import pageNotFound from '@/corePage/404/app.vue'
  const deleteSvg = {
    template: `<svg width="14px" height="14px" fill="currentColor"  viewBox="0 0 1024 1024">
                    <path d="M332.308,151.615h359.385c0.276,0,0.5-0.224,0.5-0.5V80.038c0-0.276-0.224-0.5-0.5-0.5H332.308c-0.276,0-0.5,0.224-0.5,0.5v71.077C331.808,151.392,332.032,151.615,332.308,151.615z"/>
                    <path d="M980,223.692H836.346H643.641h-71.077H451.436h-71.077H187.654H44c-0.276,0-0.5,0.224-0.5,0.5v71.077c0,0.276,0.224,0.5,0.5,0.5h143.654v549.587c0,54.735,44.371,99.106,99.106,99.106H737.24c54.735,0,99.106-44.371,99.106-99.106V295.769H980c0.276,0,0.5-0.224,0.5-0.5v-71.077C980.5,223.916,980.276,223.692,980,223.692z M764.269,845.356c0,14.905-12.124,27.029-27.029,27.029H286.76c-14.905,0-27.029-12.124-27.029-27.029V295.769h120.128v431.962c0,0.276,0.224,0.5,0.5,0.5h71.077c0.276,0,0.5-0.224,0.5-0.5V295.769h120.128v431.962c0,0.276,0.224,0.5,0.5,0.5h71.077c0.276,0,0.5-0.224,0.5-0.5V295.769h120.128V845.356z"/>
                </svg>`
  }

  const deleteIcon = {
    template: `<ta-icon @click="$emit('deleteItem')" :component="deleteSvg" />`,
    data () {
      return {
        deleteSvg: deleteSvg,
      }
    }
  }

  //动态加载组件的另外一种方法，如果不能使用require加载的话，暂时保留
  // const requireComponent = require.context('../modules', false, /\w+\.(vue|js)$/)
  // let cmps = {}
  //
  // requireComponent.keys().map(fileName => {
  //   let cmp = requireComponent(fileName).default
  //   cmps[cmp.name] = cmp
  // })

  export default {
    name: 'item',
    props: {
      moduleId: String,
      moduleName: String,
      modulePath: String,
      editable: Boolean,
      itemFixed: true
    },
    data () {
      return {
        exists: false
      }
    },
    components: { deleteIcon,pageNotFound },
    created () {
      const files = require.context('@projectCommon/workTableComponents/', false, /.vue$/).keys()
      if (files.includes(`./${this.modulePath}.vue`)) {
        this.exists = true
        this.$options.components[this.modulePath] = require(`@projectCommon/workTableComponents/${this.modulePath}.vue`)
          .default
      }
    },
    methods: {
      changeTitleStatus: function () {
        this.$emit('changeTitleStatus', !this.itemFixed, this.moduleId)
      }
    }
  }
</script>

<style scoped lang="less">

  .item {
    height: 100%;
    width: 100%;

    &.contentHeight {
      & > .content {
        height: calc(100% - 48px);
      }
    }

    &.headFixed {
      &:hover {
        & > .content {
          height: calc(100% - 102px);
        }

        & > .head {
          height: 54px;
          border-bottom: 1px solid @border-color-split;
        }
      }
    }

    .head {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid @border-color-split;
      overflow: hidden;
      transition: height 0.5s;

      &.moveCursor {
        cursor: move;
      }

      &.headNotFixed {
        height: 0;
        border: 0;
      }

      .title {
        line-height: 54px;
        font-size: @font-size-lg;
        margin-left: 32px;
      }

      .deleteIcon {
        font-size: 16px;
        border: 1px solid white;
        border-radius: 50%;
        padding: 7px;
        color: @text-color-secondary;

        &:hover {
          color: @primary-color;
          cursor: pointer;
        }
      }

      .fixedIcon {
        font-size: 16px;
        border: 1px solid white;
        border-radius: 50%;
        padding: 7px;
        color: @text-color-secondary;

        &:hover {
          color: @primary-color;
          cursor: pointer;
        }

        &.iconColor {
          color: @primary-color;
        }
      }
    }

    .content {
      width: calc(100% - 60px);
      height: calc(100% - 102px);
      margin: 24px 30px;
      transition: height 0.5s;
      overflow: hidden;
    }
  }

</style>

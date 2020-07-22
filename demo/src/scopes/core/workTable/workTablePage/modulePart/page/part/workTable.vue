<template>
  <div class="formWork">
    <transition name="operateTools">
      <div v-show="editable" class="operateTool">
        <ta-button class="operateBtn swap" :disabled="type==='1'" @click="$emit('swap')" icon="swap">切换工作台</ta-button>
        <ta-button v-show="!isRoleTemplate" class="operateBtn save" @click="$emit('save')">保存</ta-button>
        <ta-button v-show="!isRoleTemplate" class="operateBtn" @click="$emit('add')">新增</ta-button>
        <ta-button class="operateBtn" @click="$emit('cancel')">取消</ta-button>
      </div>
    </transition>
    <grid-layout :layout="layoutProps"
                 :col-num="14"
                 :row-height="25"
                 :is-draggable="editable"
                 :is-resizable="editable"
                 :vertical-compact="true"
                 :use-css-transforms="false">
      <grid-item v-for="item in layoutProps"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i"
                 :minW="3"
                 :minH="4"
                 drag-allow-from=".vue-draggable-handle"
                 drag-ignore-from=".no-drag"
                 :class="{'active':editable}">
        <item :module-id="item.i"
              :module-name="item.name"
              :module-path="item.url"
              :item-fixed="item.itemFixed"
              :editable="editable"
              class="item"
              @deleteItem="deleteItem"
              @changeTitleStatus="changeTitleStatus"
        />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
  import VueGridLayout from 'vue-grid-layout'
  import item from './item'

  export default {
    name: 'workTable',
    components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      item: item
    },
    props: {
      layoutProps: {
        type: Array,
        default: [],
        require: true
      },
      editable: {
        type: Boolean,
        default: false,
        require: true
      },
      type: {
        type: String,
        default: '0',
        require: true
      },
      isRoleTemplate: {
        type: Boolean,
        default: false,
        require: true
      }
    },
    methods: {
      deleteItem: function (id) {
        this.layoutProps.forEach((item, index, object) => {
          if (item.i === id) {
            object.splice(index, 1)
          }
        })
        this.$emit('deleteItem', id)
      },
      changeTitleStatus: function (itemFixed, id) {
        this.$emit('changeTitleStatus', itemFixed, id)

      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang="less" type="text/less">
  .vue-grid-item.vue-grid-placeholder {
    background: @primary-color !important;
    opacity: 0.1;
  }
</style>
<style scoped lang="less" type="text/less">

  .operateTools-enter-active {
    animation: operateTools-in .5s;
  }

  .operateTools-leave-active {
    animation: operateTools-in .5s reverse;
  }

  @keyframes operateTools-in {
    0% {
      height: 0;
    }
    100% {
      height: 56px;
    }
  }

  .formWork {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    .beautifyScrollbar();

    .operateTool {
      height: 56px;
      width: 100%;

      .operateBtn {
        margin-right: 8px;
        height: 32px;
        width: 64px;
        margin-top: 18px;
        float: right;

        &.save {
          background: @primary-color;
          color: white;
        }

        &.swap {
          width: 132px;
          background: @primary-color;
          color: white;
          margin-left: 32px;
          line-height: 20px;

          &:disabled {
            background: @disabled-color;
            color: @text-color-secondary;
          }
        }
      }
    }

    .vue-grid-layout {
      background: @background-color-base;
      border-radius: @border-radius-base;
      min-height: 120px;

      .vue-grid-item:not(.vue-grid-placeholder) {
        background: white;
        border: 1px solid white;

        &.active {
          &:hover {
            border: 1px solid @primary-color;
            box-shadow: @box-shadow-base;
          }
        }

        &.resizing {
          opacity: 1;
        }

        .item {
          overflow: hidden;
          height: 100%;
        }

      }
    }
  }
</style>

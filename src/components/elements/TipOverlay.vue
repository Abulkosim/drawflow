<template>
  <div>

    <transition name="fade">
      <TipMenu @close="closeTipMenu" v-if="showTipMenu" />
    </transition>
    <transition name="fade">
      <TipDrag @close="closeTipDrag" v-if="showTipDrag" :showTipMenu="showTipMenu" />
    </transition>
    <transition name="fade">
      <TipEdit @close="closeTipEdit" v-if="showTipEdit" :showTipMenu="showTipMenu" :showTipDrag="showTipDrag" />
    </transition>
    <Documentation />
  </div>
</template>

<script>
import TipMenu from '../menus/TipMenu.vue';
import TipDrag from '../menus/TipDrag.vue';
import TipEdit from '../menus/TipEdit.vue';
import Documentation from '../menus/Documentation.vue';

export default {
  name: 'TipOverlay',
  components: {
    TipMenu, TipDrag, TipEdit, Documentation
  },
  props: {
    showTipMenu: {
      type: Boolean,
      required: true
    },
    showTipDrag: {
      type: Boolean,
      required: true
    },
    showTipEdit: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closeTipMenu() {
      this.$emit('close', 'showTipMenu');
    },
    closeTipDrag() {
      this.$emit('close', 'showTipDrag');
    },
    closeTipEdit() {
      this.$emit('close', 'showTipEdit');
    }
  }
}
</script>
<style scoped>
div {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
}
</style>
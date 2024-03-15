<template>
  <div class="tip">
    <p>Node Types</p>
    <div class="list">
      <div>
        <div class="circle inline"></div>
        <span>Inline</span>
      </div>
      <div>
        <div class="circle reply"></div>
        <span>Reply</span>
      </div>
      <div>
        <div class="circle contact"></div>
        <span>Contact</span>
      </div>
      <div>
        <div class="circle location"></div>
        <span>Location</span>
      </div>
    </div>
    <!-- <CloseTipButton @close="close" /> -->

  </div>
</template>
<script>
import CloseTipButton from '../buttons/CloseTipButton.vue';

export default {
  methods: {
    close() {
      this.$emit('close');
    },
  },
  components: { CloseTipButton }
};
</script>
<style scoped>
@import '../../assets/tip.css';
</style>
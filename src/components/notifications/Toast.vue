<template>
  <div v-if="show" class="toast-container" :class="{ success: success, fail: !success }">
    <div class="toast" :class="{ failed: !success }">
      <div class="svg-container" :class="{ success: success, fail: !success }">
        <SuccessIcon v-if="success" />
        <FailIcon v-else />
      </div>
      <span>{{ msg }}</span>
    </div>
    <div id="line" :class="{ success: success, fail: !success }"></div>
  </div>
</template>
<script>
import SuccessIcon from '../icons/SuccessIcon.vue';
import FailIcon from '../icons/FailIcon.vue';

export default {
  props: ['show', 'success', 'msg'],
  components: { SuccessIcon, FailIcon }
}
</script>

<style>
@import '../../assets/toast.css'
</style>
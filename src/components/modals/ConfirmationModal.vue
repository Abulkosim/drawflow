<template>
  <div v-if="showModal" class="container">
    <div>
      <div class="confirmation-container">
        <div class="confirm-container">
          <h3 class="confirmation">Are you sure you want to delete it?</h3>
          <div class="yes-no">
            <button data-modal-hide="popup-modal" type="button" @click="close" class="cancel">
              <span>Cancel</span>
            </button>
            <button data-modal-hide="popup-modal" type="button" @click="confirm" class="delete">
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['showModal'],
  data() {
    return {}
  },
  mounted() { },
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm');
    }
  }
}
</script>

<style scoped>
@import '../../assets/confirmation.css'
</style>
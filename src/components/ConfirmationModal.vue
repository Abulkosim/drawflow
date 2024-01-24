<template>
  <div v-if="showModal" class="container">
    <div>
      <div class="confirmation-container">
        <button type="button" @click="close" class="close-button" data-modal-hide="popup-modal">
          <svg class="svg-size" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
        <div class="confirm-container">
          <svg class="svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <h3 class="confirmation">Are you sure you want to delete this
            node? </h3>
          <div class="yes-no">
            <button data-modal-hide="popup-modal" type="button" @click="confirm" class="yes">
              Yes, I'm sure
            </button>
            <button data-modal-hide="popup-modal" type="button" @click="close" class="no">No, cancel</button>
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
<style>
.container {
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 10;
  align-items: center;
  border-radius: 0.75rem;
  background-color: #ffffff;
}

.confirmation-container {
  position: relative;
  padding: 2rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.close-button {
  display: flex;
  position: absolute;
  top: 1rem;
  right: 1rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  width: 2rem;
  height: 2rem;
  color: #9CA3AF;
  border: none;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  z-index: 1;
}

.close-button:hover {
  color: #2c3e50;
  background-color: #E5E7EB;
}

.confirm-container {
  text-align: center;

  @media (min-width: 768px) {
    padding: 1.25rem;
  }
}

.yes-no {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.yes {
  padding: 0.625rem 1.25rem;
  align-items: center;
  border-radius: 0.5rem;
  font-size: 1rem;
  line-height: 1.25rem;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  outline: 2px solid #B91C1C;
  background-color: #B91C1C;
  border: none;
  cursor: pointer;
}

.yes:hover {
  background-color: #B91C1CEE;
}

.yes:active {
  background-color: #B91C1CDD;
}

.no {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  border-radius: 0.5rem;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #6B7280;
  background-color: #ffffff;
  border: none;
  outline: 2px solid #d1d1d1;
  cursor: pointer;
}

.no:hover {
  color: #111827;
  background-color: #F3F4F6;
}

.no:active {
  color: #111827;
  background-color: #F3F4F6EE;
}

.confirmation {
  margin-bottom: 1.75rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: #6B7280;
}

.svg {
  margin-bottom: 0.5rem;
  width: 3rem;
  height: 3rem;
  color: #9CA3AF;
}

.svg-size {
  width: 0.75rem;
  height: 0.75rem;
}
</style>
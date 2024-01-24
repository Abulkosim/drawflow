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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" viewBox="0 0 256 256">
                <path
                  d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z">
                </path>
              </svg>
              <span>Delete</span>
            </button>
            <button data-modal-hide="popup-modal" type="button" @click="close" class="no">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#6B7280" viewBox="0 0 256 256">
                <path
                  d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z">
                </path>
              </svg>
              <span>Cancel</span>
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
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.625rem 1.25rem;
  align-items: center;
  border-radius: 0.5rem;
  font-size: 18px;
  line-height: 1.25rem;
  font-weight: 500;
  text-align: center;
  color: red;
  outline: 2px solid red;
  background-color: white;
  border: none;
  cursor: pointer;
}

.yes:hover {
  background-color: #f3f3f3
}

.yes:active {
  background-color: #e3e3e3;
}

.no {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.5rem;
  font-size: 18px;
  line-height: 1.25rem;
  color: #6B7280;
  background-color: #ffffff;
  border: none;
  outline: 2px solid #6B7280;
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
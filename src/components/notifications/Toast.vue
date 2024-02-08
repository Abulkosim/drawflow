<template>
  <div v-if="show" class="toast-container" :class="{ success: success, fail: !success }">
    <div class="toast">
      <div class="svg-container" :class="{ success: success, fail: !success }">
        <svg v-if="success" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
        <svg v-else class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
          viewBox="0 0 20 20">
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
      </div>
      <span>{{ msg }}</span>
    </div>
    <div id="line" :class="{ success: success, fail: !success }"></div>
  </div>
</template>
<script>
export default {
  props: ['show', 'success', 'msg']
}
</script>

<style>
.toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  border-radius: 10px;
  color: gray;
  font-size: 20px;
  z-index: 10;
  background-color: white;
  max-width: 400px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.toast {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 16px;
}

.svg-container {
  width: 32px;
  height: 32px;
}

.svg-container.success {
  color: lightseagreen
}

.svg-container.fail {
  color: #DC2626
}

.toast.success {
  border: 2px solid lightseagreen
}

.toast.fail {
  border: 2px solid #DC2626;
}

#line {
  width: 100px;
  height: 3px;
  animation: shorten 2s linear;
  border-radius: 10px;
}

#line.success {
  background-color: lightseagreen;
}

#line.fail {
  background-color: #DC2626;
}

@keyframes shorten {
  0% {
    width: 100%;
  }

  100% {
    width: 0%;
  }
}
</style>
<template>
  <div class="telegram-msg">
    <div class="icons-container">
      <button @click.stop.prevent class="menu-btn">Menu</button>
      <ClipIcon />
    </div>
    <input type="text" class="msg-input" placeholder="Write a message..." />
    <div class="icons-container">
      <CaretDownIcon />
      <MicrophoneIcon />
    </div>
  </div>
</template>
<script>
import ClipIcon from '../icons/ClipIcon.vue';
import MicrophoneIcon from '../icons/MicrophoneIcon.vue';
import CaretDownIcon from '../icons/CaretDownIcon.vue';

export default {
  props: {
    btn_type: String
  },
  components: {
    ClipIcon,
    MicrophoneIcon,
    CaretDownIcon
  },
  data() {
    return {
    };
  }
}
</script>

<style scoped>
.telegram-msg {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background-color: #f2f6fa;
  border-radius: 10px;
  height: 48px;
  width: 100%;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.icons-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.menu-btn {
  background-color: #3677df;
  border: none;
  cursor: pointer;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  outline: none;
  font-size: 16px;
  transition: background-color 0.3s ease-in-out;
}

.menu-btn:hover {
  background-color: #226ce6;
}

.msg-input {
  display: block;
  padding: 10px 14px;
  border: none;
  width: 100%;
  font-size: 1rem;
  background-color: #f2f6fa;
  outline: none;
  letter-spacing: 1px;
  color: #777777;
}

svg {
  fill: #226ce6dd;
  cursor: pointer;
  transition: fill 0.3s ease-in-out;
}

svg:hover {
  fill: #226ce6
}
</style>
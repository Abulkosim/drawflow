<template>
  <div class="info-bar" v-if="bot_name">
    <TelegramIcon />
    <a :href="link" target="_blank">
      <p>{{ bot_name }}</p>
    </a>
  </div>
</template>

<script>
import TelegramIcon from '../icons/TelegramIcon.vue';

export default {
  name: "BotName",
  props: {
    bot_name: {
      type: String
    },
    link: {
      type: String
    },
  },
  components: { TelegramIcon }
};
</script>
<style scoped>
.info-bar {
  background-color: rgba(0, 176, 108, 0.7);
  color: #fff;
  padding: 6px 12px;
  text-align: center;
  position: absolute;
  top: 8px;
  left: 8px;
  border-radius: 8px;
  min-width: 100px;
  cursor: text;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 18px;
  z-index: 10;
}

.info-bar a {
  color: #fff;
  text-decoration: none;
  outline: none
}

.info-bar:hover:hover {
  background: rgba(0, 176, 108, 0.8);
}
</style>
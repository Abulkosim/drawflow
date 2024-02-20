<template>
  <div class="info-bar">
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#fff" viewBox="0 0 256 256">
      <path
        d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-52-56H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-28,16v24H120V152ZM80,164a12,12,0,0,1,12-12h12v24H92A12,12,0,0,1,80,164Zm84,12H152V152h12a12,12,0,0,1,0,24ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Z">
      </path>
    </svg>
    <p>{{ bot_name }}</p>
  </div>
</template>

<script>
export default {
  name: "BotName",
  props: {
    bot_name: {
      type: String,
      required: true,
    },
  },
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
}

.info-bar:hover:hover {
  background: rgba(0, 176, 108, 0.8);
}
</style>
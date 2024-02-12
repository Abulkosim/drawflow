<template>
  <div class="tip">
    <p>Node Types: </p>
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
  </div>
</template>
<style scoped>
div .tip {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  border-radius: 8px;
  color: #434b53;
  background: white;
  user-select: none;
  z-index: 1;
  padding: 20px 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 180px;
  font-size: 16px;
  cursor: crosshair;
}

.tip p {
  color: #929AA2;
  text-align: center;
  margin-bottom: 5px;
  font-size: 18px;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;

}

.inline {
  background: #00B06C;
}

.reply {
  background: #EFA62A;
}

.contact {
  background: #FF3E68;
}

.location {
  background: #8E4FCB;
}

.list div {
  display: flex;
  align-items: center;
  gap: 7px;
}
</style>
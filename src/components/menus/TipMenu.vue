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
    <button type="button" @click="close" class="tip-close">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256">
        <path
          d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z">
        </path>
      </svg>
    </button>
  </div>
</template>
<script>
export default {
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>
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
  margin-bottom: 8px;
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

.tip-close {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  position: absolute;
  top: 5px;
  right: 5px;
  background: white;
  cursor: pointer;
  color: #434b53;
  border: none;

}

.tip-close:hover {
  background: #e2eaf2;
}
</style>
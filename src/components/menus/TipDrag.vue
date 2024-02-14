<template>
  <div class="tip" :class="{ onTop: !showTipMenu }">

    <div class="drag-tip">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#434b53" viewBox="0 0 256 256">
          <path
            d="M188,80a27.79,27.79,0,0,0-13.36,3.4,28,28,0,0,0-46.64-11A28,28,0,0,0,80,92v20H68a28,28,0,0,0-28,28v12a88,88,0,0,0,176,0V108A28,28,0,0,0,188,80Zm12,72a72,72,0,0,1-144,0V140a12,12,0,0,1,12-12H80v24a8,8,0,0,0,16,0V92a12,12,0,0,1,24,0v28a8,8,0,0,0,16,0V92a12,12,0,0,1,24,0v28a8,8,0,0,0,16,0V108a12,12,0,0,1,24,0Z">
          </path>
        </svg>
      </div>
      <span>Drag & drop to create a node</span>
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
  props: ['showTipMenu'],
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
  top: 178px;
  right: 10px;
  font-size: 20px;
  border-radius: 8px;
  color: #434b53;
  background: white;
  user-select: none;
  z-index: 1;
  padding: 10px 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 180px;
  font-size: 16px;
  cursor: crosshair;
}

div .onTop {
  top: 10px;
}


.tip-close {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  position: absolute;
  top: 16px;
  right: 5px;
  background: white;
  cursor: pointer;
  color: #434b53;
  border: none;
}

.tip-close:hover {
  background: #e2eaf2;
}

.drag-tip {
  display: flex;
  align-items: center;
  gap: 7px;
}

.drag-tip div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.drag-tip span {
  color: #434b53;
  line-height: 20px;
  font-size: 15px;
}</style>
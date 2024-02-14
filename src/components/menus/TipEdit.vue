<template>
  <div class="tip" :class="{ closedMenu: !showTipMenu, closedDrag: !showTipDrag, closedBoth: !showTipDrag && !showTipMenu}">

    <div class="drag-tip">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#434b53" viewBox="0 0 256 256">
          <path
            d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z">
          </path>
        </svg>
      </div>
      <span>Right click to edit/delete</span>
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
  props: ['showTipMenu', 'showTipDrag'],
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
  top: 240px;
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

div .closedMenu {
  top: 72px;
}

div .closedDrag {
  top: 178px;
}

div .closedBoth {
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
}
</style>
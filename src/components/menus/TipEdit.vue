<template>
  <div class="tip"
    :class="{ closedMenu: !showTipMenu, closedDrag: !showTipDrag, closedBoth: !showTipDrag && !showTipMenu }">

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
    <CloseTipButton @close="close" />
  </div>
</template>
<script>
import CloseTipButton from '../buttons/CloseTipButton.vue';

export default {
  props: ['showTipMenu', 'showTipDrag'],
  methods: {
    close() {
      this.$emit('close');
    },
  },
  components: { CloseTipButton }
};
</script>
<style scoped>
div .tip {
  position: absolute;
  top: 237px;
  right: 7px;
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
  top: 69px;
}

div .closedDrag {
  top: 175px;
}

div .closedBoth {
  top: 7px;
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
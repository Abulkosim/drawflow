<template>
  <div class="tooltip-container">
    <div class="label-info">
      <label v-if="label" for="btn-sizes" class="label">{{ label }}</label>
      <button type="button" class="tooltip-button">{{ content }}</button>
    </div>
    <div class="tooltip-content" :class="{ long: type == 'long', short: type == 'short', contentBottom: posBottom }">
      {{ ttContent }}
      <div class="tooltip-arrow" :class="{ arrowBottom: posBottom }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToolTip',
  props: ['content', 'ttContent', 'label', 'type', 'posBottom'],
  mounted() {
    const tooltipButton = this.$el.querySelector('.tooltip-button');
    const tooltipContent = this.$el.querySelector('.tooltip-content');

    tooltipButton.addEventListener('mouseover', () => {
      tooltipContent.style.display = 'block';

      if (this.posBottom) {
        const buttonHeight = tooltipButton.offsetHeight;
        const spaceBetween = 10;
        tooltipContent.style.top = `${buttonHeight + spaceBetween}px`;
      } else {
        const tooltipHeight = tooltipContent.offsetHeight;
        const spaceBetween = 10;
        tooltipContent.style.top = `-${tooltipHeight + spaceBetween}px`;
      }
    });

    tooltipButton.addEventListener('mouseout', () => {
      tooltipContent.style.display = 'none';
    });
  }
};
</script>
<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Open Sans', sans-serif;
  color: white;
  width: 24px;
  height: 24px;
  background-color: #226ce6aa;
  border-radius: 50%;
  font-size: 14px;
  border: none;
  cursor: pointer;
  outline: none;
  transition: background-color 0.5s ease;
}

.tooltip-button:hover {
  background-color: #226ce6;
}

.tooltip-content {
  position: absolute;
  z-index: 10;
  display: none;
  padding: 6px 9px;
  font-size: 12px;
  color: white;
  background-color: #111827;
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-content.long {
  min-width: 480px;
}

.tooltip-content.short {
  min-width: 150px;
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #111827;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.contentBottom {
  min-height: fit-content;
  top: auto;
  bottom: 100%;
  margin-bottom: 10px;
}

.arrowBottom {
  top: auto;
  bottom: 100%;
  transform: translateX(-50%);
  border-top: none;
  border-bottom: 5px solid #111827;
}

.label-info {
  display: flex;
  gap: 5px;
}
</style>
<template>
  <div v-if="isTwo && showMenu" :style="{ top: position.y + 'px', left: position.x + 'px' }" class="context-menu">
    <ul>
      <li @click="editNode">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#2E363E" viewBox="0 0 256 256">
          <path
            d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z">
          </path>
        </svg>
        <span>Edit</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['showMenu', 'position', 'node'],
  data() {
    return {}
  },
  computed: {
    isTwo: function () {
      return this.node == 2
    }
  },
  methods: {
    editNode() {
      this.$emit('editNode', 'editing');
    }
  }
}
</script>

<style scoped>
.context-menu {
  position: absolute;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid #ddd;

  z-index: 10;
  width: 100px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  padding: 2px;
  color: #565e66;
}

.context-menu ul {
  list-style: none;
  padding: 0;
}

.context-menu ul li {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px;
  cursor: pointer;
  color: #2E363E;
}

.context-menu ul li:first-child {
  border-radius: 8px;
  color: #2E363E;
}

.context-menu ul li:hover {
  background-color: #f0f0f0;
}
</style>
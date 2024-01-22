<template>
  <div v-if="!isOne && !isTwo && showMenu" :style="{ top: position.y + 'px', left: position.x + 'px' }" class="context-menu">
    <ul>
      <li @click="editNode" v-if="!isOne && !isTwo">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2c3e50" viewBox="0 0 256 256">
          <path
            d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z">
          </path>
        </svg>
        <span>Edit</span>
      </li>
      <li @click="deleteNode" v-if="!isOne && !isTwo">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" viewBox="0 0 256 256">
          <path
            d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z">
          </path>
        </svg>
        <span>Delete</span>
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
    isOne: function () {
      return this.node == 1
    },
    isTwo: function () {
      return this.node == 2
    }
  },
  methods: {
    editNode() {
      this.$emit('editNode', 'editing');
    },
    deleteNode() {
      this.$emit('deleteNode');
    }
  }
}
</script>

<style>
.context-menu {
  position: absolute;
  border: 2px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  z-index: 10;
  width: 150px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.context-menu ul {
  list-style: none;
  padding: 0;
}

.context-menu ul li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 17px;
  color: #2c3e50;
}

.context-menu ul li:first-child {
  border-radius: 8px 8px 0 0;
}

.context-menu ul li:last-child {
  border-radius: 0 0 8px 8px;
  color: red;
}

.context-menu ul li:hover {
  background-color: #f0f0f0;
}
</style>
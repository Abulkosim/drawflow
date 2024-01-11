<template>
  <div v-if="!isOne && showMenu" :style="{ top: position.y + 'px', left: position.x + 'px' }" class="context-menu">
    <ul>
      <li @click="addNewNode" :class="{ add: isTwo }" v-if="!isOne">Add Node</li>
      <li @click="editNode" v-if="!isOne && !isTwo">Edit</li>
      <li @click="deleteNode" v-if="!isOne && !isTwo">Delete</li>
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
    addNewNode() {
      this.$emit('addNewNode');
    },
    editNode() {
      this.$emit('editNode');
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
  border-radius: 10px;
  background-color: #fff;
  z-index: 10;
}

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.context-menu ul li {
  padding: 8px 16px;
  cursor: pointer;
}

.context-menu ul li:first-child {
  border-radius: 10px 10px 0 0;
}

.context-menu ul li:last-child {
  border-radius: 0 0 10px 10px;
}

.context-menu ul li:hover {
  background-color: #f0f0f0;
}

.context-menu ul li.add {
  border-radius: 10px;
}
</style>
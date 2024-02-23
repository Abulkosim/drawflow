<template>
  <div v-if="isTwo && showMenu" :style="{ top: position.y + 'px', left: position.x + 'px' }" class="context-menu">
    <ul>
      <li @click="editNode">
        <EditIcon />
        <span>Edit</span>
      </li>
    </ul>
  </div>
</template>
<script>
import EditIcon from '../icons/EditIcon.vue';

export default {
  props: ['showMenu', 'position', 'node'],
  components: { EditIcon },
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
@import '../../assets/context.menu.css';

.context-menu ul li:first-child {
  border-radius: 8px;
  color: #2E363E;
}

.context-menu ul li:hover {
  background-color: #f0f0f0;
}
</style>
<template>
  <div v-if="!isOne && !isTwo && showMenu" :style="{ top: position.y + 'px', left: position.x + 'px' }"
    class="context-menu">
    <ul>
      <li @click="editNode" v-if="!isOne && !isTwo">
        <EditIcon />
        <span>Edit</span>
      </li>
      <li @click="deleteNode" v-if="!isOne && !isTwo">
        <DeleteIcon />
        <span>Delete</span>
      </li>
    </ul>
  </div>
</template>
<script>
import EditIcon from '../icons/EditIcon.vue';
import DeleteIcon from '../icons/DeleteIcon.vue';
import '../../assets/context.menu.css';

export default {
  props: ['showMenu', 'position', 'node'],
  data() {
    return {};
  },
  computed: {
    isOne: function () {
      return this.node == 1;
    },
    isTwo: function () {
      return this.node == 2;
    }
  },
  methods: {
    editNode() {
      this.$emit('editNode', 'editing');
    },
    deleteNode() {
      this.$emit('deleteNode');
    }
  },
  components: { EditIcon, DeleteIcon }
}
</script>
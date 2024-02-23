<template>
  <table>
    <thead>
      <tr>
        <th v-for="column in headings" :key="column">{{ column }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td v-for="column in columns" :key="column" :class="{ rel: column == 'actions' }">
          <template v-if="column === 'actions'">
            <span class="svg" @click="openContextMenu($event, item.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#226CE6" viewBox="0 0 256 256">
                <path
                  d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128ZM48,100a28,28,0,1,0,28,28A28,28,0,0,0,48,100Zm160,0a28,28,0,1,0,28,28A28,28,0,0,0,208,100Z">
                </path>
              </svg>
            </span>
            <transition name="fade">
              <div class="options" v-if="clicked[item.id]">
                <div @click="editButton(item.id)">
                  <EditIcon />
                  <span>Edit</span>
                </div>
                <div @click="deleteButton(item.id)">
                  <DeleteIcon />
                  <span class="delete">Delete</span>
                </div>
              </div>
            </transition>
          </template>
          <template v-else>
            <div class="truncate">
              {{ item[column] }}
            </div>
          </template>
        </td>
      </tr>
    </tbody>
    <tbody class="empty-body" v-if="!items.length">
      <tr>
        <td :colspan="columns.length">No data available</td>
      </tr>
    </tbody>
    <button @click.stop.prevent="addButton" type="button" title="Add Button">+</button>
  </table>
</template>

<script>
import { deleteButton, fetchButtons } from '../../api/api.table';
import DeleteIcon from '../icons/DeleteIcon.vue';
import EditIcon from '../icons/EditIcon.vue';

export default {
  props: ['inputValues', 'showStageButtonModal', 'updateTable'],
  data() {
    return {
      clicked: {},
      columns: ['id', 'btn_order', 'alias', 'is_web_app', 'back', 'actions'],
      headings: ['id', 'order', 'name', 'is web_app?', 'back', 'actions'],
      items: [],
      stage_id: this.inputValues.id ?? null,
    };
  },
  async created() {
    await this.getTableData();
    document.addEventListener('click', this.closeMenuOnClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeMenuOnClickOutside);
  },
  async mounted() {
  },
  methods: {
    openContextMenu(event, itemId) {
      event.stopPropagation();
      this.getTableData();
      if (this.clicked[itemId]) {
        this.clicked = {};
      }
      else {
        this.clicked = { [itemId]: true };
      }
    },
    closeMenuOnClickOutside(event) {
      const clickedElement = event.target;
      const isOptionsMenuClicked = clickedElement.closest('.options');
      if (!isOptionsMenuClicked) {
        this.clicked = {};
      }
    },
    async getTableData() {
      if (this.stage_id) {
        this.items = await fetchButtons(this.stage_id);
      }
      for (let item of this.items) {
        if (item.created_at) {
          item.created_at = new Date(item.created_at).toLocaleDateString() + ' ' + new Date(item.created_at).toLocaleTimeString().slice(0, 5);
        }
      }
    },
    async deleteButton(id) {
      await deleteButton(id);
      await this.getTableData();
    },
    addButton() {
      this.$emit('openStageButtonModal');
    },
    editButton(id) {
      this.$emit('openStageButtonModal', id);
    },
  },
  watch: {
    updateTable() {
      this.getTableData();
    }
  },
  components: { EditIcon, DeleteIcon }
};
</script>

<style scoped>
@import '../../assets/table.css';

table .options span {
  font-weight: 500;
}

svg {
  width: 17px;
  height: 17px;
}

table .options .delete {
  color: red
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
</style>
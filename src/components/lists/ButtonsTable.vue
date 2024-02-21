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
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="#226CE6" viewBox="0 0 256 256">
                    <path
                      d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z">
                    </path>
                  </svg>
                  <span>Edit</span>
                </div>
                <div @click="deleteButton(item.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="red" viewBox="0 0 256 256">
                    <path
                      d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z">
                    </path>
                  </svg>
                  <span>Delete</span>
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
import http from '../../interceptors/http';

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
      } else {
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
        const response = await http.get(`tg/bot/stage/button/list?stage_id=${this.stage_id}`);
        this.items = response.data.data;
      }

      for (let item of this.items) {
        if (item.created_at) {
          item.created_at = new Date(item.created_at).toLocaleDateString() + ' ' + new Date(item.created_at).toLocaleTimeString().slice(0, 5)
        }
      }
    },

    async deleteButton(id) {
      await http.put(`tg/bot/stage/button/delete?id=${id}`)
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
  }
};
</script>

<style scoped>
@import '../../assets/table.css';

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
</style>
<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td v-for="column in columns" :key="column" :class="{ rel: column == 'actions' }">
            <template v-if="column === 'actions'">
              <span class="svg" @click="openContextMenu(item.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#2c3e50" viewBox="0 0 256 256">
                  <path
                    d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,48,144ZM208,96a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,208,144Z">
                  </path>
                </svg>
              </span>
              <transition name="fade">
                <div class="options" v-if="clicked[item.id]">
                  <div @click="editButton(item.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2c3e50" viewBox="0 0 256 256">
                      <path
                        d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z">
                      </path>
                    </svg>
                    <span>Edit</span>
                  </div>
                  <div @click="deleteButton(item.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" viewBox="0 0 256 256">
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
              {{ item[column] }}
            </template>
          </td>
        </tr>
      </tbody>
      <button @click.stop.prevent="addButton" title="Add Button">+</button>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['inputValues', 'showStageButtonModal'],
  data() {
    return {
      clicked: {},
      columns: ['id', 'btn_order', 'alias', 'is_web_app', 'back', 'actions'],
      items: [],
      stage_id: this.inputValues.id ?? null,
    };
  },
  async mounted() {
    await this.getTableData();
    this.items.forEach((item) => {
      this.clicked[item.id] = false;
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('.rel') == null) {
        this.clicked = {};
      }
    });

    setInterval(() => {
      if (this.showStageButtonModal == false) {
        this.getTableData();
      }
    }, 100);

  },

  methods: {
    openContextMenu(itemId) {
      if (this.clicked[itemId]) {
        this.clicked[itemId] = false;
      } else {
        for (let id in this.clicked) {
          this.clicked[id] = false;
        }
        this.clicked[itemId] = true;
      }
    },

    async getTableData() {
      if (this.stage_id) {
        const response = await axios.get(`http://10.20.11.24:8080/api/tg/bot/stage/button/list?stage_id=${this.stage_id}`);
        this.items = response.data.data;
      }

      for (let item of this.items) {
        if (item.created_at) {
          item.created_at = new Date(item.created_at).toLocaleDateString() + ' ' + new Date(item.created_at).toLocaleTimeString().slice(0, 5)
        }
      }
    },

    async deleteButton(id) {
      await axios.delete(`http://10.20.11.24:8080/api/tg/bot/stage/button/delete?id=${id}`)
      await this.getTableData();
    },

    addButton() {
      this.$emit('openStageButtonModal');
    },

    editButton(id) {
      this.$emit('openStageButtonModal', id);
    },
  },
};
</script>

<style scoped>
.table-container {
  user-select: none;
}

.table-container::-webkit-scrollbar {
  display: none;
}

table {
  margin: 20px 0;
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  color: #2c3e50;
  position: relative;
  border-bottom: 2px solid #2c3e50;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
  padding: 10px;
  border: 1px solid #ddd;
}

td {
  border: 1px solid #ddd;
  padding: 10px;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f5f5f5;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  outline: none;
  font-size: 24px;
  background-color: #2c3e50;
  color: white;
  border: none;
  position: absolute;
  right: -13px;
  bottom: -13px;
}

.svg svg {
  cursor: pointer;
  padding: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.svg svg:hover {
  background-color: #ddd;
}

.svg svg:active {
  background-color: #d4d4d4;
}

.rel {
  position: relative;
}

.options {
  display: flex;
  flex-direction: column;
  position: absolute;
  padding: 2px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 10;
  top: 40px;
  left: -55px;
  border: 1px solid #ccc;
  border-top-right-radius: 0;
  background-color: white;
}

.options div {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.options div:hover {
  background-color: #f5f5f5;
}

.options div:active {
  background-color: #d4d4d4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
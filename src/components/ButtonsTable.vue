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
          <td v-for="column in columns" :key="column">
            <template v-if="column === 'actions'">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#2c3e50" viewBox="0 0 256 256">
                  <path
                    d="M128,96a32,32,0,1,0,32,32A32,32,0,0,0,128,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,144ZM48,96a32,32,0,1,0,32,32A32,32,0,0,0,48,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,48,144ZM208,96a32,32,0,1,0,32,32A32,32,0,0,0,208,96Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,208,144Z">
                  </path>
                </svg>
              </span>
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
      columns: ['id', 'btn_order', 'alias', 'is_web_app', 'back', 'created_at', 'actions'],
      items: [],
      stage_id: this.inputValues.id ?? null,
    };
  },
  async mounted() {
    await this.getTableData();

    setInterval(() => {
      if (this.showStageButtonModal == false) {
        this.getTableData();
      }
    }, 100);
  },
  methods: {
    async getTableData() {
      if (this.stage_id) {
        const response = await axios.get(`http://10.20.11.24:8080/api/tg/bot/stage/button/list?stage_id=${this.stage_id}`);
        this.items = response.data.data;
      }

      for (let item of this.items) {
        if (item.created_at) {
          item.created_at = new Date(item.created_at).toLocaleDateString() + ' ' + new Date(item.created_at).toLocaleTimeString().slice(0, 5)
        }

        item.actions = ``;
      }
    },
    addButton() {
      this.$emit('openStageButtonModal');
    },
  },
};
</script>

<style scoped>
.table-container {
  overflow-x: invisible;
  overflow-y: hidden;
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
  width: 30px;
  height: 30px;
  border-radius: 50%;
  outline: none;
  font-size: 24px;
  background-color: #2c3e50;
  color: white;
  border: none;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -15px;
}

span svg {
  cursor: pointer;
  padding: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

span svg:hover {
  background-color: #ddd;
}

span svg:active {
  background-color: #d4d4d4;
}
</style>
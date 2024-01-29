<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td v-for="column in columns" :key="column">{{ item[column] }}</td>
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
      columns: ['id', 'btn_order', 'button', 'is_web_app', 'back', 'created_at'],
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
    },
    addButton() {
      this.$emit('openStageButtonModal');
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  margin: 20px 0;
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
  bottom: -14px;
  right: -14px
}
</style>
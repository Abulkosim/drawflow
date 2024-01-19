<template>
  <div>
    <div id="drawflow">
      <div id="buttons">
        <button @click="showButtons = !showButtons">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <Transition>
          <div v-if="showButtons">
            <button @click="zoomIn">+</button>
            <button @click="zoomOut">-</button>
          </div>
        </Transition>
      </div>
    </div>

    <Menu :position="contextMenuPosition" :showMenu="showContextMenu" @addNewNode="openInputModal"
      @deleteNode="openConfirmationModal" @editNode="openInputModal" :node="selectedNode" />

    <div v-if="showModal" class="overlay"></div>

    <Modal :showModal="showModal" @close="closeConfirmationModal" @confirm="confirmDeletion" />

    <Toast :success="isSuccessful" :show="showToast" :msg="toastMessage" />

    <div v-if="showInputModal" class="overlay"></div>

    <Input v-if="showInputModal" :showModal="showInputModal" :addMode="addMode" :inputValues="inputValues"
      @close="closeInputModal" @save="save" />
  </div>
</template>

<script>
import Vue from 'vue'
import Drawflow from 'drawflow'
import './assets/main.css'
import Node from './components/Node.vue'
import Menu from './components/Menu.vue'
import Modal from './components/Modal.vue'
import Toast from './components/Toast.vue'
import Input from './components/Input.vue'
import axios from "axios";

export default {
  name: 'App',
  components: {
    Menu,
    Modal,
    Toast,
    Input,
    Node
  },
  data() {
    return {
      showButtons: false,
      editor: null,
      showContextMenu: false,
      showModal: false,
      showInputModal: false,
      contextMenuPosition: { x: 0, y: 0 },
      selectedNode: null,
      showToast: false,
      isSuccessful: false,
      toastMessage: '',
      addMode: true,
      data: [],
      inputValues: {},
      url: 'http://10.20.11.24:8080/api/'
    }
  },

  async created() {
    await this.getStages()
  },

  async mounted() {
    const id = document.getElementById("drawflow");
    this.editor = new Drawflow(id, Vue, this);
    this.editor.start();

    if (!this.data.length) {
      await this.getStages()
    }

    this.editor.import(this.data);

    id.addEventListener('contextmenu', this.handleRightClick)

    this.editor.on('nodeSelected', (node) => {
      this.selectedNode = node;
    });

    window.addEventListener('click', () => {
      this.showContextMenu = false;
    });

  },
  methods: {
    zoomIn() {
      this.editor.zoom_in()
    },

    zoomOut() {
      this.editor.zoom_out()
    },

    async getStages() {
      try {
        const response = await axios.get(`${this.url}v1/bot/stage/list?bot_id=122`);
        const apiData = response.data.data;
        this.data = await this.transformApiData(apiData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    },

    async transformApiData(apiData) {

      const transformedData = {
        drawflow: {
          Home: {
            data: {
              "1": {
                "id": 1,
                "name": "Node 1",
                "data": {},
                "class": "nodeOne",
                "html": `<div class="card-devices"><span>/start</span></div>`,
                "typenode": false,
                "inputs": {},
                "outputs": {
                  "output_1": {
                    "connections": [
                      {
                        "node": "2",
                        "output": "input_1"
                      }
                    ]
                  }
                },
                "pos_x": 30,
                "pos_y": 200
              },
              "2": {
                "id": 2,
                "name": "Node 2",
                "data": {},
                "class": "nodeTwo",
                "html": `<div class="card-devices"><span>uz, ru, en</span></div>`,
                "typenode": false,
                "inputs": {
                  "input_1": {
                    "connections": [
                      {
                        "node": "1",
                        "input": "output_1"
                      }
                    ]
                  }
                },
                "outputs": {
                  "output_1": {
                    "connections": [
                      {
                        // "node": "3",
                        "output": 'input_1'
                      }
                    ]
                  }
                },
                "pos_x": 250,
                "pos_y": 200
              },
            }
          }
        }
      };

      if (apiData && apiData.length) {
        apiData.forEach((item) => {
          transformedData.drawflow.Home.data[`${item.id}`] = {
            id: item.id,
            name: `Node ${item.id}`,
            data: {},
            class: `node${item.id}`,
            html: `<div class="card-devices"><span>${item.alias}</span></div>`,
            typenode: false,
            inputs: this.generateInputs(item),
            outputs: this.generateOutputs(item),
            pos_x: 300 + Math.floor(Math.random() * 201) + 150,
            pos_y: 200 + Math.floor(Math.random() * 201) - 100
          };
        });
      }
      return transformedData
    },

    generateInputs(item) {
      return {
        input_1: {
          connections: [
            {
              node: 2,
              input: 'output_1'
            }
          ]
        }
      };
    },

    generateOutputs(item) {
      return {
        output_1: {
          connections: []
        }
      };
    },


    closeModal() {
      this.showModal = false;
    },

    handleRightClick(event) {
      event.preventDefault();

      if (event.target.closest('.drawflow-node')) {
        this.showContextMenu = true;
        this.contextMenuPosition = { x: event.pageX, y: event.pageY };
      }
    },

    save(nodeData) {
      if (this.addMode) {
        const positionX = this.contextMenuPosition.x + Math.floor(Math.random() * 101) + 130;
        const positionY = this.contextMenuPosition.y + Math.floor(Math.random() * 201) - 100;
        const data = {}
        this.create(nodeData.alias, positionX, positionY, data, nodeData)
          .then(() => {
            this.showSuccessToast()
          })
          .catch((error) => {
            this.showFailedToast(error)
          })
          .finally(() => {
            this.closeInputModal();
          });
      } else {
        this.updateNode(nodeData)
          .then(() => {
            this.showSuccessToast()
          })
          .catch((error) => {
            this.showFailedToast(error)
          })
          .finally(() => {
            this.closeInputModal();
          });
      }
    },

    async create(name, x, y, data, nodeData) {
      try {
        const newNodeId = this.editor.addNode(name, 1, 1, x, y, 'newNode', data, `<div class="card-devices"><span class="content">${nodeData.alias}</span></div>`);
        // delete nodeData.id;
        // await axios.post(`${this.url}tg/bot/stage/create`, nodeData);

        console.log(nodeData)
        if (this.selectedNode) {
          const id = this.selectedNode.replace('node-', '');
          this.editor.addConnection(id, newNodeId, 'output_1', 'input_1');
        }
      } catch (error) {
        console.error(`Error creating node: ${error}`);
        console.log(error.response)
        throw error;
      } finally {
        this.addMode = false;
      }
    },

    async updateNode(nodeData) {
      try {
        let nodeId = this.selectedNode;
        let node = this.editor.getNodeFromId(nodeId);

        await axios.post(`${this.url}tg/bot/stage/update`, nodeData);

        let contentElement = document.querySelector(`#node-${nodeId} .card-devices`);
        if (node && contentElement) {
          let newHtml = `<span class="content">${nodeData.alias}</span>`;
          this.editor.drawflow.drawflow.Home.data[nodeId].html = newHtml;
          contentElement.innerHTML = newHtml;
        }

      } catch (error) {
        console.error(`Error updating node: ${error}`);
        console.log(error.response)
        throw error;
      }
    },

    confirmDeletion() {
      if (this.selectedNode) {
        this.deleteNode(this.selectedNode)
          .then(() => {
            this.showSuccessToast()
          })
          .catch((error) => {
            this.showFailedToast(error)
          })
          .finally(() => {
            this.closeConfirmationModal();
          });
      }
    },

    async deleteNode(id) {
      try {
        this.editor.removeNodeId(`node-${id}`)
      } catch (error) {
        console.error(`Error deleting node: ${error}`);
        throw error;
      } finally {
        this.selectedNode = null
      }
    },

    async getNode(id) {
      try {
        const response = await axios.get(`${this.url}v1/bot/stage?bot_id=122&id=${id}`);
        const apiData = response.data.data.stage;
        this.inputValues = {
          alias: apiData.alias,
          btn_sizes: apiData.btn_sizes,
          btn_type: apiData.btn_type,
          condition: apiData.condition,
          id: apiData.id ?? this.selectedNode,
          media: apiData.media,
          stage_order: apiData.stage_order,
          text_alias: apiData.text_alias,
          text_id: apiData.text_id,
          url: apiData.url ? 'URL' : 'STAGE',
          user_state: apiData.user_state
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    },

    async openInputModal(info) {
      this.showContextMenu = false;
      this.addMode = info === 'adding';

      if (!this.addMode && this.selectedNode) {
        let node = this.editor.getNodeFromId(this.selectedNode);
        const html = this.editor.drawflow.drawflow.Home.data[this.selectedNode].html

        const text = html.replace(/<[^>]*>?/gm, '');

        if (node) {
          await this.getNode(this.selectedNode)
        }
      } else {
        this.inputValues = {};
      }

      this.showInputModal = true;
    },

    closeInputModal() {
      this.showInputModal = false;
    },

    openConfirmationModal() {
      this.showModal = true;
      this.showContextMenu = false
    },

    closeConfirmationModal() {
      this.showModal = false;
    },

    showSuccessToast() {
      this.toastMessage = 'Successfully done!';
      this.isSuccessful = true;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    },

    showFailedToast(error) {
      this.toastMessage = error;
      this.isSuccessful = false;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#container {
  position: relative;
}

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  background-color: #6B7280;
  opacity: 0.5;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

#drawflow {
  position: relative;
  width: 100%;
  height: calc(100vh);
  background-size: 20px 20px;
  border-radius: 5px;
  /* background-image: radial-gradient(#0c41605e 1px, transparent 1px); */
  background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, #0c41601f 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #0c41601f 20px);
  cursor: grab;
}

#buttons {
  display: none;
  position: absolute;
  right: 3px;
  top: 3px;
  font-weight: bold;
  z-index: 1;
}

#buttons button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: white;
  font-size: 26px;
  padding: 10px;
  color: 2c3e50;
  border: 2px solid #2c3e50;
  margin: 2px;
  border-radius: 50%;
  cursor: pointer;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}

.card-devices {
  font-weight: 600;
  font-size: 20px;
  text-align: center;
}
</style>
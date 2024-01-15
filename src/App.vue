<template>
  <div>
    <div id="drawflow">
      <div id="buttons">
        <button @click="zoomIn">+</button>
        <button @click="zoomOut">-</button>
      </div>
    </div>

    <Menu :position="contextMenuPosition" :showMenu="showContextMenu" @addNewNode="openInputModal"
      @deleteNode="openConfirmationModal" @editNode="openInputModal" :node="selectedNode" />

    <div v-if="showModal" class="overlay"></div>

    <Modal :showModal="showModal" @close="closeConfirmationModal" @confirm="confirmDeletion" />

    <Toast :success="isSuccessful" :show="showToast" :msg="toastMessage" />

    <div v-if="showInputModal" class="overlay"></div>

    <Input v-if="showInputModal" :showModal="showInputModal" :addMode="addMode" :editNodeData="editNodeData"
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
      editNodeData: null
    }
  },
  mounted() {
    const id = document.getElementById("drawflow");
    this.editor = new Drawflow(id, Vue, this);
    this.fetchData()


    const start = 'start'
    const dataToImport = {
      "drawflow": {
        "Home": {
          "data": {
            "1": {
              "id": 1,
              "name": "Node 1",
              "data": {},
              "class": "nodeOne",
              "html": `<div class="card-devices"><span>${start}</span></div>`,
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
                      "node": "3",
                      "output": 'input_1'
                    }
                  ]
                }
              },
              "pos_x": 250,
              "pos_y": 200
            },
            "3": {
              "id": 3,
              "name": "Node 3",
              "data": {},
              "class": "nodeThree",
              "html": `<div class="card-devices"><span>third stage</span></div>`,
              "typenode": false,
              "inputs": {
                "input_1": {
                  "connections": [
                    {
                      "node": "2",
                      "input": "output_1"
                    }
                  ]
                }
              },
              "outputs": {
                "output_1": {
                  "connections": [
                    {
                      // "node": "2",
                      "input": "output_1"
                    }
                  ]
                }
              },
              "pos_x": 500,
              "pos_y": 150
            }
          }
        },
      }
    }


    this.editor.start();
    this.editor.import(dataToImport);


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

    async fetchData() {
      try {
        const response = await axios.get('http://10.20.11.24:8080/api/v1/bot/stage/list?bot_id=110');
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
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

    async updateNode(nodeData) {
      try {
        let nodeId = this.selectedNode;
        let node = this.editor.getNodeFromId(nodeId);
        if (node) {
          this.editor.updateNodeDataFromId(this.selectedNode, { alias: nodeData.alias })
        }
      } catch (error) {
        console.error(`Error updating node: ${error}`);
        throw error;
      }
    },

    async create(name, x, y, data, nodeData) {
      try {
        this.editor.registerNode('Node', Node, nodeData);
        const newNodeId = this.editor.addNode(name, 1, 1, x, y, 'newNode', data, 'Node', 'vue');
        if (this.selectedNode) {
          const id = this.selectedNode.replace('node-', '');
          this.editor.addConnection(id, newNodeId, 'output_1', 'input_1');
        }
      } catch (error) {
        console.error(`Error creating node: ${error}`);
        throw error;
      } finally {
        this.addMode = false;
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

    openInputModal(info) {
      this.showContextMenu = false;
      this.addMode = info === 'adding';

      if (!this.addMode && this.selectedNode) {
        let node = this.editor.getNodeFromId(this.selectedNode);
        if (node) {
          this.editNodeData = node.alias;
        }
      } else {
        this.editNodeData = null;
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
  background-image: radial-gradient(#0c416085 1px, transparent 1px);
  cursor: grab;
}

#buttons {
  position: absolute;
  right: 0;
  bottom: 0;
  font-weight: bold;
  z-index: 1;
}

#buttons button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #2c3e50;
  font-size: 26px;
  padding: 10px;
  background: white;
  border: 2px solid #2c3e50;
  margin: 2px;
  border-radius: 5px;
  cursor: pointer;
}

.card-devices {
  font-weight: 600;
  font-size: 20px;
  text-align: center;
}
</style>
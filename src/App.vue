<template>
  <div>
    <div id="drawflow">
      <div id="buttons">
        <button @click="zoomIn">+</button>
        <button @click="zoomOut">-</button>
      </div>
    </div>

    <Menu :position="contextMenuPosition" :showMenu="showContextMenu" @addNewNode="openInputModal"
      @deleteNode="openConfirmationModal" @editNode="editNode" :node="selectedNode" />

    <div v-if="showModal" class="overlay"></div>

    <Modal :showModal="showModal" @close="closeConfirmationModal" @confirm="confirmDeletion" />

    <Toast :success="isSuccessful" :show="showToast" :msg="toastMessage" />

    <div v-if="showInputModal" class="overlay"></div>

    <Input v-if="showInputModal" :showModal="showInputModal" :adding="adding" @close="closeInputModal"
      @save="addNewNode" />
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
      adding: true,
    }
  },
  mounted() {
    const id = document.getElementById("drawflow");
    this.editor = new Drawflow(id, Vue, this);
    this.editor.start();
    const data = {}

    let props = { content: '/start' }
    this.editor.registerNode('Node', Node, props);
    const firstNode = this.editor.addNode('Node 1', 0, 1, 30, 200, 'nodeOne', data, 'Node', 'vue');

    props = { content: 'uz, ru, en' }
    this.editor.registerNode('Node', Node, props);
    const secondNode = this.editor.addNode('Node 2', 1, 1, 250, 200, 'nodeTwo', data, 'Node', 'vue');

    this.editor.addConnection(firstNode, secondNode, 'output_1', 'input_1');

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

    editNode() {
      this.showContextMenu = false;
      this.adding = false;
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

    addNewNode(props) {
      const positionX = this.contextMenuPosition.x + Math.floor(Math.random() * 101) + 130;
      const positionY = this.contextMenuPosition.y + Math.floor(Math.random() * 201) - 100;
      const data = {}
      console.log(props)

      this.create('New Node', positionX, positionY, data, props)
        .then(() => {
          this.showSuccessToast()
        })
        .catch((error) => {
          this.showFailedToast(error)
        })
        .finally(() => {
          this.closeInputModal();
        });
    },

    async create(name, x, y, data, props) {
      try {
        this.editor.registerNode('Node', Node, props);
        const newNodeId = this.editor.addNode(name, 1, 1, x, y, 'newNode', data, 'Node', 'vue');
        if (this.selectedNode) {
          const id = this.selectedNode.replace('node-', '');
          this.editor.addConnection(id, newNodeId, 'output_1', 'input_1');
        }
      } catch (error) {
        console.error(`Error creating node: ${error}`);
        throw error;
      } finally {
        this.adding = false;
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

    openInputModal() {
      this.showContextMenu = false;
      this.adding = true;
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
</style>
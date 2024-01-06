<template>
  <div>
    <div id="drawflow">
      <div id="buttons">
        <button @click="zoomIn">+</button>
        <button @click="zoomOut">-</button>
      </div>
    </div>

    <Menu :position="contextMenuPosition" :showMenu="showContextMenu" @addNewNode="addNewNode"
      @deleteNode="openConfirmationModal" @editNode="editNode" />

    <div v-if="showModal" class="overlay"></div>

    <Modal :showModal="showModal" @close="closeConfirmationModal" @confirm="confirmDeletion" />

    <Toast :success="isSuccessful" :show="showToast" :msg="toastMessage" />
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

export default {
  name: 'App',
  components: {
    Menu,
    Modal,
    Toast
  },
  data() {
    return {
      editor: null,
      showContextMenu: false,
      showModal: false,
      contextMenuPosition: { x: 0, y: 0 },
      selectedNodeId: null,
      selectedNode: null,
      showToast: false,
      isSuccessful: false,
      toastMessage: ''
    }
  },
  mounted() {
    const id = document.getElementById("drawflow");
    this.editor = new Drawflow(id, Vue, this);
    this.editor.start();
    const options = {};
    const props = { name: `Node` };
    this.editor.registerNode('Node', Node, props, options);
    const data = {};
    const node1Id = this.editor.addNode('Node 1', 0, 1, 50, 200, 'nodeOne', data, 'Node', 'vue');
    const node2Id = this.editor.addNode('Node 2', 1, 1, 350, 100, 'nodeTwo', data, 'Node', 'vue');
    const node3Id = this.editor.addNode('Node 3', 1, 1, 350, 300, 'nodeThree', data, 'Node', 'vue');
    const node4Id = this.editor.addNode('Node 4', 1, 1, 550, 400, 'nodeFour', data, 'Node', 'vue');
    const node5Id = this.editor.addNode('Node 5', 1, 1, 750, 500, 'nodeFive', data, 'Node', 'vue');
    const node6Id = this.editor.addNode('Node 6', 1, 1, 950, 400, 'nodeFive', data, 'Node', 'vue');
    const node7Id = this.editor.addNode('Node 7', 1, 1, 950, 200, 'nodeFive', data, 'Node', 'vue');
    const node8Id = this.editor.addNode('Node 8', 1, 1, 1000, 300, 'nodeFive', data, 'Node', 'vue');
    const node9Id = this.editor.addNode('Node 9', 1, 1, 600, 50, 'nodeFive', data, 'Node', 'vue');
    const node10Id = this.editor.addNode('Node 4', 1, 1, 600, 200, 'nodeThree', data, 'Node', 'vue');

    this.editor.addConnection(node1Id, node2Id, 'output_1', 'input_1');
    this.editor.addConnection(node1Id, node3Id, 'output_1', 'input_1');
    this.editor.addConnection(node2Id, node9Id, 'output_1', 'input_1');
    this.editor.addConnection(node3Id, node4Id, 'output_1', 'input_1');
    this.editor.addConnection(node4Id, node5Id, 'output_1', 'input_1');
    this.editor.addConnection(node4Id, node6Id, 'output_1', 'input_1');
    this.editor.addConnection(node4Id, node7Id, 'output_1', 'input_1');
    this.editor.addConnection(node4Id, node8Id, 'output_1', 'input_1');
    this.editor.addConnection(node3Id, node10Id, 'output_1', 'input_1');

    id.addEventListener('contextmenu', this.handleRightClick)

    this.editor.on('nodeCreated', (id) => {
      let nodeElement = document.getElementById('node-' + id);
      nodeElement.addEventListener('contextmenu', (event) => this.setNodeForContextMenu(event, id));
    });

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
    },

    closeModal() {
      this.showModal = false;
    },

    handleRightClick(event) {
      event.preventDefault();

      if (event.target.closest('.drawflow-node')) {
        this.selectedNodeId = event.target.closest('.drawflow-node').id;
        this.showContextMenu = true;
        this.contextMenuPosition = { x: event.pageX, y: event.pageY };
      }
    },

    addNewNode() {
      this.showContextMenu = false;
      const data = {};
      const positionX = this.contextMenuPosition.x + 200;
      const positionY = this.contextMenuPosition.y;
      const newNodeId = this.editor.addNode('New Node', 1, 1, positionX, positionY, 'newNode', data, 'Node', 'vue');

      if (this.selectedNodeId) {
        const selectedNodeIdNumeric = this.selectedNodeId.replace('node-', '');
        this.editor.addConnection(selectedNodeIdNumeric, newNodeId, 'output_1', 'input_1');
      }
    },

    setNodeForContextMenu(event, nodeId) {
      event.preventDefault();
      this.selectedNodeId = nodeId;
      this.showContextMenu = true;
    },

    openConfirmationModal(nodeId) {
      this.selectedNodeId = nodeId;
      this.showModal = true;
      this.showContextMenu = false
    },

    closeConfirmationModal() {
      this.showModal = false;
      this.selectedNodeId = null
    },

    confirmDeletion() {
      if (this.selectedNode) {
        this.deleteNodeAsync(this.selectedNode)
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

    async deleteNodeAsync(id) {
      try {
        this.editor.removeNodeId(`node-${id}`)
      } catch (error) {
        console.error(`Error deleting node: ${error}`);
        throw error;
      } finally {
        this.selectedNode = null
      }
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
    },
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
  background-color: #6B7280;
  opacity: 0.7;
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
  z-index: 0;
}

#buttons button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 26px;
  padding: 10px;
  background: #2c3e50;
  border: none;
  margin: 2px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
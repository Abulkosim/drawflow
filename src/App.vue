<template>
  <div class="relative">
    <div id="drawflow">
      <div id="buttons">
        <button @click="zoomIn">+</button>
        <button @click="zoomOut">-</button>
      </div>
    </div>

    <!-- <div v-if="showContextMenu" :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }"
      class="context-menu">
      <ul>
        <li @click="addNewNode">Add Node</li>
        <li @click="editNode">Edit</li>
        <li @click="openConfirmationModal">Delete</li>
      </ul>
    </div> -->
    <Menu :position="contextMenuPosition" :showMenu="showContextMenu" />
    <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div v-if="showModal"
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white flex items-center justify-center z-20 rounded-xl">
      <div>
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 p-8">
          <button type="button" @click="closeConfirmationModal"
            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this
              node? </h3>
            <button data-modal-hide="popup-modal" type="button" @click="confirmDeletion"
              class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
              Yes, I'm sure
            </button>
            <button data-modal-hide="popup-modal" type="button" @click="closeConfirmationModal"
              class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No,
              cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showToast" class="toast" :class="{ success: isSuccessful, failed: !isSuccessful }">
      {{ toastMessage }}
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import Drawflow from 'drawflow'
import './assets/main.css'
import Node from './components/Node.vue'
import Menu from './components/Menu.vue'

export default {
  name: 'App',
  components: {
    Menu
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
      this.toastMessage = 'Successfully deleted!';
      this.isSuccessful = true;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 1000);
    },

    showFailedToast(error) {
      this.toastMessage = error;
      this.isSuccessful = false;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 1000);
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

#drawflow {
  position: relative;
  width: 100%;
  height: calc(100vh);
  background-size: 20px 20px;
  border-radius: 5px;
  background-image: radial-gradient(#0C4160 1px, transparent 1px);
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
  color: white;
  font-size: 26px;
  padding: 10px;
  background: #2c3e50;
  border: none;
  margin: 2px;
  border-radius: 5px;
  cursor: pointer;
}

.context-menu {
  position: absolute;
  border: 2px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  z-index: 1000;
}

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.context-menu ul li {
  padding: 8px 15px;
  cursor: pointer;
}

.context-menu ul li:first-child {
  border-radius: 10px 10px 0 0;

}

.context-menu ul li:last-child {
  border-radius: 0 0 10px 10px;
}

.context-menu ul li:hover {
  background-color: #f0f0f0;
}

.toast {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  font-size: 18px;
  background-color: grey;
  z-index: 1000;
  border-radius: 20px 0px 20px 20px;
}

.toast.success {
  background-color: lightseagreen;
}

.toast.failed {
  background-color: rgba(255, 0, 0, 0.432);
}
</style>
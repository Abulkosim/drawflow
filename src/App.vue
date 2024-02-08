<template>
  <div>
    <div id="drawflow" @drop="drop($event)" @dragover="allowDrop($event)">
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
      <div class="card-devices node-drag" draggable="true" @dragstart="drag($event)">
        <span>Drag to create</span>
      </div>
    </div>

    <ContextMenu :position="contextMenuPosition" :showMenu="showContextMenu" @deleteNode="openConfirmationModal"
      @editNode="openInputModal" :node="selectedNode" />

    <LocalesContextMenu :position="contextMenuPosition" :showMenu="showContextMenu" @editNode="openLocaleModal"
      :node="selectedNode" />

    <div v-if="showModal" class="overlay"></div>

    <ConfirmationModal :showModal="showModal" @close="closeConfirmationModal" @confirm="confirmDeletion" />

    <Toast :success="isSuccessful" :show="showToast" :msg="toastMessage" />

    <div v-if="showInputModal" class="overlay"></div>

    <InputModal v-if="showInputModal" :showModal="showInputModal" :addMode="addMode" :inputValues="inputValues"
      :bot_id="bot_id" :user_id="user_id" :getTexts="getTexts" :showStageButtonModal="showStageButtonModal"
      @close="closeInputModal" @save="save" @openStageButtonModal="openStageButtonModal"
      @create="showAddTextModal = true" />

    <div v-if="showStageButtonModal" class="overlay"></div>

    <StageButtonModal v-if="showStageButtonModal" :showStageButtonModal="showStageButtonModal" :inputValues="inputValues"
      :bot_id="bot_id" :user_id="user_id" :buttons="buttons" :stageButtonId="stageButtonId" @close="closeStageButtonModal"
      @create="showAddButtonModal = true" />

    <div v-if="showAddButtonModal" class="overlay high-index"></div>

    <AddButtonModal v-if="showAddButtonModal" :showAddButtonModal="showAddButtonModal" @close="closeAddButtonModal"
      :bot_id="bot_id" :user_id="user_id" @closed="buttons = !buttons" />

    <div v-if="showAddTextModal" class="overlay high-index"></div>

    <AddTextModal v-if="showAddTextModal" :showAddTextModal="showAddTextModal" @close="closeTextModal"
      @closed="getTexts = !getTexts" :bot_id="bot_id" :user_id="user_id" />

    <div v-if="showLocalesModal" class="overlay"></div>

    <LocalesModal v-if="showLocalesModal" @close="closeLocaleModal" @closed="rerender" :bot_id="bot_id"
      :user_id="user_id" />

  </div>
</template>

<script>
import Vue from 'vue'
import Drawflow from 'drawflow'
import ContextMenu from './components/menus/ContextMenu.vue'
import ConfirmationModal from './components/modals/ConfirmationModal.vue'
import Toast from './components/notifications/Toast.vue'
import InputModal from './components/modals/InputModal.vue'
import axios from "axios";
import './assets/main.css'
import AddButtonModal from './components/modals/AddButtonModal.vue'
import StageButtonModal from './components/modals/StageButtonModal.vue'
import AddTextModal from './components/modals/AddTextModal.vue'
import LocalesModal from './components/modals/LocalesModal.vue'
import LocalesContextMenu from './components/menus/LocalesContextMenu.vue'

export default {
  name: 'App',
  components: {
    ContextMenu,
    ConfirmationModal,
    Toast,
    InputModal,
    AddButtonModal,
    StageButtonModal,
    AddTextModal,
    LocalesContextMenu,
    LocalesModal
  },
  data() {
    return {
      showButtons: false,
      editor: null,
      showContextMenu: false,
      showModal: false,
      showInputModal: false,
      showAddButtonModal: false,
      showAddTextModal: false,
      showStageButtonModal: false,
      showLocalesModal: false,
      contextMenuPosition: { x: 0, y: 0 },
      selectedNode: null,
      showToast: false,
      isSuccessful: false,
      toastMessage: '',
      addMode: true,
      data: [],
      inputValues: {},
      x_: null,
      y_: null,
      dragOffset: { x: 0, y: 0 },
      url: 'http://10.20.11.24:8080/api/',
      stageButtonId: null,
      getTexts: true,
      buttons: true,
      bot_id: null,
      user_id: null
    }
  },

  async created() {
    await this.getStages()
  },

  async mounted() {
    const url = new URLSearchParams(window.location.search);
    this.bot_id = url.get('bot_id');
    this.user_id = url.get('user_id');
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

    this.editor.zoom_out()

    this.editor.on('nodeMoved', (node) => {
      const nodeData = this.editor.getNodeFromId(node);
      const editData = {
        id: nodeData.id,
        x_: nodeData.pos_x,
        y_: nodeData.pos_y,
      }

      this.updatePosition(editData)
    });

    window.addEventListener('click', () => {
      this.showContextMenu = false;
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.showContextMenu) {
          this.showContextMenu = false;
        } else if (this.showLocalesModal) {
          this.showLocalesModal = false;
        } else if (this.showAddButtonModal) {
          this.showAddButtonModal = false;
        } else if (this.showAddTextModal) {
          this.showAddTextModal = false;
        } else if (this.showStageButtonModal) {
          this.showStageButtonModal = false;
        } else if (this.showInputModal) {
          this.showInputModal = false;
        } else if (this.showModal) {
          this.showModal = false;
        }
      }
    });
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  },

  methods: {
    zoomIn() {
      this.editor.zoom_in()
    },

    zoomOut() {
      this.editor.zoom_out()
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

    async rerender() {

      if (!this.data.length) {
        await this.getStages()
      }

      this.editor.import(this.data);
    },

    drag(ev) {
      ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));

      const rect = ev.target.getBoundingClientRect();
      this.dragOffset.x = ev.clientX - rect.left;
      this.dragOffset.y = ev.clientY - rect.top;
    },

    drop(ev) {
      ev.preventDefault();
      this.x_ = ev.clientX - this.dragOffset.x;
      this.y_ = ev.clientY - this.dragOffset.y;
      this.openInputModal('adding')
    },

    allowDrop(ev) {
      ev.preventDefault();
    },

    async openStageButtonModal(id) {
      this.stageButtonId = id;
      this.showStageButtonModal = true;
    },

    async updatePosition(nodeData) {
      try {
        await axios.post(`${this.url}tg/bot/stage/update`, nodeData);
        await this.rerender()
      } catch (error) {
        console.error(`Error updating node: ${error}`);
        throw error;
      }
    },

    async getStages() {
      try {
        const response = await axios.get(`${this.url}v1/bot/stage/list?bot_id=${this.bot_id}`);
        const apiData = response.data.data;
        this.data = await this.transformApiData(apiData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    },

    async transformApiData(apiData) {
      const locales = await axios.get(`${this.url}tg/bot/flow/locales?bot_id=${this.bot_id}`);
      let locale = ''
      if (locales.data.data.length) {
        for (let item of locales.data.data) {
          locale += item.locale + ','
        }

        if (locale.at(-1) === ',') {
          locale = locale.slice(0, -1)
        }
      } else {
        locale = 'no locales'
      }

      const transformedData = {
        drawflow: {
          Home: {
            data: {
              "1": {
                "id": 1,
                "name": "Node 1",
                "data": {},
                "class": "nodeOne",
                "html": `<div class="card-devices center"><span>/start</span></div>`,
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
                "pos_x": 0,
                "pos_y": 250
              },
              "2": {
                "id": 2,
                "name": "Node 2",
                "data": {},
                "class": "nodeTwo",
                "html": `<div class="card-devices center"><span></span></div>`,
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
                "pos_x": 240,
                "pos_y": 250
              },
            }
          }
        }
      };

      transformedData.drawflow.Home.data['2'].html = `<div class="card-devices center"><span>${locale}</span></div>`;

      if (apiData && apiData.length) {
        apiData.forEach((item, index) => {
          transformedData.drawflow.Home.data[`${item.id}`] = {
            id: item.id,
            name: `Node ${item.id}`,
            data: {},
            class: `node${item.id}`,
            html: `<div class="card-devices"><span>${item.alias}</span><p class="corner">${item.id}</p></div>`,
            typenode: false,
            inputs: {},
            outputs: {},
            pos_x: item.x_,
            pos_y: item.y_
          };
        });

        const lowestOrderNode = apiData.reduce((prev, current) => {
          return (prev.stage_order < current.stage_order) ? prev : current
        });
        const firstDynamicNode = transformedData.drawflow.Home.data[lowestOrderNode.id];

        const secondStaticNode = transformedData.drawflow.Home.data['2'];
        if (firstDynamicNode && secondStaticNode) {
          secondStaticNode.outputs = {
            output_1: {
              connections: [
                {
                  node: firstDynamicNode.id,
                  output: 'input_1'
                }
              ]
            }
          };
          firstDynamicNode.inputs = {
            input_1: {
              connections: [
                {
                  node: '2',
                  input: 'output_1'
                }
              ]
            }
          };
        }
      }

      const response = await axios.get(`${this.url}tg/bot/stage/connections?bot_id=${this.bot_id}`);

      const connections = [...response.data.data.btns, ...response.data.data.states];
      if (connections) {
        connections.forEach((connection) => {
          if (transformedData.drawflow.Home.data[connection.output_]) {
            if (!transformedData.drawflow.Home.data[connection.output_].outputs) {
              transformedData.drawflow.Home.data[connection.output_].outputs = {};
            }
            if (!transformedData.drawflow.Home.data[connection.output_].outputs.output_1) {
              transformedData.drawflow.Home.data[connection.output_].outputs.output_1 = { connections: [] };
            }
            transformedData.drawflow.Home.data[connection.output_].outputs.output_1.connections.push({
              node: connection.input_,
              output: 'input_1'
            });
          }
          if (transformedData.drawflow.Home.data[connection.input_]) {
            if (!transformedData.drawflow.Home.data[connection.input_].inputs) {
              transformedData.drawflow.Home.data[connection.input_].inputs = {};
            }
            if (!transformedData.drawflow.Home.data[connection.input_].inputs.input_1) {
              transformedData.drawflow.Home.data[connection.input_].inputs.input_1 = { connections: [] };
            }
            transformedData.drawflow.Home.data[connection.input_].inputs.input_1.connections.push({
              node: connection.output_,
              input: 'output_1'
            });
          }
        });
      }

      return transformedData
    },

    async getNode(id) {
      try {
        const response = await axios.get(`${this.url}v1/bot/stage?id=${id}`);
        const apiData = response.data.data.stage;
        this.inputValues = {
          alias: apiData.alias,
          btn_sizes: apiData.btn_sizes,
          btn_type: apiData.btn_type,
          condition: apiData.condition,
          id: apiData.id,
          stage_order: apiData.stage_order,
          text_id: apiData.text_id,
          url_id: apiData.url_id,
          user_state: apiData.user_state,
          back_stage_btn_id: apiData.back_stage_btn_id,
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    },

    save(nodeData) {
      const otherData = {
        urls: nodeData.urls,
        callback_url: nodeData.callback_url
      }

      if (this.addMode) {
        const createData = {
          alias: nodeData.alias,
          stage_order: nodeData.stage_order,
          bot_id: nodeData.bot_id,
          text_id: nodeData.text_id,
          user_state: nodeData.user_state,
          condition: nodeData.condition,
          created_by: nodeData.created_by,
          btn_type: nodeData.btn_type,
          btn_sizes: nodeData.btn_sizes,
          x_: this.x_,
          y_: this.y_,
          backhand: nodeData.backhand,
          backhand_id: nodeData.backhand_id,
          stage_id: nodeData.stage_id,
          url_id: nodeData.url_id
        }

        const data = {}
        this.create(createData)
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
        const editData = {
          id: nodeData.id,
          alias: nodeData.alias,
          stage_order: nodeData.stage_order,
          text_id: nodeData.text_id,
          user_state: nodeData.user_state,
          condition: nodeData.condition,
          updated_by: nodeData.updated_by,
          btn_type: nodeData.btn_type,
          btn_sizes: nodeData.btn_sizes,
          state: nodeData.state,
          url_id: nodeData.url_id
        }

        this.updateNode(editData)
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

    async create(createData) {
      try {
        const response = await axios.post(`${this.url}tg/bot/stage/create`, createData);
        await axios.put(`${this.url}tg/bot/stage/update/callback_url`, { stage_id: response.data.data.insert.id, url_id: createData.url_id })

        if (createData.backhand) {
          if (createData.backhand == 'user_state') {
            const sendData = {
              id: createData.stage_id,
              stage_id: response.data.data.insert.id,
              type: 's'
            };
            await axios.post(`${this.url}tg/bot/stage/back/hand/create`, sendData);
          } else {
            const sendData = {
              id: createData.backhand_id,
              stage_id: response.data.data.insert.id,
              type: 'b'
            };
            await axios.post(`${this.url}tg/bot/stage/back/hand/create`, sendData);
          }
        }

        await this.rerender()
      } catch (error) {
        console.error(`Error creating node: ${error}`);
        throw error;
      } finally {
        this.addMode = false;
      }
    },

    async updateNode(nodeData, otherData) {
      try {
        let nodeId = this.selectedNode;
        let node = this.editor.getNodeFromId(nodeId);


        await axios.post(`${this.url}tg/bot/stage/update`, nodeData);

        // if (otherData.callback_url && !otherData.urls.find(item => item.url == otherData.callback_url)) {
        //   if (otherData.callback_url.startsWith('https://')) {
        //     await axios.post(`${this.url}tg/bot/callback/url/create`, {
        //       url: otherData.callback_url,
        //       user_id: 1
        //     })
        //   }
        // }
        await axios.put(`${this.url}tg/bot/stage/update/callback_url`, { stage_id: nodeData.id, url_id: nodeData.url_id })


        let contentElement = document.querySelector(`#node-${nodeId} .card-devices`);
        if (node && contentElement) {
          let newHtml = `<span class="content">${nodeData.alias}</span>`;
          this.editor.drawflow.drawflow.Home.data[nodeId].html = newHtml;
          contentElement.innerHTML = newHtml;
        }

        await this.rerender()

      } catch (error) {
        console.error(`Error updating node: ${error}`);
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
        await axios.delete(`${this.url}tg/bot/stage/delete?id=${id}`);
        this.editor.removeNodeId(`node-${id}`)
        await this.rerender()
      } catch (error) {
        console.error(`Error deleting node: ${error}`);
        throw error;
      } finally {
        this.selectedNode = null
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

    async openLocaleModal() {
      this.showContextMenu = false;
      this.showLocalesModal = true;
    },

    closeInputModal() {
      this.showInputModal = false;
    },

    closeAddButtonModal() {
      this.showAddButtonModal = false;
    },

    closeTextModal() {
      this.showAddTextModal = false;
    },

    closeLocaleModal() {
      this.showLocalesModal = false;
    },

    closeStageButtonModal() {
      this.showStageButtonModal = false;
    },

    openConfirmationModal() {
      this.showModal = true;
      this.showContextMenu = false
    },

    closeConfirmationModal() {
      this.showModal = false;
    },

    showSuccessToast() {
      this.toastMessage = 'Operation suceeded!';
      this.isSuccessful = true;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    },

    showFailedToast(error) {
      this.toastMessage = 'Oops! Something went wrong.';
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
@import './assets/app.css';
</style>
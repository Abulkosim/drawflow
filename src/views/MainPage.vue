<template>
  <div>
    <div id="drawflow" @drop="drop($event)" @dragover="allowDrop($event)">
      <BotName v-if="bot_name" :bot_name="bot_name" :link="link" />
      <div class="card-devices node-drag" draggable="true" @dragstart="drag($event)">
        <PlusIcon />
        <span>Create</span>
      </div>

      <transition name="fade">
        <TipMenu @close="closeTipMenu" v-if="showTipMenu" />
      </transition>
      <transition name="fade">
        <TipDrag @close="closeTipDrag" v-if="showTipDrag" :showTipMenu="showTipMenu" />
      </transition>
      <transition name="fade">
        <TipEdit @close="closeTipEdit" v-if="showTipEdit" :showTipMenu="showTipMenu" :showTipDrag="showTipDrag" />
      </transition>
    </div>

    <ContextMenu :position="contextMenuPosition" :showMenu="showContextMenu" @deleteNode="openConfirmationModal"
      @editNode="openInputModal" :node="selectedNode" />

    <LocalesContextMenu :position="contextMenuPosition" :showMenu="showContextMenu" @editNode="openLocaleModal"
      :node="selectedNode" />

    <div v-if="showModal" class="overlay"></div>

    <ConfirmationModal :showModal="showModal" @close="closeConfirmationModal" @confirm="confirmDeletion" />

    <Toast :success="isSuccessful" :show="showToast" :msg="toastMessage" />

    <div v-if="showInputModal && !showStageButtonModal && !showAddButtonModal && !showAddTextModal" class="overlay"></div>

    <InputModal v-if="showInputModal" :showModal="showInputModal" :addMode="addMode" :inputValues="inputValues"
      :bot_id="bot_id" :user_id="user_id" :getTexts="getTexts" :getCallbacks="getCallbacks" :updateTable="updateTable"
      :showStageButtonModal="showStageButtonModal" @close="closeInputModal" @save="save"
      @openStageButtonModal="openStageButtonModal" @create="showAddTextModal = true" @createURL="showURLModal = true" />

    <div v-if="showStageButtonModal && !showAddButtonModal" class="overlay"></div>

    <StageButtonModal v-if="showStageButtonModal" :showStageButtonModal="showStageButtonModal" :inputValues="inputValues"
      :bot_id="bot_id" :user_id="user_id" :buttons="buttons" :stageButtonId="stageButtonId" @close="closeStageButtonModal"
      @updateTable="updateTable = !updateTable" @create="showAddButtonModal = true" />

    <div v-if="showAddButtonModal" class="overlay high-index"></div>

    <AddButtonModal v-if="showAddButtonModal" :showAddButtonModal="showAddButtonModal" @close="closeAddButtonModal"
      :bot_id="bot_id" :user_id="user_id" @closed="buttons = !buttons" />

    <div v-if="showAddTextModal || showURLModal" class="overlay high-index"></div>

    <URLModal v-if="showURLModal" :showURLModal="showURLModal" @close="closeURLModal"
      @closed="getCallbacks = !getCallbacks" :bot_id="bot_id" :user_id="user_id" />


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
import ContextMenu from '../components/menus/ContextMenu.vue'
import ConfirmationModal from '../components/modals/ConfirmationModal.vue'
import Toast from '../components/notifications/Toast.vue'
import InputModal from '../components/modals/InputModal.vue'
import TipMenu from '../components/menus/TipMenu.vue'
import '../assets/main.css'
import AddButtonModal from '../components/modals/AddButtonModal.vue'
import StageButtonModal from '../components/modals/StageButtonModal.vue'
import AddTextModal from '../components/modals/AddTextModal.vue'
import URLModal from '../components/modals/URLModal.vue'
import LocalesModal from '../components/modals/LocalesModal.vue'
import LocalesContextMenu from '../components/menus/LocalesContextMenu.vue'
import TipDrag from '../components/menus/TipDrag.vue'
import TipEdit from '../components/menus/TipEdit.vue'
import BotName from '../components/menus/BotName.vue'
import PlusIcon from '../components/icons/PlusIcon.vue'

import transformationMixin from '../mixins/transformationMixin'

import { updatePos, fetchStages, deleteStage, updateStage, updateCallback, fetchStage, fetchConnections, fetchBotLocales, createStage, createBack } from '../api/api.drawflow'

export default {
  name: 'App',
  mixins: [transformationMixin],
  components: {
    ContextMenu,
    ConfirmationModal,
    Toast,
    InputModal,
    AddButtonModal,
    StageButtonModal,
    AddTextModal,
    LocalesContextMenu,
    LocalesModal,
    TipMenu,
    TipDrag,
    TipEdit,
    URLModal,
    BotName,
    PlusIcon
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
      showURLModal: false,
      showTipMenu: true,
      showTipDrag: true,
      showTipEdit: true,
      contextMenuPosition: { x: 0, y: 0 },
      selectedNode: null,
      showToast: false,
      isSuccessful: false,
      toastMessage: '',
      addMode: true,
      updateTable: false,
      data: [],
      inputValues: {},
      x_: null,
      y_: null,
      dragOffset: { x: 0, y: 0 },
      stageButtonId: null,
      getTexts: true,
      getCallbacks: true,
      buttons: true,
      bot_id: null,
      user_id: null,
      bot_name: null,
      link: null
    }
  },

  async mounted() {
    const url = new URLSearchParams(window.location.search);
    this.bot_id = url.get('bot_id');
    if (!this.bot_id) {
      this.$router.push('/error');
    }
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
        } else if (this.showURLModal) {
          this.showURLModal = false;
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
    closeModal() {
      this.showModal = false;
    },

    closeTipMenu() {
      this.showTipMenu = false;
    },

    closeTipDrag() {
      this.showTipDrag = false;
    },

    closeTipEdit() {
      this.showTipEdit = false;
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
      await updatePos(nodeData)
      await this.rerender()
    },

    async getStages() {
      const apiData = await fetchStages(this.bot_id);
      this.bot_name = apiData[0].bot_name;
      this.link = apiData[0].link;

      const [locales, nodeConnections] = await Promise.all([
        fetchBotLocales(this.bot_id),
        fetchConnections(this.bot_id)
      ]);

      this.data = this.transformApiData(apiData, locales, nodeConnections);
    },

    async getNode(id) {
      try {
        const apiData = await fetchStage(id)
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
        const response = await createStage(createData)

        await updateCallback({ stage_id: response.data.data.insert.id, url_id: createData.url_id })

        if (createData.backhand) {
          if (createData.backhand == 'user_state') {
            const sendData = {
              id: createData.stage_id,
              stage_id: response.data.data.insert.id,
              type: 's'
            };
            await createBack(sendData)
          } else {
            const sendData = {
              id: createData.backhand_id,
              stage_id: response.data.data.insert.id,
              type: 'b'
            };
            await createBack(sendData)
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


        await updateStage(nodeData)
        await updateCallback({ stage_id: nodeData.id, url_id: nodeData.url_id })


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
        await deleteStage(id)
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

    closeURLModal() {
      this.showURLModal = false;
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
  },
}
</script>

<style>
@import '../assets/app.css';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
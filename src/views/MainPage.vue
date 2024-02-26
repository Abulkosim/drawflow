<template>
  <div>
    <div id="drawflow" @drop="dropped" @dragover="allowDrop($event)">
      <BotName v-if="bot_name" :bot_name="bot_name" :link="link" />
      <div class="card-devices node-drag" draggable="true" @dragstart="drag($event)">
        <PlusIcon />
        <span>Create</span>
      </div>

      <TipOverlay :showTipMenu="x.showTipMenu" :showTipDrag="x.showTipDrag" :showTipEdit="x.showTipEdit"
        @close="closeModal" />
    </div>

    <ContextMenu :position="contextMenuPosition" :showMenu="showContextMenu" @deleteNode="openConfirmationModal"
      @editNode="openInputModal" :node="selectedNode" />

    <LocalesContextMenu :position="contextMenuPosition" :showMenu="showContextMenu" @editNode="openLocaleModal"
      :node="selectedNode" />

    <div v-if="x.showModal" class="overlay"></div>

    <ConfirmationModal :showModal="x.showModal" @close="closeModal('showModal')" @confirm="confirmDeletion" />

    <Toast :success="isSuccessful" :show="showToast" :msg="toastMessage" />

    <div v-if="x.showInputModal && !x.showStageButtonModal && !x.showAddButtonModal && !x.showAddTextModal"
      class="overlay"></div>

    <InputModal v-if="x.showInputModal" :showModal="x.showInputModal" :addMode="addMode" :inputValues="inputValues"
      :bot_id="bot_id" :user_id="user_id" :getTexts="getTexts" :getCallbacks="getCallbacks" :updateTable="updateTable"
      :showStageButtonModal="x.showStageButtonModal" @close="closeModal('showInputModal')" @save="save"
      @openStageButtonModal="openStageButtonModal" @create="x.showAddTextModal = true"
      @createURL="x.showURLModal = true" />

    <div v-if="x.showStageButtonModal && !x.showAddButtonModal" class="overlay"></div>

    <StageButtonModal v-if="x.showStageButtonModal" :showStageButtonModal="x.showStageButtonModal"
      :inputValues="inputValues" :bot_id="bot_id" :user_id="user_id" :buttons="buttons" :stageButtonId="stageButtonId"
      @close="closeModal('showStageButtonModal')" @updateTable="updateTable = !updateTable"
      @create="x.showAddButtonModal = true" />

    <div v-if="x.showAddButtonModal" class="overlay high-index"></div>

    <AddButtonModal v-if="x.showAddButtonModal" :showAddButtonModal="x.showAddButtonModal"
      @close="closeModal('showAddButtonModal')" :bot_id="bot_id" :user_id="user_id" @closed="buttons = !buttons" />

    <div v-if="x.showAddTextModal || x.showURLModal" class="overlay high-index"></div>

    <URLModal v-if="x.showURLModal" :showURLModal="x.showURLModal" @close="closeModal('showURLModal')"
      @closed="getCallbacks = !getCallbacks" :bot_id="bot_id" :user_id="user_id" />


    <AddTextModal v-if="x.showAddTextModal" :showAddTextModal="x.showAddTextModal" @close="closeModal('showAddTextModal')"
      @closed="getTexts = !getTexts" :bot_id="bot_id" :user_id="user_id" />

    <div v-if="x.showLocalesModal" class="overlay"></div>

    <LocalesModal v-if="x.showLocalesModal" @close="closeModal('showLocalesModal')" @closed="rerender" :bot_id="bot_id"
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
import TipOverlay from '../components/elements/TipOverlay.vue';

import transformationMixin from '../mixins/transformationMixin'
import dragDropMixin from '../mixins/dragDropMixin';


import { updatePos, fetchStages, fetchBotInfo, deleteStage, updateStage, updateCallback, fetchStage, fetchConnections, fetchBotLocales, createStage, createBack } from '../api/api.drawflow'

export default {
  name: 'App',
  mixins: [transformationMixin, dragDropMixin],
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
    PlusIcon,
    TipOverlay
  },
  data() {
    return {
      showButtons: false,
      editor: null,
      showContextMenu: false,
      x: {
        showModal: false,
        showInputModal: false,
        showAddButtonModal: false,
        showAddTextModal: false,
        showStageButtonModal: false,
        showLocalesModal: false,
        showURLModal: false,
        showTipMenu: true,
        showTipDrag: true,
        showTipEdit: true
      },
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
        } else if (this.x.showLocalesModal) {
          this.x.showLocalesModal = false;
        } else if (this.x.showAddButtonModal) {
          this.x.showAddButtonModal = false;
        } else if (this.x.showAddTextModal) {
          this.x.showAddTextModal = false;
        } else if (this.x.showURLModal) {
          this.x.showURLModal = false;
        } else if (this.x.showStageButtonModal) {
          this.x.showStageButtonModal = false;
        } else if (this.x.showInputModal) {
          this.x.showInputModal = false;
        } else if (this.x.showModal) {
          this.x.showModal = false;
        }
      }
    });

  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  },

  methods: {
    dropped(event) {
      event.preventDefault();
      this.x_ = event.clientX - this.dragOffset.x;
      this.y_ = event.clientY - this.dragOffset.y;
      this.openInputModal('adding')
    },

    async openStageButtonModal(id) {
      this.stageButtonId = id;
      this.x.showStageButtonModal = true;
    },

    async updatePosition(nodeData) {
      await updatePos(nodeData)
      await this.rerender()
    },

    async getStages() {
      const apiData = await fetchStages(this.bot_id);
      const botInfo = await fetchBotInfo(this.bot_id);
      this.bot_name = botInfo.name;
      this.link = botInfo.link;

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
        this.create(createData)
          .then(() => {
            this.showSuccessToast()
          })
          .catch((error) => {
            this.showFailedToast(error)
          })
          .finally(() => {
            this.closeModal('showInputModal');
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
            this.closeModal('showInputModal');
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

    async updateNode(nodeData) {
      await updateStage(nodeData)
      await updateCallback({ stage_id: nodeData.id, url_id: nodeData.url_id })
      await this.rerender()
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
            this.closeModal('showModal');
          });
      }
    },

    async deleteNode(id) {
      await deleteStage(id)
      await this.rerender()
      this.selectedNode = null
    },

    async openInputModal(info) {
      this.showContextMenu = false;
      this.addMode = info === 'adding';

      if (!this.addMode && this.selectedNode) {
        await this.getNode(this.selectedNode)
      } else {
        this.inputValues = {};
      }

      this.x.showInputModal = true;
    },

    async openLocaleModal() {
      this.showContextMenu = false;
      this.x.showLocalesModal = true;
    },

    openModal(modalName) {
      this.x[modalName] = true;
    },

    closeModal(modalName) {
      this.x[modalName] = false;
    },

    openConfirmationModal() {
      this.x.showModal = true;
      this.x.showContextMenu = false
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
</style>
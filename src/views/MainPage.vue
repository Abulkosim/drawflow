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
import APIModal from '../components/modals/APIModal.vue'
import LocalesModal from '../components/modals/LocalesModal.vue'
import LocalesContextMenu from '../components/menus/LocalesContextMenu.vue'
import TipDrag from '../components/menus/TipDrag.vue'
import TipEdit from '../components/menus/TipEdit.vue'
import BotName from '../components/menus/BotName.vue'
import PlusIcon from '../components/icons/PlusIcon.vue'
import TipOverlay from '../components/elements/TipOverlay.vue';
import QAIcon from '../components/icons/QAIcon.vue'
import transformationMixin from '../mixins/transformationMixin'
import dragDropMixin from '../mixins/dragDropMixin';
import mainPageMixin from '../mixins/mainPageMixin';
import { updatePos, fetchStages, fetchBotInfo, deleteStage, updateStage, updateCallback, fetchStage, fetchConnections, fetchBotLocales, createStage, createBack, checkStage } from '../api/api.drawflow'
import '../assets/app.css';

export default {
  name: 'App',
  mixins: [transformationMixin, dragDropMixin, mainPageMixin],
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
    APIModal,
    BotName,
    PlusIcon,
    TipOverlay,
    QAIcon
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
    this.editor.zoom_out()

    this.editor.on('nodeSelected', (node) => {
      this.selectedNode = node;
    });

    document.addEventListener('click', this.handleClickOutside);


    this.editor.on('nodeMoved', (node) => {
      const nodeData = this.editor.getNodeFromId(node);
      const editData = {
        id: nodeData.id,
        x_: nodeData.pos_x,
        y_: nodeData.pos_y,
      }
      this.updatePosition(editData)
    });
  },

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  methods: {
    async openStageButtonModal(id) {
      this.stageButtonId = id;
      this.x.showStageButtonModal = true;
    },

    async updatePosition(nodeData) {
      await updatePos(nodeData)
      await this.rerender()
    },

    getLink(link) {
      this.apiLink = link;
    },

    handleClickOutside() {
      this.isOpened = false;
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

    async save(nodeData) {
      if (this.addMode) {
        const checkData = {
          alias: nodeData.alias,
          bot_id: nodeData.bot_id,
        }
        const response = await checkStage(checkData)
        if (response.data.data) {
          this.showFailedToast()
          return;
        }

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

        const sendData = {
          stage_id: response.data.data.insert.id,
          type: '',
          id: ''
        };

        if (createData.backhand) {
          sendData.type = createData.backhand == 'user_state' ? 's' : 'b';
          sendData.id = createData.backhand == 'user_state' ? createData.stage_id : createData.backhand_id;

          await createBack(sendData)
        }

        await this.rerender()
      } catch (error) {
        console.error(`Error creating node: ${error}`);
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
      try {
        await deleteStage(id)
      } catch (error) {
        console.error(`Error deleting node: ${error}`);
      }
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

    async rerender() {
      if (!this.data.length) {
        await this.getStages()
      }
      this.editor.import(this.data);
    },
  },
}
</script>
<template>
  <div>
    <div id="drawflow" @drop="dropped" @dragover="allowDrop($event)">
      <BotName v-if="bot_name" :bot_name="bot_name" :link="link" />
      <div class="card-devices node-drag" draggable="true" @dragstart="drag($event)">
        <PlusIcon />
        <span>Create</span>
      </div>
      <div @click.prevent.stop="isOpened = !isOpened" v-if="!isOpened" class="question-mark">
        <div class="question-container">
          <QAIcon />
          <div class="animation-container">
            <span class="outer-span">
              <span class="inner-span"></span>
              <span class="dot"></span>
            </span>
          </div>
        </div>
      </div>
      <TipOverlay v-else :showTipMenu="x.showTipMenu" :showTipDrag="x.showTipDrag" :showTipEdit="x.showTipEdit"
        @close="closeModal" />
    </div>

    <ContextMenu :position="contextMenuPosition" :showMenu="showContextMenu" @deleteNode="openConfirmationModal"
      @editNode="openInputModal" :node="selectedNode" />

    <LocalesContextMenu :position="contextMenuPosition" :showMenu="showContextMenu" @editNode="openLocaleModal"
      :node="selectedNode" />

    <div v-if="x.showInputModal || x.showModal" class="overlay"></div>

    <transition name="fade">
      <ConfirmationModal :showModal="x.showModal" @close="closeModal('showModal')" @confirm="confirmDeletion" />
    </transition>

    <transition name="fade">
      <Toast :success="isSuccessful" :show="showToast" :msg="toastMessage" />
    </transition>

    <transition name="fade">
      <InputModal v-if="x.showInputModal" :showModal="x.showInputModal" :addMode="addMode" :inputValues="inputValues"
        :bot_id="bot_id" :user_id="user_id" :getTexts="getTexts" :getCallbacks="getCallbacks" :updateTable="updateTable"
        :showStageButtonModal="x.showStageButtonModal" @close="closeModal('showInputModal')" @save="save"
        @openStageButtonModal="openStageButtonModal" @create="x.showAddTextModal = true"
        @createURL="x.showURLModal = true" />
    </transition>

    <div v-if="x.showStageButtonModal && !x.showAddButtonModal" class="overlay"></div>

    <transition name="fade">
      <StageButtonModal v-if="x.showStageButtonModal" :showStageButtonModal="x.showStageButtonModal"
        :inputValues="inputValues" :bot_id="bot_id" :user_id="user_id" :buttons="buttons" :stageButtonId="stageButtonId"
        @close="closeModal('showStageButtonModal')" @updateTable="updateTable = !updateTable"
        @create="x.showAddButtonModal = true" @createAPI="x.showAPIModal = true" :apiLink="apiLink" />
    </transition>

    <div v-if="x.showAddButtonModal" class="overlay high-index"></div>

    <transition name="fade">
      <AddButtonModal v-if="x.showAddButtonModal" :showAddButtonModal="x.showAddButtonModal"
        @close="closeModal('showAddButtonModal')" :bot_id="bot_id" :user_id="user_id" @closed="buttons = !buttons" />
    </transition>

    <div v-if="x.showAddTextModal || x.showURLModal || x.showAPIModal" class="overlay high-index"></div>

    <transition name="fade">
      <URLModal v-if="x.showURLModal" :showURLModal="x.showURLModal" @close="closeModal('showURLModal')"
        @closed="getCallbacks = !getCallbacks" :bot_id="bot_id" :user_id="user_id" />
    </transition>

    <transition name="fade">
      <APIModal v-if="x.showAPIModal" :showAPIModal="x.showAPIModal" @close="closeModal('showAPIModal')"
        :bot_id="bot_id" :user_id="user_id" @closed="getLink" />
    </transition>

    <transition name="fade">
      <AddTextModal v-if="x.showAddTextModal" :showAddTextModal="x.showAddTextModal"
        @close="closeModal('showAddTextModal')" @closed="getTexts = !getTexts" :bot_id="bot_id" :user_id="user_id" />
    </transition>

    <div v-if="x.showLocalesModal" class="overlay"></div>

    <transition name="fade">
      <LocalesModal v-if="x.showLocalesModal" @close="closeModal('showLocalesModal')" @closed="rerender"
        :bot_id="bot_id" :user_id="user_id" />
    </transition>
  </div>
</template>
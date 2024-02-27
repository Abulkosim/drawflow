<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-heading">
          {{ heading }}
        </h3>

        <CloseButton @close="close" />

      </div>
      <ValidationObserver ref="observer" v-slot="{ invalid, validate }">
        <form class="form" @submit.prevent="validate().then(submit)">
          <div class="form-content">

            <div>
              <label for="button" class="label required">Button</label>
              <div class="buttons">
                <div class="select-wrapper">
                  <select id="button" class="input" required v-model="button_id">
                    <option v-for="button in btns" :key="button.id" :value="button.id">{{ button.name }}</option>
                  </select>
                </div>
                <button class="create-button" @click.stop.prevent="create" title="Create button">
                  <span>+</span>
                </button>
              </div>
            </div>

            <div>
              <label for="order" class="label required">Order</label>
              <div class="cont">
                <input type="number" name="order" id="order" class="input" autocomplete="off" v-model="btn_order">
                <div class="check">
                  <label for="is_web_app" class="label switch">
                    <input type="checkbox" name="is_web_app" id="is_web_app" class="checkbox" v-model="is_web_app">
                    <span class="slider round"></span>
                  </label>
                  <span class="is_web_app">Web app?</span>
                </div>
              </div>
              <span v-if="errors[0]" class="output">Required field!</span>
            </div>  

            <div class="state">
              <div class="state-type">
                <label for="back-type" class="label">Back type</label>
                <div class="select-wrapper">
                  <select id="back-type" class="input" v-model="backType" @change="backString = ''"
                    :disabled="is_web_app">
                    <option value="" disabled selected hidden></option>
                    <option value="next.">next.</option>
                    <option value="other">other</option>
                  </select>
                  <button class="clear-button" v-if="backType" @click.stop.prevent="clearBackType">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" aria-hidden="true" fill="none"
                      viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="state-string" v-if="backType != 'next.'">
                <label for="back-string" class="label">Back value</label>
                <input list="datalist" type="text" name="back-string" id="back-string" class="input" autocomplete="off"
                  v-model="backString" :disabled="backString == 'reply'">
              </div>

              <div class="state-string" v-if="backType == 'next.'">
                <label for="back-string" class="label">Back value</label>
                <select id="back-string" class="input" v-model="backString">
                  <option v-for="item in stages" :key="item.alias" :value="item.alias">{{ item.alias }}</option>
                </select>
              </div>
            </div>

            <div>
              <label for="back" class="label">Back</label>
              <input type="text" name="back" id="back" class="input" autocomplete="off" disabled :value="back">
            </div>

          </div>
          <div class="modal-save">
            <button class="submit-button">
              <SaveIcon />
              <span>Save</span>
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>
<script>
import { fetchStages, fetchURLs, fetchButtons, fetchInfo, fetchOrder, create, update } from '../../api/api.stagebutton'
import SaveIcon from "../icons/SaveIcon.vue";
import CloseButton from '../buttons/CloseButton.vue';

export default {
  props: ['showStageButtonModal', 'inputValues', 'stageButtonId', 'buttons', 'bot_id', 'user_id'],
  data() {
    return {
      heading: 'Add button to the stage',
      stage_id: this.inputValues.id ?? null,
      btns: [],
      is_web_app: false,
      button_id: '',
      btn_order: '',
      backType: '',
      backString: '',
      urls: [],
      stages: [],
      info: {},
    };
  },
  async created() {
    await this.getOrder();
    await this.getStages();
    await this.getUrls();
    await this.getButtons();
    if (this.stageButtonId) {
      await this.getInfo();
      this.heading = 'Edit button of the stage';
      this.stage_id = this.info.stage_id;
      this.button_id = this.info.button_id;
      this.btn_order = this.info.btn_order;
      this.is_web_app = this.info.is_web_app;
      this.back = this.info.back;
    }
    else {
      this.heading = 'Add button to the stage';
    }
  },
  methods: {
    clearBackType() {
      this.backType = '';
      this.backString = '';
    },
    close() {
      this.$emit('close');
    },
    create() {
      this.$emit('create');
    },
    async getStages() {
      this.stages = await fetchStages(this.bot_id);
    },
    async getUrls() {
      this.urls = await fetchURLs(this.user_id);
    },
    async getButtons() {
      if (this.stage_id) {
        this.btns = await fetchButtons(this.user_id);
      }
    },
    async getInfo() {
      this.info = await fetchInfo(this.stageButtonId);
    },
    async getOrder() {
      this.btn_order = await fetchOrder(this.stage_id);
    },
    async submit() {
      const stageButtonData = {
        stage_id: this.stage_id,
        button_id: this.button_id,
        btn_order: this.btn_order,
        is_web_app: this.is_web_app,
        back: this.back
      };
      if (this.stageButtonId) {
        await update(this.stageButtonId, stageButtonData);
        this.close();
      }
      else {
        await create(stageButtonData);
        this.close();
      }
      this.$emit('updateTable');
    }
  },
  computed: {
    back: {
      get() {
        if (this.backType != 'other') {
          if (this.backType == 'next.' && this.backString != '') {
            return this.backType + this.stages.find(item => item.alias == this.backString)?.id;
          }
          else if (this.backType == 'next.' && this.backString == '') {
            return this.backType;
          }
        }
        else {
          if (this.backString.trim() == '') {
            return null;
          }
          else {
            return this.backString;
          }
        }
      },
      set(newValue) {
        if (newValue) {
          if (newValue.startsWith('next.')) {
            this.backType = 'next.';
            this.backString = this.stages.find(item => item.id == newValue.slice(5))?.alias ?? '';
          }
          else {
            this.backType = 'other';
            this.backString = newValue;
          }
        }
      }
    }
  },
  watch: {
    is_web_app(newValue) {
      if (newValue) {
        if (this.backType == 'next.') {
          this.backString = '';
        }
        this.backType = 'other';
      }
      else {
        this.backType = '';
        this.backString = '';
      }
    },
    buttons(current) {
      this.getButtons();
    }
  },
  components: { SaveIcon, CloseButton }
}
</script>
<style scoped>
@import '../../assets/modal.css';
@import '../../assets/stage.button.css'
</style>
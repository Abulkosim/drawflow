<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-heading">
          {{ heading }}
        </h3>
        <button @click="close" type="button" class="modal-close" data-modal-toggle="crud-modal">
          <svg class="svg-close" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>

      </div>
      <ValidationObserver ref="observer" v-slot="{ invalid, validate }">
        <form class="form" @submit.prevent="validate().then(submit)">
          <div class="form-content">

            <div>
              <label for="button" class="label required">Button</label>
              <div class="buttons">
                <select id="button" class="input" required v-model="button_id">
                  <option v-for="button in btns" :key="button.id" :value="button.id">{{ button.name }}</option>
                </select>
                <button class="create-button" @click.stop.prevent="create" title="Create button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#2c3e50" viewBox="0 0 256 256">
                    <path
                      d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z">
                    </path>
                  </svg>
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
                  <span class="is_web_app">Is it a web app?</span>
                </div>
              </div>
              <span v-if="errors[0]" class="output">Required field!</span>
            </div>

            <div class="state">
              <div class="state-type">
                <label for="back-type" class="label">Back type</label>
                <select id="back-type" class="input" v-model="backType" @change="backString = ''" :disabled="is_web_app">
                  <option value="" disabled selected hidden></option>
                  <option value="next.">next.</option>
                  <option value="other">other</option>
                </select>
              </div>
              <div class="state-string" v-if="backType != 'next.'">
                <label for="back-string" class="label">Back string</label>
                <input list="datalist" type="text" name="back-string" id="back-string" class="input" autocomplete="off"
                  v-model="backString" :disabled="backString == 'reply'">
              </div>

              <div class="state-string" v-if="backType == 'next.'">
                <label for="back-string" class="label">Back string</label>
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
              Save
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>
<script>
import { get } from "ace-builds/src-noconflict/ace";
import axios from "axios";

export default {
  props: ['showStageButtonModal', 'inputValues', 'stageButtonId', 'buttons', 'bot_id', 'user_id'],
  data() {
    return {
      heading: 'Add button to the stage',
      url: 'http://10.20.11.24:8080/api/',
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
    }
  },

  async created() {
    await this.getOrder();
    await this.getStages()
    await this.getUrls()
    await this.getButtons();

    if (this.stageButtonId) {
      await this.getInfo()
      this.heading = 'Edit button of the stage'
      this.stage_id = this.info.stage_id;
      this.button_id = this.info.button_id;
      this.btn_order = this.info.btn_order;
      this.is_web_app = this.info.is_web_app;
      this.back = this.info.back;
    } else {
      this.heading = 'Add button to the stage'
    }
  },
  async mounted() { },
  methods: {
    close() {
      this.$emit('close')
    },
    submit() {
      this.close()
    },
    create() {
      this.$emit('create')
    },
    async getStages() {
      const response = await axios.get(`${this.url}v1/bot/stage/list?bot_id=${this.bot_id}`);
      this.stages = response.data.data;
    },

    async getUrls() {
      const response = await axios.get(`${this.url}tg/bot/user/callback_urls?user_id=${this.user_id}`)
      this.urls = response.data.data
    },

    async getButtons() {
      if (this.stage_id) {
        const response = await axios.get(`${this.url}tg/bot/user/buttons?user_id=${this.user_id}`);
        this.btns = response.data.data;
      }
    },

    async getInfo() {
      const response = await axios.get(`${this.url}tg/bot/stage/button?id=${this.stageButtonId}`);
      this.info = response.data.data;
    },

    async getOrder() {
      const response = await axios.get(`${this.url}tg/bot/stage/button/new/order?stage_id=${this.stage_id}`);
      this.btn_order = response.data.data;
    },

    async submit() {
      const stageButtonData = {
        stage_id: this.stage_id,
        button_id: this.button_id,
        btn_order: this.btn_order,
        is_web_app: this.is_web_app,
        back: this.back
      }
      if (this.stageButtonId) {
        await axios.post(`${this.url}tg/bot/stage/button/update?id=${this.stageButtonId}`, stageButtonData)
          .then((response) => {
            this.close()
          }, (error) => {
            console.log(error);
          });
        this.close()
      } else {
        await axios.post(`${this.url}tg/bot/stage/button/create`, stageButtonData)
          .then((response) => {
            this.close()
          }, (error) => {
            console.log(error);
          });
        this.close()
      }
    }
  },
  computed: {
    back: {
      get() {
        if (this.backType != 'other') {
          if (this.backType == 'next.' && this.backString != '') {
            return this.backType + this.stages.find(item => item.alias == this.backString)?.id
          }
        } else {
          return this.backString
        }
      },

      set(newValue) {
        if (newValue) {
          if (newValue.startsWith('next.')) {
            this.backType = 'next.'
            this.backString = this.stages.find(item => item.id == newValue.slice(5))?.alias ?? ''
          } else {
            this.backType = 'other'
            this.backString = newValue
          }
        }
      }
    }
  },
  watch: {
    is_web_app(newValue) {
      if (newValue) {
        this.backType = 'other'
      } else {
        this.backType = ''
        this.backString = ''
      }
    },
    buttons(current) {
      this.getButtons()
    }
  }
}
</script>
<style scoped>
@import '../../assets/modal.css';


.modal {
  max-width: 540px;
  max-height: calc(100% - 50px)
}

.modal-content {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.modal-header {
  @media (min-width: 768px) {
    padding: 1rem;
  }
}

.form {

  @media (min-width: 768px) {
    padding: 1rem;
  }
}

.form-content {
  gap: 0.5rem;
}

.modal-save {
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 1rem;
  }
}

.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.create-button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 39px;
  height: 39px;
  border: 2px solid lightgray;
  border-radius: 5px;
}

.label {
  display: inline;
}

.cont {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  user-select: none;
}

.cont input {
  width: 50%
}

.check {
  width: 1/2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  top: 3px;
}

.check .is_web_app {
  font-weight: 500;
  position: relative;
  top: -5px;
  font-size: 15px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
  display: flex;
  justify-content: space-between;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked+.slider {
  background-color: #2c3e50;
}

input:focus+.slider {
  box-shadow: 0 0 1px #2c3e50;
}

input:checked+.slider:before {
  -webkit-transform: translateX(18px);
  -ms-transform: translateX(18px);
  transform: translateX(18px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
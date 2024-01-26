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
                  <option v-for="button in buttons" :key="button.id" :value="button.id">{{ button.name }}</option>
                </select>
                <button class="create-button" @click.stop.prevent="create" title="Create button">
                  Create
                </button>
              </div>
            </div>


            <!-- <div>
              <ValidationProvider rules="required" v-slot="{ errors }">
                <div>
                  <label for="order" class="label required">Order</label>
                  <div class="cont">
                    <input type="number" name="order" id="order" class="input" autocomplete="off" v-model="btn_order">
                    <div class="check">
                      <input type="checkbox" name="is_web_app" id="is_web_app" class="checkbox" v-model="is_web_app">
                      <label for="is_web_app" class="label">is_web_app</label>
                    </div>
                  </div>
                  <span v-if="errors[0]" class="output">Required field!</span>
                </div>
              </ValidationProvider>
            </div> -->

            <div>
              <label for="order" class="label required">Order</label>
              <div class="cont">
                <input type="number" name="order" id="order" class="input" autocomplete="off" v-model="btn_order">
                <div class="check">
                  <input type="checkbox" name="is_web_app" id="is_web_app" class="checkbox" v-model="is_web_app">
                  <label for="is_web_app" class="label">is_web_app</label>
                </div>
              </div>
              <span v-if="errors[0]" class="output">Required field!</span>
            </div>


            <div class="state">
              <div class="state-type">
                <label for="back-type" class="label">Back type</label>
                <select id="back-type" class="input" v-model="backType" @change="backString = ''">
                  <option value="" disabled selected hidden></option>
                  <option value="next.">next.</option>
                  <option value="url.">url.</option>
                  <option value="other">other</option>
                </select>
              </div>
              <div class="state-string" v-if="backType != 'next.'">
                <label for="back-string" class="label">Back string</label>
                <input list="datalist" type="text" name="back-string" id="back-string" class="input" autocomplete="off"
                  v-model="backString" :disabled="backString == 'reply'">
                <datalist id="datalist" class="datalist" v-if="backType == 'url.'">
                  <option v-for="item in urls" :key="item.alias" :value="item.alias">{{ item.alias }}</option>
                </datalist>
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
import axios from "axios";

export default {
  props: ['showStageButtonModal', 'inputValues'],
  data() {
    return {
      heading: 'Add button to the stage',
      url: 'http://10.20.11.24:8080/api/',
      stage_id: this.inputValues.id ?? null,
      buttons: [],
      is_web_app: false,
      button_id: '',
      btn_order: '',
      backType: '',
      backString: '',
      urls: [],
      stages: [],
    }
  },
  async mounted() {
    await this.getUrls()
    await this.getStages()
    await this.getButtons();
  },
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
      const response = await axios.get(`${this.url}v1/bot/stage/list?bot_id=122`);
      this.stages = response.data.data;
    },

    async getUrls() {
      const response = await axios.get(`${this.url}tg/bot/user/callback_urls?user_id=1`)
      this.urls = response.data.data
    },

    async getButtons() {
      if (this.stage_id) {
        const response = await axios.get(`${this.url}tg/bot/user/buttons?user_id=1`);
        this.buttons = response.data.data;
      }
    },

    async submit() {
      const stageButtonData = {
        stage_id: this.stage_id,
        button_id: this.button_id,
        btn_order: this.btn_order,
        is_web_app: this.is_web_app,
        back: this.back
      }
      console.log(stageButtonData);
      await axios.post(`${this.url}tg/bot/stage/button/create`, stageButtonData)
        .then((response) => {
          console.log(response.data);

          this.close()
        }, (error) => {
          console.log(error);
        });
      this.close()
    }
  },
  computed: {
    back() {
      if (this.backType != 'other') {
        if (this.backType == 'next.' && this.backString != '') {
          return this.backType + this.stages.find(item => item.alias == this.backString)?.id
        } else {
          return this.backType + this.backString
        }
      } else {
        return this.backString
      }
    }
  }
}
</script>
<style scoped>
@import '../assets/modal.css';


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
  background-color: white;
  border: 2px solid lightgray;
  color: #2c3e50;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  height: 39px;
  border-radius: 0.25rem;
  cursor: pointer;
}

.label {
  display: inline;
}

.check {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.cont {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  user-select: none;
}
</style>
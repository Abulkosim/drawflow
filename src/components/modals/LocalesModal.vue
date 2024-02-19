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
      <ValidationObserver ref="observer" rules="required" v-slot="{ invalid, validate }">
        <form class="form" @submit.prevent="validate().then(submit)">
          <div class="form-content">

            <div v-for="locale in locales" class="check-container">
              <input type="checkbox" :name="locale.locale" :id="locale.id" class="checkbox" autocomplete="off"
                v-model="checked" :value="locale">
              <label :for="locale.id" class="label">{{ locale.name }}</label>
            </div>


          </div>
          <div class="modal-save">
            <button @click="submit" class="submit-button" :disabled="disabled">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#fff" viewBox="0 0 256 256">
                <path
                  d="M219.31,80,176,36.69A15.86,15.86,0,0,0,164.69,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V91.31A15.86,15.86,0,0,0,219.31,80ZM168,208H88V152h80Zm40,0H184V152a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v56H48V48H164.69L208,91.31ZM160,72a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h56A8,8,0,0,1,160,72Z">
                </path>
              </svg>
              <span>Save</span>
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
  props: ['bot_id', 'user_id'],
  data() {
    return {
      heading: 'Edit locales',
      names: {
        en: null,
        uz: null,
        ru: null,
        ўз: null,
        qq: null
      },
      locales: [],
      checked: [],
      url: 'https://bot-platon.platon.uz/services/platon-core/api/'
    }
  },
  computed: {
    disabled() {
      return this.checked.length === 0
    }
  },
  created() {
    this.getLocales()
    this.getBotLocales()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async getLocales() {
      await axios.get(`${this.url}tg/locales`)
        .then((response) => {
          this.locales = response.data.data
        }, (error) => {
          console.log(error);
        });
    },

    async getBotLocales() {
      const reponse = await axios.get(`${this.url}tg/bot/flow/locales?bot_id=${this.bot_id}`)
      this.checked = reponse.data.data
    },

    async submit() {
      const data = {
        bot_id: this.bot_id,
        // langs: "{'8', '9'}"
        langs: `{'${this.checked.map(item => item.id).join("', '")}'}`
      }

      await axios.post(`${this.url}tg/bot/locale/update`, data);
      this.$emit('closed')
      this.close();
    }
  }
}
</script>
<style scoped>
@import '../../assets/modal.css';

.modal {
  max-width: 420px;
  max-height: calc(100% - 80px);
  z-index: 101;
}

.modal-content {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.modal-header {
  @media (min-width: 768px) {
    padding: 1rem;
  }
}

.label {
  font-size: 16px;
  position: relative;
  top: 2px;
  color: #2e363e;
}

.check-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form {
  padding: 24px 16px
}

.checkbox {
  width: 20px;
  height: 20px;
  outline: none;
  cursor: pointer;
}

.submit-button:disabled {
  cursor: not-allowed;
  background-color: #2f3d4ba1;
}
</style>
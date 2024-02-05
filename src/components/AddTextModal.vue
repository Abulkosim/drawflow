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
              <ValidationProvider rules="required" v-slot="{ errors }">
                <div>
                  <label for="alias" class="label required">Alias</label>
                  <input type="text" name="alias" id="alias" class="input" v-model="alias" autocomplete="off">
                  <span v-if="errors[0]" class="output">Required field!</span>
                </div>
              </ValidationProvider>
            </div>

            <div v-for="locale in locales">
              <label :for="locale.id" class="label">{{ locale.name }}</label>
              <input type="text" :name="locale.locale" :id="locale.id" class="input" autocomplete="off"
                v-model="names[locale.locale]">
            </div>

          </div>
          <div class="modal-save">
            <button @click="submit" class="submit-button">
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
  props: ['showAddTextModal'],
  data() {
    return {
      heading: 'Create text',
      alias: '',
      names: {
        en: null,
        uz: null,
        ru: null,
        ўз: null,
        qq: null
      },
      locales: [],
      url: 'http://10.20.11.24:8080/api/'
    }
  },
  created() {
    this.getLocales()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async getLocales() {
      await axios.get(`${this.url}tg/bot/flow/locales?bot_id=122`)
        .then((response) => {
          this.locales = response.data.data
        }, (error) => { 
          console.log(error);
        });
    },
    async submit() {
      const data = {
        alias: this.alias,
        names: this.names,
        user_id: 1
      }

      for (let key in data.names) {
        if (data.names[key] === null) {
          delete data.names[key]
        }
      }

      await axios.post(`${this.url}tg/bot/text/create`, data);
      this.$emit('closed')
      this.close();
    }
  }
}
</script>
<style scoped>
@import '../assets/modal.css';

.modal {
  max-width: 480px;
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

.form {
  @media (min-width: 768px) {
    padding: 0.6rem 1rem;
  }
}

.form-content {
  gap: 0.5rem;
}

.modal-save {
  padding: 1rem;
}
</style>
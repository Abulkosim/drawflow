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
                  <label for="name" class="label required">Name</label>
                  <input type="text" name="alias" id="name" class="input" v-model="alias" autocomplete="off">
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
import http from "../../interceptors/http";

export default {
  props: ['showAddTextModal', 'bot_id', 'user_id'],
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
      await http.get(`tg/bot/flow/locales?bot_id=${this.bot_id}`)
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
        user_id: this.user_id
      }

      for (let key in data.names) {
        if (data.names[key] === null) {
          delete data.names[key]
        }
      }
      await http.post(`tg/bot/text/create`, data);
      this.$emit('closed')
      this.close();
    }
  }
}
</script>
<style scoped>
@import '../../assets/modal.css';

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
</style>
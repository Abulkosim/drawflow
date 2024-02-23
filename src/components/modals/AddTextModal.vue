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
import { fetchLocales, create } from '../../api/api.text'
import SaveIcon from "../icons/SaveIcon.vue";
import CloseButton from '../buttons/CloseButton.vue';

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
    };
  },
  created() {
    this.getLocales();
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async getLocales() {
      this.locales = await fetchLocales(this.bot_id);
    },
    async submit() {
      const data = {
        alias: this.alias,
        names: this.names,
        user_id: this.user_id
      };
      for (let key in data.names) {
        if (data.names[key] === null) {
          delete data.names[key];
        }
      }
      await create(data);
      this.$emit('closed');
      this.close();
    }
  },
  components: { SaveIcon, CloseButton }
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
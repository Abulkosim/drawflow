<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-heading">
          {{ heading }}
        </h3>

        <CloseButton @close="close" />

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
import { fetchLocales, fetchBotLocales, updateBotLocale } from "../../api/api.locales";
import SaveIcon from "../icons/SaveIcon.vue";
import CloseButton from "../buttons/CloseButton.vue";
import '../../assets/modal.css';
import '../../assets/locales.modal.css'

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
    };
  },
  computed: {
    disabled() {
      return this.checked.length === 0;
    }
  },
  created() {
    this.getLocales();
    this.getBotLocales();
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async getLocales() {
      this.locales = await fetchLocales();
    },
    async getBotLocales() {
      this.checked = await fetchBotLocales(this.bot_id);
    },
    async submit() {
      const data = {
        bot_id: this.bot_id,
        langs: `{'${this.checked.map(item => item.id).join("', '")}'}`
      };
      await updateBotLocale(data);
      this.$emit('closed');
      this.close();
    }
  },
  components: { SaveIcon, CloseButton }
}
</script>
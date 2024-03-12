<template>
  <div class="modal">
    <div class="modal-content">

      <div class="modal-header">
        <h3 class="modal-heading">
          {{ heading }}
        </h3>
        <CloseButton @close="close" />
        <div class="loading" v-if="loading"></div>
      </div>

      <ValidationObserver ref="observer" v-slot="{ invalid, validate }">
        <form class="form" @submit.prevent="validate().then(submit)">
          <div class="form-content">
            <div>
              <div>
                <label for="url" class="label required">Alias</label>
                <input type="text" name="url" id="url" class="input" v-model="url" autocomplete="off" required
                  placeholder="v1/tg/bot/api">
                <span v-if="errors[0]" class="output">Required field!</span>
              </div>
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
import { createTemplate } from "../../api/api.url";
import SaveIcon from "../icons/SaveIcon.vue";
import CloseButton from '../buttons/CloseButton.vue';

export default {
  props: ['showAPIModal', 'bot_id', 'user_id'],
  data() {
    return {
      heading: 'Create API',
      url: '',
      loading: false
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async submit() {
      this.loading = true;
      const alias = {
        alias: this.url
      }
      await createTemplate(alias);

      this.loading = false;

      const sentAlias = 'https://bot-platon.platon.uz/services/platon-core/api/' + this.url;

      this.$emit('closed', sentAlias);
      this.close();
    }
  },
  components: { SaveIcon, CloseButton }
}
</script>
<style scoped>
@import '../../assets/modal.css';
@import '../../assets/urlmodal.css';
</style>
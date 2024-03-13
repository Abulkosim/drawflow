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
              <div class="tabs">
                <button @click.stop.prevent="toggle = true" class="template"
                  :class="{ active: toggle }">Template</button>
                <button @click.stop.prevent="toggle = false" class="another-url" :class="{ active: !toggle }">Another
                  URL</button>
              </div>
              <div>
                <label for="url" class="label required">
                  <span v-if="!toggle">Callback URL</span>
                  <span v-if="toggle">Alias</span>
                </label>
                <div>
                  <input type="text" name="url" id="url" class="input" v-model="url" autocomplete="off" required
                    :placeholder="placeholder">
                </div>

                <span v-if="errors[0]" class="output">Required field!</span>
              </div>
            </div>

            <div>
              <label for="description" class="label">Description</label>
              <input type="text" name="description" id="description" class="input" v-model="description"
                autocomplete="off">
              <span v-if="errors[0]" class="output">Required field!</span>
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
import { createURL, createTemplate } from '../../api/api.url'
import SaveIcon from "../icons/SaveIcon.vue";
import CloseButton from '../buttons/CloseButton.vue';

export default {
  props: ['showURLModal', 'bot_id', 'user_id'],
  data() {
    return {
      heading: 'Create URL',
      url: '',
      description: '',
      toggle: true,
      loading: false
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async submit() {
      if (!this.toggle) {
        const data = {
          user_id: this.user_id,
          url: this.url,
          description: this.description
        };
        await createURL(data);
        this.$emit('closed');
        this.close();
      } else {
        this.loading = true;
        const alias = {
          alias: this.url
        }
        const response = await createTemplate(alias);

        this.loading = false;

        if (response.status === 200 && response.data.data.create_main_stage != null) {
          const data = {
            user_id: this.user_id,
            url: 'https://bot-platon.platon.uz/services/platon-core/api/' + this.url,
            description: this.description
          };
          await createURL(data);
          this.$emit('closed');
          this.close();
        }
      }
    }
  },
  computed: {
    placeholder() {
      return this.toggle ? 'v1/bot/test/api/' : '';
    }
  },
  components: { SaveIcon, CloseButton }
}
</script>
<style scoped>
@import '../../assets/modal.css';
@import '../../assets/urlmodal.css';
</style>
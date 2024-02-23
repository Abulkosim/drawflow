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
                  <label for="url" class="label required">Callback URL</label>
                  <input type="text" name="url" id="url" class="input" v-model="url" autocomplete="off">
                  <span v-if="errors[0]" class="output">Required field!</span>
                </div>
              </ValidationProvider>
            </div>

            <div>
              <label for="description" class="label">Description</label>
              <input type="text" name="description" id="description" class="input" v-model="description"
                autocomplete="off">
              <span v-if="errors[0]" class="output">Required field!</span>
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
import { createURL } from '../../api/api.url'
import SaveIcon from "../icons/SaveIcon.vue";
import CloseButton from '../buttons/CloseButton.vue';

export default {
  props: ['showURLModal', 'bot_id', 'user_id'],
  data() {
    return {
      heading: 'Create URL',
      url: '',
      description: '',
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async submit() {
      const data = {
        user_id: this.user_id,
        url: this.url,
        description: this.description
      };
      await createURL(data);
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
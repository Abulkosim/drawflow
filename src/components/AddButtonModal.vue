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


            <div>
              <label for="english" class="label">English</label>
              <input type="text" name="english" id="english" class="input" autocomplete="off" v-model="english">
            </div>
            <div>
              <label for="uzbek" class="label">O'zbekcha</label>
              <input type="text" name="uzbek" id="uzbek" class="input" autocomplete="off" v-model="uzbek">
            </div>
            <div>
              <label for="russian" class="label">Русский</label>
              <input type="text" name="russian" id="russian" class="input" autocomplete="off" v-model="russian">
            </div>

          </div>
          <div class="modal-save">
            <button type="submit" class="submit-button">
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
  props: ['showAddButtonModal'],
  data() {
    return {
      heading: 'Create button',
      alias: '',
      english: '',
      uzbek: '',
      russian: '',
      loading: false,

      url: 'http://10.20.11.24:8080/api/'
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    submit() {
      this.close()
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
</style>
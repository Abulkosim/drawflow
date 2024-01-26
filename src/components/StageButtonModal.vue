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
              <select id="button" class="input" required>
                <option value="view" selected>view</option>
              </select>
            </div>

            <div>
              <label for="button" class="label">is_web_app</label>
              <select id="button" class="input">
                <option value="yes">yes</option>
                <option value="no" selected>no</option>
              </select>
            </div>

            <div>
              <ValidationProvider rules="required" v-slot="{ errors }">
                <div>
                  <label for="order" class="label required">Order</label>
                  <input type="number" name="order" id="order" class="input" autocomplete="off">
                  <span v-if="errors[0]" class="output">Required field!</span>
                </div>
              </ValidationProvider>
            </div>

            <div class="state">
              <div class="state-type">
                <label for="back-type" class="label">Back type</label>
                <select id="back-type" class="input">
                  <option value="" disabled selected hidden></option>
                  <option value="next.">next.</option>
                  <option value="url.">url.</option>
                  <option value="other">other</option>
                </select>
              </div>
              <div class="state-string">
                <label for="back-string" class="label">Back string</label>
                <input list="datalist" type="text" name="back-string" id="back-string" class="input" autocomplete="off">
                <datalist id="datalist" class="datalist">
                  <option></option>
                </datalist>
              </div>
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
  props: ['showStageButtonModal'],
  data() {
    return {
      heading: 'Add button to the stage',
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
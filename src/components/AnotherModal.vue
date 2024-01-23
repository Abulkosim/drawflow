<script>
export default {
  data() {
    return {
      heading: 'Add button'
    }
  }
}
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-heading">
          {{ heading }}
        </h3>
        <button type="button" class="modal-close" data-modal-toggle="crud-modal">
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
                  <label for="buttons" class="label required">Buttons</label>
                  <input type="text" name="buttons" id="buttons" class="input" autocomplete="off">
                  <span v-if="errors[0]" class="output">Required field!</span>
                </div>
              </ValidationProvider> 
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

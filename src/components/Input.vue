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
      <form class="form">
        <div class="form-content">
          <div>
            <label for="alias" class="label">Alias</label>
            <input type="text" name="alias" id="alias" class="input" placeholder="stage 2" required>
          </div>
          <div>
            <label for="order" class="label">Order</label>
            <input type="number" name="order" id="order" class="input" placeholder="20" required>
          </div>
          <div>
            <label for="action" class="label">Action</label>
            <select v-model="selected" id="action" class="input">
              <option value="STAGE" selected>STAGE</option>
              <option value="URL">URL</option>
            </select>
          </div>
          <div v-if="selected == 'STAGE'">
            <label for="type" class="label">Button type</label>
            <select id="type" class="input">
              <option selected>INLINE</option>
              <option value="first">REPLY</option>
              <option value="second">CONTACT</option>
              <option value="third">LOCATION</option>
            </select>
          </div>
          <div v-if="selected == 'URL'">
            <label for="url" class="label">Callback URL</label>
            <select id="url" class="input">
              <option value="first"></option>
              <option value="first">FIRST</option>
              <option value="second">SECOND</option>
              <option value="third">THIRD</option>
              <option value="fourth">FOURTH</option>
            </select>
          </div>
          <div class="state" v-if="selected == 'STAGE'">
            <div class="state-type">
              <label for="state-type" class="label">State type</label>
              <select id="state-type" class="input">
                <option value="" selected></option>
                <option value="next">next.</option>
                <option value="url">url.</option>
                <option value="other">other</option>
              </select>
            </div>
            <div class="state-string">
              <label for="state-string" class="label">State string</label>
              <input type="text" name="state-string" id="state-string" class="input" placeholder="stage 2">
            </div>
          </div>

          <div v-if="selected == 'STAGE'">
            <label for="btn-size" class="label">btn_size</label>
            <input type="number" name="btn-size" id="btn-size" class="input" placeholder="3">
          </div>
          <div v-if="selected == 'STAGE'">
            <label for="condition" class="label">Condition</label>
            <textarea id="condition" rows="4" class="textarea" placeholder="Write the condition here"></textarea>
          </div>
          <div v-if="selected == 'STAGE'">
            <label for="cond-type" class="label">Condition Type</label>
            <select id="cond-type" class="input">
              <option value="" selected></option>
              <option value="update">update</option>
              <option value="input">input</option>
            </select>
          </div>
          <div v-if="selected == 'STAGE'">
            <label for="user" class="label">User State</label>
            <input type="text" name="user" id="user" class="input" placeholder="">
          </div>
        </div>
      </form>
      <div class="modal-save">
        <button @click="close" type="submit" class="submit-button">
          Save
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['showInputModal', 'adding'],
  data() {
    return {
      heading: 'Add stage',
      selected: 'STAGE'
    }
  },
  mounted() {
    document.querySelectorAll('input[required]').forEach(function (input) {
      var label = document.querySelector('label[for="' + input.id + '"]');
      if (label) {
        label.innerHTML += '<span class="required-star">*</span>';
      }
    });
    if (this.adding) {
      this.heading = 'Add stage'
    } else {
      this.heading = 'Edit stage'
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}

</script>
<style scoped>
.modal {
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 100;
  padding: 1rem;
  width: 100%;
  max-width: 640px;
  max-height: 100%;
  letter-spacing: 1px;
}

.modal-content {
  position: relative;
  border-radius: 0.5rem;
  background-color: #ffffff;
  width: 100%;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.modal-header {
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  border-bottom: 0.5px solid rgb(233, 233, 233);

  @media (min-width: 768px) {
    padding: 1.25rem;
  }
}

.modal-heading {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
}

.modal-close {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  width: 2rem;
  height: 2rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  background-color: transparent;
  cursor: pointer;
  border: none;
}

.modal-close:hover {
  color: #2c3e50c0;
  background-color: #E5E7EB;
}

.form {
  padding: 1rem;
  max-height: calc(100vh - 200px);
  overflow-y: scroll;

  @media (min-width: 768px) {
    padding: 1.25rem;
  }
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.state {
  display: flex;
  gap: 1rem;
}

.state-type {
  width: 200px;
}

.state-string {
  width: 100%;
}


select {
  color: #2c3e50;
}

.label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.input {
  display: block;
  padding: 0.625rem;
  border-radius: 0.4rem;
  border: 2px solid lightgray;
  width: 100%;
  font-size: 1rem;
  background-color: #F9FAFB;
  outline: none;
  letter-spacing: 1px;
}

.input:focus {
  border: 2px solid #2c3e50;
}

.textarea {
  display: block;
  padding: 0.625rem;
  width: 100%;
  border-radius: 0.4rem;
  font-size: 1rem;
  background-color: #F9FAFB;
  border: 2px solid lightgray;
  outline: none;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  letter-spacing: 1px;
  resize: none;
}

.textarea:focus {
  border: 2px solid #2c3e50;
}

.submit-button {
  display: flex;
  padding: 0.75rem 1.5rem;
  align-items: center;
  border-radius: 0.5rem;
  font-size: 1rem;
  text-align: center;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background-color: #2c3e50;
  color: white;
  letter-spacing: 1px;
}

.submit-button:hover {
  background-color: #395069;
}

.submit-button:active {
  background-color: #3f5a77;
}

.svg-close {
  width: 0.75rem;
  height: 0.75rem;
}

.modal-save {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-top: 0.5px solid rgb(233, 233, 233);

  @media (min-width: 768px) {
    padding: 1.25rem;
  }
}
</style>
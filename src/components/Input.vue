<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-heading">
          Bot Stages
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
          <div class="input-container">
            <label for="alias" class="label">Alias</label>
            <input type="text" name="alias" id="alias" class="input" placeholder="stage 2" required>
          </div>
          <div class="input-container">
            <label for="order" class="label">Order</label>
            <input type="number" name="order" id="order" class="input" placeholder="20" required>
          </div>
          <div class="input-container">
            <label for="type" class="label">Button Type</label>
            <select id="type" class="input">
              <option selected>REPLY</option>
              <option value="first">First</option>
              <option value="second">Second</option>
              <option value="third">Third</option>
              <option value="fourth">Fourth</option>
            </select>
          </div>
          <div class="input-container">
            <label for="condition" class="label">Condition</label>
            <textarea id="condition" rows="4" class="textarea" placeholder="Write the condition here"></textarea>
          </div>
        </div>
        <button @click="close" type="submit" class="submit-button">
          Submit
        </button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: ['showInputModal'],
  data() {
    return {}
  },
  mounted() {
    document.querySelectorAll('input[required]').forEach(function (input) {
      var label = document.querySelector('label[for="' + input.id + '"]');
      if (label) {
        label.innerHTML += ' <span class="required-star">*</span>';
      }
    });
  },
  methods: {
    close() {
      this.$emit('close');
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
  max-width: 580px;
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

  @media (min-width: 768px) {
    padding: 1.25rem;
  }
}

.form-content {
  display: grid;
  margin-bottom: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input {
  display: block;
  padding: 0.75rem;
  border-radius: 0.5rem;
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
  padding: 0.75rem;
  width: 100%;
  border-radius: 0.5rem;
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
  padding: 1rem 2rem;
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

.input-container {
  grid-column: span 2 / span 2;
}

.svg-close {
  width: 0.75rem;
  height: 0.75rem;
}
</style>
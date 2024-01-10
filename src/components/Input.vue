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
          <div class="first-row">
            <div>
              <label for="alias" class="label required">Alias</label>
              <input type="text" name="alias" id="alias" class="input" value="stage 2" required autocomplete="off">
            </div>
            <div>
              <label for="order" class="label required">Order</label>
              <input type="number" name="order" id="order" class="input" value="20" required autocomplete="off">
            </div>
            <div>
              <label for="action" class="label">Action</label>
              <select v-model="selected" @change="toggleEditor" id="action" class="input">
                <option value="STAGE" selected>STAGE</option>
                <option value="URL">URL</option>
              </select>
            </div>
            <div>
              <label for="type" class="label" :class="{ required: stageSelected }">Button type</label>
              <select id="type" class="input" :required="stageSelected" :disabled="!stageSelected" v-model="buttonType"
                @change="isDisabled = false; stateString = ''">
                <option value="INLINE" selected>INLINE</option>
                <option value="REPLY">REPLY</option>
                <option value="CONTACT">CONTACT</option>
                <option value="LOCATION">LOCATION</option>
              </select>
            </div>
          </div>
          <div v-if="!stageSelected">
            <label for="url" class="label">Callback URL</label>
            <input list="datalist" type="text" name="url" id="url" class="input" autocomplete="off">
            <datalist id="datalist" class="datalist">
              <option v-for="item in items" :key="item" :value="item">{{ item }}</option>
            </datalist>
          </div>
          <div class="state" v-if="stageSelected">
            <div class="state-type">
              <label for="state-type" class="label">State type</label>
              <select id="state-type" class="input" v-model="stateType" @change="stateString = ''" :disabled="isDisabled">
                <option value="" disabled selected hidden></option>
                <option value="next.">next.</option>
                <option value="url.">url.</option>
                <option value="other">other</option>
              </select>
            </div>
            <div class="state-string" v-if="stateType != 'next.'">
              <label for="state-string" class="label">State string</label>
              <input list="datalist" type="text" name="state-string" id="state-string" class="input" v-model="stateString"
                :disabled="stateString == 'reply'" autocomplete="off">
              <datalist id="datalist" class="datalist" v-if="stateType == 'url.'">
                <option v-for="item in items" :key="item" :value="item">{{ item }}</option>
              </datalist>
            </div>
            <div class="state-string" v-else-if="stateType == 'next.'">
              <label for="state-string" class="label">State string</label>
              <select id="state-string" class="input" v-model="stateString">
                <option v-for="item in items" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
          </div>

          <div class="condition" v-if="stageSelected && editorVisible">
            <label for="condition" class="label">Condition <span v-if="output" class="output">{{ output }}</span></label>
            <div id="condition" ref="editor" class="editor"></div>
          </div>

          <div class="dist" v-if="stageSelected">
            <div>
              <label for="btn-size" class="label">btn_size</label>
              <input type="text" name="btn-size" id="btn-size" class="input" v-model="btn_size" @change="validate"
                :class="{ error: error }" autocomplete='off'>
            </div>

            <div>
              <label for="cond-type" class="label">Condition Type</label>
              <select id="cond-type" class="input" v-model="conditionType">
                <option value="" disabled selected hidden></option>
                <option value="update">update</option>
                <option value="input">input</option>
              </select>
            </div>
          </div>

          <div v-if="stageSelected">
            <label for="user" class="label">User State</label>
            <input type="text" name="user" id="user" class="input" :value="userState" autocomplete="off" disabled>
          </div>
        </div>
      </form>
      <div class="modal-save">
        <button @click="submit" type="submit" class="submit-button">
          Save
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-cobalt';

export default {
  props: ['showInputModal', 'adding'],
  data() {
    return {
      heading: 'Add stage',
      selected: 'STAGE',
      stateType: '',
      stateString: '',
      buttonType: 'INLINE',
      conditionType: '',
      isDisabled: false,
      btn_size: '3',
      error: false,
      editor: null,
      editorVisible: true,
      output: '',
      items: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']
    }
  },
  computed: {
    userState: function () {
      if (this.stateType != 'other') {
        return this.stateType + this.stateString
      } else {
        return this.stateString
      }
    },
    stageSelected: function () {
      return this.selected == 'STAGE'
    }
  },

  mounted() {
    if (this.adding) {
      this.heading = 'Add stage'
    } else {
      this.heading = 'Edit stage'
    }

    this.initializeAceEditor()
  },

  watch: {
    buttonType(current) {
      if (current == 'LOCATION' || current == 'CONTACT') {
        this.stateType = 'next.'
        this.isDisabled = true
      } else if (current == 'REPLY') {
        this.stateType = 'other'
        this.isDisabled = true
        this.stateString = 'reply'
      }
    },
    conditionType(current) {
      if (this.editor) {
        if (current == 'input') {
          this.editor.setValue('user["attributes"]["full_name"] = msg_data\nupdate_user(id=user["id"], attributes=user["attributes"])')
        } else if (current == 'update') {
          this.editor.setValue('update_user(id=user["id"], user_state=msg_data)')
        }
      }
    }
  },

  methods: {
    async checkPythonCode() {
      const pythonCode = this.editor.getValue();

      try {
        if (!window.pyodide) {
          window.pyodide = await loadPyodide();
        }
        window.pyodide.runPython(pythonCode);
        this.output = '';
      } catch (error) {
        this.output = '(syntax error!)'
      }
    },

    close() {
      this.$emit('close')
    },

    validate() {
      const regex = /^\d+(\:\d+)?(\:\d+)?$/;
      this.error = !regex.test(this.btn_size);
    },

    toggleEditor() {
      this.editorVisible = !this.editorVisible;
      if (this.editorVisible) {
        this.initializeAceEditor();
      }
    },

    initializeAceEditor() {
      this.$nextTick(() => {
        if (this.editor) {
          this.editor.destroy();
        }
        this.editor = ace.edit(this.$refs.editor);
        this.editor.session.setMode('ace/mode/python');
        this.editor.setTheme('ace/theme/cobalt');
        this.editor.renderer.setPadding(10);
        this.editor.session.setUseWrapMode(true);
      });
    },

    submit() {
      this.checkPythonCode();
      if (!this.output) {
        this.close();
      }
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
  max-width: 680px;
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
  gap: 0.8rem;
}

.first-row {
  display: flex;
  gap: 0.8rem;

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
}

.first-row>div {
  width: 25%;

  @media (max-width: 640px) {
    width: calc(50% - 0.8rem);
  }
}

.state {
  display: flex;
  gap: 0.8rem;
}

.state-type {
  width: 200px;
}

.state-string {
  width: 100%;
}

.dist {
  display: flex;
  gap: 0.8rem
}

.dist div {
  flex-basis: 1/2;
  width: 100%;
}

.editor {
  width: 100%;
  height: 140px;
  font-size: 15px;
  border-radius: 5px;
}

select {
  color: #2c3e50;
}

.label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.input {
  display: block;
  padding: 0.5rem;
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

.datalist {
  /* position: relative; */
  padding: 0.5rem;
  border: 2px solid lightgray;
  width: 100%;
  font-size: 1rem;
  background-color: #F9FAFB;
  letter-spacing: 1px
}

.required::after {
  content: ' *';
  color: red;
}

.input.error {
  color: red;
  caret-color: #2c3e50;
  border-color: red;
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  appearance: none;
}

.output {
  font-weight: 500;
  color: red;
}
</style>
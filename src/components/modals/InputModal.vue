<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-heading">
          {{ heading }}
          <span v-if="!addMode" class="corner">{{ this.id }}</span>
        </h3>
        <button @click="close" type="button" class="modal-close" data-modal-toggle="crud-modal">
          <svg class="svg-close" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
        <div class="loading" v-if="loading">
        </div>
      </div>
      <ValidationObserver ref="observer" v-slot="{ invalid, validate }">
        <form class="form" @submit.prevent="validate().then(submit)">
          <div class="form-content">
            <div class="first-row">
              <div>
                <ValidationProvider rules="required" v-slot="{ errors }">
                  <div>
                    <label for="alias" class="label required">Name</label>
                    <input type="text" name="alias" id="alias" class="input" v-model="alias" autocomplete="off">
                    <span v-if="errors[0]" class="output">Required field!</span>
                  </div>
                </ValidationProvider>
              </div>
              <div>
                <ValidationProvider rules="required" v-slot="{ errors }">
                  <div>
                    <label for="stage_order" class="label required">Order</label>
                    <input type="number" name="stage_order" id="stage_order" class="input" v-model="stage_order"
                      autocomplete="off">
                    <span v-if="errors[0]" class="output">Required field!</span>
                  </div>
                </ValidationProvider>

              </div>
              <div>
                <label for="action" class="label">Type</label>
                <div class="select-wrapper">
                  <select v-model="selected" @change="toggleEditor" id="action" class="input">
                    <option value="STAGE" selected>STAGE</option>
                    <option value="URL">URL</option>
                  </select>
                </div>
              </div>
              <div>
                <label for="type" class="label" :class="{ required: stageSelected }">Button type</label>
                <div class="select-wrapper">
                  <select id="type" class="input" :required="stageSelected" :disabled="!stageSelected" v-model="btn_type"
                    @change="isDisabled = false; stateString = ''">
                    <option value="INLINE" selected>INLINE</option>
                    <option value="REPLY">REPLY</option>
                    <option value="CONTACT">CONTACT</option>
                    <option value="LOCATION">LOCATION</option>
                  </select>
                </div>
              </div>
            </div>

            <div v-if="stageSelected">
              <label for="text" class="label">Text</label>
              <div class="buttons">
                <div class="select-wrapper">
                  <select id="text" class="input" v-model="text_alias">
                    <option value="" disabled selected hidden></option>
                    <option v-for="item in aliases" :key="item.id" :value="item">{{ item.name }}</option>
                  </select>
                  <button class="clear-button" v-if="text_alias" @click.stop.prevent="clearTextAlias">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" aria-hidden="true" fill="none"
                      viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                  </button>
                </div>
                <button class="create-button" type="button" @click.stop.prevent="create" title="Create text">
                  <span>+</span>
                </button>
              </div>
            </div>

            <div v-if="!stageSelected">
              <label for="url" class="label" :class="{ required: !stageSelected }">Callback URL</label>

              <!-- <input list="datalist" type="text" name="url" id="url" class="input" autocomplete="off"
                :required="!stageSelected" v-model="callback_url">
              <datalist id="datalist" class="datalist">
                <option v-for="item in urls" :key="item.description">
                  <span v-if="item.url">{{ item.url }}</span>
                  <span v-if="item.description && item.url">&nbsp; &ndash; &nbsp;</span>
                  <span v-if="item.description">{{ item.description }}</span>
                </option>
              </datalist> -->

              <div class="buttons">
                <div class="select-wrapper">
                  <select id="url" class="input" v-model="callback_url" :required="!stageSelected">
                    <option value="" disabled selected hidden></option>
                    <option v-for="item in urls" :key="item.description" :value="item.url">
                      <span v-if="item.url">{{ item.url }}</span>
                      <span v-if="item.description && item.url">&nbsp; &ndash; &nbsp;</span>
                      <span v-if="item.description">{{ item.description }}</span>
                    </option>
                  </select>
                </div>
                <button class="create-button" type="button" @click.stop.prevent="createURL" title="Create URL">
                  <span>+</span>
                </button>
              </div>
            </div>
            <div class="state" v-if="stageSelected">
              <div class="state-type">
                <label for="state-type" class="label">User state type</label>
                <div class="select-wrapper">
                  <select id="state-type" class="input" v-model="stateType" @change="stateString = ''"
                    :disabled="isDisabled">
                    <option value="" disabled selected hidden></option>
                    <option value="next.">next.</option>
                    <option value="url.">url.</option>
                    <option value="other">other</option>
                  </select>
                  <button class="clear-button" v-if="stateType" @click.stop.prevent="clearStateType">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" aria-hidden="true" fill="none"
                      viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="state-string" v-if="stateType != 'next.'">
                <label for="state-string" class="label">User state value</label>
                <input list="datalist" type="text" name="state-string" id="state-string" class="input"
                  v-model="stateString" :disabled="stateString == 'reply'" autocomplete="off">
                <datalist id="datalist" class="datalist" v-if="stateType == 'url.'">
                  <option v-for="item in urls" :key="item.alias" :value="item.alias">{{ item.alias }}</option>
                </datalist>
              </div>
              <div class="state-string" v-else-if="stateType == 'next.'">
                <label for="state-string" class="label">User state value</label>
                <div class="select-wrapper">
                  <select id="state-string" class="input" v-model="stateString">
                    <option v-for="item in stages" :key="item.alias" :value="item.alias">{{ item.alias }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div v-if="stageSelected">
              <label for="user" class="label">User State</label>
              <input type="text" name="user" id="user" class="input" :value="user_state" autocomplete="off" disabled>
            </div>

            <div class="condition" v-if="stageSelected && editorVisible">
              <label for="condition" class="label">Condition code area <span v-if="output" class="output">{{ output
              }}</span></label>
              <div id="condition" ref="editor" class="editor"></div>
            </div>

            <div class="dist" v-if="stageSelected">
              <ValidationProvider v-slot="{ errors }" :rules="{ regex: /^\d+(\:\d+)?(\:\d+)?$/ }">
                <div>
                  <label for="btn-sizes" class="label">Button sizes</label>
                  <input type="text" name="btn-sizes" id="btn-sizes" class="input" v-model="btn_sizes"
                    @change="validateSize" autocomplete='off' :class="{ error: error }">
                  <span v-if="errors[0]" class="output">Invalid format!</span>
                </div>
              </ValidationProvider>

              <div>
                <label for="cond-type" class="label">Condition templates</label>
                <div class="select-wrapper">
                  <select id="cond-type" class="input" v-model="conditionType">
                    <option value="" disabled selected hidden></option>
                    <option value="update">update</option>
                    <option value="input">input</option>
                  </select>
                </div>
              </div>
            </div>

            <div v-if="stageSelected && addMode">
              <label for="connection" class="label">Connection old stage</label>
              <div class="input-container">
                <div class="select-wrapper">
                  <select id="connection" class="input" v-model="stage" @input="getBackhands">
                    <option value="" disabled selected hidden></option>
                    <option v-for="item in stages" :key="item.alias" :value="item.alias">{{ item.alias }}</option>
                  </select>
                </div>
                <div class="select-wrapper">
                  <select class="input" v-model="backhand">
                    <option value="" disabled selected hidden></option>
                    <option v-for="item in backhands" :key="item.id" :value="item.alias">{{ item.alias }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <ButtonsTable v-if="!addMode && stageSelected" :inputValues="inputValues" :updateTable="updateTable"
            @openStageButtonModal="openStageButtonModal" :showStageButtonModal="showStageButtonModal" />

          <div class="modal-save">
            <button type="submit" class="submit-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#fff" viewBox="0 0 256 256">
                <path
                  d="M219.31,80,176,36.69A15.86,15.86,0,0,0,164.69,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V91.31A15.86,15.86,0,0,0,219.31,80ZM168,208H88V152h80Zm40,0H184V152a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v56H48V48H164.69L208,91.31ZM160,72a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h56A8,8,0,0,1,160,72Z">
                </path>
              </svg>
              <span>Save</span>
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>
<script>
import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-dawn';

import axios from "axios";
import ButtonsTable from '../lists/ButtonsTable.vue';
import Toast from '../notifications/Toast.vue';

export default {
  props: ['showInputModal', 'addMode', 'inputValues', 'showStageButtonModal', 'getTexts', 'getCallbacks', 'updateTable', 'bot_id', 'user_id'],
  components: {
    ButtonsTable,
    Toast
  },
  data() {
    return {
      heading: 'Add stage',
      alias: '',
      stage_order: '',
      selected: 'STAGE',
      url_id: null,
      callback_url: null,
      stateType: '',
      stateString: '',
      btn_type: 'INLINE',
      conditionType: '',
      isDisabled: false,
      btn_sizes: '3',
      error: false,
      editor: null,
      editorVisible: true,
      output: '',
      loading: false,
      text_alias: '',
      text_id: '',
      id: '',
      condition: null,
      aliases: [],
      urls: [],
      stages: [],
      num: '',
      backhands: [],
      url: 'https://bot-platon.platon.uz/services/platon-core/api/',
      stage: '',
      backhand: ''
    }
  },
  computed: {
    user_state: {
      get() {
        if (this.stateType != 'other') {
          if (this.stateType == 'next.' && this.stateString != '') {
            return this.stateType + this.stages.find(item => item.alias == this.stateString)?.id
          } else {
            return this.stateType + this.stateString
          }
        } else {
          return this.stateString
        }
      },

      set(newValue) {
        if (newValue) {
          if (newValue.startsWith('next.')) {
            this.stateType = 'next.'
            this.stateString = this.stages.find(item => item.id == newValue.slice(5))?.alias ?? ''
          } else if (newValue.startsWith('url.')) {
            this.stateType = 'url.'
            this.stateString = newValue.slice(4)
          } else {
            this.stateType = 'other'
            this.stateString = newValue
          }
        }
      }
    },

    stageSelected: function () {
      return this.selected == 'STAGE'
    }
  },

  async created() {
    await this.getAliases()
    await this.getUrls()
    await this.getStages()
    await this.getNum()
    await this.getBackhands()

    if (this.addMode) {
      this.heading = 'Add stage'
    } else {
      this.heading = 'Edit stage'
      this.editData()
    }

  },

  async mounted() {
    this.initializeAceEditor()
  },

  methods: {
    openStageButtonModal(id) {
      this.$emit('openStageButtonModal', id)
    },

    clearTextAlias() {
      this.text_alias = ''
    },

    clearStateType() {
      this.stateType = ''
      this.stateString = ''
    },

    create() {
      this.$emit('create')
    },

    createURL() {
      this.$emit('createURL')
    },

    async getNum() {
      const response = await axios.get(`${this.url}tg/bot/stage/new?bot_id=${this.bot_id}`)
      this.num = response.data.data
      if (!this.alias) {
        this.alias = `stage ${this.num}`
      }

      if (!this.stage_order) {
        this.stage_order = this.num * 10
      }
    },

    async getBackhands() {
      if (this.stage) {
        const id = this.stages.find(item => item.alias == this.stage)?.id
        const response = await axios.get(`${this.url}tg/bot/stage/availabe/hands?stage_id=${id}`)
        this.backhands = response.data.data.buttons

        if (response.data.data.user_state) {
          this.backhands.push({ id: response.data.data.user_state, alias: response.data.data.user_state ? 'user_state' : '' })
        }
      }

    },

    async getAliases() {
      const response = await axios.get(`${this.url}v1/bot/user/texts?user_id=${this.user_id}`)
      this.aliases = response.data.data

      if (this.inputValues) {
        this.text_alias = this.aliases.find(item => item.id == this.inputValues.text_id)
      }
    },

    async getStages() {
      const response = await axios.get(`${this.url}v1/bot/stage/list?bot_id=${this.bot_id}`);
      this.stages = response.data.data;
    },

    async getUrls() {
      const response = await axios.get(`${this.url}tg/bot/user/callback_urls?user_id=${this.user_id}`)
      this.urls = response.data.data
    },

    validateSize() {
      const regex = /^\d+(\:\d+)?(\:\d+)?$/;
      this.error = !regex.test(this.btn_sizes);
    },

    toggleEditor() {
      this.editorVisible = this.selected == 'STAGE';
      if (this.editorVisible) {
        this.initializeAceEditor();
        setTimeout(() => {
          this.editor.setValue(this.condition)
        }, 0);
      }
    },

    initializeAceEditor() {
      this.$nextTick(() => {
        if (this.editor) {
          this.editor.destroy();
        }
        this.editor = ace.edit(this.$refs.editor);
        this.editor.session.setMode('ace/mode/python');
        this.editor.setTheme('ace/theme/dawn');
        this.editor.renderer.setPadding(10);
        this.editor.session.setUseWrapMode(true);
      });
    },

    save() {
      this.$emit('save', {
        id: this.id,
        alias: this.alias,
        stage_order: this.stage_order,
        text_id: this.text_alias ? this.aliases[this.aliases.indexOf(this.text_alias)].id : null,
        url_id: this.selected == 'URL' ? (this.callback_url ? this.urls.find(item => item.url == this.callback_url).id : null) : null,
        callback_url: this.callback_url,
        user_state: this.user_state == '' ? null : this.user_state,
        condition: this.editor.getValue(),
        updated_by: this.user_id,
        created_by: this.user_id,
        bot_id: this.bot_id,
        btn_type: this.btn_type,
        btn_sizes: this.btn_sizes,
        stage_id: this.stages.find(item => item.alias == this.stage)?.id,
        state: 1,
        backhand: this.backhand,
        backhand_id: this.backhand == 'user_state' ? 'user_state' : this.backhands.find(item => item.alias == this.backhand)?.id,
        urls: this.urls
      })
    },

    editData() {
      if (this.inputValues) {
        this.alias = this.inputValues.alias;
        this.btn_sizes = this.inputValues.btn_sizes ?? 3;
        this.btn_type = this.inputValues.btn_type ?? 'INLINE';
        this.condition = this.inputValues.condition;

        setTimeout(() => {
          this.editor.setValue(this.condition)
        }, 0);

        this.id = this.inputValues.id;
        this.stage_order = this.inputValues.stage_order;
        this.text_id = this.inputValues.text_id;
        this.url_id = this.inputValues.url_id;
        this.callback_url = this.inputValues.url_id ? this.urls.find(item => item.id == this.inputValues.url_id)?.url : null;
        this.selected = this.inputValues.url_id ? 'URL' : 'STAGE';
        this.user_state = this.inputValues.user_state;
      }
    },

    async submit() {
      this.loading = true

      const data = {
        code: this.editor.getValue()
      }

      const response = await axios.post('http://10.20.11.24:8000/main/code/check', data)
      if (response.data.success) {
        this.output = ''
        this.loading = false
      } else {
        this.output = response.data.message
        this.loading = false
        return
      }

      this.save();
      this.close();
    },

    close() {
      this.$emit('close')
    },
  },
  watch: {
    inputValues: {
      handler(newValue) {
        this.inputValues = { ...newValue }
      },
      immediate: true
    },
    showInputModal(newValue) {
      if (newValue && !this.addMode) {
        this.editData();
      }
    },
    inputValues(newData) {
      if (newData) {
        this.editData();
      }
    },
    btn_type(current) {
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
    },
    condition(current) {
      if (this.editor) {
        this.editor.setValue(current)
      }
    },
    stage(current) {
      this.getBackhands()
    },
    getTexts(current) {
      this.getAliases()
    },
    getCallbacks(current) {
      this.getUrls()
    }
  }
}

</script>
<style scoped>
@import '../../assets/modal.css';

.modal-heading .corner {
  background-color: #F2F6FA;
  color: #226CE6;
  font-size: 14px;
  border-radius: 200px;
  padding: 3px 7px;
  font-weight: 600;
  user-select: none;
}

.clear-button {
  position: absolute;
  top: 11px;
  right: 20px;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  color: #929aa2;
  background: transparent;
  border: none;
  outline: none;
  border-radius: 50%;
}

.clear-button:hover {
  color: #7a7d80;
}
</style>
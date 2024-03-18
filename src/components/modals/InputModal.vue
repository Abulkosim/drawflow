<script>
import ButtonsTable from '../lists/ButtonsTable.vue';
import CloseButton from '../buttons/CloseButton.vue';
import SaveIcon from "../icons/SaveIcon.vue";
import QuestionIcon from "../icons/QuestionIcon.vue";
import Toast from '../notifications/Toast.vue';
import { fetchNum, fetchBackhands, fetchAliases, fetchStages, fetchURLs, checkCode } from '../../api/api.stage';
import aceEditorMixin from '../../mixins/aceEditorMixin';
import inputFormStateMixin from '../../mixins/inputFormStateMixin';
import toggleEditorMixin from '../../mixins/toggleEditorMixin';
import userStateMixin from '../../mixins/userStateMixin';

export default {
  props: ['showInputModal', 'addMode', 'inputValues', 'showStageButtonModal', 'getTexts', 'getCallbacks', 'updateTable', 'bot_id', 'user_id'],
  mixins: [userStateMixin, aceEditorMixin, inputFormStateMixin, toggleEditorMixin],
  components: {
    ButtonsTable,
    Toast,
    SaveIcon,
    CloseButton,
    QuestionIcon
  },
  computed: {
    stageSelected() {
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

    create() {
      this.$emit('create')
    },

    createURL() {
      this.$emit('createURL')
    },

    async getNum() {
      this.num = await fetchNum(this.bot_id)
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
        const response = await fetchBackhands(id)
        this.backhands = response.data.data.buttons
        if (response.data.data.user_state) {
          this.backhands.push({ id: response.data.data.user_state, alias: response.data.data.user_state ? 'user_state' : '' })
        }
      }
    },

    async getAliases() {
      this.aliases = await fetchAliases(this.user_id)
      if (this.inputValues) {
        this.text_alias = this.aliases.find(item => item.id == this.inputValues.text_id)
      }
    },

    async getStages() {
      this.stages = await fetchStages(this.bot_id)
    },

    async getUrls() {
      this.urls = await fetchURLs(this.user_id)
    },

    validateSize() {
      const regex = /^\d+(\:\d+)?(\:\d+)?$/;
      this.error = !regex.test(this.btn_sizes);
    },


    async submit() {
      this.loading = true

      const data = {
        code: this.editor.getValue()
      }

      const response = await checkCode(data)
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
        } else if (current == 'next') {
          this.editor.setValue('if user[\'phone\']: next = 10  # move to the stage with id=10')
        } else if (current == 'url') {
          this.editor.setValue('if user[\'phone\']: url = "https://example.com/api/"  # using callback url')
        } else if (current == 'requests') {
          this.editor.setValue('requests.get("https://example.com/api").json()')
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
<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-heading">
          {{ heading }}
          <span v-if="!addMode" class="corner">{{ this.id }}</span>
          <span class="question-icon"
            title="Stage - the steps of the bot, each step is cleared by the bot when moving to the next step and moves on to the next step. The number next to each stage represents its id.">
            <QuestionIcon />
          </span>
        </h3>
        <CloseButton @close="close" />
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
              <div title="Choose the step's type">
                <label for="action" class="label">Type</label>
                <div class="select-wrapper">
                  <select v-model="selected" @change="toggleEditor" id="action" class="input">
                    <option value="STAGE" selected>STAGE</option>
                    <option value="URL">URL</option>
                  </select>
                </div>
              </div>
              <div title="Choose the type of visible buttons">
                <label for="type" class="label" :class="{ required: stageSelected }">Button type</label>
                <div class="select-wrapper">
                  <select id="type" class="input" :required="stageSelected" :disabled="!stageSelected"
                    v-model="btn_type" @change="isDisabled = false; stateString = ''">
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

            <div v-if="!stageSelected" title="Control with an external API">
              <label for="url" class="label" :class="{ required: !stageSelected }">Callback URL</label>
              <div class="buttons">
                <div class="select-wrapper">
                  <select id="url" class="input" v-model="callback_url" :required="!stageSelected">
                    <option value="" disabled selected hidden></option>
                    <option v-for="item in urls" :key="item.url" :value="item.url">
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
              <div class="state-type" title="Choose user state's type">
                <label for="state-type" class="label">User state type</label>
                <div class="select-wrapper">
                  <select id="state-type" class="input" v-model="stateType" @change="stateString = ''"
                    :disabled="isDisabled">
                    <option value="" disabled selected hidden></option>
                    <option value="next.">next.</option>
                    <option value="url.">url.</option>
                    <option value="other">other</option>
                  </select>
                  <button class="clear-button" v-if="stateType && btn_type == 'INLINE'"
                    @click.stop.prevent="clearStateType">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" aria-hidden="true" fill="none"
                      viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="state-string" v-if="stateType != 'next.'" title="Set the value for user state">
                <label for="state-string" class="label">User state value</label>
                <input list="datalist" type="text" name="state-string" id="state-string" class="input"
                  v-model="stateString" :disabled="stateString == 'reply'" autocomplete="off">
                <datalist id="datalist" class="datalist" v-if="stateType == 'url.'">
                  <option v-for="item in urls" :key="item.alias" :value="item.alias">{{ item.alias }}</option>
                </datalist>
              </div>
              <div class="state-string" v-else-if="stateType == 'next.'" title="Set the value for user state">
                <label for="state-string" class="label">User state value</label>
                <div class="select-wrapper">
                  <select id="state-string" class="input" v-model="stateString">
                    <option v-for="item in stages" :key="item.alias" :value="item.alias">{{ item.alias }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div v-if="stageSelected" title="The value for managing user states">
              <label for="user" class="label">User State:&nbsp;
                <span v-if="user_state">{{ user_state }}</span>
                <span v-else class="null-span">null</span>
              </label>
            </div>

            <div v-if="stageSelected && addMode" title="Connect to the previous stage">
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
                    <option value="" disabled selected hidden><span v-if="!backhands.length">No connections</span>
                    </option>
                    <option v-for="item in backhands" :key="item.id" :value="item.alias">{{ item.alias }}</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          <div class="table-container" v-if="!addMode && stageSelected"
            title="Connect to the buttons or user_state of the selected stage">
            <label class="label">Stage buttons</label>
            <ButtonsTable v-if="!addMode && stageSelected" :inputValues="inputValues" :updateTable="updateTable"
              @openStageButtonModal="openStageButtonModal" :showStageButtonModal="showStageButtonModal" />
          </div>

          <div class="dist" v-if="stageSelected" title="Button sorting (e.g. 1:2:3, 1:2, 3:2:1)">
            <ValidationProvider v-slot="{ errors }" :rules="{ regex: /^\d+(\:\d+)?(\:\d+)?$/ }">
              <div>
                <label for="btn-sizes" class="label">Button sizes</label>
                <input type="text" name="btn-sizes" id="btn-sizes" class="input" v-model="btn_sizes"
                  @change="validateSize" autocomplete='off' :class="{ error: error }">
                <span v-if="errors[0]" class="output">Invalid format!</span>
              </div>
            </ValidationProvider>

            <div title="Choose from the python code templates for the condition code area">
              <label for="cond-type" class="label">Condition templates</label>
              <div class="select-wrapper">
                <select id="cond-type" class="input" v-model="conditionType">
                  <option value="" disabled selected hidden></option>
                  <option value="update">update</option>
                  <option value="input">input</option>
                  <option value="next">next</option>
                  <option value="url">url</option>
                  <option value="requests">requests</option>
                </select>
              </div>
            </div>
          </div>

          <div class="condition" v-if="stageSelected && editorVisible"
            title="Python code field for executing logical conditions, if necessary.">
            <label for="condition" class="label">Condition code area <span v-if="output" class="output">{{ output
                }}</span></label>
            <div id="condition" ref="editor" class="editor"></div>
          </div>

          <div class="modal-save">
            <button type="submit" class="submit-button">
              <SaveIcon />
              <span>Save</span>
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

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

.table-container label {
  text-align: center;
  font-size: 18px;
}
</style>
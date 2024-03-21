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
              <div class="url-part">
                <label v-if="toggle" for="template-url" class="label required">
                  <span>Alias</span>
                </label>
                <label v-if="!toggle" for="callback-url" class="label required">
                  <span>Callback URL</span>
                </label>
                <div class="url-container">
                  <input v-if="toggle" type="text" name="template-url" id="template-url" class="input"
                    v-model="templateURL" autocomplete="off" required placeholder="v1/bot/test/api/">
                  <input v-if="!toggle" type="text" name="callback-url" id="callback-url" class="input isToggled"
                    v-model="url" autocomplete="off" required>

                  <div v-if="!toggle" class="check-button" @click="check">
                    <CheckIcon class="check-icon" />
                  </div>
                </div>
                <transition name="fade">
                  <span v-show="response && !toggle" :class="{ success: success, fail: fail }">{{ response }}</span>
                </transition>
                <span v-if="invalidInput && toggle" class="output">Invalid input!</span>
                <span v-if="validity && !response && !toggle" class="output">Make sure that the URL is valid!</span>
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
import CheckIcon from '../icons/CheckIcon.vue';
import http from '../../interceptors/http'

export default {
  props: ['showURLModal', 'bot_id', 'user_id'],
  data() {
    return {
      heading: 'Create URL',
      url: '',
      templateURL: '',
      description: '',
      toggle: true,
      loading: false,
      response: '',
      success: false,
      fail: false,
      validity: false,
      invalidInput: false
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },

    check() {
      let info = this.url
      let data = {
        user: {
          id: "248e4b78-8edb-6c86-a663-f0d35b278317",
          attributes: {},
          telegram_id: 1456374097,
          full_name: "async def",
          username: "greatdestination",
          phone: "998882690011",
          lang_id: 1,
          bot_id: "2267e7b6-92ea-0f9a-cef5-81dbf5b96b85",
          role_id: 1,
          user_state: "reply",
          stage_id: 36,
          state: 1,
          created_at: "2024-02-20 17:15:31.790009",
          updated_at: null,
          status: "ACTIVE"
        },
        msg_data: "Success"
      }
      http.post(info, data).then(res => {
        if (res.data.data.main) {
          let keys = res.data.data.main;
          let notPresentKeys = [];
          let key_list = ['btn_sizes', 'buttons', 'media', 'next', 'text', 'url', 'user_state']
          key_list.forEach(key => {
            if (!keys.hasOwnProperty(key)) {
              notPresentKeys.push(key);
            }
          });
          if (notPresentKeys.length > 0) {
            this.success = false;
            this.fail = true;
            this.response = `Callback url response is invalid! Missing keys: ${notPresentKeys.join(', ')}`
          } else {
            this.success = true;
            this.fail = false;
            this.response = 'Callback url response is valid!'
          }
        } else {
          this.success = false;
          this.fail = true;
          this.response = 'Main stage does not exist in callback url response!'
        }
      }).catch(err => {
        this.success = false;
        this.fail = true;
        this.response = 'Callback url response is invalid!'
      });
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
        let regex = /^(?!\/\/)(?:[^/\\]+|\/(?!\/))+$/
        if (regex.test(this.templateURL) === false || this.templateURL.includes(' ')) {
          this.invalidInput = true;
          return;
        }

        this.loading = true;
        const alias = {
          alias: this.templateURL
        }
        const response = await createTemplate(alias);

        this.loading = false;

        if (response.status === 200 && response.data.data.create_main_stage != null) {
          const data = {
            user_id: this.user_id,
            url: 'https://bot-platon.platon.uz/services/platon-core/api/' + this.templateURL,
            description: this.description
          };
          await createURL(data);
          this.$emit('closed');
          this.close();
        }
      }
    }
  },
  watch: {
    toggle() {
      this.url = ''
    }
  },
  components: { SaveIcon, CloseButton, CheckIcon }
}
</script>
<style scoped>
@import '../../assets/modal.css';
@import '../../assets/urlmodal.css';
</style>
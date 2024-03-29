export default {
  data() {
    return {
      heading: 'Add stage',
      alias: '',
      stage_order: '',
      selected: 'STAGE',
      url_id: null,
      callback_url: null,
      btn_type: 'INLINE',
      conditionType: '',
      isDisabled: false,
      btn_sizes: '3',
      error: false,
      editorVisible: true,
      output: '',
      loading: false,
      text_alias: '',
      text_id: '',
      id: '',
      condition: null,
      aliases: [],
      urls: [],
      num: '',
      backhands: [],
      stage: '',
      backhand: '',
      buttonRows: [],
      buttons: [],
      loader: false,
      nameExists: false,
      title: '',
      time: '',
      bot_text: '',
      displayTable: false, 
      displayView: false
    };
  },
  methods: {
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

    toggleTable() {
      this.displayTable = !this.displayTable;
    }, 

    toggleView() {
      this.displayView = !this.displayView;
    }
  }
};

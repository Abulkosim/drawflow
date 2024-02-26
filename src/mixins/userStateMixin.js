export default {
  data() {
    return {
      stateType: '',
      stateString: '',
      stages: []
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
    }
  },
  methods: {
    clearStateType() {
      this.stateType = '';
      this.stateString = '';
    }
  }
};

export default {
  methods: {
    toggleEditor() {
      if (this.selected == 'URL') {
        this.btn_type = 'INLINE'
      }
      
      this.editorVisible = this.selected == 'STAGE';
      if (this.editorVisible) {
        this.initializeAceEditor();
        setTimeout(() => {
          this.editor.setValue(this.condition)
        }, 0);
      }
    },
  }
};

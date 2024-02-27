export default {
  methods: {
    toggleEditor() {
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

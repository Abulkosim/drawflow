import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-xcode';

export default {
  data() {
    return {
      editor: null
    };
  },
  mounted() {
    this.initializeAceEditor();
  },
  methods: {
    initializeAceEditor() {
      this.$nextTick(() => {
        if (this.editor) {
          this.editor.destroy();
        }
        this.editor = ace.edit(this.$refs.editor);
        this.editor.session.setMode('ace/mode/python');
        this.editor.setTheme('ace/theme/xcode');
        this.editor.renderer.setPadding(10);
        this.editor.session.setUseWrapMode(true);
        this.editor.setOptions({
          fontSize: "9pt"
        });
      });
    },
  }
};

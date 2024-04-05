export default {
  data() {
    return {
      showButtons: false,
      editor: null,
      showContextMenu: false,
      x: {
        showModal: false,
        showInputModal: false,
        showAddButtonModal: false,
        showAddTextModal: false,
        showStageButtonModal: false,
        showLocalesModal: false,
        showAPIModal: false,
        showURLModal: false,
        showTipMenu: true,
        showTipDrag: true,
        showTipEdit: true,
      },
      contextMenuPosition: { x: 0, y: 0 },
      selectedNode: null,
      showToast: false,
      isSuccessful: false,
      toastMessage: '',
      addMode: true,
      updateTable: false,
      data: [],
      inputValues: {},
      x_: null,
      y_: null,
      stageButtonId: null,
      getTexts: true,
      getCallbacks: true,
      buttons: true,
      bot_id: null,
      user_id: null,
      bot_name: null,
      link: null,
      apiLink: '',
      isOpened: false,
      searchPopup: false,
    };
  },
  mounted() {
    const url = new URLSearchParams(window.location.search);
    this.bot_id = url.get('bot_id');
    if (!this.bot_id) {
      this.$router.push('/error');
    }
    this.user_id = url.get('user_id');

    window.addEventListener('keydown', this.closeModalsOnEscape);

    window.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        this.searchPopup = true;
      }
    });

    window.addEventListener('click', () => {
      this.showContextMenu = false;
    });
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.closeModalsOnEscape);
  },
  methods: {
    openConfirmationModal() {
      this.x.showModal = true;
      this.x.showContextMenu = false
    },

    closeModalsOnEscape(event) {
      if (event.key === 'Escape') {
        if (this.showContextMenu) {
          this.showContextMenu = false;
        } else if (this.x.showLocalesModal) {
          this.x.showLocalesModal = false;
        } else if (this.x.showAddButtonModal) {
          this.x.showAddButtonModal = false;
        } else if (this.x.showAddTextModal) {
          this.x.showAddTextModal = false;
        } else if (this.x.showURLModal) {
          this.x.showURLModal = false;
        } else if (this.x.showAPIModal) {
          this.x.showAPIModal = false;
        } else if (this.x.showStageButtonModal) {
          this.x.showStageButtonModal = false;
        } else if (this.x.showInputModal) {
          this.x.showInputModal = false;
        } else if (this.x.showModal) {
          this.x.showModal = false;
        } 
      }
    },

    handleRightClick(event) {
      event.preventDefault();
      if (event.target.closest('.drawflow-node')) {
        this.showContextMenu = true;
        this.contextMenuPosition = { x: event.pageX, y: event.pageY };
      }
    },

    handleDoubleClick(event) {
      if (event.target.closest('.drawflow-node').id === 'node-2') {
        this.openLocaleModal();
      }
      if (event.target.closest('.drawflow-node') && event.target.closest('.drawflow-node').id !== 'node-1' && event.target.closest('.drawflow-node').id !== 'node-2') {
        this.openInputModal('editing');
      }
    },

    showSuccessToast() {
      this.toastMessage = 'Operation suceeded!';
      this.isSuccessful = true;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    },

    showFailedToast(error) {
      this.toastMessage = 'Oops! Something went wrong.';
      this.isSuccessful = false;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    },

    openModal(modalName) {
      this.x[modalName] = true;
    },

    closeModal(modalName) {
      this.x[modalName] = false;
    },

    dropped(event) {
      event.preventDefault();
      this.x_ = event.clientX - this.dragOffset.x;
      this.y_ = event.clientY - this.dragOffset.y;
      this.openInputModal('adding')
    }
  }
};

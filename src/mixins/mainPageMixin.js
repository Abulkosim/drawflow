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
        showURLModal: false,
        showTipMenu: true,
        showTipDrag: true,
        showTipEdit: true
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
      link: null
    };
  }, 
  methods: {
    openConfirmationModal() {
      this.x.showModal = true;
      this.x.showContextMenu = false
    },

    handleRightClick(event) {
      event.preventDefault();

      if (event.target.closest('.drawflow-node')) {
        this.showContextMenu = true;
        this.contextMenuPosition = { x: event.pageX, y: event.pageY };
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
  }
};

export default {
  data() {
    return {
      dragOffset: { x: 0, y: 0 },
    }
  },
  methods: {
    drag(ev) {
      ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));

      const rect = ev.target.getBoundingClientRect();
      this.dragOffset.x = ev.clientX - rect.left;
      this.dragOffset.y = ev.clientY - rect.top;
    },

    drop(ev) {
      ev.preventDefault();
    },

    allowDrop(ev) {
      ev.preventDefault();
    }
  }
}

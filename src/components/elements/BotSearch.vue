<template>
  <div class="search" :class="{ slideOut: !isVisible }">
    <div class="search-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256">
        <path
          d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z">
        </path>
      </svg>
      <input type="text" placeholder="Search" ref="searchInput" />
      <button type="button" @click="closeSearch">esc</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BotSearch',
  components: {
  },
  props: {
    searchPopup: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isVisible: true
    }
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSearch();
      }
    });

    if (this.isVisible && this.$refs.searchInput) {
      this.$refs.searchInput.focus();
    }
  },
  methods: {
    closeSearch() {
      this.isVisible = false;
      setTimeout(() => {
        this.$emit('close');
      }, 500);
    },
  },
}
</script>
<style scoped>
.search {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.5s ease-out forwards;
}

@keyframes slideDown {
  from {
    top: -100px;
    opacity: 0;
  }

  to {
    top: 20px;
    opacity: 1;
  }
}

.slideOut {
  animation: slideUp 0.5s ease-out forwards;
}

@keyframes slideUp {
  from {
    top: 20px;
    opacity: 1;
  }

  to {
    top: -100px;
    opacity: 0;
  }
}

.search-container {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px 10px 10px 15px;
  width: 100%;
}

.search-container input {
  border: none;
  padding: 5px;
  margin: 5px;
  outline: none;
  width: 100%;
  height: 100%;
  font-size: 17px;
  line-height: 22px;
  letter-spacing: 0.75px;
  color: #2e363e; 
}

.search-container button {
  border: none;
  background-color: transparent;
  padding: 6px 8px;
  margin: 5px;
  cursor: pointer;
  background-color: #226ce6;
  color: white;
  border-radius: 5px;
  font-family: monospace;
  font-size: 17px;
}

.search-container svg {
  fill: #555;
  display: inline-block;
  transition: all 0.3s ease;
}

.search-container svg:hover {
  fill: #111;
}
</style>
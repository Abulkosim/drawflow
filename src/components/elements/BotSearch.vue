<template>
  <div class="search" :class="{ slideOut: !isVisible }">
    <div class="search-container">
      <svg v-show="!searchQuery" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256">
        <path
          d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z">
        </path>
      </svg>
      <svg v-show="searchQuery" @click="clearQuery" xmlns="http://www.w3.org/2000/svg" width="28" height="28"
        viewBox="0 0 256 256">
        <path
          d="M216,40H68.53a16.08,16.08,0,0,0-13.72,7.77L9.14,123.88a8,8,0,0,0,0,8.24l45.67,76.11A16.08,16.08,0,0,0,68.53,216H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM61.67,204.12,68.53,200h0ZM216,200H68.53l-43.2-72,43.2-72H216ZM106.34,146.34,124.69,128l-18.35-18.34a8,8,0,0,1,11.32-11.32L136,116.69l18.34-18.35a8,8,0,0,1,11.32,11.32L147.31,128l18.35,18.34a8,8,0,0,1-11.32,11.32L136,139.31l-18.34,18.35a8,8,0,0,1-11.32-11.32Z">
        </path>
      </svg>
      <input type="text" placeholder="Search" ref="searchInput" @input="filterData" v-model="searchQuery" />
      <button type="button" @click="closeSearch">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#888" viewBox="0 0 256 256">
          <path
            d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z">
          </path>
        </svg>
      </button>
    </div>

    <div class="loader-container" v-if="loader">
      <div class="loader"></div>
    </div>

    <div class="search-results" v-if="filteredData.length > 0 && !loader">
      <ul>
        <li v-for="(bot, index) in filteredData" :key="index">
          <a :href="url(bot)" class="search-result-link">
            <p>
              <span>{{ bot.name }}</span>
              <span class="username">&nbsp;-&nbsp;@{{ bot.username }}</span>
            </p>


            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#888" viewBox="0 0 48 48">
              <path
                d="M 41.470703 4.9863281 A 1.50015 1.50015 0 0 0 41.308594 5 L 27.5 5 A 1.50015 1.50015 0 1 0 27.5 8 L 37.878906 8 L 22.439453 23.439453 A 1.50015 1.50015 0 1 0 24.560547 25.560547 L 40 10.121094 L 40 20.5 A 1.50015 1.50015 0 1 0 43 20.5 L 43 6.6894531 A 1.50015 1.50015 0 0 0 41.470703 4.9863281 z M 12.5 8 C 8.3754991 8 5 11.375499 5 15.5 L 5 35.5 C 5 39.624501 8.3754991 43 12.5 43 L 32.5 43 C 36.624501 43 40 39.624501 40 35.5 L 40 25.5 A 1.50015 1.50015 0 1 0 37 25.5 L 37 35.5 C 37 38.003499 35.003499 40 32.5 40 L 12.5 40 C 9.9965009 40 8 38.003499 8 35.5 L 8 15.5 C 8 12.996501 9.9965009 11 12.5 11 L 22.5 11 A 1.50015 1.50015 0 1 0 22.5 8 L 12.5 8 z">
              </path>
            </svg>
          </a>
        </li>
      </ul>
    </div>
    <div class="search-results no-results" v-if="filteredData.length === 0 && !loader">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#888" viewBox="0 0 256 256">
        <path
          d="M198.24,62.63l15.68-17.25a8,8,0,0,0-11.84-10.76L186.4,51.86A95.95,95.95,0,0,0,57.76,193.37L42.08,210.62a8,8,0,1,0,11.84,10.76L69.6,204.14A95.95,95.95,0,0,0,198.24,62.63ZM48,128A80,80,0,0,1,175.6,63.75l-107,117.73A79.63,79.63,0,0,1,48,128Zm80,80a79.55,79.55,0,0,1-47.6-15.75l107-117.73A79.95,79.95,0,0,1,128,208Z">
        </path>
      </svg>
      <span>Not found!</span>
    </div>
  </div>
</template>
<script>
import { fetchBots } from '../../api/api.botsearch';

export default {
  name: 'BotSearch',
  components: {
  },
  props: ['searchPopup', 'user_id'],
  data() {
    return {
      isVisible: true,
      searchResults: [],
      loader: false,
      searchQuery: '',
      filteredData: [],
    }
  },
  async mounted() {
    this.initLoad()
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSearch();
      }
    });

    if (this.isVisible && this.$refs.searchInput) {
      this.$refs.searchInput.focus();
    }

    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target) && this.isVisible) {
        this.closeSearch();
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        this.initLoad()
        this.$refs.searchInput.focus();
      }
    });
  },
  methods: {
    async initLoad() {
      this.loader = true;
      await this.fetchBots(this.user_id);
      this.filteredData = this.searchResults;
      setTimeout(() => {
        this.loader = false;
      }, 300);
    },

    closeSearch() {
      if (this.isVisible) {
        this.isVisible = false;
        setTimeout(() => {
          this.$emit('close');
        }, 500);
      }
    },

    clearQuery() {
      this.searchQuery = '';
      this.filterData();
    },

    filterData() {
      this.loader = true;
      if (!this.searchQuery) {
        this.filteredData = this.searchResults;
      } else {
        this.filteredData = this.searchResults.filter((item) => {
          const searchLowerCase = this.searchQuery.toLowerCase();
          return item.name.toLowerCase().includes(searchLowerCase) ||
            item.username.toLowerCase().includes(searchLowerCase);
        });
      }
      this.loader = false;
    },

    async fetchBots(user_id) {
      const response = await fetchBots(user_id);
      this.searchResults = response;
    },

    url(bot) {
      return `https://platonbot.netlify.app/?bot_id=${bot.id}&user_id=${this.user_id}`;
    }
  },
}
</script>
<style scoped>
@import "../../assets/loader.css";

.loader-container {
  background: white;
}

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
  animation: slideUp 0.3s ease-out forwards;
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
  border-radius: 5px 5px 0 0;
  padding: 10px 10px 10px 15px;
  width: 100%;
  border-bottom: 1px solid #f3f3f3;
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
  cursor: pointer;
  outline: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.search-container button:hover {
  background-color: #f4f4f4;
}

.search-container svg {
  fill: #555;
  display: inline-block;
  transition: all 0.3s ease;
}

.search-container svg:hover {
  fill: #111;
}

.search-results {
  background-color: #fff;
  border-radius: 0 0 5px 5px;
  padding: 10px 10px 10px 15px;
  color: #2e363e;
  font-size: 17px;
  user-select: none;
  max-height: 300px;
  overflow-y: scroll;
}

.search-results ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-results li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #f3f3f3;
}

.search-results li:last-child {
  border-bottom: none;
}

.search-results a {
  color: #226ce6;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
  font-size: 17px;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  background-color: #fff;
  color: #888;
  height: 120px;
  font-size: 18px;
}

.search-results li {
  margin: 0;
  padding: 0;
}

.search-result-link {
  display: block;
  padding: 10px;
  border-bottom: 1px solid #f3f3f3;
  color: #226ce6;
  text-decoration: none;
  transition: all 0.3s ease;
}

.search-result-link:hover {
  background-color: #f4f4f4;
}

.search-result-link:last-child {
  border-bottom: none;
}

.search-result-link svg {
  fill: #888;
  display: none;
  transition: all 0.5s ease;
}

.search-result-link:hover svg {
  fill: #333;
  display: inline-block;
}

.username {
  color: #2166d6bb;
  font-size: 15px;
}
</style>
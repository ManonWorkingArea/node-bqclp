<template>
  <div class="flex flex-col justify-center items-center h-full">
    <ul class="flex flex-wrap justify-center" v-if="displayMode==='nav' || displayMode==='full'">
      <!-- Previous page button -->
      <li :class="{ 'opacity-50 cursor-not-allowed': activePage === 1 }">
        <button @click="handleButtonClick(activePage - 1)" :disabled="dataLoading || buttonClicked" class="block px-2 py-2 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <font-awesome-icon :icon="['fas','chevron-left']" class="text-gray-700 pl-1 pr-1 text-md"/>
        </button>
      </li>
      <!-- First page button -->
      <li v-if="activePage > 2" class="font-medium">
        <button @click="handleButtonClick(1)" :disabled="dataLoading || buttonClicked" class="block px-2 py-2 ml-1 mr-1 text-sm text-gray-700 rounded-md hover:bg-indigo-100">
          01
        </button>
      </li>
      <!-- Page buttons -->
      <li v-for="page in pages" :key="page" :class="{ 'bg-indigo-100 ml-1 mr-1 rounded-md border-indigo-500 text-indigo-600 font-semibold': activePage === page }" class="font-medium">
        <button @click="handleButtonClick(page)" :disabled="dataLoading || buttonClicked" class="block px-2 py-2 ml-1 mr-1 text-sm text-gray-700 rounded-md hover:bg-indigo-100">
          {{ page.toString().padStart(2, '0') }}
        </button>
      </li>
      <!-- Last page button -->
      <li v-if="activePage < totalPages - 1" class="font-medium">
        <button @click="handleButtonClick(totalPages)" :disabled="dataLoading || buttonClicked" class="block px-2 py-2 ml-1 mr-1 text-sm text-gray-700 rounded-md hover:bg-indigo-100">
          {{ totalPages.toString().padStart(2, '0') }}
        </button>
      </li>
      <!-- Next page button -->
      <li :class="{ 'opacity-50 cursor-not-allowed': activePage === totalPages }">
        <button @click="handleButtonClick(activePage + 1)" :disabled="dataLoading || buttonClicked" class="block px-2 py-2 rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <font-awesome-icon :icon="['fas','chevron-right']" class="text-gray-700 pl-1 pr-1 text-md"/>
        </button>
      </li>
    </ul>
    <div class="text-sm text-gray-400 text-center" v-if="displayMode==='summary' || displayMode==='full'">
      แสดง <span class="font-medium"><span class="text-gray-600">{{ startItem }}</span></span> ถึง <span class="font-medium"><span class="text-gray-600">{{ endItem }}</span></span> / <span class="font-medium"><span class="text-gray-600">{{ formatNumber(totalPages) }} </span></span> หน้า | จากข้อมูล <span class="font-medium"><span class="text-gray-600">{{ formatNumber(totalItems) }}</span></span> รายการ
    </div>
  </div>
</template>



<script>
import convertUtils from "@/plugins/convertUtils";
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    dataLoading: {
      type: Boolean,
      required: true,
    },
    displayMode: {
      type: String,
      required: true,
      default:'full'
    },
    totalPages: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    limitItems: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      activePage: this.currentPage, // Create a local data property
      buttonClicked: false
    };
  },
  computed: {
    pages() {
      if (window.innerWidth >= 600) {
        const startPage = Math.max(this.activePage - 2, 1);
        const endPage = Math.min(this.activePage + 2, this.totalPages);
        let pagesArray = [];

        for (let i = startPage; i <= endPage; i++) {
          pagesArray.push(i);
        }

        return pagesArray;
      } else {
        let startPage = Math.max(this.activePage - 1, 1);
        let endPage = Math.min(startPage + 2, this.totalPages);

        if (endPage - startPage < 2) {
          startPage = Math.max(endPage - 2, 1);
        }

        let pagesArray = [];

        for (let i = startPage; i <= endPage; i++) {
          pagesArray.push(i);
        }

        return pagesArray;
      }
    },
    startItem() {
      return (this.activePage - 1) * this.limitItems + 1;
    },
    endItem() {
      return Math.min(this.activePage * this.limitItems, this.totalItems);
    },
  },
  methods: {
    formatNumber(price) {
      return convertUtils.formatNumber(price,"short");
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;

      // Get the current searchQuery parameter from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get('searchQuery');

      // Create a new URL with the updated page and searchQuery parameters if they have values
      let queryParam = '';
      if (page > 1 && searchQuery) {
        queryParam = `?page=${page}&searchQuery=${searchQuery}`;
      } else if (page > 1) {
        queryParam = `?page=${page}`;
      } else if (searchQuery) {
        queryParam = `?searchQuery=${searchQuery}`;
      }

      const newUrl = `${window.location.pathname}${queryParam || ''}`;

      // Update the URL and emit the 'page-changed' event
      window.history.pushState({ path: newUrl }, '', newUrl);
      this.activePage = page;
      this.$emit('page-changed', page);
    },
    handleButtonClick(page) {
      if (!this.buttonClicked) {
        this.buttonClicked = true;
        this.goToPage(page);
        setTimeout(() => {
          this.buttonClicked = false;
        }, 1000);
      }
    },
  },
  watch: {
    currentPage(newPage) {
      this.activePage = newPage;
    },
    activePage(newActivePage) {
      this.$emit('page-changed', newActivePage);
    },
    '$route'() {
		// You can update this.router here if needed
		},
  },
  created() {
    const queryParams = new URLSearchParams(window.location.search);
    const storedPage = queryParams.get('page');
    if (storedPage) {
      const parsedPage = parseInt(storedPage);
      if (!isNaN(parsedPage)) {
        this.goToPage(parsedPage);
      }
    }
  },
};
</script>

<style>
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
  
  .pagination ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .pagination li {
    margin: 0 0.25rem;
  }
  
  .pagination button {
    display: block;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    background-color: white;
    color: #333;
    font-size: 0.875rem;
    text-align: center;
    cursor: pointer;
  }
  
  .pagination button:hover:not(.disabled) {
    background-color: #f7fafc;
  }
  
  .pagination button:active:not(.disabled) {
    background-color: #edf2f7;
  }
  
  .pagination li.active button {
    background-color: #667eea;
    color: white;
  }
  
  .pagination li.disabled button {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
  
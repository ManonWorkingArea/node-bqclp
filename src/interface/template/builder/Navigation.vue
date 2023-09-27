<template>
  <ul 
  class="flex z-10" 
  :class="[data.display === 'vertical' ? 'flex-col' : '', getAlignmentClass(), 'space-x-' + data.itemSpace]">
    <li
      class="relative custom-menu"
      v-for="(item, index) in menu"
      :key="index"
      @mouseenter="item.hovered = true; item.showSubMenu = true"
      @mouseleave="item.hovered = false; item.showSubMenu = false"
      :class="[
        'text-' + data.fontSize + 'px',
        'text-' + data.alignment,
        'flex-' + data.display,
        'space-x-' + data.itemSpace + 'px',
      ]"
    >
      <router-link
        :to="item.target"
        :class="getLinkClasses(item)"
      >
        {{ item.title }}
        <font-awesome-icon
          v-if="item.subMenu && item.subMenu.length > 0"
          :icon="['fas', 'chevron-down']"
          class="ml-1 w-3 h-3"
        />
      </router-link>
      <ul
        v-if="item.showSubMenu && item.subMenu && item.subMenu.length > 0"
        :class="data.display === 'vertical' ? 'mt-2' : 'absolute top-full left-0 mt-0 w-[150px] p-2 bg-white border border-gray-100 shadow-lg'"
      >
        <li
          v-for="(subitem, subindex) in item.subMenu"
          :key="subindex"
        >
          <router-link
            :to="subitem.target"
            class="block text-md text-gray-500 p-1 hover:text-indigo-800 hover:bg-gray-200"
            :class="getLinkClasses(item)"
          >
            {{ subitem.title }}
          </router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>



<script>
import { generateStyles } from '@/plugins/builder.js';
import storageManager from '@/plugins/storage';
export default {
    props: {
        data: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            config: storageManager.get('configs'),
            menu:[],
        }
    },
    async mounted() {
        try {
        await this.getPostData();
        } catch (error) {
        console.log(error);
        }
    },
    methods: {
        async getPostData() {
          try {
            const resAPI = await fetch(`https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/${this.data.menu}`, {
              method: 'GET',
              headers: {'Content-Type': 'application/json'},
            });
      
            const RestReturn = await resAPI.json();
            const savedLayout = RestReturn;
        
            if (savedLayout) {
              this.menu  = savedLayout.builder;
            }
          } catch (error) {
          console.log(error);
          }
        },
        getAlignmentClass() {
          if (this.data.alignment === 'left') {
            return 'justify-start';
          } else if (this.data.alignment === 'center') {
            return 'justify-center';
          } else if (this.data.alignment === 'right') {
            return 'justify-end';
          } else {
            return ''; // Default case or when alignment is not provided
          }
        },
        getLinkClasses(item) {
          const classes = [
            'font-medium',
            'text-[' + (item.fontSize || this.data.fontSize) + 'px]',
            'ml-[' + (item.itemSpace || this.data.itemSpace) + 'px]',
          ];

          if (item.hovered) {
            classes.push(this.data.hoverColor);
          } else {
            classes.push(item.fontColor || this.data.fontColor);
          }

          return classes.filter(Boolean).join(' ');
        },
    },
    computed: {
    styles() {
      return generateStyles(this.data);
    },
  },
};
</script>
<template>
  <div class="relative imageShowhome">
    <template v-if="data.canLink">
      <router-link :to="data.link" target="_blank" rel="noopener noreferrer" class="hover:bg-black hover:bg-opacity-20 hover:text-white">
        <img :src="data.url" :alt="data.alt" :class="[getHeaderClasses(), styles.classes]" :style="getImageStyle()" />
        <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
          <div class="absolute inset-0 bg-black bg-opacity-20"></div>
          <span class="text-white text-lg bg-black p-3">Click to open Link</span>
        </div>
      </router-link>
    </template>
    <template v-else-if="data.showHome">
      <router-link to="/" class="hover:bg-black hover:bg-opacity-20 hover:text-white">
        <img :src="data.url" :alt="data.alt" :class="[getHeaderClasses(), styles.classes]" :style="getImageStyle()" />
      </router-link>
    </template>
    <template v-else>
      <img :src="data.url" :alt="data.alt" class="w-full" :class="[getHeaderClasses(), styles.classes]" :style="getImageStyle()" />
    </template>
  </div>
</template>

  
  <script>
  import { generateStyles } from '@/plugins/builder.js';
  
  export default {
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    methods: {
      getHeaderClasses() {
        return [
          'text-' + this.data.color,
          'text-' + this.data.fontSize,
          'font-' + this.data.fontWeight,
          'text-' + this.data.align,
        ];
      },
      getImageStyle() {
        if (this.data.width) {
          return {
            width: this.data.width + 'px'
          };
        }
        return {};
      }
    },
    computed: {
      styles() {
        return generateStyles(this.data);
      },
    },
  };
  </script>
  
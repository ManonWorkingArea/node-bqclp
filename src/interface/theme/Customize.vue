<template>
  <div>
    <!-- Check if layout and its properties are defined before using them -->
    <Header v-if="layout && layout.selectedlayout" :headerLayout="layout.selectedlayout" :headerPosition="layout.selectedposition" :logo="{ type: layout.selectedlogotype, size: layout.logosize }" :userbar="{ type: layout.usermenutype, endpoint: layout.usermenuendpoint }" :topbar="{ show: true, bg: 'bg-black', color: 'text-white', columns: [{ text: 'fti.academy@gmail.com', url: 'mailto:fti.academy@gmail.com' }, { text: '01-23456789' }] }" />
  </div>
</template>

<script>
import storageManager from '@/plugins/storage';
import Header from "./HeaderCustomize.vue";

export default {
  components: { Header },
  data() {
    return {
      config: null, // Initialize config as null
      layout: null, // Initialize layout as null
    };
  },
  created() {
    // Fetch the data from storageManager and assign it to config and layout
    this.config = storageManager.get('configs');
    this.layout = storageManager.get('configs', 'layout');
  },
};
</script>

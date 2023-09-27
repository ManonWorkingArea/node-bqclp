<template>
  <div v-if="!$route.meta.fullscreen">
    <div v-if="isTopbarVisible && isLocalhost" class="bg-black px-2 py-1 flex justify-between items-center fixed top-0 w-full z-50">
      <div class="flex items-center">
        <h1 class="text-sm font-normal text-white">
          <font-awesome-icon :icon="['fas','globe']" class="text-white text-[14px] mr-2"/>
          {{ activeHostname }}
        </h1>
      </div>
      <div class="flex items-center">
        <select v-model="selectedHostname" class="block text-sm w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-400 rounded appearance-none focus:outline-none focus:shadow-outline">
          <option v-for="item in listItems" :key="item.hostname" :value="item.hostname">{{ item.hostname }}</option>
        </select>
        <button class="text-sm ml-2 px-2 py-2 bg-gray-700 text-white rounded" @click="setHostname">Set</button>
        <button class="text-sm ml-2 px-2 py-2 bg-gray-700 text-white rounded" @click="resetStorage">Reset</button>
        <button class="text-sm ml-2 px-2 py-2 bg-gray-700 text-white rounded" @click="hideTopbar">Hide</button>
      </div>
    </div>
    <button v-if="!isTopbarVisible && isLocalhost" class="text-sm ml-2 px-4 py-2 bg-gray-700 text-white rounded fixed bottom-2 left-0 z-50" @click="showTopbar"><font-awesome-icon :icon="['fas','globe']" class="text-white text-[14px] mr-2"/> Change Hostname</button>
  </div>
</template>

<script>
import storageManager from '@/plugins/storage';

export default {
  name: 'AdminTopbar',
  data() {
    return {
      listItems: [],
      selectedHostname: '',
      isTopbarVisible: false,
      activeHostname: storageManager.get('hostname'),
    };
  },
  async mounted() {
    // Fetch the list of hostnames and set the default selected option
    fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/hostname", {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
    .then(res => res.json())
    .then(data => {
      this.listItems = data;
      this.selectedHostname = this.activeHostname || this.listItems[0].hostname;
    })
    .catch(err => console.error(err));
  },
  computed: {
    isLocalhost() {
      return location.hostname === 'localhost' || location.hostname === '192.168.2.138';
    },
  },
  methods: {
    setHostname() {
      storageManager.set('hostname', this.selectedHostname);
      this.activeHostname = this.selectedHostname;
      this.resetStorage()
    },
    resetStorage() {
      storageManager.delete('plugins');
      storageManager.delete('configs');
      storageManager.delete('session');
      window.location.href = '/';
    },
    hideTopbar() {
      this.isTopbarVisible = !this.isTopbarVisible;
    },
    showTopbar() {
      this.isTopbarVisible = true;
    },
  },
};
</script>

<style>
</style>

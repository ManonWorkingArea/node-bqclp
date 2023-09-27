<script>
// Component
import Modal from '@/interface/modal/Session.vue';
import storageManager from '@/plugins/storage.js';

export default {
    inject: ['saltSecret'],
    data() {
      const rowRaw 		    = storageManager.get('session','role');
      const roleDecrypt 	= rowRaw
      return {
        selectSession:storageManager.get('session', 'current') === 'none' ? true : false,
        accessRole: roleDecrypt,
        accessSession: [],
        subColor:storageManager.get('configs',"siteSubStyle")
      }
    },
    components: {Modal},
    methods: {
      changeSession() {
        this.selectSession = true;
      },
      changeSessionTrigger(payload) {
        this.selectSession = payload;
      },
    },
    async mounted () {
      try {
        const access 		   = storageManager.get('session');
        this.accessSession  = access.current;
      } catch (error) {
        console.log(Error);
      }
    },
    computed: {
      flexClass() {
        return `flex-1 bg-${this.subColor}-100 border-b`
      },
      buttonClass() {
        return `ml-3 inline-flex items-center rounded-md border border-transparent bg-${this.subColor}-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-${this.subColor}-500 focus:outline-none focus:ring-2 focus:ring-${this.subColor}-400 focus:ring-offset-2`
      },
      headerClass() {
        return `text-1xl font-bold leading-7 text-${this.subColor}-900 sm:truncate sm:text-2xl sm:tracking-tight`
      },
      bqclp() {
        return storageManager.get('bqclp');
      },
    }
};
</script>

<template>
<div v-if="!$route.meta.fullscreen">
  <Modal v-if="this.selectSession" :isWindowsOpen="true" @change-session-trigger="changeSessionTrigger"/>

  <div :class="flexClass" v-if="this.accessRole=='admin'&&accessSession!='none'">
      <div class="pt-2">
        <div class="mx-auto max-w-7xl px-6 sm:px-6 lg:px-6">
          <div>
            <div>
              <nav class="hidden sm:flex" aria-label="Breadcrumb">
                <ol role="list" class="flex items-center space-x-4">
                  <li>
                  <div class="flex items-center">
                    <a aria-current="page" class="text-sm font-medium text-gray-400 hover:text-gray-500">คุณกำลังจัดการข้อมูลจากฐานข้อมูล</a>
                  </div>
                  </li>
                </ol>
              </nav>
            </div>

            <div class="grid grid-cols-2 mt-1 md:flex md:items-center md:justify-between pb-2">
              <div class="col-span-1 min-w-0 flex-1">
                <h2 :class="headerClass">
                  <font-awesome-icon :icon="['fas','database']" class="text-gray-500 text-[24px]"/>
                  {{ accessSession.siteName || 'Select Session First' }}
                  <span v-if="bqclp && bqclp.user_profile" class="font-normal text-lg text-gray-500">
                    <font-awesome-icon :icon="['fas','user']" class="text-gray-500 mr-2 ml-2 text-md"/>
                    {{ bqclp.user_profile }}
                  </span>
                </h2>
              </div>
              <div class="col-span-1 mt-0 flex flex-shrink-0 md:mt-0 md:ml-4">
                <button @click="changeSession" type="button" :class="buttonClass">
                  สลับฐานข้อมูล 
                  <font-awesome-icon :icon="['fas','caret-down']" class="text-gray-200 ml-3 pl-3 border-l "/> 
                </button>
              </div>
            </div>
            

          </div>
        </div>
      </div>
  </div>
</div>
</template>
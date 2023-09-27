<template>

    <FileBrowser 
    v-if="VideoBrowserOpen" 
    :isWindowsOpen="true" 
    :callbackFunction="'video'"
    :allowFileType="['mp4']" 
    @file-browser-trigger="changeVideoTrigger" 
    @file-browser-callback="selectVideoTrigger"/>

    <FileBrowser 
    v-if="DocumentBrowserOpen" 
    :isWindowsOpen="true" 
    :callbackFunction="'document'"
    :allowFileType="['pdf','doc','docx','xls','xlsx','csv']" 
    @file-browser-trigger="changeDocumentTrigger" 
    @file-browser-callback="selectDocuemntTrigger"/>

    <SetContentSource 
    v-if="SetContentSourceModal" 
    :isWindowsOpen="true" 
    :setContentTriggerObj="getContentTriggerObj"
    :contentType="this.initialSelectPlayerItemType" 
    :contentOriginal="getContentTriggerObj" 
    @set-content-trigger="SetContentTrigger" 
    @set-content-event="SetContentSource"/>

    <div class="bg-white">
        <!-- Header Section -->
        <div class="border-b border-gray-200">
            <div class="grid grid-cols-3">
            <div class="col-span-1 p-2">
                <div class="flex justify-left items-left">
                    <div class="relative inline-block text-left">
                        <div>
                            <select v-model="type" id="content-type" class="mt-1 block w-full p-2 rounded border border-gray-300 focus:ring focus:ring-indigo-200" :disabled="selectPlayerItem.type === 'folder'" @click.stop>
                                <option value="" disabled>กรุณาเลือก</option>
                                <template v-for="(typeItem) in playerType" :key="typeItem.code">
                                <option :value="typeItem.code">{{ typeItem.name }}</option>
                                </template>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-1 p-2 flex justify-center items-center">
                <p class="text-center">{{ selectPlayerItem.duration }} </p>
                <!-- <pre>{{ selectPlayerItem }}</pre> -->
            </div>
            <div class="col-span-1 p-2 flex justify-end items-center">
                <button 
                    @click.stop="cancelUpdate"
                    type="button" 
                    class="mr-1 border border-transparent bg-white shadow-sm border border-gray-400 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-100">
                    <font-awesome-icon :icon="['fas','times']" class="text-gray-600 pr-2"/> ปิด 
                </button>
            </div>
            </div>
        </div>


        <div v-if="['demand', 'streaming', 'youtube'].includes(selectPlayerItem.type) || ['demand', 'streaming', 'youtube'].includes(type)">

            <div class="relative">
                <template v-if="selectPlayerItem.video">
                    <video controls class="w-full h-60" v-if="type === 'demand' || initialSelectPlayerItemType === 'demand'">
                      <source :src="selectPlayerItem.video.desktop" type="video/mp4">
                      Your browser does not support the video tag.
                    </video>
                    
                    <video controls class="w-full h-60" v-if="type === 'streaming' || initialSelectPlayerItemType === 'streaming'">
                      <source :src="selectPlayerItem.video.streaming" type="application/x-mpegURL">
                      Your browser does not support the video tag.
                    </video>
                    
                    <iframe width="100%" height="300" v-if="type === 'youtube' || initialSelectPlayerItemType === 'youtube'" :src="selectPlayerItem.video.youtube" frameborder="0" allowfullscreen></iframe>
                  </template>
                  
                <template v-else>
                    <div class="bg-gray-100 min-h-[200px] h-full flex justify-center items-center rounded text-xs">
                    <span class="bg-black text-white p-2">!! ไม่มีเนื้อหา</span>
                    </div>
                </template>

                <div class="absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <button @click.stop="handleButtonClick(buttonType)" class="bg-yellow-500 hover:bg-yellow-600 text-white text-md px-2 py-1 rounded">
                      <font-awesome-icon :icon="['fas','folder-open']" class="pt-2 text-white text-md"/><br>
                      <span class="pt-2 text-sm">{{ buttonType !== 'youtube' && buttonType !== 'streaming' ? 'เลือกวีดีโอ' : 'เปลี่ยนลิงค์' }}</span>
                    </button>
                    <button @click.stop="removeVideo" class="ml-2 bg-red-500 hover:bg-red-600 text-white text-md px-2 py-1 rounded">
                      <font-awesome-icon :icon="['fas','trash']" class="pt-2 text-white text-md"/><br>
                      <span class="pt-2 text-sm">ลบวีดีโอ</span>
                    </button>
                </div>

            </div>

            <!-- Footer Section (Grid Like Header) -->
            <div class="border-t border-gray-200 pb-1">
                <div class="grid grid-cols-1">
                    <div class="col-span-1 p-2">
                    <span class="font-medium text-gray-500">
                        <font-awesome-icon :icon="['fas','video']" class="text-rose-600" :class="selectPlayerItem.video===undefined ? 'text-rose-600' : 'text-lime-600'"/>
                        <span v-if="(selectPlayerItem.video===undefined)" class="ml-2 bg-blue-100 pl-2 pr-2 rounded text-xs">ไม่มีเนื้อหา</span>
                        <span v-if="(selectPlayerItem.video!=undefined && selectPlayerItem.type==='demand')" class="ml-2 bg-blue-100 pl-2 pr-2 rounded text-xs">{{ selectPlayerItem.video.desktop }}</span>
                        <span v-if="(selectPlayerItem.video!=undefined && selectPlayerItem.type==='streaming')" class="ml-2 bg-blue-100 pl-2 pr-2 rounded text-xs">{{ selectPlayerItem.video.streaming }}</span>
                        <span v-if="(selectPlayerItem.video!=undefined && selectPlayerItem.type==='youtube')" class="ml-2 bg-blue-100 pl-2 pr-2 rounded text-xs">{{ selectPlayerItem.video.youtube }}</span>
                    </span>
                    </div>
                </div>
            </div>

        </div>

        <div v-if="['document'].includes(selectPlayerItem.type) || ['document'].includes(type)">
            <template v-if="selectPlayerItem.content">

                <div 
                class="bg-gray-100 min-h-[100px] h-full flex justify-center items-center rounded text-xs" 
                v-if="type === 'document' || initialSelectPlayerItemType === 'document'">
                    {{ selectPlayerItem.content }}
                </div>

                <div 
                class="bg-gray-100 min-h-[100px] h-full flex justify-center items-center rounded text-xs" 
                v-if="type === 'exam' || initialSelectPlayerItemType === 'exam'">
                    {{ selectPlayerItem.content }}
                </div>
                
            </template>
              
            <template v-else>
                <div class="bg-gray-100 min-h-[100px] h-full flex justify-center items-center rounded text-xs"></div>
            </template>

            <div class="absolute top-28 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <button @click.stop="handleButtonClick(buttonType)" class="bg-yellow-500 hover:bg-yellow-600 text-white text-md px-2 py-1 rounded">
                  <font-awesome-icon :icon="['fas','folder-open']" class="pt-2 text-white text-md"/><br>
                  <span class="pt-2 text-sm">{{ buttonType === 'document' ? 'เลือกไฟล์' : 'เลือกข้อสอบ' }}</span>
                </button>
                <button @click.stop="removeVideo" class="ml-2 bg-red-500 hover:bg-red-600 text-white text-md px-2 py-1 rounded">
                  <font-awesome-icon :icon="['fas','trash']" class="pt-2 text-white text-md"/><br>
                  <span class="pt-2 text-sm">ลบข้อมูล</span>
                </button>
            </div>

        </div>

      <div class="border-t border-gray-200 grid grid-cols-2 gap-4 px-5 py-3">
        <div class="col-span-1">
          <label for="name" class="block text-base font-medium text-gray-900">ชื่อบทเรียน</label>
          <input
            v-model="name"
            type="text"
            autocomplete="name"
            class="mt-1 block w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
          />
        </div>
  
        <div class="col-span-1">
          <label for="duration" class="block text-base font-medium text-gray-900">ความยาว (นาที)</label>
          <input
            v-model="duration"
            type="text"
            autocomplete="duration"
            class="mt-1 block w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
          />
        </div>
        <div class="col-span-2">
          <label for="slug" class="block text-base font-medium text-gray-900">คำอธิบาย</label>
          <div class="">
            <textarea v-model="description" rows="3" cols="20" class="mt-1 block w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"></textarea>
          </div>
        </div>
      </div>
  
      <div class="bg-gray-50 border-t border-gray-200 p-2 text-right flex justify-between">
        <button 
          @click.stop="deleteItem"
          type="button" 
          class="border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          <font-awesome-icon :icon="['fas','trash']" class="text-gray-200 pr-2"/> ลบ
        </button>
  
        <div>
          <button 
            @click.stop="saveChanges"
            type="button" 
            class="border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <font-awesome-icon :icon="['fas','save']" class="text-gray-200 pr-2"/> บันทึก
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>

    import SetContentSource   from '@/interface/modal/SetContentSource.vue';
    import FileBrowser from '@/interface/modal/FileBrowser.vue';

    import {player} from "@/master/type";

  export default {
    props: {
        selectPlayerItem: {
            type: Object,
            required: true,
        },
    },
    
    data() {
      return {
        playerType:player,
        id: this.selectPlayerItem._id,
        name: this.selectPlayerItem.name,
        duration: this.selectPlayerItem.duration,
        description: this.selectPlayerItem.description,
        type: this.selectPlayerItem.type,

        VideoBrowserOpen: false,
        SetContentSourceModal:false,
        DocumentBrowserOpen:false,

        initialSelectPlayerItemType: this.selectPlayerItem.type,
        buttonType: this.selectPlayerItem.type,
      };
    },
    components: {
      FileBrowser,
      SetContentSource,
    },
    computed: {
        getContentTriggerObj() {
            if (this.selectPlayerItem.type === 'streaming') {
                return this.selectPlayerItem.video.streaming;
            } else if (this.selectPlayerItem.type === 'youtube') {
                return this.selectPlayerItem.video.youtube;
            } else {
                return null;
            }
        },
    },
    watch: {
        type(newType) {
            this.initialSelectPlayerItemType = newType;
            this.buttonType = newType;
        },
    },
    methods: {
        saveChanges() {
            const updatedItem = {
                id: this.id,
                name: this.name,
                duration: this.duration,
                description: this.description,
                type: this.type,
            };
            this.$emit('update-select-player-item', updatedItem);
        },
        deleteItem() {
            const updatedItem = {
                id: this.id,
            };
            this.$emit('delete-select-player-item', updatedItem);
        },
        removeVideo() {
            const updatedItem = {
                id: this.id,
            };
            this.$emit('remove-select-player-item', updatedItem);
        },
        cancelUpdate() {
            this.$emit('cancel-update');
        },
        handleButtonClick(type) {
            if (type === 'demand') {
                this.OpenVideoBrowser();
            } else if (type === 'document') {
                this.OpenDocumentBrowser();
            } else {
                this.openSetContentSource(this.selectPlayerItem.videoContent, type);
            }
        },
        OpenDocumentBrowser() {
            this.DocumentBrowserOpen = true;
        },
        changeDocumentTrigger(payload) {
            this.DocumentBrowserOpen = payload;
        },
        selectDocuemntTrigger(payload) {
            console.log("selectDocuemntTrigger",payload);
            if(payload!=undefined) {
                const updatedItem = {
                    id: this.id,
                    file: payload.file,
                };
                this.$emit('update-player-document', updatedItem);
            }
        },
        OpenVideoBrowser() {
            this.VideoBrowserOpen = true;
        },
        changeVideoTrigger(payload) {
            this.VideoBrowserOpen = payload;
        },
        selectVideoTrigger(payload) {
            console.log("selectVideoTrigger",payload);
            if(payload!=undefined) {
                const updatedItem = {
                    id: this.id,
                    file: payload.file,
                    duration: payload.duration,
                    thumbnail: payload.thumbnail,
                };
                this.$emit('update-player-video', updatedItem);
            }
        },
        openSetContentSource(item,type) {
            this.setContentTriggerObj = item;
            this.contentType = type;
            this.SetContentSourceModal = true;
        },
        SetContentTrigger(payload) {
            this.SetContentSourceModal = payload;
        },
        SetContentSource(payload) {
            console.log("SetContentSource");
            if(payload!=undefined) {
                const updatedItem = {
                    id: this.id,
                    type: this.type,
                    file: payload.contentURL,
                };
                this.$emit('update-player-video-url', updatedItem);
            }
        },
    },
  };
  </script>
  
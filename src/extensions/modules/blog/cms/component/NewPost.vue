<script>
import Subhead from '@/interface/template/outline/Subhead.vue';
import storageManager from '@/plugins/storage';
import FileBrowser          from '@/interface/modal/FileBrowser.vue';

export default {
  name: 'ContactUs',
  inject: ['apiServer'],
  data() {
    return {
        dataItem: this.$route.params.id,
        title: '',
        slug: 'newpage-slug',
        content: '',
        display: 'single',
        type: 'page',
        owner: '',
        configs: storageManager.get('configs'),
        session: storageManager.get('session'),
        activeBlock: false,
        editing: undefined,
        isComment: undefined,
        isCounter: undefined,
        isMenu: undefined,
        layout: undefined,
        parent:this.$route.params.id,
        FileBrowserOpen: false,
        parentList: [],
      searchTerm: '',
      showDropdown: false,
    }
  },
  components: {
    Subhead,FileBrowser
  },
  computed: {
  filteredParentList() {
    return this.parentList.filter((parent) =>
      parent.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  },
},
  methods: {
    OpenFileBrowser(index)
    {
      this.selectedSlideItemIndex = index;
      this.FileBrowserOpen = true;
    },
    changeFileTrigger(payload) {
      this.FileBrowserOpen = payload;
    },
    selectFileTrigger(payload) {
      console.log("selectFileTrigger");
      if(payload!=undefined) {
        this.selectCourseCover = payload;
        console.log("selectFileReturnFunction",payload.file)
        this.feature_image = payload.file
        this.selectedSlideItemIndex = undefined;
      }
    },
    selectParent(parent) {
      console.log('Selected parent:', parent);
      this.parent = parent
      this.showDropdown = false;
    },
    async getData() {
      if (storageManager.get('session', 'login')) {
        try {
          this.loading_sources = false;

          const resAPI = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/query", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              method: 'find',
              args: [
                { $and: [{ owner: this.session.current._id,type: 'page' }] }
              ]
            })
          });

          const RestReturn  = await resAPI.json();
          this.parentList   = RestReturn;
          this.loading_sources = true;

        } catch (error) {
          console.log(error)
        }
      }
    },
    async addPost() {
      try {
        this.activeBlock = true;
        const resAPI = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/", {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            data: {
                title: this.title,
                slug: this.slug,
                content: this.content,
                display: this.display,
                type: 'post',
                isComment: this.isComment,
                isCounter: this.isCounter,
                isMenu: this.isMenu,
                status: this.status,
                authen: this.authen,
                parent: this.parent._id,
                feature_image: this.feature_image,
                owner: this.session.current._id,
                builder: [],
            },
            options: {
              uniqueFields: [
                ["slug"]
              ]
            }
          })
        });
        const finalRes   = await resAPI.json();
        console.log(finalRes);
        this.$router.replace(`/cms/edit/${finalRes._id}`);
      } catch (error) {
        console.log(error)
      }
    }
  },
  setup() {
  },
  async mounted() {
    try {
        await this.getData();
        const parentId = this.$route.params.id;
        const parent = this.parentList.find((item) => item._id === parentId);
        if (parent) {
        this.parent = parent;
        }
    } catch (error) {
        console.log(Error);
    }
},

}
</script>

<template>

    <Subhead
      :navigation="
      [
      {
        name: 'ย้อนกลับ',
        link: '/cms/post/' + this.dataItem,
        style: 'chevron-left',
        class: 'default-btn',
        visible: true,
        type: 'button',
      },
      ]"
    />

    <FileBrowser class="z-[9999]"
    v-if="FileBrowserOpen" 
    :isWindowsOpen="true" 
    :callbackFunction="'cover'"
    :allowFileType="['jpg','gif','png','jpeg']" 
    @file-browser-trigger="changeFileTrigger" 
    @file-browser-callback="selectFileTrigger"/>

  <div class="mt-8 mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
    <div class="flex items-center space-x-5 w-full">
      <div class="w-full">
        <input 
          v-model="title" 
          type="text" 
          name="title" 
          id="title" 
          autocomplete="title" 
          class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 text-lg" 
          placeholder="Title"
        >
        <div>
          <div class="mt-3 flex items-center h-[50px] bg-gray-200 rounded-md p-4 pl-5 pr-5">
            <span class="text-gray-500 mr-3 border-r border-gray-300 pr-3"><i class="fas fa-home"></i></span>
            <span class="text-green-500 mr-2"><i class="fas fa-lock"></i></span>
            <p class="hidden md:block text-gray-700">https://<span class="text-gray-400">{{ session.current.hostname }}</span>/cms/read/</p>
            <template v-if="!editing && slug">
              <p class="pl-0 ml-0 text-green-600">{{ slug }}</p>
              <button @click="editing = true" class="ml-2"><i class="w-3 h-3 fas fa-pencil-alt text-gray-500"></i></button>
            </template>
            <template v-else>
              <input v-model="slug" type="text" class="slug-input p-1 rounded-sm border border-gray-300 focus:outline-none">
              <button @click="editing = false" class="ml-2"><i class="w-4 h-4 fas fa-save text-gray-500"></i></button>
            </template>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div class="mx-auto mt-4 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
    <div class="space-y-6 lg:col-span-2 lg:col-start-1">


        <div class="bg-white shadow sm:rounded-lg p-4">
          <h2 id="applicant-information-title" class="text-lg font-medium leading-6 text-gray-900">Page Content</h2>
      
      
          <label class="popup-label block mt-3 font-semibold">การแสดงผล</label>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-4 sm:col-span-1 flex items-start">
              <label for="isComment" class="flex items-center">
                <input
                  v-model="isComment"
                  type="checkbox"
                  id="isComment"
                  class="rounded-sm border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
                <div class="ml-3">
                  <label for="isComment" class="block text-md font-medium text-gray-700">Comment</label>
                  <p class="text-xs text-gray-500">Enable comments for the page</p>
                </div>
              </label>
            </div>
          
            <div class="col-span-4 sm:col-span-1 flex items-start">
              <label for="isCounter" class="flex items-center">
                <input
                  v-model="isCounter"
                  type="checkbox"
                  id="isCounter"
                  class="rounded-sm border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
                <div class="ml-3">
                  <label for="isCounter" class="block text-md font-medium text-gray-700">Visitor Counter</label>
                  <p class="text-xs text-gray-500">Display a visitor counter on the page</p>
                </div>
              </label>
            </div>
          
            <div class="col-span-4 sm:col-span-1 flex items-start">
              <label for="isMenu" class="flex items-center">
                <input
                  v-model="isMenu"
                  type="checkbox"
                  id="isMenu"
                  class="rounded-sm border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
                <div class="ml-3">
                  <label for="isMenu" class="block text-md font-medium text-gray-700">Menu</label>
                  <p class="text-xs text-gray-500">Include the page in the site navigation menu</p>
                </div>
              </label>
            </div>
          
          </div>
          
        </div>

    </div>

    <section aria-labelledby="timeline-title" class="lg:col-span-1 lg:col-start-3">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="p-3">
          <h2 id="timeline-title" class="text-lg font-medium text-gray-900">Option</h2>
        </div>
  
        <div class="relative w-full">
          <div class="aspect-w-16 aspect-h-6">
            <div class="absolute inset-0 flex items-center justify-center cursor-pointer" @click="OpenFileBrowser">
              <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-400" v-if="!feature_image">No image selected</span>
                <img v-else :src="feature_image" alt="Selected Image" class="object-cover object-center w-full h-full" />
              </div>
              <div class="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100">
                <div class="absolute inset-0 bg-black bg-opacity-20"></div>
                <span class="text-white bg-black p-2"><i class="fas fa-upload text-white text-lg mr-2"></i> Click to select an image</span>
              </div>
            </div>
          </div>
      </div>
  
        <div class="p-3">
          <div class="mt-3 flow-root">
            <!-- Checkbox -->
            <div class="flex items-center space-x-2">
              <input type="checkbox" v-model="status" class="form-checkbox text-blue-500 h-4 w-4">
              <label for="status" class="text-gray-700">เผยแพร่</label>
            </div>
            <div class="flex items-center space-x-2">
              <input type="checkbox" v-model="authen" class="form-checkbox text-blue-500 h-4 w-4">
              <label for="authen" class="text-gray-700">สำหรับสมาชิก</label>
            </div>
          </div>
  
          <!-- Date -->
          <div class="mt-4 text-gray-700">Created: 2023-05-24 | Updated: 2023-05-25</div>
  
          <!-- Parent Page Dropdown -->
          <div class="mt-4">
            <label for="parent-page" class="block text-sm font-medium text-gray-700">Parent Page</label>
            <div class="relative">
                <input
                  v-model="searchTerm"
                  @input="showDropdown = true"
                  type="text"
                  id="parent-page-search"
                  name="parent-page-search"
                  class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 text-lg"
                  placeholder="Search parent page..."
                >
                <ul v-if="showDropdown" class="absolute z-10 w-full bg-white border border-gray-300 mt-1 py-1 text-sm rounded-md shadow-sm">
                  <li
                    v-for="parent in filteredParentList"
                    :key="parent._id"
                    @click="selectParent(parent)"
                    class="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {{ parent.title }}
                  </li>
                </ul>
                <div v-if="parent" class="mt-2 text-gray-500">
                  Selected Parent: <span class="font-semibold"> {{ parent.title }} </span>
                </div>
              </div>
          </div>
        </div>
  
        <!-- Footer -->
        <div class="mt-2 bg-gray-100 rounded-md p-4 flex justify-between items-center">
          <div class="flex">
            <button
              @click.prevent="addPost"
              type="button"
              class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              <i class="fas fa-pencil text-black text-[12px] mr-2"></i> บันทึกข้อมูล
            </button>
          </div>
          <div class="flex">
            <a
              href="#"
              class="inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              <i class="fas fa-trash text-black text-[12px] mr-2"></i> ลบหน้านี้
            </a>
          </div>
        </div>
      </div>
    </section>
    
  </div>
</template>
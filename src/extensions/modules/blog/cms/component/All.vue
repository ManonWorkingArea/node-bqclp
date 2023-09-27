 <script>
import feather from 'feather-icons';
import Loader from '@/interface/template/Loader.vue';
import Subhead from '@/interface/template/outline/Subhead.vue';
import storageManager from '@/plugins/storage';
import convertUtils from "@/plugins/convertUtils";
import Preview from '@/interface/template/Preview.vue';

import CustomConfirmation   from '@/utils/Confirmation.vue';

export default {
  
  data() {
    const accessToken = storageManager.get('session', 'token');
    const configs = storageManager.get('configs');
    const session = storageManager.get('session');

    const currentTheme = session.current.theme || {}; // Ensure current.theme is defined
    const selectedHome = currentTheme.homepage || '';
    const selectedHeader = currentTheme.header || '';
    const selectedFooter = currentTheme.footer || '';
    const selectedNavigator = currentTheme.navigator || '';

    return {
      accessToken,
      configs,
      session,
      listItems: [],
      selectedHome,
      selectedHeader,
      selectedFooter,
      selectedNavigator,
      loading_sources: true,
      showPopup: false,
      limitItem: 100,
      notificationCount: 2,
      currentPage: 1,
      filterTypes: [
        { name: 'หน้าเว็บ', value: 'page', icon: 'file' },
        { name: 'แบบฟอร์ม', value: 'form', icon: 'file-alt' },
        { name: 'ดีไซน์', value: 'layout', icon: 'pencil-ruler' },
        { name: 'เมนู', value: 'menu', icon: 'list' }
      ],
      selectedTypes: [],
      dataItem: '',
      previewVisible: false,
      confirmationMessage: '',
      confirmationHeader: '',
      showConfirmation: false,
      deletionData: null,
    };
  },
  components: {
    Loader,
    Subhead,
    Preview,
    CustomConfirmation
  },
  methods: {// Remove Function
    //
    removeItem(itemIndex) {
      this.confirmationMessage = 'คุณต้องการลบเนื้อหา (Page) นี้ ?';
      this.confirmationHeader = 'ยืนยันการทำรายการ';
      this.deletionData = {
        itemIndex
      };
      this.showConfirmation = true;
    },
    confirmRemoveItem() {
      const { itemIndex } = this.deletionData;
      console.log("Delete", itemIndex);
      this.deleteData(itemIndex);
      this.handleConfirmCancel();
    },
    handleConfirmation() {
      if (this.deletionData) {
        this.confirmRemoveItem(); // Corrected function name
      }
    },
    handleConfirmCancel() {
      this.deletionData = null;
      this.confirmationMessage = '';
      this.confirmationHeader = '';
      this.showConfirmation = false;
    },
    async deleteData(id) {
      if(storageManager.get('session','login')) {
        try {
          this.loading_sources = false;
          console.log("id",id)
          const resAPI = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/" + id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
          });
          console.log(await resAPI);
          this.loading_sources = true;
          await this.getData();

        } catch (error) {
          console.log(error)
        }
      }
    },
    //
    // Remove Function
    showPreview(id) {
      this.dataItem = id
      this.previewVisible = true;
    },
    hidePreview() {
      this.previewVisible = false;
    },
    openPopup() {
      this.showPopup = true;
    },
    
    savePopup() {
      const layouts = {
        homepage: this.selectedHome,
        header: this.selectedHeader,
        footer: this.selectedFooter,
        navigator: this.selectedNavigator
      };

      this.changeLayout(layouts);
      this.cancelPopup();
    },
    
    cancelPopup() {
      this.showPopup = false;
    },
    formatThaidate(date) {
      return convertUtils.toThaiDatetime(date, "short");
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
            {
              $and: [
                { owner: this.session.current._id },
                { type: { $in: ['page', 'form', 'layout', 'menu'] } },
              ],
            },
          ],
          paging: { page: this.currentPage, limit: this.limitItem },
        }),
      });

      const RestReturn = await resAPI.json();
      this.listItems = RestReturn.data;

      for (const item of this.listItems) {
        if (item.type === 'form') {
          item.count = await this.countFormPost(item._id, item.destination);
        }
      }

      console.log(this.listItems);

      this.loading_sources = true;
    } catch (error) {
      console.log(error);
    }
  }
},
async countFormPost(formID,formDestination) {
  if (storageManager.get('session', 'login')) {
    try {
      this.loading_sources = false;

      const resAPI = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/"+formDestination+"/count", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'find',
          args: [{ formID: formID }],
          paging: { page: this.currentPage, limit: this.limitItem },
        }),
      });

      const RestReturn = await resAPI.json();
      const count = RestReturn.count;
      this.loading_sources = true;
      return count;
    } catch (error) {
      console.log(error);
    }
  }
},

    async changeLayout(layouts) {
      try {
        this.activeBlock = true;

        const response = await fetch(
          `https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/hostname/${this.session.current._id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: {
                theme: layouts
              }
            })
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          this.$swal({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            icon: 'success',
            title: 'บันทึกข้อมูลหน้า Home',
            text: 'บันทึกข้อมูลสำหรับหน้า Home สำเร็จแล้ว',
          });

          this.activeBlock = false;
          const session = {
            current: data,
          };
          storageManager.update('session', session);
          console.log(data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async addPost(post) {
      try {
        this.activeBlock = true;
        const resAPI = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/", {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            data: {
              ...post,
              owner: this.session.current._id,
            },
            options: {
              uniqueFields: [
                ["slug"]
              ]
            }
          })
        });
        const finalRes = await resAPI.json();
        console.log(finalRes);
        await this.getData();
      } catch (error) {
        console.log(error)
      }
    },
    duplicateItem(post) {
      const clonedPost = { ...post };
      delete clonedPost._id;
      clonedPost.slug = `${clonedPost.slug}-copy`;
      clonedPost.status = false;

      let counter = 1;
      let originalTitle = clonedPost.title;

      while (this.isTitleExists(clonedPost.title)) {
        clonedPost.title = `${originalTitle} (Copy ${counter})`;
        clonedPost.slug = `${clonedPost.slug}-${counter}`;
        counter++;
      }

      this.addPost(clonedPost);
    },

    isTitleExists(title) {
      return this.listItems.some(item => item.title === title);
    },
    updated() {
      feather.replace();
    },
  },
  async mounted() {
    try {
      await this.getData();
    } catch (error) {
      console.log(Error);
    }
  },
  computed: {
    filteredListItems() {
      if (this.selectedTypes.length === 0) {
        const sortedItems = [...this.listItems];
        sortedItems.sort((a, b) => {
          if (a.type === 'page') {
            return -1;
          } else if (a.type === 'form' && b.type === 'layout') {
            return -1;
          } else if (a.type === 'layout' && b.type === 'form') {
            return 1;
          } else {
            return 0;
          }
        });

        const mappedItems = sortedItems.map(item => ({
          ...item,
          isHome: item._id === this.selectedHome
        }));

        const homeItemIndex = mappedItems.findIndex(item => item.isHome === true);

        if (homeItemIndex !== -1) {
          // Move the item with isHome = true to the first position
          const homeItem = mappedItems.splice(homeItemIndex, 1)[0];
          mappedItems.unshift(homeItem);
        }

        return mappedItems;
      } else {
        const sortedItems = [...this.listItems];
        sortedItems.sort((a, b) => {
          if (this.selectedTypes.includes(a.type) && this.selectedTypes.includes(b.type)) {
            if (a.type === 'page') {
              return -1;
            } else if (a.type === 'form' && b.type === 'layout') {
              return -1;
            } else if (a.type === 'layout' && b.type === 'form') {
              return 1;
            } else {
              return 0;
            }
          } else if (this.selectedTypes.includes(a.type)) {
            return -1;
          } else if (this.selectedTypes.includes(b.type)) {
            return 1;
          } else {
            return 0;
          }
        });

        const filteredItems = sortedItems.map(item => ({
          ...item,
          isHome: item._id === this.selectedHome
        })).filter(item => this.selectedTypes.includes(item.type));

        const homeItemIndex = filteredItems.findIndex(item => item.isHome === true);

        if (homeItemIndex !== -1) {
          // Move the item with isHome = true to the first position
          const homeItem = filteredItems.splice(homeItemIndex, 1)[0];
          filteredItems.unshift(homeItem);
        }

        return filteredItems;
      }
    },
    filteredPageItems() {
      return this.listItems.filter(item => item.type === 'page' || item.type === 'form');
    },
    filteredLayoutItems() {
      return this.listItems.filter(item => item.type === 'layout');
    },
    filteredMenuItems() {
      return this.listItems.filter(item => item.type === 'menu');
    }
  },
}
</script>

<template>
  <div v-if="!loading_sources" class="text-center">
    <Loader/>
  </div>
  <Subhead v-if="loading_sources" 
    :navigation="
    [
      {
        name: 'เพิ่ม Page',
        link: '/cms/add',
        style: 'plus',
        class: 'primary-btn',
        visible: true,
        type: 'button',
      },
      {
        name: 'ตั้งค่าการแสดงผล',
        function: 'openPopup',
        style: 'home',
        class: 'primary-btn',
        visible: true,
        type: 'button',
      },
    ]"
    @openPopup="openPopup"
  />

  <custom-confirmation
  v-if="showConfirmation"
  :message="confirmationMessage"
  :header="confirmationHeader"
  @confirm="handleConfirmation"
  @cancel="handleConfirmCancel"
  ></custom-confirmation>

  <Preview :visible="this.previewVisible" :data-item="this.dataItem" @close="hidePreview"></Preview>

  <div v-if="showPopup" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <!-- Popup -->
    <div class="bg-white p-8 rounded-md">
      <h2 class="text-lg font-semibold mb-4">ตั้งค่าการแสดงผลหน้า Home</h2>

      <div class="p-3 border border-b-0 border-gray-200">
        <div class="mb-4">
          <label class="font-semibold">ส่วนหัว:</label>
          <select v-model="selectedHeader" class="block w-full mt-1">
            <option value="" disabled selected>เลือกเลย์เอาต์ส่วนหัว</option>
            <option v-for="item in filteredLayoutItems" :key="item._id" :value="item._id">{{ item.title }}</option>
          </select>
        </div>
      </div>

      <div class="p-3 border border-b-0 border-gray-200">
        <div class="mb-4">
          <label class="font-semibold">เมนู:</label>
          <select v-model="selectedNavigator" class="block w-full mt-1">
            <option value="" disabled selected>เลือกเมนูหลัก</option>
            <option v-for="item in filteredMenuItems" :key="item._id" :value="item._id">{{ item.title }}</option>
          </select>
        </div>
      </div>

      <div class="p-3 border border-b-0 border-gray-200">
        <div class="mb-4">
          <label class="font-semibold">เลือก Page สำหรับหน้าหลัก:</label>
          <select v-model="selectedHome" class="block w-full mt-1">
            <option value="" disabled selected>เลือกหน้าสำหรับหน้าหลัก</option>
            <option v-for="item in filteredPageItems" :key="item._id" :value="item._id">{{ item.title }}</option>
          </select>
        </div>
      </div>

      <div class="p-3 border border-gray-200">
        <div class="mb-4">
          <label class="font-semibold">ส่วนท้าย:</label>
          <select v-model="selectedFooter" class="block w-full mt-1">
            <option value="" disabled selected>เลือกเลย์เอาต์ส่วนท้าย</option>
            <option v-for="item in filteredLayoutItems" :key="item._id" :value="item._id">{{ item.title }}</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end">
        <button class="px-4 py-2 bg-blue-500 text-white rounded-md" @click="savePopup">Save</button>
        <button class="px-4 py-2 ml-4 bg-gray-300 text-gray-700 rounded-md" @click="cancelPopup">Cancel</button>
      </div>
    </div>
  </div>

  <div class="flex-1 pb-8 bg-gray-100 pt-2 pb-5 border-t" v-if="loading_sources">
    <div class="mt-8">
      <div class="mx-auto max-w-7xl px-6 sm:px-6 lg:px-6">

        <div class="mt-8 flex flex-col">
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">

              <div class="mb-4">
                <label class="font-semibold">Filter by Type:</label>
                <div class="flex space-x-4 mt-2">
                  <label v-for="type in filterTypes" :key="type.value" class="flex items-center">
                    <input type="checkbox" v-model="selectedTypes" :value="type.value" class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600">
                    <span class="ml-2"><font-awesome-icon :icon="['fas', type.icon]" class="mr-1"/> {{ type.name }}</span>
                  </label>
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                <div v-for="(post) in filteredListItems" :key="post._id" class="relative overflow-hidden rounded-lg shadow-md">
                  <div class="p-4 bg-white">

                    <router-link :to="'/cms/edit/' + post._id" :class="{'text-blue-500': post.type === 'page', 'text-red-500': post.type === 'layout', 'text-black': post.type === 'form', 'text-green-500': post.type === 'menu'}" class="font-bold hover:underline">
                      <font-awesome-icon v-if="post.type === 'page' && post.isHome" :icon="['fas', 'home']" class="mr-1 text-yellow-400"/>
                      <span v-else-if="post.type === 'form'">
                        <font-awesome-icon :icon="['fas', 'file-alt']" class="mr-1 text-black"/>
                      </span>
                      <span v-else-if="post.type === 'layout'">
                        <font-awesome-icon :icon="['fas', 'pencil-ruler']" class="mr-1 text-red-500"/>
                      </span>
                      <span v-else-if="post.type === 'menu'">
                        <font-awesome-icon :icon="['fas', 'list']" class="mr-1 text-green-500"/>
                      </span>
                      <span v-else>
                        <font-awesome-icon :icon="['fas', 'file']" class="mr-1 text-blue-600"/>
                      </span>
                      {{ post.title }}
                    </router-link>

                    <p class="text-sm text-gray-400">{{ post.slug }}</p>

                    <div class="flex items-center justify-between mt-2 border-t border-gray-200 pt-2">
                      <div class="flex items-center">
                        <div class="ml-0">
                          <!-- <p class="text-sm font-medium text-gray-900">{{ post.type }} / {{ post.display }} / {{ post.isHome }}</p> -->
                          <p class="text-sm font-medium text-gray-500">{{ formatThaidate(post.createdAt) }}</p>
                        </div>
                      </div>
                      <div class="flex items-center">
                        <font-awesome-icon :icon="['fas','eye']" class="text-black mt-[3px] mr-2 text-md"/>
                        <p class="ml-2 text-sm text-gray-500">12</p>
                      </div>
                    </div>

                  </div>

                  <div :class="{'bg-blue-500': post.type === 'page', 'bg-red-500': post.type === 'layout', 'bg-black': post.type === 'form', 'bg-green-500': post.type === 'menu'}" class="border-t border-gray-200 py-2 px-4 flex justify-between items-center">

                    <template v-if="post.type === 'page' || post.type === 'layout' || post.type === 'form'">

                      <router-link :to="'/cms/builder/' + post._id" class="text-white hover:text-gray-200 text-md font-medium">
                        <font-awesome-icon :icon="['fas','palette']" class="text-white mt-[3px] mr-2 text-md"/>
                        <span>ออกแบบ</span>
                      </router-link>

                      <button @click="showPreview(post._id)" class="text-white hover:text-gray-200 text-md font-medium">
                        <font-awesome-icon :icon="['fas','globe']" class="text-white mt-[3px] mr-2 text-md"/>
                        <span>ดูตัวอย่าง</span>
                      </button>

                    </template>

                    <template v-else-if="post.type === 'menu'">

                      <router-link :to="'/cms/menu/' + post._id" class="text-white hover:text-gray-200 text-md font-medium">
                        <font-awesome-icon :icon="['fas','palette']" class="text-white mt-[3px] mr-2 text-md"/>
                        <span>ออกแบบ</span>
                      </router-link>
                      
                    </template>

                  </div>

                  <div class="bg-gray-100 border-t-2 border-gray-200 py-2 px-2 flex justify-between items-center">

                    <router-link v-if="post.display==='group'" :to="'/cms/posts/' + post._id" class="text-gray-600 hover:text-gray-500 text-md font-medium">
                      <font-awesome-icon :icon="['fas','square-pen']" class="text-black mt-[3px] mr-2 text-md"/>
                      <span>บทความ</span>
                    </router-link>

                    <router-link v-if="post.type==='form'" :to="'/cms/form/' + post._id" class="text-gray-600 hover:text-gray-500 text-md font-medium">
                      <span class="pl-2 pr-2 mr-1 bg-red-500 text-white font-bold text-md rounded-md w-6 h-6 shadow-md">{{ post.count || 0 }}</span>
                      <span>ส่งข้อมูล</span>
                    </router-link>

                    <button @click="removeItem(post._id)" class="text-gray-600 hover:text-gray-500 text-md font-medium">
                      <font-awesome-icon :icon="['fas','trash-can']" class="text-black mt-[3px] mr-2 text-md"/>
                      <span>ลบ</span>
                    </button>

                    <button @click="duplicateItem(post)" class="text-gray-600 hover:text-gray-500 text-md font-medium">
                      <font-awesome-icon :icon="['fas','clone']" class="text-black mt-[3px] mr-2 text-md"/>
                      <span>สำเนา</span>
                    </button>
                    
                  </div>

                </div>

                <router-link :to="'/cms/add'" class="bg-white p-10 rounded-lg shadow-md overflow-hidden flex flex-col items-center justify-center cursor-pointer p-10">
                  <div class="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:opacity-70">
                    <font-awesome-icon :icon="['fas','plus']" class="text-3xl"/>
                  </div>
                  <p class="text-gray-500 mt-2 text-center">Add Page</p>
                </router-link>
                
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

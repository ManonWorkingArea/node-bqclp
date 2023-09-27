<template>
  <Subhead
    :navigation="[
      {
        name: 'บันทึกข้อมูล',
        function: 'updateData',
        style: 'save',
        class: 'primary-btn',
        visible: true,
        type: 'button',
      },
      {
        name: 'ย้อนกลับ',
        link: '/cms/all',
        style: 'chevron-left',
        class: 'default-btn',
        visible: true,
        type: 'button',
      },
    ]"
    @updateData="updateData"
  />

  <custom-confirmation
    v-if="showConfirmation"
    :message="confirmationMessage"
    :header="confirmationHeader"
    @confirm="handleConfirmation"
    @cancel="handleConfirmCancel"
  ></custom-confirmation>

  <div class="flex-1 pb-8 bg-gray-100 pt-2 pb-5 border-t">
    <div class="mt-8">
      <div class="mx-auto max-w-7xl px-6 sm:px-6 lg:px-6">

        <div class="flex items-center justify-between space-x-2">
          <div>
          <h1 class="text-2xl font-bold text-gray-900"> {{ post.title }}</h1>
          <h1 class="text-lg font-normal text-gray-500 mb-2"> {{ post.slug }}</h1>
          </div>
          <div>
            <router-link :to="'/cms/edit/' + post._id" class="border border-gray-200 bg-white hover:bg-gray-300 px-4 py-2 rounded-md">
              <font-awesome-icon :icon="['fas','pencil']" class="w-3 h-3 text-gray-500"/> แก้ไข
            </router-link>
          </div>
        </div>

        <div class="mt-8">
          <div class="mx-auto">
            <div class="flex mt-8 bg-white p-3">

              <div class="w-1/2 pt-3">
                <h2 class="text-xl font-bold text-gray-900">All item list</h2>
                <p class="font-bold">Page List</p>
                <div class="mt-1 mb-4">

                  <ul class="space-y-1">
                    <li v-if="filteredMenuItems.length === 0" class="py-2 px-2 border border-gray-200">
                      <div class="flex items-center justify-between">
                        <span class="block text-gray-500">No items available.</span>
                      </div>
                    </li>
                    <li v-else v-for="item in filteredMenuItems" :key="item.id" class="py-2 px-2 border border-gray-200">
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="block font-medium text-black">
                            <font-awesome-icon :icon="['fas','file']" class="text-gray-500" /> {{ item.title }}
                          </span>
                          <span class="block text-xs text-gray-500">{{ item.target }}</span>
                        </div>
                        <button @click="addToEditMenu(item)">
                          <font-awesome-icon :icon="['fas','plus']" class="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
                <p class="font-bold">Plugin List</p>
                <div class="mt-4">
                  <ul class="space-y-1">
                    <li v-if="filteredPluginItems.length === 0" class="py-2 px-2 border border-gray-200">
                      <div class="flex items-center justify-between">
                        <span class="block text-gray-500">No plugin items available.</span>
                      </div>
                    </li>
                    <li v-else v-for="item in filteredPluginItems" :key="item.id" class="py-2 px-2 border border-gray-200">
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="block font-medium text-black">
                            <font-awesome-icon :icon="['fas','puzzle-piece']" class="text-gray-500" /> {{ item.title }}
                          </span>
                          <span class="block text-xs text-gray-500">{{ item.target }}</span>
                        </div>
                        <button @click="addToEditMenu(item)">
                          <font-awesome-icon :icon="['fas','plus']" class="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </li>
                  </ul>
                  
                </div>
              </div>

              <div class="w-1/2 pt-3 pl-5 border-l border-gray-200 ml-5">
                <div class="flex items-center justify-between">
                  <h2 class="text-xl font-bold text-gray-900">Edit Menu</h2>
                  <button @click="addEmptyItem"><font-awesome-icon :icon="['fas','plus']"/> เพิ่มเมนูใหม่</button>
                </div>
                
                <div class="mt-6">
                  <ul class="space-y-1">
                    <li v-for="item in editMenu" :key="item.id" class="py-2 px-2 border border-gray-200">
                      <div class="flex items-center justify-between space-x-4">
                        <div>
                          <span class="block font-medium text-black"> {{ item.title }}</span>
                          <span class="block text-xs text-gray-500">{{ item.target }}</span>
                        </div>
                        <div class="space-x-2">
                          <button @click="moveUpItem(item)" :disabled="isFirstItem(item)">
                            <font-awesome-icon :icon="['fas','chevron-up']" class="w-3 h-3 text-gray-500"/>
                          </button>
                          <button @click="moveDownItem(item)" :disabled="isLastItem(item)">
                            <font-awesome-icon :icon="['fas','chevron-down']" class="w-3 h-3 text-gray-500"/>
                          </button>
                          <button @click="deleteItem(item)">
                            <font-awesome-icon :icon="['fas','trash']" class="w-3 h-3 text-gray-500"/>
                          </button>
                          <button @click="editItem(item)">
                            <font-awesome-icon :icon="['fas','pencil']" class="w-3 h-3 text-gray-500"/>
                          </button>
                          <button @click="showSubMenu(item)" v-if="!item.subMenu || item.subMenu.length === 0">
                            <font-awesome-icon :icon="['fas','square-caret-down']" class="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <div v-if="item.isEditing" class="grid grid-cols-2 gap-2">
                        <div class="col-span-2 grid grid-cols-2 gap-2">
                          <div>
                            <div class="p-2 border border-gray-300 rounded">
                              <label class="mb-2 block">Title:</label>
                              <input v-model="item.title" placeholder="Title" class="w-full bg-gray-100 border border-gray-400 rounded px-3 py-2 mb-2" />
                            </div>
                          </div>
                          <div>
                            <div class="p-2 border border-gray-300 rounded">
                              <label class="mb-2 block">target:</label>
                              <input v-model="item.target" placeholder="Target" class="w-full bg-gray-100 border border-gray-400 rounded px-3 py-2 mb-2" />
                            </div>
                          </div>
                        </div>
                        <div class="col-span-2 flex justify-end">
                          <button @click="updateItem(item)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Update</button>
                          <button @click="cancelEdit(item)" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                        </div>
                      </div>

                      <ul class="ml-2 space-y-1 mt-2" v-if="item.subMenu">
                        <li v-for="subitem in item.subMenu" :key="subitem.id" class="py-2 px-2 border border-gray-200">
                          <div class="flex items-center space-x-4">
                            <span>{{ subitem.title }}</span>
                            <span>{{ subitem.target }}</span>
                            <button @click="moveUpSubItem(item, subitem)" :disabled="isFirstSubItem(item, subitem)">
                              <font-awesome-icon :icon="['fas','chevron-up']" class="w-3 h-3 text-gray-500"/>
                            </button>
                            <button @click="moveDownSubItem(item, subitem)" :disabled="isLastSubItem(item, subitem)">
                              <font-awesome-icon :icon="['fas','chevron-down']" class="w-3 h-3 text-gray-500"/>
                            </button>
                            <button @click="deleteSubItem(item, subitem)">
                              <font-awesome-icon :icon="['fas','trash']" class="w-3 h-3 text-gray-500"/>
                            </button>
                            <button @click="editSubItem(item, subitem)">
                              <font-awesome-icon :icon="['fas','pencil']" class="w-3 h-3 text-gray-500"/>
                            </button>
                          </div>

                          <div v-if="subitem.isEditing" class="grid grid-cols-2 gap-2">
                            <div class="col-span-2 grid grid-cols-2 gap-2">
                              <div>
                                <div class="p-2 border border-gray-300 rounded">
                                  <label class="mb-2 block">Title:</label>
                                  <input v-model="subitem.title" placeholder="Title" class="w-full bg-gray-100 border border-gray-400 rounded px-3 py-2 mb-2" />
                                </div>
                              </div>
                              <div>
                                <div class="p-2 border border-gray-300 rounded">
                                  <label class="mb-2 block">Target:</label>
                                  <input v-model="subitem.target" placeholder="Target" class="w-full bg-gray-100 border border-gray-400 rounded px-3 py-2 mb-2" />
                                </div>
                              </div>
                            </div>
                            <div class="col-span-2 flex justify-end">
                              <button @click="updateSubItem(item, subitem)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Update</button>
                              <button @click="cancelEditSubItem(subitem)" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                            </div>
                          </div>

                        </li>
                        
                      </ul>

                      <div v-if="item.showSubMenu">
                        <label>เลือกเมนูหลัก :</label>
                        <select v-model="item.mainMenu" @change="moveToSubMenu(item)" class="ml-1 border border-gray-300">
                          <option value="">None</option>
                          <option v-for="menuItem in filteredEditMenu(item.id)" :key="menuItem.id" :value="menuItem.id">
                            {{ menuItem.title }}
                          </option>
                        </select>
                        <button @click="closeSubMenu(item)">
                          <font-awesome-icon :icon="['fas','times']" class="w-3 h-3 text-gray-500"/>
                        </button>
                      </div>
                      
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Subhead from '@/interface/template/outline/Subhead.vue';
import storageManager from '@/plugins/storage';
import CustomConfirmation   from '@/utils/Confirmation.vue';

export default {
  data() {
    return {
      dataItem: this.$route.params.id,
      post: [],
      menuItems: [],
      editMenu: [],
      session: storageManager.get('session'),
      navigation: storageManager.get('navigation'),
      confirmationMessage: '',
      confirmationHeader: '',
      showConfirmation: false,
      deletionData: null,
    };
  },
  async mounted() {
    try {
      await this.getData();
    } catch (error) {
      console.log(error);
    }
  },
  components: {
    Subhead,CustomConfirmation
  },
  computed: {
    filteredMenuItems() {
      const allEditMenuItems = [...this.editMenu, ...this.getAllSubMenuItems(this.editMenu)];
      return this.menuItems.filter(item => {
        return !allEditMenuItems.some(editItem => editItem.id === item.id);
      });
    },
    filteredEditMenu() {
      return (itemId) => {
        return this.editMenu.filter(menuItem => menuItem.id !== itemId);
      };
    },
    filteredPluginItems() {
      const editMenuIds = this.editMenu.map(editItem => editItem.id);

      return this.navigation
        .filter(item => item.submenu && item.submenu.some(subitem => subitem.front === true))
        .map(item => ({
          id: item.slug,
          title: item.name,
          target: item.href,
          auth: true,
        }))
        .filter(item => !editMenuIds.includes(item.id));
    },
  },
  methods: {
    getAllSubMenuItems(items) {
      let subMenuItems = [];
      items.forEach(item => {
        if (item.subMenu && item.subMenu.length > 0) {
          subMenuItems.push(...item.subMenu);
          subMenuItems.push(...this.getAllSubMenuItems(item.subMenu));
        }
      });
      return subMenuItems;
    },
    showSubMenu(item) {
      item.showSubMenu = true;
    },
    closeSubMenu(item) {
      item.showSubMenu = false;
    },
    moveToSubMenu(item) {
      const mainMenuId = item.mainMenu;
      if (mainMenuId) {
        const mainMenu = this.editMenu.find(menuItem => menuItem.id === mainMenuId);
        if (mainMenu) {
          mainMenu.subMenu = mainMenu.subMenu || [];
          mainMenu.subMenu.push(item);
          this.editMenu = this.editMenu.filter(menuItem => menuItem !== item);
          item.showSubMenu = false;
          item.mainMenu = '';
        }
      }
    },
    async getData() {
      if (storageManager.get('session', 'login')) {
        try {
          const resAPI = await fetch(
            "https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/query",
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                method: 'find',
                args: [
                  {
                    $and: [
                      { owner: this.session.current._id },
                      { type: { $in: ['page', 'form'] } },
                    ],
                  },
                ],
                paging: { page: this.currentPage, limit: this.limitItem },
              }),
            }
          );

          const response = await resAPI.json();
          if(resAPI.status===200)
          {
            await this.getPostData()
            
            this.menuItems = response.data.map((item) => ({
              id: item._id,
              title: item.title,
              target: `/cms/page/${item.slug}`,
              auth: true,
            }));
          }
          
        } catch (error) {
          console.log(error);
        }
      }
    },
    async getPostData() {
			try {
				const resAPI = await fetch(`https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/${this.dataItem}`, {
					method: 'GET',
					headers: {'Content-Type': 'application/json'},
				});
	
				const RestReturn = await resAPI.json();
				const savedLayout = RestReturn;
		
				this.$setPageTitle(RestReturn.title);
				if (savedLayout) {
          this.post       = savedLayout
					this.editMenu  = savedLayout.builder;
				}
			} catch (error) {
			console.log(error);
			}
		},
    async updateData() {
			try {
			const response = await fetch('https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/' + this.dataItem, {
				method: 'PUT',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({
				data: {
					builder: this.editMenu,
				},
				options: {}
				})
			});
			const data = await response.json();
			console.log(data);

			if(response.status===200) {
				this.$swal({
				toast: true,
				position: 'bottom-end',
				showConfirmButton: false,
				timer: 3000,
				icon: 'success',
				title: 'บันทึกข้อมูลหน้าเว็บ',
				text: 'บันทึกข้อมูลสำหรับหน้าเว็บนี้ สำเร็จแล้ว',
				});
			}
			} catch (error) {
			console.error(error);
			}
		},

    confirmRemoveItem() {
      const { item} = this.deletionData;
      const index = this.editMenu.indexOf(item);
      if (index > -1) {
        this.editMenu.splice(index, 1);
      }
      this.handleConfirmCancel();
    },
    confirmRemoveSubItem() {
      const { parentItem,subitem} = this.deletionData;
      const index = parentItem.subMenu.indexOf(subitem);
      if (index > -1) {
        parentItem.subMenu.splice(index, 1);
      }
      this.handleConfirmCancel();
    },
    handleConfirmation() {
      if (this.deletionData) {
        const { type } = this.deletionData;
        if (type === 'item') {
          this.confirmRemoveItem();
        } else if (type === 'subitem') {
          this.confirmRemoveSubItem();
        }
      }
    },
    handleConfirmCancel() {
      this.deletionData = null;
      this.confirmationMessage = '';
      this.confirmationHeader = '';
      this.showConfirmation = false;
    },
    deleteItem(item) {
      this.confirmationMessage = 'คุณต้องการลบเนื้อหา (Content) นี้ ?';
      this.confirmationHeader = 'ยืนยันการทำรายการ';
      this.deletionData = {
        type: 'item',
        item,
      };
      this.showConfirmation = true;
    },
    deleteSubItem(parentItem, subitem) {
      this.confirmationMessage = 'คุณต้องการลบเนื้อหา (Content) นี้ ?';
      this.confirmationHeader = 'ยืนยันการทำรายการ';
      this.deletionData = {
        type: 'subitem',
        subitem,
        parentItem
      };
      this.showConfirmation = true;
    },

    addToEditMenu(item) {
      this.editMenu.push(item);
    },
    moveUpItem(item) {
      const index = this.editMenu.indexOf(item);
      if (index > 0) {
        this.editMenu.splice(index, 1);
        this.editMenu.splice(index - 1, 0, item);
      }
    },
    moveDownItem(item) {
      const index = this.editMenu.indexOf(item);
      if (index < this.editMenu.length - 1) {
        this.editMenu.splice(index, 1);
        this.editMenu.splice(index + 1, 0, item);
      }
    },
    isFirstItem(item) {
      return this.editMenu.indexOf(item) === 0;
    },
    isLastItem(item) {
      return this.editMenu.indexOf(item) === this.editMenu.length - 1;
    },
    editItem(item) {
      item.isEditing = true;
    },
    updateItem(item) {
      item.isEditing = false;
    },
    cancelEdit(item) {
      item.isEditing = false;
      item.newAttribute = '';
    },
    moveUpSubItem(parentItem, subitem) {
      const index = parentItem.subMenu.indexOf(subitem);
      if (index > 0) {
        parentItem.subMenu.splice(index, 1);
        parentItem.subMenu.splice(index - 1, 0, subitem);
      }
    },
    moveDownSubItem(parentItem, subitem) {
      const index = parentItem.subMenu.indexOf(subitem);
      if (index < parentItem.subMenu.length - 1) {
        parentItem.subMenu.splice(index, 1);
        parentItem.subMenu.splice(index + 1, 0, subitem);
      }
    },
    isFirstSubItem(parentItem, subitem) {
      return parentItem.subMenu.indexOf(subitem) === 0;
    },
    isLastSubItem(parentItem, subitem) {
      return parentItem.subMenu.indexOf(subitem) === parentItem.subMenu.length - 1;
    },
    editSubItem(parentItem, subitem) {
      subitem.isEditing = true;
    },
    updateSubItem(parentItem, subitem) {
      subitem.isEditing = false;
    },
    cancelEditSubItem(subitem) {
      subitem.isEditing = false;
      subitem.newAttribute = '';
    },
    generateUniqueId() {
      const timestamp = new Date().getTime();
      return `item_${timestamp}`;
    },
    addEmptyItem() {
    const newItem = {
      id: this.generateUniqueId(), // You can replace this with your own method for generating unique IDs
      title: 'New Menu Item',
      target: '#',
      auth: true,
    };
    this.editMenu.push(newItem);
  },
  },
};
</script>

<style>
/* Add your styles here */
</style>

<script>
import Subhead from '@/interface/template/outline/Subhead.vue';
import storageManager from '@/plugins/storage';
import FileBrowser          from '@/interface/modal/FileBrowser.vue';
import MiniMCE              from 'minimce'
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default/icons'
import { S3 } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export default {
  name: 'Edit',
  inject: ['apiServer'],
  data() {
    const session = storageManager.get("configs");
    const schoolSession = session;
    const s3Client = new S3({
      forcePathStyle: false,
      endpoint: schoolSession.s3EndpointDefault,
      region: schoolSession.s3Region,
      ResponseContentEncoding: "utf-8",
      credentials: {
        accessKeyId: schoolSession.s3Key,
        secretAccessKey: schoolSession.s3Secret,
      },
    });
    return {
        S3: s3Client,
        schoolSession: schoolSession,
        dataItem: this.$route.params.id,
        configs: storageManager.get('configs'),
        session: storageManager.get('session'),
        postData: [],
        activeBlock: false,
        editing: undefined,
        FileBrowserOpen: false,
        destination: 'form', // default value is 'form'
        defaultCollectionOptions: ['form', 'message'], // dynamic options
        defaultFormActions: ['standard', 'course'], // dynamic options
        parentList: [],
        searchTerm: '',
        showDropdown: false,
        mceOptions: {
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          file_picker_callback: (callback) => this.customFilePickerCallback(callback),
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        },
    }
  },
  components: {
    Subhead,FileBrowser,MiniMCE
  },
  computed: {
    filteredParentList() {
      return this.parentList.filter((parent) =>
        parent.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },
  methods: {
    customFilePickerCallback(callback) {
      var input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      input.onchange = async () => {
        var file = input.files[0];

        var reader = new FileReader();
        reader.onload = async function () {
          //var url = URL.createObjectURL(file); // Create a URL for the selected image file
          //callback(url, { title: file.name });
        };
        reader.readAsDataURL(file);

        const file_name_array = file.name.split(".");
        const file_extension  = file_name_array[file_name_array.length - 1];
        const file_name       = this.slugify(file.name);

        const uploadParams    = {
          Bucket: this.schoolSession.s3Bucket,
          Key: "upload/" + file.name,
          Body: file,
          ACL: "public-read",
        };

        try {
          const data = await this.S3.send(new PutObjectCommand(uploadParams));

          file.status = true;
          file.outputLink =
            this.schoolSession.s3Endpoint +
            "upload/" +
            file_name +
            "." +
            file_extension;
          // Return the file output link to MiniMCE
          callback(file.outputLink, { title: file.name });
          console.log('Success', file.outputLink, data);
        } catch (error) {
          console.error('Error uploading file:', error);
          // Handle any errors that occur during the upload process
        }
      };
      input.click();
    },
    openFileManager() {
      this.showFileManagerModal = true; // Show the file manager modal
    },
    closeFileManager() {
      this.showFileManagerModal = false; // Hide the file manager modal
    },
    selectFile(file) {
      // Call the stored callback with the selected file URL
      if (this.filePickerCallback) {
        this.filePickerCallback(file.url, { text: file.url, title: file.name });
      }
      this.closeFileManager(); // Close the file manager modal
    },
    slugify(str) {
      if (!str || typeof str !== 'string') {
        return '';
      }
      str = str.trim().toLowerCase();
      var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
      var to = "aaaaaeeeeiiiioooouuuunc------";
      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
      }
      str = str
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      var lastDotIndex = str.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        str = str.substring(0, lastDotIndex);
      }
      return str;
    },
    async checkSlugExists(slug) {
      try {
        const apiUrl = 'https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/query';
        const requestBody = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'find',
            args: [
              {
                $and: [
                  { owner: this.session.current.id },
                  { slug: slug },
                ],
              },
            ],
          }),
        };
        const response = await fetch(apiUrl, requestBody);
        const data = await response.json();
        return data.length > 0;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    updateSlug() {
      const newSlug = this.slugify(this.postData.slug);
      let count = 1;
      const checkSlug = async (slug) => {
        const slugExists = await this.checkSlugExists(slug);
        if (slugExists) {
          slug = `${slug}-${count}`;
          count++;
          checkSlug(slug);
        } else {
          console.log('Slug is available',slug);
          this.postData.slug = slug;
          this.editing = false;
        }
      };
      checkSlug(newSlug);
    },
    onTitleInput() {
      let slug = this.slugify(this.postData.title);
      let count = 1;
      const checkSlug = async (slug) => {
        const slugExists = await this.checkSlugExists(slug);
        if (slugExists) {
          slug = `${slug}-${count}`;
          count++;
          checkSlug(slug);
        } else {
          console.log('Slug is available',slug);
          this.postData.slug = slug;
        }
      };
      checkSlug(slug);
    },
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
            this.postData.feature_image = payload.file
            this.selectedSlideItemIndex = undefined;
        }
    },
    selectParent(parent) {
        console.log('Selected parent:', parent);
        this.postData.parent = parent
        this.showDropdown = false;
    },
    async getPost() {
        try {
            const resAPI = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/"+this.dataItem, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });

            const RestReturn   = await resAPI.json();
            this.postData = RestReturn
            console.log(RestReturn);
        } catch (error) {
            console.log(error)
        }
    },
    async updatePost() {
      try {
        this.activeBlock = true;
        const resAPI = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/"+this.dataItem, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            data: {
                title: this.postData.title,
                slug: this.postData.slug,
                content: this.postData.content,
                display: this.postData.display,
                type: this.postData.type,
                action: this.postData.action,
                isComment: this.postData.isComment,
                isCounter: this.postData.isCounter,
                isMenu: this.postData.isMenu,
                status: this.postData.status,
                authen: this.postData.authen,
                parent: this.postData.parent,
                destination: this.postData.destination,
                feature_image:this.postData.feature_image,
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

        if (resAPI.status===200) {
            this.activeBlock = false
            this.$swal({
                title: "บันทึกข้อมูลเรียบร้อยแล้ว ?",
                text: "คุณต้องการที่จะดำเนินการอย่างไร !",
                type: "success",
                showCancelButton: true,
                confirmButtonColor: "#0054b4",
                confirmButtonText: "กลับไปหน้าหลัก",
                cancelButtonText: "รีเฟรซหน้านี้",
                closeOnConfirm: false,
                closeOnCancel: false
            }).then((confirmed) => {
                if (confirmed.isConfirmed) {
                    console.log("Home");
                    this.$router.replace(`/cms/all/`);
                } else {
                    console.log("New");
                    this.$router.replace(`/cms/edit/${this.dataItem}`);
                }
            });
        }

      } catch (error) {
        console.log(error)
      }
    }
  },
    setup() {
    },
    async mounted () {    
        try {
            await this.getPost();
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
            link: '/cms/all',
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
          v-model="this.postData.title" 
          type="text" 
          name="title" 
          id="title" 
          autocomplete="title" 
          class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 text-lg" 
          placeholder="Title"
          @keyup.enter="onTitleInput"
        >
        <div>
          <div class="mt-3 flex items-center h-[50px] bg-gray-200 rounded-md p-4 pl-5 pr-5">
            <span class="text-gray-500 mr-3 border-r border-gray-300 pr-3"><i class="fas fa-home"></i></span>
            <span class="text-green-500 mr-2"><i class="fas fa-lock"></i></span>
            <p class="hidden md:block text-gray-700">https://<span class="text-gray-400">{{ session.current.hostname }}</span>/cms/read/</p>
            <template v-if="!editing && this.postData.slug">
              <p class="pl-0 ml-0 text-green-600">{{ this.postData.slug }}</p>
              <button @click="editing = true" class="ml-2"><i class="w-3 h-3 fas fa-pencil-alt text-gray-500"></i></button>
            </template>
            <template v-else>
              <input v-model="this.postData.slug" @keyup.enter="updateSlug" type="text" class="slug-input p-1 rounded-sm border border-gray-300 focus:outline-none">
              <button @click="updateSlug" class="ml-2"><i class="w-4 h-4 fas fa-save text-gray-500"></i></button>
            </template>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div class="mx-auto mt-4 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
    <div class="space-y-6 lg:col-span-2 lg:col-start-1">

      <section aria-labelledby="applicant-information-title" v-if="this.postData.type !== 'post'">
        <div class="bg-white shadow sm:rounded-lg">
          <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div class="section-group">
              <label class="popup-label block mb-2 pb-2 font-semibold">ประเภทเนื้อหา</label>
              <div class="grid grid-cols-4 gap-2">

                <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': this.postData.type === 'page' }">
                  <span>
                    <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/pagepng.png" alt="Unset" class="w-10 h-10 mb-2" />
                  </span>
                  <input type="radio" v-model="this.postData.type" value="page" class="radio-input hidden" />
                  <span class="text-center text-sm text-gray-500">Page</span>
                </label>

                <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': this.postData.type === 'form' }">
                  <span>
                    <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/formpng.png" alt="Block" class="w-10 h-10 mb-2" />
                  </span>
                  <input type="radio" v-model="this.postData.type" value="form" class="radio-input hidden" />
                  <span class="text-center text-sm text-gray-500">Form</span>
                </label>

                <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': this.postData.type === 'layout' }">
                  <span>
                    <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/layoutpng.png" alt="Full Width" class="w-10 h-10 mb-2" />
                  </span>
                  <input type="radio" v-model="this.postData.type" value="layout" class="radio-input hidden" />
                  <span class="text-center text-sm text-gray-500">Layout</span>
                </label>

                <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': this.postData.type === 'menu' }">
                  <span>
                    <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/absolutepng.png" alt="Full Width" class="w-10 h-10 mb-2" />
                  </span>
                  <input type="radio" v-model="this.postData.type" value="menu" class="radio-input hidden" />
                  <span class="text-center text-sm text-gray-500">Menu</span>
                </label>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="applicant-information-title" v-if="this.postData.type === 'post'">
        <div class="bg-white shadow sm:rounded-lg p-4">

          <div v-if="showFileManagerModal">
            <div class="modal">
              <div class="modal-content">
                <h2>Select a File</h2>
                <ul>
                  <li v-for="file in files" :key="file.id" @click="selectFile(file)">
                    {{ file.name }}
                  </li>
                </ul>
                <button @click="closeFileManager">Close</button>
              </div>
            </div>
          </div>

          <MiniMCE
            v-model="postData.content"
            class="popup-textarea flex-grow"
            :options="mceOptions"
            style="height: 800px;"
          />
      
          <label class="popup-label block mt-3 font-semibold">การแสดงผล</label>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-4 sm:col-span-1 flex items-start">
              <label for="isComment" class="flex items-center">
                <input
                  v-model="this.postData.isComment"
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
                  v-model="this.postData.isCounter"
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
                  v-model="this.postData.isMenu"
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
      </section>

      <!-- Applicant Information -->
      <section aria-labelledby="applicant-information-title" v-if="this.postData.type === 'page'">
        <div class="bg-white shadow sm:rounded-lg p-4">
          <h2 id="applicant-information-title" class="text-lg font-medium leading-6 text-gray-900">Page Content</h2>
      
          <div class="mt-6">
            <label class="popup-label block mb-2 pb-2 font-semibold">การแสดงผล</label>
            <div class="grid grid-cols-2 gap-4">
              <label class="radio-label flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm p-4" :class="{ 'bg-gray-200': this.postData.display === 'single' }">
                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/singlepng.png" alt="Unset" class="w-10 h-10 mb-2" />
                <input type="radio" v-model="this.postData.display" value="single" class="radio-input hidden" />
                <span class="text-center text-sm text-gray-500">หน้าเว็บ</span>
              </label>
              <label class="radio-label flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm p-4" :class="{ 'bg-gray-200': this.postData.display === 'group' }">
                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/grouppng.png" alt="Block" class="w-10 h-10 mb-2" />
                <input type="radio" v-model="this.postData.display" value="group" class="radio-input hidden" />
                <span class="text-center text-sm text-gray-500">หน้ารวม</span>
              </label>
            </div>
          </div>
      
          <label class="popup-label block mt-3 font-semibold">การแสดงผล</label>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-4 sm:col-span-1 flex items-start">
              <label for="isComment" class="flex items-center">
                <input
                  v-model="this.postData.isComment"
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
                  v-model="this.postData.isCounter"
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
                  v-model="this.postData.isMenu"
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
      </section>

      <section aria-labelledby="applicant-information-title" v-if="this.postData.type === 'layout'">
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h2 id="applicant-information-title" class="text-lg font-medium leading-6 text-gray-900">Layout Content</h2>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div class="grid grid-cols-2 gap-2">

              <div class="col-span-4 sm:col-span-1">
                <label for="title" class="block text-sm font-medium text-gray-700">title</label>
                <input 
                v-model="title" 
                type="text" name="title" id="title" autocomplete="title" 
                class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm">
              </div>	

              <div class="col-span-4 sm:col-span-1">
                <label for="slug" class="block text-sm font-medium text-gray-700">slug</label>
                <input 
                v-model="slug" 
                type="text" name="slug" id="slug" autocomplete="slug" 
                class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm">
              </div>

              <div class="col-span-4 sm:col-span-1">
                <label for="content" class="block text-sm font-medium text-gray-700">content</label>
                <input 
                v-model="content" 
                type="text" name="content" id="content" autocomplete="content" 
                class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm">
              </div>

            </div>

          </div>
        </div>
      </section>

      <section aria-labelledby="applicant-information-title" v-if="this.postData.type === 'form'">
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h2 id="applicant-information-title" class="text-lg font-medium leading-6 text-gray-900">Form Content</h2>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div class="grid grid-cols-2 gap-2">

              <div class="mt-2 col-span-4 sm:col-span-1">
                <label for="default-collection" class="block text-sm font-medium text-gray-700">Default Collection</label>
                <div class="mt-1 flex">
                  <div v-for="(option, index) in defaultCollectionOptions" :key="index" class="mr-4">
                    <input type="radio" :id="option" :name="option" :value="option" v-model="this.postData.destination" class="focus:ring-gray-900 h-4 w-4 text-gray-900 border-gray-300 inline-block align-middle">
                    <label :for="option" class="ml-2 block text-sm text-gray-900 inline-block align-middle">{{ option }}</label>
                  </div>
                </div>
              </div>

              <div class="mt-2 col-span-4 sm:col-span-1">
                <label for="default-collection" class="block text-sm font-medium text-gray-700">Default Action</label>
                <div class="mt-1 flex">
                  <div v-for="(action, index) in defaultFormActions" :key="index" class="mr-4">
                    <input type="radio" :id="action" :name="action" :value="action" v-model="this.postData.action" class="focus:ring-gray-900 h-4 w-4 text-gray-900 border-gray-300 inline-block align-middle">
                    <label :for="action" class="ml-2 block text-sm text-gray-900 inline-block align-middle">{{ action }}</label>
                  </div>
                </div>
              </div>
              
              <div class="col-span-4 sm:col-span-1">
                <label for="title" class="block text-sm font-medium text-gray-700">Form Name</label>
                <input 
                v-model="this.postData.title" 
                type="text" name="title" id="title" autocomplete="title" 
                class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm">
              </div>	

              <div class="mt-2 col-span-4 sm:col-span-1">
                <label for="slug" class="block text-sm font-medium text-gray-700">Thank you mwessage</label>
                <input 
                v-model="this.postData.slug" 
                type="text" name="slug" id="slug" autocomplete="slug" 
                class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm">
              </div>

              <div class="mt-2 col-span-4 sm:col-span-1">
                <label for="content" class="block text-sm font-medium text-gray-700">Login Request</label>
                <input 
                v-model="this.postData.content" 
                type="text" name="content" id="content" autocomplete="content" 
                class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm">
              </div>

              <div class="mt-2 col-span-4 sm:col-span-1">
                <label for="content" class="block text-sm font-medium text-gray-700">Send Tank you email</label>
                <input 
                v-model="this.postData.content" 
                type="text" name="content" id="content" autocomplete="content" 
                class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm">
              </div>

              <div class="mt-2 col-span-4 sm:col-span-1">
                <label for="content" class="block text-sm font-medium text-gray-700">Admin Email</label>
                <input 
                v-model="this.postData.content" 
                type="text" name="content" id="content" autocomplete="content" 
                class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm">
              </div>

              <div class="mt-2 col-span-4 sm:col-span-1">
                <label for="content" class="block text-sm font-medium text-gray-700">Reply Request</label>
                <input 
                v-model="this.postData.content" 
                type="text" name="content" id="content" autocomplete="content" 
                class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm">
              </div>

              <div class="mt-2 col-span-4 sm:col-span-1">
                <label for="content" class="block text-sm font-medium text-gray-700">Submit Button</label>
                <input 
                v-model="this.postData.content" 
                type="text" name="content" id="content" autocomplete="content" 
                class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm">
              </div>

            </div>

          </div>
        </div>
      </section>
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
                  <span class="text-gray-400" v-if="!this.postData.feature_image">No image selected</span>
                  <img v-else :src="this.postData.feature_image" alt="Selected Image" class="object-cover object-center w-full h-full" />
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
              <input type="checkbox" v-model="this.postData.status" class="form-checkbox text-blue-500 h-4 w-4">
              <label for="status" class="text-gray-700">เผยแพร่</label>
            </div>
            <div class="flex items-center space-x-2">
              <input type="checkbox" v-model="this.postData.authen" class="form-checkbox text-blue-500 h-4 w-4">
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
                    :key="parent.id"
                    @click="selectParent(parent)"
                    class="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {{ parent.name }}
                  </li>
                </ul>
                <div v-if="postData.parent" class="mt-2 text-gray-500">
                  Selected Parent: <span class="font-semibold"> {{ postData.parent.name }} </span> 
                </div>
              </div>
          </div>
        </div>
  
        <!-- Footer -->
        <div class="mt-2 bg-gray-100 rounded-md p-4 flex justify-between items-center">
          <div class="flex">
            <button
              @click.prevent="updatePost"
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
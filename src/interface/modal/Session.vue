<script>

// Plugin
import Loader from '@/interface/template/Loader.vue';
import storageManager from '@/plugins/storage';

export default {
    inject: ['saltSecret'],
    data() {
        const session = storageManager.get('session');
        return {
            color: "",
            session: session,
            loading_sources: true,
            activeBlock: false,
            sessionList: [],
            sessionId: "",
            sessionActive: session.current || "none",
            dataContentMessage: "",
        }
    },
    components: {
        Loader
    },
    methods: {
      async getuserSession() {

        console.log("getuserSession");
        try {
          this.sessionActive = "none";
          if (
            typeof this.session.list !== "undefined" &&
            this.session.list.length > 0
          ) {
            this.sessionList = this.session.list;
            if (this.session.current != "none") {
              this.sessionActive = this.session.current._id;
            } else {
              this.sessionActive = "none";
            }
            this.loading_sources = true;

            if (this.sessionList.length === 1) {
              this.activeBlock = true;
              this.loading_sources = true;
              const session = this.sessionList[0];
              this.dataContentMessage = `"${session.siteName}" เป็นฐานข้อมูลเดียว\nระบบจะทำการจะโหลดข้อมูลโดยอัตโนมัติใน 3 วินาที`;
              setTimeout(() => {
                this.dataContentMessage = `กำลังติดต่อฐานข้อมูล กรุณารอสักครู่.....`;
                this.selectSession(session._id);
              }, 3000);
              return;
            }
          } else {
            
            this.loading_sources = false;
            
            console.log("Session",this.session);
            let accessToken = this.session.token;
            const resAPI = await fetch(
              "https://asia-southeast2-elearning-6871c.cloudfunctions.net/schools/getAdminSchool/",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + accessToken,
                },
              }
            );

            try {
              const finalRes = await resAPI.json();
              this.sessionList = finalRes.data;
              this.loading_sources = true;
              this.sessionActive = this.session.current;
              console.log("sessionList", this.sessionList);
            } catch (error) {
              console.log("Error");
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
      async selectSession(sessionId) {
        this.sessionId = sessionId
        console.log("Select",this.sessionId);
        console.log("color",this.color);

        const session = {
          prefix: "",
        };
        storageManager.update('session',session)

        try {
            if(this.sessionId!=undefined && this.sessionId!=null && this.sessionId !="") {
                // const session 	 = storageManager.get('session');
                this.activeBlock = true;
                
                /*
                let accessToken  = session.token
                const resAPI     = await fetch("https://asia-southeast2-elearning-6871c.cloudfunctions.net/schools/" + this.sessionId, {
                  method: 'GET',
                  headers: {'Content-Type': 'application/json','Authorization': 'Bearer ' + accessToken},
                });
                */

                const resAPI = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/hostname/" + this.sessionId,
                {
                  method: 'GET',
                  headers: {'Content-Type': 'application/json'},
                });
                
                try {
                    const finalRes = await resAPI.json();
                    console.log("finalRes",finalRes);
                    if(resAPI.status === 200) {

                      const responseSpace = await fetch('https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/space/' + finalRes.spaceId);
                      const spaceData     = await responseSpace.json();

                      this.$swal({
                          toast: true,
                          position: 'bottom-end',
                          showConfirmButton: false,
                          timer: 500,
                          icon: 'success',
                          title: 'สลับฐานข้อมูลสำเร็จ',
                          text: 'ระบบกำลังสลับฐานข้อมูลองคุณ กรุณารอสักครู่',
                      }).then(() => {
                          this.loading_sources = false;
                          finalRes._id = this.sessionId;
                          const session = {
                            current: {
                              ...finalRes, // Assuming finalRes is an existing object
                              s3Key: spaceData.s3Key,
                              s3Endpoint: spaceData.s3Endpoint,
                              s3Hosting: spaceData.s3Hosting,
                              s3Secret: spaceData.s3Secret,
                              s3Region: spaceData.s3Region,
                              s3EndpointDefault: spaceData.s3EndpointDefault,
                              s3Bucket: spaceData.s3Bucket,
                              spaceId: spaceData._id,
                            },
                          };
                          storageManager.update('session',session)
                          window.location.href = "/"
                      });
                        
                    } else {
                        this.$swal({
                            toast: true,
                            position: 'bottom-end',
                            showConfirmButton: false,
                            timer: 1000,
                            icon: 'error',
                            title: 'เกิดข้อผิดพลาด',
                            text: 'ต้องเลือกฐานข้อมูลก่อน',
                        }).then(() => {
                        });
                    }
                    
                } catch (error) {
                    console.log("Error");
                }
            } else {
                this.$swal({
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 1000,
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ต้องเลือกฐานข้อมูลก่อน',
                }).then(() => {
                });
            }
        } catch (error) {
            console.log(error)
        }
      }
	},
  async mounted () {
    try {
        await this.getuserSession();
    } catch (error) {
        console.log(Error);
    }
  },
};
</script>

<script setup>
import { ref,defineProps,defineEmits } from 'vue'
import { TransitionRoot,TransitionChild,Dialog,DialogPanel,DialogTitle } from '@headlessui/vue'

const emits = defineEmits(['change-session-trigger','select-file-trigger'])
const props = defineProps({
    isWindowsOpen:Boolean,
})
const isOpen = ref(props.isWindowsOpen)

emits('change-session-trigger', true)

console.log("isOpen",isOpen);

function closeModal() {
    isOpen.value = false
    emits('change-session-trigger', false)
}

</script>

<template>
    <div v-if="!loading_sources" class="text-center"><Loader/></div>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" class="relative z-10">
            <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
            >
       <div class="fixed inset-0 bg-black bg-opacity-25" />
    </TransitionChild>
   
      <div class="fixed inset-0 overflow-y-auto">
       <div class="flex min-h-full items-center justify-center p-4 text-center">
        <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
        >
         <DialogPanel class="w-[30rem] transform overflow-hidden rounded-sm bg-white p-3 text-left align-middle shadow-xl transition-all blocking relative" 
            :data-content="dataContentMessage"
            :class="[(activeBlock?'isblock' : 'isunblock')]">
            <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900 pb-4 border-b">
            เปลี่ยนฐานข้อมูล (Database Switcher)
            <p class="text-sm font-medium text-gray-400">คลิ๊กชื่อฐานข้อมูลที่คุณต้องการเข้าไปแก้ไขข้อมูล</p>
            </DialogTitle>
        
            <div class="border-b">

                <div class="flex flex-col">
                    <ul class="flex flex-col divide-y w-full">
                        
                        <li v-for="session in sessionList" :key="session._id" class="flex flex-row" @click="selectSession(session._id)">
                            <div class="select-none cursor-pointer hover:bg-gray-50 flex flex-1 items-center p-4" :class="[(sessionActive!='none'&&sessionActive===session._id?'bg-gray-200' : '')]">
                                <div class="flex flex-col w-10 h-10 justify-center items-center mr-4">
                                    <a href="#" class="block relative">
                                    <img alt="profil" :src="session.siteLogo||'https://dummyimage.com/500x500/ededed/303030.png&text=++++++LOGO+++++'" class="mx-auto object-cover rounded-full h-10 w-10" />
                                    </a>
                                </div>
                                <div class="flex-1 pl-1">
                                    <div class="font-bold dark:text-white">{{ session.siteName }} 
                                        <small v-if="sessionActive!='none'&&sessionActive===session._id" 
                                        class="text-[10px] font-medium bg-green-500 pl-2 pr-2 pt-[2px] pb-[2px] rounded text-white">
                                        <font-awesome-icon :icon="['fas','signal']" class="text-white text-[12px] mr-2"/> Active
                                        </small>
                                    </div>
                                    <div class="text-gray-600 dark:text-gray-200 text-sm">{{ session.hostname }}</div>
                                </div>
                                <div class="flex flex-row justify-center">
                                    <button class="w-10 text-right flex justify-end">
                                    <font-awesome-icon :icon="['fas','chevron-right']" class="text-black text-[12px] mr-2"/> 
                                    </button>
                                </div>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>

            <div class="mt-4" v-if="sessionActive!='none'">
            <button
            type="button"
            class="float-right inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            @click="closeModal"
            >
            <font-awesome-icon :icon="['fas','times']" class="pr-2"/>ยกเลิก
            </button>
            </div>
         </DialogPanel>
        </TransitionChild>
       </div>
      </div>
     </Dialog>
    </TransitionRoot>
   </template>
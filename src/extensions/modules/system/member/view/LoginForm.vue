<script>
// Component
import {useTitle} 	from 'vue-page-title';
import {useRoute} 	from 'vue-router'
//import storageManager from '@/plugins/storage';
import { loadAndStoreConfigData } from '@/plugins/config';
import storageManager from '@/plugins/storage';
import CryptoJS from 'crypto-js';
// Plugin
export default {
  name: 'Login',
  inject: ['saltSecret'],
  data() {
    return {
      logo:require('@/assets/images/color-logo.png'),
      email: '',
      password: '',
      processing_text: 'กำลังติดต่อฐานข้อมูล กรุณารอสักครู่.....',
      showPassword: false,
      returnSecureToken:true,
      passwordFieldType: "password",
      activeBlock: false,
      isLoaded: false,
      siteName:'',
      loginLogo:'',
      loginBg:'',
      configs: storageManager.get('configs'),
      errors: [],
    }
  },
  components: {

  },
  methods: {
    async login() {
        try {
          
          if(this.configs.siteType==="origin") // ---------------------------- ORIGIN ACCESS
          {

            this.errors = [];

            // Origin Login Process
            this.activeBlock   = true;

            const resAPILogin   = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/user/query", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  method: 'find',
                  args: [
                    {
                      $and: [
                        { role: 'root' },
                        { username: this.email }
                      ]
                    }
                  ]
                })
            });
            
            const getLogin  = await resAPILogin.json();
            const loginData = getLogin.length > 0 ? getLogin[0] : null;

            if (loginData === null) {
              this.errors.push("ไม่พบข้อมูลผู้ใช้งาน/รหัสผ่าน");
              this.activeBlock  = false;
              return;
            }
            else
            {
              const salt        = loginData.salt;
              const inputHash   = CryptoJS.SHA256(this.password + salt).toString();
              const storedHash  = loginData.password;

              console.log(inputHash , storedHash);

              if (inputHash === storedHash) {
                console.log("Login successful");

                const session = {
                  active: true,
                  token: loginData._id,
                  refresh: "",
                  login: true,
                  userID: loginData._id,
                  user: loginData,
                  loader: false,
                  role: loginData.role,
                  nav: "superadmin-nav",
                  layout: "backend-layout",
                  current: this.configs,
                };
                storageManager.update('session',session)

                window.location.href = "/"
              } else {
                this.errors.push("ข้อมูลผู้ใช้งาน/รหัสผ่านไม่ถูกต้อง");
              }
            }
            this.activeBlock  = false;
          }
          else if(this.configs.siteType==="collection") // ---------------------------- COLLECTION ACCESS
          {
            // Origin Login Process
            this.activeBlock   = true;

            const resAPILogin   = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/user/query", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  method: 'find',
                  args: [
                    {
                      $and: [
                        { role: 'superadmin' },
                        { username: this.email }
                      ]
                    }
                  ]
                })
            });
            
            const getLogin  = await resAPILogin.json();
            const loginData = getLogin.length > 0 ? getLogin[0] : null;

            if (loginData === null) {
              console.log("Invalid username or password");
              this.errors.push("Invalid username or password");
              this.activeBlock  = false;
              return;
            }
            else
            {
              const salt        = loginData.salt;
              const inputHash   = CryptoJS.SHA256(this.password + salt).toString();
              const storedHash  = loginData.password;

              if (inputHash === storedHash) {
                console.log("Login successful");

                const session = {
                  active: true,
                  token: loginData._id,
                  refresh: "",
                  login: true,
                  userID: loginData._id,
                  user: loginData,
                  loader: false,
                  role: loginData.role,
                  nav: "admin-nav",
                  layout: "backend-layout",
                  current: this.configs,
                };
                storageManager.update('session',session)

                window.location.href = "/"


              } else {
                console.log("Invalid username or password");
                this.errors.push("Invalid username or password");
              }
            }

            this.activeBlock  = false;
          }
          else if(this.configs.siteType==="asset") // ---------------------------- ASSET ACCESS
          {
            // Origin Login Process
            this.activeBlock   = true;

            

            const resAPILogin   = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/user/query", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  method: 'find',
                  args: [
                    {
                      $and: [
                        { username: this.email }
                      ]
                    }
                  ]
                })
            });
            
            const getLogin  = await resAPILogin.json();
            const loginData = getLogin.length > 0 ? getLogin[0] : null;

            if (loginData === null) {
              console.log("Invalid username or password");
              this.errors.push("Invalid username or password");
              this.activeBlock  = false;
              return;
            }
            else
            {
              const salt        = loginData.salt;
              const inputHash   = CryptoJS.SHA256(this.password + salt).toString();
              const storedHash  = loginData.password;

              if (inputHash === storedHash) {

                let unitList = [];
                let currentAccess = "";

                if(loginData.role==="superadmin")
                {
                  console.log("Asset",loginData.asset);
                  const canAccess = loginData.asset.includes(this.configs.siteID);
                  console.log("canAccess",canAccess);
                  currentAccess = this.configs;
                  
                }
                else if(loginData.role==="admin")
                {
                  console.log("Unit",loginData.unit);
                  const canAccess = loginData.parent === this.configs.siteID;
                  console.log("canAccess",canAccess);

                  //const ids = loginData.unit.map(id => id.toString());
                  //const idList = ids.map((id) => id).join(",");
                  console.log("ids", loginData.unit);
                  const resAPI = await fetch("https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/hostname/query", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      method: 'find',
                      args: [
                        {
                          "_id": {
                            "$in": loginData.unit
                          }
                        }
                      ]
                    })
                  });

                  const RestReturn   = await resAPI.json();
                  unitList = RestReturn;
                  currentAccess = "none";
                  console.log("List Return",RestReturn);
                }

                const session = {
                  active: true,
                  token: loginData._id,
                  refresh: "",
                  login: true,
                  userID: loginData._id,
                  user: loginData,
                  loader: false,
                  role: loginData.role,
                  nav: "admin-nav",
                  layout: "backend-layout",
                  current: currentAccess,
                  list: unitList,
                };
                storageManager.update('session',session)

                console.log("session",session);
                this.$router.push("/");
                window.location.href = "/"

              } else {
                console.log("Invalid username or password");
                this.errors.push("Invalid username or password");
              }
            }
            this.activeBlock  = false;
          }
          else
          {
            this.activeBlock   = true;
            const resAPILogin  = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDODKwE1BfZOj9ieB6pisJm-p2MmudWLSw", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: this.email,
                password: this.password,
                returnSecureToken: this.returnSecureToken,
              })
            });

            const getLogin  = await resAPILogin.json();
            const status = resAPILogin.status;

            this.processing_text = "เข้าสู่ระบบสำเร็จ.....";

            if(status=="200") {
            
              // --------------------------------------------
              const session = {
                active: getLogin.registered,
                token: getLogin.idToken,
                refresh: getLogin.refreshToken,
                login: true,
                current: "none",
              };
              storageManager.update('session',session)
              // --------------------------------------------

              if(getLogin.registered) {
                const resAPIRole = await fetch("https://asia-southeast2-elearning-6871c.cloudfunctions.net/auth/role/", {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getLogin.idToken,
                  }
                });
                const getRole  = await resAPIRole.json();

                if(getRole.success) {

                  const resAPIProfile = await fetch("https://asia-southeast2-elearning-6871c.cloudfunctions.net/users/" + getRole.data.userId, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json','Authorization': 'Bearer ' + storageManager.get('session','token')},
                  });
                  const finalRes     = await resAPIProfile.json();
                  
                  let session = [];
                  if(getRole.data.role === "superadmin"){
                    const config = storageManager.get('configs');
                    session = 
                    {
                      userID: getRole.data.userId,
                      user: finalRes.data,
                      loader: false,
                      role: getRole.data.role,
                      nav: getRole.data.role + "-nav",
                      layout: "backend-layout",
                      current: config,
                    };
                  } else {
                    session = 
                    {
                      userID: getRole.data.userId,
                      user: finalRes.data,
                      loader: false,
                      role: getRole.data.role,
                      nav: getRole.data.role + "-nav",
                      layout: "backend-layout",
                    };
                  }
                  storageManager.update('session',session)

                  if(getRole.data.role==="admin") {
                    const loadMaster = await this.loadMaster();
                    if(loadMaster) {
                      this.$swal({
                          toast: true,
                          position: 'bottom-end',
                          showConfirmButton: false,
                          timer: 500,
                          icon: 'success',
                          title: 'แจ้งเตือน',
                          text: 'เข้าสู่ระบบเรียบร้อยแล้ว',
                      }).then(() => {
                        window.location.href = "/"
                      });
                    }
                  } else {
                    window.location.href = "/"
                  }
                }
              }
              else {
                this.$router.replace({path: '/member/unactive'});
              }
            } else {
              this.$swal({
              title: 'เกิดข้อผิดพลาด',
              text: getLogin.message,
              icon: 'error',
              confirmButtonText: 'ตกลง'
              }).then(() => {
                this.activeBlock = false;
              })
            }
          }
          
        } catch (error) {
          console.log(error)
        }
    },
    async loadMaster () {
      console.log("loadMaster");
      this.processing_text = "กำลังโหลดข้อมูลหมวดหมู่.....";
      const Category    = await this.getCategoryData();
      if(Category.success) {
        // --------------------------------------------
        //ls.set('categoryList', Category.data);
        const session = {
          category: Category.data,
        };
        storageManager.update('session',session)
        // --------------------------------------------
        //return true
        this.processing_text = "กำลังโหลดข้อมูลโรงเรียน.....";
        const SessionList  = await this.getuserSession();
        if(SessionList.success) {
          //ls.set('SessionList', SessionList.data);
          // --------------------------------------------
          const session = {
            list: SessionList.data,
          };
          storageManager.update('session',session)
          // --------------------------------------------
          return true
        }
      }
    },
    async getCategoryData() {
      if(this.login) {
        try {
          //console.log("Auth : Course List : ",ls.get('auth'));
          const session 	 = storageManager.get('session');
          let accessToken  = session.token
          this.loading_sources = false;
          const resAPI = await fetch("https://asia-southeast2-elearning-6871c.cloudfunctions.net/catagories/", {
            method: 'GET',
            headers: {'Content-Type': 'application/json','Authorization': 'Bearer ' + accessToken},
          });
          const RestReturn   = await resAPI.json();
          console.log("Category",RestReturn);
          return RestReturn
        } catch (error) {
          console.log(error)
        }
      }
    },
    async getuserSession() {
      try {
          this.schoolCurrent = "none";
          const session 		= storageManager.get('session');
          if(typeof session.list !== 'undefined' && session.list.length > 0) {
            this.SessionList      = session.list;
            this.loading_sources  = true;
          } else {
            let accessToken       = session.token;
            this.loading_sources  = false;
            const resAPI          = await fetch("https://asia-southeast2-elearning-6871c.cloudfunctions.net/schools/getAdminSchool/" , {
              method: 'GET',
              headers: {'Content-Type': 'application/json','Authorization': 'Bearer ' + accessToken},
            });
            try {
              const RestReturn   = await resAPI.json();
              // console.log("SessionList",RestReturn);
              return RestReturn
            } catch (error) {
              console.log("Error");
            }
          }
        } 
        catch (error) {
            console.log(error)
        }
    },
    switchVisibility() {
      this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
      this.show = !this.show;
      this.$refs.btnToggle.innerText = this.show?'ซ่อน':'แสดง';
    }
  },
  setup() {
      const route     = useRoute();
      const routeName = route.meta.title;
      useTitle(routeName);
  },
  async mounted() {
    const route = useRoute();
    const routeName = route.meta.title;
    useTitle(routeName);
    try {
      const data = await loadAndStoreConfigData(true);
      // console.log(data);
      this.siteName  = data.siteName;
      this.loginLogo = data.loginLogo;
      this.loginBg   = data.loginBg;
      this.isLoaded  = true;
    } catch (error) {
      console.error(error);
    }
  },
}
</script>

<template v-if="isLoaded">
  <div class="flex min-h-screen">
    <div class="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 blocking relative" :data-content="processing_text" :class="[(activeBlock?'isblock' : 'isunblock')]">
      <div class="mx-auto w-full max-w-sm lg:w-96 " >
        <div>
          <img class="mx-auto h-24 w-auto" :src="this.loginLogo" :alt="this.siteName">
          <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 text-center">{{this.siteName}}</h2>
        </div>

        <div class="mt-8 border-t">

          <div class="mt-6">
            <form class="space-y-6" @submit.prevent="login">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">อีเมล์/ชื่อผู้ใช้งาน</label>
                <div class="mt-1">
                  <input v-model="email" id="email" name="email" type="text" autocomplete="email" required class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                </div>
              </div>

              <div class="space-y-1">
                <label for="password" class="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                  <div class="mt-1">
                    <div class="relative w-full">
                      <div class="absolute inset-y-0 right-0 flex items-center px-2">
                        <input class="hidden js-password-toggle" id="toggle" type="checkbox" />
                        <label class="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label" for="toggle" @click="switchVisibility" ref="btnToggle">แสดง</label>
                      </div>
                      <input v-model="password" id="password" name="password" placeholder="รหัสผ่าน" :type="passwordFieldType" autocomplete="off" class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                  </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <label for="remember-me" class="ml-2 block text-sm text-gray-900">จำข้อมูลของฉัน</label>
                </div>

                <div class="text-sm">
                  <a href="forgot" class="font-medium text-indigo-600 hover:text-indigo-500">ลืมรหัสผ่าน?</a>
                </div>
              </div>

              <div>

                <div v-if="errors.length" class="mt-4">
                  <ul class="list-disc list-inside text-red-500">
                    <li v-for="error in errors" :key="error" class="mb-2 text-sm text-red-700">{{ error }}</li>
                  </ul>
                </div>

                <button type="submit" class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">เข้าสู่ระบบ</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <img class="absolute inset-0 h-full w-full object-cover" :src="this.loginBg" alt="">
    </div>
  </div>
</template>
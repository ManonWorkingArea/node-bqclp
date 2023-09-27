<script>
import storageManager from '@/plugins/storage';
import AccessBar from '@/interface/template/outline/AccessBar.vue';

export default {
    data() {
        return {
          apps: storageManager.get('navigation'),
          configs: storageManager.get('configs'),
          session: storageManager.get('session'),
          dataItem: 'Your dataItem value here'
        };
    },
    components: {
      AccessBar,
    },
    computed: {
      mainStyle() {
        const minHeight = (this.configs.siteType === 'asset' && this.session.role === 'admin') ? 'calc(100vh - 205px)' : 'calc(100vh - 165px)';
        return {
          minHeight,
        };
      },
      filteredApps() {
        return this.apps.filter(app => app.inApp === 'yes');
      },
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
      document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        isSessionDataExists(app) {
          return !!(
            app.session &&
            app.session.name &&
            storageManager.get(app.session.name)
          );
        },
        removeSession(session) {
          storageManager.delete(session)
          window.location.href = "/"
        },
        toggleSubMenu(app) {
            if (app.showSubMenu) {
            app.showSubMenu = false;
            } else {
            this.apps.forEach(a => {
                if (a.showSubMenu && a !== app) {
                a.showSubMenu = false;
                }
            });
            app.showSubMenu = true;
            }
        },
        handleClickOutside(event) {
            let isOutside = true;
            this.apps.forEach(app => {
            const subAppsContent = this.$refs[`${app.id}-sub-apps-content`];
            if (subAppsContent && subAppsContent.contains(event.target)) {
                isOutside = false;
            }
            });

            if (isOutside) {
            this.apps.forEach(app => {
                app.showSubMenu = false;
            });
            }
        }
    },
  };
</script>

<template>
    <AccessBar v-if="this.session.role === 'superadmin' || this.session.role === 'root'"/>

    <main class="flex-1 bg-blue-900 bg-dashboard-background" :style="mainStyle">
        <div class="wrapper">
            <div class="p-10">
                <div class="mx-auto max-w-7xl px-4">
                    <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
    
                        <div v-for="app in filteredApps" :key="app.href" class="app-container mt-5">
                            <template v-if="isSessionDataExists(app)">

                              <div class="relative">
                                  <div class="app-icon relative flex items-center justify-center w-20 h-20 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:ring-4 hover:ring-white" 
                                      @click.stop="app.hasSubmenu ? toggleSubMenu(app) : removeSession(app.session.name)">
                                      <div class="app-icon__inner flex items-center justify-center w-full h-full rounded-lg bg-white shadow-lg" :class="this.configs.siteStyle">
                                          <font-awesome-icon :icon="['fas', app.session.yes.icon]" class="text-white text-3xl" />
                                      </div>
                                      <span class="notification-count absolute top-0 right-0 bg-red-500 text-white font-bold text-md rounded-full flex items-center justify-center w-6 h-6 shadow-md" v-if="app.counter">{{ app.counter }}</span>
                                  </div>
                              </div>
                              <transition name="slide-up">
                                  <div class="sub-apps absolute top-10 bottom-0 left-0 w-full shadow-md mt-2 text-left" :class="{ 'sub-apps--empty': !app.submenu || app.submenu.length === 0 }" v-show="app.showSubMenu">
                                      <div class="sub-apps__content" ref="subAppsContent">
                                          <div class="text-left">
                                              <router-link v-for="subApp in app.submenu" :key="subApp.href" :to="subApp.href" class="sub-app flex bg-white items-center justify-center w-full h-12 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                <font-awesome-icon :icon="['fas', subApp.icon]" class="text-black text-sm mr-2" />
                                                <span class="text-gray-700 text-sm font-normal flex-grow-1 hover:font-medium" style="width: 100%;">{{ subApp.name }}</span>
                                              </router-link>
                                          </div>
                                      </div>
                                  </div>
                              </transition>
                              <span class="app-icon__label text-white text-sm font-normal truncate mt-4" :style="{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)' }">{{ app.session.yes.name }}</span>

                            </template>
                            <template v-else>

                              <div class="relative">
                                  <div class="app-icon relative flex items-center justify-center w-20 h-20 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:ring-4 hover:ring-white" 
                                      @click.stop="app.hasSubmenu ? toggleSubMenu(app) : $router.push(app.href)">
                                      <div class="app-icon__inner flex items-center justify-center w-full h-full rounded-lg bg-white shadow-lg" :class="this.configs.siteStyle">
                                          <font-awesome-icon :icon="['fas', app.icon]" class="text-white text-3xl" />
                                      </div>
                                      <span class="notification-count absolute top-0 right-0 bg-red-500 text-white font-bold text-md rounded-full flex items-center justify-center w-6 h-6 shadow-md" v-if="app.counter">{{ app.counter }}</span>
                                  </div>
                              </div>
                              <transition name="slide-up">
                                  <div class="sub-apps absolute top-10 bottom-0 left-0 w-full shadow-md mt-2 text-left" :class="{ 'sub-apps--empty': !app.submenu || app.submenu.length === 0 }" v-show="app.showSubMenu">
                                      <div class="sub-apps__content" ref="subAppsContent">
                                          <div class="text-left">
                                              <router-link v-for="subApp in app.submenu" :key="subApp.href" :to="subApp.href" class="sub-app flex bg-white items-center justify-center w-full h-12 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                <font-awesome-icon :icon="['fas', subApp.icon]" class="text-black text-sm mr-2" />
                                                <span class="text-gray-700 text-sm font-normal flex-grow-1 hover:font-medium" style="width: 100%;">{{ subApp.name }}</span>
                                              </router-link>
                                          </div>
                                      </div>
                                  </div>
                              </transition>
                              <span class="app-icon__label text-white text-sm font-normal truncate mt-4" :style="{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)' }">{{ app.name }}</span>

                            </template>

                        </div>
                        
                    </div>

                </div>
            </div>
        </div>
    </main>

</template>

<style scoped>
@media only screen and (max-width: 767px) {
  main {
    min-height: calc(100vh - 115px);
  }
}
body,html {
  overflow-x: hidden;
}
.notification-count {
    top: -10px;
    right: -10px;
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
    line-height: 1.5rem;
  }
.bg-dashboard-background {
  background-image: url('https://vue-project.sgp1.digitaloceanspaces.com/2023/09/1694801258975.jpg');
  background-size: cover;
  position: relative;
}

.bg-dashboard-background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.wrapper {
  width: 100vw;
  position: relative;
}

.dashboard-icon {
  width: 100%;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}
.app-icon__label {
  white-space: nowrap;
}
.app-icon__inner {
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.25);
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.sub-app-container {
  position: absolute;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(0,0,0,0.6);
  padding: 20px;
  transition: all 0.3s ease;
}

.sub-app-container.hide {
  transform: translateX(100%);
  opacity: 0;
}

.sub-app-container.show {
  transform: translateX(0);
  opacity: 1;
}

.sub-app-icon {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
}

.sub-app-label {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.sub-apps {
    box-shadow: 0px 2px 5px rgb(0 0 0 / 10%);
    z-index: 2;
    transition: all 0.2s ease-in-out;
    top: 90px;
  }
  
  .sub-apps::before {
    content: "";
    position: absolute;
    top: -5px;
    left: 50%;
    width: 15px;
    height: 15px;
    background-color: white;
    transform: translateX(-50%) rotate(45deg);
    z-index: -1;
  }
  
  .sub-apps--empty {
    display: none;
  }
  
</style>

<template>
  <header class="py-2 bg-white border-b border-1 border-gray-200">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
      <div class="min-w-0 flex-1">
          <h1 class="mt-1 text-[18px] font-semibold leading-8 text-gray-700"><font-awesome-icon :icon="['fas',this.PageIcon]" class="text-gray-500 text-[18px]"/> {{ this.PageName }}</h1>
      </div>
      <div class="mt-5 flex xl:mt-0 xl:ml-4">

          <div class="flex items-center space-x-2">
            <template v-for="(button, index) in navigation" :key="index">

              <template v-if="button.type === 'select'">
                  <label class="text-sm text-gray-400">{{ button.placeholder }}</label>
                  <select
                    v-model="button.value"
                    class="block w-36 py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                    :placeholder="button.placeholder"
                    @change="$emit('toggleStatus', button.value)"
                  >
                    <option value="" disabled>-- {{ button.placeholder }} --</option>
                    <option v-for="(option, i) in button.options" :key="i" :value="option.value">{{ option.name }}</option>
                  </select>
              </template>
              
              <template v-else-if="button.type === 'call-function'">
                <button
                  v-if="button.visible !== false"
                  @click="$emit(button.function)"
                  type="button"
                  :class="getClasses(button.class)"
                >
                <font-awesome-icon
                  :icon="['fas', `${button.style}`]"
                  :class="{
                    'text-gray-500 mr-2': button.class === 'icon-btn',
                    'text-white': button.class === 'primary-btn'
                  }"
                />
                  <span class="hidden sm:inline-block ml-1">{{ button.name }}</span>
                </button>
              </template>
              
              <template v-else>
                <button
                  v-if="button.visible !== false"
                  @click="handleNavigationClick(button)" 
                  type="button"
                  :class="getClasses(button.class)"
                >
                  <font-awesome-icon
                    :icon="['fas', `${button.style}`]"
                    :class="{
                      'text-gray-500 mr-2': button.class === 'icon-btn',
                      'text-white': button.class === 'primary-btn'
                    }"
                  />
                  <span class="hidden sm:inline-block ml-1">{{ button.name }}</span>
                </button>
              </template>
              
            </template>
          </div>
      </div>
      
    </div>
  </header>
</template>

<script>
    import {useRoute} from 'vue-router';
    import { markTailwind } from '@/plugins/tailwind-utils';

    export default {
        props: {
            navigation: {
              type: Array,
              default: () => []
            }
        },
        data() {
            const route = useRoute();
            return {
                PageName: route.meta.title,
                PageIcon: route.meta.icon,
                PagePath: route.meta.path,
                ParentName: route.meta.parent,
                ParentPage: route.meta.page,
            }
        },
        methods: {
          getClasses(className) {
            const tailwindClasses = markTailwind(className);
            return `${tailwindClasses}`;
          },
          handleNavigationClick(item) {
            if (item.function) {
              this.$emit(item.eventName || item.function);
            } else {
              this.$router.push(item.link);
            }
          }
        }
    }
</script>

<template>

  <ul class="flex-col submenu">
    <li v-for="(item, index) in this.menu" :key="index" class="bg-white border-b border-gray-100">
      <template v-if="!item.subMenu || item.subMenu.length === 0">
        <router-link :to="item.target" class="block px-4 py-3 text-gray-500 hover:text-indigo-800 font-medium">
          {{ item.title }}
        </router-link>
      </template>
      <template v-else>
        <a href="#" class="flex justify-between px-4 py-3 text-gray-600 hover:text-indigo-800 font-medium" @click.prevent="item.isActive = !item.isActive">
          <span>{{ item.title }}</span>
          <font-awesome-icon :icon="['fas', 'chevron-down']" class="text-gray-300" :class="{ 'transform rotate-180': item.isActive }" />
        </a>
        <ul class="" v-if="item.subMenu && item.isActive">
          <li v-for="(subitem, subindex) in item.subMenu" :key="subindex" class="bg-white border-b border-gray-100">
            <router-link :to="subitem.target" class="ml-4 block px-4 py-3 text-gray-600 hover:text-indigo-800 font-medium">
              {{ subitem.title }}
            </router-link>
          </li>
        </ul>
      </template>
    </li>
  </ul>

</template>

<script>
import storageManager from '@/plugins/storage';
export default {
  data() {
    return {
      config: storageManager.get('configs'),
      menu: []
    }
  },
  async mounted() {
    try {
      await this.getPostData();
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async getPostData() {
			try {
				const resAPI = await fetch(`https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/${this.config.navigator}`, {
					method: 'GET',
					headers: {'Content-Type': 'application/json'},
				});
	
				const RestReturn = await resAPI.json();
				const savedLayout = RestReturn;
		
				this.$setPageTitle(RestReturn.title);
				if (savedLayout) {
					this.menu  = savedLayout.builder;
				}
			} catch (error) {
			console.log(error);
			}
		},
  },
  props: {
    nav: {
      navigator: String,
      default: () => ({ navigator: 'desktop' })
    }
  }
}
</script>

<style scoped>
nav ul ul {
  display: none;
}

nav ul li:hover > ul {
  display: block;
}

</style>

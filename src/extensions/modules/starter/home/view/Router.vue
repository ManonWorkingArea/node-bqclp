<template>
<div>
	<Authen />
	<component :is="componentToLoad" v-if="configs.siteType === 'unit' || login" />
</div>
  </template>
  

<script>
import { useTitle } from 'vue-page-title';
import { useRoute } from 'vue-router';
import Authen from '@/utils/authen.vue';
import BackendDesktop from '../component/Dashboard-desktop.vue';
import BackendMobile from '../component/Dashboard-mobile.vue';
import Frontend from '../../frontend/component/Homepage.vue'; // Modified import statement
import storageManager from '@/plugins/storage.js';
import deviceUtils from "@/plugins/DeviceUtils";

export default {
name: 'Home',
components: {
	BackendDesktop,
	BackendMobile,
	Authen,
	Frontend,
},
data() {
	return {
	login: storageManager.get('session', 'login'),
	configs: storageManager.get('configs'),
	deviceType: deviceUtils.deviceDetect(),
	};
},
mounted() {},
setup() {
	const route = useRoute();
	const routeName = route.meta.title;
	useTitle(routeName);
},
computed: {
	componentToLoad() {
	if (this.configs.siteType === 'unit') {
		console.log("Load Front");
		return Frontend;
	} else {
		console.log("Load Back");
		return this.deviceType === 'desktop' ? BackendDesktop : BackendMobile;
	}
	},
},
};
</script>
  
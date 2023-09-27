<template>
	<div :style="{ height: sectionHeight }" :class="{ 'bg-gray-100': routerMode === 'blank' }">
		<Topbar v-if="routerMode === 'default' || routerMode === 'standard'"/>
		<Cookie :hasAgreedToCookiePolicy="hasAgreedToCookiePolicy" />
		<Header v-if="routerMode === 'default' || routerMode === 'standard'" />
		<main class="relative w-full"><router-view /></main>
		<Footer v-if="routerMode === 'default' || routerMode === 'standard'" />
	</div>
	</template>

	<script>
	import Header from '@/interface/theme/Customize.vue';
	import Footer from '@/interface/template/frontend/home/Footer';
	import Cookie from '@/utils/cookie';
	import Topbar from '@/interface/template/Topbar';
	import storageManager from '@/plugins/storage';

	export default {
	name: 'Frontend',
	components: {
		Topbar,
		Header,
		Footer,
		Cookie
	},
	data() {
		const session = storageManager.get('session');
		return {
		hasAgreedToCookiePolicy: false,
		session,
		};
	},
	computed: {
		isHomePage() {
			return this.$route.path === '/';
		},
		routerMode() {
			return this.$route.meta.mode || 'default'; // Default value if not provided
		},
		sectionHeight() {
			// Calculate section height based on screen size
			const windowHeight = window.innerHeight;
			// You can adjust the ratio as needed
			const sectionRatio = 1; // 80% of the window height
			const calculatedHeight = `${windowHeight * sectionRatio}px`;
			return calculatedHeight;
		},
	},
	watch: {
		'$route'() {
		// You can update this.router here if needed
		},
	},
	mounted() {
		console.log("Load Frontend Layout");
	},
	};
	</script>
  
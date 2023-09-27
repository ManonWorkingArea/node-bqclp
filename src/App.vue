<template>
	<component :is="layout"></component>
  </template>
  
  <script>
  import storageManager from '@/plugins/storage';
  import LayoutPublic from '@/interface/base/Public';
  import LayoutFrontend from '@/interface/base/Frontend';
  import LayoutBackend from '@/interface/base/Backend';
  
  export default {
	components: {
		'backend-layout': LayoutBackend,
		'frontend-layout': LayoutFrontend,
		'public-layout': LayoutPublic
	},
	data() {
		return {
		layoutData: ''
		};
	},
	mounted() {
		const configs = storageManager.get('configs');

		let defaultSession = {
		host: window.location.protocol + "//" + window.location.host,
		nav: 'normal-nav',
		layout: 'public-layout',
		interface: "backend",
		login: false,
		loader: true,
		master: false,
		masterText: "Master Mode",
		list: [],
		category: []
		};

		if (configs.siteType === "unit") {
		defaultSession.layout = 'frontend-layout';
		defaultSession.interface = 'frontend';
		defaultSession.role = 'public';
		}

		const loader = storageManager.get('session', 'loader');

		if (loader == true || loader == undefined || loader == null) {
		storageManager.set('session', defaultSession);
		}

		this.layoutData = storageManager.get('session', 'layout');
	},
	updated() {

	},
	computed: {
		layout() {
		return this.layoutData ? this.layoutData : 'public-layout';
		}
	}
	};
</script>
  
<style>
#app {}

/* TooltipPlugin.css */
.tooltip {
    /* Generic tooltip styles */
    background-color: #333;
    color: #fff;
    padding: 0.5rem;
    border-radius: 0.25rem;
    position: absolute;
    z-index: 9999;
  }
  
	.tooltip-top {
	}

	.tooltip-bottom {
	}

	.tooltip-left {

	}
	
	.tooltip-right {

	}
  

.vue-back-to-top {
	@apply p-2 bg-indigo-500 hover:bg-indigo-600 text-white transition
	duration-500
	ease-in-out
	transform
	hover:-translate-y-1 hover:scale-110;
	border-radius: 50%;
	font-size: 22px;
	line-height: 22px;
}
.fade-enter-active {
	animation: coming 0.4s;
	animation-delay: 0.2s;
	opacity: 0;
}
.fade-leave-active {
	animation: going 0.4s;
}

.readmore span {
	text-align: center; 
	width: 100%;
	float: left;
	display: block;
	height: 20px;
	margin-top: -20px;
}

.readmore p {
	padding-bottom: 20px;
}

.readmore a {
	border: 1px solid rgb(217 217 217);
    border-radius: 5px;
    padding: 2px 10px;
    color: #373737;
    background: rgb(35 40 47 / 10%);
}

.feather-16{
    width: 16px;
    height: 16px;
}

.feather-22{
    width: 22px;
    height: 22px;
}

.feather-24{
    width: 24px;
    height: 24px;
}

.feather-32{
    width: 32px;
    height: 32px;
}

@keyframes going {
from {
transform: translateX(0);
}
to {
transform: translateX(-10px);
opacity: 0;
}
}
@keyframes coming {
from {
transform: translateX(-10px);
opacity: 0;
}
to {
transform: translateX(0px);
opacity: 1;
}
}

.isblock
{
	pointer-events: none;
	cursor: progress;
}

.isblock:before {
    /*content: 'กำลังติดต่อฐานข้อมูล กรุณารอสักครู่.....';*/
	content: attr(data-content);
    opacity: 1;
    background: rgb(255 255 255 / 95%);
    color: #000;
    font-size: 18px;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    z-index: 99;
	text-align: center;
	white-space: pre-wrap;
}

div.isblock.blocking{
	opacity: 1;
}

.swal2-popup.swal2-toast .swal2-title {
    margin: 0.1em 1em !important;
}

/* For Webkit-based browsers (Chrome, Safari and Opera) */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.tooltip .tooltip-container .title {
    line-height: 1.3rem;
}

.py-2.5 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>

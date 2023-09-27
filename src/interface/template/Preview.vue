<!-- MyComponent.vue -->
<template>
<div v-if="visible">

	<div class="overlay-bg" @click="hideComponent"></div>

	<div class="screen">
	<div class="viewport-buttons flex bg-white rounded-md p-3 justify-center space-x-4 mt-3 mb-3">
		<button
		@click="setViewport('mobile')"
		class="button-icon flex items-center focus:outline-none"
		>
		<i class="fas fa-mobile-alt text-xl mr-2"></i>
		Mobile
		</button>
		<button
		@click="setViewport('laptop')"
		class="button-icon flex items-center focus:outline-none"
		>
		<i class="fas fa-laptop text-xl mr-2"></i>
		Laptop
		</button>
		<button
		@click="setViewport('desktop')"
		class="button-icon flex items-center focus:outline-none"
		>
		<i class="fas fa-desktop text-xl mr-2"></i>
		Desktop
		</button>
	</div>

	<div class="iframe-container">
		<iframe
		ref="viewportFrame"
		:src="`/cms/iframe/${dataItem}`"
		:style="iframeStyle"
		></iframe>
	</div>

	<button class="close-btn" @click="hideComponent">
		Close
	</button>
	</div>
</div>
</template>

<script>

export default {
props: {
	visible: {
	type: Boolean,
	required: true,
	},
	dataItem: {
	type: String,
	required: true,
	},
},
data() {
	return {
	viewport: 'desktop',
	};
},
computed: {
	iframeStyle() {
	let width = '100%';

	switch (this.viewport) {
		case 'mobile':
		width = '375px';
		break;
		case 'laptop':
		width = '1124px';
		break;
		case 'desktop':
		width = '1540px';
		break;
		default:
		break;
	}

	return {
		width,
		height: 'calc(100vh - 150px)',
		border: '1px solid #404040',
		margin: '0 auto',
		display: 'block',
		marginTop: '0',
	};
	},
},
methods: {
	setViewport(viewport) {
	this.viewport = viewport;
	},
	hideComponent() {
	this.$emit('close');
	},
	closeComponent() {
	this.$emit('close');
	},
},
};
</script>

<style scoped>
.screen {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
align-items: center;
background-color: transparent;
z-index: 9999;
}

.overlay-bg {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
z-index: 9998;
}

.close-btn {
position: absolute;
top: 10px;
right: 10px;
z-index: 9999;
background: none;
border: none;
color: white;
font-size: 20px;
cursor: pointer;
}

.iframe-container
{
	border: 10px solid #000000;
    border-radius: 5px;
	background: #fff;
}

/* Rest of the styles */
</style>
  
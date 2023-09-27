<template>
	<div>
		<Topbar /> <!-- Display the top bar component -->
		<router-view /> <!-- Render the appropriate component based on the current route -->
	</div>
</template>

<script>
import Topbar from '@/interface/template/Topbar';

export default {
	name: 'Public', // Component name
	components: {
		Topbar // Register the Topbar component
	},
	mounted() {
		console.log("Load Public Layout"); // Log a message when the layout is mounted
	},
};
</script>

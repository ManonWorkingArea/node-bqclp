<template>
  <div
    :class="[
      'avatar',
      {
        'avatar--image': hasData, // If image data is available
        'avatar--default': !hasData, // If image data is not available
        'default--one': !hasData, // Default style for avatars with no image data
      }
    ]"
  >
    <img v-if="hasData" :src="imageSrc" alt="Avatar">
    <div v-else class="avatar--default default--one bg-gray-200 border rounded-full pt-2 font-bold border-gray-300 text-center" :class="[
      'border-gray-300',
      'text-center',
      'w-' + data.size,
      'h-' + data.size,
      data.size > 10 ? 'text-2xl' : 'text-md',
      data.size > 10 ? 'pt-3' : 'pt-[10px]'
    ]">
    {{ initials }}</div>
    </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  computed: {
    hasData() {
      return this.data.image !== undefined && this.data.image !== null && this.data.image !== '';
    },
    imageSrc() {
      return this.hasData ? this.data.image : '';
    },
    initials() {
  if (!this.hasData) {
    // If image data is available, extract the initials from the email
    const name = this.data.name || ''; // Assuming you have a 'name' property in your data
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase() + ".";
  } else {
    // If no image data, use 'XX' as initials
    return 'XX';
  }
}

  }
};
</script>

<style scoped>
/* Your CSS styles for avatars go here as before */
</style>

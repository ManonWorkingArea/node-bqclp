<template>
  <div class="z-20 fixed inset-0 flex items-center justify-center" @keydown.enter="confirmDeletion" @keydown.esc="cancelDeletion" ref="popupContainer" tabindex="0">
    <div class="fixed inset-0 bg-gray-900 opacity-50"></div>
    <div class="w-[400px] bg-white p-6 rounded-sm shadow-lg confirmation-modal" tabindex="0">
      <div class="text-xl font-bold mb-4">{{ header }}</div>
      <div class="text-lg mb-4 text-gray-500" v-html="message"></div>
      <div class="flex justify-end">
        <button :class="confirmButtonClass" @click="confirmDeletion" class="w-full py-2 rounded-sm mr-2">
          <font-awesome-icon :icon="['fas', 'check']" class="h-4 w-4 text-white" />
          ตกลง
        </button>
        <button :class="cancelButtonClass" @click="cancelDeletion" class="w-full py-2 rounded-sm">
          ยกเลิก
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'default' // Default type is 'default'
    }
  },
  mounted() {
    this.$refs.popupContainer.focus();
  },
  computed: {
    confirmButtonClass() {
      if (this.type === 'warning') {
        return 'bg-red-500 hover:bg-red-700 text-white';
      } else if (this.type === 'success') {
        return 'bg-green-500 hover:bg-green-700 text-white';
      } else if (this.type === 'information') {
        return 'bg-blue-500 hover:bg-blue-700 text-white';
      } else {
        return 'bg-gray-500 hover:bg-gray-700 text-white';
      }
    },
    cancelButtonClass() {
      if (this.type === 'warning') {
        return 'bg-gray-500 hover:bg-gray-700 text-white';
      } else if (this.type === 'success') {
        return 'bg-gray-500 hover:bg-gray-700 text-white';
      } else if (this.type === 'information') {
        return 'bg-gray-500 hover:bg-gray-700 text-white';
      } else {
        return 'bg-gray-500 hover:bg-gray-700 text-white';
      }
    }
  },
  methods: {
    confirmDeletion() {
      this.$emit('confirm');
    },
    cancelDeletion() {
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>
.confirmation-modal {
  z-index: 9999;
}
</style>

<script>
export default {
    props: ['check'],
    components: {},
    data() {
      return {}
    },
};
</script>

<template>
<span v-if="check" class="text-xs font-medium bg-emerald-600 pl-2 pr-2 pt-1 pb-1 ml-5 text-white"><font-awesome-icon :icon="['fas','check']" class="text-white"/> เผยแพร่</span>
<span v-if="!check" class="text-xs font-medium bg-rose-600 pl-2 pr-2 pt-1 pb-1 ml-5 text-white"><font-awesome-icon :icon="['fas','times']" class="text-white"/> ไม่เผยแพร่</span>
</template> 


<template>
  <div>
    <label class="block font-bold mb-1">{{ data.name }}</label>
    <div :class="{ 'flex flex-row': data.inline }">
      <div
        v-for="(option, index) in data.options"
        :key="index"
        class="flex items-center mb-2"
        :class="{ 'mr-4': data.inline && index !== data.options.length - 1 }"
      >
        <input
          :id="getOptionId(option)"
          class="mr-2"
          v-model="selectedOption"
          :value="option.value"
          :name="data.name"
          type="radio"
          :checked="index === data.defaultOption"
          @change="handleRadioChange"
        >
        <label :for="getOptionId(option)">{{ option.label }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    modelValue: {
      required: true,
    },
  },
  data() {
    return {
      selectedOption: this.modelValue,
    };
  },
  methods: {
    getOptionId(option) {
      return `${this.data.name}-${option.value}`;
    },
    handleRadioChange() {
      let destinations = [];
      if (this.data.logics && Array.isArray(this.data.logics)) {
        destinations = this.data.logics
          .map(logicConfig => logicConfig.destination)
          .filter(destination => destination);
      }
      destinations.forEach(destination => {
        const { rowIndex, columnIndex, obj } = destination;
        const targetRow = this.$parent.builder[rowIndex];
        if (targetRow) {
          const targetColumn = targetRow.columns[columnIndex];
          if (targetColumn) {
            const targetObject = targetColumn.object[obj];
            if (targetObject) {
              targetObject.show = true;
            }
          }
        }
      });
      const finalDestinations = destinations.length > 0 ? destinations : null;
      this.$emit('update:modelValue', this.selectedOption, finalDestinations);
    },
  },
  watch: {
    selectedOption(newValue) {
      let destinations = [];
      if (this.data.logics && Array.isArray(this.data.logics)) {
        destinations = this.data.logics
          .map(logicConfig => logicConfig.destination)
          .filter(destination => destination);
      }
      destinations.forEach(destination => {
        const { rowIndex, columnIndex, obj } = destination;
        const targetRow = this.$parent.builder[rowIndex];
        if (targetRow) {
          const targetColumn = targetRow.columns[columnIndex];
          if (targetColumn) {
            const targetObject = targetColumn.object[obj];
            if (targetObject) {
              targetObject.show = true;
            }
          }
        }
      });
      const finalDestinations = destinations.length > 0 ? destinations : null;
      this.$emit('update:modelValue', newValue, finalDestinations);
    },
  },
  mounted() {
    if (this.data.defaultOption !== undefined) {
      const defaultOptionIndex = this.data.defaultOption;
      const defaultOption = this.data.options[defaultOptionIndex];
      this.selectedOption = defaultOption.value;
      this.handleRadioChange();
    }
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>

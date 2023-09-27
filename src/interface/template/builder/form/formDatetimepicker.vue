<template>
  <div>
    <label :for="data.uid" class="block font-bold mb-1">{{ data.name }}</label>
    <div>
      <div class="flex mb-4">
        <div class="mr-4">
          <label class="block mb-1 text-gray-500">เลือก <span class="text-gray-900">วัน/เดือน/ปี</span></label>
          <div class="flex">
            <select v-model="year" class="form-select rounded-sm border border-gray-200 p-3 mr-2 w-20" @change="updateInputValue">
              <option v-for="yearOption in yearOptions" :key="yearOption" :value="yearOption" class="pr-5">{{ yearOption }}</option>
            </select>
            <select v-model="month" class="form-select rounded-sm border border-gray-200 p-3 mr-2" @change="updateInputValue">
              <option v-for="monthOption in monthOptions" :key="monthOption.value" :value="monthOption.value">{{ monthOption.label }}</option>
            </select>
            <select v-model="day" class="form-select rounded-sm border border-gray-200 p-3 mr-2 w-20" @change="updateInputValue">
              <option v-for="dayOption in dayOptions" :key="dayOption" :value="dayOption">{{ dayOption }}</option>
            </select>
          </div>
        </div>
        <div v-if="showTime">
          <label class="block mb-1 text-gray-500">เลือกเวลา <span class="text-gray-900">ชั่วโมง:นาที</span></label>
          <div class="flex">
            <select v-model="hour" class="form-select rounded-sm border border-gray-200 p-3 mr-2 w-20" @change="updateInputValue">
              <option v-for="hourOption in hourOptions" :key="hourOption" :value="hourOption">{{ hourOption }}</option>
            </select>
            <select v-model="minute" class="form-select rounded-sm border border-gray-200 p-3 mr-2 w-20" @change="updateInputValue">
              <option v-for="minuteOption in minuteOptions" :key="minuteOption" :value="minuteOption">{{ minuteOption }}</option>
            </select>
          </div>
        </div>
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
      type: String,
      required: true,
    },
  },
  data() {
    const currentDateTime = new Date();
    currentDateTime.setMinutes(currentDateTime.getMinutes() + currentDateTime.getTimezoneOffset() + 420);
    return {
      year: currentDateTime.getFullYear().toString(),
      month: (currentDateTime.getMonth() + 1).toString().padStart(2, '0'),
      day: currentDateTime.getDate().toString().padStart(2, '0'),
      hour: currentDateTime.getHours().toString().padStart(2, '0'),
      minute: currentDateTime.getMinutes().toString().padStart(2, '0'),
      showTime: this.data.showDateTime === 'datetime',
    };
  },
  computed: {
    inputValue() {
      const formattedMonth = this.month.toString().padStart(2, '0');
      const formattedDay = this.day.toString().padStart(2, '0');
      const formattedHour = this.hour.toString().padStart(2, '0');
      const formattedMinute = this.minute.toString().padStart(2, '0');
      return `${this.year}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}`;
    },
    yearOptions() {
      const currentYear = new Date().getFullYear();
      const startYear = 1970;
      return Array.from({ length: currentYear - startYear + 1 }, (_, index) => (startYear + index).toString());
    },
    monthOptions() {
      return [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
      ];
    },
    dayOptions() {
      return Array.from({ length: 31 }, (_, index) => (index + 1).toString().padStart(2, '0'));
    },
    hourOptions() {
      return Array.from({ length: 24 }, (_, index) => index.toString().padStart(2, '0'));
    },
    minuteOptions() {
      return Array.from({ length: 60 }, (_, index) => index.toString().padStart(2, '0'));
    },
  },
  methods: {
    updateInputValue() {
      const year = this.year;
      const month = this.month;
      const day = this.day;
      let hour = this.hour;
      let minute = this.minute;

      if (!this.showTime) {
        hour = '00';
        minute = '00';
      }

      const selectedDate = new Date(year, month - 1, day, hour, minute);
      selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset() - 420);
      const utcDate = selectedDate.toISOString();

      this.$emit('update:modelValue', utcDate);
    },
  },
  mounted() {
    this.updateInputValue();
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>

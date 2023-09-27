<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
    <div class="col-span-4">
      <label :for="data.uid" class="block font-bold mb-1 text-lg">{{ data.name }} / {{ data.inputType }}</label>
    </div>

    <!-- <div v-if="data.inputType === 'tax'" class="col-span-4 grid grid-cols-4 gap-4">
      <div class="col-span-2">
        <label :for="inputValues.taX_ID" class="block font-bold mb-1">เลขประจำตัวผู้เสียภาษี / เลขบัตรประชาชน (กรณีออกในนามบุคคลธรรมดา)</label>
        <input
          :value="inputValues.taX_ID"
          @input="updateInputValue('taX_ID', $event.target.value)"
          class="w-full rounded-sm border border-gray-200 p-3"
          :id="data.uid + '-tax-id'"
          type="text"
          placeholder="เลขประจำตัวผู้เสียภาษี / เลขบัตรประชาชน"
          :class="inputClasses"
        >
      </div>

      <div class="col-span-2">
        <label :for="inputValues.owneR_NAME_TH" class="block font-bold mb-1">ชื่อนิติบุคคล / ชื่อ-นามสกุล (กรณีออกในนามบุคคลธรรมดา)</label>
        <input
          :value="inputValues.owneR_NAME_TH"
          @input="updateInputValue('owneR_NAME_TH', $event.target.value)"
          class="w-full rounded-sm border border-gray-200 p-3"
          :id="data.uid + '-tax-name'"
          type="text"
          placeholder="ชื่อนิติบุคคล / ชื่อ-นามสกุล"
          :class="inputClasses"
        >
      </div>
    </div> -->

    <div class="col-span-4 md:col-span-1">
      <label :for="inputValues.NO" class="block font-bold mb-1">เลขที่</label>
      <input
        :value="inputValues.NO"
        @input="updateInputValue('NO', $event.target.value)"
        class="w-full rounded-sm border border-gray-200 p-3"
        :id="data.uid + '-NO'"
        type="text"
        placeholder="เลขที่"
        :class="inputClasses"
      >
    </div>

    <div class="col-span-4 md:col-span-1">
      <label :for="inputValues.MOO" class="block font-bold mb-1">หมู่ที่</label>
      <input
        :value="inputValues.MOO"
        @input="updateInputValue('MOO', $event.target.value)"
        class="w-full rounded-sm border border-gray-200 p-3"
        :id="data.uid + '-MOO'"
        type="text"
        placeholder="หมู่ที่"
        :class="inputClasses"
      >
    </div>

    <div class="col-span-4 md:col-span-1">
      <label :for="inputValues.SOI_TH" class="block font-bold mb-1">ซอย</label>
      <input
        :value="inputValues.SOI_TH"
        @input="updateInputValue('SOI_TH', $event.target.value)"
        class="w-full rounded-sm border border-gray-200 p-3"
        :id="data.uid + '-SOI_TH'"
        type="text"
        placeholder="ซอย"
        :class="inputClasses"
      >
    </div>

    <div class="col-span-4 md:col-span-1">
      <label :for="inputValues.BUILDING_TH" class="block font-semibold text-black mb-1">อาคาร/หมู่บ้าน/สำนักงาน</label>
      <input
        :value="inputValues.BUILDING_TH"
        @input="updateInputValue('BUILDING_TH', $event.target.value)"
        class="w-full rounded-sm border border-gray-200 p-3"
        :id="data.uid + '-BUILDING_TH'"
        type="text"
        placeholder="อาคาร/หมู่บ้าน/สำนักงาน"
        :class="inputClasses"
      >
    </div>

    <div class="col-span-4 md:col-span-1">
      <label :for="inputValues.ROAD_TH" class="block font-bold mb-1">ถนน</label>
      <input
        :value="inputValues.ROAD_TH"
        @input="updateInputValue('ROAD_TH', $event.target.value)"
        class="w-full rounded-sm border border-gray-200 p-3"
        :id="data.uid + '-ROAD_TH'"
        type="text"
        placeholder="ถนน"
        :class="inputClasses"
      >
    </div>
  </div>

  <div class="grid grid-cols-4 gap-4 mt-4">
    <div class="col-span-4 md:col-span-1">
      <label :for="inputValues.province" class="block font-bold mb-1">จังหวัด</label>
      <select
        :value="inputValues.province"
        @input="updateInputValue('province', $event.target.value)"
        class="w-full rounded-sm border border-gray-200 p-3"
        :id="data.uid + '-province'"
        :class="inputClasses"
        @change="fetchDistrictData"
      >
        <option value="" disabled selected>เลือกจังหวัด</option>
        <option v-for="province in provinces" :key="province.id" :value="province.name_th">{{ province.name_th }}</option>
      </select>
    </div>

    <div class="col-span-4 md:col-span-1">
      <label :for="inputValues.district" class="block font-bold mb-1">อำเภอ</label>
      <select
        :value="inputValues.district"
        @input="updateInputValue('district', $event.target.value)"
        class="w-full rounded-sm border border-gray-200 p-3"
        :id="data.uid + '-district'"
        :class="inputClasses"
        @change="fetchSubdistrictData"
      >
        <option value="" disabled selected>เลือกอำเภอ</option>
        <option v-for="district in districts" :key="district.id" :value="district.name_th">{{ district.name_th }}</option>
      </select>
    </div>

    <div class="col-span-4 md:col-span-1">
      <label :for="inputValues.subdistrict" class="block font-bold mb-1">ตำบล</label>
      <select
        :value="inputValues.subdistrict"
        @input="updateInputValue('subdistrict', $event.target.value)"
        class="w-full rounded-sm border border-gray-200 p-3"
        :id="data.uid + '-subdistrict'"
        :class="inputClasses"
        @change="fetchZipcodeData"
      >
        <option value="" disabled selected>เลือกตำบล</option>
        <option v-for="subdistrict in subdistricts" :key="subdistrict.name_th" :value="subdistrict.name_th">{{ subdistrict.name_th }}</option>
      </select>
    </div>

    <div class="col-span-4 md:col-span-1">
      <label :for="inputValues.zipcode" class="block font-bold mb-1">รหัสไปรษณีย์</label>
      <input
        :value="inputValues.zipcode"
        @input="updateInputValue('zipcode', $event.target.value)"
        class="w-full rounded-sm border border-gray-200 p-3"
        :id="data.uid + '-zipcode'"
        type="text"
        placeholder="รหัสไปรษณีย์"
        :class="inputClasses"
      >
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
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      inputValues: {
        taX_ID: this.modelValue?.taX_ID || '',
        owneR_NAME_TH: this.modelValue?.owneR_NAME_TH || '',
        MOO: this.modelValue?.MOO || '',
        SOI_TH: this.modelValue?.SOI_TH || '',
        NO: this.modelValue?.NO || '',
        BUILDING_TH: this.modelValue?.builder || '',
        ROAD_TH: this.modelValue?.road || '',
        subdistrict: this.modelValue?.subdistrict || '',
        district: this.modelValue?.district || '',
        province: this.modelValue?.province || '',
        zipcode: this.modelValue?.zipcode || '',
      },
      provinces: [],
      districts: [],
      subdistricts: [],
    };
  },
  computed: {
    inputClasses() {
      const classes = {
        'text-center': this.data.align === 'center',
      };
      if (this.data.fontSize) {
        classes[`text-${this.data.fontSize}`] = true;
      }
      if (this.data.fontWeight) {
        classes[`font-${this.data.fontWeight}`] = true;
      }
      if (this.data.color) {
        classes[`text-${this.data.color}`] = true;
      }
      return classes;
    },
  },
  mounted() {
    this.fetchProvinceData();
  },
  methods: {
    updateInputValue(key, value) {
      this.inputValues[key] = value;
      console.log(key,value);
      this.$emit('update:modelValue', this.inputValues);
    },
    fetchProvinceData() {
      const endpoint = 'https://multisource-api-edsdv.ondigitalocean.app/api/wG2LEKM4KXVURCvTU3yWjvPyJ6p45ssS/';
      fetch(endpoint + 'province')
        .then(response => response.json())
        .then(data => {
          this.provinces = data;
        })
        .catch(error => console.error(error));
    },
    fetchDistrictData() {
      const selectedProvince = this.inputValues.province;
      const selectedProvinceId = this.provinces.find(province => province.name_th === selectedProvince)?.id;

      if (selectedProvinceId) {
        const endpoint = 'https://multisource-api-edsdv.ondigitalocean.app/api/wG2LEKM4KXVURCvTU3yWjvPyJ6p45ssS/';
        const bodyParam = {
          method: 'find',
          args: [{ province_id: selectedProvinceId }]
        };

        fetch(endpoint + 'amphure/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyParam)
        })
          .then(response => response.json())
          .then(data => {
            this.districts = data;
            this.inputValues.district = '';
            this.inputValues.subdistrict = '';
            this.inputValues.zipcode = '';
          })
          .catch(error => console.error(error));
      }
    },
    fetchSubdistrictData() {
      const selectedDistrict = this.inputValues.district;
      const selectedAmphureId = this.districts.find(district => district.name_th === selectedDistrict)?.id;

      if (selectedAmphureId) {
        const endpoint = 'https://multisource-api-edsdv.ondigitalocean.app/api/wG2LEKM4KXVURCvTU3yWjvPyJ6p45ssS/';
        const bodyParam = {
          method: 'find',
          args: [{ amphure_id: selectedAmphureId }]
        };

        fetch(endpoint + 'tambon/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyParam)
        })
          .then(response => response.json())
          .then(data => {
            this.subdistricts = data;
            this.inputValues.subdistrict = '';
            this.inputValues.zipcode = '';
          })
          .catch(error => console.error(error));
      }
    },
    fetchZipcodeData() {
      const selectedSubdistrict = this.inputValues.subdistrict;
      const subdistrict = this.subdistricts.find(sub => sub.name_th === selectedSubdistrict);
      if (subdistrict) {
        this.inputValues.zipcode = subdistrict.zip_code;
      } else {
        this.inputValues.zipcode = '';
      }
    },
  },
};
</script>

<style scoped>
</style>

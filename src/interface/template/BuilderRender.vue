<template>
  <Color></Color>
  <div v-if="page.type === 'form'">
    <form>
      <div v-for="row in builder" :key="row.text" :class="[getRowWrapperClass(row), styles(row).classes]" :style="styles(row).style" :id="row.customId">
        <div :class="[getRowInsideWrapperClass(row), InnerStyles(row).classes]" :style="InnerStyles(row).style">

          <template v-if="row.mode === 'tab'">
            <div class="flex flex-col">
              <div class="flex" style="margin-bottom: -1px; z-index: 9;">
                <div
                  v-for="(column, index) in row.columns"
                  :key="column.text"
                  :class="['px-4 py-2 mr-1 cursor-pointer', {'bg-white-500 text-black font-bold border-t border-l border-r border-b border-gray-300 border-b-white': index === activeTabIndex}, {'bg-gray-200 border-t border-l border-r border-b border-gray-300': index !== activeTabIndex}]"
                  @click="activeTabIndex = index"
                >
                  {{ column.text }}
                </div>
              </div>
              <div class="border border-t border-gray-300 p-4">
                <div v-for="(column, index) in row.columns" :key="column.text" :class="{'hidden': index !== activeTabIndex}" :id="column.customId">
                  <template v-for="obj in column.object" :key="obj.name">
                    <component :is="getComponentType(obj.type)"
                    v-if="obj.show || shouldShowInput(obj)"
                    v-model="obj.value"
                    :data="obj"
                    :class="[styles(obj).classes, { 'error-input': obj.required && obj.hasError }]"
                    :style="styles(obj).style"
                    @update:modelValue="handleModelValueUpdate">
                    </component>

                    <template v-if="obj.type === 'button'">
                      <button
                        type="button"
                        :class="[
                          'mr-3 rounded-md border border-gray-300',
                          obj.style === 'primary' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700',
                          'px-4 py-2 text-sm font-medium shadow-sm',
                          obj.textSize
                        ]"
                        @click="submitForm"
                      >
                        {{ obj.label }}
                      </button>
                      <button
                        type="button"
                        class="rounded-md border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                        @click="clearForm"
                      >
                        Clear
                      </button>
                    </template>

                  </template>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="row.mode !== 'tab'">
            <template v-if="row.columns.length > 0">
              <div :class="getGridColumnClasses(row)">
                <div v-for="column in row.columns" :key="column.text" :class="[getColumnClasses(column, row), columnStyles(column)]" :style="columnStyles(column)" :id="column.customId">
                  <template v-for="obj in column.object" :key="obj.name">
                    <component :is="getComponentType(obj.type)"
                    v-if="obj.show || shouldShowInput(obj)"
                    v-model="obj.value"
                    :data="obj"
                    :class="[styles(obj).classes, { 'error-input': obj.required && obj.hasError }]"
                    :style="styles(obj).style"
                    @update:modelValue="handleModelValueUpdate">
                    </component>

                    <template v-if="obj.type === 'button'">
                      <button
                        type="button"
                        :class="[
                          'mr-3 rounded-md border border-gray-300',
                          obj.style === 'primary' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700',
                          'px-4 py-2 text-sm font-medium shadow-sm',
                          obj.textSize
                        ]"
                        @click="submitForm"
                      >
                        {{ obj.label }}
                      </button>
                      <button
                        type="button"
                        class="rounded-md border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                        @click="clearForm"
                      >
                        Clear
                      </button>
                    </template>

                  </template>
                </div>
              </div>
            </template>
          </template>

        </div>
      </div>
    </form>

    <transition name="fade">
      <div v-if="showPopup" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="bg-gray-900 bg-opacity-50 fixed inset-0"></div>
        <div class="bg-white rounded-lg shadow-lg p-6 transform translate-y-[-50%]">
          <div v-if="isSubmitting">
            <p class="text-center text-gray-700">Submitting...</p>
          </div>
          <div v-else-if="isSubmitted">
            <p class="text-center text-green-600 text-2xl">Form submitted successfully!</p>
            <p class="text-center text-gray-700">Thank you for your submission.</p>
            <button class="mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-300 w-full block" @click="closePopup">Close</button>
          </div>
        </div>
      </div>
    </transition>

  </div>

  <div v-else-if="page.type === 'page'">
    <template v-if="page.display === 'single'">
      <div v-for="row in builder" :key="row.text" :class="[getRowWrapperClass(row), styles(row).classes]" :style="styles(row).style" :id="row.customId">
        <div :class="getRowInsideWrapperClass(row)">
          <template v-if="row.mode === 'tab'">
            <div class="flex flex-col">
              <div class="flex">
                <div
                  v-for="(column, index) in row.columns"
                  :key="column.text"
                  :class="['px-4 py-2 cursor-pointer border-b-2 border-transparent', {'bg-indigo-500 text-white': index === activeTabIndex}, {'bg-gray-200': index !== activeTabIndex}]"
                  @click="activeTabIndex = index"
                >
                  {{ column.text }}
                </div>
              </div>
              <div class="border border-t-0 p-4">
                <div v-for="(column, index) in row.columns" :key="column.text" :class="{'hidden': index !== activeTabIndex}">
                  <template v-for="obj in column.object" :key="obj.name">
                    <component :is="getComponentType(obj.type)"
                    v-if="obj.show || shouldShowInput(obj)"
                    v-model="obj.value"
                    :data="obj"
                    :class="[styles(obj).classes, { 'error-input': obj.required && obj.hasError }]"
                    :style="styles(obj).style"
                    @update:modelValue="handleModelValueUpdate">
                    </component>
                  </template>
                </div>
              </div>
            </div>
          </template>
  
          <template v-else-if="row.mode !== 'tab'">
            <template v-if="row.columns.length > 0">
              <div :class="getGridColumnClasses(row)">
                <div v-for="column in row.columns" :key="column.text" :class="[getColumnClasses(column, row), columnStyles(column)]" :style="columnStyles(column)" :id="column.customId">
                  <template v-for="obj in column.object" :key="obj.name">
                    <component :is="getComponentType(obj.type)"
                    v-if="obj.show || shouldShowInput(obj)"
                    v-model="obj.value"
                    :data="obj"
                    :class="[styles(obj).classes, { 'error-input': obj.required && obj.hasError }]"
                    :style="styles(obj).style"
                    @update:modelValue="handleModelValueUpdate">
                    </component>
                  </template>
                </div>
              </div>
            </template>
          </template>
  
        </div>
      </div>
    </template>
    <template v-else-if="page.display === 'group'">
    <Page :data="this.page"></Page>
    </template>

  </div>

  <div v-else-if="page.type === 'post'">
    <Post :data="this.page"></Post>
  </div>

  <div v-else>
    <div v-for="row in builder" :key="row.text" :class="[getRowWrapperClass(row), styles(row).classes]" :style="styles(row).style" :id="row.customId">
      <div :class="getRowInsideWrapperClass(row)">
        <template v-if="row.mode === 'tab'">
          <div class="flex flex-col">
            <div class="flex">
              <div
                v-for="(column, index) in row.columns"
                :key="column.text"
                :class="['px-4 py-2 cursor-pointer border-b-2 border-transparent', {'bg-indigo-500 text-white': index === activeTabIndex}, {'bg-gray-200': index !== activeTabIndex}]"
                @click="activeTabIndex = index"
              >
                {{ column.text }}
              </div>
            </div>
            <div class="border border-t-0 p-4">
              <div v-for="(column, index) in row.columns" :key="column.text" :class="{'hidden': index !== activeTabIndex}">
                <template v-for="obj in column.object" :key="obj.name">
                  <component :is="getComponentType(obj.type)"
                  v-if="obj.show || shouldShowInput(obj)"
                  v-model="obj.value"
                  :data="obj"
                  :class="[styles(obj).classes, { 'error-input': obj.required && obj.hasError }]"
                  :style="styles(obj).style"
                  @update:modelValue="handleModelValueUpdate">
                  </component>
                </template>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="row.mode !== 'tab'">
          <template v-if="row.columns.length > 0">
            <div :class="getGridColumnClasses(row)">
              <div v-for="column in row.columns" :key="column.text" :class="[getColumnClasses(column, row), columnStyles(column)]" :style="columnStyles(column)" :id="column.customId">
                <template v-for="obj in column.object" :key="obj.name">
                  <component :is="getComponentType(obj.type)"
                  v-if="obj.show || shouldShowInput(obj)"
                  v-model="obj.value"
                  :data="obj"
                  :class="[styles(obj).classes, { 'error-input': obj.required && obj.hasError }]"
                  :style="styles(obj).style"
                  @update:modelValue="handleModelValueUpdate">
                  </component>
                </template>
              </div>
            </div>
          </template>
        </template>

      </div>
    </div>
  </div>

</template>
  
  <script>
  import storageManager from '@/plugins/storage';
  import Color from './builder/Color.vue';
  import Post from './builder/Post.vue';
  import Page from './builder/Page.vue';

  import Header from './builder/Header.vue';
  import Image from './builder/Image.vue';
  import Paragraph from './builder/Paragraph.vue';
  import Video from './builder/Video.vue';
  import Slideshow from './builder/Slideshow.vue';
  import Lesson from './builder/Lesson.vue';
  import LessonCalendar from './builder/LessonCalendar.vue';
  import Popup from './builder/Popup.vue';

  import Navigation from './builder/Navigation.vue';
  import Usernav from './builder/Usernav.vue';
  import Table from './builder/Table.vue';
  import Calendar from './builder/Calendar.vue';

  import FormInput from './builder/form/FormInput.vue';
  import FormTextarea from './builder/form/FormTextarea.vue';
  import FormRadiobox from './builder/form/FormRadiobox.vue';
  import FormCheckbox from './builder/form/FormCheckbox.vue';
  import FormSelect from './builder/form/FormSelect.vue';
  import FormUpload from './builder/form/FormUpload.vue';
  import FormAddress from './builder/form/FormAddress.vue';
  import FormDatetime from './builder/form/formDatetimepicker.vue';
  
  import { generateStyles } from '@/plugins/builder.js';
  import { generateInnerStyles } from '@/plugins/builder-inner.js';
  
  export default {
    props: {
        dataItem: {
          type: String,
          required: true
        },
        masterItem: {
          type: String,
          required: true
        },
        mode: {
          type: String,
          required: true
        }
    },
    data() {
      return {
        configs: storageManager.get('configs'),
        builder: [],
        page: [],
        post: [],
        activeTabIndex: 0,
        isSubmitting: false,
        isSubmitted: false,
        showPopup: false,
        limitItem:100,
        limitOptions: [10, 50, 100, 200, 500, 1000, 2000], // Define the available options
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        componentTypes: [ 'header', 'image', 'paragraph', 'video', 'slideshow', 'lesson_widget', 'lesson_calendar', 'navigation', 'usernav', 'popup','address','table','calendar','datetime','textarea','radiobox','input','checkbox','select','upload',],
      };
    },
    components: {
      Color,
      Header,
      Image,
      Paragraph,
      Video,
      Slideshow,
      Lesson,
      LessonCalendar,
      FormInput,
      FormTextarea,
      FormRadiobox,
      FormCheckbox,
      FormSelect,
      FormUpload,
      FormAddress,
      FormDatetime,
      Navigation,
      Usernav,
      Popup,
      Table,
      Calendar,
      Post,
      Page
    },
    computed: {
      styles() {
        return (data) => generateStyles(data);
      },
      InnerStyles() {
        return (data) => generateInnerStyles(data);
      },
      columnStyles() {
        return (column) => [this.styles(column).classes, this.styles(column).style];
      },
    },
    async mounted() {
      try {
        await this.getData();
      } catch (error) {
        console.log(Error);
      }
    },
    watch: {
      'column.object': {
        handler(newValue) {
          newValue.forEach((obj) => {
            this.handleInputChange(obj);
          });
        },
        deep: true
      }
    },
    methods: {
      getComponentType(type) {
        switch (type) {
          case 'header':
          return 'Header';

          case 'image':
          return 'Image';

          case 'paragraph':
          return 'Paragraph';

          case 'video':
          return 'Video';

          case 'slideshow':
          return 'Slideshow';

          case 'lesson_widget':
          return 'Lesson';

          case 'lesson_calendar':
          return 'LessonCalendar';

          case 'navigation':
          return 'Navigation';

          case 'usernav':
          return 'Usernav';

          case 'popup':
          return 'Popup';

          case 'address':
          return 'FormAddress';

          case 'table':
          return 'Table';

          case 'calendar':
          return 'Calendar';

          case 'datetime':
          return 'FormDatetime';

          case 'textarea':
          return 'FormTextarea';

          case 'radiobox':
          return 'FormRadiobox';

          case 'input':
          return 'FormInput';

          case 'checkbox':
          return 'FormCheckbox';

          case 'select':
          return 'FormSelect';

          case 'upload':
          return 'FormUpload';
          
          default:
          return '';
        }
      },
      shouldShowObject(obj) {
        if (obj && obj.show !== undefined) {
          if (!obj.show && (this.shouldShowInput(obj) || this.shouldShowInput(obj) === undefined || this.shouldShowInput(obj) === null || this.shouldShowInput(obj) === '')) {
            return false;
          } else {
            return !(!obj.show && !this.shouldShowInput(obj));
          }
        }
        return this.shouldShowInput(obj);
      },
      handleModelValueUpdate(newValue, destinations) {
        console.log(newValue, destinations);

        if (destinations && Array.isArray(destinations) && destinations.length > 0) {
          destinations.forEach(destination => {
            const { rowIndex, columnIndex, obj } = destination;
            const targetRow = this.builder[rowIndex];
            if (targetRow) {
              const targetColumn = targetRow.columns[columnIndex];
              if (targetColumn) {
                const targetObject = targetColumn.object[obj];
                if (targetObject && targetObject.logics && targetObject.logics.length > 0) {
                  targetObject.logics.forEach(logicConfig => {
                    const { default: logicDefault,method: logicMethod } = logicConfig;
                    console.log("logicConfig",logicConfig);
                    console.log("logicDefault",logicDefault);
                    console.log("newValue",newValue);
                    if (logicDefault === newValue) {
                      if(logicMethod==="show")
                      {
                        targetObject.show = true;
                        targetObject.required = true;
                      }
                      else
                      {
                        targetObject.show = false;
                        targetObject.required = false;
                      }
                      
                    } else {
                      if(logicMethod==="show")
                      {
                        targetObject.show = false;
                        targetObject.required = false;
                      }
                      else
                      {
                        targetObject.show = true;
                        targetObject.required = true;
                      }
                    }
                  });
                }
              }
            }
          });
        }
      },
      shouldShowInput(obj) {
        if (obj.logics && obj.logics.length > 0) {
          const logicConfig = obj.logics[0];
          if (logicConfig.request && logicConfig.method === 'show') {
            if(logicConfig.method === 'show')
            {
              //console.log(obj,false)
              return false;
            }
            else if(logicConfig.method === 'hide')
            {
              //console.log(obj,true)
              return true;
            }
          }
        }
        //console.log(obj,true)
        return true;
      },
      /*getGridColumnClasses(row) {
        let colSize = 'grid';
        colSize += ' grid-cols-1 sm:grid-cols-2';
        if (row.col && !isNaN(parseInt(row.col)) && parseInt(row.col) > 0) {
          colSize += ` md:grid-cols-3`;
          colSize += ` lg:grid-cols-${row.col} xl:grid-cols-${row.col}`;
        } else {
          colSize += ` md:grid-cols-1`;
          colSize += ` lg:grid-cols-1 xl:grid-cols-1`;
        }
        return colSize;
      },*/
      getGridColumnClasses(row) {
        let colSize = 'grid grid-cols-1';
        
        if (row.col && !isNaN(parseInt(row.col)) && parseInt(row.col) > 0) {
          colSize += ` md:grid-cols-${row.col}`;
        }
        
        return colSize;
      },
      getRowWrapperClass(row) {
        if (row.sz === 'block') {
          return `row-obj mx-auto max-w-7xl`;
        } else if (row.sz === 'w-full') {
          return `row-obj w-full`;
        }
      },
  
      convertClassObjectToString(classObject) {
        return Object.keys(classObject).filter((key) => classObject[key]).join(' ');
      },
      getRowInsideWrapperClass(row) {

        if (row.sz === 'w-full') {
          if (row.bsz === 'block' || !row.bsz) {
            return `row-inside mx-auto pl-5 pr-5 ${row.width}`;
          } else if (row.bsz === 'unset') {
            return `row-inside mx-auto pl-5 pr-5 max-w-7xl`;
          } else if (row.bsz === 'w-full') {
            return `row-inside `;
          }
        }
      },
  
      getColumnClasses(column) {
        return {
          'col-obj': true,
          ['col-span-'+column.colspan]: true,
          'inline': column.inline,
          'text-left': column.alignment === 'left',
          'text-center': column.alignment === 'center',
          'text-right': column.alignment === 'right',
          'w-full': column.sz === 'w-full',
          'space-x-2': column.inline && column.spacing === 'space',
          'mr-2': column.inline && column.spacing === 'margin',
          'pr-2': column.inline && column.spacing === 'padding',
          [column.customClass]: !!column.customClass
        };
      },
  
      getObjectClasses(obj) {
        return {
          ...this.getPaddingClasses(obj.padding),
          ...this.getMarginClasses(obj.margin),
        };
      },
  
      getPaddingClasses(padding) {
        return {
          [`pt-${padding.t}`]: padding && padding.t !== undefined && padding.t !== 0,
          [`pr-${padding.r}`]: padding && padding.r !== undefined && padding.r !== 0,
          [`pb-${padding.b}`]: padding && padding.b !== undefined && padding.b !== 0,
          [`pl-${padding.l}`]: padding && padding.l !== undefined && padding.l !== 0,
        };
      },
  
      getMarginClasses(margin) {
        return {
          [`mt-${margin.t}`]: margin && margin.t !== undefined && margin.t !== 0,
          [`mr-${margin.r}`]: margin && margin.r !== undefined && margin.r !== 0,
          [`mb-${margin.b}`]: margin && margin.b !== undefined && margin.b !== 0,
          [`ml-${margin.l}`]: margin && margin.l !== undefined && margin.l !== 0,
        };
      },

      getImageStyle(align, spacing) {
        const style = {
          display: 'inline-block',
          textAlign: align || 'left', // Use the provided alignment value or default to 'left'
        };

        if (spacing === 'space') {
          style.margin = '0 5px'; // Adjust the spacing values as needed
        } else if (spacing === 'margin') {
          style.margin = '5px'; // Adjust the spacing values as needed
        } else if (spacing === 'padding') {
          style.padding = '5px'; // Adjust the spacing values as needed
        }

        return style;
      },
  
      async submitForm() {

        this.showPopup = true;
        this.isSubmitting = true;

        const formData  = {};
        let hasError    = false;
  
        this.builder.forEach((row) => {
          row.columns.forEach((column) => {
            column.object.forEach((obj) => {
              if (
                obj.type === 'input' ||
                obj.type === 'address' ||
                obj.type === 'datetime' ||
                obj.type === 'textarea' ||
                obj.type === 'radiobox' ||
                obj.type === 'checkbox' ||
                obj.type === 'select' ||
                obj.type === 'upload'
              ) {

                let type = obj.type;
                let mode = obj.type;
                if (obj.type === 'input') {
                  type = obj.inputType;
                  mode = obj.type;
                }

                if (obj.type === 'address') {
                  type = 'address';
                  mode = obj.inputType;
                }

                console.log("obj",obj);

                formData[obj.name] = {
                  value: obj.value,
                  type: type, // Add the type key to the formData object
                  mode: mode,
                };
                if (obj.required && (obj.value === undefined || obj.value === null || obj.value === '' || obj.value.length === 0)) {
                  obj.hasError = true;
                  hasError = true;
                } else {
                  obj.hasError = false;
                }
              }
            });
          });
        });

        console.log(formData);
  
        if (!hasError) {
          console.log(formData);

          try {
            const requestData = {
              data: {
                parent: this.configs.siteID,
                formData,
                formID: this.page._id,
                status: 'submit'
              },
              options: {}
            };

            if (this.masterItem) {
              requestData.data.courseID = this.masterItem;
            }

            const resAPI = await fetch('https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/' + this.page.destination, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestData)
            });

            if (resAPI.status===200) {
              console.log('Form data submitted successfully');
              this.isSubmitting = false;
              this.isSubmitted = true;

              this.clearForm();
              this.builder.forEach((row) => {
                row.columns.forEach((column) => {
                  column.object.forEach((obj) => {
                    obj.value = ''; // Reset field value
                  });
                });
              });
            } else {
              console.error('Form submission failed');
            }
          } catch (error) {
            console.error('Error occurred during form submission:', error);
          }

          this.builder.forEach((row) => {
            row.columns.forEach((column) => {
              column.object.forEach((obj) => {
                obj.hasError = false;
              });
            });
          });
        }
        else
        {
          this.isSubmitting = false;
          this.isSubmitted = false;
          this.showPopup = false;
        }
      },

      closePopup() {
        this.showPopup = false;
        location.reload(); // Refresh the page when the popup is closed
      },
  
      clearForm() {
        this.builder.forEach((row) => {
          row.columns.forEach((column) => {
            column.object.forEach((obj) => {
              if (obj.type === 'input' || obj.type === 'textarea' || obj.type === 'radiobox' || obj.type === 'checkbox' || obj.type === 'select' || obj.type === 'upload') {
                obj.value = '';
              }
            });
          });
        });
      },

      async getData() {
        let apiUrl = '';
        let requestBody = {};

        if (this.mode === 'id') {
          apiUrl = `https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/${this.dataItem}`;
          requestBody = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          };
        } else if (this.mode === 'slug') {
          apiUrl = 'https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/query';
          requestBody = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              method: 'find',
              args: [
                {
                  $and: [
                    { owner: this.configs.siteID },
                    { slug: this.dataItem },
                  ],
                },
              ],
            }),
          };
        } else {
          return;
        }

        try {
          const resAPI = await fetch(apiUrl, requestBody);
          const RestReturn = await resAPI.json();

          let pageLayout = null;
          let savedLayout = null;

          if (this.mode === 'id') {
            pageLayout = RestReturn;
            savedLayout = RestReturn.builder;
          } else if (this.mode === 'slug') {
            pageLayout = RestReturn[0];
            savedLayout = RestReturn[0].builder;
          }
          //console.log("pageLayout",pageLayout)
          if(pageLayout.type==="page" || pageLayout.type==="form"){
            this.$setPageTitle(pageLayout.title);
          }
          
          if (pageLayout) {
            this.builder = savedLayout;
            this.page = pageLayout;
            if (pageLayout.display === "group") {
              //console.log("Get Post Here");
              const postData = await this.getPostData(pageLayout._id);
              this.post = postData.data
              //console.log("postData", postData);
            }
          }
        } catch (error) {
          console.log(error);
        }

      },
      async getPostData(post_id) {
        try {

            this.loading = true;
            this.activeBlock = true

            const andConditions = [{ parent: post_id }];

            if (this.statusFilter !== 'all') {
              andConditions.push({ status: this.statusFilter });
            }

            const pipeline = [
            {
              $match: {
                $and: andConditions,
              },
            },
            {
              $facet: {
                post: [
                  {
                    $skip: (this.currentPage - 1) * this.limitItem,
                  },
                  {
                    $limit: this.limitItem,
                  },
                ],
                totalCount: [
                  {
                    $count: 'count',
                  },
                ],
              },
            },
          ];

            const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pipeline: pipeline,
              }),
            };

            const resAPI = await fetch(
              'https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/aggregate',
              requestOptions
            );

            const data = await resAPI.json();
            const postResults = data[0].post;
            const totalCount = data[0].totalCount[0].count;

            console.log('Post Results:', postResults);
            console.log('Total Count:', totalCount);

            if (data) {
                const totalCount = data[0]?.totalCount?.[0]?.count || 0;

                const formattedData = {
                    data: data[0].post,
                    total: totalCount,
                    paging: {
                        page: this.currentPage,
                        limit: this.limitItem,
                        totalPages: Math.ceil(totalCount / this.limitItem)
                    }
                };

                this.listItems = formattedData.data;
                this.totalItems = formattedData.total;
                this.totalPages = formattedData.paging.totalPages;

                console.log("data",this.listItems);

                this.loading = false;
                this.activeBlock = false;
                return formattedData;
            }
        } catch (error) {
            console.log(error);
        }
      },
      
  
    },
  };
  </script>
  <style scoped>
  .vueperslide__title
  {
  background-color: #000;
  }
  
  .vueperslide__content
  {
  
  }
  .error-input {
    border: 1px solid rgb(255 0 0 / 12%);
    background: rgb(255 0 0 / 6%);
    padding: 5px;
  }
  
  .error-message {
    color: red; /* Add your desired error message styling */
  }
  </style>
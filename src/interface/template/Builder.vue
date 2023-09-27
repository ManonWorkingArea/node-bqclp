<script>
import Subhead              from '@/interface/template/outline/Subhead.vue';
import storageManager       from '@/plugins/storage';
import CustomConfirmation   from '@/utils/Confirmation.vue';
import MiniMCE              from 'minimce'
import FileBrowser          from '@/interface/modal/FileBrowser.vue';

import ColorPicker from '@/utils/Color.vue';

import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default/icons'

import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

function updateItemProperties(item, selectedItem) {
  const {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    borderLeftWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderColor,
    borderStyle,
    mobile,
    tablet,
    laptop,
    desktop,
    position,
    bgType,
    bgColor,
    bgImage,
    bgGradientColor1,
    bgGradientColor2,
    bgVideo,

    bgInnerType,
    bgInnerColor,
    bgInnerImage,
    bgInnerGradientColor1,
    bgInnerGradientColor2,
    bgInnerVideo,

    borderRadiusTopLeft,
    borderRadiusTopRight,
    borderRadiusBottomRight,
    borderRadiusBottomLeft,

    logics
  } = selectedItem;

  // Padding
  item.paddingTop = paddingTop;
  item.paddingRight = paddingRight;
  item.paddingBottom = paddingBottom;
  item.paddingLeft = paddingLeft;

  // Margin
  item.marginTop = marginTop;
  item.marginRight = marginRight;
  item.marginBottom = marginBottom;
  item.marginLeft = marginLeft;

  // Rounder
  item.borderRadiusTopLeft = borderRadiusTopLeft;
  item.borderRadiusTopRight = borderRadiusTopRight;
  item.borderRadiusBottomRight = borderRadiusBottomRight;
  item.borderRadiusBottomLeft = borderRadiusBottomLeft;

  // Border
  item.borderLeftWidth = borderLeftWidth;
  item.borderTopWidth = borderTopWidth;
  item.borderRightWidth = borderRightWidth;
  item.borderBottomWidth = borderBottomWidth;
  item.borderColor = borderColor;
  item.borderStyle = borderStyle;

  item.position = position;

  // Responsive
  item.mobile = mobile;
  item.tablet = tablet;
  item.laptop = laptop;
  item.desktop = desktop;

  // Background
  item.bgType = bgType;
  item.bgColor = bgColor;
  item.bgImage = bgImage;
  item.bgGradientColor1 = bgGradientColor1;
  item.bgGradientColor2 = bgGradientColor2;
  item.bgVideo = bgVideo;

  // Background
  item.bgInnerType = bgInnerType;
  item.bgInnerColor = bgInnerColor;
  item.bgInnerImage = bgInnerImage;
  item.bgInnerGradientColor1 = bgInnerGradientColor1;
  item.bgInnerGradientColor2 = bgInnerGradientColor2;
  item.bgInnerVideo = bgInnerVideo;

  // Logics
  item.logics = logics;
}

export default {
    emits: ['update-layout'],
    name: 'MyRows',
    components: {
      Subhead,
      MiniMCE,
      CustomConfirmation,
      FileBrowser,
      VueperSlides, VueperSlide ,ColorPicker
    },
    props: {
        builderData: {
            type: Object,
            required: true
        },
        getBuilder: {
            type: Function,
            required: true
        },
        backUrl: {
            type: String,
            required: true
        }
    },
    computed: {
      getColumnDivClass() {
        return (columnIndex) => ({
          'relative': true,
          'bg-gray-100': true,
          'border-gray-200': true,
          'p-2': true,
          'cursor-pointer': true,
          'hover:border': true,
          'hover:border-black': true,
          'active-panel': this.activeColumnIndex === columnIndex
        });
      },
      divStyles() {
        if (this.fullScreenMode) {
          const height = `calc(100vh - 190px)`;
          return {
            height,
            overflowY: 'scroll',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
            right: '-20px'
          };
        } else {
          return {
            minHeight: '600px',
            maxHeight: '600px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
            right: '-20px'
          };
        }
      },
      post() {
        return this.builderData;
      },
      rows() {
        return this.builderData.builder;
      },
      selectedColumn() {
        return this.rows[this.popupDataRow].columns[this.popupDataColumn];
      },
      filteredContentItems() {
        if (this.builderData.type === 'form') {
          return this.contentItems;
        } else {
          return this.contentItems.filter(item => item.type !== 'form');
        }
      }
    },
    data() {
      return {
        showButtonPanel: false,
        activeColumnIndex: null,
        columnPanels: [],
        rowPanels:[],
        configs: storageManager.get('configs'),
        session: storageManager.get('session'),
        dataItem: this.$route.params.slug,
        builder:'web',
        previewRows: [],
        previewHtml: '',
        showPopup: false,
        activeBlock: false,
        popupData: {},
        popupDataRow: '',
        popupDataColumn: '',
        selectedOption: "",
        popupStage: false,
        popupdata: [],
        paddingValue:'',
        marginValue:'',
        paddingInnerValue:'',
        marginInnerValue:'',
        lightboxOpen: false,
        showColorPickerField: null,
        lightboxRowIndex: undefined,
        lightboxColumnIndex: undefined,
        editPopupOpen: false,
        fullScreenMode: false,
        selectedItemIndex:undefined,
        selectedSlideItemIndex:undefined,
        activeTab: 'content',
        selectedSlideIndex: undefined,
        selectedColor: '',
        selectedItem: {
          bgType: 'none',
          bgColor: '',
          bgImage: '',
          bgGradientColor1: '',
          bgGradientColor2: '',
          bgVideo: '',
        },
        contentItems: [
          { 
            icon: 'keyboard',
            description: 'Form Element',
            type: 'form', 
            name: 'แบบฟอร์ม',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            elements:[],
            position:'relative',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'heading',
            description: 'Page Header',
            type: 'header', 
            name: 'หัวข้อ',
            //Default Data
            text: 'Type Header Text Here',
            align: 'center', 
            fontSize: 'md', 
            fontWeight: 'normal', 
            color: 'black', 
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'align-justify',
            description: 'Text Paragraph',
            type: 'paragraph', 
            name: 'ข้อความ',
            text: 'Type Text Here',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'image',
            description: 'Image Content',
            type: 'image', 
            name: 'รูปภาพ',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'images',
            description: 'Image Slideshow',
            type: 'slideshow', 
            name: 'สไลด์โชว์',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            slides:[],
            interval:4000,
            autoplay:true,
            customClass: '',
            customId: '',
          },
          { 
            icon: 'video',
            description: 'Video Content',
            type: 'video', 
            name: 'วีดีโอ',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'list',
            description: 'Web Menu',
            type: 'navigation', 
            name: 'เมนู',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            menu: '',
            position:'relative',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'list',
            description: 'User Menu',
            type: 'usernav', 
            name: 'เมนู',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'list',
            description: 'Lesson Widget',
            type: 'lesson_widget', 
            name: 'Lesson Widget',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'calendar',
            description: 'Lesson Calendar',
            type: 'lesson_calendar', 
            name: 'Lesson Calendar',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'list',
            description: 'Add custom row and column',
            type: 'smartlayout', 
            name: 'Smart Layout',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'list',
            description: 'Add custom row and column',
            type: 'popup', 
            name: 'Popup Content',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'table',
            description: 'Add table',
            type: 'table', 
            name: 'Table Content',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            dataSourceType:'manual',
            selectedMethodType:'',
            apiEndpoint:'',
            columns: [],
            rows: [],
            customClass: '',
            customId: '',
          },
          { 
            icon: 'calendar',
            description: 'Calendar',
            type: 'calendar', 
            name: 'Calendar Content',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            customClass: '',
            customId: '',
          },
        ],
        formItems: [
          { 
            icon: 'align-justify',
            description: 'Input Text',
            type: 'input', 
            name: 'Text Input',
            //Default Data
            text: 'Placeholder',
            align: 'left', 
            fontSize: 'md', 
            fontWeight: 'normal', 
            color: 'black', 
            inputType:'text',
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            hasError: false,
            reqError: 'This field is required.',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'paragraph',
            description: 'Textarea',
            type: 'textarea', 
            name: 'Textarea',
            //Default Data
            text: 'Placeholder',
            align: 'left', 
            fontSize: 'md', 
            fontWeight: 'normal', 
            color: 'black', 
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            hasError: false,
            reqError: 'This field is required.',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'check-circle',
            description: 'Radio',
            type: 'radiobox', 
            name: 'Radiobox',
            //Default Data
            text: 'Placeholder',
            align: 'left', 
            fontSize: 'md', 
            fontWeight: 'normal', 
            color: 'black', 
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            hasError: false,
            reqError: 'This field is required.',
            options:[],
            customClass: '',
            customId: '',
          },
          { 
            icon: 'check-square',
            description: 'Checkbox',
            type: 'checkbox', 
            name: 'Checkbox',
            //Default Data
            text: 'Placeholder',
            align: 'center', 
            fontSize: 'md', 
            fontWeight: 'normal', 
            color: 'black', 
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            hasError: false,
            reqError: 'This field is required.',
            options:[],
            customClass: '',
            customId: '',
          },
          { 
            icon: 'sort-down',
            description: 'Select',
            type: 'select', 
            name: 'Dropdown',
            //Default Data
            text: 'Dropdown',
            align: 'left', 
            fontSize: 'md', 
            fontWeight: 'normal', 
            color: 'black', 
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            hasError: false,
            reqError: 'This field is required.',
            options:[],
            customClass: '',
            customId: '',
          },
          { 
            icon: 'upload',
            description: 'Upload',
            type: 'upload', 
            name: 'อัพโหลดไฟล์',
            //Default Data
            text: 'Upload',
            align: 'left', 
            fontSize: 'md', 
            fontWeight: 'normal', 
            color: 'black', 
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            hasError: false,
            reqError: 'This field is required.',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'upload',
            description: 'Submit Button',
            type: 'button', 
            name: 'ปุ่ม Submit',
            //Default Data
            text: 'Submit Button',
            align: 'left', 
            fontSize: 'md', 
            fontWeight: 'normal', 
            color: 'black', 
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            style:'primary',
            textSize:'text-base',
            label:'Button',
            hasError: false,
            reqError: 'This field is required.',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'globe',
            description: 'Address Form',
            type: 'address', 
            name: 'Address Input',
            //Default Data
            text: 'Address Form',
            align: 'left', 
            fontSize: 'md', 
            fontWeight: 'normal', 
            color: 'black', 
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            inputType:'standard',
            hasError: false,
            reqError: 'This field is required.',
            customClass: '',
            customId: '',
          },
          { 
            icon: 'calendar',
            description: 'Datetime Picker',
            type: 'datetime', 
            name: 'Datetime Picker',
            //Default Data
            text: 'Datetime Picker',
            align: 'left', 
            fontSize: 'md', 
            fontWeight: 'normal', 
            color: 'black', 
            mobile: true, 
            tablet: true, 
            laptop: true, 
            desktop: true,
            position:'relative',
            showDateTime:'datetime',
            hasError: false,
            reqError: 'This field is required.',
            customClass: '',
            customId: '',
          }
        ],
        confirmationMessage: '',
        confirmationHeader: '',
        showConfirmation: false,
        deletionData: null,
        showFormSubMenu: false,

        FileBrowserOpen: false,
        FileImageBrowserOpen: false,
        setAllMargin: false,
        setAllPadding: false,
        setAllInnerPadding: false,

        dataSourceType: 'manual',
        apiEndpoint: '',
        selectedMethodType: 'GET',
        apiResponseError: '',
      };
    },
    async mounted() {
      try {
        await this.getMenuData();
      } catch (error) {
        console.log(error);
      }
    },
    methods: {
      toggleColumnPanel(columnIndex) {
        if (this.activeColumnIndex === columnIndex) {
          this.activeColumnIndex = null; // Hide the panel if it's already active
        } else {
          this.activeColumnIndex = columnIndex; // Show the clicked panel
        }
      },
      toggleRowPanel(rowIndex) {
        this.columnPanels = [];
        this.rowPanels[rowIndex] = !this.rowPanels[rowIndex];
      },
      toggleFullScreenMode() {
        this.fullScreenMode = !this.fullScreenMode;
      },
      async getMenuData() {
        if (storageManager.get('session', 'login')) {
          try {
            const resAPI = await fetch(
              "https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/query",
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  method: 'find',
                  args: [
                    {
                      $and: [
                        { owner: this.session.current._id },
                        { type: { $in: ['menu'] } },
                      ],
                    },
                  ],
                  paging: { page: this.currentPage, limit: this.limitItem },
                }),
              }
            );

            const response = await resAPI.json();
            if(resAPI.status===200)
            {
              this.menuItems = response.data
              console.log(this.menuItems);
            }
          } catch (error) {
            console.log(error);
          }
        }
      },
      showColorPicker(field) {
          this.showColorPickerField = field;
      },
      updateColor(field) {
          this.selectedItem[field] = event.target.value;
      },
      handleItemClick(item, lightboxRowIndex, lightboxColumnIndex) {
        if (item.type === 'form') {
          this.showFormSubMenu = true;
          // Perform additional actions for form type
          // ...
        } else {
          // Perform original function for other item types
          this.addContentItem(item, lightboxRowIndex, lightboxColumnIndex);
        }
      },
      getDataFromParent() {
          const data = this.getBuilder();
          console.log(data); // Use the retrieved data as needed
      },
      getContentIcon(type) {
        const items = this.builderData.type === 'input' ? this.formItems : this.contentItems;
        const contentItem = items.find(item => item.type === type);
        return contentItem ? contentItem.icon : '';
      },
      OpenFileBrowser(index)
      {
        this.selectedSlideItemIndex = index;
        this.FileBrowserOpen = true;
      },
      changeFileTrigger(payload) {
        this.FileBrowserOpen = payload;
      },
      selectFileTrigger(payload) {
        console.log("selectFileTrigger");
        if(payload!=undefined) {
          this.selectCourseCover = payload;
          console.log("selectFileReturnFunction",payload.file)
          this.selectedItem.slides[this.selectedSlideItemIndex].image = payload.file
          this.selectedSlideItemIndex = undefined;
        }
      },
      OpenFileImageBrowser(index)
      {
        console.log("SlideIndex",index)
        console.log("lightboxRowIndex",this.lightboxRowIndex)
        console.log("lightboxColumnIndex",this.lightboxColumnIndex)
        this.FileImageBrowserOpen = true;
      },
      changeFileImageTrigger(payload) {
        this.FileImageBrowserOpen = payload;
      },
      selectFileImageTrigger(payload) {
        console.log("selectFileTrigger");
        if(payload!=undefined) {
          this.selectCourseCover = payload;
          console.log("selectFileReturnFunction",payload.file)
          this.selectedItem.url = payload.file
        }
      },
      openPopup(rowIndex, columnIndex, Mode, Position, title) {
        this.popupPosition  = Position;
        this.popupTitle     = title;
        this.popupMode      = Mode;
        this.popupData      = 
        {
          row: rowIndex, 
          col: columnIndex, 
          data: 'Popup Data' 
        };
        this.popupStage = true;
      },
      handleSave(data) {
        console.log('Save data:', data);
        this.popupStage = false;
      },
      handleCancel() {
        console.log('Popup cancelled');
        this.popupStage = false;
      },
      handleTrigger(data) {
        console.log('Popup triggered:', data);
      },
      showPopupWithData(newData, row, column) {
        this.popupData = newData;
        this.popupDataRow = row;
        this.popupDataColumn = column;
        this.showPopup = true;
      },
      saveData(keyword, row, column) {
        console.log(keyword, row, column);
        this.rows[row].columns[column].keywords = keyword;
      },
      closePopup() {
        this.popupVisible = false;
      },
      updateData(layout) {
        this.$emit('update-layout', layout);
      },
      addRow() {
        this.rows.push({
          text: 'Row',
          col: "1",
          bgType: "none",
          padding: { l: 0, r: 0, b: 0, t: 0 },
          margin: { l: 0, r: 0, b: 0, t: 0 },
          paddingTop: '',
          paddingRight: '',
          paddingBottom: '',
          paddingLeft: '',
          marginTop: '',
          marginBottom: '',
          marginRight: '',
          marginLeft: '',
          paddingInnerTop: '',
          paddingInnerRight: '',
          paddingInnerBottom: '',
          paddingInnerLeft: '',
          mobile: true, 
          tablet: true, 
          laptop: true, 
          desktop: true,
          position:'relative',
          width: 'max-w-full',
          sz: 'w-full',
          bsz: 'block',
          type:'row',
          alignment: 'left',
          mode: 'standard',
          customClass: '',
          customId: '',
          columns: []
        });
        this.previewLayout()
      },
      addColumn(rowIndex) {
        this.rows[rowIndex].columns.push({
          text: 'Column',
          content: '',
          padding: { l: 0, r: 0, b: 0, t: 0 },
          margin: { l: 0, r: 0, b: 0, t: 0 },
          type:'column',
          sz: 'block',
          bsz: 'block',
          paddingTop: '',
          paddingRight: '',
          paddingBottom: '',
          paddingLeft: '',
          marginTop: '',
          marginBottom: '',
          marginRight: '',
          marginLeft: '',
          colspan: "1",
          mobile: true, 
          tablet: true, 
          laptop: true, 
          desktop: true,
          position:'relative',
          alignment: 'left',
          customClass: '',
          customId: '',
          object: [] // Initialize the object property as an empty array
        });
        this.previewLayout()
      },
      openConfig(index) {
        this.rows[index].configOpen = true;
      },
      closeConfig(index) {
        this.rows[index].configOpen = false;
      },
      updateRow(index, row) {
        const newRow = {
          ...row,
          padding: { ...row.padding },
          margin: { ...row.margin }
        };
        this.rows[index] = newRow;
        this.previewLayout()
      },
      removeRow(index) {
        this.confirmationMessage = 'คุณต้องการลบแถวแนวนอน (Row) นี้ ?';
        this.confirmationHeader = 'ยืนยันการทำรายการ';
        this.deletionData = {
          type: 'row',
          rowIndex: index
        };
        this.showConfirmation = true;
      },
      removeColumn(rowIndex, columnIndex) {
        this.confirmationMessage = 'คุณต้องการลบแถวแนวตั้ง (Column) นี้ ?';
        this.confirmationHeader = 'ยืนยันการทำรายการ';
        this.deletionData = {
          type: 'column',
          rowIndex,
          columnIndex
        };
        this.showConfirmation = true;
      },
      removeItem(rowIndex, columnIndex, itemIndex) {
        this.confirmationMessage = 'คุณต้องการลบเนื้อหา (Content) นี้ ?';
        this.confirmationHeader = 'ยืนยันการทำรายการ';
        this.deletionData = {
          type: 'item',
          rowIndex,
          columnIndex,
          itemIndex
        };
        this.showConfirmation = true;
      },
      confirmRemoveRow() {
        const { rowIndex } = this.deletionData;
        this.rows.splice(rowIndex, 1);
        this.handleConfirmCancel();
      },
      confirmRemoveColumn() {
        const { rowIndex, columnIndex } = this.deletionData;
        this.rows[rowIndex].columns.splice(columnIndex, 1);
        this.handleConfirmCancel();
      },
      confirmRemoveItem() {
        const { rowIndex, columnIndex, itemIndex } = this.deletionData;
        this.rows[rowIndex].columns[columnIndex].object.splice(itemIndex, 1);
        this.handleConfirmCancel();
      },
      handleConfirmation() {
        if (this.deletionData) {
          const { type } = this.deletionData;
          if (type === 'item') {
            this.confirmRemoveItem();
          } else if (type === 'row') {
            this.confirmRemoveRow();
          } else if (type === 'column') {
            this.confirmRemoveColumn();
          }
        }
      },
      handleConfirmCancel() {
        this.deletionData = null;
        this.confirmationMessage = '';
        this.confirmationHeader = '';
        this.showConfirmation = false;
      },
      async previewLayout() {
        this.previewRows = this.rows;
        console.log('rows', this.rows);
        setConfigOpenToFalse(this.rows);
        this.updateData(this.rows);
    },
    cloneColumn(rowIndex, columnIndex) {
      const columnToClone = this.rows[rowIndex].columns[columnIndex];
      const clonedColumn = JSON.parse(JSON.stringify(columnToClone));
      this.rows[rowIndex].columns.splice(columnIndex + 1, 0, clonedColumn);
    },
    cloneRow(rowIndex) {
      const rowToClone = this.rows[rowIndex];
      const clonedRow = JSON.parse(JSON.stringify(rowToClone));
      this.rows.splice(rowIndex + 1, 0, clonedRow);
    },
      saveContent(rowIndex, columnIndex, contentData) {
        const oldKeywords = this.rows[rowIndex].columns[columnIndex].keywords;
        const newKeywords = contentData.keywords;
        console.log(newKeywords);
        if (!oldKeywords) {
          this.rows[rowIndex].columns[columnIndex].content = contentData.content;
          this.rows[rowIndex].columns[columnIndex].keywords = newKeywords;
        } else {
          Object.keys(newKeywords).forEach(keyword => {
            if (!(keyword in oldKeywords) && Object.prototype.hasOwnProperty.call(newKeywords, keyword)) {
              oldKeywords[keyword] = newKeywords[keyword];
            }
          });

          Object.keys(oldKeywords).forEach(keyword => {
            if (!(keyword in newKeywords) && Object.prototype.hasOwnProperty.call(oldKeywords, keyword)) {
              delete oldKeywords[keyword];
            }
          });

          this.rows[rowIndex].columns[columnIndex].content = contentData.content;
        }
        this.closeAddContent(rowIndex, columnIndex);
        this.previewLayout();
      },
      openColumnConfig(rowIndex, columnIndex) {
        this.rows[rowIndex].columns[columnIndex].configOpen = true;
      },
      closeColumnConfig(rowIndex, columnIndex) {
        this.rows[rowIndex].columns[columnIndex].configOpen = false;
      },
      updateColumn(rowIndex, columnIndex, column) {
        const newColumn = {
          ...column,
          padding: { ...column.padding },
          margin: { ...column.margin }
        };
        this.rows[rowIndex].columns[columnIndex] = newColumn;
        this.previewLayout()
      },
      moveRowUp(index) {
      if (index > 0) {
        const tempRow = this.rows[index];
        this.rows.splice(index, 1);
        this.rows.splice(index - 1, 0, tempRow);
        this.previewLayout()
      }
    },
    moveRowDown(index) {
      if (index < this.rows.length - 1) {
        const tempRow = this.rows[index];
        this.rows.splice(index, 1);
        this.rows.splice(index + 1, 0, tempRow);
        this.previewLayout()
      }
    },
    moveColumnLeft(rowIndex, columnIndex) {
      if (columnIndex > 0) {
        const tempColumn = this.rows[rowIndex].columns[columnIndex];
        this.rows[rowIndex].columns.splice(columnIndex, 1);
        this.rows[rowIndex].columns.splice(columnIndex - 1, 0, tempColumn);
        this.previewLayout()
      }
    },
    moveColumnRight(rowIndex, columnIndex) {
      if (columnIndex < this.rows[rowIndex].columns.length - 1) {
        const tempColumn = this.rows[rowIndex].columns[columnIndex];
        this.rows[rowIndex].columns.splice(columnIndex, 1);
        this.rows[rowIndex].columns.splice(columnIndex + 1, 0, tempColumn);
        this.previewLayout()
      }
    },
    editColumnText(rowIndex, columnIndex) {
      const column = this.rows[rowIndex].columns[columnIndex];
      column.editing = true;
      this.$forceUpdate();
    },
    saveColumnText(rowIndex, columnIndex) {
      const column = this.rows[rowIndex].columns[columnIndex];
      column.editing = false;
      // Perform any necessary save logic here, such as making an API request
      console.log('Saved column text:', column.text);
    },
    show() {
      // Example show function
      console.log('Showing...');
    },
    openAddContent(rowIndex, columnIndex) {
      this.rows[rowIndex].columns[columnIndex].addContentOpen = true;
    },
    addContentItem(item, rowIndex, columnIndex) {
      console.log("item", item);

      if (!this.rows[rowIndex].columns[columnIndex].object) {
        this.rows[rowIndex].columns[columnIndex].object = [];
      }

      // Generate a timestamp as a unique ID
      const uid = Date.now().toString();

      // Add the unique ID to the item
      item.uid = uid;

      this.rows[rowIndex].columns[columnIndex].object.push(item);
      this.lightboxOpen = false;
    },
    openAddContentAndLightbox(rowIndex, columnIndex) {
      this.lightboxRowIndex = rowIndex;
      this.lightboxColumnIndex = columnIndex;
      this.lightboxOpen = true;
    },
    closeLightbox() {
      this.lightboxRowIndex = undefined;
      this.lightboxColumnIndex = undefined;
      this.selectedItemIndex = undefined;
      this.lightboxOpen = false;
    },
    openEditPopup(rowIndex, columnIndex, itemIndex) {
      if (rowIndex !== undefined && columnIndex !== undefined && itemIndex !== undefined) {
        const column              = this.rows[rowIndex].columns[columnIndex];
        const selectedItem        = column.object[itemIndex];
        this.selectedItemIndex    = itemIndex;
        this.selectedItem         = { ...selectedItem }; // Create a copy of the item to prevent modifying the original data
        this.lightboxRowIndex     = rowIndex;
        this.lightboxColumnIndex  = columnIndex;
        this.activeTab            = 'content';
      } else if (rowIndex !== undefined && columnIndex !== undefined) {
        const selectColumn = this.rows[rowIndex].columns[columnIndex];
        this.lightboxRowIndex     = rowIndex;
        this.lightboxColumnIndex  = columnIndex;
        this.selectedItem         = selectColumn;
        this.activeTab            = 'content';
      } else if (rowIndex !== undefined) {
        const selectedRow         = this.rows[rowIndex];
        this.lightboxRowIndex     = rowIndex;
        this.selectedItem         = selectedRow;
        this.activeTab            = 'content';
      }
      this.editPopupOpen = true;
      this.fullScreenMode = false;
      console.log(this.selectedItem.tablet);
    },
    updateMenuName(title) {
      this.selectedItem.menuName = title;
    },
    saveEditedItem() {
      console.log('Saved:', this.selectedItem);

      const rowIdx    = this.lightboxRowIndex;
      const colIdx    = this.lightboxColumnIndex;
      const objectIdx = this.selectedItemIndex;

      if (rowIdx !== undefined) {
        const row = this.rows[rowIdx];

        if (colIdx !== undefined && objectIdx !== undefined) {
          console.log("Edit Object");
          const column = row.columns[colIdx];

          if (objectIdx >= 0 && objectIdx < column.object.length) {
            const selectedItem = this.selectedItem;
            const editedItem = column.object[objectIdx];

            switch (editedItem.type) {
              case 'paragraph':
                if (editedItem) {
                editedItem.text = selectedItem.text;
                }
              break;

              case 'header':
                if (editedItem) {
                editedItem.text = selectedItem.text;
                editedItem.align = selectedItem.align;
                editedItem.fontSize = selectedItem.fontSize;
                editedItem.fontWeight = selectedItem.fontWeight;
                editedItem.color = selectedItem.color;
                editedItem.heightOption = selectedItem.heightOption;
                editedItem.height = selectedItem.height;
                editedItem.heightUnit = selectedItem.heightUnit;
                editedItem.alignH = selectedItem.alignH;
                }
              break;

              case 'image':
                if (editedItem) {
                editedItem.url = selectedItem.url;
                editedItem.alt = selectedItem.alt;
                editedItem.canLink = selectedItem.canLink;
                editedItem.link = selectedItem.link;
                editedItem.target = selectedItem.target;
                editedItem.showShadow = selectedItem.showShadow;
                editedItem.showHome = selectedItem.showHome;
                editedItem.width = selectedItem.width;
                }
              break;

              case 'slideshow':
                if (editedItem) {
                editedItem.slides = selectedItem.slides;
                editedItem.interval = selectedItem.interval;
                editedItem.autoplay = selectedItem.autoplay;
                }
              break;

              case 'video':
                if (editedItem) {
                editedItem.url = selectedItem.url;
                if (!editedItem.autoplay) {
                editedItem.autoplay = selectedItem.autoplay;
                }
                }
              break;

              case 'usernav':
                if (editedItem) {
                editedItem.url = selectedItem.url;
                }
              break;

              case 'input':
                if (editedItem) {
                  editedItem.name         = selectedItem.name;
                  editedItem.inputType    = selectedItem.inputType;
                  editedItem.placeholder  = selectedItem.placeholder;
                  editedItem.required     = selectedItem.required;
                  editedItem.pattern      = selectedItem.pattern;
                  editedItem.minLength    = selectedItem.minLength;
                }
              break;

              case 'button':
                if (editedItem) {
                  editedItem.name         = selectedItem.name;
                  editedItem.label    = selectedItem.label;
                  editedItem.style  = selectedItem.style;
                  editedItem.textSize  = selectedItem.textSize;
                }
              break;

              case 'textarea':
                if (editedItem) {
                  editedItem.name         = selectedItem.name;
                  editedItem.placeholder  = selectedItem.placeholder;
                  editedItem.required     = selectedItem.required;
                  editedItem.rows         = selectedItem.rows;
                  editedItem.cols         = selectedItem.cols;
                }
              break;

              case 'radiobox':
                if (editedItem) {
                  editedItem.name         = selectedItem.name;
                  editedItem.options    = selectedItem.options;
                  editedItem.required   = selectedItem.required;
                  editedItem.inline     = selectedItem.inline;
                  editedItem.defaultOption     = selectedItem.defaultOption;
                }
              break;

              case 'checkbox':
                if (editedItem) {
                  editedItem.name         = selectedItem.name;
                editedItem.options    = selectedItem.options;
                editedItem.required   = selectedItem.required;
                editedItem.inline     = selectedItem.inline;
                }
              break;

              case 'select':
                if (editedItem) {
                  editedItem.name         = selectedItem.name;
                  editedItem.options            = selectedItem.options;
                  editedItem.required           = selectedItem.required;
                  editedItem.multiple           = selectedItem.multiple;
                  editedItem.disableFirstOption = selectedItem.disableFirstOption;
                  editedItem.placeholder        = selectedItem.placeholder;
                }
              break;

              case 'upload':
                if (editedItem) {
                  editedItem.name         = selectedItem.name;
                  editedItem.fileSizeLimit = selectedItem.fileSizeLimit;
                  editedItem.itemLimit = selectedItem.itemLimit;
                  editedItem.fileTypeLimit = selectedItem.fileTypeLimit;
                  editedItem.uploadFolder = selectedItem.uploadFolder;
                  editedItem.showPreview = selectedItem.showPreview;
                  editedItem.multipleFiles = selectedItem.multipleFiles;
                  editedItem.required = selectedItem.required;
                }
              break;

              case 'navigation':
                if (editedItem) {
                  editedItem.menu  = selectedItem.menu;
                  editedItem.menuName  = selectedItem.menuName;

                  editedItem.alignment  = selectedItem.alignment;
                  editedItem.display  = selectedItem.display;
                  editedItem.fontSize  = selectedItem.fontSize;
                  editedItem.fontColor  = selectedItem.fontColor;
                  editedItem.hoverColor  = selectedItem.hoverColor;
                  editedItem.itemSpace  = selectedItem.itemSpace;
                }
              break;

              case 'popup':
                if (editedItem) {
                  editedItem.title        = selectedItem.title;
                  editedItem.delay        = selectedItem.delay;
                  editedItem.contentType  = selectedItem.contentType;
                  editedItem.imageUrl     = selectedItem.imageUrl;
                  editedItem.videoUrl     = selectedItem.videoUrl;
                  editedItem.textContent  = selectedItem.textContent;
                  editedItem.displayType  = selectedItem.displayType;
                  editedItem.autoclose  = selectedItem.autoclose;
                  editedItem.autocloseDelay  = selectedItem.autocloseDelay;
                }
              break;

              case 'address':
                if (editedItem) {
                  editedItem.name         = selectedItem.name;
                  editedItem.inputType    = selectedItem.inputType;
                  editedItem.required     = selectedItem.required;
                }
              break;

              case 'datetime':
                if (editedItem) {
                  editedItem.name         = selectedItem.name;
                  editedItem.inputType    = selectedItem.inputType;
                  editedItem.required     = selectedItem.required;
                  editedItem.showDateTime = selectedItem.showDateTime;
                }
              break;

              case 'table':
                if (editedItem) {
                  editedItem.name         = selectedItem.name;
                  editedItem.rows    = selectedItem.rows;
                  editedItem.columns     = selectedItem.columns;

                  editedItem.dataSourceType     = selectedItem.dataSourceType;
                  editedItem.apiEndpoint     = selectedItem.apiEndpoint;
                  editedItem.selectedMethodType     = selectedItem.selectedMethodType;
                }
              break;

            }

            updateItemProperties(editedItem, selectedItem);
          }
        } else if (colIdx !== undefined) {
          console.log("Edit Column");
          const selectedColumn = this.selectedItem;
          const editedItem = row.columns[colIdx];
          console.log("editedItem",editedItem);
          console.log("selectedColumn",selectedColumn);

          if (editedItem) {
            editedItem.sz     = selectedColumn.sz;
            editedItem.bsz   = selectedColumn.bsz;
          }
          updateItemProperties(editedItem, selectedColumn);
        } else {
          console.log("Edit Row");
          // Editing a row
          const selectedRow = this.selectedItem;
          const editedItem = this.rows[rowIdx];

          console.log("editedItem",editedItem);
          console.log("selectedRow",selectedRow);

          if (editedItem) {
            editedItem.sz   = selectedRow.sz;
            editedItem.bsz   = selectedRow.bsz;
            editedItem.col   = selectedRow.col;
          }
          updateItemProperties(editedItem, selectedRow);
        }
        this.cancelEditPopup();
      }
    },
    cloneItem(rowIndex, columnIndex, itemIndex) {
      const clonedItem = { ...this.rows[rowIndex].columns[columnIndex].object[itemIndex] };
      this.rows[rowIndex].columns[columnIndex].object.splice(itemIndex + 1, 0, clonedItem);
    },
    cancelEditPopup() {
      this.selectedItem = undefined;
      this.lightboxRowIndex = undefined;
      this.lightboxColumnIndex = undefined;
      this.selectedItemIndex = undefined;
      this.editPopupOpen = false;
    },
    moveItemUp(rowIndex, columnIndex, itemIndex) {
      const column = this.rows[rowIndex].columns[columnIndex];
      const objectArray = column.object;

      if (itemIndex > 0) {
        const tempItem = objectArray[itemIndex];
        objectArray.splice(itemIndex, 1);
        objectArray.splice(itemIndex - 1, 0, tempItem);
        this.reIndexObjectArray(column);
      }
    },
    moveItemDown(rowIndex, columnIndex, itemIndex) {
      const column = this.rows[rowIndex].columns[columnIndex];
      const objectArray = column.object;

      if (itemIndex < objectArray.length - 1) {
        const tempItem = objectArray[itemIndex];
        objectArray.splice(itemIndex, 1);
        objectArray.splice(itemIndex + 1, 0, tempItem);
        this.reIndexObjectArray(column);
      }
    },
    addSlide(selectedItem) {
      console.log("selectedItem",selectedItem);
      selectedItem.slides.push({
        title: '',
        subtitle: '',
        image: '',
        link: ''
      });
    },
    deleteSlide(index) {
      this.selectedItem.slides.splice(index, 1);
    },
    moveSlideUp(index) {
      if (index > 0) {
        const slide = this.selectedItem.slides.splice(index, 1)[0];
        this.selectedItem.slides.splice(index - 1, 0, slide);
      }
    },
    moveSlideDown(index) {
      if (index < this.selectedItem.slides.length - 1) {
        const slide = this.selectedItem.slides.splice(index, 1)[0];
        this.selectedItem.slides.splice(index + 1, 0, slide);
      }
    },
    cloneSlide(index) {
      const slide = this.selectedItem.slides[index];
      const clonedSlide = { ...slide }; // Shallow clone the slide object

      this.selectedItem.slides.splice(index + 1, 0, clonedSlide);
    },
    showSlideActionPanel(index) {
      this.selectedSlideIndex = index;
    },
    saveSlideChanges() {
      this.selectedSlideIndex = null;
    },
    cancelSlideEdit() {
      this.selectedSlideIndex = null;
    },
    reIndexObjectArray(column) {
      column.object.forEach((item, index) => {
        item.index = index + 1;
      });
    },
    closeAddContent(rowIndex, columnIndex) {
      this.rows[rowIndex].columns[columnIndex].addContentOpen = false;
    },
    cancelAddContent(rowIndex, columnIndex) {
        this.closeAddContent(rowIndex, columnIndex);
    },
    handleFunction1() {
      console.log("Function 1")
    },
    handleFunction2() {
      console.log("Function 2")
    },
    handleCallFunctions(functions) {
      functions.forEach(func => {
        this[func]();
      });
    },

    addRadioOption(selectedItem) {
      selectedItem.options.push({
        label: '',
        value: ''
      });
    },
    deleteRadioOption(index) {
      this.selectedItem.options.splice(index, 1);
    },
    moveRadioOptionUp(index) {
      if (index > 0) {
        const option = this.selectedItem.options.splice(index, 1)[0];
        this.selectedItem.options.splice(index - 1, 0, option);
      }
    },
    moveRadioOptionDown(index) {
      if (index < this.selectedItem.options.length - 1) {
        const option = this.selectedItem.options.splice(index, 1)[0];
        this.selectedItem.options.splice(index + 1, 0, option);
      }
    },
    cloneRadioOption(index) {
      const option = this.selectedItem.options[index];
      const clonedOption = { ...option }; // Shallow clone the option object

      this.selectedItem.options.splice(index + 1, 0, clonedOption);
    },

    addCheckboxOption(selectedItem) {
      selectedItem.options.push({
        label: '',
        value: ''
      });
    },
    deleteCheckboxOption(index) {
      this.selectedItem.options.splice(index, 1);
    },
    moveCheckboxOptionUp(index) {
      if (index > 0) {
        const option = this.selectedItem.options.splice(index, 1)[0];
        this.selectedItem.options.splice(index - 1, 0, option);
      }
    },
    moveCheckboxOptionDown(index) {
      if (index < this.selectedItem.options.length - 1) {
        const option = this.selectedItem.options.splice(index, 1)[0];
        this.selectedItem.options.splice(index + 1, 0, option);
      }
    },
    cloneCheckboxOption(index) {
      const option = this.selectedItem.options[index];
      const clonedOption = { ...option }; // Shallow clone the option object

      this.selectedItem.options.splice(index + 1, 0, clonedOption);
    },

    addSelectOption(selectedItem) {
      selectedItem.options.push({
        label: '',
        value: ''
      });
    },
    deleteSelectOption(index) {
      this.selectedItem.options.splice(index, 1);
    },
    moveSelectOptionUp(index) {
      if (index > 0) {
        const option = this.selectedItem.options.splice(index, 1)[0];
        this.selectedItem.options.splice(index - 1, 0, option);
      }
    },
    moveSelectOptionDown(index) {
      if (index < this.selectedItem.options.length - 1) {
        const option = this.selectedItem.options.splice(index, 1)[0];
        this.selectedItem.options.splice(index + 1, 0, option);
      }
    },
    cloneSelectOption(index) {
      const option = this.selectedItem.options[index];
      const clonedOption = { ...option };
      this.selectedItem.options.splice(index + 1, 0, clonedOption);
    },
    getAllBuilderOptions() {
      const options = [];
      const selectedItemName = this.selectedItem.name;
      for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
        const row = this.rows[rowIndex];
        for (let columnIndex = 0; columnIndex < row.columns.length; columnIndex++) {
          const column = row.columns[columnIndex];
          for (let objIndex = 0; objIndex < column.object.length; objIndex++) {
            const obj = column.object[objIndex];
            const option = {
              name: obj.name,
              rowIndex,
              columnIndex,
              obj: objIndex,
            };
            const isSelectedInLogics = this.selectedItem.logics.some(
              (logicItem) =>
                logicItem.destination &&
                logicItem.destination.name === option.name &&
                logicItem.destination.rowIndex === option.rowIndex &&
                logicItem.destination.columnIndex === option.columnIndex &&
                logicItem.destination.obj === option.obj
            );
            const isSameAsSelectedItem = option.name === selectedItemName;
            if (!isSelectedInLogics && !isSameAsSelectedItem) {
              options.push(option);
            }
          }
        }
      }
      return options;
    },
    getSelectedOptionLabel(value) {
      if (!this.selectedItem.options) {
        return '';
      }
      const selectedOption = this.selectedItem.options.find(option => option.value === value);
      return selectedOption ? selectedOption.label : '';
    },
    getParentLogicObjectName(logicItem) {
      const rowIndex = logicItem.rowIndex;
      const columnIndex = logicItem.columnIndex;
      const objectIndex = logicItem.objectIndex;
      const parentObject = this.rows[rowIndex].columns[columnIndex].object[objectIndex];
      return parentObject.name;
    },
    addLogicItem(logicItem, selectedItem) {
      if (logicItem.destination) {
        const column = this.rows[logicItem.destination.rowIndex].columns[logicItem.destination.columnIndex];
        const objectArray = column.object;
        console.log("objectArray", objectArray);
        if (objectArray) {
          const destinationObject = objectArray[logicItem.destination.obj];
          if (!destinationObject.logics) {
            destinationObject.logics = [];
          }
          let foundObject = null;
          let rowIndex = -1;
          let columnIndex = -1;
          let objectIndex = -1;
          for (let i = 0; i < this.rows.length; i++) {
            const row = this.rows[i];
            for (let j = 0; j < row.columns.length; j++) {
              const column = row.columns[j];
              const objIndex = column.object.findIndex(obj => obj.name === selectedItem.name);
              if (objIndex !== -1) {
                foundObject = column.object[objIndex];
                rowIndex = i;
                columnIndex = j;
                objectIndex = objIndex;
                break;
              }
            }
            if (foundObject) {
              break;
            }
          }
          if (foundObject) {
            const existingLogicIndex = destinationObject.logics.findIndex(logic => logic.request === true);
            if (existingLogicIndex !== -1) {
              destinationObject.logics.splice(existingLogicIndex, 1);
            }
            destinationObject.logics.push({
              request: true,
              default: logicItem.default,
              method: logicItem.method,
              rowIndex: rowIndex,
              columnIndex: columnIndex,
              objectIndex: objectIndex,
            });
          } else {
            console.log("Object not found.");
          }
        }
      } else {
        if (!logicItem.logics) {
          logicItem.logics = [];
        }
        logicItem.logics.push({
          destination: '',
          default: '',
          method: '',
        });
      }
    },
    findDestinationObject(name, rowIndex, columnIndex) {
      if (this.rows.length > rowIndex && this.rows[rowIndex].columns.length > columnIndex) {
        const column = this.rows[rowIndex].columns[columnIndex];
        const objectArray = column.object;
        for (const obj of objectArray) {
          if (obj.name === name && obj.uid === `row_${rowIndex}_column_${columnIndex}`) {
            return obj;
          }
        }
      }
      return null;
    },
    deleteLogicItem(index, logicItem) {
      if (logicItem.destination) {
        const column = this.rows[logicItem.destination.rowIndex]?.columns[logicItem.destination.columnIndex];
        if (column) {
          const objectArray = column.object[logicItem.destination.obj];
          if (objectArray) {
            objectArray.logics = [];
          }
        }
      }
      this.selectedItem.logics.splice(index, 1);
    },
    handlefontColorSelection(color) {
      this.selectedItem.fontColor = color;
    },
    handlehoverColorSelection(color) {
      this.selectedItem.hoverColor = color;
    },
    // Table Function Code
    addRowItem() {
      const newRow = {
        id: Date.now().toString(),
        content: this.selectedItem.columns.map(column => ({ [column.field]: '' }))
      };
      this.selectedItem.rows.push(newRow);
    },
    deleteRow(rowId) {
      const index = this.selectedItem.rows.findIndex(row => row.id === rowId);
      if (index !== -1) {
        this.selectedItem.rows.splice(index, 1);
      }
    },
    addColumnItem(columnIndex) {
      const newColumn = {
        id: Date.now().toString(),
        label: 'New Column',
        field: 'newColumn'
      };
      this.selectedItem.columns.splice(columnIndex, 0, newColumn);
      this.selectedItem.rows.forEach(row => {
        const newContent = {};
        this.selectedItem.columns.forEach((column, index) => {
          if (index === columnIndex) {
            newContent[column.field] = '';
          } else if (index < columnIndex) {
            newContent[column.field] = row.content[index][column.field];
          } else {
            newContent[column.field] = '';
          }
        });
        row.content.splice(columnIndex, 0, newContent);
      });
    },
    deleteColumn(columnId) {
      const columnIdx = this.selectedItem.columns.findIndex(column => column.id === columnId);
      if (columnIdx !== -1) {
        const field = this.selectedItem.columns[columnIdx].field;
        this.selectedItem.columns.splice(columnIdx, 1);
        this.selectedItem.rows.forEach(row => {
          if (row.content[columnIdx]) {
            row.content.splice(columnIdx, 1);
          } else {
            delete row.content[columnIdx];
          }
          Object.values(row.content).forEach(cell => {
            if (cell[columnId]) {
              delete cell[columnId][field];
            }
          });
        });
      }
    },
    toggleEditMode(columnId) {
      const column = this.selectedItem.columns.find(column => column.id === columnId);
      if (column) {
        column.editMode = !column.editMode;
      }
    },
    editColumnName(columnId, newName) {
      const column = this.selectedItem.columns.find(column => column.id === columnId);
      if (column) {
        column.label = newName;
      }
    },
    moveColumnItemLeft(columnId) {
      const index = this.selectedItem.columns.findIndex(column => column.id === columnId);
      if (index > 0) {
        const column = this.selectedItem.columns.splice(index, 1)[0];
        this.selectedItem.columns.splice(index - 1, 0, column);
        this.moveRowColumnDataLeft(index);
      }
    },
    moveColumnItemRight(columnId) {
      const index = this.selectedItem.columns.findIndex(column => column.id === columnId);
      if (index < this.selectedItem.columns.length - 1) {
        const column = this.selectedItem.columns.splice(index, 1)[0];
        this.selectedItem.columns.splice(index + 1, 0, column);
        this.moveRowColumnDataRight(index);
      }
    },
    moveRowColumnDataRight(columnIndex) {
      this.selectedItem.rows.forEach(row => {
        const columnData = row.content.splice(columnIndex, 1)[0];
        row.content.splice(columnIndex + 1, 0, columnData);
      });
    },
    clearTableData() {
      this.selectedItem.columns = [];
      this.selectedItem.rows = [];
    },
    async getDataFromAPI() {
      try {
        const response = await fetch(this.selectedItem.apiEndpoint, {
          method: this.selectedItem.selectedMethodType,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data from API');
        }

        const data = await response.json();
        this.selectedItem.columns = [];
        this.selectedItem.rows = [];
        const allKeys = data.reduce((keys, record) => {
          Object.keys(record).forEach((key) => {
            if (!keys.includes(key)) {
              keys.push(key);
            }
          });
          return keys;
        }, []);
        let Ccounter = 1;
        allKeys.forEach((key) => {
          
          let uniqueId = Date.now() + Ccounter;
          const newColumn = {
            id: uniqueId.toString(),
            label: key,
            field: key,
            editMode: false,
          };
          Ccounter++;
          this.selectedItem.columns.push(newColumn);
        });
        let Rcounter = 1;
        data.forEach((record) => {

          let uniqueId = Date.now() + Rcounter;
          const newRow = {
            id: uniqueId.toString(),
            content: this.selectedItem.columns.map((column) => ({
              [column.field]: record[column.field] || '',
            })),
          };
          Rcounter++;
          this.selectedItem.rows.push(newRow);
        });

        this.apiResponseError = '';
      } catch (error) {
        this.apiResponseError = 'Error fetching data from API';
        console.error('Error fetching data from API:', error);
      }
    },
    // Table Function Code
  },
  watch: {
    'selectedItem.bgType': function(newBgType) {
      console.log(newBgType);
      if (newBgType === 'none') {
        this.selectedItem.bgColor = '';
        this.selectedItem.bgImage = '';
        this.selectedItem.bgGradientColor1 = '';
        this.selectedItem.bgGradientColor2 = '';
        this.selectedItem.bgVideo = '';
      } else if (newBgType === 'color') {
        this.selectedItem.bgImage = '';
        this.selectedItem.bgGradientColor1 = '';
        this.selectedItem.bgGradientColor2 = '';
        this.selectedItem.bgVideo = '';
      } else if (newBgType === 'image') {
        this.selectedItem.bgColor = '';
        this.selectedItem.bgGradientColor1 = '';
        this.selectedItem.bgGradientColor2 = '';
        this.selectedItem.bgVideo = '';
      } else if (newBgType === 'gradient') {
        this.selectedItem.bgColor = '';
        this.selectedItem.bgImage = '';
        this.selectedItem.bgVideo = '';
      } else if (newBgType === 'video') {
        this.selectedItem.bgColor = '';
        this.selectedItem.bgImage = '';
        this.selectedItem.bgGradientColor1 = '';
        this.selectedItem.bgGradientColor2 = '';
      }
    },
    'selectedItem.bgInnerType': function(newBgType) {
      console.log(newBgType);
      if (newBgType === 'none') {
        this.selectedItem.bgInnerColor = '';
        this.selectedItem.bgInnerImage = '';
        this.selectedItem.bgInnerGradientColor1 = '';
        this.selectedItem.bgInnerGradientColor2 = '';
        this.selectedItem.bgInnerVideo = '';
      } else if (newBgType === 'color') {
        this.selectedItem.bgInnerImage = '';
        this.selectedItem.bgInnerGradientColor1 = '';
        this.selectedItem.bgInnerGradientColor2 = '';
        this.selectedItem.bgInnerVideo = '';
      } else if (newBgType === 'image') {
        this.selectedItem.bgInnerColor = '';
        this.selectedItem.bgInnerGradientColor1 = '';
        this.selectedItem.bgInnerGradientColor2 = '';
        this.selectedItem.bgInnerVideo = '';
      } else if (newBgType === 'gradient') {
        this.selectedItem.bgInnerColor = '';
        this.selectedItem.bgInnerImage = '';
        this.selectedItem.bgInnerVideo = '';
      } else if (newBgType === 'video') {
        this.selectedItem.bgInnerColor = '';
        this.selectedItem.bgInnerImage = '';
        this.selectedItem.bgInnerGradientColor1 = '';
        this.selectedItem.bgInnerGradientColor2 = '';
      }
    },
    paddingValue: function(value) {
      this.selectedItem.paddingLeft = value;
      this.selectedItem.paddingTop = value;
      this.selectedItem.paddingRight = value;
      this.selectedItem.paddingBottom = value;
    },
    marginValue: function(value) {
      this.selectedItem.marginLeft = value;
      this.selectedItem.marginTop = value;
      this.selectedItem.marginRight = value;
      this.selectedItem.marginBottom = value;
    },
    paddingInnerValue: function(value) {
      this.selectedItem.paddingInnerLeft = value;
      this.selectedItem.paddingInnerTop = value;
      this.selectedItem.paddingInnerRight = value;
      this.selectedItem.paddingInnerBottom = value;
    }
  },
};

function setConfigOpenToFalse(rows) {
  rows.forEach(row => {
    row.configOpen = false;
    if (row.sub && row.sub.length > 0) {
      setConfigOpenToFalse(row.sub);
    }
  });
}
</script>

<template>

  <Subhead
      :navigation="
      [
        {
          name: 'Save',
          style: 'save',
          class: 'primary-btn',
          visible: true,
          type: 'button',
          function: 'previewLayout',
          eventName: 'callFunction2'
        },
        {
          name: 'Add Row',
          style: 'plus',
          class: 'default-btn',
          visible: true,
          type: 'button',
          function: 'addRow',
          eventName: 'callFunction1'
        },
        {
          name: 'Reload',
          style: 'refresh',
          class: 'default-btn',
          visible: true,
          type: 'button',
          function: 'getDataFromParent',
          eventName: 'callFunction3'
        },
        {
          name: 'ย้อนกลับ',
          link: backUrl,
          style: 'chevron-left',
          class: 'default-btn',
          visible: true,
          type: 'button',
        },
      ]"
      @callFunction1="addRow"
      @callFunction3="getDataFromParent"
      @callFunction2="previewLayout"
    />

    <custom-confirmation
      v-if="showConfirmation"
      :message="confirmationMessage"
      :header="confirmationHeader"
      @confirm="handleConfirmation"
      @cancel="handleConfirmCancel"
    ></custom-confirmation>

    <div v-if="lightboxOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white w-[600px] p-2 relative">
        <button v-if="!showFormSubMenu" @click="closeLightbox" class="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800 focus:outline-none">
          <font-awesome-icon :icon="['fas','times']" class="h-4 w-4"/>
        </button>
        <h2 v-if="!showFormSubMenu" class="text-lg font-semibold mt-3 mb-1">เลือกประเภทเนื้อหาที่ต้องการเพิ่ม</h2>
        <h2 v-else class="text-lg font-semibold mt-3 mb-1">เลือกประเภทเนื้อหาในแบบฟอร์ม</h2>
        <p class="mb-4 text-gray-500" v-if="!showFormSubMenu">เนื้อหาแต่ละประเภทจะมีการตั้งค่าที่แตกต่างกันตามประเภทของข้อมูลนั้นๆ </p>
        <ul class="grid grid-cols-4 gap-2" v-if="!showFormSubMenu" >
          <li v-for="item in filteredContentItems" :key="item.id" @click="handleItemClick(item, lightboxRowIndex, lightboxColumnIndex)" class="flex flex-col items-center justify-center cursor-pointer py-2 px-4 border border-gray-300 rounded-sm hover:bg-gray-100">
            <div class="text-gray-600 mb-2 mt-3">
              <font-awesome-icon :icon="['fas', item.icon]" class="h-10 w-10 text-gray-300"/>
            </div>
            <div class="text-center">
              <h3 class="text-[14px] text-gray-500 font-semibold">{{ item.name }}</h3>
              <p class="text-[12px] text-gray-500">{{ item.description }}</p>
            </div>
          </li>
        </ul>
        <div v-if="showFormSubMenu">
          <ul class="grid grid-cols-4 gap-2">
            <li v-for="formItem in formItems" :key="formItem.type" @click="handleItemClick(formItem, lightboxRowIndex, lightboxColumnIndex)" class="flex flex-col items-center justify-center cursor-pointer py-2 px-4 border border-gray-300 rounded-sm hover:bg-gray-100">
              <div class="text-gray-600 mb-2 mt-3">
                <font-awesome-icon :icon="['fas', formItem.icon]" class="h-10 w-10 text-gray-300"/>
              </div>
              <div class="text-center">
                <h3 class="text-[14px] text-gray-500 font-semibold">{{ formItem.name }}</h3>
                <p class="text-[12px] text-gray-500">{{ formItem.description }}</p>
              </div>
            </li>
          </ul>
          <button @click="showFormSubMenu = false" class="text-gray-500 mt-4 underline">Back to Main Menu</button>
        </div>
      </div>
    </div>
    
    <FileBrowser class="z-[9999]"
    v-if="FileBrowserOpen" 
    :isWindowsOpen="true" 
    :callbackFunction="'cover'"
    :allowFileType="['jpg','gif','png','jpeg']" 
    @file-browser-trigger="changeFileTrigger" 
    @file-browser-callback="selectFileTrigger"/>
    
    <FileBrowser class="z-[9999]"
    v-if="FileImageBrowserOpen" 
    :isWindowsOpen="true" 
    :callbackFunction="'document'"
    :allowFileType="['jpg','gif','png','jpeg']" 
    @file-browser-trigger="changeFileImageTrigger" 
    @file-browser-callback="selectFileImageTrigger"/>
  
    <div class="flex-1 pb-8 bg-gray-100 pt-2 pb-5 border-t">
        <div class="mt-8">
          <div class="relative mx-auto max-w-7xl px-6 sm:px-6 lg:px-6"  :data-content="'กำลังติดต่อฐานข้อมูล กรุณารอสักครู่.....'" :class="[(activeBlock?'isblock' : 'isunblock')]">

            <h1 class="text-2xl font-bold text-gray-900"> {{ post.title }}</h1>
            <h1 class="text-lg font-normal text-gray-500 mb-2"> {{ post.slug }}</h1>

            <div v-if="rows && rows.length > 0">

              <div class="relative bg-white border border-gray-200 rounded-sm p-2 mb-2 cursor-pointer hover:border-1 hover:border-blue-500" v-for="(row, rowIndex) in rows" :key="rowIndex" :class="['', `bg-${row.bg}`]" @click.stop="toggleRowPanel(rowIndex)">

                <div class="absolute rounded-lg right-[-50px] top-0 mt-[-1px] bg-white p-2 border border-gray-200" v-if="rowPanels[rowIndex]">
                  <div class="flex justify-end">
                    <div class="grid gap-1">
                      <button @click="moveRowUp(rowIndex)" v-show="rowIndex > 0" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded">
                        <font-awesome-icon :icon="['fas','chevron-up']" class="mx-auto h-3 w-3 text-white"/>
                      </button>
                      <button @click="moveRowDown(rowIndex)" v-show="rowIndex < rows.length - 1" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded">
                        <font-awesome-icon :icon="['fas','chevron-down']" class="mx-auto h-3 w-3 text-white"/>
                      </button>
                      <button @click="addColumn(rowIndex)" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded">
                        <font-awesome-icon :icon="['fas','plus']" class="mx-auto h-3 w-3 text-white"/>
                      </button>
                      <button @click="cloneRow(rowIndex)" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded">
                        <font-awesome-icon :icon="['fas','clone']" class="mx-auto h-3 w-3 text-white"/>
                      </button>
                      <button @click="openEditPopup(rowIndex)" class="bg-gray-400 hover:bg-gray-700 w-5 h-5 text-xs rounded">
                        <font-awesome-icon :icon="['fas','pencil']" class="mx-auto h-3 w-3 text-white"/>
                      </button>
                      <button @click="removeRow(rowIndex)" class="bg-red-500 hover:bg-red-700 w-5 h-5 text-xs rounded">
                        <font-awesome-icon :icon="['fas','times']" class="mx-auto h-3 w-3 text-white"/>
                      </button>
                    </div>
                  </div>
                </div>
              
                <div class="flex items-center justify-between mb-0 border border-gray-200 p-2">
                  <div class="w-1/6">
                  </div>
                  <div class="w-4/6 text-center">
                    <h1 class="text-sm font-semibold">{{ row.text }} ({{ rowIndex }})</h1>
                  </div>
                  
                  <div class="w-1/6 flex justify-end">
                  </div>
                </div>

                <div class="px-2 py-2 border-l border-r border-gray-200 font-normal">

                  <div :class="['grid', `grid-cols-${row.col}`,'gap-1']">
                  
                    <div v-for="(column, columnIndex) in row.columns" :key="columnIndex" :class="['sm:col-span-'+column.colspan, getColumnDivClass(columnIndex)]">

                        <div class="relative bg-gray-100 border-gray-200 p-2 cursor-pointer hover:border hover:border-black" @click.stop="toggleColumnPanel(columnIndex)">

                          <div class="z-10 bg-black absolute right-[-30px] top-0 mt-[-1px] bg-white p-1 border border-black rounded-tr rounded-br" v-if="activeColumnIndex === columnIndex">
                            <div class="flex justify-end">
                              <div class="grid gap-1">
                                <button @click="cloneColumn(rowIndex, columnIndex)" v-custom-tooltip="{ text: 'ทำซ้ำ', position: 'right' }" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded">
                                  <font-awesome-icon :icon="['fas','clone']" class="mx-auto h-3 w-3 text-white"/>
                                </button>
                                <button @click="openAddContentAndLightbox(rowIndex, columnIndex)" v-custom-tooltip="{ text: 'เพิ่มคอลั่ม', position: 'right' }" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded">
                                  <font-awesome-icon :icon="['fas','plus']" class="mx-auto h-3 w-3 text-white"/>
                                </button>
                                <button @click="moveColumnLeft(rowIndex, columnIndex)" v-show="columnIndex > 0" v-custom-tooltip="{ text: 'เลื่อนซ้าย', position: 'right' }" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded">
                                  <font-awesome-icon :icon="['fas','chevron-left']" class="mx-auto h-3 w-3 text-white"/>
                                </button>
                                <button @click="moveColumnRight(rowIndex, columnIndex)" v-show="columnIndex < row.columns.length - 1" v-custom-tooltip="{ text: 'เลื่อนขวา', position: 'right' }" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded">
                                  <font-awesome-icon :icon="['fas','chevron-right']" class="mx-auto h-3 w-3 text-white"/>
                                </button>

                                <button @click="openEditPopup(rowIndex, columnIndex)" v-custom-tooltip="{ text: 'แก้ไข', position: 'right' }" class="bg-gray-400 hover:bg-gray-700 w-5 h-5 text-xs rounded">
                                  <font-awesome-icon :icon="['fas','pencil']" class="mx-auto h-3 w-3 text-white"/>
                                </button>
                                <button @click="removeColumn(rowIndex, columnIndex)" v-custom-tooltip="{ text: 'ลบ', position: 'right' }" class="bg-red-500 hover:bg-red-700 w-5 h-5 text-xs rounded">
                                <font-awesome-icon :icon="['fas','times']" class="mx-auto h-3 w-3 text-white"/>
                              </button>
                              </div>
                            </div>
                          </div>

                          <div class="flex items-center justify-between mb-0 border border-gray-200 p-2">
                            <div class="w-1/6">
                            </div>
                            <div class="w-4/6 text-center">
                              
                              <h1 class="text-sm font-semibold text-gray-600">
                                <template v-if="!column.editing">
                                  {{ column.text }} ({{ columnIndex }})
                                  <button @click="editColumnText(rowIndex, columnIndex)" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded ml-1">
                                    <font-awesome-icon :icon="['fas','pencil']" class="mx-auto h-3 w-3 text-white"/>
                                  </button>
                                </template>
                                <template v-else>
                                  <input type="text" v-model="column.text" class="text-sm font-semibold text-gray-600 rounded-sm border border-gray-200" @keyup.enter="saveColumnText(rowIndex, columnIndex)">
                                  <button @click="saveColumnText(rowIndex, columnIndex)" class="bg-green-500 hover:bg-green-700 w-5 h-5 text-xs rounded ml-1">
                                    <font-awesome-icon :icon="['fas','check']" class="mx-auto h-3 w-3 text-white"/>
                                  </button>
                                </template>
                              </h1>                              

                            </div>
                            <div class="w-1/6 flex justify-end">
                            </div>
                          </div>
            
                          <div class="px-2 border-l border-r border-gray-200 font-normal" :class="[`${column.bg}`]" v-html="column.content"></div>

                            <div v-for="(item, itemIndex) in column.object" :key="item.id" class="content-item mb-1 mt-1">
                              <div class="bg-white border border-gray-200 rounded-sm p-1" >

                                <div class="flex items-center bg-indigo-50 pl-2 pt-2 pr-1 mb-2">
                                  <font-awesome-icon :icon="['fas', getContentIcon(item.type)]" class="h-3 w-3 text-gray-400 border-r border-gray-300 pr-1 mb-2" /> <span class="ml-1 -mt-1 text-gray-400 text-[13px] capitalize">{{ item.type }} ({{ itemIndex }})</span>
                                  <button @click="removeItem(rowIndex, columnIndex, itemIndex)" class="bg-red-400 hover:bg-red-700 w-5 h-5 text-xs rounded ml-auto -mt-2">
                                    <font-awesome-icon :icon="['fas','times']" class="mx-auto h-3 w-3 text-white" />
                                  </button>
                                </div>

                                <template v-if="item.type === 'navigation'">
                                  <div class="p-2">
                                    <h1>{{ item.menuName || 'ยังไม่ได้เลือกเมนู' }}</h1>
                                  </div>
                                </template>

                                <template v-if="item.type === 'header'">
                                  <div class="p-2">
                                    <h1>{{ item.text || 'None' }}</h1>
                                  </div>
                                </template>

                                <template v-if="item.type === 'paragraph'">
                                  <div class="p-2">
                                    <div v-html="item.text || 'None'"></div>
                                  </div>
                                </template>

                                <template v-if="item.type === 'image'">
                                  <div class="p-2">
                                    <img :src="item.url" :alt="item.alt" :style="{ width: item.width + 'px' }" v-if="item.url" />
                                    <div class="no-content" v-else>No Image</div>
                                  </div>
                                </template>

                                <template v-if="item.type === 'address'">
                                  <div class="p-2">
                                    <div v-html="item.name || 'None'"></div>
                                    <div v-html="item.inputType || 'None'"></div>
                                  </div>
                                </template>

                                <template v-if="item.type === 'datetime'">
                                  <div class="p-2">
                                    <div v-html="item.name || 'None'"></div>
                                    <div v-html="item.inputType || 'None'"></div>
                                  </div>
                                </template>
                                
                                <template v-if="item.type === 'upload'">
                                  <div class="border border-gray-200 p-3 mb-3">
                                    <label class="block font-bold mb-1"><font-awesome-icon :icon="['fas', 'upload']" class="h-4 w-4"/> {{ item.name }}</label>
                                    <div class="flex items-center mb-2 bg-gray-100 rounded-sm p-3">
                                      <input class="hidden" type="button" :accept="item.fileTypeLimit"  :multiple="item.multipleFiles">
                                      <button type="button" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                      <font-awesome-icon :icon="['fas', 'folder']" class="h-4 w-4"/> เลือกไฟล์
                                      </button>
                                      <button type="button" class="px-4 py-2 ml-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                      <font-awesome-icon :icon="['fas', 'cloud-upload']" class="h-4 w-4"/> อัพโหลดไฟล์
                                      </button>
                                    </div>
                                    <p class="block text-gray-500">อนุญาต: <span class="font-semibold">{{ item.fileTypeLimit }}</span>, ขนาดสูงสุด: <span class="font-semibold">{{ item.fileSizeLimit }}</span> เมกะไบต์, จำกัดไฟล์: <span class="font-semibold">{{ item.itemLimit }}</span> ไฟล์</p>
                                  </div>
                                </template>
                                
                                <template v-if="item.type === 'input'">
                                  <div class="p-2">
                                    <!-- {{ item.logics }} -->
                                    <label :for="item.name" class="block text-sm font-medium">{{ item.name }}</label>
                                    <input :type="item.inputType" :name="item.name" :placeholder="item.placeholder" :required="item.required" :maxlength="item.maxLength" :pattern="item.pattern" class="block w-full px-4 py-2 mt-1 text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                  </div>
                                </template>
                                
                                <template v-if="item.type === 'button'">
                                  <div class="p-2">
                                    <button :class="['px-4 py-2 text-sm font-medium rounded', {
                                      'bg-blue-500 text-white': item.style === 'primary',
                                      'bg-gray-500 text-white': item.style === 'secondary',
                                      'bg-green-500 text-white': item.style === 'success',
                                      'bg-red-500 text-white': item.style === 'danger',
                                    }]" :style="{ fontSize: item.textSize }">
                                      {{ item.label }}
                                    </button>
                                  </div>
                                </template>

                                <template v-if="item.type === 'textarea'">
                                  <div class="p-2">
                                    <label :for="item.name" class="block text-sm font-medium">{{ item.name }}</label>
                                    <textarea :name="item.name" :placeholder="item.placeholder" :rows="item.rows" :cols="item.cols" class="block w-full px-4 py-2 mt-1 text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                                  </div>
                                </template>

                                <template v-if="item.type === 'radiobox'">
                                  <div class="p-2">
                                    <!-- {{ item.logics }} -->
                                    <label :for="item.name" class="block text-sm font-medium">{{ item.name }}</label>
                                    <div class="mt-1 space-y-2">
                                      <template v-for="(option, index) in item.options" :key="index">
                                        <div class="flex items-center">
                                          <input :id="`${item.name}-${index}`" :name="item.name" :value="option.value" type="radio" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                                          <label :for="`${item.name}-${index}`" class="ml-2 text-sm">{{ option.label }}</label>
                                        </div>
                                      </template>
                                    </div>
                                  </div>
                                </template>

                                <template v-if="item.type === 'checkbox'">
                                  <div class="p-2">
                                    <!-- {{ item.logics }} -->
                                    <label :for="item.name" class="block text-sm font-medium">{{ item.name }}</label>
                                    <div class="mt-1 space-y-2">
                                      <template v-for="(option, index) in item.options" :key="index">
                                        <div class="flex items-center">
                                          <input :id="`${item.name}-${index}`" :name="item.name" :value="option.value" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                                          <label :for="`${item.name}-${index}`" class="ml-2 text-sm">{{ option.label }}</label>
                                        </div>
                                      </template>
                                    </div>
                                  </div>
                                </template>

                                <template v-if="item.type === 'select'">
                                  <div class="p-2">
                                    <!-- {{ item.logics }} -->
                                    <label :for="item.name" class="block text-sm font-medium">{{ item.name }}</label>
                                    <div class="mt-1">
                                      <select :id="item.name" :name="item.name" class="block w-full focus:ring-indigo-500 border-gray-300">
                                        <template v-for="(option, index) in item.options" :key="index">
                                          <option :value="option.value" :selected="option.selected">{{ option.label }}</option>
                                        </template>
                                      </select>
                                    </div>
                                  </div>
                                </template>

                                <template v-if="item.type === 'slideshow'">

                                  <vueper-slides autoplay :pauseOnHover="true" :duration="item.interval || 4000" :touchable="false">
                                    <vueper-slide
                                      v-for="(slide, i) in item.slides"
                                      :key="i"
                                      :image="slide.image"
                                    >
                                      <template #content>
                                        <div v-if="slide.content !== false && typeof slide.content !== 'undefined'" class="vueperslide__content-wrapper">
                                          <div class="vueperslide__title bg-black p-3 text-white text-[24px]">{{ slide.title }}</div>
                                          <div class="vueperslide__content mt-3 text-[18px]">{{ slide.subtitle }}</div>
                                          <button v-if="slide.button" @click="openNewWindow(slide.link)" class="bg-white hover:bg-gray-300 text-black text-lg font-normal py-2 px-4 rounded mt-4">
                                            <font-awesome-icon :icon="['fas','eye']" class="w-3 h-3"/> ดูรายละเอียด
                                          </button>
                                        </div>
                                      </template>
                                    </vueper-slide>
                                  </vueper-slides>

                                </template>

                                <template v-if="item.type === 'video'">
                                  <div class="video">
                                    <video :src="item.url" :autoplay="item.autoplay" v-if="item.url"></video>
                                  </div>
                                </template>

                                <div class="pt-1 border-t border-gray-200">
                                  <div class="flex items-center">

                                    <button v-if="item.type === 'form'" @click="openAddContentAndLightbox(rowIndex, columnIndex)" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded">
                                      <font-awesome-icon :icon="['fas','plus']" class="mx-auto h-3 w-3 text-white"/>
                                    </button>

                                    <button @click="cloneItem(rowIndex, columnIndex, itemIndex)" class="bg-gray-400 hover:bg-gray-700 w-5 h-5 text-xs rounded ml-1">
                                      <font-awesome-icon :icon="['fas','clone']" class="mx-auto h-3 w-3 text-white" />
                                    </button>
                                  
                                    <button @click="moveItemUp(rowIndex, columnIndex, itemIndex)" v-show="itemIndex > 0" class="bg-gray-400 hover:bg-gray-700 w-5 h-5 text-xs rounded ml-1">
                                      <font-awesome-icon :icon="['fas','chevron-up']" class="mx-auto h-3 w-3 text-white" />
                                    </button>
                                  
                                    <button @click="moveItemDown(rowIndex, columnIndex, itemIndex)" v-show="itemIndex < column.object.length - 1" class="bg-gray-400 hover:bg-gray-700 w-5 h-5 text-xs rounded ml-1">
                                      <font-awesome-icon :icon="['fas','chevron-down']" class="mx-auto h-3 w-3 text-white" />
                                    </button>
                                  
                                    <button @click="openEditPopup(rowIndex, columnIndex, itemIndex)" class="bg-gray-400 hover:bg-gray-700 w-5 h-5 text-xs rounded ml-1">
                                      <font-awesome-icon :icon="['fas','pencil']" class="mx-auto h-3 w-3 text-white" />
                                    </button>
                                
                                  </div>
                                  
                                </div>
                              </div>
                            </div>
                  
                          <!-- <div class="flex items-center justify-between mt-0 border border-r border-gray-200 p-2">
                            <div class="w-1/2">
                              <div class="flex items-center">
                                <div class="w-5 h-5 border border-gray-300 rounded-full" :class="[`${column.bg}`]"></div>
                              </div>
                          
                            </div>
                            <div class="w-1/2 flex justify-end">
                              

                            </div>
                          </div> -->
            
                        </div>

                    </div>
                  </div>

                </div>

                <!-- <div class="flex items-center justify-between mt-0 border border-r border-gray-200 p-2">
                  <div class="w-1/2">
                    <div class="text-sm text-gray-500">
                      <div class="w-5 h-5 border border-gray-300 rounded-full" :class="[`${row.bg}`]"></div>
                    </div>
                  </div>
                  <div class="w-1/2 flex justify-end">
                  </div>
                </div> -->

              </div>

            </div>
            <div v-else>
              <div class="bg-white border border-gray-200 rounded-sm p-8 mx-auto text-center">
                <h1 class="text-2xl font-bold mb-4">ยินดีต้อนรับสู่ระบบการจัดการเนื้อหา</h1>
                <p class="text-xl text-gray-600 mb-4">ยังไม่มีเนื้อหาในขณะนี้</p>
                <button @click="addRow" class="px-8 py-3 bg-indigo-500 text-white rounded">
                  <font-awesome-icon :icon="['fas','plus']" class="h-4 w-4 text-white"/> เพิ่มเนื้อหาใหม่
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>

    <template v-if="editPopupOpen">
      <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div :class="['bg-white', {'w-screen h-screen': fullScreenMode}, {'w-[600px]': !fullScreenMode}, 'relative']">
          <div class="bg-gray-300 p-5 pt-3 pb-3 w-full">
            <div class="flex justify-between">
              <h2 class="text-lg font-semibold">Content Builder</h2>
              <div>
                <button @click="toggleFullScreenMode" class="text-gray-600 hover:text-gray-800 focus:outline-none">
                  <font-awesome-icon :icon="['fas', 'window-maximize']" class="h-4 w-4"/>
                </button>
                <button @click="cancelEditPopup" class="text-gray-600 hover:text-gray-800 focus:outline-none ml-2">
                  <font-awesome-icon :icon="['fas','times']" class="h-4 w-4"/>
                </button>
              </div>
            </div>
          </div>
    
          <div class="popup-form">
            
            <div class="flex mb-2 bg-gray-300 pl-2 pr-2">
              <button class="w-1/4 py-2 px-4 text-center hover:bg-blue-600 focus:outline-none border-t border-r border-l border-b rounded-t-sm mr-1"
                :class="[
                  'h-' + (activeTab === 'content' ? '12' : '10'),
                  activeTab === 'content' ? 'bg-white text-gray-700 font-semibold hover:bg-white' : 'text-white bg-blue-500',
                  activeTab === 'content' ? 'border-white' : 'border-blue-500'
                ]"
                @click="activeTab = 'content'"
                :style="{ 'margin-top': activeTab === 'content' ? '-8px' : '0' }">
                Content
              </button>
              <button class="w-1/4 py-2 px-4 text-center hover:bg-blue-600 focus:outline-none border-t border-r border-l border-b rounded-t-sm mr-1"
                :class="[
                  'h-' + (activeTab === 'style' ? '12' : '10'),
                  activeTab === 'style' ? 'bg-white text-gray-700 font-semibold hover:bg-white' : 'text-white bg-blue-500',
                  activeTab === 'style' ? 'border-white' : 'border-blue-500'
                ]"
                @click="activeTab = 'style'"
                :style="{ 'margin-top': activeTab === 'style' ? '-8px' : '0' }">
                Style
              </button>
              <button class="w-1/4 py-2 px-4 text-center hover:bg-blue-600 focus:outline-none border-t border-r border-l border-b rounded-t-sm mr-1"
                :class="[
                  'h-' + (activeTab === 'options' ? '12' : '10'),
                  activeTab === 'options' ? 'bg-white text-gray-700 font-semibold hover:bg-white' : 'text-white bg-blue-500',
                  activeTab === 'options' ? 'border-white' : 'border-blue-500'
                ]"
                @click="activeTab = 'options'"
                :style="{ 'margin-top': activeTab === 'options' ? '-8px' : '0' }">
                Options
              </button>
              <button class="w-1/4 py-2 px-4 text-center hover:bg-blue-600 focus:outline-none border-t border-r border-l border-b rounded-t-sm mr-1"
                :class="[
                  'h-' + (activeTab === 'responsive' ? '12' : '10'),
                  activeTab === 'responsive' ? 'bg-white text-gray-700 font-semibold hover:bg-white' : 'text-white bg-blue-500',
                  activeTab === 'responsive' ? 'border-white' : 'border-blue-500'
                ]"
                @click="activeTab = 'responsive'"
                :style="{ 'margin-top': activeTab === 'responsive' ? '-8px' : '0' }">
                Responsive
              </button>
              <button class="w-1/4 py-2 px-4 text-center hover:bg-blue-600 focus:outline-none border-t border-r border-l border-b rounded-t-sm"
                :class="[
                  'h-' + (activeTab === 'logic' ? '12' : '10'),
                  activeTab === 'logic' ? 'bg-white text-gray-700 font-semibold hover:bg-white' : 'text-white bg-blue-500',
                  activeTab === 'logic' ? 'border-white' : 'border-blue-500'
                ]"
                @click="activeTab = 'logic'"
                :style="{ 'margin-top': activeTab === 'logic' ? '-8px' : '0' }">
                Logic
              </button>
            </div>

            <div class="p-2">
              <div v-if="activeTab === 'content'" class="tab-content">

                <template v-if="selectedItem.type === 'header'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">

                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Header Config</span>
                        <span class="popup-label text-gray-500">การตั้งค่าของส่วนหัว</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-4 gap-4">
                      <div class="col-span-4">
                        <label class="popup-label block font-semibold mb-2">ข้อความที่ต้องการ</label>
                        <input v-model="selectedItem.text" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                      </div>
                      
                      <div class="col-span-2">
                        <label class="popup-label block font-semibold mb-2">ตำแหน่งข้อความ:</label>
                        <div class="grid grid-cols-4 gap-2">

                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.align === 'left' }">
                            <span class="font-icon"><i class="fas fa-align-left text-md ml-1"></i></span>
                            <input type="radio" v-model="selectedItem.align" value="left" class="radio-input hidden" />
                            <span class="mt-1 text-sm text-gray-500">ซ้าย</span>
                          </label>

                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.align === 'center' }">
                            <span class="font-icon"><i class="fas fa-align-center text-md ml-1"></i></span>
                            <input type="radio" v-model="selectedItem.align" value="center" class="radio-input hidden" />
                            <span class="mt-1 text-sm text-gray-500">กลาง</span>
                          </label>

                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.align === 'right' }">
                            <span class="font-icon"><i class="fas fa-align-right text-md ml-1"></i></span>
                            <input type="radio" v-model="selectedItem.align" value="right" class="radio-input hidden" />
                            <span class="mt-1 text-sm text-gray-500">ขวา</span>
                          </label>

                        </div>
                      </div>

                      <div class="col-span-2">
                        <label class="popup-label">Color:</label>
                        <input v-model="selectedItem.color" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                      </div>
                  
                      <div class="col-span-4">
                        <label class="popup-label block font-semibold mb-2">ความสูงของส่วนหัว</label>
                        <div class="flex items-center">
                          <select v-model="selectedItem.heightOption" class="w-32 popup-input rounded-sm border border-gray-200">
                            <option value="auto">Auto</option>
                            <option value="full">Full</option>
                            <option value="manual">Manual</option>
                          </select>
                          <input v-if="selectedItem.heightOption === 'manual'" v-model="selectedItem.height" type="number" class="w-16 ml-2 popup-input rounded-sm border border-gray-200" />
                          <select v-if="selectedItem.heightOption === 'manual'" v-model="selectedItem.heightUnit" class="w-16 popup-input rounded-sm border border-gray-200">
                            <option value="px">px</option>
                            <option value="%">%</option>
                          </select>
                          <label v-if="selectedItem.heightOption === 'full'" class="radio-label flex items-center cursor-pointer ml-2">
                            <input type="radio" v-model="selectedItem.alignH" value="top" class="radio-input">
                            <span class="radio-icon mr-2"></span>
                            <span class="text-sm text-gray-500">Align Top</span>
                          </label>
                          <label v-if="selectedItem.heightOption === 'full'" class="radio-label flex items-center cursor-pointer">
                            <input type="radio" v-model="selectedItem.alignH" value="middle" class="radio-input">
                            <span class="radio-icon mr-2"></span>
                            <span class="text-sm text-gray-500">Align Middle</span>
                          </label>
                          <label v-if="selectedItem.heightOption === 'full'" class="radio-label flex items-center cursor-pointer">
                            <input type="radio" v-model="selectedItem.alignH" value="bottom" class="radio-input">
                            <span class="radio-icon mr-2"></span>
                            <span class="text-sm text-gray-500">Align Bottom</span>
                          </label>
                          
                        </div>
                      </div>
                    
                      <div class="col-span-4">
                        <label class="popup-label block font-semibold mb-2">ขนาดฟอนต์:</label>
                        <div class="grid grid-cols-6 gap-2 items-center">
                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.fontSize === 'sm' }">
                            <span class="radio-icon text-[10px] w-6 h-6 flex items-center justify-center"><i class="fas fa-font"></i></span>
                            <input type="radio" v-model="selectedItem.fontSize" value="sm" class="radio-input hidden" />
                            <span class="mt-1 text-gray-500">sm</span>
                          </label>
                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.fontSize === 'md' }">
                            <span class="radio-icon text-[12px] w-6 h-6 flex items-center justify-center"><i class="fas fa-font"></i></span>
                            <input type="radio" v-model="selectedItem.fontSize" value="md" class="radio-input hidden" />
                            <span class="mt-1 text-gray-500">md</span>
                          </label>
                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.fontSize === 'lg' }">
                            <span class="radio-icon text-[14px] w-6 h-6 flex items-center justify-center"><i class="fas fa-font"></i></span>
                            <input type="radio" v-model="selectedItem.fontSize" value="lg" class="radio-input hidden" />
                            <span class="mt-1 text-gray-500">lg</span>
                          </label>
                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.fontSize === 'xl' }">
                            <span class="radio-icon text-[16px] w-6 h-6 flex items-center justify-center"><i class="fas fa-font"></i></span>
                            <input type="radio" v-model="selectedItem.fontSize" value="xl" class="radio-input hidden" />
                            <span class="mt-1 text-gray-500">xl</span>
                          </label>
                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.fontSize === '2xl' }">
                            <span class="radio-icon text-[18px] w-6 h-6 flex items-center justify-center"><i class="fas fa-font"></i></span>
                            <input type="radio" v-model="selectedItem.fontSize" value="2xl" class="radio-input hidden" />
                            <span class="mt-1 text-gray-500">2xl</span>
                          </label>
                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.fontSize === '4xl' }">
                            <span class="radio-icon text-[20px] w-6 h-6 flex items-center justify-center"><i class="fas fa-font"></i></span>
                            <input type="radio" v-model="selectedItem.fontSize" value="4xl" class="radio-input hidden" />
                            <span class="mt-1 text-gray-500">4xl</span>
                          </label>
                        </div>
                      </div>
                    
                      <div class="col-span-4">
                        <label class="popup-label block font-semibold mb-2">ความหนาฟอนต์:</label>
                        <div class="grid grid-cols-4 gap-2">

                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.fontWeight === 'normal' }">
                            <span class="font-icon font-normal text-lg">A</span>
                            <input type="radio" v-model="selectedItem.fontWeight" value="normal" class="radio-input hidden" />
                            <span class="mt-1 text-sm text-gray-500">Normal</span>
                          </label>

                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.fontWeight === 'medium' }">
                            <span class="font-icon font-medium text-lg">A</span>
                            <input type="radio" v-model="selectedItem.fontWeight" value="medium" class="radio-input hidden" />
                            <span class="mt-1 text-sm text-gray-500">Medium</span>
                          </label>

                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.fontWeight === 'semibold' }">
                            <span class="font-icon font-semibold text-lg">A</span>
                            <input type="radio" v-model="selectedItem.fontWeight" value="semibold" class="radio-input hidden" />
                            <span class="mt-1 text-sm text-gray-500">Semibold</span>
                          </label>

                          <label class="radio-label flex flex-col items-center p-2 justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.fontWeight === 'bold' }">
                            <span class="font-icon font-bold text-lg">A</span>
                            <input type="radio" v-model="selectedItem.fontWeight" value="bold" class="radio-input hidden" />
                            <span class="mt-1 text-sm text-gray-500">Bold</span>
                          </label>

                        </div>
                      </div>
                      
                    </div>
                    
                  </div>
                </template>


                <template v-else-if="selectedItem.type === 'popup'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Popup Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="popup-label">Popup Title:</label>
                        <input v-model="selectedItem.title" type="text" class="w-full popup-input" />
                      </div>
                
                      <div>
                        <label class="popup-label">Popup Delay (ms):</label>
                        <input v-model="selectedItem.delay" type="number" class="w-full popup-input" />
                      </div>
                
                      <div class="col-span-2">
                        <label class="popup-label">Popup Content Type:</label>
                        <div class="flex items-center mt-2">
                          <label class="radio-label flex items-center mr-4">
                            <input type="radio" v-model="selectedItem.contentType" value="image" class="radio-input" />
                            <span class="radio-icon mr-2"></span>
                            <span class="text-sm text-gray-500">Image</span>
                          </label>
                          <label class="radio-label flex items-center mr-4">
                            <input type="radio" v-model="selectedItem.contentType" value="video" class="radio-input" />
                            <span class="radio-icon mr-2"></span>
                            <span class="text-sm text-gray-500">Video</span>
                          </label>
                          <label class="radio-label flex items-center">
                            <input type="radio" v-model="selectedItem.contentType" value="text" class="radio-input" />
                            <span class="radio-icon mr-2"></span>
                            <span class="text-sm text-gray-500">Text</span>
                          </label>
                        </div>
                      </div>
                
                      <div class="col-span-2" v-if="selectedItem.contentType === 'image'">
                        <label class="popup-label">Image URL:</label>
                        <input v-model="selectedItem.imageUrl" type="text" class="w-full popup-input" />
                      </div>
                
                      <div class="col-span-2" v-if="selectedItem.contentType === 'video'">
                        <label class="popup-label">Video URL:</label>
                        <input v-model="selectedItem.videoUrl" type="text" class="w-full popup-input" />
                      </div>
                
                      <div class="col-span-2" v-if="selectedItem.contentType === 'text'">
                        <label class="popup-label">Text Content:</label>
                        <textarea v-model="selectedItem.textContent" class="w-full h-32 popup-textarea"></textarea>
                      </div>
                
                      <div class="col-span-2">
                        <label class="popup-label">Popup Display:</label>
                        <div class="flex items-center mt-2">
                          <label class="radio-label flex items-center mr-4">
                            <input type="radio" v-model="selectedItem.displayType" value="firstVisit" class="radio-input" />
                            <span class="radio-icon mr-2"></span>
                            <span class="text-sm text-gray-500">First Visit Only</span>
                          </label>
                          <label class="radio-label flex items-center">
                            <input type="radio" v-model="selectedItem.displayType" value="everyReload" class="radio-input" />
                            <span class="radio-icon mr-2"></span>
                            <span class="text-sm text-gray-500">Every Page Reload</span>
                          </label>
                        </div>
                      </div>

                      <div class="col-span-2">
                        <label class="popup-label">Autoclose:</label>
                        <div class="flex items-center mt-2">
                          <label class="checkbox-label flex items-center">
                            <input type="checkbox" v-model="selectedItem.autoclose" class="checkbox-input">
                            <span class="checkbox-icon"></span>
                            <span class="text-sm text-gray-500">Enable Autoclose</span>
                          </label>
                        </div>
                      </div>
                
                      <div class="col-span-2" v-if="selectedItem.autoclose">
                        <label class="popup-label">Autoclose Delay (ms):</label>
                        <input v-model="selectedItem.autocloseDelay" type="number" class="w-full popup-input">
                      </div>

                    </div>
                  </div>
                </template>
              
                <template v-else-if="selectedItem.type === 'paragraph'">

                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Paragraph Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    <div class="section-group flex flex-col h-full">
                      <MiniMCE v-model="selectedItem.text" class="popup-textarea flex-grow" :options="{}" />
                    </div>
                  </div>
                  
                </template>

                <template v-else-if="selectedItem.type === 'image'">

                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">ตั้งค่ารูปภาพ</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    
                    <div class="section-group">
                      <div class="relative w-full">
                        <div class="aspect-w-16 aspect-h-6">
                          <div class="absolute inset-0 flex items-center justify-center cursor-pointer" @click="OpenFileImageBrowser">
                            <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span class="text-gray-400" v-if="!selectedItem.url">ยังไม่ได้เลือกรูป</span>
                              <img v-else :src="selectedItem.url" alt="Selected Image" class="object-cover object-center w-full h-full" />
                            </div>
                            <div class="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100">
                              <div class="absolute inset-0 bg-black bg-opacity-20"></div>
                              <span class="text-white bg-black p-2"><i class="fas fa-upload text-white text-lg mr-2"></i> คลิ๊กเพื่อเลือกรูปภาพ</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="mt-2 grid grid-cols-2 gap-4">
                        
                        <div class="ml-2">
                          <label class="inline-flex items-center pt-8">
                            <input v-model="selectedItem.showShadow" type="checkbox" class="form-checkbox" />
                            <span class="ml-2">แสดงเงาของรูป</span>
                          </label>
                        </div>

                        <div class="ml-2">
                          <label class="inline-flex items-center pt-8">
                            <input v-model="selectedItem.showHome" type="checkbox" class="form-checkbox" />
                            <span class="ml-2">Home Link</span>
                          </label>
                        </div>

                        <div class="col-span-2">
                          <div class="grid grid-cols-1 gap-4">
                            <div class="ml-2">
                              <label class="inline-flex items-center">
                                <input v-model="selectedItem.canLink" type="checkbox" class="form-checkbox" />
                                <span class="ml-2">สร้างลิงค์</span>
                              </label>
                            </div>
                            <div v-if="selectedItem.canLink">
                              <div class="mt-2 grid grid-cols-3 gap-4">
                                <div class="col-span-2">
                                  <label class="popup-label">ระบุลิงค์ปลายทางที่ต้องการ:</label>
                                  <input v-model="selectedItem.link" type="text" class="popup-input w-full rounded-sm border border-gray-200" />
                                </div>

                                <div>
                                  <label class="popup-label">เปิดลิงค์ใน:</label>
                                  <select v-model="selectedItem.target" class="popup-input w-full rounded-sm border border-gray-200">
                                    <option disabled value="">เลือกปลายทาง</option>
                                    <option value="_self">หน้าเดิม</option>
                                    <option value="_blank">หน้าใหม่</option>
                                  </select>
                                </div>
                              </div>
                              
                            </div>

                            <div>
                              <div class="grid grid-cols-2 gap-4">
                                <div>
                                  <label class="popup-label">คำอธิบายรูปภาพ:</label>
                                  <input v-model="selectedItem.alt" type="text" class="popup-input w-full rounded-sm border border-gray-200" />
                                </div>
                                <div>
                                  <label class="popup-label">ขนาด:</label>
                                  <input v-model="selectedItem.width" type="text" class="popup-input w-full rounded-sm border border-gray-200" />
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                      

                    </div>
                    
                  </div>

                </template>

                <template v-else-if="selectedItem.type === 'slideshow'">

                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Slideshow Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    <div class="section-group">
                      <div v-for="(slide, index) in selectedItem.slides" :key="index" class="slide-item flex items-center border-b border-gray-200 py-4 pr-4">
                      
                        <div class="slide-thumbnail w-1/5 relative mr-3" @click="OpenFileBrowser(index)" >
                          <div v-if="slide.image" class="thumbnail-wrapper h-24 w-24 ">
                            <img :src="slide.image" alt="Slide Thumbnail" class="w-full h-full object-cover" />
                            <div class="upload-icon absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <font-awesome-icon :icon="['fas','upload']" class="mx-auto h-3 w-3 text-black"/>
                            </div>
                          </div>
                          <div v-else class="thumbnail-placeholder flex items-center justify-center h-24 w-24 bg-gray-200 border border-gray-300">
                            <font-awesome-icon :icon="['fas','image']" class="mx-auto h-3 w-3 text-black"/>
                          </div>
                        </div>
  
                        <div class="slide-details w-4/5 ml-4" v-if="selectedSlideIndex !== index">
                          <div class="slide-content">
                            <h3 class="font-semibold">{{ slide.title }}</h3>
                            <p class="text-gray-600">{{ slide.subtitle }}</p>
                            <p class="text-gray-600">{{ slide.link }}</p>
                          </div>
                          <div class="slide-actions flex items-center">
                            <button @click="showSlideActionPanel(index)" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded edit-slide-btn mr-2">
                              <font-awesome-icon :icon="['fas','pencil']" class="mx-auto h-3 w-3 text-white"/>
                            </button>
                            <button @click="cloneSlide(index)" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded edit-slide-btn mr-2" title="Clone Slide">
                              <font-awesome-icon :icon="['fas', 'clone']" class="mx-auto h-3 w-3 text-white" />
                            </button>
                            <button @click="moveSlideUp(index)" :disabled="index === 0" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded slide-action-btn mr-2" title="Move Up">
                              <font-awesome-icon :icon="['fas','chevron-up']" class="mx-auto h-3 w-3 text-white"/>
                            </button>
                            <button @click="moveSlideDown(index)" :disabled="index === selectedItem.slides.length - 1" class="bg-gray-500 hover:bg-gray-700 w-5 h-5 text-xs rounded slide-action-btn mr-2" title="Move Down">
                              <font-awesome-icon :icon="['fas','chevron-down']" class="mx-auto h-3 w-3 text-white"/>
                            </button>
                            <button @click="deleteSlide(index)" class="bg-red-500 hover:bg-red-700 w-5 h-5 text-xs rounded delete-slide-btn ml-auto">
                              <font-awesome-icon :icon="['fas','times']" class="mx-auto h-3 w-3 text-white"/>
                            </button>
                          </div>
                        </div>
  
                        <div v-if="selectedSlideIndex === index" class="slide-action-panel">
                          <div class="slide-details w-4/5 ml-4">
                            <div class="slide-content">
                              <input v-model="selectedItem.slides[selectedSlideIndex].title" type="text" class="slide-input text-[16px] border border-gray-300 rounded-sm w-full p-1 mb-1" placeholder="Slide Title" />
                              <input v-model="selectedItem.slides[selectedSlideIndex].subtitle" type="text" class="slide-input text-[16px] border border-gray-300 rounded-sm w-full p-1 mb-1" placeholder="Slide Subtitle" />
                              <input v-model="selectedItem.slides[selectedSlideIndex].link" type="text" class="slide-input text-[16px] border border-gray-300 rounded-sm w-full p-1" placeholder="Slide URL" />
                            </div>
                            <div class="slideshow-options mt-2">
                              <div class="slideshow-option">
                                <label class="popup-label">แสดงปุ่ม : </label>
                                <input v-model="selectedItem.slides[selectedSlideIndex].button" type="checkbox" class="popup-checkbox" />
                                <span class="ml-2">
                                  <label class="popup-label">แสดงข้อความ : </label>
                                <input v-model="selectedItem.slides[selectedSlideIndex].content" type="checkbox" class="popup-checkbox" />
                                </span>
                              </div>
                            </div>
                            <div class="slide-action-buttons">
                              <button @click="saveSlideChanges" class="save-slide-btn mr-2">บันทึก</button>
                              <button @click="cancelSlideEdit" class="cancel-slide-btn">ปิด</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button @click="addSlide(selectedItem)" class="w-full border pt-2 pb-2 border-gray-200 hover:bg-gray-100 hover:text-gray-700 text-center add-slide-btn mt-4 text-gray-500"><font-awesome-icon :icon="['fas','plus']" class="mx-auto h-3 w-3"/>เพิ่มสไลด์</button>
                      
                      <div class="slideshow-options mb-5 mt-4 grid grid-cols-2 gap-4">
                        <div class="slideshow-option">
                          <label class="popup-label">Interval : </label>
                          <input v-model="selectedItem.interval" type="number" class="popup-input border border-gray-300 rounded-sm" />
                        </div>
                        <div class="slideshow-option pt-3">
                          <input v-model="selectedItem.autoplay" type="checkbox" class="popup-checkbox" />
                          <label class="popup-label"> Autoplay</label>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </template>
                
                <template v-else-if="selectedItem.type === 'video'">

                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Video Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    <div class="section-group">
                      <label class="popup-label">Video URL:</label>
                      <input v-model="selectedItem.url" type="text" class="popup-input" />
                      <label class="popup-label">Autoplay:</label>
                      <input v-model="selectedItem.autoplay" type="checkbox" class="popup-checkbox" />
                    </div>
                  </div>

                </template>


                <template v-else-if="selectedItem.type === 'usernav'">

                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Usernav Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    <div class="section-group">
                      <label class="popup-label">Login URL:</label>
                      <input v-model="selectedItem.url" type="text" class="popup-input" />
                    </div>
                  </div>

                </template>

                <template v-else-if="selectedItem.type === 'table'">

                  
<!-- rows
<pre> {{ selectedItem.rows }}</pre>
columns
<pre>{{ selectedItem.columns }}</pre> -->
                  

                  <div :class="['content-editor', 'overflow-auto']" :style="divStyles">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Table Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    <div class="section-group">

                      <div>
                        <input type="radio" id="manual" value="manual" v-model="selectedItem.dataSourceType">
                        <label for="manual">Manual Input</label>
                        <input type="radio" id="api" value="api" v-model="selectedItem.dataSourceType">
                        <label for="api">API</label>
                      </div>
                      
                      <div v-if="selectedItem.dataSourceType === 'manual'">
                        
                        <div>

                          <button v-if="selectedItem.columns && selectedItem.columns.length && selectedItem.rows && selectedItem.rows.length" @click="clearTableData" class="ml-2 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded">Clear Table</button>
                          
                            <table class="">
                              <thead class="">
                                <tr class="">
                                  <th v-for="column in selectedItem.columns" :key="column.id" class="table-column">
                                    <input v-model="column.label" type="text" class="popup-input" />
                                    <button @click="deleteColumn(column.id)">del</button>
                                  </th>
                                </tr>
                              </thead>
                              <tbody class="">
                                <tr>
                                  <td class="p-2 bg-gray-100 border border-gray-200" v-for="column, columnIndex in selectedItem.columns" :key="column.id">
                                    <template v-if="!column.editMode">
                                      <div>
                                        <div class="flex items-center justify-between">
                                          <button @click="addColumnItem(columnIndex - 1)">
                                            <font-awesome-icon :icon="['fas', 'plus']" class="mx-auto h-3 w-3 text-green-500" />
                                          </button>
                                          <div class="text-center">{{ column.label }}</div>
                                          <div class="space-x-1">
                                            <button @click="toggleEditMode(column.id)">
                                              <font-awesome-icon :icon="['fas', 'pencil']" class="mx-auto h-3 w-3 text-black" />
                                            </button>
                                            <button @click="deleteColumn(column.id)">
                                              <font-awesome-icon :icon="['fas', 'trash']" class="mx-auto h-3 w-3 text-red-500" />
                                            </button>
                                            <button @click="addColumnItem(columnIndex + 1)">
                                              <font-awesome-icon :icon="['fas', 'plus']" class="mx-auto h-3 w-3 text-green-500" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </template>
                                    <template v-else>
                                      <input v-model="column.label" @input="editColumnName(column.id, $event.target.value)" type="text" class="popup-input w-full rounded-sm border border-gray-200" />
                                      <button @click="toggleEditMode(column.id)">Save</button>
                                    </template>
                                  </td>
                                  <td v-if="selectedItem.columns && selectedItem.columns.length && selectedItem.rows && selectedItem.rows.length" class="bg-gray-100 border border-gray-200">
                                    <button disabled>เครื่องมือ</button>
                                  </td>
                                </tr>
                                <tr v-for="row in selectedItem.rows" :key="row.id">
                                  <td v-for="(column, columnIndex) in selectedItem.columns" :key="column.id" class="border border-gray-200">
                                    <input v-model="row.content[columnIndex][column.field]" :key="column.field + row.id" type="text" class="popup-input w-full rounded-sm border border-white" />
                                  </td>
                                  <td class="border border-gray-200 text-center">
                                    <button @click="deleteRow(row.id)"><font-awesome-icon :icon="['fas','trash']" class="mx-auto h-3 w-3 text-black"/></button>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="100%">
                                    <button @click="addColumnItem" class="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"><font-awesome-icon :icon="['fas','plus']" class="mx-auto h-3 w-3 text-white"/>เพิ่มแถว</button>
                                    <button @click="addRowItem" class="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"><font-awesome-icon :icon="['fas','plus']" class="mx-auto h-3 w-3 text-white"/>เพิ่มข้อมูล</button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                      </div>
                      
                      <div v-else-if="selectedItem.dataSourceType === 'api'">

                        <div>
                          <div class="mb-3">
                            <input type="text" v-model="selectedItem.apiEndpoint" placeholder="API Endpoint" class="popup-input" />
                            <select v-model="selectedItem.selectedMethodType" class="popup-input">
                              <option value="GET">GET</option>
                              <option value="POST">POST</option>
                            </select>
                            <button @click="getDataFromAPI" class="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"><font-awesome-icon :icon="['fas', 'download']" class="mx-auto h-3 w-3 text-white" /> Get Data</button>
                            <button v-if="selectedItem.columns && selectedItem.columns.length && selectedItem.rows && selectedItem.rows.length" @click="clearTableData" class="ml-2 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded">Clear Table</button>
                          </div>
                          <div v-if="apiResponseError" class="text-red-500">{{ apiResponseError }}</div>
                        </div>
                        
                        <table class="">
                          <thead class="">
                            <tr class="">
                              <th v-for="column in selectedItem.columns" :key="column.id" class="table-column">
                                <input v-model="column.label" type="text" class="popup-input" />
                                <button @click="deleteColumn(column.id)">del</button>
                              </th>
                            </tr>
                          </thead>
                          <tbody class="">
                            <tr>
                              <td class="p-2 bg-gray-100 border border-gray-200" v-for="column, columnIndex in selectedItem.columns" :key="column.id">
                                <template v-if="!column.editMode">
                                  <div>
                                    <div class="flex items-center justify-between">
                                      <button @click="addColumnItem(columnIndex - 1)">
                                        <font-awesome-icon :icon="['fas', 'plus']" class="mx-auto h-3 w-3 text-green-500" />
                                      </button>
                                      <div class="text-center">{{ column.label }}</div>
                                      <div class="space-x-1">
                                        <button @click="toggleEditMode(column.id)">
                                          <font-awesome-icon :icon="['fas', 'pencil']" class="mx-auto h-3 w-3 text-black" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </template>
                                <template v-else>
                                  <input v-model="column.label" @input="editColumnName(column.id, $event.target.value)" type="text" class="popup-input w-full rounded-sm border border-gray-200" />
                                  <button @click="toggleEditMode(column.id)">Save</button>
                                </template>
                              </td>
                              <td v-if="selectedItem.columns && selectedItem.columns.length && selectedItem.rows && selectedItem.rows.length" class="bg-gray-100 border border-gray-200">
                                <button disabled>เครื่องมือ</button>
                              </td>
                            </tr>
                            <tr v-for="row in selectedItem.rows" :key="row.id">
                              <td v-for="(column, columnIndex) in selectedItem.columns" :key="column.id" class="border border-gray-200">
                                <input v-model="row.content[columnIndex][column.field]" :key="column.field + row.id" type="text" class="popup-input w-full rounded-sm border border-white" />
                              </td>
                              <td class="border border-gray-200 text-center">
                                <button @click="deleteRow(row.id)"><font-awesome-icon :icon="['fas','trash']" class="mx-auto h-3 w-3 text-black"/></button>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                      </div>

                    </div>
                  </div>
                  
          
                </template>

                <template v-else-if="selectedItem.type === 'button'">
                  <div class="content-editor overflow-auto min-h-[600px] max-h-[600px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent right-[-20px]">
                    <div class="section-group border-b border-gray-200 pb-3 mb-3">
                      <span class="block font-bold text-lg">Button Config</span>
                      <span class="text-gray-500">Configuration options for the button</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="section-group">
                        <label class="block popup-label font-semibold">Name:</label>
                        <input v-model="selectedItem.name" type="text" class="popup-input w-full rounded-sm border border-gray-200" />
                
                        <label class="block popup-label mt-3 font-semibold">Label:</label>
                        <input v-model="selectedItem.label" type="text" class="popup-input w-full rounded-sm border border-gray-200" />
                      </div>
                      <div class="section-group">
                        <label class="block popup-label font-semibold">Button Style:</label>
                        <select v-model="selectedItem.style" class="popup-select w-full rounded-sm border border-gray-200">
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                          <option value="success">Success</option>
                          <option value="danger">Danger</option>
                        </select>
                
                        <label class="block popup-label mt-3 font-semibold">Button Text Size:</label>
                        <select v-model="selectedItem.textSize" class="popup-select w-full rounded-sm border border-gray-200">
                          <option value="text-xs">Extra Small</option>
                          <option value="text-sm">Small</option>
                          <option value="text-base">Base</option>
                          <option value="text-lg">Large</option>
                          <option value="text-xl">Extra Large</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="selectedItem.type === 'address'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Form Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">ชื่อ:</label>
                        <input v-model="selectedItem.name" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                      </div>
                  
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">ประเภทที่อยู่ :</label>
                        <select v-model="selectedItem.inputType" class="w-full rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                          <option value="standard">ที่อยู่มาตรฐาน</option>
                          <option value="contact">[Form] ที่อยู่สำหรับติดต่อ</option>
                          <option value="billing">[Form] ที่อยู่สำหรับออกใบเสร็จ</option>
                          <option value="tax">[Form] ที่อยู่สำหรับออกใบกำกับภาษี</option>
                          <option value="delivery">[Form] ที่อยู่สำหรับจัดส่งเอกสาร</option>
                        </select>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mt-5">
                      <div class="section-group">
                        <div class="flex items-center mb-2">
                          <input v-model="selectedItem.required" type="checkbox" class="popup-checkbox mr-2" />
                          <span class="popup-label font-semibold">ต้องกรอกข้อมูลนี้</span>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </template>

                <template v-else-if="selectedItem.type === 'datetime'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Form Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <div class="section-group">
                          <label class="popup-label">ชื่อ:</label>
                          <input v-model="selectedItem.name" type="text" class="popup-input w-full rounded-sm border border-gray-200" />
                        </div>
                      </div>
                      <div>
                        <div class="section-group">
                          <label class="popup-label">Show:</label>
                          <select v-model="selectedItem.showDateTime" class="popup-input w-full rounded-sm border border-gray-200">
                            <option value="date">Date</option>
                            <option value="datetime">Date & Time</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-5">
                      <div class="section-group">
                        <div class="flex items-center mb-2">
                          <input v-model="selectedItem.required" type="checkbox" class="popup-checkbox mr-2" />
                          <span class="popup-label font-semibold">ต้องกรอกข้อมูลนี้</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>                

                <template v-else-if="selectedItem.type === 'input'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Form Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                  
                    <div class="grid grid-cols-2 gap-4">
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">ชื่อ:</label>
                        <input v-model="selectedItem.name" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                      </div>
                  
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">Placeholder:</label>
                        <input v-model="selectedItem.placeholder" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                      </div>
                    </div>
                  
                    <div class="grid grid-cols-2 gap-4 mt-3">
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">ข้อความเมื่อผิดพลาด:</label>
                        <input v-model="selectedItem.reqError" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                      </div>
                  
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">ประเภทฟอร์ม:</label>
                        <select v-model="selectedItem.inputType" class="w-full rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                          <option value="text">Text</option>
                          <option value="name">[Form] Name</option>
                          <option value="email">[Form] Email</option>
                          <option value="mobile">[Form] Mobile</option>
                          <option value="taxID">[Form] Tax ID</option>
                          <option value="taxName">[Form] Tax Name</option>
                          <option value="number">Number</option>
                        </select>
                      </div>
                    </div>
                  
                    <div class="grid grid-cols-2 gap-4 mt-3">
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">ความยาวสูงสุด:</label>
                        <input v-model="selectedItem.maxLength" type="number" class="w-full popup-input rounded-sm border border-gray-200" />
                      </div>
                  
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">ความยาวขั้นต่ำ:</label>
                        <input v-model="selectedItem.minLength" type="number" class="w-full popup-input rounded-sm border border-gray-200" />
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mt-3">
                      <div class="section-group">
                        <div class="flex items-center mb-2">
                          <input v-model="selectedItem.required" type="checkbox" class="popup-checkbox mr-2" />
                          <span class="popup-label">ต้องกรอกข้อมูลนี้</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </template>
                
                <template v-else-if="selectedItem.type === 'textarea'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Form Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-5">
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">ชื่อ:</label>
                        <input v-model="selectedItem.name" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                        <span class="popup-helper text-gray-500 text-sm">เพิ่มชื่อเพื่อระบุข้อมูล</span>
                      </div>
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">ข้อความเมื่อผิดพลาด:</label>
                        <input v-model="selectedItem.reqError" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                        <span class="popup-helper text-gray-500 text-sm">เพิ่มข้อความที่จะแสดงเมื่อข้อมูลไม่ถูกต้อง</span>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mt-5">
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">Placeholder:</label>
                        <input v-model="selectedItem.placeholder" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                        <span class="popup-helper text-gray-500 text-sm">เพิ่มข้อความแสดงตัวอย่างในช่องป้อนข้อมูล</span>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mt-5">
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">Rows:</label>
                        <input v-model="selectedItem.rows" type="number" class="w-full popup-input rounded-sm border border-gray-200" />
                        <span class="popup-helper text-gray-500 text-sm">กำหนดจำนวนแถวสำหรับช่องข้อมูล</span>
                      </div>
                      <div class="section-group">
                        <label class="popup-label block mb-2 font-semibold">Cols:</label>
                        <input v-model="selectedItem.cols" type="number" class="w-full popup-input rounded-sm border border-gray-200" />
                        <span class="popup-helper text-gray-500 text-sm">กำหนดจำนวนคอลัมน์สำหรับช่องข้อมูล</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mt-5">
                      <div class="section-group">
                        <div class="flex items-center mb-2">
                          <input v-model="selectedItem.required" type="checkbox" class="popup-checkbox mr-2" />
                          <span class="popup-label">ต้องกรอกข้อมูลนี้</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </template>

                <template v-else-if="selectedItem.type === 'radiobox'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group border-b border-gray-200 pb-3 mb-3">
                      <span class="popup-label block font-bold text-lg">Form Config</span>
                      <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                    </div>
                    
                    <div class="section-group">
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="popup-label block font-semibold">ชื่อ:</label>
                          <input v-model="selectedItem.name" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                        </div>
                        <div>
                          <label class="popup-label block font-semibold">ข้อความเมื่อผิดพลาด:</label>
                          <input v-model="selectedItem.reqError" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                        </div>
                      </div>
                  
                      <label class="popup-label block mt-3 mb-2 font-semibold">Radio Options:</label>

                      <div v-for="(option, index) in selectedItem.options" :key="index" class="flex items-center mb-1">
                        <div class="bg-gray-100 border border-gray-200 flex w-full p-2">
                          <div class="mr-3 w-2/5">
                            <span class="popup-label block text-sm text-gray-600">ชื่อตัวเลือก : </span>
                            <input v-model="option.label" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                          </div>
                      
                          <div class="w-2/5">
                            <span class="popup-label block text-sm text-gray-600">ข้อมูล : </span>
                            <input v-model="option.value" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                          </div>
                          
                          <div class="w-1/5 flex pt-4">
                            <input v-model="selectedItem.defaultOption" :value="index" type="radio" class="popup-radio" />
                            <button @click="deleteRadioOption(index)" class="ml-2 text-red-500 hover:text-red-700 focus:outline-none">
                              <font-awesome-icon :icon="['fas', 'times']" class="h-4 w-4"/>
                            </button>
                            <button @click="moveRadioOptionUp(index)" :disabled="index === 0" class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                              <font-awesome-icon :icon="['fas', 'arrow-up']" class="h-4 w-4"/>
                            </button>
                            <button @click="moveRadioOptionDown(index)" :disabled="index === selectedItem.options.length - 1" class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                              <font-awesome-icon :icon="['fas', 'arrow-down']" class="h-4 w-4"/>
                            </button>
                            <button @click="cloneRadioOption(index)" class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                              <font-awesome-icon :icon="['fas', 'clone']" class="h-4 w-4"/>
                            </button>
                          </div>
                        </div>
                      </div>

                      <button @click="addRadioOption(selectedItem)" class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        <font-awesome-icon :icon="['fas', 'plus']" class="h-4 w-4"/>
                        เพิ่มตัวเลือก
                      </button>
                      
                    </div>
                    <div class="section-group mt-3">
                      <label class="popup-label block mb-2 font-semibold">การตั้งค่าเพิ่มเติม:</label>
                      <div class="flex flex-wrap">
                        <div class="w-1/2">
                          <div class="flex items-center mb-2">
                            <input v-model="selectedItem.required" type="checkbox" class="popup-checkbox mr-2" />
                            <span class="popup-label">Required</span>
                          </div>
                        </div>
                        <div class="w-1/2">
                          <div class="flex items-center mb-2">
                            <input v-model="selectedItem.inline" type="checkbox" class="popup-checkbox mr-2" />
                            <span class="popup-label">Inline Display</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  
                </template>

                <template v-else-if="selectedItem.type === 'checkbox'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Form Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    <div class="section-group">
                      <label class="popup-label">ชื่อ:</label>
                      <input v-model="selectedItem.name" type="text" class="popup-input" />
                      <label class="popup-label">Checkbox Options:</label>
                      <div v-for="(option, index) in selectedItem.options" :key="index" class="flex items-center mb-2">
                        <input v-model="option.value" type="text" class="popup-input" />
                        <span class="popup-label ml-2">Label:</span>
                        <input v-model="option.label" type="text" class="popup-input" />
                        <button @click="deleteCheckboxOption(index)" class="ml-2 text-red-500 hover:text-red-700 focus:outline-none">
                          <font-awesome-icon :icon="['fas', 'times']" class="h-4 w-4"/>
                        </button>
                        <button @click="moveCheckboxOptionUp(index)" :disabled="index === 0" class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <font-awesome-icon :icon="['fas', 'arrow-up']" class="h-4 w-4"/>
                        </button>
                        <button @click="moveCheckboxOptionDown(index)" :disabled="index === selectedItem.options.length - 1" class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <font-awesome-icon :icon="['fas', 'arrow-down']" class="h-4 w-4"/>
                        </button>
                        <button @click="cloneCheckboxOption(index)" class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <font-awesome-icon :icon="['fas', 'clone']" class="h-4 w-4"/>
                        </button>
                      </div>
                      <button @click="addCheckboxOption(selectedItem)" class="mt-2 text-green-500 hover:text-green-700 focus:outline-none">
                        <font-awesome-icon :icon="['fas', 'plus']" class="h-4 w-4"/>
                        Add Option
                      </button>
                    </div>
                    <div class="section-group">
                      <label class="popup-label">Additional Configuration:</label>
                      <div class="flex items-center mb-2">
                        <span class="popup-label">Required:</span>
                        <input v-model="selectedItem.required" type="checkbox" class="popup-checkbox ml-2" />
                      </div>
                      <div class="flex items-center mb-2">
                        <span class="popup-label">Inline Display:</span>
                        <input v-model="selectedItem.inline" type="checkbox" class="popup-checkbox ml-2" />
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="selectedItem.type === 'select'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Form Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    <div class="section-group">
                      <label class="popup-label">ชื่อ:</label>
                      <input v-model="selectedItem.name" type="text" class="popup-input" />

                      <label class="popup-label">ข้อความเมื่อผิดพลาด:</label>
                      <input v-model="selectedItem.reqError" type="text" class="popup-input" />

                      <label class="popup-label">Select Options:</label>
                      <div v-for="(option, index) in selectedItem.options" :key="index" class="flex items-center mb-2">
                        <input v-model="option.value" type="text" class="popup-input" />
                        <span class="popup-label ml-2">Label:</span>
                        <input v-model="option.label" type="text" class="popup-input" />
                        <button @click="deleteSelectOption(index)" class="ml-2 text-red-500 hover:text-red-700 focus:outline-none">
                          <font-awesome-icon :icon="['fas', 'times']" class="h-4 w-4"/>
                        </button>
                        <button @click="moveSelectOptionUp(index)" :disabled="index === 0" class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <font-awesome-icon :icon="['fas', 'arrow-up']" class="h-4 w-4"/>
                        </button>
                        <button @click="moveSelectOptionDown(index)" :disabled="index === selectedItem.options.length - 1" class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <font-awesome-icon :icon="['fas', 'arrow-down']" class="h-4 w-4"/>
                        </button>
                        <button @click="cloneSelectOption(index)" class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                          <font-awesome-icon :icon="['fas', 'clone']" class="h-4 w-4"/>
                        </button>
                      </div>
                      <button @click="addSelectOption(selectedItem)" class="mt-2 text-green-500 hover:text-green-700 focus:outline-none">
                        <font-awesome-icon :icon="['fas', 'plus']" class="h-4 w-4"/>
                        Add Option
                      </button>
                    </div>
                    <div class="section-group">
                      <label class="popup-label">Additional Configuration:</label>
                      <div class="flex items-center mb-2">
                        <span class="popup-label">Required:</span>
                        <input v-model="selectedItem.required" type="checkbox" class="popup-checkbox ml-2" />
                      </div>
                      <div class="flex items-center mb-2">
                        <span class="popup-label">Multiple Select:</span>
                        <input v-model="selectedItem.multiple" type="checkbox" class="popup-checkbox ml-2" />
                      </div>
                      <div class="flex items-center mb-2">
                        <span class="popup-label">Disable First Option:</span>
                        <input v-model="selectedItem.disableFirstOption" type="checkbox" class="popup-checkbox ml-2" />
                      </div>
                      <div class="flex items-center mb-2">
                        <span class="popup-label">Placeholder Text:</span>
                        <input v-model="selectedItem.placeholder" type="text" class="popup-input ml-2" />
                      </div>
                    </div>

                  </div>
                </template>

                <template v-if="selectedItem.type === 'upload'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Upload File Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    <div class="section-group">
                      <label class="popup-label">ชื่อ:</label>
                      <input v-model="selectedItem.name" type="text" class="popup-input" />

                      <label class="popup-label">ข้อความเมื่อผิดพลาด:</label>
                      <input v-model="selectedItem.reqError" type="text" class="popup-input" />
                      
                      <label class="popup-label">File Size Limit (in MB):</label>
                      <input v-model="selectedItem.fileSizeLimit" type="number" class="popup-input" />
                      <span class="popup-helper">Enter the maximum file size allowed for each uploaded file (in megabytes).</span>
                    </div>
                    <div class="section-group">
                      <label class="popup-label">Item Limit:</label>
                      <input v-model="selectedItem.itemLimit" type="number" class="popup-input" />
                      <span class="popup-helper">Enter the maximum number of files that can be uploaded.</span>
                    </div>
                    <div class="section-group">
                      <label class="popup-label">File Type Limit:</label>
                      <input v-model="selectedItem.fileTypeLimit" type="text" class="popup-input" />
                      <span class="popup-helper">Enter the allowed file types/extensions (e.g., jpg, png, pdf). Separate multiple types with commas.</span>
                    </div>
                    <div class="section-group">
                      <label class="popup-label">Upload Folder:</label>
                      <input v-model="selectedItem.uploadFolder" type="text" class="popup-input" />
                      <span class="popup-helper">Enter the folder path where the uploaded files will be stored.</span>
                    </div>
                    <div class="section-group">
                      <label class="popup-label">Show Preview:</label>
                      <input v-model="selectedItem.showPreview" type="checkbox" class="popup-checkbox" />
                    </div>
                    <div class="section-group">
                      <label class="popup-label">Multiple Files:</label>
                      <input v-model="selectedItem.multipleFiles" type="checkbox" class="popup-checkbox" />
                    </div>
                    <div class="section-group">
                      <label class="popup-label">Required:</label>
                      <input v-model="selectedItem.required" type="checkbox" class="popup-checkbox" />
                    </div>
                  </div>
                  <div class="p-2">
                    <span>Upload File Preview</span>
                    <!-- Add any additional preview elements here -->
                  </div>
                </template>

                <template v-else-if="selectedItem.type === 'navigation'">
                 
                  <div class="content-editor overflow-auto min-h-[600px] max-h-[600px] scrollbar-thin scrollbar-transparent right-[-20px]">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Navigation Config</span>
                        <span class="popup-label text-gray-500">แสดงเนื้อหานี้ในหน้าจอของอุปกรณ์</span>
                      </div>
                    </div>
                    <div class="section-group">
                      <label class="popup-label block mb-3 font-semibold">เลือกเมนูที่ต้องการใช้งาน :</label>
                      <div class="grid grid-cols-2 gap-2">
                        <div v-for="item in menuItems" :key="item._id" class="p-2 bg-gray-100 border border-gray-200 rounded-sm">
                          <input
                            v-model="selectedItem.menu"
                            :value="item._id"
                            :id="selectedItem.menu + '-' + item._id"
                            @change="updateMenuName(item.title)"
                            type="radio"
                            class="popup-radiobox"
                          />
                          <label :for="selectedItem.menu + '-' + item._id" class="popup-label ml-2">{{ item.title }}</label>
                        </div>
                      </div>
                    </div>
                
                    <div class="section-group mt-5 pt-3 border-t border-gray-100">
                      <label class="popup-label block mb-3 font-semibold">Style Configuration:</label>
                      <div class="grid grid-cols-3 gap-2">
                        <div>
                          <label class="popup-label">Text Alignment:</label>
                          <select v-model="selectedItem.alignment" class="popup-input w-full rounded-sm border border-gray-200">
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                    
                        <div>
                          <label class="popup-label">Display:</label>
                          <select v-model="selectedItem.display" class="popup-input w-full rounded-sm border border-gray-200">
                            <option value="horizontal">Horizontal</option>
                            <option value="vertical">Vertical</option>
                          </select>
                        </div>
                    
                        <div>
                          <label class="popup-label">Font Size: (px)</label>
                          <input v-model="selectedItem.fontSize" type="number" class="popup-input w-full rounded-sm border border-gray-200" />
                        </div>
                    
                      </div>

                      <div class="grid grid-cols-3 mt-3 gap-2">

                        <div>
                          <label class="popup-label block">Font Color: </label>
                          <ColorPicker :defaultColor="selectedItem.fontColor" @selectColor="handlefontColorSelection" class="w-full"/>
                          <div class="selected-color" :style="{ background: selectedItem.fontColor }"></div>
                        </div>
                    
                        <div>
                          <label class="popup-label block">Hover Color: </label>
                          <ColorPicker :defaultColor="selectedItem.hoverColor" @selectColor="handlehoverColorSelection" class="w-full"/>
                          <div class="selected-color" :style="{ background: selectedItem.hoverColor }"></div>
                        </div>
                    
                        <div>
                          <label class="popup-label">Menu Item Space:</label>
                          <input v-model="selectedItem.itemSpace" type="number" class="popup-input w-full rounded-sm border border-gray-200" />
                        </div>

                      </div>

                    </div>

                  </div>

                </template>
                
                <template v-else-if="selectedItem.type === 'row'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Row Config</span>
                        <span class="popup-label text-gray-500">ตั่งค่าการแสดงผลของแถวแนวนอน</span>
                      </div>

                      <div class="grid grid-cols-1 gap-4">
                        <div class="section-group">
                          <label class="popup-label block mb-2 pb-2 font-semibold">วิธีการแสดงผล (Mode)</label>
                          <div class="grid grid-cols-3 gap-2">
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.mode === 'standard' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/unsetpng.png" alt="Unset" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.mode" value="standard " class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Standard</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.mode === 'tab' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/blockpng.png" alt="Block" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.mode" value="tab" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Tab</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.mode === 'accordion' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/w-fullpng.png" alt="Full Width" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.mode" value="accordion" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Accordion</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 gap-4">
                        <div class="section-group">
                          <label class="popup-label block mb-2 pb-2 font-semibold">การแสดงผลของแถวแนวนอน (Row)</label>
                          <div class="grid grid-cols-3 gap-2">
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.sz === 'unset' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/unsetpng.png" alt="Unset" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.sz" value="unset" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Unset</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.sz === 'block' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/blockpng.png" alt="Block" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.sz" value="block" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Block</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.sz === 'w-full' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/w-fullpng.png" alt="Full Width" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.sz" value="w-full" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Full Width</span>
                            </label>
                          </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                          <div class="section-group">
                            <label class="popup-label block mb-2 pb-2 font-semibold">การแสดงผลของเนื้อหาด้านใน (Inner)</label>
                            <div class="grid grid-cols-3 gap-2">
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.bsz === 'unset' }">
                                <span>
                                  <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/unsetpng.png" alt="Unset" class="w-10 h-10 mb-2" />
                                </span>
                                <input type="radio" v-model="selectedItem.bsz" value="unset" class="radio-input hidden" />
                                <span class="text-center text-sm text-gray-500">Unset</span>
                              </label>
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.bsz === 'block' }">
                                <span>
                                  <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/blockpng.png" alt="Block" class="w-10 h-10 mb-2" />
                                </span>
                                <input type="radio" v-model="selectedItem.bsz" value="block" class="radio-input hidden" />
                                <span class="text-center text-sm text-gray-500">Block</span>
                              </label>
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.bsz === 'w-full' }">
                                <span>
                                  <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/w-fullpng.png" alt="Full Width" class="w-10 h-10 mb-2" />
                                </span>
                                <input type="radio" v-model="selectedItem.bsz" value="w-full" class="radio-input hidden" />
                                <span class="text-center text-sm text-gray-500">Full Width</span>
                              </label>
                            </div>
                          </div>

                          <div class="section-group">
                            <label class="popup-label block mb-2 pb-2 font-semibold">ความกว้าง (Inner)</label>
                            <label class="popup-label font-medium">Width:</label>
                            <select v-model="selectedItem.width" class="popup-select w-full mb-3 rounded-sm border border-gray-200">
                              <option value="max-w-full">100%</option>
                              <option value="max-w-7xl">70%</option>
                              <option value="max-w-6xl">60%</option>
                              <option value="max-w-5xl">50%</option>
                              <option value="max-w-4xl">40%</option>
                              <option value="max-w-3xl">30%</option>
                              <option value="max-w-2xl">20%</option>
                              <option value="max-w-xl">10%</option>
                            </select>
                          </div>


                          <!-- Row Alignment -->
                          <div class="section-group mt-3">
                            <label class="popup-label block font-semibold">Row Alignment</label>
                            <div class="grid grid-cols-3 gap-4 mt-3">
                              <label
                                v-for="alignment in ['left', 'center', 'right']"
                                :key="alignment"
                                class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm"
                                :class="{ 'bg-gray-200': selectedItem.alignment === alignment }"
                                @click="selectedItem.alignment = alignment"
                              >
                                <input type="radio" v-model="selectedItem.alignment" :value="alignment" class="radio-input hidden" />
                                <span class="text-center text-sm text-gray-500">{{ alignment }}</span>
                              </label>
                            </div>
                          </div>


                          <!-- Configuration for row height -->
                          <div class="section-group">
                            <label class="popup-label block mb-2 pb-2 font-semibold">ความสูงของแถว (Row Height)</label>
                            <div class="grid grid-cols-4 gap-2">
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.height === 'h-96' }">
                                <span class="text-center text-sm text-gray-500">h-96</span>
                                <input type="radio" v-model="selectedItem.height" value="h-96" class="radio-input hidden" />
                              </label>
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.height === 'h-80' }">
                                <span class="text-center text-sm text-gray-500">h-80</span>
                                <input type="radio" v-model="selectedItem.height" value="h-80" class="radio-input hidden" />
                              </label>
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.height === 'h-64' }">
                                <span class="text-center text-sm text-gray-500">h-64</span>
                                <input type="radio" v-model="selectedItem.height" value="h-64" class="radio-input hidden" />
                              </label>
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.height === 'h-48' }">
                                <span class="text-center text-sm text-gray-500">h-48</span>
                                <input type="radio" v-model="selectedItem.height" value="h-48" class="radio-input hidden" />
                              </label>
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.height === 'h-40' }">
                                <span class="text-center text-sm text-gray-500">h-40</span>
                                <input type="radio" v-model="selectedItem.height" value="h-40" class="radio-input hidden" />
                              </label>
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.height === 'h-32' }">
                                <span class="text-center text-sm text-gray-500">h-32</span>
                                <input type="radio" v-model="selectedItem.height" value="h-32" class="radio-input hidden" />
                              </label>
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.height === 'h-24' }">
                                <span class="text-center text-sm text-gray-500">h-24</span>
                                <input type="radio" v-model="selectedItem.height" value="h-24" class="radio-input hidden" />
                              </label>
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.height === 'h-12' }">
                                <span class="text-center text-sm text-gray-500">h-12</span>
                                <input type="radio" v-model="selectedItem.height" value="h-12" class="radio-input hidden" />
                              </label>

                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.height === 'h-10' }">
                                <span class="text-center text-sm text-gray-500">h-10</span>
                                <input type="radio" v-model="selectedItem.height" value="h-10" class="radio-input hidden" />
                              </label>

                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.height === 'h-8' }">
                                <span class="text-center text-sm text-gray-500">h-8</span>
                                <input type="radio" v-model="selectedItem.height" value="h-8" class="radio-input hidden" />
                              </label>
                              <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.height === 'h-6' }">
                                <span class="text-center text-sm text-gray-500">h-6</span>
                                <input type="radio" v-model="selectedItem.height" value="h-6" class="radio-input hidden" />
                              </label>
                            </div>
                          </div>

                        </div>
                        
                        <div class="section-group">
                          <label class="popup-label block mb-2 pb-2 font-semibold">จำนวนแถวแนวตั้ง (Column)</label>
                          <div class="grid grid-cols-6 gap-2">
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm hover:bg-gray-200" :class="{ 'bg-gray-200': selectedItem.col === '1' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/1png.png" alt="Full Width" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.col" value="1" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">1</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm hover:bg-gray-200" :class="{ 'bg-gray-200': selectedItem.col === '2' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/2png.png" alt="Full Width" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.col" value="2" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">2</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm hover:bg-gray-200" :class="{ 'bg-gray-200': selectedItem.col === '3' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/3png.png" alt="Full Width" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.col" value="3" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">3</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm hover:bg-gray-200" :class="{ 'bg-gray-200': selectedItem.col === '4' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/4png.png" alt="Full Width" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.col" value="4" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">4</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm hover:bg-gray-200" :class="{ 'bg-gray-200': selectedItem.col === '5' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/5png.png" alt="Full Width" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.col" value="5" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">5</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm hover:bg-gray-200" :class="{ 'bg-gray-200': selectedItem.col === '6' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/6png.png" alt="Full Width" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.col" value="6" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">6</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                
                <template v-else-if="selectedItem.type === 'column'">
                  <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">

                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Column Config</span>
                        <span class="popup-label text-gray-500">ตั้งค่าการแสดงผลของแถวแนวตั้ง</span>
                      </div>
                      <div class="grid grid-cols-1 gap-4">
                        <div class="section-group">
                          <label class="popup-label block mb-2 pb-2 font-semibold">การแสดงผลของแถว (Column)</label>
                          <div class="grid grid-cols-3 gap-2">
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.sz === 'unset' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/unsetpng.png" alt="Unset" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.sz" value="unset" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Unset</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.sz === 'block' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/blockpng.png" alt="Block" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.sz" value="block" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Block</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.sz === 'w-full' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/w-fullpng.png" alt="Full Width" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.sz" value="w-full" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Full Width</span>
                            </label>
                          </div>
                        </div>

                        <div class="section-group">
                          <label class="popup-label block mb-2 pb-2 font-semibold">ความกว้างของแถวแนวตั้ง (Column)</label>
                          <div class="grid grid-cols-6 gap-2">
                            <label
                              v-for="col in parseInt(this.rows[this.lightboxRowIndex].col)"
                              :key="col"
                              class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm hover:bg-gray-200"
                              :class="{ 'bg-gray-200': selectedItem.colspan === col.toString() }"
                            >
                              <span>
                                <img :src="'https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/'+col+'png.png'" alt="Full Width" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.colspan" :value="col.toString()" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">{{ col }}</span>
                            </label>
                          </div>
                        </div>

                        <div class="section-group mt-3">
                          <label class="popup-label block font-semibold">Column Alignment</label>
                          <div class="grid grid-cols-3 gap-4 mt-3">
                            <label
                              v-for="alignment in ['left', 'center', 'right']"
                              :key="alignment"
                              class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm"
                              :class="{ 'bg-gray-200': selectedItem.alignment === alignment }"
                              @click="selectedItem.alignment = alignment"
                            >
                              <input type="radio" v-model="selectedItem.alignment" :value="alignment" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">{{ alignment }}</span>
                            </label>
                          </div>
                        </div>

                        <div class="section-group mt-3">
                          <label class="popup-label block font-semibold">Inline</label>
                          <div class="flex items-center mt-3">
                            <span class="mr-2">Inline:</span>
                            <input type="checkbox" v-model="selectedItem.inline" class="checkbox-input" />
                          </div>
                        </div>

                        <div class="section-group mt-3">
                          <label class="popup-label block font-semibold">Spacing</label>
                          <div class="flex items-center mt-3">
                            <span class="mr-2">Spacing:</span>
                            <select v-model="selectedItem.spacing" class="select-input">
                              <option value="none">None</option>
                              <option value="space">Space</option>
                              <option value="margin">Margin</option>
                              <option value="padding">Padding</option>
                            </select>
                          </div>
                        </div>
                        
                        <div class="section-group">
                          <label class="popup-label block mb-2 pb-2 font-semibold">การแสดงผลของเนื้อหาด้านใน (Innner)</label>
                          <div class="grid grid-cols-3 gap-2">
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.bsz === 'unset' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/unsetpng.png" alt="Unset" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.bsz" value="unset" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Unset</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.bsz === 'block' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/blockpng.png" alt="Block" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.bsz" value="block" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Block</span>
                            </label>
                            <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.bsz === 'w-full' }">
                              <span>
                                <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/w-fullpng.png" alt="Full Width" class="w-10 h-10 mb-2" />
                              </span>
                              <input type="radio" v-model="selectedItem.bsz" value="w-full" class="radio-input hidden" />
                              <span class="text-center text-sm text-gray-500">Full Width</span>
                            </label>
                          </div>
                        </div>
                
                      </div>
                    </div>
                    
                  </div>
                </template>

              </div>
          
              <div v-else-if="activeTab === 'style'" class="tab-content">
                <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
              
                  <div class="section-group">
                    <div class="border-b border-gray-200 pb-3 mb-3">
                      <span class="popup-label block font-bold text-lg">Style Config</span>
                      <span class="popup-label text-gray-500">ตั้งค่าการแสดงผลของเนื้อหา</span>
                    </div>
                  </div>

                  <div class="section-group mt-3">
                    <label class="popup-label block mb-2 pb-2 font-semibold">ตำแหน่งของวัตถุ (Position)</label>
                    <div class="grid grid-cols-4 gap-2">
                      <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.position === 'static' }">
                        <span>
                          <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/staticpng.png" alt="Unset" class="w-10 h-10 mb-2" />
                        </span>
                        <input type="radio" v-model="selectedItem.position" value="static" class="radio-input hidden" />
                        <span class="text-center text-sm text-gray-500">Static</span>
                      </label>
                      <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.position === 'relative' }">
                        <span>
                          <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/relativepng.png" alt="Block" class="w-10 h-10 mb-2" />
                        </span>
                        <input type="radio" v-model="selectedItem.position" value="relative" class="radio-input hidden" />
                        <span class="text-center text-sm text-gray-500">Relative</span>
                      </label>
                      <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.position === 'absolute' }">
                        <span>
                          <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/absolutepng.png" alt="Full Width" class="w-10 h-10 mb-2" />
                        </span>
                        <input type="radio" v-model="selectedItem.position" value="absolute" class="radio-input hidden" />
                        <span class="text-center text-sm text-gray-500">Absolute</span>
                      </label>
                      <label class="radio-label p-2 flex flex-col items-center justify-center cursor-pointer border border-gray-300 rounded-sm" :class="{ 'bg-gray-200': selectedItem.position === 'fixed' }">
                        <span>
                          <img src="https://vue-project.sgp1.digitaloceanspaces.com/ui-icon/fixedpng.png" alt="Full Width" class="w-10 h-10 mb-2" />
                        </span>
                        <input type="radio" v-model="selectedItem.position" value="fixed" class="radio-input hidden" />
                        <span class="text-center text-sm text-gray-500">Fixed</span>
                      </label>
                    </div>
                  </div>

                  <div class="section-group mt-3">
                    <label class="popup-label block font-semibold">Background</label>
                    <div class="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label class="popup-label font-medium">Background Type:</label>
                        <select v-model="selectedItem.bgType" class="popup-select w-full mb-3 rounded-sm border border-gray-200">
                          <option value="none">None</option>
                          <option value="color">Color</option>
                          <option value="image">Image</option>
                          <option value="gradient">Gradient</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div>
                        <div v-if="selectedItem.bgType === 'color'">
                          <div class="relative">
                            <label class="block popup-label">Color:</label>
                            <input v-model="selectedItem.bgColor" type="text" class="w-full popup-input rounded-sm border border-gray-200" @click="showColorPicker('bgColor')" />
                            <div v-if="showColorPickerField === 'bgColor'">
                              <input class="absolute right-2 top-[32px] w-35 h-35" type="color" v-model="selectedItem.bgColor" @input="updateColor('bgColor')" @click.stop />
                            </div>
                          </div>

                        </div>
                  
                        <div v-else-if="selectedItem.bgType === 'image'">
                          <label class="block popup-label">Image URL:</label>
                          <input v-model="selectedItem.bgImage" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                        </div>
                        <div v-else-if="selectedItem.bgType === 'gradient'" class="grid grid-cols-2 gap-4">
                          <div class="relative">
                            <label class="block popup-label">Gradient Color 1:</label>
                            <input v-model="selectedItem.bgGradientColor1" type="text" class="w-full popup-input rounded-sm border border-gray-200" @click="showColorPicker('bgGradientColor1')" />
                            <div v-if="showColorPickerField === 'bgGradientColor1'">
                              <input class="absolute right-2 top-[32px] w-35 h-35" type="color" v-model="selectedItem.bgGradientColor1" @input="updateColor('bgGradientColor1')" @click.stop />
                            </div>
                          </div>
                          <div class="relative">
                            <label class="block popup-label">Gradient Color 2:</label>
                            <input v-model="selectedItem.bgGradientColor2" type="text" class="w-full popup-input rounded-sm border border-gray-200" @click="showColorPicker('bgGradientColor2')" />
                            <div v-if="showColorPickerField === 'bgGradientColor2'">
                              <input class="absolute right-2 top-[32px] w-35 h-35" type="color" v-model="selectedItem.bgGradientColor2" @input="updateColor('bgGradientColor2')" @click.stop />
                            </div>
                          </div>
                        </div>
                  
                        <div v-else-if="selectedItem.bgType === 'video'">
                          <label class="block popup-label">Video URL:</label>
                          <input v-model="selectedItem.bgVideo" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="section-group mt-3" v-if="selectedItem.type === 'row'">
                    <label class="popup-label block font-semibold">Inner Background</label>
                    <div class="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label class="popup-label font-medium">Background Type:</label>
                        <select v-model="selectedItem.bgInnerType" class="popup-select w-full mb-3 rounded-sm border border-gray-200">
                          <option value="none">None</option>
                          <option value="color">Color</option>
                          <option value="image">Image</option>
                          <option value="gradient">Gradient</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div>
                        <div v-if="selectedItem.bgInnerType === 'color'">
                          <div class="relative">
                            <label class="block popup-label">Color:</label>
                            <input v-model="selectedItem.bgInnerColor" type="text" class="w-full popup-input rounded-sm border border-gray-200" @click="showColorPicker('bgInnerColor')" />
                            <div v-if="showColorPickerField === 'bgInnerColor'">
                              <input class="absolute right-2 top-[32px] w-35 h-35" type="color" v-model="selectedItem.bgInnerColor" @input="updateColor('bgInnerColor')" @click.stop />
                            </div>
                          </div>

                        </div>
                  
                        <div v-else-if="selectedItem.bgInnerType === 'image'">
                          <label class="block popup-label">Image URL:</label>
                          <input v-model="selectedItem.bgInnerImage" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                        </div>
                        <div v-else-if="selectedItem.bgInnerType === 'gradient'" class="grid grid-cols-2 gap-4">
                          <div class="relative">
                            <label class="block popup-label">Gradient Color 1:</label>
                            <input v-model="selectedItem.bgInnerGradientColor1" type="text" class="w-full popup-input rounded-sm border border-gray-200" @click="showColorPicker('bgInnerGradientColor1')" />
                            <div v-if="showColorPickerField === 'bgInnerGradientColor1'">
                              <input class="absolute right-2 top-[32px] w-35 h-35" type="color" v-model="selectedItem.bgInnerGradientColor1" @input="updateColor('bgInnerGradientColor1')" @click.stop />
                            </div>
                          </div>
                          <div class="relative">
                            <label class="block popup-label">Gradient Color 2:</label>
                            <input v-model="selectedItem.bgInnerGradientColor2" type="text" class="w-full popup-input rounded-sm border border-gray-200" @click="showColorPicker('bgInnerGradientColor2')" />
                            <div v-if="showColorPickerField === 'bgInnerGradientColor2'">
                              <input class="absolute right-2 top-[32px] w-35 h-35" type="color" v-model="selectedItem.bgInnerGradientColor2" @input="updateColor('bgInnerGradientColor2')" @click.stop />
                            </div>
                          </div>
                        </div>
                  
                        <div v-else-if="selectedItem.bgInnerType === 'video'">
                          <label class="block popup-label">Video URL:</label>
                          <input v-model="selectedItem.bgInnerVideo" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>
              
                  <div class="section-group">
                    <label class="popup-label block font-semibold">Border</label>
                    <div class="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label class="popup-label block font-medium">Style:</label>
                        <select v-model="selectedItem.borderStyle" class="w-full popup-select rounded-sm border border-gray-200">
                          <option value="none">None</option>
                          <option value="solid">Solid</option>
                          <option value="dotted">Dotted</option>
                          <option value="dashed">Dashed</option>
                          <option value="double">Double</option>
                          <option value="hidden">Hidden</option>
                        </select>
                      </div>
                      <div>
                        <label class="popup-label block font-medium">Color:</label>
                        <input v-model="selectedItem.borderColor" type="text" class="w-full popup-input rounded-sm border border-gray-200" />
                      </div>
                    </div>
                  </div>
              
                  <div class="section-group mt-3">
                    <label class="popup-label font-semibold">Width</label>
                    <div class="grid grid-cols-4 gap-2">
                      <div>
                        <label class="block popup-label">Left:</label>
                        <input v-model="selectedItem.borderLeftWidth" type="text" class="w-full popup-input rounded-sm border border-gray-200" placeholder="Left Width" />
                      </div>
                      <div>
                        <label class="block popup-label">Top:</label>
                        <input v-model="selectedItem.borderTopWidth" type="text" class="w-full popup-input rounded-sm border border-gray-200" placeholder="Top Width" />
                      </div>
                      <div>
                        <label class="block popup-label">Right:</label>
                        <input v-model="selectedItem.borderRightWidth" type="text" class="w-full popup-input rounded-sm border border-gray-200" placeholder="Right Width" />
                      </div>
                      <div>
                        <label class="block popup-label">Bottom:</label>
                        <input v-model="selectedItem.borderBottomWidth" type="text" class="w-full popup-input rounded-sm border border-gray-200" placeholder="Bottom Width" />
                      </div>
                    </div>
                  </div>
              
                  <div class="section-group mt-3">
                    <label class="popup-label font-semibold">Radius</label>
                    <div class="grid grid-cols-4 gap-2">
                      <div>
                        <label class="block popup-label">Top Left:</label>
                        <input v-model="selectedItem.borderRadiusTopLeft" type="text" class="w-full popup-input rounded-sm border border-gray-200" placeholder="Top Left Radius" />
                      </div>
                      <div>
                        <label class="block popup-label">Top Right:</label>
                        <input v-model="selectedItem.borderRadiusTopRight" type="text" class="w-full popup-input rounded-sm border border-gray-200" placeholder="Top Right Radius" />
                      </div>
                      <div>
                        <label class="block popup-label">Bottom Right:</label>
                        <input v-model="selectedItem.borderRadiusBottomRight" type="text" class="w-full popup-input rounded-sm border border-gray-200" placeholder="Bottom Right Radius" />
                      </div>
                      <div>
                        <label class="block popup-label">Bottom Left:</label>
                        <input v-model="selectedItem.borderRadiusBottomLeft" type="text" class="w-full popup-input rounded-sm border border-gray-200" placeholder="Bottom Left Radius" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else-if="activeTab === 'options'" class="tab-content">
                <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                  
                  <div class="section-group">
                    <div class="border-b border-gray-200 pb-3 mb-3">
                      <span class="popup-label block font-bold text-lg">Option Config</span>
                      <span class="popup-label text-gray-500">ตั้งค่าช่องว่างและระยะห่างของเนื้อหา</span>
                    </div>

                    <div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="popup-label font-semibold">Custom ID</label>
                          <input v-model="selectedItem.customId" type="text" class="popup-input w-full rounded-sm border border-gray-200" />
                        </div>
                        <div>
                          <label class="popup-label font-semibold">Custom Class:</label>
                          <input v-model="selectedItem.customClass" type="text" class="popup-input w-full rounded-sm border border-gray-200" />
                        </div>
                      </div>
                    </div>

                    <label class="popup-label block mt-5 font-semibold">Padding</label>
                    <div class="grid grid-cols-5 gap-2">
                      <div>
                        <label class="block popup-label">
                          <input type="checkbox" v-model="setAllPadding" /> Set All
                        </label>
                      </div>
                      <div v-if="!setAllPadding">
                        <label class="block popup-label">Left:</label>
                        <input v-model="selectedItem.paddingLeft" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Padding Left" />
                      </div>
                      <div v-if="!setAllPadding">
                        <label class="block popup-label">Top:</label>
                        <input v-model="selectedItem.paddingTop" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Padding Top" />
                      </div>
                      <div v-if="!setAllPadding">
                        <label class="block popup-label">Right:</label>
                        <input v-model="selectedItem.paddingRight" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Padding Right" />
                      </div>
                      <div v-if="!setAllPadding">
                        <label class="block popup-label">Bottom:</label>
                        <input v-model="selectedItem.paddingBottom" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Padding Bottom" />
                      </div>
                      <div v-else class="col-span-2">
                        <label class="block popup-label">All Padding</label>
                        <input v-model="paddingValue" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Padding All" />
                      </div>
                    </div>
                  </div>

                  <div class="section-group mt-5 mb-5">
                    <label class="popup-label mt-3 mb-3 font-semibold">Margin</label>
                    <div class="grid grid-cols-5 gap-2">

                      <div>
                        <label class="block popup-label">
                          <input type="checkbox" v-model="setAllMargin" /> Set All
                        </label>
                      </div>

                      <div v-if="!setAllMargin">
                        <label class="block popup-label">Left:</label>
                        <input v-model="selectedItem.marginLeft" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Margin Left" />
                      </div>
                      <div v-if="!setAllMargin">
                        <label class="block popup-label">Top:</label>
                        <input v-model="selectedItem.marginTop" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Margin Top" />
                      </div>
                      <div v-if="!setAllMargin">
                        <label class="block popup-label">Right:</label>
                        <input v-model="selectedItem.marginRight" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Margin Right" />
                      </div>
                      <div v-if="!setAllMargin">
                        <label class="block popup-label">Bottom:</label>
                        <input v-model="selectedItem.marginBottom" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Margin Bottom" />
                      </div>
                      <div v-else class="col-span-2">
                        <label class="block popup-label">All Margin</label>
                        <input v-model="marginValue" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Margin All" />
                      </div>
                      
                    </div>
                  </div>

                  <div v-if="selectedItem.type === 'row'">
                    <div class="section-group">
                      <div class="border-b border-gray-200 pb-3 mb-3">
                        <span class="popup-label block font-bold text-lg">Option Config</span>
                        <span class="popup-label text-gray-500">ตั้งค่าช่องว่างและระยะห่างของเนื้อหาด้านใน</span>
                      </div>
                      <label class="popup-label  mt-5 font-semibold">Padding</label>

                      <div class="grid grid-cols-5 gap-2">

                        <div>
                          <label class="block popup-label">
                            <input type="checkbox" v-model="setAllInnerPadding" /> Set All
                          </label>
                        </div>

                        <div v-if="!setAllInnerPadding">
                          <label class="block popup-label">Left:</label>
                          <input v-model="selectedItem.paddingInnerLeft" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Padding Left" />
                        </div>
                        <div v-if="!setAllInnerPadding">
                          <label class="block popup-label">Top:</label>
                          <input v-model="selectedItem.paddingInnerTop" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Padding Top" />
                        </div>
                        <div v-if="!setAllInnerPadding">
                          <label class="block popup-label">Right:</label>
                          <input v-model="selectedItem.paddingInnerRight" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Padding Right" />
                        </div>
                        <div v-if="!setAllInnerPadding">
                          <label class="block popup-label">Bottom:</label>
                          <input v-model="selectedItem.paddingInnerBottom" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Padding Bottom" />
                        </div>
                        <div v-else class="col-span-2">
                          <label class="block popup-label">All Inner Padding</label>
                          <input v-model="selectedItem.paddingInnerBottom" type="text" class="w-full popup-input text-sm rounded-sm border border-gray-200" placeholder="Padding All" />
                        </div>
                      </div>

                    </div>
  
                  </div>
                  
                </div>
              </div>

              <div v-else-if="activeTab === 'logic'" class="tab-content">
                <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
                  <div class="border-b border-gray-200 pb-3 mb-3">
                    <span class="popup-label block font-bold text-lg">Logic Config</span>
                    <span class="popup-label text-gray-500">การตั้งค่าเงื่อนไขการแดสงผลจาก Element</span>
                    <!-- <pre>{{ selectedItem.logics }} | {{selectedItem.logics.some(logic => logic.hasOwnProperty('request'))}}</pre> -->
                  </div>

                  <template v-if="!selectedItem.logics || !selectedItem.logics.some(logic => logic.hasOwnProperty('request'))">
                    <div class="mt-5">
                      <div class="grid grid-cols-3 gap-1 text-center">
                        <div class="bg-blue-200 pb-2 pl-2 pr-2 pt-2 mb-1 font-bold">เมื่อเลือกตัวเลือกนี้</div>
                        <div class="bg-blue-200 pb-2 pl-2 pr-2 pt-2 mb-1 font-bold">กำหนดให้ฟอร์มนี้</div>
                        <div class="bg-blue-200 pb-2 pl-2 pr-2 pt-2 mb-1 font-bold">แสดงผลตามเงื่อนไข</div>
                      </div>
                      <div v-for="(logicItem, index) in selectedItem.logics" :key="logicItem.uid" class="grid grid-cols-3 gap-1">
                        <div class="bg-gray-100 p-2 mb-1">
                          <div class="flex items-center">

                            <button @click="deleteLogicItem(index, logicItem)" class="mr-2 bg-red-500 hover:bg-red-700 w-5 h-5 text-xs rounded delete-slide-btn">
                              <font-awesome-icon :icon="['fas', 'times']" class="h-3 w-3 text-white" />
                            </button>
                            
                            <template v-if="!logicItem.default">
                              <select v-model="logicItem.default" class="w-full rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <option value="" disabled>เลือกตัวเลือก</option>
                                <option v-for="option in selectedItem.options" :value="option.value" :key="option.value" :disabled="logicItem.default !== ''">{{ option.label }}</option>
                              </select>
                            </template>
                            <template v-else>
                              <input :value="getSelectedOptionLabel(logicItem.default)" class="p-2 w-full bg-white border rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" disabled>
                            </template>
                          </div>
                        </div>
                        
                        <div v-if="logicItem.default" class="bg-gray-100 p-2 mb-1">
                          <template v-if="!logicItem.destination">
                            <select v-model="logicItem.destination" class="w-full rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                              <option value="" disabled>เลือกเป้าหมาย</option>
                              <option v-for="option in getAllBuilderOptions()" :value="option" :key="option.name">{{ option.name }}</option>
                            </select>
                          </template>
                          <template v-else>
                            <input v-model="logicItem.destination.name" class="p-2 w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" disabled>
                          </template>
                        </div>
                                      
                        <div v-if="logicItem.destination" class="bg-gray-100 p-2 mb-1">
                          <template v-if="!logicItem.method">
                            <select v-model="logicItem.method" class="w-full rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" @change="addLogicItem(logicItem,selectedItem)">
                              <option value="" disabled>เลือกเงื่อนไข</option>
                              <option value="show">แสดง</option>
                              <option value="hide">ซ่อน</option>
                            </select>
                          </template>
                          <template v-else>
                            <input v-model="logicItem.method" class="p-2 w-full rounded-sm border border-gray-300 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" disabled>
                          </template>
                        </div>
                      </div>
                    </div>
                  
                    <div class="mt-5">
                      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="addLogicItem(selectedItem)"><font-awesome-icon :icon="['fas', 'plus']" class="h-3 w-3 text-white" /> เพิ่มเงื่อนไข</button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="mt-5">
                      <span class="popup-label text-gray-600 block mb-3">ฟอร์มนี้ถูกตั้งให้มีการแสดงผลตามเงื่อนไขของแบบฟอร์มอื่น</span>
                      <div class="grid grid-cols-3 gap-2 text-center font-bold">
                        <div class="bg-gray-200 border border-gray-300 p-2">เมื่อฟอร์มด้านล่าง</div>
                        <div class="bg-gray-200 border border-gray-300 p-2">ถูกเลือกเป็น</div>
                        <div class="bg-gray-200 border border-gray-300 p-2">ฟอร์มนี้จะ</div>
                      </div>
                      
                      <div v-for="(logicItem) in selectedItem.logics" :key="logicItem.uid" class="grid grid-cols-3 gap-2">
                        <div class="border border-gray-300 p-2">
                          <div class="flex items-center justify-center h-full">{{ getParentLogicObjectName(logicItem) }}</div>
                        </div>
                        <div class="border border-gray-300 p-2">
                          <div class="flex items-center justify-center h-full">{{ logicItem.default }}</div>
                        </div>
                        <div class="border border-gray-300 p-2">
                          <div class="flex items-center justify-center h-full">{{ logicItem.method === 'show' ? 'แสดงผล' : 'ซ่อน' }}</div>
                        </div>
                      </div>
                    </div>
                    
                  </template>
                </div>
              </div>
              
              <div v-else-if="activeTab === 'responsive'" class="tab-content">
                <div class="content-editor overflow-auto" style="min-height: 600px; max-height: 600px; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; right: -20px;">
  
                  <div class="border-b border-gray-200 pb-3 mb-3">
                    <span class="popup-label block font-bold text-lg">Responsive Config</span>
                    <span class="popup-label text-gray-500">การตั้งค่าการแสดงผลในขนาดหน้าจอต่างๆ</span>
                  </div>
              
                  <div class="mt-5 checkbox-group grid grid-cols-4 gap-2">
                    
                    <label class="checkbox-label flex flex-col items-center justify-center cursor-pointer p-4 border border-gray-300 rounded-sm hover:bg-gray-100">
                      <span class="device-icon text-4xl pb-2"><i class="fas fa-mobile-alt"></i></span>
                      <span>
                        <input type="checkbox" v-model="selectedItem.mobile" class="checkbox-input" />
                        <span class="device-text text-sm text-gray-500"> Mobile</span>
                      </span>
                    </label>

                    <label class="checkbox-label flex flex-col items-center justify-center cursor-pointer p-4 border border-gray-300 rounded-sm hover:bg-gray-100">
                      <span class="device-icon text-4xl pb-2"><i class="fas fa-tablet-alt"></i></span>
                      <span>
                        <input type="checkbox" v-model="selectedItem.tablet" class="checkbox-input" />
                        <span class="device-text text-sm text-gray-500"> Tablet</span>
                      </span>
                    </label>

                    <label class="checkbox-label flex flex-col items-center justify-center cursor-pointer p-4 border border-gray-300 rounded-sm hover:bg-gray-100">
                      <span class="device-icon text-4xl pb-2"><i class="fas fa-laptop"></i></span>
                      <span>
                        <input type="checkbox" v-model="selectedItem.laptop" class="checkbox-input" />
                        <span class="device-text text-sm text-gray-500"> Laptop</span>
                      </span>
                    </label>

                    <label class="checkbox-label flex flex-col items-center justify-center cursor-pointer p-4 border border-gray-300 rounded-sm hover:bg-gray-100">
                      <span class="device-icon text-4xl pb-2"><i class="fas fa-desktop"></i></span>
                      <span>
                        <input type="checkbox" v-model="selectedItem.desktop" class="checkbox-input" />
                        <span class="device-text text-sm text-gray-500"> Desktop</span>
                      </span>
                    </label>

                  </div>
                </div>
              </div>
              
            </div>
      
            <div :class="['flex', {'justify-end': !fullScreenMode}, 'bg-gray-100 p-4 border-t border-gray-200', {'fixed inset-x-0 bottom-0': fullScreenMode}]">
              <button @click.prevent="saveEditedItem" class="popup-button mr-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                <font-awesome-icon :icon="['fas','save']" class="mx-auto h-4 w-4 text-white"/>
                บันทึกข้อมูล
              </button>
              <button @click="cancelEditPopup" class="popup-button bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded">
                ยกเลิก
              </button>
            </div>

          </div>

        </div>
      </div>

    </template>

</template>

  <style>
  .active-panel {
    border: 1px solid gray; /* You can adjust the border properties here */
  }
  .row-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .row {
    background-color: #ccc;
    font-size: 16px;
  }

  .bg-1 {
    background-color: #ccc;
  }

  .bg-2 {
    background-color: #eee;
  }

  .bg-3 {
    background-color: #fff;
  }

  .grid-1 {
    width: calc(100% - 0px);
  }

  .grid-2 {
    width: calc(50% - 5px);
  }

  .row-padding {
    padding-top: 1px;
    padding-right: 1px;
    padding-bottom: 1px;
    padding-left: 1px;
  }

  .row-margin {
    margin-top: 1px;
    margin-right: 1px;
    margin-bottom: 1px;
    margin-left: 1px;
  }

  .body-scroll-lock {
    overflow: hidden;
  }

  .table-layout {
    display: flex;
  }
  
  .table-columns,
  .table-rows {
    flex: 1;
    padding: 0 10px;
  }
  
  .table-column,
  .table-row {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  . {
    flex: 1;
    margin-right: 5px;
  }
  
</style>

<script>
import storageManager from '@/plugins/storage';
import Builder              from '@/interface/template/Builder.vue';

export default {
    data() {
      return {
		configs: storageManager.get('configs'),
        session: storageManager.get('session'),
		dataItem: this.$route.params.id,
        accessSession: [],
        selectSession: false,
        rows: [],
      }
    },
    components: {
		Builder
    },
    methods: {
		changeSession() {
			this.selectSession = true;
		},
		async getData() {
			try {
				const resAPI = await fetch(`https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/${this.dataItem}`, {
					method: 'GET',
					headers: {'Content-Type': 'application/json'},
				});
	
				const RestReturn = await resAPI.json();
				const pageLayout = RestReturn;
				const savedLayout = RestReturn;
		
				this.$setPageTitle(RestReturn.title);
				if (savedLayout) {
					this.rows  = savedLayout;
					this.post  = pageLayout;
				}
			} catch (error) {
			console.log(error);
			}
		},
		async updateData(layout) {
			try {
			const response = await fetch('https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/post/' + this.post._id, {
				method: 'PUT',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({
				data: {
					builder: layout,
				},
				options: {}
				})
			});
			const data = await response.json();
			console.log(data);

			if(response.status===200) {
				this.$swal({
					toast: true,
					position: 'bottom-end',
					showConfirmButton: false,
					timer: 3000,
					icon: 'success',
					title: 'บันทึกข้อมูลหน้าเว็บ',
					text: 'บันทึกข้อมูลสำหรับหน้าเว็บนี้ สำเร็จแล้ว',
				});
			}
			} catch (error) {
			console.error(error);
			}
		},
	},
  async mounted () {
    try {
		this.accessSession  = storageManager.get('session','current');
		await this.getData();
    } catch (error) {
      console.log(Error);
    }
  },
  setup() {},
};
</script>

<template>
	<div>
		<Builder 
		@update-layout="updateData" 
		:builderData="this.rows"
		:getBuilder="getData"
		:backUrl="'/cms/all/'"
		/>
	</div>
</template>
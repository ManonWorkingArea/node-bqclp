<script>
import Header from '@/interface/template/backend/Header';
import Footer from '@/interface/template/backend/Footer';
import Topbar from '@/interface/template/Topbar'

import CookiePolicyPopup from '@/utils/cookie';
import { handleIdleActivity } from '@/plugins/idle-check'
import storageManager from '@/plugins/storage';

import Session from '@/interface/template/selectSession.vue';

console.log("Load Backend Layout");
export default {
	name: 'Backend',
	inject: ['saltSecret'],
	components: {
		Topbar,
		Header,
		Footer,
		Session,
		CookiePolicyPopup
	},
	data() {
		const session = storageManager.get('session');
		return {
			selectSession: false,
			login: session.login,
			role: session.role,
			session: session.current,
			configs: storageManager.get('configs'),
		}
    },
	computed: {
	},
	methods: {
		sessionExpired() {
			console.log("Session expired");
			storageManager.delete('session');
			this.$router.push("/member/login");
		},
		async checkActiveSession()
		{
			try {
				// const session 		= storageManager.get('session');
				console.log("Role",this.role);
				if(this.role=="admin") {
					if(this.session=="none") {
						console.log("Not Set Current Session");
						this.selectSession = true;
						//console.log("Current",session.current.id);
					} else {
						this.selectSession = false;
						//console.log("Current",session.current.id);
					}
				} else {
					this.selectSession = false;
					//console.log("Current",session.current.id);
				}
				console.log("selectSession",this.selectSession)
			} catch (error) {
				console.log(error)
			}
		}
	},
	async mounted () {
		handleIdleActivity(this.sessionExpired, 900, false)
      try {
        await this.checkActiveSession();

		if (this.configs.siteType !== "origin" && this.configs.siteType !== "collection"&& this.configs.siteType !== "asset") {
			console.log("Access via " + this.configs.siteType);
		} else {
			console.log("Access via " + this.configs.siteType);
		}
      } catch (error) {
        console.log(Error);
      }
    },
	setup() {
    function onIdle() {
      console.log('The user has been idle for more than 1 minutes.')
    }
    handleIdleActivity(onIdle)
  },
}
</script>

<template>
	<div class="min-h-screen bg-gray-100">
		<Topbar/>
		<CookiePolicyPopup/>
		<Header />
		<Session/>
		<router-view/>
		<back-to-top visibleoffset="500" right="30px" bottom="20px" class="shadow-lg" > <i data-feather="chevron-up"></i> </back-to-top>
		<Footer />
	</div>
</template>
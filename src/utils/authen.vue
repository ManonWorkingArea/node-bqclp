<script>
import {useRoute} from 'vue-router';
//import { ls } from 'vue-lsp'

import storageManager from '../plugins/storage.js';

export default {
	name: 'Authen',
    data() {
      return {
        configs: storageManager.get('configs'),
        session: storageManager.get('session'),
      };
    },
    computed: {
    },
	components: {
	},
	mounted() {
    this.checkAuth();
	},
	updated() {
	},
	methods: {
        async checkAuth()
        {
            const route      = useRoute();
            const pageAuth   = route.meta.auth;
            const page       = route.name;

            const session 		= storageManager.get('session');
            let accessToken     = session.token;
            let hasLogin        = session.login;
            let activeSchool    = session.current;

            //console.log("hasLogin",hasLogin)
            //console.log("Page -> Auth:",pageAuth)
            //console.log("User -> Token:",accessToken)
            //console.log("User -> Login:",hasLogin)

            if(this.session.interface==="frontend")
            {
                console.log("Front-End");
            }
            else if(this.session.interface==="backend")
            {
                console.log("Back-End");
                if(hasLogin) {// ถ้าเข้าสู๋ระบบแล้ว
                    if (page=="Login" || activeSchool==undefined) { // ห้ามเข้าสู่ระบบซ้ำ || ยังไม่ได้เลือกโรงเรียน
                        console.log("Not Login Again");
                        this.$router.replace({path: '/'});
                    } else {// เลือกโรงเรียนแล้ว
                        console.log("Has School Active");
                        if(pageAuth) {
                            console.log("This page is : Authen Request");
                            if(accessToken==="" || accessToken ===null || accessToken==undefined) {
                                console.log("Your Cannot Access");
                            } else {
                                console.log("Your Can Access");
                            }
                        } else {
                            console.log("This page is : No Authen Request");
                        }
                    }
                    //console.log("Login");
                } else {// ยังไม่ได้เข้าสู่ระบบ
                    console.log("Not Login");
                    if(page!="Login") { 
                        window.location.href = "/member/login"
                        //this.$router.replace({path: '/member/login'});
                        console.log("Not Login Page",page);
                    } else {
                        console.log("Login Page",page);
                    }
                }
            }
        },
    },
    setup() { 
    },
};
</script>

<template>
<div></div>
</template>
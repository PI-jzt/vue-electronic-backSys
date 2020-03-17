/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import '../assets/css/global.css'
import '../assets/fonts/iconfont.css'
import axios from 'axios'

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http=axios
Vue.use(VueRouter)

const router = new VueRouter({
	routes:
	[
		{path:'/',redirect:'/login'},
		{path:'/login', component:Login },
		{path:'/home', component:Home }
	]	
	
})
	router.beforeEach((to, from, next) => {
		if( to.path == '/home'){
			if(!window.sessionStorage.getItem('token')){
				next('/login')
			} else {
				next()
			}
		} else {
			next()
		}
		
	})

export default router

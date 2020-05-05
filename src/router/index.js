/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import UserDetail from '../components/Users/UserDetail.vue'
import Rights from '../components/Power/rights.vue'
import Roles from '../components/Power/role.vue'
import goodsClassify from '../components/goods/goods_classify.vue'
import sortingParameter from '../components/goods/sorting_parameter.vue'
import goodsList from '../components/goods/goods_list.vue'
import goodsAddPage from '../components/goods/goods_add.vue'
import orders from '../components/order/order.vue'
import reports from '../components/reports/reports.vue'
import '../assets/css/global.css'
import '../assets/fonts/iconfont.css'
import axios from 'axios'


axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//处理请求数据时绑定上token值
axios.interceptors.request.use(config =>{
	//为headers 加上授权字段且赋值
	config.headers.Authorization=window.sessionStorage.getItem('token')
	return config
})


Vue.prototype.$http=axios
Vue.use(VueRouter)

const router = new VueRouter({
	routes:
	[
		{path:'/',redirect:'/login'},
		{path:'/login', component:Login },
		{path:'/home', component:Home ,redirect:'/welcome', children:[
			{path:'/welcome', component:Welcome },
			{path:'/users', component:UserDetail},
			{path:'/rights', component:Rights},
			{path:'/roles', component:Roles},
			{path:'/categories', component:goodsClassify},
			{path:'/params', component:sortingParameter},
			{path:'/goods', component:goodsList},
			{path:'/goods/add', component:goodsAddPage},
			{path:'/orders', component:orders},
			{path:'/reports', component:reports}
		]}
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

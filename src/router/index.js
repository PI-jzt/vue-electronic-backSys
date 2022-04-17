/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
/*
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
import reports from '../components/reports/reports.vue'*/
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/home.vue')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/welcome.vue')
const UserDetail = () => import(/* webpackChunkName:"user_Rights_Roles" */ '../components/Users/UserDetail.vue')
const Rights = () => import(/* webpackChunkName:"user_Rights_Roles" */ '../components/Power/rights.vue')
const Roles = () => import(/* webpackChunkName:"user_Rights_Roles" */ '../components/Power/role.vue')
const goodsClassify = () => import(/* webpackChunkName:"goodsClassify_sortingParameter" */ '../components/goods/goods_classify.vue')
const sortingParameter = () => import(/* webpackChunkName:"goodsClassify_sortingParameter" */ '../components/goods/sorting_parameter.vue')
const goodsList = () => import(/* webpackChunkName:"goodsList_goodsAddPage" */ '../components/goods/goods_list.vue')
const goodsAddPage = () => import(/* webpackChunkName:"goodsList_goodsAddPage" */ '../components/goods/goods_add.vue')
const orders = () => import(/* webpackChunkName:"orders_reports" */ '../components/order/order.vue')
const reports = () => import(/* webpackChunkName:"orders_reports" */ '../components/reports/reports.vue')
const vuexTest01 = () => import(/* webpackChunkName:"orders_reports" */ '../components/vuex_test/test_01.vue')

Vue.use(VueRouter)

const router = new VueRouter({
	routes:
	[
		{path:'/', redirect:'/login'},
		{path:'/login', component:Login },
		{path:'/home', component:Home , redirect:'/welcome', children:[
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
			]
		},
		{path:'/vuexTest01', component:vuexTest01}
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

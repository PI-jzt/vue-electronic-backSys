import './assets/css/global.css'
import './assets/fonts/iconfont.css'

import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'

import router from './router/index.js'
import './plugins/element.js'

//可下拉树型表格
import ZkTable from 'vue-table-with-tree-grid'

//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


//配置全局css样式及icon图标


//配置axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//处理请求数据时绑定上token值
axios.interceptors.request.use(config => {
	//为headers 加上授权字段且赋值
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})


Vue.prototype.$http = axios


Vue.component('tree-table', ZkTable)

Vue.use(VueQuillEditor)

Vue.config.productionTip = false


//定义一个全局的时间格式的过滤器
Vue.filter('formatDate', function(val){
		if(val.toString().length < 13){ 
			val = val * 1000
		}
		const newDate = new Date(val)
		const year = newDate.getFullYear()
		const month = (newDate.getMonth() + 1 + '').padStart(2, 0)
		const day = (newDate.getDate() + '').padStart(2, 0)
		const hour = (newDate.getHours() + '').padStart(2, 0)
		const minutee = (newDate.getMinutes() + '').padStart(2, 0)
		const seconds = (newDate.getSeconds() + '').padStart(2, 0)
		return year + '-' + month + '-' + day + '  ' + hour + ':' + minutee + ':' + seconds
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

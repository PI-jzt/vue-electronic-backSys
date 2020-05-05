import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)


Vue.component('tree-table', ZkTable)
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
  render: h => h(App)
}).$mount('#app')

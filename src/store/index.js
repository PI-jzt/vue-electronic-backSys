import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	tableData:[
					{
						id:0,
						value:'的味道哇大大我打',
						ifComplete:false
					},
					{
						id:1,
						value:'dawdwadadaw',
						ifComplete:false
					},
					{
						id:2,
						value:'我完成了',
						ifComplete:true
					}
				]
  },
  mutations: {
  	addData(state, val){
  		state.tableData.push(val)
  	},
  	deleteData(state, val){
  		state.tableData.forEach((item, index) => {
  			if(item.id === val){
  				state.tableData.splice(index, 1)
  			}
  		})
  	},
  	deleteSeletedData(state, val){
  			val.forEach(value => {
						state.tableData.forEach((item, index) => {
							if(value.id === item.id){
								return state.tableData.splice(index, 1)
							}
						})
					})
  	}
  },
  actions: {
  	queryString(state, value){
  		const arrayList = []
 			window.setTimeout(function(){
  				state.state.tableData.forEach(item => {
  					if(item.value.indexOf(value) !== -1){
  						const objectString = { value:item.value }
  						arrayList.push(objectString)
  					}
  				})
  			}, 1000 * Math.random())
  		return arrayList
  	}
  	
  },
  modules: {
  },
  getters: {
  	
  }
  
})

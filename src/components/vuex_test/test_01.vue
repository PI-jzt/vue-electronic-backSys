<template>
	<div style="margin-left:50%;transform:translateX(-50%);width: 600px;height:600px;">
		<el-row>
			<el-col :span="10">
				<el-autocomplete
				  v-model="inputData"
				  :fetch-suggestions="querySearchAsync"
				  placeholder="请输入内容"
				  @select="handleSelect"
				></el-autocomplete>
			</el-col>
			<el-col :span='14'>
				<el-button type='primary' @click='addThings'>添加事项</el-button>
			</el-col>
		</el-row>
		 <el-table
    :data="valueList"
    border
    @selection-change="handleSelectionChange"
	>
    <el-table-column
      fixed
      type='selection'>
    </el-table-column>
    <el-table-column
      prop="value"
      label="输入数据">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
     >
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  	   <div >
		<el-row>
			<el-col :span='4'>{{total}}条剩余</el-col>
			<el-col :span='16'>
				<el-radio-group v-model='radioValue' @change='getChangeData'>
			      <el-radio-button label="全部"></el-radio-button>
			      <el-radio-button label="未完成"></el-radio-button>
			      <el-radio-button label="已完成"></el-radio-button>
			    </el-radio-group>
			</el-col>
			<el-col :span='4'>
				<el-button @click="clear" type="text" size="small">删除</el-button>
			</el-col>
		</el-row>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				inputData:'',
				valueList:this.$store.state.tableData,
				total:this.$store.state.tableData.length,
				radioValue:'全部',
				selectDeleteDatas:[],
				loading:[{
					value:'暂无建议!'
				}]
			}
		},
		created(){
		},
		methods:{
			async querySearchAsync(queryString, cb){
				queryString = queryString.replace(/(^\s*)|(\s*$)/g, '')
				if(queryString !== ''){
					const returnValue = await this.$store.dispatch('queryString', queryString)
					cb(returnValue)
				}else{
					cb(this.loading)
				}
			},
			handleSelect(val){
				console.log(val)
			},
			handleClick(val){
				this.$store.commit('deleteData', val.id)
			},
			handleSelectionChange(val){
				this.selectDeleteDatas = val
			},
			clear(){
				if(this.selectDeleteDatas.length !== 0){
					this.$store.commit('deleteSeletedData', this.selectDeleteDatas)
				}
			},
			addThings(){
				const newData = {}
				newData.id = this.$store.state.tableData.length
				newData.value = this.inputData
				newData.ifComplete = false
				this.$store.commit('addData', newData)
				this.inputData = ''
			},
			getChangeData(val){
				if(val === '全部'){
					this.valueList = this.$store.state.tableData
				}else if(val === '未完成'){
					const undoneData = []
					this.$store.state.tableData.forEach(val => {
						if(!val.ifComplete){
							undoneData.push(val)
						}
					})
					this.valueList = undoneData
				}else{
					const undoneData = []
					this.$store.state.tableData.forEach(val => {
						if(val.ifComplete){
							undoneData.push(val)
						}
					})
					this.valueList = undoneData
				}
				this.total = this.valueList.length 
			}
		}
	}
</script>

<style lang="less" scoped>
</style>

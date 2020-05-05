<template>
	<div>
		<el-alert
		    title="只允许为第三级分类设置相关参数!"
		    type="warning"
		    show-icon>
		  </el-alert>
		  <!--<el-form   label-width="120px">
		   <el-form-item label="" >-->
		   	选择商品分类:
			<el-cascader
					    v-model="value"
					    :options="options"
					    @change="handleChange"
					    :props="props"
					    clearable
					    >
			</el-cascader>
		<!--</el-form-item>
		</el-form>-->
		<el-tabs v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="动态参数" name="many">
		    	<el-button type="primary" size='small' @click="addGoodsParams">添加参数</el-button>
		    	<el-table
				    :data="performanceParamsList"				
				    style="width: 100%">
				    <el-table-column type="expand" >
						    <template slot-scope="props">
						     	<el-tag
								  :key="index"
								  v-for="(item,index) in props.row.attr_vals"
								  closable
								  :disable-transitions="false"
								  @close="tagsHandleClose(props.row, item)">
								  {{item}}
								</el-tag>
								<el-input
								  class="input-new-tag"
								  v-if="props.row.inputVisible"
								  v-model="props.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(props)"
								  @blur="handleInputConfirm(props)"
								>
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="addAttrVals(props.row)">+ New Tag</el-button>
						      </template>
				    </el-table-column>
				   <el-table-column
				          	label="#"
					      type="index"
					      width="50">
					   	 </el-table-column>
				    <el-table-column
				      label="参数名称"
				      prop="attr_name">
				    </el-table-column>
				    <el-table-column
				      label="操作"
				     >
				     	<template slot-scope='scope'>
				     		<el-button
				     			icon="el-icon-edit"
						          size="mini"
						          type="primary"
						          @click="handleEdit(scope.row)">修改</el-button>
						        <el-button
						          size="mini"
						          type="danger"
						          icon="el-icon-danger"
						          @click="handleDelete(scope.row)">删除</el-button>
				     	</template>
				    </el-table-column>
				  </el-table>
		    </el-tab-pane>
		    <el-tab-pane label="静态参数" name="only">
		    	<el-button type="primary" size='small' @click="addGoodsParams('only')">添加参数</el-button>
		    	<el-table
				    :data="performanceParamsList"				
				    style="width: 100%">
				    <el-table-column type="expand" >
						    <template slot-scope="props">
						     	<el-tag
								  :key="index"
								  v-for="(item,index) in props.row.attr_vals"
								  closable
								  :disable-transitions="false"
								  @close="tagsHandleClose(props.row, item)">
								  {{item}}
								</el-tag>
								<el-input
								  class="input-new-tag"
								  v-if="props.row.inputVisible"
								  v-model="props.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(props)"
								  @blur="handleInputConfirm(props)"
								>
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="addAttrVals(props.row)">+ New Tag</el-button>
						      </template>
				    </el-table-column>
				   <el-table-column
				          	label="#"
					      type="index"
					      width="50">
					   	 </el-table-column>
				    <el-table-column
				      label="参数名称"
				      prop="attr_name">
				    </el-table-column>
				    <el-table-column
				      label="操作"
				     >
				     	<template slot-scope='scope'>
				     		<el-button
				     			icon="el-icon-edit"
						          size="mini"
						          type="primary"
						          @click="handleEdit(scope.row)">修改</el-button>
						        <el-button
						          size="mini"
						          type="danger"
						          icon="el-icon-danger"
						          @click="handleDelete(scope.row)">删除</el-button>
				     	</template>
				    </el-table-column>
				  </el-table>
		    </el-tab-pane>
		  </el-tabs>
		<!--
        	作者：offline
        	时间：2020-05-02
        	描述：添加分类参数对话框
        -->
	    <el-dialog
		  :title="title"
		  :visible.sync="classisfyParamsDialog"
		  width="30%"
		  :before-close="handleDialogClose">
		  <el-form :rules='rules' ref="classifyParamsRef" :model="classifyParams" label-width="80px">
		  	 <el-form-item label="动态参数" prop='attr_name'>
			    <el-input v-model="classifyParams.attr_name"></el-input>
			  </el-form-item>
		  </el-form>  
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="handleDialogClose">取 消</el-button>
		    <el-button type="primary" @click="saveClassifyParams">确 定</el-button>
		  </span>
		</el-dialog>
		<!--
        	作者：offline
        	时间：2020-05-02
        	描述：修改分类参数对话框
        -->
	    <el-dialog
		  :title="title"
		  :visible.sync="editClassisfyParamsDialog"
		  width="30%"
		  :before-close="handleEditDialogClose">
		  <el-form :rules='rules' ref="editClassifyParamsRef" :model="editClassifyParams" label-width="80px">
		  	 <el-form-item label="动态参数" prop='attr_name'>
			    <el-input v-model="editClassifyParams.attr_name"></el-input>
			  </el-form-item>
		  </el-form>  
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="handleEditDialogClose">取 消</el-button>
		    <el-button type="primary" @click="saveEditClassifyParams">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	 export default{
	 	data(){
	 		return{
	 			value:'',
	 			options:[],
	 			props:{
	 				expandTrigger:'hover',
	 				value:'cat_id',
					label:'cat_name',
					children:'children'
	 			},
	 			activeName:'many',
	 			paramsId:'',
	 			//动态参数列表
	 			performanceParamsList:[],
	 			classisfyParamsDialog:false,
	 			editClassisfyParamsDialog:false,
	 			classifyParams:{
	 				attr_name:'',
	 				attr_sel:''
	 			},
	 			editClassifyParams:{
	 				attr_id:0,
	 				cat_id:0,
	 				attr_name:'',
	 				attr_sel:''
	 			},
	 			rules:{
	 				attr_name:[
	 					{ required:true, message:'该名称不能为空!', trriger:'blur' },
	 					{ min:2, max:6, message:'字符长度在2~6之间', trriger:'blur' }
	 				]
	 			},
	 			title:'',
	 			dialogDistinguish:'many'
	 		}
	 	},
	 	created(){
	 		this.getGoodsClassifyList()
	 	},
	 	methods:{
	 		//保证用户选择第三级商品分类
	 		handleChange(val){
	 				this.performanceParamsList = []
	 				if(val.length !== 0){
		 				if(val.length < 3) {
		 				this.value = ''
		 				return this.$message.error('请选择第三级商品分类!')
		 				}
		 				this.paramsId = val[2]
		 				this.getGoodsParameterData(this.paramsId)
		 			}
	 		},
	 		handleClick(tab, event){
	 			if(this.paramsId !== ''){
	 				this.dialogDistinguish = tab.name
	 				this.getGoodsParameterData(this.paramsId)
	 			}else{
	 				this.$message.error('请选择上方的第三级商品分类!')
	 			}	
	 		},
	 		//获取分类数据
	 		async getGoodsClassifyList(){
	 			const { data : dt } = await this.$http.get('categories', { params:{ type:3 } })
				if(dt.meta.status !== 200) return this.$message.error('获取三级商品分类列表数据失败')
				this.options = dt.data
	 		},
	 		handleEdit(props){
	 			this.editClassisfyParamsDialog = true
	 			this.editClassifyParams = props
	 		},
	 		async handleDelete(props){
	 			const val = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
	 				 confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			     })
	 			if(val === 'confirm'){
		 			const { data:dt } = await this.$http.delete(`categories/${props.cat_id}/attributes/${props.attr_id}`)
		 			if(dt.meta.status !== 200){ this.$message.error('刪除参数失敗!') }
		 			this.getGoodsParameterData(this.paramsId)
		 			this.$message.success('刪除属性成功!')
	 			}
	 		},
	 		//删除分类属性tag
	 		async tagsHandleClose(scope, val){
	 			const newAttrVals = scope.attr_vals.join(',')
	 			const index = scope.attr_vals.indexOf(val)
	 			if(index !== -1){
		 			const { data:dts } = await this.$http.put(`categories/${scope.cat_id}/attributes/${scope.attr_id}`, { attr_name:scope.attr_name, attr_sel:scope.attr_sel, attr_vals:newAttrVals })
		 			if(dts.meta.status !== 200) { return this.$message.error('删除该分类参数失败!') }
		 			scope.attr_vals.splice(index, 1)
	 				this.$message.success('删除该分类参数成功!')
	 			}
	 		},
	 		//修改tag的input状态标识
	 	    addAttrVals(props){
	 			props.inputVisible = true
	 			this.$nextTick(_ => {
			          this.$refs.saveTagInput.$refs.input.focus()
			        })
	 		},
	 		//添加分类属性tabs
	 		async handleInputConfirm(props){
	 			const inputValue = props.row.inputValue
	 			if(inputValue){
	 			 	const { data:dt } = await this.$http.get(`categories/${props.row.cat_id}/attributes/${props.row.attr_id}`, { params:{ attr_sel:'many' } })
			     	dt.data.attr_vals = dt.data.attr_vals + ',' + inputValue
			     	const { data : result } = await this.$http.put(`categories/${props.row.cat_id}/attributes/${props.row.attr_id}`, dt.data)
			     	if(result.meta.status !== 200) return this.$message.error('添加分类属性失败!')	
			     	props.row.attr_vals.push(inputValue)
			     	this.$message.success('添加该分类属性成功!')
			     	props.row.inputVisible = false
			     	props.row.inputValue = ''
	 			}
	 		},
	 		//打开添加动态/静态参数对话框
	 		addGoodsParams(){
	 			if(this.dialogDistinguish === 'many'){
	 				this.title = '添加动态参数'
	 				this.classifyParams.attr_sel = 'many'
	 			}else{
	 				this.title = '添加静态参数'
	 				this.classifyParams.attr_sel = 'only'
	 			}
	 			this.classisfyParamsDialog = true
	 		},
	 		//关闭添加动态/静态参数对话框
	 		handleDialogClose(){
	 			this.$refs.classifyParamsRef.resetFields()
	 			this.attr_sel = ''
	 			this.classisfyParamsDialog = false
	 		},
	 		//关闭修改动态/静态参数对话框
	 		handleEditDialogClose(){
	 			this.$refs.editClassifyParamsRef.resetFields()
	 			this.attr_sel = ''
	 			this.editClassisfyParamsDialog = false
	 		},
	 		//获取商品参数数据列表
	 		async getGoodsParameterData(id){
	 			const { data:dt } = await this.$http.get(`categories/${id}/attributes`, { params:{ sel:this.dialogDistinguish } })
	 			if(dt.meta.status !== 200) return this.$message.error('获取动态参数信息出错!')
	 			 dt.data.forEach(val => {
		 			if(val.attr_vals !== '') {
		 				val.attr_vals = val.attr_vals.split(',')
		 			}else{
		 				val.attr_vals = []
		 			} 
		 			val.inputVisible = false
		 			val.inputValue = ''
	 			})
	 			this.performanceParamsList = dt.data
	 		},
	 		//提交添加动态参数或者静态参数
	 		 saveClassifyParams(){
	 			this.$refs.classifyParamsRef.validate(async val => { 
	 					if(this.paramsId !== ''){ 
		 				const { data:dt } = await this.$http.post(`categories/${this.paramsId}/attributes`, this.classifyParams)
		 				if(dt.meta.status !== 201) return this.$message.error('添加动态参数失败!')
		 				this.getGoodsParameterData(this.paramsId)
		 				this.handleDialogClose()
		 				this.$message.success('添加动态参数成功!')
		 			}else{
		 				this.$message.error('请选择上方的商品分类!')  
		 			}
	 			})
	 		},
	 		//修改參數
	 		 saveEditClassifyParams(props){
	 			this.$refs.editClassifyParamsRef.validate(async val => { 
	 				if(this.paramsId !== ''){ 
						delete this.editClassifyParams.attr_vals
		 				const { data:dt } = await this.$http.put(`categories/${this.editClassifyParams.cat_id}/attributes/${this.editClassifyParams.attr_id}`, this.editClassifyParams)
		 				if(dt.meta.status !== 200) { return this.$message.error('修改参数失败!') }
		 				this.getGoodsParameterData(this.paramsId)
		 				this.handleEditDialogClose()
		 				this.$message.success('修改动态参数成功!')
		 			}else{
		 				this.$message.error('请选择上方的商品分类!')  
		 			}
	 			})
	 		}
	 	}
	 	/*watch:{
	 		async paramsId(val){
	 			this.getGoodsParameterData(val)
	 		}
	 	}*/
	 }
</script>

<style lang='less' scoped>
.el-tag{
	margin-right:  60px;
	margin-bottom: 20px;
}
.input-new-tag{
	width:90px
}
</style>

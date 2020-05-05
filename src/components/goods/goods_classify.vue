<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<el-row>
			<el-col>
				<el-button type="primary" @click='putAddGoodClassifyDialog'>添加分类</el-button>
			</el-col>
		</el-row>
		<tree-table :expand-type='false' :data='goodsClassifyList' :columns='listColumns' border :show-index='true' index-text='#' :selection-type='false'>
			<template slot='catDeleted' slot-scope='slot'>
					<i v-if="slot.row.cat_deleted === true" class="el-icon-error" style='color: red;'></i>
					<i v-else class="el-icon-success" style='color: lightgreen;'></i>
			</template>
			<template slot='catLevel' slot-scope='scope'>
					<el-tag v-if='scope.row.cat_level === 0'>一级</el-tag>
					<el-tag v-else-if='scope.row.cat_level === 1' type="success">二级</el-tag>
					<el-tag v-else-if='scope.row.cat_level === 2' type="info">三级</el-tag>
			</template>
			<template slot='handle' slot-scope='scope'>
				<el-button type="primary" icon="el-icon-edit" @click='editGoodsClassifyName(scope.row)'>编辑</el-button>
				<el-button type="danger" icon="el-icon-delete" @click='deleteGoodsClassify(scope.row.cat_id)'>删除</el-button>
			</template>
		</tree-table>
		<!--
        	作者：offline
        	时间：2020-05-02
        	描述：分页模块
        -->
		<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="goodsClassifyListParams.pagenum"
		      :page-sizes="[3, 5, 10, 20]"
		      :page-size="goodsClassifyListParams.pagesize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total"
		      clearable
		      size='small'
		      >
	    </el-pagination>
	    <!--
        	作者：offline
        	时间：2020-05-02
        	描述：添加商品分类对话框
        -->
	    <el-dialog
		  title="添加商品分类"
		  :visible.sync="addGoodClassify"
		  width="30%"
		  :before-close="handleClose">
		  <el-form :rules='rules' ref="addGoodsClassifyRef" :model="goodsClassigyAddParams" label-width="80px">
		  	 <el-form-item label="分类名称" prop='cat_name'>
			    <el-input v-model="goodsClassigyAddParams.cat_name"></el-input>
			  </el-form-item>
			  <el-form-item label="父级分类" >
			  <el-cascader
					    v-model="value"
					    :options="options"
					    @change="handleChange"
					    :props="props"
					    clearable
					    change-on-select
					    >
			  </el-cascader>
			  </el-form-item>
		  </el-form>  
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="handleClose">取 消</el-button>
		    <el-button type="primary" @click="commitAddGoodsClassify">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!--
        	作者：offline
        	时间：2020-05-02
        	描述：编辑商品分类信息
        -->
		 <el-dialog
		  title="修改商品分类"
		  :visible.sync="editGoodClassify"
		  width="50%"
			>
		  <el-form :rules='rules' ref="editGoodsClassifyRef" :model="editParams" label-width="80px">
		  	 <el-form-item label="分类名称" prop='cat_name'>
			    <el-input v-model="editParams.cat_name"></el-input>
			  </el-form-item>
		  </el-form>  
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editGoodClassify = false">取 消</el-button>
		    <el-button type="primary" @click="commitEditHandle">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data (){
			return {
				goodsClassifyListParams:{
					query:3,
					pagenum:1,
					pagesize:5
				},
				total:0,
				goodsClassifyList:[],
				//添加商品分类对话框标识
				addGoodClassify:false,
				editGoodClassify:false,
				editParams:{
					id:'',
					cat_name:''
				},
				listColumns:[
					{
						label:'分类名称',
						prop:'cat_name'
					},
					{
						label:'是否有效',
						prop:'cat_deleted',
						type:'template',
						template:'catDeleted'
					},
					{
						label:'排序',
						prop:'cat_level',
						type:'template',
						template:'catLevel'
					},
					{
						label:'操作',
						prop:'',
						type:'template',
						template:'handle'
					}
				],
				goodsClassigyAddParams:{
					cat_name:'',
					cat_level:0,
					cat_pid:0
				},
				rules:{
					cat_name:[
						{ required:true, message: '请输入商品名称', triiger:'blur' },
						{ min:2, max:5, message:'长度保持在2~5之间', triiger:'blur' }
					]
					
				},
				props:{
					expandTrigger:'hover',
					value:'cat_id',
					label:'cat_name',
					children:'children'
				},
				value:'',
				options:[]
			}
		},
		created(){
			this.getGoodsClassifyList()
		},
		methods:{
			async getGoodsClassifyList(){
				const { data:dt } = await this.$http.get('categories', { params:this.goodsClassifyListParams })
				if(dt.meta.status !== 200) return this.$message.error('获取商品分类列表失败!')
				this.goodsClassifyList = dt.data.result
				this.total = dt.data.total
			},
			handleSizeChange(val){
				this.goodsClassifyListParams.pagesize = val
				this.getGoodsClassifyList()
			},
			handleCurrentChange(val){
				this.goodsClassifyListParams.pagenum = val
				this.getGoodsClassifyList()
			},
			//关闭商品分类对话框回调
			handleClose(){
				this.$refs.addGoodsClassifyRef.resetFields()
				this.value = ''
				this.cat_level = 0
				this.cat_pid = 0
				this.addGoodClassify = false
			},
			//打开添加商品分类对话框
			async putAddGoodClassifyDialog(){
				const { data : dt } = await this.$http.get('categories', { params:{ type:2 } })
				if(dt.meta.status !== 200) return this.$message.error('获取父级分类列表失败')
				this.options = dt.data
				console.log(dt)
				this.addGoodClassify = true
			},
			 handleChange(val){
				if(val.length === 1){
					this.goodsClassigyAddParams.cat_level = 1
					this.goodsClassigyAddParams.cat_pid = val[0]
				}else if(val.length === 2){
					this.goodsClassigyAddParams.cat_level = 2
					this.goodsClassigyAddParams.cat_pid = val[1]
				}
			},
			 commitAddGoodsClassify(){
				 this.$refs.addGoodsClassifyRef.validate(async valid => {
				 	if(valid){
				 		const { data: dt } = await this.$http.post('categories', this.goodsClassigyAddParams)
						if(dt.meta.status !== 201) return this.$message.error('添加商品分类信息失败!')
						this.getGoodsClassifyList()
						this.handleClose()
						this.$message.success('添加商品分类成功！')
				 	}else{
				 		this.$message.error('请输入正确的商品分类名!')
				 	}
				})
			},
			 commitEditHandle(){
				this.$refs.editGoodsClassifyRef.validate(async valid => {
				 		if(valid){
							const { data : dt } = await this.$http.put(`categories/${this.editParams.id}`, this.editParams)
							if(dt.meta.status !== 200) return this.$message.error('编辑商品分类信息失败')
							this.getGoodsClassifyList()
							this.editGoodClassify = false
							this.$message.success('编辑商品分类名称成功！')
						}else{
							this.$message.error('请输入正确的商品分类名称!')
						}
				})
			},
			editGoodsClassifyName(id){
					this.editParams.id = id.cat_id
					this.editParams.cat_name = id.cat_name
					this.editGoodClassify = true
			},
			async deleteGoodsClassify(id){
				const dt = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		      	 }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消删除'
			          })       
			       })
				if(dt === 'confirm'){
					const { data : dt } = await this.$http.delete(`categories/${id}`)
					if(dt.meta.status !== 200) return this.$message.error('删除商品分类失败！')
					this.getGoodsClassifyList()
					this.$message.success('删除商品分类成功！')
				}
			}
		}
	}
</script>

<style lang='less' scoped="scoped">
.el-row{
	margin-top: 30px;
}
.el-cascader{
	width:100%
}
</style>

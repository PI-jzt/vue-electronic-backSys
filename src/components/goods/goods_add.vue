<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
		  <el-breadcrumb-item>商品添加</el-breadcrumb-item>  
		</el-breadcrumb>
		<el-card class="box-card">
				<el-alert
				    title="添加商品信息"
				    center
				    type="info"
				    :closable='false'
				    show-icon>
			  </el-alert>
			  <el-steps :active="active" finish-status="success"  align-center>
				  <el-step title="基本信息"></el-step>
				  <el-step title="商品参数"></el-step>
				  <el-step title="商品属性"></el-step>
				  <el-step title="商品图片"></el-step>
				  <el-step title="商品内容"></el-step>
				  <el-step title="完成"></el-step>
				</el-steps>
			  <el-form ref="goodsBaseAttributeRef" :label-position="labelPosition" :rules='goodsBaseAttributeRules' :model="goodsBaseAttribute" label-width="80px">
			  <el-tabs :tab-position="tabPosition"  @tab-click="tabClick">
			    <el-tab-pane label="基本信息">
			    		<el-form-item label="商品名称" prop='goods_name'>
						    <el-input v-model="goodsBaseAttribute.goods_name"></el-input>
						  </el-form-item>
			    		<el-form-item label="商品价格" prop='goods_price'>
						    <el-input v-model="goodsBaseAttribute.goods_price"></el-input>
						 </el-form-item>			   	    	
			    		<el-form-item label="商品数量" prop='goods_number'>
						    <el-input v-model="goodsBaseAttribute.goods_number"></el-input>
				    	</el-form-item>
			    		<el-form-item label="商品重量" prop='goods_weight'>
						    <el-input v-model="goodsBaseAttribute.goods_weight"></el-input>
						</el-form-item>
						<el-form-item label="商品分类" prop='goods_cat'>
						   <el-cascader
							    v-model="goodsBaseAttribute.goods_cat"
							    :options="goodsClassifyList"
							    :props="props"
							    clearable
							    filterable
							    @change="handleChange"></el-cascader>
						</el-form-item>
			    </el-tab-pane>
			    <el-tab-pane label="商品参数">
			    	<el-form-item :key='item.attr_id' v-for='item in paramsList.performanceParams'  :label="item.attr_name" >
			    		<el-checkbox-group v-model="goodsBaseAttribute.checkoutAttrs" @change='checkboxList(item.attr_id)'>
			    			<el-checkbox  :key='index' border v-for='(item2,index) in item.attr_vals' :label='item2'></el-checkbox>
			    		</el-checkbox-group>   
					</el-form-item>   
			    </el-tab-pane> 
			    <el-tab-pane label="商品属性">
			    	<el-form-item :key='item.attr_id' v-for='item in paramsList.staticParams'  :label="item.attr_name">
						    <el-input v-model='item.attr_vals' ></el-input>
					</el-form-item>
			    </el-tab-pane>
			    <el-tab-pane label="商品图片">
			    	<el-upload
						  :action="action"
						  :on-preview="handlePreview"
						  :on-remove="handleRemove"
						  :headers='headers'
						  :on-success='handleSuccessRespone'
						  list-type="picture">
						  <el-button size="small" type="primary">点击上传</el-button>
						  <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
						</el-upload>
			    </el-tab-pane>
			    <el-tab-pane label="商品内容">
			    	<quill-editor
					    v-model="goodsBaseAttribute.goods_introduce"
					  />
					  <el-button  class='addButton' type="primary" @click='addGoods' >点击添加</el-button>
			    </el-tab-pane>
			  </el-tabs>
			  </el-form>
			  <!--
              	作者：offline
              	时间：2020-05-04
              	描述：图片略缩图弹框
              -->
              <el-dialog :visible.sync="dialogVisible">
				  <img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
		</el-card>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				action:'http://127.0.0.1:8888/api/private/v1/upload',
				active:0,
				tabPosition:'left',
				labelPosition:'top',
				//分类Id
				sortingId:0,
				goodsBaseAttribute:{
					goods_name:'',
					goods_price:0,
					goods_number:0,
					goods_weight:0,
					goods_cat:'',
					checkoutAttrs:[],
					attrs:[],
					goods_introduce:'',
					pics:[]
				},
				paramsList:{
					performanceParams:[],
					staticParams:[]
				},
				goodsBaseAttributeRules:{
					goods_name:[
						{ required:true, message:'请输入商品名称', trriger:'blur' }	
					],
					goods_price:[
						{ required:true, message:'请输入商品价格', trriger:'blur' }
						/*,{ type: 'number', message: '价格必须为数字值', trriger:'blur' }*/
					],
					goods_number:[
						{ required:true, message:'请输入商品数量', trriger:'blur' }
						/*,{ type: 'number', message: '价格必须为数字值', trriger:'blur' }*/
					],
					goods_weight:[
						{ required:true, message:'请输入商品重量', trriger:'blur' }
						/*,{ type: 'number', message: '价格必须为数字值', trriger:'blur' }*/
					],
					goods_cat:[
						{ required:true, message:'请输入商品分类', trriger:'blur' }
					]
				},
				//商品分类列表
				props:{
					expandTrigger:'hover',
					value:'cat_id',
					label:'cat_name',
					children:'children'
				},
				goodsClassifyList:[],
				//分类商品参数列表
				sortingGoodsParamsList:[],
				//文件上传属性
				headers:{
					Authorization:window.sessionStorage.getItem('token')
				},
				dialogImageUrl:'',
				dialogVisible : false
			}
		},
		created(){
			this.getGoodsClassifyList()
		},
		methods:{
			//tabs点击时步骤条选择效果
			tabClick(targetName){
				this.active = Number(targetName.index)
				if(targetName.index !== '0' && this.sortingId === 0){
					this.paramsList.performanceParams = []
					this.paramsList.staticParams = []
					return this.$message.error('请选择分类商品!') 
				} else if(targetName.index === '1'){
					this.getSortingParameter()
				} else if(targetName.index === '2'){
					this.getStaticParamter()
				}
			},
			async getGoodsClassifyList(){
				const { data:dt } = await this.$http.get('categories')
				if(dt.meta.status !== 200) { return this.$message.error('获取商品分类信息错误!') }
				this.goodsClassifyList = dt.data
			},
			handleChange(val){
				if(val.length !== 0){
		 				if(val.length < 3) {
			 				this.goodsBaseAttribute.goods_cat = ''
			 				return this.$message.error('请选择第三级商品分类!')
		 				}
		 				this.sortingId = Number(val[2])
		 				this.goodsBaseAttribute.goods_cat = val.join(',')
		 		}else{
		 			this.sortingId = 0
		 			this.goodsBaseAttribute.goods_cat = ''
		 		}
			},
			async getSortingParameter(){	
					const { data:dt } = await this.$http.get(`categories/${this.sortingId}/attributes`, { params:{ sel:'many' } })
					if(dt.meta.status !== 200){ return this.$message.error('获取动态分类信息失败!') } 
					dt.data.forEach(val => {
						if(val.attr_vals !== ''){
							val.attr_vals = val.attr_vals.split(',')
						}else{
							val.attr_vals = []
						}
					})
					this.paramsList.performanceParams = dt.data
			},
			async getStaticParamter(){
					const { data:dt2 } = await this.$http.get(`categories/${this.sortingId}/attributes`, { params:{ sel:'only' } })
					if(dt2.meta.status !== 200){ return this.$message.error('获取静态信息失败!') }
					this.paramsList.staticParams = dt2.data
			},
			//预览上传图片
			handlePreview(val){
				const imgUrl = val.url
				this.dialogImageUrl = imgUrl
				this.dialogVisible = true
			},
			//移出上传图片
			handleRemove(val){
				const pics = this.goodsBaseAttribute.pics
				this.goodsBaseAttribute.pics.forEach((item, index) => {
					if(item.pic === val.response.data.tmp_path){
						pics.splice(index, 1)
					}
				})
			},
			//上传图片成功后的响应
			handleSuccessRespone(res){
				const picinfo = { pic:res.data.tmp_path }
				this.goodsBaseAttribute.pics.push(picinfo)
			},
			//提交添加图片的请求
			 addGoods(){
				this.$refs.goodsBaseAttributeRef.validate(async val => {
					if(val){
						this.paramsList.staticParams.forEach(val => {
							const staticList = { attr_id:val.attr_id, attr_value:val.attr_vals	}
							this.goodsBaseAttribute.attrs.push(staticList)
						})
						const { data:dt } = await this.$http.post('goods', this.goodsBaseAttribute)
						if(dt.meta.status !== 201) { return this.$message.error('添加商品错误!') }
						this.$message.success('添加商品成功!')
						this.$router.push('/goods')
					}
				})
			},
			checkboxList(val){
				this.goodsBaseAttribute.attrs = []
				if(this.goodsBaseAttribute.checkoutAttrs.length !== 0){
					this.goodsBaseAttribute.checkoutAttrs.forEach(item => { 
						const newArray = { attr_id:val, attr_value:item }
						this.goodsBaseAttribute.attrs.push(newArray)
					})
				}
			}
		}
	}
</script>

<style lang='less' scoped>
.el-tabs__item {
	margin-top: 20px;
	margin-bottom: 20px;
}
.addButton{
	margin-top: 20px;
}
</style>

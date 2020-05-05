<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
				<el-row>
					<el-col :span='8'>
						<el-input clearable placeholder="请输入内容" v-model="getGoodsListParams.query" class="input-with-select">
						    <el-button slot="append" icon="el-icon-search" @click='getGoodsList()'></el-button>  
						 </el-input>			
					</el-col>
					<el-col :span='4'></el-col>
					<el-col :span='12'>	
						<el-button type="primary" @click='addGoods'>添加商品</el-button>
					</el-col>
				</el-row>
		</el-card>	
		<el-table
		    :data="goodslist"
		    border
		    style="width: 100%">
		   <el-table-column
		      type='index'
		      label="#"
			>
		    </el-table-column>
		    <el-table-column
		      prop="goods_name"
		      label="商品名称"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="goods_price"
		      label="商品价格(元)"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="goods_weight"
		      label="商品重量"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="add_time"
		      label="创建时间"
		    >
		    	<template slot-scope='scope'>
		    		{{ scope.row.add_time | formatDate }}
		    	</template>
		    </el-table-column>
		    <el-table-column
		      label="操作">
		      	<template slot-scope='scope'>
		      		<el-button
				          size="mini"
				          icon='el-icon-edit'
				          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				     <el-button
				          size="mini"
				          type="danger"
				          icon='el-icon-delete'
				      @click="handleDelete(scope.row)">删除</el-button>
		      	</template>
		    </el-table-column>
		  </el-table>
		  <!--
          	作者：offline
          	时间：2020-05-04
          	描述：分页功能
          -->
		  <el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="getGoodsListParams.pagenum"
	      :page-sizes="[3, 5, 10, 20]"
	      :page-size="getGoodsListParams.pagenum"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="total">
	    </el-pagination>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				getGoodsListParams:{
					query:'',
					pagenum:1,
					pagesize:3
				},
				total:0,
				goodslist:[]
			}
		},
		created(){
			this.getGoodsList()
		},
		methods:{
			//添加商品
			addGoods(){
				this.$router.push('/goods/add')
			},
			//获取商品列表数据
			async getGoodsList(){
				const { data:dt } = await this.$http.get('goods', { params:this.getGoodsListParams })
				if(dt.meta.status !== 200) { return this.$message.error('获取商品列表出错!') }
				this.total = dt.data.total
				this.goodslist = dt.data.goods
			},
			//删除商品
			async handleDelete(val){
				const value = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).catch(_ => {
			        	this.$message({
			        		type:'info',
			        		message:'已取消删除'
			        	})
			        })
			     if(value === 'confirm') {
			     	const { data:dt } = await this.$http.delete(`goods/${val.goods_id}`)
			     	if(dt.meta.status !== 200) { return this.$message.error('删除商品失败!') }
			     	this.getGoodsList()
			     	this.$message.success('删除该商品成功!')
			     }
			},
			//修改商品
			handleEdit(){},
			handleSizeChange(val){
				this.getGoodsListParams.pagesize = val
				this.getGoodsList()
			},
			handleCurrentChange(val){
				this.getGoodsListParams.pagenum = val
				this.getGoodsList()
			}
			
		}
	}
</script>

<style lang='less' scoped>
.el-card{
	margin-top: 20px;
}
</style>

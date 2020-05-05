<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
		  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card >
			<el-row>
				<el-col :span='10'>
					<el-input clearable placeholder="请输入内容" v-model="orderListParams.query" >
						<el-button slot="append" icon="el-icon-search"  @click='getorderList'></el-button>  
					</el-input>
				</el-col>
				<el-col :span='14'>
					
				</el-col>
			</el-row>
			<el-table
		    :data="orderList"
		    border
		    style="width: 100%">
		   <el-table-column
		      type='index'
		      label="#"
			>
		    </el-table-column>
		    <el-table-column
		      prop="order_number"
		      label="订单编号"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="order_price"
		      label="订单价格"
		    >
		    </el-table-column>
		    <el-table-column
		      label="是否付款"
		    >
		    	<template slot-scope='scope'>
		    		<el-tag v-if='scope.row.order_pay === "1"' type="success">已付款</el-tag>
		    		<el-tag v-else-if='scope.row.order_pay === "0"' type="danger">未付款</el-tag>
		    	</template>
		    </el-table-column>
		     <el-table-column
		      prop="is_send"
		      label="是否发货"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="add_time"
		      label="下单时间"
		    >
		    	<template slot-scope='scope'>
		    		{{ scope.row.create_time | formatDate }}
		    	</template>
		    </el-table-column>
		    <el-table-column
		    	width='250'
		      label="操作">
		      	<template slot-scope='scope'>
		      		<el-button
				          size="mini"
				          icon='el-icon-edit'
				          @click="dialogVisible = true">编辑</el-button>
				     <el-button
				          size="mini"
				          type="danger"
				          icon='el-icon-truck'
				      @click="getCurrentPlace(scope.row)">物流情况</el-button>
		      	</template>
		    </el-table-column>
		  </el-table>
		  <!--
          	作者：offline
          	时间：2020-05-05
          	描述：订单列表分页
          -->
		  <el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="orderListParams.pagenum"
		      :page-sizes="[3, 5, 10, 20]"
		      :page-size="orderListParams.pagesize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total">
		    </el-pagination>
		</el-card>
		<!--
        	作者：offline
        	时间：2020-05-05
        	描述：省市级联动
        -->
		<el-dialog
		  title="修改地址"
		  :visible.sync="dialogVisible"
		  width="30%"
		 >
		  <el-form ref='provinceCityLinkedRef' :rules='rules' :model='provinceCityLinkedParams'>
			  <el-form-item label="省市区/县" prop='provinceCityLinked'>
			     <el-cascader
			     	clearable
			     	filterable
				    v-model="provinceCityLinkedParams.provinceCityLinked"
				    :options="cityData"
				    :props="props"
				   ></el-cascader>
			  </el-form-item>
			  <el-form-item label="详细地址" prop='address'>
			    <el-input v-model="provinceCityLinkedParams.address"></el-input>
			  </el-form-item>
		  </el-form>
		  <span slot="footer"  >
		    <el-button @click="resetForm">取消</el-button>
		    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		  </span>
		</el-dialog>	
		<!--
        	作者：offline
        	时间：2020-05-05
        	描述：获取订单物流信息
        -->
		<el-dialog
		  title="订单物流情况"
		  :visible.sync="logisticsDialogVisible"
		  width="50%"
		 >
		 <el-timeline>
		    <el-timeline-item :reverse="true" v-for='(item, index) in currentGoodsPlaceList' :key='index' :timestamp="item.ftime + '~' + item.time" placement="top">
		      <el-card>
		        <p>{{ item.context }}</p>
		      </el-card>
		    </el-timeline-item>
		  </el-timeline>
		  <span slot="footer"  >
		    <el-button @click="logisticsDialogVisible = false">取消</el-button>
		    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import cityData from '../../assets/js/citydata.js'
	import logisticsThings from '../../assets/js/logisticsThings.js'
	export default{
		data(){
			return {
				orderListParams:{
					query:'',
					pagenum:1,
					pagesize:3
				},
				provinceCityLinkedParams:{
					provinceCityLinked:'',
					address:''
				},
				cityData,
				orderList:[],
				total:0,
				dialogVisible:false,
				props:{ 
					expandTrigger: 'hover'
				},
				rules:{
					provinceCityLinked:[
						{ required:true, message:'请输入省市区/县!', trigger:'blur' }
					],
					address:[
						{ required:true, message:'请输入详细地址!', trigger:'blur' }
					]
				},
				currentGoodsPlaceList:logisticsThings,
				logisticsDialogVisible:false
				
			}
		},
		created(){
			this.getorderList()
		},
		methods:{
			async getorderList(){
				const { data:dt } = await this.$http.get('orders', { params:this.orderListParams })
				if(dt.meta.status !== 200) { return this.$message.error('获取订单列表数据失败!') }
				this.total = dt.data.total
				this.orderList = dt.data.goods
			},
			handleEdit(){},
			handleDelete(){},
			handleSizeChange(val){
				this.orderListParams.pagesize = val
				this.getorderList()
			},
			handleCurrentChange(val){
				this.orderListParams.pagenum = val
				this.getorderList()
			},
			getorderList2(){
				console.log(1)
			},
			resetForm(){
				this.$refs.provinceCityLinkedRef.resetFields()
			},
			async getCurrentPlace(val){
				/*const { data:dt } = await this.$http.get(`/kuaidi/${val.order_id}`)
				if(dt.meta.status !== 200) { return this.$message.error('获取物流信息失败!') }
				this.currentGoodsPlaceList = dt.data*/
				this.logisticsDialogVisible = true
			}
		}
	}
</script>

<style lang="less" scoped>
</style>

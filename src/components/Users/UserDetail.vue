<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-row :gutter="20">
			  <el-col :span="6">
			  	<el-input placeholder="请输入内容" v-model="ListParams.query" class="input-with-select" @change="search" clearable>
				    <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
				  </el-input>
			  	
			  </el-col>
			  <el-col :span="6">
			  		<el-button type="primary" @click="addUserDialog = true">添加用户</el-button>
			   </el-col>
			  <el-col :span="12">
			   </el-col>
			</el-row>
			
			
		 	<el-table
		 		stripe
			    :data="Users"
			    border
			    style="width: 100%">
			    <el-table-column
			      type="index"
			      width="50">
			    </el-table-column>
			    <el-table-column
			      prop="username"
			      label="用户名称"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="mobile"
			      label="手机号码"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="email"
			      label="邮箱">
			    </el-table-column>
			    <el-table-column
			      prop="role_name"
			      label="角色">
			    </el-table-column>
			    <el-table-column
			      prop="mg_state"
			      label="状态">
			    	  <template slot-scope="scope">
					       <el-switch @change='ChangeStatu(scope.row)'
							  v-model="scope.row.mg_state"
							  active-color="#13ce66"
							  inactive-color="#ff4949">
							</el-switch>
				      </template>
			    </el-table-column>
			    <el-table-column fixed='right' label='操作' width='250'>
			    	<template slot-scope='scope'>
			    		 <el-button type="primary" round @click="userEdit(scope)"  size="mini">编辑</el-button>
      				     <el-button type="warning" round  size="mini" @click='deleteUser(scope.row)'>删除</el-button>
      				      <el-button type="info" round size="mini">分配角色</el-button>
			    	</template>
			    </el-table-column>
			  </el-table>
			  <el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="ListParams.pagenum"
			      :page-sizes="[2, 5, 10, 20]"
			      :page-size="ListParams.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="totalpage">
			  </el-pagination>
		</el-card>
		<!--
        	作者：offline
        	时间：2020-04-04
        	描述：添加用户功能弹出框
        -->
		<el-dialog
			  title="添加用户"
			  :visible.sync="addUserDialog"
			  width="30%"
			  :before-close="handleClose">
			  <el-form label-position="left" label-width="100px" status-icon :model="UserNature" :rules="UserRules" ref="UserNatureRef">
			  	 <el-form-item label="用户名称" prop="username">
				    <el-input v-model="UserNature.username"></el-input>
				  </el-form-item>
				  <el-form-item label="用户密码" prop="password">
				    <el-input type="password" v-model="UserNature.password"></el-input>
				  </el-form-item>
			  	 <el-form-item label="用户邮箱" prop="email">
				    <el-input v-model="UserNature.email"></el-input>
				  </el-form-item>
				  <el-form-item label="用户手机号" prop="mobile">
				    <el-input v-model="UserNature.mobile"></el-input>
				  </el-form-item>
			  </el-form>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="handleClose">取 消</el-button>
			    <el-button type="primary" @click="addUser">确 定</el-button>
			  </span>
			</el-dialog>
			<!--
        	作者：offline
        	时间：2020-04-04
        	描述：修改用户功能弹出框
        -->
		<el-dialog
			  title="修改用户"
			  :visible.sync="editUserDialog"
			  width="30%"
			  >
			  <el-form label-position="left" label-width="100px" status-icon :model="editForm" :rules="editUserRules" ref="editUserNatureRef">
			  	 <el-form-item label="用户名称" >
				    <el-input v-model="editForm.username" disabled='disabled'></el-input>
				  </el-form-item>
			  	 <el-form-item label="用户邮箱" prop="email">
				    <el-input v-model="editForm.email"></el-input>
				  </el-form-item>
				  <el-form-item label="用户手机号" prop="mobile">
				    <el-input v-model="editForm.mobile"></el-input>
				  </el-form-item>
			  </el-form>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="editUserDialog = false">取 消</el-button>
			    <el-button type="primary" @click="editUser">确 定</el-button>
			  </span>
			</el-dialog>
	</div>
</template>

<script>
	export default {
		data () {
			var validataemail = (rule, value, callback) => {
				callback()
			}
			var validatamobile = (rule, value, callback) => {
				callback()
			}
			return {
				ListParams: {
					query:'',
					pagenum: 1,
					pagesize: 2
				},
				Users: [],
				totalpage:0,
				addUserDialog:false,
				editUserDialog:false,
				UserNature: {
					username:'',
					password:'',
					email:'',
					mobile:''
				},
				editForm:{
					id:0,
					username:'',
					email:'',
					mobile:''
				},
				UserRules:{
					username:[
						{ required : true, message : '请输入用户名', triiger: 'blur' },
						{ min: 2, max: 6, message : '请输入2~6个字符', triiger : 'blur' }
					],
					password:[
						{ required : true, message : '请输入密码', triiger: 'blur' },
						{ min: 2, max: 6, message : '请输入2~6个字符', triiger : 'blur' }
					],
					email:[
						{ required : true, message : '请输入邮箱', triiger: 'blur' },
						{ validator : validataemail, triiger : 'blur' },
						{ min: 2, max: 6, message : '请输入2~6个字符', triiger : 'blur' }
					],
					mobile:[
						{ required : true, message : '请输入手机号', triiger: 'blur' },
						{ validator : validatamobile, triiger : 'blur' },
						{ min: 11, max: 11, message : '请输入11个字符', triiger : 'blur' }
					]
					
				},
				editUserRules:{
					email:[
						{ required : true, message : '请输入邮箱', triiger: 'blur' },
						{ validator : validataemail, triiger : 'blur' },
						{ min: 2, max: 6, message : '请输入2~6个字符', triiger : 'blur' }
					],
					mobile:[
						{ required : true, message : '请输入手机号', triiger: 'blur' },
						{ validator : validatamobile, triiger : 'blur' },
						{ min: 11, max: 11, message : '请输入11个字符', triiger : 'blur' }
					]
				},
				async deleteUser(props){
					const ms = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).catch(() => {
			        	this.$message({
			        		type:'info',
			        		message:'已取消的删除'
			        	})
			        })
					if(ms === 'confirm'){
						const meta = await this.$http.delete('users/' + props.id)
						console.log(meta)
						if(meta.status !== 200) return this.$message.error('删除该用户失败!')
						this.getUserList()
						this.$message.success('删除用户成功！')
					}
				}
			}
		},
		created(){
			this.getUserList()
		},
		 methods: {
			async getUserList() {
				const { data : dt } = await this.$http.get('users', { params: this.ListParams })
				if(dt.meta.status !== 200)return this.$message.error('获取用户数据错误!')
				this.Users = dt.data.users
				this.totalpage = dt.data.total
			},
			async ChangeStatu(params){
				const { data: dt } = await this.$http.put('users/' + params.id + '/state/' + params.mg_state)
				if(dt.meta.status !== 200) {
					this.getUserList()
					return this.$message.error('修改用户状态失败!')
				}
				this.$message.success('修改用户状态成功!')
			},
			handleCurrentChange(val){
				this.ListParams.pagenum = val
				this.getUserList()
			},
			handleSizeChange(val){
				this.ListParams.pagesize = val
				this.getUserList()
			},
			async search(){
				const { data : dt } = await this.$http.get('users', { params: this.ListParams })
				this.Users = dt.data.users
			},
			handleClose(){
				this.$refs.UserNatureRef.resetFields()
				this.addUserDialog = false
			},
			addUser(){
				this.$refs.UserNatureRef.validate(async valid => {
					if(!valid) {
						this.handleClose()
						this.$message.error('添加用户失败')
						return 
					} 
					//可以发起添加用户请求
						const { data : dt } = await this.$http.post('users', this.UserNature)
						if(dt.meta.status !== 201){
							return this.$message.success('添加用户失败!')
						}
						this.getUserList()
						this.handleClose()
						this.$message.success('添加用户成功!')
				})
			},
			 async userEdit(scope){
				this.editUserDialog = true
				const { data : dt } = await this.$http.get('users/' + scope.row.id)
				this.editForm = dt.data			
			},
			async editUser(){
				this.$refs.editUserNatureRef.validate(async valid => {
					if(valid){
						const { data : dt } = await this.$http.put('users/' + this.editForm.id, { email:this.editForm.email, mobile:this.editForm.mobile })
						if(dt.meta.status !== 200) {
							return this.$message.error('修改用户失败！')
						}
						this.getUserList()
						this.editUserDialog = false
						this.$message.success('修改用户成功!')
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.box-card{
	margin-top: 30px;
	
}
</style>

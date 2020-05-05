<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-button type="primary" @click="addRoleDialogHandle">添加角色</el-button>
		<el-card shadow="always">
			<template>
			  <el-table
			    :data="roleList"
			    border
			    style="width: 100%">
			    <el-table-column type="expand">
			      <template slot-scope="props">
			      		<el-row v-for='(item,index) in props.row.children' :key='item.id' :class="['bdbottom', index == 0 ? 'boderTop':'']">
			      			<el-col :span="6">
			      				<el-tag closable :disable-transitions='false' @close=deleteRights(props.row,item.id) >{{item.authName}}</el-tag>
			      				<i class="el-icon-arrow-right"></i>
			      			</el-col>
			      			<el-col :span="18">
			      				<el-row  v-for="(itemChilren,index2) in item.children" :key='itemChilren.id' :class="[index2 !== 0 ? 'boderTop':'']">
			      					<el-col :span='6'>
			      						<el-tag :disable-transitions='false' type="success" @close=deleteRights(props.row,itemChilren.id) closable>{{itemChilren.authName}}</el-tag>
			      						<i class="el-icon-arrow-right"></i>
			      					</el-col>
			      					<el-col :span='18'>
			      						<el-tag :disable-transitions='false' type="warning" v-for='rightsItem in itemChilren.children' :key='rightsItem.id' @close=deleteRights(props.row,rightsItem.id) closable>
			      							{{rightsItem.authName}}
			      						</el-tag>
			      					</el-col>
			      				</el-row>
			      			</el-col>
			      		</el-row>
			      </template>
			      </el-table-column>
			    <el-table-column type='index'>		    	
			    </el-table-column>
			    <el-table-column
			      prop="roleName"
			      label="角色名称"
			      >
			    </el-table-column>
			    <el-table-column
			      prop="roleDesc"
			      label="角色描述"
			      >
			    </el-table-column>
			    <el-table-column		
			      label="操作"
			      >
			      <template slot-scope="scope">
			        <el-button type="primary" size='small' icon="el-icon-edit" @click='roleEdit(scope.row.id)'>编辑</el-button>
			        <el-button type="danger" size='small' icon="el-icon-delete" @click='deleteRole(scope.row.id)'>删除</el-button>
			        <el-button type="warning" size='small' icon="el-icon-setting" @click='empowermentDialog(scope.row)'>分配权限</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			</template>
		</el-card>
		<el-dialog
			  :title="title"
			  :visible.sync="addRoleDiaLog"
			  width="50%"
			  :before-close="closeAddroleDialog">
			  <el-form ref="addRoleRef" :model="addRoleProps" label-width="80px">
			  		<el-form-item  class='hidden' label="角色Id" prop='roleId'>
					    <el-input type='hidden' v-model="addRoleProps.roleId"></el-input>
					  </el-form-item>
			  		<el-form-item label="角色名称" prop='roleName'>
					    <el-input v-model="addRoleProps.roleName"></el-input>
					  </el-form-item>	
			  		<el-form-item label="角色描述" prop='roleDesc'>
					    <el-input v-model="addRoleProps.roleDesc"></el-input>
					  </el-form-item>
			  </el-form>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="closeAddroleDialog">取 消</el-button>
			    <el-button type="primary" @click="addRoleHandle">确 定</el-button>
			  </span>
			</el-dialog>
			
			
			<!--
            	作者：offline
            	时间：2020-04-08
            	描述：角色赋权弹出对话框
            -->
			<el-dialog
			  title="角色赋权"
			  :visible.sync="empowerment"
			  width="50%"
			  :before-close="closeRoleEmpowerDialog"
			  >
			  <template>
			  <el-tree
			  	  node-key="id"
			  	  :data="rights"
				  :props="props"
				  show-checkbox
				  default-expand-all
				  :default-checked-keys="defaultKeys" 
				  ref='treeRef'
				  >
				</el-tree>
				</template>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="closeRoleEmpowerDialog">取 消</el-button>
			    <el-button type="primary" @click="roleEmpowerment">确 定</el-button>
			  </span>
			</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				roleList:[],
				rightsList:[],
				addRoleDiaLog:false,
				addRoleProps:{
					roleId:0,
					roleName:'',
					roleDesc:''
				},
				rights:[],
				props:{
					label:'authName',
					children:'children'
				},
				empowerment:false,
				defaultKeys:[],
				title:'',
				roleId:''
			}
		},
		created(){
			this.getRoleList()
		},
		methods:{
			async getRoleList(){
				 const { data : dt } = await this.$http.get('roles')
				 if(dt.meta.status !== 200){
				 	return this.$message.error('获取角色列表错误')
				 }
				 this.roleList = dt.data
			},
			async deleteRights(roleId, rightId){
				const { data : dt } = await this.$http.delete(`roles/${roleId.id}/rights/${rightId}`)
				if(dt.meta.status !== 200) return this.$message.error('取消角色权限失败!')
				this.getRoleList()	
				this.$message.success('取消该角色权限成功！')		
			},
			async addRoleHandle(){
				if(this.addRoleProps.roleId !== 0){
					const { data:dt } = await this.$http.put('roles/' + this.addRoleProps.roleId, this.addRoleProps)
					if(dt.meta.status !== 200) return this.$message.error('修改角色信息失败!')
					this.getRoleList()
					this.closeAddroleDialog()
					this.addRoleDiaLog = false
					
					this.$message.success('修改角色信息成功!')
				}else{					
					const { data: dt } = await this.$http.post('roles', this.addRoleProps)
					if(dt.meta.status !== 201) return this.$message.error('添加角色失败!')
					this.closeAddroleDialog()
					this.getRoleList()
					this.$message.success('添加角色成功!')
				}
			},
			async roleEdit(roleid){
				const { data : dt } = await this.$http.get(`roles/${roleid}`)
				if(dt.meta.status !== 200) return this.$message.error('获取最新角色信息错误！')
				this.addRoleDiaLog = true
				this.$nextTick(function(){
                                this.addRoleProps = dt.data
                                delete this.addRoleProps.rolePermissionDesc
                                if(this.addRoleProps.roleId !== 0){
								this.title = '编辑角色'
								}	
                })
			},
			closeAddroleDialog(){
				this.$refs.addRoleRef.resetFields()
				this.title = ''
				this.addRoleDiaLog = false
			},
			async deleteRole(roleId){
			  		const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'				               
				        	})
				        })
				    if(result === 'confirm'){
				    	const { data : dt } = await this.$http.delete(`roles/${roleId}`)
				    	if(dt.meta.status !== 200) return this.$message.error('删除角色失败!')
				    	this.getRoleList()
				    	this.$message.success('删除角色成功!')
				   	}
			 },
			 async empowermentDialog(props){
			 	this.roleId = props.id
			 	const { data : dt } = await this.$http.get('rights/tree')
			 	if(dt.meta.status !== 200) return this.$message.error('获取权限列表错误!')
			 	this.rights = dt.data
			 	this.empowerment = true
			 	this.getAllChildrenRights(props, this.defaultKeys)
			 },
			 //保存角色对应权限
			 async roleEmpowerment(){
			 		const checkKeys = this.$refs.treeRef.getHalfCheckedKeys().concat(this.$refs.treeRef.getCheckedKeys()).join(',')
			 		const { data : dt } = await this.$http.post('roles/' + this.roleId + '/rights', { rids : checkKeys })
			 		if(dt.meta.status !== 200) return this.$message.error('角色授权失败!')
			 		this.closeRoleEmpowerDialog()
			 		this.getRoleList()
			 		this.$message.success('分配权限成功！')
			 },
			 getAllChildrenRights(arrays, newarrays){
			 		if(!arrays.children){
			 			return newarrays.push(arrays.id)
			 		}
			 		arrays.children.forEach(item => {
			 			this.getAllChildrenRights(item, newarrays)
			 		})
			 },
			 addRoleDialogHandle(){
			 	if(this.addRoleProps.roleId === 0){
					this.title = '添加角色'
					this.addRoleDiaLog = true
				}
			 },
			 //关闭角色赋权对话框
			 closeRoleEmpowerDialog(){
			 	this.roleId = ''
			 	this.defaultKeys = []
			 	this.empowerment = false
			 }
		}
	}
</script>

<style lang="less" scoped>
.boderTop{
	border-top: 1px solid gainsboro;
}
.bdbottom{
	border-bottom: 1px solid gainsboro ;
}
.el-tag{
	margin: 7px;
}
.el-row{
	display: flex;
	align-items: center;
}
.el-breadcrumb{
	margin-bottom: 20px;
}
.hidden{
	display: none;
}
</style>

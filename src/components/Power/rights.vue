<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card shadow="always">
		 	<template>
				  <el-table
				    :data="rightsList"
				    border
				    style="width: 100%">
				    <el-table-column
				      type="index"
				      width="50">
				     </el-table-column>
				    <el-table-column
				      prop="authName"
				      label="权限名称"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="path"
				      label="路径"
				      >
				    </el-table-column>
				    <el-table-column>
					   	<template slot-scope='scope'>
				    		 <el-tag v-if='scope.row.level == 0' >一级</el-tag>
				    		 <el-tag v-else-if='scope.row.level == 1' type="success">二级</el-tag>
				    		 <el-tag v-else-if='scope.row.level == 2' type="warning">三级</el-tag>
				    	</template>
				    </el-table-column> 
				  </el-table>
				</template>
			</el-card>
		</div>
	</template>
<script>
	export default {
		data (){
			return {
				rightsList:[]
			}
		},
		created(){
			this.getRightsList()
		},
		methods:{
			async getRightsList(){
				const { data: dt } = await this.$http.get('rights/list')
				if(dt.meta.status !== 200){
					return this.$message.error('获取权限列表错误!')
				}
				this.rightsList = dt.data
			}
		}
		
	}
</script>

<style lang="less" scoped>
</style>

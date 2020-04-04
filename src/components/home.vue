<template>
		<el-container>
		  <el-header >
		  		<div>
		  				<img src="../assets/img/Tesla.jpg" />		
			  		<span>电商后台管理系统</span>
		  		</div>
		  		<el-button type="primary" @click='exitLogin'>退出</el-button>
		  </el-header>
		  <el-container>
		    <el-aside :width="isunfold?'64px':'200px'" >
		    	<div class='putout' @click="memuTriiger">
		    		<span >|||</span>
		    	</div>
		    	 <el-menu
			      :default-active="memuActive"
			      background-color="#323744"
			      text-color="#fff"
			      active-text-color="#ffd04b"
			      :unique-opened="true"
			      :collapse='isunfold'
			      :collapse-transition='false'
			      :router='true'
			      >
			      <el-submenu :index="''+item.id" v-for='item in NaigationDate' :key='item.id'>
			        <template slot="title">
			          <i :class="iconList[item.id]"></i>
			          <span>{{item.authName}}</span>
			        </template>
			        <el-menu-item  :index="'/'+itemChildren.path" :key='itemChildren.id' v-for='itemChildren in item.children' 
			        	@click="memuActiveChange('/'+itemChildren.path)">
			          <template slot="title">
				          <i class="el-icon-location"></i>
				          <span  >{{itemChildren.authName}}</span>
			        </template>
			        </el-menu-item>
			      </el-submenu>

			    </el-menu>
		    	
		    </el-aside>
		    <!--
            	内容主体区域
            -->
		    <el-main>
		    		<router-view></router-view>
		    </el-main>
		  </el-container>
		</el-container>
</template>

<script>
	export default {
		data() {
			return {
				NaigationDate:[],
				iconList:{
						125:'iconfont icon-users',
					
						103:'iconfont icon-lock_fill',
					
						101:'iconfont icon-shangpin',
					
						102:'iconfont icon-danju',
					
						145:'iconfont icon-baobiao'
					
				},
				isunfold:false,
				memuActive:''
			}
		},
		methods:{
			//退出功能
			exitLogin(){
				window.sessionStorage.removeItem('memuActiveIndex')
				window.sessionStorage.removeItem('token')
				this.$router.push('/login')
			},
			async getNaigationList(){
				 const { data: dt } = await this.$http.get('menus')
				if (dt.meta.status !== 200) return this.$message.error('获取左侧菜单错误!')
				this.NaigationDate = dt.data
			},
			memuTriiger(){
				this.isunfold = !this.isunfold	
			},
			memuActiveChange (val) {
			this.memuActive = val
			window.sessionStorage.setItem('memuActiveIndex', val)
		}
		},
		created () {
			const memuIndex = window.sessionStorage.getItem('memuActiveIndex')
			console.log(memuIndex)
			this.memuActive = memuIndex
			this.getNaigationList()
		}
		
	}
</script>

<style lang="less" scoped="scoped">
.el-container{
	height: 100% !important;
	.el-header {
		background-color: #3A3B3F;
		padding-left: 0px;
		display:flex;
		justify-content:space-between;
		align-items:center;
		color:#F1F2F3;
		font-size:20px;
		div{
			display: flex;
			height:100%;
			align-items: center;
				img{
					width: 191px;
					height: 100%;
			}
			
			span{
				margin-left: 10px;
			}
		}
		
		
	}
	
}
.el-aside{
	background-color: #323744;

	span{
		margin-left: 4px;
		
	}
}
.el-menu{
	border: 0;
}
.putout{
	background-color: #4B5360;
	text-align: center;
	color: white;
	cursor: pointer;
	letter-spacing: 0.2em;
}
span{
	cursor: pointer;
}
</style>


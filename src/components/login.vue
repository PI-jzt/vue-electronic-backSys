<template>
	<div id="login_container">
		<div id="login_center">
				<div id="icon_box">
					<img src="../assets/logo.png" />
				</div>		
				<el-form label-width="0px" ref='login_ref' :model='login_form' :rules="login_rules"  class="login-form">
					<el-form-item  prop="username">
					    <el-input prefix-icon="iconfont icon-user" v-model='login_form.username' ></el-input>
					   
					 </el-form-item>
					 <el-form-item prop="password">
					    <el-input type='password' prefix-icon="iconfont icon-3702mima" v-model='login_form.password' ></el-input>
					    
					  </el-form-item>
					<el-row class="button-right">
					  	<el-button type="primary" @click='formCommit'>登入</el-button>
					  	<el-button type="info" @click='reset'>重置</el-button>
					</el-row>
				</el-form>
				 
		</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				login_form: {
					username: 'admin',
					password: '123456'
					
				},
				login_rules: {
					username: [
						{ required: true, message: '请输入账号！', trigger: 'blur' },
						{ min: 4, max: 14, message: '长度保持在6~14之间', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入密码！', trigger: 'blur' },
						{ min: 6, max: 15, message: '长度在6~15字符', trigger: 'blur' }
					
					]
				}
				
			}
		},
		methods: {
			reset () {
				this.$refs.login_ref.resetFields()
			},
			formCommit () {
				this.$refs.login_ref.validate(async valid => {
					if (valid) {
						const { data: message } = await this.$http.post('login', this.login_form)
						if (message.meta.status !== 200) {
							this.$message.error('登入失败！')							
						} else {
							this.$message.success('登入成功！')
							window.sessionStorage.setItem('token', message.data.token)
							const that = this
							setTimeout(function () {
								that.$router.push('/home')
							}, 1000)
						}
					} else {
						console.log('验证失败')
					}			
				})
			}
		}
	}
</script>

<style lang="less" scoped>
#login_container{
	background-color: #2b4b6b;
	height: 100%;
	#login_center{
		width: 450px;
		height: 300px;
		background-color: white;
		border-radius: 3px;
		position: absolute;
		left: 50%;
		top:50%;
		transform: translate(-50%,-50%);
		#icon_box{
			width:130px;
			height: 130px;
			border: 1px solid #eee;
			border-radius: 50%;
			padding: 10px;
			position: absolute;
			left: 50%;
			box-shadow: 0 0 10px #ddd;
			transform: translate(-50%,-50%);
			background-color: white;
			img{
				width: 100%;
				height: 100%;
				border: 1px solid #eee;
				border-radius: 50%;
			}
		}
		.login-form{
			position: absolute;
			bottom: 10px;
			width: 100%;
			box-sizing: border-box;
			padding: 0 20px;
		}
		.button-right{
			display: flex;
			justify-content: flex-end
			}
		}
}

</style>

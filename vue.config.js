module.exports = {
	devServer:{
		open:true,
		port:9999
		
	},
	
	//配置js打包入口文件
	chainWebpack:config => { 
		config.when(process.env.NODE_ENV === 'production', config => {
				config.entry('app').clear().add('./src/main.js')
				
				config.plugin('html').tap(args => {
					args[0].title = true
					return args
				})
				
				//优化打包项目
				config.set('externals', {
					vue:'Vue',
					'vue-quill-editor':'VueQuillEditor',
					axios:'axios',
					echarts:'echarts',
					'vue-router':'VueRouter'
					
				})
		})
		config.when(process.env.NODE_ENV === 'development', config => {
			config.entry('app').clear().add('./src/developMain.js')
			
			config.plugin('html').tap(args => {
				args[0].title = false
				return args
			})
			/*//优化打包项目
			config.set('externals', {
				vue:'Vue',
				'vue-quill-editor':'VueQuillEditor',
				axios:'axios',
				'vue-router':'VueRouter',
				echarts:'echarts'
				
			})*/
		})
	}

}

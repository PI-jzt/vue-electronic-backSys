const prodPlugin = []
if(process.env.NODE_ENV === 'production'){
	prodPlugin.push('transform-remove-console')
}


module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prodPlugin,
    //配置路由懒加载插件
    '@babel/plugin-syntax-dynamic-import'
  ]
}

<template>
		<div>
			<el-breadcrumb separator='/'>
			  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
			  <el-breadcrumb-item>数据统计</el-breadcrumb-item>
			  <el-breadcrumb-item>数据报表</el-breadcrumb-item>
			</el-breadcrumb>
			<el-card>
				<div id='main' style='width: 900px;height:500px;'></div>
			</el-card>
		</div>
</template>

<script>
	import echarts from 'echarts'
	
	export default {
		data(){
			return{
				reportList:[]
			}
		},
		async mounted(){
			 // 基于准备好的dom，初始化echarts实例
      		  var myChart = echarts.init(document.getElementById('main'))
      		  const { data:dt } = await this.$http.get('reports/type/1')
      		  if(dt.meta.status !== 200) { return this.$message.error('获取报表数据报错!') }
      		  this.reportList = dt.data
      		  this.reportList.title = { text:'用户来源' }
      		  this.reportList.tooltip = { trigger:'axis', axisPointer:{ type:'cross', label:{ backgroundColor:'#6a7985' } } }
      		  console.log(1234)
      		 // 指定图表的配置项和数据
		       /* var option = {
		            title: {
		                text: 'ECharts 入门示例'
		            },
		            tooltip: {},
		            legend: {
		                data:['销量']
		            },
		            xAxis: {
		                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
		            },
		            yAxis: {},
		            series: [{
		                name: '销量',
		                type: 'bar',
		                data: [5, 20, 36, 10, 10, 20]
		            }]
		        }*/
		    // 使用刚指定的配置项和数据显示图表。
     		  myChart.setOption(this.reportList)
		}
	}
</script>

<style lang='less' scoped>
</style>

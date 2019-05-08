// 此页面可以配制文件夹的别名，用于开发中的路径简写
var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

// 添加的vux相关配制
const vuxLoader = require('vux-loader')

function resolve (dir) {
	return path.join(__dirname, '..', dir)
}
//
// module.exports = {
//   entry: {
//     app: './src/main.js'
//   },
//   output: {
//     path: config.build.assetsRoot,
//     filename: '[name].js',
//     publicPath: process.env.NODE_ENV === 'production'
//       ? config.build.assetsPublicPath
//       : config.dev.assetsPublicPath
//   },
//   resolve: {
//     extensions: ['.js', '.vue', '.json'],
//     alias: {
//       'vue$': 'vue/dist/vue.esm.js',
//       '@': resolve('src'),
//       'common': path.resolve(__dirname,'../src/common'),
//       'components': path.resolve(__dirname,'../src/components'),
//       'muse-components': 'muse-ui/src'
//     }
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(js|vue)$/,
//         loader: 'eslint-loader',
//         enforce: 'pre',
//         include: [resolve('src'), resolve('test')],
//         options: {
//           formatter: require('eslint-friendly-formatter')
//         }
//       },
//       {
//         test: /\.vue$/,
//         loader: 'vue-loader',
//         options: vueLoaderConfig
//       },
//       {
//         test: /\.js$/,
//         loader: 'babel-loader',
//         include: [resolve('src'), resolve('test')]
//       },
//       {
//         test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
//         loader: 'url-loader',
//         options: {
//           limit: 10000,
//           name: utils.assetsPath('img/[name].[hash:7].[ext]')
//         }
//       },
//       {
//         test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
//         loader: 'url-loader',
//         options: {
//           limit: 10000,
//           name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
//         }
//       },
//       {
//         test: /muse-ui.src.*?js$/,
//         loader: 'babel-loader'
//       }
//     ]
//   }
// }

// 添加的vux相关配制
let webpackConfig = {
	entry: {
		app: './src/main.js'
	},
	externals: {
		"BMap": "BMap"
	},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production'
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPath
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src'),
			'common': path.resolve(__dirname,'../src/common'),
			'components': path.resolve(__dirname,'../src/components'),
			'muse-components': 'muse-ui/src'
		}
	},
	module: {
		rules: [
			// {
			// 	test: /\.(js|vue)$/,
			// 	loader: 'eslint-loader',
			// 	enforce: 'pre',
			// 	include: [resolve('src'), resolve('test')],
			// 	options: {
			// 		formatter: require('eslint-friendly-formatter')
			// 	}
			// },
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('test')]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			},
			{
				test: /muse-ui.src.*?js$/,
				loader: 'babel-loader'
			}
		]
	}
}

// 添加的vux相关配制
module.exports = vuxLoader.merge(webpackConfig, {
	plugins: ['vux-ui', 'progress-bar', 'duplicate-style']
})
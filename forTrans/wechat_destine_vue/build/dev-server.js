// 此页面可以mock后台数据，作为测试使用
require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
// 我添加的内容，开始
var appData=require('../data.json');

var menu=appData.menu;
var foods=appData.foods;
var goods=appData.goods;

const bodyParser=require('body-parser')
// 网上要求的对JSON的解析，不然会读不到req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var apiRouters=express.Router();

// post的参考，模拟一个进入每个路由的时候才加载对应路由点单数据的逻辑
// router.post('/login', function (req, res, next) {
// 	var name = req.body.name;
// 	var pass = req.body.password;
// 	console.log('name:' + name);
// 	console.log('pass:' + pass);
// 	if (name == 'sis' && pass == '1') {
// 		res.send('1');
// 	}
// 	res.end('is over');
// });
apiRouters.get('/menu',function(req,res){
  res.json({
    errno:0,
    data:menu
  });
});
apiRouters.post('/foods',function(req,res){
  let index = req.body.index
  res.json({
    errno:0,
    data:foods[index].list
  });
});
apiRouters.get('/goods',function(req,res){
  res.json({
    errno:0,
    data:goods
  });
});
app.use('/api',apiRouters);
// 我添加的内容，结束
// 说明：通过express添加API接口，可以提供数据信息

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}

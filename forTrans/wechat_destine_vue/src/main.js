// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import 'common/stylus/index.styl'
import store from './store/index.js'
import 'muse-components/styles/base.less'
import FastClick from 'fastclick'
import ElementUI from 'element-ui'
import './common/stylus/element-ui/theme-default/index.css'
import { WechatPlugin } from 'vux'
// 这是自定义的工具箱
import util from './common/js/util.js'

Vue.config.productionTip = false

Vue.use(util)
Vue.use(WechatPlugin)
Vue.use(VueResource)
Vue.use(ElementUI)

Vue.http.options.emulateJSON = true
Vue.http.options.headers = {
	'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
}

// vux要求的快速点击
FastClick.attach(document.body)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})

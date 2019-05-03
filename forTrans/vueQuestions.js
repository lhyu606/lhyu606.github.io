// 问题集合
// 组件 data 由于 JavaScript 对象是引用类型，所以需要一个立即执行函数返回一个全新的 data 对象为该组件独享，避免同一组件多处引用时造成数据共享


// computed 和 watch 都是用于监听数据变化
// computed 声明 的 函数名【comp】 机作为 vm data 的一部分，组件内可以直接 {{ comp }} 引用，用于监听所依赖的 数据（一个或多个）变化， 简单处理，返回新值

// watch 监听 单个数据变化，适合较 computed 更复杂的处理，进行 data 更新


// 组件间通信：
// 1、 父子间通信： 子【 $emit('event', args); 】, 父【 $on('event', function(args) { /* dosomething */ }; 】

// 2、 非父子间通信： eventBus
// event-bus.js
// import Vue from 'vue'
// const EventBus = new Vue();
// export default EventBus;

// import EventBus from 'event-bus.js';
// EventBus.$on('event1', function( ...param ) { ...operation });

// import EventBus from 'event-bus.js';
// EventBus.$emit('event1', ...param);

// 3、 vuex 【 state、 mutation、 action、 getter、 module 】

// 新增变量：全局 vm.set(this.data, 'foo', value);  组件 this.$set(this.data, 'foo', val);

// v-if 用于不经常切换的元素，控制是否渲染
// v-show 用于经常切换的元素，控制 display：block | none;

// 列表渲染时，添加 v-key='yourkey'，vue 识别节点，利于 diff 算法，列表简单时 可以不加，“就地复用”策略【默认】	....还有更多

// 路由懒加载
// const getComponent = (name, component) => () => import(`@/view/${name}/{component}.vue`);
// const myRouter = new Router({
	// routes: [
		// {
			// path: '/',
			// name: 'home',
			// component: getComponent('login', 'index')
		// }
		// ....
	// ]
// });

// 进度条插件 nprogress

// 导航守卫，验证 token
myRouter.beforeEach( (to, from, next) => {
	NProgress.start();
	if (to.path !== '/login' && !store.state.token) {
		next('/login');
		NProgress.done();
	}

	next();
} );

myRouter.afterEach( () => {
	NProgress.done();
} );


import axios from 'axios';
import router from '../router/router';
import { Loading } from 'element-ui'; // element-ui

// axios 基本设置
axios.default.timeout = 60000;
axios.default.baseURL = process.env.BASE_URL;
axios.default.headers.post['Content-type'] = "application/x-www-form-urlencoded;charset=UTF-8";
let loading = null; // 初始化 loading

// 请求拦截 【请求前处理】
axios.intercetors.request.use(
	config => {
		loading = Loading.service({
			text: '正在加载中....',
			fullscreen: true
		});
		if (store.state.token) {
			config.headers.['Authorization'] = 'Bearer' + store.state.token;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);
// 响应拦截 【数据返回处理】
axios.intercetors.response.use(
	response => {
		return new Promise( (resolve, reject) => {
			// 成功后关闭加载框
			if (loading) {
				loading.close();
			}
			const res = response.data;
			if (res.err_code === 0) {
				resolve(res);
			} else {
				reject(res);
			}
		} );
	},
	error => {
		console.log(error);
		// 请求成功后关闭加载框
		if (loading) {
			loading.close();
		}
		// 断网处理货请求超时
		if (!error.response) => {
			// 请求超时
			if (error.message.include('timeout')) {
				console.log('请求超时');
				messages('error', '请求超时，请检查互联网链接');
			} else {
				// 断网，可以展示断网组件
				console.log('断网了');
				messages('error', '请检查网络是否已连接');
			}
			return ;
		}
		const status = error.response.status;
		switch (status) {
			case 500: 
				messages('error', '服务器内部错误');
				break;
			case 404: 
				messages('error', '未找到远程服务器');
				break;
			case 401: 
				messages('warning', '用户登录已过期，请重新登录');
				localStorage.removeItem('token');
				setTimeout( () => {
					router.replace({
						path: '/login',
						query: {
							redirect: router.currentRoute.fullPath
						}
					});
				}, 1000);
				break;
			case 400: 
				messages('error', '数据异常');
				break;
			default: 
				messages('error', error.response.data.message);
		}
		return Promise.reject(error);
	}
);

// vuex-persistedstate   vuex 数据持久化插件

Object.definedProperty(boj, {
	getter: function() {
		// dosomething
		// 建立依赖
	},
	setter: function () {
		// 拦截，重新建立依赖
	}
})
// Observe 观察者，【dep】		dep.depend();
// 通知订阅者，==> 执行 compiler 进行 diff 计算，修改视图


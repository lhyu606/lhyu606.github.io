/**
 * Created by Administrator on 2017-04-07.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
	cityName: '',
	orderHistory: [],
	orderHistoryNoUse: [],
	orderHistoryReturn: [],
	orderHistoryWaitPay: [],
	orderHistoryCom: [],
	eCardId: '',
	// 是否处于加载状态
	isLoading: false,
	// 是否处于加载状态
	IP: '',
    IP: 'http://yf.evideocloud.com.cn/',
	// IP: 'http://192.168.74.69:8080', // fu的ip地址
	// IP: 'http://192.168.73.149:8080', // jiang的IP地址
	// IP: 'http://192.168.82.142:8080',
	historyIndex: 0,
	// 当前的提示信息
	nowToast: '',
	openId: '1234567',
	// 第一次打开页面
	firstIn: true,
	KTVlist: []
}

export default new Vuex.Store({
	state,
	actions,
	mutations
})

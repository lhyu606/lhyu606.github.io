/**
 * Created by Administrator on 2017-04-07.
 */
export default {
	setCityName ({ commit, state }, order) {
		commit('SET_CITY_NAME', {order})
	},
	setOrderHistory ({ commit, state }, order) {
		commit('SET_ORDER_HISTORY', {order})
	},
	setOrderHistoryNoUse ({ commit, state }, order) {
		commit('SET_ORDER_HISTORY_NO_USE', {order})
	},
	setOrderHistoryReturn ({ commit, state }, order) {
		commit('SET_ORDER_HISTORY_RETURN', {order})
	},
	setOrderHistoryWaitPay ({ commit, state }, order) {
		commit('SET_ORDER_HISTORY_WAIT_PAY', {order})
	},
	setOrderHistoryCom ({ commit, state }, order) {
		commit('SET_ORDER_HISTORY_COM', {order})
	},
	clearOrderHistory ({ commit }) {
		commit('CLEAR_ORDER_HISTORY')
	},
	clearOrderHistoryNoUse ({ commit }) {
		commit('CLEAR_ORDER_HISTORY_NO_USE')
	},
	clearOrderHistoryReturn ({ commit }) {
		commit('CLEAR_ORDER_HISTORY_RETURN')
	},
	clearOrderHistoryWaitPay ({ commit }) {
		commit('CLEAR_ORDER_HISTORY_WAIT_PAY')
	},
	setECardId ({ commit, state }, item) {
		commit('SET_E_CARD_ID', {item})
	},
	setIp ({ commit, state }, item) {
		commit('SET_IP', {item})
	},
	setKTVList ({ commit, state }, loading) {
		commit('SET_KTV_LIST', {loading})
	},
	setIsLoading ({ commit, state }, loading) {
		commit('SET_IS_LOADING', {loading})
	},
	setHistoryIndex ({ commit, state }, item) {
		commit('SET_HISTORY_INDEX', {item})
	},
	setNowToast ({ commit, state }, item) {
		commit('SET_NOW_TOAST', {item})
	},
	setFirstIn ({ commit, state }, item) {
		commit('SET_FIRST_IN', {item})
	}
}

/**
 * Created by Administrator on 2017-04-07.
 */
export default {
	clearOrderHistoryWaitPay ({ commit }) {
		commit('CLEAR_ORDER_HISTORY_WAIT_PAY')
	},
	setECardId ({ commit, state }, item) {
		commit('SET_E_CARD_ID', {item})
	},
	setIp ({ commit, state }, item) {
		commit('SET_IP', {item})
	},
	setIsLoading ({ commit, state }, loading) {
		commit('SET_IS_LOADING', {loading})
	},
	setNowToast ({ commit, state }, item) {
		commit('SET_NOW_TOAST', {item})
	},
	setFirstIn ({ commit, state }, item) {
		commit('SET_FIRST_IN', {item})
	},
	setTicketList ({ commit, state }, item) {
		commit('SET_TICKET_LIST', {item})
	},
	setTabType ({ commit, state }, item) {
		commit('SET_TAB_TYPE', {item})
	},
}

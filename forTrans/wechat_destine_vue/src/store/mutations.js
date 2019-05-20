/**
 * Created by Administrator on 2017-04-07.
 */
// import _ from 'lodash'
const SET_ORDER_HISTORY_WAIT_PAY = 'SET_ORDER_HISTORY_WAIT_PAY'
const CLEAR_ORDER_HISTORY_WAIT_PAY = 'CLEAR_ORDER_HISTORY_WAIT_PAY'
const SET_E_CARD_ID = 'SET_E_CARD_ID'
const SET_IP = 'SET_IP'
const SET_IS_LOADING = 'SET_IS_LOADING'
const SET_NOW_TOAST = 'SET_NOW_TOAST'
const SET_TICKET_LIST = 'SET_TICKET_LIST'
const SET_FIRST_IN = 'SET_FIRST_IN'

export default {
	[SET_ORDER_HISTORY_WAIT_PAY] (state, payload) {
		state.orderHistoryWaitPay = payload.order
	},
	[CLEAR_ORDER_HISTORY_WAIT_PAY] (state) {
		state.orderHistoryWaitPay.splice(0)
	},
	[SET_E_CARD_ID] (state, payload) {
		state.eCardId = payload.item
	},
	[SET_IP] (state, payload) {
		state.IP = payload.item
	},
	[SET_IS_LOADING] (state, payload) {
		state.isLoading = payload.loading
	},
	[SET_NOW_TOAST] (state, payload) {
		state.nowToast = payload.item
	},
	[SET_FIRST_IN] (state, payload) {
		state.firstIn = payload.item
	},
	[SET_TICKET_LIST] (state, payload) {
		state.ticketList = payload.item
	}
}


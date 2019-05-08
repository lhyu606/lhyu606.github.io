/**
 * Created by Administrator on 2017-04-07.
 */
// import _ from 'lodash'
const SET_CITY_NAME = 'SET_CITY_NAME'
const SET_ORDER_HISTORY = 'SET_ORDER_HISTORY'
const SET_ORDER_HISTORY_NO_USE = 'SET_ORDER_HISTORY_NO_USE'
const SET_ORDER_HISTORY_RETURN = 'SET_ORDER_HISTORY_RETURN'
const SET_ORDER_HISTORY_WAIT_PAY = 'SET_ORDER_HISTORY_WAIT_PAY'
const SET_ORDER_HISTORY_COM = 'SET_ORDER_HISTORY_COM'
const CLEAR_ORDER_HISTORY = 'CLEAR_ORDER_HISTORY'
const CLEAR_ORDER_HISTORY_NO_USE = 'CLEAR_ORDER_HISTORY_NO_USE'
const CLEAR_ORDER_HISTORY_RETURN = 'CLEAR_ORDER_HISTORY_RETURN'
const CLEAR_ORDER_HISTORY_WAIT_PAY = 'CLEAR_ORDER_HISTORY_WAIT_PAY'
const CLEAR_ORDER_HISTORY_COM = 'CLEAR_ORDER_HISTORY_COM'
const SET_E_CARD_ID = 'SET_E_CARD_ID'
const SET_IP = 'SET_IP'
const SET_KTV_LIST = 'SET_KTV_LIST'
const SET_IS_LOADING = 'SET_IS_LOADING'
const SET_HISTORY_INDEX = 'SET_HISTORY_INDEX'
const SET_NOW_TOAST = 'SET_NOW_TOAST'
const SET_FIRST_IN = 'SET_FIRST_IN'

export default {
	[SET_CITY_NAME] (state, payload) {
		state.cityName = payload.order
	},
	[SET_ORDER_HISTORY] (state, payload) {
		state.orderHistory = payload.order
	},
	[SET_ORDER_HISTORY_NO_USE] (state, payload) {
		state.orderHistoryNoUse = payload.order
	},
	[SET_ORDER_HISTORY_RETURN] (state, payload) {
		state.orderHistoryReturn = payload.order
	},
	[SET_ORDER_HISTORY_WAIT_PAY] (state, payload) {
		state.orderHistoryWaitPay = payload.order
	},
	[SET_ORDER_HISTORY_COM] (state, payload) {
		state.orderHistoryCom = payload.order
	},
	[CLEAR_ORDER_HISTORY] (state) {
		state.orderHistory.splice(0)
	},
	[CLEAR_ORDER_HISTORY_NO_USE] (state) {
		state.orderHistoryNoUse.splice(0)
	},
	[CLEAR_ORDER_HISTORY_RETURN] (state) {
		state.orderHistoryReturn.splice(0)
	},
	[CLEAR_ORDER_HISTORY_WAIT_PAY] (state) {
		state.orderHistoryWaitPay.splice(0)
	},
	[CLEAR_ORDER_HISTORY_COM] (state) {
		state.orderHistoryCom.splice(0)
	},
	[SET_E_CARD_ID] (state, payload) {
		state.eCardId = payload.item
	},
	[SET_IP] (state, payload) {
		state.IP = payload.item
	},
	[SET_KTV_LIST] (state, payload) {
		state.KTVlist = payload.loading
	},
	[SET_IS_LOADING] (state, payload) {
		state.isLoading = payload.loading
	},
	[SET_HISTORY_INDEX] (state, payload) {
		state.historyIndex = payload.item
	},
	[SET_NOW_TOAST] (state, payload) {
		state.nowToast = payload.item
	},
	[SET_FIRST_IN] (state, payload) {
		state.firstIn = payload.item
	}
}


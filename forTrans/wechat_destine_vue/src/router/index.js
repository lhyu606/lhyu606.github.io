import Vue from 'vue'
import Router from 'vue-router'

// 使用懒加载的情况下会提示出错
// import paySuccess from '@/components/pay_success/pay_success'

Vue.use(Router)

// 编程式跳转使用this.$router.push()
export default new Router({
	routes: [
		{
			path: '/',
			name: 'index',
			redirect: '/ticket'
		},
		{
			path: '/choiceKTV',
			name: '0',
			component: (resolve) => {
				require(['@/components/choiceKTV/choiceKTV'], resolve)
			},
			meta: {
				title: '娱加在线预订'
			}
		},
		{
			path: '/selectCity',
			name: '1',
			component: (resolve) => {
				require(['@/components/selectCity/selectCity'], resolve)
			},
			meta: {
				title: '选择省份'
			}
		},
		{
			path: '/choiceTime',
			name: '1',
			component: (resolve) => {
				require(['@/components/choiceTime/choiceTime'], resolve)
			},
			meta: {
				title: '选择活动'
			}
		},
		{
			path: '/commentOfActive',
			name: '2',
			component: (resolve) => {
				require(['@/components/commentOfActive/commentOfActive'], resolve)
			},
			meta: {
				title: '活动评价'
			}
		},
		{
			path: '/choiceTable',
			name: '2',
			component: (resolve) => {
				require(['@/components/choiceTable/choiceTable'], resolve)
			},
			meta: {
				title: '选择卡台'
			}
		},
		{
			path: '/choiceTableListMode',
			name: '2',
			component: (resolve) => {
				require(['@/components/choiceTable/choiceTableListMode'], resolve)
			},
			meta: {
				title: '选择卡台'
			}
		},
		{
			path: '/choiceDetail',
			name: '3',
			component: (resolve) => {
				require(['@/components/choiceDetail/choiceDetail'], resolve)
			},
			meta: {
				title: '确认下单'
			}
		},
		{
			path: '/pay_list',
			name: '4',
			component: (resolve) => {
				require(['@/components/pay_list/pay_list'], resolve)
			},
			meta: {
				title: '确认订单'
			}
		},
		{
			path: '/pay_ready',
			name: '5',
			component: (resolve) => {
				require(['@/components/pay_ready/pay_ready'], resolve)
			},
			meta: {
				title: '支付订金'
			}
		},
		{
			path: '/pay_success',
			name: '6',
			// component: paySuccess
			component: (resolve) => {
				require(['@/components/pay_success/pay_success'], resolve)
			},
			meta: {
				title: '支付成功'
			}
		},
		{
			path: '/order_history',
			name: '7',
			component: (resolve) => {
				require(['@/components/order_history/order_history'], resolve)
			},
			meta: {
				title: '预订历史订单'
			}
		},
		{
			path: '/order_detail',
			name: '8',
			component: (resolve) => {
				require(['@/components/order_detail/order_detail'], resolve)
			},
			meta: {
				title: '订单详情'
			}
		},
		{
			path: '/pay_abandon',
			name: '9',
			// component: paySuccess
			component: (resolve) => {
				require(['@/components/pay_abandon/pay_abandon'], resolve)
			},
			meta: {
				title: '订金退款'
			}
		},
		{
			path: '/commentShow',
			name: '9',
			// component: paySuccess
			component: (resolve) => {
				require(['@/components/commentOfOrder/commentShow'], resolve)
			},
			meta: {
				title: '订单评价'
			}
		},
		// ********************** lhyu
		{
			path: '/ticket',
			name: 'ticket',
			redirect: '/ticket/unused',
			component: (resolve) => {
				require(['@/components/ticket/ticket'], resolve)
			},
			children: [
				{
					path: 'unused',
					component: (resolve) => {
						require(['@/components/ticket_unused/ticket_unused'], resolve)
					}
				},
				{
					path: 'record',
					component: (resolve) => {
						require(['@/components/ticket_record/ticket_record'], resolve)
					}
				},
				{
					path: 'invalid',
					component: (resolve) => {
						require(['@/components/ticket_invalid/ticket_invalid'], resolve)
					}
				}
			]
		},
		{
			path: '/mall',
			name: 'mall',
			redirect: '/mall/all',
			component: (resolve) => {
				require(['@/components/mall/mall'], resolve)
			},
			children: [
				{
					path: 'all',
					component: (resolve) => {
						require(['@/components/mall_all/mall_all'], resolve)
					}
				},
				{
					path: 'record',
					component: (resolve) => {
						require(['@/components/mall_record/mall_record'], resolve)
					}
				}
			]
		},
		{
			path: '/tabs',
			name: 'tabs',
			component: (resolve) => {
				require(['@/components/tabs/tabs'], resolve)
			}
		}
		// ********************** lhyu
	],
	// 定义激活路由的样式
	linkActiveClass: 'active'
})
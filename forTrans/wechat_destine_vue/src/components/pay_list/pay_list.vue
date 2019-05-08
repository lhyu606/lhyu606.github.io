<template>
    <!--<div class="pay-list" @click="toPayReady">-->
    <div class="pay-list">
        <a :href="tel">
            <div class="pay-list-top-phone-button" :style="{top: y + 'px'}"></div>
        </a>
        <div class="pay-list-fixed">
            <div class="pay-list-fixed-icon"></div>
            <div class="pay-list-fixed-word">亲，卡台已经给您预留了，请在</div>
            <div class="pay-list-fixed-time">{{restTime}}</div>
            <div class="pay-list-fixed-word">内完成付款</div>
        </div>
        <div class="pay-list-scroll-wrapper" ref="payListHook">
            <div>
                <div class="pay-list-padding-top"></div>
                <div class="pay-list-top">
                    <div class="pay-list-top-circle"></div>
                    <div class="pay-list-top-title">
                        <div class="pay-list-top-title-left">
                            <img src="../../common/pic/KTVlogo.png" v-show="order.LogoUrl===''">
                            <img :src="order.LogoUrl" v-show="order.LogoUrl!==''">
                            <div class="pay-list-top-title-left-wrapper">
                                <div class="pay-list-top-title-left-up">{{order.CompanyName}}</div>
                                <div class="pay-list-top-title-left-down">{{order.CompanyAddress}}</div>
                            </div>
                        </div>
                        <div class="pay-list-top-title-right">
                            <div class="pay-list-top-title-right-border"></div>
                            <!--<a :href="tel">-->
                            <div class="pay-list-top-title-right-phone-wrapper">
                                <div class="pay-list-top-title-right-phone"></div>
                            </div>
                            <!--</a>-->
                        </div>
                    </div>
                    <div class="pay-list-top-list">
                        <div class="pay-list-top-list-item">
                            到店时间
                            <div class="pay-list-top-list-right">
                                {{UsedBeginTime}}
                            </div>
                        </div>
                        <div class="pay-list-top-list-item">
                            卡台
                            <div class="pay-list-top-list-right">
                                {{order.RoomName}}
                            </div>
                        </div>
                        <div class="pay-list-top-list-item">
                            活动
                            <div class="pay-list-top-list-right">
                                {{order.BuyBreakName}}
                            </div>
                        </div>
                    </div>
                    <!--<div class="pay-list-top-item">-->
                        <!--订单总价-->
                        <!--<div class="pay-list-top-item-right-black">￥{{order.Charge}}</div>-->
                    <!--</div>-->
                    <!--<div class="pay-list-top-item">-->
                        <!--活动优惠-->
                        <!--<div class="pay-list-top-item-right-gray">您没有优惠</div>-->
                    <!--</div>-->
                    <div class="pay-list-top-item">
                        实付金额
                        <div class="pay-list-top-item-right-pink">￥{{order.Charge}}</div>
                    </div>
                </div>
                <div class="pay-list-padding"></div>
                <div class="pay-list-middle">
                    <div class="pay-list-middle-first">
                        订单状态
                        <div class="pay-list-middle-first-right">{{order.real_status_name}}</div>
                    </div>
                    <!--<div class="pay-list-middle-second">-->
                        <!--<span v-if="payWay">使用会员卡支付</span>-->
                        <!--<span v-if="!payWay">使用微信支付</span>-->
                        <!--<div class="pay-list-middle-second-switch">-->
                            <!--<el-switch v-model="payWay" on-text="" off-text="" on-color="#cea16a" off-color="#bdbdbd"></el-switch>-->
                        <!--</div>-->
                        <!--&lt;!&ndash;饿了么的开关组件没有点击事件，并且本身不接受点击事件，把方法加在别的地方&ndash;&gt;-->
                        <!--<div class="pay-list-middle-second-switch-over" @click="changeSwitch"></div>-->
                    <!--</div>-->
                    <div class="room-shop-cart-member-card-up" @click="memberPay" v-show="cardPayShow">
                        <div class="room-shop-cart-member-card-up-member"></div>
                        使用会员卡支付
                        <div class="room-shop-cart-member-card-up-gray">使用会员卡余额支付</div>
                        <div class="room-shop-cart-member-card-up-check" v-if="payWay"></div>
                    </div>
                    <div class="room-shop-cart-member-card-down" @click="weChatPay">
                        <div class="room-shop-cart-member-card-down-we-chat"></div>
                        使用微信支付
                        <div class="room-shop-cart-member-card-down-gray">推荐微信用户在线支付使用</div>
                        <div class="room-shop-cart-member-card-down-check" v-if="!payWay"></div>
                    </div>
                    <div class="pay-list-middle-list">
                        <div class="pay-list-middle-list-item">订单编号：{{order.OperateID}}</div>
                        <div class="pay-list-middle-list-item">预订时间：{{order.DestineDateTime}}</div>
                        <div class="pay-list-middle-list-item">预订手机：{{order.GuestTel}}</div>
                    </div>
                </div>
                <div class="pay-list-bottom">
                    <div class="pay-list-bottom-up">
                        <div class="pay-list-bottom-up-icon"></div>
                        <span class="pay-list-bottom-up-word-pink">{{drawback_time}}</span>
                        <span class="pay-list-bottom-up-word">前可随时自助退款。</span>
                        <span class="pay-list-bottom-up-word">如有疑问请联系商家电话:</span>
                        <span class="pay-list-bottom-up-word-pink">{{order.RelationPhone}}</span>
                    </div>
                    <div class="pay-list-bottom-padding"></div>
                    <div class="pay-list-bottom-down">
                        <div class="pay-list-bottom-down-button-padding"></div>
                        <div class="pay-list-bottom-down-button-left" @click="openWindowCancel">取消订单</div>
                        <div class="pay-list-bottom-down-button-padding"></div>
                        <div class="pay-list-bottom-down-button-right" @click="toPayReady">立即付款</div>
                        <div class="pay-list-bottom-down-button-padding"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cardDetail-view-center" v-if="windowCancel">
            <div class="cardDetail-view-center-word">确认取消当前订单么</div>
            <div class="cardDetail-view-center-button-wrapper">
                <div class="cardDetail-view-center-button1" @click="closeWindowCancel">取消</div>
                <div class="cardDetail-view-center-button-mid"></div>
                <div class="cardDetail-view-center-button2" @click="CancelOrder">确定</div>
            </div>
        </div>
        <div class="cardDetail-view-center" v-if="windowBack">
            <div class="cardDetail-view-center-word">付款时间已到</div>
            <div class="cardDetail-view-center-button-wrapper">
                <div class="cardDetail-view-center-button2" @click="backToKtvlist">确定</div>
            </div>
        </div>
        <transition name="fade">
            <div class="cardDetail-view-mask" v-show="windowCancel" @click="closeWindowCancel"></div>
        </transition>
        <transition name="fade">
            <div class="cardDetail-view-mask" v-show="windowBack"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	import { Switch } from 'element-ui'
	export default {
		data: function () {
			return {
				order: {},
				payWay: false,
				nowDate: new Date(),
				speDate: new Date(),
                windowBack: false,
                windowCancel: false,
				cardPayShow: true,
				y: 30
            }
		},
		components: {
			elSwitch: Switch
		},
		created () {
//			let dateStr = '2018-12-12 09:09:09'
//			let arr = dateStr.split(/[- :]/)
//			let time = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
//			alert(time)
			if (typeof WeixinJSBridge === 'undefined') {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
					document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
				}
			} else {
				this.onBridgeReady()
			}
			if (this.$store.state.IP === '') {
				let href = window.location.href
				let reqUrl = href.substring(0, href.indexOf('wechat_destine/#'))
				this.$store.dispatch('setIp', reqUrl)
			}
			setInterval(() => {
				this.nowDate = new Date()
			}, 1000)
			// 调用查询订单详情接口***********************************************************************
			this.$store.dispatch('setIsLoading', true)
			this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getOrderDetail', {
					DestineOrderID: this.$route.query.DestineOrderID,
					OpenID: this.$route.query.openid,
					OperateID: this.$route.query.OperateID
				},
				{
					'emulateJSON': false,
					'headers': {
						'Content-Type': 'application/json;charset=UTF-8'
					}
				}
			).then(response => {
				this.$store.dispatch('setIsLoading', false)
				console.log('-------------------------------------------')
				console.log('调用查询订单详情接口开始')
				response = response.body
				console.log(response)
				if (response.code === '0') {
					this.order = response.data
					if (this.order.Status !== 0) {
						this.backToKtvlist()
						return
					}
					// 1.25.获取会员卡列表******************************************
					this.$store.dispatch('setIsLoading', true)
					this.$http.post(this.$store.state.IP + 'yjmemberserver/member/list/openid', {
							openid: this.$route.query.openid,
							shopno: this.order.ShopNo
						},
						{
							'emulateJSON': false
						}
					).then(response => {
						this.$store.dispatch('setIsLoading', false)
						response = response.body
						console.log(response)
						if (response.ret === 0) {
							let cardList = response.list.filter(item => {
								return item.uselinemarket === 0
							})
                            if (cardList.length === 0) {
								this.cardPayShow = false
                            }
							this.$nextTick(() => {
								this.payListScroll = new BScroll(this.$refs.payListHook, {
									click: true,
									probeType: 3
								})
								this.payListScroll.on('scroll', (pos) => {
									this.y = pos.y + 30
								})
							})
						}
						if (response.ret !== 0) {
							this.$store.dispatch('setNowToast', response.msg)
						}
					}, response => {
						this.$store.dispatch('setIsLoading', false)
					})
					// 1.25.获取会员卡列表******************************************
				}
				if (response.code !== '0') {
					console.log('返回码不是0')
					this.$store.dispatch('setNowToast', response.msg)
				}
				console.log('调用查询订单详情接口结束了')
				console.log('******************************************')
			}, response => {
				this.$store.dispatch('setIsLoading', false)
				console.log('调用查询订单详情接口失败了')
			})
			// 调用查询订单详情接口********************************************************************
		},
		computed: {
			payString () {
				if (!this.payWay) {
					return '1'
                }
                if (this.payWay) {
					return '4'
                }
            },
			tel () {
				return 'tel:' + this.order.RelationPhone
            },
			restTime () {
				if (this.order.DestineDateTime === undefined) {
					return ''
                }
				// 计算距离预留时间剩下的秒数，并且转换成分钟和秒数不断显示，如果到点就跳转弹框，点击后退
//                let totalTime = this.order.pay_expires * 60 * 1000
                let totalTime = 15 * 60 * 1000
				let timePass = totalTime - this.order.left_pay_time * 1000
				let dateStr = this.order.DestineDateTime
				let arr = dateStr.split(/[- :]/)
				let DestineDT = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
//                let DestineDT = new Date(this.order.DestineDateTime)
                let speTimeReal = DestineDT.getTime() + timePass
                let timeDef = this.speDate.getTime() - speTimeReal
                let nowTimeReal = this.nowDate.getTime() - timeDef
				let restTime = DestineDT.getTime() + totalTime - nowTimeReal
                if (restTime <= 0) {
                	return '0分0秒'
                }
                if (restTime > 0) {
                	return this.toMinute(restTime)
                }
            },
			UsedBeginTime () {
				if (this.order.UsedBeginTime === undefined) {
					return ''
                }
//				let time = new Date(this.order.UsedBeginTime)
				let dateStr = this.order.UsedBeginTime
				let arr = dateStr.split(/[- :]/)
				let time = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
				return this.testTen((time.getMonth() + 1)) + '-' + this.testTen(time.getDate()) + ' ' + this.timeFormat(time) + ' ' + this.testTen(time.getHours()) + ':' + this.testTen(time.getMinutes())
            },
			drawback_time () {
				if (this.order.drawback_time === undefined) {
					return ''
				}
//				let time = new Date(this.order.drawback_time)
				let dateStr = this.order.drawback_time
				let arr = dateStr.split(/[- :]/)
				let time = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
				return this.timeFormat(time) + '(' + this.testTen((time.getMonth() + 1)) + '-' + this.testTen(time.getDate()) + ')' + this.testTen(time.getHours()) + ':' + this.testTen(time.getMinutes())
            },
            overTime () {
	            if (this.order.drawback_time === undefined) {
		            return false
	            }
				let date = new Date()
                let dateStr = this.order.drawback_time
	            let arr = dateStr.split(/[- :]/)
	            let time = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
                if (this.getTimeCompare(date, time)) {
					return true
                }
                if (!this.getTimeCompare(date, time)) {
					return false
                }
            }
        },
		watch: {
			restTime () {
				if (!this.order.DestineDateTime) {
					return
                }
                if (this.restTime === '0分0秒') {
					this.windowBack = true
                }
            }
        },
		methods: {
			onBridgeReady () {
				WeixinJSBridge.call('hideOptionMenu')
			},
			CancelOrder () {
				// 调用未支付撤单接口***********************************************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/Order/cancel', {
						OpenID: this.$route.query.openid,
						CompanyID: this.order.ShopNo,
						OperateID: this.order.OperateID,
						CancelMemo: ''
					},
					{
						'emulateJSON': false,
						'headers': {
							'Content-Type': 'application/json;charset=UTF-8'
						}
					}
				).then(response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('-------------------------------------------')
					console.log('调用未支付撤单接口开始')
					response = response.body
					console.log(response)
					if (response.code === '0') {
						this.closeWindowCancel()
						history.go(-1)
					}
					if (response.code !== '0') {
						console.log('返回码不是0')
						this.$store.dispatch('setNowToast', response.msg)
					}
					console.log('调用未支付撤单接口结束了')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('调用未支付撤单接口失败了')
				})
				// 调用未支付撤单接口********************************************************************
            },
			closeWindowCancel () {
				this.windowCancel = false
            },
			openWindowCancel () {
				this.windowCancel = true
            },
			backToKtvlist () {
				this.windowBack = false
				history.go(-1)
            },
			toMinute (time) {
				let seconds = parseInt(time / 1000)
                let m = parseInt(seconds / 60)
                let s = seconds % 60
                return m + '分' + s + '秒'
            },
			getTimeCompare (date1, date2) {
				if (date1.getTime() >= date2.getTime()) {
					return true
                }
				if (date1.getTime() < date2.getTime()) {
					return false
                }
            },
			testTen (test) {
				if (test < 10) {
					return '0' + test
				}
				if (test > 9) {
					return '' + test
				}
			},
			dateToString (date) {
				return date.getFullYear() + '-' + this.testTen(date.getMonth() + 1) + '-' + date.getDate()
			},
			timeFormat (time) {
                let y = time.getUTCDay()
				let yString = ''
				if (y === 1) {
					yString = '周一'
				}
				if (y === 2) {
					yString = '周二'
				}
				if (y === 3) {
					yString = '周三'
				}
				if (y === 4) {
					yString = '周四'
				}
				if (y === 5) {
					yString = '周五'
				}
				if (y === 6) {
					yString = '周六'
				}
				if (y === 0) {
					yString = '周日'
				}
				let date1 = new Date()
				let date2 = new Date()
				date2.setDate(date1.getDate() + 1)
				let date3 = new Date()
				date3.setDate(date1.getDate() + 2)
				if (this.dateToString(date1) === this.dateToString(time)) {
					yString = '今天'
				}
				if (this.dateToString(date2) === this.dateToString(time)) {
					yString = '明天'
				}
				if (this.dateToString(date3) === this.dateToString(time)) {
					yString = '后天'
				}
				return yString
			},
//			changeSwitch () {
//				this.payWay = !this.payWay
//            },
			weChatPay () {
				this.payWay	= false
			},
			memberPay () {
				this.payWay = true
			},
			toPayReady () {
				// 调用预定下单确定支付方式接口***********************************************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/Order/updatePayType', {
						OpenID: this.$route.query.openid,
						CompanyID: this.order.ShopNo,
						OperateID: this.order.OperateID,
						PayType: this.payString
					},
					{
						'emulateJSON': false,
						'headers': {
							'Content-Type': 'application/json;charset=UTF-8'
						}
					}
				).then(response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('-------------------------------------------')
					console.log('调用预定下单确定支付方式接口开始')
					response = response.body
					console.log(response)
					if (response.code === '0') {
//                        this.$router.push({path: 'pay_ready', query: {openid: this.$route.query.openid, DestineOrderID: this.$route.query.DestineOrderID, OperateID: this.$route.query.OperateID}})
						window.location.href = this.$store.state.IP + 'wechat_order_service/#/pay_ready_destine?openid=' + this.$route.query.openid + '&DestineOrderID=' + this.$route.query.DestineOrderID + '&OperateID=' + this.$route.query.OperateID
					}
					if (response.code !== '0') {
						console.log('返回码不是0')
						this.$store.dispatch('setNowToast', response.msg)
					}
					console.log('调用预定下单确定支付方式接口结束了')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('调用预定下单确定支付方式接口失败了')
				})
				// 调用预定下单确定支付方式接口********************************************************************
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .pay-list
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        background #201c19
        .pay-list-top-phone-button
            position absolute
            width 80px
            height 80px
            background rgba(0,0,0,0)
            right 0
            top 10px
            z-index 1000
        .pay-list-fixed
            position absolute
            left 0
            top 0
            width 100%
            height 20px
            line-height 20px
            z-index 1001
            background #fef5d4
            font-size 0
            text-align center
            .pay-list-fixed-icon
                display inline-block
                vertical-align top
                height 15px
                width 15px
                background-image: url("../../common/pic/tip.png")
                background-size: 15px 15px
                background-repeat: no-repeat
                margin-top 2px
                margin-right 5px
            .pay-list-fixed-word
                font-size 10px
                display inline-block
                vertical-align top
            .pay-list-fixed-time
                font-size 10px
                display inline-block
                vertical-align top
                color #cea16a
            .pay-list-fixed-word
                font-size 10px
                display inline-block
                vertical-align top
        .pay-list-scroll-wrapper
            width 100%
            position absolute
            top 20px
            bottom 0
            left 0
            background #201c19
            overflow hidden
            .pay-list-padding-top
                width 100%
                height 10px
                background #201c19
                position relative
                z-index 2
            .pay-list-top
                width 100%
                height 220px
                position relative
                background #fff
                border-top 1px solid #423c31
                border-bottom 1px solid rgba(0,0,0,0.5)
                .pay-list-top-circle
                    position absolute
                    left 50%
                    top 0
                    transform translate(-50%,-50%)
                    width 20px
                    height 20px
                    border-radius 50%
                    background #201c19
                    border 1px solid rgba(0,0,0,0.1)
                .pay-list-top-title
                    width 100%
                    height 80px
                    border-bottom 2px dotted #cea16a
                    display flex
                    background #423c31
                    color #cea16a
                    .pay-list-top-title-left
                        flex 1
                        height 80px
                        padding 15px
                        img
                            width 50px
                            height 50px
                            border-radius 3px
                        .pay-list-top-title-left-wrapper
                            display inline-block
                            vertical-align top
                            margin-left 10px
                            .pay-list-top-title-left-up
                                font-size 15px
                                margin-bottom 3px
                                margin-top 3px
                            .pay-list-top-title-left-down
                                font-size 10px
                                color rgba(0,0,0,0.5)
                    .pay-list-top-title-right
                        flex 0 0 80px
                        height 80px
                        position: relative
                        .pay-list-top-title-right-border
                            position: absolute
                            width 1px
                            height 40px
                            left 0
                            top 20px
                            background rgba(0,0,0,0.1)
                        .pay-list-top-title-right-phone-wrapper
                            height 100%
                            width 79px
                            position absolute
                            right 0
                            top 0
                            background rgba(0,0,0,0)
                            .pay-list-top-title-right-phone
                                position absolute
                                right 25px
                                top 25px
                                display inline-block
                                vertical-align top
                                background-repeat no-repeat
                                background-size 30px 30px
                                width: 30px
                                height: 30px
                                background-image: url("../../common/pic/phone.png")
                .pay-list-top-list
                    width 100%
                    height 100px
                    padding 15px
                    background #423c31
                    .pay-list-top-list-item
                        color rgba(255,255,255,0.7)
                        margin-bottom 5px
                        .pay-list-top-list-right
                            float right
                            color #cea16a
                .pay-list-top-item
                    width 100%
                    height 40px
                    border-top 1px solid rgba(0,0,0,0.1)
                    line-height 40px
                    font-size 15px
                    color rgba(255,255,255,0.7)
                    padding 0 15px
                    background #423c31
                    .pay-list-top-item-right-black
                        float right
                        color rgba(0,0,0,1)
                    .pay-list-top-item-right-gray
                        float right
                        color rgba(0,0,0,0.5)
                    .pay-list-top-item-right-pink
                        float right
                        color #cea16a
            .pay-list-padding
                width 100%
                height 10px
                background #201c19
            .pay-list-middle
                width 100%
                /*height 245px*/
                background #423c31
                border-top 1px solid rgba(0,0,0,0.1)
                border-bottom 1px solid rgba(0,0,0,0.1)
                color #cea16a
                .pay-list-middle-first
                    width 100%
                    height 45px
                    border-bottom 1px solid rgba(0,0,0,0.1)
                    font-size 15px
                    padding 0 15px
                    line-height 45px
                    .pay-list-middle-first-right
                        float right
                        color #cea16a
                        font-size 13px
                .room-shop-cart-member-card-up
                    position relative
                    width 100%
                    height 60px
                    line-height 40px
                    background #423c31
                    border-bottom 1px solid rgba(0,0,0,0.4)
                    padding 0 75px
                    font-size 17px
                    .room-shop-cart-member-card-up-gray
                        margin-top -15px
                        font-size 14px
                        color rgba(255,255,255,0.7)
                    .room-shop-cart-member-card-up-member
                        position absolute
                        left 20px
                        top 5px
                        width: 50px
                        height: 50px
                        background-image: url("../../common/pic/VIP.png")
                        background-size: 50px 50px
                        background-repeat: no-repeat
                    .room-shop-cart-member-card-up-check
                        position absolute
                        right 10px
                        top 15px
                        width: 30px
                        height: 30px
                        background-image: url("../../common/pic/comboSelect.png")
                        background-size: 30px 30px
                        background-repeat: no-repeat
                .room-shop-cart-member-card-down
                    position relative
                    width 100%
                    height 60px
                    line-height 40px
                    background #423c31
                    border-bottom 1px solid rgba(0,0,0,0.1)
                    padding 0 75px
                    font-size 17px
                    .room-shop-cart-member-card-down-gray
                        margin-top -15px
                        font-size 14px
                        color rgba(255,255,255,0.7)
                    .room-shop-cart-member-card-down-we-chat
                        position absolute
                        left 20px
                        top 5px
                        width: 50px
                        height: 50px
                        background-image: url("../../common/pic/weChat.png")
                        background-size: 50px 50px
                        background-repeat: no-repeat
                        border-radius 3px
                    .room-shop-cart-member-card-down-check
                        position absolute
                        right 10px
                        top 15px
                        width: 30px
                        height: 30px
                        background-image: url("../../common/pic/comboSelect.png")
                        background-size: 30px 30px
                        background-repeat: no-repeat
                /*.pay-list-middle-second
                    width 100%
                    height 45px
                    border-bottom 1px solid rgba(0,0,0,0.1)
                    font-size 15px
                    padding 0 15px
                    line-height 45px
                    position relative
                    .pay-list-middle-second-switch
                        display inline-block
                        vertical-align top
                        position absolute
                        right 15px
                        top -2px
                    .pay-list-middle-second-switch-over
                        display inline-block
                        position absolute
                        width 46px
                        height 44px
                        right 15px
                        top 0
                        z-index 100 */
                .pay-list-middle-list
                    width 100%
                    height 80px
                    padding 7px 15px
                    color rgba(255,255,255,0.7)
            .pay-list-bottom
                width 100%
                height 130px
                background #201c19
                padding 10px
                .pay-list-bottom-up
                    width 100%
                    height 42px
                    color rgba(255,255,255,0.7)
                    .pay-list-bottom-up-icon
                        margin-top 3px
                        display inline-block
                        vertical-align top
                        background-repeat no-repeat
                        background-size 15px 15px
                        width: 15px
                        height: 15px
                        background-image: url("../../common/pic/tip.png")
                    .pay-list-bottom-up-word-pink
                        font-size 13px
                        color #cea16a
                    .pay-list-bottom-up-word
                        font-size 13px
                .pay-list-bottom-padding
                    width 100%
                    height 10px
                .pay-list-bottom-down
                    width 100%
                    height 50px
                    display flex
                    .pay-list-bottom-down-button-padding
                        height 50px
                        flex 0 0 15px
                    .pay-list-bottom-down-button-left
                        height 50px
                        flex 1
                        border 2px solid #cea16a
                        color #cea16a
                        border-radius 3px
                        font-size 17px
                        line-height 46px
                        text-align center
                    .pay-list-bottom-down-button-right
                        text-align center
                        line-height 50px
                        font-size 17px
                        border-radius 3px
                        height 50px
                        flex 1
                        color #fff
                        background #cea16a
        .cardDetail-view-center
            position fixed
            width 230px
            margin 0 auto
            left 0
            right 0
            top 40%
            z-index 151
            border-radius 7px
            background #423c31
            .cardDetail-view-center-word
                height 60px
                width 100%
                padding 20px 20px 0 20px
                text-align center
                color #999999
            .cardDetail-view-center-button-wrapper
                display flex
                width 200px
                height 25px
                margin 0 auto 15px
                left 0
                right 0
                .cardDetail-view-center-button-mid
                    flex 0 0 10px
                    height 25px
                .cardDetail-view-center-button1
                    flex 1
                    height 25px
                    background #201c19
                    color #cea16a
                    text-align center
                    line-height 25px
                    border-radius 4px
                    border 1px solid #cea16a
                .cardDetail-view-center-button2
                    flex 1
                    height 25px
                    background #cea16a
                    color #fff
                    text-align center
                    line-height 25px
                    border-radius 4px
        .cardDetail-view-mask
            position: fixed
            top: 0
            left: 0
            width: 100%
            height: 100%
            z-index 150
            backdrop-filter: blur(10px)
            opacity: 1
            background: rgba(7, 17, 27, 0.6)
            &.fade-enter-active, &.fade-leave-active
                transition: all 0.3s
            &.fade-enter, &.fade-leave-active
                opacity: 0
                background: rgba(7, 17, 27, 0)
</style>

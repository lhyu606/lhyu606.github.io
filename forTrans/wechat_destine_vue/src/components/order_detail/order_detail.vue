<template>
    <div class="order-detail">
        <a :href="tel">
            <div class="order-detail-top-phone-button" :style="{top: y + 'px'}"></div>
        </a>
        <div class="order-detail-scroll-wrapper" ref="payListHook">
            <div>
                <div class="order-detail-padding-top"></div>
                <div class="order-detail-card" v-for="(item) in order" :key="item.virtualOrderDetailId">
                    <div class="order-detail-top">
                        <div class="order-detail-top-circle"></div>
                        <div class="order-detail-top-title">
                            <div class="order-detail-top-title-left">
                                <img :src="item.iconUrl" v-show="item.iconUrl!==''">
                                <img src="../../common/pic/KTVlogo.png" v-show="item.iconUrl===''">
                                <span class="">{{ item.goodName }}</span>
                            </div>
                        </div>
                        <div class="order-detail-top-list">
                            <div class="order-detail-top-list-item">
                                订单创建时间
                                <div class="order-detail-top-list-right">
                                {{item.beginTime}}
                                </div>
                            </div>
                            <div class="order-detail-top-list-item">
                                价格
                                <div class="order-detail-top-list-right">
                                {{item.cashPrice}}
                                </div>
                            </div>
                            <div class="order-detail-top-list-item">
                                核销状态
                                <div class="order-detail-top-list-right">
                                {{ checkStatusToText(item.checkStatus) }}
                                </div>
                            </div>
                            <div class="order-detail-top-list-item">
                                订单核销时间
                                <div class="order-detail-top-list-right">
                                {{ item.checkTime }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cardDetail-view-center" v-if="windowBack">
            <div class="cardDetail-view-center-word">确认退款当前订单么</div>
            <div class="cardDetail-view-center-button-wrapper">
                <div class="cardDetail-view-center-button1" @click="closeWindowBack">取消</div>
                <div class="cardDetail-view-center-button-mid"></div>
                <div class="cardDetail-view-center-button2" @click="toPayAbandon">确定</div>
            </div>
        </div>
        <transition name="fade">
            <div class="cardDetail-view-mask" v-show="windowBack" @click="closeWindowBack"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	export default {
		data: function () {
			return {
				order: {},
				payWay: false,
				windowBack: false,
                y: 10
			}
		},
		computed: {
			tel () {
				return 'tel:' + this.order.RelationPhone
			},
			UsedBeginTime () {
				if (this.order.UsedBeginTime === undefined) {
					return ''
				}
				let time = this.stringToDate(this.order.UsedBeginTime)
				return this.testTen((time.getMonth() + 1)) + '-' + this.testTen(time.getDate()) + ' ' + this.timeFormat(time) + ' ' + this.testTen(time.getHours()) + ':' + this.testTen(time.getMinutes())
			},
			drawback_time () {
				if (this.order.drawback_time === undefined) {
					return ''
				}
				let time = this.stringToDate(this.order.drawback_time)
				return this.timeFormat(time) + '(' + this.testTen((time.getMonth() + 1)) + '-' + this.testTen(time.getDate()) + ')' + this.testTen(time.getHours()) + ':' + this.testTen(time.getMinutes())
			},
			PayType () {
				if (this.order.PayType === undefined) {
					return ''
				}
				if (this.order.PayType === 1) {
					return '微信'
				}
				if (this.order.PayType === 2) {
					return '支付宝'
				}
				if (this.order.PayType === 3) {
					return '微信APP'
				}
				if (this.order.PayType === 4) {
					return '电子会员卡'
				}
            },
			Status () {
				if (this.order.Status === undefined) {
					return ''
                }
                if (this.order.Status === 0) {
	                return '已下单'
                }
                if (this.order.Status === 1) {
	                return '已付款未锁定'
                }
                if (this.order.Status === 2) {
	                return '已锁定未发送付款通知'
                }
                if (this.order.Status === 3) {
	                return '已付款'
                }
                if (this.order.Status === 4) {
	                return '已消费'
                }
                if (this.order.Status === 5) {
	                return '未付款已撤单'
                }
                if (this.order.Status === 6) {
	                return '已退款'
                }
                if (this.order.Status === 7) {
	                return '已撤单'
                }
            },
			overTime () {
				if (this.order.drawback_time === undefined) {
					return false
				}
				let date = new Date()
				let time = this.stringToDate(this.order.drawback_time)
				if (this.getTimeCompare(date, time)) {
					return true
				}
				if (!this.getTimeCompare(date, time)) {
					return false
				}
			}
        },
		created () {console.log(99)
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
            // 调用查询订单详情接口***********************************************************************
            console.log(this.$route.query.payOrderId)
			this.$store.dispatch('setIsLoading', true)
			this.$http.post(this.$store.state.IP + 'virtual/order/query/detail', {
					access_token: '',
                    companycode: '',
                    timestamp: '',
                    signature: '',
                    // wechatPubId: this.$route.query.weChatId,
                    data: {
                        payorderid: this.$route.query.payOrderId
                        }
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
				if (response.ret === '0') {
                    this.order = response.data
                    // this.order = this.order.concat(this.order[0])
                    // console.log(this.order)
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
		methods: {
            closeWindowBack () {
				this.windowBack = false
            },
			openWindowBack () {
				this.windowBack = true
            },
			checkStatusToText (checkStatus) {
                // 核销状态 0 已付款 ,1已核销 ,2已撤单，3已退款
                let text = ''
                switch (checkStatus) {
                    case 0:
                        text = '已付款'
                        break
                    case 1:
                        text = '已核销'
                        break
                    case 2:
                        text = '已撤单'
                        break
                    case 3:
                        text = '已退款'
                        break
                }
                return text
            }
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .order-detail
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        background #201c19
        color rgba(255,255,255,0.7)
        .order-detail-top-phone-button
            position absolute
            width 80px
            height 80px
            background rgba(0,0,0,0)
            right 0
            top 10px
            z-index 1000
        .order-detail-scroll-wrapper
            width 100%
            position absolute
            top 0
            bottom 0
            left 0
            background #201c19
            overflow hidden
            .order-detail-card
                margin-top 15px
                overflow hidden
            .order-detail-padding-top
                width 100%
                height 10px
                background #201c19
                position relative
                z-index 2
            .order-detail-top
                width 100%
                /*height 300px*/
                position relative
                background #423c31
                border-top 1px solid #cea16a
                border-bottom 1px solid #cea16a
                .order-detail-top-circle
                    position absolute
                    left 50%
                    top 0
                    transform translate(-50%,-50%)
                    width 20px
                    height 20px
                    border-radius 50%
                    background #201c19
                    border 1px solid #cea16a
                .order-detail-top-title
                    width 100%
                    height 80px
                    display flex
                    .order-detail-top-title-left
                        flex 1
                        height 80px
                        padding 15px
                        background #423c31
                        border-bottom  1px solid #cea16a
                        img
                            width 50px
                            height 50px
                            border-radius 3px
                            vertical-align middle
                        span
                            margin-left 15px
                            vertical-align middle
                        .order-detail-top-title-left-wrapper
                            display inline-block
                            vertical-align top
                            margin-left 10px
                            .order-detail-top-title-left-up
                                font-size 15px
                                margin-bottom 3px
                                margin-top 3px
                            .order-detail-top-title-left-down
                                font-size 10px
                                color rgba(255,255,255,0.7)
                    .order-detail-top-title-right
                        flex 0 0 80px
                        height 80px
                        position: relative
                        .order-detail-top-title-right-border
                            position: absolute
                            width 1px
                            height 40px
                            left 0
                            top 20px
                            background #cea16a
                        .order-detail-top-title-right-phone-wrapper
                            height 100%
                            width 79px
                            position absolute
                            right 0
                            top 0
                            background #423c31
                            .order-detail-top-title-right-phone
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
                .order-detail-top-check
                    width 100%
                    height 80px
                    padding-top 20px
                    border-top 2px dotted #cea16a
                    .order-detail-top-check-top
                        width 100%
                        text-align center
                        .order-detail-top-check-top-left
                            display inline-block
                            vertical-align top
                            height 27px
                            line-height 27px
                        .order-detail-top-check-top-right
                            display inline-block
                            vertical-align top
                            font-size 18px
                            color #cea16a
                    .order-detail-top-check-down
                        width 100%
                        text-align center
                        color rgba(255,255,255,0.7)
                .order-detail-top-list
                    width 100%
                    // height 100px
                    padding 15px
                    .order-detail-top-list-item
                        color rgba(255,255,255,0.7)
                        margin-bottom 5px
                        .order-detail-top-list-right
                            float right
                            color rgba(255,255,255,0.7)
                .order-detail-top-item
                    width 100%
                    height 40px
                    border-top 1px solid rgba(0,0,0,0.1)
                    line-height 40px
                    font-size 15px
                    padding 0 15px
                    .order-detail-top-item-right-black
                        float right
                        color rgba(255,255,255,0.7)
                    .order-detail-top-item-right-gray
                        float right
                        color rgba(255,255,255,0.7)
                    .order-detail-top-item-right-pink
                        float right
                        color #cea16a
            .order-detail-padding
                width 100%
                height 10px
                background #201c19
            .order-detail-middle
                width 100%
                /*height 145px*/
                background #423c31
                border-top 1px solid #cea16a
                border-bottom 1px solid #cea16a
                .order-detail-middle-first
                    width 100%
                    height 45px
                    border-bottom 1px solid #cea16a
                    font-size 15px
                    padding 0 15px
                    line-height 45px
                    .order-detail-middle-first-right
                        float right
                        color #cea16a
                        font-size 13px
                .order-detail-middle-list
                    width 100%
                    padding 7px 15px
                    color rgba(255,255,255,0.7)
            .order-detail-comment
                width 100%
                height 45px
                background #423c31
                line-height 45px
                padding 0 15px
                position relative
                border-top 1px solid rgba(0,0,0,0.1)
                border-bottom 1px solid rgba(0,0,0,0.1)
                .choice-detail-comment-icon
                    right 8px
                    top 12.5px
                    position absolute
                    display inline-block
                    vertical-align top
                    height 20px
                    width 20px
                    background-image: url("../../common/pic/pullUp.png")
                    background-size: 20px 20px
                    background-repeat: no-repeat
            .order-detail-bottom
                width 100%
                height 130px
                background #201c19
                padding 10px
                color rgba(255,255,255,0.7)
                .order-detail-bottom-up
                    width 100%
                    height 42px
                    .order-detail-bottom-up-icon
                        margin-top 3px
                        display inline-block
                        vertical-align top
                        background-repeat no-repeat
                        background-size 15px 15px
                        width: 15px
                        height: 15px
                        background-image: url("../../common/pic/tip.png")
                    .order-detail-bottom-up-word-pink
                        font-size 13px
                        color #cea16a
                    .order-detail-bottom-up-word
                        font-size 13px
                .order-detail-bottom-padding
                    width 100%
                    height 10px
                .order-detail-bottom-down
                    width 100%
                    height 50px
                    .order-detail-bottom-down-button
                        margin 0 auto
                        left 0
                        right 0
                        height 50px
                        width 160px
                        border 2px solid #cea16a
                        color #cea16a
                        border-radius 3px
                        font-size 17px
                        line-height 46px
                        text-align center
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
                color rgba(255,255,255,0.7)
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

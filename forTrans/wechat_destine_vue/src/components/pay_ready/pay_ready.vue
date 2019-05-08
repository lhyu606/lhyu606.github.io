<template>
    <div class="pay-destine-web-goods">
        <div class="pay-destine-web-goods-tip">
            <span class="pay-destine-web-goods-tip-icon"></span>
            <span class="pay-destine-web-goods-tip-word">付款可能存在延时，请勿重复支付噢！</span>
        </div>
        <div class="pay-destine-web-goods-item-wrapper">
            <div class="pay-destine-web-goods-item">订单编号
                <span class="pay-destine-web-goods-word">{{order.OperateID}}</span>
            </div>
            <div class="pay-destine-web-goods-item">预订内容
                <span class="pay-destine-web-goods-word">{{order.BuyBreakName}}</span>
            </div>
            <div class="pay-destine-web-goods-item">支付金额
                <span class="pay-destine-web-goods-word orange">￥{{order.Charge}}</span>
            </div>
        </div>
        <div class="pay-destine-web-goods-padding"></div>
        <div class="pay-destine-web-goods-member-pay-no-card" v-if="payWay&&cardList.length===0">无可用会员卡</div>
        <div class="pay-destine-web-goods-member-pay" v-if="payWay&&cardList.length>0">
            <div class="pay-destine-web-goods-member-pay-title">会员卡支付</div>
            <div class="pay-destine-web-goods-member-pay-content" v-for="(item,index) in cardList" v-show="item.useroombook!==1">
                <div class="pay-destine-web-goods-member-pay-img">
                    <img :src="item.cardlogourl" v-show="item.cardlogourl">
                    <div class="default" v-show="!item.cardlogourl">{{item.gradename}}</div>
                </div>
                <div class="pay-destine-web-goods-member-pay-word">
                    <div class="pay-destine-web-goods-member-pay-word-up">{{item.gradename}}</div>
                    <div class="pay-destine-web-goods-member-pay-word-mid">卡号:{{item.cardnum}}</div>
                    <div class="pay-destine-web-goods-member-pay-word-down">
                        <div class="pay-destine-web-goods-member-pay-word-down-left">
                            <span class="orange">￥{{item.accountcash}}</span>
                            <span class="weak">本金</span>
                        </div>
                        <div class="pay-destine-web-goods-member-pay-word-down-right">
                            <span class="orange">￥{{item.accountpresent}}</span>
                            <span class="weak">赠送</span>
                        </div>
                    </div>
                </div>
                <div class="pay-destine-web-goods-radio-in" @click="select(index)">
                    <span class="pay-destine-web-goods-radio-in-icon" v-show="index===selectCard"></span>
                    <span class="pay-destine-web-goods-radio-in-icon-no" v-show="index!==selectCard"></span>
                </div>
            </div>
        </div>
        <div class="pay-destine-web-goods-we-chat-pay" v-if="!payWay">
            <div class="pay-destine-web-goods-we-chat-pay-title">选择支付方式</div>
            <div class="pay-destine-web-goods-we-chat-pay-content">
                <div class="pay-destine-web-goods-we-chat-pay-img">
                    <img src="../../common/pic/weChat.png">
                </div>
                <div class="pay-destine-web-goods-we-chat-pay-word">
                    <div class="pay-destine-web-goods-we-chat-pay-word-up">微信支付</div>
                    <div class="pay-destine-web-goods-we-chat-pay-word-down">推荐微信用户使用</div>
                </div>
            </div>
            <div class="pay-destine-web-goods-radio">
                <span class="pay-destine-web-goods-radio-icon"></span>
            </div>
        </div>
        <div class="pay-destine-web-goods-padding"></div>
        <div class="pay-destine-web-goods-pay-button" @click="toPay" v-if="!payWay">确认支付</div>
        <div class="pay-destine-web-goods-pay-button-wrapper">
            <div class="pay-destine-web-goods-pay-button-in" @click="toCardPay" v-if="payWay">确认支付</div>
        </div>
        <div class="pay-destine-web-goods-padding"></div>
        <toast v-model="toastShow" :text="toastText" type="text" :time="toastTime" position="middle"></toast>
        <div class="fillInInf-tip" v-show="showV">
            <div class="fillInInf-tip-picV"></div>
            <div class="fillInInf-tip-word">验证码发送成功</div>
        </div>
        <div class="pay-destine-web-goods-view-center-password" v-if="passWordWindow">
            <div class="pay-destine-web-goods-view-center-password-top">
                请输入支付密码
                <div class="pay-destine-web-goods-view-center-password-top-left" @click="closePassWordWindow">取消</div>
                <div class="pay-destine-web-goods-view-center-password-top-right" @click="passwordPay">确认</div>
            </div>
            <div class="pay-destine-web-goods-view-center-password-word-up">
                <div class="pay-destine-web-goods-view-center-password-word-up-up">{{cardList[selectCard].gradename}}支付</div>
                <div class="pay-destine-web-goods-view-center-password-word-up-down">￥{{totalPrice}}</div>
            </div>
            <div class="pay-destine-web-goods-view-center-password-word-input-wrapper">
                <input placeholder="请输入支付密码" type="password" v-model="passWord" class="pay-destine-web-goods-view-center-password-word-input"/>
            </div>
            <div class="pay-destine-web-goods-view-center-password-word-down">
                <div class="pay-destine-web-goods-view-center-password-word-down-up">1.请联系商家获取初始密码</div>
                <div class="pay-destine-web-goods-view-center-password-word-down-down">2.若需修改密码，请移步商家平台</div>
            </div>
        </div>
        <div class="pay-destine-web-goods-view-center-message" v-if="messageWindow">
            <div class="pay-destine-web-goods-view-center-message-top">付款确认</div>
            <div class="pay-destine-web-goods-view-center-message-word-wrapper">
                本次交易需要短信确认，校验码已发送至您手机{{mobile}}
            </div>
            <div class="pay-destine-web-goods-view-center-message-input-wrapper">
                <input placeholder="请输入短信验证码" v-model="vertifyCode" class="pay-destine-web-goods-view-center-message-input"/>
                <div class="pay-destine-web-goods-view-center-message-input-button" @click="sendCode" v-show="cutDown===60">发送验证码</div>
                <div class="pay-destine-web-goods-view-center-message-input-button-gray" v-show="cutDown<60">{{cutDown}}秒</div>
            </div>
            <div class="pay-destine-web-goods-view-center-message-button-wrapper">
                <div class="pay-destine-web-goods-view-center-button1" @click="closeMessageWindow">取消</div>
                <div class="pay-destine-web-goods-view-center-button-mid"></div>
                <div class="pay-destine-web-goods-view-center-button2" @click="messagePay">确定</div>
            </div>
        </div>
        <transition name="fade">
            <div class="cardDetail-view-mask" v-show="messageWindow" @click="closeMessageWindow"></div>
        </transition>
        <transition name="fade">
            <div class="cardDetail-view-mask" v-show="passWordWindow" @click="closePassWordWindow"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
	//  import _ from 'lodash'
	import { Toast } from 'vux'
	//  import Vue from 'vue'
	export default {
		data: function () {
			return {
//	          radio: '',
//              orderNumber: '',
				// toast的显示设置
                order: {},
				toastShow: false,
				toastTime: 3500,
				toastText: '',
				cardList: [],
				selectCard: 0,
				showV: false,
				messageWindow: false,
				passWordWindow: false,
				vertifyCode: '',
				passWord: '',
				mobile: '',
				cutDown: 60,
				interval: {}
			}
		},
		components: {
			Toast
		},
		watch: {
			cutDown () {
				if (this.cutDown <= 0) {
					this.cutDown = 60
					clearInterval(this.interval)
				}
			}
		},
		methods: {
			passwordPay () {
				if (this.passWord === '') {
					this.$store.dispatch('setNowToast', '请输入密码')
					return
				}
				// 调用 密码验证接口******************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'yjmemberserver/member/password/verfity', {
						password: this.passWord,
						ecardid: this.cardList[this.selectCard].ecardid
					},
					{
						'emulateJSON': false
					}
				).then(response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('-------------------------------------------')
					console.log('forgetPassWord页的3.2校验验证码接口开始')
					response = response.body
					console.log(response)
					if (response.ret === 0) {
						console.log('返回码是0')
						this.toPayCardWay(this.passWord)
					}
					if (response.ret !== 0) {
						console.log('返回码不是0')
						this.toastShow = true
						this.toastText = response.msg
					}
					console.log('forgetPassWord页的3.2校验验证码接口结束')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('调用forgetPassWord页的3.2校验验证码接口失败了')
				})
				// 调用 密码验证接口******************************************
			},
			messagePay () {
				if (this.vertifyCode === '') {
					this.$store.dispatch('setNowToast', '请输入验证码')
					return
				}
				// 调用 3.3发送短信验证码接口******************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'yjmemberserver/system/check/validation_code', {
						validationcode: this.vertifyCode,
						mobile: this.cardList[this.selectCard].mobile
					},
					{
						'emulateJSON': false
					}
				).then(response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('-------------------------------------------')
					console.log('forgetPassWord页的3.2校验验证码接口开始')
					response = response.body
					console.log(response)
					if (response.ret === 0) {
						console.log('返回码是0')
						this.toPayCardWay('')
					}
					if (response.ret !== 0) {
						console.log('返回码不是0')
						this.toastShow = true
						this.toastText = response.msg
					}
					console.log('forgetPassWord页的3.2校验验证码接口结束')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('调用forgetPassWord页的3.2校验验证码接口失败了')
				})
				// 调用 3.3发送短信验证码接口******************************************
			},
			sendCode () {
				// 调用 3.3发送短信验证码接口******************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'yjmemberserver/system/send/validation_code', {
						shopno: this.order.ShopNo,
						mobile: this.cardList[this.selectCard].mobile
					},
					{
						'emulateJSON': false
					}
				).then(response => {
					this.$store.dispatch('setIsLoading', false)
					response = response.body
					if (response.ret === 0) {
//                      alert(response.validationcode)
						this.showV = true
						setTimeout(() => {
							this.showV = false
						}, 800)
						this.cutDown = 60
						this.interval = setInterval(() => {
							this.cutDown--
						}, 1000)
					}
					if (response.ret !== 0) {
						this.toastShow = true
						this.toastText = response.msg
					}
				}, response => {
					this.$store.dispatch('setIsLoading', false)
				})
				// 调用 3.3发送短信验证码接口******************************************
			},
			closeMessageWindow () {
				this.messageWindow = false
			},
			closePassWordWindow () {
				this.passWordWindow = false
			},
			select (index) {
				this.selectCard = index
			},
			toPayCardWay (passWord) {
				if (this.cardList.length === 0) {
					this.toastShow = true
					this.toastText = '没有可用会员卡'
					return
				}
//				alert(this.cardList[this.selectCard].ecardid)
				// 完成会员卡支付
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/Order/pay', {
                        OpenID: this.$route.query.openid,
                        CompanyID: this.order.ShopNo,
                        OperateID: this.order.OperateID,
                        EcardID: this.cardList[this.selectCard].ecardid,
                        memberpwd: passWord
                    },
					{
						'emulateJSON': false,
						'headers': {
							'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(response => {
					this.$store.dispatch('setIsLoading', false)
					response = response.body
					if (response.code === '0') {
						console.log(response.result)
						this.$router.push({path: 'pay_success', query: {openid: this.$route.query.openid, DestineOrderID: this.$route.query.DestineOrderID, OperateID: this.$route.query.OperateID}})
					}
					if (response.code !== '0') {
						this.toastShow = true
						this.toastText = response.msg
					}
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					this.toastShow = true
					this.toastText = '通讯失败'
				})
				// 完成会员卡支付
			},
			toCardPay () {
				// 1.25.获取会员卡列表******************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'yjmemberserver/member/pay/verfity', {
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
						if (response.result === 0) {
							this.toPayCardWay('')
						}
						if (response.result === 1) {
//                          alert(this.cardList[this.selectCard].mobile)
//                          alert(this.cardList[this.selectCard].ecardid)
							this.passWordWindow = true
						}
						if (response.result === 2) {
							let before = this.cardList[this.selectCard].mobile.substring(0, 3)
							let after = this.cardList[this.selectCard].mobile.substring(7)
							this.mobile = before + '****' + after
							this.messageWindow = true
							if (this.cutDown === 60) {
								this.sendCode()
							}
						}
					}
					if (response.ret !== 0) {
						this.toastShow = true
						this.toastText = response.msg
					}
				}, response => {
					this.$store.dispatch('setIsLoading', false)
				})
				// 1.25.获取会员卡列表******************************************
			},
			toPay () {
				// 请求微信支付配置
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/Order/pay', {
						OperateID: this.order.OperateID,
						OpenID: this.$route.query.openid,
						CompanyID: this.order.ShopNo
					},
					{
						'emulateJSON': false,
						'headers': {
							'Content-Type': 'application/json;charset=UTF-8'
                    }
				}).then(response => {
					this.$store.dispatch('setIsLoading', false)
					response = response.body
					if (response.code === '0') {
						this.jsApiParameters = response.data
						this.callpay()
					}
					if (response.code !== '0') {
						this.toastShow = true
						this.toastText = response.msg
					}
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					this.toastShow = true
					this.toastText = '通讯失败'
				})
				// 在这里模拟支付成功
			},
			onBridgeReadyH () {
				WeixinJSBridge.call('hideOptionMenu')
			},
			onBridgeReady () {
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest',
					this.jsApiParameters,
					(res) => {
						if (res.err_msg === 'get_brand_wcpay_request:ok') {
							console.log('支付成功')
							this.$router.push({path: 'pay_success', query: {openid: this.$route.query.openid, DestineOrderID: this.$route.query.DestineOrderID, OperateID: this.$route.query.OperateID}})
						}
						if (res.err_msg === 'get_brand_wcpay_request:cancel') {
							this.toastShow = true
							this.toastText = '支付取消'
							return
						}
						if (res.err_msg === 'get_brand_wcpay_request:fail') {
							this.toastShow = true
							this.toastText = '支付失败'
							return
						}
					}
				)
			},
			callpay () {
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
			}
		},
		created () {
			if (typeof WeixinJSBridge === 'undefined') {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', this.onBridgeReadyH, false)
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', this.onBridgeReadyH)
					document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReadyH)
				}
			} else {
				this.onBridgeReadyH()
			}
			if (this.$store.state.IP === '') {
				let href = window.location.href
				let reqUrl = href.substring(0, href.indexOf('wechat_destine/#'))
				this.$store.dispatch('setIp', reqUrl)
			}
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
	                    history.go(-2)
                    }
                    if (this.order.PayType === 4) {
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
			                    this.cardList = response.list.filter(item => {
				                    return item.useroombook === 0
			                    })
			                    this.cardList.forEach((item, index) => {
				                    if (item.ecardid === this.$store.state.eCardId) {
					                    this.selectCard = index
				                    }
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
			payWay () {
				if (this.order.PayType === undefined) {
					return true
                }
				if (this.order.PayType === 4) {
					return true
                }
				if (this.order.PayType === 1) {
					return false
                }
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .pay-destine-web-goods
        position absolute
        top 0
        bottom 0
        width 100%
        background #f4f5f7
        .pay-destine-web-goods-tip
            width 100%
            height 30px
            line-height 30px
            background #fdf7d3
            font-size 0
            color #cea16a
            .pay-destine-web-goods-tip-icon
                margin 5px
                display inline-block
                vertical-align top
                width: 20px
                height: 20px
                background-image: url("../../common/pic/tip.png")
                background-size: 20px 20px
                background-repeat: no-repeat
            .pay-destine-web-goods-tip-word
                font-size 15px
        .pay-destine-web-goods-item-wrapper
            background #fff
            border-top 1px solid #d9dde1
            border-bottom 1px solid #d9dde1
            padding 0 10px
            width 100%
            .pay-destine-web-goods-item
                border-bottom 1px solid #d9dde1
                height 40px
                line-height 40px
                width 100%
                position relative
                &:last-child
                    border-bottom none
                .pay-destine-web-goods-word
                    display inline-block
                    position absolute
                    right 0px
                    &.orange
                        color #cea16a
        .pay-destine-web-goods-padding
            width 100%
            height 20px
            background #f4f5f7
        .pay-destine-web-goods-member-pay-no-card
            width 100%
            height 40px
            line-height 40px
            padding 0 10px
            border-top 1px solid #d9dde1
            border-bottom 1px solid #d9dde1
        .pay-destine-web-goods-member-pay
            position relative
            border-top 1px solid #d9dde1
            border-bottom 1px solid #d9dde1
            background #fff
            width 100%
            padding 0 10px
            .pay-destine-web-goods-member-pay-title
                width 100%
                height 40px
                line-height 40px
                border-bottom 1px solid #d9dde1
            .pay-destine-web-goods-member-pay-content
                padding 10px
                width 100%
                position relative
                .pay-destine-web-goods-member-pay-img
                    display inline-block
                    vertical-align top
                    height 50px
                    width 80px
                    img
                        border-radius 5px
                        height 50px
                        width 80px
                    .default
                        border-radius 5px
                        height 50px
                        width 80px
                        background url("../../common/pic/pink.png")
                        background-size cover
                        color #fff
                        text-align center
                        line-height 50px
                .pay-destine-web-goods-member-pay-word
                    display inline-block
                    vertical-align top
                    height 50px
                    width 180px
                    margin-left 10px
                    .pay-destine-web-goods-member-pay-word-up
                        font-weight bold
                        font-size 15px
                        margin-top -4px
                    .pay-destine-web-goods-member-pay-word-mid
                        margin-top -3px
                        font-size 13px
                    .pay-destine-web-goods-member-pay-word-down
                        .pay-destine-web-goods-member-pay-word-down-left
                            display inline-block
                            vertical-align top
                            float left
                            .orange
                                color #cea16a
                            .weak
                                font-size 10px
                                color #b2b2b2
                        .pay-destine-web-goods-member-pay-word-down-right
                            display inline-block
                            vertical-align top
                            float right
                            .orange
                                color #cea16a
                            .weak
                                font-size 10px
                                color #b2b2b2
                .pay-destine-web-goods-radio-in
                    position absolute
                    width: 30px
                    height: 30px
                    bottom 10px
                    right 0
                    .pay-destine-web-goods-radio-in-icon
                        display inline-block
                        width: 30px
                        height: 30px
                        background-image: url("../../common/pic/comboSelect.png")
                        background-size: 30px 30px
                        background-repeat: no-repeat
                    .pay-destine-web-goods-radio-in-icon-no
                        display inline-block
                        width: 30px
                        height: 30px
                        background-image: url("../../common/pic/comboSelectNo.png")
                        background-size: 30px 30px
                        background-repeat: no-repeat
        .pay-destine-web-goods-we-chat-pay
            position relative
            border-top 1px solid #d9dde1
            border-bottom 1px solid #d9dde1
            background #fff
            width 100%
            padding 0 10px
            .pay-destine-web-goods-we-chat-pay-title
                width 100%
                height 40px
                line-height 40px
                border-bottom 1px solid #d9dde1
            .pay-destine-web-goods-we-chat-pay-content
                padding 10px
                width 100%
                .pay-destine-web-goods-we-chat-pay-img
                    display inline-block
                    vertical-align top
                    height 45px
                    width 45px
                    img
                        border-radius 5px
                        height 45px
                        width 45px
                .pay-destine-web-goods-we-chat-pay-word
                    display inline-block
                    vertical-align top
                    height 50px
                    width 100px
                    margin-left 10px
                    .pay-destine-web-goods-we-chat-pay-word-up
                        font-weight bold
                        margin-bottom 5px
                        font-size 17px
                    .pay-destine-web-goods-we-chat-pay-word-down
                        font-size 10px
                        color #b2b2b2
            .pay-destine-web-goods-radio
                position absolute
                bottom 10px
                right 30px
                .pay-destine-web-goods-radio-icon
                    display inline-block
                    width: 30px
                    height: 30px
                    background-image: url("../../common/pic/comboSelect.png")
                    background-size: 30px 30px
                    background-repeat: no-repeat
        .pay-destine-web-goods-pay-button
            margin 0 auto
            width 80%
            height 40px
            line-height 40px
            text-align center
            font-size 17px
            border-radius 5px
            background #cea16a
            color #fff
        .pay-destine-web-goods-pay-button-wrapper
            width 100%
            height 40px
            background #f4f5f7
            .pay-destine-web-goods-pay-button-in
                margin 0 auto
                width 80%
                height 40px
                line-height 40px
                text-align center
                font-size 17px
                border-radius 5px
                background #cea16a
                color #fff
        .fillInInf-tip
            position fixed
            width 180px
            margin 0 auto
            left 0
            right 0
            top 40%
            z-index 152
            border-radius 7px
            background rgba(0,0,0,0.5)
            padding-top 10px
            .fillInInf-tip-picV
                width 70px
                height 70px
                margin 0 auto
                left 0
                right 0
                background url("../../common/pic/V.png")
                background-size cover
            .fillInInf-tip-word
                height 40px
                width 100%
                line-height 40px
                text-align center
                color #fff
        .pay-destine-web-goods-view-center-message
            position fixed
            width 300px
            margin 0 auto
            left 0
            right 0
            top 30%
            z-index 151
            border-radius 7px
            background #fff
            .pay-destine-web-goods-view-center-message-top
                width 100%
                height 50px
                text-align center
                line-height 50px
                border-bottom 1px solid rgba(0,0,0,0.1)
            .pay-destine-web-goods-view-center-message-word-wrapper
                width 100%
                padding 10px 20px
            .pay-destine-web-goods-view-center-message-input-wrapper
                width 100%
                height 50px
                line-height 50px
                position relative
                padding 0 20px
                .pay-destine-web-goods-view-center-message-input
                    height 40px
                    line-height 40px
                    width 160px
                    border 1px solid rgba(0,0,0,0.1)
                .pay-destine-web-goods-view-center-message-input-button
                    position absolute
                    right 20px
                    top 5px
                    width 100px
                    height 40px
                    background orange
                    border-radius 5px
                    line-height 40px
                    text-align center
                    color #fff
                .pay-destine-web-goods-view-center-message-input-button-gray
                    position absolute
                    right 20px
                    top 5px
                    width 100px
                    height 40px
                    background #999
                    border-radius 5px
                    line-height 40px
                    text-align center
                    color #fff
            .pay-destine-web-goods-view-center-message-button-wrapper
                display flex
                width 100%
                height 40px
                margin-top 20px
                .pay-destine-web-goods-view-center-button-mid
                    flex 0 0 1px
                    height 40px
                    background rgba(0,0,0,0.1)
                .pay-destine-web-goods-view-center-button1
                    flex 1
                    height 40px
                    text-align center
                    line-height 40px
                    background rgb(236,236,236)
                    border-bottom-left-radius 7px
                .pay-destine-web-goods-view-center-button2
                    flex 1
                    height 40px
                    text-align center
                    line-height 40px
                    background rgb(236,236,236)
                    border-bottom-right-radius 7px
        .pay-destine-web-goods-view-center-password
            position fixed
            width 300px
            margin 0 auto
            left 0
            right 0
            top 30%
            z-index 151
            border-radius 7px
            background rgb(200,200,200)
            .pay-destine-web-goods-view-center-password-top
                width 100%
                height 50px
                line-height 50px
                text-align center
                border-bottom 1px solid rgba(0,0,0,0.1)
                position relative
                .pay-destine-web-goods-view-center-password-top-left
                    position absolute
                    color rgba(0,0,0,0.3)
                    left 10px
                    top 3px
                .pay-destine-web-goods-view-center-password-top-right
                    position absolute
                    color rgba(0,0,0,0.3)
                    right 10px
                    top 3px
            .pay-destine-web-goods-view-center-password-word-up
                width 100%
                height 56px
                .pay-destine-web-goods-view-center-password-word-up-up
                    height 28px
                    line-height 28px
                    width 100%
                    text-align center
                .pay-destine-web-goods-view-center-password-word-up-down
                    height 28px
                    line-height 28px
                    width 100%
                    text-align center
            .pay-destine-web-goods-view-center-password-word-input-wrapper
                margin 0 auto
                width 250px
                height 40px
                line-height 40px
                border 1px solid #000
                .pay-destine-web-goods-view-center-password-word-input
                    width 248px
                    height 38px
                    background #FFF
            .pay-destine-web-goods-view-center-password-word-down
                width 100%
                height 70px
                .pay-destine-web-goods-view-center-password-word-down-up
                    height 25px
                    width 100%
                    line-height 25px
                    color rgba(0,0,0,0.3)
                    margin-top 10px
                    margin-left 10px
                .pay-destine-web-goods-view-center-password-word-down-down
                    margin-left 10px
                    line-height 25px
                    height 25px
                    width 100%
                    color rgba(0,0,0,0.3)
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

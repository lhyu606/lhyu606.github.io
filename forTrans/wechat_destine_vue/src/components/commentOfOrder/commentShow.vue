<template>
    <div class="comment-show">
        <div class="comment-show-top">
            <img :src="order.LogoUrl" v-show="order.LogoUrl!==''">
            <img src="../../common/pic/KTVlogo.png" v-show="order.LogoUrl===''">
            <div class="comment-show-top-wrapper">
                <div class="comment-show-top-up">{{order.CompanyName}}</div>
                <div class="comment-show-top-down">{{order.BuyBreakName}}</div>
            </div>
        </div>
        <div class="comment-show-mid">
            <div class="comment-show-item">
                <div>
                    服务质量
                    <div class="comment-show-rater">
                        <rater v-model="star1" :min="0" :active-color="color" font-size="40"></rater>
                    </div>
                </div>
            </div>
            <div class="comment-show-item">
                <div>
                    卡台环境
                    <div class="comment-show-rater">
                        <rater v-model="star2" :min="0" :active-color="color" font-size="40"></rater>
                    </div>
                </div>
            </div>
            <div class="comment-show-item">
                <div>
                    音响效果
                    <div class="comment-show-rater">
                        <rater v-model="star3" :min="0" :active-color="color" font-size="40"></rater>
                    </div>
                </div>
            </div>
            <div class="comment-show-text-area">
                <group gutter="0">
                    <x-textarea :max="100" name="comment" :height="height" :placeholder="placeholder" v-model="comment" :show-counter="false"></x-textarea>
                </group>
            </div>
        </div>
        <!--<div class="comment-show-bottom" v-show="false">提交评价</div>-->
        <div class="comment-show-bottom" v-show="order.IsGrade===0" @click="setComment">提交评价</div>
        <div class="comment-show-cover" v-show="order.IsGrade===1"></div>
        <toast v-model="toastShow" :text="toastText" type="text" :time="toastTime" position="middle"></toast>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	import { XTextarea, Rater, Toast } from 'vux'
	export default {
		data: function () {
			return {
				order: {},
				color: '#cea16a',
				fontSize: '20',
				star1: 0,
				star2: 0,
				star3: 0,
				height: 110,
				placeholder: '写下您的宝贵意见，不超过100个字',
				comment: '',
				toastShow: false,
				toastTime: 3500,
				toastText: ''
			}
		},
		components: {
			XTextarea,
			Rater,
			Toast
		},
		computed: {
		},
		created () {
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
                    if (this.order.IsGrade === 1) {
                        this.comment = this.order.Remark
	                    this.star1 = this.order.ServiceGrade
	                    this.star2 = this.order.RoomEnvGrade
	                    this.star3 = this.order.SoundGrade
                        this.placeholder = ''
                    }
					this.$nextTick(() => {
						this.payListScroll = new BScroll(this.$refs.payListHook, {
							click: true
						})
					})
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
			onBridgeReady () {
				WeixinJSBridge.call('hideOptionMenu')
			},
			setComment () {
				if (this.star1 === 0) {
					this.toastShow = true
					this.toastText = '请给服务质量打分'
					return
				}
				if (this.star2 === 0) {
					this.toastShow = true
					this.toastText = '请给卡台环境打分'
					return
				}
				if (this.star3 === 0) {
					this.toastShow = true
					this.toastText = '请给音响效果打分'
					return
				}
				// 调用提交评价接口***********************************************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/saveGrade', {
						ServiceGrade: this.star1,
						RoomEnvGrade: this.star2,
						SoundGrade: this.star3,
						Remark: this.comment,
						ShopNo: this.order.ShopNo,
						OpenID: this.$route.query.openid,
						OperateID: this.$route.query.OperateID,
						GuestTel: this.order.GuestTel,
						BuyBreakID: this.order.BuyBreakID
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
					console.log('调用提交评价接口开始')
					response = response.body
					console.log(response)
					if (response.code === '0') {
                        history.go(-1)
					}
					if (response.code !== '0') {
						console.log('返回码不是0')
						this.$store.dispatch('setNowToast', response.msg)
					}
					console.log('调用提交评价接口结束了')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('调用提交评价接口失败了')
				})
				// 调用提交评价接口********************************************************************
            }
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .comment-show
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        background #201c19
        .comment-show-top
            width 100%
            height 100px
            background #423c31
            padding 15px
            border-bottom 1px solid rgba(0,0,0,0.1)
            img
                width 70px
                height 70px
                border-radius 3px
            .comment-show-top-wrapper
                display inline-block
                vertical-align top
                margin-left 10px
                background #423c31
                .comment-show-top-up
                    font-size 19px
                    margin-bottom 5px
                    margin-top 7px
                    color #cea16a
                .comment-show-top-down
                    font-size 14px
                    color rgba(255,255,255,0.7)
        .comment-show-mid
            position absolute
            top 130px
            bottom 60px
            right 0
            left 0
            background #423c31
            border-bottom 1px solid rgba(0,0,0,0.1)
            border-top 1px solid rgba(0,0,0,0.1)
            padding 10px
            .comment-show-item
                width 100%
                height 55px
                text-align center
                line-height 55px
                font-size 16px
                margin-right 5px
                color rgba(255,255,255,0.7)
                .comment-show-rater
                    display inline-block
                    vertical-align top
                    margin-top 8px
            .comment-show-text-area
                background #423c31
                position absolute
                margin 0 auto
                left 0
                right 0
                text-align center
                top 175px
                width 85%
                height 130px
                border 1px solid #ececec
        .comment-show-bottom
            position absolute
            right 0
            bottom 0
            height 60px
            width 120px
            background #cea16a
            color #fff
            line-height 60px
            text-align center
            font-size 18px
        .comment-show-cover
            position absolute
            left 0
            top 0
            width 100%
            height 100%
            z-index 100
            background rgba(0,0,0,0)
</style>

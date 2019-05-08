<template>
    <!--<div class="choice-time" @click="toDetail">-->
    <div class="choice-time">
        <div class="choice-time-first-up">
            <img src="../../common/pic/KTVlogo.png" v-show="KTV.LogoUrl===''">
            <img :src="KTV.LogoUrl" v-show="KTV.LogoUrl!==''">
            <div class="choice-time-first-up-up">{{KTV.CompanyName}}</div>
            <div class="choice-time-first-up-destine"></div>
            <div class="choice-time-first-up-room"></div>
            <div class="choice-time-first-up-wifi"></div>
        </div>
        <div class="choice-time-first-down">
            <div class="choice-time-first-down-left" @click="reqWxConfig">
                <div class="choice-time-first-down-left-map"></div>
                <div class="choice-time-first-down-left-word">{{KTV.CompanyAddress}}</div>
            </div>
            <div class="choice-time-first-down-right">
                <div class="choice-time-first-down-right-border"></div>
                <a :href="tel">
                    <div class="choice-time-first-down-right-phone-wrapper">
                        <div class="choice-time-first-down-right-phone"></div>
                    </div>
                </a>
            </div>
        </div>
        <div class="choice-time-padding"></div>
        <div class="choice-time-date" ref="timeHookUp">
            <div class="choice-time-date-scroll">
                <div class="choice-time-date-scroll-wrapper" v-for="(item,index) in date" :class="{pink:index===choiceDate}" @click="clickDate(index)">
                    {{item}}
                    <div class="choice-time-date-scroll-bottom" v-show="index===choiceDate"></div>
                </div>
            </div>
        </div>
        <div class="choice-time-destine" ref="activeHook">
            <div>
                <div class="choice-time-destine-scroll-wrapper">
                    <div class="choice-time-destine-scroll-item-wrapper" v-for="(item,index) in active">
                        <div class="choice-time-destine-scroll-item" @click="showComment(item)" :style="{background: item.color}">
                            <div class="choice-time-destine-title">{{item.RoomSortName}}({{item.KmMinPerson}}人-{{item.KmMaxPerson}}人)</div>
                            <div class="choice-time-destine-tip">{{item.BuyBreakName}}</div>
                            <div class="choice-time-destine-price">{{item.Charge}}元</div>
                            <div class="choice-time-destine-price-old" v-show="item.OldCharge!==''">{{item.OldCharge}}元</div>
                            <div class="choice-time-destine-button" @click="toTable(item.BuildID)" v-show="item.used_left!==0">预订</div>
                            <div class="choice-time-destine-button-gray" v-show="item.used_left===0">订满</div>
                            <div class="choice-time-destine-triangle" :class="{up:!item.open,down:item.open}"></div>
                        </div>
                        <div class="choice-time-destine-scroll-comment" v-show="item.open" v-for="(itemIn,indexIn) in item.data">
                            <img src="../../common/pic/KTVlogo.png" v-show="itemIn.GuestHeaderImg===''">
                            <img :src="itemIn.GuestHeaderImg" v-show="itemIn.GuestHeaderImg!==''">
                            <div class="choice-time-destine-comment-id">{{itemIn.GuestTel}}</div>
                            <div class="choice-time-destine-comment-show-rater">
                                <rater v-model="itemIn.AvgGrade" :active-color="color" font-size="14"></rater>
                            </div>
                            <div class="choice-time-destine-comment-date">{{itemIn.CreateDateTime}}</div>
                            <div class="choice-time-destine-comment">{{itemIn.Remark}}</div>
                        </div>
                        <!--<div class="choice-time-destine-scroll-comment-all" v-show="item.open&&item.data.length>0" @click="toCommentAll">-->
                        <div class="choice-time-destine-scroll-comment-all" v-show="item.open&&item.data.length>0" @click="toCommentAll(item)">
                            更多评论{{item.commentNum}}条
                            <div class="choice-time-destine-scroll-comment-all-triangle"></div>
                        </div>
                        <div class="choice-time-destine-scroll-comment-all" v-show="item.open&&item.data.length===0">
                            暂无评价
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	import { Rater } from 'vux'
	import Vue from 'vue'
	export default {
		data: function () {
			return {
				beforeDay: false,
				star1: 5,
				color: '#cea16a',
                KTV: {},
                date: [],
                active: [],
                choiceDate: 0,
                wx: {}
            }
		},
		components: {
			Rater
		},
		computed: {
			tel () {
				return 'tel:' + this.KTV.RelationPhone
            }
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
			// 调用请求场所信息接口***********************************************************************
			this.$store.dispatch('setIsLoading', true)
			this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getShopInfo', {
					CompanyID: this.$route.query.shopNo
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
				console.log('调用场所详情接口开始')
				response = response.body
				console.log(response)
				if (response.code === '0') {
					console.log('返回码是0')
					this.KTV = response.data
					// 调用查询场所可预订时限接口***********************************************************************
					this.$store.dispatch('setIsLoading', true)
					this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getDestineTime', {
							CompanyID: this.$route.query.shopNo,
							OpenID: this.$route.query.openid
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
						console.log('调用查询场所可预订时限接口开始')
						response = response.body
						console.log(response)
						if (response.code === '0') {
							console.log('返回码是0')
                            if (response.data.ShowYesterday === 1) {
								this.beforeDay = true
	                            for (let i = -1; i < response.data.DestineTime; i++) {
		                            this.date.push(this.getDateStr(i))
	                            }
                            }
                            if (response.data.ShowYesterday !== 1) {
								this.beforeDay = false
	                            for (let i = 0; i < response.data.DestineTime; i++) {
		                            this.date.push(this.getDateStr(i))
	                            }
                            }
                            this.requestActive(0)
						}
						if (response.code !== '0') {
							console.log('返回码不是0')
							this.$store.dispatch('setNowToast', response.msg)
						}
						console.log('调用查询场所可预订时限接口结束了')
						console.log('******************************************')
					}, response => {
						this.$store.dispatch('setIsLoading', false)
						console.log('调用查询场所可预订时限接口失败了')
					})
					// 调用查询场所可预订时限接口********************************************************************
				}
				if (response.code !== '0') {
					console.log('返回码不是0')
					this.$store.dispatch('setNowToast', response.msg)
				}
				console.log('调用场所详情接口结束了')
				console.log('******************************************')
			}, response => {
				this.$store.dispatch('setIsLoading', false)
				console.log('调用场所详情接口失败了')
			})
			// 调用请求场所信息接口********************************************************************
		},
		watch: {
			choiceDate () {
				this.requestActive(this.choiceDate)
            }
        },
		methods: {
			toCommentAll (item) {
				this.$router.push({path: 'commentOfActive', query: {ShopNo: item.ShopNo, BuyBreakID: item.BuyBreakId}})
            },
			reqComment (item) {
				// 调用获取评价接口***********************************************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getGradeInfos', {
						ShopNo: item.ShopNo,
						BuyBreakID: item.BuyBreakId
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
					console.log('调用获取评价接口开始')
					response = response.body
					console.log(response)
					if (response.code === '0') {
						console.log('返回码是0')
						item.data = response.data.page.rows
						item.commentNum = response.data.gradeSize
                        item.open = true
						this.installScroll()
					}
					if (response.code !== '0') {
						console.log('返回码不是0')
						this.$store.dispatch('setNowToast', response.msg)
					}
					console.log('调用获取评价接口结束了')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('调用获取评价接口失败了')
				})
				// 调用获取评价接口********************************************************************
            },
			showComment (item) {
				if (item.data !== '') {
					item.open = !item.open
				}
				if (item.data === '') {
					this.reqComment(item)
                }
				this.installScroll()
				item.color = '#201c19'
				setTimeout(() => {
					item.color = '#423c31'
				}, 50)
            },
			onBridgeReady () {
				WeixinJSBridge.call('hideOptionMenu')
			},
			reqWxConfig () {
				// 获取微信配置接口***********************************************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getTicket', {
						wechatPubID: this.$route.query.weChatId,
						url: window.location.href
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
					console.log('获取微信配置接口开始')
					response = response.body
					console.log(response)
					if (response.code === '0') {
						this.wx = response.data
						this.$wechat.config({
							debug: false, //  开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: this.wx.appId,
							timestamp: this.wx.timestamp,
							nonceStr: this.wx.nonceStr,
							signature: this.wx.signature,
							jsApiList: ['openLocation']
						})
						this.$wechat.ready(() => {
                            this.$wechat.openLocation({
                                // 写死在三坊七巷
                                latitude: parseFloat(this.KTV.MapPositionX), // 纬度，浮点数，范围为90 ~ -90
                                longitude: parseFloat(this.KTV.MapPositionY), // 经度，浮点数，范围为180 ~ -180。
                                name: this.KTV.CompanyName, // 位置名
                                address: this.KTV.CompanyAddress, // 地址详情说明
                                scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
                                infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
                            })
                        })
					}
					if (response.code !== '0') {
						console.log('返回码不是0')
						this.$store.dispatch('setNowToast', response.msg)
					}
					console.log('获取微信配置接口结束了')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('获取微信配置接口失败了')
				})
				// 获取微信配置接口********************************************************************
            },
			requestActive (add) {
				if (this.beforeDay) {
					add = add - 1
                }
				// 调用查询预订活动列表接口***********************************************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getDestineBuyBreakList', {
						OpenID: this.$route.query.openid,
						CompanyID: this.$route.query.shopNo,
						page_pos: 0,
						page_record_count: 100,
						UsedDate: this.getDateStrYear(add),
						RoomSortId: '',
						MaxPrice: '',
						MinPrice: ''
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
					console.log('调用查询预订活动列表接口开始')
					response = response.body
					console.log(response)
					if (response.code === '0') {
						this.active = response.data.rows
						this.active.forEach((item) => {
							Vue.set(item, 'open', false)
							Vue.set(item, 'commentNum', 0)
							Vue.set(item, 'color', '#423c31')
							Vue.set(item, 'data', '')
						})
						this.installScrollUp()
						this.installScroll()
					}
					if (response.code !== '0') {
						console.log('返回码不是0')
                        if (response.code === '1') {
							return
                        }
						this.$store.dispatch('setNowToast', response.msg)
					}
					console.log('调用查询预订活动列表接口结束了')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('调用查询预订活动列表接口失败了')
				})
				// 调用查询预订活动列表接口********************************************************************
            },
			getDateStr (add) {
				let dd = new Date()
				dd.setDate(dd.getDate() + add) // 获取AddDayCount天后的日期
				let y = dd.getUTCDay()
                if (y === 1) {
                    y = '周一'
                }
                if (y === 2) {
                    y = '周二'
                }
                if (y === 3) {
                    y = '周三'
                }
                if (y === 4) {
                    y = '周四'
                }
                if (y === 5) {
                    y = '周五'
                }
                if (y === 6) {
                    y = '周六'
                }
                if (y === 0) {
                    y = '周日'
                }
                if (add === -1) {
					y = '午夜'
                }
                if (add === 0) {
					y = '今天'
                }
                if (add === 1) {
					y = '明天'
                }
                if (add === 2) {
					y = '后天'
                }
				let m = dd.getMonth() + 1 // 获取当前月份的日期
				let d = dd.getDate()
				return y + ' ' + m + '-' + d
			},
			getDateStrYear (add) {
				let dd = new Date()
				dd.setDate(dd.getDate() + add) // 获取AddDayCount天后的日期
				let y = dd.getFullYear()
				let m = dd.getMonth() + 1 // 获取当前月份的日期
				let d = dd.getDate()
				return y + '-' + m + '-' + d
			},
			clickDate (index) {
                this.choiceDate = index
            },
			toTable (BuildID) {
				// 获取是否启用沙盘图接口***********************************************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'reserve_service/wachat/roomlayout/getEnableSanbox', {
						shopNo: parseInt(this.$route.query.shopNo)
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
					console.log('获取是否启用沙盘图接口开始')
					response = response.body
					console.log(response)
					if (response.code === '0') {
						console.log('成功')
						let nowMode = response.data.enable
						if (nowMode === 1) {
							this.$router.push({path: 'choiceTable', query: {openid: this.$route.query.openid, BuildID: BuildID}})
						}
						if (nowMode !== 1) {
							this.$router.push({path: 'choiceTableListMode', query: {openid: this.$route.query.openid, BuildID: BuildID}})
						}
					}
					if (response.code !== '0') {
						console.log('返回码不是0')
						console.log(response.msg)
					}
					console.log('获取是否启用沙盘图接口结束了')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('获取是否启用沙盘图接口失败了')
				})
				// 获取是否启用沙盘图接口********************************************************************
            },
			installScrollUp () {
				this.$nextTick(() => {
					if (!this.timeScrollUp) {
						this.timeScrollUp = new BScroll(this.$refs.timeHookUp, {
							click: true,
							scrollX: true,
							eventPassthrough: 'vertical'
						})
					} else {
						this.timeScrollUp.refresh()
					}
				})
			},
			installScroll () {
				this.$nextTick(() => {
					if (!this.activeScroll) {
						this.activeScroll = new BScroll(this.$refs.activeHook, {
							click: true
						})
					} else {
						this.activeScroll.refresh()
					}
				})
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .choice-time
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        overflow hidden
        background #201c19
        .choice-time-first-up
            width 100%
            height 120px
            background #423c31
            border-bottom 1px solid rgba(0,0,0,0.1)
            padding 20px
            img
                width 80px
                height 80px
                border-radius 5px
            .choice-time-first-up-up
                display inline-block
                vertical-align top
                margin-left 13px
                font-weight 600
                font-size 17px
                margin-top 20px
                color #cea16a
            .choice-time-first-up-destine
                display inline-block
                vertical-align top
                background-repeat no-repeat
                background-size 17px 17px
                width: 17px
                height: 17px
                background-image: url("../../common/pic/destine_icon.png")
                margin-top 25px
            .choice-time-first-up-room
                display inline-block
                vertical-align top
                background-repeat no-repeat
                background-size 17px 17px
                width: 17px
                height: 17px
                background-image: url("../../common/pic/room_icon.png")
                margin-top 25px
            .choice-time-first-up-wifi
                display inline-block
                vertical-align top
                background-repeat no-repeat
                background-size 26px 17px
                width: 26px
                height: 17px
                background-image: url("../../common/pic/wifi_icon.png")
                margin-top 25px
        .choice-time-first-down
            width 100%
            height 60px
            background #423c31
            border-bottom 1px solid rgba(0,0,0,0.1)
            display flex
            .choice-time-first-down-left
                height 100%
                flex 1
                font-size 0
                .choice-time-first-down-left-map
                    display inline-block
                    vertical-align top
                    margin-left 20px
                    margin-top 20px
                    background-repeat no-repeat
                    background-size 15px 20px
                    width: 15px
                    height: 20px
                    background-image: url("../../common/pic/map.png")
                .choice-time-first-down-left-word
                    margin-top 19px
                    display inline-block
                    vertical-align top
                    font-size 15px
                    margin-left 5px
                    white-space nowrap
                    text-overflow ellipsis
                    color #cea16a
            .choice-time-first-down-right
                flex 0 0 75px
                height 100%
                position relative
                .choice-time-first-down-right-border
                    height 40px
                    width 1px
                    position: absolute
                    left 0
                    top 10px
                    background rgba(0,0,0,0.1)
                .choice-time-first-down-right-phone-wrapper
                    height 60px
                    width 74px
                    position absolute
                    right 0
                    top 0
                    background rgba(0,0,0,0)
                    .choice-time-first-down-right-phone
                        position absolute
                        right 24px
                        top 18px
                        display inline-block
                        vertical-align top
                        background-repeat no-repeat
                        background-size 25px 25px
                        width: 25px
                        height: 25px
                        background-image: url("../../common/pic/phone.png")
        .choice-time-padding
            height 20px
            width 100%
            background #201c19
        .choice-time-date
            height 40px
            width 100%
            background #423c31
            border-top 1px solid rgba(0,0,0,0.1)
            border-bottom 1px solid rgba(0,0,0,0.1)
            /*overflow-y scroll*/
            .choice-time-date-scroll
                display inline-block
                white-space nowrap
                .choice-time-date-scroll-wrapper
                    display inline-block
                    height 38px
                    line-height 38px
                    width 80px
                    text-align center
                    position relative
                    color rgba(255,255,255,0.7)
                    font-size 13px
                    &.pink
                        color #cea16a
                    .choice-time-date-scroll-bottom
                        width 60px
                        height 2px
                        position absolute
                        bottom 0
                        left 10px
                        background #cea16a
        .choice-time-destine
            position absolute
            width 100%
            top 240px
            bottom 0
            left 0
            overflow hidden
            .choice-time-destine-scroll-comment
                background #423c31
                width 100%
                border-left 20px solid #f2f2f2
                padding 10px 15px
                border-bottom 1px solid rgba(0,0,0,0.1)
                position relative
                img
                    width 48px
                    height 48px
                    border-radius 50%
                .choice-time-destine-comment-id
                    position absolute
                    top 14px
                    left 80px
                .choice-time-destine-comment-show-rater
                    position absolute
                    top 36px
                    left 80px
                .choice-time-destine-comment-date
                    position absolute
                    top 36px
                    left 200px
                    color rgba(0,0,0,0.4)
                .choice-time-destine-comment
                    width 100%
                    padding 0 20px
                    word-wrap break-word
            .choice-time-destine-scroll-comment-all
                background #423c31
                width 100%
                height 60px
                line-height 40px
                padding 0 6px
                border-left 20px solid #201c19
                border-bottom 20px solid #201c19
                padding-left 15px
                color rgba(255,255,255,0.7)
                position relative
                .choice-time-destine-scroll-comment-all-triangle
                    position absolute
                    bottom 10px
                    right 20px
                    display inline-block
                    vertical-align top
                    height 20px
                    width 20px
                    background-size: 20px 20px
                    background-repeat no-repeat
                    background-image url("../../common/pic/pullUp.png")
            .choice-time-destine-scroll-item
                width 100%
                height 70px
                border-bottom 1px solid rgba(0,0,0,0.1)
                background #fff
                position relative
                .choice-time-destine-title
                    position absolute
                    left 10px
                    top 12px
                    font-size 16px
                    color #cea16a
                .choice-time-destine-tip
                    left 10px
                    top 34px
                    position absolute
                    color rgba(255,255,255,0.7)
                .choice-time-destine-price
                    font-size 17px
                    right 80px
                    top 12px
                    position absolute
                    color #cea16a
                .choice-time-destine-price-old
                    top 34px
                    right 80px
                    position absolute
                    color rgba(255,255,255,0.7)
                    text-decoration line-through
                .choice-time-destine-button
                    position absolute
                    right 10px
                    top 20px
                    width 50px
                    height 25px
                    background #cea16a
                    color #fff
                    border-radius 2px
                    text-align center
                    line-height 25px
                .choice-time-destine-button-gray
                    position absolute
                    right 10px
                    top 20px
                    width 50px
                    height 25px
                    background rgba(0,0,0,0.4)
                    color #fff
                    border-radius 2px
                    text-align center
                    line-height 25px
                .choice-time-destine-triangle
                    position: absolute
                    bottom 2px
                    right 50%
                    transform translateX(10px)
                    display inline-block
                    vertical-align top
                    height 20px
                    width 20px
                    background-size: 20px 20px
                    background-repeat: no-repeat
                    &.up
                        background-image: url("../../common/pic/pullDown.png")
                    &.down
                        background-image: url("../../common/pic/pullTop.png")
    /*&:last-child*/
                    /*border-bottom none*/
</style>

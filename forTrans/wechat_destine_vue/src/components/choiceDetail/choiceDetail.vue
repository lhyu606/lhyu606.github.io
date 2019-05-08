<template>
    <!--<div class="choice-detail" @click="toPayList">-->
    <div class="choice-detail">
        <div class="choice-detail-wrapper" ref="choiceDetailHook">
            <div>
                <div class="choice-detail-top">
                    <div class="choice-detail-top-first">{{active.CompanyName}}</div>
                    <div class="choice-detail-top-second">{{active.RoomSortName}}({{active.KmMinPerson}}-{{active.KmMaxPerson}}人)</div>
                    <div class="choice-detail-top-third">{{active.BuyBreakName}}</div>
                    <div class="choice-detail-top-switch"></div>
                    <div class="choice-detail-top-fourth">{{drawback.up}}</div>
                </div>
                <div class="choice-detail-padding">选择到店时间</div>
                <div class="choice-detail-mid">
                    <div class="choice-detail-mid-item" v-for="(item,index) in startTime">
                        <div class="choice-detail-mid-item-in" :class="{pink:index===choiceTime}" @click="clickTime(index)">
                            {{item.cutTime}}
                            <div class="choice-detail-mid-item-in-icon" v-show="index===choiceTime"></div>
                        </div>
                    </div>
                    <div class="choice-detail-mid-button-padding" v-show="showBottom"></div>
                    <div class="choice-detail-mid-button-show" v-show="!totalOrEasy&&showBottom" @click="switchUpAndDown">点击缩略显示时间段<div class="choice-detail-mid-button-icon-down"></div>
                    </div>
                    <div class="choice-detail-mid-button-close" v-show="totalOrEasy&&showBottom" @click="switchUpAndDown">点击显示完整时间段<div class="choice-detail-mid-button-icon-up"></div>
                    </div>
                </div>
                <div class="choice-detail-padding-small"></div>
                <div class="choice-detail-destine">
                    {{active.BuyBreakName}}-最低消费
                    <div class="choice-detail-destine-price">￥{{LowCharge}}</div>
                </div>
                <div class="choice-detail-padding-small"></div>
                <div class="choice-detail-phone" @click="openWindow" v-show="phoneOut!==''">
                    <!--13655040531-->
                    {{phoneOut}}
                    <div class="choice-detail-phone-change">修改手机号码</div>
                    <div class="choice-detail-phone-icon"></div>
                </div>
                <div class="choice-detail-phone" @click="openWindow" v-show="phoneOut===''">
                    您尚未留下过手机号码
                    <div class="choice-detail-phone-change">点击填写号码</div>
                    <div class="choice-detail-phone-icon"></div>
                </div>
                <div class="choice-detail-padding" v-show="active.Note">预订说明</div>
                <div class="choice-detail-illustration" v-show="active.Note" v-html='active.Note'>
                    {{active.Note}}
                </div>
            </div>
        </div>
        <div class="choice-detail-tip">{{drawback.down}}前可随时自助退款，逾期不可退款。</div>
        <div class="choice-detail-bottom">
            <div class="choice-detail-bottom-left">需支付订金￥
                <div class="choice-detail-bottom-left-in">{{active.Charge}}</div>
            </div>
            <div class="choice-detail-bottom-right" @click="openAnotherWindow">提交订单</div>
        </div>
        <div class="choice-detail-center" v-if="showWindow">
            <div class="choice-detail-center-close" @click="closeWindow"></div>
            <div class="choice-detail-center-title">
                <div class="choice-detail-center-img"></div>
            </div>
            <div class="fillInInf-wrapper">
                <div class="fillInInf-wrapper-item">
                    <div class="fillInInf-wrapper-item-input-wrapper">
                        <input placeholder="请输入手机号" v-model="phone" class="fillInInf-wrapper-item-input"/>
                    </div>
                </div>
                <div class="fillInInf-wrapper-item">
                    <div class="fillInInf-wrapper-item-input-wrapper pic">
                        <input placeholder="请输入右侧验证码" v-model="picWord" class="fillInInf-wrapper-item-input code"/>
                    </div>
                    <div class="fillInInf-wrapper-item-input-wrapper-item-verify">
                        <img height="50px" width="100px" :src="src" @click="changeV">
                    </div>
                </div>
                <div class="fillInInf-wrapper-item">
                    <div class="fillInInf-wrapper-item-input-wrapper">
                        <input placeholder="请输入验证码" v-model="phoneWord" class="fillInInf-wrapper-item-input"/>
                    </div>
                    <div class="fillInInf-wrapper-item-input-wrapper-item-button" @click="sendCode" v-show="cutDown===60">发送验证码</div>
                    <div class="fillInInf-wrapper-item-input-wrapper-item-button-gray" v-show="cutDown<60">{{cutDown}}秒</div>
                </div>
            </div>
            <div class="choice-detail-center-button" @click="toChangePhone">确定</div>
        </div>
        <div class="choice-detail-center-another" v-if="showWindowAnother">
            <div class="choice-detail-center-another-word" v-show="overTime">现在预订还可以退款，确定请继续</div>
            <div class="choice-detail-center-another-word" v-show="!overTime">现在预订不可自助退款，需经商家审核</div>
            <div class="choice-detail-center-another-padding"></div>
            <div class="choice-detail-center-another-button-wrapper">
                <div class="choice-detail-center-another-button-padding"></div>
                <div class="choice-detail-center-another-button-left" @click="closeAnotherWindow">取消</div>
                <div class="choice-detail-center-another-button-padding"></div>
                <div class="choice-detail-center-another-button-right" @click="toPayList">继续</div>
                <div class="choice-detail-center-another-button-padding"></div>
            </div>
        </div>
        <div class="choice-detail-center-another" v-if="orderHistoryWindow">
            <div class="choice-detail-center-another-word">您还有未付款订单，是否查看</div>
            <div class="choice-detail-center-another-padding"></div>
            <div class="choice-detail-center-another-button-wrapper">
                <div class="choice-detail-center-another-button-padding"></div>
                <div class="choice-detail-center-another-button-left" @click="closeOrderHistoryWindow">取消</div>
                <div class="choice-detail-center-another-button-padding"></div>
                <div class="choice-detail-center-another-button-right" @click="toOrderHistory">查看</div>
                <div class="choice-detail-center-another-button-padding"></div>
            </div>
        </div>
        <transition name="fade">
            <div class="choice-detail-mask-another" v-show="showWindowAnother" @click="closeAnotherWindow"></div>
        </transition>
        <transition name="fade">
            <div class="choice-detail-mask-another" v-show="orderHistoryWindow" @click="closeOrderHistoryWindow"></div>
        </transition>
        <transition name="fade">
            <div class="choice-detail-mask" v-show="showWindow" @click="closeWindow"></div>
        </transition>
        <div class="fillInInf-tip" v-show="showX">
            <div class="fillInInf-tip-picX"></div>
            <div class="fillInInf-tip-word">请输入图形验证码</div>
        </div>
        <div class="fillInInf-tip" v-show="showV">
            <div class="fillInInf-tip-picV"></div>
            <div class="fillInInf-tip-word">验证码发送成功</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	export default {
		data: function () {
			return {
				orderHistoryWindow: false,
				active: {},
				startTime: [],
				totalStartTime: [],
                easyStartTime: [],
                totalOrEasy: true,
                showBottom: false,
                choiceTime: 0,
				showWindow: false,
				showWindowAnother: false,
				phoneOut: '',
				phone: '',
				picWord: '',
				phoneWord: '',
                src: this.$store.state.IP + 'wechat_destine/index.php/Public/verify_c',
				cutDown: 60,
				showX: false,
				showV: false
            }
		},
		computed: {
			LowCharge () {
				return this.$route.query.LowCharge
            },
			usedBeginTimeFormat () {
				let time = this.bothToDate(this.totalStartTime[this.choiceTime].day, this.totalStartTime[this.choiceTime].time)
				return time.getFullYear() + '-' + this.testTen((time.getMonth() + 1)) + '-' + this.testTen(time.getDate()) + ' ' + this.testTen(time.getHours()) + ':' + this.testTen(time.getMinutes()) + ':' + this.testTen(time.getSeconds())
//				return time.getFullYear() + '-' + this.testTen((time.getMonth())) + '-' + this.testTen(time.getDate()) + ' ' + this.testTen(time.getHours()) + ':' + this.testTen(time.getMinutes()) + ':' + this.testTen(time.getSeconds())
            },
			overTime () {
				let time = this.bothToDate(this.totalStartTime[this.choiceTime].day, this.totalStartTime[this.choiceTime].time)
				time.setMinutes(time.getMinutes() - this.active.drawback_expires)
                let nowDate = new Date()
                if (time.getTime() <= nowDate.getTime()) {
					return false
                }
				if (time.getTime() > nowDate.getTime()) {
					return true
                }
            },
			drawback () {
				if (this.totalStartTime.length === 0) {
					return {
						up: '',
                        down: ''
                    }
                }
				let time = this.bothToDate(this.totalStartTime[this.choiceTime].day, this.totalStartTime[this.choiceTime].time)
                time.setMinutes(time.getMinutes() - this.active.drawback_expires)
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
                return {
					up: (time.getMonth() + 1) + '月' + time.getDate() + '日' + ' ' + yString,
//                    mid: time.getFullYear() + '-' + this.testTen((time.getMonth() + 1)) + '-' + this.testTen(time.getDate()) + ' ' + this.testTen(time.getHours()) + ':' + this.testTen(time.getMinutes()) + ':' + this.testTen(time.getSeconds()),
                    down: yString + ' ' + '(' + (time.getMonth() + 1) + '月' + time.getDate() + '日' + ')' + this.testTen(time.getHours()) + ':' + this.testTen(time.getMinutes())
//                    nextPage: this.testTen((time.getMonth() + 1)) + '-' + this.testTen(time.getDate()) + ' ' + yString + ' ' + time.getHours() + ':' + time.getMinutes()
                }
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
			this.src = this.$store.state.IP + 'wechat_destine/index.php/Public/verify_c'
			// 调用查询预订活动接口***********************************************************************
			this.$store.dispatch('setIsLoading', true)
			this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getDestineBuyBreak', {
					BuildID: this.$route.query.BuildID
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
				console.log('调用查询预订活动接口开始')
				response = response.body
				console.log(response)
				if (response.code === '0') {
					this.active = response.data
					this.totalStartTime = this.timeList(this.active.beginTime, this.active.endTime, this.active.UsedDate)
					let theDate = new Date()
					// 当前时间没有超过预订时间的时候加入数组
					this.totalStartTime = this.totalStartTime.filter(item => {
						return this.bothToDate(item.day, item.time) > theDate
					})
                    console.log(this.totalStartTime)
                    this.easyStartTime = this.totalStartTime.slice(0, 8)
                    this.startTime = this.easyStartTime
                    if (this.totalStartTime.length > 8) {
	                    this.showBottom = true
                    }
                    if (this.totalStartTime.length <= 8) {
	                    this.showBottom = false
                    }
					// 调用获取用户手机号接口***********************************************************************
					this.$store.dispatch('setIsLoading', true)
					this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getCustomerMobile', {
							OpenID: this.$route.query.openid,
							shopNo: this.active.ShopNo
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
						console.log('调用获取用户手机号接口开始')
						response = response.body
						console.log(response)
						if (response.code === '0') {
							this.phoneOut = response.data.Mobile
							if (response.data.Mobile === undefined) {
							    this.phoneOut = ''
                            }
							this.$nextTick(() => {
								this.choiceDetailScroll = new BScroll(this.$refs.choiceDetailHook, {
									click: true
								})
							})
						}
						if (response.code !== '0') {
							console.log('返回码不是0')
							this.$store.dispatch('setNowToast', response.msg)
						}
						console.log('调用获取用户手机号接口结束了')
						console.log('******************************************')
					}, response => {
						this.$store.dispatch('setIsLoading', false)
						console.log('调用获取用户手机号接口失败了')
					})
					// 调用获取用户手机号接口********************************************************************
				}
				if (response.code !== '0') {
					console.log('返回码不是0')
					this.$store.dispatch('setNowToast', response.msg)
				}
				console.log('调用查询预订活动接口结束了')
				console.log('******************************************')
			}, response => {
				this.$store.dispatch('setIsLoading', false)
				console.log('调用查询预订活动接口失败了')
			})
			// 调用查询预订活动接口********************************************************************
		},
		watch: {
			cutDown () {
				if (this.cutDown <= 0) {
					this.cutDown = 60
					clearInterval(this.interval)
					this.changeV()
					this.picWord = ''
				}
			}
        },
		methods: {
			toOrderHistory () {
				this.$store.dispatch('setHistoryIndex', 1)
				this.$router.push({path: 'order_history', query: {openid: this.$route.query.openid}})
            },
			closeOrderHistoryWindow () {
			    this.orderHistoryWindow = false
            },
			onBridgeReady () {
				WeixinJSBridge.call('hideOptionMenu')
			},
            cutTime (timeString) {
				return timeString.substr(0, timeString.length - 3)
            },
            bothToDate (day, time) {
	            let stringTimeH = parseInt(time.substring(0, 2))
	            let stringTimeM = parseInt(time.substring(3, 5))
	            let stringTimeS = parseInt(time.substring(6, 7))
	            day.setHours(stringTimeH)
	            day.setMinutes(stringTimeM)
	            day.setSeconds(stringTimeS)
                return day
            },
			switchUpAndDown () {
                this.totalOrEasy = !this.totalOrEasy
                if (this.totalOrEasy) {
	                this.startTime = this.easyStartTime
                }
                if (!this.totalOrEasy) {
	                this.startTime = this.totalStartTime
                }
				this.$nextTick(() => {
					this.choiceDetailScroll.refresh()
				})
            },
			testTen (test) {
				if (test < 10) {
					return '0' + test
				}
				if (test > 9) {
					return '' + test
				}
            },
			testY (Y) {
			    return Y + ''
            },
			stringToDate (string) {
				let stringDayY = parseInt(string.substring(0, 4))
				let stringDayM = parseInt(string.substring(5, 7) - 1)
				let stringDayD = parseInt(string.substring(8, 10))
				let date = new Date()
				date.setDate(stringDayD)
				date.setMonth(stringDayM)
				date.setFullYear(stringDayY)
                return date
            },
			dateToString (date) {
				return date.getFullYear() + '-' + this.testTen(date.getMonth() + 1) + '-' + date.getDate()
            },
			dayAddOne (dayString) {
            	let date = this.stringToDate(dayString)
				date.setDate(parseInt(dayString.substring(8, 10)) + 1)
				return this.dateToString(date)
            },
			dayToString (day) {
				let dayStringY = parseInt(day / 365)
				let dayStringYRest = day % 365
				let dayStringM = parseInt(dayStringYRest / 30)
				let dayStringD = dayStringYRest % 30
				return this.testY(dayStringY) + '-' + this.testTen(dayStringM) + '-' + this.testTen(dayStringD)
            },
			stringToDay (string) {
				let stringDayY = parseInt(string.substring(0, 4))
				let stringDayM = parseInt(string.substring(5, 7))
				let stringDayD = parseInt(string.substring(8, 10))
				return (stringDayY * 365) + (stringDayM * 31) + stringDayD
            },
			timeToString (time) {
                let timeStringH = parseInt(time / 3600)
                let timeStringHRest = time % 3600
                let timeStringM = parseInt(timeStringHRest / 60)
				let timeStringS = timeStringHRest % 60
				return this.testTen(timeStringH) + ':' + this.testTen(timeStringM) + ':' + this.testTen(timeStringS)
            },
			stringToTime (string) {
				let stringTimeH = parseInt(string.substring(0, 2))
				let stringTimeM = parseInt(string.substring(3, 5))
				let stringTimeS = parseInt(string.substring(6, 8))
				return (stringTimeH * 3600) + (stringTimeM * 60) + stringTimeS
            },
			timeList (begin, end, UsedDate) {
//				let date = new Date()
//                let day = date.getFullYear() + '-' + this.testTen(date.getMonth() + 1) + '-' + date.getDate()
//                let time = this.testTen(date.getHours()) + ':' + this.testTen(date.getMinutes()) + ':' + this.testTen(date.getSeconds())
                let beginTime = this.stringToTime(begin)
                let endTime = this.stringToTime(end)
                if (beginTime - endTime < 0) {
					// 当天营业结束
                    let timeLong = endTime - beginTime
                    let cTime = beginTime
//	                let timeRestTime = parseInt(timeLong / 3600) // 一小时的间隔
	                let timeRestTime = parseInt(timeLong / 1800) // 半小时的间隔
                    let timeList = []
                    timeList.push(
                        {
                            day: this.stringToDate(UsedDate),
                            time: this.timeToString(cTime),
                            cutTime: this.cutTime(this.timeToString(cTime))
                        }
                    )
//                    }
                    for (let i = 0; i < timeRestTime; i++) {
//	                    cTime = cTime + 3600 // 一小时的间隔
	                    cTime = cTime + 1800 // 一小时的间隔
                        timeList.push(
                            {
                                day: this.stringToDate(UsedDate),
                                time: this.timeToString(cTime),
                                cutTime: this.cutTime(this.timeToString(cTime))
                            }
                        )
//	                    }
                    }
                    if (timeList[timeList.length - 1].time === '24:00:00') {
	                    timeList.length = timeList.length - 1
                    }
//                    alert('UP' + timeList[0].day)
                    return timeList
                }
                if (beginTime - endTime >= 0) {
					// 次日营业结束,或者24小时营业
                    if (end === '00:00:00') {
	                    return this.timeList(begin, '24:00:00', UsedDate)
                    }
                    if (end !== '00:00:00') {
                    	let firstTime = this.timeList(begin, '24:00:00', UsedDate)
                    	let secondTime = this.timeList('00:00:00', end, this.dayAddOne(UsedDate))
                        if (begin === end) {
	                        secondTime.length = secondTime.length - 1
                        }
//	                    alert('UP' + firstTime.concat(secondTime)[0].day)
	                    return firstTime.concat(secondTime)
                    }
                }
            },
			openAnotherWindow () {
				this.showWindowAnother = true
            },
			closeAnotherWindow () {
				this.showWindowAnother = false
            },
			sendCode () {
				if (this.picWord === '') {
					this.showX = true
					setTimeout(() => {
						this.showX = false
					}, 800)
					return
				}
				if (!(/^1[34578]\d{9}$/.test(this.phone))) {
					this.$store.dispatch('setNowToast', '请输入正确的手机号码')
					return
				}
				// 调用发送短信验证码接口******************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'yjmemberserver/system/send/validation_code', {
						shopno: this.active.ShopNo,
						mobile: this.phone
					},
					{
						'emulateJSON': false
					}
				).then(response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('-------------------------------------------')
					console.log('调用发送短信验证码接口开始')
					response = response.body
					console.log(response)
					if (response.ret === 0) {
//						alert(response.validationcode)
						console.log('返回码是0')
						console.log('validationcode:' + response.validationcode)
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
						console.log('返回码不是0')
						this.$store.dispatch('setNowToast', response.msg)
//						this.$store.dispatch('setNowToast', '短信发送失败')
					}
					console.log('调用发送短信验证码接口结束')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('调用发送短信验证码接口失败了')
				})
				// 调用发送短信验证码接口******************************************
			},
			changeV () {
				this.src = this.src + '?' + Math.random()
			},
			openWindow () {
				this.showWindow = true
            },
			closeWindow () {
				this.showWindow = false
            },
			clickTime (index) {
			    this.choiceTime = index
            },
			toPayList () {
				this.closeAnotherWindow()
                if (this.phoneOut === '' || this.phoneOut === undefined) {
				    this.$store.dispatch('setNowToast', '请先填写手机号码')
                    return
                }
//				this.$router.push({path: 'pay_list', query: {openid: this.$store.state.openId, DestineOrderID: 10}})
//                return
				// 调用预定下单接口***********************************************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/Order/create', {
						CompanyID: this.active.ShopNo,
						OpenID: this.$route.query.openid,
						BuyBreakID: this.active.BuyBreakID,
						UsedDate: this.active.UsedDate,
						DestineRoomNum: '1',
						GuestName: '',
						GuestNumber: '',
						GuestTel: this.phoneOut,
						DestineMemo: '',
						RoomID: this.$route.query.RoomID,
						UsedBeginTime: this.usedBeginTimeFormat,
						RoomName: this.$route.query.RoomName
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
					console.log('调用预定下单接口开始')
					response = response.body
					console.log(response)
					if (response.code === '0') {
						this.$router.push({path: 'pay_list', query: {openid: this.$route.query.openid, DestineOrderID: response.data.DestineOrderID, OperateID: response.data.OperateID}})
					}
					if (response.code !== '0') {
						if (response.msg === '存在未付款订单') {
							this.orderHistoryWindow = true
                            return
                        }
						console.log('返回码不是0')
						this.$store.dispatch('setNowToast', response.msg)
					}
					console.log('调用预定下单接口结束了')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('调用预定下单接口失败了')
				})
				// 调用预定下单接口********************************************************************
			},
			toChangePhone () {
				if (!(/^1[34578]\d{9}$/.test(this.phone))) {
					this.$store.dispatch('setNowToast', '请输入正确的手机号码')
					return
				}
				if (this.picWord === '') {
					this.$store.dispatch('setNowToast', '请输入图形验证码')
					return
				}
				if (this.phoneWord === '') {
					this.$store.dispatch('setNowToast', '请输入手机验证码')
					return
				}
//		        // 调用 验证码验证接口******************************************
				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'wechat_destine/index.php/public/check_verify', {
					code: this.picWord
				}).then(response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('-------------------------------------------')
					console.log('验证图形码验证接口开始')
					response = response.body
					console.log(response)
					if (response.ret === 0) {
//						this.$store.dispatch('setNowToast', '图片验证成功')
						console.log('返回码是0')
						console.log('图片验证成功')
//                      短信验证放在这里执行
						// 调用 3.3发送短信验证码接口******************************************
						this.$store.dispatch('setIsLoading', true)
						this.$http.post(this.$store.state.IP + 'yjmemberserver/system/check/validation_code', {
								validationcode: this.phoneWord,
								mobile: this.phone
							},
							{
								'emulateJSON': false
							}
						).then(response => {
							this.$store.dispatch('setIsLoading', false)
							console.log('-------------------------------------------')
							console.log('验验证码接口开始')
							response = response.body
							console.log(response)
							if (response.ret === 0) {
								console.log('返回码是0')
								// 调用新增用户手机号接口***********************************************************************
								this.$store.dispatch('setIsLoading', true)
								this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/createCustomerMobile', {
										Mobile: this.phone,
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
									console.log('调用新增用户手机号接口开始')
									response = response.body
									console.log(response)
									if (response.code === '0') {
                                        this.closeWindow()
                                        this.phoneOut = this.phone
                                        this.phone = ''
                                        this.picWord = ''
                                        this.phoneWord = ''
										this.$store.dispatch('setNowToast', '变更手机号码成功')
									}
									if (response.code !== '0') {
										console.log('返回码不是0')
										this.$store.dispatch('setNowToast', response.msg)
									}
									console.log('调用新增用户手机号接口结束了')
									console.log('******************************************')
								}, response => {
									this.$store.dispatch('setIsLoading', false)
									console.log('调用新增用户手机号接口失败了')
								})
								// 调用新增用户手机号接口********************************************************************
							}
							if (response.ret !== 0) {
								console.log('返回码不是0')
								this.$store.dispatch('setNowToast', response.msg)
//								this.$store.dispatch('setNowToast', '短信验证码校验失败')
							}
							console.log('校验短信验证码接口结束')
							console.log('******************************************')
						}, response => {
							this.$store.dispatch('setIsLoading', false)
							console.log('校验短信验证码接口失败了')
						})
						// 调用 3.3发送短信验证码接口******************************************
					}
					if (response.ret !== 0) {
						console.log('返回码不是0')
//						this.$store.dispatch('setNowToast', response.msg)
						this.$store.dispatch('setNowToast', '图形验证码校验失败')
					}
					console.log('验证图形码验证接口结束')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('验证图形码验证接口失败了')
				})
//		        // 调用 验证码验证接口******************************************
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .choice-detail
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        overflow hidden
        background #201c19
        .choice-detail-wrapper
            width 100%
            position absolute
            top 0
            left 0
            bottom 90px
            overflow hidden
            background #201c19
            .choice-detail-top
                width 100%
                height 120px
                background #423c31
                border-bottom 1px solid rgba(0,0,0,0.1)
                padding 10px
                .choice-detail-top-first
                    font-size 20px
                    margin-bottom 10px
                    color #cea16a
                .choice-detail-top-second
                    display inline-block
                    vertical-align top
                    color rgba(255,255,255,0.7)
                .choice-detail-top-third
                    display inline-block
                    vertical-align top
                    color rgba(255,255,255,0.7)
                    margin-left 10px
                .choice-detail-top-switch
                    margin-bottom 10px
                .choice-detail-top-fourth
                    display inline-block
                    vertical-align top
                    color rgba(255,255,255,0.7)
                .choice-detail-top-sixth
                    display inline-block
                    vertical-align top
                    color #cea16a
                    margin-left 10px
            .choice-detail-padding
                width 100%
                height 30px
                line-height 30px
                color #cea16a
                background #201c19
                padding-left 10px
            .choice-detail-mid
                width 100%
                background #423c31
                border-bottom 1px solid rgba(0,0,0,0.1)
                border-top 1px solid rgba(0,0,0,0.1)
                padding 10px
                display flex
                flex-flow row wrap
                justify-content flex-start
                align-content flex-start
                position relative
                .choice-detail-mid-item
                    flex 0 0 25%
                    height 40px
                    padding 6px
                    line-height 40px
                    .choice-detail-mid-item-in
                        width 100%
                        height 28px
                        border 1px solid rgba(255,255,255,0.7)
                        border-radius 2px
                        color rgba(255,255,255,0.7)
                        text-align center
                        line-height 28px
                        position relative
                        &.pink
                            color #cea16a
                            border 1px solid #cea16a
                        .choice-detail-mid-item-in-icon
                            position absolute
                            right 0
                            top 0
                            display inline-block
                            vertical-align top
                            height 15px
                            width 15px
                            background-image: url("../../common/pic/ic_charge_check.png")
                            background-size: 15px 15px
                            background-repeat: no-repeat
                .choice-detail-mid-button-padding
                    width 100%
                    height 15px
                .choice-detail-mid-button-show
                    position absolute
                    bottom 0
                    left 0
                    width 100%
                    height 28px
                    z-index 2
                    text-align center
                    line-height 28px
                    color rgba(255,255,255,0.7)
                    .choice-detail-mid-button-icon-down
                        display inline-block
                        vertical-align top
                        width: 28px
                        height: 28px
                        background-image: url("../../common/pic/pullTop.png")
                        background-size: 28px 28px
                        background-repeat: no-repeat
                .choice-detail-mid-button-close
                    text-align center
                    line-height 28px
                    position absolute
                    bottom 0
                    left 0
                    width 100%
                    height 28px
                    z-index 2
                    color rgba(255,255,255,0.7)
                    .choice-detail-mid-button-icon-up
                        display inline-block
                        vertical-align top
                        width: 28px
                        height: 28px
                        background-image: url("../../common/pic/pullDown.png")
                        background-size: 28px 28px
                        background-repeat: no-repeat
            .choice-detail-destine
                width 100%
                height 50px
                background #423c31
                border-top 1px solid rgba(0,0,0,0.1)
                border-bottom 1px solid rgba(0,0,0,0.1)
                padding 10px
                font-size 18px
                color #cea16a
                .choice-detail-destine-price
                    float right
                    color #cea16a
                    font-size 18px
            .choice-detail-padding-small
                width 100%
                height 15px
                background #201c19
            .choice-detail-phone
                width 100%
                height 50px
                line-height 50px
                background #423c31
                border-top 1px solid rgba(0,0,0,0.1)
                border-bottom 1px solid rgba(0,0,0,0.1)
                padding-left 10px
                padding-right 30px
                position relative
                color #cea16a
                .choice-detail-phone-change
                    float right
                    color #cea16a
                    font-size 15px
                .choice-detail-phone-icon
                    right 8px
                    top 16px
                    position absolute
                    display inline-block
                    vertical-align top
                    height 20px
                    width 20px
                    background-image: url("../../common/pic/pullUp.png")
                    background-size: 20px 20px
                    background-repeat: no-repeat
            .choice-detail-illustration
                width 100%
                background #fff
                border-top 1px solid rgba(0,0,0,0.1)
                border-bottom 1px solid rgba(0,0,0,0.1)
                padding 10px
                color rgba(0,0,0,0.6)
        .choice-detail-tip
            position absolute
            width 100%
            height 40px
            left 0
            bottom 50px
            background #e54545
            color #fff
            line-height 40px
            text-align center
        .choice-detail-bottom
            position absolute
            width 100%
            height 50px
            left 0
            bottom 0
            background #fff
            display flex
            .choice-detail-bottom-left
                flex 1
                height 50px
                line-height 50px
                color #cea16a
                padding-left 10px
                background #423c31
                .choice-detail-bottom-left-in
                    font-size 22px
                    display inline-block
                    vertical-align top
                    margin-top -2px
            .choice-detail-bottom-right
                flex 0 0 100px
                height 50px
                background #cea16a
                color #fff
                line-height 50px
                text-align center
                font-size 18px
        .choice-detail-center-another
            position fixed
            width 300px
            margin 0 auto
            left 0
            right 0
            top 30%
            z-index 151
            border-radius 7px
            background #423c31
            padding 10px
            .choice-detail-center-another-word
                width 100%
                height 40px
                text-align center
                line-height 40px
                color rgba(255,255,255,0.7)
            .choice-detail-center-another-padding
                width 100%
                height 10px
            .choice-detail-center-another-button-wrapper
                display flex
                height 40px
                width 100%
                .choice-detail-center-another-button-padding
                    flex 0 0 15px
                    height 40px
                .choice-detail-center-another-button-left
                    flex 1
                    height 40px
                    background rgba(0,0,0,0.2)
                    border-radius 5px
                    line-height 40px
                    text-align center
                    color rgba(255,255,255,0.7)
                .choice-detail-center-another-button-right
                    background #cea16a
                    flex 1
                    height 40px
                    color #fff
                    border-radius 5px
                    line-height 40px
                    text-align center
        .choice-detail-center
            position fixed
            width 300px
            margin 0 auto
            left 0
            right 0
            top 25%
            z-index 151
            border-radius 7px
            background #423c31
            padding 20px
            .choice-detail-center-close
                position absolute
                right 5px
                top 5px
                display inline-block
                vertical-align top
                height 20px
                width 20px
                background-image: url("../../common/pic/close-btn.png")
                background-size: 20px 20px
                background-repeat: no-repeat
            .choice-detail-center-title
                width 100%
                height 60px
                margin-bottom 10px
                .choice-detail-center-img
                    margin-left 40px
                    display inline-block
                    vertical-align top
                    width 180px
                    height 60px
                    background-image: url("../../common/pic/titleDestine.png")
                    background-size: 180px 60px
                    background-repeat: no-repeat
            .fillInInf-wrapper
                .fillInInf-wrapper-item
                    width 100%
                    height 50px
                    line-height 50px
                    position relative
                    margin-bottom 10px
                    .fillInInf-wrapper-item-input-wrapper
                        font-size 16px
                        position relative
                        border 1px solid rgba(0,0,0,0.2)
                        border-radius 4px
                        padding 0 10px
                        .fillInInf-wrapper-item-input
                            background #423c31
                            height 50px
                            line-height 50px
                            outline none
                            color #cea16a
                            &.code
                                width 140px
                        &.pic
                            width 155px
                    .fillInInf-wrapper-item-input-wrapper-item-verify
                        position absolute
                        right 0px
                        top 1px
                        width 100px
                        height 50px
                        background #fff // 这里是验证码的图块
                        line-height 40px
                        text-align center
                        color #fff
                    .fillInInf-wrapper-item-input-wrapper-item-button
                        position absolute
                        right 10px
                        top 5px
                        width 100px
                        height 40px
                        background #e9c088
                        border-radius 5px
                        line-height 40px
                        text-align center
                        color #fff
                    .fillInInf-wrapper-item-input-wrapper-item-button-gray
                        position absolute
                        right 0
                        top 5px
                        width 100px
                        height 40px
                        background #999
                        border-radius 5px
                        line-height 40px
                        text-align center
                        color #fff
            .choice-detail-center-button
                width 260px
                height 40px
                background #cea16a
                color #fff
                margin 0 auto
                left 0
                right 0
                text-align center
                line-height 40px
                border-radius 4px
                font-size 17px
        .choice-detail-mask
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
        .choice-detail-mask-another
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
        .fillInInf-tip
            position fixed
            width 180px
            margin 0 auto
            left 0
            right 0
            top 40%
            z-index 151
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
            .fillInInf-tip-picX
                width 70px
                height 70px
                margin 0 auto
                left 0
                right 0
                background url("../../common/pic/X.png")
                background-size cover
            .fillInInf-tip-word
                height 40px
                width 100%
                line-height 40px
                text-align center
                color #fff
</style>

<template>
    <!--<div class="choice-table" @click="toDetail">-->
    <div class="choice-table">
        <div class="choice-table-top">
            <div class="choice-table-top-left">
                <div class="choice-table-top-left-up">{{active.RoomSortName}}({{active.KmMinPerson}}人-{{active.KmMaxPerson}}人)</div>
                <div class="choice-table-top-left-mid">{{UsedDate}}</div>
                <div class="choice-table-top-left-down">{{active.BuyBreakName}}</div>
            </div>
            <div class="choice-table-top-right">
                <div class="choice-table-top-right-1">可选
                    <div class="choice-table-top-right-1-pic"></div>
                </div>
                <div class="choice-table-top-right-2">不可选
                    <div class="choice-table-top-right-2-pic"></div>
                </div>
                <div class="choice-table-top-right-3">已选
                    <div class="choice-table-top-right-3-pic"></div>
                </div>
            </div>
        </div>
        <div class="choice-table-list" ref="tableHook">
            <div class="choice-table-list-wrapper">
                <div class="choice-table-list-item" v-for="(item,index) in table">
                    <div class="choice-table-list-item-in" :class="{white:item.BeUsed===0,pink:item.BeUsed!==0,red:index===choiceTable}" @click="toChoiceTable(item,index)">
                        <div class="choice-table-list-item-in-title">{{item.RoomName}}</div>
                        <div>
                            <div class="choice-table-list-item-in-left">订金：</div>
                            <div class="choice-table-list-item-in-right">￥{{Charge}}</div>
                        </div>
                        <div>
                            <div class="choice-table-list-item-in-left">低消：</div>
                            <div class="choice-table-list-item-in-right">￥{{item.LowCharge}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="choice-table-bottom">
            <div class="choice-table-bottom-left">
                <div v-if="choiceTable!==-1" class="choice-table-bottom-left-left">订金：{{Charge}}</div>
                <div v-if="choiceTable!==-1" class="choice-table-bottom-left-right">最低消费：{{lowCharge}}</div>
                <div v-if="choiceTable===-1">请选择您要预订的卡台</div>
            </div>
            <div class="choice-table-bottom-right" :class="{pink:choiceTable!==-1,gray:choiceTable===-1}" @click="toDetail">确定</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	export default {
		data: function () {
			return {
				table: [],
				lowCharge: 0,
				Charge: 0,
				choiceTable: -1,
				active: {},
				UsedDate: ''
			}
		},
		methods: {
			onBridgeReady () {
				WeixinJSBridge.call('hideOptionMenu')
			},
			toChoiceTable (item, index) {
				if (item.BeUsed !== 0) {
					return
				}
				if (this.choiceTable === index) {
					return
				}
				if (item.BeUsed === 0) {
					this.choiceTable = index
					this.lowCharge = item.LowCharge
				}
			},
			toDetail () {
				if (this.choiceTable === -1) {
					return
				}
				this.$router.push({path: 'choiceDetail', query: {openid: this.$route.query.openid, BuildID: this.$route.query.BuildID, RoomID: this.table[this.choiceTable].RoomID, RoomName: this.table[this.choiceTable].RoomName, LowCharge: this.table[this.choiceTable].LowCharge}})
			},
			installScroll () {
				this.$nextTick(() => {
					if (!this.tableHookScroll) {
						this.tableHookScroll = new BScroll(this.$refs.tableHook, {
							click: true
						})
					} else {
						this.tableHookScroll.refresh()
					}
				})
			}
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
				console.log('调用调用查询预订活动接口开始')
				response = response.body
				console.log(response)
				if (response.code === '0') {
					this.active = response.data
					this.Charge = this.active.Charge
					this.UsedDate = this.active.UsedDate
					console.log(this.active.ShopNo)
					// 调用获取卡台列表接口***********************************************************************
					this.$store.dispatch('setIsLoading', true)
					this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getRoomList', {
							CompanyID: this.active.ShopNo,
							page_pos: 0,
							page_record_count: 100,
							UsedDate: this.active.UsedDate,
							RoomSortID: this.active.RoomSortID,
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
						console.log('调用获取卡台列表接口开始')
						response = response.body
						console.log(response)
						if (response.code === '0') {
							this.table = response.data.rows
							this.installScroll()
						}
						if (response.code !== '0') {
							console.log('返回码不是0')
							this.$store.dispatch('setNowToast', response.msg)
						}
						console.log('调用获取卡台列表接口结束了')
						console.log('******************************************')
					}, response => {
						this.$store.dispatch('setIsLoading', false)
						console.log('调用获取卡台列表接口失败了')
					})
					// 调用获取卡台列表接口********************************************************************
				}
				if (response.code !== '0') {
					console.log('返回码不是0')
					this.$store.dispatch('setNowToast', response.msg)
					if (response.code === '18') {
						history.go(-1)
					}
				}
				console.log('调用调用查询预订活动接口结束了')
				console.log('******************************************')
			}, response => {
				this.$store.dispatch('setIsLoading', false)
				console.log('调用调用查询预订活动接口失败了')
			})
			// 调用调用查询预订活动接口********************************************************************
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .choice-table
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        overflow hidden
        background #f2f2f2
        .choice-table-top
            width 100%
            height 90px
            border-bottom 1px solid rgba(0,0,0,0.1)
            background #423c31
            display flex
            .choice-table-top-left
                flex 1
                height 90px
                border-right 1px solid rgba(0,0,0,0.1)
                padding 10px
                color #cea16a
                background #423c31
                .choice-table-top-left-up
                    font-size 18px
                .choice-table-top-left-mid
                    font-size 15px
                .choice-table-top-left-down
                    font-size 15px
            .choice-table-top-right
                flex 0 0 100px
                height 90px
                padding 10px
                background #423c31
                color rgba(255,255,255,0.7)
                .choice-table-top-right-1
                    text-align right
                    width 100%
                    margin-bottom 5px
                    position relative
                    .choice-table-top-right-1-pic
                        position absolute
                        height 20px
                        width 30px
                        background #3ec1f3
                        top 0
                        border 1px solid rgba(0,0,0,0.1)
                .choice-table-top-right-2
                    margin-bottom 5px
                    text-align right
                    width 100%
                    position relative
                    .choice-table-top-right-2-pic
                        position absolute
                        height 20px
                        width 30px
                        background #b1b1b9
                        top 0
                        border 1px solid rgba(0,0,0,0.1)
                .choice-table-top-right-3
                    text-align right
                    width 100%
                    position relative
                    .choice-table-top-right-3-pic
                        position absolute
                        height 20px
                        width 30px
                        background #f7328d
                        top 0
                        border 1px solid rgba(0,0,0,0.1)
        .choice-table-list
            position absolute
            top 90px
            bottom 55px
            left 0
            width 100%
            overflow hidden
            background #201c19
            .choice-table-list-wrapper
                display flex
                flex-flow row wrap
                justify-content flex-start
                align-content flex-start
                padding 5px
                .choice-table-list-item
                    flex 0 0 33.3%
                    height 27vw
                    padding 5px
                    position relative
                    .choice-table-list-item-in
                        width 100%
                        height 100%
                        border-radius 5px
                        padding 5px
                        color #fff
                        &.white
                            background url("../../common/pic/blueBlock.png")
                            background-size cover
                        &.pink
                            background url("../../common/pic/grayBlock.png")
                            background-size cover
                        &.red
                            background url("../../common/pic/pinkBlock.png")
                            background-size cover
                        .choice-table-list-item-in-title
                            text-align center
                        .choice-table-list-item-in-left
                            display inline-block
                        .choice-table-list-item-in-right
                            display inline-block
                            float right
        .choice-table-bottom
            position absolute
            bottom 0
            left 0
            width 100%
            height 55px
            border-top 1px solid rgba(0,0,0,0.1)
            background #423c31
            display flex
            .choice-table-bottom-left
                flex 1
                height 55px
                color #e54545
                padding-left 10px
                padding-right 10px
                font-size 16px
                line-height 55px
                .choice-table-bottom-left-left
                    display inline-block
                .choice-table-bottom-left-right
                    display inline-block
                    float right
            .choice-table-bottom-right
                flex 0 0 140px
                height 55px
                color #fff
                font-size 20px
                text-align center
                line-height 55px
                &.gray
                    background rgba(0,0,0,0.3)
                &.pink
                    background #cea16a
</style>

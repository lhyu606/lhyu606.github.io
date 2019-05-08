<template>
    <div class="order-history-all" ref="historyComScrollHook">
        <div>
            <div class="load-wrapper-fresh" v-show="showRefresh">
                <load-more :show-loading="showRefresh" tip="正在刷新" style="color: #cea16a" background-color="#201c19"></load-more>
            </div>
            <div class="order-history-all-noKtvPic-wrapper" v-show="orderHistoryCom.length===0&&!showRefresh&&hasReq">
                <div class="order-history-all-noKtvPic">
                    <div class="order-history-all-noKtvPic-pic"></div>
                    <div class="order-history-all-noKtvPic-word">暂时没有订单</div>
                </div>
            </div>
            <div class="order-history-all-item" v-for="(order,index) in orderHistoryCom" @click="toOrderDetail(order)">
                <div class="order-history-all-padding"></div>
                <div class="order-history-all-wrapper">
                    <div class="order-history-all-title-content-wrapper">
                        {{order.CompanyName}}<span class="order-history-all-title-content">{{order.real_status_name}}</span>
                    </div>
                    <div class="order-history-all-item-content">
                        <div class="order-history-all-item-content-wrapper">
                            <div class="order-history-all-item-content-img">
                                <img :src="order.LogoUrl" v-show="order.LogoUrl!==''">
                                <img src="../../../common/pic/KTVlogo.png" v-show="order.LogoUrl===''">
                            </div>
                            <div class="order-history-all-item-content-word">
                                <div class="order-history-all-item-content-word-up">
                                    {{order.BuyBreakName}}
                                </div>
                                <div class="order-history-all-item-content-word-down">
                                    预约时间：{{order.UsedBeginTime}}
                                </div>
                            </div>
                        </div>
                        <div class="order-history-all-item-content-button" v-show="order.IsGrade===0" @click.stop="toComment(order)">评价</div>
                        <div class="order-history-all-item-content-button" v-show="order.IsGrade===1" @click.stop="toComment(order)">已评价</div>
                    </div>
                    <div class="order-history-all-bottom-content-wrapper">
                        卡台验证码: <span class="order-history-all-bottom-content" v-show="order.showCode===1">{{order.OperateCode}}</span>
                        <span class="order-history-all-bottom-content" v-show="order.showCode!==1">- - - - - -</span>
                        <span class="order-history-all-bottom-content-right">￥{{order.PayCharge}}</span>
                    </div>
                </div>
            </div>
            <div class="load-wrapper" v-show="orderHistoryCom.length>0">
                <load-more :show-loading="showLoading" :tip="tip" style="color: #cea16a" background-color="#201c19"></load-more>
            </div>
            <div class="order-history-all-bottom-padding" :style="{height:heightOfBottom+'px'}"></div>
            <!--<div class="order-history-all-bottom-padding"></div>-->
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	//	import Vue from 'vue'
	import BScroll from 'better-scroll'
	//	import _ from 'lodash'
	import { LoadMore } from 'vux'
	export default {
		data: function () {
			return {
				page5: 1,
				showRefresh: false,
				showLoading: false,
				y: 0,
				hasReq: false
			}
		},
		components: {
			LoadMore
		},
		created () {
//			****************************************************
//			console.log(document.documentElement.clientHeight)
			this.$store.dispatch('setIsLoading', true)
			this.$nextTick(() => {
				this.historyComScroll = new BScroll(this.$refs.historyComScrollHook, {
					click: true,
					probeType: 3
				})
				this.historyComScroll.on('touchend', (pos) => {
					if (pos.y < -40 && this.where === 'bottom') {
						this.showLoading = true
						this.requestOrderHistory()
					}
					if (pos.y > 40 && this.where === 'top') {
						this.showRefresh = true
						this.refreshOrderHistory()
					}
				})
				this.historyComScroll.on('scroll', (pos) => {
					this.y = pos.y
				})
				this.refreshOrderHistory()
			})
		},
		methods: {
			requestOrderHistory () {
				// 调用查询用户订单列表接口***********************************************************************
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getCustomerOrderList', {
						page_pos: this.page5,
						page_record_count: 5,
						type: 4,
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
					console.log('调用查询用户订单列表接口开始')
					response = response.body
					console.log(response)
					if (response.code === '0') {
						this.page5++
//				        this.$store.dispatch('setOrderHistory', [])
						this.$store.dispatch('setOrderHistoryCom', this.orderHistoryCom.concat(response.data.rows))
						this.refresh()
						this.$store.dispatch('setIsLoading', false)
						setTimeout(() => {
							this.showLoading = false
						}, 500)
						setTimeout(() => {
							this.showRefresh = false
						}, 500)
						this.hasReq = true
					}
					if (response.code !== '0') {
						this.$store.dispatch('setIsLoading', false)
						if (this.orderHistoryCom.length > 0) {
							this.$store.dispatch('setNowToast', '没有更多订单信息')
						}
						setTimeout(() => {
							this.showLoading = false
						}, 500)
						setTimeout(() => {
							this.showRefresh = false
						}, 500)
						this.hasReq = true
					}
					console.log('调用查询用户订单列表接口结束了')
					console.log('******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					setTimeout(() => {
						this.showLoading = false
					}, 500)
					setTimeout(() => {
						this.showRefresh = false
					}, 500)
				})
				// 调用查询用户订单列表接口********************************************************************
			},
			refreshOrderHistory () {
				this.$store.dispatch('setOrderHistoryCom', [])
				this.page5 = 1
				this.requestOrderHistory()
			},
			refresh () {
				this.$nextTick(() => {
					this.historyComScroll.refresh()
				})
			},
			toOrderDetail (order) {
				if (order.Status === 0) {
					this.$router.push({path: 'pay_list', query: {openid: this.$route.query.openid, DestineOrderID: order.DestineOrderID, OperateID: order.OperateID}})
                    return
                }
				this.$router.push({path: 'order_detail', query: {openid: this.$route.query.openid, DestineOrderID: order.DestineOrderID, OperateID: order.OperateID}})
			},
			toComment (order) {
				this.$router.push({path: 'commentShow', query: {openid: this.$route.query.openid, DestineOrderID: order.DestineOrderID, OperateID: order.OperateID}})
            }
		},
		computed: {
			where () {
				let distant = this.view - this.slider
				if (this.y > 0) {
					return 'top'
				}
				if (this.y < distant) {
					return 'bottom'
				}
				return 'other'
			},
			view () {
				return this.$refs.historyComScrollHook.clientHeight
			},
			slider () {
				if (this.orderHistoryCom.length * 172 + 78 < this.view) {
					return this.view + 1
				}
				return this.orderHistoryCom.length * 172 + 78
			},
			heightOfBottom () {
				let allHeight = document.documentElement.clientHeight
				let heightOfBottom
				let viewHeight
				viewHeight = this.orderHistoryCom.length * 172 + 77.6
//                heightOfBottom = allHeight - viewHeight - 44 + 15
				heightOfBottom = allHeight - viewHeight - 44 + 1
				if (heightOfBottom < 0) {
					heightOfBottom = 0
				}
				return heightOfBottom
			},
			orderHistoryCom () {
				return this.$store.state.orderHistoryCom
			},
			tip () {
				if (this.showLoading) {
					return '正在加载'
				}
				return '上拉加载更多'
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .order-history-all
        position absolute
        width 100%
        top 0
        left 0
        bottom 0
        background #201c19
        overflow hidden
        color #cea16a
        .order-history-all-noKtvPic-wrapper
            width 100%
            height 50%
            .order-history-all-noKtvPic
                position absolute
                margin auto
                left 0
                top 0
                right 0
                bottom 0
                width 190px
                height 220px
                .order-history-all-noKtvPic-pic
                    width 190px
                    height 190px
                    background url("../../../common/pic/noKtvPic.png")
                    background-size cover
                .order-history-all-noKtvPic-word
                    height 30px
                    width 100%
                    text-align center
                    line-height 30px
                    color rgba(255,255,255,0.7)
        .order-history-all-item
            .order-history-all-padding
                width 100%
                height 20px
                background #201c19
            .order-history-all-wrapper
                width 100%
                background #423c31
                padding 0 10px
                font-size 16px
                border-top 1px solid #cea16a
                border-bottom 1px solid #cea16a
                .order-history-all-title-content-wrapper
                    height 40px
                    line-height 40px
                    width 100%
                    padding 0 10px
                    border-bottom 1px solid #cea16a
                    .order-history-all-title-content
                        display inline-block
                        position absolute
                        right 15px
                        color #888
                .order-history-all-item-content
                    position relative
                    background #423c31
                    width 100%
                    .order-history-all-item-content-button
                        position absolute
                        right 20px
                        bottom 23px
                        font-size 15px
                        width 60px
                        height 25px
                        color #fff
                        background #cea16a
                        line-height 25px
                        text-align center
                        border-radius 3px
                    .order-history-all-item-content-wrapper
                        padding 10px
                        width 100%
                        .order-history-all-item-content-img
                            display inline-block
                            vertical-align top
                            height 45px
                            width 45px
                            img
                                border-radius 5px
                                height 50px
                                width 50px
                        .order-history-all-item-content-word
                            display inline-block
                            vertical-align top
                            height 50px
                            width 200px
                            margin-left 10px
                            white-space: nowrap
                            overflow: hidden
                            text-overflow: ellipsis
                            .order-history-all-item-content-word-up
                                margin-bottom 5px
                                font-size 17px
                            .order-history-all-item-content-word-down
                                font-size 10px
                                color #b2b2b2
                .order-history-all-bottom-content-wrapper
                    height 40px
                    line-height 40px
                    width 100%
                    padding 0 10px
                    border-top 1px solid #cea16a
                    .order-history-all-bottom-content
                        color #cea16a
                    .order-history-all-bottom-content-right
                        float right
        .load-wrapper
            width 100%
            height 77.6px
            overflow hidden
            color #cea16a
        .load-wrapper-fresh
            width 100%
            height 40px
            overflow hidden
            color #cea16a
        .order-history-all-bottom-padding
            width 100%
            height 0px
</style>

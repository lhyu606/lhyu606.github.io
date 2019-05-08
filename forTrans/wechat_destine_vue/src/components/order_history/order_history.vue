<template>
    <div class="order-history">
        <div class="order-history-top">
            <div class="order-history-top-item" :class="{active:historyIndex===0}" @click="onItemClick(0)">未使用</div>
            <div class="order-history-top-item" :class="{active:historyIndex===1}" @click="onItemClick(1)">待付款</div>
            <div class="order-history-top-item" :class="{active:historyIndex===2}" @click="onItemClick(2)">退款单</div>
            <div class="order-history-top-item" :class="{active:historyIndex===3}" @click="onItemClick(3)">全部</div>
            <div class="order-history-top-item" :class="{active:historyIndex===4}" @click="onItemClick(4)">待评价</div>
            <div class="order-history-top-bar-wrapper" ref="topBar">
                <div class="order-history-top-bar"></div>
            </div>
        </div>
        <div class="order-history-view">
            <orderhisno ref="orderhisno" v-show="historyIndex===0"></orderhisno>
            <orderhisawait ref="orderhisawait" v-show="historyIndex===1"></orderhisawait>
            <orderhisre ref="orderhisre" v-show="historyIndex===2"></orderhisre>
            <orderhisall ref="orderhisall" v-show="historyIndex===3"></orderhisall>
            <orderhiscom ref="orderhiscom" v-show="historyIndex===4"></orderhiscom>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import orderhisno from './order_history_second_route/order_history_no_use.vue'
    import orderhisawait from './order_history_second_route/order_history_wait_pay.vue'
    import orderhisre from './order_history_second_route/order_history_return.vue'
    import orderhisall from './order_history_second_route/order_history_all.vue'
    import orderhiscom from './order_history_second_route/order_history_comment.vue'
    import TWEEN from 'tween.js'
	export default {
		data: function () {
			return {
            }
		},
		components: {
			orderhisno: orderhisno,
			orderhisawait: orderhisawait,
			orderhisre: orderhisre,
			orderhisall: orderhisall,
			orderhiscom: orderhiscom
		},
        computed: {
	        historyIndex () {
		        return this.$store.state.historyIndex
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
			this.$nextTick(() => {
				if (this.historyIndex === 0) {
					this.$refs.topBar.style.left = '0%'
				}
				if (this.historyIndex === 1) {
					this.$refs.topBar.style.left = '20%'
				}
				if (this.historyIndex === 2) {
					this.$refs.topBar.style.left = '40%'
				}
				if (this.historyIndex === 3) {
					this.$refs.topBar.style.left = '60%'
				}
				if (this.historyIndex === 4) {
					this.$refs.topBar.style.left = '80%'
				}
			})
//			if (typeof WeixinJSBridge === 'undefined') {
//				if (document.addEventListener) {
//					document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
//				} else if (document.attachEvent) {
//					document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
//					document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
//				}
//			} else {
//				this.onBridgeReady()
//			}
//			if (this.$store.state.firstIn) {
//				this.$store.dispatch('setFirstIn', false)
//				this.$store.dispatch('setOpenId', this.$route.query.openid)
//				let href = window.location.href
//				let reqUrl = href.substring(0, href.indexOf('/#'))
//				this.$store.dispatch('setReq', reqUrl)
//			}
		},
        watch: {
	        historyIndex (newIndex, oldIndex) {
		        let positionStar
		        let positionEnd
		        if (newIndex === 0) {
			        positionEnd = 0
                    positionStar = this.cumIndex(oldIndex)
			        this.$nextTick(() => {
				        this.$refs.orderhisno.refresh()
			        })
		        }
		        if (newIndex === 1) {
			        positionEnd = 20
			        positionStar = this.cumIndex(oldIndex)
			        this.$nextTick(() => {
				        this.$refs.orderhisawait.refresh()
			        })
		        }
		        if (newIndex === 2) {
			        positionEnd = 40
			        positionStar = this.cumIndex(oldIndex)
			        this.$nextTick(() => {
				        this.$refs.orderhisre.refresh()
			        })
		        }
		        if (newIndex === 3) {
			        positionEnd = 60
			        positionStar = this.cumIndex(oldIndex)
			        this.$nextTick(() => {
				        this.$refs.orderhisall.refresh()
			        })
		        }
		        if (newIndex === 4) {
			        positionEnd = 80
			        positionStar = this.cumIndex(oldIndex)
			        this.$nextTick(() => {
				        this.$refs.orderhiscom.refresh()
			        })
		        }
		        let vm = this
		        function animate (time) {
			        requestAnimationFrame(animate)
			        TWEEN.update(time)
		        }
		        new TWEEN.Tween({ tweeningNumber: positionStar })
			        .easing(TWEEN.Easing.Quadratic.Out)
			        .to({ tweeningNumber: positionEnd }, 100)
			        .onUpdate(function () {
				        vm.$refs.topBar.style.left = this.tweeningNumber.toFixed(0) + '%'
			        }).start()
		        animate()
	        }
        },
		methods: {
			onBridgeReady () {
				WeixinJSBridge.call('hideOptionMenu')
			},
			onItemClick (index) {
				this.$store.dispatch('setHistoryIndex', index)
			},
            cumIndex (oldIndex) {
	            if (oldIndex === 0) {
		            return 0
	            }
	            if (oldIndex === 1) {
		            return 20
	            }
	            if (oldIndex === 2) {
		            return 40
	            }
	            if (oldIndex === 3) {
		           return 60
	            }
	            if (oldIndex === 4) {
		           return 80
	            }
            }
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .order-history
        position absolute
        width 100%
        height 100%
        top 0
        left 0
        .order-history-top
            position absolute
            width 100%
            height 44px
            top 0
            left 0
            display flex
            font-size 15px
            color rgba(0,0,0,0.5)
            background #423c31
            .order-history-top-item
                flex 1
                height 44px
                text-align center
                line-height 44px
                color rgba(255,255,255,0.7)
                &.active
                    color #cea16a
            .order-history-top-bar-wrapper
                position absolute
                height 4px
                width 20%
                left 0
                bottom 0
                .order-history-top-bar
                    position absolute
                    top 0
                    margin 0 auto
                    height 4px
                    width 70%
                    left 0
                    right 0
                    background #cea16a
                    border-radius 2px
        .order-history-view
            position absolute
            width 100%
            top 44px
            left 0
            bottom 0
</style>

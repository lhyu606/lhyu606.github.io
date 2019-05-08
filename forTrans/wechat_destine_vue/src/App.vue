<template>
    <div id="app">
        <div class="view">
            <transition :name="activeClass">
                <router-view></router-view>
            </transition>
        </div>
        <div class="height-loading">
            <loading v-model="isLoading" position="absolute"></loading>
        </div>
        <toast v-model="toastShow" :text="toastText" type="text" :time="toastTime" position="middle"></toast>
    </div>
</template>

<script>
	import { Loading, Toast } from 'vux'
	export default {
		name: 'app',
		data () {
			return {
				activeClass: '',
				isLoading: false,
				toastShow: false,
				toastTime: 3500,
				toastText: ''
			}
		},
		components: {
			Loading,
			Toast
		},
		created () {
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
		},
		methods: {
//			onBridgeReady () {
//				WeixinJSBridge.call('hideOptionMenu')
//			}
		},
		computed: {
			isLoadingInStore () {
				return this.$store.state.isLoading
			},
			nowToast () {
				return this.$store.state.nowToast
			}
		},
		watch: {
			nowToast () {
				if (this.nowToast === '') {
					return
				}
				this.toastShow = true
				this.toastText = this.nowToast
				this.$store.dispatch('setNowToast', '')
			},
			isLoadingInStore () {
				this.isLoading = this.isLoadingInStore
			},
			$route (to, from) {
				if (to.meta.title) {
					document.title = to.meta.title
				}
				const toDepth = parseInt(to.name)
				const fromDepth = parseInt(from.name)
				if (toDepth > fromDepth) {
					this.activeClass = 'InRightOutLeft'
				} else if (toDepth < fromDepth) {
					this.activeClass = 'InLeftOutRight'
				} else {
					this.activeClas = 'other'
                }
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "./common/stylus/mixin.styl"
    /*@import "../static/css/animate.css"*/
    #app
        position absolute
        width 100%
        height 100%
        top 0
        left 0
        font-family: 'Microsoft yahei'
        .view
            position absolute
            top 0
            bottom 0
            width 100%
        .height-loading
            left 50%
            position absolute
            z-index 900
        .InLeftOutRight-enter-active, .InLeftOutRight-leave-active
            transition all .3s
        .InLeftOutRight-enter
            transform translate3d(-100%, 0, 0)
        .InLeftOutRight-leave-active
            transform translate3d(100%, 0, 0)
        .InRightOutLeft-enter-active, .InRightOutLeft-leave-active
            transition all .3s
        .InRightOutLeft-enter
            transform translate3d(100%, 0, 0)
        .InRightOutLeft-leave-active
            transform translate3d(-100%, 0, 0)
        .other-enter-active, .other-leave-active
            transition all 0s
        .other-enter
            transform translate3d(0, 0, 0)
        .other-leave-active
            transform translate3d(0, 0, 0)
</style>

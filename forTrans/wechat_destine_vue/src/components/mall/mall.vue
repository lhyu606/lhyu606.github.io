<template>
    <div class="ticket-wrapper">
        <!-- <div class="tabs">
            <div class="tab">
                <router-link class="text" :class="{ active: type == 0 }" to="/mall/all" @click="type=0">
                    <span>商品</span>
                </router-link>
            </div>
            <div class="tab">
                <router-link class="text" :class="{ active: type == 1 }" to="/mall/record" @click="type=1">
                    <span>我的订单</span>
                </router-link>
            </div>
            <div class="line"></div>
        </div> -->
        <tabs :list='tabs' />
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
    import Vue from 'vue'
	import BMap from 'BMap'
	import tabs from '@/components/tabs/tabs'
	export default {
		data: function () {
			return {
				ip: '',
                city: '',
                lng: 0,
                lat: 0,
                type: 0,
                tabs: [
                    {
                        type: 0,
                        to: '/mall/all',
                        text: '商品'
                    },
                    {
                        type: 1,
                        to: '/mall/record',
                        text: '我的订单'
                    }
                ]
            }
		},
        created () {
			//alert(this.$route.query.weChatId)
	        // if (typeof WeixinJSBridge === 'undefined') {
		    //     if (document.addEventListener) {
			//         document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
		    //     } else if (document.attachEvent) {
			//         document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
			//         document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
		    //     }
	        // } else {
		    //     this.onBridgeReady()
	        // }
	        if (this.$store.state.IP === '') {
		        let href = window.location.href
		        let reqUrl = href.substring(0, href.indexOf('wechat_destine/#'))
		        this.$store.dispatch('setIp', reqUrl)
	        }
			
            this._initTab()
        },
        methods: {
            _initTab () {
                let item = null
                for (let i=0; i<this.tabs.length; i++){
                    item = this.tabs[i]
                    item.to += '?openid=' + this.$route.query.openid
                    item.to += '&shopNo=' + this.$route.query.shopNo
                    item.to += '&weChatId=' + this.$route.query.weChatId
                    item.to += '&companyId=' + this.$route.query.companyId
                }
                console.log(this.tabs)
            },
	        checkTab (type) {
                console.log(type)
            }
        },
        computed: {
	        cityName () {
			    return this.$store.state.cityName
            },
        },
        components: {
            tabs
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/index.styl";
    .ticket-wrapper
        background #201c19
        min-height 100%
        color #cea16a
        .tabs
            font-size 0px
            width 100%
            height 48px
            border-1px(rgba(255,255,255,0.7))
            .tab
                display inline-block
                width 50%
                height 48px
                font-size 16px
                line-height 48px
                text-align center
                vertical-align top
                position relative
                .text
                    display inline-block
                    width 100%
                    height 48px
                    color #cea16a
                    span
                        position relative
                    &.router-link-exact-active
                        span:after
                            position absolute
                            left 0
                            bottom -6px
                            content ''
                            display block
                            width 100%
                            border-top 1px solid #cea16a
</style>

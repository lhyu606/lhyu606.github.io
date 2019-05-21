<template>
    <div class="ticket-wrapper">
        <div class="tabs">
            <div class="tab" v-for="(item,idx) in tabs" :key="idx">
                <router-link class="text" :class="{ active: type == item.type }" :to="item.to" @click="checkType(item.type)">
                    <span>{{ item.text }}</span>
                </router-link>
            </div>
        </div>
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
                        to: '/ticket/unused',
                        text: '未使用'
                    },
                    {
                        type: 1,
                        to: '/ticket/record',
                        text: '使用记录'
                    },
                    {
                        type: 1,
                        to: '/ticket/invalid',
                        text: '已使用'
                    }
                ]
            }
		},
        created () {
            console.log('this.type')
            console.log(this.type)
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
            checkType (type) {
                this.type = type
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
            background #423c31
            // border-1px(rgba(255,255,255,0.7))
            .tab
                display inline-block
                width 33.3%
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
                            left 50%
                            bottom -14px
                            transform translate(-50%, 0)
                            content ''
                            display block
                            width 50px
                            height 3px
                            border-radius 1.5px
                            background #cea16a
</style>

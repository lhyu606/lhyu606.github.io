<template>
    <div class="list-wrapper">
        我的订单
        <router-link class="get-btn" :to="to">去票券</router-link>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
    import Vue from 'vue'
    import BMap from 'BMap'
    import btn from '@/components/btn/btn'
	export default {
		data: function () {
			return {
				ip: '',
                ticketList: [
                    {
                        id: 1,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 2,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 2,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 3,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 4,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    }
                ],
                to: '/ticket/unused'
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
			this._initTo ()
        },
        methods: {
	        _initTo () {
                this.to += '?openid=' + this.$route.query.openid
                this.to += '&shopNo=' + this.$route.query.shopNo
                this.to += '&weChatId=' + this.$route.query.weChatId
                this.to += '&companyId=' + this.$route.query.companyId
                console.log(this.tabs)
            },
        },
        computed: {
	        isNone () {
                return !this.ticketList.length
            }
        },
        components: {
           
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/index.styl";
.list  
    margin-bottom 20px
.item
    display flex
    justify-content space-space-between
    .left 
        width 80px
        height 80px
        text-align center
        line-height 64px
        img
            width 56px
            height 56px
            margin 12px
    .right
        padding 10px 0
        flex 1 1 auto
        display flex
        flex-direction: column;
        justify-content space-between
        line-height 30px
        border-1px(rgba(255,255,255,0.7))
        .title
            white-space nowrap
        .footer
            display flex 
            justify-content space-between
            padding-right 16px
</style>

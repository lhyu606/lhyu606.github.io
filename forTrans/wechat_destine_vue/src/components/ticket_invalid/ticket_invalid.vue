<template>
    <div class="ticket-contain">
        <goodCard
            :ticketList="ticketList"
            :hasControl="hasControl"
            :noControlText="noControlText"></goodCard>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
    import Vue from 'vue'
    import BMap from 'BMap'
    import btn from '@/components/btn/btn'
    import goodCard from '@/components/good_card/good_card'
	export default {
		data: function () {
			return {
				ip: '',
                ticketList: [
                    {
                        id: 1,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 2,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 2,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 3,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 4,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    }
                ],
                hasControl: false,
                noControlText: '未使用'
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
			
        },
        methods: {
	        
        },
        computed: {
	        isNone () {
                return !this.ticketList.length
            }
        },
        components: {
           goodCard
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/index.styl";
.ticket-contain
    position absolute
    top 48px
    bottom 48px
    overflow hidden
    width 100%
</style>

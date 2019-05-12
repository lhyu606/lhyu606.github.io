<template>
    <div class="ticket-contain">
        <div class="goodCard-contain">
            <goodCard 
                :ticketList="ticketList" 
                v-on:addCart='addCart' 
                v-on:decreaseCart='decreaseCart'
                :hasControl="hasControl"></goodCard>
        </div>
        <div class="getMore-contain">
            <div class="getMore">
                <div v-if="isNone" class="none-box">
                    <div class="none-img"></div>
                    <div class="none-text">
                        <span>暂无数据</span><br/><span>点击下方按钮去获得票券</span>
                    </div>
                </div>
                <router-link class="get-btn" to="/mall">去获得</router-link>
            </div>
        </div>
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
                    },
                    {
                        id: 5,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 6,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 7,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 8,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 9,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 10,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 11,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    }
                ],
                hasControl: true,

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
	        toSelectCity () {
	        	//alert(window.location.href)
		        this.$router.push({path: 'selectCity', query: {openid: this.$route.query.openid, weChatId: this.$route.query.weChatId}})
            },
	        onBridgeReady () {
		        WeixinJSBridge.call('hideOptionMenu')
	        },
	        toHistory () {
		        this.$router.push({path: 'order_history', query: {openid: this.$route.query.openid}})
	        },
	        toTime (shopNo) {
		        this.$router.push({path: 'choiceTime', query: {openid: this.$route.query.openid, shopNo: shopNo, weChatId: this.$route.query.weChatId}})
            },
            ranTime() {
                var time = new Date();
                time += parseInt(Math.random() * 10) * 3600 * 24;
                return new Date(time); 
            }
        },
        computed: {
	        cityName () {
			    return this.$store.state.cityName
            },
            isNone () {
                return !this.ticketList.length
            }
        },
        components: {
            btn,
            goodCard
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/index.styl";
.ticket-contain
    position absolute
    top 48px
    bottom 0px
    padding-bottom 48px
    overflow hidden
    width 100%
    .goodCard-contain
        position absolute 
        top 0
        right 0
        bottom 48px
        left 0
    .getMore-contain
        width 100%
        height 48px
        position absolute
        left 0
        bottom 0
        background #333
    .getMore
        text-align center
        color #cea16a
        .none-box
            margin-top 28px
            .none-img
                margin 0 auto
                width 100px
                height 100px
                background url("../../common/pic/noKtvPic.png") no-repeat center center
                background-size cover
            .none-text
                line-height 24px
        .get-btn
            display block
            margin 10px auto
            width 100px 
            height 30px
            line-height 28px
            font-size 14px
            background #cea16a
            color #201c19
            border-radius 4px
</style>

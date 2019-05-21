<template>
    <div class="ticket-contain" :class="{noTicket: isNone}">
        <div class="goodCard-contain" v-if="!isNone">
            <goodCard 
                :ticketList="ticketList" 
                :hasControl="hasControl"
                v-on:refund="refund">
                <template v-slot:refund>
                    <div  class="refund-btn">退款
                    </div>
                </template>    
            </goodCard>
        </div>
        <div class="getMore-contain" :class="{noTicket: isNone}">
            <div class="getMore">
                <div v-if="isNone" class="none-box">
                    <div class="none-img"></div>
                    <div class="none-text">
                        <span>暂无数据</span><br/><span>点击下方按钮去获得票券</span>
                    </div>
                </div>
                <router-link class="get-btn" :to="to">去获得</router-link>
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
                        "virtualGoodId": 1,
                        "headShopNo": 1,
                        "shopNo": 36,
                        "goodType": 0,
                        "gradeId": 1,
                        "sellNum": 200,
                        "leftNum": 150,
                        "iconUrl": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg",
                        "beginTime": "2019-5-20 10:48:16",
                        "endTime": "2019-5-20 10:48:16",
                        "payType": 0,
                        "cashPrice": 0.01,
                        "integralPrice": 0,
                        "goodName": "测试券0",
                        "remark": "现在开始测试",
                        "sellEndTime": "2019-5-20 10:48:16",
                        "sellBeginTime": "2019-5-20 10:48:16"
                    }
                ],
                hasControl: false,
                to: '/mall'
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
            // gradeid  默认 游客为 0
            // goodtype  默认 0 门票券
            this.$store.dispatch('setIsLoading', true)
            this.$http.post(this.$store.state.IP + 'virtual/ticket/get', {
                access_token: '',
                companycode: '',
                timestamp: '',
                signature: '',
                // wechatPubId: this.$route.query.weChatId,
                data: {
                    openid: this.$route.query.openid,
                    goodtype: 0,
                    month: 5,
                    status: 2
                }
                
            },{
                'emulateJSON': false,
				'headers': {
					'Content-Type': 'application/json;charset=UTF-8'
				}
            }).then(response => {
                this.$store.dispatch('setIsLoading', false)
                console.log(response.body.ret)
                if (response.body.ret === '0') {
                    // this.ticketList = response.body.data
                    console.log(this.ticketList)
                }
               
            }, response => {
                this.$store.dispatch('setIsLoading', false)
                console.log('调用票券列表接口失败了')
            })
            // this.ticketList = this.$store.state.ticketList
			this._initTo ()
        },
        methods: {
            _initTo () {
                this.to += '?openid=' + this.$route.query.openid
                this.to += '&shopNo=' + this.$route.query.shopNo
                this.to += '&weChatId=' + this.$route.query.weChatId
                this.to += '&companyId=' + this.$route.query.companyId
            },
	        onBridgeReady () {
		        WeixinJSBridge.call('hideOptionMenu')
            },
            refund (ticket) {
                // virtual/order/refund
                this.$store.dispatch('setIsLoading', true)
                this.$http.post(this.$store.state.IP + 'virtual/order/refund', {
                    access_token: '',
                    companycode: '',
                    timestamp: '',
                    signature: '',
                    // wechatPubId: this.$route.query.weChatId,
                    data: {
                        payorderid: this.$route.query.openid,
                        refundgoodid: 0,
                    }
                    
                },{
                    'emulateJSON': false,
                    'headers': {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(response => {
                    this.$store.dispatch('setIsLoading', false)
                    console.log(response.body.ret)
                    if (response.body.ret === '0') {
                        // this.ticketList = response.body.data
                        console.log(this.ticketList)
                    }
                
                })
                console.log('tuikuN')
                console.log(ticket)
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
        .refund-btn
            display block
            padding 0 10px
            height 30px
            line-height 28px
            font-size 14px
            background #cea16a
            color #201c19
            border-radius 4px
    .getMore-contain
        width 100%
        height 48px
        position absolute
        left 0
        bottom 0
        background #423c31
        &.noTicket
            height auto
            background #201c19
            bottom 50%
            transform translate(0, 50%)
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

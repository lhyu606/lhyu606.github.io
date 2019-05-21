<template>
    <div class="list-wrapper">
        <ul class="list-box">
            <li v-for='(item, idx) in orderList' :key="idx" class="list-item" @click="toOrderDetail(item)">
                <div class="header">
                    <div class="title">{{ item.goodName}}</div>
                    <div class="num">✖ {{ item.goodNum}}</div>
                </div>
                <div class="body">
                    <div  class="price">价格 {{item.payMoney}}</div>
                    <div  class="num">{{ orderStatusToText(item.orderStatus) }}</div>
                </div>
                <div class="footer">
                    <div class="time">订单时间 </div>
                    <div class="time">{{item.orderCreateTime}} </div>
                </div>
            </li>
        </ul>
        
        <router-link class="get-btn" :to="to">查看票券</router-link>
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
                orderList: [
                    {
                        "virturalOrderId": 3,
                        "headShopNo": 1,
                        "shopNo": 38,
                        "openId": "o8TkNt2oYYCK9aR8Uh9CmBaan8",
                        "payOrderId": "1",
                        "goodNum": 1,
                        "orderStatus": 2,
                        "tradeNo": "23",
                        "payType": 0,
                        "payMoney": 0.02,
                        "payIntegral": 0,
                        "modifyTime": "2019-5-21 10:56:15",
                        "orderCreateTime": "2019-5-20 20:24:17",
                        "payTime": "2019-5-20 20:24:15",
                        "refundOrderTime": "1970-1-1 8:00:01",
                        "refundMoney": 0,
                        "refundIntegral": 0,
                        "remark": "测试一条"
                    },
                    {
                        "virturalOrderId": 5,
                        "headShopNo": 1,
                        "shopNo": 38,
                        "openId": "o8TkNt2oYYCK9aR8Uh9CmBaan8",
                        "payOrderId": "1",
                        "goodNum": 1,
                        "orderStatus": 5,
                        "tradeNo": "24",
                        "payType": 0,
                        "payMoney": 0.01,
                        "payIntegral": 0,
                        "modifyTime": "2019-5-21 11:18:39",
                        "orderCreateTime": "2019-5-20 20:24:17",
                        "payTime": "2019-5-20 20:24:15",
                        "refundOrderTime": "1970-1-1 8:00:01",
                        "refundMoney": 0,
                        "refundIntegral": 0,
                        "remark": "测试一条"
                    }
                ],
                to: '/ticket/unused',
                hasControl: false,
                noControlText: '未使用',
                mouths: 1,
                orderStatus: 0
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
            // 获取当前月
            let date = new Date()
            this.mouths = date.getMonth() + 1

            // 订单查询
            this.$store.dispatch('setIsLoading', true)
            this.$http.post(this.$store.state.IP + 'virtual/order/query', {
                access_token: '',
                companycode: '',
                timestamp: '',
                signature: '',
                // wechatPubId: this.$route.query.weChatId,
                data: {
                    openId: this.$route.query.openid,
                    mouths: this.mouths
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
                    this.orderList = response.body.data
                    // console.log(JSON.stringify( this.orderList,null,4))
                }
               
            }, response => {
                console.log('订单查询失败了')
            })

			this._initTo ()
        },
        methods: {
	        _initTo () {
                this.to += '?openid=' + this.$route.query.openid
                this.to += '&shopNo=' + this.$route.query.shopNo
                this.to += '&weChatId=' + this.$route.query.weChatId
                this.to += '&companyId=' + this.$route.query.companyId
            },
            orderStatusToText(orderStatus) {
                // orderStatus 订单状态：1 未付款，2已付款未消费，3已消费，4 已退款，5订单已过期
                let text = ''
                switch (orderStatus) {
                    case 1:
                        text =  '未付款'
                        break
                    case 2:
                        text =  '已付款未消费'
                        break
                    case 3:
                        text =  '已消费'
                        break
                    case 4:
                        text =  '已退款'
                        break
                    case 5:
                        text =  '已过期'
                        break
                }
                return text
            },
            toOrderDetail (item) {
                this.$router.push({
                    path: '/order_detail',
                    query: {
                        openid: this.$route.query.openid,
                        payOrderId: item.payOrderId
                    }
                })
            }
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
.list-wrapper
    position absolute
    top: 48px;
    bottom: 48px;
    overflow: hidden;
    width: 100%;
    .list-box 
        position relative
        .list-item
            margin-top 12px
            padding 15px
            display flex
            flex-direction column
            justify-content space-between
            background #423c31
            .header
                display flex
                justify-content space-between
            .body
                display flex
                justify-content space-between
            .footer
                display flex
                justify-content space-between
    .get-btn
        display block
        margin 50px auto 20px
        width 100px 
        height 30px
        line-height 28px
        font-size 14px
        background #cea16a
        color #201c19
        text-align center
        border-radius 4px
</style>

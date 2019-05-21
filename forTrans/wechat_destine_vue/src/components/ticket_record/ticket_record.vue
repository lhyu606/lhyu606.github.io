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
                noControlText: '已使用'
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
			// 门票券状态 0未使用 1已核销 2已过期
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

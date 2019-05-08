<template>
    <div class="pay-abandon" ref="payAbandonHook">
        <div>
            <div class="pay-abandon-top">
                <div class="pay-abandon-top-icon"></div>
                退款成功后，已使用的任何优惠不予退还
            </div>
            <div class="pay-abandon-mid">
                <div class="pay-abandon-mid-up">
                    退款金额
                    <div class="pay-abandon-mid-up-money">￥{{order.PayCharge}}</div>
                </div>
                <div class="pay-abandon-mid-down">
                    退款说明
                    <div class="pay-abandon-mid-down-word">确认退款后我们会在2个工作日内退还到您原支付账号上，请注意查收。</div>
                </div>
            </div>
            <div class="pay-abandon-padding"></div>
            <div class="pay-abandon-wrapper">
                <div class="pay-abandon-item">
                    退款理由
                    <div class="pay-abandon-item-word">(至少选择一项)</div>
                </div>
                <div class="pay-abandon-item" @click="clickChecked('1')">
                    选错了日期/卡台类型
                    <div class="pay-abandon-checked" v-show="checked==='1'"></div>
                    <div class="pay-abandon-no-checked" v-show="checked!=='1'"></div>
                </div>
                <div class="pay-abandon-item" @click="clickChecked('2')">
                    临时有事，无法继续消费
                    <div class="pay-abandon-checked" v-show="checked==='2'"></div>
                    <div class="pay-abandon-no-checked" v-show="checked!=='2'"></div>
                </div>
                <div class="pay-abandon-item" @click="clickChecked('3')">
                    人太多了，不想等待
                    <div class="pay-abandon-checked" v-show="checked==='3'"></div>
                    <div class="pay-abandon-no-checked" v-show="checked!=='3'"></div>
                </div>
                <div class="pay-abandon-item" @click="clickChecked('4')">
                    服务态度太差
                    <div class="pay-abandon-checked" v-show="checked==='4'"></div>
                    <div class="pay-abandon-no-checked" v-show="checked!=='4'"></div>
                </div>
                <div class="pay-abandon-item" @click="clickChecked('5')">
                    没有卡台提供
                    <div class="pay-abandon-checked" v-show="checked==='5'"></div>
                    <div class="pay-abandon-no-checked" v-show="checked!=='5'"></div>
                </div>
                <div class="pay-abandon-item" @click="clickChecked('6')">
                    服务人员不会操作，开不了卡台
                    <div class="pay-abandon-checked" v-show="checked==='6'"></div>
                    <div class="pay-abandon-no-checked" v-show="checked!=='6'"></div>
                </div>
                <div class="pay-abandon-item" @click="clickChecked('7')">
                    <div class="pay-abandon-input">
                        <input class="pay-abandon-input-in" v-model="reason" placeholder="请填写退款理由（15字以内）"/>
                    </div>
                    <div class="pay-abandon-checked" v-show="checked==='7'"></div>
                    <div class="pay-abandon-no-checked" v-show="checked!=='7'"></div>
                </div>
            </div>
            <div class="pay-abandon-padding"></div>
            <div class="pay-abandon-down">
                <div class="pay-abandon-down-button-padding"></div>
                <div class="pay-abandon-down-button-left" @click="backOne">不取消了</div>
                <div class="pay-abandon-down-button-padding"></div>
                <div class="pay-abandon-down-button-right" @click="payBack">确定退款</div>
                <div class="pay-abandon-down-button-padding"></div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	export default {
		data: function () {
			return {
				order: {},
				checked: '0',
				reason: ''
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
	        // 调用查询订单详情接口***********************************************************************
	        this.$store.dispatch('setIsLoading', true)
	        this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getOrderDetail', {
			        DestineOrderID: this.$route.query.DestineOrderID,
			        OpenID: this.$route.query.openid,
			        OperateID: this.$route.query.OperateID
		        },
		        {
			        'emulateJSON': false,
			        'headers': {
				        'Content-Type': 'application/json;charset=UTF-8'
			        }
		        }
	        ).then(response => {
		        this.$store.dispatch('setIsLoading', false)
		        console.log('-------------------------------------------')
		        console.log('调用查询订单详情接口开始')
		        response = response.body
		        console.log(response)
		        if (response.code === '0') {
			        this.order = response.data
			        this.$nextTick(() => {
				        this.payAbandonScroll = new BScroll(this.$refs.payAbandonHook, {
					        click: true
				        })
			        })
		        }
		        if (response.code !== '0') {
			        console.log('返回码不是0')
			        this.$store.dispatch('setNowToast', response.msg)
		        }
		        console.log('调用查询订单详情接口结束了')
		        console.log('******************************************')
	        }, response => {
		        this.$store.dispatch('setIsLoading', false)
		        console.log('调用查询订单详情接口失败了')
	        })
	        // 调用查询订单详情接口********************************************************************
        },
        methods: {
	        returnCancelMemo (index) {
	        	if (index === '1') {
	        		return '选错了日期/卡台类型'
                }
	        	if (index === '2') {
	        		return '临时有事，无法继续消费'
                }
	        	if (index === '3') {
	        		return '临时有事，无法继续消费'
                }
	        	if (index === '4') {
	        		return '服务态度太差'
                }
	        	if (index === '5') {
	        		return '没有卡台提供'
                }
	        	if (index === '6') {
	        		return '服务人员不会操作，开不了卡台'
                }
	        	if (index === '7') {
	        		return this.reason
                }
            },
	        onBridgeReady () {
		        WeixinJSBridge.call('hideOptionMenu')
	        },
			clickChecked (index) {
				this.checked = index
            },
	        back () {
				history.go(-7)
            },
	        backOne () {
				history.go(-1)
            },
            payBack () {
	        	if (this.checked === '0') {
			        this.$store.dispatch('setNowToast', '请选择一个理由')
	        		return
                }
	        	if (this.checked === '7' && this.reason === '') {
			        this.$store.dispatch('setNowToast', '请填写退款理由')
	        		return
                }
	            // 调用查询订单详情接口***********************************************************************
	            this.$store.dispatch('setIsLoading', true)
	            this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/Order/refund', {
			            OpenID: this.$route.query.openid,
			            CompanyID: this.order.ShopNo,
			            OperateID: this.order.OperateID,
		                RefundCode: this.checked,
			            CancelMemo: this.returnCancelMemo(this.checked),
			            flag: 'online'
		            },
		            {
			            'emulateJSON': false,
			            'headers': {
				            'Content-Type': 'application/json;charset=UTF-8'
			            }
		            }
	            ).then(response => {
		            this.$store.dispatch('setIsLoading', false)
		            console.log('-------------------------------------------')
		            console.log('调用查询订单详情接口开始')
		            response = response.body
		            console.log(response)
		            if (response.code === '0') {
			            this.$store.dispatch('setNowToast', '提交退款成功')
                        this.backOne()
		            }
		            if (response.code !== '0') {
			            console.log('返回码不是0')
			            this.$store.dispatch('setNowToast', response.msg)
		            }
		            console.log('调用查询订单详情接口结束了')
		            console.log('******************************************')
	            }, response => {
		            this.$store.dispatch('setIsLoading', false)
		            console.log('调用查询订单详情接口失败了')
	            })
	            // 调用查询订单详情接口********************************************************************
            }
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .pay-abandon
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        bottom 0
        overflow hidden
        background #201c19
        .pay-abandon-top
            width 100%
            height 30px
            background #fef5d4
            line-height 30px
            color #cea16a
            .pay-abandon-top-icon
                display inline-block
                vertical-align top
                height 15px
                width 15px
                background-image: url("../../common/pic/tip.png")
                background-size: 15px 15px
                background-repeat: no-repeat
                margin-top 7px
                margin-left 7px
        .pay-abandon-mid
            width 100%
            height 100px
            background #423c31
            .pay-abandon-mid-up
                width 100%
                height 40px
                border-bottom 1px solid rgba(0,0,0,0.1)
                padding 10px 10px 0
                font-size 15px
                color #cea16a
                .pay-abandon-mid-up-money
                    float right
                    color #cea16a
            .pay-abandon-mid-down
                width 100%
                height 60px
                border-bottom 1px solid rgba(0,0,0,0.1)
                padding 10px 10px 0
                position: relative
                font-size 15px
                color #cea16a
                .pay-abandon-mid-down-word
                    position absolute
                    top 10px
                    left 100px
                    right 10px
                    bottom 10px
                    word-wrap:break-word
                    font-size 13px
        .pay-abandon-padding
            height 15px
            width 100%
            background #201c19
        .pay-abandon-wrapper
            background #423c31
            border-top 1px solid rgba(0,0,0,0.1)
            font-size 15px
            .pay-abandon-item
                border-bottom 1px solid rgba(0,0,0,0.1)
                height 50px
                line-height 50px
                padding 0 10px
                position relative
                color #cea16a
                /*.pay-abandon-checked*/
                    /*position absolute*/
                    /**/
                .pay-abandon-no-checked
                    position absolute
                    right 10px
                    top 10px
                    height 30px
                    width 30px
                    background-size 30px 30px
                    background-repeat no-repeat
                    background-image url("../../common/pic/comboCircle.png")
                .pay-abandon-checked
                    position absolute
                    right 10px
                    top 10px
                    height 30px
                    width 30px
                    background-size 30px 30px
                    background-repeat no-repeat
                    background-image url("../../common/pic/comboSelect.png")
                .pay-abandon-item-word
                    display inline-block
                    vertical-align top
                    font-size 10px
                .pay-abandon-input
                    height 50px
                    position absolute
                    left 10px
                    right 100px
                    color #cea16a
                    .pay-abandon-input-in
                        color #cea16a
                        background #423c31
                        height 40px
                        line-height 40px
                        width 100%
                        outline none
        .pay-abandon-down
            width 100%
            height 50px
            display flex
            .pay-abandon-down-button-padding
                height 50px
                flex 0 0 15px
            .pay-abandon-down-button-left
                text-align center
                line-height 50px
                font-size 17px
                border-radius 3px
                height 50px
                flex 1
                color #fff
                background #cea16a
            .pay-abandon-down-button-right
                height 50px
                flex 1
                background #888888
                color #fff
                border-radius 3px
                font-size 17px
                line-height 50px
                text-align center
</style>

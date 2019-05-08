<template>
    <!--<div class="pay-success" @click="toOrderDetail">-->
    <div class="pay-success">
        <div class="pay-success-top">
            <div class="pay-success-top-icon"></div>
            恭喜您，购买成功！
        </div>
        <div class="pay-success-mid">
            <div class="pay-success-mid-padding"></div>
            <div class="pay-success-mid-circle"></div>
            <div class="pay-success-mid-up">
                <img src="../../common/pic/KTVlogo.png" v-show="order.LogoUrl===''">
                <img :src="order.LogoUrl" v-show="order.LogoUrl!==''">
                <div class="pay-success-mid-up-word-wrapper">
                    <div class="pay-success-mid-up-word-up">{{order.CompanyName}}</div>
                    <div class="pay-success-mid-up-word-down">{{UsedBeginTime}} {{order.RoomSortName}}</div>
                </div>
            </div>
            <div class="pay-success-mid-down">
                <div class="pay-success-mid-down-up-wrapper">
                    <div class="pay-success-mid-down-up-wrapper-left">卡台验证码：</div>
                    <div class="pay-success-mid-down-up-wrapper-right">{{order.OperateCode}}</div>
                </div>
                <div class="pay-success-mid-down-down">分享验证码让小伙伴先开卡台</div>
            </div>
        </div>
        <div class="pay-success-padding"></div>
        <div class="pay-success-bottom">
            <div class="pay-success-bottom-button" @click="toOrderDetail">查看订单</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	export default {
		data: function () {
			return {
				order: {}
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
		computed: {
			UsedBeginTime () {
				if (this.order.UsedBeginTime === undefined) {
					return ''
				}
//				let time = new Date(this.order.UsedBeginTime)
				let dateStr = this.order.UsedBeginTime
				let arr = dateStr.split(/[- :]/)
				let time = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
				return this.testTen((time.getMonth() + 1)) + '-' + this.testTen(time.getDate()) + ' ' + this.timeFormat(time) + ' ' + this.testTen(time.getHours()) + ':' + this.testTen(time.getMinutes())
			}
        },
		methods: {
			onBridgeReady () {
				WeixinJSBridge.call('hideOptionMenu')
			},
			dateToString (date) {
				return date.getFullYear() + '-' + this.testTen(date.getMonth() + 1) + '-' + date.getDate()
			},
			timeFormat (time) {
				let y = time.getUTCDay()
				let yString = ''
				if (y === 1) {
					yString = '周一'
				}
				if (y === 2) {
					yString = '周二'
				}
				if (y === 3) {
					yString = '周三'
				}
				if (y === 4) {
					yString = '周四'
				}
				if (y === 5) {
					yString = '周五'
				}
				if (y === 6) {
					yString = '周六'
				}
				if (y === 0) {
					yString = '周日'
				}
				let date1 = new Date()
				let date2 = new Date()
				date2.setDate(date1.getDate() + 1)
				let date3 = new Date()
				date3.setDate(date1.getDate() + 2)
				if (this.dateToString(date1) === this.dateToString(time)) {
					yString = '今天'
				}
				if (this.dateToString(date2) === this.dateToString(time)) {
					yString = '明天'
				}
				if (this.dateToString(date3) === this.dateToString(time)) {
					yString = '后天'
				}
				return yString
			},
			testTen (test) {
				if (test < 10) {
					return '0' + test
				}
				if (test > 9) {
					return '' + test
				}
			},
			toOrderDetail () {
				this.$router.push({path: 'order_detail', query: {openid: this.$route.query.openid, DestineOrderID: this.$route.query.DestineOrderID, OperateID: this.$route.query.OperateID}})
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .pay-success
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        overflow hidden
        background #201c19
        color #cea16a
        .pay-success-top
            width 100%
            height 100px
            background #201c19
            line-height 100px
            text-align center
            color #cea16a
            font-size 18px
            .pay-success-top-icon
                display inline-block
                vertical-align top
                width: 20px
                height: 20px
                background-image: url("../../common/pic/tip.png")
                background-size: 20px 20px
                background-repeat: no-repeat
                margin-top 39px
        .pay-success-mid
            width 100%
            height 200px
            background #423c31
            border-top 1px solid #cea16a
            border-bottom 1px solid #cea16a
            position relative
            .pay-success-mid-padding
                height 12.5px
                width 100%
                position absolute
                top -13.5px
                background #201c19
                left 0
                z-index 10
            .pay-success-mid-circle
                height 25px
                width 25px
                top -12.5px
                left 50%
                border-radius 50%
                background #201c19
                position absolute
                transform translate(-50%,0)
                border 1px solid #cea16a
            .pay-success-mid-up
                width 100%
                height 122px
                border-bottom 2px dotted #cea16a
                padding 10px
                img
                    width 50px
                    height 50px
                    border-radius 3px
                    margin-top 30px
                .pay-success-mid-up-word-wrapper
                    margin-top 30px
                    display inline-block
                    vertical-align top
                    margin-left 10px
                    .pay-success-mid-up-word-up
                        font-size 17px
                    .pay-success-mid-up-word-down
                        font-size 13px
                        color rgba(255,255,255,0.7)
            .pay-success-mid-down
                width 100%
                height 78px
                padding 10px
                .pay-success-mid-down-up-wrapper
                    height 27px
                    line-height 27px
                    .pay-success-mid-down-up-wrapper-left
                        display inline-block
                        vertical-align top
                        font-size 15px
                    .pay-success-mid-down-up-wrapper-right
                        display inline-block
                        vertical-align top
                        font-size 18px
                        color #cea16a
                .pay-success-mid-down-down
                    color rgba(255,255,255,0.7)
        .pay-success-padding
            width 100%
            height 25px
            background #201c19
        .pay-success-bottom
            width 100%
            height 50px
            .pay-success-bottom-button
                height 50px
                width 160px
                margin 0 auto
                left 0
                right 0
                border 2px solid #cea16a
                border-radius 4px
                text-align center
                line-height 46px
                color #cea16a
                font-size 17px
</style>

<template>
    <div class="selectCity" ref="selectCityHook">
        <div class="selectCity-wrapper">
            <div class="selectCity-GPS-top" v-show="GPSCity!==''">GPS定位省份</div>
            <div class="selectCity-GPS" @click="toSelectKTV(GPSCity)" v-show="GPSCity!==''">
                {{GPSCity}}
                <div class="selectCity-GPS-icon"></div>
            </div>
            <div class="selectCity-GPS-top" v-show="cityList.length>0">可选省份</div>
            <div class="selectCity-wrapper-in-wrapper" @click="toSelectKTV('全部')">
                <div class="selectCity-wrapper-in-left"></div>
                <div class="selectCity-wrapper-in-right">全部显示</div>
                <div class="selectCity-wrapper-in-right-icon"></div>
            </div>
                <!--<div class="selectCity-wrapper-in-title">{{itemOut.index}}</div>-->
            <div class="selectCity-wrapper-in-wrapper" @click="toSelectKTV(item)" v-for="item in cityList">
                <div class="selectCity-wrapper-in-left"></div>
                <div class="selectCity-wrapper-in-right">{{item}}</div>
                <div class="selectCity-wrapper-in-right-icon"></div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
//	import Vue from 'vue'
	export default {
		//			调用2.3开通电子会员卡权限的城市列表
		// 调用百度定位接口
		data: function () {
			return {
				cityList: [],
				GPSCity: ''
			}
		},
		computed: {
		},
		methods: {
			onBridgeReady () {
				WeixinJSBridge.call('hideOptionMenu')
			},
			toSelectKTV (city) {
				this.$store.dispatch('setCityName', city)
				history.go(-1)
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
//	        调用百度接口开始******************************************************************
			this.$store.dispatch('setIsLoading', true)
			this.$http.jsonp('http://api.map.baidu.com/location/ip?ak=jT4Dfk6xF7aZMMFwb7iQ6l5BaFryRm9z', {
				params: {},
				jsonp: 'callback'
			}).then(response => {
				this.$store.dispatch('setIsLoading', false)
				response = response.body.content.address_detail.province
				console.log(response)
				console.log(response.province)
				if (response[response.length - 1] === '市') {
					response = response.substr(0, response.length - 1)
				}
				if (response[response.length - 1] === '省') {
					response = response.substr(0, response.length - 1)
				}
				this.GPSCity = response
				console.log('1-------------------------------------------')
				console.log('cityList页的百度定位接口开始')
				console.log(response)
//                alert(this.$route.query.weChatId)
//	            调用2.3开通电子会员卡权限的城市列表开始**********************************************
				this.$store.dispatch('setIsLoading', true)
//				this.$http.post(this.$store.state.IP + 'yjmemberserver/city/list/ecard', {
//						// 不传值的时候带有热门城市
//						wechatpubid: this.$route.query.weChatId
//					},
//					{
//						'emulateJSON': false
//					}
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getShops', {
//				this.$http.post('http://yf.evideocloud.com.cn/' + 'reserve_service/Wechat/Destine/getShops', {
						// 不传值的时候带有热门城市
						wechatPubId: this.$route.query.weChatId
					},
					{
						'emulateJSON': false,
						'headers': {
							'Content-Type': 'application/json;charset=UTF-8'
						}
					}
				).then(response => {
					this.$store.dispatch('setIsLoading', false)
					response = response.body
					console.log('2-------------------------------------------')
					console.log('cityList页的城市列表接口开始')
					console.log(response)
					if (response.code === '0') {
						response.data.forEach((item) => {
							this.cityList.push(item.province)
                        })
						console.log('返回码是0')
						this.$nextTick(() => {
							this.selectCityScroll = new BScroll(this.$refs.selectCityHook, {
								click: true
							})
						})
					}
					if (response.code !== '0') {
						console.log('返回码不是0')
						this.$store.dispatch('setNowToast', response.msg)
//						this.$store.dispatch('setNowToast', '系统繁忙中')
					}
					console.log('cityList页的城市列表接口结束')
					console.log('2******************************************')
				}, response => {
					this.$store.dispatch('setIsLoading', false)
					console.log('调用cityList页的城市列表接口失败')
				})
//	            调用2.3开通电子会员卡权限的城市列表结束**********************************************
				console.log('KTVlist页的百度定位接口结束')
				console.log('1******************************************')
			}, response => {
				this.$store.dispatch('setIsLoading', false)
				console.log('调用百度定位接口失败')
			})
//	        调用百度接口结束******************************************************************
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .selectCity
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        overflow hidden
        .selectCity-GPS-top
            width 100%
            height 30px
            background #ddd
            line-height 30px
            padding-left 10px
            color #777
        .selectCity-GPS
            width 100%
            height 40px
            line-height 40px
            padding-left 10px
            position relative
            border-bottom 1px solid rgba(0,0,0,.1)
            .selectCity-GPS-icon
                position absolute
                right 7px
                top 11px
                display inline-block
                vertical-align top
                height 18px
                width 18px
                background-image: url("../../common/pic/jtr.png")
                background-size: 18px 18px
                background-repeat: no-repeat
        /*.selectCity-wrapper-in-title*/
            /*width 100%*/
            /*height 30px*/
            /*background #bbb*/
            /*line-height 30px*/
            /*padding-left 10px*/
            /*color #777*/
        .selectCity-wrapper-in-wrapper
            position relative
            height 40px
            width 100%
            &:last-child
                .selectCity-wrapper-in-right
                    border-bottom none
        .selectCity-wrapper-in-left
            height 40px
            width 10px
            display inline-block
            vertical-align top
        .selectCity-wrapper-in-right
            position absolute
            height 40px
            top 0
            left 10px
            right 0
            line-height 40px
            border-bottom 1px solid rgba(0,0,0,.1)
        .selectCity-wrapper-in-right-icon
            position absolute
            right 7px
            top 11px
            display inline-block
            vertical-align top
            height 18px
            width 18px
            background-image: url("../../common/pic/jtr.png")
            background-size: 18px 18px
            background-repeat: no-repeat
</style>

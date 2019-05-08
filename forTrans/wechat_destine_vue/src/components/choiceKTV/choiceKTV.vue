<template>
    <div class="choice-KTV-wrapper">
        <div class="selectKTV-top">
            <!-- <div class="selectKTV-top-left" @click="toSelectCity">{{city}}
                <div class="selectKTV-top-left-icon"></div>
            </div> -->
        </div>
        <div class="choice-KTV" ref="choiceKTVHook">
            <div>
                <!-- <div v-for="itemOut in KTVlist" v-show="itemOut.province===city||city==='全部'"> -->
                <div v-for="itemOut in KTVlist">
                    <div class="choice-KTV-item" v-for="item in itemOut.shops" v-show="item.Exists">
                        <div class="choice-KTV-item-wrapper" @click="toTime(item.CompanyID)">
                            <img src="../../common/pic/KTVlogo.png" v-show="item.LogoUrl===''">
                            <img :src="item.LogoUrl" v-show="item.LogoUrl!==''">
                            <div class="choice-KTV-item-word-wrapper">
                                <div class="choice-KTV-item-word-up">{{item.CompanyName}}</div>
                                <div class="choice-KTV-item-word-up-destine"></div>
                                <div class="choice-KTV-item-word-up-room"></div>
                                <div class="choice-KTV-item-word-up-wifi"></div>
                                <div class="choice-KTV-item-word-down">{{item.CompanyAddress}}</div>
                                <div class="choice-KTV-item-word-bottom">
                                    <span class="choice-KTV-item-word-bottom-in-right">低消</span>
                                    <span class="choice-KTV-item-word-bottom-in">￥{{item.LowCharge}}</span>
                                    <span class="choice-KTV-item-word-bottom-in-right">起</span>
                                </div>
                                <div class="choice-KTV-item-word-bottom">
                                    <span class="choice-KTV-item-word-bottom-in-right">订金</span>
                                    <span class="choice-KTV-item-word-bottom-in">￥{{item.Charge}}</span>
                                    <span class="choice-KTV-item-word-bottom-in-right">起</span>
                                </div>
                            </div>
                            <!--<div class="choice-KTV-item-distant">{{item.juli}}km</div>-->
                            <div class="choice-KTV-item-distant" v-show="item.juli">{{item.juli}}</div>
                        </div>
                        <div class="choice-KTV-item-padding"></div>
                    </div>
                </div>
            </div>
            <div class="choice-KTV-order-history" @click="toHistory">
                <img src="../../common/pic/destine.png">
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
    import Vue from 'vue'
	import BMap from 'BMap'
	export default {
		data: function () {
			return {
				ip: '',
                city: '',
                lng: 0,
                lat: 0
            }
		},
        created () {
//			alert(this.$route.query.weChatId)
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
//			if (this.KTVlist.length === 0) {
            // 百度的API中获取经纬度的方法
            let geolocation = new BMap.Geolocation()
            let vm = this
            this.$store.dispatch('setIsLoading', true)
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() === 0) {
                    vm.$store.dispatch('setIsLoading', false)
                    vm.lat = r.point.lat
                    vm.lng = r.point.lng
                    //	        调用百度接口开始******************************************************************
                    vm.$store.dispatch('setIsLoading', true)
                    vm.$http.jsonp('http://api.map.baidu.com/location/ip?ak=jT4Dfk6xF7aZMMFwb7iQ6l5BaFryRm9z', {
                        params: {},
                        jsonp: 'callback'
                    }).then(response => {
                        vm.$store.dispatch('setIsLoading', false)
                        response = response.body.content.address_detail
	                    if (response.province[response.province.length - 1] === '市') {
		                    response.province = response.province.substr(0, response.province.length - 1)
	                    }
	                    if (response.province[response.province.length - 1] === '省') {
		                    response.province = response.province.substr(0, response.province.length - 1)
	                    }
                        vm.city = response.province
                        if (vm.$store.state.cityName !== '') {
                            vm.city = vm.$store.state.cityName
                        }
                        // 调用场所列表接口***********************************************************************
                        vm.$store.dispatch('setIsLoading', true)
                        vm.$http.post(vm.$store.state.IP + 'reserve_service/Wechat/Destine/getShops', {
//                        vm.$http.post('http://yf.evideocloud.com.cn/' + 'reserve_service/Wechat/Destine/getShops', {
		                        wechatPubId: vm.$route.query.weChatId
                            },
                            {
                                'emulateJSON': false,
                                'headers': {
                                    'Content-Type': 'application/json;charset=UTF-8'
                                }
                            }
                        ).then(response => {
                            vm.$store.dispatch('setIsLoading', false)
                            console.log('-------------------------------------------')
                            console.log('调用场所列表接口开始')
                            response = response.body
                            console.log(response)
                            if (response.code === '0') {
                                console.log('返回码是0')
	                            response.data.forEach((itemOut) => {
		                            itemOut.shops.forEach((item) => {
//							         百度API中计算两个经纬度之间距离的方法
			                            let map = new BMap.Map('container')
			                            let point1 = new BMap.Point(vm.lng, vm.lat)
			                            if (item.MapPositionX && item.MapPositionY) {
				                            // http://lbsyun.baidu.com/index.php?title=webapi/guide/changeposition
				                            // google地图、soso地图、aliyun地图、mapabc地图和amap地图所用坐标，国测局（gcj02）坐标;
				                            // 转换成百度坐标参考的文档
				                            // 微信地图使用的坐标也是gcj02
				                            // 思路是gcj02坐标转百度坐标完成距离计算
				                            // gcj02坐标在微信地图中使用完成打开导航的任务
				                            let point2 = new BMap.Point(item.MapPositionY, item.MapPositionX)
				                            let distance = map.getDistance(point1, point2) // 两个经纬度之间的距离，单位是米
				                            distance = parseInt(distance / 1000) + 'km'
				                            Vue.set(item, 'juli', distance)
			                            }
			                            if (!item.MapPositionX || !item.MapPositionY) {
				                            Vue.set(item, 'juli', '')
			                            }
//							         百度API中计算两个经纬度之间距离的方法
                                    })
                                })
                                vm.$store.dispatch('setKTVList', response.data)
                                console.log(vm.KTVlist)
                                vm.$nextTick(() => {
                                    vm.choiceKTVScroll = new BScroll(vm.$refs.choiceKTVHook, {
                                        click: true
                                    })
                                    let shopsCount = 0
                                    let firstShopNo = ''
                                    vm.KTVlist.forEach((itemOut) => {
                                        itemOut.shops.forEach((item) => {
                                            if (item.Exists) {
                                                if (firstShopNo === '') {
                                                    firstShopNo = item.CompanyID
                                                }
                                                shopsCount++
                                            }
                                        })
                                    })
                                    if (shopsCount === 1) {
	                                    // vm.toTime(firstShopNo)
                                    }
                                })
                            }
                            if (response.code !== '0') {
                                console.log('返回码不是0')
                                vm.$store.dispatch('setNowToast', response.msg)
                            }
                            console.log('调用场所列表接口结束了')
                            console.log('******************************************')
                        }, response => {
                            vm.$store.dispatch('setIsLoading', false)
                            console.log('调用场所列表接口失败了')
                        })
                        // 调用场所列表接口********************************************************************
                    }, response => {
                        vm.$store.dispatch('setIsLoading', false)
                    })
                    //	        调用百度接口结束******************************************************************
                } else {
//			        alert('failed' + this.getStatus())
                    vm.$store.dispatch('setIsLoading', false)
                    vm.lat = 0
                    vm.lng = 0
                    //	        调用百度接口开始******************************************************************
                    vm.$store.dispatch('setIsLoading', true)
                    vm.$http.jsonp('http://api.map.baidu.com/location/ip?ak=jT4Dfk6xF7aZMMFwb7iQ6l5BaFryRm9z', {
                        params: {},
                        jsonp: 'callback'
                    }).then(response => {
                        vm.$store.dispatch('setIsLoading', false)
                        response = response.body.content.address_detail
                        console.log(response)
                        console.log(response.province)
	                    if (response.province[response.province.length - 1] === '市') {
		                    response.province = response.province.substr(0, response.province.length - 1)
	                    }
	                    if (response.province[response.province.length - 1] === '省') {
		                    response.province = response.province.substr(0, response.province.length - 1)
	                    }
	                    vm.city = response.province
	                    if (vm.$store.state.cityName !== '') {
		                    vm.city = vm.$store.state.cityName
//		                        vm.$store.dispatch('setCityName', response.city)
	                    }
                        // 调用场所列表接口***********************************************************************
                        vm.$store.dispatch('setIsLoading', true)
                        vm.$http.post(vm.$store.state.IP + 'reserve_service/Wechat/Destine/getShops', {
//	                    vm.$http.post('http://yf.evideocloud.com.cn/' + 'reserve_service/Wechat/Destine/getShops', {
			                    wechatPubId: vm.$route.query.weChatId
                            },
                            {
                                'emulateJSON': false,
                                'headers': {
                                    'Content-Type': 'application/json;charset=UTF-8'
                                }
                            }
                        ).then(response => {
                            vm.$store.dispatch('setIsLoading', false)
                            console.log('-------------------------------------------')
                            console.log('调用场所列表接口开始')
                            response = response.body
                            console.log(response)
                            if (response.code === '0') {
                                console.log('返回码是0')
                                vm.$store.dispatch('setNowToast', '调用场所列表接口成功')
	                            response.data.forEach((itemOut) => {
		                            itemOut.shops.forEach((item) => {
			                            Vue.set(item, 'juli', '')
		                            })
	                            })
                                vm.$store.dispatch('setKTVList', response.data)
                                console.log(vm.KTVlist)
                                vm.$nextTick(() => {
                                    vm.choiceKTVScroll = new BScroll(vm.$refs.choiceKTVHook, {
                                        click: true
                                    })
                                    let shopsCount = 0
                                    let firstShopNo = ''
                                    vm.KTVlist.forEach((itemOut) => {
                                        itemOut.shops.forEach((item) => {
                                            if (item.Exists) {
                                                if (firstShopNo === '') {
                                                    firstShopNo = item.CompanyID
                                                }
                                                shopsCount++
                                            }
                                        })
                                    })
                                    if (shopsCount === 1) {
	                                    vm.toTime(firstShopNo)
                                    }
                                })
                            }
                            if (response.code !== '0') {
                                console.log('返回码不是0')
                                vm.$store.dispatch('setNowToast', response.msg)
                            }
                            console.log('调用场所列表接口结束了')
                            console.log('******************************************')
                        }, response => {
                            vm.$store.dispatch('setIsLoading', false)
                            console.log('调用场所列表接口失败了')
                        })
                        // 调用场所列表接口********************************************************************
                    }, response => {
                        vm.$store.dispatch('setIsLoading', false)
                    })
                    //	        调用百度接口结束******************************************************************
                }
            })
            // 百度的API中获取经纬度的方法
        },
        methods: {
	        toSelectCity () {
//	        	alert(window.location.href)
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
            }
        },
        computed: {
	        cityName () {
			    return this.$store.state.cityName
            },
	        KTVlist () {
	        	return this.$store.state.KTVlist
            }
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .choice-KTV-wrapper
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        .selectKTV-top
            position absolute
            top 0
            left 0
            width 100%
            height 40px
            background #cea16a
            line-height 40px
            padding 0 10px
            .selectKTV-top-left
                color #fff
                display inline-block
                width 70px
                .selectKTV-top-left-icon
                    margin-top 10px
                    display inline-block
                    vertical-align top
                    height 20px
                    width 20px
                    background-image: url("../../common/pic/pull_down.png")
                    background-size: 20px 20px
                    background-repeat: no-repeat
        .choice-KTV
            width 100%
            height 100%
            position absolute
            top 40px
            left 0
            overflow hidden
            background #201c19
            .choice-KTV-item-wrapper
                width 100%
                height 120px
                background #423c31
                border-top 1px solid #cea16a
                border-bottom 1px solid #cea16a
                padding 20px
                position relative
                img
                    width 80px
                    height 80px
                    border-radius 5px
                .choice-KTV-item-word-wrapper
                    display inline-block
                    vertical-align top
                    margin-left 13px
                    .choice-KTV-item-word-up
                        font-weight 600
                        font-size 17px
                        margin-bottom 4px
                        display inline-block
                        vertical-align top
                        color #cea16a
                    .choice-KTV-item-word-up-destine
                        display inline-block
                        vertical-align top
                        background-repeat no-repeat
                        background-size 17px 17px
                        width: 17px
                        height: 17px
                        background-image: url("../../common/pic/destine_icon.png")
                        margin-top 5px
                        color #e9c088
                    .choice-KTV-item-word-up-room
                        margin-top 5px
                        display inline-block
                        vertical-align top
                        background-repeat no-repeat
                        background-size 17px 17px
                        width: 17px
                        height: 17px
                        background-image: url("../../common/pic/room_icon.png")
                    .choice-KTV-item-word-up-wifi
                        margin-top 5px
                        display inline-block
                        vertical-align top
                        background-repeat no-repeat
                        background-size 26px 17px
                        width: 26px
                        height: 17px
                        background-image: url("../../common/pic/wifi_icon.png")
                    .choice-KTV-item-word-down
                        font-size 14px
                        color #e9c088
                        width 150px
                        height 25px
                        white-space nowrap
                        text-overflow ellipsis
                    .choice-KTV-item-word-bottom
                        font-size 0
                        display inline-block
                        vertical-align top
                        margin-right 10px
                        .choice-KTV-item-word-bottom-in
                            color #cea16a
                            font-size 15px
                        .choice-KTV-item-word-bottom-in-right
                            font-size 13px
                            color rgba(255,255,255,0.7)
                .choice-KTV-item-distant
                    position absolute
                    right 30px
                    top 75px
                    font-size 14px
                    color rgba(255,255,255,0.7)
            .choice-KTV-item-padding
                width 100%
                height 15px
                background #201c19
            .choice-KTV-order-history
                position fixed
                z-index 100
                width 60px
                height 60px
                left 40px
                bottom 40px
                img
                    width 60px
                    height 60px
</style>

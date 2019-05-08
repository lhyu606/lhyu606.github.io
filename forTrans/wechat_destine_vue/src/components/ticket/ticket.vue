<template>
    <div class="ticket-wrapper">
        <div class="tabs">
            <div class="tab">
                <router-link class="text" :class="{ active: type == 0 }" to="/ticket/unused" @click="type=0">
                    <span>未使用</span>
                </router-link>
            </div>
            <div class="tab">
                <router-link class="text" :class="{ active: type == 1 }" to="/ticket/record" @click="type=1">
                    <span>使用记录</span>
                </router-link>
            </div>
            <div class="tab">
                <router-link class="text" :class="{ active: type == 2 }" to="/ticket/invalid" @click="type=2">
                    <span>已过期</span>
                </router-link>
            </div>
        </div>
        <router-view></router-view>
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
                lat: 0,
                type: 0
            }
		},
        created () {console.log(window.devicePixelRatio)
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
			//if (this.KTVlist.length === 0) {
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
                    //  vm.$http.post('http://yf.evideocloud.com.cn/' + 'reserve_service/Wechat/Destine/getShops', {
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
							        // 百度API中计算两个经纬度之间距离的方法
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
							        // 百度API中计算两个经纬度之间距离的方法
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
			        //alert('failed' + this.getStatus())
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
		                        //vm.$store.dispatch('setCityName', response.city)
	                    }
                        // 调用场所列表接口***********************************************************************
                        vm.$store.dispatch('setIsLoading', true)
                        vm.$http.post(vm.$store.state.IP + 'reserve_service/Wechat/Destine/getShops', {
	                    //vm.$http.post('http://yf.evideocloud.com.cn/' + 'reserve_service/Wechat/Destine/getShops', {
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
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/index.styl";
    .ticket-wrapper
        background #201c19
        min-height 100%
        color #cea16a
        .tabs
            font-size 0px
            width 100%
            height 48px
            border-1px(rgba(255,255,255,0.7))
            .tab
                display inline-block
                width 33.3%
                height 48px
                font-size 18px
                line-height 48px
                text-align center
                vertical-align top
                position relative
                .text
                    display inline-block
                    width 100%
                    height 48px
                    color #cea16a
                    span
                        position relative
                    &.router-link-exact-active
                        span:after
                            position absolute
                            left 0
                            bottom -6px
                            content ''
                            display block
                            width 100%
                            border-top 1px solid #cea16a
</style>

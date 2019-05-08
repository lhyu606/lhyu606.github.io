<template>
    <!--<div class="choice-table" @click="toDetail">-->
    <div class="choice-table" id="choiceTableHook">
        <div class="choice-table-top">
            <div class="choice-table-top-left">
                <div class="choice-table-top-left-up">{{active.RoomSortName}}({{active.KmMinPerson}}人-{{active.KmMaxPerson}}人)</div>
                <div class="choice-table-top-left-mid">{{UsedDate}}</div>
                <div class="choice-table-top-left-down">{{active.BuyBreakName}}</div>
                <div class="choice-table-top-left-right" v-if="choiceTable!==-1">已选卡台:{{table[choiceTable].RoomName}}</div>
            </div>
            <div class="choice-table-top-right">
                <div class="choice-table-top-right-2">不可选
                    <div class="choice-table-top-right-2-pic"></div>
                </div>
                <div class="set-seat-shop" v-show="mapList.length>1">
                    <span>楼层:</span>
                    <select v-model="nowFloor">
                        <option v-for="(item,index) in mapList" :value="index">{{item.mapName}}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="choice-little-map" ref="littleMapHooK" id="littleMapHook" v-show="showLittle">
            <div class="choice-little-map-block" ref="littleMapHooKBlock" id="littleMapHooKBlock"></div>
        </div>
        <div class="choice-table-list" ref="mapWrapperHook" id="mapWrapperHook">
            <div class="choice-table-list-wrapper">
                <div class="choice-table-map" id="mapHook" ref="mapHook" :style="{backgroundImage: mapBack,width: mapWidth + 'px', height: mapHeight + 'px'}"></div>
            </div>
        </div>
        <div class="choice-table-bottom">
            <div class="choice-table-bottom-left">
                <div v-if="choiceTable!==-1" class="choice-table-bottom-left-left">订金：{{Charge}}</div>
                <div v-if="choiceTable!==-1" class="choice-table-bottom-left-right">最低消费：{{lowCharge}}</div>
                <div v-if="choiceTable===-1">请选择您要预订的卡台</div>
            </div>
            <div class="choice-table-bottom-right" :class="{pink:choiceTable!==-1,gray:choiceTable===-1}" @click="toDetail">确定</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
//    import Hammer from 'hammerjs'
    import AlloyFinger from 'alloyfinger'
	export default {
		data: function () {
			return {
				toBig: false, // 是否双击缩放
				scrollX: 0, // X轴的滚动距离
                scrollY: 0, // Y轴的滚动距离
				beforeBindingListItem: {},
				beforeId: '',
				id: '',
				shopNo: 0,
				mapBack: '',
				nowFloor: 0,
				screenWidth: 0,
				screenHeight: 0,
				mapList: [],
				mapHeight: 0,
				mapWidth: 0,
				mapRatio: 0,
				littleMapRatio: 0,
				mapScaleNum: 1,
				table: [], // 所有允许使用的卡台
                lowCharge: 0,
				Charge: 0,
				choiceTable: -1,
                active: {},
				UsedDate: '',
                bindList: [], // 所有沙盘上的卡台
                showLittle: false,
				littleMap: {}
            }
		},
        methods: {
			showLittleMap () {
				if (this.showLittle) {
					clearTimeout(this.littleMap)
                }
				this.showLittle = true
				this.littleMap = setTimeout(() => {
					this.showLittle = false
                }, 3000)
            },
			// 充值缩略图红色框大小和位置的方法
            refreshRedBlock () {
            	if ((document.documentElement.clientHeight - 145) >= this.mapHeight) {
            		document.getElementById('littleMapHooKBlock').style.top = '0'
            		document.getElementById('littleMapHooKBlock').style.bottom = '0'
                }
            	if ((document.documentElement.clientHeight - 145) < this.mapHeight) {
            		let topHeight = this.scrollY
                    let bottomHeight = this.mapHeight - this.scrollY - document.documentElement.clientHeight + 145
                    let top = topHeight / this.mapHeight
                    top = top * this.removePx(document.getElementById('littleMapHook').style.height)
                    let bottom = bottomHeight / this.mapHeight
		            bottom = bottom * this.removePx(document.getElementById('littleMapHook').style.height)
            		document.getElementById('littleMapHooKBlock').style.top = top + 'px'
            		document.getElementById('littleMapHooKBlock').style.bottom = bottom + 'px'
                }
            	if (this.screenWidth >= this.mapWidth) {
		            document.getElementById('littleMapHooKBlock').style.left = '0'
		            document.getElementById('littleMapHooKBlock').style.right = '0'
                }
	            if (this.screenWidth < this.mapWidth) {
		            let leftWidth = this.scrollX
                    let rightWidth = this.mapWidth - this.scrollX - this.screenWidth
                    let left = leftWidth / this.mapWidth
		            left = left * 120
                    let right = rightWidth / this.mapWidth
                    right = right * 120
		            document.getElementById('littleMapHooKBlock').style.left = left + 'px'
		            document.getElementById('littleMapHooKBlock').style.right = right + 'px'
                }
            },
	        // 鼠标点击事件
	        mouseDown (event) {
		        let target = {}
		        if (event.target) {
			        target = event.target
		        } else {
			        target = event.srcElement
		        }
		        this.beforeId = this.id
                this.beforeBindingListItem = this.bindingListItem
		        this.id = target.id
                if (this.beforeId !== '') {
                    document.getElementById(this.beforeId + 'cover').style.display = 'none'
                    document.getElementById(this.beforeId + 'littlecover').style.display = 'none'
                }
                document.getElementById(this.id + 'cover').style.display = 'block'
                document.getElementById(this.id + 'littlecover').style.display = 'block'
                this.table.forEach((item, index) => {
		        	if (item.RoomID === this.bindingListItem.tableID) {
				        this.toChoiceTable(item, index)
                    }
                })
	        },
	        // 为图片地址添加URL和括号
	        addUrlWrapper (src) {
		        return 'url("' + src + '?' + Math.random() + '")'
	        },
//			还原卡台
	        addSeatList () {
		        this.bindList.forEach(item => {
		        	let inTableList = false
			        this.table.forEach(itemTable => {
			        	if (itemTable.RoomID === item.tableID && itemTable.BeUsed === 0) {
					        inTableList = true
                        }
                    })
                    // 大地图卡台设置
			        let seat = document.createElement('div')
			        seat.style.position = 'absolute'
			        seat.style.width = item.width * this.mapRatio + 'px'
			        seat.style.height = item.height * this.mapRatio + 'px'
			        seat.style.left = item.left * this.mapRatio + 'px'
			        seat.style.top = item.top * this.mapRatio + 'px'
			        seat.style.background = 'rgba(0,0,0,0)'
			        seat.style.transformOrigin = '0% 0%'
			        seat.style.transform = 'rotate(' + item.angle + 'deg)'
			        seat.style.backgroundSize = '100% 100%'
			        seat.setAttribute('id', item.id)
                    // 小地图卡台设置
			        let seatLittle = document.createElement('div')
			        seatLittle.style.position = 'absolute'
			        seatLittle.style.width = item.width * this.littleMapRatio + 'px'
			        seatLittle.style.height = item.height * this.littleMapRatio + 'px'
			        seatLittle.style.left = item.left * this.littleMapRatio + 'px'
			        seatLittle.style.top = item.top * this.littleMapRatio + 'px'
			        seatLittle.style.background = '#a0a0a0'
			        seatLittle.style.transformOrigin = '0% 0%'
			        seatLittle.style.transform = 'rotate(' + item.angle + 'deg)'
			        seatLittle.style.backgroundSize = '100% 100%'
			        seatLittle.setAttribute('id', item.id + 'little')
                    if (!inTableList) {
	                    let seatImg = document.createElement('img')
	                    seatImg.src = item.rightPic
	                    seatImg.style.position = 'absolute'
	                    seatImg.style.left = '0'
	                    seatImg.style.top = '0'
	                    seatImg.style.width = '100%'
	                    seatImg.style.height = '100%'
	                    seatImg.style.filter = 'grayscale(100%)'
	                    seatImg.style.WebkitFilter = 'grayscale(100%)'
	                    seat.appendChild(seatImg)
                    }
                    if (inTableList) {
	                    // 大地图卡台按钮和底图设置
	                    seat.style.background = 'rgba(0,0,0,0)'
			            seat.style.backgroundImage = this.addUrlWrapper(item.leftPic)
	                    seat.style.backgroundSize = '100% 100%'
                        seat.onclick = this.mouseDown
                        // 小地图地图设置
	                    seatLittle.style.backgroundImage = this.addUrlWrapper(item.leftPic)
                        // 大地图覆盖层设置
	                    let seat2 = document.createElement('div')
	                    seat2.style.position = 'absolute'
	                    seat2.style.width = item.width * this.mapRatio + 'px'
	                    seat2.style.height = item.height * this.mapRatio + 'px'
	                    seat2.style.left = item.left * this.mapRatio + 'px'
	                    seat2.style.top = item.top * this.mapRatio + 'px'
	                    seat2.style.zIndex = '10'
	                    seat2.style.background = 'rgba(0,0,0,0)'
	                    seat2.style.transformOrigin = '0% 0%'
	                    seat2.style.transform = 'rotate(' + item.angle + 'deg)'
	                    seat2.style.backgroundImage = this.addUrlWrapper(item.rightPic)
	                    seat2.style.backgroundSize = '100% 100%'
	                    seat2.style.display = 'none'
	                    seat2.setAttribute('id', item.id + 'cover')
	                    this.$refs.mapHook.appendChild(seat2)
                        // 小地图覆盖层设置
	                    let seat2Little = document.createElement('div')
	                    seat2Little.style.position = 'absolute'
	                    seat2Little.style.width = item.width * this.littleMapRatio + 'px'
	                    seat2Little.style.height = item.height * this.littleMapRatio + 'px'
	                    seat2Little.style.left = item.left * this.littleMapRatio + 'px'
	                    seat2Little.style.top = item.top * this.littleMapRatio + 'px'
	                    seat2Little.style.zIndex = '10'
	                    seat2Little.style.background = '#a0a0a0'
	                    seat2Little.style.transformOrigin = '0% 0%'
	                    seat2Little.style.transform = 'rotate(' + item.angle + 'deg)'
	                    seat2Little.style.backgroundImage = this.addUrlWrapper(item.rightPic)
	                    seat2Little.style.backgroundSize = '100% 100%'
	                    seat2Little.style.display = 'none'
	                    seat2Little.setAttribute('id', item.id + 'littlecover')
	                    this.$refs.littleMapHooK.appendChild(seat2Little)
                    }
			        this.$refs.mapHook.appendChild(seat)
			        this.$refs.littleMapHooK.appendChild(seatLittle)
		        })
	        },
	        floorDataTransform (data) {
		        let bindingList = []
		        data.forEach((item, index) => {
			        let aSeat = {
				        id: 'seat' + index,
				        leftPic: item.unUsedTextureUrl,
				        rightPic: item.usedTextureUrl,
				        table: item.roomName,
				        tableID: item.roomId,
				        tableType: item.roomType,
				        left: item.roomXPosition,
				        top: item.roomYPosition,
				        width: item.roomWidth,
				        height: item.roomLength,
				        angle: item.roomAngValue
			        }
			        bindingList.push(aSeat)
		        })
		        return bindingList
	        },
	        getFloorLayout (floor) { // 获取楼层卡台信息
		        this.$store.dispatch('setIsLoading', true)
		        // 调用获取布局信息接口***********************************************************************
		        this.$http.post(this.$store.state.IP + 'reserve_service/wachat/roomlayout/getRoomLayoutInfo', {
				        shopNo: this.shopNo,
//			            roomFloor: this.$route.query.floor
				        roomFloor: floor
			        },
			        {
				        'emulateJSON': false,
				        'headers': {
					        'Content-Type': 'application/json;charset=UTF-8'
				        }
			        }
		        ).then(response => {
			        console.log('成功了么')
			        console.log('-------------------------------------------')
			        console.log('调用获取布局信息接口开始')
			        response = response.body
			        console.log(response)
			        if (response.code === '0') {
				        console.log('成功得到我要的指定楼层信息')
				        console.log(response.data)
				        this.bindList = this.floorDataTransform(response.data)
                        this.bindList.forEach(item => {
                        	let imgLeft = new Image()
                        	let imgRight = new Image()
	                        imgLeft.src = item.leftPic
	                        imgRight.src = item.rightPic
                        })
				        this.$store.dispatch('setIsLoading', false)
                        this.addSeatList()
			        }
			        if (response.code !== '0') {
				        console.log('没得到我要的指定楼层信息')
				        console.log('返回码不是0')
				        console.log(response.msg)
			        }
			        console.log('调用获取布局信息接口结束了')
			        console.log('******************************************')
		        }, response => {
			        console.log('调用获取布局信息接口失败了')
		        })
		        // 调用获取布局信息接口********************************************************************
            },
	        clearAndSetBack (floor) { // 清除并设置底图
		        this.$store.dispatch('setIsLoading', true)
		        while (this.$refs.mapHook.hasChildNodes()) { // 当div下还存在子节点时 循环继续
			        this.$refs.mapHook.removeChild(this.$refs.mapHook.firstChild)
		        }
		        let saveBlock = this.$refs.littleMapHooKBlock
		        while (this.$refs.littleMapHooK.hasChildNodes()) { // 当div下还存在子节点时 循环继续
			        this.$refs.littleMapHooK.removeChild(this.$refs.littleMapHooK.firstChild)
		        }
		        this.$refs.littleMapHooK.appendChild(saveBlock)
	        	console.log('已获取' + this.mapList[floor].mapName + '的卡台信息')
		        let vm = this
		        let image = new Image()
		        image.src = this.mapList[floor].map
		        image.onload = function () {
                    vm.screenHeight = vm.screenWidth * this.height
			        vm.screenHeight = vm.screenHeight / this.width
			        let littleMapHeight = 120 * this.height
			        littleMapHeight = littleMapHeight / this.width
			        document.getElementById('littleMapHook').style.height = littleMapHeight + 'px'
			        vm.mapHeight = vm.screenHeight
                    vm.mapBack = 'url("' + vm.mapList[floor].map + '")'
			        vm.$store.dispatch('setIsLoading', false)
                    vm.mapRatio = vm.screenWidth / this.width
                    vm.littleMapRatio = 120 / this.width
                    console.log('vm.mapRatio' + vm.mapRatio)
			        vm.refreshRedBlock()
                    vm.getFloorLayout(vm.mapList[floor].mapFloor)
                }
            },
	        removePx (item) { // 移除末尾的px
		        return 	parseInt(item.substr(0, item.length - 2))
	        },
	        onBridgeReady () {
		        WeixinJSBridge.call('hideOptionMenu')
	        },
	        // 对象数组排序方法
	        arrSort (obj1, obj2) {
		        let val1 = obj1.mapIndex
		        let val2 = obj2.mapIndex
		        if (val1 < val2) {
			        return -1
		        } else if (val1 > val2) {
			        return 1
		        } else {
			        return 0
		        }
	        },
	        toChoiceTable (item, index) {
	        	if (item.BeUsed !== 0) {
	        		return
                }
                if (this.choiceTable === index) {
	        		return
                }
	        	if (item.BeUsed === 0) {
			        this.choiceTable = index
                    this.lowCharge = item.LowCharge
                }
            },
			toDetail () {
	        	if (this.choiceTable === -1) {
	        		return
                }
			    this.$router.push({path: 'choiceDetail', query: {openid: this.$route.query.openid, BuildID: this.$route.query.BuildID, RoomID: this.table[this.choiceTable].RoomID, RoomName: this.table[this.choiceTable].RoomName, LowCharge: this.table[this.choiceTable].LowCharge}})
            },
	        installScroll () {
		        this.$nextTick(() => {
			        if (!this.mapWrapperHookScroll) {
				        this.mapWrapperHookScroll = new BScroll(this.$refs.mapWrapperHook, {
					        probeType: 3,
					        scrollY: true,
					        scrollX: true,
					        mouseWheel: false,
					        zoom: true,
					        click: true,
					        freeScroll: true
				        })
				        this.mapWrapperHookScroll.on('scroll', (pos) => {
					        this.showLittleMap()
                            this.scrollX = Math.abs(Math.round(pos.x))
                            this.scrollY = Math.abs(Math.round(pos.y))
			                this.refreshRedBlock()
				        })
			        } else {
				        this.showLittleMap()
				        this.mapWrapperHookScroll.refresh()
				        this.refreshRedBlock()
			        }
		        })
	        }
        },
        computed: {
	        // 返回当前id的卡台元素
	        bindingListItem () {
		        let vm = this
		        let bindingItem = {}
		        this.bindList.forEach(item => {
			        if (item.id === vm.id) {
				        bindingItem = item
			        }
		        })
		        return bindingItem
	        },
	        mapScale () {
	        	return 'scale(' + this.mapScaleNum + ',' + this.mapScaleNum + ')'
            }
        },
        watch: {
	        nowFloor () {
		        this.mapWrapperHookScroll.scrollTo(0, 0, 0)
		        this.mapWidth = this.screenWidth
		        this.mapHeight = this.screenHeight
                this.beforeBindingListItem = {}
                this.beforeId = ''
                this.id = ''
		        this.mapScaleNum = 1
		        this.choiceTable = -1
		        this.screenWidth = document.body.clientWidth
		        this.mapWidth = this.screenWidth
		        this.clearAndSetBack(this.nowFloor)
            },
	        mapScaleNum () {
		        this.bindList.forEach(item => {
			        let seat = document.getElementById(item.id)
			        seat.style.width = this.mapScaleNum * item.width * this.mapRatio + 'px'
			        seat.style.height = this.mapScaleNum * item.height * this.mapRatio + 'px'
			        seat.style.left = this.mapScaleNum * item.left * this.mapRatio + 'px'
			        seat.style.top = this.mapScaleNum * item.top * this.mapRatio + 'px'
                    if (document.getElementById(item.id + 'cover')) {
	                    let seat2 = document.getElementById(item.id + 'cover')
	                    seat2.style.width = this.mapScaleNum * item.width * this.mapRatio + 'px'
	                    seat2.style.height = this.mapScaleNum * item.height * this.mapRatio + 'px'
	                    seat2.style.left = this.mapScaleNum * item.left * this.mapRatio + 'px'
	                    seat2.style.top = this.mapScaleNum * item.top * this.mapRatio + 'px'
                    }
		        })
            },
	        mapScale () {
		        this.installScroll()
            }
        },
        mounted () {
			let vm = this
            let map = document.getElementById('mapHook')
	        let mapTime = new AlloyFinger(map, {
		        doubleTap: (evt => {
			        let pageY = evt.changedTouches[0].pageY - 90
			        let pageX = evt.changedTouches[0].pageX
			        if (!vm.toBig && vm.mapWidth === vm.screenWidth) {
				        vm.mapWidth = vm.screenWidth * 4
				        vm.mapHeight = vm.screenHeight * 4
				        vm.mapScaleNum = 4
                        let widthRatio = pageX / vm.screenWidth
                        let heightRatio = pageY / vm.screenHeight
                        let widthReal = vm.mapWidth * widthRatio
                        let heightReal = vm.mapHeight * heightRatio
                        let clientHeight = document.documentElement.clientHeight - 145
				        widthReal = widthReal - (vm.screenWidth / 2)
				        heightReal = heightReal - (clientHeight / 2)
				        vm.scrollX = widthReal
				        vm.scrollY = heightReal
                        if ((widthReal + vm.screenWidth) > vm.mapWidth) {
	                        vm.scrollX = vm.mapWidth - vm.screenWidth
                        }
                        if ((heightReal + clientHeight) > vm.mapHeight) {
	                        vm.scrollY = vm.mapHeight - clientHeight
                        }
				        vm.mapWrapperHookScroll.scrollTo(-widthReal, -heightReal)
				        vm.installScroll()
			        }
			        if (vm.toBig) {
				        vm.mapWidth = vm.screenWidth
				        vm.mapHeight = vm.screenHeight
				        vm.mapScaleNum = 1
				        vm.installScroll()
                        vm.scrollX = 0
                        vm.scrollY = 0
			        }
			        vm.toBig = !vm.toBig
                }),
		        pinch: (evt => {
			        let pageY = (evt.touches[0].pageY + evt.touches[1].pageY) / 2
			        let pageX = (evt.touches[0].pageX + evt.touches[1].pageX) / 2
			        let scaleMap = 1
			        if (evt.zoom > 1) {
				        scaleMap = (evt.zoom - 1) * 0.1
				        scaleMap = 1 + scaleMap
			        }
			        if (evt.zoom < 1) {
				        scaleMap = (1 - evt.zoom) * 0.1
				        scaleMap = 1 - scaleMap
			        }
			        if (evt.zoom === 1) {
				        scaleMap = 1
			        }
			        if (scaleMap * vm.mapScaleNum > 4) {
				        vm.mapWidth = vm.screenWidth * 4
				        vm.mapHeight = vm.screenHeight * 4
				        vm.mapScaleNum = 4
				        return
			        }
			        if (scaleMap * vm.mapScaleNum < 1) {
				        vm.mapWidth = vm.screenWidth
				        vm.mapHeight = vm.screenHeight
				        vm.mapScaleNum = 1
				        return
			        }
			        let afterHeight = scaleMap * vm.mapHeight
			        let afterWidth = scaleMap * vm.mapWidth
			        let AHeight = afterHeight - vm.mapHeight
			        let AWidth = afterWidth - vm.mapWidth
			        let upHeight = vm.scrollY + pageY
			        let leftWidth = vm.scrollX + pageX
			        let AHeightRatio = upHeight / vm.mapHeight
			        let AWidthRatio = leftWidth / vm.mapWidth
			        vm.mapWrapperHookScroll.scrollBy(-(AWidth * AWidthRatio), -(AHeight * AHeightRatio))
			        vm.mapScaleNum = scaleMap * vm.mapScaleNum
			        vm.mapHeight = scaleMap * vm.mapHeight
			        vm.mapWidth = scaleMap * vm.mapWidth
			        vm.installScroll()
		        })
	        })
	        console.log(mapTime)
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
	        this.screenWidth = document.body.clientWidth
            this.mapWidth = this.screenWidth
	        this.installScroll()
	        // 调用查询预订活动接口***********************************************************************
	        this.$store.dispatch('setIsLoading', true)
	        this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getDestineBuyBreak', {
			        BuildID: this.$route.query.BuildID
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
		        console.log('调用调用查询预订活动接口开始')
		        response = response.body
		        console.log(response)
		        if (response.code === '0') {
			        this.active = response.data
			        this.Charge = this.active.Charge
			        this.UsedDate = this.active.UsedDate
                    console.log(this.active.ShopNo)
                    this.shopNo = this.active.ShopNo
			        // 调用获取卡台列表接口***********************************************************************
			        this.$store.dispatch('setIsLoading', true)
			        this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getRoomList', {
					        CompanyID: this.active.ShopNo,
					        page_pos: 0,
					        page_record_count: 100,
					        UsedDate: this.active.UsedDate,
					        RoomSortID: this.active.RoomSortID,
					        BuildID: this.$route.query.BuildID
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
				        console.log('调用获取卡台列表接口开始')
				        response = response.body
				        console.log(response)
				        if (response.code === '0') {
					        this.table = response.data.rows
					        // 调用获取所有楼层信息和所有底图的接口***********************************************************************
					        this.$store.dispatch('setIsLoading', true)
                            this.$http.post(this.$store.state.IP + 'reserve_service/wachat/roomlayout/getFileUrls', {
							        shopNo: this.active.ShopNo,
							        fileType: 1
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
						        console.log('调用获取所有楼层信息和所有底图的接口开始')
						        response = response.body
						        console.log(response)
						        if (response.code === '0') {
							        console.log('调用获取所有楼层信息和所有底图的接口成功')
							        console.log(response.data.fileType1)
							        response.data.fileType1.forEach((item) => {
								        let newFloor = {
									        map: item.bottomPicNameUrl,
                                            mapName: item.floorName,
                                            mapIndex: item.floorIndex,
                                            mapFloor: item.roomFloor
								        }
								        this.mapList.push(newFloor)
							        })
							        this.mapList.sort(this.arrSort)
							        if (response.data.fileType1.length > 0) {
								        this.clearAndSetBack(this.nowFloor)
							        }
							        if (response.data.fileType1.length === 0) {
								        alert('此商家未设置卡台沙盘图')
                                        history.go(-1)
							        }
						        }
						        if (response.code !== '0') {
							        console.log('返回码不是0')
							        console.log(response.msg)
						        }
						        console.log('调用获取所有楼层信息和所有底图的接口结束了')
						        console.log('******************************************')
					        }, response => {
	                            this.$store.dispatch('setIsLoading', false)
						        console.log('调用获取所有楼层信息和所有底图的接口失败了')
					        })
					        // 调用获取所有楼层信息和所有底图的接口********************************************************************
					        this.installScroll()
				        }
				        if (response.code !== '0') {
					        console.log('返回码不是0')
					        this.$store.dispatch('setNowToast', response.msg)
				        }
				        console.log('调用获取卡台列表接口结束了')
				        console.log('******************************************')
			        }, response => {
				        this.$store.dispatch('setIsLoading', false)
				        console.log('调用获取卡台列表接口失败了')
			        })
			        // 调用获取卡台列表接口********************************************************************
		        }
		        if (response.code !== '0') {
			        console.log('返回码不是0')
			        this.$store.dispatch('setNowToast', response.msg)
			        if (response.code === '18') {
			        	history.go(-1)
                    }
		        }
		        console.log('调用调用查询预订活动接口结束了')
		        console.log('******************************************')
	        }, response => {
		        this.$store.dispatch('setIsLoading', false)
		        console.log('调用调用查询预订活动接口失败了')
	        })
	        // 调用调用查询预订活动接口********************************************************************
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .choice-table
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        overflow hidden
        background #201c19
        .choice-table-top
            width 100%
            height 90px
            border-bottom 1px solid rgba(255,255,255,0.7)
            background #423c31
            display flex
            .choice-table-top-left
                flex 1
                height 90px
                border-right 1px solid rgba(255,255,255,0.7)
                padding 10px
                position relative
                color #cea16a
                .choice-table-top-left-up
                    font-size 18px
                .choice-table-top-left-mid
                    font-size 15px
                .choice-table-top-left-down
                    font-size 15px
                .choice-table-top-left-right
                    position absolute
                    font-size 15px
                    bottom 8px
                    right 10px
                    color red
            .choice-table-top-right
                flex 0 0 100px
                height 90px
                padding 10px
                .choice-table-top-right-2
                    margin-bottom 5px
                    text-align right
                    width 100%
                    position relative
                    .choice-table-top-right-2-pic
                        position absolute
                        height 20px
                        width 30px
                        background #b1b1b9
                        top 0
                        border 1px solid rgba(255,255,255,0.7)
        .choice-little-map
            position absolute
            top 90px
            left 0
            z-index 10
            width 120px
            height 0
            background rgba(0,0,0,0.2)
            .choice-little-map-block
                position absolute
                left 0
                top 0
                right 0
                bottom 0
                z-index 11
                background rgba(0,0,0,0)
                border 1px solid red
        .choice-table-list
            position absolute
            top 90px
            bottom 55px
            left 0
            width 100%
            overflow hidden
            /*::-webkit-scrollbar*/
                /*display:none*/
            .choice-table-list-wrapper
                display inline-block
                .choice-table-map
                    width 375px
                    height 275px
                    background-size cover
        .choice-table-bottom
            position absolute
            bottom 0
            left 0
            width 100%
            height 55px
            border-top 1px solid rgba(255,255,255,0.7)
            background #423c31
            display flex
            .choice-table-bottom-left
                flex 1
                height 55px
                color #e54545
                padding-left 10px
                padding-right 10px
                font-size 16px
                line-height 55px
                .choice-table-bottom-left-left
                    display inline-block
                .choice-table-bottom-left-right
                    display inline-block
                    float right
            .choice-table-bottom-right
                flex 0 0 140px
                height 55px
                color #fff
                font-size 20px
                text-align center
                line-height 55px
                &.gray
                    background #423c31
                &.pink
                    background #cea16a
</style>

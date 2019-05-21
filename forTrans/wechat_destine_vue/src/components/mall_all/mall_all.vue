<template>
    <div class="list-box">
        <goodCard 
            :ticketList="ticketList" 
            v-on:addCart='addCart' 
            v-on:decreaseCart='decreaseCart'
            :hasControl="hasControl"></goodCard>
        <div class="cart">
            <div class="cartlist">
                <div class="listnone" v-show='cartList.length == 0 && showCartList'>暂时还没有商品哦</div>
                <div class="clearCart" v-show="cartList.length > 0 && showCartList" @click="clearCartList">清空</div>
                <div class="cartList-wrapper" v-show="cartList.length > 0 && showCartList" ref="cartListWrapper">
                    <ul class="cartList-box">
                        <li class="cartList-item" v-for="(item, idx) in cartList" :key="idx">
                            <div class="title">{{ item.goodName }}</div>
                            <div class="btn-control">
                                <btn :ticket='item' v-on:addCart='addCart' v-on:decreaseCart='decreaseCart'/>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="left" @click="showCartDetail">
                <div class="totlePrice">
                    合计：<span  class="num">{{ totlePrice }}</span>元
                </div>
                <div class="totleCount">
                    <span class="num">{{ totleCount }}</span>件商品
                </div>
                <div class="ball-container">
                    <div v-for="(ball, idx) in balls" :key="idx">
                        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
                            <div class="ball" v-show="ball.show">
                                <div class="inner inner-hook"></div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="buybtn" :class="{active: totleCount > 0}" @click='OrderCreate'>下单</div>
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
                    // {
                    //     "virtualGoodId": 1,
                    //     "headShopNo": 1,
                    //     "shopNo": 36,
                    //     "goodType": 0,
                    //     "gradeId": 1,
                    //     "sellNum": 200,
                    //     "leftNum": 150,
                    //     "iconUrl": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg",
                    //     "beginTime": "2019-5-20 10:48:16",
                    //     "endTime": "2019-5-20 10:48:16",
                    //     "payType": 0,
                    //     "cashPrice": 0.01,
                    //     "integralPrice": 0,
                    //     "goodName": "测试券0",
                    //     "remark": "现在开始测试",
                    //     "sellEndTime": "2019-5-20 10:48:16",
                    //     "sellBeginTime": "2019-5-20 10:48:16"
                    // }
                ],
                cartList: [],
                showCartList: false,
                cartBs: null,
                hasControl: true,
                balls: [
                    {
                        show: false
                    },{
                        show: false
                    },{
                        show: false
                    },{
                        show: false
                    },{
                        show: false
                    },
                ],
                dropBalls: []
            }
		},
        created () {
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
            console.log('this.$route.query')
            console.log(this.$route.query)
            this.$store.dispatch('setIsLoading', true)
            this.$http.post(this.$store.state.IP + 'virtual/good/query', {
                access_token: '',
                companycode: '',
                timestamp: '',
                signature: '',
                // wechatPubId: this.$route.query.weChatId,
                data: {
                    shopno: this.$route.query.shopNo,
                    // openid: this.$route.query.openid,
                    gradeid: 1,
                    goodtype: 0
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
                    this.ticketList = response.body.data
                    this._initTicketList ()
                    console.log(this.ticketList)
                }
               
            }, response => {
                this.$store.dispatch('setIsLoading', false)
                console.log('调用虚拟商品列表接口失败了')
            })
        },
        methods: {
	        addCart (ticket, el) {
                this.drop (el)
                for (let i=0; i<this.cartList.length; i++) {
                    if (this.cartList[i].virtualGoodId == ticket.virtualGoodId) {
                        return ;
                    }
                }
                this.cartList.push(ticket);
                this.checkCartList();
            }, 
            decreaseCart (ticket) {
                for (let i=0; i<this.cartList.length; i++) {
                    if (this.cartList[i].virtualGoodId == ticket.virtualGoodId) {
                        if (this.cartList[i].count == 0) {
                            this.cartList.splice(i,1);
                            this.checkCartList();
                            return ;
                        }
                    }
                }
                this.checkCartList();
            },
            OrderCreate () {
                if (this.totleCount <= 0) {
                    alert('请先选择商品 ');
                    return;
                }
                // 虚拟商品预下单
                // @orders: {Key 商品id: value 商品数量}
                let orders = {}
                for (let i=0; i<this.cartList.length; i++) {
                    orders[this.cartList[i].virtualGoodId] = this.cartList[i].count
                }
                this.$store.dispatch('setIsLoading', true)
                    this.$http.post(this.$store.state.IP + 'virtual/order/create', {
                        access_token: '',
                        companycode: '',
                        timestamp: '',
                        signature: '',
                        // wechatPubId: this.$route.query.weChatId,
                        data: {
                            shopno: this.$route.query.shopNo,
                            openid: this.$route.query.openid,
                            orders: orders,
                            goodnum: this.totleCount,
                            paychannel: 0,
                            paymoney: this.totlePrice,
                            paytype: 0, // 0 微信支付
                            headshopno: this.cartList[0].headShopNo
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
                            
                            // console.log(response.body.data)
                        }
                    
                    }, response => {
                        this.$store.dispatch('setIsLoading', false)
                        console.log('调用虚拟商品列表接口失败了')
                    })
                //alert('微信支付 ' + this.totlePrice + ' 元')
            },
            checkCartList () {
                for (let i=0; i<this.cartList.length; i++) {
                    if (this.cartList[i].count == 0) {
                        var a = this.cartList.splice(i,1)
                        break;
                    }
                }
                this._initCartBs();
            },
            clearCartList () {
                for (let i=0; i<this.cartList.length; i++) {
                    this.cartList[i].count = 0;
                }
                for (let i=0; i<this.ticketList.length; i++) {
                    this.ticketList[i].count = 0;
                }
                this.cartList = [];
            },
            showCartDetail () {
                this.showCartList = !this.showCartList;
                this._initCartBs();
            },
            _initCartBs () {
                this.$nextTick(() => {
					if (!this.cartBs) {
						this.cartBs = new BScroll(this.$refs.cartListWrapper, {
							click: true
						})
					} else {
						this.cartBs.refresh()
					}
				})
            },
            // 购物车是否已有票券
            _initTicketList () {
                this.cartList = this.$store.state.ticketList
                for (let i=0; i<this.cartList.length; i++) {
                    for (let j=0; j<this.ticketList.length; j++) {
                        console.log(this.ticketList[j].virtualGoodId, this.cartList[i].count)
                        if (this.ticketList[j].virtualGoodId === this.cartList[i].virtualGoodId) {
                            
                            this.$set(this.ticketList[j], 'count', this.cartList[i].count)
                            break
                        }
                    }
                }
                console.log(this.ticketList, this.$store.state.ticketList)
            },
            drop (el) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i]
                    if (!ball.show) {
                        ball.show = true
                        ball.el = el
                        this.dropBalls.push(ball)
                        return
                    }
                }
            },
            beforeDrop (el) {
                let count = this.balls.length
                while (count--) {
                    let ball = this.balls[count]
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect()

                        let x = rect.left - 35
                        let y = -(window.innerHeight - rect.top - 44)
                        el.style.display = ''
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`
                        el.style.transform = `translate3d(0,${y}px,0)`
                        let inner = el.getElementsByClassName('inner-hook')[0]
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`
                        inner.style.transform = `translate3d(${x}px,0,0)`
                    }
                }
            },
            dropping (el, done) {
                let rf = el.offsetHeight
                this.$nextTick(() => {
                el.style.webkitTransform = 'translate3d(0,0,0)'
                el.style.transform = 'translate3d(0,0,0)'
                let inner = el.getElementsByClassName('inner-hook')[0]
                inner.style.webkitTransform = 'translate3d(0,0,0)'
                inner.style.transform = 'translate3d(0,0,0)'
                el.addEventListener('transitionend', done)
                })
            },
            afterDrop (el) {
                let ball = this.dropBalls.shift()
                if (ball) {
                    ball.show = false
                    el.style.display = 'none'
                }
            }
        },
        computed: {
	        isNone () {
                return !this.ticketList.length
            },
            totlePrice () {
                var price = 0;
                for (let i=0; i<this.cartList.length; i++) {
                    if(!this.cartList[i].count) {
                        continue;
                    }
                    price += this.cartList[i].cashPrice * this.cartList[i].count;
                }
                return price.toFixed(2);
            },
            totleCount () {
                var count = 0;
                for (let i=0; i<this.cartList.length; i++) {
                    if(!this.cartList[i].count) {
                        continue;
                    }
                    count += this.cartList[i].count;
                }
                return count;
            }
        },
        beforeDestroy () {
            this.$store.dispatch('setTicketList', this.cartList)
        },
        components: {
           btn,
           goodCard
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/index.styl";
.list-box
    position absolute
    top 48px
    bottom 48px
    overflow hidden
    width 100%
    .cart
        position fixed
        bottom 0
        left 0
        right 0
        height 48px
        background #423c31
        display flex
        justify-content space-between
        .cartlist
            position absolute
            top 0
            left 0
            right 0
            transform translate(0, -100%)
            width 100%
            max-height 180px
            background #201c19
            text-align center
            overflow hidden
            border-top 2px solid #cea16a
            .listnone
                padding 6px 0
            .clearCart
                padding 6px 0
                text-align right
                color #cea16a
                padding 6px 16px
                background #333
            .cartList-wrapper
                max-height 154px
                overflow hidden
                .cartList-box
                    width 100%
                    padding 4px 16px
                    .cartList-item
                        display flex
                        justify-content space-between
                        width 100%
                        padding 6px 0
                        border-1px(#cea16a)
                        &:last-child
                            border-none()
                        .title
                            flex 0 0 auto
        .left
            flex 1 1 auto
            padding 4px 0 4px 20px
            display flex
            flex-direction column
            justify-content space-between
            line-height 20px
            .totlePrice
                font-weight 900
            .ball-container
                .ball
                    position: fixed
                    left: 35px
                    bottom: 35px
                    z-index: 2000
                    /*transition: all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41)*/
                    transition: all .5s cubic-bezier(0.66, -0.44, 0.9, 0.43)
                    .inner
                        width: 16px
                        height: 16px
                        border-radius: 50%
                        background #cea16a
                        transition: all .5s linear
        .right
            width 120px
            height 100%
            padding 4px 10px
            .buybtn
                width 100px
                height 40px
                line-height 44px
                text-align center
                background #666666
                border-radius 3px
                &.active
                    background #e9c088
                    color #666666
</style>

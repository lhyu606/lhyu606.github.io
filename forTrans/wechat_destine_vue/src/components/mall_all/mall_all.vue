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
                            <div class="title">{{ item.title }}</div>
                            <div class="btn-control">
                                <btn :ticket='item' v-on:addCart='addCart' v-on:decreaseCart='decreaseCart'/>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="left" @click="showCartDetail">
                <div class="totlePrice">
                    合计：<span  class="num">{{ totlePrice }}</span>积分
                </div>
                <div class="totleCount">
                    <span class="num">{{ totleCount }}</span>件商品
                </div>
            </div>
            <div class="right">
                <div class="buybtn" :class="{active: totleCount > 0}" @click='wechatPay'>购买</div>
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
                        id: 1,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 2,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 3,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 4,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 5,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 6,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 7,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 8,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 9,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 10,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    },
                    {
                        id: 11,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3119243828,2785799000&fm=26&gp=0.jpg'
                    }
                ],
                cartList: [],
                showCartList: false,
                cartBs: null,
                hasControl: true,
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
			// this.$nextTick(()=>{
            //     this.listScroll = new BScroll(this.$refs.listWrapper,{
			// 		click: true
			// 	});
            // });
        },
        methods: {
	        addCart (ticket) {
                for (let i=0; i<this.cartList.length; i++) {
                    if (this.cartList[i].id == ticket.id) {
                        return ;
                    }
                }
                this.cartList.push(ticket);
                this.checkCartList();
            }, 
            decreaseCart (ticket) {
                for (let i=0; i<this.cartList.length; i++) {
                    if (this.cartList[i].id == ticket.id) {
                        if (this.cartList[i].count == 0) {
                            this.cartList.splice(i,1);
                            this.checkCartList();
                            return ;
                        }
                    }
                }
                this.checkCartList();
            },
            wechatPay () {
                if (this.totleCount <= 0) {
                    alert('请先选择商品 ');
                    return;
                }
                alert('微信支付 ' + this.totlePrice + ' 元')
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
            }
        },
        computed: {
	        isNone () {
                return !this.ticketList.length
            },
            totlePrice () {
                var price = 0;
                for (let i=0; i<this.ticketList.length; i++) {
                    if(!this.ticketList[i].count) {
                        continue;
                    }
                    price += this.ticketList[i].price * this.ticketList[i].count;
                }
                return price;
            },
            totleCount () {
                var count = 0;
                for (let i=0; i<this.ticketList.length; i++) {
                    if(!this.ticketList[i].count) {
                        continue;
                    }
                    count += this.ticketList[i].count;
                }
                return count;
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
        background #333333
        display flex
        justify-content pace-between
        .cartlist
            position absolute
            top 0
            left 0
            right 0
            transform translate(0, -100%)
            width 100%
            max-height 180px
            background #666666
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

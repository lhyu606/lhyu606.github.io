<template>
    <div class="list-box">
        <div class="list-wrapper" ref="listWrapper">
            <ul class="list">
                <li class="item" v-for="(item, idx) in ticketList" :key="idx">
                    <div class="left">
                        <img :src="item.pic" alt="">
                    </div>
                    <div class="right">
                        <div class="title">{{ item.title }}</div>
                        <div class="footer">
                            <div class="price">
                                <span class="num">{{ item.price }}</span>
                                <span class="text">积分</span>
                            </div>
                            <div class="btn-control">
                                <btn :ticket='item' v-on:addCart='addCart'/>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="cart">
            <div class="left">
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
	export default {
		data: function () {
			return {
				ip: '',
                ticketList: [
                    {
                        id: 1,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 2,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 2,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 3,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 4,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 5,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 6,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 7,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 8,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 9,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    },
                    {
                        id: 10,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56'
                    }
                ]
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
			this.$nextTick(()=>{
                this.listScroll = new BScroll(this.$refs.listWrapper,{
					click: true
				});
            });
        },
        methods: {
	        addCart (el) {
                console.log(this)
            },
            wechatPay () {
                if (this.totleCount <= 0) {
                    alert('请先选择商品 ');
                    return;
                }
                alert('微信支付 ' + this.totlePrice + ' 元')
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
                    console.log(this.ticketList[i].price , this.ticketList[i].count)
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
           btn
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/index.styl";
.list-box
    position absolute
    top 48px
    bottom 48px
    overflow hidden
    width 100%
    .list-wrapper
        height 100%
        width 100%
        overflow hidden       
        .list
            margin-bottom 20px
            .item
                display flex
                justify-content space-between
                padding 4px 0s
                &:last-child
                    .right
                        &::after
                            display none
                .left 
                    width 80px
                    height 80px
                    text-align center
                    line-height 64px
                    img
                        width 56px
                        height 56px
                        margin 12px
                .right
                    padding 10px 0
                    flex 1 1 auto
                    display flex
                    flex-direction: column;
                    justify-content space-between
                    line-height 30px
                    border-1px(rgba(255,255,255,0.7))
                    .title
                        white-space nowrap
                    .footer
                        display flex 
                        justify-content space-between
                        padding-right 16px
    .cart
        position fixed
        bottom 0
        left 0
        right 0
        height 48px
        background #333333
        display flex
        justify-content pace-between
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
</style>

<template>
    <div class="list-wrapper">
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
                            <btn />
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <div class="getMore">
            <div v-if="isNone" class="none-box">
                <div class="none-img"></div>
                <div class="none-text">
                    <span>暂无数据</span><br/><span>点击下方按钮去获得票券</span>
                </div>
            </div>
            <router-link class="get-btn" to="/mall">去获得</router-link>
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
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56',
                        createTime: this.ranTime()
                    },
                    {
                        id: 2,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56',
                        createTime: this.ranTime()
                    },
                    {
                        id: 2,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56',
                        createTime: this.ranTime()
                    },
                    {
                        id: 3,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56',
                        createTime: this.ranTime()
                    },
                    {
                        id: 4,
                        title: 'RAVE套装-发光臂环',
                        price: 368,
                        pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2635372762,3311529239&fm=179&app=42&f=JPEG?w=56&h=56',
                        createTime: this.ranTime()
                    }
                ]
            }
		},
        created () {console.log(this.ticketList)
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
			
        },
        methods: {
	        toSelectCity () {
	        	//alert(window.location.href)
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
            },
            ranTime() {
                var time = new Date();
                time += parseInt(Math.random() * 10) * 3600 * 24;console.log(new Date(time))
                return new Date(time); 
            }
        },
        computed: {
	        cityName () {
			    return this.$store.state.cityName
            },
            isNone () {
                return !this.ticketList.length
            }
        },
        components: {
            btn,
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/index.styl";
.list  
    margin-bottom 20px
.item
    display flex
    justify-content space-space-between
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
.getMore
    text-align center
    color #cea16a
    .none-box
        margin-top 28px
        .none-img
            margin 0 auto
            width 100px
            height 100px
            background url("../../common/pic/noKtvPic.png") no-repeat center center
            background-size cover
        .none-text
            line-height 24px
    .get-btn
        display block
        margin 10px auto
        width 100px 
        height 30px
        line-height 28px
        font-size 14px
        background #cea16a
        color #201c19
        border-radius 4px
</style>

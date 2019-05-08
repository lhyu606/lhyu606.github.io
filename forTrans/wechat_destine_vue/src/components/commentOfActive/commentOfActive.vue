<template>
    <div class="comment-active" ref="commentOfActiveScrollHook">
        <div>
            <div class="comment-active-top">
                <div class="comment-active-top-left">
                    {{score}}
                    <div class="comment-active-top-left-bottom">综合评分</div>
                </div>
                <div class="comment-active-top-right">
                    <div class="comment-active-top-right-stick"></div>
                    <div class="comment-active-top-right-cover"></div>
                    <div class="comment-active-top-right-title1">服务质量</div>
                    <div class="comment-active-top-right-title2">卡台环境</div>
                    <div class="comment-active-top-right-title3">音响效果</div>
                    <div class="comment-active-top-right-point1">{{star1}}</div>
                    <div class="comment-active-top-right-point2">{{star2}}</div>
                    <div class="comment-active-top-right-point3">{{star3}}</div>
                    <div class="comment-active-top-right-comment-rater1">
                        <rater v-model="star1" :active-color="color" font-size="17"></rater>
                    </div>
                    <div class="comment-active-top-right-comment-rater2">
                        <rater v-model="star2" :active-color="color" font-size="17"></rater>
                    </div>
                    <div class="comment-active-top-right-comment-rater3">
                        <rater v-model="star3" :active-color="color" font-size="17"></rater>
                    </div>
                </div>
            </div>
            <div class="comment-active-padding"></div>
                <div class="comment-active-comment-item" v-for="item in allComment">
                    <img src="../../common/pic/KTVlogo.png" v-show="item.GuestHeaderImg===''">
                    <img :src="item.GuestHeaderImg" v-show="item.GuestHeaderImg!==''">
                    <div class="comment-active-comment-item-id">yj_{{item.GuestTel}}</div>
                    <div class="comment-active-comment-item-show-rater">
                        <rater v-model="item.AvgGrade" :active-color="color" font-size="14"></rater>
                    </div>
                    <div class="comment-active-comment-item-date">{{item.CreateDateTime}}</div>
                    <div class="comment-active-comment-item-comment">{{item.Remark}}</div>
                </div>
                <div class="comment-active-comment-loading" v-show="showLoading">正在加载更多评论...</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	import { Rater } from 'vux'
	export default {
		data: function () {
			return {
				bottomMove: 0,
				color: '#cea16a',
				score: 0.0,
				star1: 0,
				star2: 0,
				star3: 0,
                hasGetScore: true,
                finish: true,
				doing: true,
				showLoading: false,
				y: 0,
                allComment: [],
                page: 0,
                getCommentNum: 0,
                totalCommentNum: 0
			}
		},
		components: {
			Rater
		},
		watch: {
			where () {
				if (this.where === 'bottom' && this.doing && this.finish) {
					this.doing = false
                    this.showLoading = true
					this.installCommentScroll()
					setTimeout(() => {
						this.reqComment()
					}, 1000)
                }
            }
        },
		computed: {
			where () {
				if (this.y >= 0) {
					return 'top'
				}
				if (this.y < this.bottomMove) {
					return 'bottom'
				}
				return 'other'
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
			this.reqComment()
		},
		methods: {
			installCommentScroll () {
				this.$nextTick(() => {
					if (!this.commentOfActiveScroll) {
						this.commentOfActiveScroll = new BScroll(this.$refs.commentOfActiveScrollHook, {
							click: true,
							probeType: 3
						})
						this.commentOfActiveScroll.on('scroll', (pos) => {
							this.y = pos.y
						})
						this.bottomMove = this.commentOfActiveScroll.maxScrollY + 1
					} else {
						this.add++
						this.commentOfActiveScroll.refresh()
						this.bottomMove = this.commentOfActiveScroll.maxScrollY + 1
					}
				})
			},
			onBridgeReady () {
				WeixinJSBridge.call('hideOptionMenu')
			},
			reqComment () {
				// 调用获取评价接口***********************************************************************
//				this.$store.dispatch('setIsLoading', true)
				this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getGradeInfos', {
					    page_pos: this.page,
					    page_record_count: 10,
						ShopNo: this.$route.query.ShopNo,
						BuyBreakID: this.$route.query.BuyBreakID
					},
					{
						'emulateJSON': false,
						'headers': {
							'Content-Type': 'application/json;charset=UTF-8'
						}
					}
				).then(response => {
//					this.$store.dispatch('setIsLoading', false)
					console.log('-------------------------------------------')
					console.log('调用获取评价接口开始')
					response = response.body
					console.log(response)
					if (response.code === '0') {
						console.log('返回码是0')
                        if (this.totalCommentNum === 0) {
	                        this.totalCommentNum = response.data.gradeSize
                        }
                        if (this.hasGetScore) {
	                        this.score = parseFloat(response.data.avgGrade)
	                        this.star1 = parseFloat(response.data.avgServiceGrade)
	                        this.star2 = parseFloat(response.data.avgRoomEnvGrade)
	                        this.star3 = parseFloat(response.data.avgSoundGrade)
                        }
                        this.page++
                        this.getCommentNum = this.getCommentNum + response.data.page.rows.length
                        if (this.totalCommentNum === this.getCommentNum) {
	                        this.finish = false
                        }
						this.allComment = this.allComment.concat(response.data.page.rows)
						this.doing = true
						this.showLoading = false
						this.installCommentScroll()
					}
					if (response.code !== '0') {
						console.log('返回码不是0')
						this.$store.dispatch('setNowToast', response.msg)
					}
					console.log('调用获取评价接口结束了')
					console.log('******************************************')
				}, response => {
//					this.$store.dispatch('setIsLoading', false)
					console.log('调用获取评价接口失败了')
				})
				// 调用获取评价接口********************************************************************
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .comment-active
        width 100%
        overflow hidden
        position absolute
        top 0
        left 0
        bottom 0
        background #f2f2f2
        .comment-active-top
            width 100%
            height 120px
            background #fff
            border-bottom 1px solid rgba(0,0,0,0.1)
            display flex
            .comment-active-top-left
                flex 0 0 120px
                height 120px
                line-height 100px
                text-align center
                font-size 35px
                font-weight bold
                color #cea16a
                position relative
                .comment-active-top-left-bottom
                    position absolute
                    width 120px
                    line-height 30px
                    text-align center
                    bottom 20px
                    left 0
                    font-size 15px
                    color #000
            .comment-active-top-right
                flex 1
                height 120px
                position relative
                .comment-active-top-right-cover
                    position absolute
                    height 120px
                    width 100%
                    left 0
                    top 0
                    z-index 100
                    background rgba(0,0,0,0)
                .comment-active-top-right-stick
                    position absolute
                    left 0px
                    height 80px
                    width 1px
                    top 20px
                    background rgba(0,0,0,0.1)
                .comment-active-top-right-title1
                    position absolute
                    top 18px
                    left 15px
                .comment-active-top-right-title2
                    position absolute
                    top 50px
                    left 15px
                .comment-active-top-right-title3
                    position absolute
                    top 82px
                    left 15px
                .comment-active-top-right-point1
                    position absolute
                    top 18px
                    left 185px
                    color rgba(0,0,0,0.5)
                .comment-active-top-right-point2
                    position absolute
                    top 50px
                    left 185px
                    color rgba(0,0,0,0.5)
                .comment-active-top-right-point3
                    position absolute
                    top 82px
                    left 185px
                    color rgba(0,0,0,0.5)
                .comment-active-top-right-comment-rater1
                    position absolute
                    top 18px
                    left 80px
                .comment-active-top-right-comment-rater2
                    position absolute
                    top 50px
                    left 80px
                .comment-active-top-right-comment-rater3
                    position absolute
                    top 82px
                    left 80px
        .comment-active-padding
            width 100%
            height 30px
            border-bottom 1px solid rgba(0,0,0,0.1)
        .comment-active-comment-item
            background #fff
            width 100%
            padding 10px 15px
            border-bottom 1px solid rgba(0,0,0,0.1)
            position relative
            img
                width 48px
                height 48px
                border-radius 50%
            .comment-active-comment-item-id
                position absolute
                top 14px
                left 80px
            .comment-active-comment-item-show-rater
                position absolute
                top 36px
                left 80px
            .comment-active-comment-item-date
                position absolute
                top 36px
                left 200px
                color rgba(0,0,0,0.4)
            .comment-active-comment-item-comment
                width 100%
                padding 0 20px
                word-wrap break-word
        .comment-active-comment-loading
            width 100%
            height 30px
            text-align center
            line-height 30px
            color color rgba(0,0,0,0.4)
</style>

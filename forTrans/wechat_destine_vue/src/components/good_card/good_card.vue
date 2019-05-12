<template>
    <div class="list-contain">
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
                            <div class="btn-control" v-if="hasControl">
                                <btn :ticket='item' v-on:addCart='addCart' v-on:decreaseCart='decreaseCart'/>
                            </div>
                            <div class="btn-control" v-if="!hasControl">{{ noControlText }}</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6" scoped>
	import BScroll from 'better-scroll'
    import btn from '@/components/btn/btn'
	export default {
        props: {
            ticketList: {
                type: Array
            },
            hasControl: {
                type: Boolean,
                default: true
            },
            noControlText: {
                type: String,
                default: ''
            }
        },
		data: function () {
			return {
                
            }
		},
        created () {
            // console.log(this.hasControl, this.noControlText)
			this.$nextTick(()=>{
                this.listScroll = new BScroll(this.$refs.listWrapper,{
					click: true
				});
            });
        },
        methods: {
	        addCart (ticket) {
                this.$emit('addCart', ticket);
            }, 
            decreaseCart (ticket) {
                this.$emit('decreaseCart', ticket);
            },
        },
        computed: {
	        
        },
        components: {
            btn
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/index.styl";
.list-contain
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    .list-wrapper
        height 100%
        width 100%
        overflow hidden
        .list
            margin-bottom 20px
            .item
                display flex
                justify-content space-between
                padding 4px 0
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
</style>

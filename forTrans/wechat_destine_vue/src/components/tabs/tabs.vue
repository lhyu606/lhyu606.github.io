<template>
    <div class="tabs-wrapper">
        <div class="tabs">
            <div class="tab" v-for="(item, idx) in list" :key="idx" :class="aplitClass" @click="checkTab(item.type)">
                <router-link class="text" :class="{ active: item.type == 0}" :to="item.to">
                    <span>{{ item.text }}</span>
                </router-link>
            </div>
            <div class="line" :style="linePos"></div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	export default {
        props: {
            list: {
                type: Array
            }
        },
		data: function () {
			return {
                type: 0,
                aplitClass: {
                    'col-2': this.list.length == 2,
                    'col-3': this.list.length == 3,
                    'col-4': this.list.length == 4,
                    'col-5': this.list.length == 5
                }
            }
		},
        created () {
            this.type = this.$store.state.tabType
			console.log('this.list')
			console.log(this.type)
        },
        updated () {
            this.type = this.$store.state.tabType
        },
        methods: {
	        checkTab (type) {
                this.type = type
                this.$store.dispatch('setTabType', this.type)
            }
        },
        computed: {
	       count () {
               return this.list.length;
           },
           linePos () {
               return {
                   left: (this.type + 0.5) / this.list.length * 100 + '%'
               }
           }
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/index.styl";
    .tabs-wrapper
        background #423c31
        min-height 100%
        color #cea16a
        padding 0 10px
        .tabs
            font-size 0px
            width 100%
            height 48px
            position relative
            .line
                position absolute
                bottom 0px
                width 50px
                height 3px
                border-radius 1.5px
                background #cea16a
                transition all 0.1s
                transform translate(-50%, 0)
            .tab
                display inline-block
                height 48px
                font-size 16px
                line-height 48px
                text-align center
                vertical-align top
                position relative
                &.col-2
                    width: 50%
                &.col-3
                    width: 33.3%
                &.col-4
                    width: 25%
                &.col-5
                    width: 20%
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
                            // border-top 1px solid #cea16a
</style>

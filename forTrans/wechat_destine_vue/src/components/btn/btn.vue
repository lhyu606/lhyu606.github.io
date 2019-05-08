<template>
    <div class="btn-wrapper">
        <transition name="move">
            <span class="reverse btn" v-show="ticket.count>0" @click.stop.prevent="decreaseCart">-</span>
        </transition>
        <transition name="move">
            <span class="num" v-show="ticket.count>0">{{ this.ticket.count }}</span>
        </transition>
        <span class="add btn" @click.stop.prevent="addCart">+</span>
    </div>
</template>

<script type="text/ecmascript-6">
	export default {
        props: {
            ticket: {
                type: Object
            }
        },
		data: function () {
			return {
				
            }
		},
        created () {
            console.log(this.ticket)
        },
        methods: {
	        addCart (event) {
                // if (!event._constructed) {
                //     return;
                // }
                if (!this.ticket.count) {
                    this.$set(this.ticket, 'count', 1);
                } else {
                    this.ticket.count++;
                }
                this.$emit('addCart',event.target);
            },
            decreaseCart (event) {
                // if (!event._constructed) {
                //     return;
                // }
                this.ticket.count--;
                this.$emit('decreaseCart', event.target)
            }
        },
        computed: {
            
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .btn-wrapper
        display flex
        justify-content space-between
        .btn
            width 24px
            height 24px
            border-radius 50%
            line-height 20px
            text-align center
            background #cea16a
            color #ffffff
            font-size 24px
            font-weight 300
        .num
            padding 0 10px
            line-height 24px
            font-size 16px
            &.move-enter-active, &.move-leave-active
                transition all 0.1s linear
            &.move-enter, &.move-leave-to
                transform translate(5px,0px)
                opacity 0
        .reverse
            &.move-enter-active, &.move-leave-active
                transition all 0.1s linear
            &.move-enter, &.move-leave-to
                transform translate3d(24px,0px,0px) rotate(180deg)
                opacity 0
        
</style>

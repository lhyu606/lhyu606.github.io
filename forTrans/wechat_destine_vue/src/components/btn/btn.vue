<template>
    <div class="btn-wrapper">
        <span class="reverse btn">-</span>
        <span class="num">0</span>
        <span class="add btn">+</span>
    </div>
</template>

<script type="text/ecmascript-6">
	export default {
		data: function () {
			return {
				
            }
		},
        created () {
            
        },
        methods: {
	        
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
</style>

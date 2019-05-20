<template>
    <div class="test">
       <div class="btn" @click='reqWxConfig'>点击进行扫码</div>
       <div>
           {{ result }}
       </div>
    </div>
</template>

<script type="text/ecmascript-6">
	export default {
        props: {
            
        },
		data: function () {
			return {
                result: '',
                lockWX: false
            }
		},
        created () {
            // console.log(this.ticket)
        },
        methods: {
            reqWxConfig () {
            if (this.lockWX) {
                return
            }
            this.lockWX = true
            setTimeout(() => {
                this.lockWX = false
            }, 1000)
            // 获取微信配置接口***********************************************************************
            this.$store.dispatch('setIsLoading', true)
            this.$http.post(this.$store.state.IP + 'reserve_service/Wechat/Destine/getTicket', {
                wechatPubID: this.$route.query.weChatId,
                url: window.location.href
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
                console.log('获取微信配置接口开始')
                response = response.body
                console.log(response)
                if (response.code === '0') {
                    this.wx = response.data
                    this.$wechat.config({
                        debug: true, //  开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: this.wx.appId,
                        timestamp: this.wx.timestamp,
                        nonceStr: this.wx.nonceStr,
                        signature: this.wx.signature,
                        jsApiList: ['scanQRCode']
                    })
                    this.$wechat.ready(() => {
                        this.$wechat.scanQRCode({
                            desc: 'scanQRCode desc',
                            needResult: 1,
                            scanType: ["qrCode", "barCode"],
                            success: (res => {
                                let obj = {}
                                if (this.isJsonString(res.resultStr)) {
                                    obj = JSON.parse(res.resultStr)
                                }
                                if (!this.isJsonString(res.resultStr)) {
                                    this.$store.dispatch('setCurrentAddCardPage', 1)
                                    //	                                    window.location.href = res.resultStr + '&openid=' + this.$route.query.openid
                                    window.location.href = res.resultStr
                                    return
                                }
                                let timestamp = new Date().getTime()
                                // 加一个companyId的字段，判断是不是同一个公众号
                                if (parseInt(obj.companyId) !== parseInt(this.$route.query.companyId)) {
                                    this.$store.dispatch('setNowToast', '非该店二维码' + ',会员卡的总店ID:' + this.$route.query.companyId + ',二维码里的总店ID:' + obj.companyId)
                                    //	                                    this.lockWX = false
                                    return
                                }
                                if (this.stringToTimeStamp(obj.startTime) > timestamp || timestamp > this.stringToTimeStamp(obj.endTime)) {
                                    this.$store.dispatch('setNowToast', '不在活动时间内')
                                    //	                                    this.lockWX = false
                                    return
                                }
                                if (this.memberGrade !== -1) {
                                    if (parseInt(this.realShopNo) !== parseInt(obj.shopNo)) {
                                        this.$store.dispatch('setNowToast', '非当前商家活动' + ',会员卡的分店ID:' + this.realShopNo + ',二维码里的分店ID:' + obj.shopNo)
                                        //                                            this.lockWX = false
                                        return
                                    }
                                }
                                let memberGradeArray = obj.memberGrade.split(',')
                                if (memberGradeArray.indexOf(this.memberGrade.toString()) !== -1) {
                                    this.signPointUnderLine(obj.ruleId, obj.shopNo)
                                    //	                                    this.lockWX = false
                                    return
                                }
                                this.$store.dispatch('setNowToast', '该活动不适用您的会员等级')
                                //							        this.lockWX = false
                            }),
                            error: (res => {
                                //							        this.lockWX = false
                                if (res.errMsg.indexOf('function_not_exist') > 0) {
                                    alert('版本过低请升级')
                                }
                            })
                        })
                    })
                }
                if (response.code !== '0') {
                    console.log('返回码不是0')
                    this.$store.dispatch('setNowToast', response.msg)
                    //				        this.lockWX = false
                }
                console.log('获取微信配置接口结束了')
                console.log('******************************************')
            }, response => {
                this.$store.dispatch('setIsLoading', false)
                //			        this.lockWX = false
                console.log('获取微信配置接口失败了')
            })
            // 获取微信配置接口********************************************************************
        },
        },
        computed: {
            
        }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .btn
        padding 10px
        background #adf
</style>

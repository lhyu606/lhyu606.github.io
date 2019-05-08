/**
 * Created by Administrator on 2017-07-06.
 */
const ERR_NO = 0
export default{
  install (Vue, options) {
    // ****************** 打印方法*****************************************
    Vue.prototype.$C = (x) => {
      console.log('打印方法：' + x)
    }
    // ****************** 接口地址*****************************************
    Vue.prototype.$A = () => {
      // return 'http://192.168.73.21/wechat_order_service'
      // return 'http://192.168.199.241/wechat_order_service'
	    return 'http://yjtest1.tunnel.echomod.cn/wechat_order_service'
      // return 'http://localhost/wechat_order_service'
    }
    // ****************** 接口地址*****************************************
    Vue.prototype.$ERR_NO = () => {
      return ERR_NO
    }
    // *******************时间格式化的方法*************************************
	  Vue.prototype.$F = (date) => {
		  let Y = date.getFullYear()
		  let m = date.getMonth() + 1
		  let d = date.getDate()
		  let H = date.getHours()
		  let i = date.getMinutes()
		  let s = date.getSeconds()
		  if (m < 10) {
			  m = '0' + m
		  }
		  if (d < 10) {
			  d = '0' + d
		  }
		  if (i < 10) {
			  i = '0' + i
		  }
		  if (s < 10) {
			  s = '0' + s
		  }
		  return Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s
	  }
  }
}

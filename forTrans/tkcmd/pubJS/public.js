/**
 * 切换至某个页面。
 * 参数 frm : index.html中的iframe 的 ID。
 * 参数 uri : 相对于index.html的文件路径。
 * 当uri变化时，会先调用 frame.onSrcChanged，然后清除此函数，再跳转UII
 */
function switch_to_frame(frm, uri) {
    var frame = document.getElementById(frm);
    if (frame.src_short != uri){
        if(frame.onSrcChanged){
            try{
                frame.onSrcChanged();
            }
            catch(e){};
            delete frame.onSrcChanged;
        }
        frame.src = uri;
        frame.src_short = uri;
    }
}

/**
 * 分析URL，可以解出类似协议(http)，参数等。必须是标准的URL
 */
function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}

/**
 * 时间过滤选择
*/
function simpleDateFormat(time) {
    var d = new Date(time);
    var month = d.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var date = d.getDate();
    if (date < 10) {
        date = '0' + date;
    }
    var hour = d.getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }
    var minute = d.getMinutes();
    if (minute < 10) {
        minute = '0' + minute;
    }
    var second = d.getSeconds();
    if (second < 10) {
        second = '0' + second;
    }
    return d.getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
}

/**
 * JS 数字相加出现多个小数的问题
 */
function toDecimal(x) {
    var val = Number(x);
    if(!isNaN(parseFloat(val))) {
        val = val.toFixed(2);
    }
    return val;
}

/**
 * 数字的分位显示
 */
function fmoney(m) {
    return m.split('').reverse().join('').replace(/(\d{3})\B/g,'$1,').split('').reverse().join('');
}

/**
 * HTML实体编码
 */
function escapeHtml(string) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

/**
 * 隐藏手机号中间四位
 */
function hidePhone(str) {
    var pho_str1,pho_str2;
    pho_str1 = str.substring(0,3);
    pho_str2 = str.substring(7);
    return pho_str1 + "****" + pho_str2;
}

/**
 * 计算时间
 */
function getDay(day) {
	var today = new Date();

	var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

	today.setTime(targetday_milliseconds); //注意，这行是关键代码

	var tYear = today.getFullYear();
	var tMonth = today.getMonth();
	var tDate = today.getDate();
	tMonth = doHandleMonth(tMonth + 1);
	tDate = doHandleMonth(tDate);
	return tYear + "-" + tMonth + "-" + tDate;
}
	
function doHandleMonth(month) {
	var m = month;
	if(month.toString().length == 1) {
		m = "0" + month;
	}
	return m;
}


function formatTime(t, fmt) {
	var o = {
		"M+" : t.getMonth()+1,                 //月份
		"d+" : t.getDate(),                    //日
		"h+" : t.getHours(),                   //小时
		"m+" : t.getMinutes(),                 //分
		"s+" : t.getSeconds(),                 //秒
		"q+" : Math.floor((t.getMonth()+3)/3), //季度
		"S"  : t.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt=fmt.replace(RegExp.$1, (t.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return fmt;
}

function formatTimeTZ(t, fmt) {
	var o = {
		"M+" : t.getUTCMonth()+1,                 //月份
		"d+" : t.getUTCDate(),                    //日
		"h+" : t.getUTCHours(),                   //小时
		"m+" : t.getUTCMinutes(),                 //分
		"s+" : t.getUTCSeconds(),                 //秒
		"q+" : Math.floor((t.getUTCMonth()+3)/3), //季度
		"S"  : t.getUTCMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt=fmt.replace(RegExp.$1, (t.getUTCFullYear()+"").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return fmt;
}

Date.prototype.format = function(fmt) {
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return fmt;
}

Date.prototype.secondOfDay = function() {
	return this.getHours() * 3600 + this.getMinutes() * 60 + this.getSeconds();
}

/**
 * 把字符串转换成 Date 对象
 * str2Date('2012-07-27 12:43:43') OR str2Date('2012-07-27')
 * @return 时间
 */
function str2Date(str){
	var _arr = str.split(' ');
	var _day = _arr[0].split('-');
	_arr[1] = (_arr[1] == null) ? '0:0:0' :_arr[1];
	var _time = _arr[1].split(':');
	for (var i = _day.length - 1; i >= 0; i--) {
		_day[i] = isNaN(parseInt(_day[i])) ? 0 :parseInt(_day[i]);
	};
	for (var i = _time.length - 1; i >= 0; i--) {
		_time[i] = isNaN(parseInt(_time[i])) ? 0 :parseInt(_time[i]);
	};
	var _temp = new Date(_day[0],_day[1]-1,_day[2],_time[0],_time[1],_time[2]);
	return _temp;
}

function filterHtmlStr(data) {
	return data.replace(/[<>]*/igm, '');
}

/**
 * 时间过滤选择
 */
function updateDate(str) {
	str = str.replace(/T/,' ');
	str = str.replace(/.000Z/,'');
	var a1;
	var a2;
	a1 = str.split(' ');
	a2 = a1[1].split(':');
	a2[0] =parseInt(a2[0]) + 8;
	if(a2[0] >= 24) {
		a1[0] = a1[0].split('-');
		a1[0][2] = parseInt(a1[0][2]) + 1;
		a1[0] = a1[0].join('-');
		a2[0] = a2[0]-24;
		if(a2[0] < 10) {
			a2[0] = '0'+a2[0];
		}
	}
	a2 = a2.join(':');
	var update_time = a1[0]+' '+a2;
	return update_time;
}

/**
 * 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
 * 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00
 * 返回精度为：秒，分，小时，天
 */
function GetDateDiff(startTime, endTime, diffType) {
	startTime = startTime.replace(/\-/g, "/");    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
	endTime = endTime.replace(/\-/g, "/");
	diffType = diffType.toLowerCase();    //将计算间隔类性字符转换为小写
	var sTime =new Date(startTime);    //开始时间
	var eTime =new Date(endTime);    //结束时间

	var timeType =1;    //作为除数的数字
	switch (diffType) {
		case "second":
			timeType = 1000;
			break;
		case "minute":
			timeType = 1000*60;
			break;
		case "hour":
			timeType = 1000*3600;
			break;
		case "day":
			timeType = 1000*3600*24;
			break;
		default:
			break;
	}
	return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
}

/**
 *发帖时间格式
 * 例如：1天（小时，分钟）前
 */
function getDateDiff(dateStr) {
	var d_seconds, d_minutes, d_hours, d_days, d;
	var publishTime = getDateTimeStamp(dateStr) / 1000;
	var timeNow = parseInt(new Date().getTime() / 1000);

	var date = new Date(publishTime * 1000),
		Y = date.getFullYear(),
		M = date.getMonth() + 1,
		D = date.getDate(),
		H = date.getHours(),
		m = date.getMinutes(),
		s = date.getSeconds();
	//小于10的在前面补0
	if (M < 10) M = '0' + M;
	if (D < 10) D = '0' + D;
	if (H < 10) H = '0' + H;
	if (m < 10) m = '0' + m;
	if (s < 10) s = '0' + s;

	d = timeNow - publishTime;
	d_days = parseInt(d / 86400);
	d_hours = parseInt(d / 3600);
	d_minutes = parseInt(d / 60);
	d_seconds = parseInt(d);

	if (d_days > 0 && d_days < 3) {
		return d_days + '天前';
	} else if (d_days <= 0 && d_hours > 0) {
		return d_hours + '小时前';
	} else if (d_hours <= 0 && d_minutes > 0) {
		return d_minutes + '分钟前';
	} else if (d_seconds < 60) {
		if (d_seconds <= 0) {
			return '刚刚';
		} else {
			return d_seconds + '秒前';
		}
	} else if (d_days >= 3 && d_days < 30) {
		return M + '-' + D + ' ' + H + ':' + m;
	} else if (d_days >= 30) {
		return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
	}
}
function getDateTimeStamp(dateStr) {
	return Date.parse(dateStr.replace(/-/gi, "/"));
}

/**
 * 获得当前时间,时间格式为 年-月-日 小时:分钟:秒
 */
function getNowTime() {
	var d = new Date();
	return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

/**
 * 计算日期相减天数
 */
function DateMinus(date) {
	var sdate = simpleDateFormat(date).replace(/-/g, "/");
	var now = new Date();
	var days = new Date(sdate).getTime() - now.getTime();
	days = parseInt(days /(24 * 3600 *1000));
	return days;
}

/**
 * 计算日期相减小时数
 */
function HourMinus(date) {
	var sdate = simpleDateFormat(date).replace(/-/g, "/");
	var now = new Date();
	var hours = new Date(sdate).getTime() - now.getTime();
	hours = parseInt(hours /(3600 * 1000));
	return hours;
}

/**
 * 日期加上天数得到新日期
 */
function addDay(sdate, days) {
	var sDate = sdate.split("-");
	var nDate = new Date(sDate[1] + '-' + sDate[2] + '-' + sDate[0]); //转换为MM-DD-YYYY格式
	var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
	var rDate = new Date(millSeconds);
	var year = rDate.getFullYear();
	var month = rDate.getMonth() + 1;
	if (month < 10) month = "0" + month;
	var date = rDate.getDate();
	if (date < 10) date = "0" + date;
	return (year + "-" + month + "-" + date);
}

/**
 *图片URL替换函数
 */
function getObjectURL(file) {
	var url = null ;
	if (window.createObjectURL!=undefined) { // basic
		url = window.createObjectURL(file) ;
	} else if (window.URL!=undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file) ;
	} else if (window.webkitURL!=undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file) ;
	}
	return url ;
}

/**
 *图片地址修改（过滤）
 */
function picUrlTrans(picUrl, url) {
	if(picUrl.indexOf('http') >= 0)
		return picUrl;
	else
		return url + picUrl;
}

/**
 * js控制图片自动伸缩，实现盒子铺满不变形，自动居中
 */
function resize_img(pic,w,h) {//参数
	var re_new_size=function(r){
		//根据比率重新计算宽度
		return {w:pic.width/r,h:pic.height/r};
	};
	var re_offset=function(n){
		//根据新的宽高度返回偏移量
		return {off_l:(n.w-w)*0.5,off_t:(n.h-h)*0.5};
	};
	var re_position=function(o,n){
		//重新定位图片
		pic.style.cssText="position:absolute;top:"+-o.off_t+"px;left:"+-o.off_l+"px;width:"+n.w+"px;height:"+n.h+"px;";
	};
	var execute=function(rate){//总执行函数
		var new_size=re_new_size(rate),
			offset_new=re_offset(new_size);
		re_position(offset_new,new_size);
	};

	//判断变量
	var rate_of_w=pic.width/w,
		rate_of_h=pic.height/h,
		rate;
	if(rate_of_w>=1){
		//图片宽度大于显示区域宽度
		if(rate_of_h>=1){
			//且图片高度大于显示区域高度
			rate=Math.min(rate_of_w,rate_of_h);
		}else{
			//图片高度小于显示区域
			rate=pic.height/h;
		}
	}else{
		//图片宽度小于显示区域宽度
		if(rate_of_h>=1){
			//且图片高度大于显示区域高度
			rate=pic.width/w;
		}else{
			//图片高度小于显示区域高度
			rate=Math.min(rate_of_w,rate_of_h);
		}
	}
	execute(rate);
	//执行入口
}

/**
 * 编码转换（转汉字）
 * */
function tohanzi(data) {
	if(!data) return data;
	data = decodeURIComponent(data);
	var reg = /\\u[0-9a-f]{4}/igm;
	return data.replace(reg, function () {
		return String.fromCharCode(parseInt(arguments[0].substr(2, 4),16).toString())
	});
}

/**
 *动态添加CSS文件
 */ 
var dynamicLoading = {
	css: function(path) {
		if(!path || path.length === 0) {
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.href = path;
		link.rel = 'stylesheet';
		link.type = 'text/css';
		head.appendChild(link);
	}
}


// (function (doc, win) {
//     var docEl = doc.documentElement,
//     resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
//     recalc = function() {
//         var clientWidth = docEl.clientWidth;
//         if (!clientWidth) return;
//         docEl.style.fontSize = (clientWidth / 750) * 100 + 'px';    // 1rem 等于 100px（设计稿为 750px 的情况下）;
//     };
//
//     if (!doc.addEventListener) return;
//     win.addEventListener(resizeEvt, recalc, false);
//     doc.addEventListener('DOMContentLoaded', recalc, false);
//
// })(document, window);
/**
 * Created by yjp on 2018/5/21.
 * 可伸缩布局方案
 * rem计算方式：设计图尺寸px / 100 = 实际rem  例: 100px = 1rem
 */
!function (window) {

    /* 设计图文档宽度 */
    var docWidth = 750;

    var doc = window.document,
        docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

    var recalc = (function refreshRem () {
        var clientWidth = docEl.getBoundingClientRect().width;

        /* 8.55：小于320px不再缩小，11.2：大于420px不再放大 */
        docEl.style.fontSize = Math.max(Math.min(20 * (clientWidth / docWidth), 11.2), 8.55) * 5 + 'px';

        return refreshRem;
    })();

    /* 添加倍屏标识，安卓倍屏为1 */
    docEl.setAttribute('data-dpr', window.navigator.appVersion.match(/iphone/gi) ? window.devicePixelRatio : 1);

    if (/iP(hone|od|ad)/.test(window.navigator.userAgent)) {
        /* 添加IOS标识 */
        doc.documentElement.classList.add('ios');
        /* IOS8以上给html添加hairline样式，以便特殊处理 */
        if (parseInt(window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1], 10) >= 8)
            doc.documentElement.classList.add('hairline');
    }

    if (!doc.addEventListener) return;
    window.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);

}(window);


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

//一些弹窗提示
function popupTip(tip) {
    layer.open({
        content: tip
        ,time: 3
    });
}

/*提示消息*/
function msgTip(mes) {
    layer.open({
        content: mes
        ,skin: 'msg'
        ,time: 2 //2秒后自动关闭
    });
}

//隐藏手机号中间四位
function hidePhone(str) {
    var pho_str1,pho_str2;
    pho_str1 = str.substring(0,3);
    pho_str2 = str.substring(7);
    return pho_str1 + "****" + pho_str2;
}

// 移动端设备判断
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -10 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

//判断是否是QQ或者微信打开
function isInWexin() {
    if(navigator.userAgent.toLowerCase().indexOf("micromessenger")>=0)
        return true;
    return false;
}
function isInQQ() {
    if(navigator.userAgent.toLowerCase().indexOf(" qq/")>=0)
        return true;
    return false;
}

// 动态添加CSS文件
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

//时间过滤选择
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

/*发帖时间格式*/
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

//计算日期相减天数
function DateMinus(date) {
    var sdate = simpleDateFormat(date).replace(/-/g, "/");
    var now = new Date();
    var days = new Date(sdate).getTime() - now.getTime();
    days = parseInt(days /(24 * 3600 *1000));
    return days;
}

//计算日期相减小时数
function HourMinus(date) {
    var sdate = simpleDateFormat(date).replace(/-/g, "/");
    var now = new Date();
    var hours = new Date(sdate).getTime() - now.getTime();
    hours = parseInt(hours /(3600 * 1000));
    return hours;
}

//日期加上天数得到新日期
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


// HTML实体编码
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

// jquery新版本不支持toggle()的解决方法
$.fn.toggle = function( fn, fn2 ) {
    var args = arguments,guid = fn.guid || $.guid++,i=0,
        toggle = function( event ) {
            var lastToggle = ( $._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
            $._data( this, "lastToggle" + fn.guid, lastToggle + 1 );
            event.preventDefault();
            return args[ lastToggle ].apply( this, arguments ) || false;
        };
    toggle.guid = guid;
    while ( i < args.length ) {
        args[ i++ ].guid = guid;
    }
    return this.click( toggle );
};


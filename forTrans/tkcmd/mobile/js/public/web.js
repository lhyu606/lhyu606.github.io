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


/**
 * 显示搜索历史记录
 */
// $(function () {
//     var text = document.getElementById('searchGood');    // 获取表单元素
//     var hidden = document.getElementsByClassName('searchHistory');    //获取用来显示历史记录的列表框
//     var btn = document.getElementsByClassName('search');    // 获取搜索按钮
//     var data = localStorage.getItem('searchCont');    // 从本地存储中获取本地数据
//     console.log(data)
//
//     data = data ? JSON.parse(data) : [];    //将数据转换为数组格式
//
//     // 当键盘按键释放时触发事件
//     text.onkeyup = function () {
//
//         var txt = text.value;    //获取输入的数据
//         var html = '';    //初始化一个变量用来承载查找到的数据
//         for(var i=0;i<data.length;i++) {
//             var reg = new RegExp(txt);  //只有用构造函数方式才能传递参数
//             var index = data[i].search(reg); //在本地数据中查找是否含有输入的内容
//
//             //如果有，则将数据放到变量中
//             if(index != -1) {
//                 html += ' <li>' + data[i] + '</li>';
//             }
//         }
//
//         hidden.innerHTML = html;    //将最后得到的所有数据添加到要展示的列表框中
//         hidden.className = 'show';    //显示列表框
//     };
//
//     //给搜索框添加单击事件，当事件发生时，将表单中需要搜索的内容添加到本地存储起来，
//     btn.onclick = function () {
//         var txt = text.value;
//         if(data.indexOf(txt) == -1) {    //先判断本地是否存在，不存在添加，
//             data.push(txt);
//         }
//
//         localStorage.setItem('searchCont',JSON.stringify(data));	//更新本地存储的数据
//         text.value = '';    //搜索后 将表单内容置空，将选择框隐藏
//         hidden.className = 'hidden';
//         location.href = 'https://www.baidu.com/s?word='+txt;
//     };
//
//     //给历史展示框添加单击事件，利用事件委托将点击的历史展示框中 的内容添加到搜索栏中，
//     hidden.onclick = function (e) {
//         var li = e.target;
//         var title = li.innerHTML;
//         console.log(title);
//         text.value = title;
//     }
// })

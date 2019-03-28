// 前端图片预览
window.URL.createObjectURL


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

// https://www.cnblogs.com/saysmy/p/5626337.html
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
// 格式化时间
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

function createIMG () {  // 获取视频第一帧图片
        var scale = 0.25;
        var video = $('#video').find('video')[0];
        var canvas = document.createElement("canvas");
        var canvasFill = canvas.getContext('2d');
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        canvasFill.drawImage(video, 0, 0, canvas.width, canvas.height);
        var src = canvas.toDataURL("image/jpeg");
        $('#imgSmallView').html('<img src="'+ src +'" alt="预览图" />');
    }


xhr.upload.addEventListener("progress", uploadProgress, false); 
//进度显示
    function uploadProgress(evt) {
        if(evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            var progress = percentComplete.toString() + '%';
            $('#progressNumber').css('width',progress);
            $('#progressNumber').html(progress);
            if(percentComplete >= 100) {
                $('.delete_video').show();
                layer.msg('视频上传成功！')
            } else {
                $('.delete_video').hide();
            }
        } else {
            $('.delete_video').hide();
            layer.msg('视频上传失败！')
        }
    }
// 身份证正反面照片
    if (window.ActiveXObject || "ActiveXObject" in window) {
        // alert("您使用的为IE浏览器，图片名中带有中文可能无法正常预览");
    }
// '微信回调拿code';
// rc : 推荐码
		var redirect_uri = 'https://www.sosheng.net/webapp/miandan/boost.html?rc=' + rc + '&group_id=' + group_id;
		if(nick) redirect_uri += '&nick=' + nick;
		if(avatar) redirect_uri += '&avatar=' + avatar;
		if(plat) redirect_uri += '&plat=' + plat;
		redirect_uri = encodeURIComponent(redirect_uri);
		window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5778207eb1a95a25&' +
			'redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_userinfo' +
			'#wechat_redirect';

function checkSameDom(cur, next){
        if (!cur || !next) {return;}

        var nodeNames = ['div','p','span','h1','h2','h3','h4','h5','h6'];
        console.log(cur)
        if (cur.nodeType ==  next.nodeType) {
            if (nodeNames.indexOf(cur.nodeName.toLowerCase()) > -1) {
                if (cur.nodeName == next.nodeName) {
                    if (cur.childNodes.length > 0 && next.childNodes.length > 0) {

                        if (cur.childNodes.length != next.childNodes.length) {
                            console.log('长度不等');
                            isSameDom = false;
                            return ;
                        }
                        for(var i=0,len = cur.childNodes.length; i<len; i++) {
                            var cli = cur.childNodes[i],
                                nli = next.childNodes[i];
                                
                            checkSameDom(cli, nli);
                        }
                    } else {
                        // console.log('子元素长度为 0')
                        // isSameDom = false;
                        // return ;
                    }
                } else {
                    console.log('标签不同')
                    isSameDom = false;
                    return ;
                }
            } else {
                // console.log('非标签')
            }
        } else {
            console.log('类型不同')
            isSameDom = false;
            return ;
        }
    }
    // 去除 标签空格
    function trimhtml(el, contain) {
        if(!el || el.nodeType != 1) {return el;}
        var html = el.innerHTML;
        html = html.replace(/>\s*</g, function(match, rep, idx) {
            return '><';
        });
        contain.innerHTML = html;
        return contain;
    }


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


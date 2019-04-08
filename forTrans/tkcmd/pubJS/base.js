/**
 * Created by Administrator on 2017/9/19.
 */
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
 * 将某个页面弹出来，带遮罩。
 * 参数 uri : 弹出层内的文件路径。
 * 当uri变化时，会先调用 frame.onSrcChanged，然后清除此函数，再跳转UII
 */
function show_popup_frm(uri) {
    var frame = document.getElementById('popup_frm');
    if (frame.src_short != uri || $('.popup_div').hasClass('unshow')){
        if(frame.onSrcChanged){
            try{
                frame.onSrcChanged();
            }
            catch(e){};
            delete frame.onSrcChanged;
        }
        frame.src = uri;
        frame.src_short = uri;
        if (uri && uri.length > 0){
            $('.popup_div').removeClass('unshow');
            $('.popup_div').addClass('inshow');
            setTimeout(adjustPopfrmLocation, 100);
        }
        else{
            $('.popup_div').removeClass('inshow');
            $('.popup_div').addClass('unshow');
        }
    }
}

/**
 * 自动获取当前屏幕的宽度、高度clientWidth,clientWidth；
 * 弹出层居中；
 */
function adjustPopfrmLocation() {
    var width = document.body.clientWidth;
    var height = $(window).height();

    // 当popup_frm没加载东西时，这个是空的，不需要执行什么操作
    if(!popup_frm.document.body) return;

    var w = $('#popup_frm').width();
    var h = $('#popup_frm').height();
    var frmWidth = popup_frm.document.body.clientWidth;
    var left = (width-frmWidth+(1200-w))/2;
    var top = (height - h)/2;
    $('#popup_frm').css('left',left);
    $('#popup_frm').css('top',top);
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


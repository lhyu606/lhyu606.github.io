/**
 * Created by yjp on 2018/10/19.
 */

//初始数据
var $,layer,table;
var token = sessionStorage.getItem('token');

// 公共遮罩层（加载）
function loadingTip() {
    var index = parent.layer.load(1, {
        shade: [0.4,'#000'] //0.5透明度的黑色背景
    });
    return index;
}

layui.use(['jquery', 'layer', 'table'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层


    $('.add').click(function () {
        if($('#tel').val()) {
            var strs = $('#tel').val().replace(/\s+/g,",").replace(/，/g,",");
            var accounts = strs.split(',');
            // console.log(accounts)
            var param = {
                'token': token,
                'give_accs': JSON.stringify(accounts)
            }
            giveXqkSvip(param)
        } else {
            layer.msg("请输入账号！");
        }
    });
});


/**
 * 批量赠予天使会员
 * url: url/user_vip/give_xqk_svips
 * param: token,give_accs(数组的json字符串)
 */
function giveXqkSvip(param) {
    $.ajax({
        url: top.server_url + "/user_vip/give_xqk_svips",
        type: "post",
        dataType: "json",
        data: param,
        beforeSend: function () {  //请求成功前
            loadingTip();
        },
        complete: function () {  //请求成功后
            parent.layer.close(loadingTip());
        },
        success: function (data) {
            if(data.status == 200) {
                layer.msg("录入成功！");
                window.parent.getAllVip();
            }
            else {
                layer.msg(data.err);
            }
        },
        error: function() {
            var msg = "网络错误，请联系管理员或稍后重试！";
            layer.msg(msg);
        }
    });
}



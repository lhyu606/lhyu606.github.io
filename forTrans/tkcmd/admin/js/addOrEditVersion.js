/**
 * Created by yjp on 2018/10/30.
 */

//初始数据
var $,layer,form;
var par = parseURL(window.location.href);
var token = sessionStorage.getItem('adminToken');

layui.use(['jquery', 'layer', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    form = layui.form;
    
    
    // 编辑时传值
    if(par.params.isEdt==1) {
        var filter = JSON.parse(sessionStorage.getItem('filter'))

        $('#version').val(filter.version);
        $('#androidLog').val(filter.android_features);
        $('#iosLog').val(filter.ios_features);
        $('#androidDW').val(filter.android_url);
        $('#iosDW').val(filter.ios_url);
    }
     
    
    // 新增、编辑版本号
    $('.sure').click(function () {
        var version = $('#version').val();
        var iosUrl = $('#iosDW').val();
        var androidUrl = $('#androidDW').val();
        var androidFeatures = $('#androidLog').val();
        var iosFeatures = $('#iosLog').val();
        var param = {
            token: token,
            version: version,
            iosUrl: iosUrl,
            androidUrl: androidUrl,
            androidFeatures: androidFeatures,
            iosFeatures: iosFeatures,
            or_version: filter.version
        }
        if(par.params.isEdt==1) {
            updateVersion(param);
        } else {
            addVersion(param);
        }

    })
    
});


//添加新版本
function addVersion(param) {
    $.ajax({
        type: "post",
        url: server_url + "/appVersion/addVersion",
        data: param,
        success: function(data) {
            if(data.status == 200) {
                layer.msg('添加成功！');
                window.parent.getVersionList(true);
                setTimeout(function () {
                    parent.layer.closeAll();
                },2000)
            }
            else {
                if(data.status == 400 && data.err) {
                    layer.msg(data.err);
                } else {
                    layer.msg('网络错误，请稍后再试。');
                }
            }
        },
        error: function () {
            layer.msg("服务器错误，请联系管理员！");
        }
    });
}

//修改版本
function updateVersion(param) {
    $.ajax({
        type: "post",
        url: server_url + "/appVersion/updateVersion",
        data: param,
        success: function(data) {
            if(data.status == 200) {
                layer.msg("修改成功！");
                window.parent.getVersionList(true);
                setTimeout(function () {
                    parent.layer.closeAll();
                },2000)

            }
            else {
                layer.msg(data.err);
            }
        },
        error: function () {
            layer.msg("服务器错误，请联系管理员！");
        }
    });
}







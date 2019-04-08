/**
 * Created by yjp on 2018/1/3.
 */
//初始数据
var areaData = Area;
var $,layer,table,laydate,form,$form;
var token = sessionStorage.getItem('adminToken');
var actionUrl = server_url + "/operate_management/addProvider";

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');
    loadProvince();  //获取地区信息

    $('#myupload').attr('action',actionUrl);  //设置form的action地址

    // 身份证正反面照片
    if (window.ActiveXObject || "ActiveXObject" in window) {
        alert("您使用的为IE浏览器，图片名中带有中文可能无法正常预览");
    }
    $(".addImg").on('change', '.uploadfile', function() {
        var file = this.files[0];

        if ($(this).val()) {
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                $(this).prev("img").attr("src", $(this).val());
            } else {
                var objUrl = getObjectURL(file);  //获取图片的路径，该路径不是图片在本地的路径
                if (objUrl) {
                    $(this).prev("img").attr("src", objUrl);  //将图片路径存入src中，显示出图片
                } else {
                    $(this).prev("img").attr("src", "img/add_img.png");
                }
            }
        } else {
            $(this).prev("img").attr("src", "img/add_img.png");
        }
    });
});


//加载省数据
function loadProvince() {
    var proHtml = '';
    for (var i = 0; i < areaData.length; i++) {
        proHtml += '<option value="'+ areaData[i].provinceName +'">' + areaData[i].provinceName + '</option>';
    }
    //初始化省数据
    $form.find('select[name=province]').append(proHtml);
    form.render();
    form.on('select(province)', function(data) {
        var index = data.elem.selectedIndex-1;
        loadCity(areaData[index].mallCityList);
    });
}
//加载市数据
function loadCity(citys) {
    var cityHtml = '';
    for (var i = 0; i < citys.length; i++) {
        cityHtml += '<option value="'+ citys[i].cityName +'">' + citys[i].cityName + '</option>';
    }
    $form.find('select[name=city]').html(cityHtml).parent().show();
    form.render();
    form.on('select(city)', function(data) {
       
    });
}


/**
 * 添加服务商
 * param  token
 * param  account  服务商账号
 * param  province，city
 * param  company  可不填
 * param  legal_person  可不填
 * param  linkman  可不填
 * param  linkman_tel  可不填
 * param  status   0 | 1   0直接生效   1仅保存信息
 * url    /operate_management/addProvider
 */
function addProvider() {
    $("[name='token']").val(token);

    $("#myupload").ajaxSubmit({
        success: function (data) {
            if (data.status == 200) {
                layer.msg(data.payload);
                setTimeout(function () {
                    layer.closeAll();
                    parent.location.reload(); //刷新父页面
                }, 2000);
            } else {
                layer.msg(data.err);
            }
        },
        error: function () {
            layer.msg('网络错误，请稍后重试');
        }
    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}


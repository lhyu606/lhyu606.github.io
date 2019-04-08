/**
 * Created by yjp on 2017/12/27.
 */
//初始数据
var areaData = Area;
var $,layer,table,laydate,form,$form;
var par = parseURL(window.location.href);
var actionUrl = server_url + "/operate_management/editProviderInfo";
var token = sessionStorage.getItem('adminToken');

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');
    loadProvince();  //获取地区信息
    providerInfo();  //获取服务商详细信息

    $('#myupload').attr('action',actionUrl);  //设置form的action地址


    // 身份证正反面照片
    if(window.ActiveXObject || "ActiveXObject" in window) {
        alert("您使用的为IE浏览器，图片名中带有中文可能无法正常预览");
    }
    $(".addImg").on('change', '.uploadfile', function() {
        var file = this.files[0];

        if($(this).val()) {
            if(!!window.ActiveXObject || "ActiveXObject" in window) {
                $(this).prev("img").attr("src", $(this).val());
            } else {
                var objUrl = getObjectURL(file);  //获取图片的路径，该路径不是图片在本地的路径
                if(objUrl) {
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
        console.log(data.elem.selectedIndex)
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
 * 获取某个服务商的详细信息
 * param：token,
 * url：/agency_management/providerInfo
 */
function providerInfo() {
    $.ajax({
        url: server_url + "/operate_management/providerInfo",
        type: "post",
        dataType: "json",
        data: {
            'token': token,
            'p_uid': par.params.uid
        },
        success: function (data) {
            if (data.status == 200) {
                if (data.payload) {
                    var providerInfo = data.payload;
                    $("[name='p_account']").val(providerInfo.account);
                    $("[name='company']").val(providerInfo.company);
                    $("[name='legal_person']").val(providerInfo.legal_person);
                    $("[name='linkman']").val(providerInfo.linkman);
                    $("[name='linkman_tel']").val(providerInfo.linkman_tel);
                    $("[name='status']").val(providerInfo.status);
                    if (providerInfo.status == 3) {
                        $("[name='status']").attr("disabled","disabled");
                    }
                    $("[name='province']").val(providerInfo.province);
                    $("[name='city']").val(providerInfo.city);
                    $("[name='street']").val(providerInfo.street);
                    if (providerInfo.business_license && JSON.parse(providerInfo.business_license).length > 0) {
                        $.each(JSON.parse(providerInfo.business_license), function (index,obj) {
                            $('[name="bl'+ index +'"]').prev('img').attr('src', obj[index]);
                        });
                    }
                    $("[name='address']").val(providerInfo.address);
                    $("[name='open_account']").val(providerInfo.open_account);
                    $("[name='open_bankname']").val(providerInfo.open_bankname);
                    $("[name='permit_card']").val(providerInfo.permit_card);
                    $("[name='legal_positive']").prev('img').attr('src', providerInfo.legal_positive);
                    $("[name='legal_negative']").prev('img').attr('src', providerInfo.legal_negative);

                    form.render();
                }
            } else {
                layer.msg(data.err);
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            layer.msg("网络错误，请联系管理员或稍后重试！");
        }
    });
}


/**
 * 修改某个服务商的信息
 * param  token，p_uid
 * param  province，city，street
 * param  company             公司名
 * param  legal_person        法人
 * param  linkman             联系人
 * param  linkman_tel         联系电话
 * @param  business_license    营业执照
 * @param  address
 * @param  open_account        开户卡号
 * @param  open_bankname       开户行名
 * @param  permit_card         卡户许可证
 * @param  legal_positive      身份证正面照
 * @param  legal_negative      身份证反面照
 * url:     /operate_management/editProviderInfo
 */
function editProviderInfo() {
    $("[name='token']").val(token);
    $("[name='p_uid']").val(par.params.uid);
    // $("[name='status']").val(par.params.sts);
    $("[name='status']").removeAttr("disabled");  //表单提交时去掉不可修改的限制

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


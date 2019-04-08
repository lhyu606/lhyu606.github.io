/**
 * Created by yjp on 2018/7/2.
 */
//初始数据
var par = parseURL(window.location.href);
var detailInfo = JSON.parse(sessionStorage.getItem('detailInfo'));  //获取存储的单个加盟商数据
var nameList = ["company", "legal_person", "linkman", "linkman_tel", "province", "city", "lim_free_cnt", "done_free_cnt", "give_free_cnt",
    "wx_cnt", "cashAmount", "cashRatio", "is_free", "status", "pre_agent_lvl", "type"];
var areaData = Area;
var $form,$,layer,table,laydate,form;
var token = sessionStorage.getItem('adminToken');

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');
    loadProvince();  //获取地区信息

    if(!token)  top.location.href = "login.html";

    if(par.params.uid) {  //判断 添加或编辑
        fdetailInfo();  //获取服务商详细信息
        $('#myupload').attr('action',server_url + "/agency_management/updateWorkAgent");  //设置form的action地址
    }
    else {
        $('[name="account"]').removeAttr('disabled');
        $('#myupload').attr('action',server_url + "/agency_management/addWorkAgent");  //设置form的action地址
    }

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
 */
function fdetailInfo() {
    $("[name='account']").val(detailInfo.account);

    $.each(nameList, function (index,obj) {
        $("[name='"+ obj +"']").val(detailInfo[obj]);
    });

    layui.use('form', function () {
        layui.form.render();
    });
}


/**
 * 修改某个服务商的信息
 * param  token，uid
 * param  province，city
 * param  company             公司名
 * param  legal_person        法人
 * param  linkman             联系人
 * param  linkman_tel         联系电话
 * url:     /agency_management/updateWorkAgent
 */
function editProviderInfo() {
    $("[name='token']").val(token);
    if(par.params.uid) {
        $("[name='uid']").val(par.params.uid);
        $.each(nameList, function (index, obj) {
            var valCont = $("[name='"+ obj +"']").val();
            if(valCont=='' || valCont==detailInfo[obj])
                $("[name='"+ obj +"']").attr("disabled","disabled");
        });
    } else {
        $("[name='uid']").remove();
    }

    $("#myupload").ajaxSubmit({
        success: function (data) {
            if(data.status == 200) {
                layer.msg("操作成功！");
                setTimeout(function () {
                    parent.layer.closeAll();
                    window.parent.firstInfo(true);
                    // parent.location.reload(); //刷新父页面
                }, 2000);
            } else {
                $.each(nameList, function (index, obj) {
                    $("[name='"+ obj +"']").removeAttr("disabled");
                });
                layer.msg(data.err);
            }
        },
        error: function () {
            layer.msg('网络错误，请稍后重试');
        }
    });

    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}


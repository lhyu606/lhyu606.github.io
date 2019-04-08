/**
 * Created by Administrator on 2018/1/12.
 */
var par = parseURL(window.location.href);
var actionUrl = server_url + "/ad_config/saveConfig";
var filterLab = JSON.parse(sessionStorage.getItem('filter'));
var token = sessionStorage.getItem('adminToken');

//初始数据
var $form;
var $,layer,table,laydate,form;

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');

    //判断是新增还是编辑（编辑时赋值）
    if (par.params.uid) {
        // console.log(filterLab)
        $("[name='title']").val(filterLab.title);
        $(".addImg").find('img').attr('src',server_url+filterLab.pic_url);
        $(".addImg").append('<input type="text" class="pic_url" name="pic_url" hidden/>');
        $(".pic_url").val(filterLab.pic_url);
        $("[name='click_url']").val(filterLab.click_url);
        $("[name='comment']").val(filterLab.comment);
        $("[name='start_date']").val(filterLab.start_date);
        $("[name='end_date']").val(filterLab.end_date);
        $("[name='type']").val(filterLab.type);
        $("[name='status']").val(filterLab.status);
        if(filterLab.ex_info) {
            $("#myupload").append('<input type="text" name="ex_info" hidden/>');
            $("[name='ex_info']").val(filterLab.ex_info);
        }

        layui.form.render();  //刷新表单元素（动态插入的数据）
    }

    if (par.params.tp) {    // 新增条目时如果有选择类型，默认传过去
        $("[name='type']").val(par.params.tp);
        layui.form.render();  //刷新表单元素（动态插入的数据）
    }

    $('#myupload').attr('action',actionUrl);  //设置form的action地址

    //日期选择（开始时间）
    laydate.render({
        elem: '#startTime'
        ,type: 'datetime'
    });
    //日期选择（结束时间）
    laydate.render({
        elem: '#endTime'
        ,type: 'datetime'
    });

});


/**
 * 后台添加、编辑广告位或榜单
 * param  title，pic_url，click_url，type，start_date，end_date，status，sign
 * url    /ad_config/saveConfig
 */
function saveConfig() {
    $("[name='sign']").val(sign);
    if (par.params.uid) {
        var html = '<input type="text" name="id" hidden>';
        $('#myupload').find('input[name="id"]').remove();
        $('#myupload').append(html);
        $("[name='id']").val(par.params.uid);
    }

    $("#myupload").ajaxSubmit({
        success: function (data) {
            if (data.status == 200) {
                layer.msg(data.payload);
                setTimeout(function () {
                    parent.layer.closeAll();  // 关闭当前弹出层
                    // parent.location.reload(); //刷新父页面
                    window.parent.firstInfo(true);  //新增或编辑成功刷新列表页
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

$(function () {
    // 上传榜单图片
    if (window.ActiveXObject || "ActiveXObject" in window) {
        alert("您使用的为IE浏览器，图片名中带有中文可能无法正常预览");
    }
    $(".addImg").on('change', '.uploadfile', function() {
        var file = this.files[0];
        if (file) {
            $('.uploadfile').attr('name','pic_url');  //给file设置name属性
            $('.addImg').find('.pic_url').remove();  //移除隐藏域（text）
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
            $('.uploadfile').removeAttr('name');  //移除file的name属性
            $(this).prev("img").attr("src", "img/add_img.png");
        }
    });
})



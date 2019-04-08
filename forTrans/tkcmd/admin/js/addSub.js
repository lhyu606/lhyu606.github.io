/**
 * Created by yjp on 2018/8/28.
 */
//初始数据
var par = parseURL(window.location.href);
var actionUrl = server_url + "/shop_goods/addSubGoods";
var SubClass = JSON.parse(sessionStorage.getItem('addSub'));
var sku_value = {};
var attr_ids;
var token = sessionStorage.getItem('admin_token');

var $,layer,table,laydate,form,$form;

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');

    $('#myupload').attr('action',actionUrl);  //设置form的action地址

    // 上传商品图片
    $(".goodMainImg").on('change', '.good_mainImg', function() {
        var file = this.files[0];
        console.log(file)
        if(file) {
            $('.good_mainImg').attr('name','pictUrl');  //给file设置name属性
            $(this).next().remove();
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
            $('.good_mainImg').removeAttr('name');  //移除file的name属性
            $(this).prev("img").attr("src", "img/add_img.png");
        }
    });

    
    // 判断是否是编辑（编辑时赋值）
    console.log(SubClass)
    $("[name='token']").val(token);
    if(SubClass.belong_id) {
        $('#myupload').append('<input type="text" name="belong_id" hidden>');
        $("[name='belong_id']").val(SubClass.belong_id);
    }
    $("[name='is_publish']").val(SubClass.is_publish);
    $("[name='zkPrice']").val(SubClass.zkPrice);
    $("[name='totalNum']").val(SubClass.totalNum);

    //商品规格
    var sku = JSON.parse(SubClass.sku);
    $.each(sku, function (index, obj) {
        sku_value[index] = obj[0] +'_0' ;  //存sku_value
        var html = '';
        html += '<div class="layui-form-item">'
        html += '<label class="layui-form-label">'+ index +'</label>'
        html += '<div class="layui-input-inline">'
        html += '<select name="" lay-filter="sku">'
        $.each(obj, function (idx, object) {
            html += '<option value="'+ idx +'_'+ object +'_'+ index +'">'+ object +'</option>'
        });
        html += '</select>'
        html += '</div>'
        html += '</div>'
        $('.allSku').append(html);

        form.render()  //刷新表单元素
    });

    // 监听 sku选择
    form.on('select(sku)', function(e) {
        var prop = e.value.split('_');
        var k = prop[2], v = prop[1], idx = prop[0];
        sku_value[k] = v + '_' + idx;
        form.render();
    })

});


// 公共遮罩层（加载）
function loadingTip() {
    var index = parent.layer.load(1, {
        shade: [0.1,'#000'] //0.1透明度的黑色背景
    });
    return index;
}


/**
 * 商品录入
 * url  /shop_goods/save
 */
function create() {

    var attrid = [];
    var skus = {};
    for(var v in sku_value) {
        skus[v] = sku_value[v].split('_')[0];
        attrid.push(sku_value[v].split('_')[1]);
    }
    attr_ids = attrid.join('_');

    $("[name='attr_ids']").val(attr_ids);
    $("[name='sku_value']").val(JSON.stringify(skus));

    $("#myupload").ajaxSubmit({
        beforeSend: function () {  //请求成功前
            loadingTip();
        },
        complete: function () {  //请求成功后
            parent.layer.close(loadingTip());
        },
        success: function(data) {
            if(data.status == 200) {
                layer.msg("商品录入成功！");
                setTimeout(function () {
                    parent.layer.closeAll();  // 关闭当前弹出层
                }, 2000);
            }
            else {
                layer.msg(data.err);
            }
        },
        error: function () {
            layer.alert('网络错误，请稍后重试！', {icon: 7});
        }
    });
    return false;  //必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}



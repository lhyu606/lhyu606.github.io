/**
 * Created by yjp on 2018/8/31.
 */

//初始数据
var par = parseURL(window.location.href);
var actionUrl = server_url + "/shop_goods/save";
var filterLab = JSON.parse(sessionStorage.getItem('filter'));
var ispublish = 0;
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
    if(!!window.ActiveXObject || "ActiveXObject" in window) {
        layer.msg("您使用的浏览器暂不支持上传图片！");
    }
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


    // 监听商品状态选择
    form.on('select(isPublish)', function(e) {
        ispublish = e.value;
    })


    // 判断是否是编辑（编辑时赋值）
    var keysArr = ['id','belong_id', 'tkCommFee', 'biz30day', 'tag', 'fqCat', 'score', 'shopId', 'is_free', 'postage', 'attr_ids',
        'sku_value', 'self_ratio', 'rec1_ratio', 'rec2_ratio', 'agent_6_ratio', 'agent_5_ratio', 'agent_4_ratio', 'agent_3_ratio',
        'agent_2_ratio', 'agent_1_ratio'];
    if(par.params.gid) {
        console.log(filterLab)
        keysArr.forEach(function(key) {
            $('#myupload').append('<input type="text" name="'+ key +'" hidden>');
            $('[name="'+ key +'"]').val(filterLab[key]);
        })


        $("[name='title']").val(filterLab.title);  //商品标题

        //商品主图
        $(".goodMainImg").find('img').attr('src',picUrlTrans(filterLab.pictUrl,img_url));
        $(".goodMainImg").append('<input type="text" class="pictUrl" name="pictUrl" hidden/>');
        $(".pictUrl").val(filterLab.pictUrl);

        $("[name='zkPrice']").val(filterLab.zkPrice);  //商品价格
        $("[name='totalNum']").val(filterLab.totalNum);  //总库存


        $("[name='is_publish']").val(filterLab.is_publish);  //商品状态
        ispublish = filterLab.is_publish;

        form.render()  //刷新表单元素
    }
});


// 公共遮罩层（加载）
function loadingTip() {
    var index = parent.layer.load(1, {
        shade: [0.5,'#000'] //0.5透明度的黑色背景
    });
    return index;
}


/**
 * 商品录入
 * url  /shop_goods/save
 */
function create() {
    $("[name='token']").val(token);

    var title = $("[name='title']").val();
    if(title==undefined || title=='') {
        layer.msg("商品标题不能为空！")
        return false;
    }

    $("#myupload").ajaxSubmit({
        beforeSend: function () {  //请求成功前
            loadingTip();
        },
        complete: function () {  //请求成功后
            parent.layer.close(loadingTip());
        },
        success: function(data) {
            if(data.status == 200) {
                window.parent.firstInfo(true);  //新增或编辑成功刷新列表页
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



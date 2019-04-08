/**
 * Created by yjp on 2018/5/3.
 */
//初始数据
var par = parseURL(window.location.href);
var actionUrl = server_url + "/shop_goods/save";
var filterLab = JSON.parse(sessionStorage.getItem('filter'));
var ispublish = 0;
var token = sessionStorage.getItem('adminToken');


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
    // 上传推广图片
    $(".expLongImg").on('change', '.exp_longImg', function() {
        var file = this.files[0];
        console.log(file)
        if(file) {
            $('.exp_longImg').attr('name','long_picurl');  //给file设置name属性
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
            $('.exp_longImg').removeAttr('name');  //移除file的name属性
            $(this).prev("img").attr("src", "img/add_img.png");
        }
    });


    // 监听radio
    form.on('radio', function(e) {
        var save = $('[name="is_publish"]').find('option[value="0"]');
        var upload = $('[name="is_publish"]').find('option[value="1"]');
        if(e.value=='no') {
            $('.allGroup').empty();
            upload.removeAttr('disabled');  //可点击
            $('.addSubClass').addClass('hide')
        }
        else if(e.value=='yes') {
            var html = '';
            html += '<div class="group">'
            html += '<div class="layui-form-item fl">'
            html += '<label class="layui-form-label">商品属性名</label>'
            html += '<div class="layui-input-inline">'
            html += '<input type="text" name="sku_key1" autocomplete="off" placeholder="例如：颜色、尺码等" onblur="OnPropChanged(this)" class="layui-input skuKey">'
            html += '</div>'
            html += '<label class="layui-form-label">商品属性值</label>'
            html += '<div class="layui-input-inline">'
            html += '<input type="text" name="sku_val1" autocomplete="off" placeholder="例如：白色(多值以逗号隔开)" onblur="OnPropChanged(this)" class="layui-input skuVal">'
            html += '</div>'
            html += '</div>'
            html += '<button type="button" class="layui-btn addGroup fr">新增</button>'
            html += '</div>'
            $('.allGroup').empty().append(html);

            if(upload.is(':selected')==true) {
                upload.removeAttr('selected');
                save.attr("selected",true);
            }
            upload.attr('disabled', 'disabled');  //不可点击
        }
        form.render();
    })

    // 监听商品状态选择
    form.on('select(isPublish)', function(e) {
        ispublish = e.value;
    })

    var skuLen;
    // 添加新的组
    $('body').on('click', '.addGroup', function () {
        skuLen = $('.group').length;
        // console.log(skuLen)
        var html = '';
        html += '<div class="group">'
        html += '<div class="layui-form-item fl">'
        html += '<label class="layui-form-label">商品属性名</label>'
        html += '<div class="layui-input-inline">'
        html += '<input type="text" name="sku_key'+ (skuLen+1) +'" autocomplete="off" placeholder="例如：颜色、尺码等" onblur="OnPropChanged(this)" class="layui-input skuKey">'
        html += '</div>'
        html += '<label class="layui-form-label">商品属性值</label>'
        html += '<div class="layui-input-inline">'
        html += '<input type="text" name="sku_val'+ (skuLen+1) +'" autocomplete="off" placeholder="例如：白色(多值以逗号隔开)" onblur="OnPropChanged(this)" class="layui-input skuVal">'
        html += '</div>'
        html += '</div>'
        html += '<button type="button" class="layui-btn delete fr">删除</button>'
        html += '</div>'
        $('.allGroup').append(html);
        form.render()
    });
    // 删除组
    $('body').on('click', '.delete', function () {
        $(this).parent('.group').remove();
        skuLen = $('.group').length;
        console.log(skuLen)

        $('.group').each(function (index) {  //删除时重新排序
            $(this).find('.skuKey').attr('name', 'sku_key'+ (index+1));
            $(this).find('.skuVal').attr('name', 'sku_val'+ (index+1));
        });
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

        $("[name='shopTitle']").val(filterLab.shopTitle);  //店铺名
        $("[name='zkPrice']").val(filterLab.zkPrice);  //商品价格
        $("[name='totalNum']").val(filterLab.totalNum);  //总库存
        $("[name='tkRate']").val(filterLab.tkRate);  //佣金比率

        //推广长图
        if(filterLab.long_picurl) {
            $(".expLongImg").find('img').attr('src',picUrlTrans(filterLab.long_picurl,img_url));
            $(".expLongImg").append('<input type="text" class="long_picurl" name="long_picurl" hidden/>');
            $(".long_picurl").val(filterLab.long_picurl);
        }

        $("[name='mp4']").val(filterLab.mp4);  //视频地址

        //轮播图渲染
        if(filterLab.pics) {
            $('.swiper_img').empty();
            var pics = JSON.parse(filterLab.pics);
            $.each(pics, function (index, obj) {
                var html = '';
                html += '<div class="label">'
                html += '<label>'
                html += '<div class="addImg">'
                html += '<img src="'+ picUrlTrans(obj,img_url) +'"/>'
                html += '<input type="file" class="uploadfile" accept="image/*"/>'
                html += '<input type="text" name="img'+ (index+1) +'"  hidden/>'
                html += '</div>'
                html += '</label>'
                html += '<p class="delete_img">删除</p>'
                html += '</div>'
                $('.swiper_img').append(html);
                form.render()
                //渲染图片数据
                $("[name='img"+ (index+1) +"']").val(obj);  //图片
            });
            // if(pics.length < 5) {
                var html_last = '';
                html_last += '<div class="label">'
                html_last += '<label>'
                html_last += '<div class="addImg">'
                html_last += '<img src="img/add_img.png">'
                html_last += '<input type="file" class="uploadfile" accept="image/*">'
                html_last += '</div>'
                html_last += '</label>'
                html_last += '</div>'
                $('.swiper_img').append(html_last);
            // }
        }

        //详情图渲染
        if(filterLab.detail) {
            $('.detail_img').empty();
            var detail = JSON.parse(filterLab.detail).pics;
            $.each(detail, function (index, obj) {
                var html = '';
                html += '<div class="label2">'
                html += '<label>'
                html += '<div class="addImg2">'
                html += '<img src="'+ picUrlTrans(obj,img_url) +'"/>'
                html += '<input type="file" class="uploadfile2" accept="image/*"/>'
                html += '<input type="text" name="d_img'+ (index+1) +'" hidden/>'
                html += '</div>'
                html += '</label>'
                html += '<p class="delete_img2">删除</p>'
                html += '</div>'
                $('.detail_img').append(html);
                form.render()
                //渲染图片数据
                $("[name='d_img"+ (index+1) +"']").val(obj);  //图片
            });
            var html_last = '';
            html_last += '<div class="label2">'
            html_last += '<label>'
            html_last += '<div class="addImg2">'
            html_last += '<img src="img/add_img.png">'
            html_last += '<input type="file" class="uploadfile2" accept="image/*">'
            html_last += '</div>'
            html_last += '</label>'
            html_last += '</div>'
            $('.detail_img').append(html_last);
        }

        //商品规格
        if(filterLab.sku && filterLab.sku != '{}') {
            $("input[type=radio][value=yes]").next().click();

            var sku = JSON.parse(filterLab.sku);
            var skulen = 1;
            $.each(sku, function (index, obj) {
                if(skulen == 1) {
                    $('[name="sku_key1"]').val(index);
                    $('[name="sku_val1"]').val(obj.join(','));
                }
                else {
                    var html = '';
                    html += '<div class="group">'
                    html += '<div class="layui-form-item fl">'
                    html += '<label class="layui-form-label">商品属性名</label>'
                    html += '<div class="layui-input-inline">'
                    html += '<input type="text" name="sku_key'+skulen+'" value="'+index+'" autocomplete="off" placeholder="例如：颜色、尺码等" onblur="OnPropChanged(this)" class="layui-input skuKey">'
                    html += '</div>'
                    html += '<label class="layui-form-label">商品属性值</label>'
                    html += '<div class="layui-input-inline">'
                    html += '<input type="text" name="sku_val'+skulen+'" value="'+obj+'" autocomplete="off" placeholder="例如：白色(多值以逗号隔开)" onblur="OnPropChanged(this)" class="layui-input skuVal">'
                    html += '</div>'
                    html += '</div>'
                    html += '<button type="button" class="layui-btn delete fr">删除</button>'
                    html += '</div>'
                    $('.allGroup').append(html);
                }

                skulen++;
                form.render()  //刷新表单元素
            });
        }
        else {
            $("input[type=radio][value=no]").next().click();
        }

        $("[name='is_publish']").val(filterLab.is_publish);  //商品状态
        ispublish = filterLab.is_publish;

        form.render()  //刷新表单元素
    }

    //判断是否显示添加子类按钮
    if($('.skuKey').val() && $('.skuVal').val() && (!par.params.isSub)) {
        $('.addSubClass').removeClass('hide')
    }
    else {
        $('.addSubClass').addClass('hide');
    }

    //添加子类
    $('body').on('click', '.addSubClass', function () {
        var subClass = new Object();
        var sku = {};
        if(filterLab && filterLab.belong_id)  subClass.belong_id = filterLab.belong_id;
        subClass.totalNum = $('[name="totalNum"]').val();
        subClass.zkPrice = $('[name="zkPrice"]').val();
        subClass.is_publish = ispublish;

        for(var i=0; i<$('.group').length; i++) {
            var skuKey = $('.group').eq(i).find('.skuKey').val();
            var skuVal = $('.group').eq(i).find('.skuVal').val().split(",");

            sku[skuKey] = skuVal;
        }
        subClass.sku = JSON.stringify(sku);

        sessionStorage.setItem('addSub', JSON.stringify(subClass));
        layer.open({
            type: 2,
            title: '添加子类',
            shadeClose: false,
            shade: 0.4,
            area: ['700px', '70%'],
            content: 'addSub.html'
        });
    })

});


// 监听佣金比率
$('#tkRate').bind('input propertychange', function () {
    if($(this).val() > 100) {
        $(this).val(100)
    }
})

// 监听输入框(字符替换)
function OnPropChanged(e) {
    var val = e.value.replace(/，/g,',');
    e.value = val;

    if($('.skuKey').val() && $('.skuVal').val() && (!par.params.isSub)) {
        $('.addSubClass').removeClass('hide')
    }
    else {
        $('.addSubClass').addClass('hide');
    }
}

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


// 上传图片
$(function () {

    var len;    // 当前轮播图个数
    var len2;   // 当前详情图个数
    if(!!window.ActiveXObject || "ActiveXObject" in window) {
        layer.msg("您使用的浏览器暂不支持上传图片！");
    }

    // 轮播图
    $(".swiper_img").on('change', '.addImg .uploadfile', function() {
        len = $('.swiper_img').find('.label').length;
        var file = this.files[0];
        console.log(file)
        if(file) {
            console.log($(this).next().attr('name'))
            $(this).attr('name',$(this).next().attr('name'));  //给file设置name属性
            $(this).next().remove();  //移除隐藏域（text）
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
            console.log($(this).parents('.label').index())
            if(len <= 5 && $(this).parents('.label').index() >= (len-1)) {
                $(this).attr('name','img'+len);
                $(this).parents('.label').append('<p class="delete_img">删除</p>');
                form.render()

                var html = "";
                html += '<div class="label">'
                html += '<label>'
                html += '<div class="addImg">'
                html += '<img src="img/add_img.png"/>'
                html += '<input type="file" class="uploadfile" accept="image/*" />'
                html += '</div>'
                html += '</label>'
                html += '</div>'
                $(this).parents('.swiper_img').append(html);
            }
            len = $('.swiper_img').find('.label').length;
            if(len >= 6) {
                $('.swiper_img').find('.label').eq(5).hide();
            }
        } else {
            console.log(len)
            $(this).removeAttr('name');  //移除file的name属性
            $(this).prev("img").attr("src", "img/add_img.png");
            $(this).parents('.label').find('.delete_img').click();  // 未选择图片模拟点击删除
        }

    });
    //轮播图删除
    $('body').on("click", ".delete_img", function() {
        $(this).parents('.label').remove();  //移除图片
        len = $('.swiper_img').find('.label').length;
        console.log(len)
        if(len < 6) {
            $('.swiper_img').find('.label').eq(len-1).show();
        }

        $('.swiper_img .label').each(function (index) {  //删除时重新排序
            if($(this).find('label input[type=text]').length > 0) {   //判断是否为编辑时的渲染
                $(this).find('label input[type=text]').attr('name', 'img'+ (index+1));
            }
            else {
                $(this).find('label input[type=file]').attr('name', 'img'+ (index+1));
            }
        });
        $('.swiper_img .label').eq(len-1).find('input').removeAttr('name');
    });


    // 详情图
    $(".detail_img").on('change', '.addImg2 .uploadfile2', function() {
        len2 = $('.detail_img').find('.label2').length;
        var file = this.files[0];
        console.log(file)
        if(file) {
            console.log($(this).next().attr('name'))
            $(this).attr('name',$(this).next().attr('name'));  //给file设置name属性
            $(this).next().remove();  //移除隐藏域（text）
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
            console.log($(this).parents('.label2').index())
            if(len2 <= 9 && $(this).parents('.label2').index() >= (len2-1)) {
                $(this).attr('name','d_img'+len2);
                $(this).parents('.label2').append('<p class="delete_img2">删除</p>');
                form.render()

                var html = "";
                html += '<div class="label2">'
                html += '<label>'
                html += '<div class="addImg2">'
                html += '<img src="img/add_img.png"/>'
                html += '<input type="file" class="uploadfile2" accept="image/*" />'
                html += '</div>'
                html += '</label>'
                html += '</div>'
                $(this).parents('.detail_img').append(html);
            }
            len2 = $('.detail_img').find('.label2').length;
            if(len2 >= 10) {
                $('.detail_img').find('.label2').eq(9).hide();
            }
        } else {
            console.log(len2)
            $(this).removeAttr('name');  //移除file的name属性
            $(this).prev("img").attr("src", "img/add_img.png");
            $(this).parents('.label2').find('.delete_img2').click();  // 未选择图片模拟点击删除
        }

    });
    //详情图删除
    $('body').on("click", ".delete_img2", function() {
        $(this).parents('.label2').remove();  //移除图片
        len2 = $('.detail_img').find('.label2').length;
        console.log(len2)
        if(len2 < 10) {
            $('.detail_img').find('.label2').eq(len2-1).show();
        }

        $('.detail_img .label2').each(function (index) {  //删除时重新排序
            if($(this).find('label input[type=text]').length > 0) {   //判断是否为编辑时的渲染
                $(this).find('label input[type=text]').attr('name', 'd_img'+ (index+1));
            }
            else {
                $(this).find('label input[type=file]').attr('name', 'd_img'+ (index+1));
            }
        });
        $('.detail_img .label2').eq(len2-1).find('input').removeAttr('name');
    });

})


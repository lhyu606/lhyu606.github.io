var par = parseURL(window.location.href);
var $,layer,table,laydate,form,$form;
var token = sessionStorage.getItem('adminToken');
var noticeInfo = JSON.parse(sessionStorage.getItem('noticeInfo'));

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');

    $('#myupload').attr('action', server_url + '/h5_url/save');

    dataRender();  //渲染数据

    // 上传单张图片
    $(".addPic").on('change', '.uploadImg', function() {
        var file = this.files[0];
        if(file) {
            $('.uploadImg').attr('name','pic');  //给file设置name属性
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
            $('.uploadImg').removeAttr('name');  //移除file的name属性
            $(this).prev("img").attr("src", "img/add_img.png");
        }
    });

});


// 渲染小二数据
function dataRender() {
    if (par.params.id) {
        $("[name='url']").val(noticeInfo.url);
        $("[name='comment']").val(noticeInfo.comment);
        if(noticeInfo.pic ) {
            $("[name='pic']").val(noticeInfo.pic);
            $(".addPic").find('img').attr('src',server_url + noticeInfo.pic);
        } else {
            $(".addPic").find('img').attr('src', 'img/add_img.png');
        }
        $("[name='type']").val(noticeInfo.type);
        layui.form.render();  //刷新表单元素（动态插入的数据）
    }

    //日期选择（开始时间）
    laydate.render({
        elem: '#startTime',
        type: 'datetime'
    });
    //日期选择（结束时间）
    laydate.render({
        elem: '#endTime',
        type: 'datetime'
    });
}

// 公共遮罩层（加载）
function loadingTip() {
    var index = parent.layer.load(1, {
        shade: [0.5,'#000'] //0.5透明度的黑色背景
    });
    return index;
}

/**
 * 创建或者编辑号外板块内容
 * @param  token
 * @param  status
 * @param  sub_title
 * @param  type
 * @param  title
 * @param  pic
 * @param  des
 * @param  content  内容(参数则传  1subTitle  2img  3txt  4img  5txt  6subTitle 7auctionId...)   title 文章标题  img图片  txt文字内容  subTitle subTitle小标题
 * @param  start_time
 * @param  end_time
 * @param  comment
 * @param  weight
 * @param  visit_num
 * url/waiter/save
 */
function saveNotice() {
    $("[name='token']").val(token);
    if (par.params.id) $("[name='id']").val(par.params.id);
    $("#myupload").ajaxSubmit({
        beforeSend: function () {  //请求成功前
            loadingTip();
        },
        complete: function () {  //请求成功后
            parent.layer.close(loadingTip());
        },
        success: function(data) {
            if(data.status == 200) {
                parent.location.reload();
                layer.msg("编辑或录入成功！");
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
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}


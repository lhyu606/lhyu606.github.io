var par = parseURL(window.location.href);
var $,layer,table,laydate,form,$form;
var token = sessionStorage.getItem('adminToken');
var waiterInfo = JSON.parse(sessionStorage.getItem('waiterInfo'));

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');

    $('#myupload').attr('action', server_url + '/waiter/save');

    rendWaiterData();  //渲染商品数据

    // 上传图片
    $(".wImg").on('change', '.w_Img', function() {
        var file = this.files[0];
        console.log(file)
        if(file) {
            $('.w_Img').attr('name','pic');  //给file设置name属性
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
            $('.w_Img').removeAttr('name');  //移除file的name属性
            $(this).prev("img").attr("src", "img/add_img.png");
        }
    });

});


// 渲染小二数据
function rendWaiterData() {
    // var getInfoArr = ['type','pic','title','content','auctionId','url','status','start_time',
    //     'end_time','weight','int_type','share_num'];
    // $.each(getInfoArr, function(k,val) {
    //     if(val == 'start_time' || val == 'end_time') {
    //         $("[name= " + '' + val + '' + "]").val(simpleDateFormat(waiterInfo[val]));
    //     } else {
    //         $("[name= " + '' + val + '' + "]").val(waiterInfo[val]);
    //     }
    // });
    // $('.wImg').find('img').attr('src', img_url + waiterInfo.pic);  //商品主图

    //判断是新增还是编辑（编辑时赋值）
    if (par.params.wid) {
        $("[name='type']").val(waiterInfo.type);
        $("[name='title']").val(waiterInfo.title);
        $("[name='pic']").val(waiterInfo.pic);
        $("[name='s_pic']").val(waiterInfo.s_pic);
        $(".wImg").find('img').attr('src',server_url + waiterInfo.pic);
        $(".sImg").find('img').attr('src',server_url + waiterInfo.s_pic);
        $("[name='content']").val(waiterInfo.content);
        $("[name='auctionId']").val(waiterInfo.auctionId);
        $("[name='url']").val(waiterInfo.url);
        $("[name='status']").val(waiterInfo.status);
        $("[name='start_time']").val(simpleDateFormat(waiterInfo.start_time));
        $("[name='end_time']").val(simpleDateFormat(waiterInfo.end_time));
        $("[name='weight']").val(waiterInfo.weight);
        $("[name='int_type']").val(waiterInfo.int_type);
        $("[name='share_num']").val(waiterInfo.share_num);
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
 * 创建或者编辑小二板块内容
 * @param  id
 * @param  token
 * @param  type
 * @param  pic
 * @param  content
 * @param  auctionId
 * @param  status
 * @param  start_time
 * @param  end_time
 * @param  weight
 * @param  share_num
 * @param  url
 * url/waiter/save
 */
function saveWaiter() {
    $("[name='token']").val(token);
    if (par.params.wid) $("[name='id']").val(par.params.wid);
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


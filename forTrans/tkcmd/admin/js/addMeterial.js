/**
 * Created by yjp on 2018/5/3.
 */
//初始数据
var par = parseURL(window.location.href);
var actionUrl = server_url + "/timeline/create";
var filterLab = JSON.parse(sessionStorage.getItem('filter'));
var token = sessionStorage.getItem('adminToken');
var $,layer,table,laydate,form,$form;

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');

    //判断是否是编辑（编辑时赋值）
    if(par.params.uid) {
        console.log(filterLab)
        $("[name='type']").val(filterLab.tp);
        $("[name='content']").val(filterLab.content);
        $("[name='comment']").val(filterLab.comment);

        //图片、视频、文章链接数据渲染
        if(filterLab.img) {
            $("input[type=radio][value=video]").attr('disabled','disabled');  //不可点击
            $("input[type=radio][value=article]").attr('disabled','disabled');  //不可点击

            var imgList = JSON.parse(filterLab.img);
            $("input[type=radio][value=pic]").next().click();
            // $("input[type=radio][value=pic]").next().find("i").click();
            $('.switchType').empty();
            console.log(imgList)
            $.each(imgList, function (index, obj) {
                var html = '';
                html += '<div class="layui-input-block label">'
                html += '<label>'
                html += '<div class="addImg">'
                html += '<img src="'+ server_url+obj.img +'"/>'
                html += '<input type="file" class="uploadfile" accept="image/*" />'
                html += '<input type="text" name="img'+ (index+1) +'"  hidden/>'
                html += '</div>'
                html += '</label>'
                html += '<p class="delete_img">删除</p>'
                html += '<div class="layui-input-inline margin11">'
                html += '<input type="text" name="img'+ (index+1) +'_gid" autocomplete="off" class="layui-input" placeholder="请输入商品ID">'
                html += '</div>'
                html += '<input class="margin_11" type="radio" lay-filter="qrOrImg" name="img'+ (index+1) +'_qr" value="1" title="二维码">'
                html += '<input class="margin_11" type="radio" lay-filter="qrOrImg" name="img'+ (index+1) +'_qr" value="0" title="仅图片" checked>'
                html += '</div>'
                $('.switchType').append(html);
                $("input[type=radio][value="+ obj.qr +"][name=img"+ (index+1) +"_qr]").next().click();
                layui.form.render()
                $("input[type=radio][value="+ obj.qr +"][name=img"+ (index+1) +"_qr]").next().click();
                $('.margin_11').next('div').css('margin-top','16px');

                //渲染图片数据
                $("[name='img"+ (index+1) +"']").val(obj.img);  // 图片
                $("[name='img"+ (index+1) +"_gid']").val(obj.gid);  // ID
            });
            var html_last = '';
            html_last += '<div class="layui-input-block label">'
            html_last += '<label>'
            html_last += '<div class="addImg">'
            html_last += '<img src="img/add_img.png">'
            html_last += '<input type="file" class="uploadfile" style="display: none;" accept="image/*">'
            html_last += '</div>'
            html_last += '</label>'
            html_last += '</div>'
            $('.switchType').append(html_last);
        }
        else if(filterLab.mp4) {
            $("input[type=radio][value=pic]").attr('disabled','disabled');  //不可点击
            $("input[type=radio][value=article]").attr('disabled','disabled');  //不可点击

            $("input[type=radio][value=video]").next().click();
            var html = '';
            html += '<div class="layui-input-block">'
            html += '<input type="file" id="mp4" name="mp4" style="display: none" />'
            html += '<div class="uploadVideo">'
            html += '<p id="progressNumber"></p>'
            html += '</div>'
            html += '<div class="row">'
            html += '<div id="video" class="w50" style="display: none"></div>'
            html += '<div id="imgSmallView" class="w50"></div>'
            html += '</div>'
            html += '<span class="layui-btn" id="uploadBtn" style="margin-top: 14px;">上传视频</span>'
            html += '<span class="layui-btn delete_video" style="margin-top: 14px;display: none">删除</span>'
            html += '</div>'
            $('.switchType').empty().append(html);
            $("[name='mp4']").val(server_url+filterLab.mp4); //视频渲染 （未完成）

        }
        else if(filterLab.articleurl) {
            $("input[type=radio][value=pic]").attr('disabled','disabled');  //不可点击
            $("input[type=radio][value=video]").attr('disabled','disabled');  //不可点击

            $("input[type=radio][value=article]").next().click();
            var html = '';
            html += '<div class="layui-input-block">'
            html += '<input type="text" name="article_url" autocomplete="off" placeholder="请输入文章链接" class="layui-input click_url">'
            html += '</div>';
            $('.switchType').empty().append(html);
            $("[name='article_url']").val(filterLab.articleurl);
        }

        $("[name='start_time']").val(filterLab.stime);
        $("[name='end_time']").val(filterLab.etime);
        $("[name='advise']").val(filterLab.advise);
        $("[name='status']").val(filterLab.sts);

        layui.form.render()  // 刷新表单元素
    }

    if(par.params.tp) {    // 新增条目时如果有选择类型，默认传过去
        $("[name='type']").val(par.params.tp);
        layui.form.render()  // 刷新表单元素
    }

    $('#myupload').attr('action',actionUrl);  //设置form的action地址


    //日期选择（开始时间）
    laydate.render({
        elem: '#startTime'
        ,type: 'datetime'
    })
    //日期选择（结束时间）
    laydate.render({
        elem: '#endTime'
        ,type: 'datetime'
    })
    // 监听radio
    form.on('radio(scType)', function(data) {
        console.log(data.value)
        var html = '';
        if(data.value == 'pic') {
            html += '<div class="layui-input-block label">'
            html += '<label>'
            html += '<div class="addImg">'
            html += '<img src="img/add_img.png"/>'
            html += '<input type="file" class="uploadfile" style="display: none;" accept="image/*"/>'
            html += '</div>'
            html += '</label>'
            html += '</div>';
            $('.switchType').empty().append(html);
        }
        else if(data.value == 'video') {
            html += '<div class="layui-input-block">'
            html += '<input type="file" id="mp4" name="mp4" style="display: none" />'
            html += '<div class="uploadVideo">'
            html += '<p id="progressNumber"></p>'
            html += '</div>'
            html += '<div class="row">'
            html += '<div id="video" class="w50" style="display: none"></div>'
            html += '<div id="imgSmallView" class="w50"></div>'
            html += '</div>'
            html += '<span class="layui-btn" id="uploadBtn" style="margin-top: 14px;">上传视频</span>'
            html += '<span class="layui-btn delete_video" style="margin-top: 14px;display: none">删除</span>'
            html += '</div>'
            $('.switchType').empty().append(html);
        }
        else if(data.value == 'article') {
            html += '<div class="layui-input-block">'
            html += '<input type="text" name="article_url" autocomplete="off" placeholder="请输入文章链接" class="layui-input click_url">'
            html += '</div>';
            $('.switchType').empty().append(html);
        }
    })
    
});


// 公共遮罩层（加载）
function loadingTip() {
    var index = parent.layer.load(1, {
        shade: [0.5,'#000'] //0.5透明度的黑色背景
    });
    return index;
}


/**
 * 创建转发素材
 * @param  token
 * @param  type
 * @param  advise
 * @param  end_time
 * @param  img1 img2 img3 img4 img5 ...
 * @param  img1_qr  img2_qr    是否带二维码    传 1 | 0
 * @param  img1_gid img2_gid   是否是商品图片是的  传对应的商品id  不是话则不传
 * @param  mp4
 * @param  content
 * @param  id    (有传id则为更新)
 * url  /timeline/create
 */
function create() {
    $("[name='sign']").val(sign);
    $("[name='token']").val(token);
    if(par.params.uid) {
        var html = '<input type="text" name="id" hidden>';
        $('#myupload').find('input[name="id"]').remove();
        $('#myupload').append(html);
        $("[name='id']").val(par.params.uid);
    }

    var type = $("[name='type']").val();
    var start_time = $("[name='start_time']").val();
    var end_time = $("[name='end_time']").val();
    var adviseTime = $("[name='advise']").val();

    if(type==undefined || type=='') {
        layer.msg("请选择素材类型！")
        return false;
    }
    if(!start_time) {
        layer.msg("请选择开始时间！")
        return false;
    }
    if(!end_time) {
        layer.msg("请选择结束时间！")
        return false;
    }
    if(!adviseTime) {
        layer.msg("请输入建议时间！")
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
                layer.msg(data.payload);
                setTimeout(function () {
                    parent.layer.closeAll();  // 关闭当前弹出层
                    window.parent.firstInfo(true);  //新增或编辑成功刷新列表页
                }, 2000);
            } else {
                layer.msg(data.err);
            }
        },
        error: function () {
            var msg = '网络错误，请稍后重试！';
            layer.alert(msg, {icon: 7});
        }
    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}


// 上传图片
$(function () {

    var len;  // 当前图片个数
    if(!!window.ActiveXObject || "ActiveXObject" in window) {
        layer.msg("您使用的浏览器暂不支持上传图片！");
    }

    $(".switchType").on('change', '.addImg .uploadfile', function() {
        len = $('.switchType').find('.label').length;
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
            if(len <= 9 && $(this).parents('.label').index() >= (len-1)) {
                var h = '';
                h += '<div class="layui-input-inline margin11">'
                h += '<input type="text" name="img'+ len +'_gid" autocomplete="off" class="layui-input" placeholder="请输入商品ID">'
                h += '</div>'
                h += '<input class="margin_11" type="radio" lay-filter="qrOrImg" name="img'+ len +'_qr" value="1" title="二维码">'
                h += '<input class="margin_11" type="radio" lay-filter="qrOrImg" name="img'+ len +'_qr" value="0" title="仅图片" checked>'
                $(this).attr('name','img'+len);
                $(this).parents('.label').append('<p class="delete_img">删除</p>');
                $(this).parents('.label').append(h);
                layui.form.render()
                $('.margin_11').next('div').css('margin-top','16px');

                var html = "";
                html += '<div class="layui-input-block label">'
                html += '<label>'
                html += '<div class="addImg">'
                html += '<img src="img/add_img.png"/>'
                html += '<input type="file" class="uploadfile" accept="image/*" />'
                html += '</div>'
                html += '</label>'
                html += '</div>'
                $(this).parents('.switchType').append(html);
            }
            len = $('.switchType').find('.label').length;
            if(len >= 10) {
                $('.switchType').find('.label').eq(9).hide();
            }
        } else {
            console.log(len)
            $(this).removeAttr('name');  //移除file的name属性
            $(this).prev("img").attr("src", "img/add_img.png");
            $(this).parents('.label').find('.delete_img').click();  // 未选择图片模拟点击删除
        }

    });

    //点击删除按钮
    $('body').on("click", ".delete_img", function() {
        $(this).parents('.label').remove();  //移除图片
        len = $('.switchType').find('.label').length;
        console.log(len)
        if(len < 10) {
            $('.switchType').find('.label').eq(len-1).show();
        }

        $('.switchType .label').each(function (index) {  //删除时重新排序
            if($(this).find('label input[type=text]').length > 0) {   //判断是否为编辑时的渲染
                $(this).find('label input[type=text]').attr('name', 'img'+ (index+1));
            }
            else {
                $(this).find('label input[type=file]').attr('name', 'img'+ (index+1));
            }

            $(this).find('.margin11 input[type=text]').attr('name', 'img'+ (index+1) +'_gid');  //更新ID
            $(this).find('input[type=radio]').attr('name', 'img'+ (index+1) +'_qr');   //更新对应图片是否显示二维码
        });
        $('.switchType .label').eq(len-1).find('input').removeAttr('name');
    });
})

    
// 上传视频
$(function () {

    $(document).on('click', '#uploadBtn',function () {
        $('#mp4').click()
    });
    $('.switchType').on('change', '#mp4', function() {
        var files = this.files;
        var windowURL = window.URL || window.webkitURL;
        var video = $('#video').find('video');
        var videoURL = null;
        var formData = new FormData();
        formData.append("mp4", files[0]);
        var xhr = new XMLHttpRequest();

        console.log(files)
        if(files && files[0]) {
            if(files[0].size > 30*1024*1024) {
                layer.msg("文件大小不能超过30M，请重新选择！")
                $('#mp4').val('');
                return false;
            }
            videoURL = windowURL.createObjectURL(files[0]);
            $('#video').html('<video id="video1" src="'+ videoURL +'" controls="controls"></video>');
            var video1 = document.getElementById('video1');
            video1.addEventListener('loadeddata', createIMG);

            xhr.upload.addEventListener("progress", uploadProgress, false);  //视频上传进度
            xhr.open("post", actionUrl);  //视频上传地址
            xhr.send(formData);  //视频上传数据
        }
    }).trigger('change');

    var createIMG = function() {  // 获取视频第一帧图片
        var scale = 0.25;
        var video = $('#video').find('video')[0];
        var canvas = document.createElement("canvas");
        var canvasFill = canvas.getContext('2d');
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        canvasFill.drawImage(video, 0, 0, canvas.width, canvas.height);
        var src = canvas.toDataURL("image/jpeg");
        $('#imgSmallView').html('<img src="'+ src +'" alt="预览图" />');
    }

    //进度显示
    function uploadProgress(evt) {
        if(evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            var progress = percentComplete.toString() + '%';
            $('#progressNumber').css('width',progress);
            $('#progressNumber').html(progress);
            if(percentComplete >= 100) {
                $('.delete_video').show();
                layer.msg('视频上传成功！')
            } else {
                $('.delete_video').hide();
            }
        } else {
            $('.delete_video').hide();
            layer.msg('视频上传失败！')
        }
    }

    //点击删除按钮
    $('body').on("click", ".delete_video", function() {
        if((navigator.appVersion.indexOf("MSIE") != -1)) {
            var file2 = $('#mp4').cloneNode(false);
            file2.onchange = $('#mp4').onchange;
            $('#mp4').parentNode.replaceChild(file2, $('#mp4'));
        } else {
            $('#mp4').val("");  // 清除input file里面的值
        }
        $('#video').find('video').remove();
        $('#imgSmallView').find('img').remove();
        $('.delete_video').hide();  //移除删除按钮
    });
})


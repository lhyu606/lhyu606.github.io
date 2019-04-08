var par = parseURL(window.location.href);
var $,layer,table,laydate,form,$form;
var token = sessionStorage.getItem('adminToken');
var newspaperInfo = JSON.parse(sessionStorage.getItem('newspaperInfo'));
var idxNum = 0;

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');

    $('#myupload').attr('action', server_url + '/newspaper/save');

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

    // 上传图片
    $("body").on('change', '.addImg .uploadfile', function() {
        var file = this.files[0];
        if(file) {
            $(this).attr('name', $(this).parents('.group').attr('idxnum')+'img');  //给file设置name属性
            $(this).next().remove();  //移除隐藏域
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
            $(this).removeAttr('name');  //移除file的name属性
            $(this).prev("img").attr("src", "img/add_img.png");
        }
    });

    // 添加新的组
    $('.addGroup').click(function () {
        idxNum++;
        var html = '';
        html += '<div class="group" idxnum="'+ idxNum +'">'
        html += '<div class="grp fl">'
        html += '<div class="layui-form-item">'
        html += '<label class="layui-form-label">选择内容</label>'
        html += '<div class="layui-input-block">'
        html += '<input type="radio" lay-filter="scType'+ idxNum +'" name="type'+ idxNum +'" value="subTitle'+ idxNum +'" title="小标题" checked>'
        html += '<input type="radio" lay-filter="scType'+ idxNum +'" name="type'+ idxNum +'" value="txt'+ idxNum +'" title="文字">'
        html += '<input type="radio" lay-filter="scType'+ idxNum +'" name="type'+ idxNum +'" value="img'+ idxNum +'" title="图片">'
        html += '<input type="radio" lay-filter="scType'+ idxNum +'" name="type'+ idxNum +'" value="video'+ idxNum +'" title="视频链接">'
        html += '<input type="radio" lay-filter="scType'+ idxNum +'" name="type'+ idxNum +'" value="auctionId'+ idxNum +'" title="商品">'
        // html += '<input type="radio" lay-filter="scType'+ idxNum +'" name="type'+ idxNum +'" value="clkUrl'+ idxNum +'" title="带跳转链接的内容">'
        html += '</div>'
        html += '</div>'
        html += '<div class="layui-form-item switchType'+idxNum+'">'
        html += '<div class="layui-input-block">'
        html += '<input type="text" class="layui-input" name="'+ idxNum +'subTitle" autocomplete="off" placeholder="请输入小标题">'
        html += '</div>'
        html += '</div>'
        html += '</div>'
        html += '<button type="button" class="layui-btn delete">删除</button>'
        html += '</div>'
        $('.allGroup').append(html);
        layui.form.render()
    });

    // 删除组
    $('body').on('click', '.delete', function () {
        $(this).parent('.group').remove();
    })

    // 监听radio
    form.on('radio', function(e) {
        var node = e.elem.name;
        // console.log(node)
        var num = node.substring(4);  //获取序号

        form.on('radio(scType'+num+')', function(data) {
            // console.log(data.value)
            var html = '';
            if(data.value =='img'+num) {
                html += '<div class="layui-input-block label fl">'
                html += '<label>'
                html += '<div class="addImg">'
                html += '<img src="img/add_img.png"/>'
                html += '<input type="file" class="uploadfile" style="display: none;" accept="image/*"/>'
                html += '</div>'
                html += '</label>'
                html += '</div>'
                $('.switchType'+ num +'').empty().append(html);
            }
            else if(data.value =='subTitle'+num) {
                html += '<div class="layui-input-block">'
                html += '<input type="text" class="layui-input" name="'+ num +'subTitle" autocomplete="off" placeholder="请输入小标题">'
                html += '</div>'
                $('.switchType'+ num +'').empty().append(html);
            }
            else if(data.value =='txt'+num) {
                html += '<div class="layui-input-block">'
                html += '<textarea type="text" class="layui-textarea" name="'+ num +'txt" placeholder="请输入文字"></textarea>'
                html += '</div>'
                $('.switchType'+ num +'').empty().append(html);
            }
            else if(data.value =='video'+num) {
                html += '<div class="layui-input-block">'
                html += '<input type="text" class="layui-input" name="'+ num +'video" autocomplete="off" placeholder="请输入视频链接">'
                html += '</div>'
                $('.switchType'+ num +'').empty().append(html);
            }
            else if(data.value =='auctionId'+num) {
                html += '<div class="layui-input-block">'
                html += '<input type="text" class="layui-input" name="'+ num +'auctionId" autocomplete="off" placeholder="请输入商品id">'
                html += '</div>'
                $('.switchType'+ num +'').empty().append(html);
                form.render();
            }
            // else if(data.value =='clkUrl'+num) {
            //     html += '<div class="layui-input-block">'
            //     html += '<input type="hidden" name="'+num+'obj"/>'
            //     html += '<input type="text" class="layui-input" id="'+ num +'clkUrl" num="'+num+'" onblur="blurInfo(event)" autocomplete="off" placeholder="请输入跳转链接">'
            //     html += '</div>'
            //     html += '<div class="layui-input-block" style="margin-top: 15px">'
            //     html += '<form class="layui-form" action="">'
            //     html += '<label class="layui-form-label" style="width: auto;padding-left: 0">选择类型</label>'
            //     html += '<div class="layui-input-inline">'
            //     html += '<select name="status" lay-filter="selType'+num+'">'
            //     html += '<option value="">请选择类型</option>'
            //     html += '<option value="小标题">小标题</option>'
            //     html += '<option value="文字">文字</option>'
            //     html += '<option value="图片">图片</option>'
            //     html += '</select>'
            //     html += '</div>'
            //     html += '</form>'
            //     html += '</div>'
            //     html += '<div class="layui-input-block slt'+num+'" style="margin-top: 15px;margin-left: 71px;">'
            //     html += '</div>'
            //     $('.switchType'+num+'').empty().append(html);
            //     form.render();
            //
            //     form.on('select(selType'+num+')', function(data) {
            //         var hh = '';
            //         if(data.value=='小标题') {
            //             hh += '<div class="layui-input-block">'
            //             hh += '<input type="text" class="layui-input" id="'+num+'subTitle" num="'+num+'" onblur="blurInfo(event)" autocomplete="off" placeholder="请输入小标题">'
            //             hh += '</div>'
            //         }
            //         else if(data.value=='文字') {
            //             hh += '<div class="layui-input-block">'
            //             hh += '<textarea type="text" class="layui-textarea" id="'+num+'txt" num="'+num+'" onblur="blurInfo(event)" placeholder="请输入文字"></textarea>'
            //             hh += '</div>'
            //         }
            //         else if(data.value=='图片') {
            //             hh += '<form class="layui-form" id="myupload'+num+'" action="'+top.server_url1+'/statistics/create" method="post" enctype="multipart/form-data">'
            //             hh += '<input type="text" id="tk" hidden/>'
            //             hh += '<div class="layui-input-block label fl">'
            //             hh += '<label>'
            //             hh += '<div class="addImg">'
            //             hh += '<img src="img/add_img.png"/>'
            //             hh += '<input type="file" class="uploadToSrv" id="'+num+'img" num="'+num+'" style="display: none;" accept="image/*"/>'
            //             hh += '</div>'
            //             hh += '</label>'
            //             hh += '</div>'
            //             hh += '</form>'
            //         }
            //         $('.slt'+num+'').empty().append(hh);
            //     });
            // }
        })

    })

});


// 渲染小二数据
function dataRender() {
    //判断是新增还是编辑（编辑时赋值）
    if (par.params.id) {
        $("[name='id']").val(par.params.id);
        $("[name='type']").val(newspaperInfo.type);
        $("[name='title']").val(newspaperInfo.title);
        $("[name='sub_title']").val(newspaperInfo.sub_title);
        $("[name='pic']").val(newspaperInfo.pic);
        $("[name='s_pic']").val(newspaperInfo.s_pic);
        $(".addPic").find('img').attr('src',server_url + newspaperInfo.pic);
        $(".addSpic").find('img').attr('src',server_url + newspaperInfo.s_pic);
        $("[name='status']").val(newspaperInfo.status);
        $("[name='start_time']").val(simpleDateFormat(newspaperInfo.start_time));
        $("[name='end_time']").val(simpleDateFormat(newspaperInfo.end_time));
        $("[name='weight']").val(newspaperInfo.weight);
        $("[name='visit_num']").val(newspaperInfo.visit_num);
        $("[name='des']").val(newspaperInfo.des);

        if(newspaperInfo.content) {
            var content = JSON.parse(newspaperInfo.content);
            idxNum = content.length;
            $.each(content, function (index, obj) {
                if(index==0) {
                    var html = '';
                    var hh = '';
                    if(obj.type == 'subTitle') {
                        $("input[type=radio][value=subTitle0][name=type0]").next().click();
                        html += '<div class="layui-input-block">'
                        html += '<input type="text" class="layui-input" name="0subTitle" autocomplete="off" placeholder="请输入小标题">'
                        html += '</div>'
                        $('.switchType0').empty().append(html);
                        $("[name='0subTitle']").val(obj.value)
                    }
                    else if(obj.type == 'img') {
                        $("input[type=radio][value=img0][name=type0]").next().click();
                        html += '<div class="layui-input-block label fl">'
                        html += '<label>'
                        html += '<div class="addImg">'
                        html += '<img src="'+ picUrlTrans(obj.value,top.img_url) +'"/>'
                        html += '<input type="file" class="uploadfile" style="display: none;" accept="image/*"/>'
                        html += '<input type="text" name="0img" hidden/>'
                        html += '</div>'
                        html += '</label>'
                        html += '</div>'
                        $('.switchType0').empty().append(html);
                        $('[name="0img"]').val(obj.value)
                    }
                    else if(obj.type == 'txt') {
                        $("input[type=radio][value=txt0][name=type0]").next().click();
                        html += '<div class="layui-input-block">'
                        html += '<textarea type="text" class="layui-textarea" name="0txt" placeholder="请输入文字"></textarea>'
                        html += '</div>'
                        $('.switchType0').empty().append(html);
                        $('[name="0txt"]').val(obj.value)
                    }
                    else if(obj.type == 'video') {
                        $("input[type=radio][value=video0][name=type0]").next().click();
                        html += '<div class="layui-input-block">'
                        html += '<input type="text" class="layui-input" name="0video" autocomplete="off" placeholder="请输入视频链接">'
                        html += '</div>'
                        $('.switchType0').empty().append(html);
                        $('[name="0video"]').val(obj.value)
                    } else if(obj.type == 'goods') {
                        $("input[type=radio][value=auctionId0][name=type0]").next().click();
                        html += '<div class="layui-input-block">'
                        html += '<input type="text" class="layui-input" name="0auctionId" autocomplete="off" placeholder="商品id">'
                        html += '</div>'
                        $('.switchType0').empty().append(html);
                        $('[name="0auctionId"]').val(obj.value.auctionId)
                    }
                    // else if(obj.obj) {
                    //     var sortObj = {};
                    //     $("input[type=radio][value=clkUrl0][name=type0]").next().click();
                    //     html += '<div class="layui-input-block">'
                    //     html += '<input type="hidden" name="0obj"/>'
                    //     html += '<input type="text" class="layui-input" id="0clkUrl" num="0" onblur="blurInfo(event)" autocomplete="off" placeholder="请输入跳转链接">'
                    //     html += '</div>'
                    //     html += '<div class="layui-input-block" style="margin-top: 15px">'
                    //     html += '<form class="layui-form" action="">'
                    //     html += '<label class="layui-form-label" style="width: auto;padding-left: 0">选择类型</label>'
                    //     html += '<div class="layui-input-inline">'
                    //     html += '<select name="status0" lay-filter="selType0">'
                    //     html += '<option value="">请选择类型</option>'
                    //     html += '<option value="小标题">小标题</option>'
                    //     html += '<option value="文字">文字</option>'
                    //     html += '<option value="图片">图片</option>'
                    //     html += '</select>'
                    //     html += '</div>'
                    //     html += '</form>'
                    //     html += '</div>'
                    //     html += '<div class="layui-input-block slt0" style="margin-top: 15px;margin-left: 71px;">'
                    //     html += '</div>'
                    //     $('.switchType0').empty().append(html);
                    //     $('#0clkUrl').val(obj.obj.clkUrl)
                    //     sortObj.clkUrl = obj.obj.clkUrl;
                    //
                    //     if(obj.obj.subTitle) {
                    //         $("[name='status0']").val("小标题");
                    //         hh += '<div class="layui-input-block">'
                    //         hh += '<input type="text" class="layui-input" id="0subTitle" num="0" onblur="blurInfo(event)" autocomplete="off" placeholder="请输入小标题">'
                    //         hh += '</div>'
                    //         $('.slt0').empty().append(hh);
                    //         $('#0subTitle').val(obj.obj.subTitle)
                    //         sortObj.subTitle = obj.obj.subTitle;
                    //     }
                    //     else if(obj.obj.txt) {
                    //         $("[name='status0']").val("文字");
                    //         hh += '<div class="layui-input-block">'
                    //         hh += '<textarea type="text" class="layui-textarea" id="0txt" num="0" onblur="blurInfo(event)" placeholder="请输入文字"></textarea>'
                    //         hh += '</div>'
                    //         $('.slt0').empty().append(hh);
                    //         $('#0txt').val(obj.obj.txt)
                    //         sortObj.txt = obj.obj.txt;
                    //     }
                    //     else if(obj.obj.img) {
                    //         $("[name='status0']").val("图片");
                    //         hh += '<form class="layui-form" id="myupload0" action="'+top.server_url1+'/statistics/create" method="post" enctype="multipart/form-data">'
                    //         hh += '<input type="text" id="tk" hidden/>'
                    //         hh += '<div class="layui-input-block label fl">'
                    //         hh += '<label>'
                    //         hh += '<div class="addImg">'
                    //         hh += '<img src="'+ obj.obj.img +'"/>'
                    //         hh += '<input type="file" class="uploadToSrv" id="0img" num="0" style="display: none;" accept="image/*"/>'
                    //         hh += '</div>'
                    //         hh += '</label>'
                    //         hh += '</div>'
                    //         hh += '</form>'
                    //         $('.slt0').empty().append(hh);
                    //         transImgUrl = obj.obj.img
                    //         sortObj.img = obj.obj.img
                    //     }
                    //     $("[name='0obj']").val(JSON.stringify(sortObj));
                    // }
                }
                else {
                    var html = '';
                    html += '<div class="group" idxnum="'+ index +'">'
                    html += '<div class="grp fl">'
                    html += '<div class="layui-form-item">'
                    html += '<label class="layui-form-label">选择内容</label>'
                    html += '<div class="layui-input-block">'
                    html += '<input type="radio" lay-filter="scType'+ index +'" name="type'+ index +'" value="subTitle'+ index +'" title="小标题" checked>'
                    html += '<input type="radio" lay-filter="scType'+ index +'" name="type'+ index +'" value="txt'+ index +'" title="文字">'
                    html += '<input type="radio" lay-filter="scType'+ index +'" name="type'+ index +'" value="img'+ index +'" title="图片">'
                    html += '<input type="radio" lay-filter="scType'+ index +'" name="type'+ index +'" value="video'+ index +'" title="视频链接">'
                    html += '<input type="radio" lay-filter="scType'+ index +'" name="type'+ index +'" value="auctionId'+ index +'" title="商品">'
                    // html += '<input type="radio" lay-filter="scType'+ index +'" name="type'+ index +'" value="clkUrl'+ index +'" title="带跳转链接的内容">'
                    html += '</div>'
                    html += '</div>'
                    html += '<div class="layui-form-item switchType'+index+'">'
                    html += '</div>'
                    html += '</div>'
                    html += '<button type="button" class="layui-btn delete">删除</button>'
                    html += '</div>'
                    $('.allGroup').append(html);

                    var h = '';
                    var hh = '';
                    if(obj.type == 'subTitle') {
                        $("input[type=radio][value=auctionId"+ index +"][name=type"+ index +"]").next().click();
                        // layui.form.render()
                        h += '<div class="layui-input-block">'
                        h += '<input type="text" class="layui-input" name="'+ index +'subTitle" autocomplete="off" placeholder="请输入小标题">'
                        h += '</div>'
                        $('.switchType'+ index +'').empty().append(h);
                        $("[name="+ index +"subTitle]").val(obj.value)
                    }
                    else if(obj.type == 'txt') {
                        $("input[type=radio][value=subTitle"+ index +"][name=type"+ index +"]").next().click();
                        // layui.form.render()
                        h += '<div class="layui-input-block">'
                        h += '<textarea type="text" class="layui-textarea" name="'+ index +'txt" placeholder="请输入文字"></textarea>'
                        h += '</div>'
                        $('.switchType'+ index +'').empty().append(h);
                        $("[name="+ index +"txt]").val(obj.value)
                    }
                    else if(obj.type == 'img') {
                        $("input[type=radio][value=txt"+ index +"][name=type"+ index +"]").next().click();
                        // layui.form.render()
                        h += '<div class="layui-input-block label fl">'
                        h += '<label>'
                        h += '<div class="addImg">'
                        h += '<img src="'+ picUrlTrans(obj.value,top.img_url) +'"/>'
                        h += '<input type="file" class="uploadfile" style="display: none;" accept="image/*"/>'
                        h += '<input type="text" name="'+ index +'img" hidden/>'
                        h += '</div>'
                        h += '</label>'
                        h += '</div>'
                        $('.switchType'+ index +'').empty().append(h);
                        $("[name="+ index +"img]").val(obj.value)
                    }
                    else if(obj.type == 'video') {
                        $("input[type=radio][value=img"+ index +"][name=type"+ index +"]").next().click();
                        // layui.form.render()
                        h += '<div class="layui-input-block">'
                        h += '<input type="text" class="layui-input" name="'+ index +'video" autocomplete="off" placeholder="请输入视频链接">'
                        h += '</div>'
                        $('.switchType'+ index +'').empty().append(h);
                        $("[name="+ index +"video]").val(obj.value)
                    } else if(obj.type == 'goods') {
                        $("input[type=radio][value=video"+ index +"][name=type"+ index +"]").next().click();
                        // layui.form.render()
                        h += '<div class="layui-input-block">'
                        h += '<input type="text" class="layui-input" name="'+ index +'auctionId" autocomplete="off" placeholder="请输入商品id">'
                        h += '</div>'
                        $('.switchType'+ index +'').empty().append(h);
                        $("[name="+ index +"auctionId]").val(obj.value.auctionId)
                    }
                    // else if(obj.obj) {
                    //     var sortObj = {};
                    //     $("input[type=radio][value=video"+ index +"][name=type"+ index +"]").next().click();
                    //     h += '<div class="layui-input-block">'
                    //     h += '<input type="hidden" name="'+index+'obj"/>'
                    //     h += '<input type="text" class="layui-input" id="'+index+'clkUrl" num="'+index+'" onblur="blurInfo(event)" autocomplete="off" placeholder="请输入跳转链接">'
                    //     h += '</div>'
                    //     h += '<div class="layui-input-block" style="margin-top: 15px">'
                    //     h += '<form class="layui-form" action="">'
                    //     h += '<label class="layui-form-label" style="width: auto;padding-left: 0">选择类型</label>'
                    //     h += '<div class="layui-input-inline">'
                    //     h += '<select name="status'+index+'" lay-filter="selType'+index+'">'
                    //     h += '<option value="">请选择类型</option>'
                    //     h += '<option value="小标题">小标题</option>'
                    //     h += '<option value="文字">文字</option>'
                    //     h += '<option value="图片">图片</option>'
                    //     h += '</select>'
                    //     h += '</div>'
                    //     h += '</form>'
                    //     h += '</div>'
                    //     h += '<div class="layui-input-block slt'+index+'" style="margin-top: 15px;margin-left: 71px;">'
                    //     h += '</div>'
                    //     $('.switchType'+index+'').empty().append(h);
                    //     $('#'+index+'clkUrl').val(obj.obj.clkUrl)
                    //     sortObj.clkUrl = obj.obj.clkUrl;
                    //
                    //     if(obj.obj.subTitle) {
                    //         $("[name='status"+index+"']").val("小标题");
                    //         hh += '<div class="layui-input-block">'
                    //         hh += '<input type="text" class="layui-input" id="'+index+'subTitle" num="'+index+'" onblur="blurInfo(event)" autocomplete="off" placeholder="请输入小标题">'
                    //         hh += '</div>'
                    //         $('.slt'+index+'').empty().append(hh);
                    //         $('#'+index+'subTitle').val(obj.obj.subTitle)
                    //         sortObj.subTitle = obj.obj.subTitle;
                    //     }
                    //     else if(obj.obj.txt) {
                    //         $("[name='status"+index+"']").val("文字");
                    //         hh += '<div class="layui-input-block">'
                    //         hh += '<textarea type="text" class="layui-textarea" id="'+index+'txt" num="'+index+'" onblur="blurInfo(event)" placeholder="请输入文字"></textarea>'
                    //         hh += '</div>'
                    //         $('.slt'+index+'').empty().append(hh);
                    //         $('#'+index+'txt').val(obj.obj.txt)
                    //         sortObj.txt = obj.obj.txt;
                    //     }
                    //     else if(obj.obj.img) {
                    //         $("[name='status"+index+"']").val("图片");
                    //         hh += '<form class="layui-form" id="myupload'+index+'" action="'+top.server_url1+'/statistics/create" method="post" enctype="multipart/form-data">'
                    //         hh += '<input type="text" id="tk" hidden/>'
                    //         hh += '<div class="layui-input-block label fl">'
                    //         hh += '<label>'
                    //         hh += '<div class="addImg">'
                    //         hh += '<img src="'+ obj.obj.img +'"/>'
                    //         hh += '<input type="file" class="uploadToSrv" id="'+index+'img" num="'+index+'" style="display: none;" accept="image/*"/>'
                    //         hh += '</div>'
                    //         hh += '</label>'
                    //         hh += '</div>'
                    //         hh += '</form>'
                    //         $('.slt'+index+'').empty().append(hh);
                    //         transImgUrl = obj.obj.img
                    //         sortObj.img = obj.obj.img
                    //     }
                    //     form.on('select(selType'+index+')', function(data) {
                    //         var tt = '';
                    //         if(data.value=='小标题') {
                    //             tt += '<div class="layui-input-block">'
                    //             tt += '<input type="text" class="layui-input" id="'+index+'subTitle" num="'+index+'" onblur="blurInfo(event)" autocomplete="off" placeholder="请输入小标题">'
                    //             tt += '</div>'
                    //         }
                    //         else if(data.value=='文字') {
                    //             tt += '<div class="layui-input-block">'
                    //             tt += '<textarea type="text" class="layui-textarea" id="'+index+'txt" num="'+index+'" onblur="blurInfo(event)" placeholder="请输入文字"></textarea>'
                    //             tt += '</div>'
                    //         }
                    //         else if(data.value=='图片') {
                    //             tt += '<form class="layui-form" id="myupload'+index+'" action="'+top.server_url1+'/statistics/create" method="post" enctype="multipart/form-data">'
                    //             tt += '<input type="text" id="tk" hidden/>'
                    //             tt += '<div class="layui-input-block label fl">'
                    //             tt += '<label>'
                    //             tt += '<div class="addImg">'
                    //             tt += '<img src="img/add_img.png"/>'
                    //             tt += '<input type="file" class="uploadToSrv" id="'+index+'img" num="'+index+'" style="display: none;" accept="image/*"/>'
                    //             tt += '</div>'
                    //             tt += '</label>'
                    //             tt += '</div>'
                    //             tt += '</form>'
                    //         }
                    //         $('.slt'+index+'').empty().append(tt);
                    //     });
                    //     $("[name='"+index+"obj']").val(JSON.stringify(sortObj));
                    // }

                }
            })
        }


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
function saveNewspaper() {
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


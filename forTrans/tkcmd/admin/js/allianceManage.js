/**
 * Created by yjp on 2018/7/2.
 */
//初始数据
var areaData = Area;
var $form;
var $,layer,table,laydate,form;
var size = 10;
var token = sessionStorage.getItem('adminToken');
window.pageIndex = 1;
var filterParam = {
    'token': token,
    'size': size,
    'page': window.pageIndex
};

function drawQRCodeToImg(imgForQRCode) {
    $('#qrcode>canvas:eq(0)').attr('id', 'qrcode_url');

    var qrcv = document.getElementById("qrcode_url");
    var qrdt = qrcv.toDataURL('image/png');
    qrcode_cpx.src = qrdt;

    var canvas = document.createElement('canvas');
    canvas.width = 375;
    canvas.height = (1522/1080)*375;   // 设计稿上图片高宽比
    myctx = canvas.getContext('2d');

    myctx.drawImage(imgForQRCode, 0, 0, 375, (1522/1080)*375);
    myctx.drawImage(qrcode_cpx, 233, 392, 115, 115);
    // myctx.drawImage(qrcode_cpx, 0, 0, 256, 256, 2200, 3700, 1080, 1080);
    qrcode_cpx.src = canvas.toDataURL('image/png');
}

/**
 * 根据图片生成画布
 */
function convertImageToCanvas(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas;
}


layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');

    loadProvince();
    firstInfo();  //访问加载页面

    if(!token)  top.location.href = "login.html";

    //条件筛选（状态）
    form.on('select(status)', function(data) {
        filterParam.status = data.value; //得到被选中的值
        firstInfo();
    });
    //搜索
    $('.search').click(function () {
        filterParam.account = $("#searchInfo").val();
        firstInfo();
    });

    //添加加盟商
    $('body').on('click', '.addServicer', function () {
        layer.open({
            type: 2,
            title: '添加加盟商',
            shadeClose: true,
            shade: 0.5,
            area: ['600px', '72%'],
            content: 'addOrEditAlliance.html'   //iframe的url
        });
    });
    //编辑加盟商信息
    $('body').on('click', '.lookEdit', function () {
        var detailInfo = {
            'account': $(this).attr('acc'),
            'company': $(this).attr('cpname'),
            'legal_person': $(this).attr('cpper'),
            'linkman': $(this).attr('linkman'),
            'linkman_tel': $(this).attr('linktel'),
            'province': $(this).attr('province'),
            'city': $(this).attr('city'),
            'lim_free_cnt': $(this).attr('lfc'),
            'done_free_cnt': $(this).attr('dfc'),
            'give_free_cnt': $(this).attr('gfc'),
            'wx_cnt': $(this).attr('wc'),
            'cashAmount': $(this).attr('cashamount'),
            'cashRatio': $(this).attr('cashratio'),
            'is_free': $(this).attr('isfree'),
            'status': $(this).attr('sts'),
            'pre_agent_lvl': $(this).attr('palvl'),
            'type': $(this).attr('tp'),
        }
        sessionStorage.setItem('detailInfo',JSON.stringify(detailInfo));
        layer.open({
            type: 2,
            title: '编辑信息',
            shadeClose: true,
            shade: 0.5,
            area: ['600px', '72%'],
            content: 'addOrEditAlliance.html?uid='+ $(this).attr('uid')   //iframe的url
        });
    });

    //上传二维码
    $('body').on('click', '.qrCodeImg', function () {
        var bind_qrCode = $(this).find('img').attr('src');
        var html = '<form style="margin: 20px" class="layui-form" action="'+server_url +"/agency_management/updateWorkAgent"+'" id="myupload" method="post" enctype="multipart/form-data" onsubmit="return qrCodeImg();">'
        html += '<input type="text" name="token" hidden>'
        html += '<input type="text" name="uid" hidden>'
        html += '<div class="layui-form-item">'
        html += '<label>'
        html += '<div class="addImg" style="margin: 0 auto;width: 120px;height: 120px;display: block;float: none">'
        html += '<img src="img/add_img.png" style="width: 120px;height: 120px"/>'
        html += '<input type="file" class="uploadfile" style="display: none;"/>'
        html += '</div>'
        html += '</label>'
        html += '</div>'
        html += '<div class="layui-form-item" style="text-align: center">'
        html += '<input type="submit" id="submit_btn" style="display: none"/>'
        html += '<label for="submit_btn"><button class="layui-btn" style="margin-top: 10px">点击上传</button></label>'
        html += '</div>'
        html += '</form>';

        qrcode_index = layer.open({
            type: 1,
            title: '二维码图片',
            shadeClose: false,
            shade: 0.5,
            area: ['320px', '30%'],
            content: html
        });

        $("[name='token']").val(filterParam.token);
        $("[name='uid']").val($(this).attr('uid'));

        //判断是新增还是编辑（编辑时赋值）
        if(bind_qrCode.indexOf('add_img') < 0) {
            $(".addImg").find('img').attr('src', bind_qrCode);
            $(".addImg").append('<input type="text" class="bind_qr_code" name="bind_qr_code" hidden/>');
            $(".bind_qr_code").val(bind_qrCode);
        }

        $(".addImg").on('change', '.uploadfile', function() {
            var file = this.files[0];
            // console.log(file)
            if(file) {
                $('.uploadfile').attr('name','bind_qr_code');  //给file设置name属性
                $('.addImg').find('.bind_qr_code').remove();  //移除隐藏域（text）
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
                $('.uploadfile').removeAttr('name');  //移除file的name属性
                $(this).prev("img").attr("src", "img/add_img.png");
            }
        });
    });
    //显示免单推广链接
    $('body').on('click', '.showFreeLink', function () {
        var param = {
            'token': token,
            'uid': $(this).attr('uid')
        }
        getRCByUid(param,$(this).attr('acc'));
    });

    // Excel 列表导出
    $('#table2excel').click(function () {
        excelList();
    });
});


//加载省数据
function loadProvince() {
    var proHtml = '';
    for (var i = 0; i < areaData.length; i++) {
        proHtml += '<option value="' + areaData[i].provinceName + '_' + areaData[i].mallCityList.length + '_' + i + '">' + areaData[i].provinceName + '</option>';
    }
    //初始化省数据
    $form.find('select[name=province]').append(proHtml);
    form.render();
    form.on('select(province)', function(data) {
        $form.find('select[name=area]').html('<option value="">请选择县/区</option>').parent().hide();
        var value = data.value;    //得到被选中的值
        var d = value.split('_');
        var code = d[0];
        var count = d[1];
        var index = d[2];

        //条件筛选（省份）
        filterParam.province = code;
        firstInfo();

        if (count > 0) {
            loadCity(areaData[index].mallCityList);
        } else {
            $form.find('select[name=city]').parent().hide();
        }
    });
}
//加载市数据
function loadCity(citys) {
    var cityHtml = '';
    for (var i = 0; i < citys.length; i++) {
        cityHtml += '<option value="' + citys[i].cityName + '_' + citys[i].mallAreaList.length + '_' + i + '">' + citys[i].cityName + '</option>';
    }
    $form.find('select[name=city]').html(cityHtml).parent().show();
    form.render();
    form.on('select(city)', function(data) {
        var value = data.value;    //得到被选中的值
        var d = value.split('_');
        var code = d[0];
        var count = d[1];

        //条件筛选（城市）
        filterParam.city = code;
        firstInfo();

        if(count <= 0)  $form.find('select[name=area]').parent().hide();
    });
}

// 存放Excel导出列表
function excelList() {
    var param = {
        'token': token,
        'page': 1,
        'size': window.allGoodAmount
    }
    if(filterParam.account)        param.account = filterParam.account;
    if(filterParam.province)   param.province = filterParam.province;
    if(filterParam.city)       param.city = filterParam.city;
    if(filterParam.status)     param.status = filterParam.status;
    $.ajax({
        url: server_url + "/agency_management/workAgentList",
        type: "post",
        dataType: "json",
        data: param,
        success: function(data) {
            if(data.status == 200) {
                $('#excelList tbody').empty();

                if(data.payload.data) {
                    var staffList = data.payload.data;
                    $.each(staffList, function (index,obj) {
                        var html = '';
                        html += '<tr uid="' + obj.uid + '">'
                        html += '<td>' + (obj.account ? obj.account : '--') + '</td>'

                        if(obj.pre_agent_lvl == 2)       html += '<td>分公司</td>'
                        else if(obj.pre_agent_lvl == 4)  html += '<td>服务商</td>'
                        else if(obj.pre_agent_lvl == 6)  html += '<td>总监</td>'

                        html += '<td>' + (obj.company ? obj.company : '--') + '</td>'
                        html += '<td>' + (obj.legal_person ? obj.legal_person : '--') + '</td>'
                        html += '<td>' + (obj.linkman ? obj.linkman : '--') + '</td>'
                        html += '<td>' + (obj.linkman_tel ? obj.linkman_tel : '--') + '</td>'
                        html += '<td>' + (obj.province ? obj.province : '--') + '</td>'
                        html += '<td>' + (obj.city ? obj.city : '--') + '</td>'
                        html += '<td>'+ obj.lim_free_cnt +'</td>'
                        html += '<td>'+ obj.done_free_cnt +'</td>'
                        html += '<td>'+ obj.give_free_cnt +'</td>'
                        html += '<td>'+ obj.wx_cnt +'</td>'
                        html += '<td>' + obj.limit_cash_amount + '</td>'
                        html += '<td>' + obj.limit_cash_ratio.toFixed(2) + '</td>'
                        html += '<td>'+ (obj.is_free==true ? '是' : '否') +'</td>'
                        if (obj.status === 0) {
                            html += '<td style="color: #666">待审核</td>'
                        }
                        if (obj.status === 1) {
                            html += '<td style="color: #1E9FFF">重新审核</td>'
                        }
                        if (obj.status === 2) {
                            html += '<td style="color: #FF5722">审核拒绝</td>'
                        }
                        if (obj.status === 3) {
                            html += '<td style="color: #009688">审核通过</td>'
                        }
                        html += '</tr>'
                        $('#excelList tbody').append(html);
                    });

                    // 导出 Excel 表
                    $("#excelList").table2excel({
                        exclude: ".noExl",
                        name: "Worksheet Name",
                        filename: "加盟商列表" ,//do not include extension
                        exclude_img: true,
                        exclude_links: true,
                        exclude_inputs: true
                    });
                }
            }
        }
    });
}

/**
 * 加盟商列表
 * param：token, size, page, status, province, city
 * url：/agency_management/workAgentList
 */
function workAgentList(param,isInside) {
    $.ajax({
        url: server_url + "/agency_management/workAgentList",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if(data.status == 200) {
                $('#staffInfo tbody').empty();
                if(data.payload.total)
                    window.allGoodAmount = data.payload.total;
                else
                    window.allGoodAmount = 0;

                if(!isInside)
                    setPage();

                if(data.payload.data) {
                    var staffList = data.payload.data;
                    $.each(staffList, function (index,obj) {

                        var html = '';
                        html += '<tr uid="' + obj.uid + '">'
                        html += '<td>'+ (obj.account ? obj.account : '--') +'</td>'

                        if(obj.pre_agent_lvl == 2)       html += '<td>分公司</td>'
                        else if(obj.pre_agent_lvl == 4)  html += '<td>服务商</td>'
                        else if(obj.pre_agent_lvl == 6)  html += '<td>总监</td>'

                        html += '<td>'+ (obj.legal_person ? obj.legal_person : '--') +'</td>'
                        html += '<td>'+ obj.lim_free_cnt +'</td>'
                        html += '<td>'+ obj.done_free_cnt +'</td>'
                        html += '<td>'+ obj.give_free_cnt +'</td>'
                        html += '<td>'+ obj.wx_cnt +'</td>'

                        html += '<td>'+ obj.limit_cash_amount +'</td>'
                        html += '<td>'+ obj.limit_cash_ratio.toFixed(2) +'</td>'
                        html += '<td>'+ (obj.is_free==true ? '是' : '否') +'</td>'

                        html += '<td>'
                        html += '<a  class="qrCodeImg" uid="'+ obj.uid +'" style="cursor: pointer">'
                        if(obj.bind_qr_code) {
                            if(obj.bind_qr_code.indexOf(server_url) > -1) {
                                html += '<img src="'+ obj.bind_qr_code +'"/>'
                            } else {
                                html += '<img src="'+ server_url+obj.bind_qr_code +'"/>'
                            }
                        } else {
                            html += '<img src="./img/add_img.png"/>'
                        }
                        html += '</a>'
                        html += '</td>'


                        if(obj.status === 0) {
                            html += '<td style="color: #666">待生效</td>'
                        }
                        if(obj.status === 1) {
                            html += '<td style="color: #1E9FFF">正式</td>'
                        }
                        if(obj.status === 2) {
                            html += '<td style="color: #009688">意向</td>'
                        }
                        if(obj.status === 3) {
                            html += '<td style="color: #FF5722">体验</td>'
                        }
                        html += '<td>'
                        html += '<a class="layui-btn layui-btn-xs lookEdit" '
                        html += 'uid="'+ obj.uid +'" '
                        html += 'acc="'+ obj.account +'" '
                        html += 'cpname="'+ (obj.company ? obj.company : '') +'" '
                        html += 'cpper="'+ (obj.legal_person ? obj.legal_person : '') +'" '
                        html += 'linkman="'+ (obj.linkman ? obj.linkman : '')  +'" '
                        html += 'linktel="'+ (obj.linkman_tel ? obj.linkman_tel : '') +'" '
                        html += 'province="'+ obj.province +'" '
                        html += 'city="'+ obj.city +'" '
                        html += 'lfc="'+ obj.lim_free_cnt +'" '
                        html += 'dfc="'+ obj.done_free_cnt +'" '
                        html += 'gfc="'+ obj.give_free_cnt +'" '
                        html += 'wc="'+ obj.wx_cnt +'" '
                        html += 'isfree="'+ obj.is_free +'" '
                        html += 'cashamount="'+ obj.limit_cash_amount +'" '
                        html += 'cashratio="'+ obj.limit_cash_ratio +'" '
                        html += 'sts="'+ obj.status +'" '
                        html += 'palvl="'+ obj.pre_agent_lvl +'" '
                        html += 'tp="'+ obj.type +'"'
                        html += '>编辑</a>'
                        // html += '<a class="layui-btn layui-btn-xs showFreeLink" acc="'+ obj.account +'" uid="'+ obj.uid +'">显示免单链接</a>'
                        html += '</td>'
                        html += '</tr>'
                        $('#staffInfo tbody').append(html);
                    });
                } else {
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="13">暂无数据！</td></tr>';
                    $('#staffInfo tbody').append(noData);
                }
            }
            else if(data.status == 403) {
                top.location.href = "login.html";
            }
            else {
                var err = data.err;
                layer.msg(err);
            }
        },
        error: function() {
            layer.msg("网络错误，请联系管理员或稍后重试！");
        }
    });
}


/**
 * 拒绝
 * param  token，p_uid
 * url  /operate_management/refuse
 */
function reFuse(pid) {
    $.ajax({
        url: server_url + "/operate_management/refuse",
        type: "post",
        dataType: "json",
        data: {
            'token': token,
            'id': pid
        },
        success: function (data) {
            if(data.status == 200) {
                layer.msg(data.payload);
                firstInfo(true);    //审核拒绝重新加载页面
            }
            else {
                layer.msg(data.err);
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            layer.msg("网络错误，请联系管理员或稍后重试！");
        }
    });
}

/**
 * 显示免单推广链接
 * param  token，uid
 * url  /users/getRCByUid
 */
function getRCByUid(param,acc) {
    $.ajax({
        type: "post",
        dataType: "json",
        url: server_url + "/users/getRCByUid",
        data: param,
        success: function (data) {
            if(data.status == 200) {
                var html = '';
                html += '<div id="qrcode" style="display: none"></div>'
                html += '<img width="375" id="qrcode_cpx"/>'
                html += '<p style="text-align: center;margin: 15px 0;">推广链接：http://www.usuz.cc/shop/trans.html?id=5&rc='+ data.payload.rc +'</p>'
                layer.open({
                    type: 1,
                    title: '免单推广链接（'+ acc +'）',
                    closeBtn: 0,  //不显示关闭按钮
                    anim: 2,
                    shadeClose: true,  //开启遮罩关闭
                    area: ['375px', '637px'],
                    content: html
                });
                //显示推广二维码
                var qrcode = new QRCode(document.getElementById('qrcode'));
                var qrUrl = 'http://www.usuz.cc/shop/trans.html?id=5&rc='+ data.payload.rc;
                qrcode.makeCode(qrUrl);

                var imgForQRCode = new Image();
                imgForQRCode.src = "img/qrcodebg.jpg";

                if(imgForQRCode.complete) {
                    setTimeout(function () {
                        drawQRCodeToImg(imgForQRCode);
                    },300)
                } else {
                    imgForQRCode.onload = function() {
                        setTimeout(function () {
                            drawQRCodeToImg(imgForQRCode);
                        },300)
                        imgForQRCode.onload = null;
                    };
                    imgForQRCode.onerror = function() {
                        window.alert('图片加载失败，请重试');
                    };
                }
            }
            else {
                layer.msg(data.err);
            }
        },
        error: function() {
            layer.msg("网络错误，请联系管理员或稍后重试！");
        }
    });
}

/**
 * 添加、编辑二维码图片
 * param  bind_qr_code
 * url
 */
function qrCodeImg() {
    $("#myupload").ajaxSubmit({
        success: function(data) {
            if(data.status == 200) {
                layer.msg(data.payload);
                setTimeout(function () {
                    layer.close(qrcode_index);  //关闭当前弹出层
                    firstInfo(true);  //新增或编辑成功刷新列表页
                }, 2000);
            } else {
                layer.msg(data.err);
            }
        },
        error: function() {
            layer.msg('网络错误，请稍后重试');
        }
    });
    return false;  //必须返回false，否则页面跳转(表单会自己再做一次提交操作)
}


//首次加载调用的函数
function firstInfo(isInside) {
    var goodParam = {
        'token': filterParam.token,
        'size': filterParam.size,
        'page': window.pageIndex
    };
    if(filterParam.province)   goodParam.province = filterParam.province;
    if(filterParam.city)       goodParam.city = filterParam.city;
    if(filterParam.status)     goodParam.status = filterParam.status;
    if(filterParam.account)        goodParam.account = filterParam.account;
    workAgentList(goodParam,isInside);
}


//商品分页
function setPage() {
    $("#Pagination").pagination(window.allGoodAmount, {
        current_page:0,
        link_to:"#",
        num_edge_entries: 1, //边缘页数
        num_display_entries:4, //主体页数
        callback: pageselectCallback,
        ellipse_text: '....',
        items_per_page: size, //每页显示个数
        prev_text: "<上一页",
        next_text: "下一页>"
    });
    function pageselectCallback(page_index, jq) {
        if(window.pageIndex != page_index + 1){
            window.pageIndex = page_index + 1;
            firstInfo(true);
        }
    }
}


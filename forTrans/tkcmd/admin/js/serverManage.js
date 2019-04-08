/**
 * Created by Administrator on 2017/12/25.
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
        filterParam.acc = $("#searchInfo").val();
        firstInfo();
    });

    //添加服务商
    $('body').on('click', '.addServicer', function () {
        layer.open({
            type: 2,
            title: '添加服务商',
            shadeClose: true,
            shade: 0.6,
            area: ['600px', '60%'],
            content: 'addServicer.html'   //iframe的url
        });
    });
    //编辑服务商详细信息
    $('body').on('click', '.lookEdit', function () {
        layer.open({
            type: 2,
            title: '查看并编辑',
            shadeClose: true,
            shade: 0.6,
            area: ['600px', '60%'],
            content: 'lookAndEdit.html?uid='+ $(this).attr('uid') + '&sts=' + $(this).attr('sts')   //iframe的url
        });
    });
    //查看服务商详情
    $('body').on('click', '.lookLower', function () {
        var url = 'lookDetail.html?paccount='+ $(this).attr('account') + '&puid=' + $(this).attr('uid');
        var perContent = layer.open({
            type: 2,
            title: '服务商详情列表',
            shadeClose: true,
            shade: 0.6,
            area: ['100%', '100%'],
            content: url
        });
        layer.full(perContent);
    });

    //审核通过
    $('body').on('click', '.pass', function () {
        var puid = $(this).attr('uid');
        passAudit(puid);
    });
    //审核拒绝
    $('body').on('click', '.refuse', function () {
        var puid = $(this).attr('uid');
        reFuse(puid);
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
    if(filterParam.status)  param.status = filterParam.status;
    $.ajax({
        url: server_url + "/operate_management/providerList",
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
                        html += '<td>' + (obj.account ? obj.account : '无') + '</td>'
                        html += '<td>' + (obj.company ? obj.company : '无') + '</td>'
                        html += '<td>' + (obj.legal_person ? obj.legal_person : '无') + '</td>'
                        html += '<td>' + (obj.linkman ? obj.linkman : '无') + '</td>'
                        html += '<td>' + (obj.linkman_tel ? obj.linkman_tel : '无') + '</td>'
                        html += '<td>' + obj.province + '</td>'
                        html += '<td>' + obj.city + '</td>'
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
                        filename: "服务商列表" ,//do not include extension
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
 * 服务商列表.
 * param：token, size, page, status, province, city
 * url：/agency_management/providerList
 */
function providerList(param,isInside) {
    $.ajax({
        url: server_url + "/operate_management/providerList",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if (data.status == 200) {
                $('#staffInfo tbody').empty();
                if (data.payload.total)
                    window.allGoodAmount = data.payload.total;
                else
                    window.allGoodAmount = 0;

                if (!isInside)
                    setPage();

                if (data.payload.data) {
                    var staffList = data.payload.data;
                    $.each(staffList, function (index,obj) {

                        var html = '';
                        html += '<tr uid="' + obj.uid + '">'
                        html += '<td>' + (obj.account ? obj.account : '无') + '</td>'
                        html += '<td>' + (obj.company ? obj.company : '无') + '</td>'
                        html += '<td>' + (obj.legal_person ? obj.legal_person : '无') + '</td>'
                        html += '<td>' + (obj.linkman ? obj.linkman : '无') + '</td>'
                        html += '<td>' + (obj.linkman_tel ? obj.linkman_tel : '无') + '</td>'
                        html += '<td>' + obj.province + '</td>'
                        html += '<td>' + obj.city + '</td>'
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
                        html += '<td>'
                        html += '<div class="layui-table-cell laytable-cell-1-10 padding0">'
                        html += '<a class="layui-btn layui-btn-normal layui-btn-xs lookEdit" uid="' + obj.uid + '" sts="' + obj.status + '">编辑</a>'
                        if (obj.status < 3) {
                            html += '<a class="layui-btn layui-btn-xs pass" uid="' + obj.uid + '">通过</a>'
                        }
                        if (obj.status < 2) {
                            html += '<a class="layui-btn layui-btn-danger layui-btn-xs refuse" uid="' + obj.uid + '">拒绝</a>'
                        }
                        if (obj.status == 3) {
                            html += '<a class="layui-btn layui-btn-warm layui-btn-xs lookLower" account="' + obj.account + '" uid="' + obj.uid + '">查看详情</a>'
                        }
                        html += '</div>'
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
                layer.msg(data.err);
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            layer.msg("网络错误，请联系管理员或稍后重试！");
        }
    });
}

/**
 * 通过审核
 * param  token，p_uid
 * url  /operate_management/passAudit
 */
function passAudit(puid) {
    $.ajax({
        url: server_url + "/operate_management/passAudit",
        type: "post",
        dataType: "json",
        data: {
           'token': token,
            'p_uid': puid
        },
        success: function (data) {
            if(data.status == 200) {
                layer.msg(data.payload);
                firstInfo(true);    //审核通过重新加载页面
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
 * 拒绝
 * param  token，p_uid
 * url  /operate_management/refuse
 */
function reFuse(puid) {
    $.ajax({
        url: server_url + "/operate_management/refuse",
        type: "post",
        dataType: "json",
        data: {
            'token': token,
            'p_uid': puid
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


//首次加载调用的函数.
function firstInfo(isInside) {
    var goodParam = {
        'token': filterParam.token,
        'size': filterParam.size,
        'page': window.pageIndex
    };
    if (filterParam.province)   goodParam.province = filterParam.province;
    if (filterParam.city)       goodParam.city = filterParam.city;
    if (filterParam.status)     goodParam.status = filterParam.status;
    if (filterParam.acc)        goodParam.acc = filterParam.acc;
    providerList(goodParam,isInside);
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



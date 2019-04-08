/**
 * Created by Administrator on 2018/1/11.
 */
//初始数据
var $form;
var $,layer,table,laydate,form;
var size = 10;
window.pageIndex = 1;
var token = sessionStorage.getItem('adminToken');
var filterParam = {
    'token': token,
    'size': size,
    'page': window.pageIndex,
    'sign': sign
};

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');
    firstInfo();  //访问加载页面

    if(!token)  top.location.href = "login.html";

    //条件筛选（类型）
    form.on('select(type)', function(data) {
        filterParam.type = data.value; //得到被选中的值
        console.log(filterParam)
        firstInfo();
    });
    //日期选择（开始时间）
    laydate.render({
        elem: '#startTime'
        ,done: function(value) {
            filterParam.start_date = value;
            firstInfo();
        }
    });
    //日期选择（结束时间）
    laydate.render({
        elem: '#endTime'
        ,done: function(value) {
            filterParam.end_date = value;
            firstInfo();
        }
    });

    //新增条目
    $('body').on('click', '.addLabInfo', function () {
        var ifrm;
        if (filterParam.type) {
            ifrm = 'addLabList.html?tp='+filterParam.type;
        } else {
            ifrm = 'addLabList.html';
        }
        layer.open({
            type: 2,
            title: '新增条目',
            shadeClose: true,
            shade: 0.6,
            area: ['700px', '75%'],
            content: ifrm
        });
    });
    //编辑榜单
    $('body').on('click', '.edit', function () {
        var filter = new Object();
        filter.title = $(this).prev().attr('tit');
        filter.pic_url = $(this).prev().attr('picurl');
        filter.click_url = $(this).prev().attr('clkurl');
        filter.type = $(this).prev().attr('ty');
        filter.comment = $(this).prev().attr('comm');
        filter.start_date = $(this).prev().attr('sd');
        filter.end_date = $(this).prev().attr('ed');
        filter.status = $(this).prev().attr('sts');
        filter.ex_info = $(this).prev().attr('exinfo');
        sessionStorage.setItem('filter',JSON.stringify(filter));
        layer.open({
            type: 2,
            title: '编辑榜单',
            shadeClose: true,
            shade: 0.6,
            area: ['700px', '75%'],
            content: 'addLabList.html?uid='+ $(this).attr('uid')   //iframe的url
        });
    });
    //删除榜单
    $('body').on('click', '.delete', function () {
        var param = {
            'token': token,
            'id': $(this).attr('uid'),
            'sign': sign
        };
        delAdConfig(param);
    });

});


/**
 * 查看adConfigList
 * param  token，type，size，page，sign
 * url    /bbs_post/showAdConfig
 */
function adConfigList(param,isInside) {
    $.ajax({
        url: server_url + "/ad_config/showAdConfig",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if (data.status == 200) {
                $('#labInfo tbody').empty();
                if (data.payload.total)
                    window.allGoodAmount = data.payload.total;
                else
                    window.allGoodAmount = 0;

                if (!isInside)
                    setPage();

                if (data.payload.data) {
                    var labList = data.payload.data;
                    $.each(labList, function (index,obj) {
                        var startTime = updateDate(obj.start_date);
                        var endTime = updateDate(obj.end_date);
                        var typeInfo;
                        var html = '';
                        html += '<tr uid="' + obj.id + '">'
                        html += '<td>' + (obj.title ? obj.title : '无') + '</td>'
                        html += '<td><img src="'+ server_url+obj.pic_url +'"/></td>'
                        html += '<td>' + (obj.click_url ? obj.click_url : '无') + '</td>'
                        html += '<td>' + (obj.comment ? obj.comment : '无') + '</td>'
                        html += '<td>' + startTime + '</td>'
                        html += '<td>' + endTime + '</td>'
                        switch(obj.type) {
                            case 0: typeInfo = "首页轮播图"; break;
                            case 1: typeInfo = "按钮"; break;
                            case 2: typeInfo = "banner活动"; break;
                            case 3: typeInfo = "号外轮播图"; break;
                            case 4: typeInfo = "免单banner"; break;
                            case 5: typeInfo = "榜单扩展图"; break;
                            case 6: typeInfo = "二维码海报图"; break;
                            case 7: typeInfo = "我的底部轮播图"; break;
                            default: typeInfo = "无"
                        }
                        html += '<td>' + typeInfo + '</td>'
                        if (obj.status === 0) { html += '<td style="color: #FF5722">否</td>' }
                        if (obj.status === 1) { html += '<td style="color: #009688">是</td>' }
                        html += '<td>'
                        html += '<div class="layui-table-cell laytable-cell-1-10 padding0">'
                        html += '<input type="hidden" '
                        html += 'tit="'+ obj.title +'"'
                        html += 'picurl="'+ obj.pic_url +'"'
                        html += 'clkurl="'+ (obj.click_url ? escapeHtml(obj.click_url) : "") +'"'
                        html += 'ty="'+ obj.type +'"'
                        html += 'comm="'+ (obj.comment ? obj.comment : "") +'"'
                        html += 'sd="'+ startTime +'"'
                        html += 'ed="'+ endTime +'"'
                        html += 'sts="'+ obj.status +'"'
                        html += 'exinfo="'+ (obj.ex_info ? escapeHtml(obj.ex_info) : "") +'"'
                        html += '/>'
                        html += '<a class="layui-btn layui-btn-xs edit" uid="' + obj.id + '">编辑</a>'
                        html += '<a class="layui-btn layui-btn-danger layui-btn-xs delete" uid="' + obj.id + '">删除</a>'
                        html += '</div>'
                        html += '</td>'
                        html += '</tr>'
                        $('#labInfo tbody').append(html);
                    });
                } else {
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="9">暂无数据！</td></tr>';
                    $('#labInfo tbody').append(noData);
                }
            } else if (data.status == 403) {
                top.location.href = "login.html";
            } else {
                layer.msg(data.err);
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            var msg = "返回状态："+ jqXhr.status +"\n服务器错误，请联系管理员";
            layer.msg(msg);
        }
    });
}

/**
 * 删除    adConfig
 * param  token，id，sign
 * url    /ad_config/delAdConfig
 */
function delAdConfig(param) {
    $.ajax({
        url: server_url + "/ad_config/delAdConfig",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if (data.status == 200) {
                firstInfo(true);  //删除成功刷新列表页
            } else {
                layuiLayer(data.err)
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            var msg = "返回状态："+ jqXhr.status +"\n服务器错误，请联系管理员";
            layer.open({
                content: msg
                ,time: 3
            });
        }
    });
}


//首次加载调用的函数.
function firstInfo(isInside) {
    var goodParam = {
        'token': filterParam.token,
        'size': filterParam.size,
        'page': window.pageIndex,
        'sign': filterParam.sign
    };
    if (filterParam.type)          goodParam.type = filterParam.type;
    if (filterParam.start_date)    goodParam.start_date = filterParam.start_date;
    if (filterParam.end_date)      goodParam.end_date = filterParam.end_date;
    adConfigList(goodParam,isInside);
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



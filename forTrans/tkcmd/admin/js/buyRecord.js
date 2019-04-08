/**
 * Created by yjp on 2018/9/17.
 */
var $,layer,table,laydate,form;
var size = 10;
window.pageIndex = 1;
var token  = sessionStorage.getItem('adminToken');
var role = sessionStorage.getItem('adminRole');
var filterParam = {
    'token': token,
    'pageSize': size,
    'page': window.pageIndex,
    'app_sid': 'usuz',
    'status': 13
};


layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;

    if(role.indexOf('xqk') >= 0) {
        filterParam.vip_sid = 'xqkVip';
        $('.xqkAdminHide').remove();
        form.render('select');
    }

    firstInfo();  //访问加载页面

    if(!token)  top.location.href = "login.html";

    // 搜索
    $('.search').click(function () {
        filterParam.account = $("#searchInfo").val();
        firstInfo();
    });

    //开始时间
    laydate.render({
        elem: '#startTime'
        ,done: function(value) {
            filterParam.startTime = value;
            window.pageIndex = filterParam.page = 1;
            firstInfo();
        }
    });
    //结束时间
    laydate.render({
        elem: '#endTime'
        ,done: function(value) {
            filterParam.endTime = value;
            window.pageIndex = filterParam.page = 1;
            firstInfo();
        }
    });

    // 条件筛选（状态）
    form.on('select(vipSid)', function(data) {
        filterParam.vip_sid = data.value; //得到被选中的值
        filterParam.page = 1;
        firstInfo();
    });

    // Excel 列表导出
    $('#table2excel').click(function () {
        excelList();
        setTimeout(function () {
            $("#excelList").table2excel({
                exclude: ".noExl",
                name: "Worksheet Name",
                filename: "购买记录" ,//do not include extension
                exclude_img: true,
                exclude_links: true,
                exclude_inputs: true
            });
        },500)
    });
});


// 存放Excel导出列表
function excelList() {
    var param = {
        'token': token,
        'pageSize': window.allGoodAmount,
        'page': 1,
        'app_sid': 'usuz',
        'status': 13
    }
    if(filterParam.vip_sid) param.vip_sid = filterParam.vip_sid;
    if(filterParam.account) param.account = filterParam.account;
    if(filterParam.startTime) param.startTime = filterParam.startTime;
    if(filterParam.endTime) param.endTime = filterParam.endTime;
    $.ajax({
        url: login_url + "/vip_management/userVipList",
        type: "post",
        dataType: "json",
        data: param,
        success: function(data) {
            if(data.status == 200) {
                $('#excelList tbody').empty();

                if(data.payload.data) {
                    var dataList = data.payload.data;
                    $.each(dataList, function (index,obj) {
                        var html = '';
                        html += '<tr>'
                        html += '<td>'+ (obj.account ? obj.account : '--') +'</td>'
                        html += '<td>'+ (obj.order_code ? obj.order_code : '--') +'</td>'
                        html += '<td>'+ (obj.vip_name ? obj.vip_name : '--') +'</td>'
                        html += '<td>'+ simpleDateFormat(obj.created_time) + '</td>'
                        html += '<td>'+ simpleDateFormat(obj.end_time) + '</td>'
                        if(obj.payment == 'alipay')  html += '<td>支付宝</td>'
                        else if(obj.payment == 'wxpay')  html += '<td>微信</td>'
                        else if(obj.payment == 'balance')  html += '<td>余额</td>'
                        html += '</tr>'
                        $('#excelList tbody').append(html);
                    });
                }
            }
        }
    });
}

/**
 *  param
 *  app_sid:'usuz'
 *  vip_sid (可选)、account (可选)、startTime (可选)、endTime (可选)
 *  page
 *  pageSize
 *  url:vip_management/userVipList
 */
function list(param,isInside) {
    $.ajax({
        url: login_url + "/vip_management/userVipList",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if(data.status == 200) {
                $('#dataInfo tbody').empty();
                if(data.payload.total)
                    window.allGoodAmount = data.payload.total;
                else
                    window.allGoodAmount = 0;

                if(!isInside)
                    setPage();

                if(data.payload.data) {
                    var dataList = data.payload.data;
                    $.each(dataList, function (index,obj) {
                        var html = '';
                        html += '<tr iid="'+ obj.item_id +'">'
                        html += '<td>'+ (obj.account ? obj.account : '--') +'</td>'
                        html += '<td>'+ (obj.order_code ? obj.order_code : '--') +'</td>'
                        html += '<td>'+ (obj.vip_name ? obj.vip_name : '--') +'</td>'
                        html += '<td>'+ simpleDateFormat(obj.created_time) + '</td>'
                        html += '<td>'+ simpleDateFormat(obj.end_time) + '</td>'
                        if(obj.payment == 'alipay')  html += '<td>支付宝</td>'
                        else if(obj.payment == 'wxpay')  html += '<td>微信</td>'
                        else if(obj.payment == 'balance')  html += '<td>余额</td>'
                        // html += '<td>'
                        // html += '<div class="layui-table-cell laytable-cell-1-10 padding0">'
                        // html += '<a class="layui-btn layui-btn-normal layui-btn-xs" iid="" acc="">操作</a>'
                        // html += '</div>'
                        // html += '</td>'
                        html += '</tr>'
                        $('#dataInfo tbody').append(html);
                    });
                } else {
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="9">暂无数据！</td></tr>';
                    $('#dataInfo tbody').append(noData);
                }
            }
            else if(data.status == 403) {
                top.location.href = "login.html";
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



//首次加载调用的函数.
function firstInfo(isInside) {
    var goodParam = {
        'token': filterParam.token,
        'pageSize': filterParam.pageSize,
        'page': window.pageIndex,
        'app_sid': filterParam.app_sid,
        'status': filterParam.status
    };
    if(filterParam.account)     goodParam.account = filterParam.account;
    if(filterParam.vip_sid)     goodParam.vip_sid = filterParam.vip_sid;
    if(filterParam.startTime)   goodParam.startTime = filterParam.startTime;
    if(filterParam.endTime)     goodParam.endTime = filterParam.endTime;
    list(goodParam,isInside);
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





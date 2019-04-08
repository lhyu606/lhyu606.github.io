/**
 * Created by yjp on 2018/9/21.
 */
var $,layer,table,laydate,form;
var size = 10;
window.pageIndex = 1;
var token = sessionStorage.getItem('adminToken');
var filterParam = {
    'token': token,
    'size': size,
    'page': window.pageIndex,
    'app_sid': 'usuz'
};


layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;

    if(!token)  top.location.href = "login.html";

    // 搜索
    $('.search').click(function () {
        filterParam.account = $("#searchInfo").val();
        firstInfo();
    });

    // 开始时间
    laydate.render({
        elem: '#startTime'
        ,done: function(value) {
            filterParam.start_time = value;
            window.pageIndex = filterParam.page = 1;
            firstInfo();
        }
    });
    // 结束时间
    laydate.render({
        elem: '#endTime'
        ,done: function(value) {
            filterParam.end_time = value;
            window.pageIndex = filterParam.page = 1;
            firstInfo();
        }
    });
    
    // Excel 列表导出
    $('#table2excel').click(function () {
        excelList();
        setTimeout(function () {
            $("#excelList").table2excel({
                exclude: ".noExl",
                name: "Worksheet Name",
                filename: "资金流水查询" ,//do not include extension
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
        'size': window.allGoodAmount,
        'page': 1,
        'app_sid': 'usuz'
    }
    if(filterParam.account) param.account = filterParam.account;
    if(filterParam.start_time) param.start_time = filterParam.start_time;
    if(filterParam.end_time) param.end_time = filterParam.end_time;
    $.ajax({
        url: login_url + "/userMoney/record",
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
                        html += '<td>'+ simpleDateFormat(obj.created_time) +'</td>'
                        if(obj.sign==0) {
                            html += '<td>￥'+ ('+'+obj.money.toFixed(2)) +'</td>'
                            html += '<td>￥'+ (Number(obj.original_money)+Number(obj.money)).toFixed(2) + '</td>'
                        }
                        else if(obj.sign==1) {
                            html += '<td>￥'+ ('-'+obj.money.toFixed(2)) +'</td>'
                            html += '<td>￥'+ (Number(obj.original_money)-Number(obj.money)).toFixed(2) + '</td>'
                        }
                        html += '<td>'+ obj.comment + '</td>'
                        html += '</tr>'
                        $('#excelList tbody').append(html);
                    });
                }
            }
        }
    });
}

/**
 * 流水记录
 * @param  token
 * @param  account
 * @param  start_time
 * @param  end_time
 * @param  app_sid
 * url//userMoney/record
 */
function list(param,isInside) {
    $.ajax({
        url: login_url + "/userMoney/record",
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
                        html += '<tr>'
                        html += '<td>'+ (obj.account ? obj.account : '--') +'</td>'
                        html += '<td>'+ simpleDateFormat(obj.created_time) +'</td>'
                        if(obj.sign==0) {
                            html += '<td>￥'+ ('+'+obj.money.toFixed(2)) +'</td>'
                            html += '<td>￥'+ (Number(obj.original_money)+Number(obj.money)).toFixed(2) + '</td>'
                        }
                        else if(obj.sign==1) {
                            html += '<td>￥'+ ('-'+obj.money.toFixed(2)) +'</td>'
                            html += '<td>￥'+ (Number(obj.original_money)-Number(obj.money)).toFixed(2) + '</td>'
                        }
                        html += '<td>'+ obj.comment + '</td>'
                        html += '</tr>'
                        $('#dataInfo tbody').append(html);
                    });
                } else {
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="5">暂无数据！</td></tr>';
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
        'size': filterParam.size,
        'page': window.pageIndex,
        'app_sid': filterParam.app_sid
    };
    if(filterParam.account)     goodParam.account = filterParam.account;
    if(filterParam.start_time)   goodParam.start_time = filterParam.start_time;
    if(filterParam.end_time)     goodParam.end_time = filterParam.end_time;
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





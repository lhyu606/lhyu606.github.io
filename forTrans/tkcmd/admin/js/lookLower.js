/**
 * Created by Administrator on 2018/1/3.
 */
//初始数据
var par = parseURL(window.location.href);
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

    $('.user_account').text(par.params.paccount);  //获取主账号（下级列表）

    firstInfo();  //访问加载页面
    getTeamNum();  //获取团队人数
    
    //搜索
    $('.search').click(function () {
        filterParam.acc = $("#searchInfo").val();
        firstInfo();
    });

    //查看服务商下级
    $('body').on('click', '.lookLower', function () {
        var url = 'lookLower.html?paccount='+ $(this).attr('account');
        var perContent = parent.layer.open({
            type: 2,
            title: '下级列表',
            shadeClose: true,
            shade: 0.6,
            area: ['100%', '100%'],
            content: url
        });
        parent.layer.full(perContent);
    });

    // Excel 列表导出
    $('#table2excel').click(function () {
        excelList();
        setTimeout(function () {
            $("#excelList").table2excel({
                exclude: ".noExl",
                name: "Worksheet Name",
                filename: "下级列表" ,//do not include extension
                exclude_img: true,
                exclude_links: true,
                exclude_inputs: true
            });
        },500)
    });
});


// 存放Excel导出列表
function excelList() {
    $.ajax({
        url: server_url + '/operate_management/getSubRecommender',
        type: "post",
        dataType: "json",
        data: {
            'token': token,
            'page': 1,
            'sub_account': par.params.paccount,
            'size': window.allGoodAmount
        },
        success: function(data) {
            if(data.status == 200) {
                $('#excelList tbody').empty();

                if(data.payload.data) {
                    var MemberList = data.payload.data;
                    $.each(MemberList, function (index,obj) {
                        var html = '';
                        html += '<tr uid="' + obj.uid + '">'
                        html += '<td>' + obj.account + '</td>'

                        if(!obj.vip_sid)  html += '<td>普通用户</td>'
                        else if(obj.lvl == 2) html += '<td>掌柜</td>'
                        else html += '<td>小二</td>'

                        html += '<td>' + (obj.team_num ? obj.team_num : 0) + '</td>'
                        html += '<td>' + (obj.r_sub_total ? obj.r_sub_total : 0) + '</td>'
                        html += '<td>' + (obj.real_sub_ea ? obj.real_sub_ea : 0) + '</td>'
                        html += '<td>' + (obj.real_isub_ea ? obj.real_isub_ea : 0) + '</td>'
                        html += '<td>' + (obj.recommend_income ? obj.recommend_income : 0) + '</td>'
                        html += '<td>' + (obj.isStaff ? '是' : '否') + '</td>'
                        html += '</tr>'
                        $('#excelList tbody').append(html);
                    });
                }
            }
        }
    });
}

/**
 * 服务商查看具体哪个服务商的下级信息
 * param  token，sub_account，page，size
 * url    /operate_management/getSubRecommender
 */
function getList(param, isInside) {
    $.ajax({
        url: server_url + '/operate_management/getSubRecommender',
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if (data.status == 200) {
                $('#staffInfo tbody').empty();
                if (data.payload.count)
                    window.allGoodAmount = data.payload.count;
                else
                    window.allGoodAmount = 0;

                if (!isInside)
                    setPage();

                if (data.payload.data) {
                    var MemberList = data.payload.data;
                    $.each(MemberList, function (index,obj) {

                        var html = '';
                        html += '<tr uid="' + obj.uid + '">'
                        html += '<td>' + obj.account + '</td>'

                        if(!obj.vip_sid)  html += '<td>普通用户</td>'
                        else if(obj.lvl == 2) html += '<td>掌柜</td>'
                        else html += '<td>小二</td>'

                        html += '<td>' + (obj.team_num ? obj.team_num : 0) + '</td>'
                        html += '<td>' + (obj.r_sub_total ? obj.r_sub_total : 0) + '</td>'
                        html += '<td>' + (obj.real_sub_ea ? obj.real_sub_ea : 0) + '</td>'
                        html += '<td>' + (obj.real_isub_ea ? obj.real_isub_ea : 0) + '</td>'
                        html += '<td>' + (obj.recommend_income ? obj.recommend_income : 0) + '</td>'
                        html += '<td>' + (obj.isStaff ? '是' : '否') + '</td>'
                        html += '<td>'
                        html += '<div class="layui-table-cell laytable-cell-1-10 padding0">'
                        html += '<a class="layui-btn layui-btn-normal layui-btn-xs lookLower" uid="' + obj.uid + '" account="' + obj.account + '">查看下级</a>'
                        html += '</div>'
                        html += '</td>'
                        html += '</tr>'
                        $('#staffInfo tbody').append(html);
                    });
                } else {
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="9">暂无数据！</td></tr>';
                    $('#staffInfo tbody').append(noData);
                }
            } else if (data.status == 403) {
                top.location.href = "login.html";
            } else {
                layer.msg(data.err);
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            var msg = "网络错误，请稍后重试或联系管理员！";
            layer.msg(msg);
        }
    });
}

/**
 * 获取团队人数和有效团队人数
 * param  token，account
 * url    /operate_management/getAccountTeamNum
 */
function getTeamNum() {
    $.ajax({
        url: server_url + "/agency_management/getAccountTeamNum",
        type: "post",
        dataType: "json",
        data: {
            token:token,
            account:par.params.paccount
        },
        success: function (data) {
            if(data.status == 200){
                $('.teamNum i').text(data.payload[0].team_num);
                $('.realNum i').text(data.payload[0].r_sub_total);
            }
            else {
                $('.teamNum i').text('读取失败！');
                $('.realNum i').text('读取失败！');
            }
        }
    })
}


//首次加载调用的函数
function firstInfo(isInside) {
    var goodParam = {
        'token': filterParam.token,
        'size': filterParam.size,
        'lvl': filterParam.lvl,
        'page': window.pageIndex
    }
    if(par.params.paccount)   goodParam.sub_account = par.params.paccount;
    getList(goodParam, isInside);
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



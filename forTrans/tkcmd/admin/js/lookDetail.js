/**
 * Created by yjp on 2018/5/2.
 */
//初始数据
var par = parseURL(window.location.href);
var $,layer,table,laydate,form;
var selectUrl = '/agency_management/membersList';  // 默认地址
var size = 10;
var token = sessionStorage.getItem('adminToken');
window.pageIndex = 1;
var filterParam = {
    'token': token,
    'size': size,
    'page': window.pageIndex,
    'account': par.params.paccount,
    'uid': par.params.puid,
    'pre_agent_lvl': 4,
    'lvl': 1
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

    //下级类型
    form.on('select(roleType)', function(data) {
        // console.log(data.value)
        if(data.value == 0) {  //总监
            selectUrl = '/agency_management/getLowAgentList';
            filterParam.findLvl = 6;
            firstInfo();
        }
        else if(data.value == 1) {  //搜省会员
            selectUrl = '/agency_management/membersList';
            filterParam.isWtk = 1;
            delete filterParam.findLvl;
            delete filterParam.lvl;
            firstInfo();
        }
        else if(data.value == 2) {
            selectUrl = '/agency_management/membersList';
            filterParam.lvl = 1;
            delete filterParam.isWtk;
            delete filterParam.findLvl;
            firstInfo();
        }
    });
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
    var param = {
        'token': token,
        'page': 1,
        'size': window.allGoodAmount,
        'account': par.params.paccount,
        'uid': par.params.puid
    }
    if(filterParam.pre_agent_lvl)  param.pre_agent_lvl = filterParam.pre_agent_lvl;
    if(filterParam.lvl)  param.lvl = filterParam.lvl;
    if(filterParam.findLvl)  param.findLvl = filterParam.findLvl;
    if(filterParam.isWtk)  param.isWtk = filterParam.isWtk;

    $.ajax({
        url: server_url + selectUrl,
        type: "post",
        dataType: "json",
        data: param,
        success: function(data) {
            if(data.status == 200) {
                $('#excelList tbody').empty();

                if(data.payload.data) {
                    var MemberList = data.payload.data;
                    $.each(MemberList, function (index,obj) {
                        var html = '';
                        html += '<tr uid="' + obj.uid + '">'
                        html += '<td>' + obj.account + '</td>'

                        if(!obj.vip_sid)  h += '<td>普通用户</td>'
                        else if(obj.lvl == 2) h += '<td>掌柜</td>'
                        else h += '<td>小二</td>'
                        
                        html += '<td>' + (obj.team_num ? obj.team_num : 0) + '</td>'
                        html += '<td>' + (obj.r_sub_total ? obj.r_sub_total : 0) + '</td>'
                        html += '<td>' + (obj.real_sub_ea ? obj.real_sub_ea : 0) + '</td>'
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
 * param  token，lvl，acc，page，size
 * url    /agency_management/membersList
 */
function getList(param, selectUrl, isInside) {
    $.ajax({
        url: server_url + selectUrl,
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
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="8">暂无数据！</td></tr>';
                    $('#staffInfo tbody').append(noData);
                }
            }
            // else if (data.status == 403) {
            //     top.location.href = "login.html";
            // }
            else {
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


//首次加载调用的函数.
function firstInfo(isInside) {
    var goodParam = {
        'token': filterParam.token,
        'size': filterParam.size,
        'page': window.pageIndex,
        'account': filterParam.account,
        'uid': filterParam.uid
    }
    if(filterParam.pre_agent_lvl)  goodParam.pre_agent_lvl = filterParam.pre_agent_lvl;
    if(filterParam.lvl)  goodParam.lvl = filterParam.lvl;
    if(filterParam.findLvl)  goodParam.findLvl = filterParam.findLvl;
    if(filterParam.isWtk)  goodParam.isWtk = filterParam.isWtk;
    getList(goodParam, selectUrl, isInside);
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



/**
 * Created by Administrator on 2018/1/2.
 */
function getURLParam(strParamName, url) {
    var urlParams = parseURL(url);
    if(urlParams.params && urlParams.params.hasOwnProperty(strParamName)){
        return urlParams.params[strParamName];
    }
    return null;
}
var $,layer,table,size = 10;
var act = getURLParam('act',window.location.href);
window.pageIndex = 1;
var token = sessionStorage.getItem('token');
var filterParam = {
    'token': token,
    'size': size,
    'sub_account':act,
    'page': window.pageIndex
};

layui.use(['jquery', 'layer', 'table'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格

    $('.referral').text(act);


    //搜索
    $('.search').click(function () {
        var searchInfo = $("#searchInfo").val();
        if(searchInfo == ''){
            delete filterParam["acc"];
        }
        else{
            filterParam["acc"] = searchInfo;
        }
        getSub(filterParam);
    });
    //查看下级个数
    $('body').on('click','.teamNum',function () {
        var account = $(this).parents('td').siblings('.Uaccount').text();
        url = 'Referral.html?act='+ account;
        var perContent = parent.layer.open({
            type: 2,
            title: '下级列表',
            shadeClose: true,
            area: ['100%', '100%'],
            content: url
        });
        parent.layer.full(perContent);
    });

    //导出Excel表
    $('#table2excel').click(function () {
        excelList();
        $("#excelList").table2excel({
            exclude: ".noExl",
            name: "Worksheet Name",
            filename: "一级下线列表",//do not include extension
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
        });
    });
    // 存放Excel导出列表
    function excelList() {
        $.ajax({
            url: top.server_url + "/agency_management/getSubRecommender",
            type: "post",
            dataType: "json",
            data: {
                'token': token,
                'sub_account':act,
                'size': window.allGoodAmount
            },
            success: function(data) {
                if(data.status == 200) {
                    $('#excelList tbody').empty();

                    if(data.payload.data) {
                        var staffList = data.payload.data;
                        $.each(staffList, function (index,obj) {
                            var team_num = Number(obj.team_num) || 0;
                            var real_sub_ea = Number(obj.real_sub_ea) || 0;
                            var html = '';
                            html += '<tr>'
                            html += '<td class="Uaccount">'+ obj.account +'</td>'

                            if(obj.pre_agent_lvl == 6)  html += '<td>总监</td>'
                            else if(obj.pre_agent_lvl == 4) html += '<td>服务商</td>'
                            else if(obj.pre_agent_lvl == 2) html += '<td>分公司</td>'
                            else if(obj.pre_agent_lvl == 0) {
                                if(obj.vip_sid)     html += '<td>微淘客</td>'
                                else    html += '<td>普通用户</td>'
                            }
                            else if(obj.pre_agent_lvl == 1)  html += '<td>系统</td>'
                            else if(obj.pre_agent_lvl == 3)  html += '<td>管理组</td>'
                            else if(obj.pre_agent_lvl == 5)  html += '<td>业务组</td>'

                            html += '<td class="clearfix"><span class="team_num">'+ team_num +'个</span></td>'
                            html += '<td class="lvl1"><i>'+ real_sub_ea +'个</i></td>'
                            html += '</tr>'
                            $('#excelList tbody').append(html);
                        });
                    }
                }
            }
        });
    }
});


/**
 * 服务商查看某个下线的下线
 * @param  token
 * @param  sub_account
 * @param  size
 * @param  page
 * url//agency_management/getSubRecommender
 */
function getSub(param,isInside) {
    $.ajax({
        url: top.server_url + "/agency_management/getSubRecommender",
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
                    var staffList = data.payload.data;
                    $.each(staffList, function (index,obj) {
                        var team_num = Number(obj.team_num) || 0;
                        var real_sub_ea = Number(obj.real_sub_ea) || 0;
                        var html = '';
                        html += '<tr aid="'+ obj.uid +'" account="'+ obj.account +'">'
                        html += '<td class="Uaccount">'+ obj.account +'</td>'

                        if(obj.pre_agent_lvl == 6)  html += '<td>总监</td>'
                        else if(obj.pre_agent_lvl == 4) html += '<td>服务商</td>'
                        else if(obj.pre_agent_lvl == 2) html += '<td>分公司</td>'
                        else if(obj.pre_agent_lvl == 0) {
                            if(obj.vip_sid)     html += '<td>微淘客</td>'
                            else    html += '<td>普通用户</td>'
                        }
                        else if(obj.pre_agent_lvl == 1)  html += '<td>系统</td>'
                        else if(obj.pre_agent_lvl == 3)  html += '<td>管理组</td>'
                        else if(obj.pre_agent_lvl == 5)  html += '<td>业务组</td>'

                        html += '<td class="clearfix"><span class="team_num">'+ team_num +'个</span></td>'
                        html += '<td class="lvl1"><i>'+ real_sub_ea +'个</i></td>'
                        html += '<td>'
                        // if(obj.isStaff == true) {
                        //     html += '<div class="layui-table-cell laytable-cell-1-10 padding0">'
                        //     html += '<a class="layui-btn layui-btn-xs deleteToPoll" aid="'+ obj.uid +'">剔除员工</a>'
                        //     html += '</div>'
                        // }
                        html += '<div class="layui-table-cell padding0">'
                        html += '<a class="layui-btn layui-btn-xs setTshy" account="'+ obj.account +'">赋予天使会员</a>'
                        if(obj.pre_agent_lvl>4 || obj.pre_agent_lvl==0) {
                            if(obj.pre_agent_lvl==0 && !obj.vip_sid) {
                                html += '<a class="layui-btn layui-btn-xs setWtk" aid="'+ obj.uid +'" account="'+ obj.account +'">赋予微淘客</a>'
                            }
                            if(obj.pre_agent_lvl==0) {
                                html += '<a class="layui-btn layui-btn-xs setJy" aid="'+ obj.uid +'" account="'+ obj.account +'">赋予总监</a>'
                            }
                            html += '<a class="layui-btn layui-btn-xs setFws" account="'+ obj.account +'">赋予服务商</a>'
                        }

                        if(obj.team_num > 0) {
                            html += '<a class="layui-btn layui-btn-xs teamNum" '+
                                'aid="'+ obj.uid +'" account="'+ obj.account +'" title="点击查看下线详情">查看下级</a>'
                        }
                        else {
                            html += '<a class="layui-btn layui-btn-xs noSub">暂无下级</a>'
                        }
                        html += '</div>'
                        html += '</td>'
                        html += '</tr>'
                        $('#staffInfo tbody').append(html);
                    });
                } else {
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="5">暂无数据！</td></tr>';
                    $('tbody').append(noData);
                }
            }
            else if (data.status == 403) {
                top.location.href = "login.html";
            }
            else {
                layer.msg(data.err);
            }
        },
        error: function() {
            layer.alert('网络错误，请联系管理员或稍后重试！', {
                icon: 7
            });
        }
    });
}


//首次加载调用的函数
function firstGoodsInfo(isInside) {
    var goodParam = {
        'token': filterParam.token,
        'size': filterParam.size,
        'sub_account':filterParam.sub_account,
        'page': window.pageIndex
    };
    getSub(goodParam, isInside);
}
firstGoodsInfo();  //访问加载页面


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
            firstGoodsInfo(true);
        }
    }
}
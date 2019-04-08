/**
 * Created by yjp on 2018/4/19.
 */
// 初始化数据
var par = parseURL(window.location.href);
var $, layer,size = 10;
window.pageIndex = 1;
var token = sessionStorage.getItem('token');
var filterParam = {
    'token': token,
    'size': size,
    'findLvl': 4,
    'page': window.pageIndex
};

layui.use(['jquery', 'layer'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    
    if(par.params.pdata) {    //是否为下级服务商
        var d = JSON.parse(decodeURI(par.params.pdata));
        filterParam.isFindByAcc = true;
        filterParam.f_account = d.acc;
        filterParam.f_uid = d.uid;
        filterParam.f_pre_agent_lvl = d.pal;
    }
    
    //搜索
    $('.search').click(function () {
        var searchInfo = $("#searchInfo").val();
        if(searchInfo == '') {
            delete filterParam["acc"];
        } else {
            filterParam["acc"] = searchInfo;
        }
        firstGoodsInfo();
    });
    //查看当前账号报表
    $('body').on('click','.lookDataRpt',function () {
        var pdata = {
            'acc': $(this).attr('acc'),
            'uid': $(this).attr('uid'),
            'pal': $(this).attr('pal')
        }
        url = 'dataReport.html?pdata='+ JSON.stringify(pdata);
        if(par.params.pdata) {
            var perContent = parent.layer.open({
                type: 2,
                title: '数据汇总',
                shadeClose: true,
                shade: 0.6,
                area: ['100%', '100%'],
                content: escapeHtml(url)
            });
            parent.layer.full(perContent);
        }
        else {
            var perContent = layer.open({
                type: 2,
                title: '数据汇总',
                shadeClose: true,
                shade: 0.6,
                area: ['100%', '100%'],
                content: escapeHtml(url)
            });
            layer.full(perContent);
        }
    });
    //查看当前账号总监
    $('body').on('click','.lookDirector',function () {
        var pdata = {
            'acc': $(this).attr('acc'),
            'uid': $(this).attr('uid'),
            'pal': $(this).attr('pal')
        }
        url = 'directorManage.html?pdata='+ JSON.stringify(pdata);
        if(par.params.pdata) {
            var perContent = parent.layer.open({
                type: 2,
                title: '下级总监',
                shadeClose: true,
                shade: 0.6,
                area: ['100%', '100%'],
                content: escapeHtml(url)
            });
            parent.layer.full(perContent);
        }
        else {
            var perContent = layer.open({
                type: 2,
                title: '下级总监',
                shadeClose: true,
                shade: 0.6,
                area: ['100%', '100%'],
                content: escapeHtml(url)
            });
            layer.full(perContent);
        }
    });
    //查看下级
    $('body').on('click','.lookNext',function () {
        var account = $(this).parents('td').siblings('.Uaccount').text();
        url = 'Referral.html?act='+ account;
        if(par.params.pdata) {
            var perContent = parent.layer.open({
                type: 2,
                title: '下级列表',
                shadeClose: true,
                shade: 0.6,
                area: ['100%','100%'],
                content: url
            });
            parent.layer.full(perContent);
        }
        else {
            var perContent = layer.open({
                type: 2,
                title: '下级列表',
                shadeClose: true,
                shade: 0.6,
                area: ['100%','100%'],
                content: url
            });
            layer.full(perContent);
        }
    });

    //导出Excel表
    $('#table2excel').click(function () {
        excelList();
        setTimeout(function () {
            $("#excelList").table2excel({
                exclude: ".noExl",
                name: "Worksheet Name",
                filename: "服务商列表", //do not include extension
                exclude_img: true,
                exclude_links: true,
                exclude_inputs: true
            });
        },500)
    });
    // 存放Excel导出列表
    function excelList() {
        $.ajax({
            url: top.server_url + "/agency_management/getLowAgentList",
            type: "post",
            dataType: "json",
            data: {
                'token': token,
                'findLvl': 4,
                'size': window.allGoodAmount
            },
            success: function(data) {
                if(data.status == 200) {
                    $('#excelList tbody').empty();

                    if(data.payload.data) {
                        var staffList = data.payload.data;
                        $.each(staffList, function(index,obj) {
                            var html = '';
                            html += '<tr>'
                            html += '<td class="Uaccount">'+ obj.account +'</td>'
                            html += '<td class="clearfix"><span class="team_num">'+ obj.team_num +'</span></td>'
                            html += '<td class="clearfix"><span>'+ (obj.r_sub_total ? obj.r_sub_total : 0) +'个</span></td>'
                            html += '<td class="lvl1"><i>'+ (obj.real_sub_ea ? obj.real_sub_ea : 0) +'个</i></td>'
                            html += '<td>'+ (obj.freeze_money+obj.score).toFixed(2) +'元</td>'
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
 * 服务商查看自己的所有下线
 * param  token，findLvl，page，size
 * url  /agency_management/getLowAgentList
 */
function membersList(param, isInside) {
    $.ajax({
        url: top.server_url + "/agency_management/getLowAgentList",
        type: "post",
        dataType: "json",
        data: param,
        success: function(data) {
            if(data.status == 200) {
                $('.rolePlay', parent.document).text('服务商');
                $('#memberSum', parent.document).text(data.payload.total ? data.payload.total : 0);  // 团队总人数
                $('#staffInfo tbody').empty();
                if(data.payload.total) window.allGoodAmount = data.payload.total;
                else    window.allGoodAmount = 0;

                if(!isInside)  setPage();

                if(data.payload.data) {
                    var staffList = data.payload.data;
                    $.each(staffList, function(index,obj) {
                        var html = '';
                        html += '<tr aid="'+ obj.uid +'" account = "'+obj.account+'">'
                        html += '<td class="Uaccount">'+ obj.account +'</td>'
                        html += '<td class="clearfix"><span class="team_num">'+ obj.team_num +'</span></td>'
                        html += '<td class="clearfix"><span>'+ (obj.r_sub_total ? obj.r_sub_total : 0) +'个</span></td>'
                        html += '<td class="lvl1"><i>'+ (obj.real_sub_ea ? obj.real_sub_ea : 0) +'个</i></td>'
                        html += '<td>'+ (obj.freeze_money+obj.score).toFixed(2) +'元</td>'
                        html += '<td>'
                        html += '<a class="layui-btn layui-btn-xs setTshy" account="'+ obj.account +'">赋予天使会员</a>'
                        html += '<a class="layui-btn layui-btn-xs lookDataRpt" acc="'+ obj.account +'" uid="'+ obj.uid +'" pal="'+ obj.pre_agent_lvl +'">查看报表</a>'
                        html += '<a class="layui-btn layui-btn-xs lookDirector" acc="'+ obj.account +'" uid="'+ obj.uid +'" pal="'+ obj.pre_agent_lvl +'">查看总监</a>'
                        if(obj.team_num > 0) {
                            html += '<a class="layui-btn layui-btn-xs lookNext" aid="'+ obj.uid +'" account="'+ obj.account +'" title="点击查看下线详情">查看下级</a>'
                        } else {
                            html += '<a class="layui-btn layui-btn-xs noSub">暂无下级</a>'
                        }
                        html += '</td>'
                        html += '</tr>'
                        $('#staffInfo tbody').append(html);
                    });
                } else {
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="6">暂无数据！</td></tr>';
                    $('tbody').append(noData);
                }
            }
            else if(data.status == 403) {
                top.location.href = "login.html";
            }
            else {
                layer.msg(data.err);
            }
        },
        error: function () {
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
        'findLvl': filterParam.findLvl,
        'page': window.pageIndex
    };
    if(filterParam.acc)   goodParam.acc = filterParam.acc;
    if(filterParam.isFindByAcc)  goodParam.isFindByAcc = filterParam.isFindByAcc;
    if(filterParam.f_account)  goodParam.f_account = filterParam.f_account;
    if(filterParam.f_uid)  goodParam.f_uid = filterParam.f_uid;
    if(filterParam.f_pre_agent_lvl)  goodParam.f_pre_agent_lvl = filterParam.f_pre_agent_lvl;

    membersList(goodParam,isInside);
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
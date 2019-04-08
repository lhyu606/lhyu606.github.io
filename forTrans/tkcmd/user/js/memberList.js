/**
 * Created by yjp on 2018/4/25.
 */
// 初始化数据
var $, layer,size = 10;
window.pageIndex = 1;
var token = sessionStorage.getItem('token');
var filterParam = {
    'token': token,
    'size': size,
    'page': window.pageIndex
};

layui.use(['jquery', 'layer'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    
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
    //查看下级
    $('body').on('click','.teamNum',function () {
        var account = $(this).parents('td').siblings('.Uaccount').text();
        url = 'Referral.html?act='+ account;
        var perContent = layer.open({
            type: 2,
            title: '服务商下级列表',
            shadeClose: true,
            shade: 0.6,
            area: ['100%', '100%'],
            content: url
        });
        layer.full(perContent);
    });
    
    //导出Excel表
    $('#table2excel').click(function () {
        excelList();
        setTimeout(function () {
            $("#excelList").table2excel({
                exclude: ".noExl",
                name: "Worksheet Name",
                filename: "团员列表",//do not include extension
                exclude_img: true,
                exclude_links: true,
                exclude_inputs: true
            });
        },500)
    });
    // 存放Excel导出列表
    function excelList() {
        $.ajax({
            url: top.server_url + "/agency_management/membersList",
            type: "post",
            dataType: "json",
            data: {
                'token': token,
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
                            html += '<td class="Uaccount">'+ hidePhone(obj.account) +'</td>'

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

                            html += '<td>'+ obj.recommender +'</td>'
                            html += '<td class="clearfix"><span class="team_num">'+ obj.team_num +'</span></td>'
                            html += '<td class="clearfix"><span>'+ (obj.r_sub_total ? obj.r_sub_total : 0) +'个</span></td>'
                            html += '<td class="lvl1"><i>'+ (obj.real_sub_ea ? obj.real_sub_ea : 0) +'个</i></td>'
                            html += '<td>'+ (obj.freeze_money+obj.score).toFixed(2) +'元</td>'

                            if(obj.uuid && obj.ali_user_id) {
                                html += '<td style="color: #009688">有效</td>'
                            }
                            else if(!obj.uuid && !obj.ali_user_id) {
                                html += '<td style="color: #FF0000">未激活</td>'
                            }
                            else if(obj.uuid && !obj.ali_user_id) {
                                html += '<td style="color: #1E9FFF">支付宝未授权</td>'
                            }
                            else if(!obj.uuid && obj.ali_user_id) {
                                html += '<td style="color: #FFB800">未登录</td>'
                            }
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
 * param  token，lvl，acc，page，size
 * url  /agency_management/membersList
 */
function membersList(param, isInside) {
    $.ajax({
        url: top.server_url + "/agency_management/membersList",
        type: "post",
        dataType: "json",
        data: param,
        success: function(data) {
            if(data.status == 200) {
                $('.rolePlay', parent.document).text('团员');
                $('#memberSum', parent.document).text(data.payload.total ? data.payload.total : 0);  // 团队总人数
                $('#staffInfo tbody').empty();
                if(data.payload.total) window.allGoodAmount = data.payload.total;
                else    window.allGoodAmount = 0;

                if(!isInside)  setPage();

                if(data.payload.data) {
                    var staffList = data.payload.data;
                    $.each(staffList, function(index,obj) {
                        var html = '';
                        html += '<tr aid="' + obj.uid + '" account = "'+obj.account+'">'
                        if(obj.account != localStorage.getItem('userName')) {
                            html += '<td class="Uaccount">'+ hidePhone(obj.account) +'</td>'
                        } else {
                            html += '<td class="Uaccount">'+ obj.account +'</td>'
                        }

                        if(obj.pre_agent_lvl == 6)  html += '<td>总监</td>'
                        else if(obj.pre_agent_lvl == 4) html += '<td>服务商</td>'
                        else if(obj.pre_agent_lvl == 2) html += '<td>分公司</td>'
                        else if(obj.pre_agent_lvl == 1)  html += '<td>系统</td>'
                        else if(obj.pre_agent_lvl == 3)  html += '<td>管理组</td>'
                        else if(obj.pre_agent_lvl == 5)  html += '<td>业务组</td>'
                        else if(obj.pre_agent_lvl == 0) {
                            if(obj.vip_sid)     html += '<td>微淘客</td>'
                            else    html += '<td>普通用户</td>'
                        }

                        if((obj.account != localStorage.getItem('userName')) && (obj.pre_agent_lvl == 0)) {
                            html += '<td>'+ hidePhone(obj.recommender) +'</td>'
                        } else {
                            html += '<td>'+ obj.recommender +'</td>'
                        }
                        html += '<td class="clearfix"><span class="team_num">'+ obj.team_num +'</span></td>'
                        html += '<td class="clearfix"><span>'+ (obj.r_sub_total ? obj.r_sub_total : 0) +'个</span></td>'
                        html += '<td class="lvl1"><i>'+ (obj.real_sub_ea ? obj.real_sub_ea : 0) +'个</i></td>'
                        html += '<td>'+ (obj.freeze_money+obj.score).toFixed(2) +'元</td>'

                        if(obj.uuid && obj.ali_user_id) {
                            html += '<td style="color: #009688">有效</td>'
                        }
                        else if(!obj.uuid && !obj.ali_user_id) {
                            html += '<td style="color: #FF0000">未激活</td>'
                        }
                        else if(obj.uuid && !obj.ali_user_id) {
                            html += '<td style="color: #1E9FFF">支付宝未授权</td>'
                        }
                        else if(!obj.uuid && obj.ali_user_id) {
                            html += '<td style="color: #FFB800">未登录</td>'
                        }

                        html += '<td class="clearfix">'
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

                        // if(obj.isStaff == true) {
                        //     html += '<a class="layui-btn layui-btn-xs delToPoll" aid="'+ obj.uid +'"account="'+obj.account+'">剔除员工</a>'
                        // }
                        if(obj.team_num > 0) {
                            html += '<a class="layui-btn layui-btn-xs teamNum" ' +
                                'aid="'+ obj.uid +'"account="'+obj.account+'" title="点击查看下线详情">查看下级</a>'
                        } else {
                            html += '<a class="layui-btn layui-btn-xs noSub">暂无下级</a>'
                        }
                        html += '</div>'
                        html += '</td>'
                        html += '</tr>'
                        $('#staffInfo tbody').append(html);
                    });
                } else {
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="11">暂无数据！</td></tr>';
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
        'page': window.pageIndex
    };
    if(filterParam.acc)   goodParam.acc = filterParam.acc;
    membersList(goodParam,isInside);
}
firstGoodsInfo();

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
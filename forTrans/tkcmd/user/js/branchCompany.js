/**
 * Created by yjp on 2018/5/22.
 */

layui.use(['jquery', 'layer', 'table', 'tree'], function () {
    var $ = layui.jquery;  //jquery
    var layer = layui.layer;  //弹层
    var table = layui.table;  //表格
    var token = sessionStorage.getItem('token');
    
    // 初始化数据
    var size = 10;
    window.pageIndex = 1;
    var filterParam = {
        'token': token,
        'size': size,
        'page': window.pageIndex
    };


    if(sessionStorage.getItem('areaManage')) {
        $('.fws_div').removeClass('hide');
    }
    firstGoodsInfo();  //访问加载页面
    $('.wtkCount').text(sessionStorage.getItem('wtk_count'));  //获取微淘客名额
    $('.jyCount').text(sessionStorage.getItem('jy_count'));  //获取总监名额
    $('.fwsCount').text(sessionStorage.getItem('fws_count'));  //获取服务商名额

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
        var perContent = layer.open({
            type: 2,
            title: '数据汇总',
            shadeClose: true,
            shade: 0.6,
            area: ['100%', '100%'],
            content: escapeHtml(url)
        });
        layer.full(perContent);
    });

    //查看当前账号服务商
    $('body').on('click','.lookFiliale',function () {
        var pdata = {
            'acc': $(this).attr('acc'),
            'uid': $(this).attr('uid'),
            'pal': $(this).attr('pal')
        }
        url = 'filialeManage.html?pdata='+ JSON.stringify(pdata);
        var perContent = layer.open({
            type: 2,
            title: '下级服务商',
            shadeClose: true,
            shade: 0.6,
            area: ['100%', '100%'],
            content: escapeHtml(url)
        });
        layer.full(perContent);
    });
    //查看当前账号总监
    $('body').on('click','.lookDirector',function () {
        var pdata = {
            'acc': $(this).attr('acc'),
            'uid': $(this).attr('uid'),
            'pal': $(this).attr('pal')
        }
        url = 'directorManage.html?pdata='+ JSON.stringify(pdata);
        var perContent = layer.open({
            type: 2,
            title: '下级总监',
            shadeClose: true,
            shade: 0.6,
            area: ['100%', '100%'],
            content: escapeHtml(url)
        });
        layer.full(perContent);
    });

    //查看下级
    $('body').on('click','.lookNext',function () {
        var account = $(this).parents('td').siblings('.Uaccount').text();
        url = 'Referral.html?act='+ account;
        var perContent = layer.open({
            type: 2,
            title: '下级列表',
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
                filename: "分公司列表",//do not include extension
                exclude_img: true,
                exclude_links: true,
                exclude_inputs: true
            });
        },500)
    });
    // 存放Excel导出列表
    function excelList() {
        $.ajax({
            url: top.server_url + "/agency_management/getAgent2List",
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


    /**
     * 获取分公司列表
     * @param  token
     * url//agency_management/getAgent2List
     */
    function membersList(param, isInside) {
        $.ajax({
            url: top.server_url + "/agency_management/getAgent2List",
            type: "post",
            dataType: "json",
            data: param,
            success: function(data) {
                if(data.status == 200) {
                    $('#memberSum').text(data.payload.total ? data.payload.total : 0);  // 团队总人数
                    $('#staffInfo tbody').empty();
                    if(data.payload.total)
                        window.allGoodAmount = data.payload.total;
                    else
                        window.allGoodAmount = 0;
                    
                    if(!isInside)  setPage();

                    if(data.payload.agent2List) {
                        var staffList = data.payload.agent2List;
                        $.each(staffList, function(index,obj) {
                            var html = '';
                            html += '<tr aid="' + obj.uid + '" account = "'+obj.account+'">'
                            html += '<td class="Uaccount">'+ obj.account +'</td>'
                            html += '<td class="clearfix"><span class="team_num">'+ obj.team_num +'</span></td>'
                            html += '<td class="clearfix"><span>'+ (obj.r_sub_total ? obj.r_sub_total : 0) +'个</span></td>'
                            html += '<td class="lvl1"><i>'+ (obj.real_sub_ea ? obj.real_sub_ea : 0) +'个</i></td>'
                            html += '<td>'+ (obj.freeze_money+obj.score).toFixed(2) +'元</td>'
                            html += '<td>'
                            html += '<div class="layui-table-cell padding0">'
                            html += '<a class="layui-btn layui-btn-xs lookDataRpt" acc="'+ obj.account +'" uid="'+ obj.uid +'" pal="'+ obj.pre_agent_lvl +'">查看报表</a>'
                            html += '<a class="layui-btn layui-btn-xs lookFiliale" acc="'+ obj.account +'" uid="'+ obj.uid +'" pal="'+ obj.pre_agent_lvl +'">查看服务商</a>'
                            html += '<a class="layui-btn layui-btn-xs lookDirector" acc="'+ obj.account +'" uid="'+ obj.uid +'" pal="'+ obj.pre_agent_lvl +'">查看总监</a>'
                            if(obj.team_num > 0) {
                                html += '<a class="layui-btn layui-btn-xs lookNext" account="'+ obj.account +'">查看下级</a>'
                            } else {
                                html += '<a class="layui-btn layui-btn-xs noSub">暂无下级</a>'
                            }
                            html += '</div>'
                            html += '</td>'
                            html += '</tr>'
                            $('#staffInfo tbody').append(html);
                        });
                    } else {
                        var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="6">暂无数据！</td></tr>';
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
            error: function (jqXhr, textStatus, errorThrown) {
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
});


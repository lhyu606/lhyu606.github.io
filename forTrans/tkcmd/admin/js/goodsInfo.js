/**
 * Created by yjp on 2017/10/26.
 */
var $,layer,table,laydate,element, label,pool_type;
var size = 10;
window.pageIndex = 1;
var token = sessionStorage.getItem('adminToken');
var role = sessionStorage.getItem('adminRole');
var filterParam = {
    'token': token,
    'size': size,
    'page': window.pageIndex
}

layui.use(['laydate', 'layer', 'table', 'element', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    element = layui.element;  //元素操作
    form = layui.form;

    firstGoodsInfo();  //访问加载页面
    getEssenceList();  //加载榜单数据
    if(!token) top.location.href = "login.html";


    //搜索
    $('.search').click(function () {
        pool_type = $('#interest1 option:selected').attr('value');
        var searchInfo = $("#searchInfo").val();
        filterParam.key_word = searchInfo;
        firstGoodsInfo();
    });

    $('.goodLabel a').click(function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        label = $(this).attr('labKey');
        if (label == "video") {
        } else if (label == "isCheap") {
        }
        if (label != "all") {
            filterParam[label] = true;
        }
        firstGoodsInfo();
    })
    //标签选择
    $('.good_list a').click(function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        var tag = $(this).attr('tagKey');
        if (tag === "全部") {
            delete filterParam.tag;
        } else {
            filterParam.tag = tag;
        }
        firstGoodsInfo();
    });
    //单选
    $('body').on('click', '.cbClick', function () {
        var th = $(this);
        if(th.hasClass('layui-form-checked')) {
            $(this).removeClass('layui-form-checked');
        } else {
            $(this).addClass('layui-form-checked');
        }
    });
    //全选
    $('body').on('click', '.allClick', function () {
        var th = $(this);
        if(th.hasClass('layui-form-checked')) {
            $(this).removeClass('layui-form-checked');
            $("#goodsInfo>tbody").find('.cbClick').removeClass('layui-form-checked');
        } else {
            $(this).addClass('layui-form-checked');
            $("#goodsInfo>tbody").find('.cbClick').addClass('layui-form-checked');
        }
    });
    //榜单选择
    $('body').on('click','.listType',function (e) {
        $('#interest').toggle();
        $('#groupList').hide();
        return false;
    })
    $('body').on('click','.essence',function (e) {
        $('.listType').val($(this).text());
        var essence_id = $(this).attr('value');//获取组信息
        pool_type = $(this).attr('gtype');//商品库
        getEssence(essence_id);
        $('#interest').hide();
        return false;
    })
    $('body').on('click','.groupType',function (e) {
        $('#groupList').toggle();
        // $('#groupList').show();
        return false;
    })
    $('body').on('click','.group',function (e) {
        $('.groupType').val($(this).text());
        pool_type = $(this).attr('gtype');//商品库
        $('#groupList').hide();
        return false;
    })
    //隐藏榜单
    $(document).click(function () {
        $('#groupList').hide();
        $('#interest').hide();
    })

    //添加到库（单个）
    $('body').on('click', '.addToPoll', function () {
        var aid = [];
        aid.push($(this).attr('aid'));

        if (pool_type !== "") {
            var pollParam = {
                'token': token,
                'ids': JSON.stringify(aid)
            };
            pollParam.pool_type = pool_type;
            if(pollParam.pool_type == 4) {
                addParamToFreePool(pollParam);
            } else {
                selectedToPoll(pollParam);
            }
        } else {
            layer.msg("请选择库的类型！")
        }
    });
    //添加到库（多个）
    //如果选添加免单商品的则需要添加而外的参数
    function checkFreeGoodsparam(pollParam) {
        if(isNaN(pollParam.group_buy_num) || !pollParam.group_buy_num || !pollParam.start_date || !pollParam.end_date ||
            isNaN(pollParam.left_num) || !pollParam.left_num || isNaN(pollParam.total_num) || !pollParam.total_num) {
            layer.msg("参数不为空或者数据类型错误！！")
        } else {
            selectedToPoll(pollParam);
        }
    }
    function addParamToFreePool(pollParam) {
        var html = '';
        html += '<form class="layui-form" action="">';
        html += '<div class="layui-form-item" style="margin: 20px 0 0 0">';
        html += '<label class="layui-form-label">助力人数</label>';
        html += '<div class="layui-input-inline">';
        html += '<input type="text" id="group_buy_num" name="group_buy_num" placeholder="助力人数" class="layui-input">';
        html += '</div>';
        html += '</div>';

        html += '<div class="layui-form-item" style="margin: 20px 0 0 0">';
        html += '<label class="layui-form-label">开始时间</label>';
        html += '<div class="layui-input-inline">';
        html += '<input type="text" name="start_date" class="layui-input" autocomplete="off" id="startTime" placeholder="yyyy-MM-dd" lay-key="1">';
        html += '</div>';
        html += '</div>';

        html += '<div class="layui-form-item" style="margin: 20px 0 0 0">';
        html += '<label class="layui-form-label">结束时间</label>';
        html += '<div class="layui-input-inline">';
        html += '<input type="text" name="end_date" class="layui-input" autocomplete="off" id="endTime" placeholder="yyyy-MM-dd" lay-key="2">';
        html += '</div>';
        html += '</div>';

        html += '<div class="layui-form-item" style="margin: 20px 0 0 0">';
        html += '<label class="layui-form-label">剩余件数</label>';
        html += '<div class="layui-input-inline">';
        html += '<input type="text" id="left_num" name="left_num" placeholder="剩余件数" class="layui-input">';
        html += '</div>';
        html += '</div>';

        html += '<div class="layui-form-item" style="margin: 20px 0 0 0">';
        html += '<label class="layui-form-label">总件数</label>';
        html += '<div class="layui-input-inline">';
        html += '<input type="text" id="total_num" name="total_num" placeholder="总件数" class="layui-input">';
        html += '</div>';
        html += '</div>';

        html += '<div class="layui-form-item">';
        html += '<div class="layui-input-block">';
        html += '<button type="button" class="layui-btn sure" style="margin-top: 20px">确定</button>';
        html += '</div>';
        html += '</div>';
        html += '</form>';

        layer.open({
            type: 1,
            title: '免单商品条件设置',
            shadeClose: false,
            shade: 0.5,
            area: ['370px', '50%'],
            content: html
        });
        //日期选择（开始时间）
        laydate.render({
            elem: '#startTime'
            ,type: 'datetime'
        });
        //日期选择（结束时间）
        laydate.render({
            elem: '#endTime'
            ,type: 'datetime'
        });

        $('.sure').click(function() {
            pollParam.group_buy_num = $("[name='group_buy_num']").val();
            pollParam.start_date = $("[name='start_date']").val();
            pollParam.end_date = $("[name='end_date']").val();
            pollParam.left_num = $("[name='left_num']").val();
            pollParam.total_num = $("[name='total_num']").val();
            checkFreeGoodsparam(pollParam);
        });
    }

    $('.addToPolls').click(function () {
        var aids = [];
        var goodCheck = $("#goodsInfo>tbody").find('.layui-form-checked');

        for(var i = 0; i < goodCheck.length; i++) {		//获取复选框中选中的值(传多个勾选值)
            var goodId = goodCheck.eq(i).parents('tr').attr('aid');
            aids.push(goodId);
        }

        if (pool_type !== "" && aids.length != 0) {
            var pollParam = {
                'token': token,
                'ids': JSON.stringify(aids)
            };
            pollParam.pool_type = pool_type;
            if(pollParam.pool_type == 4) {
                addParamToFreePool(pollParam);
            } else {
                selectedToPoll(pollParam);
            }
        } else {
            layer.msg("请选择榜单的类型或勾选商品！")
        }
    });

    // 删除商品（单个）
    $('body').on('click', '.deleteGood', function () {
        var auctionId = $(this).attr('auctionId');
        var param = {
            token: token,
            auctionId: auctionId
        }
        deleteGood(param);
    })
    // 删除商品（多个）
    $('.deleteGoods').click(function () {
        var aids = [];
        var goodCheck = $("#goodsInfo>tbody").find('.layui-form-checked');

        for(var i = 0; i < goodCheck.length; i++) {		//获取复选框中选中的值(传多个勾选值)
            var goodId = goodCheck.eq(i).parents('tr').attr('auctionId');
            aids.push(goodId);
        }

        if(aids.length != 0) {
            var pollParam = {
                'token': token,
                'list': JSON.stringify(aids)
            };
            deleteGood(pollParam);
        } else {
            layer.msg("请选择要删除的商品！")
        }
    });

    //观看视频时返回顶部
    $('body').on('click', '.playVideo', function (e) {
        $('.layui-body',parent.document).animate({scrollTop: 0}, 100);
    });


    // 视频播放
    function playVideo(videoUrl, goodShortTitle) {
        layui.use('layer', function() {
            var layer = layui.layer;
            layer.open({
                type: 2,
                title: goodShortTitle,
                shadeClose: true,
                fix: false,
                shade: [0.5,'#000'],
                maxmin: true, //开启最大化最小化按钮
                area: ['640px','360px'],
                offset: ['200px'],
                anim: 2,
                content: [videoUrl,'no']    //iframe的url，no代表不显示滚动条
            });
        });
    }

    /**
     * 商品信息列表.
     * param：token, tag, size, page, sort_id (sort_sale,sort_price,sort_coupon,sort_comm)
     * url：//preferred/filter
     */
    function goodsList(param, isInside) {
        $.ajax({
            url: server_url + "/preferred/filter",
            type: "post",
            dataType: "json",
            data: param,
            success: function (data) {
                if (data.status == 200) {
                    $('#goodsInfo tbody').empty();

                    if (data.payload.total) window.allGoodAmount = data.payload.total;
                    else window.allGoodAmount = 0;

                    if (!isInside) setPage();

                    if (data.payload.data) {
                        var goodList = data.payload.data;
                        $.each(goodList, function (index,obj) {
                            var html = '';
                            html += '<tr aid="'+ obj.id +'" auctionId="'+ obj.auctionId +'">'
                            html += '<td>'
                            html += '<input type="checkbox"/>'
                            html += '<label for="checkAll1">'
                            html += '<div class="cbClick layui-unselect layui-form-checkbox" lay-skin="primary">'
                            html += '<i class="layui-icon"></i>'
                            html += '</div>'
                            html += '</label>'
                            html += '</td>'
                            html += '<td>' + obj.id + '</td>'
                            html += '<td>' + obj.auctionId + '</td>'
                            html += '<td><img src="' + obj.pictUrl+'_100x100.jpg' + '"/></td>'
                            html += '<td>' + obj.title + '</td>'
                            html += '<td>' + obj.shopTitle + '</td>'
                            html += '<td>' + obj.biz30day + '</td>'
                            html += '<td>￥' + obj.zkPrice + '</td>'
                            html += '<td>￥' + obj.hiddenAmount + '</td>'
                            html += '<td>￥' + ((obj.zkPrice-obj.hiddenAmount)*obj.realTkRate/100).toFixed(2) + '</td>'
                            html += '<td>' + updateDate(obj.updated_date) + '</td>'
                            html += '<td>'
                            html += '<div class="layui-table-cell laytable-cell-1-10 padding0">'
                            html += '<a class="layui-btn layui-btn-xs addToPoll" aid="' + obj.id + '">添加</a>'
                            html += '<a class="layui-btn layui-btn-xs deleteGood" auctionId="'+ obj.auctionId +'">删除</a>'
                            if (obj.mp4Url) {
                                html += "<a class='layui-btn layui-btn-xs playVideo' " +
                                    "onclick='playVideo(\""+ obj.mp4Url +"\",\""+ obj.goodShortTitle +"\");'>观看视频</a>"
                            }
                            html += '</div>'
                            html += '</td>'
                            html += '</tr>'
                            $('#goodsInfo tbody').append(html);
                        });
                    } else {
                        var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="12">暂无数据！</td></tr>';
                        $('tbody').append(noData);
                    }
                } else if (data.status == 403) {
                    top.location.href = "login.html";
                } else {
                    layer.msg(data.err)
                }
            },
            error: function(jqXhr, textStatus, errorThrown) {
                var msg = "网络错误，请联系管理员或稍后重试！";
                layer.open({
                    content: msg
                    ,time: 3
                });
            }
        });
    }

    /**
     * 加入库
     * param：token, ids, pool_type
     * url：/boutique_pool/selectedToPoll
     */
    function selectedToPoll(param) {
        $.ajax({
            url: server_url + "/boutique_pool/selectedToPoll",
            type: "post",
            dataType: "json",
            data: param,
            success: function (data) {
                if (data.status == 200) {
                    layer.msg("添加成功！")
                } else {
                    layer.msg(data.err)
                }
            },
            error: function(jqXhr, textStatus, errorThrown) {
                var msg = "网络错误，请联系管理员或稍后重试！";
                layer.open({
                    content: msg
                    ,time: 3
                });
            }
        });
    }

    /**
     * 移除商品
     * @param  token  auctionId
     * url/tao_goods/delete
     */
    function deleteGood(param) {
        $.ajax({
            url: server_url + "/tao_goods/delete",
            type: "post",
            dataType: "json",
            data: param,
            success: function (data) {
                if (data.status == 200) {
                    layer.msg("删除成功！");
                    firstGoodsInfo(true);
                } else {
                    layer.msg(data.err)
                }
            },
            error: function(jqXhr, textStatus, errorThrown) {
                var msg = "网络错误，请联系管理员或稍后重试！";
                layer.open({
                    content: msg
                    ,time: 3
                });
            }
        });
    }

    //获取榜单信息
    function getEssenceList() {
        $.ajax({
            url: server_url+"/essence/getEssenceList",
            type: "post",
            dataType: "json",
            data: '',
            success: function (data) {
                if (data.status == 200) {
                    var h = '';
                    if(data.payload.essenceInfo) {
                        var essenceInfo = data.payload.essenceInfo;
                        $.each(essenceInfo,function (i) {
                            var info = essenceInfo[i];
                            if(role=='select') {
                                if(info.id==6 || info.id==7 || info.id==3) {
                                    h += '<li class="essence" value="'+info.id+'" gtype = "'+info.good_list_type+'">'+info.title+'</li>'
                                }
                            }
                            else {
                                h += '<li class="essence" value="'+info.id+'" gtype = "'+info.good_list_type+'">'+info.title+'</li>'
                            }
                        })
                        $('.essence').remove();
                        $('#interest').append(h);
                    }
                    else {
                        h += '<li class="essence" value="" gtype="">暂无类型</li>'
                        $('.essence').remove();
                        $('#interest').append(h);
                    }

                } else {
                    $('#interest').empty()
                }
            },
            error: function(jqXhr, textStatus, errorThrown) {
                var msg = "网络错误，请联系管理员或稍后重试！";
                layer.open({
                    content: msg
                    ,time: 3
                });
            }
        });
    }

    //获取精品榜单（组）
    function getEssence(essence_id) {
        $.ajax({
            url: server_url+"/essence/getEssence",
            type: "post",
            dataType: "json",
            data: {
                essence_id:essence_id
            },
            success: function (data) {
                if (data.status == 200) {
                    var h = '';
                    if(data.payload.groups){
                        $('.fineGroup').removeClass('hide');
                        var res = data.payload.groups;
                        $.each(res,function (i) {
                            var info = res[i];
                            h += '<li class="group" value="'+i+'" eid ="'+info.id+'" gtype = "'+info.good_list_type+'">'+info.title+'</li>'
                        })
                        $('.group').remove();
                        $('#groupList').append(h);
                    }
                    else{
                        $('.fineGroup').addClass('hide');
                    }
                } else {
                    layer.msg(data.err)
                }
            },
            error: function(jqXhr, textStatus, errorThrown) {
                var msg = "网络错误，请联系管理员或稍后重试！";
                layer.open({
                    content: msg
                    ,time: 3
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
        if(filterParam.key_word && $("#searchInfo").val())  goodParam.key_word = filterParam.key_word;
        if(filterParam[label])                              goodParam[label] = true;
        if(filterParam.tag)                                 goodParam.tag = filterParam.tag;

        goodsList(goodParam, isInside);
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
                firstGoodsInfo(true);;
            }
        }
    }

});


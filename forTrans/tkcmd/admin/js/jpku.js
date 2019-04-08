/**
 * Created by Administrator on 2017/10/26.
 */
layui.use(['laydate', 'layer', 'table', 'element', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    element = layui.element;  //元素操作
    form = layui.form;

    var size = 10;
    window.pageIndex = 1;
    var token = sessionStorage.getItem('adminToken');
    var filterParam = {
        'token': token,
        'size': size,
        'page': window.pageIndex
    }


    if(!token) top.location.href = "login.html";

    getEssenceList();
    firstGoodsInfo();  //访问加载页面
    //搜索
    $('.search').click(function () {
        var searchInfo = $("#searchInfo").val();
        filterParam.auctionId = searchInfo;
        firstGoodsInfo();
    });
    //商品榜单
    $('body').on('click', '.goodLabel a', function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        var label = $(this).attr('labKey');
        filterParam.pool_type = label;
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
            $("#goodsInfo tbody").find('.cbClick').removeClass('layui-form-checked');
        } else {
            $(this).addClass('layui-form-checked');
            $("#goodsInfo tbody").find('.cbClick').addClass('layui-form-checked');
        }
    });
    //删除（单个）
    $('body').on('click', '.delete', function () {
        var aid = [];
        aid.push($(this).attr('aid'));

        var delParam = {
            'token': token,
            'ids': JSON.stringify(aid)
        };
        delGoods(delParam);
    });
    //删除（多个）
    $('.delete_check').click(function () {
        var aids = [];
        var goodCheck = $("#goodsInfo tbody").find('.layui-form-checked');

        for(var i = 0; i < goodCheck.length; i++) {		//获取复选框中选中的值(传多个勾选值)
            var goodId = goodCheck.eq(i).parents('tr').attr('aid');
            aids.push(goodId);
        }

        var delParam = {
            'token': token,
            'ids': JSON.stringify(aids)
        };
        delGoods(delParam);
    });
    //观看视频时返回顶部
    $('body').on('click', '.playVideo', function (e) {
        $('.layui-body',parent.document).animate({scrollTop: 0}, 100);
    });
    //修改免单商品参数
    $('body').on('click', '.edit', function () {
        var hiddenText = $(this).prev();
        var good = JSON.parse(hiddenText.attr('v'));
        renderFreeFrom(good)
    });

    function renderFreeFrom(param) {
        var html = '';
        html += '<form class="layui-form" action="">';
        html += '<div class="layui-form-item" style="margin: 20px 0 0 0">';
        html += '<label class="layui-form-label">助力人数</label>';
        html += '<div class="layui-input-inline">';
        html += '<input type="text" id="group_buy_num" name="group_buy_num" placeholder="助力人数" class="layui-input" value=" '+ param.group_buy_num +'">';
        html += '</div>';
        html += '</div>';

        html += '<div class="layui-form-item" style="margin: 20px 0 0 0">';
        html += '<label class="layui-form-label">开始时间</label>';
        html += '<div class="layui-input-inline">';
        html += '<input type="text" name="start_date" class="layui-input" autocomplete="off" id="startTime" placeholder="yyyy-MM-dd" lay-key="1" value="'+ simpleDateFormat(param.start_date) +'">';
        html += '</div>';
        html += '</div>';

        html += '<div class="layui-form-item" style="margin: 20px 0 0 0">';
        html += '<label class="layui-form-label">结束时间</label>';
        html += '<div class="layui-input-inline">';
        html += '<input type="text" name="end_date" class="layui-input" autocomplete="off" id="endTime" placeholder="yyyy-MM-dd" lay-key="2" value="'+ simpleDateFormat(param.end_date) +'">';
        html += '</div>';
        html += '</div>';

        html += '<div class="layui-form-item" style="margin: 20px 0 0 0">';
        html += '<label class="layui-form-label">剩余件数</label>';
        html += '<div class="layui-input-inline">';
        html += '<input type="text" id="left_num" name="left_num" placeholder="剩余件数" class="layui-input" value="'+ param.left_num +'">';
        html += '</div>';
        html += '</div>';

        html += '<div class="layui-form-item" style="margin: 20px 0 0 0">';
        html += '<label class="layui-form-label">总件数</label>';
        html += '<div class="layui-input-inline">';
        html += '<input type="text" id="total_num" name="total_num" placeholder="总件数" class="layui-input" value="'+ param.total_num +'">';
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
            var freeGoodParam = {};
            freeGoodParam.id = param.id;
            freeGoodParam.group_buy_num = $("[name='group_buy_num']").val();
            freeGoodParam.start_date = $("[name='start_date']").val();
            freeGoodParam.end_date = $("[name='end_date']").val();
            freeGoodParam.left_num = $("[name='left_num']").val();
            freeGoodParam.total_num = $("[name='total_num']").val();
            checkFreeGoodsparam(freeGoodParam);
        });
    }
    function checkFreeGoodsparam(pollParam) {
        if(isNaN(pollParam.group_buy_num) || !pollParam.group_buy_num || !pollParam.start_date || !pollParam.end_date ||
            isNaN(pollParam.left_num) || !pollParam.left_num || isNaN(pollParam.total_num) || !pollParam.total_num) {
            layer.msg("参数不为空或者数据类型错误！！")
        } else {
            pollParam.token = token;
            updateFreeGoodParam(pollParam);
        }
    }
    function updateFreeGoodParam(param) {
        $.ajax({
            url: server_url + "/boutique_pool/updateFreeParam",
            type: "post",
            dataType: "json",
            data: param,
            success: function (data) {
                if (data.status == 200) {
                    layer.msg(data.payload);
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
    //获取榜单信息
    function getEssenceList() {
        $.ajax({
            url: server_url+"/essence/getEssenceList",
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.status == 200) {
                    var h = '<a class="layui-btn layui-btn-radius" labKey="">不限</a>';
                    var essenceInfo = data.payload.essenceInfo;
                    $.each(essenceInfo,function (index,obj) {
                        if(sessionStorage.getItem('role') == 'select') {
                            if(obj.id==6 || obj.id==7 || obj.id==3) {
                                h += '<a class="layui-btn layui-btn-primary layui-btn-radius" labKey="'+ obj.good_list_type +'">'+ obj.title +'</a>'
                            }
                        } else {
                            h += '<a class="layui-btn layui-btn-primary layui-btn-radius" labKey="'+ obj.good_list_type +'">'+ obj.title +'</a>'
                        }
                    });
                    $('.goodLabel').empty().append(h);
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
     * 库列表
     * param：token, size, page, pool_type(可不传)
     * url：/boutique_pool/goodsList
     */
    function goodsList(param, isInside) {
        $.ajax({
            url: server_url + "/boutique_pool/goodsList",
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
                            html += '<tr aid="' + obj.id + '">'
                            html += '<td>'
                            html += '<input type="checkbox"/>'
                            html += '<label for="checkAll1">'
                            html += '<div class="cbClick layui-unselect layui-form-checkbox" lay-skin="primary">'
                            html += '<i class="layui-icon"></i>'
                            html += '</div>'
                            html += '</label>'
                            html += '</td>'
                            html += '<td>' + obj.auctionId + '</td>'
                            html += '<td><img src="' + obj.pictUrl+'_100x100.jpg' + '"/></td>'
                            html += '<td>' + obj.title + '</td>'
                            html += '<td>' + obj.shopTitle + '</td>'
                            html += '<td>' + obj.biz30day + '</td>'
                            html += '<td>￥' + obj.zkPrice + '</td>'
                            html += '<td>￥'+ obj.hiddenAmount +'</td>'
                            html += '<td>￥'+ (obj.zkPrice-obj.hiddenAmount).toFixed(2) +'</td>'

                            if(param.pool_type == 4) {
                                html += '<td>' + simpleDateFormat(obj.start_date) + '</td>';
                                html += '<td>' + simpleDateFormat(obj.end_date) + '</td>';
                                if(new Date(obj.start_date).getTime() < new Date().getTime() && new Date(obj.end_date).getTime() > new Date().getTime()) {
                                    html += '<td style="color: #1E9FFF">有效</td>';
                                } else if( new Date(obj.end_date).getTime() < new Date().getTime() ){
                                    html += '<td style="color: #1E9FFF">失效</td>';
                                } else if(new Date(obj.start_date).getTime() > new Date().getTime()){
                                    html += '<td style="color: #1E9FFF">未开始</td>';
                                }
                            } else {
                                html += '<td>无</td>';
                                html += '<td>无</td>';
                                html += '<td style="color: #1E9FFF">有效</td>';
                            }
                            html += '<td>'
                            html += '<div class="layui-table-cell laytable-cell-1-10 padding0">'
                            if(param.pool_type == 4) {
                                html += '<input type="hidden" ';
                                html += 'v="'+ escapeHtml(JSON.stringify(obj)) +'"';
                                html += '/>';
                                html += '<a class="layui-btn layui-btn-xs edit" aid="' + obj.id + '" >修改</a>'
                            } else {
                                html += '<a class="layui-btn layui-btn-xs delete" aid="' + obj.id + '">删除</a>'
                            }
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
                        var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="10">暂无数据！</td></tr>';
                        $('tbody').append(noData);
                    }
                } else if (data.status == 403) {
                    window.location.href = "login.html";
                } else {
                    layer.msg(data.err);
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
     * 删除库商品
     * param：token, ids
     * url：/boutique_pool/delGoods
     */
    function delGoods(param) {
        $.ajax({
            url: server_url + "/boutique_pool/delGoods",
            type: "post",
            dataType: "json",
            data: param,
            success: function (data) {
                if (data.status == 200) {
                    firstGoodsInfo(true);  //删除成功刷新列表页
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
        if(filterParam.pool_type != "")  goodParam.pool_type = filterParam.pool_type;
        if(filterParam.auctionId)  goodParam.auctionId = filterParam.auctionId;
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
                firstGoodsInfo(true);
            }
        }
    }
});


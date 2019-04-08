/**
 * Created by yjp on 2018/11/12.
 */
var $,layer,table,laydate,element,form,label,size = 10;
var sort_k2v = { '最新商品': 'sort_id', '销量最高': 'sort_biz30day', '佣金最高': 'sort_tkCommFee', '价格最低': 'sort_zkPrice' };
window.pageIndex = 1;
var token = sessionStorage.getItem('adminToken');
var filterParam = {
    'token': token,
    'size': size,
    'page': window.pageIndex
}

layui.use(['laydate', 'layer', 'form', 'table', 'element'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    element = layui.element;  //元素操作
    form = layui.form;  //元素操作


    firstGoodsInfo();  //访问加载页面
    if(!token) top.location.href = "login.html";


    // 搜索
    $('.search').click(function () {
        var searchInfo = $("#searchInfo").val();
        filterParam.key_word = searchInfo;
        window.pageIndex = filterParam.page = 1;
        firstGoodsInfo();
    });
    // 商品分类
    $('.good_list a').click(function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        var fqCat = $(this).attr('fqCat');
        if (fqCat) {
            filterParam.fqCat = fqCat;
        } else {
            delete filterParam.fqCat;
        }
        window.pageIndex = filterParam.page = 1;
        firstGoodsInfo();
    });
    // 条件筛选
    $('.good_filter a').click(function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        filterParam.sortName = $(this).attr('sortKey');
        if(filterParam.sortName) {
            filterParam.sortKey = sort_k2v[filterParam.sortName];
        }
        window.pageIndex = filterParam.page = 1;
        firstGoodsInfo();
    });
    // 是否天猫商品
    form.on('checkbox(isTMall)', function(data) {
        var checked = data.elem.checked;
        if(checked == true)  filterParam.isTMall = 1;
        else if(checked == false)  filterParam.isTMall = 0;
        window.pageIndex = filterParam.page = 1;
        firstGoodsInfo();
    });
    // 范围筛选
    $('.filter').click(function () {
        var lowPrice = $('input[name="lowPrice"]').val();
        var highPrice = $('input[name="highPrice"]').val();
        var lowComm = $('input[name="lowComm"]').val();
        var highComm = $('input[name="highComm"]').val();

        if(lowPrice) filterParam.lowPrice = lowPrice
        else delete filterParam.lowPrice
        if(highPrice) filterParam.highPrice = highPrice
        else delete filterParam.highPrice
        if(lowComm) filterParam.lowComm = lowComm
        else delete filterParam.lowComm
        if(highComm) filterParam.highComm = highComm
        else delete filterParam.highComm
        window.pageIndex = filterParam.page = 1;
        firstGoodsInfo();
    })

    // 单选
    $('body').on('click', '.cbClick', function () {
        var th = $(this);
        if(th.hasClass('layui-form-checked')) {
            $(this).removeClass('layui-form-checked');
        } else {
            $(this).addClass('layui-form-checked');
        }
    });
    // 全选
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

    // 编辑
    $('body').on('click', '.editGood', function () {
        sessionStorage.setItem('getGoodInfo',$(this).attr('v'));
        var perContent = layer.open({
            type: 2,
            title: '商品编辑',
            shadeClose: true,
            shade: 0.6,
            area: ['100%', '100%'],
            content: 'editGoodInfo.html'
        });
        layer.full(perContent);
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
    // 观看视频时返回顶部
    $('body').on('click', '.playVideo', function (e) {
        $('.layui-body',parent.document).animate({scrollTop: 0}, 100);
    });

});


/**
 * 商品信息列表.
 * param：token, fqCat, size, page, sort_id (sort_sale,sort_price,sort_coupon,sort_comm)
 * url：/preferred/filter
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
                        html += '<td>￥' + obj.couponAfterpri + '</td>'
                        html += '<td>￥' + ((obj.zkPrice-obj.hiddenAmount)*obj.realTkRate/100).toFixed(2) + '</td>'
                        html += '<td>' + updateDate(obj.updated_date) + '</td>'
                        html += '<td>'
                        html += '<div class="layui-table-cell laytable-cell-1-10 padding0">'
                        html += '<a class="layui-btn layui-btn-xs editGood" v="'+ escapeHtml(JSON.stringify(obj)) +'">编辑</a>'
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
            layer.open({
                content: "网络错误，请联系管理员或稍后重试！"
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
            layer.open({
                content: "网络错误，请联系管理员或稍后重试！"
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
    if(filterParam.key_word)  goodParam.key_word = filterParam.key_word;
    if(filterParam.fqCat)  goodParam.fqCat = filterParam.fqCat;

    if(filterParam.sortName) {
        goodParam[filterParam.sortKey] = true;
        if(filterParam.sortName == '价格最低') {
            goodParam.isAsc = true;
        } else {
            goodParam.isAsc = false;
        }
    }

    if(filterParam.lowPrice)  goodParam.lowPrice = filterParam.lowPrice;
    if(filterParam.highPrice)  goodParam.highPrice = filterParam.highPrice;
    if(filterParam.lowComm)  goodParam.lowComm = filterParam.lowComm;
    if(filterParam.highComm)  goodParam.highComm = filterParam.highComm;
    if(filterParam.isTMall)  goodParam.isTMall = filterParam.isTMall;

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

/**
 * Created by yjp on 2018/8/29.
 */
var par = parseURL(window.location.href);
var $,element,layer,table,laydate;
var size = 10;
window.pageIndex = 1;
var token = sessionStorage.getItem('adminToken');
var filterParam = {
    'token': token,
    'belong_id': par.params.bid,
    'size': size,
    'page': window.pageIndex
}

layui.use(['element','jquery','laydate','layer','table'], function () {
    $ = layui.jquery;  //jquery
    element = layui.element;  //元素操作
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');

    firstInfo();  //访问加载页面


    //上架
    $('body').on('click', '.upGood', function () {
        var delParam = {
            'token': token,
            'is_publish': 1,
            'id': $(this).attr('gid')
        };
        offGoods(delParam);
    });
    //下架
    $('body').on('click', '.downGood', function () {
        var delParam = {
            'token': token,
            'is_publish': 0,
            'id': $(this).attr('gid')
        };
        offGoods(delParam);
    });


    //编辑具体规格商品
    $('body').on('click', '.edit', function () {
        var hiddenText = $(this).prev();
        sessionStorage.setItem('filter',hiddenText.attr('v'));
        layer.open({
            type: 2,
            title: '编辑具体规格商品',
            shadeClose: true,
            shade: 0.4,
            area: ['690px', '62%'],
            content: 'subEdit.html?gid='+ $(this).attr('gid') +'&isSub=1'
        });
    });

});


/**
 * 获取商品列表
 * param  token,page,size belong_id
 * url  /shop_goods/getSubGoods
 */
function getSubGoods(param, isInside) {
    $.ajax({
        url: server_url + "/shop_goods/getSubGoods",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if(data.status == 200) {
                $('#goodsInfo tbody').empty();
                if(data.payload.total)
                    window.allGoodAmount = data.payload.total;
                else
                    window.allGoodAmount = 0;

                if(!isInside) setPage();

                if(data.payload.data) {
                    var goodList = data.payload.data;
                    $.each(goodList, function (index,obj) {
                        var html = '';
                        html += '<tr gid="'+ obj.id +'">'
                        html += '<td>'
                        if(obj.pictUrl) {
                            html += '<img src="'+ picUrlTrans(obj.pictUrl, img_url) +'"/>'
                        } else {
                            html += '--'
                        }
                        html += '</td>'
                        html += '<td>'+ obj.title +'</td>'
                        html += '<td>'+ obj.totalNum +'</td>'
                        html += '<td>'+ obj.zkPrice +'</td>'
                        if(obj.is_publish == 0) {
                            html += '<td style="color:#FF5722">仅保存</td>'
                        }
                        else if(obj.is_publish == 1) {
                            html += '<td style="color:#009688;">已生效</td>'
                        }

                        html += '<td>'+ obj.volume +'</td>'

                        html += '<td>'
                        if(obj.sku_value && obj.sku_value!="{}") {
                            $.each(JSON.parse(obj.sku_value), function (index,obj) {
                                html += '<p>'+ index +'：'+ obj +'</p>'
                            })
                        } else {
                            html += '--'
                        }
                        html += '</td>'

                        html += '<td>'
                        html += '<div class="layui-table-cell laytable-cell-1-10 padding0">'

                        html += '<input type="hidden" '
                        html += 'v="'+ escapeHtml(JSON.stringify(obj)) +'"'
                        html += '/>'
                        html += '<a class="layui-btn layui-btn-xs edit" gid="'+ obj.id +'">编辑</a>'
                        if(obj.is_publish==1) {
                            html += '<a class="layui-btn layui-btn-xs layui-btn-danger downGood" gid="'+ obj.id +'">下架</a>'
                        } else {
                            html += '<a class="layui-btn layui-btn-xs layui-btn-normal upGood" gid="'+ obj.id +'">上架</a>'
                        }
                        html += '</div>'
                        html += '</td>'
                        html += '</tr>'
                        $('#goodsInfo tbody').append(html);
                    });
                } else {
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="12">暂无数据！</td></tr>';
                    $('#goodsInfo tbody').append(noData);
                }
            }
            else if(data.status == 403) {
                top.location.href = "login.html";
            }
            else {
                layer.msg(data.err)
            }
        },
        error: function() {
            layer.alert("网络错误，请联系管理员或稍后重试！", {icon: 7});
        }
    });
}

/**
 * 上下架商品
 * param  token,id
 * url  /shop_goods/offGoods
 */
function offGoods(param) {
    $.ajax({
        url: server_url + "/shop_goods/offGoods",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if (data.status == 200) {
                firstInfo(true);  //删除成功刷新列表页
            }
            else {
                layer.msg(data.err)
            }
        },
        error: function() {
            layer.alert("网络错误，请联系管理员或稍后重试！", {icon: 7});
        }
    });
}


//首次加载调用的函数.
function firstInfo(isInside) {
    var goodParam = {
        'token': filterParam.token,
        'belong_id': filterParam.belong_id,
        'size': filterParam.size,
        'page': window.pageIndex
    }
    getSubGoods(goodParam, isInside);
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






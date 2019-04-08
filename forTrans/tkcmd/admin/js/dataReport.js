/**
 * Created by yjp on 2018/4/23.
 */

var $,layer,form,size = 30;
window.pageIndex = 1;
var token = sessionStorage.getItem('adminToken');
var filterParam = {
    'token': token,
    'size': size,
    'page': window.pageIndex
};

layui.use(['jquery', 'layer', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    form = layui.form;

    firstInfo();

    if(!token)  top.location.href = "login.html";

    // 按日/月查询
    form.on('select(dateType)', function(data) {
        if(data.value=='day') {
            $('#dateSelect').removeClass('hide');
            delete filterParam.sortKey;
        }
        else if(data.value == 'month') {
            $('#dateSelect').addClass('hide');
            delete filterParam.day;
            filterParam.sortKey = data.value;
        }
        firstInfo();
    });

    // 近7天、30天
    form.on('select(dateSelect)', function(data) {
        filterParam.day = data.value;
        firstInfo();
    });

})


/**
 * 帖子列表
 * @param  token
 * url//form/operationData
 */
function operationData(param,isInside) {
    $.ajax({
        type: "post",
        url: server_url + "/form/operationData",
        data: param,
        success: function(data) {
            if(data.status == 200) {
                $('tbody').empty();
                if(data.payload.total)
                    window.allGoodAmount = data.payload.total;
                else
                    window.allGoodAmount = 0;

                if(data.payload.operationList) {
                    var rsp = data.payload.operationList;
                    $.each(rsp, function (index, obj) {
                        var h = '';
                        h += '<tr class="tab_body">'
                        h += '<td>'+ obj.date +'</td>'
                        h += '<td>'+ (obj.reg_count ? obj.reg_count : '0') +'</td>'
                        h += '<td>'+ (obj.order_count ? obj.order_count : '0') +'</td>'
                        h += '<td>'+ (obj.pay_total ? (obj.pay_total).toFixed(2) : '0') +'</td>'
                        h += '<td>'+ (obj.com_total ? (obj.com_total).toFixed(2) : '0') +'</td>'
                        h += '<td>'+ (obj.waiter_count ? obj.waiter_count : '0') +'</td>'
                        // h += '<td>'+ (obj.zj_count ? obj.zj_count : '0') +'</td>'
                        h += '</tr>'

                        $('tbody').append(h);
                    });
                }
                else {
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="6">暂无数据！</td></tr>';
                    $('tbody').append(noData);
                }
            }
            else {
                layer.msg(data.err);
            }
        }
    });
}


//首次加载调用的函数
function firstInfo(isInside) {
    var goodParam = {
        'token': filterParam.token,
        'size': filterParam.size,
        'page': window.pageIndex
    };
    if(filterParam.sortKey)  goodParam.sortKey = filterParam.sortKey;
    if(filterParam.day)  goodParam.day = filterParam.day;
    operationData(goodParam,isInside);
}


/**
 * Pagination 分页
 */
function setPage() {
    $("#Pagination").pagination(window.allGoodAmount, {
        current_page:0,
        link_to:"#",
        num_edge_entries: 1, //边缘页数
        num_display_entries:4, //主体页数
        callback: pageselectCallback,
        ellipse_text: '...',
        items_per_page: size,
        prev_text: "<",
        next_text: ">"
    });
    function pageselectCallback(page_index, jq) {
        if(window.pageIndex != page_index + 1){
            window.pageIndex = page_index + 1;
            firstInfo(true);
        }
    }
}


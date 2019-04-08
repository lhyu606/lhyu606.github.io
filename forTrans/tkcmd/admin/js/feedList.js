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

    if(!token) top.location.href = "login.html";

    //加载小二列表
    firstFeedList();

    form.on('select(status)', function(data) {
        if(data.value.trim()) {
            filterParam.status = data.value; //得到被选中的值
        } else {
            delete filterParam.status;
        }
        filterParam.page = 1;
        firstFeedList();
    });
    //条件筛选（奖品类型）
    form.on('select(type)', function(data) {
        if(data.value.trim()) {
            filterParam.type = data.value; //得到被选中的值
        } else {
            delete filterParam.type
        }
        filterParam.page = 1;
        firstFeedList();
    });

    //图片放大
    $("body").on('click', 'img', function() {
        var _this = $(this);  //将当前的pimg元素作为_this传入函数
        imgShow("#outerdiv", "#bigimg", _this);
    });

    function imgShow(outerdiv, bigimg, _this) {
        var src = _this.attr("src");  //获取当前点击的pimg元素中的src属性
        $('#outerdiv').attr('display', 'block');
        $(bigimg).attr("src", src);  //设置#bigimg元素的src属性
        $(outerdiv).fadeIn("fast");
    }

    $('#outerdiv').click(function() {  //再次点击淡出消失弹出层
        $(this).fadeOut("fast");
    });

    //获取小二列表
    function feedList(param, isInside) {
        $.ajax({
            url: server_url + "/feedback/list",
            type: "post",
            dataType: "json",
            data: param,
            success: function (data) {
                if (data.status == 200) {
                    $('#feedList tbody').empty();

                    if (data.payload.total) window.allGoodAmount = data.payload.total;
                    else window.allGoodAmount = 0;

                    if (!isInside) setPage();

                    if (data.payload.data) {
                        var feedList = data.payload.data;
                        $.each(feedList, function (index,obj) {
                            var html = '';
                            html += '<tr id="'+ obj.id +'" >';
                            html += '<td>' + obj.id + '</td>';
                            html += '<td>' + obj.account + '</td>';
                            html += '<td>' + obj.sketch + '</td>';
                            html += '<td>' + obj.content + '</td>';
                            if(obj.pics) var pics = JSON.parse(obj.pics);
                            if(pics && pics.length > 0) {
                                html += '<td>';
                                pics.forEach(function(pic) {
                                    html += '<img src="' + img_url+ pic +'" />';
                                })
                                html += '</td>';
                            } else {
                                html += '<td>无</td>';
                            }
                            html += '<td>' + simpleDateFormat(obj.created_date) + '</td>';
                            html += '</tr>';
                            $('#feedList tbody').append(html);
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

    //首次加载调用的函数
    function firstFeedList(isInside) {
        feedList(filterParam, isInside);
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
                filterParam.page = window.pageIndex;
                firstFeedList(true);
            }
        }
    }

});
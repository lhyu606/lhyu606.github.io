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

    //加载号外列表
    firstNewspaperList();

    form.on('select(status)', function(data) {
        if(data.value.trim()) {
            filterParam.status = data.value; //得到被选中的值
        } else {
            delete filterParam.status;
        }
        filterParam.page = 1;
        firstNewspaperList();
    });
    //条件筛选（号外类型）
    form.on('select(type)', function(data) {
        if(data.value.trim()) {
            filterParam.type = data.value; //得到被选中的值
        } else {
            delete filterParam.type
        }
        filterParam.page = 1;
        firstNewspaperList();
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
            $("#newspaperList>tbody").find('.cbClick').removeClass('layui-form-checked');
        } else {
            $(this).addClass('layui-form-checked');
            $("#newspaperList>tbody").find('.cbClick').addClass('layui-form-checked');
        }
    });

    //新建号外内容
    $('body').on('click', '.addNewspaper', function () {
        var perContent = layer.open({
            type: 2,
            title: '新建号外/推送内容',
            shadeClose: true,
            shade: 0.4,
            area: ['100%', '100%'],
            content: 'addNewspaper.html'
        });
        layer.full(perContent);
    });

    //编辑号外内容
    $('body').on('click', '.edit', function () {
        var hiddenText = $(this).prev();
        sessionStorage.setItem('newspaperInfo',hiddenText.attr('v'));
        var perContent = layer.open({
            type: 2,
            title: '编辑号外/推送内容',
            shadeClose: true,
            shade: 0.4,
            area: ['100%', '100%'],
            content: 'addNewspaper.html?id='+ $(this).attr('id')
        });
        layer.full(perContent);
    });

    //下架号外内容
    $('body').on('click', '.off', function () {
        filterParam.status = 0;
        filterParam.ids = JSON.stringify([$(this).attr('id')]);
        upOrOffNewspaper(filterParam);
    });

    //上架号外内容
    $('body').on('click', '.up', function () {
        filterParam.status = 1;
        filterParam.ids = JSON.stringify([$(this).attr('id')]);
        upOrOffNewspaper(filterParam);
    });

    // 删除号外内容（多个）
    $('.delNewspaper').click(function () {
        var ids = [];
        var waiterCheck = $("#newspaperList>tbody").find('.layui-form-checked');
        for(var i = 0; i < waiterCheck.length; i++) {		//获取复选框中选中的值(传多个勾选值)
            var waiterId = waiterCheck.eq(i).parents('tr').attr('id');
            ids.push(waiterId);
        }
        if(ids.length != 0) {
            filterParam.ids = JSON.stringify(ids);
            filterParam.status = 0;
            upOrOffNewspaper(filterParam);
        } else {
            layer.msg("请选择要删除的商品！");
        }
    });

    //删除号外内容
    function upOrOffNewspaper(param) {
        $.ajax({
            url: server_url + "/newspaper/doUpOrOff",
            type: "post",
            dataType: "json",
            data: param,
            success: function (data) {
                if (data.status == 200) {
                    delete filterParam.status;
                    firstNewspaperList(true);  //删除成功刷新列表页
                }
                else {
                    layer.msg(data.err);
                }
            },
            error: function() {
                layer.alert("网络错误，请联系管理员或稍后重试！", {icon: 7});
            }
        });
    }

    //获取号外列表
    function newspaperList(param, isInside) {
        var type = $('#push').val();
        if(type == 3) param.type = 3;
        $.ajax({
            url: server_url + "/newspaper/manageList",
            type: "post",
            dataType: "json",
            data: param,
            success: function (data) {
                if (data.status == 200) {
                    $('#newspaperList tbody').empty();

                    if (data.payload.total) window.allGoodAmount = data.payload.total;
                    else window.allGoodAmount = 0;

                    if (!isInside) setPage();

                    if (data.payload.data) {
                        var newspaperList = data.payload.data;
                        $.each(newspaperList, function (index,obj) {
                            var html = '';
                            html += '<tr id="'+ obj.id +'" >';
                            html += '<td>';
                            html += '<input type="checkbox"/>';
                            html += '<label for="checkAll1">';
                            html += '<div class="cbClick layui-unselect layui-form-checkbox" lay-skin="primary">';
                            html += '<i class="layui-icon"></i>';
                            html += '</div>';
                            html += '</label>';
                            html += '</td>';
                            html += '<td>' + obj.id + '</td>';
                            html += '<td>' + obj.title + '</td>';
                            html += '<td><img src="' + img_url+ obj.pic +'"/></td>';
                            html += '<td>' + obj.sub_title + '</td>';
                            if(obj.des != undefined || obj.des != '') {
                                html += '<td>' + obj.des + '</td>';
                            } else {
                                html += '<td>暂无</td>';
                            }
                            html += '<td>' + obj.visit_num + '</td>';
                            html += '<td>' + simpleDateFormat(obj.start_time) + '</td>';
                            html += '<td>' + simpleDateFormat(obj.end_time) + '</td>';
                            if(parseInt(obj.status) == 1 && new Date().getTime() < new Date(obj.end_time).getTime()) {
                                html += '<td style="color: #1E9FFF">有效</td>';
                            } else {
                                html += '<td style="color: #FF5722">失效</td>';
                            }
                            html += '<td>';
                            html += '<div class="layui-table-cell laytable-cell-1-10 padding0">';
                            html += '<input type="hidden" ';
                            html += 'v="'+ escapeHtml(JSON.stringify(obj)) +'"';
                            html += '/>';
                            html += '<a class="layui-btn layui-btn-xs edit" id="'+ obj.id +'">编辑</a>';
                            if(obj.status == 1) {
                                html += '<a class="layui-btn layui-btn-xs layui-btn-danger off" id="'+ obj.id +'">下架</a>';
                            } else {
                                html += '<a class="layui-btn layui-btn-xs up" id="'+ obj.id +'">上架</a>';
                            }
                            if(obj.type == 3 ) html += '<a class="layui-btn layui-btn-xs notice" id="'+ obj.id +'">推送</a>';
                            html += '</div>';
                            html += '</td>';
                            html += '</tr>';
                            $('#newspaperList tbody').append(html);
                        });
                    } else {
                        var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="12">暂无数据！</td></tr>';
                        $('tbody').append(noData);
                    }
                } else if (data.status == 403) {
                    top.location.href = "login.html";
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

    //首次加载调用的函数
    function firstNewspaperList(isInside) {
        newspaperList(filterParam, isInside);
    }

    //号外分页
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
                firstNewspaperList(true);
            }
        }
    }
});
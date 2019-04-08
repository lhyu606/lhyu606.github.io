/**
 * Created by yjp on 2018/5/3.
 */

var $,element,layer,table,laydate;
var size = 10;
window.pageIndex = 1;
var token = sessionStorage.getItem('adminToken');
var filterParam = {
    'token': token,
    'size': size,
    'page': window.pageIndex
}

layui.use(['element','jquery','laydate','layer','table'], function () {
    $ = layui.jquery;  //jquery
    element = layui.element;  //元素操作
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    
    firstInfo();  //访问加载页面

    //数据列表
    $('body').on('click', '.goodLabel a', function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        filterParam.type = $(this).attr('labKey');
        firstInfo();
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
            $("#dataInfo tbody").find('.cbClick').removeClass('layui-form-checked');
        } else {
            $(this).addClass('layui-form-checked');
            $("#dataInfo tbody").find('.cbClick').addClass('layui-form-checked');
        }
    });
    //删除（单个）
    $('body').on('click', '.delete', function () {
        var aid = [];
        aid.push($(this).attr('aid'));
        var delParam = {
            'token': token,
            'sign': sign,
            'ids': JSON.stringify(aid)
        };
        delGoods(delParam);
    });
    //删除（多个）
    $('.delete_check').click(function () {
        var aids = [];
        var goodCheck = $("#dataInfo tbody").find('.layui-form-checked');

        for(var i = 0; i < goodCheck.length; i++) {		//获取复选框中选中的值(传多个勾选值)
            var goodId = goodCheck.eq(i).parents('tr').attr('aid');
            aids.push(goodId);
        }
        var delParam = {
            'token': token,
            'sign': sign,
            'ids': JSON.stringify(aids)
        };
        // console.log(delParam)
        delGoods(delParam);
    });
    //观看视频时返回顶部
    $('body').on('click', '.playVideo', function (e) {
        $('.layui-body',parent.document).animate({scrollTop: 0}, 100);
    });
    
    //创建转发素材
    $('body').on('click', '.addMeterial', function () {
        var ifrm;
        if (filterParam.type) {
            ifrm = 'addMeterial.html?tp='+filterParam.type;
        } else {
            ifrm = 'addMeterial.html';
        }
        layer.open({
            type: 2,
            title: '新建朋友圈素材',
            shadeClose: false,
            shade: 0.4,
            area: ['650px', '65%'],
            content: ifrm
        });
    });
    //编辑素材
    $('body').on('click', '.edit', function () {
        var filter = new Object();
        filter.tp = $(this).prev().attr('tp');
        filter.content = $(this).prev().attr('content');
        filter.img = $(this).prev().attr('img');
        filter.mp4 = $(this).prev().attr('mp4');
        filter.articleurl = $(this).prev().attr('articleurl');
        filter.comment = $(this).prev().attr('comment');
        filter.advise = $(this).prev().attr('advise');
        filter.stime = $(this).prev().attr('stime');
        filter.etime = $(this).prev().attr('etime');
        filter.sts = $(this).prev().attr('sts');
        sessionStorage.setItem('filter',JSON.stringify(filter));
        layer.open({
            type: 2,
            title: '新建朋友圈素材',
            shadeClose: true,
            shade: 0.4,
            area: ['650px', '65%'],
            content: 'addMeterial.html?uid='+ $(this).attr('uid')
        });
    });
    
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
 * 获取素材列表
 * param  token,page,size
 * url  /timeline/getTimelineList
 */
function getTimelineList(param, isInside) {
    $.ajax({
        url: server_url + "/timeline/getTimelineList",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if(data.status == 200) {
                $('#dataInfo tbody').empty();
                if(data.payload.total)
                    window.allGoodAmount = data.payload.total;
                else
                    window.allGoodAmount = 0;

                if(!isInside) setPage();

                if(data.payload.data) {
                    var goodList = data.payload.data;
                    $.each(goodList, function (index,obj) {
                        var html = '';
                        var startTime = simpleDateFormat(obj.start_time);
                        var endTime = simpleDateFormat(obj.end_time);

                        html += '<tr aid="'+ obj.id +'">'
                        html += '<td>'
                        html += '<input type="checkbox"/>'
                        html += '<label for="checkAll1">'
                        html += '<div class="cbClick layui-unselect layui-form-checkbox" lay-skin="primary">'
                        html += '<i class="layui-icon"></i>'
                        html += '</div>'
                        html += '</label>'
                        html += '</td>'
                        html += '<td>' + obj.content + '</td>'
                        html += '<td>'
                        if(obj.img) {
                            var pictUrl = JSON.parse(obj.img);
                            $.each(pictUrl, function (index) {
                                html += '<div class="frd_imgDiv fl">'
                                html += '<img src="'+ img_url+pictUrl[index].img +'" onload="resize_img(this,80,80)">'
                                html += '</div>'
                            });
                        }
                        else if(obj.article_url) {
                            html += obj.article_url
                        }
                        else if(obj.mp4) {
                            html += "<a class='layui-btn layui-btn-xs playVideo' "+
                                "onclick='playVideo(\""+ obj.mp4 +"\",\""+ obj.content +"\");'>点击观看视频</a>"
                        }

                        html += '</td>'
                        html += '<td>'+ (obj.comment ? obj.comment : '--') +'</td>'
                        html += '<td>'+ obj.advise +'</td>'
                        html += '<td>'+ startTime +'</td>'
                        html += '<td>'+ endTime +'</td>'
                        if(obj.status == 0) {
                            html += '<td>仅保存</td>'
                        }
                        else if(obj.status == 1) {
                            html += '<td>立即生效</td>'
                        }

                        html += '<td>'
                        html += '<div class="layui-table-cell laytable-cell-1-10 padding0">'

                        html += '<input type="hidden" '
                        html += 'tp="'+ obj.type +'"'
                        html += 'content="'+ escapeHtml(obj.content) +'"'
                        html += 'img="'+ (obj.img ? escapeHtml(obj.img) : "") +'"'
                        html += 'mp4="'+ (obj.mp4 ? obj.mp4 : "") +'"'
                        html += 'articleurl="'+ (obj.article_url ? escapeHtml(obj.article_url) : "") +'"'
                        html += 'comment="'+ (obj.comment ? escapeHtml(obj.comment) : "") +'"'
                        html += 'advise="'+ obj.advise +'"'
                        html += 'stime="'+ startTime +'"'
                        html += 'etime="'+ endTime +'"'
                        html += 'sts="'+ obj.status +'"'
                        html += '/>'

                        html += '<a class="layui-btn layui-btn-xs edit" uid="'+ obj.id +'">编辑</a>'
                        html += '<a class="layui-btn layui-btn-xs layui-btn-danger delete" aid="'+ obj.id +'">删除</a>'
                        html += '</div>'
                        html += '</td>'
                        html += '</tr>'
                        $('#dataInfo tbody').append(html);
                    });
                } else {
                    var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="9">暂无数据！</td></tr>';
                    $('#dataInfo tbody').append(noData);
                }
            }
            else if(data.status == 403) {
                top.location.href = "login.html";
            }
            else {
                layer.msg(data.err)
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            var msg = "网络错误，请联系管理员或稍后重试！";
            layer.alert(msg, {icon: 7});
        }
    });
}

/**
 * 删除素材
 * param  token,id
 * url  /timeline/delete
 */
function delGoods(param) {
    $.ajax({
        url: server_url + "/timeline/delete",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if (data.status == 200) {
                firstInfo(true);  //删除成功刷新列表页
            } else {
                layer.msg(data.err)
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            var msg = "网络错误，请联系管理员或稍后重试！";
            layer.alert(msg, {icon: 7});
        }
    });
}


//首次加载调用的函数.
function firstInfo(isInside) {
    var goodParam = {
        'token': filterParam.token,
        'size': filterParam.size,
        'page': window.pageIndex
    }
    if(filterParam.type)  goodParam.type = filterParam.type;
    getTimelineList(goodParam, isInside);
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



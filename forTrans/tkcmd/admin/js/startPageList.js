/**
 * Created by Administrator on 2018/1/8.
 */
var $,layer,table,laydate,form, size = 8;
window.pageIndex = 1;
var token = sessionStorage.getItem('adminToken');
var filterParam = {
    'token': token,
    'size': size,
    'page': window.pageIndex
}


// layui声明
layui.use(['laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form; //表单


    if(!token)  top.location.href = "login.html";
    getEssenceList();

    if(!!window.ActiveXObject || "ActiveXObject" in window) {
        $(".editInfo").find('i').html("(您使用的为IE浏览器，图片名中带有中文可能无法正常预览。)");
    }

    $(document).on('change','#imgInput',function () {
        var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
        if(objUrl) {
            $('.mainImg').attr("src", objUrl);//将图片路径存入src中，显示出图片
        }
    })

    $(document).on('change','#imgInput',function () {
        var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
        if(objUrl) {
            $('.bannerImg').attr("src", objUrl);//将图片路径存入src中，显示出图片
        }
    })

    //榜单
    $('body').on('click', '.listTitle a', function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        var $listImg = $('.bannerImg');
        var param = {
            pic: $(this).attr('pic'),
            gtype: $(this).attr('gtype'),
            id: $(this).attr('eid'),
            title: $(this).text()
        }
        $('.img0').attr('src',server_url+param.pic);
        $('.newGroup').attr('eid',param.id);//更改或创建对应组的用的 榜单id

        $('.listImg').attr('ids',param.id);
        $('.listImg').attr('title',param.title);
        //存数据，用于修改榜单
        $listImg.attr('gtype',param.gtype);
        $listImg.attr('pic',param.pic);
        $listImg.attr('ids',param.id);
        $listImg.attr('title',param.title);

        //请求榜单对应的组
        getEssence(param.id)//获取组
        filterParam['pool_type'] = param.gtype;
    });

    //新建榜单
    $('.newList').click(function () {
        newList();
    })
    //榜单（组）
    $('body').on('click', '.groupList a', function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        $(this).addClass('title').siblings('a').removeClass('title');
        var $bannerImg = $('.bannerImg');
        var param = {
            pic: $(this).attr('pic'),
            gtype: $(this).attr('gtype'),
            ids: $(this).attr('ids'),
            eid: $(this).attr('eid'),
            title: $(this).text()
        }
        $('.groupBan0').attr('src',server_url+param.pic);

        //存数据，用于修改组
        $bannerImg.attr('gtype',param.gtype);
        $bannerImg.attr('pic',param.pic);
        $bannerImg.attr('ids',param.ids);
        $bannerImg.attr('eid',param.eid);
        $bannerImg.attr('title',param.title);

        //请求组对应的商品
        filterParam['pool_type'] = param.gtype;
        firstGoodsInfo();
    });
    //新建组
    $('.newGroup').click(function () {
        var eid = $(this).attr('eid');
        createGroup(eid);
    })
    //更改榜单
    $('body').on('click', '.listImg img', function () {
        var $this = $('.listImg');
        var param = {
            pics: $(this).attr('src'),
            gtype: $this.attr('gtype'),
            title: $this.attr('title'),
            id: $this.attr('ids')
        }
        console.log(param)
        updateEssence(param)
    })
    //更改组
    $('body').on('click', '.bannerImg img', function () {
        var $this = $('.bannerImg');
        var param = {
            pics: $(this).attr('src'),
            gtype: $this.attr('gtype'),
            title: $this.attr('title'),
            id: $this.attr('ids'),
            eid: $this.attr('eid')
        }
        updateEssenceGroup(param)
    })

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
        delt(aid);
    });
    //删除（多个）
    $('.delete_check').click(function () {
        var aids = [];
        var goodCheck = $("#goodsInfo tbody").find('.layui-form-checked');

        for(var i = 0; i < goodCheck.length; i++) {		//获取复选框中选中的值(传多个勾选值)
            var goodId = goodCheck.eq(i).parents('tr').attr('aid');
            aids.push(goodId);
        }
        delt(aids);
    });
    //删除接口
    function delt(ids) {
        var delParam = {
            'token': token,
            'ids': JSON.stringify(ids)
        };
        delGoods(delParam);
    }

});


//获取精品榜单
function getEssenceList() {
    $.ajax({
        url: server_url + "/essence/getEssenceList",
        type: "post",
        dataType: "json",
        data: '',
        success: function (data) {
            if (data.status == 200) {
                var t = '';
                var img = '';
                if(data.payload.essenceInfo) {
                    var essenceInfo = data.payload.essenceInfo;
                    $.each(essenceInfo,function (i) {
                        var info = essenceInfo[i];
                        if(i == 0){
                            t += '<a class="layui-btn layui-btn-radius title" eid ="'+info.id+'" gtype = "'+info.good_list_type+'" pic="'+info.pics+'">'+info.title+'</a>'
                            img +='<img src="'+server_url+info.pics+'" alt="主banner图" class="img'+i+'">'
                            getEssence(info.id);

                            $('.newGroup').attr('eid',info.id);

                            filterParam['pool_type'] = info.good_list_type //获取榜单对应商品数据
                            //存数据，用于修改榜单
                            $('.listImg').attr('gtype',info.good_list_type);
                            $('.listImg').attr('pic',info.pics);
                            $('.listImg').attr('title',info.title);
                            $('.listImg').attr('ids',info.id);
                        }
                        else{
                            t += '<a class="layui-btn layui-btn-radius layui-btn-primary" eid ="'+info.id+'" gtype = "'+info.good_list_type+'" pic="'+info.pics+'">'+info.title+'</a>'
                        }
                    })

                    $('.listTitle').empty().append(t);
                    $('.listImg').empty().append(img);
                }

            } else {
                layer.msg(data.err);
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            var msg = "服务器错误，请联系管理员";
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
        url: server_url + "/essence/getEssence",
        type: "post",
        dataType: "json",
        data: {
            essence_id:essence_id
        },
        success: function (data) {
            if (data.status == 200) {
                var h = '';
                var t = '';
                var img = ''
                if(data.payload.groups){
                    var res = data.payload.groups;
                    $.each(res,function (i) {
                        var info = res[i];
                        if(i == 0){
                            t += '<a class="layui-btn layui-btn-sm layui-btn-radius" ids="'+info.id+'" eid="'+info.essence_id+'" gtype="'+info.good_list_type+'" pic="'+info.pics+'">'+info.title+'</a>'
                            img +='<img src="'+server_url+info.pics+'" alt="组banner图" class="groupBan'+i+'">'
                            filterParam['pool_type'] = info.good_list_type;
                            firstGoodsInfo();//存在组，获取本组商品

                            //存数据，用于修改榜单组
                            $('.bannerImg').attr('gtype',info.good_list_type);
                            $('.bannerImg').attr('pic',info.pics);
                            $('.bannerImg').attr('title',info.title);
                            $('.bannerImg').attr('ids',info.id);
                            $('.bannerImg').attr('eid',info.essence_id);
                        }
                       else{
                            t += '<a class="layui-btn layui-btn-sm layui-btn-radius layui-btn-primary" ids="'+info.id+'" eid="'+info.essence_id+'" gtype="'+info.good_list_type+'"  pic="'+info.pics+'">'+info.title+'</a>'
                        }
                    })
                    $('.groupList').empty().append(t);
                    $('.bannerImg').empty().append(img);
                }
                else{
                    firstGoodsInfo();//不存在组，直接获取榜单商品
                    $('.groupList').empty();
                    $('.bannerImg').empty();
                }
            } else {
                layer.msg(data.err);
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            var msg = "服务器错误，请联系管理员";
            layer.open({
                content: msg
                ,time: 3
            });
        }
    });
}

/**
* 库列表
* @param   token
* @param   pool_type
* @param   size
* @param   page
*         url/boutique_pool/goodsList
*/
function goodsList(filterParam,isInside) {
    $.ajax({
        url: server_url + "/boutique_pool/goodsList",
        type: "post",
        dataType: "json",
        data:filterParam,
        success: function (data) {
            if (data.status == 200) {
                if (data.status == 200) {
                    $('#goodsInfo tbody').empty();
                    if (data.payload.total) window.allGoodAmount = data.payload.total;
                    else window.allGoodAmount = 0;

                    if (!isInside) setPage();

                    if (data.payload.data && data.payload.data.length>0) {
                        var goodList = data.payload.data;
                        $.each(goodList, function (index) {
                            var html = '';
                            html += '<tr aid="' + goodList[index].id + '">'
                            html += '<td>'
                            html += '<input type="checkbox"/>'
                            html += '<label for="checkAll1">'
                            html += '<div class="cbClick layui-unselect layui-form-checkbox" lay-skin="primary">'
                            html += '<i class="layui-icon"></i>'
                            html += '</div>'
                            html += '</label>'
                            html += '</td>'
                            html += '<td>' + goodList[index].id + '</td>'
                            html += '<td>' + goodList[index].auctionId + '</td>'
                            html += '<td><img src="' + goodList[index].pictUrl + '"/></td>'
                            html += '<td>' + goodList[index].title + '</td>'
                            html += '<td>' + goodList[index].shopTitle + '</td>'
                            html += '<td>' + goodList[index].biz30day + '</td>'
                            html += '<td>￥' + goodList[index].zkPrice + '</td>'
                            html += '<td>￥' + goodList[index].hiddenAmount + '</td>'
                            html += '<td>'
                            html += '<div class="layui-table-cell laytable-cell-1-10 padding0">'
                            html += '<a class="layui-btn layui-btn-xs delete" aid="' + goodList[index].id + '">删除</a>'
                            html += '</div>'
                            html += '</td>'
                            html += '</tr>'
                            $('#goodsInfo tbody').append(html);
                        });
                    }
                    else {
                        var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="11">暂无数据！</td></tr>';
                        $('#goodsInfo tbody').append(noData);
                    }
                } else if (data.status == 403) {
                    window.location.href = "login.html";
                } else {
                    layer.msg(data.err);
                }
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            var msg = "服务器错误，请联系管理员";
            layer.open({
                content: msg
                ,time: 3
            });
        }
    });
}

//创建榜单
function submitData() {
    //监听提交
    $("#myupload").ajaxSubmit({
        success: function (data) {
            if (data.status == 200) {
                layer.msg('操作成功！');
                setTimeout(function () {
                    layer.closeAll();
                    getEssenceList()//刷新页面
                    // location.reload(); //刷新父页面
                }, 2000);
            } else {
                layer.msg(data.err);
            }
        },
        error: function () {
            layer.msg('网络错误，请稍后重试');
        }
    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}

//新建榜单
function newList() {
    var msg = '<form class="layui-form" id="myupload" action="'+ server_url+'/essence/createEssence' +'" method="post" enctype="multipart/form-data" onsubmit="return submitData()">' +
        '<div class="updateList"><div class="editInfo">' +
        '<input type="text" name="token" value="'+token+'" class="" hidden>' +
        '<span>榜单名称</span>' +
        '<input type="text" name="title" class="listName">' +
        '<input type="file" id="imgInput" name="img1" class="layui-input hide">' +
        '<label for="imgInput"><img src="" alt="主图750*300" class="mainImg"></label></div> ' +
        '<button id="myupload" class="layui-btn submit" lay-submit lay-filter="formDemo" >保存并发布</button></div></form>'
    $(document).on('click','.mainImg',function () {
        $('.imgInput').click();
    })
    layer.open({
        type:1,
        closeBtn: 1,
        title:'新建榜单',
        skin: 'layui-layer-molv',
        offset: '200px',
        area: ['530px','430px'],
        scrollbar: false,
        shadeClose: true,
        content: msg
    });
}

//新建榜单(组)
function createGroup(eid) {
    var essence_id = eid;
    var msg = '<form class="layui-form" id="myupload" action="'+server_url+'/essence/createEssenceGroup' +'" method="post" enctype="multipart/form-data" onsubmit="return submitData()">' +
        '<div class="updateList"><div class="editInfo">' +
        '<input type="text" name="token" value="'+token+'" class="" hidden>' +
        '<input type="text" name="essence_id" class="bannerId" value="'+essence_id+'" hidden>' +
        '<span>组名</span><input type="text" name="title" class="listName"><br>' +
        '<input type="file" id="imgInput" name="img1" class="layui-input hide">' +
        '<label for="imgInput"><img src="" alt="主图690*186" class="bannerImg"></label>' +
        '</div><button id="myupload" class="layui-btn submit" lay-submit lay-filter="formDemo" >保存并发布</button></div></form>'
    $(document).on('click','.mainImg',function () {
        $('.imgInput').click();
    })
    layer.open({
        type: 1,
        closeBtn: 1,
        title:'新建组',
        skin: 'layui-layer-molv',
        offset: '150px',
        area: ['400px','410px'],
        scrollbar: false,
        shadeClose: true,
        content: msg,
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
                firstGoodsInfo();  //删除成功刷新列表页
                $('.allClick').removeClass('layui-form-checked');
            } else {
                layer.msg(data.err);
            }
        },
        error: function(jqXhr, textStatus, errorThrown) {
            layer.open({
                content: "服务器错误，请联系管理员"
                ,time: 3
            });
        }
    });
}

/**
 * 修改榜单信息
 * @param  token
 * @param  id//？？？啥玩意儿
 * @param  pics     (返回给的pics值)
 * @param  title
 * @param  start_date
 * @param  end_date
 * @param  status
 * @param  good_list_type
 * @param  img1    (上传的图片)
 *         url//essence/updateEssence
 */
//更改榜单信息
function updateEssence(param) {
    var msg = '<form class="layui-form" id="myupload" action="'+ server_url+'/essence/updateEssence' +'" method="post" '+
        'enctype="multipart/form-data" onsubmit="return submitData()">' +
        '<div class="updateList"><div class="editInfo">' +
        '<input type="text" name="token" value="'+ token +'" class="" hidden>' +
        '<input type="text" name="id" value="'+ param.id +'" class="" hidden>' +
        '<input type="text" name="pics" value="'+param.pics+'" class="" hidden>' +
        '<span>榜单名称</span>' +
        '<input type="text" name="title" class="listName" value="'+ param.title +'">' +
        '<input type="file" id="imgInput" name="img1" class="layui-input hide">' +
        '<label for="imgInput"><img src="'+ param.pics +'" alt="主图750*300" class="mainImg"></label></div> ' +
        '<button id="myupload" class="layui-btn submit" lay-submit lay-filter="formDemo">确认修改</button></div></form>'
    $(document).on('click','.mainImg',function () {
        $('.imgInput').click();
    })
    layer.open({
        type:1,
        closeBtn: 1,
        title:'修改榜单',
        skin: 'layui-layer-molv',
        offset: '200px',
        area: ['530px','430px'],
        scrollbar: false,
        shadeClose: true,
        content: msg
    });
}

//修改组
function updateEssenceGroup(param) {
    var msg = '<form class="layui-form" id="myupload" action="'+ server_url+'/essence/updateEssenceGroup' +'" method="post" enctype="multipart/form-data" onsubmit="return submitData()">' +
        '<div class="updateList"><div class="editInfo">' +
        '<input type="text" name="token" value="'+ token +'" class="" hidden>' +
        '<input type="text" name="id" value="'+ param.id +'" class="" hidden>' +
        '<input type="text" name="pics" value="'+ param.pics +'" class="" hidden>' +
        '<input type="text" name="gtype" value="'+ param.gtype +'" class="" hidden>' +
        '<input type="text" name="essence_id" class="bannerId" value="'+ param.eid +'" hidden>' +
        '<span>组名</span><input type="text" name="title" class="listName" value="'+ param.title +'"><br>' +
        '<input type="file" id="imgInput" name="img1" class="layui-input hide">' +
        '<label for="imgInput"><img src="'+ param.pics +'" alt="主图690*186" class="bannerImg"></label>' +
        '</div><button id="myupload" class="layui-btn submit" lay-submit lay-filter="formDemo" >确认修改</button></div></form>'
    $(document).on('click','.mainImg',function () {
        $('.imgInput').click();
    })
    layer.open({
        type:1,
        closeBtn: 1,
        title:'修改组',
        skin: 'layui-layer-molv',
        offset: '200px',
        area: ['400px','410px'],
        scrollbar: false,
        shadeClose: true,
        content: msg
    });
}


//首次加载调用的函数
function firstGoodsInfo(isInside) {
    var goodParam = {
        'token': filterParam.token,
        'pool_type':filterParam.pool_type,
        'size': filterParam.size,
        'page': window.pageIndex
    }
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




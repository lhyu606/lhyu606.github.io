/**
 * Created by yjp on 2018/11/8.
 */
var par = parseURL(window.location.href);
var $,layer,table,laydate,form,$form;
var token = sessionStorage.getItem('adminToken');
onSetGoodsInfo = {};  //存放提交的商品总信息


// 公共遮罩层（加载）
function loadingTip() {
    var index = layer.load(1, {
        shade: [0.5,'#000'] //0.5透明度的黑色背景
    });
    return index;
}

// 获取URL中的参数函数
function getURLParam(strParamName, url) {
    var urlParams = parseURL(url);
    if(urlParams.params && urlParams.params.hasOwnProperty(strParamName)) {
        return urlParams.params[strParamName];
    }
    return null;
}


layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');


    // 解析商品链接
    $('.jiexi').click(function() {
        onSetGoodsInfo = {};  //清空数据
        var inputUrl = $('#auctionUrl').val();
        if(inputUrl) {
            var aid = getURLParam('id',inputUrl);
            var auctionIdList = new Array();
            auctionIdList.push(aid);

            var param = {
                auctionIdList: JSON.stringify(auctionIdList)
            }
            getGoodsInfo(param);    //淘宝解析商品链接
        }
        else {
            layer.msg("请输入链接！")
        }
    })

    // 解析优惠券链接
    $('.getCouponInfo').click(function() {
        var inputUrl = $('#hiddenActivityId').val();
        if(inputUrl) {
            var item_id = getURLParam('itemId',inputUrl);
            var activity_id = getURLParam('activityId',inputUrl);
            var param = {
                item_id: item_id,
                activity_id: activity_id
            }
            getCouponInfo(param);
        }
        else {
            layer.msg("请输入链接！")
        }
    })

    // 提交商品信息
    $("body").on("click",".sure",function() {
        var postInfoArr = ['auctionUrl','pictUrl','title','adTitle','auctionId','shopTitle','sellerId','biz30day',
            'zkPrice','reservePrice','couponInfo','couponAmount','tkCommFee','tkRate','couponEffectiveStartTime',
            'couponEffectiveEndTime','couponLeftCount','couponTotalCount','tag'];

        $.each(postInfoArr, function(k,val) {  //获取最新数据
            onSetGoodsInfo[val] = $('#'+ val +'').val();
        });

        if(onSetGoodsInfo && onSetGoodsInfo.auctionId) {
            onSetGoodsInfo.token = token;
            if(onSetGoodsInfo.tkCommFee=='') {
                layer.msg("佣金不能为空！");
                return;
            }
            if(onSetGoodsInfo.tkRate=='') {
                layer.msg("比率不能为空！");
                return;
            }
            saveGood(onSetGoodsInfo);

        }
        else {
            layer.msg("请先获取商品信息！")
        }

    })

    //自定义图片
    $('#pictUrl').change(function () {
        var imgUrl = $('#pictUrl').val();
        $('#imageUrl').attr("src", imgUrl ? imgUrl : 'img/add_img.png');
    });

    // 选择自定义标签
    $('.good_list a').click(function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        $('#tag').val($(this).attr('tagKey'))
    })

});


// 渲染商品数据
function goodData() {
    var goodData = ['auctionUrl','pictUrl','title','adTitle','auctionId','shopTitle','sellerId','zkPrice','reservePrice','biz30day'];
    $.each(goodData, function(k,val) {
        $('#'+ val +'').val(onSetGoodsInfo[val]);
    });
    $('#imageUrl').attr('src',onSetGoodsInfo.pictUrl);
}
// 渲染优惠券数据
function couponData() {
    var couponData = ['couponInfo','couponAmount','couponEffectiveStartTime','couponEffectiveEndTime','couponLeftCount','couponTotalCount'];
    $.each(couponData, function(k,val) {
        $('#'+ val +'').val(onSetGoodsInfo[val]);
    });
}


/**
 * 获取淘宝的商品信息
 * @param  auctionIdList
 * url/tao_goods/getGoodsInfo
 */
function getGoodsInfo(param) {
    $.ajax({
        url: server_url + "/tao_goods/getGoodsInfo",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if(data.status == 200) {
                $.each(data.payload[0], function(k,val) {
                    onSetGoodsInfo[k] = val;
                })
                // console.log(onSetGoodsInfo)
                goodData();
            }
            else {
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
 * 获取券信息
 * @param  item_id
 * @param  activity_id
 * url/tao_goods/getCouponInfo
 */
function getCouponInfo(param) {
    $.ajax({
        url: server_url + "/tao_goods/getCouponInfo",
        type: "get",
        dataType: "json",
        data: param,
        success: function (data) {
            if(data.status == 200) {
                $.each(data.payload, function(k,val) {
                    onSetGoodsInfo[k] = val;
                })
                // onSetGoodsInfo.hiddenActivityId = getURLParam('activityId',$('#auctionUrl').val());
                // onSetGoodsInfo.hiddenAmount = data.payload.couponAmount;
                // console.log(onSetGoodsInfo)
                couponData()
            }
            else {
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
 * 编辑或新建商品
 * @param  token
 * @param  goods  返回的所有商品数据（包括优惠券）
 * url/tao_goods/save
 */
function saveGood(param) {
    $.ajax({
        url: server_url + "/tao_goods/save",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if(data.status == 200) {
                layer.msg("商品录入成功！")
                setTimeout(function () {
                    $('#imageUrl').attr('src','img/add_img.png')
                    $('.good_list').find('a[tagkey="全部"]').click()
                    $('.reset').click()
                },2000);
            }
            else {
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

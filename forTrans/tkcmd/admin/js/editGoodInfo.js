/**
 * Created by yjp on 2018/11/12.
 */
var par = parseURL(window.location.href);
var $,layer,table,laydate,form,$form;
var token = sessionStorage.getItem('adminToken');
var getGoodInfo = JSON.parse(sessionStorage.getItem('getGoodInfo'));


layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');


    goodData();  //渲染商品数据

    // 提交商品信息
    $("body").on("click",".sure",function() {
        var postInfoArr = ['auctionUrl','imageUrl','title','adTitle','auctionId','shopTitle','sellerId','biz30day',
            'zkPrice','reservePrice','couponInfo','couponAmount','tkCommFee','tkRate','couponEffectiveStartTime',
            'couponEffectiveEndTime','couponLeftCount','couponTotalCount','tag'];

        $.each(postInfoArr, function(k,val) {  //获取最新数据
            getGoodInfo[val] = $('#'+ val +'').val();
        });

        getGoodInfo.token = token;
        saveGood(getGoodInfo);
    })

    //自定义图片
    $('#imageUrl').change(function () {
        var imgUrl = $('#imageUrl').val();
        $('#pictUrl').attr("src", imgUrl ? imgUrl : 'img/add_img.png');
    });

    // 选择自定义标签
    $('.good_list a').click(function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        $('#tag').val($(this).attr('tagKey'))
    })

});


// 渲染商品数据
function goodData() {
    console.log(getGoodInfo)
    var getInfoArr = ['auctionUrl','pictUrl','title','adTitle','auctionId','shopTitle','sellerId','biz30day',
        'zkPrice','reservePrice','couponInfo','couponAmount','tkCommFee','tkRate','couponEffectiveStartTime',
        'couponEffectiveEndTime','couponLeftCount','couponTotalCount','tag'];

    $.each(getInfoArr, function(k,val) {
        $('#'+ val +'').val(getGoodInfo[val]);
    });
    $('#imageUrl').attr('src',getGoodInfo.pictUrl);  //商品主图
    $('.good_list').find('a[tagKey="'+ getGoodInfo.tag +'"]').removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
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

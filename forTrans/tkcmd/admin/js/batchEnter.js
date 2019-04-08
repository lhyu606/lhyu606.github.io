/**
 * Created by yjp on 2018/11/11.
 * 商品批量录入
 */
var par = parseURL(window.location.href);
var $,layer,form;
var goodsToBeAdd = [];    //定义存放多个商品的数组
var token = sessionStorage.getItem('adminToken');


layui.use(['jquery', 'layer', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    form = layui.form;


    // 解析多个商品
    $('.parse').click(function() {
        var str = $('#batchData').val();
        var inputLines = str.split('\n');	//分割字符串为数组;
        goodsToBeAdd = [];			//清空当前输入框;

        for(var i= 0; i< inputLines.length; i++) {
            var oneLine = inputLines[i];
            var lineInfo = decodeLineInfoAli(oneLine);
            if(lineInfo) {
                goodsToBeAdd.push(lineInfo);
            }
        }
        removeExistsGoods();
    })

    var checkTksInterval = null;
    $('.check_tks').click(function() {
        if(checkTksInterval) {
            clearInterval(checkTksInterval);
            checkTksInterval = 0;
            $('.check_tks').val('检查定向');
        }
        else {
            $('.accessGoods').empty();
            checkTksInterval = setInterval(checkTks1Goods, 1000);
            $('.check_tks').val('停止检查');
        }
    });

    // 批量新增商品
    $("body").on("click",".sure",function() {
        addSomeGoodsToSrv(50, true);
        return;
    })

    //重置
    $('.reset').click(function() {
        $('#accessGoods tr').remove();
        $(".batchGoodsUrl span").html("");
    })

});


/**
 * 从优惠券标题解析面值：只包含一个数字时，就是这个数字； 包含2个以上数字，取最小的那个
 */
function decodeAmountFromTitle(title) {
    var reg = /[0-9]{1,6}(\.[0-9]{1,2}){0,1}/gm;
    var result;
    var resultAmount = 0;
    while(result = reg.exec(title)) {
        var amount = parseFloat(result[0]);
        if(resultAmount <= 0 || resultAmount > amount) {
            resultAmount = amount;
        }
    }
    return resultAmount;
}

function decodeLineInfoAli(oneLine) {
    var lineParts = oneLine.split('\t');
    if(lineParts.length < 21) return;
    var goods = {
        auctionId:lineParts[0],
        title:lineParts[1],
        pictUrl:lineParts[2],
        auctionUrl:lineParts[3],
        tag:lineParts[4],
        longUrl:lineParts[5],
        reservePrice:lineParts[6],
        biz30day:lineParts[7],
        tkRate:lineParts[8],
        tkCommFee:lineParts[9],
        sellerName:lineParts[10],
        sellerId:lineParts[11],
        shopTitle:lineParts[12],
        userType:lineParts[13] == '天猫' ? 1 : 0,
        activityId:lineParts[14],
        couponTotalCount:lineParts[15],
        couponLeftCount:lineParts[16],
        couponEffectiveStartTime:lineParts[17],
        couponEffectiveEndTime:lineParts[18],
        couponInfo:lineParts[19],
        couponUrl:lineParts[20],
        longCouponUrl:lineParts[21],
    };

    goods.zkPrice = goods.reservePrice;
    goods.couponAmount = decodeAmountFromTitle(goods.couponInfo);
    goods.source = '后妈精选';
    goods.maxTkRate = goods.tkRate;
    goods.realTkRate = goods.tkRate;
    goods.includeDxjh = true;
    goods.totalNum = 99999;
    goods.isTMall = goods.userType;
    goods.tag += top.makeAutoTags(goods.title);
    return goods;
}

function removeExistsGoods() {

    var auctionIdList =  [];    //存放取到商品的id
    goodsToBeAdd.forEach(function (goods) {
        auctionIdList.push(goods.auctionId);
    });

    var data = {};
    data.auctionIdList = JSON.stringify(auctionIdList);

    $.ajax({
        type:"post",
        dataType: 'json',
        url: server_url + "/goods/isExist",
        data: data,
        success: function(data){
            if(data.status == 200){
                var allExistAids = {};
                data.payload.forEach(function(item) {
                    allExistAids[item.auctionId] = item.hiddenActivityId;
                });
                var leftItems = [];

                goodsToBeAdd.forEach(function (goods) {
                    if(allExistAids.hasOwnProperty(goods.auctionId)){
                        goods.title = '已存在！' + goods.title;
                        appendOneGoodsToList(goods);
                        return;
                    }
                    appendOneGoodsToList(goods);
                    leftItems.push(goods);
                });

                goodsToBeAdd = leftItems;

                import_prg.innerHTML = ('清除： ' + data.payload.length + '个商品' + '剩余： ' + goodsToBeAdd.length + ' 个');

            }else if(data.status == 400){
                top.show_alert(data.err);
            }else{
                top.show_alert(data.err);
            }
        }
    });
}

function appendOneGoodsToList(goods) {
    goods.tkCommFee = top.getRealCommFee(goods);	//重新计算佣金后传给后台；
    goods.updated_date = top.formatTimeTZ(new Date(), 'yyyy-MM-dd hh:mm:ss');
    var msg = '<tr class="successGood"><td title="' + goods.auctionUrl + '">' + goods.auctionUrl + '</td><td title="' +
        goods.title + '">' + goods.title + '</td><td title="' + goods.shopTitle + '">' +
        goods.shopTitle + '</td><td>' + goods.zkPrice + '元</td><td>' + goods.totalNum +
        '</td><td>' +
        (goods.hiddenAmount ? ('专属券' + goods.hiddenAmount) : goods.couponAmount) +
        '元</td><td>' + goods.tkCommFee +
        '元</td><td>' + goods.maxTkRate + '%</td><td>' + goods.userType + '</td></tr>';
    $('.accessGoods').append(msg);
}

function addSomeGoodsToSrv(size1pack, autoContinue) {
    if(!size1pack) size1pack = 100;
    if(goodsToBeAdd.length < size1pack) size1pack = goodsToBeAdd.length;

    var goodsList = [];
    for(var i = 0; i < size1pack; ++i){
        var goods = goodsToBeAdd[0];
        goodsToBeAdd.splice(0, 1);
        if(!goods.auctionId) continue;
        goodsList.push(goods);
    }
    if(goodsList.length <= 0){
        if(autoContinue) setTimeout(addSomeGoodsToSrv, 1000);
        return;
    }

    //批量上传数据
    var data = {
        'token': top.adminToken,
        'data': JSON.stringify(goodsList),
        'source': '后妈精选'
    };
    import_prg.innerHTML = '正在导入，剩余：' + goodsToBeAdd.length + '条';
    $.ajax({
        type: "post",
        url: server_url + "/goods/batchCreate",
        data: data,
        dataType: 'json',
        success: function(data){
            if(data.status == 200){
                if(goodsToBeAdd.length <= 0) top.show_alert("批量录入成功！");
                else if(autoContinue) setTimeout(addSomeGoodsToSrv, 1000);
            }
            else if(data.status == 403){
                delete top.adminToken;
                top.location.href = "adminLogin.html";
            }else if(data.status == 400){
                top.show_alert(data.err);
            }
        }
    });
}

function checkTks1Goods() {
    if(!goodsToBeAdd.length){
        clearInterval(checkTksInterval);
        checkTksInterval = 0;
        $('.check_tks').val('检查定向');
        return;
    }
    for(var i = 0; i < goodsToBeAdd.length; ++i){
        if(i >= 10 || i == goodsToBeAdd.length - 1){
            addSomeGoodsToSrv(i, false);
            return;
        }
        var goods = goodsToBeAdd[i];
        if(goods.hasCheckedTks) continue;
        if(goods.isCheckingTks) continue;

        import_prg.innerHTML = '正在检查第：' + i + '条, 总共' + goodsToBeAdd.length + '条';

        goods.maxTkRate = 0;
        top.getGoodsInfoByUrlOrId(goods.auctionId, function (datas) {
            var data = datas[0];
            goods.hasCheckedTks = true;
            goods.isCheckingTks = false;

            goods.maxTkRate = data.maxTkRate;
            goods.eventRate = data.eventRate;
            goods.eventCreatorId = data.eventCreatorId;

            if(goods.maxTkRate < 20 && goods.eventRate < 25) return;

            appendOneGoodsToList(goods);
        }, function (url, msg) {
            goods.hasCheckedTks = true;
            goods.isCheckingTks = false;

            goods.auctionId = 0;
        }, 3);
        return;
    }
}
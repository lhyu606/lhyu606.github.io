'use strict';
/**
 * Created by pkd on 2017/2/8.
 * 此模块仅能在浏览器进程使用，即html、js内。
 * 在index.html里引用，frame里的文件不要引用此文件
 * 该文件包含跟阿里妈妈相关的接口调用、内容解析等功能。
 */
var temp = {};
var reg = /(http\:\/\/|https\:\/\/|)[a-z0-9][a-z0-9\-\.]{0,61}\.[a-z]{2,4}\/[0-9a-z\/?&=_\-#%\.]*/img;	//匹配字符串中的地址


/**
 * 获取淘宝商品详情，该商品必须有加入联盟
 */
function onGetGoodsFromAliSuc(pageList, onSuc) {
    pageList.forEach(function (g) {    // 计算最高佣金
        g.maxTkRate = 0;
        var tks = g.tkSpecialCampaignIdRateMap;
        if(tks){
            for(var cid in tks){
                var thisTkRate = parseFloat(tks[cid]);
                if(g.maxTkRate < thisTkRate){
                    g.maxTkRate = thisTkRate;
                }
            }
            g.tkCommFee = top.getRealCommFee(g);
        }
        if(g.pictUrl.indexOf('//') == 0) g.pictUrl = 'http:' + g.pictUrl;
    })
    if(onSuc) onSuc(pageList);
}

function onGetGoodsFromAliError(url, rsp, onSuc, onError, tryTimes) {
    if(rsp.status == 200 && rsp.responseText.indexOf('访问受限')){
        if(tryTimes){
            --tryTimes;
            if(tryTimes > 0){
                setTimeout(function(){
                    getGoodsInfoByUrlOrId(url, onSuc, onError, tryTimes);
                }, 100);
                return;
            }
        }
        if (onError) onError(url, '访问受限');
        return;
    }
    if (onError) onError(url, rsp);
}

function getNoQqhdGoodsInfoByUrlOrId(url, onSuc, onError, tryTimes) {

    if (!isNaN(url)){
        url = 'https://item.taobao.com/item.htm?id=' + url;
    }
    var urlGet = 'http://pub.alimama.com/items/search.json?q=';
    urlGet += encodeURI(url);
    $.ajax({
        type: "get",
        url: urlGet,
        dataType: 'json',
        success: function (rsp) {
            if(!rsp || !rsp.ok || !rsp.data){
                if (onError) onError(url, rsp);
                return;
            }
            if(!rsp.data.pageList || rsp.data.pageList.length <= 0){
                if (onError) onError(url, '商品不存在');
                return;
            }
            onGetGoodsFromAliSuc(rsp.data.pageList, onSuc);
        },
        error:function (rsp) {
            onGetGoodsFromAliError(url, rsp, onSuc, onError, tryTimes);
        }
    });
}
function getGoodsInfoByUrlOrId(url, onSuc, onError, tryTimes) {

    if (!isNaN(url)){
        url = 'https://item.taobao.com/item.htm?id=' + url;
    }
    var urlGet = 'http://pub.alimama.com/items/channel/qqhd.json?channel=qqhd&perPageSize=40&q=';
    urlGet += encodeURI(url);
    $.ajax({
        type: "get",
        url: urlGet,
        dataType: 'json',
        success: function (rsp) {
            if(!rsp || !rsp.ok || !rsp.data){
                if (onError) onError(url, rsp);
                return;
            }
            if(!rsp.data.pageList || rsp.data.pageList.length <= 0){
                getNoQqhdGoodsInfoByUrlOrId(url, onSuc, onError, tryTimes);
                return;
            }
            onGetGoodsFromAliSuc(rsp.data.pageList, onSuc);
        },
        error:function (rsp) {
            onGetGoodsFromAliError(url, rsp, onSuc, onError, tryTimes);
        }
    });
}

function dropFloatTail(f) {
    f = parseFloat(f).toFixed(2);
    if(f.substr(f.length - 2) == '00') return f.substr(0, f.length - 3);
    if(f.substr(f.length - 1) == '0') return f.substr(0, f.length - 1);
    return f;
}



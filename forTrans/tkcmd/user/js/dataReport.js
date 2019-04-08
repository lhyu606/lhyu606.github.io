/**
 * Created by Administrator on 2018/1/22.
 */

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');

    var par = parseURL(window.location.href);
    var token = sessionStorage.getItem('token');
    
    var filterParam = {
        'token': token
    }

    if(par.params.pdata) {
        $('.lie_lt_3').hide();
        var d = JSON.parse(decodeURI(par.params.pdata));
        $('.dataGather').html('数据汇总（所属账号：'+ d.acc +'）')

        filterParam.isFindByArea = true;
        filterParam.f_account = d.acc;
        filterParam.f_uid = d.uid;
        filterParam.f_pre_agent_lvl = d.pal;
    }

    getAllInfo();

    $('#tradeTal').click(function () {
        $('.tdTalAndCommInc', window.parent.document).click();
    });
    $('#commInc').click(function () {
        $('.tdTalAndCommInc', window.parent.document).click();
    });
    $('#tradeNum').click(function () {
        $('.tradeVolum', window.parent.document).click();
    });
    $('#bonusInc').click(function () {
        $('.driveBonusInc', window.parent.document).click();
    });
    $('#devpUser').click(function () {
        $('.developUserNum', window.parent.document).click();
    });

    // 公共遮罩层（加载）
    function loadingTip(hasPD) {
        var index;
        if(hasPD) {
            index = parent.layer.load(1, {
                shade: [0.3,'#000'] //0.3透明度的黑色背景
            });
        }
        else {
            index = layer.load(1, {
                shade: [0.3,'#000'] //0.3透明度的黑色背景
            });
        }
        return index;
    }
    

    /**
     * 数据汇总
     * param  token
     * url  /form/getAllInfo
     */
    function getAllInfo() {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: top.server_url + '/form/getAllInfo',
            data: filterParam,
            beforeSend: function () {    //请求成功前显示加载中
                if(par.params.pdata)  loadingTip(true);
                else  loadingTip();
            },
            complete: function () {    //请求成功后移除加载
                if(par.params.pdata)  parent.layer.close(loadingTip(true));
                else  layer.close(loadingTip());
            },
            success: function(rsp) {
                if(rsp.status == 200) {
                    var tradeTal_num = rsp.payload.tradeFeeNum.allNum.realPayFeeString ? rsp.payload.tradeFeeNum.allNum.realPayFeeString : 0;
                    var commInc_num = rsp.payload.tradeFeeNum.allNum.recSum ? rsp.payload.tradeFeeNum.allNum.recSum : 0;
                    var trade_num = rsp.payload.tradeNum.allNum ? rsp.payload.tradeNum.allNum : 0;
                    var bonusInc_num = rsp.payload.recBonusNum.allNum ? rsp.payload.recBonusNum.allNum : 0;
                    var devpUser_num = rsp.payload.devNum.allSum ? rsp.payload.devNum.allSum : 0;

                    var td_turnover = rsp.payload.tradeFeeNum.todayNum.realPayFeeString ? rsp.payload.tradeFeeNum.todayNum.realPayFeeString : 0;
                    var yd_turnover = rsp.payload.tradeFeeNum.yesNum.realPayFeeString ? rsp.payload.tradeFeeNum.yesNum.realPayFeeString : 0;
                    var td_commInc = rsp.payload.tradeFeeNum.todayNum.recSum ? rsp.payload.tradeFeeNum.todayNum.recSum : 0;
                    var yd_commInc = rsp.payload.tradeFeeNum.yesNum.recSum ? rsp.payload.tradeFeeNum.yesNum.recSum : 0;
                    var td_volume = rsp.payload.tradeNum.todayNum ? rsp.payload.tradeNum.todayNum : 0;
                    var yd_volume = rsp.payload.tradeNum.yesNum ? rsp.payload.tradeNum.yesNum : 0;
                    var td_bonusInc = rsp.payload.recBonusNum.todayNum ? rsp.payload.recBonusNum.todayNum : 0;
                    var yd_bonusInc = rsp.payload.recBonusNum.yesNum ? rsp.payload.recBonusNum.yesNum : 0;
                    var td_userNum = rsp.payload.devNum.todaySum ? rsp.payload.devNum.todaySum : 0;
                    var yd_userNum = rsp.payload.devNum.yesSum ? rsp.payload.devNum.yesSum : 0;


                    // 左边数据
                    $('#tradeTal_num').text(fmoney(''+ tradeTal_num));    //交易总额
                    $('#commInc_num').text(fmoney(''+ commInc_num));    //佣金收益
                    $('#trade_num').text(fmoney(''+ trade_num));    //交易量
                    $('#bonusInc_num').text(fmoney(''+ bonusInc_num));    //直推奖金收益
                    $('#devpUser_num').text(fmoney(''+ devpUser_num));    //发展用户数

                    //右边数据
                    $('#td_turnover').text(fmoney(''+ td_turnover));  //今日交易额
                    $('#yd_turnover').text(fmoney(''+ yd_turnover));  //昨日交易额
                    $('#td_commInc').text(fmoney(''+ td_commInc));   //今日佣金收益
                    $('#yd_commInc').text(fmoney(''+ yd_commInc));   //昨日佣金收益
                    $('#td_volume').text(fmoney(''+ td_volume));    //今日交易量
                    $('#yd_volume').text(fmoney(''+yd_volume));    //昨日交易量
                    $('#td_bonusInc').text(fmoney(''+ td_bonusInc));  //今日直推奖金收益
                    $('#yd_bonusInc').text(fmoney(''+ yd_bonusInc));  //昨日直推奖金收益
                    $('#td_userNum').text(fmoney(''+ td_userNum));   //今日发展用户数
                    $('#yd_userNum').text(fmoney(''+ yd_userNum));   //昨日发展用户数
                }
                else if(rsp.status == 403) {
                    top.location.href = "login.html";
                }
                else {
                    layer.msg(rsp.err, {icon:2});
                }
            },
            error: function (rsp) {
                layer.alert('登陆失败！请联系管理员。', {icon: 7});
            }
        });
    }

});

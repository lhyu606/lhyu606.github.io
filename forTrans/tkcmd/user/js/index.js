/**
 * Created by yjp on 2017/10/25.
 */
//layui 初始化
var layer,$;
var token = sessionStorage.getItem('token');
var myreg = /^(1)[0-9]{10}$/;

layui.use(['element', 'layer', 'jquery'], function() {
    $ = layui.jquery;  // 注册 jquery 事件
    layer = layui.layer;  //弹层

    if(sessionStorage.getItem('hasFiliale') == 2) {
        $('.fws_div').removeClass('hide');
    }
    
    $('#adminAccount').html(localStorage.getItem('userName'));  //账号显示
    $('.wtkCount').text(sessionStorage.getItem('wtk_count'));  //微淘客名额
    $('.jyCount').text(sessionStorage.getItem('jy_count'));  //总监名额
    $('.fwsCount').text(sessionStorage.getItem('fws_count'));  //服务商名额
    
    //管理员退出
    $('#adminLogout').click(function () {
        sessionStorage.removeItem('token');
        top.location.href = "login.html";
    });

    switch_to_frame('mainx_frm', 'wiTKList.html');  //首页加载（微淘客）

    // 判断是否大区经理
    if(sessionStorage.getItem('areaManage')) {
        $('.branchCompany').removeClass('hide');
    }

    // 判断是否是服务商账号
    if(sessionStorage.getItem('hasFiliale') == 2 || sessionStorage.getItem('areaManage')) {
        $('.filialeManage').removeClass('hide');
    }


    //批量输入手机号
    $('body').on('click', '.inputTels', function () {
        layer.open({
            type: 2,
            title: '批量输入手机号',
            shadeClose: false,
            shade: 0.4,
            area: ['450px', '32%'],
            content: 'importTel.html'   //iframe的url
        });
    });
    //转赠天使会员名额
    $('.giveNum').on('click', function () {
        var html = '';
        html += '<div class="layui-form-block" style="margin: 20px 30px">'
        html += '<label>账号：</label>'
        html += '<div class="layui-input-inline">'
        html += '<input class="layui-input" name="id" id="giveAcc" autocomplete="off" placeholder="账号">'
        html += '</div>'
        html += '</div>'
        html += '<div class="layui-form-block" style="margin: 20px 30px">'
        html += '<label>数量：</label>'
        html += '<div class="layui-input-inline">'
        html += '<input class="layui-input" name="id" id="lvl" autocomplete="off" placeholder="数量">'
        html += '</div>'
        html += '</div>'

        layer.open({
            type: 1,
            title: '转赠天使会员名额',
            btn: ['确定','取消'], //按钮
            shadeClose: false,
            shade: 0.4,
            area: ['310px','26%'],
            content: html,
            yes: function(index,layero) {
                var tshyCount = $('.tshyCount').text();
                var lvl = $('#lvl').val();
                var giveAcc = $('#giveAcc').val();
                if(lvl > Number(tshyCount)) {
                    layer.msg("转赠人数不能大于"+ tshyCount +"人！");
                }
                else if(lvl <=0) {
                    layer.msg("赋予数量不为空！");
                }
                else if(giveAcc=='' || giveAcc==undefined) {
                    layer.msg("请输入转赠账号！");
                }
                else if(!myreg.test(giveAcc)) {
                    layer.msg("账号格式错误！");
                }
                else {
                    var param = {
                        token: token,
                        app_sid: 'usuz',
                        vip_sid: 'xqkSVip_quty',
                        vip_type: '1',
                        lvl: lvl,
                        give_acc: giveAcc
                    }
                    giveVip(param,index)
                }
            }
        });
    });


    function removeCls() {
        $('.top_title').removeClass('hide');
        $('.content').removeClass('top0');
    }
    function addCls() {
        $('.top_title').addClass('hide');
        $('.content').addClass('top0');
    }


    $('.memberList').click(function () {
        removeCls()
        switch_to_frame('mainx_frm', 'memberList.html');  //团员
    });
    $('.wiTKList').click(function () {
        removeCls()
        switch_to_frame('mainx_frm', 'wiTKList.html');  //微淘客
    });
    $('.memberManage').click(function () {
        removeCls()
        switch_to_frame('mainx_frm', 'memberManage.html');  //直属团员
    });
    $('.directorManage').click(function () {
        removeCls()
        switch_to_frame('mainx_frm', 'directorManage.html');  //总监
    });
    $('.filialeManage').click(function () {
        removeCls()
        switch_to_frame('mainx_frm', 'filialeManage.html');  //服务商
    });
    $('.branchCompany').click(function () {
        removeCls()
        switch_to_frame('mainx_frm', 'branchCompany.html');  //分公司
    });

    $('.dataReport').click(function () {
        addCls()
        switch_to_frame('mainx_frm', 'dataReport.html');  //数据汇总
    });
    $('.tdTalAndCommInc').click(function () {
        addCls()
        switch_to_frame('mainx_frm', 'tdTalAndCommInc.html');  //交易总额/佣金收益
    });
    $('.tradeVolum').click(function () {
        addCls()
        switch_to_frame('mainx_frm', 'tradeVolum.html');  //交易量
    });
    $('.driveBonusInc').click(function () {
        addCls()
        switch_to_frame('mainx_frm', 'driveBonusInc.html');  //直推奖金收益
    });
    $('.developUserNum').click(function () {
        addCls()
        switch_to_frame('mainx_frm', 'developUserNum.html');  //发展用户数
    });

});

/**
 * 获取所有vip数据 (获取天使会员名额)
 * url: url/users/getAllVip
 * param: token,app_sid
 */
function getAllVip() {
    $.ajax({
        url: top.server_url + "/users/getAllVip",
        type: "post",
        dataType: "json",
        data: { token: token, app_sid: 'usuz' },
        success: function (data) {
            if (data.status == 200) {
                $.each(data.payload.vips, function (index,obj) {
                    if(obj.vip_sid == "xqkSVip_quty") {
                        $('.tshyCount').text(obj.lvl);  //天使会员名额
                    }
                })
            } else {
                layer.msg(data.err);
            }
        },
        error: function() {
            layer.alert('网络错误，请联系管理员或稍后重试！', {
                icon: 7
            });
        }
    });
}
getAllVip();

/**
 * 赠予会员
 * url: url/user_vip/give_vip
 * param: token,app_sid,vip_sid,vip_type,give_acc,duration
 */
function giveVip(param, layer_index) {
    $.ajax({
        url: top.server_url + "/user_vip/give_vip",
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {
            if(data.status == 200) {
                layer.msg("转赠成功！");
                getAllVip();
                setTimeout(function () {
                    layer.close(layer_index);
                },2000)
            }
            else {
                layer.msg(data.err);
            }
        },
        error: function() {
            var msg = "网络错误，请联系管理员或稍后重试！";
            layer.msg(msg);
        }
    });
}

  

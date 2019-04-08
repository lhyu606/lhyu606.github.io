/**
 * Created by yjp on 2018/10/18.
 * 存放一些公用接口
 */

layui.use(['jquery', 'layer'], function () {
    var $ = layui.jquery;  //jquery
    var layer = layui.layer;  //弹层

    var token = sessionStorage.getItem('token');

    //设为员工
    // $('body').on('click', '.addToPoll', function () {
    //     var aid = $(this).attr('aid');
    //     var sub_account = $(this).attr('account');
    //     var sdata = {
    //         'token': sessionStorage.getItem('token'),
    //         'sub_uid': aid,
    //         'sub_account':sub_account
    //     };
    //     setEmployee(sdata);
    // });
    //剔除员工
    // $('body').on('click', '.delToPoll', function () {
    //     var aid = $(this).attr('aid');
    //     var sub_account = $(this).attr('account');
    //     var edata = {
    //         'token': sessionStorage.getItem('token'),
    //         'sub_uid': aid,
    //         'sub_account':sub_account
    //     };
    //     eliminateEmployee(edata)
    // });
    
    //设为微淘客
    $('body').on('click', '.setWtk', function () {
        var aid = $(this).attr('aid');
        var sub_account = $(this).attr('account');
        layer.alert('您确定要赋予微淘客身份吗？', {
            title: '赋予微淘客'
            ,yes: function (index, layero) {
                var gdata = {
                    'token': token,
                    'sub_uid': aid,
                    'sub_account':sub_account,
                    'vip_sid':'jihuo'
                };
                giveVip(gdata);
            }
        });
    });
    //设为总监
    $('body').on('click', '.setJy', function () {
        var aid = $(this).attr('aid');
        var sub_account = $(this).attr('account');
        layer.alert('您确定要赋予总监身份吗？', {
            title: '赋予总监'
            ,yes: function (index, layero) {
                var gdata = {
                    'token': token,
                    'sub_uid': aid,
                    'sub_account':sub_account,
                    'vip_sid':'firstVip'
                };
                giveVip(gdata);
            }
        });
    });
    //设为服务商
    $('body').on('click', '.setFws', function () {
        var sub_account = $(this).attr('account');
        layer.alert('您确定要赋予服务商身份吗？', {
            title: '赋予服务商'
            ,yes: function (index, layero) {
                var param = {
                    'token': token,
                    'give_lvl': 4,
                    'sub_account': sub_account
                };
                giveAgent(param);
            }
        });
    });
    //设为天使会员
    $('body').on('click', '.setTshy', function () {
        var find_acc = $(this).attr('account');
        var param = {
            'token': sessionStorage.getItem('token'),
            'app_sid': 'usuz',
            'find_acc': find_acc
        };
        getFriendVip(param);
    });
    //批量输入手机号
    $('.add').click(function () {
        if($('#tel').val()) {
            var strs = $('#tel').val().replace(/\s+/g,",").replace(/，/g,",");
            var accounts = strs.split(',');
            console.log(accounts)
            var param = {
                'token': token,
                'app_sid': 'usuz',
                'vip_sid': 'xqkNoBind',
                'lvl': 0,
                'endTime': '2030-08-08',
                'give_obj': JSON.stringify({give_accs:accounts})
            }
            updateUserVips(param)
        } else {
            layer.msg("请输入账号！");
        }
    });



    /**
     * 设为员工
     * param  token，sub_uid，sub_account
     * url  /agency_management/setEmployee
     */
    function setEmployee(sdata) {
        $.ajax({
            url: top.server_url + "/agency_management/setEmployee",
            type: "post",
            dataType: "json",
            data: sdata,
            success: function (data) {
                if (data.status == 200) {
                    layer.msg("添加成功！");
                    var wtkCount = data.payload.wtk_count;
                    var jyCount = data.payload.jy_count;
                    var fwsCount = data.payload.fws_count;
                    sessionStorage.setItem('wtk_count', wtkCount);
                    sessionStorage.setItem('jy_count', jyCount);
                    sessionStorage.setItem('fws_count', fwsCount);
                    firstGoodsInfo(true);
                } else {
                    layer.msg(data.err);
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                layer.alert('网络错误，请联系管理员或稍后重试！', {
                    icon: 7
                });
            }
        });
    }
    /**
     * 剔除员工
     * param  token，sub_account，sub_uid
     * url  /agency_management/eliminateEmployee
     */
    function eliminateEmployee(edata) {
        $.ajax({
            url: top.server_url + "/agency_management/eliminateEmployee",
            type: "post",
            dataType: "json",
            data: edata,
            success: function (data) {
                if (data.status == 200) {
                    layer.msg("剔除成功！");
                    var wtkCount = data.payload.wtk_count;
                    var jyCount = data.payload.jy_count;
                    var fwsCount = data.payload.fws_count;
                    sessionStorage.setItem('wtk_count', wtkCount);
                    sessionStorage.setItem('jy_count', jyCount);
                    sessionStorage.setItem('fws_count', fwsCount);
                    
                    firstGoodsInfo(true);
                } else {
                    layer.msg(data.err);
                }
            },
            error: function () {
                layer.alert('网络错误，请联系管理员或稍后重试！', {
                    icon: 7
                });
            }
        });
    }
    
    /**
     * 服务商赋予微淘客、总监
     * param  token，sub_uid，sub_account，vip_sid (传 jihuo  或者  firstVip)
     * url  /agency_management/giveVip
     */
    function giveVip(gdata) {
        $.ajax({
            url: top.server_url + "/agency_management/giveVip",
            type: "post",
            dataType: "json",
            data: gdata,
            success: function (data) {
                if (data.status == 200) {
                    layer.msg("赋予成功！");
                    var wtkCount = data.payload.wtk_count;
                    var jyCount = data.payload.jy_count;
                    $('.wtkCount', parent.document).text(wtkCount);
                    $('.jyCount', parent.document).text(jyCount);
                    sessionStorage.setItem('wtk_count', wtkCount);
                    sessionStorage.setItem('jy_count', jyCount);

                    firstGoodsInfo(true);
                } else {
                    layer.msg(data.err);
                }
            },
            error: function () {
                layer.alert('网络错误，请联系管理员或稍后重试！', {
                    icon: 7
                });
            }
        });
    }
    /**
     * 高级代理赋予成员低级代理
     * @param  token  give_lvl  sub_account
     * url//agency_management/giveAgent
     */
    function giveAgent(param) {
        $.ajax({
            url: top.server_url + "/agency_management/giveAgent",
            type: "post",
            dataType: "json",
            data: param,
            success: function (data) {
                if (data.status == 200) {
                    layer.msg("赋予成功！");
                    var fwsCount = data.payload.fws_count;
                    $('.fwsCount',parent.document).text(fwsCount);
                    sessionStorage.setItem('fws_count', fwsCount);
                    firstGoodsInfo(true);
                } else {
                    layer.msg(data.err);
                }
            },
            error: function () {
                layer.alert('网络错误，请联系管理员或稍后重试！', {
                    icon: 7
                });
            }
        });
    }
    /**
     * 查看小伙伴会员
     * url: url/user_vip/get_friend_vip
     * param: token,find_acc
     */
    function getFriendVip(param) {
        $.ajax({
            url: top.server_url + "/user_vip/get_friend_vip",
            type: "post",
            dataType: "json",
            data: param,
            success: function(data) {
                if(data.status == 200) {
                    var srvTime = data.payload.srvTime;
                    var title = "您确定要赋予天使会员吗？";
                    if(data.payload.vips) {
                        var vips = data.payload.vips;
                        $.each(vips, function (index,obj) {
                            if(obj.vip_sid == "xqkSVip") {
                                var endTime = new Date(simpleDateFormat(obj.end_time)).getTime();
                                if(Number(srvTime) < Number(endTime)) {
                                    title = '该用户已有天使会员，<br/>到期时间为：'+ simpleDateFormat(obj.end_time) +'，<br/>您确定要再赋予一年吗？';
                                }
                            }
                        })
                    }
                    layer_giveXqkSvip(title,param.find_acc);
                }
                else {
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
    function layer_giveXqkSvip(title,giveAcc) {
        layer.alert(title, {
            title: '赋予天使会员'
            ,yes: function (index, layero) {
                var param = {
                    'token': token,
                    'give_acc': giveAcc
                };
                giveXqkSvip(param);
            }
        });
    }
    /**
     * 赠予向钱看会员
     * url: url/user_vip/give_xqk_svip
     * param: token,give_acc
     */
    function giveXqkSvip(param) {
        $.ajax({
            url: top.server_url + "/user_vip/give_xqk_svip",
            type: "post",
            dataType: "json",
            data: param,
            success: function(data) {
                if (data.status == 200) {
                    layer.msg("赋予成功！");
                    window.parent.getAllVip();
                    firstGoodsInfo(true);
                }
                else {
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
    /**
     * 批量输入手机号
     * param  token, account
     * url  /admin_user/updateUserVips
     */
    function updateUserVips(param) {
        $.ajax({
            url: login_url + "/admin_user/updateUserVips",
            type: "post",
            dataType: "json",
            data: param,
            beforeSend: function () {  //请求成功前
                loadingTip();
            },
            complete: function () {  //请求成功后
                parent.layer.close(loadingTip());
            },
            success: function (data) {
                if(data.status == 200) {
                    layer.msg("录入成功！");
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
    
})



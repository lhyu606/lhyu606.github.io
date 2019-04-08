/**
 * Created by yjp on 2017/10/25.
 */

//layui 初始化组件
layui.use(['layer', 'form'], function () {
    var layer = layui.layer;  // 注册 layer 事件
    var form = layui.form;  // 注册 form 事件
    var $ = layui.jquery;  // 注册 jquery 事件

    //登录按钮绑定回车键
    $("body").keydown(function() {
        if(event.keyCode == 13) {  //回车键的键值为13
            $("#login").click(); //调用注册按钮的登录事件
        }
    });
    
    //表单验证
    form.verify({
        userName: function (value) {
            if (value === '') return '请输入用户名';
        },
        password: function (value) {
            if (value === '') return '请输入密码';
        }
    });

    if (window.localStorage.getItem('userName') && window.localStorage.getItem('password')) {
        $('#userName').val(window.localStorage.getItem('userName'));
        $('#password').val(window.localStorage.getItem('password'));
    }

    //监听提交
    form.on('submit(login)', function(data) {
        console.log(data.field)

        if (data.field.open == "on") {
            window.localStorage.setItem('userName', data.field.userName);
            window.localStorage.setItem('password', data.field.password);
        } else {
            window.localStorage.removeItem('userName');
            window.localStorage.removeItem('password');
        }

        var param = {
            'account': data.field.userName,
            'password': data.field.password
        };
        /**
         * 服务商登录页面
         * @param  account
         * @param  password
         * url//agency_management/login
         */
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: top.server_url + '/agency_management/login',
            data: param,
            success: function(rsp) {
                if(rsp.status == 200) {
                    sessionStorage.setItem('token',rsp.payload.token);
                    if (rsp.payload.data && rsp.payload.data.account) {
                        sessionStorage.setItem('account',rsp.payload.data.account);
                    }
                    sessionStorage.setItem('jy_count',rsp.payload.jy_count);
                    sessionStorage.setItem('wtk_count',rsp.payload.wtk_count);
                    sessionStorage.setItem('fws_count',rsp.payload.fws_count);
                    if(rsp.payload.pre_agent_lvl) {
                        sessionStorage.setItem('hasFiliale',rsp.payload.pre_agent_lvl);
                    }
                    //大区经理
                    if(rsp.payload.appInfo && rsp.payload.appInfo[0].vipInfo.area) {
                        sessionStorage.setItem('areaManage',rsp.payload.appInfo[0].vipInfo.area);
                    }
                    
                    window.location.href = "index.html";
                }
                else {
                    layer.msg(rsp.err, {icon:2});
                }
            },
            error: function (rsp) {
                layer.alert('登陆失败！请联系管理员。', {icon: 7});
            }
        });

        return false;
    });

});

/**
 * Created by yjp on 2018/10/29.
 */

//layui 初始化组件
layui.use(['layer', 'form'], function () {
    var layer = layui.layer;  // 注册 layer 事件
    var form = layui.form;  // 注册 form 事件
    var $ = layui.jquery;  // 注册 jquery 事件

    //登录按钮绑定回车键
    $("body").keyup(function() {
        if(event.keyCode == 13) {  //回车键的键值为13
            $("#login").trigger("click"); //调用注册按钮的登录事件
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
            'password': data.field.password,
            'app_sid': app_sid
        };

        /**
         * 管理后台登录页面
         * @param  account，password，app_sid
         * url/  /admin/login
         */
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: login_url + '/admin/login',
            data: param,
            success: function(rsp) {
                if(rsp.status == 200) {
                    sessionStorage.setItem('adminToken', rsp.payload.token);
                    sessionStorage.setItem('adminAccount', rsp.payload.account);
                    sessionStorage.setItem('adminRole', rsp.payload.role);
                    sessionStorage.setItem('adminUid', rsp.payload.uid);
                    window.location.href = 'index.html';
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

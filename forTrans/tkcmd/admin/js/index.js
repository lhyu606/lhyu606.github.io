/**
 * Created by yjp on 2018/10/29.
 */
//layui 初始化
var layer,$;
var adminToken = sessionStorage.getItem('adminToken');
var adminRole = sessionStorage.getItem('adminRole');
var adminAccount = sessionStorage.getItem('adminAccount');

layui.use(['element', 'layer', 'jquery'], function() {
    $ = layui.jquery;  // 注册 jquery 事件
    layer = layui.layer;  //弹层

    if(!adminToken)	top.location.href = 'login.html';
    $('#adminAccount').html(adminAccount);  //账号显示


    //管理员退出
    $('#adminLogout').click(function () {
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminRole');
        sessionStorage.removeItem('adminAccount');
        top.location.href = "login.html";
    });

    switch_to_frame('mainx_frm', 'allGoodsList.html');  //首页加载


    // 管理员模块
    $('.adminMessage').click(function () {
        switch_to_frame('mainx_frm', 'adminMessage.html');  //管理员信息
    });
    $('.userMessage').click(function () {
        switch_to_frame('mainx_frm', 'userMessage.html');  //用户信息
    });
    $('.feedback').click(function () {
        switch_to_frame('mainx_frm', 'feedback.html');     //用户反馈
    });
    $('.dataReport').click(function () {
        switch_to_frame('mainx_frm', 'dataReport.html');  //数据报表
    });
    $('.orderDetail').click(function () {
        switch_to_frame('mainx_frm', 'orderDetail.html');  //订单明细
    });
    $('.cashCheck').click(function () {
        switch_to_frame('mainx_frm', 'cashCheck.html');  //提现记录
    });
    $('.searchFlow').click(function () {
        switch_to_frame('mainx_frm', 'searchFlow.html');  //资金流水查询
    });


    // 商品管理模块
    $('.allGoodsList').click(function () {
        switch_to_frame('mainx_frm', 'allGoodsList.html');  //商品列表
    });
    $('.goodEnter').click(function () {
        switch_to_frame('mainx_frm', 'goodEnter.html');  //商品录入
    });
    $('.freeGoodEnter').click(function () {
        switch_to_frame('mainx_frm', 'freeGoodEnter.html');  //批量录入
    });
    $('.batchEnter').click(function () {
        switch_to_frame('mainx_frm', 'batchEnter.html');  //批量录入
    });
    $('.goodsInfo').click(function () {
        switch_to_frame('mainx_frm', 'goodsInfo.html');  //商品管理
    });
    $('.jpku').click(function () {
        switch_to_frame('mainx_frm', 'jpku.html');  //精品库
    });

    //内容管理模块
    $('.waiterList').click(function () {
        switch_to_frame('mainx_frm', 'waiterList.html');  //商品列表
    });
    $('.newspaperList').click(function () {
        switch_to_frame('mainx_frm', 'newspaperList.html');  //商品录入
    });
    $('.pushList').click(function () {
        switch_to_frame('mainx_frm', 'pushList.html');  //商品列表
    });
    $('.notice').click(function () {
        switch_to_frame('mainx_frm', 'notice.html');  //商品列表
    });


    // APP相关配置模块
    $('.startPageList').click(function () {
        switch_to_frame('mainx_frm', 'startPageList.html');  //启动页榜单
    });
    $('.appInterfaceManage').click(function () {
        switch_to_frame('mainx_frm', 'appInterfaceManage.html');  //APP界面管理
    });
    $('.frdCrlManage').click(function () {
        switch_to_frame('mainx_frm', 'frdCrlManage.html');  //朋友圈配置
    });


    // 设置模块
    $('.editionManage').click(function () {
        switch_to_frame('mainx_frm', 'editionManage.html');  //版本管理
    });

});


  

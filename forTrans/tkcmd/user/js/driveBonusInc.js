/**
 * Created by Administrator on 2018/1/22.
 */
//初始数据
var $,layer,table,laydate,form,$form;
var token = sessionStorage.getItem('token');

layui.use(['jquery', 'laydate', 'layer', 'table', 'form'], function () {
    $ = layui.jquery;  //jquery
    layer = layui.layer;  //弹层
    table = layui.table;  //表格
    laydate = layui.laydate;  //日期
    form = layui.form;
    $form = $('form');


    $('.timeUnit a').click(function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        $('#timeRange_'+ $(this).attr('tagKey')).removeClass('hide').siblings('input').addClass('hide');
        filterParam.time_unit = $(this).attr('tagKey');
    });
    //日期选择（开始时间--结束时间）
    laydate.render({
        elem: '#timeRange_day'
        ,range:true
        ,type: 'date'
        ,done: function(value) {
            delete filterParam.dateType;
            filterParam.start_date = value.substring(0,10);
            filterParam.end_date = value.substring(13,23);
            findTradeNum();
        }
    });
    laydate.render({
        elem: '#timeRange_month'
        ,range:true
        ,type: 'month'
        ,done: function(value) {
            filterParam.start_date = value.substring(0,7);
            filterParam.end_date = value.substring(10,17);
            // console.log(filterParam)
            findTradeNum();
        }
    });
    laydate.render({
        elem: '#timeRange_year'
        ,range:true
        ,type: 'year'
        ,done: function(value) {
            filterParam.start_date = value.substring(0,4);
            filterParam.end_date = value.substring(7,11);
            // console.log(filterParam)
            findTradeNum();
        }
    });

    // 快捷时间段（近48小时、近30天、近6个月）
    $('.dateType a').click(function () {
        $(this).removeClass('layui-btn-primary').siblings('a').addClass('layui-btn-primary');
        delete filterParam.start_date;
        delete filterParam.end_date;
        delete filterParam.time_unit;
        if ($(this).attr('tagKey')) {
            filterParam.dateType = $(this).attr('tagKey');
        } else {
            delete filterParam.dateType;
        }
        findTradeNum();
    });


    // 初始化数据
    var filterParam = {
        'token': token,
        'formType': 'recBonus'
    };
    // 初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'),'macarons');

    /**
     * param  token、start_date、end_date、time_unit、dateType
     * url  /form/getTimeForm
     */
    function findTradeNum() {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: top.server_url + '/form/getTimeForm',
            data: filterParam,
            beforeSend: function () {    //请求成功前显示加载中
                myChart.showLoading();  //打开loading动画
            },
            complete: function () {    //请求成功后移除加载
                myChart.hideLoading();  //打开loading动画
            },
            success: function(rsp) {
                if(rsp.status == 200) {
                    //获取峰值
                    $('.bonusTal_peakNum').text(rsp.payload.allTop+'元');
                    $('.wtkBonus_peakNum').text(rsp.payload.jhTop+'元');
                    $('.jywtkBonus_peakNum').text(rsp.payload.fvTop+'元');
                    var xData = new Array();
                    var seriesData_all = new Array();
                    var seriesData_jh = new Array();
                    var seriesData_fv = new Array();

                    var formList = rsp.payload.formList;
                    

                    if (filterParam.dateType) {    //近48小时、近30天、近6个月
                        if (filterParam.dateType == '2day') {
                            seriesData_all = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                            seriesData_jh = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                            seriesData_fv = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                            xData = ["昨天","04:00","08:00","12:00","16:00","20:00","今天","04:00","08:00","12:00","16:00","20:00","00:00"];
                            if(formList) {
                                $.each(formList, function (index,obj) {
                                    var xiabiao = Math.ceil(obj.xiaBiao / 4);
                                    seriesData_all[xiabiao] += Number(obj.allCounts);
                                    seriesData_jh[xiabiao] += Number(obj.jhCounts);
                                    seriesData_fv[xiabiao] += Number(obj.fvCounts);
                                    seriesData_all[xiabiao] = Number(toDecimal(seriesData_all[xiabiao]));
                                    seriesData_jh[xiabiao] = Number(toDecimal(seriesData_jh[xiabiao]));
                                    seriesData_fv[xiabiao] = Number(toDecimal(seriesData_fv[xiabiao]));
                                });
                            }
                        }
                        else if (filterParam.dateType == '30day') {
                            seriesData_all = [0,0,0,0,0,0,0,0,0,0,0];
                            seriesData_jh = [0,0,0,0,0,0,0,0,0,0,0];
                            seriesData_fv = [0,0,0,0,0,0,0,0,0,0,0];
                            var date=new Date();
                            date.setDate(date.getDate()-30);
                            for(var i=0;i<11;i++){
                                xData.push(date.toLocaleDateString());    //定义横坐标数据
                                date.setDate(date.getDate()+3);
                            }
                            if(formList) {
                                $.each(formList, function (index,obj) {
                                    var xiabiao = Math.ceil(obj.xiaBiao / 3);
                                    seriesData_all[xiabiao] += Number(obj.allCounts);
                                    seriesData_jh[xiabiao] += Number(obj.jhCounts);
                                    seriesData_fv[xiabiao] += Number(obj.fvCounts);
                                    seriesData_all[xiabiao] = Number(toDecimal(seriesData_all[xiabiao]));
                                    seriesData_jh[xiabiao] = Number(toDecimal(seriesData_jh[xiabiao]));
                                    seriesData_fv[xiabiao] = Number(toDecimal(seriesData_fv[xiabiao]));
                                });
                            }
                        }
                        else if (filterParam.dateType == '6month') {
                            seriesData_all = [0,0,0,0,0,0,0];
                            seriesData_jh = [0,0,0,0,0,0,0];
                            seriesData_fv = [0,0,0,0,0,0,0];
                            var date=new Date();
                            date.setMonth(date.getMonth()-6);
                            for(var i=0;i<7;i++) {
                                xData.push(date.toLocaleDateString());    //定义横坐标数据
                                date.setMonth(date.getMonth()+1);
                            }
                            if(formList) {
                                $.each(formList, function (index,obj) {
                                    var xiabiao = Math.ceil(obj.xiaBiao);
                                    seriesData_all[xiabiao] += Number(obj.allCounts);
                                    seriesData_jh[xiabiao] += Number(obj.jhCounts);
                                    seriesData_fv[xiabiao] += Number(obj.fvCounts);
                                    seriesData_all[xiabiao] = Number(toDecimal(seriesData_all[xiabiao]));
                                    seriesData_jh[xiabiao] = Number(toDecimal(seriesData_jh[xiabiao]));
                                    seriesData_fv[xiabiao] = Number(toDecimal(seriesData_fv[xiabiao]));
                                });
                            }
                        }
                    }
                    else {    // 默认近七天数据
                        seriesData_all = [0,0,0,0,0,0,0];
                        seriesData_jh = [0,0,0,0,0,0,0];
                        seriesData_fv = [0,0,0,0,0,0,0];
                        var date=new Date();
                        date.setDate(date.getDate()-6);
                        for(var i=0;i<7;i++){
                            xData.push(date.toLocaleDateString());    //定义横坐标数据
                            date.setDate(date.getDate()+1);
                        }
                        if(formList) {
                            $.each(formList, function (index,obj) {
                                var xiabiao = Math.ceil(obj.XiaBiao);
                                seriesData_all[xiabiao] += Number(obj.allCounts);
                                seriesData_jh[xiabiao] += Number(obj.jhCounts);
                                seriesData_fv[xiabiao] += Number(obj.fvCounts);
                                seriesData_all[xiabiao] = Number(toDecimal(seriesData_all[xiabiao]));
                                seriesData_jh[xiabiao] = Number(toDecimal(seriesData_jh[xiabiao]));
                                seriesData_fv[xiabiao] = Number(toDecimal(seriesData_fv[xiabiao]));
                            });
                        }
                    }
                    
                    
                    // 指定图表的配置项和数据
                    option = {
                        title: {
                            text: '金额（元）',
                            left: '5%',
                            textStyle: {
                                fontWeight: 'normal',              //标题颜色
                                fontSize: '22',
                                color: '#4C5E70'
                            },
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data:[
                                {
                                    name:'直推奖金总数',
                                    textStyle:{
                                        fontSize:16,
                                        color:'#393D49'
                                    },
                                    icon:'roundRect'
                                },
                                {
                                    name:'发展微淘客奖金',
                                    textStyle:{
                                        fontSize:16,
                                        color:'#393D49'
                                    },
                                    icon:'roundRect'
                                },
                                {
                                    name:'发展精英微淘客奖金',
                                    textStyle:{
                                        fontSize:16,
                                        color:'#393D49'
                                    },
                                    icon:'roundRect'
                                }
                            ]
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {show: true}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            axisLabel: {
                                // interval:0,  // x坐标显示不全解决办法
                                show: true,
                                textStyle: {    // x轴的字体样式
                                    color: '#50697A',
                                    fontFamily: "微软雅黑",
                                    fontSize:'16'
                                }
                            },
                            data: xData
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                show: true,
                                textStyle: {    // x轴的字体样式
                                    color: '#50697A',
                                    fontFamily: "微软雅黑",
                                    fontSize:'16'
                                }
                            },
                        },
                        series: [
                            {
                                name:'直推奖金总数',
                                type:'line',
                                itemStyle : {
                                    normal : {
                                        color:'#EC1E1E',  //折点颜色
                                        lineStyle:{
                                            color:'#EC1E1E'  //线条颜色
                                        }
                                    }
                                },
                                data:seriesData_all
                            },
                            {
                                name:'发展微淘客奖金',
                                type:'line',
                                itemStyle : {
                                    normal : {
                                        color:'#00B215',  //折点颜色
                                        lineStyle:{
                                            color:'#00B215'  //线条颜色
                                        }
                                    }
                                },
                                data:seriesData_jh
                            },
                            {
                                name:'发展精英微淘客奖金',
                                type:'line',
                                itemStyle : {
                                    normal : {
                                        color:'#EFD600',  //折点颜色
                                        lineStyle:{
                                            color:'#EFD600'  //线条颜色
                                        }
                                    }
                                },
                                data:seriesData_fv
                            }
                        ]
                    };
                    window.onresize = myChart.resize;  //图表自适应处理
                    myChart.setOption(option);  // 使用刚指定的配置项和数据显示图表
                }
                else if(rsp.status == 400) {
                    layer.msg(rsp.err, {icon:2});
                }
                else if(rsp.status == 403) {
                    top.location.href = "login.html";
                }
            },
            error: function (rsp) {
                layer.alert('登陆失败！请联系管理员。', {icon: 7});
            }
        });
    }
    findTradeNum();  //加载页面调用

})


/**
 * Created by Administrator on 2017/10/13.
 */
/**
 * 搜索历史记录的存储与删除
 */
$(function () {
    var hisTime;//获取搜索时间数组
    var hisItem;//获取搜索内容数组

    function init () {
        hisTime = [];//时间数组置空
        hisItem = [];//内容数组置空

        for(var i = 0;i < localStorage.length;i++) {//数据去重
            if(!isNaN(localStorage.key(i))) {//判断数据是否合法
                hisTime.push(localStorage.key(i));
            }
        }
        if(hisTime.length > 0) {
            hisTime.sort();	//排序
            for (var y = 0;y < hisTime.length;y++) {
                localStorage.getItem(hisTime[y]).trim() && hisItem.push(localStorage.getItem(hisTime[y]));
            }
        }
        $(".delete").html("");//执行init(),每次清空之前添加的节点
        $(".storage_no").show();

        for(var i = 0;i < hisItem.length;i++) {
            $(".delete").prepend('<a class="word-break">'+ hisItem[i] +'</a>');
            if(hisItem[i] != '') {
                $(".storage_no").hide();
            }
        }
    }

    init();//调用

    $("#search_btn").click(function() {
        var value = $("#search_input").val();
        var time = (new Date()).getTime();
        //输入的内容localStorage有记录
        if($.inArray(value,hisItem) >= 0) {
            for(var j = 0; j < localStorage.length; j++) {
                if(value == localStorage.getItem(localStorage.key(j))) {
                    localStorage.removeItem(localStorage.key(j));
                }
            }
            localStorage.setItem(time,value);
        } else {
            localStorage.setItem(time,value);
        }
        init();
    });

    //清除记录功能
    $("#his-dele").click(function() {
        if ($('.history').find('a').length > 0) {
            layer.open({
                content: '<span style="font-size: 14px">您确定要删除搜索历史记录吗？</span>'
                ,btn: ['确定', '取消']
                ,yes: function(index) {
                    // localStorage.clear();  //删除所有数据
                    for(var f = 0;f < hisTime.length;f++) {
                        localStorage.removeItem(hisTime[f]);  //删除某个具体变量
                    }
                    init();
                    layer.close(index);
                }
            });
        }
    });

    //解决苹果手机不兼容出现input无法取值的问题
    $(".delete").on("click", ".word-break", function() {
        var div = $(this).text();
        $('#search_input').val(div);
    });
})
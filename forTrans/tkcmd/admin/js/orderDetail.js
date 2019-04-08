/**
 * Created by yjp on 2018/10/31.
 */
var aliAccSts = true;
var $,layer,element,table,laydate,form,size = 10;
window.pageIndex = 1;
var token = sessionStorage.getItem('adminToken');
var filterParam = {
	'token': token,
	'size': size
}
filterParam.page = window.pageIndex;

layui.use(['jquery', 'element', 'laydate', 'layer', 'table', 'form'], function () {
	$ = layui.jquery;  //jquery
	layer = layui.layer;  //弹层
	element = layui.element;
	table = layui.table;  //表格
	laydate = layui.laydate;  //日期
	form = layui.form;

	getOrderList();


	//搜索
	$('.searchBtn').click(function() {
		var search = $('#account').val();
		if(search == '') {
			delete filterParam.keyWord;
		} else {
			filterParam.keyWord = search;
			filterParam.page = 1;
		}
		getOrderList();
	});

	//订单状态搜索
	form.on('select(orderStatus)', function(data) {
		if(data.value=='全部订单') {
			delete filterParam.payStatus;
		} else {
			filterParam.payStatus = data.value;
		}
		getOrderList();
	});

	// 阿里账号搜索
	form.on('select(alimama)', function(data) {
		console.log(data.value)
		if(data.value=='所有阿里账号') {
			delete filterParam.aliAccount;
		} else {
			filterParam.aliAccount = data.value;
		}
		getOrderList();
	});

	// //定义接收本月的第一天和最后一天
	// var startDate1=new Date(new Date().setDate(1));
	// var endDate1=new Date(new Date(new Date().setMonth(new Date().getMonth()+1)).setDate(0));
	// //定义接收上个月的第一天和最后一天
	// var startDate2=new Date(new Date(new Date().setMonth(new Date().getMonth()-1)).setDate(1));
	// var endDate2=new Date(new Date().setDate(0));
	laydate.render({
		elem: '#time_selector',
		type: 'date',
		range: '~',
		format: 'yyyy-MM-dd',
		//max:'2018-1-15',//可选最大日期
		//min:'2018-1-15',//可选最小日期
		extrabtns: [
			// {id:'today', text:'今天', range:[new Date(), new Date()]},
			{id:'yesterday', text:'昨天', range:[new Date(new Date().setDate(new Date().getDate()-1)),
				new Date(new Date().setDate(new Date().getDate()-1))]},
			{id:'lastday-7', text:'过去7天', range:[new Date(new Date().setDate(new Date().getDate()-7)),
				new Date(new Date().setDate(new Date().getDate()-1))]},
			{id:'lastday-15', text:'过去15天', range:[new Date(new Date().setDate(new Date().getDate()-15)),
				new Date(new Date().setDate(new Date().getDate()-1))]},
			{id:'lastday-30', text:'过去30天', range:[new Date(new Date().setDate(new Date().getDate()-30)),
				new Date(new Date().setDate(new Date().getDate()-1))]},
			{id:'lastday-60', text:'过去60天', range:[new Date(new Date().setDate(new Date().getDate()-60)),
				new Date(new Date().setDate(new Date().getDate()-1))]},
			{id:'lastday-90', text:'过去90天', range:[new Date(new Date().setDate(new Date().getDate()-90)),
				new Date(new Date().setDate(new Date().getDate()-1))]}
			// {id:'thismonth', text:'本月', range:[startDate1,endDate1]},
			// {id:'lastmonth', text:'上个月', range:[startDate2,endDate2]}
		],
		done: function(val, stdate, ovdate) {
			//当确认选择时间后调用这里
			filterParam.startTime = val.substring(0, 10);
			filterParam.endTime = val.substring(13);
			getOrderList();
		}
	});

});


// 获取订单明细数据
function getOrderList(isInside) {
	$.ajax({
		type: "post",
		datatype: 'json',
		url: server_url + "/orderList/getOrderList",
		data: filterParam,
		success: function(data) {
			if(data.status == 200) {
				$('tbody').empty();
				if (data.payload.total)
					window.allGoodAmount = data.payload.total;
				else
					window.allGoodAmount = 0;

				if(!isInside)
					setPage();

				if(aliAccSts && data.payload.alis) {
					//获取阿里账号
					var alis = data.payload.alis;
					var ali = '';
					$.each(alis, function(index,obj) {
						ali += '<option value="'+ obj.aliAccount +'">'+obj.aliAccount+'</option>'
					});
					$('#alimama').empty().append(ali);
					form.render();
					aliAccSts = false;
				}

				if(data.payload.data) {
					var rsp = data.payload.data;
					$.each(rsp, function(index,obj) {
						var h = '';
						h += '<tr class="tab_body"><td>' + obj.createTime + '</td>'
						h += '<td>' + obj.belong_account + '</td>'
						h += '<td>' + obj.orderNum + '</td><td class="goods_name">' + obj.auctionTitle + '</td>'
						var payStatus = obj.payStatus;
						if(payStatus.indexOf('付款') != '-1') {
							h += '<td class="payed">' + obj.payStatus + '</td>'
						}
						if(payStatus.indexOf('结算') != '-1') {
							h += '<td class="balance">' + obj.payStatus + '</td>'
						}
						if(payStatus.indexOf('失效') != '-1') {
							h += '<td class="lose">' + obj.payStatus + '</td>'
						}
						if(payStatus.indexOf('成功') != '-1') {
							h += '<td class="wechat">' + obj.payStatus + '</td>'
						}
						var alipayRec = obj.alipayRec || '--';
						h += '<td>￥' + obj.realPayFeeString + '</td><td>' + obj.commissionRate + '</td><td>￥' + alipayRec + '</td>'
						h += '<td>￥' + Number(obj.rec).toFixed(2) + '</td><td>' + obj.adzoneName + '</td><td>' + obj.aliAccount + '</td></tr>'
						$('tbody').append(h);
					});
				} else {
					var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="11">暂无数据！</td></tr>';
					$('tbody').append(noData);
				}
			}
			else if(data.status == 403) {
				top.location.href = "login.html";
			}
			else {
				layer.msg(data.err);
			}
		}
	});
}


/**
 * 商品分页
 */
function setPage() {
	$("#Pagination").pagination(window.allGoodAmount, {
		current_page:0,
		link_to:"#",
		num_edge_entries: 1, //边缘页数
		num_display_entries:4, //主体页数
		callback: pageselectCallback,
		ellipse_text: '...',
		items_per_page: size,
		prev_text: "<",
		next_text: ">"
	});
	function pageselectCallback(page_index, jq) {
        if(window.pageIndex != page_index + 1){
            window.pageIndex = page_index + 1;
            filterParam.page = window.pageIndex;
            getOrderList(true);
        }
	}
}


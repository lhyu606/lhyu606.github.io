/**
 * Created by yjp on 2018/10/31.
 */

layui.use(['jquery', 'element', 'laydate', 'layer', 'table', 'form'], function () {
	$ = layui.jquery;  //jquery
	layer = layui.layer;  //弹层
	element = layui.element;
	table = layui.table;  //表格
	laydate = layui.laydate;  //日期
	form = layui.form;

	var size = 30;
	window.pageIndex = 1;
	var token = sessionStorage.getItem('adminToken')
	var datas = {
		'token': token,
		'app_sid': app_sid,
		'size': size
	}
	datas.page = window.pageIndex;

	cashList();  //加载数据

	// 公共遮罩层（加载）
	function loadingTip() {
		var index = layer.load(1, {
			shade: [0.4,'#000'] //0.5透明度的黑色背景
		});
		return index;
	}


	//单选
	$('body').on('click', '.cbClick', function () {
		var th = $(this);
		if(th.hasClass('layui-form-checked')) {
			$(this).removeClass('layui-form-checked');
		} else {
			$(this).addClass('layui-form-checked');
		}
	});
	//全选
	$('body').on('click', '.allClick', function () {
		var th = $(this);
		if(th.hasClass('layui-form-checked')) {
			$(this).removeClass('layui-form-checked');
			$("#table>tbody").find('.cbClick').removeClass('layui-form-checked');
		} else {
			$(this).addClass('layui-form-checked');
			$("#table>tbody").find('.cbClick').addClass('layui-form-checked');
		}
	});
	//添加选中
	$('.addAccs').click(function () {
		var aids = [];
		var goodCheck = $("#table>tbody").find('.layui-form-checked');

		for(var i = 0; i < goodCheck.length; i++) {		//获取复选框中选中的值(传多个勾选值)
			var goodId = goodCheck.eq(i).parents('tr').attr('aid');
			aids.push(goodId);
		}
		if(aids.length != 0) {
			console.log(aids)
			var param = {
				'token': token,
				'uc_ids': JSON.stringify(aids)
			};
			console.log(param)
			batchAccounts(param);
		} else {
			layer.msg("请选择需要添加的账号！")
		}
	});


	//账号搜索
	$('.seachBut').click(function () {
        if($("#account").val()) {
            datas.user_account = $("#account").val();
        } else {
            delete datas.user_account;
        }
        window.pageIndex = datas.page = 1;
        cashList();
	});
	// 搜省会员/开放商城
	form.on('select(type)', function(data) {
		if(data.value == 1) {
			datas.open_shop = data.value;
		} else {
			delete datas.open_shop;
		}
		window.pageIndex = datas.page = 1;
		cashList();
	});
	// 监听指定开、关
	form.on('switch(switchTest)', function(data) {
		layer.msg('开关状态：'+ (this.checked ? '已开启' : '已关闭'));
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
			datas['startTime'] = val.substring(0, 10);
			datas['endTime'] = val.substring(13);
			cashList();
		}
	});

	// 平台切换
	form.on('select(alimama)', function(data) {
		if(data.value) {
			datas['taoke_account'] = data.value;
		} else {
			delete datas['taoke_account'];
		}
		cashList();
	});
	//状态搜索
	form.on('select(status)', function(data) {
		if(data.value == '00') {
			delete datas['status'];
		} else {
			datas['status'] = data.value;
		}
		cashList();
	});

	var cdatas = {
		token: token,
		app_sid: app_sid
	}
	//审核完毕并放款
	$('body').on('click','.payfor',function() {
		var orderid = $(this).parents('td').attr('orderid');
		cdatas['id'] = orderid;
		cdatas['status'] = '14';
		//询问框
		layer.confirm('打款 ID：'+ orderid +'<br/>您确定要执行打款操作吗？', {
			offset: '30%',
			btn: ['确定','取消'] //按钮
		}, function() {
			handleCash(cdatas);
		});
	});
	//支付宝打款
	$('body').on('click','.zfbPayfor',function() {
		var uc_id = $(this).parents('td').attr('orderid');
		var param = {
			'token': token,
			'uc_id': uc_id
		}
		//询问框
		layer.confirm('打款 ID：'+ uc_id +'<br/>您确定要执行支付宝打款操作吗？', {
			offset: '30%',
			btn: ['确定','取消'] //按钮
		}, function() {
			transToAcc(param);
		});
	});
	//不通过
	$('body').on('click','.refuse',function() {
		var orderid = $(this).parents('td').attr('orderid');
		layer.open({
			type:1,
			title:['填写审批拒绝理由'],
			area:'350px',
			skin:0,
			btn:['确认','取消'],
			content:'<div id="comment"><textarea class="layui-textarea" placeholder="请输入理由" ></textarea></div>',
			yes:function(index){
				var comment = $('#comment textarea').val();
				cdatas['id'] = orderid;
				cdatas['status'] = '13';
				cdatas['comment'] = comment;
				handleCash(cdatas);
				layer.close(index);
			}
		})
	});


	// Excel 列表导出
	$('#table2excel').click(function () {
		excelList();
		setTimeout(function () {
			$("#excelList").table2excel({
				exclude: ".noExl",
				name: "Worksheet Name",
				filename: "提现记录" ,//do not include extension
				exclude_img: true,
				exclude_links: true,
				exclude_inputs: true
			});
		},500)
	});
	// 存放Excel导出列表
	function excelList() {
		var param = {
			'token': token,
			'app_sid': app_sid,
			'page': 1,
			'pageNum': window.allGoodAmount
		}
		if(datas.status) param.status = datas.status;
		$.ajax({
			url: login_url + "/userCash/cashList",
			type: "post",
			dataType: "json",
			data: param,
			success: function(data) {
				if(data.status == 200) {
					$('#excelList tbody').empty();

					var rsp = data.payload.data;
					$.each(rsp, function(index,obj) {
						var h = '';
						var real_name = obj.real_name || '--';
						var comment = obj.comment || '--';

						h += '<tr class="tab_body">'
						h += '<td>'+obj.id+'</td>'
						h += '<td>'+real_name+'</td>'
						h += '<td>'+obj.user_account+'</td>'
						if(obj.cash_type == 12){
							h += '<td>'+obj.plat_account+'</td>'
							h += '<td>--</td>'
						}
						if(obj.cash_type == 13){
							h += '<td>--</td>'
							h += '<td class="wechat">'+obj.plat_account+'</td>'
						}
						h += '<td>'+simpleDateFormat(obj.created_time)+'</td>'
						h += '<td>￥'+obj.money+'</td>'
						h += '<td>￥'+obj.cash+'</td>'
                        h += '<td>￥'+obj.amount+'</td>'
						if(obj.status == 12){
							h += '<td class="payed">未打款</td>'
						}
						if(obj.status == 13){
							h += '<td class="lose">审核不通过</td>'
						}
						if(obj.status == 14) {
							h += '<td class="balance">已打款</td>'
						}
						h += '<td>'+ comment +'</td>'
						h += '</tr>'

						$('#excelList tbody').append(h);
					});
				}
			}
		});
	}


	function cashList(isInside) {
		$.ajax({
			type:"post",
			url:login_url+"/userCash/cashList",
			data:datas,
			success:function(data){
				if(data.status == 200) {
					$('#table tbody').empty();
					$('.totalMoney span').text(data.payload.totalMoney);

					if (data.payload.total)
						window.allGoodAmount = data.payload.total;
					else
						window.allGoodAmount = 0;
					
					if (!isInside)
						setPage();

					if(data.payload.data) {
						var rsp = data.payload.data;
						$.each(rsp, function(index,obj) {
							var h = '';
							var real_name = obj.real_name || '--'
							h += '<tr class="tab_body" acc="'+ obj.user_account +'" aid="'+ obj.id +'">'
							h += '<td>'
							h += '<input type="checkbox" hidden/>'
							h += '<label for="checkAll1">'
							h += '<div class="cbClick layui-unselect layui-form-checkbox" lay-skin="primary">'
							h += '<i class="layui-icon"></i>'
							h += '</div>'
							h += '</label>'
							h += '</td>'
							h += '<td>'+obj.id+'</td>'
							h += '<td>'+real_name+'</td>'
							h += '<td>'+obj.user_account+'</td>'
							if(obj.cash_type == 12){
								h += '<td>'+obj.plat_account+'</td>'
								h += '<td>--</td>'
							}
							if(obj.cash_type == 13){
								h += '<td>--</td>'
								h += '<td class="wechat">'+obj.plat_account+'</td>'
							}
							h += '<td>'+simpleDateFormat(obj.created_time)+'</td>'
							// h += '<td>￥'+obj.money+'</td>'
							h += '<td>￥'+obj.cash+'</td>'
                            h += '<td>￥'+obj.amount+'</td>'
							if(obj.status == 12){
								h += '<td style="color: #3899E8">未打款</td>'
							}
							if(obj.status == 13){
								h += '<td style="color: #FD482C">审核不通过</td>'
							}
							if(obj.status == 14) {
								h += '<td style="color: #5FB878">已打款</td>'
							}
							var comment = obj.comment || '--'
							h += '<td>'+ comment +'</td>'
							h += '<td style="color: #3899E8" orderid="'+ obj.id +'">'
							if(obj.status != 14) {
								h += '<span class="payfor">手动打款</span> | '
								h += '<span class="zfbPayfor" style="cursor: pointer">支付宝自动打款</span> | '
								h += '<span class="refuse">不通过</span>'
							} else {
								h += '<span>--</span>'
							}
							h += '</td>'
							h += '</tr>'

							$('#table tbody').append(h);
						});
					} else {
						var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="12">暂无数据！</td></tr>';
						$('#table tbody').append(noData);
					}
				}
				else if(data.payload == 403) {
					top.location.href = 'login.html';
				}
				else {
					layer.msg('未查询到该记录！');
				}
			}
		});
	}

	//审核提现订单
	function handleCash(cdatas) {
		$.ajax({
			type:"post",
			url:login_url + "/userCash/handleCashApply",
			data:cdatas,
			success:function(data) {
				if(data.status == 200) {
					layer.msg(data.payload);
					cashList(true);  // 打款成功不刷新页面
				}
				else {
					layer.msg(data.err);
				}
			}
		});
	}
	/**
	支付宝打款操作
	 param  token, uc_id
	 url /payment/transToAcc
	*/
	function transToAcc(param) {
		$.ajax({
			type:"post",
			url:server_url + "/payment/transToAcc",
			data:param,
			success:function(data) {
				if(data.status == 200) {
					layer.msg(data.payload);
					cashList(true);  // 打款成功不刷新页面
				}
				else {
					layer.msg(data.err);
				}
			}
		});
	}
	/**
	 * 支付宝批量转账
	 * @param  token  uc_ids   (json.str)
	 * url /payment/batchTrans
	 */
	function batchAccounts(param) {
		$.ajax({
			type:"post",
			url:server_url + "/payment/batchTrans",
			data:param,
			beforeSend: function () {  //请求成功前
				loadingTip();
			},
			complete: function () {  //请求成功后
				layer.close(loadingTip());
			},
			success:function(data) {
				if(data.status == 200) {
					layer.msg('打款成功！');
					cashList(true);  // 打款成功不刷新页面
				}
				else {
					layer.msg(data.err);
				}
			}
		});
	}


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
				datas['page'] = window.pageIndex;
				cashList(true);
			}
		}
	}
})


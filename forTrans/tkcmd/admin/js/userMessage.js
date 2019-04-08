/**
 * 用户信息管理
 * Created by yjp on 2018/10/30.
 */

//初始数据
var $,layer,form,size = 10;
window.pageIndex = 1;
var token = sessionStorage.getItem('adminToken');
var role = sessionStorage.getItem('adminRole');
var filterParam = {
	'token': token,
	'size': size,
	'page': window.pageIndex
};
var setdata = {
	token: token,
	app_sid: app_sid
};

// layui 引入layer 初始化
layui.use(['jquery','layer','form'], function () {
	$ = layui.jquery;
	layer = layui.layer;  //弹层
	form = layui.form;

	findUser();

	// 修改推荐人
	$('body').on('click', '.click', function () {
		var $this = $(this);
		var old_recommender = $this.text();
		var account = $this.parent('tr').find('.user_account').text();
		var param = {
			'token': token,
			'app_sid': app_sid,
			'account': account,
			'old_recommender': old_recommender
		}
		//prompt层
		layer.prompt({
			title: '请输入推荐人',
			value: old_recommender,
			offset: '30%',
			formType: 0
		}, function(text, index) {
			layer.close(index);
			param["new_recommender"] = text;
			changeRecommender(param,$this,text);
		});
	});
	//身份搜索
	form.on('select(identitys)', function(data) {
		if(data.value =='10') {
			delete filterParam.lvl;
            delete filterParam.vip_sid;
		}
		else {
			filterParam.lvl = data.value;
            filterParam.vip_sid = 'waiter';
		}
		filterParam.page = 1;
		findUser();
	});
	//查询条件筛选
	form.on('select(searchs)', function(data) {
		window.type = data.value;
	});
	$('.search').click(function() {
		var detail = $("#searchInfo").val();
		if(window.type == 0 || !window.type) {
            filterParam.account = detail;
            filterParam.page = 1;
            findUser(true);
		}
	});


	//更多操作
	$('body').on('click', '.operate', function () {
		$(this).parent().next('ul').toggle();
		$(this).parent().parent().siblings('tr').find('.more_operate').hide();
	})
	$('body').on('click', '.more_operate li', function () {
		$(this).parent().toggle();
	})

	//身份设置
    $(document).on('click', '.setUserVip', function () {
		var $this = $(this);
		// var account = $this.parent().siblings('.user_account').text();
		var uid = $this.attr('uid');
        var account = $(this).attr('acc');
        $('.account i').text(account);
		setdata['uid'] = uid;
        setdata['account'] = account;
		var html = '';
		html += '<form class="layui-form" action="">'
		html += '<div class="layui-form-item" style="margin: 20px 0 0 0">'
		html += '<div class="layui-inline">'
		html += '<label class="layui-form-label">身份设置</label>'
		html += '<div class="layui-input-inline">'
		html += '<select name="selIdenty" lay-filter="selIdenty" id="selIdenty">'
		html += '<option value="">请选择</option>'
		html += '<option value="1">小二</option>'
		html += '<option value="2">掌柜</option>'
		html += '</select>'
		html += '</div>'
		html += '</div>'
		html += '</div>'
		html += '<div class="layui-form-item">'
		html += '<div class="layui-input-block">'
		html += '<button type="button" class="layui-btn sure" style="margin-top: 20px">确定</button>'
		html += '</div>'
		html += '</div>'
		html += '</form>'

		var index = layer.open({
			type: 1,
			title: '身份设置',
			shadeClose: false,
			shade: 0.5,
			area: ['370px', '34%'],
			content: html
		});
		form.render();
		form.on('select(selIdenty)', function(data) {
			if(data.value !== undefined) {
				setdata.lvl = data.value;
				setdata.vip_sid = 'waiter';
				setdata.endTime = new Date(new Date().setDate(2000));
			} else {
				delete setdata.lvl;
			}
		});

		$('.sure').click(function() {
			if(setdata.lvl) {
                updateUserVip(setdata,index);
			} else {
				layer.msg("请选择设置身份！")
			}

		});
	});

	//增加用户资产
	$('body').on('click', '.addMoney', function () {
		var uid = $(this).attr('uid');
		var account = $(this).attr('acc');
		var html = '<div class="layui-form-item" style="margin: 20px">'
		html += '<label style="width: 60px;float: left;line-height: 38px;text-align: right;font-weight: 400;">增加金额</label>'
		html += '<div class="layui-input-block" style="margin-left: 80px">'
		html += '<input type="text" name="money" class="layui-input">'
		html += '</div>'
		html += '</div>'
		html += '<div class="layui-form-item" style="margin: 20px">'
		html += '<label style="width: 60px;float: left;line-height: 38px;text-align: right;font-weight: 400;">理由</label>'
		html += '<div class="layui-input-block" style="margin-left: 80px">'
		html += '<textarea type="text" name="comment" class="layui-textarea"></textarea>'
		html += '</div>'
		html += '<div class="layui-form-item" style="text-align: center">'
		html += '<button class="layui-btn addSure" style="margin-top: 30px">确定</button>'
		html += '</div>'
		html += '</div>'
		var index = layer.open({
			type: 1,
			title: '增加用户<span style="color: #3899E8">'+ account +'</span>的资产',
			shadeClose: false,
			shade: 0.5,
			area: ['400px', '35%'],
			content: html
		});
		$('.addSure').click(function () {
			var param = {
				'token': token,
				'uid': uid,
				'money': $("[name='money']").val(),
				'comment': $("[name='comment']").val()
			}
			addMoney(param, index);
		});
	});
	// 清空用户资产
	$(document).on('click', '.clearUserMoney', function () {
		var account = $(this).attr('acc');
		layer.alert('您确定要清空该用户资产吗？', {
			title: '清空用户资产'
			,yes: function (index, layero) {
				var data = {
					token: token,
					account: account
				}
				emptyMoney(data);
			}
		});
	});

});

/**
 * 获取用户信息列表
 */
function findUser(isInside) {
	$.ajax({
		type: "post",
		url: server_url + "/users/getUserInfo",
		data: filterParam,
		success: function(data) {
			if(data.status == 200) {
				window.allGoodAmount = data.payload.total;
				if(!isInside) {
					setPage();
				}

				if(data.payload.data) {
					var rsp = data.payload.data;
					var h = '';
					$.each(rsp, function(index) {
						var info = rsp[index];
						var recommender = info.recommender || '无';
						var aliaccount = info.ali_account || '无';
						var wxaccount = info.wx_account || '无';
						var agent_2 = info.agent_2 || '无';
						var agent_4 = info.agent_4 || '无';
						var agent_6 = info.agent_6 || '无';
						var teamNum = info.team_num || "0";

						h += '<tr class="tab_body">';
						h += '<td class="user_account">' + info.account + '</td>';

                        if(info.pre_agent_lvl == 6) h += '<td>掌柜</td>';
                    	else if(info.vip_sid == 'waiter')  h += '<td>小二</td>';
                        else h += '<td>普通用户</td>';

						h += '<td>' + simpleDateFormat(info.created_time) + '</td>';
						h += '<td class="reference '
						if(role.indexOf('adm') > -1 && info.recommender) {
							h += 'click'
						}
						h += '">' + recommender + '</td>';
						h += '<td class="district_agent">' + agent_2 + '</td>';
						h += '<td class="province_agent">' + agent_4 + '</td>';
						h += '<td class="city_agent">' + agent_6 + '</td>';
						h += '<td class="team_num">' + teamNum + '</td>';
						h += '<td class="team_num">' + info.money + '</td>';
						h += '<td class="team_num">' + info.freeze_money + '</td>';
						h += '<td class="">' + aliaccount + '</td>';
						h += '<td class="">' + wxaccount + '</td>';
						h += '<td>'
						h += '<div class="layui-table-cell laytable-cell-1-10 padding0">';
						h += '<a class="layui-btn layui-btn-xs operate">更多操作</a>';
						h += '</div>';
						h += '<ul class="more_operate">';
						if(role.indexOf("user") >= 0 || role.indexOf("adm") >= 0) {
                            h += '<li class="setUserVip" acc="'+ info.account +'" uid="'+ info.uid +'">身份设置</li>';
							h += '<li class="addMoney" acc="'+ info.account +'" uid="'+ info.uid +'">增加资产</li>';
							h += '<li class="clearUserMoney" acc="'+ info.account +'" uid="'+ info.uid +'">清空资产</li>';
						}
						else if(role.indexOf("qudao") >= 0) {
							h += '<li class="addMoney" acc="'+ info.account +'" uid="'+ info.uid +'">增加资产</li>';
						}
						else {
							h += '<li>重置密码</li>';
						}
						h += '<ul>';
						h += '</td>';
						h += '</tr>';
					});
					$('tbody').empty().append(h);
					$('.pagination').show();
				}
				else {
					var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="14">暂无数据！</td></tr>';
					$('tbody').empty().append(noData);
				}
			}
			else if(data.status == 403) {
				top.location.href = "login.html";
			}
		}
	});
}

/**
 * 管理员更改用户推荐人
 * param  token、account、new_recommender、old_recommender
 * url：/userAgent/changeRecommender
 */
function changeRecommender(param,$this,txt) {
	$.ajax({
		type: "post",
		url: login_url + "/userAgent/changeRecommender",
		data: param,
		success: function(data) {
			if(data.status == 200) {
				layer.msg(data.payload);
				$this.text(txt);    //静态设置修改的内容
			} else {
				layer.msg(data.err);
			}
		},
		error: function(jqXhr, textStatus, errorThrown) {
			var msg = "网络错误，请联系管理员或稍后重试！";
			layer.msg(msg)
		}
	});
}
function updateUserVip(param) {
	var url = login_url;
	if(param.lvl == 1){
        url += "/userAgent/setWaiterVip";
	}
	else{
        url += "/userAgent/setManager";
        param.pre_agent_lvl = 6;
    }

	$.ajax({
		type: "post",
		url: url,
		data: param,
		success: function(data) {
			if(data.status == 200) {
				layer.msg("设置成功！");
			}
			else {
				layer.msg(data.err);
			}
		},
		error: function(jqXhr, textStatus, errorThrown) {
			var msg = "网络错误，请联系管理员或稍后重试！";
			layer.msg(msg)
		}
	});
}

/**
 * 管理员增加用户资产
 * @param  token，uid（用户uid）
 * @param  money   要增加的金额
 * @param  comment 理由
 * url	/admin_mng/addMoney
 */
function addMoney(param,idx) {
	$.ajax({
		type: "post",
		url: server_url + "/admin_mng/addMoney",
		data: param,
		success: function(data) {
			if(data.status == 200) {
				layer.msg("增加成功！");
				setTimeout(function () {
					layer.close(idx);  //关闭弹出层
				},2000)
				findUser(true);
			}
			else {
				layer.msg(data.err);
			}
		},
		error: function() {
			layer.msg("网络错误，请联系管理员或稍后重试！")
		}
	});
}

/**
 * 管理员清空用户的资产
 * param: token, account
 * url: admin_mng/emptyMoney
 */
function emptyMoney(param) {
	$.ajax({
		type: "post",
		url: server_url + "/admin_mng/emptyMoney",
		data: param,
		success: function(data) {
			if(data.status == 200) {
				layer.msg("清空成功！");
				findUser(true);  // 清空成功不刷新页面
			}
			else {
				layer.msg(data.err);
			}
		},
		error: function() {
			layer.msg("网络错误，请联系管理员或稍后重试！")
		}
	});
}

/**
 * Pagination 分页
 */
function setPage() {
    $("#Pagination").pagination(window.allGoodAmount, {
        current_page:0,
        link_to:"#",
        num_edge_entries: 1, //边缘页数
        num_display_entries:4, //主体页数
        callback: pageselectCallback,
        ellipse_text: '....',
        items_per_page: size, //每页显示个数
        prev_text: "<",
        next_text: ">"
    });
    function pageselectCallback(page_index, jq) {
        if(window.pageIndex != page_index + 1){
            window.pageIndex = page_index + 1;
            filterParam.page = window.pageIndex;
            findUser(true);
        }
    }
}
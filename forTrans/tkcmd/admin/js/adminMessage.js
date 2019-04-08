/**
 * Created by yjp on 2018/10/29.
 */
//layui 初始化
layui.use(['jquery', 'layer', 'table'], function () {
	$ = layui.jquery;  //jquery
	layer = layui.layer;  //弹层
	table = layui.table;  //表格

	var size = 10;
	window.pageIndex = 1;
	var token = sessionStorage.getItem('adminToken');
	var datas = {
		'token': token,
		'app_sid': app_sid,
		'size': size
	}
	datas.page = window.pageIndex;


	firstInfo();  //加载数据

	
	// 重置管理员密码
	$('body').on('click','.resetPwd',function() {
		var uid = $(this).attr('uid');
		var name = $(this).attr('acc');
		layer.open({
			title: '重置密码',
			content: '您确定重置:" '+name+' "的密码吗？',
			yes:function(index) {
				var rpwd = {
					token: token,
					uid: uid,
					app_sid: app_sid
				}
				resetAdmPwd(rpwd)
				layer.close(index)
			}
		})
	});
	
	/**
	 * 获取管理员列表
	 * url: /admin_management/findAdminList
	 */
	function firstInfo(isInside) {
		$.ajax({
			type:"post",
			url:login_url+"/admin_management/findAdminList",
			data:datas,
			success:function(data){
				if(data.status == 200) {
					window.allGoodAmount = data.payload.total;
					if(!isInside) {
						setPage();
					}
					var rsp = data.payload.admins;
					var html = '';
					$.each(rsp, function(index,obj) {
						html += '<tr class="tab_body">'
						html += '<td class="name">'+obj.name+'</td>'
						html += '<td>'+obj.account+'</td>'
						html += '<td class="clr009688">'+obj.role+'</td>'
						html += '<td uid="'+obj.uid+'">'
						html += '<a class="layui-btn layui-btn-xs resetPwd" uid="'+ obj.uid +'" acc="'+ obj.name +'">重置密码</a>'
						html += '</td>'
						html += '</tr>'
					});
					$('#dataInfo tbody').empty().append(html);
				}
				else if(data.status == 403) {
					top.location.href = 'login.html';
				}
				else {
					layer.msg(data.err);
				}
			}
		});
	}

	/**
	 * 重置管理员密码
	 * url: /admin_management/resetAdmPwd
	 */
	function resetAdmPwd(rpwd) {
		$.ajax({
			type:"post",
			url:login_url+"/admin_management/resetAdmPwd",
			data:rpwd,
			success:function(data) {
				if(data.status == 200) {
					layer.msg('修改成功！');
				}
				else {
					layer.msg(data.err);
				}
			}
		});
	}


	//商品分页
	function setPage() {
		$("#Pagination").pagination(window.allGoodAmount, {
			current_page:0,
			link_to:"#",
			num_edge_entries: 1, //边缘页数
			num_display_entries:4, //主体页数
			callback: pageselectCallback,
			ellipse_text: '....',
			items_per_page: size, //每页显示个数
			prev_text: "<上一页",
			next_text: "下一页>"
		});
		function pageselectCallback(page_index, jq) {
			if(window.pageIndex != page_index + 1){
				window.pageIndex = page_index + 1;
				firstInfo(true);
			}
		}
	}
	
});


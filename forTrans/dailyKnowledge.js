// https://juejin.im/post/5cab0c45f265da2513734390

// 原始类型 栈内存储 存储的是 【值】
// string boolean number undefined null symbol
// 引用类型 堆内存储 存储的是 【地址】
// Object Array Function


// typeof 可判断 string boolean number function Object【包括 null Object Array】
// instanceof 通过原型链判断


// for of 需要具有 iterater 接口
// for in 需要具备 可枚举 属性 enumerable 
// forEach 只能遍历数组，不可中断，无返回值或 undefined
// map 只能遍历数组，不可中断，返回修改后的数组


// 判断 数组
// Array.isArray( arr );
// arr isinstanceof Array
// Object.prototype.toString.call( arr ) === '[Object Array]'
// arr.constructor == Array (不准确，arr.constructor 可指定其他)


// 类数组 和 数组 区别 具有 length 不具有其他数组方法
// 常见 类数组：函数参数 arguments、 DOM 列表（如: document.querySelectorAll()）、$('.div');
// 类数组 转换成 数组 
// Array.prototype.slice.call( arguments )
// [...arguments]
// Array.from(arguments)
// 任何定义了 iterater 接口的对象，都可以扩展成真正的数组


// == 和 === 
// === 只有 同类型 且 值 相等，才返回 true
// == 默认转换成同类型，然后 进行 值 的比较
// null undefined 转换 boolean
// string 和 number 转成 number
// boolean 和 其他 转成 boolean

// 引用类型 转换 Boolean 都是 true

// [] == ![] => true ：
// 1、 ![] 优先级 高 ![] => false
// 2、 [] == false => [] 转换为 Number 0; 
// 3、 0 == false => true


// ES5 和 ES6 class 区别
// es6 class 内部所有定义的方法都是不可枚举的
// es6 必须使用 new 调用
// es6 不存在变量提升
// es6 默认既是严格模式
// es6 子类必须在父类的构造函数中调用 super() ，才有 this 对象，
// es5 类继承关系是相反的，先有子类 this ，然后父类方法应用在子类上


// 改变原数组 api
// splice reverse fill copyWithin sort push pop shift unshift

// 不改变原数组 API
// slice map forEach every some filter reduce entry entries find 


// let 局部变量，不提升，不允许重复声明
// const 局部常量，不提升，不允许重复声明，不允许改变
// 暂时性死区


// this 指向
// 四种绑定：默认，隐式，显示， new 
// call 枚举式
// apply 数组形式
// bind 返回一个函数，该函数里 return function (){ return context.apply(...args);}
// => 函数指向上一层 this 


// 闭包
// 受保护变量，返回操作函数，【私有变量，模仿块级作用域】

function mynew(func) {
	let target = {};
	target.__proto__ = func.prototype;
	let res = func.call(target);
	if (typeof(res) == 'object' || typeof(res) == 'function') {
		return res;
	}
	return target;
}


// 原型链
console.log(Object.prototype.__proto__ == null) // true
console.log(Object.prototype.__proto__) // null
console.log(Object.prototype) // {}

var obj = new Object();
obj.__proto__ == Object.prototype  // true

// es5 实现继承
function Super(name, age) {
	this.name = name;
	this.age = age;
}
Super.prototype.say = function() {
	console.log(this.name);
}

function Sub(name, age) {
	Super.call(this, name);
	this.age = age;
}
Sub.prototype = new Super();
Sub.prototype.constructor = Sub;

Sub.prototype.sayAge = function() {
	console.log(this.age);
}

// ES 6
class Life {
	constructor (value) {
		this.val = value;
	}
	getValue() {
		console.log(this.val);
	}
}
class Animal extends Life {
	constructor(value) {
		super(value);
		this.val = value;
	}
}
let dog = new Animal('dog');
dog.getValue();		// 'dog'
dog instanceof Life;	// true



// 深 copy
function deepCopy(obj) {
  if (obj == null) {
    return null
  }
  if(obj instanceof Date) {
    return new Date(obj)
  }
  if(obj instanceof RegExp) {
    return new RegExp(obj)
  }
  var type = Object.prototype.toString.call(obj).slice(8, -1)
  let clone = type == 'Array' ? [] : {}
  if(type == 'Array' || type == 'Object'){
    for(let key in obj){
      if(obj.hasOwnProperty(key)){
        if(obj[key] && typeof obj[key] === "object"){
          clone[key] = this.deepCopy(obj[key])
        }else{
          clone[key] = obj[key]
        }
      }
    }
  } else {
  	clone = obj
  }
  return clone
}

var obj = {
	name: 'n',
	age: 1,
	date: new Date(),
	arr: [1, 2],
	obj: {
		n: 'n',
		a: 2,
		arr: ['1', [1,2,3], {nn: '5'}]
	},
	func: function() {
		console.log(this.name);
	}
}
var obj2 = deepCopy(obj)
console.log(obj2)


// 防抖,例如 百度搜索
function debounce(fun, wait) {
	let timer;
	let later = () => {
		timer = setTimeout(() => {
			fun();
		}, wait);
	}
	function deb() {
		if(!timer) {
			later();
		} else {  console.log('later')
			clearTimeout(timer);
			timer = null;
			later();
		}
	}
	return deb;
}

let n = 0;
function clk() {
	console.log('click  ' + n++)
}
// document.onclick = debounce(clk, 500);

// 节流，canvas 画图，鼠标滚动
function throttle(fun, wait) {
	let timer = null;
	let flag = false;

	return () => {
		if(!flag) {
			flag = true;
			fun();
			clearTimeout(timer);
			timer = setTimeout(() => {
				flag = false;
			}, wait);
		}
	}
}
let m = 0;
function move(){
	console.log('move ' + m++);
}

// document.onmousemove = throttle(move, 500);


// 最大值
Math.max.apply(null, [14, 2, 6, 3, 5]);
Math.max(...[14, 2, 6, 3, 5]);


// setTimeout 第二参数 表示 最少时间， 不是确切时间，且不能低于 4 毫秒，否则为 4 毫秒；老浏览器 10 毫秒


// promise 三种状态： pending fulfilled rejected

// promise 是微任务， setTimeout 是宏任务，所以 promise 先执行
// macro-task(宏任务)：setTimeout、 setInterval、 setImmediate
// micro-task(微任务)：Promise、 process.nextTick

// requestAnimationFrame	采用系统时间间隔
function step() {
	// ... codes
	window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);


// 函数柯里化


// 自定义事件   fn1.trigger('event', args);  fn1.on('event', cb(args));  


// 模块化解决：命名冲突、文件依赖、代码复用


// parseInt(string, radix) //string 被处理的值，radix 解析时的基数（进制，string 不以 0x  0  开头的 10 进制处理）
// 最终都 解析为 10 进制数
// 故 ['1', '2', '3'].map(parseInt) // ==> [1, NaN, NaN]

{}

var b = 10;
(function b() {
  b = 20;
  console.log(b)
})()		// 
// 输出：
// ƒ b() {
//   b = 20;
//   console.log(b)
// }

// var c = 10;
// (function c() {
//   'use strict'
//   c = 20;		// error in here
//   console.log(c)
// })()				// TypeError: Assignment to constant variable.


var a = {
	i: 1,
	toString: function () {
	// valueOf: function () {
		return this.i++;
	}
};
if(a==1 && a==2 && a==3) {
	console.log(1)
}

var ar = [1,2,3];
ar.join = ar.shift;
if (ar==1 && ar==2 && ar==3) {
	console.log(ar) // [join: ƒ]
}


// arguments 
// callee	length	constructor		hasOwnProperty	isPrototypeOf	propertyIsEnumerabale
// toLocaleString	roString	valueOf		__defineGetter__	__defineSetter__
// __lookupGetter__		__lookupSetter__	__proto__

// var args = Array.prototype.slice.call(arguments)		=>  转为标准数组



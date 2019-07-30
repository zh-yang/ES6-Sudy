//剩余参数语法允许我们将一个不定数量的参数表示为一个数组。

//语法
function(a, b, ...theArgs) {
  // ...
}

//如果函数的最后一个命名参数以...为前缀，则它将成为一个由剩余参数组成的真数组，
//其中从0（包括）到theArgs.length（排除）的元素由传递给函数的实际参数提供。

//剩余参数和 arguments对象的区别

//剩余参数只包含那些没有对应形参的实参，而 arguments 对象包含了传给函数的所有实参。
//arguments对象不是一个真正的数组，而剩余参数是真正的 Array实例，也就是说你能够在它上面直接使用所有的数组方法，比如 sort，map，forEach或pop。
//arguments对象还有一些附加的属性 （如callee属性）。

//从 arguments 到数组
//引入了剩余参数来减少由参数引起的样板代码，也就是说我们不用对参数特殊处理转为数组类型，可以直接使用Array的方法。

//在没有使用rest参数时,arguments需要进行类型转换
function f(a, b) {

  var normalArray = Array.prototype.slice.call(arguments);
  // -- or --
  var normalArray = [].slice.call(arguments);
  // -- or --
  var normalArray = Array.from(arguments);

  var first = normalArray.shift(); // OK, gives the first argument
  var first = arguments.shift(); // ERROR (arguments is not a normal array)

}

//使用rest参数后，可以直接使用Array的方法
function f(...args) {
  var normalArray = args;
  var first = normalArray.shift(); // OK, gives the first argument
}

//解构剩余参数
//rest参数和解构赋值的结合使用，剩余参数可以被解构，这意味着他们的数据可以被解包到不同的变量中。

function f(...[a, b, c]) {
  return a + b + c;
}

f(1)          // NaN (b and c are undefined)
f(1, 2, 3)    // 6
f(1, 2, 3, 4) // 6 (the fourth parameter is not destructured)















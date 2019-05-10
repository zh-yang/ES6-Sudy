
//****************1.扩展运算符

//扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]

//应用
//(1)复制数组
const a1 = [1, 2];
const a2 = a1;

a2[0] = 2;
a1 // [2, 2]

//(2)合并数组
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
//不过，这两种方法都是浅拷贝，使用的时候需要注意。

const a1 = [{ foo: 1 }];
const a2 = [{ bar: 2 }];

const a3 = a1.concat(a2);
const a4 = [...a1, ...a2];

a3[0] === a1[0] // true
a4[0] === a1[0] // true

//(3)与解构赋值结合

// ES5
a = list[0], rest = list.slice(1)
// ES6
[a, ...rest] = list

//(4)字符串
//扩展运算符还可以将字符串转为真正的数组。

[...'hello']
// [ "h", "e", "l", "l", "o" ]

//(5)实现了 Iterator 接口的对象
//任何定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组。

let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

//(6)Map 和 Set 结构，Generator 函数
//扩展运算符内部调用的是数据结构的 Iterator 接口，因此只要具有 Iterator 接口的对象，都可以使用扩展运算符，比如 Map 结构。

let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let arr = [...map.keys()]; // [1, 2, 3]
//Generator 函数运行后，返回一个遍历器对象，因此也可以使用扩展运算符。

const go = function*(){
  yield 1;
  yield 2;
  yield 3;
};

[...go()] // [1, 2, 3]


//****************2.扩展API：Array.from()
//Array.from方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）
//和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。

let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

//如果参数是一个真正的数组，Array.from会返回一个一模一样的新数组。

Array.from([1, 2, 3])
// [1, 2, 3]

//扩展运算符背后调用的是遍历器接口（Symbol.iterator），如果一个对象没有部署这个接口，就无法转换。Array.from方法还支持类似数组的对象。
//所谓类似数组的对象，本质特征只有一点，即必须有length属性。
//因此，任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。

Array.from({ length: 3 });
// [ undefined, undefined, undefined ]

//上面代码中，Array.from返回了一个具有三个成员的数组，每个位置的值都是undefined。扩展运算符转换不了这个对象。

//对于还没有部署该方法的浏览器，可以用Array.prototype.slice方法替代。

const toArray = (() =>
  Array.from ? Array.from : obj => [].slice.call(obj)
)();

//Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。

Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]

// /Array.from()可以将各种值转为真正的数组，并且还提供map功能。
//这实际上意味着，只要有一个原始的数据结构，你就可以先对它的值进行处理，然后转成规范的数组结构，进而就可以使用数量众多的数组方法。

Array.from({ length: 2 }, () => 'jack')
// ['jack', 'jack']
//上面代码中，Array.from的第一个参数指定了第二个参数运行的次数。这种特性可以让该方法的用法变得非常灵活。


//****************3.扩展API：Array.of()
//Array.of方法用于将一组值，转换为数组。

Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1

// 这个方法的主要目的，是弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异。

Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
//上面代码中，Array方法没有参数、一个参数、三个参数时，返回结果都不一样。只有当参数个数不少于 2 个时，Array()才会返回由参数组成的新数组。
//参数个数只有一个时，实际上是指定数组的长度。


//Array.of方法可以用下面的代码模拟实现。

function ArrayOf(){
  return [].slice.call(arguments);
}

//****************4.数组实例扩展API：copyWithin()
//数组实例的copyWithin方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。
//也就是说，使用这个方法，会修改当前数组。

Array.prototype.copyWithin(target, start = 0, end = this.length)
//它接受三个参数。

//target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
//start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示倒数。
//end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。
//这三个参数都应该是数值，如果不是，会自动转为数值。

[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]

//****************5.数组实例扩展API：find()、findIndex()

//数组实例的find方法，用于找出第一个符合条件的数组成员。
//它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。
//如果没有符合条件的成员，则返回undefined。

[1, 4, -5, 10].find((n) => n < 0)
// -5

//数组实例的findIndex方法的用法与find方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。
[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) // 2

//这两个方法都可以接受第二个参数，用来绑定回调函数的this对象。

function f(v){
  return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person);    // 26
//另外，这两个方法都可以发现NaN，弥补了数组的indexOf方法的不足。

[NaN].indexOf(NaN)
// -1

[NaN].findIndex(y => Object.is(NaN, y))
// 0

//****************6.组实例扩展API：fill()
fill方法使用给定值，填充一个数组。

['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]
//代码表明，fill方法用于空数组的初始化非常方便。数组中已有的元素，会被全部抹去。

//ll方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']
//代码表示，fill方法从 1 号位开始，向原数组填充 7，到 2 号位之前结束。

//注意，如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。

let arr = new Array(3).fill({name: "Mike"});
arr[0].name = "Ben";
arr
// [{name: "Ben"}, {name: "Ben"}, {name: "Ben"}]

let arr = new Array(3).fill([]);
arr[0].push(5);
arr
// [[5], [5], [5]]

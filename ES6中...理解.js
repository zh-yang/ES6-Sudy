
//ES6中的扩展运算符...有两种含义，扩展操作和剩余操作

//一、展开语法：可以在函数调用/数组构造时，将数组表达式或者string在语法层面展开；换可以在构造字面量对象时，
//将对象表达式按key-value的方式展开。（摘自MDN）

//其实展开语法对所有可迭代的类型都有效

//语法：

//函数调用：myFunction(...iterableObj);
//字面量数组构造或字符串：[...iterableObj, '4', ...'hello', 6];
//构造字面量对象时,进行克隆或者属性拷贝（ECMAScript 2018规范新增特性）：let objClone = { ...obj };

//示例
//等价apply的方式
//如果想将数组元素迭代为函数参数，一般使用Function.prototype.apply 的方式进行调用。
function myFunction(x, y, z) { }
var args = [0, 1, 2];
myFunction.apply(null, args);
//有了展开语法，可以这样写：
function myFunction(x, y, z) { }
var args = [0, 1, 2];
myFunction(...args);
//所有参数都可以通过展开语法来传值，也不限制多次使用展开语法。
function myFunction(v, w, x, y, z) { }
var args = [0, 1];
myFunction(-1, ...args, 2, ...[3]);

//在new表达式中应用
//使用 new 关键字来调用构造函数时，不能直接使用数组+ apply 的方式（apply 执行的是调用 [[Call]] , 而不是构造 [[Construct]]）。
//当然, 有了展开语法, 将数组展开为构造函数的参数就很简单了：
var dateFields = [1970, 0, 1]; // 1970年1月1日
var d = new Date(...dateFields);

//构造字面量数组时
//没有展开语法的时候，只能组合使用 push, splice, concat 等方法，来将已有数组元素变成新数组的一部分。
//有了展开语法,  通过字面量方式, 构造新数组会变得更简单、更优雅：
var parts = ['shoulders', 'knees']; 
var lyrics = ['head', ...parts, 'and', 'toes']; 
// ["head", "shoulders", "knees", "and", "toes"]
//和参数列表的展开类似,  ... 在构造字面量数组时, 可以在任意位置多次使用.

//数组拷贝
var arr = [1, 2, 3];
var arr2 = [...arr]; // like arr.slice()
arr2.push(4); 

// arr2 此时变成 [1, 2, 3, 4]
// arr 不受影响
//提示: 实际上, 展开语法和 Object.assign() 行为一致, 执行的都是浅拷贝(只遍历一层)。如果想对多维数组进行深拷贝, 下面的示例就有些问题了。

var a = [[1], [2], [3]];
var b = [...a];
b.shift().shift(); // 1
// Now array a is affected as well: [[], [2], [3]]

//连接多个数组
//Array.concat 函数常用于将一个数组连接到另一个数组的后面。如果不使用展开语法, 代码可能是下面这样的:
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];

// 将 arr2 中所有元素附加到 arr1 后面并返回
var arr3 = arr1.concat(arr2);
//使用展开语法:
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
var arr3 = [...arr1, ...arr2];

//Array.unshift 方法常用于在数组的开头插入新元素/数组.  不使用展开语法, 示例如下:
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
// 将 arr2 中的元素插入到 arr1 的开头
Array.prototype.unshift.apply(arr1, arr2) // arr1 现在是 [3, 4, 5, 0, 1, 2]

//如果使用展开语法, 代码如下:  [请注意, 这里使用展开语法创建了一个新的 arr1 数组,  Array.unshift 方法则是修改了原本存在的 arr1 数组]:
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
arr1 = [...arr2, ...arr1]; // arr1 现在为 [3, 4, 5, 0, 1, 2]

//***在ES2018中，对字面量对象增加了展开特性，其行为是，将已有对象的所有可枚举属性拷贝到新构造的对象中。
//浅拷贝(Shallow-cloning, 不包含 prototype) 和对象合并, 可以使用更简短的展开语法。而不必再使用 Object.assign() 方式.

var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };

var clonedObj = { ...obj1 };
// 克隆后的对象: { foo: "bar", x: 42 }

var mergedObj = { ...obj1, ...obj2 };
// 合并后的对象: { foo: "baz", x: 42, y: 13 }

//提示: Object.assign() 函数会触发 setters，而展开语法则不会。

//提示: 不能替换或者模拟 Object.assign() 函数:
var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };
const merge = ( ...objects ) => ( { ...objects } );

var mergedObj = merge ( obj1, obj2);
// Object { 0: { foo: 'bar', x: 42 }, 1: { foo: 'baz', y: 13 } }

var mergedObj = merge ( {}, obj1, obj2);
// Object { 0: {}, 1: { foo: 'bar', x: 42 }, 2: { foo: 'baz', y: 13 } }
//在这段代码中, 展开操作符(spread operator)并没有按预期的方式执行:
//而是先将多个解构变为剩余参数(rest parameter), 然后再将剩余参数展开为字面量对象.

//在数组或函数参数中使用展开语法时, 该语法只能用于 可迭代对象：
var obj = {'key1': 'value1'};
var array = [...obj]; // TypeError: obj is not iterable

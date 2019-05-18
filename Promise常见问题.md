### Promise创建流程
* 1.使用`new Promise(fn)`或者它的快捷方式`Promise.resolve()`、`Promise.reject()`，返回一个promise对象
* 2.在fn中指定异步的处理（同步也可以使用）
    处理结果正常，调用`resolve`
    处理结果错误，调用`reject`

promise常见误区

### 情景1：reject和catch的区别

* promise.then(onFulfilled, onRejected)
如果在`onFulfilled`中发生异常，在`onRejected`中是捕获不到的

* promise.then(onFulfilled).catch(onRejected)
`.then`中产生的异常能在`.catch`中捕获

一般情况，还是建议使用第二种，因为能捕获之前的所有异常。当然了，第二种的.catch()也可以使用.then()表示，它们本质上是没有区别的，.catch === .then(null, onRejected)

### 情景2：在promise或then中抛错，在被错误处理之前会一直保持reject状态

```js
function taskA() {
    console.log(x);
    console.log("Task A");
}
function taskB() {
    console.log("Task B");
}
function onRejected(error) {
    console.log("Catch Error: A or B", error);
}
function finalTask() {
    console.log("Final Task");
}
var promise = Promise.resolve();
promise
    .then(taskA)
    .then(taskB)
    .catch(onRejected)
    .then(finalTask);
    
-------output-------
Catch Error: A or B,ReferenceError: x is not defined
Final Task
```
![image.png](https://upload-images.jianshu.io/upload_images/6828981-ee9bf02315b0d732.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

A抛错时，会按照 taskA → onRejected → finalTask这个流程来处理。A抛错后，若没有对它进行处理，状态就会维持rejected，taskB不会执行，直到catch了错误。

```js
function taskA() {
    console.log(x);
    console.log("Task A");
}
function taskB() {
    console.log("Task B");
}
function onRejectedA(error) {
    console.log("Catch Error: A", error);
}
function onRejectedB(error) {
    console.log("Catch Error: B", error);
}
function finalTask() {
    console.log("Final Task");
}
var promise = Promise.resolve();
promise
    .then(taskA)
    .catch(onRejectedA)
    .then(taskB)
    .catch(onRejectedB)
    .then(finalTask);
    
-------output-------
Catch Error: A ReferenceError: x is not defined
Task B
Final Task
 ```
在taskA后多了对A的处理，因此，A抛错时，会按照A会按照 taskA → onRejectedA → taskB → finalTask这个流程来处理，此时taskB是正常执行的。

### 情景3：每次调用then都会返回一个新的promise对象，而then内部只是返回数据，供下一个then使用
因此容易出现下面的错误写法：
```js
function badAsyncCall(data) {
    var promise = Promise.resolve(data);
    promise.then(function(value) {
        //do something
        return value + 1;
    });
    return promise;
}
badAsyncCall(10).then(function(value) {
   console.log(value);          //想要得到11，实际输出10
});
-------output-------
10
```
正确的写法应该是：
```js
function goodAsyncCall(data) {
    var promise = Promise.resolve(data);
    return promise.then(function(value) {
        //do something
        return value + 1;
    });
}
goodAsyncCall(10).then(function(value) {
   console.log(value);
});
-------output-------
11
```

### 情景4：在异步回调中抛错，不会被catch到
```js
// Errors thrown inside asynchronous functions will act like uncaught errors
var promise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    throw 'Uncaught Exception!';
  }, 1000);
});

promise.catch(function(e) {
  console.log(e);       //This is never called
});
```
应该为reject使用

### 情景5：promise状态变为resolve或reject，就凝固了，不会再改变

```js
console.log(1);
new Promise(function (resolve, reject){
    reject();
    setTimeout(function (){
        resolve();            //not called
    }, 0);
}).then(function(){
    console.log(2);
}, function(){
    console.log(3);
});
console.log(4);

-------output-------
1
4
3
```

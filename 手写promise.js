
class MyPromise {
  constructor(fn) {
    //控制状态
    this.state = 'pending'
    this.value = null
    this.error = null
    
    // 存放成功回调的函数
    this.onFulfilledCallbacks = [];
    // 存放失败回调的函数
    this.onRejectedCallbacks = [];
    
    //定义resolve函数
    const resolve = value => {
      if(this.state === 'pending') {
        this.value = value
        this.state = 'fulfilled'
        this.onFulfilledCallbacks.map(fn => fn())
      }
    }
    
    //定义reject函数
    const reject = error => {
      if(this.state === 'pending') {
        this.error = error
        this.state = 'rejected'
        this.onRejectedCallbacks.map(fn => fn())
      }
    }
    
    //fn方法可能会抛出异常，需要捕获
    try {
      //将resolve和reject函数给使用者
      fn(resolve, reject)
    } catch (error) {
      //如果在函数中抛出异常则将它注入reject中
      reject(error)
    }
  }
  
  then(onFulfilled, onRejected){
    if(this.state === 'fulfilled'){
      onFulfilled(this.value)
    }
    if(this.state === 'rejected'){
      onRejected(this.error)
    }
    if(this.state === PENDING) {
        this.onFulfilledCallbacks.push(()=> {
            onFulfilled(this.value);
        });
        this.onRejectedCallbacks.push(()=> {
            onRejected(this.value);
        })
    }
  }
}

const mp = new MyPromise((res, rej)=>{
  setTimeout(()=> {
    res('成功执行')
  })
})

mp.then(val=>{
  console.log('success',val)
},error=>{
  console.log('error',error)
})

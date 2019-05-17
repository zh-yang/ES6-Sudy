
class MyPromise {
  constructor(fn) {
    //控制状态
    this.state = 'pending'
    this.value = null
    this.error = null
    
    //定义resolve函数
    const resolve = value => {
      if(this.state === 'pending') {
        this.value = value
        this.state = 'fulfilled'
      }
    }
    
    //定义reject函数
    const reject = error => {
      if(this.state === 'pending') {
        this.error = error
        this.state = 'rejected'
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
  }
}

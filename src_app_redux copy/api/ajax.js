/* 
能发送异步ajax请求的函数模块
封装axios库
函数的返回值是Promise对象  ==》异步处理函数
1. 优化1： 统一处理请求异常?
    在外层包一个自己创建的promise对象
    在请求出错时 ， 不去reject(error), 而是显示错误提示
2. 优化2： 异步得到的不是reponse, 而是response.data
      在请求成功resolve时：resolve(response.data)
*/
import axios from 'axios';
import {message} from 'antd';


// 有的参数不进行传递时 就设置一个默认值   type 用的最多的就是GET 可以不用传递get 因为默认就是get
export default function ajax(url, data={}, type='GET') { // 形参默认值
    
    return new Promise((resolve, reject) => {
      let promise;
      // 1. 执行异步ajax请求
      if(type === 'GET'){ // 发GET请求
        promise =  axios.get(url, { // 配置对象名字不能瞎写
            params: data // 指定请求参数
        });
      }else {  // 发送POST请求
        promise = axios.post(url,data);
      }
      // 2. 如果成功了， 调用resolve(value)
      promise.then(response => {
        resolve(response.data) // 成功的数据
      // 3. 失败了，不调用reject(error), 而是通过提示异常信息
      }).catch(error => {
        message.error('请求出错了：' + error.message);
      })

    }) 
}


// 请求登陆接口
// ajax('/login',{username: 'Tom', password: '12345'}, 'POST')
// .then()//获取成功的回调

// 添加用户
// ajax('/login',{username: 'Tom', password: '12345', phone: '123431241411'}, 'POST')
// .then()

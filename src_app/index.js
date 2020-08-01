/* 
入口js文件

*/
import React from 'react';
import ReactDom from 'react-dom';

// import 'antd/dist/antd.css';
import App from './App';
import storageUtils from './utils/storageUtils';
import memoryUtils from './utils/memoryUtils';

// 读取Local中保存user, 保存到内存中
const user = storageUtils.getUser()
// 入口文件中 存入内存中
memoryUtils.user = user;
console.log(user);

//  将App 组件标签渲染到 index 页面的 div上
ReactDom.render(
  <App/>,
  document.getElementById("root")
)
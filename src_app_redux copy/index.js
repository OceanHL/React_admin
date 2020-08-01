/* 
入口js文件

*/
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';

import store from './redux/store';
// import 'antd/dist/antd.css';
import App from './App';


//  将App 组件标签渲染到 index 页面的 div上
ReactDom.render((
  <Provider store={store}>
    <App/>
  </Provider>
),document.getElementById("root"))
/* 
入口js文件

*/
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from './lib/react-redux';

import App from './containers/App';
import store from './redux/store';

ReactDom.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById("root")
)

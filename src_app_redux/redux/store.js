/* 
redux最核心的管理对象store
*/
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import reducer from './reducer';
/* 
    固定代码：向外默认暴露store
*/
/* store 管理  总的 reducer状态*/
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk))); // createStore()需要接收一个reducer
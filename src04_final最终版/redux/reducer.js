/* 
reducer 函数模块：根据 当前的 state 和  指定的 action 返回一个新的 state
*/
import {combineReducers} from 'redux';
import {INCREMENT, DECREMENT} from './action-types';

/* 
reducer是管理count状态的值 以及 值的变化
*/
// 数据名叫什么 这里面的函数名 就写什么 
// 第一个参数 就是 count这个数据 并且可以指定初始值 为 0
function count(state = 1, action) {
    console.log('count()', state, action);
    // 根据action 来返回新的数据    
    switch (action.type) {
        case INCREMENT:
            return state + action.data;
        case DECREMENT:
            return state - action.data;
        default:
            return state;
    }
}

const initUser = {};
/* 管理user状态数据的reducer */
function user(state = initUser, action) {
    switch (action.type) {
        default:
            return state;
    }
}

/* combineReducers函数：接收包含所有reducer函数的对象，返回一个新的reducer函数（总reducer）
总的reducer函数管理的state的结构
    {
        count: 2,
        user: {},
    }
*/
export default combineReducers({
    count,
    user
})
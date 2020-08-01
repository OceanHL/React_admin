/* 
reducer 函数模块：根据 当前的 state 和  指定的 action 返回一个新的 state
*/
import {combineReducers} from '../lib/redux'
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

/* 
    管理用户信息的reducer函数
*/
const initUser = {}; // 初始值
function user(state = initUser, action) {
    console.log('user()', state, action);
    switch (action.type) {
        default:
            return state;
    }
}

// 总的reducer函数管理的state的结构 在组件中使用的时候是 state.count 和 state.user
//     {
//         count: 2,
//         user: {},
//     }
export default combineReducers({
    count,
    user
})
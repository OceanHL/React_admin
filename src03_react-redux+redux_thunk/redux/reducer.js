/* 
reducer 函数模块：根据 当前的 state 和  指定的 action 返回一个新的 state
*/
import {INCREMENT, DECREMENT} from './action-types';
/* 
reducer是管理count状态的值 以及 值的变化
*/
// 数据名叫什么 这里面的函数名 就写什么 
// 第一个参数 就是 count这个数据 并且可以指定初始值 为 0
export default function count(state = 1, action) {
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
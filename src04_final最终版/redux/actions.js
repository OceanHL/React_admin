/* 
包含N个用来创建action的工厂函数（action creator）
*/
import {INCREMENT, DECREMENT} from './action-types';

/* 
增加的同步action   type标识（必须是type名字）   data 为携带的数据（可以随便命名）
*/
export const increment = number => ({type: INCREMENT, data: number})

/* 
减少的同步action --》同步的返回 一个对象
*/
export const decrement = number => ({type: DECREMENT, data: number})

/* 
增加的异步action  --》 异步返回一个函数 参数是 dispatch
*/
export const incrementAsync = number => {
    return dispatch => {
        // 1. 执行异步（定时器，ajax请求，promise）
        setTimeout(() => {
            // 2. 当前异步任务执行完成时，分发一个同步action
            dispatch(increment(number)) // dispatch里面放置 一个 action creator 里面的函数
        }, 1000)
    }
}
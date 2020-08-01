/* 
用来根据 老的state 和 指定的action 生成并返回 新的state
*/
import {combineReducers} from 'redux';
import storageUtils from '../utils/storageUtils';
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER,
} from './action-types';
/* 
    用来管理头部标题的reducer函数
*/
const initHeadTitle = '首页';
function headTitle(state = initHeadTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data; // 返回新的值
        default: 
            return state;
    }
}

/* 
    用来管理当前登录用户的reducer函数
*/
const initUser = storageUtils.getUser();
function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user;
        case SHOW_ERROR_MSG:
            const errorMsg = action.errorMsg;
            // state.errorMsg = errorMsg  // 不要直接修改原本状态数据
            return {...state, errorMsg} // 推荐返回一个新的状态数据
        case RESET_USER:
            return {}
        default: 
            return state;
    }
}


/* 
    向外默认暴露的是合并产生的总的reducer函数
    管理的总的state的结构是一个对象
    {
        headTitle: '首页',
        user: {},
    }
*/
export default combineReducers({
    headTitle,
    user,
})


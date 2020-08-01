/* 
redux库的主模块
1) redux 库向外暴露下面几个函数

**createStore()**: 接收的参数为 reducer 函数, 返回为 store 对象
**combineReducers()**: 接收包含 n 个 reducer 方法的对象, 返回一个新的 reducer 函数
**applyMiddleware()**:   // 暂不实现

2) store 对象的内部结构

**getState()**: 返回值为内部保存的 state 数据
**dispatch()**: 参数为 action 对象
**subscribe()**: 参数为监听内部 state 更新的回调函数
*/

/* 
根据指定的reducer函数创建一个store对象并返回
*/
export function createStore(reducer) {

    // 用来存储内部状态数据的变量, 初始值为调用reducer函数返回的结果（外部指定的默认值）
    let state = reducer(undefined, {type: '@@redux/init'});
    // 用来存储监听state更新回调函数的数组容器
    const listeners = [];
    /* 
        返回当前内部的state数据
    */
    function getState() {
        return state
    }

    /* 
        分发action，
        1）. 触发reducer调用，得到新的state
        2). 产生新的state
        3). 调用所有已经存在的监视回调函数
    */
    function dispatch(action) {
        // 1）. 触发reducer调用，得到新的state
        const newState = reducer(state, action)
        // 2). 产生新的state
        state = newState
        // 3). 调用所有已经存在的监视回调函数
        listeners.forEach(listener => listener())
    }

    /* 
        绑定内部state改变的监听回调
        可以给一个store绑定多个监听
    */
    function subscribe(listener) {
        // 保存到缓存listener的容器数组中
        listeners.push(listener)
    }

    // 返回store对象
    return {
        getState,
        dispatch,
        subscribe,
    }
}

/* 
整合传入参数对象中的多个reducer函数，返回一个新的reducer
新的reducer管理的总状态：{r1: state1, r2: state2}
reducers的结构：
{
    count: (state = 2, action) => 3,
    user: (state = {}, action) => {}
}
得到的总状态的结构
    {
        count: count(state.count, action),
        user: user(state.user, action),
    }
*/
// 版本一
export function combineReducers1(reducers) {
    // 返回一个新的总reducer函数
    // state: 总状态
    return (state = {}, action) => {
        // 准备一个总状态空对象
        const totalState = {}
        // 执行reducers中每个reducer函数得到一个新的子状态，并添加到总状态空对象
        Object.keys(reducers).forEach(key => {
            totalState[key] = reducers[key](state[key], action)
        })

        // 返回总状态对象
        return totalState
    }
}

// 版本二
export function combineReducers(reducers) {
    // 返回一个新的总reducer函数
    // state: 总状态
    return (state = {}, action) => {
        // Object.keys() 将对象{count, user} 变成 数组形式并且 里面是属性名的字符串
        // ['count', 'user']
        // reducer进行累积 ，取出数组里的值，往对象里面放
        return Object.keys(reducers).reduce((totalState, key) => {
            // pre是前一个值，key是数组中的当前元素
            totalState[key] = reducers[key](state[key],action)
            // 每次都要返回
            return totalState 
        }, {}) 
        /* {
            count: count(count, action)
            user: user(user, action)
        } */
    }
}
import React, {Component} from 'react';
import {connect} from 'react-redux';

import Counter from '../components/Counter';
import {increment, decrement} from '../redux/actions';

/*
容器组件：通过connect  包装UI组件   产生新组件
connect(): 高阶函数 接收组件 返回组件
connect()返回的函数是一个高阶组件：接收一个UI组件，生成一个容器组件
容器组件的任务：向UI组件传入特定的属性，并且与redux交互
*/


/* 
用来将redux管理的state数据映射成UI组件的  一般属性的函数
*/
function mapStateToProps(state) {
    return {
        count: state // 这里的state 就是 count 因为现在只有count 不是对象属性
    }
}

/* 
用来将包含dispatch代码的函数映射成UI组件的  函数属性的函数
*/
function mapDispatchToProps(dispatch) {
    // 在这里生命 dispatch 函数 里面传递 action 对象 需要引入 专门的 aciton creator文件模块
    return {
        increment: (number) => dispatch(increment(number)),
        decrement: (number) => dispatch(decrement(number)),
    }
}

export default connect(
    // 接收两个参数
    mapStateToProps, // 指定一般属性
    mapDispatchToProps  /// 指定函数属性
)(Counter)
import React, {Component} from 'react';
import {connect} from 'react-redux';

import Counter from '../components/Counter';
import {increment, decrement, incrementAsync} from '../redux/actions';

/*
容器组件：通过connect  包装UI组件   产生新组件
connect(): 高阶函数 接收组件 返回组件
connect()返回的函数是一个高阶组件：接收一个UI组件，生成一个容器组件
容器组件的任务：向UI组件传入特定的属性，并且与redux交互
*/

// 指定向Counter传入那些一般属性(属性值的 来源 就是  store 中的 state)
const mapStateToProps = (state) => ({count: state});
// 指定向Counter传入那些函数属性
/* 如果是函数，会自动调用得到对象，将对象中的方法作为函数属性传入UI组件 */
/* const mapDispatchToProps = () => ({
    increment: (number) => dispatch(increment(number)), // dispatch() 里面方 action creator里面生产出来的 返回action对象的函数
    decrement: (number) => dispatch(decrement(number))
}) */

/* mapDispatchToProps 的简写方式 */
/* 如果是对象，将对象中的action creator方法包装成一个新函数，并传入UI组件 */
/* const mapDispatchToProps = {increment, decrement} */
/* export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter) */
export default connect(
    state => ({count: state}), // 返回一个对象
    {increment, decrement, incrementAsync},
)(Counter)
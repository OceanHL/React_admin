import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {increment, decrement} from './redux/actions';

export default class App extends Component {

    // 接收 store 来进行 读数据 和 更新数据
    static propTypes = {
        store: PropTypes.object.isRequired
    }
    
    constructor(props) {
        super(props);
        
        // 1、 在构造函数中创建一个容器
        this.numberRef = React.createRef();
    }
    
    increment = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1
        this.props.store.dispatch(increment(number)); // 需要传入action对象
    }

    decrement = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1
        this.props.store.dispatch(decrement(number)); // 需要传入action对象
    }
    incrementIfOdd = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1;
        if (this.props.store.getState().count % 2 === 1) { // 余数为 1 则是奇数
            this.props.store.dispatch(increment(number)); // 需要传入action对象
        }
        
    }

    incrementAsync = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1
        setTimeout(() => {
            this.props.store.dispatch(increment(number)); // 需要传入action对象
        }, 1000);
    }
    render() {
        // 从 store 来
        const count = this.props.store.getState().count;
        return (
            <div>
                <p>click {count} times</p>
                <div>
                    <select ref={this.numberRef}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select> &nbsp;&nbsp;
                    <button onClick={this.increment}>+</button> &nbsp;&nbsp;
                    <button onClick={this.decrement}>-</button> &nbsp;&nbsp;
                    <button onClick={this.incrementIfOdd}>increment if odd</button> &nbsp;&nbsp;
                    <button onClick={this.incrementAsync}>increment async</button> &nbsp;&nbsp;
                </div>
            </div>
        )
    }
}
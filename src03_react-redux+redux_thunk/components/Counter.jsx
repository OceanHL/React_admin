import React, {Component} from 'react';
import PropTypes from 'prop-types';

/* 
UI组件
    主要做显示与用户交互
    代码中没有任何redux相关的代码
*/
export default class Counter extends Component {

    // 接收 store 来进行 读数据 和 更新数据
    static propTypes = {
        count: PropTypes.number.isRequired,
        increment: PropTypes.func.isRequired, // 添加数量
        decrement: PropTypes.func.isRequired, // 减少
        incrementAsync: PropTypes.func.isRequired, // 异步增加的函数
    }
    
    constructor(props) {
        super(props);
        
        // 1、 在构造函数中创建一个容器
        this.numberRef = React.createRef();
    }
    
    increment = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1
        this.props.increment(number);
    }

    decrement = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1
        this.props.decrement(number);
        
    }
    incrementIfOdd = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1;
        if (this.props.count % 2 === 1) { // 余数为 1 则是奇数
            this.props.increment(number);
        }
        
    }

    incrementAsync = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1
        this.props.incrementAsync(number);
    }
    render() {
        // 从 store 来
        const count = this.props.count;
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
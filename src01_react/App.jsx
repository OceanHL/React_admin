import React, {Component} from 'react';

export default class App extends Component {

    state = {
        count: 0
    }
    
    constructor(props) {
        super(props);
        
        // 1、 在构造函数中创建一个容器
        this.numberRef = React.createRef();
    }
    
    increment = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1
        this.setState(state => ({
            count: state.count + number
        }))
    }

    decrement = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1
        this.setState(state => ({
            count: state.count - number
        }))
    }
    incrementIfOdd = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1;
        if (this.state.count % 2 === 1) { // 余数为 1 则是奇数
            this.setState(state => ({
                count: state.count + number
            }))
        }
        
    }

    incrementAsync = () => {
        // 得到的是字符串 乘以 1 可以强制转换为 数字类型
        const number = this.numberRef.current.value * 1
        setTimeout(() => {
            this.setState(state => ({
                count: state.count + number
            }))
        }, 1000);
    }
    render() {
        const {count} = this.state;
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
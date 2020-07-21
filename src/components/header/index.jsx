import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined} from '@ant-design/icons';

import LinkButton from '../link-button';
import {reqWeather} from '../../api/index.js';
import menuList from '../../config/menuConfig';
import {formateDate} from '../../utils/dateUtils.js';
import  memoryUtils from '../../utils/memoryUtils.js';
import storageUtiles  from '../../utils/storageUtils.js';

import './index.less';
import weather_png from '../../assets/images/weather.png';
/* 
头部的组件
*/


class Header extends Component{

    state = {
        currentTime: formateDate(Date.now()), // 当前时间字符串
        // weather_date: '', // 日期
        weather_wea: '多云', // 阴天
        // weather_air_level: '' // 空气质量
    }

    getTime = () => {
        // 每隔1s 获取当前时间，并且更新状态数据
        this.intervalId = setInterval(() => {
            this.setState({
                currentTime: formateDate(Date.now())
            })
        },1000);
    }
    getWeather = async () => {
        // 获取请求结果 都需要异步操作
        // 调用接口请求异步 获取数据
        const {weather_wea} = await reqWeather('宝鸡');
        //    更新状态
        this.setState({weather_wea});

    }
    
    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item => {
            if(item.key === path){ // 如果当前item对象的key 与 path 一样, item的title就是需要显示的title
                title = item.title;
            } else if (item.children) {
                // 在所有的子item中查找匹配的
                // find() 返回的是 满足查询条件的 第一个元素值(对象) --》  indexOf() 返回 匹配到的第一个字符串的下标  未找到返回 -1
               const cItem =  item.children.find(cItem => path.indexOf(cItem.key) === 0); // find(citem => true) 返回true说明找到了 find返回当前元素
               // 如果有值 才说明 有匹配的
               if(cItem) { 
                //    取出它的title
                   title = cItem.title;
               }
            }
        })
        return title;
    }
    /* 
    退出登录
    */
    logoutClickEvent = () => {
        // 显示确认框
        const { confirm } = Modal;
        confirm({
            title: '确定要退出吗?',
            icon: <ExclamationCircleOutlined />,
            // content: '确定要退出吗?',
            okText: '确定',
            //  okType: 'default',
            cancelText: '取消',
            //  变成箭头函数 才能解决 this 不然是 undefined
            onOk: () => {
            console.log('OK', this);
            //  删除保存的user数据
            // 先删除本地的
            storageUtiles.removeUser();
            memoryUtils.user = {};
            // 提示登录成功
            message.success('退出账号成功');
            //  跳转到Login
            this.props.history.replace('/login');
            }
          });
    }
    /* 当前组件 卸载之前调用 */
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId);
    }
    /* 
    第一次render() 之后执行一次
    一般在此执行异步操作： 发ajax请求 / 启动定时器
    */
    componentDidMount() {
        // 获取当前的事件
        this.getTime();
        // 获取当前天气
        // this.getWeather();

    }

    render() {
        const {currentTime, weather_wea} = this.state;
        // 从内存中获取 用户名
        const username = memoryUtils.user.username;

        // 得到当前需要显示的title
        const title = this.getTitle();
        return(
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {username}</span>
                    {/* <button className="header-top-button" onClick={this.logoutClickEvent}>退出</button> */}
                    <LinkButton onClick={this.logoutClickEvent}>退出</LinkButton>
                    {/* <a href="#" onClick={this.logoutClickEvent}>退出</a> */}
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={weather_png} alt="weather"/>
                        <span>{weather_wea}</span>
                    </div>
                </div>
            </div>
        )
    }
}

// 暴露 包装后 的 新组件
export default withRouter(Header);
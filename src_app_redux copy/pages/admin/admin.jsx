import React,{Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import { Layout } from 'antd';
import {connect} from 'react-redux';
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import Home from '../home/home';
import Category from '../category/category';
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';
/* 后台管理的路由组件 */

// 布局
const { Footer, Sider, Content } = Layout;

class Admin extends Component{
    render() {
        const user = this.props.user;
        // 如果内存中没有存储user ==> 当前没有登录
        if(!user || !user._id){ // user为空 或者 user._id为空时
            //  自动跳转到登录页面 (在render()中实现跳转)
            // 重定向标签 Redirect
            return <Redirect to='/login'/>
        }
        return(
            // 外头的{} 代表 要写 js 低吗
            // 里面的{} 代表  一个js对象
            // mingHeight 最小高度 可以保证页面被撑开的同时 布局完成
            <Layout style={{minHeight: '100%'}}> 
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header />
                    <Content style={{margin: '20px', backgroundColor: '#fff' }}>
                        {/* 在哪里显示就在那里配置路由 */}
                        {/* 因为在App根组件中 已经有一个 大的路由包裹了 */}
                        {/* <BrowserRouter> */}
                            <Switch>
                                <Route path="/home" component={Home}></Route>
                                <Route path="/category" component={Category}></Route>
                                <Route path="/product" component={Product}></Route>
                                <Route path="/role" component={Role}></Route>
                                <Route path="/user" component={User}></Route>
                                <Route path="/charts/bar" component={Bar}></Route>
                                <Route path="/charts/line" component={Line}></Route>
                                <Route path="/charts/pie" component={Pie}></Route>
                                {/* 默认显示 Home  前面都没有匹配到  重定向到home*/}
                                {/* logo的链接跳转 / 因为都没有匹配到 所有进行重定向 */}
                                <Redirect to='/home' />
                            </Switch>
                        {/* </BrowserRouter> */}
                    </Content>
                    <Footer style={{textAlign: 'center', color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {}
)(Admin)
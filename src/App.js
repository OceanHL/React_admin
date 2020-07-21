import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './pages/login/login';
import Admin from './pages/admin/admin'; // 组件名字必须大写

export default class App extends Component{
    
    render() {
        return(
            <BrowserRouter>
                <Switch>  {/* 只匹配其中一个路由 */}
                    <Route path="/login" component={Login}></Route>
                    {/* /是根目录 */}
                    <Route path="/" component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}


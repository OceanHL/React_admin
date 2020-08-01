import React,{Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import ProductHome from './home';
import ProductAddUpdate from './add-update';
import ProductDetail from './detail';

import './product.less'


/* 商品二级路由 */

export default class Product extends Component {
    render() {
        return(
            <Switch>
                {/* 默认逐层匹配  必须精确匹配才可以 不然会进到 ProductHome 组件中 找*/}
                {/* 一般只需要给 根目录 添加 精确匹配 */}
                <Route exact path='/product' component={ProductHome}></Route>
                <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
                <Route path='/product/detail' component={ProductDetail}></Route>
                {/* 必须要有重定向，不然 随便输入一个地址 都会进行访问 */}
                <Redirect to='/product'/>
            </Switch>
        )
    }
}
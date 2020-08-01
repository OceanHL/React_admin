import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import { Menu/* , Button */ } from 'antd';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig';
import './index.less';
// 需要更新状态就必须 要引入 action
import {setHeadTitle} from '../../redux/actions';
/* 
左侧导航的组件
*/
const { SubMenu } = Menu;
class LeftNav extends Component{

    // 生命有哪些参数
    static propTypes = {
        setHeadTitle: PropTypes.func.isRequired
    }
    /* 
    判断当前登录用户对item是否有权限
    */
   hasAuth = (item) => {
       const {key, isPublic} = item;

       const menus = this.props.user.role.menus; // 数组
       const username = this.props.user.username;

       /* 
       1. 如果当前用户是admin
       2. 如果当前item是公开的
       3. 当前用户有此item的权限： 就看key有没有在menus中
       */

       if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
           return true;
       } else if(item.children) { // 4. 如果当前用户有此item的某个子item的权限
        // !! 强制转换为 布尔值
           return !!item.children.find(child => menus.indexOf(child.key) !== -1)
       }

       return false;
   }


    // state = {
    //     collapsed: false,
    // };
    
    // toggleCollapsed = () => {
    //     this.setState({
    //       collapsed: !this.state.collapsed,
    //     });
    // };

    /* 
    根据menu的数据数组生成对应的标签数组 两种标签情况 1. Menu.Item  2.SubMenu
    使用map() + 递归调用
    */
    getMenuNodes_map = (menuList) => {
        // map 返回的是一个新数组
        return menuList.map((item, index) => {
            /* 
            
                <Menu.Item key="/product" icon={<MailOutlined />}>
                    <Link to='/product'>商品管理</Link>
                </Menu.Item>

                <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                    <Menu.Item key="/category" icon={<MailOutlined />}>
                         <Link to='/category'>品类管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/product" icon={<MailOutlined />}>
                        <Link to='/product'>商品管理</Link>
                     </Menu.Item>
                </SubMenu>
            
                {
                    title: '首页', // 菜单标题名称
                    key: '/home', // 对应的path
                    icon: <PieChartOutlined />,  // 字体图标组件
                    children: [], // 可能有， 也可能没有
                }
            */ 
           const path = this.props.location.pathname;

            if(!item.children){  // item.children 为空时
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            }else {
                 // 查找一个与当前请求路径匹配的子Item
                 const cItem = item.children.find(cItem => cItem.key === path)

                 if(cItem) { // 有值
                     this.openKey = item.key; // 父亲的 key值 记录起来
                 }
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {
                            // 递归调用
                            this.getMenuNodes_map(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }

    /* 
    根据menu的数据数组生成对应的标签数组 两种标签情况 1. Menu.Item  2.SubMenu
    使用reduce() + 递归调用
    reduce(): 累计累加
    */
    getMenuNodes = (menuList) => {
        // 得到当前请求的路由路径
        // 不是路由组件 也可以获得 路由的三个属性 withRouter
        const path = this.props.location.pathname;

        return menuList.reduce((pre, item) => {
            // 如果当前用户有Item对应的权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                //  向pre前一个值中 添加<Menu.Item></Menu.Item>
                if(!item.children){ // children为空时
                    // 判断item是否是当前对应的item
                    if (item.key === path || path.indexOf(item.key) === 0){
                        // 更新 redux 中 的 headerTitle 状态
                        this.props.setHeadTitle(item.title)
                    }
                    // pre 此时 为 一个数组
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>{item.title}</Link>
                        </Menu.Item>
                    ))
                }else {
                    // 查找一个与当前请求路径匹配的子Item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0) // 只要开头字符串匹配 需要打开父亲链接栏

                    if(cItem) { // 有值
                        this.openKey = item.key; // 父亲的 key值 记录起来 打开父亲
                    }

                    //  向pre前一个值中 添加<SubMenu></SubMenu>
                    pre.push((
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {
                                // 递归调用
                                this.getMenuNodes(item.children)
                            }
                        </SubMenu>
                    ))
                }
            }
            

            // 必须要 返回 pre 因为 是当前的统计结果 并且 是下一次统计的条件
            return pre
        },[])
    }
    
    /* 在第一次render()之前 执行一次
     为第一个render() 准备数据（必须同步的）
    */
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList);
        console.log('willmount的');
    }
    UNSAFE_componentWillUpdate
    render() {
        // 得到当前请求的路由路径
        // 不是路由组件 也可以获得 路由的三个属性 withRouter
        let path = this.props.location.pathname;
        console.log('render()的111' + path);
        //  ！== -1  或则 返回查找元素的第一个字符的下标 为 0
        //  === 0
        if(path.indexOf('/product') !== -1) { // 没有找到返回 -1 如果不返回 -1 说明 找到了
            path = '/product';
        }
        
        
        // 得到需要打开菜单项的key
        const openKey = this.openKey; // 只有this.getMenuNodes 函数执行 才有值

        // const new_path = path.split('/');
        // const second_path = '/' + new_path[1];
        // console.log(second_path);
       
        return(
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>后台管理</h1>
                </Link>
                {/* <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                </Button> */}
                <Menu
                    selectedKeys={[path]} // 动态默认选中
                    defaultOpenKeys={[openKey]} // 默认打开
                    mode="inline"
                    theme="dark"
                    // inlineCollapsed={this.state.collapsed}
                >
                    {
                        // 获取 Menu 的所有子节点
                        // this.getMenuNodes_map(menuList)
                        // this.getMenuNodes(menuList)
                        this.menuNodes // 组件不需要变化
                    }
                </Menu>
            </div>
        )
    }
}
/* 
withRouter高阶组件：参数是组件 返回的也是组件 
    包装非路由组件， 返回一个新的组件
    新的组件向 非路由组件传递的参数中有 3个属性： history/location/match

*/
export default connect(
    // 这个结构是固定的 必须写这两个
    state => ({user: state.user}),
    {setHeadTitle} // 最终会向LeftNav组件 传递 setHeadTitle函数 --》就会去更新状态
)(withRouter(LeftNav))
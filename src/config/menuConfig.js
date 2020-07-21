/* 菜单栏配置 */
import React from 'react';
import {
    AppstoreOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined
  } from '@ant-design/icons';
  /*               <Menu.Item key="/user" icon={<DesktopOutlined />}>
                        <Link to='/user'>用户管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/role" icon={<ContainerOutlined />}>
                        <Link to='/role'></Link>
                        角色管理
                    </Menu.Item>

                    <SubMenu key="sub2" icon={<AppstoreOutlined />} title="图形图表">
                        <Menu.Item key="/bar">
                            <Link to='/bar'>柱状图</Link>
                        </Menu.Item>
                        <Menu.Item key="/line">
                            <Link to='/line'>折线图</Link>  
                        </Menu.Item>
                        <Menu.Item key="/pie">
                            <Link to='/pie'>饼图</Link> 
                        </Menu.Item>
                         <SubMenu key="sub3" title="Submenu">
                            <Menu.Item key="11">Option 11</Menu.Item>
                            <Menu.Item key="12">Option 12</Menu.Item>
                        </SubMenu> 
                    </SubMenu> */
const menuList = [
    {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的path
        icon: <PieChartOutlined />,  // 字体图标组件
        isPublic: true // 对所有用户公开显示
    },
    {
        title: '商品',
        key: '/products',
        icon: <MailOutlined />,
        children: [
            {
                title: '品类管理',
                key: '/category',
                icon: <MailOutlined />,
            },
            {
                title: '商品管理',
                key: '/product',
                icon: <MailOutlined />,
            }
        ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: <DesktopOutlined />
    },
    {
        title: '角色管理',
        key: '/role',
        icon: <ContainerOutlined />
    },
    {
        title: '图形图表',
        key: '/charts',
        icon: <AppstoreOutlined />,
        children: [
            {
                title: '柱状图',
                key: '/charts/bar',
                icon: <AppstoreOutlined />
            },
            {
                title: '折线图',
                key: '/charts/line',
                icon: <AppstoreOutlined />
            },
            {
                title: '饼图图',
                key: '/charts/pie',
                icon: <AppstoreOutlined />
            }
        ]
    }
];

export default menuList;
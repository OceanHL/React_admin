import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Input,
    Tree
} from 'antd';
import menuList from '../../config/menuConfig';

const {Item} = Form;
export default class AuthForm extends PureComponent{
   static propTypes = {
       role: PropTypes.object
   }

   /* 根据传入角色的menus生成初始状态 */
   constructor(props) {
       super(props);
       /* 先取出role */
       const {menus} = this.props.role;
       this.state = {
        checkedKeys: menus,
       }
   }

   // 树的数据
   treeData = [
    {
      title: '平台权限',
      key: 'all',
      children: menuList,
    }
  ];

  /* 
  为父组件提交获取最新menus数据的方法
  */
  getMenus = () => this.state.checkedKeys


  // 选中的监听回调函数
  onSelect = () => {

  }

  // 选中某个node时的 复选框监听函数
  onCheck = (checkedKeys, info) => {
    //   checkedKeys 返回的是所有选中的 key值
    console.log('onCheck', checkedKeys, info);
    this.setState({
        checkedKeys
    })
  };

    /* 根据新传入的role来更新checkedKeys状态 */
    /* 
    当组件接收到新的属性时自动调用
    */
    UNSAFE_componentWillReceiveProps(nextProps) { // 最新接收到的参数
        console.log('UNSAFE_componentWillReceiveProps', nextProps);
        // nextProps 是 接收到最新的参数 
        const menus = nextProps.role.menus // 参数里最新的role里面的menus
        /* setState更新状态 会重新渲染 */
        this.setState({
            checkedKeys: menus,
        })
        // 利用 this.state.checkedKeys = menus 更新状态 不会重新渲染 
        // 但是 在componentWillReceiveProps 函数里面 可以 因为 这个函数在 render() 渲染 之前执行
    }

    render() {
        console.log('Auth form render()');
        // 要从参数中 取出来数据
        const {role} = this.props; // role 每次都是最新的
        const {checkedKeys} = this.state; // checkedKeys只有 在构造函数中 更新一次
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: {span: 4}, // 左侧label的宽度
            wrapperCol: {span: 15}, // 右侧包裹的宽度
        }
        return (
            <div>
                {/* Item 也可以不同 Form包装器阿莱 */}
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Item>
                <Tree
                    // 节点前添加 Checkbox 复选框
                    checkable

                    // 默认展开所有树节点
                    defaultExpandAll={true}

                    // 默认展开指定的树节点
                    // defaultExpandedKeys={['0-0-0', '0-0-1']}

                    // 默认选中的树节点
                    // defaultSelectedKeys={['0-0-1']}

                    // 默认选中树节点的复选框
                    // defaultCheckedKeys={['/home', '/products', '/role']} 

                    // 选中复选框的树节点
                    checkedKeys={checkedKeys}

                    // 选中的监听回调函数
                    onSelect={this.onSelect}
                    
                    // 复选框选中监听函数
                    onCheck={this.onCheck} 

                    // 树的数据
                    treeData={this.treeData} 
                />
            </div>
        )
    }
}
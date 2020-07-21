import React,{Component} from 'react';
import { Card, Button, Table, message } from 'antd';
import {PAGE_SIZE} from '../../utils/constants';
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api';
import Modal from 'antd/lib/modal/Modal';
import AddForm from './add-form';
import AuthForm from './auth-form';
import memoryUtiles from '../../utils/memoryUtils';
import {formateDate} from '../../utils/dateUtils';
import storageUtiles from '../../utils/storageUtils';
/* 角色管理二级路由 */

  
export default class Role extends Component {
    
    state = {
        roles: [], // 所有角色的列表
        role: {}, // 选中的role
        isShowAdd: false, // 是否显示添加角色的模态框
        isShowAuth: false, // 是否显示授权模态框
    }

    constructor(props) {
        super(props);
        
        // 1. 创建一个容器
        this.auth = React.createRef();
    }
    
    // 初始化表格的列
    initColum = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name', // 指定数据名称 来显示
                key: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
                width: '20%',
                render: (create_time) => formateDate(create_time) // 参数里面放 时间戳
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                width: '30%',
                key: 'auth_time',
                // () => 2 定义一个函数 返回 2
                render: formateDate // render 需要指定一个函数，并且接收 auth_time 参数值
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
                width: '30%',
                key: 'auth_name',
            },
        ]
    }

    // 获得表格的显示数据
    getRoles = async () => {
        const result = await reqRoles();
        if(result.status === 0) { // 获取数据成功
            // 获取返回的数据
            const roles = result.data;
            this.setState({
                roles
            })
        }
    }

    // 选中行时触发的监听函数
    rowSelection = {
        // 选中项发生变化时的回调
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

        //   this.setState({
        //       role: selectedRows[0]
        //   })
          
        },

        // 用户手动选择/取消选择某行的  radio 时进行回调 参数为： 选择行的数据，是否被选中，选择行的数组信息， 监听的事件信息
        onSelect: (role) => {
            console.log('我是role',role);
            this.setState({
                role
            })
        },
        // 选择框的默认属性配置
        getCheckboxProps: record => ({
            // disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
      };

    //   对表单的 每一个行元素 进行属性设置
      onRow = (role) => { // role 是记录 点击到某行的消息
        // 这个role是 roles中的一个子元素
        return {
            onClick: event => {  // 点击行
                console.log('row Click()', role);
                // alert('点击行了')
                this.setState({ // 点击行 将该行的 数据 重新写入到 role中
                    role // 将状态中的 role 指向 roles 中的 子元素 role
                    // 在别的地方修改 状态里面的 role 则同时 也会被 roles看到
                })
            }, 
        }
      }

      /* 
      添加角色
      */
      addRole = () => {

        this.form.validateFields()
        .then(async values => {
                console.log('我是添加角色表单里的值', values);
                // 1. 收集收入数据
                const {roleName} = values // 因为 values 返回的是一个对象
                // 清空上次输入的数据 或则 也可以进行表单数据的重置
                this.form.resetFields();

                // 2. 请求添加
                const result = await reqAddRole(roleName)
                if(result.status === 0) {
                // 3. 根据结果提示/更新列表显示
                    message.success('添加角色成功');
                    // 更新列表就是从新取一遍数据
                    // this.getRoles();

                    // 新产生的角色
                    const role = result.data;
                    // React中 不推荐 直接去更新 状态数据 --》需要重新生成一个数据 去改变

                    // 只需要更新roles状态
                    // const roles = this.state.roles;
                    // roles 是一个 数组 push 从尾部插入
                    // roles.push(role);
                    // roles.splice() 进行删除
                    // this.setState({
                    //     roles
                    // })

                    // 更新roles状态：基于原本状态数据更新
                    this.setState(state => ({ // 里面放一个函数，并且返回一个对象
                        roles: [...state.roles, role] // state 为当前的状态对象
                    }))
                    // 更新的数据与原来的数据没有关系 --》新数据
                    /* this.setState({
                    }) */
                } else {
                    message.error('添加角色失败')
                }
        })
        .catch(error => {
            message.error('表单内没有填写数据');
        })
        
        
        // 关闭模态对话框
        this.setState({
            isShowAdd: false
        })
      }

      /* 授权角色 */
      authOk = async () => {
          /* 关闭授权模态对话框 */
          this.setState({
              isShowAuth: false
          })

        //   1. 收集数据

            //   状态的role是 选择的该行的 role数据对象
            const role = this.state.role;
            //   得到最新的menus
            const menus = this.auth.current.getMenus();
            role.menus = menus;
            role.auth_time  = Date.now(); // 存储时间戳
            role.auth_name = memoryUtiles.user.username;

            // 2. 请求更新
            const result = await reqUpdateRole(role);
            if (result.status === 0) {

                // 当前更新的是自己角色的权限, 强制退出
                if (role._id === memoryUtiles.user.role_id) {
                    memoryUtiles.user = {};
                    storageUtiles.removeUser();
                    this.props.history.replace('/login');
                    message.success('当前用户角色权限修改了，重新登陆');
                } else {
                    message.success('设置角色权限成功');
                    // 更新显示
                    // 方法一：直接重新获取新的数组就行
                    // this.getRoles()
                    // 方法二：只需要重新结构 原来的状态
                    this.setState({ // 因为 修改的状态中的 role 就是 roles的儿子
                        roles: [...this.state.roles]
                    })

                }
                
            } else {
                message.error('设置权限失败');
            }

      }

      /* 关闭Model模态对话框 */
      handleCancel = () => {
          this.setState({
            isShowAdd: false, // 添加角色模态框 消失
          })
      }


      UNSAFE_componentWillMount() {
        this.initColum();
      }

      componentDidMount() {
          this.getRoles();
      }
    
    render() {
        const {roles, role, isShowAdd, isShowAuth} = this.state;

        // role为选中的哪一行的 所有数据对象

        // 卡片的标题设置
        const title = (
            <span>
                <Button type="primary" onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>
                {/* role._id 刚开始没有值，为false 所以此时 按钮可以用 所有需要取反 */}
                <Button 
                    type="primary" 
                    disabled={!role._id} 
                    style={{marginLeft:10}}
                    onClick={() => this.setState({isShowAuth: true})}
                >
                    设置角色权限
                </Button>
            </span>
        )

        return(
            <Card title={title} style={{ width: '100%' }}>
                <Table
                    // 表格的属性设置
                    columns={this.columns}
                    dataSource={roles}
                    rowSelection={{ ...this.rowSelection, type: 'radio', selectedRowKeys: [role._id]}} // selectedRowKeys: [role._id] 显示 哪一行被选中
                    onRow={this.onRow}  // 绑定行的监听函数
                    // 有无边框
                    bordered={true}
                    // 表格行 Key的取值 rowKey='_id' 可以用字符串 也可以用 大括号 括起来
                    rowKey={'_id'}
                    // 设置分页器 
                    pagination={{
                        // 默认当前页
                        defaultCurrent: 1,
                        // 默认每页显示五条数据
                        defaultPageSize: 5,
                        // 是否可以快速跳转至某页
                        showQuickJumper: true
                    }}
                    // loading={loading}
                />

                {/* 添加角色模态对话框 */}

                {
                    isShowAdd && 
                    <Modal
                        title="创建角色"
                        visible={true}
                        onOk={this.addRole}
                        onCancel={this.handleCancel}
                    >
                        <AddForm setForm={(form) => this.form = form } />  {/* 函数里面的参数是 父组件需要 接收的 参数 */}
                    </Modal>
                }

                {/* 授权模态对话框 */}
                    <Modal
                        title="设置角色权限"
                        visible={isShowAuth}
                        onOk={this.authOk}
                        onCancel={() => {
                            this.setState({isShowAuth: false});
                        }}
                    >
                        {/* 2. 将容器对象 交给 子组件 */}
                        <AuthForm ref={this.auth} role={role} />
                    </Modal>
                
            </Card>
        )
    }
}
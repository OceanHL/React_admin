import React,{Component} from 'react';
import {
    Card,
    Button,
    Table,
    Modal,
    message,
} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {formateDate}  from '../../utils/dateUtils';
import LinkButton from '../../components/link-button';
import {PAGE_SIZE} from '../../utils/constants';
import {reqUsers, reqDeleteUser, reqAddOrUpdateUser} from '../../api';
import UserForm from './user-form';

/* 用户管理二级路由 */

export default class User extends Component {

  state = {
    users: [],  // 所有用户列表
    roles: [], // 所有角色列表
    isShow: false, // 是否显示确认框
  }
  
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '所属角色',
        render: (user) => ( // 选中行的所有信息
          <span>
            <LinkButton onClick={() => this.showUpdate(user)} >修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>)
      }
    ]
  }

  /* 
  根据role的数组，生成包含所有角色名的对象（属性名用角色Id值）
  */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre
    }, {})
    // 保存起来
    this.roleNames = roleNames;
  }

  /* 
  显示添加界面
  */
 showAdd = () => {
  //  因为是创建 以前的 user 
  this.user = null;
  // 显示模态框
  this.setState({
    isShow: true
  })
 }

  /* 
  显示修改界面
  */
 showUpdate = (user) => {
  //  点击修改的时候 this.user 才有值 因为render会不停的刷新
   this.user = user // 保存user  一标识是修改 二可以显示数据
   this.setState({
     isShow: true
   })
 }

  /* 
  删除指定用户
  */
 deleteUser = async (user) => {
  Modal.confirm({
    title: `确认删除${user.username}吗?`,
    icon: <ExclamationCircleOutlined />,
    onOk: async () => {
      const result = await reqDeleteUser(user._id);
      if (result.status === 0 ){
        message.success('删除用户成功!');
        this.getUsers();
      }
    },
    onCancel: () => {
      console.log('Cancel');
    },
  })
 }

  /* 
  添加/更新用户
  */
 addOrUpdateUser = async () => {

   this.setState({
     isShow: false
   })

  //  1. 收集输入数据
  console.log('添加角色', this.form);
  const user = this.form.getFieldsValue();
  this.form.resetFields(); // 清空表单数据

  //  如果是更新，需要给User指定_id属性
  if (this.user) {
    user._id = this.user._id; // 修改的时候 需要添加用户的_id 因为需要这个参数
  }

  // 2. 提交添加的请求
  const result = await reqAddOrUpdateUser(user);
  // 3. 更新列表显示
  if (result.status === 0) {
    message.success(`${this.user ? '修改' : '添加'}用户成功`);
    this.getUsers(); // 重新获取数据并且渲染页面
  } else {
    message.error('添加用户失败');
  }
 }


//  获取用户列表数据
 getUsers = async () => {
   const result = await reqUsers();
   if (result.status === 0) {
    const {users, roles} = result.data;
    this.initRoleNames(roles);
    this.setState({
      users,
      roles
    })
   }
 }

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getUsers();
  }

    render() {
      const {users, roles, isShow} = this.state;
      const user = this.user || {} // 尽量不要动全局的 this.user
      // const user = this.user
      
        const title = (
            <Button type="primary" onClick={this.showAdd}>创建用户</Button>
        )
        return(
            <Card title={title} style={{ width: "100%", height: "100%" }}>
                <Table
                    dataSource={users} 
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    pagination={{
                      defaultPageSize: PAGE_SIZE,
                      showQuickJumper: true
                    }}
                />
                
                {
                  isShow && 
                  <Modal
                // 如果是 user 就算是空对象 也是真
                  title={user._id ? '修改用户' : '添加用户'}
                  visible={isShow}
                  onOk={this.addOrUpdateUser}
                  onCancel={() => {
                    this.form.resetFields();
                    this.setState({
                      isShow: false
                    })
                }}
                >
                  <UserForm 
                    setForm={(form) => this.form = form}
                    roles={roles}
                    user={user}
                  />
                </Modal>
                }
                
            </Card>
        )
    }
}
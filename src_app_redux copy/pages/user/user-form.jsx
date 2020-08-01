import React, {PureComponent} from 'react';
import {Form, Input, Select} from 'antd';
import PropTypes from 'prop-types';

const {Item} = Form;
const {Option} = Select;
/* 添加/修改用户的form组件 */
export default class UserForm extends PureComponent {
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object, // 接收修改用户的信息
    }
    formRef = React.createRef(); // 要用didMount来 传递 表单对象
    // 要用didMount来 传递 表单对象
    componentDidMount() {
        console.log('DidMount的form对象', this.formRef.current);
        this.props.setForm(this.formRef.current);
    }

    UNSAFE_componentWillReceiveProps(){
        
    }
    
    render() {
        const {roles} = this.props;
        const user = this.props.user || {} // 没有值 就传递空对象 来.
        const formItemLayout = {
            labelCol: { span: 4 }, // 左侧Label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }
        return (
            <Form ref={this.formRef} {...formItemLayout}
                initialValues={{
                    username: user.username,
                    password: user.password,
                    phone: user.phone,
                    email: user.email,
                    role_id: user.role_id,
                }}
            >
                <Item label="用户名" name="username">
                    <Input placeholder="请输入用户名" />
                </Item>
                {
                    user._id ? null : 
                    (
                        <Item label="密码"  name="password">
                            <Input type='password' placeholder="请输入密码" />
                        </Item>
                    )
                }
                
                <Item label="手机号" name="phone">
                    <Input placeholder="请输入手机号" />
                </Item>
                <Item label="邮箱" name="email">
                    <Input type="email" placeholder="请输入邮箱" />
                </Item>
                <Item label="所属角色" name="role_id">
                    <Select placeholder="请选择所属角色">
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}

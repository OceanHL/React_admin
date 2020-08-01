import React,{Component} from 'react';
import './login.less';
import logo from '../../assets/images/logo.png';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {login} from '../../redux/actions';

/* 登录的路由组件 */

class Login extends Component{
    // 对所有表单字段进行校验
    onFinish = async values => {
        // 校验成功 values是个
        // console.log('提交登录的ajax请求: ', values);
        // 请求登录
        const {username, password} = values;

        // 通过redux调用分发异步action的函数 => 发登陆的异步请求，有了结果后更新状态
        this.props.login(username, password)


      };
    /* 对密码进行自定义验证 */
    /* 
      用户名/密码的合法性要求
      1》、必须输入
      2》、必须大于等于4位
      3》、必须小于等于12位
      4》、必须是英文、数字或者下划线组成
    */ 
    validatorPwd = (rule, value) => {
        // console.log('validatorPwd: ',rule, value);
         // 验证失败 ，并指定提示的文本
        if(!value){
            return Promise.reject("密码必须输入");
        }else if(value.length < 4) {
            return Promise.reject("密码长度不能小于4位");
        }else if(value.length > 12){
            return Promise.reject("密码不能大于12位");
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            return Promise.reject("用户名必须是英文、数字或下划线组成");
        }else {
            // 验证通过
            return Promise.resolve();
        }
        
        
    }
    render() {

        // 渲染中的操作 在 render() 中写
        // 如果用户已经登陆，自动跳转到管理页面
        // 
        const user = this.props.user  // 从内存中读取
        if(user && user._id){ // 内存中 user 存在时
            return <Redirect to="/home" />
        }

        return(
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{  // 统一设置默认值初始化值
                            remember: true,
                            password: 'admin'
                    }}
                    onFinish={this.onFinish} // 提交获取的 数据
                    >
                    <Form.Item
                        name="username"// 必须标识名称 为了获取值
                        // 声明式验证： 直接使用别人定义好的验证规则进行验证
                        rules={[ 
                        {
                            required: true,
                            whitespace: true,
                            message: '用户名必须输入'
                        },
                        {  
                            min: 4,
                            message: "用户名至少4位"
                        },
                        {
                            max: 16,
                            message: "用户名最多16位"
                        },
                        {
                            pattern: /[a-zA-Z][a-zA-Z0-9_]/,
                            message: "用户名必须是英文、数字或下划线组成"
                        }
                        ]}
                        // 验证规则只提示一个
                        validateFirst='true'
                        // initialValues 是 From里面设置初始值
                        // 单标签元素中设置默认值
                        initialValue="admin"
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" style={{color: 'pink'}} />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                        {
                            validator: this.validatorPwd
                        }
                        ]}
                    >
                        <Input
                        prefix={<LockOutlined className="site-form-item-icon" style={{color: 'pink'}} />}
                        type="password"
                        placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>记住密码</Checkbox>
                        </Form.Item>

                        <Link to="/forget" className="login-form-forgot">
                        忘记密码？
                        </Link>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                        </Button>
                        <Link to="/register" className="register-new">注册新的账号！</Link>
                    </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {login}
)(Login)

/* 
    收集表单数据

    1. 前端表单验证
    2. 后端表单验证

*/
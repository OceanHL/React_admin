import React, {Component} from 'react';
import {Form, Input} from 'antd';
import PropTypes from 'prop-types';
/* 
添加分类的form组件
*/

export default class AddForm extends Component {

    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        // subCategorys: PropTypes.array.isRequired
    }

    

    onFinish = (values) => {
        console.log(values);
    }
    // 第一次render() 之后 执行
    componentDidMount() {
        // 将当前的表单对象传递 到外部
        this.props.setForm(this.formRef.current)
    }
    render() {
         // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: {span: 5}, // 左侧Label的宽度
            wrapperCol: {span: 16} // 右侧包裹的宽度
        }
        return (
            <Form
                {...formItemLayout}
                initialValues={{
                    roleName: ''
                }}
                onFinish={this.onFinish}
                ref={this.formRef}
            >
                
                <Form.Item
                    label='角色名称'
                    name= "roleName"
                    rules={[
                        { required: true,
                          message: '请输入角色名' 
                        }
                    ]}
                    // initialValue = '' // 默认值是 0
                >
                    <Input style={{width: '100%'}} placeholder='请输入角色名'></Input>
                </Form.Item>
            </Form>
        )
    }
}

// export default Form.create()(AddForm)
// 这样可以直接 使用 this.props.form 来操作 表单 或者 

// const [form] = Form.useForm(); 
// form 为此时表单对象

// 使用 添加ref  React.createRef(); 获取表单对象
// this.formRef = React.createRef();
// this.formRef.current 为当前表单对象
// 
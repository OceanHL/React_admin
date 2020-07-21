import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Input} from 'antd';
/* 
更新分类的form组件
*/


export default class UpdateForm extends Component {
    formRef = React.createRef();
    
    static propTypes = {
        // 利用PropTypes 指定数据类型 必须有值 没有触发数据时 为空字符串
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    onFinish = (values) => {
        console.log(values);
    }

    // 只需要调用一次就行
    componentDidMount() {
        // 将form对象 通过setForm() 传递父组件
        console.log('要传form对象'+ this.formRef.current.getFieldValue('categoryName'));
        // const newName = this.formRef.current.getFieldValue('categoryName')
        this.props.setForm(this.formRef.current)
    }

    render() {
        // 利用 ref 获取表单域的对象 进行操作

        const {categoryName} = this.props;
        // console.log('render()'+categoryName);
        return (
            <Form
                // initialValues={{
                //     categoryName: categoryName
                // }}
                onFinish={this.onFinish}
                ref={this.formRef}
            >
                <Form.Item
                    name= "categoryName"
                    rules={[
                        { required: true,
                          message: '分类名称必须输入!' 
                        }
                    ]}
                    initialValue = {categoryName} // 默认值是 0
                >
                    <Input placeholder='请输入修改的名称'></Input>
                </Form.Item>
            </Form>
        )
    }
}


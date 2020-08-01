import React, {Component} from 'react';
import {Form, Select, Input} from 'antd';
import PropTypes from 'prop-types';
/* 
添加分类的form组件
*/
const {Option} = Select;

export default class AddForm extends Component {

    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categorys: PropTypes.array.isRequired,  // 一级分类的数组
        parentId: PropTypes.string.isRequired   // 父分类的ID
        // subCategorys: PropTypes.array.isRequired
    }

    onFinish = (values) => {
        console.log(values);
    }
    // 第一次render() 之后 执行
    componentDidMount() {
        // 将当前的表单对象传递过去
        this.props.setForm(this.formRef.current)
    }
    render() {
         // 利用 ref 获取表单域的对象 进行操作
        const {categorys, parentId} = this.props;
        console.log(categorys,parentId);
        return (
            <Form
                initialValues={{
                    parentId: parentId,
                    categoryName: ''
                }}
                onFinish={this.onFinish}
                ref={this.formRef}
            >
                <Form.Item name="parentId"
                    rules={[
                        { required: true,
                          message: 'Please input your Username!' 
                        }
                    ]}
                    // initialValue = '0' // 默认值是 0
                > 
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            // map 返回一个新数组
                           categorys.map(item => <Option value={item._id} key={item._id}>{item.name}</Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name= "categoryName"
                    rules={[
                        { required: true,
                          message: 'Please input your Username!' 
                        }
                    ]}
                    // initialValue = '' // 默认值是 0
                >
                    <Input placeholder='请输入分类名称'></Input>
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
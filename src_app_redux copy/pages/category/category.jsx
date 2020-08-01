import React,{Component} from 'react';
import { Card, Table, Button, Space, message, Modal } from 'antd';
import {PlusOutlined, ArrowRightOutlined} from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {reqCategorys, reqUpdateCategorys, reqAddCategory} from '../../api';
import AddForm from './add-form';
import UpdateForm from './update-form';
/* 商品分类二级路由 */

export default class Category extends Component {

    // 动态显示数据 用 state 

    state = {
        loading: false, // 是否正在获取数据中
        categorys: [], // 一级分类列表
        subCategorys: [], // 二级分类列表
        parentId: '0', // 当前需要显示的分类列表的 父分类ID parentId
        parentName: '', // 前需要显示的分类列表的 父分类名称
        // showStatues: 0, // 标识添加/更新的确认框是否显示，0：都不显示，  1：显示添加框， 2：显示更新框
        // currentCategory: {},
        updateVisible: false,
        addVisible: false
    }

    /* 
    初始化Table所有列的数组    
    */
   initColumns = () => {
    this.columns = [
        {
          title: '分类的名称',
          dataIndex: 'name', // 显示数据对应的 属性名
          key: 'name',
        },
        {
          title: '操作',
          key: 'action',
          width: 300,
          align: 'center',
          render: (category) => ( //   返回需要显示的界面标签
            <Space size="middle">
                <LinkButton onClick={() => {this.showUpdateModal(category)}}>修改操作</LinkButton>
                {/* 如何向事件回调函数传递参数： 先定义一个匿名箭头函数，在函数中调用处理的函数 并且 传递参数    null 是 不做任何显示 */}   
                {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null} 
            </Space>
          )
        },
    ];
   }
   /* 异步获取一级、二级分类列表显示 */
   getCategorys = async (parentId) => {

        // 在发请求前，显示loading
        this.setState({
            loading: true
        })
        // 根据 parentId 是否为 0 来获取数据
        parentId = parentId || this.state.parentId;
       // 发异步ajax请求，获取数据 返回promise 对象
        const result =  await reqCategorys(parentId);

        // 在请求完成后，隐藏loading
        this.setState({
            loading: false
        })

        if(result.status === 0) {
            // 取出分类数组（可能是一级也可能二级的）  result.data 是个 分类数组
            const categorys = result.data;
            // 更新一级分类数组状态
            if(parentId === '0'){ // 获取全部数据
                this.setState({
                    categorys
                })
            }else { // parentId 不为 0  为 具体的 id值
                this.setState({
                    subCategorys: categorys
                })
            }
        }else {
            message.error('获取分类列表失败');
        }

   }
   /* 显示指定一级分类对象的二级子列表 */
   showSubCategorys = (category) => {
       console.log('category:', category);       
    //    更新状态
       this.setState({
           parentName: category.name, // 当前选中 行 的 name 赋值给 state.parentName
           parentId: category._id
       }, () => { // 在状态更新 且 重新 render()后执行

            // 此时的 parentId
            console.log(this.state.parentId);

            // 获取二级分类列表 因为修改了 id 重新获取数据
            this.getCategorys();
       })
   }

    // 显示一级分类列表
   showCategorys = () => {
       /* 更新为显示一级列表的状态 二级列表的数据可以不需要 */
       this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
       })
   }

   /* 响应Model点击取消： 隐藏确定框  */
   handleCancel = () => {

    //    0  是 都不显示
       this.setState({
           updateVisible: false,
           addVisible: false
       })
   }

   /* 显示添加确认模态框 */
   showAddCategoryModal = () => {
    this.setState({
        // 显示 add的 模态对话框
        addVisible: true
    })
  }
  /* 
  显示修改的确认框
  */
  showUpdateModal = (category) => {
    console.log(category);
    this.currentCategory = category;
    // 更新状态
    this.setState({
        // showStatues: 2,
        // currentCategory: category,
        updateVisible: true
    })
  }
   /* 
   添加分类
   */
  addCategory = async () => {
    if(this.form.getFieldValue('categoryName')){
        // 1. 隐藏确认框
        this.setState({
            addVisible: false
        })
        // 2. 收集数据，并且提交添加分类的请求
        const {categoryName, parentId} = this.form.getFieldsValue();
        // console.log(categoryName, parentId);
        const result = await reqAddCategory(categoryName, parentId);
        // console.log(result);
        if(result.status === 0) {
            // 添加的分类就是当前分类列表下的分类
            if(parentId === this.state.parentId){
                // 重新获取 当前的 分类列表显示
                this.getCategorys();
            }else if (parentId === '0'){  // 在二级分类下或者在一级分类下 添加一级分类项，重新获取一级分类列表，但是不需要显示一级分类列表
                this.getCategorys('0');
            }
        }
    }
  
  }

  /* 
  更新分类
  */
  updateCategory = async () => {
        // console.log('updateCategory()');
        if(this.form.getFieldValue('categoryName')){
            console.log(this.form.getFieldValue('categoryName'));
            // 1. 隐藏确认框
            this.setState({
                updateVisible: false
            })
            // 准备数据 
            const categoryId = this.currentCategory._id;
            // 获取子组件的 表单对象 利用 ref属性
            const {categoryName} = this.form.getFieldsValue();
            console.log(categoryId, categoryName);
            // 2. 发送请求更新分类
            const result = await reqUpdateCategorys({categoryId, categoryName});
            if (result.status === 0) {// 没有进行重绘 说明 === 三等的类型不一样  0  和  ‘0’ 不一样
                // 3. 重新获取列表数据
                this.getCategorys(); // 只要更改 state的值 就会 触发重绘
            }
    }
    
       
    
  }

    /*
    为第一次render() 准备数据 
     */
    UNSAFE_componentWillMount() {
        this.initColumns();
    }

    // 执行异步任务：发送异步ajax请求
    componentDidMount() {
        // 获取一级分类列表
        this.getCategorys();
    }
    render() {
        // 读取状态数据
        const {categorys, subCategorys, parentId, parentName, loading, updateVisible, addVisible} = this.state;

        // 读取指定的分类名字  
        const currentCategory = this.currentCategory || {name: ''};  //因为还没有数据 所以指定一个空字符串

        //  card 的右侧标题
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined />
                <span style={{marginLeft: 5}}>{parentName}</span>
            </span>
        );

        // card 的右侧
        const extra = (
            <Button type="primary" icon={<PlusOutlined />} onClick={this.showAddCategoryModal}>添加</Button>
        )
        return(
            <Card title={title} extra={extra}>
                <Table
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
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
                    loading={loading}
                />
                { addVisible && 
                <Modal
                    title="添加分类"
                    visible={true} // 一直显示
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                    >
                    <AddForm 
                        categorys={ categorys } 
                        parentId={ parentId } 
                        setForm={(form) => this.form = form} 
                    />
                </Modal> 
                }
                
                {/* 设置state 利用是否挂载来更新 form 里面的 initialValue */}
                {/* 组件挂载的时候才会传递参数 */}
                { updateVisible && <Modal
                    title="更新分类"
                    // visible={showStatues === 2} // 2时 显示
                    visible={true}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    >
                    <UpdateForm categoryName={currentCategory.name} setForm={(form) => {this.form = form }}/>
                </Modal> }


                {/* <Modal
                    title="更新分类"
                    // visible={showStatues === 2} // 2时 显示
                    visible={showStatues === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    >
                    <UpdateForm categoryName={currentCategory.name} setForm={(form) => {this.form = form }}/>
                </Modal>  */}

            </Card>
        )
    }
}
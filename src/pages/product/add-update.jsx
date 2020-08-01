import React,{Component} from 'react';
import {
    Card,
    Form,
    Input,
    InputNumber ,
    Cascader,
    Upload,
    Button,
    message
} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';

import PicturesWall from './pictures-wall';
import LinkButton from '../../components/link-button';
import {reqCategorys, reqAddOrUpdateProduct} from '../../api';
import RichTextEditor from './rich-text-editor';
import memoryUtils from '../../utils/memoryUtils';


/* 
Product的添加和更新的子路由组件
*/

const {Item} = Form;
const { TextArea } = Input;

export default class ProductAddUpdate extends Component {

    state = {
        options: [],
        parentId: '0',
    }

    constructor(props) {
        super(props)

        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()

        // 创建用来保存ref标识的 富文本标签对象的容器
        this.richTextRef = React.createRef();
    }

    initOptions = async (categorys) => {
        // 根据 categorys 生成 options 数组
        const options = categorys.map(c => ({  // 利用小 （） 括起来 表示 返回 一个对象
            value: c._id,
            label: c.name,
            isLeaf: false, // 不是叶子
        }))

        // 如果是一个二级分类商品的更新
        const {isUpdate, product} = this;
        const {pCategoryId, categoryId} = product;
        if(isUpdate && pCategoryId !== '0')  { // 说明是一个二级分类商品的更新
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId) //  
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true, // 为叶子
            }))

            // 找到当前商品对应的 一级Option 对象
            const targetOption = options.find(option => option.value === pCategoryId)

            // 关联对应的一级option上
            targetOption.children = childOptions;
        }
        // 更新 options 状态
        this.setState({
            options
        })
    }

    /* 
    获取一级/二级分类列表，并显示
    async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
    */
    getCategorys = async (parentId) => {
        /* {status: 0, data: categorys} */
        // console.log(parentId);
       const result = await reqCategorys(parentId);
       if(result.status === 0) {
        //    接收数据
           const categorys = result.data;

        //    如果是一级分类列表
            if(parentId === '0') {
                this.initOptions(categorys);
            }else { // 二级列表
                return categorys   // 返回二级列表 --》 当前async 函数返回的promise就会成功且value为categorys
            }
            
       }
    }


    onFinish = async (values) => {

        console.log(values);
        // 1. 收集数据
        const {name, desc, price, categoryIds} = values;
        let pCategoryId, categoryId;
        if (categoryIds.length === 1) {
            pCategoryId = '0'; // 父id 为 0 表示为 一级分类下的产品
            categoryId = categoryIds[0]; // 0 索引下面 包含着 产品Id
        } else {
            pCategoryId = categoryIds[0];
            categoryId = categoryIds[1];
        }
        // 利用React.createRef() 容器 实现 父组件调用子组件

        const imgs = this.pw.current.getImgs();
        const detail = this.richTextRef.current.getDetail();

        const product = {name, desc, price, pCategoryId, categoryId, imgs, detail}

        // 如果是更新，需要添加_id
        if(this.isUpdate) {
            product._id = this.product._id;
        }
        
        // 2. 调用接口请求函数去添加/更新
        // reqAddOrUpdateProduct
        const result = await reqAddOrUpdateProduct(product);

        // 3. 根据结果提示
        if (result.status === 0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功！`)
            this.props.history.goBack(); // 返回上一个路由页面
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败！`)
        }
        // imgs 为数组 里面包含上传图片的名称
        // console.log('imgs', imgs);
        // console.log('文本框内容', detail);
        // alert('验证成功，发送数据成功')
    }

    /* 
    验证价格的自定义验证函数
    */
   validatePrice = (rule, value) => {
    //    console.log(rule, value, typeof value);
       if (value * 1 > 0) {
            //    验证通过 就会返回结果
            return Promise.resolve();
       }else {
            // 验证失败
            return Promise.reject('价格必须大于0');
       }
   }

   /* 
   用于加载下一级列表的回调函数
   */
   loadData = async selectedOptions => {
    //    得到选择的option对象   
    // 当前选中项的 
    const targetOption = selectedOptions[0];

    // 显示loading效果
    targetOption.loading = true;


    // 根据选中的分类，请求获取二级分类列表  value值中存的是 _id
    // 返回Promise对象，并且成功返回的值 为 二级列表数组
    const subCategorys = await this.getCategorys(targetOption.value);

    // 隐藏loading效果
    targetOption.loading = false;

    // 二级分类数组有数据才生成二级列表
    if(subCategorys && subCategorys.length > 0) {
        // 生成一个二级列表的options
        const childOptions = subCategorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: true, // 为叶子
        }))
        //  关联到当前option上
        targetOption.children = childOptions;
    } else { // 当前选中的分类没有二级分类
        targetOption.isLeaf = true
    }



    //   更新options状态
    this.setState({
        //   数组更新 利用 结构的方式
        options: [...this.state.options],
    });
  }

//   执行异步操作
  componentDidMount() {
      this.getCategorys('0');
  }

    UNSAFE_componentWillMount() {
        // 取出携带的state
        const product = memoryUtils.product; // 如果是添加 没有值， 否则有值
        console.log(product);
        // 保存是否是更新的标识 --> 强制转换为 布尔类型
        this.isUpdate = !!product._id // !! 两个 ！！ 强制转换为布尔类型
        // 保存商品(如果没有， 保存的是{} 避免报错)
        this.product = product || {}  // 空对象{} 可以用 .name等
    }

    /* 
    在卸载之前清除保存的数据
    */
    componentWillUnmount() {
        memoryUtils.product = {};
    }

    render() {

        const {isUpdate, product} = this
        // console.log(product);
        const {pCategoryId, categoryId, imgs, detail} = product;
        // 用来接收级联分类ID的数组
        const categoryIds = [] 

        // 如果当前是更新
        if(isUpdate) {
            // 情况一： 商品为一级分类的商品
            if(pCategoryId === '0') {
                categoryIds.push(categoryId)
            }else {
            // 情况二： 商品为二级级分类的商品
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
                // console.log(categoryIds);
            }
        }

        // 指定Item布局的配置对象
        const formItemLayout = {
            // 整个宽度为 24格
            labelCol: { span: 2 }, // 左侧label的宽度 
            wrapperCol: { span: 8 }, // 指定右侧包裹的宽度
          };

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{fontSize: 20}} />
                </LinkButton>
                <span style={{marginLeft: 10}}>{isUpdate ? '修改商品' : '添加商品' }</span>
            </span>
        )
        // 函数 中 利用 Form.useForm() 来 获取 form对象 并且在《Form组件中添加 form属性》
        // const [form] = Form.useForm();
        return(
            <Card title={title}>
                <Form {...formItemLayout}
                    initialValues={{ 
                        name: product.name,
                        desc: product.desc,
                        price: product.price,
                        categoryIds: categoryIds,
                     }}
                     onFinish={this.onFinish}
                >
                    <Item 
                        label="商品名称:" 
                        name="name" 
                        rules={[
                            {required: true, message: '必须输入商品名称'}
                        ]}
                    >
                        <Input placeholder='请输入商品名称' />  
                    </Item>
                    <Item 
                        label="商品描述:"
                        name="desc"
                        rules={[
                            {required: true, message: '必须输入商品描述'}
                        ]}
                    >
                        <TextArea 
                            placeholder="请输入商品描述"
                            autoSize={{ minRows: 2, maxRows: 6 }} // 最小为 2 行 最大为 6 行
                        />
                    </Item>
                    <Item label="商品价格:"
                        name="price"
                        rules={[
                            {required: true, message: '必须输入商品价格,价格必须大于0'},
                            {validator: this.validatePrice}
                        ]}
                        validateFirst={true}
                    >
                        {/* <Input type='number' placeholder='请输入商品价格'  prefix="￥" suffix="元" /> 
                            addonAfter="元"
                        */}
                        <Input type='number' placeholder='请输入商品价格' addonAfter="元"  /> 
                    </Item>
                    <Item 
                        label="商品分类:"
                        name="categoryIds"
                        // 收集的数据 是一个数组
                        rules={[
                            {required: true, message: '必须指定商品分类'}
                        ]}
                    >
                        <Cascader
                            placeholder="请指定商品分类"
                            options={this.state.options}  // 需要显示的列表数据数组
                            loadData={this.loadData}  /* 当选择某个列表项， 加载下一级列表的监听回调 */
                            // onChange={this.onChange}
                            // changeOnSelect
                        />
                    </Item>
                    <Item name="pictures" label="商品图片:">
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label="商品详情:"  labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.richTextRef} detail={detail} />
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}



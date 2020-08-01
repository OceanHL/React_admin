import React,{Component} from 'react';
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message
} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api';
import { PAGE_SIZE } from '../../utils/constants';
/* 
Product的默认子路由组件
*/

const { Option } = Select;
  
  

export default class ProductHome extends Component {
    state = {
        total: 0, // 商品的总数量
        products: [], // 商品的数组
        loading: false, // 是否正在加载中
        searchName: '', // 搜索的关键字
        searchType: 'productName', // 根据 那个 字段搜索
        status: false,
    }
    /* 
    初始化 table 的列的数组
     */
    initColumns = () => {
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
            //   回调函数中 需要传递 一个 数据对象 里面填price 说明 与 price数据相关
              render: (price) => '￥' + price // 当前指定了对应的属性，传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                //   回调函数中 需要传递 一个 数据对象 里面填price 说明 与 price数据相关
                render: (product) => {
                    const {_id, status} = product;
                    const newStatus = status === 1 ? 2 : 1;
                    return (
                        <span>
                            <Button 
                                type="primary" 
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >
                                {status===1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已销售'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                //   回调函数中 需要传递 一个 数据对象 里面填price 说明 与 price数据相关
                render: (product) => { // 传递的是 当前 选择行的 数据源数组 里面 有很多属性
                    return (
                        <span>
                            {/* 将product对象使用state传递给目标路由组件 */}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
          ];
    }

    

    /* 
    获取指定页码的列表数据显示
    */
   getProducts = async (pageNum) => {

    this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到 页码
    // 显示loading
    this.setState({loading: true})  

    const {searchName, searchType} = this.state;
    // 如果搜索关键字有值 ， 说明我们要做搜索分页
    let result;
    if(searchName) {
        result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        // result.then(response => console.log(response))
        // result = new Promise((resolve, reject) => {
        //     promise.then(response => {
        //         resolve(response)
        //     })
        // })
        // console.log(result);
    } else { // 一般分页请求
        result = await reqProducts(pageNum, PAGE_SIZE);
    }
   
    // 隐藏sloading
    this.setState({loading: false})  

    //  2.请求成功
    if(result.status === 0) { // 请求成功
        // 取出分页数据，更新状态，显示分页列表
        const {total, list} = result.data;
        console.log(total, list);

        // 更新状态
        this.setState({
            total,
            products: list
        })
    }
   }

   /* 
   更新指定商品的状态
   */

   updateStatus = async (parentId, newState) => {
    const result = await reqUpdateStatus(parentId, newState);
    if(result.status === 0) {
        message.success('更新商品成功')
        // 从新更新商品列表
        this.getProducts(this.pageNum);
    }
   }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        // 默认获取 第一页
        this.getProducts(1)
    }
    
    render() {

        // 取出状态数据
        const {products, total, loading, searchName, searchType} = this.state;


        const title = (
            <span>
                <Select defaultValue={searchType} style={{width: 150}} 
                    onChange={ value => {
                        // console.log(value); 
                        this.setState({searchType: value})}}
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input value={searchName} onChange={ e => this.setState({searchName: e.target.value})} placeholder='关键字' style={{width: 150, margin: '0 15px'}} />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {this.props.history.push('/product/addupdate')}} >添加商品</Button>
        )

        return(
            <Card title={title} extra={extra}>
                <Table
                    // 将数据中的_id 作为每列的key
                    rowKey='_id'
                    // 加载loading 利用 state 来设置
                    loading={loading}
                    // 显示的数据
                    dataSource={products}
                    // 每列的显示
                    columns={this.columns}
                    bordered={true}
                    pagination={{
                        // 当前页数
                        current: this.pageNum,
                        // 总记录数
                        total,
                        // // 默认当前页
                        // defaultCurrent: 1,

                        // 默认每页显示 3 条数据
                        defaultPageSize: PAGE_SIZE,

                        // 是否可以快速跳转至某页
                        showQuickJumper: true,
                        // onChange 传递的实参 就是 this.getProducts 接收的参数
                        // function(page, pageSize)
                        // onChange: (pageNum) => {this.getProducts(pageNum)}

                        // 当换页的时候触发回调函数 --> 或默认帮我们传递 页码号, 每页多少条数据
                        
                        onChange: this.getProducts // onChange传递的实参 就是 this.getProducts() 接收的参数
                    }}
                >
                    

                </Table>
            </Card>
        )
    }
}
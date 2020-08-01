import React,{Component} from 'react';
import {
    Card,
    List,
    Typography,
    // Divider 分割线 里面有文字

} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {BASE_IMG_URL}  from '../../utils/constants.js';
import {reqCategory} from '../../api';
/* 
Product的详情子路由组件
*/
const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];
const Item = List.Item;
export default class ProductDetail extends Component {

    state = {
        cName1: '', // 一级分类名称
        cName2: '', // 二级分类名称
    }

    // 就算是生命周期函数 也需要 加async
    async componentDidMount() {
        // 得到当前商品的分类ID
        const {pCategoryId, categoryId} = this.props.location.state
        if(categoryId === '0') { // 一级分类下的商品
            const result = await reqCategory(pCategoryId)
            const cName1 = result.data.name;
            this.setState({
                cName1
            })
        } else { // 二级分类下的商品
            /*
            通过多个await方式发多个请求：后面一个请求是在前一个请求成功返回之后才发送  一个一个发送请求 效率特别低
            */
            // const result1 = await reqCategory(pCategoryId); // 获取哦一级分类
            // const result2 = await reqCategory(categoryId);  // 获取二级分类
            // const cName1 = result1.data.name;
            // const cName2 = result2.data.name;


            /* 一次性发生多个请求，只有都成功了， 才正常处理 返回数据数组 */
            const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            const cName1 = results[0].data.name;
            const cName2 = results[1].data.name;
            this.setState({
                cName1,
                cName2
            })
        }

    }

    render() {

        // 读取携带过来的state数据
        console.log(this.props.location.state);
        const {name,desc,price,_id, categoryId, pCategoryId, imgs, detail} = this.props.location.state;
        const {cName1, cName2} = this.state;

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined style={{fontSize: 20}} onClick={() => this.props.history.goBack()} />
                </LinkButton>
                <span style={{marginLeft: 15, fontSize: 20}}>商品详情</span>
            </span>
        )
        return(
            <Card title={title} className='product-detail'>
                {/* <Divider orientation="left">Default Size</Divider> */}
                <List
                    // header={<div>Header</div>}
                    // footer={<div>Footer</div>}
                    bordered
                    dataSource={data}
                    // renderItem={item => (
                    //     <List.Item>
                    //     <Typography.Text mark>商品名称</Typography.Text> {item}
                    //     </List.Item>
                    // )}
                >
                    <Item>
                        <span>
                            <span className="left">商品名称:</span>
                            <span style={{marginLeft:20}}>{name}</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品描述:</span>
                            <span style={{marginLeft: 20}}>{desc}</span>
                        </span>
                      
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品价格:</span>
                            <span style={{marginLeft: 20}}>{price}元</span>
                        </span>
                        
                    </Item>
                    <Item>
                        <span>
                            <span className="left">所属分类:</span>
                            <span style={{marginLeft: 20}}>{cName1}{cName2 ? ' ---> ' + cName2 : ''}</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品图片:</span>
                            <span  style={{marginLeft: 20}}>
                                {
                                    // imgs里面存的就是 图片的名字 ["image-1594893763664.jpg", "image-1594893767874.png"]
                                    imgs.map((img, index) => (  // 返回的是一个标签
                                        // src 里面 是 图片的访问地址 http://localhost:5000/upload/
                                        <img key={index} src={BASE_IMG_URL + img} alt="img" className="product-img" />
                                    ))
                                }
                            </span>
                        </span>
                    </Item>
                    <Item>
                       <span>
                            <span className="left">商品详情:</span>
                            <span dangerouslySetInnerHTML={{__html: detail}}   style={{marginLeft: 20}} ></span>
                       </span>
                    </Item>
                </List>
            </Card>
        )
    }
}
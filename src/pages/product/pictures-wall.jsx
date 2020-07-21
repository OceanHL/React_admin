import React from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqDeleteImg} from '../../api';
import PropTypes from 'prop-types';
import {BASE_IMG_URL} from '../../utils/constants'
/* 
用于图片上传的组件
*/

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

  static propTypes = {
    // 接收的参数名字： 参数类型
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false, // 标识是否显示大图预览Model
    previewImage: '',  // 大图的 Url 地址
    previewTitle: '',
    fileList: [
    //   {
    //     uid: '-1', // 每个file 都有 自己唯一的id 设置为负数
    //     name: 'image.png', // 图片文件名
    //     status: 'done', // 图片状态：done- 已上传  uploading=》正在上传中 done   error   removed--》已删除
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
    //   },
    //   {
    //     uid: '-2',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    //   {
    //     uid: '-3',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    //   {
    //     uid: '-4',
    //     name: 'image.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    //   {
    //     uid: '-5',
    //     name: 'image.png',
    //     status: 'error',
    //   },
    ],
  };

  constructor(props) {
    super(props);
    
    let fileList = [];

    // 如果传入了imgs属性 并且 里面有数据 则为 修改页面
    const {imgs} = this.props;  //  get 到的 数据 一般为 const 常量不变
    if(imgs && imgs.length > 0){
      fileList = imgs.map((img, index) => ({ // fileList 为数组 里面 放一个个的对象
        uid: -index, // 每个file都有自己唯一的id
        name: img, // 图片文件名 为 当前的 图片名字
        status: 'done',
        url: BASE_IMG_URL + img,
      }))
    }

    // 初始化状态
    this.state = {
      previewVisible: false, // 标识是否显示大图预览Model
      previewImage: '',  // 大图的 Url 地址
      previewTitle: '',
      fileList  // 所有以上传的图片数组
    }
  }


  /* 
  获取所有已上传图片文件名的数组
  */
  getImgs = () => {
    //   返回的是 图片文件名的数组  .map 返回的是 一个新数组 数组里面 包含图片的名字
    return this.state.fileList.map(file => file.name)
  }

  /* 
  隐藏Model 点击取消 或则 灰色层
  */
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    //  file 为 文件的 id
    console.log('handlePreview()的', file);
    if (!file.url && !file.preview) { // file文件图片的 utl为空时 并且 preview为空时 去服务器 请求图片
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true, // 大图片显示
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1), // 大图片的标题显示
    });
  };

  /*
  file: 当前操作的图片文件（上传/删除）
  fileList： 所有已上传完成的图片文件对象的数组
  */
  handleChange = async ({file, fileList }) => {
    console.log('handleChange()', file.status, fileList.length, file === fileList[fileList.length-1]);

    // 一旦上传成功，将当前上传的file的信息修正（name, url）
    if(file.status === 'done') { // done 为上传成功
        const result = file.response // 服务器返回的数据 ｛status：0， data: {name: 'xxx.jpg', url: '图片地址'}｝
        if(result.status === 0) {
            message.success('图片上传成功');
            // console.log('前面的file', file);
            console.log(fileList);
            // fileList数组中的 文件名称 和 URL 是 服务器返回来的 值
            const {name, url} = result.data; // 名字 和 请求接口
            // 这一步 为了操作统一对象
            file = fileList[fileList.length-1]; // file 和 fileList是两个不同的对象 但是内容都是一样的
            // 将当前 文件 的 名字 和 url 与 服务器返回的一致
            file.name = name;
            file.url = url ;
            // console.log(file);
        } else {
            message.error('上传图片失败');
        }
    } else if (file.status === 'removed') { // 删除图片
      // 删除服务器上的图片
      // console.log(file);
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success('删除图片成功!');
      }else {
        message.error('删除图片失败!');
      }
    }


    // 在操作（上传/删除）过程中更新fileList状态
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
        // 1. 上传的接口地址  利用 代理服务器 帮助我们转发
        // 自动帮助我们上传到服务器
          action="/manage/img/upload"
          name='image' // 2、 请求参数名 必须指定

          accept={"image/*, .pdf"} // 接受的上传文件类型 为 图片类型
          listType="picture-card"  // 卡片样式
          fileList={fileList}  // 所有已上传图片文件对象的数组
          onPreview={this.handlePreview} // 显示大图片 的监听函数
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
/* 
1. 子组件调用父组件的方法： 将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
2. 父组件调用子组件的方法：
*/
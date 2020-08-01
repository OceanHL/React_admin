/*
用来指定商品详情的富文本编辑器组件
*/

import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; // 必须进行引入样式


export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string // 有可能是添加 不一定传递
    }
  

  constructor(props) {
    super(props);
    const html = this.props.detail;
    if(html) { // 如果有值，根据html格式字符串创建一个对应的编辑对象
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
            editorState,
            };
        }
    } else {
        this.state = {
            editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
        }
    }
  }
  /* 
  输入过程中实时地回调  传入 最新的 状态
  */
  onEditorStateChange = (editorState) => {
      console.log('onEditorStateChange()');
    this.setState({ // 存储最新的状态
      editorState,
    });
  };

//   父组件 想获取 子组件的 数据 利用函数包装 将子组件的数据 传递给 父组件
  getDetail = () => {
    //   返回输入数据对应的html格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        // 上传的方法 和 上传的地址
        xhr.open('POST', '/manage/img/upload');
        // 设置请求头
        // xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        // 上传的 参数名  和  文件
        data.append('image', file);
        // 发送数据
        xhr.send(data);
        // 添加监听事件  上传成功 和 上传失败
        xhr.addEventListener('load', () => {
            // parse 将json 字符串 转换为 对象
          const response = JSON.parse(xhr.responseText); // 返回的 对象
        //   console.log(response);
          const url = response.data.url; // 得到图片的url 
          resolve({data: {link: url}})
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }
  render() {
    const { editorState } = this.state;
    return (
        // <div>
            <Editor
                editorState={editorState} // 传入编辑状态对象
                editorStyle={{border:'1px solid black', minHeight: 200, padding: '0 10px'}}
                //   方法一：通过类名写样式
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                toolbarClassName="toolbar-class"
                //   方法二： 通过样式写样式
                //   wrapperStyle={<wrapperStyleObject />}
                //   editorStyle={<editorStyleObject />}
                //   toolbarStyle={<toolbarStyleObject />}
                onEditorStateChange={this.onEditorStateChange} // 绑定监听
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: { 
                        urlEnabled: true,
                        uploadEnabled: true,
                        alignmentEnabled: true,   // 是否显示排列按钮 相当于text-align
                        uploadCallback: this.uploadImageCallBack,  // 上传的回调函数
                        previewImage: true, // 在小框框里面 显示图片
                        inputAccept: 'image/*',
                        alt: { present: true, mandatory: true } },
                  }}
            />
            /* <textarea
                disabled
                value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            />  */
        /* </div> */
    );
  }
}
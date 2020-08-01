import React from 'react';
import './not-found.less';
import { Row, Col, Button } from 'antd';
import {connect} from 'react-redux';
import {setHeadTitle} from '../../redux/actions';
/* 
前台404页面 
*/
class NotFound extends React.Component {

    goHome = () => {
        this.props.setHeadTitle('首页');
        this.props.history.replace('/home');
    }
    render () {
        this.props.setHeadTitle('404页面');
        return (
            <Row className="not-found">
                <Col span={12} className="left"></Col>
                <Col span={12} className="right">
                    <h1>404</h1>
                    <h2>抱歉、您访问的页面不存在</h2>
                    <div>
                        <Button type="primary" onClick={this.goHome}>
                            回到首页
                        </Button>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default connect(
    state => ({}),
    {setHeadTitle}
)(NotFound)
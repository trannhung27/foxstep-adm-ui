import './home.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row, Space } from 'antd';

import { Link } from 'react-router-dom';

import config, { SERVER_API_URL } from 'app/config/constants';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const { account } = props;
  return (
    <Row>
      <Col span={12} className="pad">
        <span className="runner rounded" />
      </Col>
      <Col span={12}>
        <h2>Hệ thống quản trị FoxSteps</h2>
        <p className="lead">Version: {config.VERSION}</p>
        <p className="lead">Server: {SERVER_API_URL}</p>
        {account && account.login ? (
          <div>
            <Alert type="success" message={'Xin chào ' + account.login + '.'} />
          </div>
        ) : (
          <div>
            <Alert
              type="warning"
              message="Đăng nhập bằng tài khoản: admin/admin hoặc user/user"
              action={
                <Space>
                  <Link to="/login">Đăng nhập</Link>
                </Space>
              }
            />

            <Alert
              type="warning"
              message="Đăng ký tài khoản mới"
              action={
                <Space>
                  <Link to="/register">Đăng ký</Link>
                </Space>
              }
            />
          </div>
        )}
      </Col>
    </Row>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);

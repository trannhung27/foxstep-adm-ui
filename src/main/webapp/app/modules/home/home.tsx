import './home.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row } from 'antd';

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
        <div>
          <Alert type="success" message={'Xin chào ' + account.firstName || account.login + '.'} />
        </div>
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

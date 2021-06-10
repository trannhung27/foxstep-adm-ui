import './home.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row, Space } from 'antd';

import { Link } from 'react-router-dom';

import { SERVER_API_URL } from 'app/config/constants';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const { account } = props;
  return (
    <Row>
      <Col span={12} className="pad">
        <span className="hipster rounded" />
      </Col>
      <Col span={12}>
        <h2>Welcome, Java Hipster!</h2>
        <p className="lead">This is your homepage</p>
        {account && account.login ? (
          <div>
            <Alert type="success" message={'You are logged in as ' + account.firstName + '.'} />
          </div>
        ) : (
          <div>
            <Alert
              type="warning"
              message="Sign in with default accounts: admin/admin / user/user"
              action={
                <Space>
                  <Link to="/login">Sign in</Link>
                </Space>
              }
            />

            <Alert
              type="warning"
              message="Register a new account"
              action={
                <Space>
                  <Link to="/account/register">Sign up</Link>
                </Space>
              }
            />
          </div>
        )}
        <p>If you have any question on JHipster:</p>

        <ul>
          <li>
            <a href="https://www.jhipster.tech/" target="_blank" rel="noopener noreferrer">
              JHipster homepage
            </a>
          </li>
          <li>
            <a href="http://stackoverflow.com/tags/jhipster/info" target="_blank" rel="noopener noreferrer">
              JHipster on Stack Overflow
            </a>
          </li>
          <li>
            <a href="https://github.com/jhipster/generator-jhipster/issues?state=open" target="_blank" rel="noopener noreferrer">
              JHipster bug tracker
            </a>
          </li>
          <li>
            <a href="https://gitter.im/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">
              JHipster public chat room
            </a>
          </li>
          <li>
            <a href="https://twitter.com/jhipster" target="_blank" rel="noopener noreferrer">
              follow @jhipster on Twitter
            </a>
          </li>
        </ul>

        <p>
          If you like JHipster, do not forget to give us a star on{' '}
          <a href="https://github.com/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          !
        </p>
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

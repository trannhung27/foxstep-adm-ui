import './header.scss';

import React from 'react';

import { AccountMenu } from './account';

import { Badge, Col, Layout, Popover, Row } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { LoadingBar } from 'react-redux-loading-bar';

export interface IHeaderProps {
  isAuthenticated: boolean;
  username: string;
}
const { Header } = Layout;

const LayoutHeader = (props: IHeaderProps) => {
  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */
  return (
    <Header style={{ background: '#fff', textAlign: 'right' }}>
      <Row justify="end" align="top">
        {/*<Col span={1} style={{marginRight: '10px'}}>*/}
        {/*  <Popover content="Developing..." title="Notifications" trigger="click">*/}
        {/*    <Badge className="header-icon" dot>*/}
        {/*      <a href="#">*/}
        {/*        <NotificationOutlined/>*/}
        {/*      </a>*/}
        {/*    </Badge>*/}
        {/*  </Popover>*/}
        {/*</Col>*/}
        <Col span={2}>
          <AccountMenu name={props.username ? props.username : 'Account'} isAuthenticated={props.isAuthenticated} />
        </Col>
      </Row>
    </Header>
  );
};

export default LayoutHeader;

import './sidebar.scss';

import React from 'react';

import appConfig from 'app/config/constants';
import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/foxstep-logo.png" alt="Logo" />
  </div>
);

export const Brand = props => (
  <Row justify="space-between" align="middle" className="brand">
    <Col span={props.expanded ? 6 : 24} className="text-center">
      <BrandIcon />
    </Col>
    {props.expanded && (
      <Col span={18} className="text-left">
        <span className="brand-title">Foxsteps Admin</span>
        <span className="navbar-version">{appConfig.VERSION}</span>
      </Col>
    )}
  </Row>
);

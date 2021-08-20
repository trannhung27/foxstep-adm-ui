import './sidebar.scss';

import React from 'react';
import { Col, Row } from 'antd';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/foxstep-logo.png" alt="Logo" />
  </div>
);

export const Brand = props => (
  <Row justify="space-between" align="middle" className="brand">
    <Col span={props.expanded ? 8 : 24} className="text-center">
      <BrandIcon />
    </Col>
    {props.expanded && (
      <Col span={16} className="text-left">
        <span className="brand-title">FoxSteps Admin</span>
      </Col>
    )}
  </Row>
);

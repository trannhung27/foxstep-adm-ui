import './sidebar.scss'

import React from 'react';

import appConfig from 'app/config/constants';
import {Col, Row} from "antd";
import {Link} from 'react-router-dom';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/logo-jhipster.png" alt="Logo"/>
  </div>
);

export const Brand = props => (
    <Row justify="space-between" align="middle" className="brand">
      <Col span={(props.expanded) ? 6 : 24}><BrandIcon/></Col>
      {props.expanded &&
      <Col span={18}>
        <span className="brand-title">FOXSTEP2 ADMIN</span>
        <span className="navbar-version">{appConfig.VERSION}</span>
      </Col>
      }
    </Row>
);

import './header.scss';

import React from 'react';
import {Avatar, Dropdown, Menu} from 'antd'
import {Link} from "react-router-dom";
import {FormOutlined, LockOutlined, LoginOutlined, LogoutOutlined, SettingOutlined} from "@ant-design/icons";

const accountMenuItemsAuthenticated = (
  <Menu>
    <Menu.Item icon={<SettingOutlined/>}>
      <Link to="/account/settings">
        Settings
      </Link>
    </Menu.Item>
    <Menu.Item icon={<LockOutlined/>}>
      <Link to="/account/password">
        Password
      </Link>
    </Menu.Item>
    <Menu.Item icon={<LogoutOutlined/>}>
      <Link to="/logout">
        Sign out
      </Link>
    </Menu.Item>
  </Menu>
);

const accountMenuItems = (
  <Menu>
    <Menu.Item icon={<LoginOutlined/>}>
      <Link to="/login">
        Sign in
      </Link>
    </Menu.Item>
    <Menu.Item icon={<FormOutlined/>}>
      <Link to="/register">
        Register
      </Link>
    </Menu.Item>
  </Menu>
);

export const AccountMenu = ({isAuthenticated = false, name = 'Account'}) =>
  (
    <Dropdown overlay={isAuthenticated ? accountMenuItemsAuthenticated : accountMenuItems}>
      <a style={{textDecoration: "none"}}>
        <Avatar shape="square" style={{backgroundColor: 'orange'}}>
          {name}
        </Avatar>
      </a>
    </Dropdown>
  );

export default AccountMenu;
